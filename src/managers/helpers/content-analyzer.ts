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
export class ContentAnalyzer {
  private readonly config: ContentAnalysisConfig;
  private readonly debug: boolean;

  constructor(config?: Partial<ContentAnalysisConfig>, debug = false) {
    this.config = {
      minTextLength: 60,
      minVisibleElements: 8,
      whitePageTextThreshold: 50,
      whitePageElementThreshold: 5,
      ...config,
    };
    this.debug = debug;
  }

  /**
   * Analyzes document content to determine if it's a white/minimal page
   * and provides content metrics
   */
  analyzeDocumentContent(
    doc: Document,
    body: HTMLElement
  ): ContentAnalysisResult {
    const textContent = body.textContent || '';
    const trimmedText = textContent.trim();
    const textLength = trimmedText.length;

    // Count visible elements conservatively
    const visibleElements = this.countVisibleElements(doc, body);
    const visibleElementCount = visibleElements.length;

    // Determine if this is minimal content using conservative heuristics
    const hasMinimalContent = this.isMinimalContent(
      textLength,
      visibleElementCount
    );

    // Determine if this is a white page using stricter thresholds
    const isWhitePage = this.isWhitePage(textLength, visibleElementCount);

    this.debugLog('Content analysis:', {
      textLength,
      visibleElementCount,
      hasMinimalContent,
      isWhitePage,
    });

    return {
      isWhitePage,
      hasMinimalContent,
      textLength,
      visibleElementCount,
      whitePageIndices: isWhitePage ? [0] : [],
      pageCount: hasMinimalContent ? 1 : 0, // Will be overridden by caller if needed
    };
  }

  /**
   * Analyzes a page map to identify white pages based on content analysis
   */
  analyzePageMap(
    pageMap: PageMapEntry[],
    documentAnalysis: ContentAnalysisResult,
    section?: Section
  ): {
    hasWhitePages: boolean;
    whitePageIndices: number[];
    enhancedPageMap: PageMapEntry[];
  } {
    const whitePageIndices: number[] = [];
    const enhancedPageMap = [...pageMap];

    // If the entire document is minimal content, mark all pages as potentially white
    if (documentAnalysis.hasMinimalContent) {
      // For minimal content, create a single page entry if none exists
      if (enhancedPageMap.length === 0) {
        const startCfi = section?.cfiBase || null;
        enhancedPageMap.push({
          index: 1,
          startCfi,
          endCfi: null,
          xOffset: 0,
        });
      }

      // Mark the first page as white if content is truly minimal
      if (documentAnalysis.isWhitePage && enhancedPageMap.length > 0) {
        whitePageIndices.push(0);
      }
    }

    // Additional heuristics could be added here to analyze individual pages
    // if we had per-page content metrics

    return {
      hasWhitePages: whitePageIndices.length > 0,
      whitePageIndices,
      enhancedPageMap,
    };
  }

  /**
   * Counts elements that are visually present in the document
   */
  private countVisibleElements(doc: Document, body: HTMLElement): Element[] {
    return Array.from(body.querySelectorAll('*')).filter((el) => {
      try {
        const style = doc.defaultView?.getComputedStyle(el);
        return (
          !!style &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0'
        );
      } catch {
        return false;
      }
    });
  }

  /**
   * Determines if content is minimal (cover/title pages with little text)
   */
  private isMinimalContent(
    textLength: number,
    visibleElementCount: number
  ): boolean {
    return (
      textLength < this.config.minTextLength &&
      visibleElementCount < this.config.minVisibleElements
    );
  }

  /**
   * Determines if content represents a white/empty page
   */
  private isWhitePage(
    textLength: number,
    visibleElementCount: number
  ): boolean {
    return (
      textLength < this.config.whitePageTextThreshold &&
      visibleElementCount < this.config.whitePageElementThreshold &&
      textLength < 20 // Additional stricter threshold for truly empty pages
    );
  }

  /**
   * Calculates appropriate page count based on content analysis
   */
  calculatePageCount(
    contentHeight: number,
    viewportHeight: number,
    documentAnalysis: ContentAnalysisResult
  ): number {
    // For minimal content, always return 1 page to avoid false multi-page counts
    if (documentAnalysis.hasMinimalContent) {
      return 1;
    }

    // For normal content, calculate based on height if content is substantial
    if (contentHeight > viewportHeight * 0.8) {
      return Math.max(1, Math.ceil(contentHeight / viewportHeight));
    }

    return 1;
  }

  /**
   * Creates a default configuration for content analysis
   */
  static createDefaultConfig(): ContentAnalysisConfig {
    return {
      minTextLength: 60,
      minVisibleElements: 8,
      whitePageTextThreshold: 50,
      whitePageElementThreshold: 5,
    };
  }

  /**
   * Creates a strict configuration for more aggressive white page detection
   */
  static createStrictConfig(): ContentAnalysisConfig {
    return {
      minTextLength: 100,
      minVisibleElements: 12,
      whitePageTextThreshold: 30,
      whitePageElementThreshold: 3,
    };
  }

  /**
   * Creates a lenient configuration for less aggressive white page detection
   */
  static createLenientConfig(): ContentAnalysisConfig {
    return {
      minTextLength: 30,
      minVisibleElements: 5,
      whitePageTextThreshold: 80,
      whitePageElementThreshold: 8,
    };
  }

  private debugLog(...args: unknown[]): void {
    if (this.debug) {
      console.debug('[ContentAnalyzer]', ...args);
    }
  }
}
