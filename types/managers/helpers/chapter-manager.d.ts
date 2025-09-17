import { Section } from '../../section';
import { View } from './views';
import { defer } from '../../utils/core';
import { PageMapEntry, FlowDetectionResult } from './page-mapper';
import { ContentAnalysisResult } from './content-analyzer';
import { CfiResolver } from './cfi-resolver';
export interface ViewLike {
    contents?: {
        document?: {
            body?: HTMLElement;
        };
        scrollWidth?: () => number;
        scrollHeight?: () => number;
    };
}
export interface ViewSettingsLike {
    layout?: {
        columnWidth?: number;
        height?: number;
    };
    width: number;
    height: number;
}
export interface LayoutMetrics {
    contentWidth: number;
    contentHeight: number;
    viewportWidth: number;
    viewportHeight: number;
    scrollWidth: number;
    scrollHeight: number;
}
export interface ChapterAnalysisResult {
    pageCount: number;
    pageMap?: PageMapEntry[];
    hasWhitePages: boolean;
    whitePageIndices: number[];
    contentAnalysis: ContentAnalysisResult;
    layoutMetrics: LayoutMetrics;
    flowResult: FlowDetectionResult;
}
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
    pageMap?: PageMapEntry[];
    diagnostics?: Array<Record<string, unknown>>;
    pageNumbersDeferred?: defer<void>;
    pageNumbersAssigned?: Promise<void>;
    preservedSrcdoc?: string;
    preservedContent?: string;
}
/**
 * Enhanced chapter manager that handles content analysis, page mapping,
 * and CFI resolution for prerendered chapters.
 */
export declare class ChapterManager {
    private readonly pageMapper;
    private readonly contentAnalyzer;
    private readonly cfiResolver;
    private readonly debug;
    constructor(cfiResolver: CfiResolver, debug?: boolean);
    /**
     * Calculates layout metrics from view and content
     */
    private calculateLayoutMetrics;
    /**
     * Calculates the number of pages needed for content
     */
    private calculatePageCount;
    analyzeChapter(chapter: PreRenderedChapter, viewSettings: ViewSettingsLike): Promise<ChapterAnalysisResult>;
    /**
     * Generates a page map based on flow type
     */
    private generatePageMap;
    /**
     * Creates a simple single-page map for minimal content
     */
    private createSinglePageMap;
    /**
     * Attempts to enhance a problematic page map
     */
    private enhancePageMap;
    /**
     * Updates page numbers across chapters for book-level navigation
     */
    updateGlobalPageNumbers(chapters: Map<string, PreRenderedChapter>, sections: Section[]): void;
    /**
     * Validates a chapter's analysis results
     */
    validateChapterAnalysis(result: ChapterAnalysisResult): {
        isValid: boolean;
        issues: string[];
    };
    /**
     * Creates an empty analysis result for chapters without content
     */
    private createEmptyAnalysisResult;
    /**
     * Creates an error analysis result when analysis fails
     */
    private createErrorAnalysisResult;
    private debugLog;
}
