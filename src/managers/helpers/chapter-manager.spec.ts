import { ChapterManager } from './chapter-manager';
import { CfiResolver } from './cfi-resolver';
import { Section } from '../../section';
import { defer } from '../../utils/core';

describe('ChapterManager - Simplified Tests', () => {
  let chapterManager: ChapterManager;
  let mockCfiResolver: jest.Mocked<CfiResolver>;

  beforeEach(() => {
    // Create a simple mock CFI resolver
    mockCfiResolver = {
      resolveForElement: jest.fn().mockResolvedValue({
        cfi: 'epubcfi(/6/4[chapter01]!/4/2/2[p001]/1:0)',
        debug: { href: 'chapter01.xhtml', element: { nodeName: 'P' } },
      }),
    } as any;

    chapterManager = new ChapterManager(mockCfiResolver, false);
  });

  it('should create a ChapterManager instance', () => {
    expect(chapterManager).toBeDefined();
  });

  it('should handle empty analysis result', () => {
    const emptyResult = (chapterManager as any).createEmptyAnalysisResult();

    expect(emptyResult).toEqual({
      pageCount: 1,
      pageMap: [{ index: 1, startCfi: null, endCfi: null, xOffset: 0 }],
      hasWhitePages: true, // Empty content is considered a white page
      whitePageIndices: [0], // First page index
      contentAnalysis: expect.any(Object),
      layoutMetrics: expect.any(Object),
      flowResult: expect.any(Object),
    });
  });

  it('should calculate page count correctly', () => {
    const layoutMetrics = {
      contentWidth: 800,
      contentHeight: 600,
      viewportWidth: 400,
      viewportHeight: 600,
      scrollWidth: 800,
      scrollHeight: 600,
    };

    const paginatedCount = (chapterManager as any).calculatePageCount(
      layoutMetrics,
      true,
      { hasMinimalContent: false }
    );
    expect(paginatedCount).toBe(2); // 800 / 400 = 2 pages

    const scrolledCount = (chapterManager as any).calculatePageCount(
      layoutMetrics,
      false,
      { hasMinimalContent: false }
    );
    expect(scrolledCount).toBe(1); // Scrolled content is typically 1 page
  });

  it('should create single page map for minimal content', () => {
    const singlePageMap = (chapterManager as any).createSinglePageMap();

    expect(singlePageMap).toEqual([
      {
        index: 1,
        startCfi: null,
        endCfi: null,
        xOffset: 0,
      },
    ]);
  });
});
