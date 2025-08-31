export interface PageLocation {
  index: number;
  href: string;
  pages: number[];
  totalPages: number;
  mapping:
    | {
        start: string;
        end: string;
      }
    | undefined;
}

import EventEmitter from 'event-emitter';
import { extend, defer, windowBounds, isNumber } from '../../utils/core';
import scrollType from '../../utils/scrolltype';
import Mapping from '../../mapping';
import Queue from '../../utils/queue';
import Stage from '../helpers/stage';
import Views, { View, ViewConstructor } from '../helpers/views';
import { EVENTS } from '../../utils/constants';
import { ViewManager } from '../helpers/snap';
import Layout, { Axis, Flow } from 'src/layout';
import { Section } from 'src/section';
import { Contents } from 'src/epub';
import IframeView from '../views/iframe';
import BookPreRenderer, {
  PreRenderedChapter,
  ViewSettings,
} from '../prerenderer';

export type DefaultViewManagerSettings = {
  layout: Layout;
  infinite?: boolean;
  hidden?: boolean;
  width?: number;
  height?: number;
  axis?: Axis;
  writingMode?: string;
  direction?: string;
  gap?: number;
  offset?: number;
  overflow?: string;
  afterScrolledTimeout: number;
  usePreRendering?: boolean;
  [key: string]: unknown;
};

type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off'>;

class DefaultViewManager implements ViewManager, EventEmitterMethods {
  on!: EventEmitter['on'];
  off!: EventEmitter['off'];
  emit!: EventEmitter['emit'];

  settings: DefaultViewManagerSettings;
  viewSettings: { [key: string]: unknown };
  stage!: Stage;
  name = 'default';
  rendered: boolean = false;
  optsSettings: DefaultViewManagerSettings;
  View?: ViewConstructor | View;
  request: ((url: string) => Promise<Document>) | undefined;
  renditionQueue!: unknown;
  q!: Queue;
  layout!: Layout;
  isPaginated!: boolean;
  views!: Views;
  container!: HTMLElement;
  overflow!: string;
  _onScroll?: () => void;
  scrollLeft?: number;
  _stageSize?: { width: number; height: number };
  _bounds!:
    | { left: number; top: number; right: number; bottom: number }
    | DOMRect;

  winBounds:
    | {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
      }
    | DOMRect
    | undefined;

  location!: PageLocation[];

  mapping: Mapping | undefined;

  writingMode: string | undefined;
  scrollTop: number | undefined;

  orientationTimeout: NodeJS.Timeout | undefined;
  resizeTimeout: NodeJS.Timeout | undefined;
  afterScrolled: NodeJS.Timeout | undefined;

  ignore!: boolean;
  scrolled!: boolean;
  targetScrollLeft?: number;

  // Pre-renderer for managing off-screen chapters
  preRenderer?: BookPreRenderer;
  usePreRendering: boolean = true;

  constructor(options: {
    settings: DefaultViewManagerSettings;
    view?: View | undefined;
    request?: (url: string) => Promise<Document>;
    queue?: unknown;
    [key: string]: unknown;
  }) {
    this.optsSettings = options.settings;
    this.View = options.view;
    this.request = options.request;
    this.renditionQueue = options.queue;
    this.q = new Queue(this);

    // Set usePreRendering from settings (default false for safety)
    this.usePreRendering = options.settings.usePreRendering === true;

    console.log(
      '[DefaultViewManager] constructor - usePreRendering setting:',
      this.usePreRendering
    );
    console.log(
      '[DefaultViewManager] constructor - settings:',
      options.settings
    );

    this.settings = {
      infinite: true,
      hidden: false,
      width: undefined,
      height: undefined,
      axis: undefined,
      writingMode: undefined,
      flow: 'scrolled',
      ignoreClass: '',
      fullsize: undefined,
      allowScriptedContent: false,
      allowPopups: false,
      ...(options.settings || {}),
    };

    extend(this.settings, options.settings || {});

    this.viewSettings = {
      ignoreClass: this.settings.ignoreClass,
      axis: this.settings.axis,
      flow: this.settings.flow,
      layout: this.layout,
      method: this.settings.method, // srcdoc, blobUrl, write
      width: 0,
      height: 0,
      forceEvenPages: true,
      transparency: this.settings.transparency,
      allowScriptedContent: this.settings.allowScriptedContent,
      allowPopups: this.settings.allowPopups,
    };

    this.rendered = false;
  }

  render(element: HTMLElement, size?: { width: number; height: number }): void {
    console.log('[DefaultViewManager] render() method called');
    console.log(
      '[DefaultViewManager] render() usePreRendering:',
      this.usePreRendering
    );

    const tag = element.tagName;

    if (
      typeof this.settings.fullsize === 'undefined' &&
      tag &&
      (tag.toLowerCase() == 'body' || tag.toLowerCase() == 'html')
    ) {
      this.settings.fullsize = true;
    }

    if (this.settings.fullsize) {
      this.settings.overflow = 'visible';
      this.overflow = this.settings.overflow;
    }

    this.settings.size = size;

    this.settings.rtlScrollType = scrollType();

    // Save the stage
    this.stage = new Stage({
      width: size ? String(size.width) : undefined,
      height: size ? String(size.height) : undefined,
      overflow: this.overflow,
      hidden: this.settings.hidden,
      axis: this.settings.axis,
      fullsize: this.settings.fullsize,
      direction: this.settings.direction,
    });

    this.stage.attachTo(element);

    // Get this stage container div
    this.container = this.stage.getContainer();

    // Views array methods
    this.views = new Views(this.container);

    // Calculate Stage Size
    this._bounds = this.bounds();
    this._stageSize = this.stage.size();

    // Set the dimensions for views
    this.viewSettings.width = this._stageSize.width;
    this.viewSettings.height = this._stageSize.height;

    // Function to handle a resize event.
    // Will only attach if width and height are both fixed.
    this.stage.onResize(this.onResized.bind(this));

    this.stage.onOrientationChange(this.onOrientationChange.bind(this));

    // Add Event Listeners
    this.addEventListeners();

    // Add Layout method
    // this.applyLayoutMethod();
    if (this.layout) {
      this.updateLayout();
    }

    this.rendered = true;

    // Debug the pre-rendering state before attempting initialization
    console.log(
      '[DefaultViewManager] render() completed, checking pre-rendering...'
    );
    console.log(
      '[DefaultViewManager] this.usePreRendering:',
      this.usePreRendering
    );
    console.log(
      '[DefaultViewManager] typeof this.usePreRendering:',
      typeof this.usePreRendering
    );

    // Initialize pre-rendering if enabled
    if (this.usePreRendering) {
      console.log(
        '[DefaultViewManager] attempting to initialize pre-rendering...'
      );
      try {
        this.initializePreRendering();
      } catch (error) {
        console.error(
          '[DefaultViewManager] failed to initialize pre-rendering:',
          error
        );
        this.usePreRendering = false;
      }
    } else {
      console.log(
        '[DefaultViewManager] pre-rendering not enabled, skipping initialization'
      );
    }
  }

