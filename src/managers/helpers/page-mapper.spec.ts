import { PageMapper, FlowDetectionResult } from './page-mapper';
import { CfiResolver } from './cfi-resolver';

// Mock the CfiResolver
jest.mock('./cfi-resolver');

describe('PageMapper', () => {
  let pageMapper: PageMapper;
  let mockCfiResolver: jest.Mocked<CfiResolver>;

  beforeEach(() => {
    mockCfiResolver = new CfiResolver() as jest.Mocked<CfiResolver>;
    pageMapper = new PageMapper(mockCfiResolver);
  });

  describe('detectFlow', () => {
    it('should detect paginated flow correctly', () => {
      const viewSettings = {
        flow: 'paginated',
        width: 800,
        height: 600,
      };
      const view = {};
      const chapter = { width: 800, height: 600 };

      const result = pageMapper.detectFlow(viewSettings, view, chapter);

      expect(result.isPaginated).toBe(true);
      expect(result.viewportWidth).toBe(800);
      expect(result.viewportHeight).toBe(600);
    });

    it('should detect scrolled flow correctly', () => {
      const viewSettings = {
        flow: 'scrolled',
        width: 800,
        height: 600,
      };
      const view = {};
      const chapter = { width: 800, height: 600 };

      const result = pageMapper.detectFlow(viewSettings, view, chapter);

      expect(result.isPaginated).toBe(false);
      expect(result.viewportWidth).toBe(800);
      expect(result.viewportHeight).toBe(600);
    });

    it('should use layout column width when available', () => {
      const viewSettings = {
        flow: 'paginated',
        width: 800,
        height: 600,
        layout: {
          columnWidth: 400,
          height: 500,
        },
      };
      const view = {};
      const chapter = { width: 800, height: 600 };

      const result = pageMapper.detectFlow(viewSettings, view, chapter);

      expect(result.viewportWidth).toBe(400);
      expect(result.viewportHeight).toBe(500);
    });

    it('should get content dimensions from view if available', () => {
      const viewSettings = {
        flow: 'scrolled',
        width: 800,
        height: 600,
      };
      const view = {
        contents: {
          scrollWidth: () => 1200,
          scrollHeight: () => 2000,
        },
      };
      const chapter = { width: 800, height: 600 };

      const result = pageMapper.detectFlow(viewSettings, view, chapter);

      expect(result.contentWidth).toBe(1200);
      expect(result.contentHeight).toBe(2000);
    });
  });

  describe('createPaginatedProbeConfig', () => {
    it('should create appropriate probe configuration', () => {
      const config = pageMapper.createPaginatedProbeConfig(800);

      expect(config.probeXOffsets).toContain(1);
      expect(config.probeXOffsets).toContain(Math.floor(800 * 0.15));
      expect(config.probeXOffsets).toContain(Math.floor(800 * 0.4));

      expect(config.probeXOffsetsEnd).toContain(790); // 800 - 10
      expect(config.probeXOffsetsEnd).toContain(Math.floor(800 * 0.85));
      expect(config.probeXOffsetsEnd).toContain(Math.floor(800 * 0.6));

      expect(config.extraYOffsets).toEqual([-20, -8, 8, 20, -40, 40]);
    });
  });

  describe('createScrolledProbeConfig', () => {
    it('should create appropriate probe configuration', () => {
      const config = pageMapper.createScrolledProbeConfig(600);

      expect(config.probeYOffsets).toContain(Math.floor(600 * 0.15));
      expect(config.probeYOffsets).toContain(Math.floor(600 * 0.4));
      expect(config.probeYOffsets).toContain(Math.floor(600 * 0.6));

      expect(config.probeYOffsetsEnd).toContain(Math.floor(600 * 0.85));
      expect(config.probeYOffsetsEnd).toContain(Math.floor(600 * 0.5));
    });
  });

  describe('validatePageMap', () => {
    it('should validate a good page map', () => {
      const pageMap = [
        {
          index: 1,
          startCfi: '/6/4[chap01ref]!/4/2/2/1:0',
          endCfi: '/6/4[chap01ref]!/4/2/4/1:150',
          startCFI: '/6/4[chap01ref]!/4/2/2/1:0',
          endCFI: '/6/4[chap01ref]!/4/2/4/1:150',
          xOffset: 0,
        },
        {
          index: 2,
          startCfi: '/6/4[chap01ref]!/4/2/6/1:0',
          endCfi: '/6/4[chap01ref]!/4/2/8/1:150',
          startCFI: '/6/4[chap01ref]!/4/2/6/1:0',
          endCFI: '/6/4[chap01ref]!/4/2/8/1:150',
          xOffset: 800,
        },
      ];

      const result = pageMapper.validatePageMap(pageMap);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.uniqueCfis).toBe(2);
    });

    it('should detect issues with duplicate CFIs', () => {
      const pageMap = [
        {
          index: 1,
          startCfi: '/6/4[chap01ref]!/4/2/2/1:0',
          endCfi: null,
          startCFI: '/6/4[chap01ref]!/4/2/2/1:0',
          endCFI: null,
          xOffset: 0,
        },
        {
          index: 2,
          startCfi: '/6/4[chap01ref]!/4/2/2/1:0', // Duplicate CFI
          endCfi: null,
          startCFI: '/6/4[chap01ref]!/4/2/2/1:0',
          endCFI: null,
          xOffset: 800,
        },
      ];

      const result = pageMapper.validatePageMap(pageMap);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Only 1 unique CFIs found for 2 pages');
      expect(result.uniqueCfis).toBe(1);
    });

    it('should detect empty page map', () => {
      const result = pageMapper.validatePageMap([]);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Page map is empty');
      expect(result.uniqueCfis).toBe(0);
    });

    it('should detect invalid indices', () => {
      const pageMap = [
        {
          index: 0, // Invalid index
          startCfi: '/6/4[chap01ref]!/4/2/2/1:0',
          endCfi: null,
          startCFI: '/6/4[chap01ref]!/4/2/2/1:0',
          endCFI: null,
          xOffset: 0,
        },
      ];

      const result = pageMapper.validatePageMap(pageMap);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Invalid index 0 for page');
    });

    it('should detect pages with no positioning data', () => {
      const pageMap = [
        {
          index: 1,
          startCfi: null,
          endCfi: null,
          startCFI: null,
          endCFI: null,
          // No xOffset or yOffset
        },
      ];

      const result = pageMapper.validatePageMap(pageMap);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Page 1 has no CFI or position data');
    });
  });
});
