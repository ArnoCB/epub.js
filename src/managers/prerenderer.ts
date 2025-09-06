import { defer } from '../utils/core';
import { Section } from '../section';
import IframeView from './views/iframe';
import { View } from './helpers/views';
import Layout, { Axis, Flow } from '../layout';
import EventEmitter from 'event-emitter';
import { EVENTS } from '../utils/constants';

export interface PreRenderedChapter {
  section: Section;
  view: View;
  element: HTMLElement;
  rendered: defer<View>;
  attached: boolean;
  width: number;
  height: number;
  pageCount: number;
  hasWhitePages: boolean;
  whitePageIndices: number[];
  // CFI-based page mapping for precise navigation and fixing "page off" issues
  // This enables accurate bookmarking, progress tracking, and smooth navigation
  pageMap?: Array<{
    index: number; // 1-based page index within the chapter
    startCfi?: string; // CFI at the start of this page for precise positioning
    endCfi?: string; // CFI at the end of this page for range calculations
    xOffset?: number; // horizontal offset for paginated flow
    yOffset?: number; // vertical offset for scrolled flow
  }>;
}

export interface ViewSettings {
  ignoreClass?: string;
  axis?: Axis;
  direction?: string;
  width: number;
  height: number;
  layout?: Layout;
  method?: string;
  forceRight?: boolean;
  allowScriptedContent?: boolean;
  allowPopups?: boolean;
  transparency?: boolean;
  forceEvenPages?: boolean;
  flow?: Flow;
}

export interface PreRenderingStatus {
  total: number;
  rendered: number;
  failed: number;
  chapters: Map<string, PreRenderedChapter>;
}

export class BookPreRenderer {
  on!: EventEmitter['on'];
  off!: EventEmitter['off'];
  emit!: EventEmitter['emit'];

  private container: HTMLElement;
  private offscreenContainer: HTMLElement;
  private unattachedStorage: DocumentFragment; // New: for long-term storage
  private viewSettings: ViewSettings;
  private chapters: Map<string, PreRenderedChapter>;
  private renderingPromises: Map<string, Promise<PreRenderedChapter>>;
  private request: (url: string) => Promise<Document>;
  private currentStatus: PreRenderingStatus;

  /*
   * CRITICAL BROWSER BEHAVIOR WARNING - IFRAME CONTENT LOSS ON DOM MOVES:
   *
   * WHY WE MUST USE IFRAMES (SECURITY REQUIREMENT):
   * EPUBs are untrusted content that can contain arbitrary JavaScript, CSS, and HTML.
   * Without iframe sandboxing, malicious EPUB content could:
   * - Execute scripts in the main document context and steal user data
   * - Access or modify the reader application's DOM and functionality
   * - Perform XSS attacks or redirect users to malicious sites
   * - Override global JavaScript objects and break the reader
   * - Access localStorage, cookies, and other sensitive browser APIs
   *
   * Iframes with sandbox attributes provide ESSENTIAL security isolation by:
   * - Running EPUB content in a separate, restricted browsing context
   * - Preventing access to the parent document's DOM and globals
   * - Limiting script execution and API access via sandbox policies
   * - Blocking potentially dangerous operations like form submission and popups
   *
   * HOWEVER, this security necessity creates a technical challenge because:
   *
   * When an iframe element is moved between different DOM containers using methods like:
   * - appendChild()
   * - insertBefore()
   * - removeChild() followed by appendChild()
   *
   * The browser will COMPLETELY RESET the iframe's content document, causing:
   * - iframe.contentDocument to become a fresh, empty document
   * - All rendered content (HTML, CSS, JavaScript state) to be lost
   * - iframe.srcdoc content to be cleared
   * - Any event listeners attached to the iframe content to be removed
   *
   * This behavior is consistent across all major browsers (Chrome, Firefox, Safari, Edge)
   * and is part of the HTML specification for iframe security and lifecycle management.
   *
   * IMPACT ON PRERENDERING:
   * Our prerendering system creates iframes with fully rendered EPUB content to provide:
   * - Instant page display (no loading delays)
   * - Accurate page counts for pagination and navigation
   * - Pre-calculated layout metrics and content dimensions
   * - Ability to inspect and analyze content before display
   * - Smooth navigation between chapters without rendering delays
   * - Precise CFI (Canonical Fragment Identifier) calculation for page boundaries
   *   to enable accurate navigation and fix "page off" jump issues
   *
   * However, when prerendered content needs to be displayed, it must be moved from
   * offscreen containers to the main viewing container. Each DOM move causes complete
   * content loss, requiring:
   *
   * 1. Content preservation before DOM moves (saving srcdoc/innerHTML)
   * 2. Content restoration after DOM moves (re-setting srcdoc or using document.write)
   * 3. Fallback mechanisms when restoration fails
   *
   * THIS APPROACH DEFEATS THE PURPOSE OF PRERENDERING because:
   * - Content must be re-rendered/reloaded, eliminating performance benefits
   * - Page layout calculations may need to be repeated
   * - CFI calculations become unreliable or need to be recalculated
   * - Loading delays are reintroduced during content restoration
   * - The "instant display" benefit is lost
   * - Restoration can fail, causing white pages or missing content
   *
   * ARCHITECTURAL ALTERNATIVES TO CONSIDER:
   * The current approach is fundamentally flawed. Better solutions would:
   *
   * 1. **CSS Positioning Approach**: Keep iframes in fixed containers and use CSS
   *    positioning/visibility for display (preserves all prerendering benefits)
   * 2. **Stable Container Strategy**: Never move iframes, only show/hide them in place
   * 3. **Content Cloning**: Create new iframes with cloned content instead of moving
   * 4. **Virtual Container System**: Use a container management system that doesn't
   *    require physical DOM moves
   * 5. **Layered Rendering**: Use CSS transforms/layers to bring content into view
   *    without DOM manipulation
   *
   * Any solution that avoids moving iframe elements would:
   * - Preserve the instant display benefits of prerendering
   * - Maintain accurate page counts and layout calculations
   * - Keep CFI calculations valid and enable precise page navigation
   * - Eliminate content restoration complexity and failure points
   * - Provide truly smooth navigation between chapters
   * - Keep the performance advantages that justify prerendering
   * - Enable advanced features like accurate bookmarking and progress tracking
   *
   * The current implementation attempts to work around this limitation through content
   * preservation and restoration, but this is inherently fragile and can fail in
   * edge cases, leading to white/empty pages that users may experience.
   */