  private initializePreRendering(): void {
    console.debug('[DefaultViewManager] initializePreRendering called');
    console.debug('[DefaultViewManager] container exists:', !!this.container);

    if (!this.container) {
      console.warn(
        '[DefaultViewManager] no container available for pre-rendering'
      );
      return;
    }

    console.debug('[DefaultViewManager] viewSettings:', this.viewSettings);

    // Create proper ViewSettings from viewSettings
    const preRenderSettings: ViewSettings = {
      ignoreClass: (this.viewSettings.ignoreClass as string) || '',
      axis: this.viewSettings.axis as Axis,
      direction: this.viewSettings.direction as string,
      width: (this.viewSettings.width as number) || 800,
      height: (this.viewSettings.height as number) || 600,
      layout: this.viewSettings.layout as Layout,
      method: this.viewSettings.method as string,
      forceRight: (this.viewSettings.forceRight as boolean) || false,
      allowScriptedContent:
        (this.viewSettings.allowScriptedContent as boolean) || false,
      allowPopups: (this.viewSettings.allowPopups as boolean) || false,
      transparency: (this.viewSettings.transparency as boolean) || false,
      forceEvenPages: (this.viewSettings.forceEvenPages as boolean) || false,
      flow: this.viewSettings.flow as Flow,
    };

    console.debug(
      '[DefaultViewManager] creating BookPreRenderer with settings:',
      preRenderSettings
    );

    const requestFn: (url: string) => Promise<Document> =
      this.request || (() => Promise.reject(new Error('No request')));
    this.preRenderer = new BookPreRenderer(
      this.container,
      preRenderSettings,
      requestFn
    );

    console.debug(
      '[DefaultViewManager] pre-renderer created successfully:',
      !!this.preRenderer
    );
  }

  /**
   * Start pre-rendering all sections from a spine
   */
  async startPreRendering(sections: Section[]): Promise<void> {
    if (!this.preRenderer) {
      console.warn('[DefaultViewManager] preRenderer not initialized');
      return;
    }

    console.debug(
      '[DefaultViewManager] starting pre-render of',
      sections.length,
      'sections'
    );
    const status = await this.preRenderer.preRenderBook(sections);
    console.debug('[DefaultViewManager] pre-rendering complete:', status);

    this.emit(EVENTS.MANAGERS.ADDED, status);
  }

  /**
   * Get pre-rendered chapter for debugging
   */
  getPreRenderedChapter(sectionHref: string): PreRenderedChapter | undefined {
    return this.preRenderer?.getChapter(sectionHref);
  }

  /**
   * Check if a chapter is pre-rendered and ready
   */
  hasPreRenderedChapter(sectionHref: string): boolean {
    return !!this.preRenderer?.getChapter(sectionHref);
  }

  addEventListeners() {
    let scroller;

    window.addEventListener('unload', () => {
      this.destroy();
    });

    if (!this.settings.fullsize) {
      scroller = this.container;
    } else {
      scroller = window;
    }

    this._onScroll = this.onScroll.bind(this);
    scroller.addEventListener('scroll', this._onScroll);
  }

  removeEventListeners() {
    let scroller;

    if (!this.settings.fullsize) {
      scroller = this.container;
    } else {
      scroller = window;
    }

    scroller.removeEventListener('scroll', this._onScroll!);
    this._onScroll = undefined;
  }

  destroy() {
    clearTimeout(this.orientationTimeout);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.afterScrolled);

    this.clear();

    this.removeEventListeners();

    this.stage.destroy();

    // Clean up pre-renderer
    if (this.preRenderer) {
      this.preRenderer.destroy();
      this.preRenderer = undefined;
    }

