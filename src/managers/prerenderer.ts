import type {
  ChapterPageInfo,
  ChapterDimensions,
  ViewSettings,
  PreRenderingStatus,
  EventEmitterMethods,
  PreRenderedChapter,
} from '../types';
import { defer } from '../utils';
import { Section } from '../section';
import { View } from './helpers/views';
import Layout from '../layout';
import EventEmitter from 'event-emitter';
import { EVENTS } from '../utils/constants';
import { ViewRenderer } from './helpers/view-renderer';
import Contents from '../contents';
import { CfiResolver } from './helpers/cfi-resolver';
import { PageMapGenerator } from './helpers/page-map-generator';

export class BookPreRenderer {
  on!: EventEmitterMethods['on'];
  off!: EventEmitterMethods['off'];
  emit!: EventEmitterMethods['emit'];

  // private container: HTMLElement;
  private offscreenContainer: HTMLElement;
  private unattachedStorage: DocumentFragment;
  private viewSettings: ViewSettings;
  private viewRenderer: ViewRenderer;
  private pageMapGenerator: PageMapGenerator;
  private chapters: Map<string, PreRenderedChapter>;
  private renderingPromises: Map<string, Promise<PreRenderedChapter>>;
  private request: (url: string) => Promise<Document>;
  private currentStatus: PreRenderingStatus;
  private _completeEmitted: boolean = false;

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
    // this.container = container;
    this.viewSettings = viewSettings;
    this.chapters = new Map();
    this.renderingPromises = new Map();
    this.request = request;

    // Initialize ViewRenderer with the same settings
    this.viewRenderer = new ViewRenderer(
      {
        ignoreClass: viewSettings.ignoreClass || '',
        axis: viewSettings.axis,
        direction: viewSettings.direction,
        width: viewSettings.width,
        height: viewSettings.height,
        layout: viewSettings.layout,
        method: viewSettings.method,
        forceRight: viewSettings.forceRight || false,
        allowScriptedContent: viewSettings.allowScriptedContent || false,
        allowPopups: viewSettings.allowPopups || false,
        transparency: viewSettings.transparency,
        forceEvenPages: viewSettings.forceEvenPages,
        flow: viewSettings.flow,
      },
      request
    );

