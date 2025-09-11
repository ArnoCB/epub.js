import { defer } from '../utils/core';
import { Section } from '../section';
import { View } from './helpers/views';
import Layout, { Axis, Flow } from '../layout';
import EventEmitter from 'event-emitter';
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
    pageMap?: Array<{
        index: number;
        startCfi?: string;
        endCfi?: string;
        xOffset?: number;
        yOffset?: number;
    }>;
    preservedSrcdoc?: string;
    preservedContent?: string;
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
export declare class BookPreRenderer {
    on: EventEmitter['on'];
    off: EventEmitter['off'];
    emit: EventEmitter['emit'];
    private container;
    private offscreenContainer;
    private unattachedStorage;
    private viewSettings;
    private viewRenderer;
    private chapters;
    private renderingPromises;
    private request;
    private currentStatus;
    private _completeEmitted;
    constructor(container: HTMLElement, viewSettings: ViewSettings, request: (url: string) => Promise<Document>);
    preRenderBook(sections: Section[]): Promise<PreRenderingStatus>;
    private preRenderSection;
    private createView;
    private renderView;
    private analyzeContent;
    getChapter(sectionHref: string): PreRenderedChapter | undefined;
    getAllChapters(): PreRenderedChapter[];
    getStatus(): PreRenderingStatus;
    getDebugInfo(): {
        totalChapters: number;
        renderingInProgress: number;
        chapters: {
            href: string;
            attached: boolean;
            width: number;
            height: number;
            pageCount: number;
            hasWhitePages: boolean;
            whitePageIndices: number[];
        }[];
    };
    /**
     * Preserve iframe content to prevent loss during DOM moves
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
    attachChapter(sectionHref: string): PreRenderedChapter | null;
    detachChapter(sectionHref: string): PreRenderedChapter | null;
    destroy(): void;
}
export default BookPreRenderer;