    this.rendered = false;
  }

  onOrientationChange() {
    const { orientation } = window;

    if (this.optsSettings.resizeOnOrientationChange) {
      this.resize();
    }

    // Per ampproject:
    // In IOS 10.3, the measured size of an element is incorrect if the
    // element size depends on window size directly and the measurement
    // happens in window.resize event. Adding a timeout for correct
    // measurement. See https://github.com/ampproject/amphtml/issues/8479
    clearTimeout(this.orientationTimeout);
    this.orientationTimeout = setTimeout(() => {
      this.orientationTimeout = undefined;

      if (this.optsSettings.resizeOnOrientationChange) {
        this.resize();
      }

      this.emit(EVENTS.MANAGERS.ORIENTATION_CHANGE, orientation);
    }, 500);
  }

  onResized() {
    this.resize();
  }

  resize(width?: string, height?: string, epubcfi?: string) {
    const stageSize = this.stage.size(width, height);

    // For Safari, wait for orientation to catch up
    // if the window is a square
    this.winBounds = windowBounds();
    if (
      this.orientationTimeout &&
      this.winBounds.width === this.winBounds.height
    ) {
      // reset the stage size for next resize
      this._stageSize = undefined;
      return;
    }

    if (
      this._stageSize &&
      this._stageSize.width === stageSize.width &&
      this._stageSize.height === stageSize.height
    ) {
      // Size is the same, no need to resize
      return;
    }

    this._stageSize = stageSize;

    this._bounds = this.bounds();

    // Clear current views
    this.clear();

    // Update for new views
    this.viewSettings.width = this._stageSize.width;
    this.viewSettings.height = this._stageSize.height;

    this.updateLayout();

    this.emit(
      EVENTS.MANAGERS.RESIZED,
      {
        width: this._stageSize.width,
        height: this._stageSize.height,
      },
      epubcfi
    );
  }

  createView(section: Section, forceRight: boolean = false) {
    return new IframeView(section, extend(this.viewSettings, { forceRight }));
  }

  handleNextPrePaginated(
    forceRight: boolean,
    section: Section,
    action: (section: Section) => Promise<View>
  ) {
    const isPrePaginated = this.layout.name === 'pre-paginated';
    const hasMultiplePages = this.layout.divisor > 1;

    if (!isPrePaginated || !hasMultiplePages) {
      return;
    }

    // First page (cover) should stand alone
    if (forceRight || section.index === 0) {
      return;
    }

    const next = section.next();

    if (next && !next.properties.includes('page-spread-left')) {
      return action.call(this, next);
    }
  }

  display(section: Section, target?: HTMLElement | string) {
    const displaying = new defer();
    const displayed = displaying.promise;

    // Check if moving to target is needed
    if (target === section.href || isNumber(target)) {
      target = undefined;
    }

    // Try to use pre-rendered chapter first
    if (this.usePreRendering && this.preRenderer) {
      const preRenderedChapter = this.preRenderer.getChapter(section.href);
      if (preRenderedChapter) {
        console.debug(
          '[DefaultViewManager] using pre-rendered chapter:',
          section.href
        );
        return this.displayPreRendered(preRenderedChapter, target, displaying);
      } else {
        console.debug(
          '[DefaultViewManager] no pre-rendered chapter found for:',
          section.href,
          'falling back to normal rendering'
        );
      }
    }

    // Fallback to normal rendering
    this.displaySection(section, target, displaying);
    return displayed;
  }

  /**
   * Display a pre-rendered chapter
   */
  private displayPreRendered(
    chapter: PreRenderedChapter,
    target?: HTMLElement | string,
    displaying?: defer<unknown>
  ): Promise<unknown> {
    const deferred = displaying || new defer();

    console.debug(
      '[DefaultViewManager] displaying pre-rendered chapter:',
      chapter.section.href,
      'with target:',
      target
    );

    // Wait for chapter to be fully rendered
    chapter.rendered.promise
      .then(() => {
        try {
          // Save current scroll position, but only preserve it if staying in the same chapter
          const currentScrollLeft = this.scrollLeft || 0;
          const isNewChapter = !this.views.find(chapter.section);

          console.debug(
            '[DefaultViewManager] chapter switch - isNewChapter:',
            isNewChapter,
            'currentScroll:',
            currentScrollLeft,
            'chapter:',
            chapter.section.href,
            'existing views:',
            this.views.length
          );

          // Clear current views first
          this.clear();

          // Verify the pre-renderer is still available
          if (!this.preRenderer) {
            throw new Error('Pre-renderer is no longer available');
          }

          // Attach the pre-rendered chapter to the main DOM
          const attachedChapter = this.preRenderer.attachChapter(
            chapter.section.href
          );

          if (!attachedChapter) {
            throw new Error(
              `Failed to attach pre-rendered chapter: ${chapter.section.href}`
            );
          }

          // Verify the view is in a good state
          if (!attachedChapter.view || !attachedChapter.element) {
            throw new Error(
              `Pre-rendered chapter view is invalid: ${chapter.section.href}`
            );
          }

          // Add the view to the views system
          // Note: We don't call display() again since it's already rendered
          this.views.append(attachedChapter.view);

          // Set up event handlers (same as in add() method)
          attachedChapter.view.onDisplayed = this.afterDisplayed.bind(this);
          attachedChapter.view.onResize = this.afterResized.bind(this);

          // Check if view has event methods before using them
          if (typeof attachedChapter.view.on === 'function') {
            attachedChapter.view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
              this.updateAxis(axis);
            });

            attachedChapter.view.on(
              EVENTS.VIEWS.WRITING_MODE,
              (mode: string) => {
                this.updateWritingMode(mode);
              }
            );
          } else {
            console.warn(
              '[DefaultViewManager] view does not have event methods:',
              typeof attachedChapter.view.on
            );
          }

          // Mark as displayed in the views system
          attachedChapter.view.displayed = true;

          // Show the views first
          this.views.show();

          // Respect target CFI if provided; otherwise start at the beginning
          try {
            if (target) {
              console.debug(
                '[DefaultViewManager] pre-rendered chapter - positioning to target:',
                target
              );
              const offset = attachedChapter.view.locationOf(target);
              const width = attachedChapter.view.width();
              this.moveTo(offset, width);
            } else {
              this.scrollTo(0, 0, true);
            }
          } catch (e) {
            console.warn(
              '[DefaultViewManager] failed to position to target for pre-rendered chapter, defaulting to start:',
              (e as Error).message
            );
            this.scrollTo(0, 0, true);
          }

          // Enhanced debugging for element attachment and iframe scroll state
          try {
            console.debug(
              '[DefaultViewManager] Element attachment debug info:',
              {
                href: chapter.section.href,
                elementScrollLeft: attachedChapter.element.scrollLeft,
                elementScrollTop: attachedChapter.element.scrollTop,
                elementClientWidth: attachedChapter.element.clientWidth,
                elementScrollWidth: attachedChapter.element.scrollWidth,
              }
            );

            // Check iframe content scroll state
            const iframe = attachedChapter.element.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
              console.debug('Iframe scroll debug info:', {
                href: chapter.section.href,
                iframeScrollX: iframe.contentWindow.scrollX,
                iframeScrollY: iframe.contentWindow.scrollY,
                iframeInnerWidth: iframe.contentWindow.innerWidth,
                iframeInnerHeight: iframe.contentWindow.innerHeight,
                iframeSrc: iframe.src,
                contentReady: iframe.contentDocument?.readyState,
              });

              // Check body scroll state in iframe
              const iframeBody = iframe.contentDocument?.body;
              if (iframeBody) {
                console.debug(
                  '[DefaultViewManager] Iframe body scroll debug info:',
                  {
                    href: chapter.section.href,
                    bodyScrollLeft: iframeBody.scrollLeft,
                    bodyScrollTop: iframeBody.scrollTop,
                    bodyScrollWidth: iframeBody.scrollWidth,
                    bodyScrollHeight: iframeBody.scrollHeight,
                    bodyClientWidth: iframeBody.clientWidth,
                    bodyClientHeight: iframeBody.clientHeight,
                  }
                );
              }
            }
          } catch (debugError) {
            console.warn(
              '[DefaultViewManager] Debug info collection failed:',
              debugError
            );
          }

          // Emit the displayed event
          this.emit(EVENTS.MANAGERS.ADDED, attachedChapter.view);

          console.debug(
            '[DefaultViewManager] pre-rendered chapter displayed successfully:',
            chapter.section.href
          );

          // If in pre-paginated spread mode, try to attach the neighbor (right page)
          try {
            const isPrePaginated = this.layout.name === 'pre-paginated';
            const hasMultiplePages = this.layout.divisor > 1;

            if (isPrePaginated && hasMultiplePages) {
              const currentSection = attachedChapter.section;
              const forceRight =
                currentSection.properties.includes('page-spread-right');

              // Mirror handleNextPrePaginated: skip if forced-right or first section
              if (!forceRight && currentSection.index !== 0) {
                const next = currentSection.next();
                if (next && !next.properties.includes('page-spread-left')) {
                  let neighborAdded = false;
                  if (this.preRenderer) {
                    const preNext = this.preRenderer.getChapter(next.href);
                    if (preNext) {
                      const attachedNext = this.preRenderer.attachChapter(
                        next.href
                      );
                      if (attachedNext && attachedNext.view) {
                        // Add to views without re-rendering
                        this.views.append(attachedNext.view);

                        // Wire events like the main view
                        attachedNext.view.onDisplayed =
                          this.afterDisplayed.bind(this);
                        attachedNext.view.onResize =
                          this.afterResized.bind(this);

                        if (typeof attachedNext.view.on === 'function') {
                          attachedNext.view.on(
                            EVENTS.VIEWS.AXIS,
                            (axis: Axis) => this.updateAxis(axis)
                          );
                          attachedNext.view.on(
                            EVENTS.VIEWS.WRITING_MODE,
                            (mode: string) => this.updateWritingMode(mode)
                          );
                        }

                        attachedNext.view.displayed = true;
                        neighborAdded = true;
                      }
                    }
                  }

                  // Fallback: load normally if not pre-rendered
                  if (!neighborAdded) {
                    this.append(next).catch((e: unknown) => {
                      console.warn(
                        '[DefaultViewManager] failed to append neighbor section normally:',
                        next.href,
                        e
                      );
                    });
                  }

                  // Ensure both are visible
                  this.views.show();
                }
              }
            }
          } catch (neighborError) {
            console.warn(
              '[DefaultViewManager] spread neighbor attachment failed:',
              neighborError
            );
          }

          deferred.resolve(undefined);
        } catch (displayError) {
          console.error(
            '[DefaultViewManager] error during pre-rendered chapter display:',
            chapter.section.href,
            displayError
          );
          throw displayError;
        }
      })
      .catch((error: Error) => {
        console.error(
          '[DefaultViewManager] failed to display pre-rendered chapter:',
          chapter.section.href,
          error
        );

        // Fallback to normal rendering on error
        console.debug('[DefaultViewManager] falling back to normal rendering');
        this.displayNormally(chapter.section, target, deferred);
      });

    return deferred.promise;
  }

  /**
   * Fallback to normal rendering when pre-rendered fails
   */
  private displayNormally(
    section: Section,
    target?: HTMLElement | string,
    displaying?: defer<unknown>
  ): void {
    const deferred = displaying || new defer();

    // Use the original display logic
    this.displaySection(section, target, deferred);
  }

  /**
   * Original display logic extracted for reuse
   */
  private displaySection(
    section: Section,
    target?: HTMLElement | string,
    displaying?: defer<unknown>
  ): void {
    const deferred = displaying || new defer();

    // Check to make sure the section we want isn't already shown
    const visible = this.views.find(section);

    // View is already shown, just move to correct location in view
    if (visible && section && this.layout.name !== 'pre-paginated') {
      const offset = visible.offset();

      if (this.settings.direction === 'ltr') {
        this.scrollTo(offset.left, offset.top, true);
      } else {
        const width = visible.width();
        this.scrollTo(offset.left + width, offset.top, true);
      }

      if (target) {
        const offset = visible.locationOf(target);
        const width = visible.width();
        this.moveTo(offset, width);
      }

      deferred.resolve(undefined);
      return;
    }

    // Hide all current views
    this.clear();

    let forceRight = false;

    if (
      this.layout.name === 'pre-paginated' &&
      this.layout.divisor === 2 &&
      section.properties.includes('page-spread-right')
    ) {
      forceRight = true;
    }

    this.add(section, forceRight)
      .then(
        (view: View) => {
          // Move to correct place within the section, if needed
          if (target) {
            const offset = view.locationOf(target);
            const width = view.width();
            this.moveTo(offset, width);
          }
        },
        (err: Error) => {
          deferred.reject(err);
        }
      )
      .then(() => {
        return this.handleNextPrePaginated(forceRight, section, this.add);
      })
      .then(() => {
        this.views.show();
        deferred.resolve(undefined);
      })
      .catch((err) => {
        deferred.reject(err);
      });
  }

  afterDisplayed(view: View) {
    console.debug(
      '[DefaultViewManager] afterDisplayed called for view:',
      view.section?.href
    );

    // Fix: Ensure container scrollWidth can accommodate content width
    if (view && view.contents) {
      const contentWidth = view.contents.textWidth();
      console.debug(
        '[DefaultViewManager] afterDisplayed content width:',
        contentWidth
      );

      if (contentWidth > this.container.offsetWidth) {
        console.debug(
          '[DefaultViewManager] updating phantom element for chapter content width:',
          contentWidth
        );

        // Create/update phantom element to match current chapter's content width
        let phantomElement = this.container.querySelector(
          '.epub-scroll-phantom'
        ) as HTMLElement;

        if (!phantomElement) {
          phantomElement = document.createElement('div');
          phantomElement.className = 'epub-scroll-phantom';
          phantomElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            height: 1px;
            pointer-events: none;
            visibility: hidden;
            z-index: -1000;
          `;
          this.container.appendChild(phantomElement);
        }

        // Fix: Ensure phantom width is set correctly and consistently
        const safeContentWidth = Math.max(contentWidth, this.layout.width);
        phantomElement.style.width = safeContentWidth + 'px';

        // Force a reflow to ensure the phantom element takes effect
        void phantomElement.offsetWidth;

        console.debug(
          '[DefaultViewManager] afterDisplayed container now scrollWidth:',
          this.container.scrollWidth,
          'phantom width:',
          phantomElement.offsetWidth
        );

        // Fix: Ensure view and iframe dimensions are consistent
        const element = view.element as HTMLElement;
        if (element) {
          element.style.width = safeContentWidth + 'px';
          element.style.left = '0px';

          // Fix: Also resize the iframe inside the view element
          const iframe = element.querySelector('iframe') as HTMLIFrameElement;
          if (iframe) {
            iframe.style.width = safeContentWidth + 'px';

            // Fix: Ensure iframe positioning is correct for the content
            iframe.style.left = '0px';
            iframe.style.position = 'absolute';

            console.debug(
              '[DefaultViewManager] resized iframe to match content width:',
              safeContentWidth
            );
          }
        }

        // Fix: Validate that scroll calculations are correct
        const maxScrollLeft = Math.max(
          0,
          this.container.scrollWidth - this.container.offsetWidth
        );
        if (this.container.scrollLeft > maxScrollLeft) {
          console.warn(
            '[DefaultViewManager] afterDisplayed: scroll position exceeds content bounds, adjusting:',
            this.container.scrollLeft,
            '->',
            maxScrollLeft
          );
          this.container.scrollLeft = maxScrollLeft;
        }
      }
    }

    this.emit(EVENTS.MANAGERS.ADDED, view);
  }

  afterResized(view: View) {
    this.emit(EVENTS.MANAGERS.RESIZE, view.section);
  }

  async add(section: Section, forceRight: boolean = false): Promise<View> {
    const view = this.createView(section, forceRight);

    this.views.append(view);

    // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);

    // Check if view has event methods before using them
    if (typeof view.on === 'function') {
      view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
        this.updateAxis(axis);
      });

      view.on(EVENTS.VIEWS.WRITING_MODE, (mode: string) => {
        this.updateWritingMode(mode);
      });
    } else {
      console.warn(
        '[DefaultViewManager] view does not have event methods in add():',
        typeof view.on
      );
    }

    return view.display(this.request).then(() => view);
  }

  moveTo(offset: { left: number; top: number }, width: number) {
    let distX = 0,
      distY = 0;

    if (!this.isPaginated) {
      distY = offset.top;
    } else {
      distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;

      if (distX + this.layout.delta > this.container.scrollWidth) {
        distX = this.container.scrollWidth - this.layout.delta;
      }

      distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;

      if (distY + this.layout.delta > this.container.scrollHeight) {
        distY = this.container.scrollHeight - this.layout.delta;
      }
    }
    if (this.settings.direction === 'rtl') {
      /***
				the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
				to distX or use `Math.ceil` function, or multiply offset.left by -1
				before `Math.floor`
			*/
      distX = distX + this.layout.delta;
      distX = distX - width;
    }
    this.scrollTo(distX, distY, true);
  }

  async append(section: Section, forceRight: boolean = false): Promise<View> {
    const view = this.createView(section, forceRight);

    this.views.append(view);

    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);

    // Check if view has event methods before using them
    if (typeof view.on === 'function') {
      view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
        this.updateAxis(axis);
      });

      view.on(EVENTS.VIEWS.WRITING_MODE, (mode: string) => {
        this.updateWritingMode(mode);
      });
    } else {
      console.warn(
        '[DefaultViewManager] view does not have event methods in append():',
        typeof view.on
      );
    }

    return view.display(this.request).then(() => view);
  }

  async prepend(section: Section, forceRight: boolean = false) {
    const view = this.createView(section, forceRight);

    // Check if view has event methods before using them
    if (typeof view.on === 'function') {
      view.on(
        EVENTS.VIEWS.RESIZED,
        (bounds: { heightDelta: number; widthDelta: number }) => {
          this.counter(bounds);
        }
      );

      view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
        this.updateAxis(axis);
      });

      view.on(EVENTS.VIEWS.WRITING_MODE, (mode: string) => {
        this.updateWritingMode(mode);
      });
    } else {
      console.warn(
        '[DefaultViewManager] view does not have event methods in prepend():',
        typeof view.on
      );
    }

    this.views.prepend(view);

    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);

    return view.display(this.request).then(() => view);
  }

  counter(bounds: { heightDelta: number; widthDelta: number }) {
    if (this.settings.axis === 'vertical') {
      this.scrollBy(0, bounds.heightDelta, true);
    } else {
      this.scrollBy(bounds.widthDelta, 0, true);
    }
  }

  async next(): Promise<void> {
    if (!this.hasViews()) return;
    // If we're already at the last page of the last visible section, jump to next section
    try {
      const loc = this.currentLocation();
      if (loc && loc.length) {
        const lastLoc = loc[loc.length - 1];
        const lastDisplayed =
          lastLoc.pages && lastLoc.pages.length
            ? lastLoc.pages[lastLoc.pages.length - 1]
            : 1;
        if (lastDisplayed >= lastLoc.totalPages) {
          const next = this.views.last()?.section?.next();
          if (next) {
            await this.loadNextSection(next);
            return;
          }
        }
      }
    } catch {
      // fall through to normal forward handling
    }

    const section = this.handleScrollForward();
    if (section) await this.loadNextSection(section);
  }

  async prev(): Promise<void> {
    if (!this.hasViews()) return;

    const section = this.handleScrollBackward();

    // Fix: Check if section exists before trying to load it
    // This prevents white pages when navigating beyond book boundaries
    if (section && section.href) {
      await this.loadPrevSection(section);
    } else {
      console.debug(
        '[DefaultViewManager] prev() reached beginning of book, no more sections to load'
      );
      // Don't clear views or reset scroll position if we're at the boundary
      return;
    }
  }

  /* ---------- Helpers ---------- */

  private hasViews(): boolean {
    return this.views && this.views.length > 0;
  }

  private handleScrollForward(): Section | undefined {
    const { axis, direction, rtlScrollType } = this.settings;

    if (!this.isPaginated) {
      return this.views.last()?.section?.next();
    }

    if (axis === 'horizontal') {
      return direction === 'rtl'
        ? this.scrollForwardRTL(rtlScrollType as string)
        : this.scrollForwardLTR();
    }

    if (axis === 'vertical') {
      return this.scrollForwardVertical();
    }

    return;
  }

  private handleScrollBackward(): Section | undefined {
    const { axis, direction, rtlScrollType } = this.settings;

    if (!this.isPaginated) {
      return this.views.first()?.section?.prev();
    }

    if (axis === 'horizontal') {
      return direction === 'rtl'
        ? this.scrollBackwardRTL(rtlScrollType as string)
        : this.scrollBackwardLTR();
    }

    if (axis === 'vertical') {
      return this.scrollBackwardVertical();
    }

    return;
  }

  /* ---------- Directional scroll strategies ---------- */

  private scrollForwardLTR(): Section | undefined {
    const maxScrollLeft =
      this.container.scrollWidth - this.container.offsetWidth;
    // If we can still scroll within the current section, do so; otherwise move to next section
    if (this.container.scrollLeft < maxScrollLeft) {
      this.scrollBy(this.layout.delta, 0, true);
      this.rememberScrollPosition();
      return;
    }
    return this.views.last()?.section?.next();
  }

  private scrollForwardRTL(rtlScrollType: string): Section | undefined {
    let left;
    if (rtlScrollType === 'default') {
      left = this.container.scrollLeft;
      if (left > 0) {
        this.scrollBy(this.layout.delta, 0, true);
        return;
      }
    } else {
      left = this.container.scrollLeft - this.layout.delta;
      if (left > this.container.scrollWidth * -1) {
        this.scrollBy(this.layout.delta, 0, true);
        return;
      }
    }
    return this.views.last()?.section?.next();
  }

  private scrollForwardVertical(): Section | undefined {
    const top = this.container.scrollTop + this.container.offsetHeight;
    if (top < this.container.scrollHeight) {
      this.scrollBy(0, this.layout.height, true);
      return;
    }
    return this.views.last()?.section?.next();
  }

  private scrollBackwardLTR(): Section | undefined {
    if (this.container.scrollLeft > 0) {
      this.scrollBy(-this.layout.delta, 0, true);
      return;
    }

    // When at the beginning of the scroll area, move to the previous section if available
    const firstSection = this.views.first()?.section;
    if (!firstSection) {
      console.debug(
        '[DefaultViewManager] scrollBackwardLTR: no first section available'
      );
      return;
    }

    const prevSection = firstSection.prev();
    if (!prevSection) {
      console.debug(
        '[DefaultViewManager] scrollBackwardLTR: reached beginning of book, no more previous sections'
      );
      return;
    }

    console.debug(
      '[DefaultViewManager] scrollBackwardLTR: moving from',
      firstSection.href,
      'to',
      prevSection.href
    );

    return prevSection;
  }

  private scrollBackwardRTL(rtlScrollType: string): Section | undefined {
    if (rtlScrollType === 'default') {
      if (
        this.container.scrollLeft + this.container.offsetWidth <
        this.container.scrollWidth
      ) {
        this.scrollBy(-this.layout.delta, 0, true);
        return;
      }
    } else {
      if (this.container.scrollLeft < 0) {
        this.scrollBy(-this.layout.delta, 0, true);
        return;
      }
    }
    return this.views.first()?.section?.prev();
  }

  private scrollBackwardVertical(): Section | undefined {
    if (this.container.scrollTop > 0) {
      this.scrollBy(0, -this.layout.height, true);
      return;
    }
    return this.views.first()?.section?.prev();
  }

  /* ---------- Section loading ---------- */

  private async loadNextSection(next: Section): Promise<void> {
    this.clear();
    this.updateLayout();

    const forceRight =
      this.layout.name === 'pre-paginated' &&
      this.layout.divisor === 2 &&
      next.properties.includes('page-spread-right');

    await this.append(next, forceRight).then(
      () => this.handleNextPrePaginated(forceRight, next, this.append),
      (err) => err
    );

    // Ensure we start at the beginning of the newly loaded section for forward navigation.
    // This fixes the case where prev() moved to the previous chapter's end and next() should
    // return to the start of the next chapter but instead lands mid-content due to preserved scroll.
    if (this.settings.axis === 'horizontal') {
      if (
        this.settings.direction === 'rtl' &&
        this.settings.rtlScrollType === 'default'
      ) {
        this.scrollTo(this.container.scrollWidth, 0, true);
      } else {
        this.scrollTo(0, 0, true);
      }
    }

    this.views.show();
  }

  private async loadPrevSection(prev: Section): Promise<void> {
    // Fix: Validate section before proceeding
    if (!prev || !prev.href) {
      console.warn(
        '[DefaultViewManager] loadPrevSection called with invalid section:',
        prev
      );
      return;
    }

    this.clear();
    this.updateLayout();

    const forceRight =
      this.layout.name === 'pre-paginated' &&
      this.layout.divisor === 2 &&
      typeof prev.prev() !== 'object';

    await this.prepend(prev, forceRight).then(
      async () => {
        if (this.layout.name === 'pre-paginated' && this.layout.divisor > 1) {
          const left = prev.prev();
          if (left) await this.prepend(left);
        }
      },
      (err) => {
        console.error(
          '[DefaultViewManager] Error in loadPrevSection prepend:',
          err
        );
        return err;
      }
    );

    // After prepending the previous section, move scroll to the end of content so the last page is visible
    this.adjustScrollAfterPrepend();
    if (this.settings.axis === 'horizontal') {
      if (
        this.settings.direction === 'rtl' &&
        this.settings.rtlScrollType === 'default'
      ) {
        // In RTL default, the start is at scrollLeft 0
        this.scrollTo(0, 0, true);
      } else {
        // In LTR, go to the far right (end of the section)
        const maxScrollLeft = Math.max(
          0,
          this.container.scrollWidth - this.container.offsetWidth
        );
        this.scrollTo(maxScrollLeft, 0, true);
      }
    }
    this.views.show();
  }

  /* ---------- Scroll adjustments ---------- */

  private adjustScrollAfterPrepend(): void {
    if (!this.isPaginated || this.settings.axis !== 'horizontal') return;

    const { rtlScrollType, direction } = this.settings;

    // Fix: Add validation to prevent scrolling beyond bounds
    const containerScrollWidth = this.container.scrollWidth;
    const containerOffsetWidth = this.container.offsetWidth;
    const maxScrollLeft = Math.max(
      0,
      containerScrollWidth - containerOffsetWidth
    );

    console.debug(
      '[DefaultViewManager] adjustScrollAfterPrepend:',
      'scrollWidth=',
      containerScrollWidth,
      'offsetWidth=',
      containerOffsetWidth,
      'maxScrollLeft=',
      maxScrollLeft
    );

    if (direction === 'rtl') {
      if (rtlScrollType === 'default') {
        this.scrollTo(0, 0, true);
      } else {
        const targetScrollLeft = containerScrollWidth * -1 + this.layout.delta;
        this.scrollTo(targetScrollLeft, 0, true);
      }
    } else {
      // Fix: Ensure we don't scroll beyond available content
      const targetScrollLeft = Math.min(
        maxScrollLeft,
        containerScrollWidth - this.layout.delta
      );

      console.debug(
        '[DefaultViewManager] adjustScrollAfterPrepend LTR: setting scrollLeft to',
        targetScrollLeft
      );

      this.scrollTo(targetScrollLeft, 0, true);
    }
  }

  private rememberScrollPosition(): void {
    this.targetScrollLeft = this.container.scrollLeft;

    setTimeout(() => {
      if (this.container.scrollLeft !== this.targetScrollLeft) {
        console.warn(
          '[DefaultViewManager] SCROLL RESET DETECTED!',
          'expected=',
          this.targetScrollLeft,
          'actual=',
          this.container.scrollLeft
        );
      }
    }, 100);
  }
  current() {
    const visible = this.visible();
    if (visible.length) {
      // Current is the last visible view
      return visible[visible.length - 1];
    }
    return null;
  }

  clear() {
    // this.q.clear();

    if (this.views) {
      try {
        this.views.hide();
      } catch (hideError) {
        console.warn('[DefaultViewManager] error hiding views:', hideError);
        // Try to hide views individually to isolate the problem
        const len = this.views.length;
        for (let i = 0; i < len; i++) {
          const view = this.views._views[i];
          if (view && view.displayed && view.hide) {
            try {
              view.hide();
            } catch (individualHideError) {
              console.warn(
                '[DefaultViewManager] error hiding individual view:',
                individualHideError
              );
            }
          }
        }
      }

      // Fix: For pre-rendered content, don't automatically reset scroll position
      // Pre-rendered chapters should maintain their positioning
      if (this.settings.usePreRendering) {
        console.debug(
          '[DefaultViewManager] clear() with pre-rendering - preserving scroll position:',
          this.container.scrollLeft
        );
      } else {
        // Original logic for non-pre-rendered content
        const hasValidScrollPosition = this.container.scrollLeft > 0;
        const isNavigating = this.views.length > 0;

        if (!hasValidScrollPosition || !isNavigating) {
          this.scrollTo(0, 0, true);
        } else {
          console.debug(
            '[DefaultViewManager] clear() preserving scroll position during navigation:',
            this.container.scrollLeft
          );
        }
      }

      this.views.clear();
    }

    // Note: Don't remove phantom element here - it should persist across chapters
    // The phantom element maintains the expanded scrollWidth for the container
  }

  currentLocation(): PageLocation[] {
    this.updateLayout();

    if (this.isPaginated && this.settings.axis === 'horizontal') {
      this.location = this.paginatedLocation();
    } else {
      this.location = this.scrolledLocation();
    }

    return this.location;
  }

  scrolledLocation(): PageLocation[] {
    const visible = this.visible();
    const container = this.container.getBoundingClientRect();
    // Use container dimensions by default. If fullsize is requested, fall back to window
    const pageHeight = this.settings.fullsize
      ? window.innerHeight
      : container.height;
    const pageWidth = this.settings.fullsize
      ? window.innerWidth
      : container.width;
    const vertical = this.settings.axis === 'vertical';

    let offset = 0;
    const used = 0;

    if (this.settings.fullsize) {
      offset = vertical ? window.scrollY : window.scrollX;
    }

    const sections = visible.map((view) => {
      const { index, href } = view.section!;
      const position = view.position();
      const width = view.width();
      const height = view.height();

      // Fix: Use actual content width for total page calculation, but container width for viewport calculation
      let actualWidth = width;
      if (view.contents && view.contents.textWidth) {
        const contentWidth = view.contents.textWidth();
        if (contentWidth > width) {
          actualWidth = contentWidth;
          console.debug(
            '[DefaultViewManager] paginatedLocation using content width:',
            contentWidth,
            'instead of view width:',
            width
          );
        }
      }

      let startPos;
      let endPos;
      let stopPos;
      let totalPages;

      if (vertical) {
        startPos = offset + container.top - position.top + used;
        endPos = startPos + pageHeight - used;
        totalPages = this.layout.count(height, pageHeight).pages;
        stopPos = pageHeight;
      } else {
        startPos = offset + container.left - position.left + used;
        endPos = startPos + pageWidth - used;
        // Use actual content width for total page count, but container width for viewport pages
        totalPages = this.layout.count(actualWidth, pageWidth).pages;
        stopPos = pageWidth; // Use container width, not content width, for page boundaries
      }

      let currPage = Math.ceil(startPos / stopPos);
      let pages = [];
      let endPage = Math.ceil(endPos / stopPos);

      // Reverse page counts for horizontal rtl
      if (this.settings.direction === 'rtl' && !vertical) {
        const tempStartPage = currPage;
        currPage = totalPages - endPage;
        endPage = totalPages - tempStartPage;
      }

      pages = [];
      for (let i = currPage; i <= endPage; i++) {
        const pg = i + 1;
        pages.push(pg);
      }

      if (this.mapping === undefined) {
        throw new Error('Mapping is not defined');
      }

      const mapping = this.mapping.page(
        view.contents!,
        view.section!.cfiBase!,
        startPos,
        endPos
      );

      return {
        index,
        href,
        pages,
        totalPages,
        mapping,
      };
    });

    return sections;
  }

  paginatedLocation(): PageLocation[] {
    const visible = this.visible();
    const container = this.container.getBoundingClientRect();
    let left = 0;
    let used = 0;
    if (this.settings.fullsize) {
      left = window.scrollX;
    }
    const sections = visible.map((view) => {
      const { index, href } = view.section!;
      let offset;
      const position = view.position();
      const width = view.width();
      // Find mapping
      let start;
      let end;
      let pageWidth;
      if (this.settings.direction === 'rtl') {
        offset = container.right - left;
        pageWidth =
          Math.min(Math.abs(offset - position.left), this.layout.width) - used;
        end = position.width - (position.right - offset) - used;
        start = end - pageWidth;
      } else {
        offset = container.left + left;
        pageWidth = Math.min(position.right - offset, this.layout.width) - used;
        start = offset - position.left + used;
        end = start + pageWidth;
      }
      used += pageWidth;

      // Fix: Limit the end position for non-pre-rendered content only
      // Pre-rendered content should use its full width
      let shouldLimitEnd = true;
      if (this.preRenderer) {
        const preRenderedChapter = this.preRenderer.getChapter(href);
        if (preRenderedChapter && preRenderedChapter.attached) {
          shouldLimitEnd = false;
          console.debug(
            '[DefaultViewManager] not limiting end position for pre-rendered chapter:',
            href
          );
        }
      }

      if (
        shouldLimitEnd &&
        this.layout.pageWidth &&
        this.layout.pageWidth > 0
      ) {
        const maxEnd = start + this.layout.pageWidth;
        if (end > maxEnd) {
          console.debug(
            '[DefaultViewManager] limiting end position from',
            end,
            'to',
            maxEnd
          );
          end = maxEnd;
          pageWidth = end - start;
        }
      }

      // Debug: Log the positioning calculation
      console.debug('[DefaultViewManager] paginatedLocation debug:', {
        href,
        containerLeft: container.left,
        left,
        offset,
        positionLeft: position.left,
        positionRight: position.right,
        pageWidth,
        start,
        end,
        used,
        containerScrollLeft: this.container.scrollLeft,
        layoutWidth: this.layout.width,
      });

      let mapping;
      if (this.preRenderer) {
        const pre = this.preRenderer.getChapter(href);
        if (pre && pre.pageMap && pre.pageMap.length) {
          // Clamp to page boundaries using the map for stability
          const pageWidth = this.layout.pageWidth || this.layout.width;
          const startPage = Math.max(1, Math.floor(start / pageWidth) + 1);
          const endPage = Math.max(startPage, Math.floor(end / pageWidth) + 1);
          const startEntry =
            pre.pageMap[Math.min(startPage - 1, pre.pageMap.length - 1)];
          const endEntry =
            pre.pageMap[Math.min(endPage - 1, pre.pageMap.length - 1)];
          mapping = {
            start: startEntry?.startCfi || '',
            end: endEntry?.startCfi || '',
          };
        }
      }
      if (!mapping) {
        if (this.mapping === undefined) {
          throw new Error('Mapping is not defined');
        }
        mapping = this.mapping.page(
          view.contents!,
          view.section!.cfiBase!,
          start,
          end
        );
      }

      // Fix: Use actual content width for pagination calculation if available
      let actualWidth = width;
      if (view.contents && view.contents.textWidth) {
        const contentWidth = view.contents.textWidth();
        if (contentWidth > width) {
          actualWidth = contentWidth;
        }
      }

      // Calculate total pages - use pre-rendered count if available
      let totalPages;
      if (this.preRenderer) {
        const preRenderedChapter = this.preRenderer.getChapter(href);
        if (preRenderedChapter && preRenderedChapter.pageCount > 0) {
          totalPages = preRenderedChapter.pageCount;
          console.debug(
            '[DefaultViewManager] using pre-rendered page count:',
            totalPages,
            'for chapter:',
            href
          );
        } else {
          totalPages = this.layout.count(actualWidth).pages;
          console.debug(
            '[DefaultViewManager] using layout-calculated page count:',
            totalPages,
            'for chapter:',
            href
          );
        }
      } else {
        totalPages = this.layout.count(actualWidth).pages;
        console.debug(
          '[DefaultViewManager] no pre-renderer, using layout-calculated page count:',
          totalPages,
          'for chapter:',
          href
        );
      }
      let startPage = 0;
      let endPage = 0;
      const pages: number[] = [];

      if (this.layout.pageWidth && this.layout.pageWidth > 0) {
        startPage = Math.floor(start / this.layout.pageWidth);
        endPage = Math.floor(end / this.layout.pageWidth);

        // Fix: If we limited the end position to exactly one page width,
        // endPage should equal startPage to show only one page
        if (end === start + this.layout.pageWidth) {
          endPage = startPage;
        }

        // start page should not be negative
        if (startPage < 0) {
          startPage = 0;
          endPage = endPage + 1;
        }

        // Clamp pages to not exceed totalPages (prevent white pages)
        startPage = Math.max(0, Math.min(startPage, totalPages - 1));
        endPage = Math.max(0, Math.min(endPage, totalPages - 1));

        // Debug: Log page calculation
        console.debug('[DefaultViewManager] page calculation debug:', {
          href,
          start,
          end,
          pageWidth: this.layout.pageWidth,
          startPageRaw: Math.floor(start / this.layout.pageWidth),
          endPageRaw: Math.floor(end / this.layout.pageWidth),
          startPageClamped: startPage,
          endPageClamped: endPage,
          totalPages,
          actualWidth,
        });

        // Reverse page counts for rtl
        if (this.settings.direction === 'rtl') {
          const tempStartPage = startPage;
          startPage = totalPages - endPage;
          endPage = totalPages - tempStartPage;
        }

        for (let i = startPage + 1; i <= endPage + 1; i++) {
          const pg = i;
          if (pg <= totalPages) {
            // Additional safety check
            pages.push(pg);
          }
        }

        // Debug: Log final page array
        console.debug('[DefaultViewManager] final pages array:', {
          href,
          pages,
          totalPages,
        });
      }

      // Always return an object to satisfy the type annotation
      return {
        index,
        href,
        pages,
        totalPages,
        mapping,
      };
    });
    return sections;
  }

  isVisible(
    view: View,
    offsetPrev: number,
    offsetNext: number,
    _container: DOMRect | undefined
  ): boolean {
    const position = view.position();
    const container = _container || this.bounds();

    if (
      this.settings.axis === 'horizontal' &&
      position.right > container.left - offsetPrev &&
      position.left < container.right + offsetNext
    ) {
      return true;
    } else if (
      this.settings.axis === 'vertical' &&
      position.bottom > container.top - offsetPrev &&
      position.top < container.bottom + offsetNext
    ) {
      return true;
    }

    return false;
  }

  visible(): View[] {
    const container = this.bounds();
    const views = this.views.displayed();
    const viewsLength = views.length;
    const visible: View[] = [];
    let isVisible;
    let view;

    for (let i = 0; i < viewsLength; i++) {
      view = views[i];

      isVisible = this.isVisible(view, 0, 0, container as DOMRect);

      if (isVisible === true) {
        visible.push(view);
      }
    }
    return visible;
  }

  scrollBy(x: number, y: number, silent: boolean) {
    const dir = this.settings.direction === 'rtl' ? -1 : 1;

    if (silent) {
      this.ignore = true;
    }

    if (!this.settings.fullsize) {
      if (x) this.container.scrollLeft += x * dir;
      if (y) this.container.scrollTop += y;
    } else {
      window.scrollBy(x * dir, y * dir);
    }

    this.scrolled = true;
  }

  scrollTo(x: number, y: number, silent: boolean) {
    console.debug(
      '[DefaultViewManager] scrollTo called:',
      'x=',
      x,
      'y=',
      y,
      'silent=',
      silent,
      'current scrollLeft=',
      this.container.scrollLeft
    );

    // Add stack trace to identify what's calling scrollTo(0,0)
    if (x === 0 && y === 0 && this.container.scrollLeft > 0) {
      console.warn(
        '[DefaultViewManager] WARNING: scrollTo(0,0) called while scrollLeft >0, this will reset scroll position!'
      );
      console.trace('Call stack:');
    }

    if (silent) {
      this.ignore = true;
    }

    if (!this.settings.fullsize) {
      this.container.scrollLeft = x;
      this.container.scrollTop = y;
    } else {
      window.scrollTo(x, y);
    }
    this.scrolled = true;

    console.debug(
      '[DefaultViewManager] after scrollTo - new scrollLeft:',
      this.container.scrollLeft
    );
  }

  onScroll() {
    let scrollTop;
    let scrollLeft;

    if (!this.settings.fullsize) {
      scrollTop = this.container.scrollTop;
      scrollLeft = this.container.scrollLeft;
    } else {
      scrollTop = window.scrollY;
      scrollLeft = window.scrollX;
    }

    this.scrollTop = scrollTop;
    this.scrollLeft = scrollLeft;

    if (!this.ignore) {
      this.emit(EVENTS.MANAGERS.SCROLL, {
        top: scrollTop,
        left: scrollLeft,
      });

      clearTimeout(this.afterScrolled);
      this.afterScrolled = setTimeout(() => {
        this.emit(EVENTS.MANAGERS.SCROLLED, {
          top: this.scrollTop,
          left: this.scrollLeft,
        });
      }, 20);
    } else {
      this.ignore = false;
    }
  }

  bounds() {
    return this.stage.bounds();
  }

  applyLayout(layout: Layout) {
    this.layout = layout;
    this.updateLayout();
    if (
      this.views &&
      this.views.length > 0 &&
      this.layout.name === 'pre-paginated'
    ) {
      const firstView = this.views.first();
      if (firstView && firstView.section) {
        this.display(firstView.section);
      }
    }
    // this.manager.layout(this.layout.format);
  }

  updateLayout() {
    if (!this.stage) {
      return;
    }

    this._stageSize = this.stage.size();

    // Prefer the actual container's bounding rect for layout calculations
    // so page widths/heights match the visible container rather than
    // falling back to window dimensions.
    let containerRect: DOMRect | undefined;
    try {
      containerRect = this.container.getBoundingClientRect();
    } catch {
      containerRect = undefined;
    }

    const layoutWidth =
      containerRect && containerRect.width
        ? containerRect.width
        : this._stageSize.width;
    const layoutHeight =
      containerRect && containerRect.height
        ? containerRect.height
        : this._stageSize.height;

    if (!this.isPaginated) {
      this.layout.calculate(layoutWidth, layoutHeight);
    } else {
      this.layout.calculate(layoutWidth, layoutHeight, this.settings.gap!);

      // Set the look ahead offset for what is visible
      this.settings.offset = this.layout.delta / this.layout.divisor;

      // this.stage.addStyleRules("iframe", [{"margin-right" : this.layout.gap + "px"}]);
    }

    // Set the dimensions for views
    this.viewSettings.width = this.layout.width;
    this.viewSettings.height = this.layout.height;

    this.setLayout(this.layout);
  }

  setLayout(layout: Layout) {
    this.viewSettings.layout = layout;

    this.mapping = new Mapping(
      // @ts-expect-error this should be fixed at some point
      layout.props,
      this.settings.direction,
      this.settings.axis
    );

    if (this.views) {
      this.views.forEach(function (view) {
        if (view) {
          view.setLayout(layout);
        }
      });
    }
  }

  updateWritingMode(mode: string) {
    this.writingMode = mode;
  }

  updateAxis(axis: Axis, forceUpdate?: boolean) {
    if (!forceUpdate && axis === this.settings.axis) {
      return;
    }

    this.settings.axis = axis;

    this.stage?.axis(axis);

    this.viewSettings.axis = axis;

    if (this.mapping) {
      this.mapping = new Mapping(
        // @ts-expect-error this should be fixed at some point
        this.layout.props,
        this.settings.direction,
        this.settings.axis
      );
    }

    if (this.layout) {
      if (axis === 'vertical') {
        this.layout.spread('none');
      } else {
        this.layout.spread(this.layout.settings.spread!);
      }
    }
  }

  updateFlow(flow: Flow, defaultScrolledOverflow = 'auto') {
    const isPaginated = flow === 'paginated' || flow === 'auto';

    this.isPaginated = isPaginated;

    if (
      flow === 'scrolled-doc' ||
      flow === 'scrolled-continuous' ||
      flow === 'scrolled'
    ) {
      this.updateAxis('vertical');
    } else {
      this.updateAxis('horizontal');
    }

    this.viewSettings.flow = flow;

    if (!this.settings.overflow) {
      this.overflow = isPaginated ? 'hidden' : defaultScrolledOverflow;
    } else {
      this.overflow = this.settings.overflow;
    }

    this.stage?.overflow(this.overflow);

    this.updateLayout();
  }

  getContents() {
    const contents: Contents[] = [];
    if (!this.views) {
      return contents;
    }

    this.views.forEach(function (view) {
      const viewContents = view && view.contents;
      if (viewContents) {
        contents.push(viewContents);
      }
    });
    return contents;
  }

  direction(dir = 'ltr') {
    this.settings.direction = dir;
    this.stage?.direction(dir);
    this.viewSettings.direction = dir;
    this.updateLayout();
  }

  isRendered() {
    return this.rendered;
  }
}

//-- Enable binding events to Manager
EventEmitter(DefaultViewManager.prototype);

export default DefaultViewManager;
