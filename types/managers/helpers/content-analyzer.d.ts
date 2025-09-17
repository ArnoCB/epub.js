import { PageMapEntry } from './page-mapper';
import { Section } from '../../section';
export interface ContentAnalysisResult {
    isWhitePage: boolean;
    hasMinimalContent: boolean;
    textLength: number;
    visibleElementCount: number;
    whitePageIndices: number[];
    pageCount: number;
}
export interface ContentAnalysisConfig {
    minTextLength: number;
    minVisibleElements: number;
    whitePageTextThreshold: number;
    whitePageElementThreshold: number;
}
/**
 * Service for analyzing content and detecting white/minimal pages
 */
export declare class ContentAnalyzer {
    private readonly config;
    private readonly debug;
    constructor(config?: Partial<ContentAnalysisConfig>, debug?: boolean);
    /**
     * Analyzes document content to determine if it's a white/minimal page
     * and provides content metrics
     */
    analyzeDocumentContent(doc: Document, body: HTMLElement): ContentAnalysisResult;
    /**
     * Analyzes a page map to identify white pages based on content analysis
     */
    analyzePageMap(pageMap: PageMapEntry[], documentAnalysis: ContentAnalysisResult, section?: Section): {
        hasWhitePages: boolean;
        whitePageIndices: number[];
        enhancedPageMap: PageMapEntry[];
    };
    /**
     * Counts elements that are visually present in the document
     */
    private countVisibleElements;
    /**
     * Determines if content is minimal (cover/title pages with little text)
     */
    private isMinimalContent;
    /**
     * Determines if content represents a white/empty page
     */
    private isWhitePage;
    /**
     * Calculates appropriate page count based on content analysis
     */
    calculatePageCount(contentHeight: number, viewportHeight: number, documentAnalysis: ContentAnalysisResult): number;
    /**
     * Creates a default configuration for content analysis
     */
    static createDefaultConfig(): ContentAnalysisConfig;
    /**
     * Creates a strict configuration for more aggressive white page detection
     */
    static createStrictConfig(): ContentAnalysisConfig;
    /**
     * Creates a lenient configuration for less aggressive white page detection
     */
    static createLenientConfig(): ContentAnalysisConfig;
    private debugLog;
}
