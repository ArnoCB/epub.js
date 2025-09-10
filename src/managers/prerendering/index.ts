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
  private spine: Section[] | null = null;
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
    this.spine = options.spine || null;

    // Always set overflow to hidden
    this.settings.overflow = 'hidden';
    this.overflow = 'hidden';
  }

  // Helper to validate attached iframe content with a small wait and one retry
  // Override append to use prerendered chapters when available

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
          console.log(
            '[PreRenderingViewManager] Using PRERENDERED content for:',
            section.href
          );
          try {
            const w = window as unknown as Record<string, unknown>;
            if (!Array.isArray(w['__prerender_trace']))
              w['__prerender_trace'] = [];
            (w['__prerender_trace'] as string[]).push(
              'PreRenderingViewManager.append: ' +
                section.href +
                ' forceRight:' +
                forceRight
            );
          } catch (err) {
            void err;
          }

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

          // Add trace before views.append
          try {
            const w = window as unknown as Record<string, unknown>;
            if (!Array.isArray(w['__prerender_trace']))
              w['__prerender_trace'] = [];
            (w['__prerender_trace'] as string[]).push(
              'PreRenderingViewManager: BEFORE views.append'
            );
          } catch (err) {
            void err;
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

            console.log(
              '[PreRenderingViewManager] Setting up wrapper with widths:',
              'container:',
              this.container ? this.container.clientWidth : 'unknown',
              'attached.width:',
              attached.width,
              'safeContentWidth:',
              safeContentWidth
            );
            phantomElement.style.width = safeContentWidth + 'px';

            // Force a reflow to ensure the phantom element takes effect
            void phantomElement.offsetWidth;

            console.log(
              '[PreRenderingViewManager] Set phantom width to:',
              safeContentWidth
            );
          }

          // COMPLETE LAYOUT MATCHING APPROACH USING IFRAME CLONING
          // Instead of moving the prerendered iframe (which loses content),
          // we'll create a completely new iframe and copy the content

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

          console.log(
            '[PreRenderingViewManager] Width values:',
            'container:',
            containerWidth,
            'viewportWidth:',
            viewportWidth,
            'attached.width:',
            attached.width,
            'layout.width:',
            this.layout.width
          );

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
          iframeElement.onload = () => {
            try {
              const doc = iframeElement.contentDocument;
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

          console.log(
            '[PreRenderingViewManager] Created/updated elements with widths:',
            'phantom:',
            safeContentWidth + 'px',
            'wrapper:',
            wrapperElement.style.width,
            'iframe:',
            iframeElement.style.width,
            'layout.width:',
            this.layout.width
          );

          // Add trace after views.append
          try {
            const w = window as unknown as Record<string, unknown>;
            if (!Array.isArray(w['__prerender_trace']))
              w['__prerender_trace'] = [];
            (w['__prerender_trace'] as string[]).push(
              'PreRenderingViewManager: AFTER views.append'
            );
          } catch (err) {
            void err;
          }

          this._attaching = false; // Reset flag after successful attachment
          return attached.view as IframeView;
        } else {
          console.log(
            '[PreRenderingViewManager] No prerendered content for:',
            section.href,
            'using default'
          );
        }
      } finally {
        // Always reset attaching flag to ensure it's not left in active state
        this._attaching = false;
      }
    }

    // Fallback to DefaultViewManager
    return super.append(section, forceRight) as Promise<IframeView>;
  }

  // SIMPLIFIED: Use DefaultViewManager's logic completely
  async prepend(
    section: Section,
    forceRight: boolean = false
  ): Promise<IframeView> {
    console.log('[PreRenderingViewManager] PREPEND called for:', section.href);

    // Always delegate to DefaultViewManager for proper layout/scrolling/pagination
    return super.prepend(section, forceRight) as Promise<IframeView>;
  }

  // SIMPLIFIED: Use DefaultViewManager's logic completely
  async display(
    section: Section,
    target?: string | HTMLElement
  ): Promise<unknown> {
    console.log('[PreRenderingViewManager] DISPLAY called for:', section.href);

    // Always delegate to DefaultViewManager for proper layout/scrolling/pagination
    return super.display(section, target);
  }

  // Pre-rendering specific methods
  async startPreRendering(sections: Section[]): Promise<void> {
    if (!this.usePreRendering || !this._preRenderer) {
      return;
    }

    if (this._preRenderingStarted) {
      console.debug(
        '[PreRenderingViewManager] startPreRendering called but already started'
      );
      return;
    }

    this._preRenderingStarted = true;
    console.log(
      `[PreRenderingViewManager] Starting pre-rendering of ${sections.length} sections`
    );

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

  afterDisplayed(view: View | IframeView): void {
    // Check if this is a prerendered view that we just attached
    const isPrerenderedView =
      this._preRenderer &&
      view.section &&
      this._preRenderer.getChapter(view.section.href)?.attached === true;

    if (isPrerenderedView) {
      console.log(
        '[PreRenderingViewManager] PRESERVING layout for prerendered view:',
        view.section?.href
      );

      // Critical: emit the displayed event so the book knows the content is ready
      // but skip all the layout recalculations that would destroy our prerendered layout
      this.emit(EVENTS.MANAGERS.ADDED, view);

      // Skip the layout processing entirely - this prevents the DefaultViewManager's
      // normal layout algorithms from destroying our carefully preserved prerendered layout

      // IMPORTANT: Do not call super.afterDisplayed() for prerendered content
      return;
    }

    // For regular content, delegate to DefaultViewManager
    console.log(
      '[PreRenderingViewManager] Using default layout processing for non-prerendered view:',
      view.section?.href
    );
    super.afterDisplayed(view);
  }

  // Override destroy to clean up pre-renderer
  destroy(): void {
    console.log('[PreRenderingViewManager] Destroying pre-rendering manager');
    if (this._preRenderer) {
      this._preRenderer.destroy();
    }
    return super.destroy();
  }

  // Override render to initialize the BookPreRenderer once the container and
  // Only override render to initialize pre-renderer
  render(element: HTMLElement, size?: { width: number; height: number }): void {
    console.log(
      '[PreRenderingViewManager] render() called - delegating to DefaultViewManager'
    );

    // Ensure overflow is explicitly set to hidden
    this.settings.overflow = 'hidden';
    this.overflow = 'hidden';

    // Call parent render first
    super.render(element, size);

    // Initialize the pre-renderer now that the DOM container and viewSettings exist
    if (this.usePreRendering && !this._preRenderer && this.container) {
      console.log('[PreRenderingViewManager] Initializing BookPreRenderer');

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

      console.log('[PreRenderingViewManager] BookPreRenderer initialized');
    }
  }

  // Override resize to ensure proper handling of prerendered content during window resize
  async resize(width?: string, height?: string, epubcfi?: string) {
    console.log(
      '[PreRenderingViewManager] resize() called with width:',
      width,
      'height:',
      height
    );

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
          console.log(
            `[PreRenderingViewManager] Found prerendered view: ${view.section.href}`
          );
        }
      });

      // SIMPLIFIED: For prerendered content, just update the container dimensions without
      // trying to modify the prerendered content itself
      if (hasPrerenderedViews) {
        console.log(
          '[PreRenderingViewManager] Contains prerendered content - using simplified resize'
        );

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

        // Return early - don't touch the prerendered content
        return;
      }

      // For non-prerendered content, use the standard resize method
      console.log(
        '[PreRenderingViewManager] No prerendered content - using standard resize'
      );
      return super.resize(width, height, epubcfi);
    } catch (error) {
      console.error('[PreRenderingViewManager] Error during resize:', error);

      // If our custom resize fails, fall back to the default implementation
      return super.resize(width, height, epubcfi);
    } finally {
      // Always reset the attaching flag
      this._attaching = false;
      console.log('[PreRenderingViewManager] resize completed');
    }
  }
}

export default PreRenderingViewManager;
export {
  BookPreRenderer,
  PreRenderedChapter,
  PreRenderingStatus,
  ViewSettings,
} from '../prerenderer';
