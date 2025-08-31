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
  private request: any;
  private currentStatus: PreRenderingStatus;

  constructor(
    container: HTMLElement,
    viewSettings: ViewSettings,
    request: any
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

      if (view.contents && view.contents.document) {
        const doc = view.contents.document;
        const body = doc.body;

        if (body) {
          const contentHeight = body.scrollHeight;
          const viewportHeight = this.viewSettings.height;

          if (contentHeight > viewportHeight * 0.8) {
            chapter.pageCount = Math.ceil(contentHeight / viewportHeight);
          }

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
    if (!chapter || chapter.attached) {
      return null;
    }

    if (chapter.element.parentNode === this.offscreenContainer) {
      this.offscreenContainer.removeChild(chapter.element);
    }

    this.container.appendChild(chapter.element);
    chapter.attached = true;

    console.log('[BookPreRenderer] attached chapter to DOM:', sectionHref);
    this.emit(EVENTS.VIEWS.DISPLAYED, chapter.view);
    return chapter;
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
