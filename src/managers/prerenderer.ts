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
  // Optional per-page map for fast CFI->page lookup and offsets
  pageMap?: Array<{
    index: number; // 1-based page index within the chapter
    startCfi?: string;
    endCfi?: string;
    xOffset?: number; // for horizontal/paginated
    yOffset?: number; // for vertical/scrolled
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
  private viewSettings: ViewSettings;
  private chapters: Map<string, PreRenderedChapter>;
  private renderingPromises: Map<string, Promise<PreRenderedChapter>>;
  private request: (url: string) => Promise<Document>;
  private currentStatus: PreRenderingStatus;

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
            console.log(
              '[BookPreRenderer] successfully pre-rendered:',
              section.href
            );
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

    console.log('[BookPreRenderer] pre-rendering section:', href);

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

    view.onDisplayed = () => {
      console.log('[BookPreRenderer] view displayed for:', section.href);
    };
    view.onResize = () => {
      console.log('[BookPreRenderer] view resized for:', section.href);
    };
    return view;
  }

  private async renderView(
    view: View,
    chapter: PreRenderedChapter
  ): Promise<View> {
    try {
      this.offscreenContainer.appendChild(chapter.element);
      const renderedView = await view.display(this.request);

      if (view.contents && view.contents.textWidth) {
        chapter.width = Math.max(
          view.contents.textWidth(),
          this.viewSettings.width
        );
      }

      this.analyzeContent(chapter);

      console.log(
        '[BookPreRenderer] rendered:',
        chapter.section.href,
        'pages:',
        chapter.pageCount,
        'white pages:',
        chapter.hasWhitePages ? chapter.whitePageIndices.join(',') : 'none'
      );

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

    if (chapter.attached) {
      console.debug('[BookPreRenderer] chapter already attached:', sectionHref);
      return chapter;
    }

    try {
      // Ensure only one chapter is marked as attached at a time
      // Detach any other previously attached chapters in our registry
      for (const [href, ch] of this.chapters.entries()) {
        if (href !== sectionHref && ch.attached) {
          ch.attached = false;
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

      // Remove from offscreen container if needed
      if (chapter.element.parentNode === this.offscreenContainer) {
        this.offscreenContainer.removeChild(chapter.element);
        console.debug(
          '[BookPreRenderer] removed from offscreen container:',
          sectionHref
        );
      }

      // Ensure the chapter element maintains its pre-rendered dimensions
      if (chapter.element) {
        // Set the element width to match the pre-rendered width
        chapter.element.style.width = chapter.width + 'px';
        chapter.element.style.height = chapter.height + 'px';

        // Also set the iframe width if present
        const iframe = chapter.element.querySelector('iframe');
        if (iframe) {
          iframe.style.width = chapter.width + 'px';
          iframe.style.height = chapter.height + 'px';
        }

        console.debug(
          '[BookPreRenderer] set element dimensions to match pre-rendered size:',
          chapter.width + 'x' + chapter.height,
          'for',
          sectionHref
        );
      }

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

      // Debug: Log element positioning after attachment
      console.log('[BookPreRenderer] element attached - debug info:');
      console.log('  href:', sectionHref);
      console.log('  elementWidth:', chapter.element.offsetWidth);
      console.log('  elementHeight:', chapter.element.offsetHeight);
      console.log('  elementScrollWidth:', chapter.element.scrollWidth);
      console.log('  elementScrollHeight:', chapter.element.scrollHeight);
      console.log('  elementScrollLeft:', chapter.element.scrollLeft);
      console.log('  elementScrollTop:', chapter.element.scrollTop);
      console.log('  chapterWidth:', chapter.width);
      console.log('  chapterHeight:', chapter.height);
      console.log('  pageCount:', chapter.pageCount);

      // Also check iframe content if available (reuse the iframe element)
      if (
        iframeElement &&
        iframeElement.contentWindow &&
        iframeElement.contentDocument
      ) {
        try {
          const doc = iframeElement.contentDocument;
          const body = doc.body;
          console.log('  iframe body scrollLeft:', body?.scrollLeft || 'N/A');
          console.log('  iframe body scrollTop:', body?.scrollTop || 'N/A');
          console.log(
            '  iframe window scrollX:',
            iframeElement.contentWindow.scrollX || 'N/A'
          );
          console.log(
            '  iframe window scrollY:',
            iframeElement.contentWindow.scrollY || 'N/A'
          );
        } catch (e) {
          console.log('  iframe content access blocked:', (e as Error).message);
        }
      }

      console.log(
        '[BookPreRenderer] successfully attached chapter to DOM:',
        sectionHref
      );

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

    if (chapter.element.parentNode === this.container) {
      this.container.removeChild(chapter.element);
    }

    this.offscreenContainer.appendChild(chapter.element);
    chapter.attached = false;

    console.log('[BookPreRenderer] detached chapter from DOM:', sectionHref);
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
