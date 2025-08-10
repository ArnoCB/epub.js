import Spine from './spine';
import MockedSection from './section';
import MockedEpubCFI from './epubcfi';
import MockedHook from './utils/hook';

// Mock dependencies
jest.mock('./epubcfi', () => {
  return jest.fn().mockImplementation(() => ({
    generateChapterComponent: jest.fn(
      (spineNodeIndex, index, id) =>
        `epubcfi(/6/2[${id || 'chapter' + index}]!)`
    ),
    isCfiString: jest.fn(
      (target) => typeof target === 'string' && target.startsWith('epubcfi(')
    ),
  }));
});

jest.mock('./utils/hook', () => {
  return jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    clear: jest.fn(),
  }));
});

jest.mock('./section', () => {
  return jest.fn().mockImplementation((item, hooks) => ({
    ...item,
    linear: item.linear === 'yes', // Convert string to boolean like real Section
    hooks,
    destroy: jest.fn(),
  }));
});

jest.mock('./utils/replacements', () => ({
  replaceBase: jest.fn(),
  replaceCanonical: jest.fn(),
  replaceMeta: jest.fn(),
}));

// Type the mocked imports properly
const Section = MockedSection as jest.MockedClass<typeof MockedSection>;
const EpubCFI = MockedEpubCFI as jest.MockedClass<typeof MockedEpubCFI>;
const Hook = MockedHook as jest.MockedClass<typeof MockedHook>;