  constructor(
    container: HTMLElement,
    viewSettings: ViewSettings,
    request: (url: string) => Promise<Document>
  ) {
    this.container = container;
    this.viewSettings = viewSettings;
    this.chapters = new Map();
    this.renderingPromises = new Map();
    this.request = request;

    // Create unattached storage for long-term prerendered content
    this.unattachedStorage = document.createDocumentFragment();

    this.currentStatus = {
      total: 0,
      rendered: 0,
      failed: 0,
      chapters: this.chapters,
    };

    this.offscreenContainer = document.createElement('div');
    this.offscreenContainer.style.position = 'absolute';
    this.offscreenContainer.style.top = '-9999px';
    this.offscreenContainer.style.left = '-9999px';
    this.offscreenContainer.style.width = viewSettings.width + 'px';
    this.offscreenContainer.style.height = viewSettings.height + 'px';
    this.offscreenContainer.style.overflow = 'hidden';
    this.offscreenContainer.style.visibility = 'hidden';

    document.body.appendChild(this.offscreenContainer);
    console.log('[BookPreRenderer] initialized with container:', container);
  }

  async preRenderBook(sections: Section[]): Promise<PreRenderingStatus> {
    console.log(
      '[BookPreRenderer] starting pre-render of',
      sections.length,
      'sections'
    );

    this.currentStatus = {
      total: sections.length,
      rendered: 0,
      failed: 0,
      chapters: this.chapters,
    };

    const BATCH_SIZE = 3;
    for (let i = 0; i < sections.length; i += BATCH_SIZE) {
      const batch = sections.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (section) => {
          try {
            await this.preRenderSection(section);
            this.currentStatus.rendered++;
            this.emit('added', this.currentStatus);
          } catch (error) {
            this.currentStatus.failed++;
            console.error(
              '[BookPreRenderer] failed to pre-render:',
              section.href,
              error
            );
          }
        })
      );
    }

    console.log(
      '[BookPreRenderer] pre-rendering complete:',
      this.currentStatus
    );
    this.emit('complete', this.currentStatus);
    return this.currentStatus;
  }

  private async preRenderSection(
    section: Section
  ): Promise<PreRenderedChapter> {
    const href = section.href;

    if (this.chapters.has(href)) {
      return this.chapters.get(href)!;
    }

    if (this.renderingPromises.has(href)) {
      await this.renderingPromises.get(href)!;
      return this.chapters.get(href)!;
    }

    const rendering = new defer<View>();
    const view = this.createView(section);

    const chapter: PreRenderedChapter = {
      section,
      view,
      element: view.element as HTMLElement,
      rendered: rendering,
      attached: false,
      width: this.viewSettings.width,
      height: this.viewSettings.height,
      pageCount: 0,
      hasWhitePages: false,
      whitePageIndices: [],
    };

    this.chapters.set(href, chapter);

    const renderPromise = this.renderView(view, chapter)
      .then((renderedView) => {
        rendering.resolve(renderedView);
        return chapter;
      })
      .catch((error) => {
        rendering.reject(error);
        throw error;
      });

    this.renderingPromises.set(href, renderPromise);

    try {
      await renderPromise;
      this.renderingPromises.delete(href);
      return chapter;
    } catch (error) {
      this.renderingPromises.delete(href);
      this.chapters.delete(href);
      throw error;
    }
  }

  private createView(section: Section): View {
    const view = new IframeView(section, this.viewSettings);

    // Add a small delay to ensure EventEmitter mixin is applied
    // This is a workaround for timing issues with the mixin
    setTimeout(() => {
      if (typeof view.on !== 'function') {
        console.warn(
          '[BookPreRenderer] EventEmitter methods still not available on view for:',
          section.href
        );
      }
    }, 0);

    view.onDisplayed = () => {};
    view.onResize = () => {};
    return view;
  }

  private async renderView(
    view: View,
    chapter: PreRenderedChapter
  ): Promise<View> {
    try {
      // Temporarily attach to offscreen container for rendering
      this.offscreenContainer.appendChild(chapter.element);
      const renderedView = await view.display(this.request);

      if (view.contents && view.contents.textWidth) {
        chapter.width = Math.max(
          view.contents.textWidth(),
          this.viewSettings.width
        );
      }

      this.analyzeContent(chapter);

      // Move to unattached storage for long-term storage (hybrid approach)
      if (chapter.element.parentNode === this.offscreenContainer) {
        this.offscreenContainer.removeChild(chapter.element);
      }
      this.unattachedStorage.appendChild(chapter.element);

      return renderedView as View;
    } catch (error) {
      if (chapter.element.parentNode === this.offscreenContainer) {
        this.offscreenContainer.removeChild(chapter.element);
      }
      throw error;
    }
  }

  private analyzeContent(chapter: PreRenderedChapter): void {
    try {
      const view = chapter.view;
      chapter.pageCount = 1;
      chapter.pageMap = undefined;

      if (view.contents && view.contents.document) {
        const doc = view.contents.document;
        const body = doc.body;

        if (body) {
          // Detect flow direction from viewSettings or layout
          const isPaginated =
            this.viewSettings.flow === 'paginated' ||
            this.viewSettings.axis === 'horizontal' ||
            (this.viewSettings.layout &&
              this.viewSettings.layout._flow === 'paginated');

          if (isPaginated) {
            // For paginated/horizontal flow: use content width vs viewport width
            const contentWidth = chapter.width; // Already calculated from textWidth()
            const viewportWidth = this.viewSettings.width;

            console.log(
              '[BookPreRenderer] paginated flow - contentWidth:',
              contentWidth,
              'viewportWidth:',
              viewportWidth
            );

            if (contentWidth > viewportWidth * 1.1) {
              chapter.pageCount = Math.ceil(contentWidth / viewportWidth);
            }

            // Build a simple page map with xOffsets and best-effort CFIs for page starts
            if (chapter.pageCount && chapter.pageCount > 0) {
              const pageMap = [] as NonNullable<PreRenderedChapter['pageMap']>;
              for (let i = 0; i < chapter.pageCount; i++) {
                const xOffset = i * viewportWidth;
                let startCfi: string | undefined;
                try {
                  // Try to compute CFI at page start using elementFromPoint
                  const rect = {
                    x: Math.min(xOffset + 1, contentWidth - 1),
                    y: 1,
                  };
                  // Translate to iframe coordinates if needed
                  const target = body.ownerDocument.elementFromPoint(
                    Math.max(0, rect.x),
                    Math.max(0, rect.y)
                  );
                  if (target) {
                    const range = doc.createRange();
                    range.selectNode(target);
                    // Prefer section.cfiFromRange
                    if (typeof chapter.section.cfiFromRange === 'function') {
                      startCfi = chapter.section.cfiFromRange(
                        range as unknown as Range
                      );
                    }
                  }
                } catch {
                  // ignore CFI failures
                }

                pageMap.push({ index: i + 1, startCfi, xOffset });
              }
              chapter.pageMap = pageMap;
            }
          } else {
            // For scrolled/vertical flow: use content height vs viewport height
            const contentHeight = body.scrollHeight;
            const viewportHeight = this.viewSettings.height;

            console.log(
              '[BookPreRenderer] scrolled flow - contentHeight:',
              contentHeight,
              'viewportHeight:',
              viewportHeight
            );

            if (contentHeight > viewportHeight * 0.8) {
              chapter.pageCount = Math.ceil(contentHeight / viewportHeight);
            }

            // Build a simple page map with yOffsets for vertical flow
            if (chapter.pageCount && chapter.pageCount > 0) {
              const pageMap = [] as NonNullable<PreRenderedChapter['pageMap']>;
              for (let i = 0; i < chapter.pageCount; i++) {
                const yOffset = i * viewportHeight;
                pageMap.push({ index: i + 1, yOffset });
              }
              chapter.pageMap = pageMap;
            }
          }

          // White page detection
          const textContent = body.textContent || '';
          const trimmedText = textContent.trim();

          if (trimmedText.length < 50) {
            const visibleElements = Array.from(
              body.querySelectorAll('*')
            ).filter((el) => {
              const style = doc.defaultView?.getComputedStyle(el);
              return (
                style &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0'
              );
            });

            if (visibleElements.length < 5 && trimmedText.length < 20) {
              chapter.whitePageIndices = [0];
              chapter.hasWhitePages = true;
            }
          }
        }
      }
    } catch (error) {
      console.warn(
        '[BookPreRenderer] content analysis failed for:',
        chapter.section.href,
        error
      );
      chapter.pageCount = 1;
      chapter.hasWhitePages = false;
      chapter.whitePageIndices = [];
    }
  }

  getChapter(sectionHref: string): PreRenderedChapter | undefined {
    return this.chapters.get(sectionHref);
  }

  getAllChapters(): PreRenderedChapter[] {
    return Array.from(this.chapters.values());
  }

  getStatus(): PreRenderingStatus {
    return this.currentStatus;
  }

  getDebugInfo() {
    const chapters = Array.from(this.chapters.entries()).map(
      ([href, chapter]) => ({
        href,
        attached: chapter.attached,
        width: chapter.width,
        height: chapter.height,
        pageCount: chapter.pageCount,
        hasWhitePages: chapter.hasWhitePages,
        whitePageIndices: chapter.whitePageIndices,
      })
    );

    return {
      totalChapters: this.chapters.size,
      renderingInProgress: this.renderingPromises.size,
      chapters,
    };
  }

  attachChapter(sectionHref: string): PreRenderedChapter | null {
    const chapter = this.chapters.get(sectionHref);
    if (!chapter) {
      console.warn(
        '[BookPreRenderer] chapter not found for attachment:',
        sectionHref
      );
      return null;
    }

    // If chapter is still being rendered, return null (let caller retry)
    if (this.renderingPromises.has(sectionHref)) {
      console.debug(
        '[BookPreRenderer] chapter still rendering, caller should retry:',
        sectionHref
      );
      return null;
    }

    if (chapter.attached) {
      console.debug('[BookPreRenderer] chapter already attached:', sectionHref);

      // Validate that the iframe still has content - sometimes iframe content gets cleared
      // especially with sandboxing or when elements are moved between containers
      try {
        const iframe = chapter.element.querySelector(
          'iframe'
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentDocument) {
          const body = iframe.contentDocument.body;
          const hasTextContent =
            body && (body.textContent || '').trim().length > 0;
          const hasHtmlStructure =
            body && (body.innerHTML || '').trim().length > 0;
          const isReady = iframe.contentDocument.readyState === 'complete';

          // Accept content if it has either text content OR HTML structure AND is ready
          // For white pages, be more lenient as they naturally have minimal content
          const isWhitePage = chapter.hasWhitePages;
          const hasValidContent =
            isReady &&
            (hasTextContent || hasHtmlStructure || (isWhitePage && body));

          if (!hasValidContent) {
            console.warn(
              '[BookPreRenderer] attached chapter has insufficient content, will attempt refresh:',
              sectionHref,
              'readyState:',
              iframe.contentDocument.readyState,
              'hasText:',
              hasTextContent,
              'hasHtml:',
              hasHtmlStructure,
              'isWhitePage:',
              isWhitePage
            );
            // Don't return early - let it go through attachment process to refresh content
          } else {
            return chapter;
          }
        } else {
          console.warn(
            '[BookPreRenderer] attached chapter iframe not accessible:',
            sectionHref
          );
          // Don't return early - let it go through attachment process
        }
      } catch (e) {
        console.warn(
          '[BookPreRenderer] error validating attached chapter content:',
          sectionHref,
          e
        );
        // Don't return early - let it go through attachment process
      }
    }

    try {
      // In spread/pre-paginated mode, we can have up to 2 chapters attached (left + right pages)
      // For non-spread mode, ensure only one chapter is attached at a time
      const attachedChapters = Array.from(this.chapters.values()).filter(
        (ch) => ch.attached
      );
      const isSpreadMode =
        this.viewSettings.layout &&
        (this.viewSettings.layout.name === 'pre-paginated' ||
          this.viewSettings.layout.spread);
      const maxAttachedChapters = isSpreadMode ? 2 : 1;

      if (attachedChapters.length >= maxAttachedChapters) {
        // If we're at capacity, detach the oldest attached chapter(s)
        for (
          let i = 0;
          i < attachedChapters.length - (maxAttachedChapters - 1);
          i++
        ) {
          const toDetach = attachedChapters[i];
          if (toDetach.section.href !== sectionHref) {
            console.debug(
              '[BookPreRenderer] detaching chapter to make room for new attachment:',
              toDetach.section.href
            );
            this.detachChapter(toDetach.section.href);
          }
        }
      }

      // Verify element exists and is properly rendered
      if (!chapter.element) {
        console.error(
          '[BookPreRenderer] chapter element is null:',
          sectionHref
        );
        return null;
      }

      // HYBRID APPROACH: Move from unattached storage through brief off-screen to final attachment
      // Step 1: Remove from current location (could be unattached storage, offscreen, or main container)
      if (chapter.element.parentNode) {
        /*
         * CRITICAL: DOM MOVE WILL DESTROY IFRAME CONTENT
         *
         * The following DOM operations will cause the iframe to lose all its content:
         * 1. removeChild() - Removes iframe from current container
         * 2. appendChild() - Adds iframe to new container
         *
         * Between these operations, the iframe's contentDocument becomes empty.
         * We must preserve the content before the move and restore it after.
         */

        // Before moving, preserve iframe content since DOM manipulation will clear it
        const iframe = chapter.element.querySelector(
          'iframe'
        ) as HTMLIFrameElement;
        let preservedSrcdoc: string | undefined;
        let preservedContent: string | undefined;

        if (iframe) {
          preservedSrcdoc = iframe.srcdoc;
          try {
            preservedContent =
              iframe.contentDocument?.documentElement?.outerHTML;
          } catch (e) {
            console.debug(
              '[BookPreRenderer] could not preserve iframe content:',
              e
            );
          }
        }

        chapter.element.parentNode.removeChild(chapter.element);
        console.debug('[BookPreRenderer] removed from container:', sectionHref);

        // After DOM move, restore content if iframe was cleared
        if (iframe && (preservedSrcdoc || preservedContent)) {
          try {
            const textContent =
              iframe.contentDocument?.body?.textContent?.trim() || '';
            const htmlContent =
              iframe.contentDocument?.body?.innerHTML?.trim() || '';
            const isReady = iframe.contentDocument?.readyState === 'complete';

            // Check if content is missing (for both regular and white pages)
            const hasValidContent =
              isReady && (textContent.length > 0 || htmlContent.length > 0);

            if (!hasValidContent) {
              console.debug(
                '[BookPreRenderer] iframe content lost during DOM move, restoring for:',
                sectionHref,
                'readyState:',
                iframe.contentDocument?.readyState,
                'textLength:',
                textContent.length,
                'htmlLength:',
                htmlContent.length
              );

              if (preservedSrcdoc) {
                iframe.srcdoc = preservedSrcdoc;

                // Force a reload by briefly setting src to about:blank then back to srcdoc
                iframe.src = 'about:blank';
                setTimeout(() => {
                  iframe.removeAttribute('src');
                  iframe.srcdoc = preservedSrcdoc;
                }, 0);
              } else if (preservedContent) {
                // Fallback: use document.write method
                try {
                  if (iframe.contentDocument) {
                    iframe.contentDocument.open();
                    iframe.contentDocument.write(preservedContent);
                    iframe.contentDocument.close();
                  }
                } catch (e) {
                  console.warn(
                    '[BookPreRenderer] document.write failed for:',
                    sectionHref,
                    e
                  );
                  // If document.write fails, try srcdoc approach with data URL
                  const encodedContent = encodeURIComponent(preservedContent);
                  iframe.src = `data:text/html;charset=utf-8,${encodedContent}`;
                }
              }
            }
          } catch (e) {
            console.warn(
              '[BookPreRenderer] error restoring iframe content for:',
              sectionHref,
              e
            );
          }
        }
      }

      // Step 2: Brief off-screen positioning for transition stability
      this.offscreenContainer.appendChild(chapter.element);

      // Step 3: Ensure proper dimensions and clear any problematic positioning
      if (chapter.element) {
        // Set the element width to match the pre-rendered width
        chapter.element.style.width = chapter.width + 'px';
        chapter.element.style.height = chapter.height + 'px';

        // Clear any problematic positioning that might persist
        chapter.element.style.position = 'static';
        chapter.element.style.left = '0px';
        chapter.element.style.top = '0px';
        chapter.element.style.visibility = 'visible';

        // Also set the iframe width if present
        const iframe = chapter.element.querySelector('iframe');
        if (iframe) {
          iframe.style.width = chapter.width + 'px';
          iframe.style.height = chapter.height + 'px';
        }

        console.debug(
          '[BookPreRenderer] prepared element for attachment:',
          chapter.width + 'x' + chapter.height,
          'for',
          sectionHref
        );
      }

      // Step 4: Keep in offscreen container until views system moves it
      // DO NOT remove from offscreen - let views.append() handle the DOM move
      // this.offscreenContainer.removeChild(chapter.element);

      // Mark as attached since it's ready to be used
      chapter.attached = true;

      // Reset any internal scroll positions in the attached element
      if (chapter.element.scrollLeft !== undefined) {
        chapter.element.scrollLeft = 0;
      }
      if (chapter.element.scrollTop !== undefined) {
        chapter.element.scrollTop = 0;
      }

      // Check if it's an iframe and reset its internal scroll as well
      const iframeElement = chapter.element.querySelector('iframe');
      if (iframeElement && iframeElement.contentWindow) {
        try {
          iframeElement.contentWindow.scrollTo(0, 0);
        } catch (e) {
          // Ignore cross-origin errors
          console.debug(
            '[BookPreRenderer] could not reset iframe scroll:',
            (e as Error).message
          );
        }
      }

      // Verify attachment worked - the element should not be in the pre-renderer container
      // It should be ready to be attached to the views system instead
      if (chapter.element.parentNode === this.container) {
        console.warn(
          '[BookPreRenderer] element still attached to pre-renderer container - this is not expected:',
          sectionHref
        );
      }

      this.emit(EVENTS.VIEWS.DISPLAYED, chapter.view);
      return chapter;
    } catch (error) {
      console.error(
        '[BookPreRenderer] failed to attach chapter:',
        sectionHref,
        error
      );
      chapter.attached = false;
      return null;
    }
  }

  detachChapter(sectionHref: string): PreRenderedChapter | null {
    const chapter = this.chapters.get(sectionHref);
    if (!chapter || !chapter.attached) {
      return null;
    }

    // Remove from whatever container it's currently in
    if (chapter.element.parentNode) {
      chapter.element.parentNode.removeChild(chapter.element);
    }

    // HYBRID APPROACH: Store in unattached storage instead of offscreen container
    this.unattachedStorage.appendChild(chapter.element);
    chapter.attached = false;

    console.log(
      '[BookPreRenderer] detached chapter and moved to unattached storage:',
      sectionHref
    );
    this.emit(EVENTS.VIEWS.HIDDEN, chapter.view);
    return chapter;
  }

  destroy(): void {
    console.log('[BookPreRenderer] destroying pre-renderer');

    this.chapters.forEach((chapter) => {
      if (chapter.element.parentNode) {
        chapter.element.parentNode.removeChild(chapter.element);
      }
    });

    if (this.offscreenContainer.parentNode) {
      this.offscreenContainer.parentNode.removeChild(this.offscreenContainer);
    }

    this.chapters.clear();
    this.renderingPromises.clear();
  }
}

EventEmitter(BookPreRenderer.prototype);
export default BookPreRenderer;
