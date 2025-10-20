import DefaultViewManager from '../default';
import BookPreRenderer from '../prerenderer';
import { Section } from '../../section';
import IframeView from '../views/iframe';
import type { DefaultViewManagerSettings, PreRenderedChapter, PreRenderingStatus, ViewManager, View } from '../../types';
/**
 * PreRenderingViewManager - Extends DefaultViewManager to add pre-rendering capabilities
 *
 * This manager adds prerendering functionality on top of the DefaultViewManager.
 * The parent DefaultViewManager has no knowledge of prerendering - this manager adds it
 * as a transparent layer on top.
 */
export declare class PreRenderingViewManager extends DefaultViewManager implements ViewManager {
    private _preRenderer;
    usePreRendering: boolean;
    private _preRenderingStarted;
    /** @ts-expect-error: reserved for future use (attach/detach logic) */
    private _attaching;
    name: string;
    get preRenderer(): BookPreRenderer | null;
    constructor(options: {
        settings: DefaultViewManagerSettings & {
            usePreRendering?: boolean;
        };
        spine?: Section[];
        [key: string]: unknown;
    });
    private writeIframeContent;
    private applyNoScrollStyles;
    private initializeContents;
    private attachPrerendered;
    private updatePhantom;
    private createWrapper;
    private createIframe;
    private extractContent;
    append(section: Section, forceRight?: boolean): Promise<IframeView>;
    prepend(section: Section, forceRight?: boolean): Promise<IframeView>;
    startPreRendering(sections: Section[]): Promise<void>;
    getPreRenderedChapter(sectionHref: string): PreRenderedChapter | undefined;
    hasPreRenderedChapter(sectionHref: string): boolean;
    getPreRenderingStatus(): PreRenderingStatus;
    getAllPreRenderedChapters(): PreRenderedChapter[];
    getPreRenderingDebugInfo(): {
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
    /**
     * Get the total number of pages across all chapters in the book
     */
    getTotalPages(): number | undefined;
    /**
     * Get the current page number across all chapters in the book
     */
    getCurrentPage(): number | undefined;
    afterDisplayed(view: View | IframeView): void;
    destroy(): void;
    render(element: HTMLElement, size?: {
        width: number;
        height: number;
    }): void;
    resize(width?: string, height?: string, epubcfi?: string): Promise<void>;
    private isRtlDirection;
    private navigate;
    private loadSection;
    next(): Promise<void>;
    prev(): Promise<void>;
}
export default PreRenderingViewManager;
export { BookPreRenderer };
