import { Section } from '../../section';
import { View } from './views';
import { defer } from '../../utils/core';
import { PageMapEntry, PageMapper, FlowDetectionResult } from './page-mapper';
import { ContentAnalyzer, ContentAnalysisResult } from './content-analyzer';
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
export class ChapterManager {
  private readonly pageMapper: PageMapper;
  private readonly contentAnalyzer: ContentAnalyzer;
  private readonly cfiResolver: CfiResolver;
  private readonly debug: boolean;

  constructor(cfiResolver: CfiResolver, debug = false) {
    this.cfiResolver = cfiResolver;
    this.pageMapper = new PageMapper(cfiResolver);
    this.contentAnalyzer = new ContentAnalyzer(undefined, debug);
    this.debug = debug;
  }

  /**
   * Calculates layout metrics from view and content
   */
  private calculateLayoutMetrics(
    view: ViewLike,
    chapter: PreRenderedChapter,
    viewSettings: ViewSettingsLike
  ): LayoutMetrics {
    let contentWidth = chapter.width;
    let contentHeight = chapter.height;
    let scrollWidth = contentWidth;
    let scrollHeight = contentHeight;

    // Get precise content dimensions if available
    if (view?.contents) {
      try {
        if (typeof view.contents.scrollWidth === 'function') {
          scrollWidth = view.contents.scrollWidth();
          contentWidth = scrollWidth;
        }
      } catch (e) {
        this.debugLog('Failed to get contents.scrollWidth():', e);
      }

      try {
        if (typeof view.contents.scrollHeight === 'function') {
          scrollHeight = view.contents.scrollHeight();
          contentHeight = scrollHeight;
        }
      } catch (e) {
        this.debugLog('Failed to get contents.scrollHeight():', e);
      }
    }

    // Also try to get from document body if available
    if (view?.contents?.document?.body) {
      const body = view.contents.document.body;
      scrollWidth = Math.max(scrollWidth, body.scrollWidth || 0);
      scrollHeight = Math.max(scrollHeight, body.scrollHeight || 0);
      contentWidth = Math.max(contentWidth, scrollWidth);
      contentHeight = Math.max(contentHeight, scrollHeight);
    }

    const viewportWidth =
      viewSettings.layout?.columnWidth || viewSettings.width;
    const viewportHeight = viewSettings.layout?.height ?? viewSettings.height;

    return {
      contentWidth,
      contentHeight,
      viewportWidth,
      viewportHeight,
      scrollWidth,
      scrollHeight,
    };
  }

  /**
   * Calculates the number of pages needed for content
   */
  private calculatePageCount(
    metrics: LayoutMetrics,
    isPaginated: boolean,
    analysisResult: ContentAnalysisResult
  ): number {
    // For minimal content, always treat as single page
    if (analysisResult.hasMinimalContent) {
      return 1;
    }

    if (isPaginated) {
      // For paginated content, calculate based on content width vs viewport width
      return Math.max(
        1,
        Math.ceil(metrics.contentWidth / metrics.viewportWidth)
      );
    } else {
      // For scrolled content, calculate based on content height vs viewport height
      if (metrics.contentHeight > metrics.viewportHeight * 0.8) {
        return Math.max(
          1,
          Math.ceil(metrics.contentHeight / metrics.viewportHeight)
        );
      }
      return 1;
    }
  }
  async analyzeChapter(
    chapter: PreRenderedChapter,
    viewSettings: ViewSettingsLike
  ): Promise<ChapterAnalysisResult> {
    const view = chapter.view;

    if (!view.contents?.document?.body) {
      return this.createEmptyAnalysisResult();
    }

    const doc = view.contents.document;
    const body = doc.body;

    try {
      // Step 1: Detect flow type and gather layout information
      const flowResult = this.pageMapper.detectFlow(
        viewSettings,
        view,
        chapter
      );

      // Step 2: Calculate layout metrics
      const layoutMetrics = this.calculateLayoutMetrics(
        view,
        chapter,
        viewSettings
      );

      // Step 3: Analyze content characteristics
      const contentAnalysis = this.contentAnalyzer.analyzeDocumentContent(
        doc,
        body
      );

      // Step 4: Calculate initial page count
      let pageCount = this.calculatePageCount(
        layoutMetrics,
        flowResult.isPaginated,
        contentAnalysis
      );

      // Step 5: Generate page map with CFI resolution
      let pageMap: PageMapEntry[] | undefined;

      if (!contentAnalysis.hasMinimalContent) {
        pageMap = await this.generatePageMap(
          doc,
          body,
          chapter.section,
          pageCount,
          flowResult
        );

        // Update page count based on actual page map
        if (pageMap && pageMap.length > 0) {
          pageCount = pageMap.length;
        }
      } else {
        // For minimal content, create a simple single-page map
        pageMap = this.createSinglePageMap(chapter.section);
      }

      // Step 6: Validate and enhance the page map
      if (pageMap) {
        const validation = this.pageMapper.validatePageMap(pageMap);
        if (!validation.isValid) {
          this.debugLog('Page map validation issues:', validation.issues);
          // Attempt to enhance problematic page maps
          pageMap = await this.enhancePageMap(
            doc,
            body,
            chapter.section,
            pageMap
          );
        }
      }

      return {
        pageCount,
        pageMap,
        hasWhitePages: contentAnalysis.isWhitePage,
        whitePageIndices: contentAnalysis.whitePageIndices,
        contentAnalysis,
        layoutMetrics,
        flowResult,
      };
    } catch (error) {
      this.debugLog('Chapter analysis failed:', error);
      return this.createErrorAnalysisResult(error);
    }
  }

