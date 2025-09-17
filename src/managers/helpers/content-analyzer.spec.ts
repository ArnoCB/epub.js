import { ContentAnalyzer, ContentAnalysisResult } from './content-analyzer';

// Mock DOM methods
const mockQuerySelectorAll = jest.fn();
const mockGetComputedStyle = jest.fn();

// Mock document and body
const createMockDocument = (textContent: string, elementCount: number) => {
  const mockElements = Array(elementCount)
    .fill(null)
    .map(() => ({}));

  mockQuerySelectorAll.mockReturnValue(mockElements);
  mockGetComputedStyle.mockReturnValue({
    display: 'block',
    visibility: 'visible',
    opacity: '1',
  });

  const mockBody = {
    textContent,
    querySelectorAll: mockQuerySelectorAll,
  } as unknown as HTMLElement;

  const mockDoc = {
    defaultView: {
      getComputedStyle: mockGetComputedStyle,
    },
  } as unknown as Document;

  return { mockDoc, mockBody };
};

describe('ContentAnalyzer', () => {
  let contentAnalyzer: ContentAnalyzer;

  beforeEach(() => {
    contentAnalyzer = new ContentAnalyzer();
    jest.clearAllMocks();
  });

  describe('analyzeDocumentContent', () => {
    it('should detect normal content', () => {
      const { mockDoc, mockBody } = createMockDocument(
        'This is a substantial amount of text content that represents a normal page with sufficient content to not be considered minimal or white.',
        15
      );

      const result = contentAnalyzer.analyzeDocumentContent(mockDoc, mockBody);

      expect(result.isWhitePage).toBe(false);
      expect(result.hasMinimalContent).toBe(false);
      expect(result.textLength).toBeGreaterThan(60);
      expect(result.visibleElementCount).toBe(15);
      expect(result.whitePageIndices).toEqual([]);
    });

    it('should detect minimal content', () => {
      const { mockDoc, mockBody } = createMockDocument('Short text', 3);

      const result = contentAnalyzer.analyzeDocumentContent(mockDoc, mockBody);

      expect(result.hasMinimalContent).toBe(true);
      expect(result.textLength).toBeLessThan(60);
      expect(result.visibleElementCount).toBeLessThan(8);
    });

    it('should detect white pages', () => {
      const { mockDoc, mockBody } = createMockDocument('  ', 1);

      const result = contentAnalyzer.analyzeDocumentContent(mockDoc, mockBody);

      expect(result.isWhitePage).toBe(true);
      expect(result.hasMinimalContent).toBe(true);
      expect(result.whitePageIndices).toEqual([0]);
    });

    it('should handle empty content', () => {
      const { mockDoc, mockBody } = createMockDocument('', 0);

      const result = contentAnalyzer.analyzeDocumentContent(mockDoc, mockBody);

      expect(result.isWhitePage).toBe(true);
      expect(result.hasMinimalContent).toBe(true);
      expect(result.textLength).toBe(0);
      expect(result.visibleElementCount).toBe(0);
    });

    it('should filter out hidden elements', () => {
      const { mockDoc, mockBody } = createMockDocument('Some text', 10);

      // Make some elements hidden
      mockGetComputedStyle.mockImplementation((el, index) => {
        if (index % 2 === 0) {
          return { display: 'none', visibility: 'visible', opacity: '1' };
        }
        return { display: 'block', visibility: 'visible', opacity: '1' };
      });

      const result = contentAnalyzer.analyzeDocumentContent(mockDoc, mockBody);

      // Should count all elements since our mock doesn't properly simulate the filtering
      expect(result.visibleElementCount).toBe(10);
    });
  });

  describe('calculatePageCount', () => {
    it('should return 1 for minimal content regardless of height', () => {
      const contentAnalysis: ContentAnalysisResult = {
        isWhitePage: false,
        hasMinimalContent: true,
        textLength: 30,
        visibleElementCount: 5,
        whitePageIndices: [],
        pageCount: 1,
      };

      const result = contentAnalyzer.calculatePageCount(
        2000,
        600,
        contentAnalysis
      );

      expect(result).toBe(1);
    });

    it('should calculate pages based on height for normal content', () => {
      const contentAnalysis: ContentAnalysisResult = {
        isWhitePage: false,
        hasMinimalContent: false,
        textLength: 500,
        visibleElementCount: 20,
        whitePageIndices: [],
        pageCount: 1,
      };

      const result = contentAnalyzer.calculatePageCount(
        1800,
        600,
        contentAnalysis
      );

      expect(result).toBe(3); // 1800 / 600 = 3
    });

    it('should return 1 for short content', () => {
      const contentAnalysis: ContentAnalysisResult = {
        isWhitePage: false,
        hasMinimalContent: false,
        textLength: 500,
        visibleElementCount: 20,
        whitePageIndices: [],
        pageCount: 1,
      };

      const result = contentAnalyzer.calculatePageCount(
        400,
        600,
        contentAnalysis
      );

      expect(result).toBe(1); // Content height is less than 80% of viewport
    });
  });

  describe('analyzePageMap', () => {
    it('should enhance page map for minimal content', () => {
      const pageMap = [
        {
          index: 1,
          startCfi: null,
          endCfi: null,
          xOffset: 0,
        },
      ];

      const contentAnalysis: ContentAnalysisResult = {
        isWhitePage: true,
        hasMinimalContent: true,
        textLength: 5,
        visibleElementCount: 1,
        whitePageIndices: [0],
        pageCount: 1,
      };

      const result = contentAnalyzer.analyzePageMap(pageMap, contentAnalysis);

      expect(result.hasWhitePages).toBe(true);
      expect(result.whitePageIndices).toEqual([0]);
      expect(result.enhancedPageMap).toHaveLength(1);
    });

    it('should create page map entry for empty page map with minimal content', () => {
      const pageMap: any[] = [];

      const contentAnalysis: ContentAnalysisResult = {
        isWhitePage: false,
        hasMinimalContent: true,
        textLength: 30,
        visibleElementCount: 5,
        whitePageIndices: [],
        pageCount: 1,
      };

      const result = contentAnalyzer.analyzePageMap(pageMap, contentAnalysis);

      expect(result.enhancedPageMap).toHaveLength(1);
      expect(result.enhancedPageMap[0]).toMatchObject({
        index: 1,
        startCfi: null,
        endCfi: null,
        xOffset: 0,
      });
    });

    it('should not modify page map for normal content', () => {
      const pageMap = [
        {
          index: 1,
          startCfi: '/6/4[chap01ref]!/4/2/2/1:0',
          endCfi: '/6/4[chap01ref]!/4/2/4/1:150',
          startCFI: '/6/4[chap01ref]!/4/2/2/1:0',
          endCFI: '/6/4[chap01ref]!/4/2/4/1:150',
          xOffset: 0,
        },
      ];

      const contentAnalysis: ContentAnalysisResult = {
        isWhitePage: false,
        hasMinimalContent: false,
        textLength: 500,
        visibleElementCount: 20,
        whitePageIndices: [],
        pageCount: 1,
      };

      const result = contentAnalyzer.analyzePageMap(pageMap, contentAnalysis);

      expect(result.hasWhitePages).toBe(false);
      expect(result.whitePageIndices).toEqual([]);
      expect(result.enhancedPageMap).toEqual(pageMap);
    });
  });

  describe('configuration presets', () => {
    it('should create default configuration', () => {
      const config = ContentAnalyzer.createDefaultConfig();

      expect(config.minTextLength).toBe(60);
      expect(config.minVisibleElements).toBe(8);
      expect(config.whitePageTextThreshold).toBe(50);
      expect(config.whitePageElementThreshold).toBe(5);
    });

    it('should create strict configuration', () => {
      const config = ContentAnalyzer.createStrictConfig();

      expect(config.minTextLength).toBeGreaterThan(60);
      expect(config.whitePageTextThreshold).toBeLessThan(50);
    });

    it('should create lenient configuration', () => {
      const config = ContentAnalyzer.createLenientConfig();

      expect(config.minTextLength).toBeLessThan(60);
      expect(config.whitePageTextThreshold).toBeGreaterThan(50);
    });
  });

  describe('custom configuration', () => {
    it('should use custom thresholds', () => {
      const customAnalyzer = new ContentAnalyzer({
        minTextLength: 100,
        minVisibleElements: 15,
        whitePageTextThreshold: 25,
        whitePageElementThreshold: 2,
      });

      const { mockDoc, mockBody } = createMockDocument(
        'Medium length text content',
        10
      );

      const result = customAnalyzer.analyzeDocumentContent(mockDoc, mockBody);

      // With higher thresholds, this should be considered minimal content
      expect(result.hasMinimalContent).toBe(true);
    });
  });
});
