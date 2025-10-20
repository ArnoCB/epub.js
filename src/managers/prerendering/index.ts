import DefaultViewManager from '../default';
import BookPreRenderer from '../prerenderer';
import { Section } from '../../section';
import IframeView from '../views/iframe';
import { EVENTS } from '../../utils/constants';
import type {
  DefaultViewManagerSettings,
  PreRenderedChapter,
  PreRenderingStatus,
  ViewSettings,
  ViewManager,
  View,
} from '../../types';

// Type guard to check if a View is an IframeView
function isIframeView(view: View): view is IframeView {
  return 'setupContentsForHighlighting' in view && 'settings' in view;
}

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
  /** @ts-expect-error: reserved for future use (attach/detach logic) */
  private _attaching: boolean = false;

  // Override the name property
  public override name: string = 'prerendering';

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

    // No need to apply EventEmitter here since we're using composition in DefaultViewManager
    // and this class inherits those event methods from the parent class
  }

  private writeIframeContent(
    iframe: HTMLIFrameElement,
    originalContent: string,
    attachedView?: IframeView,
    section?: Section
  ): void {
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        // Write the content
        doc.open();
        doc.write(originalContent);
        doc.close();

        // Prevent scrollbars
        if (doc.body) {
          this.applyNoScrollStyles(doc);
        }

        // Setup highlighting if needed
        if (attachedView && section && doc.body) {
          this.initializeContents(iframe, doc, attachedView, section);
        }
      } catch (err) {
        console.error(
          '[PreRenderingViewManager] Error writing content to iframe:',
          err
        );
      }
    };
  }

  private applyNoScrollStyles(doc: Document): void {
    Object.assign(doc.body!.style, {
      overflow: 'hidden',
      overflowX: 'hidden',
      overflowY: 'hidden',
    });

    const style = doc.createElement('style');
    style.textContent = `
    body {
      overflow: hidden !important;
      overflow-x: hidden !important;
      overflow-y: hidden !important;
    }
  `;
    doc.head.appendChild(style);
  }

  private initializeContents(
    iframe: HTMLIFrameElement,
    doc: Document,
    attachedView: IframeView,
    section: Section
  ): void {
    console.log(
      '[PreRenderingViewManager] Setting up Contents after content write'
    );

    const contents = attachedView.setupContentsForHighlighting(
      iframe,
      section,
      attachedView.settings?.transparency
    );

    if (!contents) {
      console.warn(
        '[PreRenderingViewManager] ❌ Failed to create Contents object'
      );
      return;
    }

    attachedView.window = iframe.contentWindow || undefined;
    attachedView.document = doc;
    attachedView.contents = contents;

    console.log(
      '[PreRenderingViewManager] ✅ Contents object created successfully'
    );
    console.log('[PreRenderingViewManager] Triggering MANAGERS.ADDED event');
    this.emit(EVENTS.MANAGERS.ADDED, attachedView);
  }

  private async attachPrerendered(
    section: Section,
    forceRight: boolean,
    mode: 'append' | 'prepend'
  ): Promise<IframeView | null> {
    if (!(this.usePreRendering && this._preRenderer)) {
      return null;
    }

    this._attaching = true;
    try {
      const attached = this._preRenderer.attachChapter(section.href);
      if (!attached || !attached.view) return null;

      attached.attached = true;

      // Prevent layout recalculation by removing default handler
      attached.view.onDisplayed = () => {};

      // Build wrapper + iframe
      const wrapperElement = this.createWrapper(forceRight, attached);
      const iframeElement = this.createIframe(forceRight, attached);

      wrapperElement.appendChild(iframeElement);

      // Extract content
      const originalContent = this.extractContent(attached);

      // Load content
      if (isIframeView(attached.view)) {
        this.writeIframeContent(
          iframeElement,
          originalContent,
          attached.view,
          attached.section
        );
      } else {
        console.warn(
          '[PreRenderingViewManager] ❌ Expected IframeView but got different view type'
        );
      }
      iframeElement.src = 'about:blank';

      // Update references
      attached.view.element = wrapperElement;
      const iframeView = attached.view as IframeView & {
        iframe?: HTMLIFrameElement;
        frame?: HTMLIFrameElement;
      };
      iframeView.iframe = iframeElement;
      iframeView.frame = iframeElement;

      // Attach to container
      if (this.container) {
        this.container.appendChild(wrapperElement);
      }

      // Add to collection
      if (mode === 'append') {
        this.views.append(attached.view);
      } else {
        this.views.prepend(attached.view);
      }

      // Update phantom
      this.updatePhantom(attached.width);

      return attached.view as IframeView;
    } finally {
      this._attaching = false;
    }
  }

  private updatePhantom(contentWidth: number): void {
    if (!this.container) return;

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

    const safeContentWidth = Math.max(contentWidth || 0, this.layout.width);
    phantomElement.style.width = safeContentWidth + 'px';

    // Force a reflow
    void phantomElement.offsetWidth;
  }

  private createWrapper(
    forceRight: boolean,
    attached?: PreRenderedChapter
  ): HTMLDivElement {
    const wrapperElement = document.createElement('div');
    wrapperElement.classList.add('epub-view');
    wrapperElement.setAttribute('ref', this.views._views.length.toString());

    const isSpreadView = this.layout && this.layout.divisor > 1;
    const viewportWidth = this.container?.clientWidth || 0;
    const viewportHeight = this.container?.clientHeight || 0;
    const containerWidth = this.container?.clientWidth || 900;

    if (isSpreadView) {
      const columnWidth =
        this.layout?.columnWidth || Math.floor(viewportWidth / 2);
      // For prerendered content, use the full content width to show all pages
      const wrapperWidth = attached?.width
        ? Math.max(attached.width, columnWidth)
        : columnWidth;
      wrapperElement.style.width = `${wrapperWidth}px`;
      wrapperElement.style.height = `${viewportHeight}px`;

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

    Object.assign(wrapperElement.style, {
      overflow: 'hidden',
      position: 'relative',
      display: 'block',
      flex: '0 0 auto',
      visibility: 'visible',
    });

    return wrapperElement;
  }

  private createIframe(
    forceRight: boolean,
    attached: PreRenderedChapter
  ): HTMLIFrameElement {
    const iframeElement = document.createElement('iframe');
    iframeElement.style.border = 'none';

    const iframeWidth = Math.max(attached.width || 0, this.layout.width);
    iframeElement.style.width = `${iframeWidth}px`;
    iframeElement.style.height = `${attached.height}px`;

    Object.assign(iframeElement.style, {
      overflow: 'hidden',
      overflowX: 'hidden',
      overflowY: 'hidden',
      background: 'transparent',
      visibility: 'visible',
      display: 'block',
      wordSpacing: '0px',
      lineHeight: 'normal',
    });

    iframeElement.setAttribute('sandbox', 'allow-same-origin');
    if (attached.view?.section?.properties?.includes('scripted')) {
      iframeElement.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    }

    const isSpreadView = this.layout && this.layout.divisor > 1;

    if (isSpreadView && forceRight && attached.pageCount > 1) {
      const singlePageWidth = Math.floor(attached.width / attached.pageCount);
      iframeElement.style.marginLeft = `-${singlePageWidth}px`;
      return iframeElement;
    }

    iframeElement.style.marginLeft = '0px';
    return iframeElement;
  }

  private extractContent(attached: PreRenderedChapter): string {
    if (attached.preservedContent) return attached.preservedContent;
    if (attached.preservedSrcdoc) return attached.preservedSrcdoc;

    try {
      const originalIframe = attached.element.querySelector(
        'iframe'
      ) as HTMLIFrameElement;
      if (originalIframe) {
        if (originalIframe.contentDocument?.documentElement) {
          return (
            '<!DOCTYPE html>' +
            originalIframe.contentDocument.documentElement.outerHTML
          );
        } else if (originalIframe.srcdoc) {
          return originalIframe.srcdoc;
        }
      }
    } catch (e) {
      console.warn('[PreRenderingViewManager] Error extracting content:', e);
    }
    return '';
  }

  override async append(
    section: Section,
    forceRight = false
  ): Promise<IframeView> {
    return (
      (await this.attachPrerendered(section, forceRight, 'append')) ??
      (super.append(section, forceRight) as Promise<IframeView>)
    );
  }

  override async prepend(
    section: Section,
    forceRight = false
  ): Promise<IframeView> {
    return (
      (await this.attachPrerendered(section, forceRight, 'prepend')) ??
      (super.prepend(section, forceRight) as Promise<IframeView>)
    );
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

    const current = locationInfo[0]!;
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

  override afterDisplayed(view: View | IframeView): void {
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

  override destroy(): void {
    this._preRenderer?.destroy();
    return super.destroy();
  }

  override render(
    element: HTMLElement,
    size?: { width: number; height: number }
  ): void {
    this.settings.overflow = 'hidden';
    this.overflow = 'hidden';

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

  override async resize(width?: string, height?: string, epubcfi?: string) {
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
      this.isRtlDirection() && this.settings['rtlScrollType'] === 'default';

    // Define scroll positions for next/prev in both directions
    const rtlOptions = { next: scrollWidth, prev: 0 };
    const ltrOptions = { next: 0, prev: scrollWidth - offsetWidth };

    const options = isRtlDefault ? rtlOptions : ltrOptions;
    const scrollPos = goForward ? options.next : options.prev;

    this.scrollTo(scrollPos, 0, true);
  }

  override async next(): Promise<void> {
    return this.navigate(true); // forward in reading order
  }

  override async prev(): Promise<void> {
    return this.navigate(false); // backward in reading order
  }
}

export default PreRenderingViewManager;
export { BookPreRenderer };