    // Initialize helpers
    const cfiResolver = new CfiResolver();
    this.pageMapGenerator = new PageMapGenerator(cfiResolver);

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
  }

  async preRenderBook(sections: Section[]): Promise<PreRenderingStatus> {
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

            // After a section is prerendered, recompute global page numbers so
            // each chapter.pageMap.pageNumber reflects its position in the book
            // using the order of `sections`. This uses already-rendered chapters
            // (those present in this.chapters) and is safe to call multiple times.
            try {
              this.assignGlobalPageNumbers(sections);
            } catch (e) {
              console.debug(
                '[BookPreRenderer] assignGlobalPageNumbers failed:',
                e
              );
            }

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

    if (!this._completeEmitted) {
      this._completeEmitted = true;
      this.emit('complete', this.currentStatus);
    }

    return this.currentStatus;
  }

  // Public methods for chapter access
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
        ...({
          width: chapter.width,
          height: chapter.height,
        } as ChapterDimensions),
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

    // Prepare a per-chapter deferred that resolves when pageNumbers are assigned
    const pageNumbersDeferred = new defer<void>();
    chapter.pageNumbersDeferred = pageNumbersDeferred;
    chapter.pageNumbersAssigned = pageNumbersDeferred.promise;

    this.chapters.set(href, chapter);

    const renderPromise = this.renderView(view, chapter)
      .then((renderedView) => {
        rendering.resolve(renderedView);
        return chapter;
      })
      .catch((error) => {
        console.error('[BookPreRenderer] renderView failed for:', href, error);
        rendering.reject(error);
        throw error;
      });

    this.renderingPromises.set(href, renderPromise);

    try {
      await renderPromise;
      this.renderingPromises.delete(href);
      return chapter;
    } catch (error) {
      console.error(
        '[BookPreRenderer] preRenderSection failed for:',
        href,
        error
      );
      this.renderingPromises.delete(href);
      this.chapters.delete(href);
      throw error;
    }
  }

  private createView(section: Section): View {
    const view = this.viewRenderer.createView(section);

    // Set up minimal event handlers
    view.onDisplayed = () => {};
    view.onResize = () => {};

    // Ensure the view is sized to match the target container dimensions
    // This is critical for consistent layout between pre-rendering and display
    view.size(this.viewSettings.width, this.viewSettings.height);

    return view;
  }

  /**
   * Wait for layout to settle before querying element positions
   */
  private async waitForLayout(doc: Document, ticks = 2): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        const win = doc.defaultView;
        if (!win) return resolve();
        let count = 0;
        const step = () => {
          count += 1;
          if (count >= ticks) return resolve();
          win.requestAnimationFrame(step);
        };
        win.requestAnimationFrame(step);
      } catch {
        resolve();
      }
    });
  }

  /**
   * Simple content analysis using PageMapGenerator
   */
  private async performAsyncContentAnalysis(
    chapter: PreRenderedChapter,
    view: View
  ): Promise<ChapterPageInfo> {
    try {
      // Use the simple PageMapGenerator
      const result = await this.pageMapGenerator.generatePageMap(
        view,
        chapter.section,
        this.viewSettings.width,
        this.viewSettings.height
      );

      return {
        pageCount: result.pageCount,
        pageMap: result.pageMap,
        hasWhitePages: result.hasWhitePages,
        whitePageIndices: result.whitePageIndices,
      };
    } catch (error) {
      console.error(
        '[BookPreRenderer] Content analysis failed:',
        chapter.section.href,
        error
      );
      return {
        pageCount: 1,
        pageMap: [
          {
            index: 1,
            startCfi: chapter.section.cfiBase || null,
            endCfi: null,
            xOffset: 0,
          },
        ],
        hasWhitePages: false,
        whitePageIndices: [],
      };
    }
  }

  private async renderView(
    view: View,
    chapter: PreRenderedChapter
  ): Promise<View> {
    const href = chapter.section.href;

    try {
      // Attach to offscreen container for rendering
      this.offscreenContainer.appendChild(chapter.element);

      // Render the view
      const renderedView = await view.display(this.request);

      // Measure content dimensions after rendering
      if (view.contents && view.contents.textWidth) {
        chapter.width = view.contents.textWidth();
      } else {
        chapter.width = this.viewSettings.width;
      }

      chapter.height = this.viewSettings.height;

      // Wait for layout to settle before analyzing content
      if (view.contents?.document) {
        await this.waitForLayout(view.contents.document, 3);
      }

      // Analyze content with better error handling
      const analysisResult = await this.performAsyncContentAnalysis(
        chapter,
        view
      );

      // Update chapter with analysis results
      chapter.pageCount = analysisResult.pageCount;
      chapter.pageMap = analysisResult.pageMap;
      chapter.hasWhitePages = analysisResult.hasWhitePages;
      chapter.whitePageIndices = analysisResult.whitePageIndices;
      // Ensure preservation waits for iframe readiness before reading document
      await this.preserveChapterContent(chapter);

      // Move to unattached storage
      if (chapter.element.parentNode === this.offscreenContainer) {
        this.offscreenContainer.removeChild(chapter.element);
      }

      this.unattachedStorage.appendChild(chapter.element);

      return renderedView as View;
    } catch (error) {
      console.error('[BookPreRenderer] renderView FAILED for:', href, error);
      if (chapter.element.parentNode === this.offscreenContainer) {
        this.offscreenContainer.removeChild(chapter.element);
      }
      throw error;
    }
  }

  /**
   * Enhanced content preservation for reliable iframe restoration
   */
  private async preserveChapterContent(
    chapter: PreRenderedChapter
  ): Promise<void> {
    const iframe = chapter.element.querySelector('iframe') as HTMLIFrameElement;
    if (!iframe) return;

    // Helper: wait for iframe to report readyState 'complete' or for load event
    const waitForIframeReady = (frame: HTMLIFrameElement, timeout = 1000) =>
      new Promise<boolean>((resolve) => {
        try {
          const doc = frame.contentDocument;
          if (doc && doc.readyState === 'complete') return resolve(true);

          let settled = false;
          const onLoad = () => {
            if (settled) return;
            settled = true;
            cleanup();
            resolve(true);
          };

          const cleanup = () => {
            try {
              frame.removeEventListener('load', onLoad);
            } catch {
              // Ignore errors
            }

            if (timer) clearTimeout(timer);
          };

          frame.addEventListener('load', onLoad);
          // Poll readyState as a fallback for cases where load isn't fired
          const interval = 50;
          let elapsed = 0;
          const poll = () => {
            try {
              const d = frame.contentDocument;
              if (d && d.readyState === 'complete') {
                if (!settled) {
                  settled = true;
                  cleanup();
                  return resolve(true);
                }
              }
            } catch {
              // ignore cross-origin access errors
            }

            elapsed += interval;
            if (elapsed >= timeout) {
              if (!settled) {
                settled = true;
                cleanup();
                return resolve(false);
              }
            } else {
              timer = setTimeout(poll, interval) as unknown as number;
            }
          };

          let timer = setTimeout(poll, interval) as unknown as number;
        } catch {
          return resolve(false);
        }
      });

    try {
      // Preserve srcdoc attribute immediately where available
      chapter.preservedSrcdoc = iframe.srcdoc;

      // Wait briefly for iframe document to become available/complete before reading
      const ready = await waitForIframeReady(iframe, 1000);
      if (ready && iframe.contentDocument?.documentElement) {
        // Reading may fail for cross-origin or other reasons — let outer try handle it
        chapter.preservedContent =
          iframe.contentDocument.documentElement.outerHTML;
      }
    } catch {
      // Only catch actual errors preserving iframe content
      console.error('Failed to preserve iframe content');
    }
  }

  /**
   * Restore iframe content after DOM moves
   */
  private restoreChapterContent(chapter: PreRenderedChapter): boolean {
    const iframe = chapter.element.querySelector('iframe') as HTMLIFrameElement;
    if (!iframe) return false;

    try {
      const textContent =
        iframe.contentDocument?.body?.textContent?.trim() || '';
      const htmlContent = iframe.contentDocument?.body?.innerHTML?.trim() || '';
      const isReady = iframe.contentDocument?.readyState === 'complete';

      // Check if content is missing
      const hasValidContent =
        isReady && (textContent.length > 0 || htmlContent.length > 0);

      if (
        !hasValidContent &&
        (chapter.preservedSrcdoc || chapter.preservedContent)
      ) {
        console.debug(
          '[BookPreRenderer] restoring iframe content for:',
          chapter.section.href
        );

        if (chapter.preservedSrcdoc) {
          // Use preserved srcdoc (already ensured to contain marker during preservation)
          const markedContent = chapter.preservedSrcdoc;
          iframe.srcdoc = markedContent;

          // Force reload to ensure content is properly set
          iframe.src = 'about:blank';
          setTimeout(() => {
            iframe.removeAttribute('src');
            iframe.srcdoc = markedContent;
          }, 0);
        } else if (chapter.preservedContent) {
          // Fallback: use document.write method
          if (iframe.contentDocument) {
            iframe.contentDocument.open();
            // preservedContent was normalized during preserve to include marker
            iframe.contentDocument.write(chapter.preservedContent);
            iframe.contentDocument.close();
          }
        }
        return true;
      }

      return false;
    } catch (e) {
      console.warn('[BookPreRenderer] error restoring iframe content:', e);
      return false;
    }
  }

  /**
   * Public helper to attempt restore for a chapter by href and validate result
   * Returns true if content is present after restore, false otherwise
   */
  public async tryRestoreContent(sectionHref: string): Promise<boolean> {
    const chapter = this.chapters.get(sectionHref);
    if (!chapter) return false;

    try {
      const restored = this.restoreChapterContent(chapter);

      // Validate iframe content after waiting a short while for loads
      const iframe = chapter.element.querySelector(
        'iframe'
      ) as HTMLIFrameElement | null;

      let hasValidContent = false;
      try {
        if (iframe && iframe.contentDocument) {
          const body = iframe.contentDocument.body;
          const txt = body ? (body.textContent || '').trim() : '';
          const html = body ? (body.innerHTML || '').trim() : '';
          const isReady = iframe.contentDocument.readyState === 'complete';
          hasValidContent =
            isReady &&
            (txt.length > 0 || html.length > 0 || chapter.hasWhitePages);
        }
      } catch (e) {
        console.debug(
          '[BookPreRenderer] tryRestoreContent: cannot access iframe content due to cross-origin or other error',
          e
        );
        hasValidContent = false;
      }

      return hasValidContent || restored;
    } catch (e) {
      console.warn(
        '[BookPreRenderer] tryRestoreContent failed for',
        sectionHref,
        e
      );
      return false;
    }
  }

  /**
   * Returns a promise that resolves when page numbering (pageNumber on pageMap)
   * has been assigned for the given section href. Returns null if chapter is
   * not known.
   */
  public getPageNumbering(sectionHref: string): Promise<void> | null {
    const chapter = this.chapters.get(sectionHref);
    if (!chapter) return null;
    if (!chapter.pageNumbersAssigned) return null;
    return chapter.pageNumbersAssigned;
  }

  public attachChapter(sectionHref: string): PreRenderedChapter | null {
    const chapter = this.chapters.get(sectionHref);

    if (!chapter) return null;

    // If chapter is still being rendered, return null (let caller retry)
    if (this.renderingPromises.has(sectionHref)) return null;

    if (chapter.attached) {
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

          if (hasValidContent) {
            return chapter;
          }
        }
      } catch (e) {
        console.warn(
          '[BookPreRenderer] error validating attached chapter content:',
          sectionHref,
          e
        );
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

      // CLONE-ON-ATTACH: Create a fresh wrapper and iframe from preserved content
      // to avoid moving the original prerendered iframe (which loses content on DOM moves).
      const displayWrapper = document.createElement('div');
      displayWrapper.classList.add('epub-view');

      // For paginated content, set wrapper to full width so container can detect scrollable content
      const dims: ChapterDimensions = {
        width: chapter.width,
        height: chapter.height,
      };
      displayWrapper.style.width = dims.width + 'px';
      displayWrapper.style.height = dims.height + 'px';
      displayWrapper.style.overflow = 'hidden';
      displayWrapper.style.position = 'relative';
      displayWrapper.style.display = 'block';

      // Create a new iframe for display
      const newIframe = document.createElement('iframe') as HTMLIFrameElement;
      newIframe.scrolling = 'no';
      newIframe.style.border = 'none';
      const iframeDims: ChapterDimensions = {
        width: chapter.width,
        height: chapter.height,
      };
      newIframe.style.width = iframeDims.width + 'px';
      newIframe.style.height = iframeDims.height + 'px';
      newIframe.sandbox = 'allow-same-origin';

      if ((this.viewSettings as ViewSettings).allowScriptedContent) {
        newIframe.sandbox += ' allow-scripts';
      }

      if ((this.viewSettings as ViewSettings).allowPopups) {
        newIframe.sandbox += ' allow-popups';
      }

      // Populate iframe from preservedSrcdoc or preservedContent
      try {
        if (chapter.preservedSrcdoc) {
          newIframe.srcdoc = chapter.preservedSrcdoc;
        } else if (chapter.preservedContent) {
          // write will run after iframe is added to DOM; we add a load listener
          newIframe.src = 'about:blank';
          newIframe.addEventListener('load', () => {
            try {
              const doc = newIframe.contentDocument;
              if (doc) {
                doc.open();
                doc.write(chapter.preservedContent!);
                doc.close();
              }
            } catch (e) {
              console.warn(
                '[BookPreRenderer] clone-on-attach: could not write preserved content to iframe',
                e
              );
            }
          });
        }
      } catch (e) {
        console.warn(
          '[BookPreRenderer] clone-on-attach: failed to set iframe content',
          e
        );
      }

      displayWrapper.appendChild(newIframe);

      // Create a proper IframeView instance for the cloned element
      // This ensures all IframeView methods like setLayout() are available
      const clonedView = this.viewRenderer.createView(chapter.section);

      // Replace the IframeView's element with our cloned element
      clonedView.element = displayWrapper;

      // Update the view's internal iframe reference to point to our new iframe
      // We need to access internal properties to properly initialize the cloned view
      const iframeView = clonedView as unknown as {
        iframe?: HTMLIFrameElement;
        frame?: HTMLIFrameElement;
        _width: number;
        _height: number;
        displayed: boolean;
        rendered: boolean;
        lockedWidth?: number;
        lockedHeight?: number;
        fixedWidth?: number;
        fixedHeight?: number;
        contents?: Contents;
      };

      iframeView.iframe = newIframe;
      iframeView.frame = newIframe;

      // Set the display state since content is already rendered
      iframeView.displayed = true;
      iframeView.rendered = true;

      // Set the dimensions to match the pre-rendered content
      // Since we're now pre-rendering with correct target dimensions, use those dimensions
      iframeView._width = this.viewSettings.width;
      iframeView._height = this.viewSettings.height;
      iframeView.lockedWidth = this.viewSettings.width;
      iframeView.lockedHeight = this.viewSettings.height;
      iframeView.fixedWidth = this.viewSettings.width;
      iframeView.fixedHeight = this.viewSettings.height;

      // Update the wrapper and iframe to use the same dimensions as pre-rendering
      displayWrapper.style.width = this.viewSettings.width + 'px';
      displayWrapper.style.height = this.viewSettings.height + 'px';
      newIframe.style.width = this.viewSettings.width + 'px';
      newIframe.style.height = this.viewSettings.height + 'px';

      // Add essential IframeView methods to the cloned view for proper layout support
      const originalExpand = clonedView.expand?.bind(clonedView);
      clonedView.expand = () => {
        // For cloned views, maintain the container dimensions since content is pre-rendered correctly
        if (originalExpand) {
          originalExpand();
        }

        // Ensure dimensions remain as container dimensions
        if (newIframe) {
          newIframe.style.width = this.viewSettings.width + 'px';
          newIframe.style.height = this.viewSettings.height + 'px';
        }
      };

      const originalSize = clonedView.size?.bind(clonedView);
      clonedView.size = (width?: number, height?: number) => {
        // Use container dimensions unless explicitly overridden
        const finalWidth = width ?? this.viewSettings.width;
        const finalHeight = height ?? this.viewSettings.height;

        if (originalSize) {
          originalSize(finalWidth, finalHeight);
        }

        // Update internal dimensions
        iframeView._width = finalWidth;
        iframeView._height = finalHeight;
        iframeView.lockedWidth = finalWidth;
        iframeView.lockedHeight = finalHeight;

        // Update iframe dimensions
        if (newIframe) {
          newIframe.style.width = finalWidth + 'px';
          newIframe.style.height = finalHeight + 'px';
        }
      };

      // Add width/height methods that return the current dimensions
      clonedView.width = () => iframeView._width;
      clonedView.height = () => iframeView._height;

      const attachedChapter: PreRenderedChapter = {
        section: chapter.section,
        view: clonedView, // Now a proper IframeView with all methods
        element: displayWrapper,
        rendered: chapter.rendered,
        attached: false,
        width: chapter.width,
        height: chapter.height,
        pageCount: chapter.pageCount,
        hasWhitePages: chapter.hasWhitePages,
        whitePageIndices: chapter.whitePageIndices,
        preservedSrcdoc: chapter.preservedSrcdoc,
        preservedContent: chapter.preservedContent,
        pageMap: chapter.pageMap,
      };

      // Notify listeners about the cloned view being available (non-destructive)
      try {
        // Emit DISPLAYED once the clone iframe reports loaded/ready.
        const emitDisplayedWhenReady = (frame: HTMLIFrameElement) => {
          try {
            let settled = false;
            const onLoad = () => {
              if (settled) return;
              settled = true;
              cleanup();
              try {
                attachedChapter.attached = true;

                // Initialize cloned view contents so features that depend on it
                // (like highlighting) work correctly. The cloned iframe already
                // contains the preserved content, so we can create a Contents
                // instance that points at the clone's document.
                try {
                  const doc = frame.contentDocument;
                  if (doc) {
                    // Attach window/document/contents to the cloned view
                    const v = attachedChapter.view as unknown as {
                      window?: Window | undefined;
                      document?: Document;
                      contents?: Contents;
                      displayed?: boolean;
                      rendered?: boolean;
                      expand?: () => void;
                      layout?: Layout | undefined;
                    };

                    v.window = (frame.contentWindow as Window) || undefined;
                    v.document = doc;
                    v.contents = new Contents(
                      doc,
                      doc.body as HTMLBodyElement,
                      chapter.section.cfiBase,
                      chapter.section.index
                    );

                    // Wire contents events to mimic IframeView behaviour
                    v.contents.on(EVENTS.CONTENTS.EXPAND, () => {
                      if (v.displayed) {
                        try {
                          if (typeof v.expand === 'function') v.expand();
                          if (v.contents && v.layout) {
                            v.layout.format(v.contents);
                          }
                        } catch {
                          // ignore
                        }
                      }
                    });

                    v.contents.on(EVENTS.CONTENTS.RESIZE, () => {
                      if (v.displayed) {
                        try {
                          if (typeof v.expand === 'function') v.expand();
                          if (v.contents && v.layout) {
                            v.layout.format(v.contents);
                          }
                        } catch {
                          // ignore
                        }
                      }
                    });

                    v.rendered = true;
                    v.displayed = true;
                  }
                } catch {
                  console.debug(
                    '[BookPreRenderer] init cloned contents failed'
                  );
                }

                this.emit(EVENTS.VIEWS.DISPLAYED, attachedChapter.view);
              } catch (err) {
                console.debug(
                  '[BookPreRenderer] error emitting DISPLAYED after load:',
                  err
                );
              }
            };

            const cleanup = () => {
              try {
                frame.removeEventListener('load', onLoad);
              } catch {
                // ignore
              }
              if (timer) clearTimeout(timer);
            };

            frame.addEventListener('load', onLoad);

            // Fallback: poll readyState for up to 1000ms
            const interval = 50;
            let elapsed = 0;
            const poll = () => {
              try {
                const d = frame.contentDocument;
                if (d && d.readyState === 'complete') {
                  onLoad();
                  return;
                }
              } catch {
                // ignore cross-origin access errors
              }
              elapsed += interval;
              if (elapsed >= 1000) {
                // timeout - still emit but mark as possibly incomplete
                if (!settled) {
                  settled = true;
                  cleanup();
                  try {
                    attachedChapter.attached = true;
                    this.emit(EVENTS.VIEWS.DISPLAYED, attachedChapter.view);
                  } catch (err) {
                    console.debug(
                      '[BookPreRenderer] error emitting DISPLAYED after timeout:',
                      err
                    );
                  }
                }
              } else {
                timer = setTimeout(poll, interval) as unknown as number;
              }
            };

            let timer = setTimeout(poll, interval) as unknown as number;
          } catch {
            // If anything goes wrong, emit immediately as a fallback
            try {
              attachedChapter.attached = true;
              this.emit(EVENTS.VIEWS.DISPLAYED, attachedChapter.view);
            } catch (err2) {
              console.debug(
                '[BookPreRenderer] emitDisplayedWhenReady fallback failed:',
                err2
              );
            }
          }
        };

        emitDisplayedWhenReady(newIframe);
      } catch (e) {
        console.debug(
          `[BookPreRenderer] error emitting DISPLAYED for clone: ${e}`
        );
      }

      return attachedChapter;
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

    if (!chapter || !chapter.attached) return null;

    // Remove from whatever container it's currently in
    if (chapter.element.parentNode) {
      chapter.element.parentNode.removeChild(chapter.element);
    }

    // Store in unattached storage instead of offscreen container
    this.unattachedStorage.appendChild(chapter.element);
    chapter.attached = false;

    this.emit(EVENTS.VIEWS.HIDDEN, chapter.view);
    return chapter;
  }

  /**
   * Assign cumulative page numbers across the book for all prerendered chapters.
   * This walks the provided sections in order and sums pageCount for already
   * prerendered chapters to produce a global pageNumber for each page entry.
   */
  private assignGlobalPageNumbers(sections: Section[]) {
    let cumulative = 0;
    for (const sec of sections) {
      const href = sec.href;
      const chapter = this.chapters.get(href);
      if (!chapter) continue;

      if (chapter.pageMap && chapter.pageMap.length > 0) {
        for (let i = 0; i < chapter.pageMap.length; i++) {
          const entry = chapter.pageMap[i];
          entry.pageNumber = cumulative + entry.index; // index is 1-based
        }

        cumulative += chapter.pageCount || chapter.pageMap.length || 0;
      } else {
        // No pageMap yet; still advance cumulative by pageCount if known
        if (typeof chapter.pageCount === 'number' && chapter.pageCount > 0) {
          cumulative += chapter.pageCount;
        }
      }

      // Resolve any per-chapter deferred indicating pageNumbers have been assigned
      try {
        if (chapter.pageNumbersDeferred) {
          chapter.pageNumbersDeferred.resolve();
          delete chapter.pageNumbersDeferred;
        }
      } catch {
        // ignore
      }
    }
  }

  destroy(): void {
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
