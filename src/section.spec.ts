// Import types for TypeScript checking
import type {
  SpineItem,
  Match,
  GlobalLayout,
  LayoutSettings,
} from '../types/section';
import type { HooksObject } from '../types/utils/hook';

// Import the actual TypeScript module
import Section from './section';

// Mock dependencies
jest.mock('./epubcfi', () => {
  return jest.fn().mockImplementation(() => ({
    toString: jest.fn().mockReturnValue('mock-cfi-string'),
  }));
});
jest.mock('./utils/core');
jest.mock('./utils/hook');
jest.mock('./utils/replacements');
jest.mock('./utils/request');

const MockedEpubCFI = jest.fn();
const MockedHook = jest.fn();

describe('Section', () => {
  let mockItem: any;
  let mockHooks: any;
  let section: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock defer to return a simple promise-like object
    const mockDefer = jest.requireMock('./utils/core').defer;
    mockDefer.mockImplementation(() => {
      let resolveCallback: (value?: any) => void;
      let rejectCallback: (reason?: any) => void;

      const promise = new Promise((resolve, reject) => {
        resolveCallback = resolve;
        rejectCallback = reject;
      });

      return {
        promise,
        resolve: resolveCallback!,
        reject: rejectCallback!,
      };
    });

    // Mock Hook constructor
    MockedHook.mockImplementation(
      () =>
        ({
          trigger: jest.fn().mockResolvedValue(undefined),
          clear: jest.fn(),
        }) as any
    );

    // Mock EpubCFI constructor
    MockedEpubCFI.mockImplementation(
      () =>
        ({
          toString: jest.fn().mockReturnValue('mock-cfi-string'),
        }) as any
    );

    mockItem = {
      idref: 'chapter-1',
      linear: 'yes',
      properties: ['rendition:layout-pre-paginated', 'rendition:spread-both'],
      index: 0,
      href: 'chapter1.xhtml',
      url: 'http://example.com/chapter1.xhtml',
      canonical: 'chapter1.xhtml',
      next: () => ({}),
      prev: () => ({}),
      cfiBase: '/6/4[chapter-1]!',
    };

    mockHooks = {
      serialize: new MockedHook({}),
      content: new MockedHook({}),
    };
  });

  describe('constructor', () => {
    it('should initialize with item properties', () => {
      section = new Section(mockItem, mockHooks);

      expect(section.idref).toBe('chapter-1');
      expect(section.linear).toBe(true);
      expect(section.properties).toEqual([
        'rendition:layout-pre-paginated',
        'rendition:spread-both',
      ]);
      expect(section.index).toBe(0);
      expect(section.href).toBe('chapter1.xhtml');
      expect(section.url).toBe('http://example.com/chapter1.xhtml');
      expect(section.canonical).toBe('chapter1.xhtml');
      expect(section.cfiBase).toBe('/6/4[chapter-1]!');
    });

    it('should set linear to false when item.linear is not "yes"', () => {
      mockItem.linear = 'no';
      section = new Section(mockItem, mockHooks);

      expect(section.linear).toBe(false);
    });

    it('should create default hooks when none provided', () => {
      section = new Section(mockItem, undefined as any);

      expect(section.hooks).toBeDefined();
      expect(section.hooks.serialize).toBeDefined();
      expect(section.hooks.content).toBeDefined();
      expect(MockedHook).toHaveBeenCalledTimes(2);
    });

    it('should use provided hooks when given', () => {
      section = new Section(mockItem, mockHooks);

      expect(section.hooks).toBe(mockHooks);
    });

    it('should initialize content properties as undefined', () => {
      section = new Section(mockItem, mockHooks);

      expect(section.document).toBeUndefined();
      expect(section.contents).toBeUndefined();
      expect(section.output).toBeUndefined();
    });
  });

  describe('load', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
    });

    it('should resolve immediately if contents already exist', async () => {
      const mockContents = document.createElement('div');
      section.contents = mockContents;

      const result = await section.load();

      expect(result).toBe(mockContents);
    });

    it('should make request and process XML when contents do not exist', async () => {
      const mockRequest = jest.fn();
      const mockXml = {
        documentElement: document.createElement('html'),
      };

      mockRequest.mockResolvedValue(mockXml);
      mockHooks.content.trigger.mockResolvedValue(undefined);

      const result = await section.load(mockRequest);

      expect(mockRequest).toHaveBeenCalledWith(section.url, 'xml', false, {});
      expect(section.document).toBe(mockXml);
      expect(section.contents).toBe(mockXml.documentElement);
      expect(mockHooks.content.trigger).toHaveBeenCalledWith(mockXml, section);
      expect(result).toBe(mockXml.documentElement);
    });

    it('should reject on request error', async () => {
      const mockRequest = jest.fn();
      const error = new Error('Network error');

      mockRequest.mockRejectedValue(error);

      await expect(section.load(mockRequest)).rejects.toThrow('Network error');
    });
  });

  describe('render', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);

      // Mock XMLSerializer
      global.XMLSerializer = jest.fn().mockImplementation(() => ({
        serializeToString: jest
          .fn()
          .mockReturnValue('<html>mocked content</html>'),
      }));
    });

    it('should load content, serialize it, and trigger hooks', async () => {
      const mockContents = document.createElement('html');
      section.contents = mockContents;

      mockHooks.serialize.trigger.mockResolvedValue(undefined);

      const result = await section.render();

      expect(result).toBe('<html>mocked content</html>');
      expect(section.output).toBe('<html>mocked content</html>');
      expect(mockHooks.serialize.trigger).toHaveBeenCalledWith(
        section.output,
        section
      );
    });

    it('should handle render errors', async () => {
      const error = new Error('Serialization error');
      mockHooks.serialize.trigger.mockRejectedValue(error);

      section.contents = document.createElement('html');

      await expect(section.render()).rejects.toThrow('Serialization error');
    });
  });

  describe('find', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);

      // Mock document with createRange
      section.document = {
        createRange: jest.fn().mockReturnValue({
          setStart: jest.fn(),
          setEnd: jest.fn(),
        }),
      } as any;

      // Mock sprint function to simulate finding text
      const mockSprint = jest.requireMock('./utils/core').sprint;
      mockSprint.mockImplementation(
        (doc: any, callback: (node: any) => void) => {
          // Simulate calling callback with mock text nodes
          const mockNode = {
            textContent: 'This is a sample text with query term and more text',
          };
          callback(mockNode);
        }
      );

      // Mock cfiFromRange method to return a CFI
      section.cfiFromRange = jest.fn().mockReturnValue('mock-cfi-string');
    });

    it('should find matches in text content', () => {
      const results = section.find('query');

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('cfi');
      expect(results[0]).toHaveProperty('excerpt');
      expect(results[0].cfi).toBe('mock-cfi-string');
    });

    it('should return empty array when no matches found', () => {
      const results = section.find('nonexistent');

      expect(results).toHaveLength(0);
    });

    it('should handle case-insensitive search', () => {
      const results = section.find('QUERY');

      expect(results).toHaveLength(1);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
      section.document = document.createElement('div');
    });

    it('should use TreeWalker when available', () => {
      const mockTreeWalker = {
        nextNode: jest
          .fn()
          .mockReturnValueOnce({ textContent: 'first text' })
          .mockReturnValueOnce({ textContent: 'query text' })
          .mockReturnValueOnce(null),
      };

      jest
        .spyOn(document, 'createTreeWalker')
        .mockReturnValue(mockTreeWalker as any);

      section.document = {
        createRange: jest.fn().mockReturnValue({
          setStart: jest.fn(),
          setEnd: jest.fn(),
        }),
      } as any;

      const results = section.search('query');

      expect(document.createTreeWalker).toHaveBeenCalled();
      expect(mockTreeWalker.nextNode).toHaveBeenCalled();
    });
  });

  describe('reconcileLayoutSettings', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
    });

    it('should merge global layout settings with section properties', () => {
      const globalLayout = {
        layout: 'reflowable',
        spread: 'auto',
        orientation: 'auto',
      };

      const settings = section.reconcileLayoutSettings(globalLayout);

      expect(settings.layout).toBe('pre-paginated'); // From section properties
      expect(settings.spread).toBe('both'); // From section properties
      expect(settings.orientation).toBe('auto'); // From global layout
    });

    it('should use global settings when section has no relevant properties', () => {
      section.properties = [];

      const globalLayout = {
        layout: 'reflowable',
        spread: 'auto',
        orientation: 'landscape',
      };

      const settings = section.reconcileLayoutSettings(globalLayout);

      expect(settings).toEqual(globalLayout);
    });
  });

  describe('cfiFromRange', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
    });

    it('should create CFI from range', () => {
      const mockRange = {} as Range;

      const cfi = section.cfiFromRange(mockRange);

      expect(cfi).toBe('mock-cfi-string');
    });
  });

  describe('cfiFromElement', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
    });

    it('should create CFI from element', () => {
      const mockElement = document.createElement('div');

      const cfi = section.cfiFromElement(mockElement);

      expect(cfi).toBe('mock-cfi-string');
    });
  });

  describe('unload', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
      section.document = {} as Document;
      section.contents = document.createElement('div');
      section.output = 'test output';
    });

    it('should clear document, contents, and output', () => {
      section.unload();

      expect(section.document).toBeUndefined();
      expect(section.contents).toBeUndefined();
      expect(section.output).toBeUndefined();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
      section.document = {} as Document;
      section.contents = document.createElement('div');
      section.output = 'test output';
    });

    it('should clear all properties and hooks', () => {
      section.destroy();

      expect(section.document).toBeUndefined();
      expect(section.contents).toBeUndefined();
      expect(section.output).toBeUndefined();
      expect(section.hooks).toBeUndefined();
      expect(section.idref).toBeUndefined();
      expect(section.linear).toBeUndefined();
      expect(section.properties).toBeUndefined();
      expect(section.index).toBeUndefined();
      expect(section.href).toBeUndefined();
      expect(section.url).toBeUndefined();
      expect(section.next).toBeUndefined();
      expect(section.prev).toBeUndefined();
      expect(section.cfiBase).toBeUndefined();

      expect(mockHooks.serialize.clear).toHaveBeenCalled();
      expect(mockHooks.content.clear).toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    beforeEach(() => {
      section = new Section(mockItem, mockHooks);
    });

    it('should handle complete load and render cycle', async () => {
      const mockRequest = jest.fn();
      const mockXml = {
        documentElement: document.createElement('html'),
      };

      mockRequest.mockResolvedValue(mockXml);
      mockHooks.content.trigger.mockResolvedValue(undefined);
      mockHooks.serialize.trigger.mockResolvedValue(undefined);

      // Load first
      await section.load(mockRequest);

      expect(section.document).toBe(mockXml);
      expect(section.contents).toBe(mockXml.documentElement);

      // Then render
      const rendered = await section.render();

      expect(rendered).toBe('<html>mocked content</html>');
      expect(section.output).toBe('<html>mocked content</html>');
    });

    it('should maintain state through multiple operations', () => {
      expect(section.idref).toBe('chapter-1');
      expect(section.linear).toBe(true);

      section.unload();

      // Core properties should remain
      expect(section.idref).toBe('chapter-1');
      expect(section.linear).toBe(true);

      // Content should be cleared
      expect(section.document).toBeUndefined();
      expect(section.contents).toBeUndefined();
    });
  });
});
