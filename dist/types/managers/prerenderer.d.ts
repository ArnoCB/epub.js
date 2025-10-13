import { Section } from '../section';
import EventEmitter from 'event-emitter';
import type { PreRenderedChapter } from '../types/pre-rendered-chapter';
import type { ViewSettings, PreRenderingStatus } from 'src/types';
export declare class BookPreRenderer {
    on: EventEmitter['on'];
    off: EventEmitter['off'];
    emit: EventEmitter['emit'];
    private container;
    private offscreenContainer;
    private unattachedStorage;
    private viewSettings;
    private viewRenderer;
    private pageMapGenerator;
    private chapters;
    private renderingPromises;
    private request;
    private currentStatus;
    private _completeEmitted;
    constructor(container: HTMLElement, viewSettings: ViewSettings, request: (url: string) => Promise<Document>);
    preRenderBook(sections: Section[]): Promise<PreRenderingStatus>;
    getChapter(sectionHref: string): PreRenderedChapter | undefined;
    getAllChapters(): PreRenderedChapter[];
    getStatus(): PreRenderingStatus;
    getDebugInfo(): {
        totalChapters: number;
        renderingInProgress: number;
        chapters: {
            pageCount: number;
            hasWhitePages: boolean;
            whitePageIndices: number[];
            width: number;
            height: number;
            href: string;
            attached: boolean;
        }[];
    };
    private preRenderSection;
    private createView;
    /**
     * Wait for layout to settle before querying element positions
     */
    private waitForLayout;
    /**
     * Simple content analysis using PageMapGenerator
     */
    private performAsyncContentAnalysis;
    private renderView;
    /**
     * Enhanced content preservation for reliable iframe restoration
     */
    private preserveChapterContent;
    /**
     * Restore iframe content after DOM moves
     */
    private restoreChapterContent;
    /**
     * Public helper to attempt restore for a chapter by href and validate result
     * Returns true if content is present after restore, false otherwise
     */
    tryRestoreContent(sectionHref: string): Promise<boolean>;
    /**
     * Returns a promise that resolves when page numbering (pageNumber on pageMap)
     * has been assigned for the given section href. Returns null if chapter is
     * not known.
     */
    getPageNumbering(sectionHref: string): Promise<void> | null;
    attachChapter(sectionHref: string): PreRenderedChapter | null;
    detachChapter(sectionHref: string): PreRenderedChapter | null;
    /**
     * Assign cumulative page numbers across the book for all prerendered chapters.
     * This walks the provided sections in order and sums pageCount for already
     * prerendered chapters to produce a global pageNumber for each page entry.
     */
    private assignGlobalPageNumbers;
    destroy(): void;
}
export default BookPreRenderer;
