import DefaultViewManager, { DefaultViewManagerSettings } from '../default';
import BookPreRenderer, {
  PreRenderedChapter,
  PreRenderingStatus,
  ViewSettings,
} from '../prerenderer';
import { ViewManager } from '../helpers/snap';
import { View } from '../helpers/views';
import { Section } from '../../section';
import IframeView from '../views/iframe';
import { EVENTS } from '../../utils/constants';

/**
 * PreRenderingViewManager - Extends DefaultViewManager to add pre-rendering capabilities
 *
 * This manager adds prerendering functionality on top of the DefaultViewManager.
 * The parent DefaultViewManager has no knowledge of prerendering - this manager adds it
 * as a transparent layer on top.
 */
export class PreRenderingViewManager
  extends DefaultViewManager
  implements ViewManager
{
  private _preRenderer: BookPreRenderer | null = null;
  public usePreRendering: boolean = false;

  // Guard to ensure prerendering is only started once per manager instance
  private _preRenderingStarted: boolean = false;
  // Flag to track when we're attaching prerendered content to prevent layout destruction
  private _attaching: boolean = false;

  // Override the name property
  public name: string = 'prerendering';

  // Public getter for compatibility with examples
  public get preRenderer(): BookPreRenderer | null {
    return this._preRenderer;
  }

  constructor(options: {
    settings: DefaultViewManagerSettings & { usePreRendering?: boolean };
    spine?: Section[];
    [key: string]: unknown;
  }) {
    // Ensure overflow is always hidden in settings
    if (options.settings) {
      options.settings.overflow = 'hidden';
    }

    super(options);

    this.usePreRendering = options.settings.usePreRendering || false;
    this.settings.overflow = 'hidden';
    this.overflow = 'hidden';
  }

  // Helper to write preserved content into an iframe and apply necessary styles
  private writeIframeContent(
    iframe: HTMLIFrameElement,
    originalContent: string
  ): void {
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(originalContent);
          doc.close();

          // Add styles to ensure no horizontal scrollbar
          if (doc.body) {
            // Explicitly set both overflow properties to hidden to prevent any scrollbars
            doc.body.style.overflowX = 'hidden';
            doc.body.style.overflowY = 'hidden';
            doc.body.style.overflow = 'hidden';

            // Add a style tag to ensure these styles aren't overridden by inline styles
            const style = doc.createElement('style');
            const cssRules = [
              'body {',
              '  overflow: hidden !important;',
              '  overflow-x: hidden !important;',
              '  overflow-y: hidden !important;',
              '}',
            ].join('\n');
            style.textContent = cssRules;
            doc.head.appendChild(style);
          }
        }
      } catch (e) {
        console.error(
          '[PreRenderingViewManager] Error writing content to iframe:',
          e
        );
      }
    };
  }

  // Check for prerendered content, otherwise use DefaultViewManager
  async append(
    section: Section,
    forceRight: boolean = false
  ): Promise<IframeView> {
    // Try to use prerendered content if available
    if (this.usePreRendering && this._preRenderer) {
      // Set attaching flag before attempting to attach prerendered content
      this._attaching = true;
      try {
        const attached = this._preRenderer.attachChapter(section.href);
        if (attached && attached.view) {
          // CRITICAL: We must mark the view as prerendered and attached BEFORE
          // adding it to the views collection to prevent layout recalculation
          attached.attached = true;

          // CRITICAL: Remove the default onDisplayed handler to prevent layout changes
          // We'll still have our own overridden afterDisplayed method as a safeguard
          if (attached.view) {
            attached.view.onDisplayed = () => {
              console.log(
                '[PreRenderingViewManager] Skipping onDisplayed for prerendered view:',
                section.href
              );
            };
          }

          // Create/update phantom element to match current chapter's content width
          if (this.container) {
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
            const contentWidth = attached.width || 0;
            const safeContentWidth = Math.max(contentWidth, this.layout.width);

            phantomElement.style.width = safeContentWidth + 'px';

            // Force a reflow to ensure the phantom element takes effect
            void phantomElement.offsetWidth;
          }

          // Create a fresh wrapper with iframe from scratch
          const wrapperElement = document.createElement('div');
          wrapperElement.classList.add('epub-view');
          wrapperElement.setAttribute(
            'ref',
            this.views._views.length.toString()
          );

          // Size and style according to the view mode
          const isSpreadView = this.layout && this.layout.divisor > 1;
          // Redeclare viewport dimensions to ensure they're in scope
          const viewportWidth = this.container ? this.container.clientWidth : 0;
          const viewportHeight = this.container
            ? this.container.clientHeight
            : 0;

          // Get the container width and viewport dimensions
          const containerWidth = this.container
            ? this.container.clientWidth
            : 900;

          if (isSpreadView) {
            // Set as half width for spread view
            const columnWidth =
              this.layout?.columnWidth || Math.floor(viewportWidth / 2);
            wrapperElement.style.width = `${columnWidth}px`;
            wrapperElement.style.height = `${viewportHeight}px`;

            // Position left or right
            if (forceRight) {
              const rightPosition =
                this.layout?.columnWidth || Math.floor(viewportWidth / 2);
              const gapAdjustment = this.layout?.gap || 0;
              wrapperElement.style.left = `${rightPosition + gapAdjustment}px`;
            } else {
              wrapperElement.style.left = '0px';
            }
          } else {
            // IMPORTANT: In DefaultViewManager both the wrapper and iframe get the same width
            // We need to use the iframe width here, which is set below
            wrapperElement.style.width = `${containerWidth}px`; // Start with container width
            wrapperElement.style.height = `${viewportHeight}px`;
            wrapperElement.style.left = '0px';
          }

          // Common styles
          wrapperElement.style.overflow = 'hidden';
          wrapperElement.style.position = 'relative';
          wrapperElement.style.display = 'block';
          wrapperElement.style.flex = '0 0 auto';
          wrapperElement.style.visibility = 'visible';

          // Create a new iframe
          const iframeElement = document.createElement('iframe');
          iframeElement.style.border = 'none';

          // For the iframe width, we should match what the DefaultViewManager does
          // DefaultViewManager uses safeContentWidth for both wrapper and iframe
          const iframeWidth = Math.max(attached.width || 0, this.layout.width); // Use same calculation as phantom element
          console.log(
            '[PreRenderingViewManager] Setting iframe width to:',
            iframeWidth
          );

          iframeElement.style.width = `${iframeWidth}px`;

          // IMPORTANT: In DefaultViewManager, the wrapper element width matches the iframe width
          // Update the wrapper element's width to match the iframe width
          wrapperElement.style.width = `${iframeWidth}px`;
          iframeElement.style.height = `${attached.height}px`;
          // Force both overflow properties to hidden to prevent any scrollbars
          iframeElement.style.overflow = 'hidden';
          iframeElement.style.overflowX = 'hidden';
          iframeElement.style.overflowY = 'hidden';
          iframeElement.style.background = 'transparent';
          iframeElement.style.visibility = 'visible';
          iframeElement.style.display = 'block';
          iframeElement.style.wordSpacing = '0px';
          iframeElement.style.lineHeight = 'normal';

          // Set sandbox attributes
          iframeElement.setAttribute('sandbox', 'allow-same-origin');
          if (
            attached.view?.section?.properties &&
            Array.isArray(attached.view.section.properties) &&
            attached.view.section.properties.includes('scripted')
          ) {
            iframeElement.setAttribute(
              'sandbox',
              'allow-same-origin allow-scripts'
            );
          }

          // Position for spreads
          if (isSpreadView && forceRight && attached.pageCount > 1) {
            const singlePageWidth = Math.floor(
              attached.width / attached.pageCount
            );
            iframeElement.style.marginLeft = `-${singlePageWidth}px`;
          } else {
            iframeElement.style.marginLeft = '0px';
          }

          // Add iframe to wrapper
          wrapperElement.appendChild(iframeElement);

          // Get content
          let originalContent = '';
          if (attached.preservedContent) {
            originalContent = attached.preservedContent;
          } else if (attached.preservedSrcdoc) {
            originalContent = attached.preservedSrcdoc;
          } else {
            try {
              const originalIframe = attached.element.querySelector(
                'iframe'
              ) as HTMLIFrameElement;
              if (originalIframe) {
                if (
                  originalIframe.contentDocument &&
                  originalIframe.contentDocument.documentElement
                ) {
                  originalContent =
                    '<!DOCTYPE html>' +
                    originalIframe.contentDocument.documentElement.outerHTML;
                } else if (originalIframe.srcdoc) {
                  originalContent = originalIframe.srcdoc;
                }
              }
            } catch (e) {
              console.warn(
                '[PreRenderingViewManager] Error extracting content:',
                e
              );
            }
          }

          // Set up content loading
          this.writeIframeContent(iframeElement, originalContent);
          iframeElement.src = 'about:blank';

          // Update view references
          attached.view.element = wrapperElement;

          // Cast to a type with iframe/frame properties
          const iframeView = attached.view as unknown as {
            iframe?: HTMLIFrameElement;
            frame?: HTMLIFrameElement;
          };

          if (iframeView) {
            iframeView.iframe = iframeElement;
            iframeView.frame = iframeElement;
          }

          // Attach to container
          if (this.container) {
            this.container.appendChild(wrapperElement);
          }

          // Add the prerendered view to our views collection
          this.views.append(attached.view);

          // Create/update phantom element to match current chapter's content width
          // This ensures horizontal scrolling works properly
          const contentWidth = attached.width || 0;
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

          return attached.view as IframeView;
        }
      } finally {
        // Always reset attaching flag to ensure it's not left in active state
        this._attaching = false;
      }
    }

    // Fallback to DefaultViewManager
    return super.append(section, forceRight) as Promise<IframeView>;
  }

  // Use prerendered content for prepend, similar to append
  async prepend(
    section: Section,
    forceRight: boolean = false
  ): Promise<IframeView> {
    if (this.usePreRendering && this._preRenderer) {
      // Set attaching flag before attempting to attach prerendered content
      this._attaching = true;
      try {
        const attached = this._preRenderer.attachChapter(section.href);
        if (attached && attached.view) {
          // CRITICAL: We must mark the view as prerendered and attached BEFORE
          // adding it to the views collection to prevent layout recalculation
          attached.attached = true;

          // CRITICAL: Remove the default onDisplayed handler to prevent layout changes
          // We'll still have our own overridden afterDisplayed method as a safeguard
          if (attached.view) {
            attached.view.onDisplayed = () => {
              console.log(
                '[PreRenderingViewManager] Skipping onDisplayed for prerendered view (prepend):',
                section.href
              );
            };
          }

          // Create a fresh wrapper with iframe from scratch, similar to append method
          const wrapperElement = document.createElement('div');
          wrapperElement.classList.add('epub-view');
          wrapperElement.setAttribute(
            'ref',
            this.views._views.length.toString()
          );

          // Apply similar styling as in the append method
          const isSpreadView = this.layout && this.layout.divisor > 1;
          const viewportWidth = this.container ? this.container.clientWidth : 0;
          const viewportHeight = this.container
            ? this.container.clientHeight
            : 0;
          const containerWidth = this.container
            ? this.container.clientWidth
            : 900;

          if (isSpreadView) {
            // Set as half width for spread view
            const columnWidth =
              this.layout?.columnWidth || Math.floor(viewportWidth / 2);
            wrapperElement.style.width = `${columnWidth}px`;
            wrapperElement.style.height = `${viewportHeight}px`;

            // Position left or right
            if (forceRight) {
              const rightPosition =
                this.layout?.columnWidth || Math.floor(viewportWidth / 2);
              const gapAdjustment = this.layout?.gap || 0;
              wrapperElement.style.left = `${rightPosition + gapAdjustment}px`;
            } else {
              wrapperElement.style.left = '0px';
            }
          } else {
            wrapperElement.style.width = `${containerWidth}px`;
            wrapperElement.style.height = `${viewportHeight}px`;
            wrapperElement.style.left = '0px';
          }

          // Common styles
          wrapperElement.style.overflow = 'hidden';
          wrapperElement.style.position = 'relative';
          wrapperElement.style.display = 'block';
          wrapperElement.style.flex = '0 0 auto';
          wrapperElement.style.visibility = 'visible';

          // Create a new iframe
          const iframeElement = document.createElement('iframe');
          iframeElement.style.border = 'none';

          // For the iframe width, use same calculation as in append
          const iframeWidth = Math.max(attached.width || 0, this.layout.width);
          iframeElement.style.width = `${iframeWidth}px`;
          wrapperElement.style.width = `${iframeWidth}px`;
          iframeElement.style.height = `${attached.height}px`;

          // Force both overflow properties to hidden to prevent any scrollbars
          iframeElement.style.overflow = 'hidden';
          iframeElement.style.overflowX = 'hidden';
          iframeElement.style.overflowY = 'hidden';
          iframeElement.style.background = 'transparent';
          iframeElement.style.visibility = 'visible';
          iframeElement.style.display = 'block';
          iframeElement.style.wordSpacing = '0px';
          iframeElement.style.lineHeight = 'normal';

          // Set sandbox attributes
          iframeElement.setAttribute('sandbox', 'allow-same-origin');
          if (
            attached.view?.section?.properties &&
            Array.isArray(attached.view.section.properties) &&
            attached.view.section.properties.includes('scripted')
          ) {
            iframeElement.setAttribute(
              'sandbox',
              'allow-same-origin allow-scripts'
            );
          }

          // Position for spreads
          if (isSpreadView && forceRight && attached.pageCount > 1) {
            const singlePageWidth = Math.floor(
              attached.width / attached.pageCount
            );
            iframeElement.style.marginLeft = `-${singlePageWidth}px`;
          } else {
            iframeElement.style.marginLeft = '0px';
          }

          // Add iframe to wrapper
          wrapperElement.appendChild(iframeElement);

          // Get content
          let originalContent = '';
          if (attached.preservedContent) {
            originalContent = attached.preservedContent;
          } else if (attached.preservedSrcdoc) {
            originalContent = attached.preservedSrcdoc;
          } else {
            try {
              const originalIframe = attached.element.querySelector(
                'iframe'
              ) as HTMLIFrameElement;
              if (originalIframe) {
                if (
                  originalIframe.contentDocument &&
                  originalIframe.contentDocument.documentElement
                ) {
                  originalContent =
                    '<!DOCTYPE html>' +
                    originalIframe.contentDocument.documentElement.outerHTML;
                } else if (originalIframe.srcdoc) {
                  originalContent = originalIframe.srcdoc;
                }
              }
            } catch (e) {
              console.warn(
                '[PreRenderingViewManager] Error extracting content:',
                e
              );
            }
          }

          // Set up content loading
          this.writeIframeContent(iframeElement, originalContent);

          iframeElement.src = 'about:blank';

          // Update view references
          attached.view.element = wrapperElement;

          // Cast to a type with iframe/frame properties
          const iframeView = attached.view as unknown as {
            iframe?: HTMLIFrameElement;
            frame?: HTMLIFrameElement;
          };

          if (iframeView) {
            iframeView.iframe = iframeElement;
            iframeView.frame = iframeElement;
          }

          // Attach to container
          if (this.container) {
            this.container.appendChild(wrapperElement);
          }

          // Prepend the prerendered view to our views collection
          this.views.prepend(attached.view);

          // Update phantom element as in append
          const contentWidth = attached.width || 0;
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

          // Ensure phantom width is set correctly
          const safeContentWidth = Math.max(contentWidth, this.layout.width);
          phantomElement.style.width = safeContentWidth + 'px';
          void phantomElement.offsetWidth;

          return attached.view as IframeView;
        }
      } finally {
        // Always reset attaching flag
        this._attaching = false;
      }
    }

    // Fallback to DefaultViewManager if no prerendered content is available
    return super.prepend(section, forceRight) as Promise<IframeView>;
  }

  // Pre-rendering specific methods
  async startPreRendering(sections: Section[]): Promise<void> {
    if (!this.usePreRendering || !this._preRenderer) {
      return;
    }

    if (this._preRenderingStarted) {
      return;
    }

    this._preRenderingStarted = true;
    await this._preRenderer.preRenderBook(sections);
  }

  getPreRenderedChapter(sectionHref: string): PreRenderedChapter | undefined {
    if (!this.usePreRendering || !this._preRenderer) {
      return undefined;
    }
    return this._preRenderer.getChapter(sectionHref);
  }

  hasPreRenderedChapter(sectionHref: string): boolean {
    if (!this.usePreRendering || !this._preRenderer) {
      return false;
    }
    return !!this._preRenderer.getChapter(sectionHref);
  }

  getPreRenderingStatus(): PreRenderingStatus {
    if (!this.usePreRendering || !this._preRenderer) {
      return {
        total: 0,
        rendered: 0,
        failed: 0,
        chapters: new Map(),
      };
    }
    return this._preRenderer.getStatus();
  }

  getAllPreRenderedChapters(): PreRenderedChapter[] {
    if (!this.usePreRendering || !this._preRenderer) {
      return [];
    }
    return this._preRenderer.getAllChapters();
  }

  getPreRenderingDebugInfo() {
    if (!this.usePreRendering || !this._preRenderer) {
      return {
        totalChapters: 0,
        renderingInProgress: 0,
        chapters: [],
      };
    }
    return this._preRenderer.getDebugInfo();
  }

  /**
   * Get the total number of pages across all chapters in the book
   */
  getTotalPages(): number | undefined {
    return this._preRenderer
      ?.getAllChapters()
      .reduce<number | undefined>((sum, ch) => {
        if (ch.pageCount === undefined) return undefined;
        return sum! + ch.pageCount;
      }, 0);
  }

  /**
   * Get the current page number across all chapters in the book
   */
  getCurrentPage(): number | undefined {
    const locationInfo = this.currentLocation?.();
    const chapters = this._preRenderer?.getAllChapters();

    if (!locationInfo?.length || !chapters?.length) return undefined;

    const current = locationInfo[0];
    const currentHref = current.href;
    const currentPage = current.pages[0] ?? 1;

    const index = chapters.findIndex((ch) => ch.section.href === currentHref);
    if (index === -1) return undefined;

    const totalBefore = chapters
      .slice(0, index)
      .reduce<number | undefined>((sum, ch) => {
        if (ch.pageCount === undefined) return undefined;
        return sum! + ch.pageCount;
      }, 0);

    return totalBefore === undefined ? undefined : totalBefore + currentPage;
  }

  afterDisplayed(view: View | IframeView): void {
    // Check if this is a prerendered view that we just attached
    const isPrerenderedView =
      this._preRenderer &&
      view.section &&
      this._preRenderer.getChapter(view.section.href)?.attached === true;

    if (isPrerenderedView) {
      // Emit the displayed event so the book knows the content is ready
      this.emit(EVENTS.MANAGERS.ADDED, view);
      return;
    }

    super.afterDisplayed(view);
  }

  // Override destroy to clean up pre-renderer
  destroy(): void {
    this._preRenderer?.destroy();
    return super.destroy();
  }

  // Override render to initialize the BookPreRenderer once the container and
  // Only override render to initialize pre-renderer
  render(element: HTMLElement, size?: { width: number; height: number }): void {
    // Ensure overflow is explicitly set to hidden
    this.settings.overflow = 'hidden';
    this.overflow = 'hidden';

    // Call parent render first
    super.render(element, size);

    // Initialize the pre-renderer now that the DOM container and viewSettings exist
    if (this.usePreRendering && !this._preRenderer && this.container) {
      const preRenderViewSettings: ViewSettings = {
        width: (this.viewSettings.width as number) || 0,
        height: (this.viewSettings.height as number) || 0,
        ...this.viewSettings,
      };

      this._preRenderer = new BookPreRenderer(
        this.container,
        preRenderViewSettings,
        this.request as (url: string) => Promise<Document>
      );
    }
  }

  // Override resize to ensure proper handling of prerendered content during window resize
  async resize(width?: string, height?: string, epubcfi?: string) {
    try {
      // Set _attaching flag to prevent layout destruction during resize
      this._attaching = true;
      // Check if any of the current views are prerendered
      let hasPrerenderedViews = false;
      const prerenderedSections: Section[] = [];

      this.views._views.forEach((view) => {
        if (
          view &&
          view.section &&
          this._preRenderer?.getChapter(view.section.href)?.attached
        ) {
          hasPrerenderedViews = true;
          prerenderedSections.push(view.section);
        }
      });

      // For prerendered content, just update the container dimensions without
      // trying to modify the prerendered content itself
      if (hasPrerenderedViews) {
        // Update container dimensions only
        const stageSize = this.stage.size(width, height);
        this._stageSize = stageSize;
        this._bounds = this.bounds();

        // Update view settings
        this.viewSettings.width = this._stageSize.width;
        this.viewSettings.height = this._stageSize.height;

        // Update layout information without modifying views
        if (this.layout) {
          this.layout.calculate(
            this._stageSize.width,
            this._stageSize.height,
            this.settings.gap!
          );

          this.settings.offset = this.layout.delta / this.layout.divisor;
        }

        // Emit resize event with updated dimensions
        this.emit(
          EVENTS.MANAGERS.RESIZED,
          {
            width: this._stageSize.width,
            height: this._stageSize.height,
          },
          epubcfi
        );

        return;
      }

      return super.resize(width, height, epubcfi);
    } catch {
      // If our custom resize fails, fall back to the default implementation
      return super.resize(width, height, epubcfi);
    } finally {
      // Always reset the attaching flag
      this._attaching = false;
    }
  }

  private isRtlDirection(): boolean {
    return (
      this.settings.direction === 'rtl' && this.settings.axis === 'horizontal'
    );
  }

  private async navigate(forwardInReadingOrder: boolean): Promise<void> {
    if (!this.views?.length) return;

    // Determine the "current view" depending on logical navigation direction
    // forwardInReadingOrder = true  -> use the last view (end of current content)
    // forwardInReadingOrder = false -> use the first view (start of current content)
    const currentView = forwardInReadingOrder
      ? this.views.last()
      : this.views.first();
    if (!currentView?.section) return;

    const currentSection = currentView.section;

    // Can we scroll inside the current section?
    const maxScrollLeft =
      this.container.scrollWidth - this.container.offsetWidth;
    const canScrollMore = forwardInReadingOrder
      ? this.container.scrollLeft < maxScrollLeft
      : this.container.scrollLeft > 0;

    // Fallback arrow function to call super method if needed
    const fallback = () =>
      forwardInReadingOrder ? super.next() : super.prev();

    // Only proceed with pre-rendered navigation if the preRenderer exists
    if (!this._preRenderer) return fallback();
    if (canScrollMore) return fallback();

    // Normalize actual section movement using RTL
    const actualForward = this.isRtlDirection()
      ? !forwardInReadingOrder
      : forwardInReadingOrder;

    const targetSection = actualForward
      ? currentSection.next()
      : currentSection.prev();

    if (!targetSection) return fallback();

    this.clear();
    this.updateLayout();

    const forceRight =
      this.layout.name === 'pre-paginated' &&
      this.layout.divisor === 2 &&
      targetSection.properties.includes('page-spread-right');

    await this.loadSection(targetSection, forwardInReadingOrder, forceRight);
  }

  private async loadSection(
    section: Section,
    goForward: boolean,
    forceRight: boolean
  ): Promise<void> {
    // Append or prepend the section
    if (goForward) {
      await this.append(section, forceRight);
    } else {
      await this.prepend(section, forceRight);
    }

    // Only adjust scroll for horizontal layouts
    if (this.settings.axis !== 'horizontal') return;

    const scrollWidth = this.container.scrollWidth;
    const offsetWidth = this.container.offsetWidth;
    const isRtlDefault =
      this.isRtlDirection() && this.settings.rtlScrollType === 'default';

    // Define scroll positions for next/prev in both directions
    const rtlOptions = { next: scrollWidth, prev: 0 };
    const ltrOptions = { next: 0, prev: scrollWidth - offsetWidth };

    const options = isRtlDefault ? rtlOptions : ltrOptions;
    const scrollPos = goForward ? options.next : options.prev;

    this.scrollTo(scrollPos, 0, true);
  }

  async next(): Promise<void> {
    return this.navigate(true); // forward in reading order
  }

  async prev(): Promise<void> {
    return this.navigate(false); // backward in reading order
  }
}

export default PreRenderingViewManager;
export {
  BookPreRenderer,
  PreRenderedChapter,
  PreRenderingStatus,
  ViewSettings,
} from '../prerenderer';
