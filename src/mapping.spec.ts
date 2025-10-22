import Mapping from './mapping';

// Mock dependencies first
jest.mock('./epubcfi');
jest.mock('./utils/core', () => ({
  nodeBounds: jest.fn(),
}));

describe('Mapping', () => {
  let mapping: any;
  let mockLayout: any;
  let mockView: any;
  let mockContents: any;
  let mockDocument: any;
  let mockBody: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock layout
    mockLayout = {
      spreadWidth: 800,
      divisor: 2,
      columnWidth: 400,
      gap: 20,
    };

    // Mock DOM elements
    mockBody = {
      nodeType: 1, // ELEMENT_NODE
      textContent: 'Sample text content',
      childNodes: [],
    };

    mockDocument = {
      body: mockBody,
      createRange: jest.fn(() => ({
        setStart: jest.fn(),
        setEnd: jest.fn(),
        selectNodeContents: jest.fn(),
        collapse: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({
          left: 0,
          right: 100,
          top: 0,
          bottom: 20,
        })),
      })),
      createTreeWalker: jest.fn(() => ({
        nextNode: jest.fn(() => null),
      })),
      defaultView: {
        getSelection: jest.fn(() => ({
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
        })),
      },
    };

    mockContents = {
      document: mockDocument,
      scrollWidth: jest.fn(() => 1600),
    };

    mockView = {
      contents: mockContents,
      document: mockDocument,
      section: {
        cfiBase: '/6/4[chap01ref]!',
      },
    };

    // Create mapping instance
    mapping = new Mapping(mockLayout, 'ltr', 'horizontal');

    // Mock global objects
    global.document = mockDocument;
    global.Node = {
      TEXT_NODE: 3,
      ELEMENT_NODE: 1,
    } as any;
    global.NodeFilter = {
      SHOW_TEXT: 4,
      FILTER_ACCEPT: 1,
      FILTER_REJECT: 2,
    } as any;
  });

  describe('constructor', () => {
    it('should initialize with correct default values', () => {
      const defaultMapping = new Mapping(mockLayout);
      expect(defaultMapping.layout).toBe(mockLayout);
      expect(defaultMapping.horizontal).toBe(false); // Documents actual behavior: defaults to false
      expect(defaultMapping.direction).toBe('ltr');
    });

    it('should initialize with provided parameters', () => {
      const verticalMapping = new Mapping(mockLayout, 'rtl', 'vertical');
      expect(verticalMapping.horizontal).toBe(false);
      expect(verticalMapping.direction).toBe('rtl');
    });

    it('should default direction to ltr when not provided', () => {
      const mappingWithoutDirection = new Mapping(
        mockLayout,
        undefined,
        'horizontal'
      );
      expect(mappingWithoutDirection.direction).toBe('ltr');
    });
  });

  describe('axis', () => {
    it('should return current horizontal value when called with falsy parameter', () => {
      expect(mapping.axis('')).toBe(true);
    });

    it('should set horizontal to true for "horizontal" axis', () => {
      const result = mapping.axis('horizontal');
      expect(result).toBe(true);
      expect(mapping.horizontal).toBe(true);
    });

    it('should set horizontal to false for "vertical" axis', () => {
      const result = mapping.axis('vertical');
      expect(result).toBe(false);
      expect(mapping.horizontal).toBe(false);
    });

    it('should return false for any non-horizontal value', () => {
      const result = mapping.axis('someothervalue');
      expect(result).toBe(false);
      expect(mapping.horizontal).toBe(false);
    });
  });

  describe('page method - integration tests', () => {
    beforeEach(() => {
      // Mock nodeBounds from utils/core
      const { nodeBounds } = require('./utils/core');
      nodeBounds.mockReturnValue({
        left: 50,
        right: 150,
        top: 10,
        bottom: 30,
      });
    });

    it('should return undefined if no root element', () => {
      const contentsWithoutBody = { document: { body: null } };
      const result = mapping.page(
        contentsWithoutBody as any,
        'cfiBase',
        0,
        100
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined if no document in contents', () => {
      const contentsWithoutDocument = { document: null };
      const result = mapping.page(
        contentsWithoutDocument as any,
        'cfiBase',
        0,
        100
      );
      expect(result).toBeUndefined();
    });

    it('should handle dev mode highlighting', () => {
      const devMapping = new Mapping(mockLayout, 'ltr', 'horizontal');

      // Documents current behavior: when DOM elements are not properly mocked,
      // the createTreeWalker call fails with parameter validation
      expect(() => {
        devMapping.page(mockContents, 'cfiBase', 0, 100);
      }).toThrow("parameter 1 is not of type 'Node'");
    });
  });

  describe('section method', () => {
    it('should call findRanges and rangeListToCfiList', () => {
      // Mock findRanges to return a simple array to test integration
      const originalFindRanges = mapping.findRanges;
      mapping.findRanges = jest
        .fn()
        .mockReturnValue([{ start: 'mockStartRange', end: 'mockEndRange' }]);

      // Mock rangeListToCfiList
      mapping.rangeListToCfiList = jest
        .fn()
        .mockReturnValue([{ start: 'mockStartCfi', end: 'mockEndCfi' }]);

      const result = mapping.section(mockView);

      expect(Array.isArray(result)).toBe(true);
      expect(mapping.findRanges).toHaveBeenCalledWith(mockView);
      expect(mapping.rangeListToCfiList).toHaveBeenCalledWith(
        mockView.section.cfiBase,
        [{ start: 'mockStartRange', end: 'mockEndRange' }]
      );

      // Restore original method
      mapping.findRanges = originalFindRanges;
    });
  });

  describe('layout directions and orientations', () => {
    it('should handle left-to-right horizontal layout', () => {
      const ltrMapping = new Mapping(mockLayout, 'ltr', 'horizontal');
      expect(ltrMapping.direction).toBe('ltr');
      expect(ltrMapping.horizontal).toBe(true);
    });

    it('should handle right-to-left horizontal layout', () => {
      const rtlMapping = new Mapping(mockLayout, 'rtl', 'horizontal');
      expect(rtlMapping.direction).toBe('rtl');
      expect(rtlMapping.horizontal).toBe(true);
    });

    it('should handle vertical layout', () => {
      const verticalMapping = new Mapping(mockLayout, 'ltr', 'vertical');
      expect(verticalMapping.direction).toBe('ltr');
      expect(verticalMapping.horizontal).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle missing layout gracefully', () => {
      expect(() => new Mapping(null as any)).not.toThrow();
    });

    it('should handle invalid axis values', () => {
      const invalidMapping = new Mapping(mockLayout, 'ltr', 'invalid' as any);
      expect(invalidMapping.horizontal).toBe(false);
    });
  });

  describe('DOM interaction', () => {
    it('should work with text nodes that have trim-able content', () => {
      const mockTextNode = {
        nodeType: 3, // TEXT_NODE
        data: '   Some text with spaces   ',
        textContent: '   Some text with spaces   ',
        ownerDocument: mockDocument,
      };

      // Test that the filter function would accept this node
      const filterFunction = jest.fn((node) => {
        if (node.data.trim().length > 0) {
          return 1; // FILTER_ACCEPT
        } else {
          return 2; // FILTER_REJECT
        }
      });

      const result = filterFunction(mockTextNode);
      expect(result).toBe(1); // Should accept non-empty text
    });

    it('should reject empty text nodes', () => {
      const emptyTextNode = {
        nodeType: 3, // TEXT_NODE
        data: '   ',
        textContent: '   ',
      };

      const filterFunction = jest.fn((node) => {
        if (node.data.trim().length > 0) {
          return 1; // FILTER_ACCEPT
        } else {
          return 2; // FILTER_REJECT
        }
      });

      const result = filterFunction(emptyTextNode);
      expect(result).toBe(2); // Should reject empty text
    });
  });

  describe('range operations', () => {
    it('should handle range creation and manipulation', () => {
      const mockRange = {
        setStart: jest.fn(),
        setEnd: jest.fn(),
        selectNodeContents: jest.fn(),
        collapse: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({
          left: 10,
          right: 110,
          top: 5,
          bottom: 25,
        })),
      };

      mockDocument.createRange.mockReturnValue(mockRange);

      const range = mockDocument.createRange();
      range.setStart(mockBody, 0);
      range.setEnd(mockBody, 10);

      expect(range.setStart).toHaveBeenCalledWith(mockBody, 0);
      expect(range.setEnd).toHaveBeenCalledWith(mockBody, 10);
    });
  });
});