describe('Spine', () => {
  let spine: any;
  let mockPackage: any;
  let mockResolver: jest.MockedFunction<any>;
  let mockCanonical: jest.MockedFunction<any>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    Section.mockClear();
    EpubCFI.mockClear();
    Hook.mockClear();

    // Create a new Spine instance
    spine = new Spine();

    // Setup mock functions
    mockResolver = jest.fn((href, resolve) => `resolved://${href}`);
    mockCanonical = jest.fn((href) => `canonical://${href}`);

    // Setup mock package
    mockPackage = {
      spine: [
        {
          idref: 'chapter1',
          href: 'chapter1.html',
          linear: 'yes',
          properties: [],
        },
        {
          idref: 'chapter2',
          href: 'chapter2.html',
          linear: 'yes',
          properties: [],
        },
        {
          idref: 'toc',
          href: 'toc.html',
          linear: 'no',
          properties: [],
        },
      ],
      manifest: {
        chapter1: {
          href: 'chapter1.html',
          properties: ['nav'],
        },
        chapter2: {
          href: 'chapter2.html',
          properties: [],
        },
        toc: {
          href: 'toc.html',
          properties: ['nav'],
        },
      },
      spineNodeIndex: 0,
      baseUrl: 'https://example.com/',
      basePath: '/books/',
    };
  });

  describe('constructor', () => {
    it('should initialize with empty arrays and objects', () => {
      expect(spine.spineItems).toEqual([]);
      expect(spine.spineByHref).toEqual({});
      expect(spine.spineById).toEqual({});
      expect(spine.loaded).toBe(false);
    });

    it('should initialize hooks object', () => {
      expect(spine.hooks).toBeDefined();
      expect(spine.hooks.serialize).toBeDefined();
      expect(spine.hooks.content).toBeDefined();
    });

    it('should register replacement hooks', () => {
      expect(MockedHook).toHaveBeenCalledTimes(2);
      expect(spine.hooks.content.register).toHaveBeenCalledTimes(3);
    });

    it('should initialize epubcfi instance', () => {
      expect(MockedEpubCFI).toHaveBeenCalledTimes(1);
      expect(spine.epubcfi).toBeDefined();
    });

    it('should initialize undefined properties', () => {
      expect(spine.items).toBeUndefined();
      expect(spine.manifest).toBeUndefined();
      expect(spine.spineNodeIndex).toBeUndefined();
      expect(spine.baseUrl).toBeUndefined();
      expect(spine.length).toBeUndefined();
    });
  });

  describe('unpack', () => {
    beforeEach(() => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
    });

    it('should set package properties', () => {
      expect(spine.items).toBe(mockPackage.spine);
      expect(spine.manifest).toBe(mockPackage.manifest);
      expect(spine.spineNodeIndex).toBe(mockPackage.spineNodeIndex);
      expect(spine.baseUrl).toBe(mockPackage.baseUrl);
      expect(spine.length).toBe(mockPackage.spine.length);
      expect(spine.loaded).toBe(true);
    });

    it('should process each spine item', () => {
      expect(spine.spineItems).toHaveLength(3);
      expect(Section).toHaveBeenCalledTimes(3);
    });

    it('should set item properties correctly', () => {
      const firstItem = mockPackage.spine[0];
      expect(firstItem.index).toBe(0);
      expect(firstItem.url).toBe('resolved://chapter1.html');
      expect(firstItem.canonical).toBe('canonical://chapter1.html');
      expect(firstItem.cfiBase).toBeDefined();
    });

    it('should merge manifest properties', () => {
      const firstItem = mockPackage.spine[0];
      expect(firstItem.properties).toContain('nav');
    });

    it('should create prev/next functions for linear items', () => {
      const firstItem = mockPackage.spine[0];
      const secondItem = mockPackage.spine[1];
      expect(typeof firstItem.prev).toBe('function');
      expect(typeof firstItem.next).toBe('function');
      expect(typeof secondItem.prev).toBe('function');
      expect(typeof secondItem.next).toBe('function');
    });

    it('should create empty prev/next functions for non-linear items', () => {
      const tocItem = mockPackage.spine[2];
      expect(typeof tocItem.prev).toBe('function');
      expect(typeof tocItem.next).toBe('function');
      expect(tocItem.prev()).toBeUndefined();
      expect(tocItem.next()).toBeUndefined();
    });

    it('should handle basePath fallback', () => {
      const packageWithBasePath = {
        ...mockPackage,
        baseUrl: undefined,
        basePath: '/fallback/',
      };
      const newSpine = new Spine();
      newSpine.unpack(packageWithBasePath, mockResolver, mockCanonical);
      expect(newSpine.baseUrl).toBe('/fallback/');
    });

    it('should handle empty baseUrl and basePath', () => {
      const packageWithoutBase = {
        ...mockPackage,
        baseUrl: undefined,
        basePath: undefined,
      };
      const newSpine = new Spine();
      newSpine.unpack(packageWithoutBase, mockResolver, mockCanonical);
      expect(newSpine.baseUrl).toBe('');
    });
  });

  describe('get', () => {
    beforeEach(() => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
    });

    it('should return first linear item when called without arguments', () => {
      const result = spine.get();
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should return item by numeric index', () => {
      const result = spine.get(1);
      expect(result).toBe(spine.spineItems[1]);
    });

    it('should return item by string numeric index', () => {
      const result = spine.get('1');
      expect(result).toBe(spine.spineItems[1]);
    });

    it('should return item by href', () => {
      const result = spine.get('chapter1.html');
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should return item by href with fragment removed', () => {
      const result = spine.get('chapter1.html#section1');
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should return item by encoded href', () => {
      // Mock encoded URI lookup
      spine.spineByHref['chapter%201.html'] = 0;
      const result = spine.get('chapter 1.html');
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should return item by id reference', () => {
      const result = spine.get('#chapter1');
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should return item by CFI string', () => {
      spine.epubcfi.isCfiString.mockReturnValue(true);
      // Mock the EpubCFI constructor to return an object with spinePos
      const mockCFI = { spinePos: 1 } as any;
      EpubCFI.mockImplementationOnce(() => mockCFI);

      const result = spine.get('epubcfi(/6/4!/2)');
      expect(result).toBe(spine.spineItems[1]);
    });

    it('should return null for invalid index', () => {
      const result = spine.get(999);
      expect(result).toBeNull();
    });

    it('should return null for non-existent href', () => {
      const result = spine.get('nonexistent.html');
      expect(result).toBeNull();
    });

    it('should return null for non-existent id', () => {
      const result = spine.get('#nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('append', () => {
    let mockSection: any;

    beforeEach(() => {
      mockSection = {
        href: 'new-chapter.html',
        idref: 'new-chapter',
      };
    });

    it('should add section to spineItems', () => {
      const index = spine.append(mockSection);
      expect(spine.spineItems).toContain(mockSection);
      expect(index).toBe(0);
      expect(mockSection.index).toBe(0);
    });

    it('should update lookup indices', () => {
      spine.append(mockSection);
      expect(spine.spineByHref['new-chapter.html']).toBe(0);
      expect(spine.spineByHref[decodeURI('new-chapter.html')]).toBe(0);
      expect(spine.spineByHref[encodeURI('new-chapter.html')]).toBe(0);
      expect(spine.spineById['new-chapter']).toBe(0);
    });

    it('should return correct index for multiple appends', () => {
      const index1 = spine.append({ href: 'ch1.html', idref: 'ch1' });
      const index2 = spine.append({ href: 'ch2.html', idref: 'ch2' });
      expect(index1).toBe(0);
      expect(index2).toBe(1);
    });
  });

  describe('prepend', () => {
    let mockSection: any;

    beforeEach(() => {
      // First add some items
      spine.append({ href: 'ch1.html', idref: 'ch1' });
      spine.append({ href: 'ch2.html', idref: 'ch2' });

      mockSection = {
        href: 'new-first.html',
        idref: 'new-first',
      };
    });

    it('should add section at beginning and update indices', () => {
      const result = spine.prepend(mockSection);
      expect(result).toBe(0);
      expect(spine.spineByHref['new-first.html']).toBe(0);
      expect(spine.spineById['new-first']).toBe(0);
    });

    it('should re-index existing items', () => {
      spine.prepend(mockSection);
      spine.spineItems.forEach((item: any, index: number) => {
        expect(item.index).toBe(index);
      });
    });
  });

  describe('remove', () => {
    let section1: any, section2: any;

    beforeEach(() => {
      section1 = { href: 'ch1.html', idref: 'ch1' };
      section2 = { href: 'ch2.html', idref: 'ch2' };
      spine.append(section1);
      spine.append(section2);
    });

    it('should remove section from spineItems', () => {
      const removed = spine.remove(section1);
      expect(spine.spineItems).not.toContain(section1);
      expect(removed).toEqual([section1]);
    });

    it('should remove from lookup indices', () => {
      spine.remove(section1);
      expect(spine.spineByHref['ch1.html']).toBeUndefined();
      expect(spine.spineById['ch1']).toBeUndefined();
    });

    it('should return undefined for non-existent section', () => {
      const nonExistentSection = { href: 'fake.html', idref: 'fake' };
      const result = spine.remove(nonExistentSection);
      expect(result).toBeUndefined();
    });
  });

  describe('each', () => {
    beforeEach(() => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
    });

    it('should iterate over all spine items', () => {
      const callback = jest.fn();
      spine.each(callback);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(
        spine.spineItems[0],
        0,
        spine.spineItems
      );
      expect(callback).toHaveBeenCalledWith(
        spine.spineItems[1],
        1,
        spine.spineItems
      );
      expect(callback).toHaveBeenCalledWith(
        spine.spineItems[2],
        2,
        spine.spineItems
      );
    });
  });

  describe('first', () => {
    beforeEach(() => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
    });

    it('should return first linear section', () => {
      const result = spine.first();
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should skip non-linear sections', () => {
      // Make first item non-linear
      spine.spineItems[0].linear = false;
      const result = spine.first();
      expect(result).toBe(spine.spineItems[1]);
    });

    it('should return undefined if no linear sections exist', () => {
      // Make all items non-linear
      spine.spineItems.forEach((item: any) => (item.linear = false));
      const result = spine.first();
      expect(result).toBeUndefined();
    });
  });

  describe('last', () => {
    beforeEach(() => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
    });

    it('should return last linear section', () => {
      const result = spine.last();
      // In the mock package, chapter2 (index 1) is the last linear item (toc is non-linear)
      expect(result).toBe(spine.spineItems[1]); // chapter2 is the last linear item
    });

    it('should skip non-linear sections from the end', () => {
      // Make last linear item non-linear
      spine.spineItems[1].linear = false;
      const result = spine.last();
      expect(result).toBe(spine.spineItems[0]);
    });

    it('should return undefined if no linear sections exist', () => {
      // Make all items non-linear
      spine.spineItems.forEach((item: any) => (item.linear = false));
      const result = spine.last();
      expect(result).toBeUndefined();
    });
  });

  describe('prev/next functions', () => {
    beforeEach(() => {
      // Create a more complex spine with mixed linear/non-linear items
      const complexPackage = {
        ...mockPackage,
        spine: [
          { idref: 'cover', href: 'cover.html', linear: 'no', properties: [] },
          { idref: 'ch1', href: 'ch1.html', linear: 'yes', properties: [] },
          { idref: 'toc', href: 'toc.html', linear: 'no', properties: [] },
          { idref: 'ch2', href: 'ch2.html', linear: 'yes', properties: [] },
          { idref: 'ch3', href: 'ch3.html', linear: 'yes', properties: [] },
        ],
        manifest: {
          cover: { href: 'cover.html', properties: [] },
          ch1: { href: 'ch1.html', properties: [] },
          toc: { href: 'toc.html', properties: [] },
          ch2: { href: 'ch2.html', properties: [] },
          ch3: { href: 'ch3.html', properties: [] },
        },
      };
      spine.unpack(complexPackage, mockResolver, mockCanonical);
    });

    it('should navigate prev correctly for linear items', () => {
      const ch2SpineItem = spine.spineItems[3]; // ch2 spine item
      const prevItem = ch2SpineItem.prev();
      expect(prevItem).toBe(spine.spineItems[1]); // ch1
    });

    it('should navigate next correctly for linear items', () => {
      const ch1SpineItem = spine.spineItems[1]; // ch1 spine item
      const nextItem = ch1SpineItem.next();
      expect(nextItem).toBe(spine.spineItems[3]); // ch2
    });

    it('should return undefined for prev of first linear item', () => {
      const ch1SpineItem = spine.spineItems[1]; // ch1 (first linear)
      const prevItem = ch1SpineItem.prev();
      expect(prevItem).toBeUndefined();
    });

    it('should return undefined for next of last linear item', () => {
      const ch3SpineItem = spine.spineItems[4]; // ch3 (last linear)
      const nextItem = ch3SpineItem.next();
      expect(nextItem).toBeUndefined();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
    });

    it('should call destroy on all sections', () => {
      // Capture sections before destroying
      const sections = [...spine.spineItems];
      spine.destroy();
      sections.forEach((section: any) => {
        expect(section.destroy).toHaveBeenCalled();
      });
    });

    it('should clear all hooks', () => {
      // Capture hooks before destroying
      const { serialize: serializeHook, content: contentHook } = spine.hooks;
      spine.destroy();
      expect(serializeHook.clear).toHaveBeenCalled();
      expect(contentHook.clear).toHaveBeenCalled();
    });

    it('should reset all properties to undefined', () => {
      spine.destroy();
      expect(spine.spineItems).toBeUndefined();
      expect(spine.spineByHref).toBeUndefined();
      expect(spine.spineById).toBeUndefined();
      expect(spine.hooks).toBeUndefined();
      expect(spine.epubcfi).toBeUndefined();
      expect(spine.items).toBeUndefined();
      expect(spine.manifest).toBeUndefined();
      expect(spine.spineNodeIndex).toBeUndefined();
      expect(spine.baseUrl).toBeUndefined();
      expect(spine.length).toBeUndefined();
      expect(spine.loaded).toBe(false);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty spine items in unpack', () => {
      const emptyPackage = {
        spine: [],
        manifest: {},
        spineNodeIndex: 0,
        baseUrl: '',
      };
      spine.unpack(emptyPackage, mockResolver, mockCanonical);
      expect(spine.spineItems).toHaveLength(0);
      expect(spine.length).toBe(0);
    });

    it('should handle missing manifest items', () => {
      const packageWithMissingManifest = {
        spine: [
          {
            idref: 'missing',
            href: 'missing.html',
            linear: 'yes',
            properties: [],
          },
        ],
        manifest: {}, // empty manifest
        spineNodeIndex: 0,
        baseUrl: '',
      };
      spine.unpack(packageWithMissingManifest, mockResolver, mockCanonical);
      expect(spine.spineItems).toHaveLength(1);
      // Should still process the item even without manifest entry
      expect(spine.spineItems[0].href).toBe('missing.html');
    });

    it('should handle items without href in spine', () => {
      const packageWithoutHref = {
        spine: [{ idref: 'no-href', linear: 'yes', properties: [] }],
        manifest: {
          'no-href': { href: 'from-manifest.html', properties: [] },
        },
        spineNodeIndex: 0,
        baseUrl: '',
      };
      spine.unpack(packageWithoutHref, mockResolver, mockCanonical);
      expect(spine.spineItems[0].href).toBe('from-manifest.html');
    });

    it('should handle get with NaN string input', () => {
      spine.unpack(mockPackage, mockResolver, mockCanonical);
      const result = spine.get('not-a-number');
      // Should treat as href lookup, not numeric
      expect(result).toBeNull();
    });

    it('should handle special characters in href', () => {
      const section = {
        href: 'special chars & symbols.html',
        idref: 'special',
      };
      spine.append(section);

      // Should be able to find by original href
      expect(spine.spineByHref['special chars & symbols.html']).toBe(0);
      // Should also be able to find by encoded href
      expect(spine.spineByHref[encodeURI('special chars & symbols.html')]).toBe(
        0
      );
    });
  });
});