  /**
   * Generates a page map based on flow type
   */
  private async generatePageMap(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageCount: number,
    flowResult: FlowDetectionResult
  ): Promise<PageMapEntry[]> {
    if (flowResult.isPaginated) {
      const config = this.pageMapper.createPaginatedProbeConfig(
        flowResult.viewportWidth
      );
      const pageMap = await this.pageMapper.mapPaginatedPages(
        doc,
        body,
        section,
        pageCount,
        config,
        flowResult
      );

      // Ensure CFIs are valid and adjust as needed
      return pageMap.map((entry) => {
        if (entry.startCfi && entry.startCfi.split(',').length === 3) {
          entry.startCfi = entry.startCfi.split(',')[0]; // Simplify redundant CFIs
        }
        if (!entry.endCfi) {
          entry.endCfi = entry.startCfi; // Set endCfi to startCfi if missing
        }
        return entry;
      });
    } else {
      const config = this.pageMapper.createScrolledProbeConfig(
        flowResult.viewportHeight
      );
      const pageMap = await this.pageMapper.mapScrolledPages(
        doc,
        body,
        section,
        pageCount,
        config,
        flowResult
      );

      // Ensure CFIs are valid and adjust as needed
      return pageMap.map((entry) => {
        if (entry.startCfi && entry.startCfi.split(',').length === 3) {
          entry.startCfi = entry.startCfi.split(',')[0]; // Simplify redundant CFIs
        }
        if (!entry.endCfi) {
          entry.endCfi = entry.startCfi; // Set endCfi to startCfi if missing
        }
        return entry;
      });
    }
  }

  /**
   * Creates a simple single-page map for minimal content
   */
  private createSinglePageMap(section?: Section): PageMapEntry[] {
    // For a single page at the start of content, we can set the base CFI
    const startCfi = section?.cfiBase || null;

    return [
      {
        index: 1,
        startCfi,
        endCfi: null,
        xOffset: 0,
      },
    ];
  }

  /**
   * Attempts to enhance a problematic page map
   */
  private async enhancePageMap(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageMap: PageMapEntry[]
  ): Promise<PageMapEntry[]> {
    this.debugLog(
      'Attempting to enhance page map with',
      pageMap.length,
      'pages'
    );

    // For now, return the original page map
    // Future enhancements could include:
    // - Alternative CFI probing strategies
    // - Text-based CFI generation
    // - DOM tree walking for better element selection
    return pageMap;
  }

  /**
   * Updates page numbers across chapters for book-level navigation
   */
  updateGlobalPageNumbers(
    chapters: Map<string, PreRenderedChapter>,
    sections: Section[]
  ): void {
    let globalPageNumber = 1;

    for (const section of sections) {
      const chapter = chapters.get(section.href);
      if (chapter?.pageMap) {
        for (const entry of chapter.pageMap) {
          entry.pageNumber = globalPageNumber++;
        }

        // Resolve the page numbers deferred promise
        if (chapter.pageNumbersDeferred) {
          chapter.pageNumbersDeferred.resolve();
        }
      }
    }
  }

  /**
   * Validates a chapter's analysis results
   */
  validateChapterAnalysis(result: ChapterAnalysisResult): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (result.pageCount < 1) {
      issues.push('Page count must be at least 1');
    }

    if (result.pageMap && result.pageMap.length !== result.pageCount) {
      issues.push(
        `Page map length (${result.pageMap.length}) does not match page count (${result.pageCount})`
      );
    }

    // Validate content analysis - basic checks
    if (result.contentAnalysis.textLength < 0) {
      issues.push('Content analysis: Text length cannot be negative');
    }
    if (result.contentAnalysis.visibleElementCount < 0) {
      issues.push('Content analysis: Visible element count cannot be negative');
    }

    // Validate page map if present
    if (result.pageMap) {
      const pageMapValidation = this.pageMapper.validatePageMap(result.pageMap);
      if (!pageMapValidation.isValid) {
        issues.push(
          ...pageMapValidation.issues.map((issue) => `Page map: ${issue}`)
        );
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Creates an empty analysis result for chapters without content
   */
  private createEmptyAnalysisResult(): ChapterAnalysisResult {
    return {
      pageCount: 1,
      pageMap: this.createSinglePageMap(),
      hasWhitePages: true,
      whitePageIndices: [0],
      contentAnalysis: {
        textLength: 0,
        visibleElementCount: 0,
        hasMinimalContent: true,
        isWhitePage: true,
        whitePageIndices: [0],
        pageCount: 1,
      },
      layoutMetrics: {
        contentWidth: 0,
        contentHeight: 0,
        viewportWidth: 0,
        viewportHeight: 0,
        scrollWidth: 0,
        scrollHeight: 0,
      },
      flowResult: {
        isPaginated: false,
        contentWidth: 0,
        contentHeight: 0,
        viewportWidth: 0,
        viewportHeight: 0,
      },
    };
  }

  /**
   * Creates an error analysis result when analysis fails
   */
  private createErrorAnalysisResult(error: unknown): ChapterAnalysisResult {
    this.debugLog('Creating error analysis result for:', error);

    const result = this.createEmptyAnalysisResult();

    // Add error information to diagnostics if available
    if (result.pageMap?.[0]) {
      // Note: We could extend PageMapEntry to include error info if needed
    }

    return result;
  }

  private debugLog(...args: unknown[]): void {
    if (this.debug) {
      console.debug('[ChapterManager]', ...args);
    }
  }
}
