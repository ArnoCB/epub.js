/**
 * Test suite for Navigation class
 *
 * These tests cover the core functionality of the Navigation class before
 * converting it from JavaScript to TypeScript. The tests focus on:
 *
 * - Constructor initialization
 * - JSON parsing and data loading
 * - Navigation item unpacking and indexing
 * - Item retrieval by href and id
 * - Landmark management
 * - Edge cases and error conditions
 * - Complete workflow scenarios
 *
 * Note: This test suite primarily focuses on the JavaScript module's current
 * behavior to ensure compatibility when converting to TypeScript. Some tests
 * account for current implementation quirks (e.g., the get method's handling
 * of ID-based lookups).
 */

// Setup polyfills for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
import Navigation from './navigation';

Object.assign(global, { TextDecoder, TextEncoder });

describe('Navigation', () => {
  let navigation: any;

  beforeEach(() => {
    navigation = new Navigation();
  });

  describe('constructor', () => {
    it('should initialize with empty arrays and objects', () => {
      expect(navigation.toc).toEqual([]);
      expect(navigation.tocByHref).toEqual({});
      expect(navigation.tocById).toEqual({});
      expect(navigation.landmarks).toEqual([]);
      expect(navigation.landmarksByType).toEqual({});
      expect(navigation.length).toBe(0);
    });
  });

  describe('unpack', () => {
    beforeEach(() => {
      navigation.toc = [
        {
          id: 'ch1',
          href: 'chapter1.html',
          label: 'Chapter 1',
          subitems: [
            {
              id: 'ch1-1',
              href: 'chapter1.html#section1',
              label: 'Section 1',
              subitems: [],
            },
          ],
        },
        {
          id: 'ch2',
          href: 'chapter2.html',
          label: 'Chapter 2',
          subitems: [],
        },
      ];
      navigation.unpack(navigation.toc);
    });

    it('should populate tocByHref index', () => {
      expect(navigation.tocByHref['chapter1.html']).toBe(0);
      expect(navigation.tocByHref['chapter2.html']).toBe(1);
      expect(navigation.tocByHref['chapter1.html#section1']).toBe(0);
    });

    it('should populate tocById index', () => {
      expect(navigation.tocById['ch1']).toBe(0);
      expect(navigation.tocById['ch2']).toBe(1);
      expect(navigation.tocById['ch1-1']).toBe(0);
    });

    it('should count total length including subitems', () => {
      expect(navigation.length).toBe(3);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      navigation.toc = [
        {
          id: 'ch1',
          href: 'chapter1.html',
          label: 'Chapter 1',
          subitems: [
            {
              id: 'ch1-1',
              href: 'chapter1.html#section1',
              label: 'Section 1',
              subitems: [],
            },
          ],
        },
      ];
      // Need to call unpack to properly set up the indexes
      navigation.unpack(navigation.toc);
    });

    it('should return entire toc when no target provided', () => {
      const result = navigation.get();
      expect(result).toBe(navigation.toc);
    });

    it('should return item by href', () => {
      const result = navigation.get('chapter1.html');
      expect(result.id).toBe('ch1');
      expect(result.href).toBe('chapter1.html');
    });

    it('should handle the get method behavior as currently implemented', () => {
      // The current implementation has a bug where getByIndex receives the full target
      // including '#' but compares against item.id which doesn't have '#'
      // Let's test what actually happens currently

      // This should work because getByIndex will search recursively when the direct index doesn't match
      const resultByHref = navigation.get('chapter1.html');
      expect(resultByHref).toBeDefined();
      expect(resultByHref.id).toBe('ch1');

      // Test nested item by href
      const nestedResult = navigation.get('chapter1.html#section1');
      expect(nestedResult).toBeDefined();
      expect(nestedResult.id).toBe('ch1-1');
    });

    it('should return undefined for non-existent target', () => {
      const result = navigation.get('nonexistent.html');
      expect(result).toBeUndefined();
    });
  });

  describe('getByIndex', () => {
    const navItems = [
      {
        id: 'ch1',
        href: 'chapter1.html',
        label: 'Chapter 1',
        subitems: [
          {
            id: 'ch1-1',
            href: 'chapter1.html#section1',
            label: 'Section 1',
            subitems: [],
          },
        ],
      },
    ];

    it('should return item when target matches id', () => {
      const result = navigation.getByIndex('ch1', 0, navItems);
      expect(result.id).toBe('ch1');
    });

    it('should return item when target matches href', () => {
      const result = navigation.getByIndex('chapter1.html', 0, navItems);
      expect(result.href).toBe('chapter1.html');
    });

    it('should search recursively in subitems', () => {
      const result = navigation.getByIndex('ch1-1', 0, navItems);
      expect(result.id).toBe('ch1-1');
    });

    it('should return undefined for empty navItems', () => {
      const result = navigation.getByIndex('ch1', 0, []);
      expect(result).toBeUndefined();
    });

    it('should return undefined when target not found', () => {
      const result = navigation.getByIndex('nonexistent', 0, navItems);
      expect(result).toBeUndefined();
    });
  });

  describe('landmark', () => {
    beforeEach(() => {
      navigation.landmarks = [
        { href: 'cover.html', label: 'Cover', type: 'cover' },
        { href: 'toc.html', label: 'Table of Contents', type: 'toc' },
      ];
      navigation.landmarksByType = { cover: 0, toc: 1 };
    });

    it('should return all landmarks when no type provided', () => {
      const result = navigation.landmark();
      expect(result).toBe(navigation.landmarks);
    });

    it('should return specific landmark by type', () => {
      const result = navigation.landmark('cover');
      expect(result.type).toBe('cover');
      expect(result.href).toBe('cover.html');
    });

    it('should return undefined for non-existent type', () => {
      const result = navigation.landmark('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('load', () => {
    it('should transform JSON items to navigation format', () => {
      const jsonItems = [
        {
          id: 'ch1',
          href: 'chapter1.html',
          title: 'Chapter 1',
          children: [
            { id: 'ch1-1', href: 'section1.html', title: 'Section 1' },
          ],
        },
      ];

      const result = navigation.load(jsonItems);

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Chapter 1');
      expect(result[0].subitems).toHaveLength(1);
      expect(result[0].subitems[0].label).toBe('Section 1');
    });

    it('should handle items without children', () => {
      const jsonItems = [
        { id: 'ch1', href: 'chapter1.html', title: 'Chapter 1' },
      ];

      const result = navigation.load(jsonItems);

      expect(result[0].subitems).toEqual([]);
    });
  });

  describe('forEach', () => {
    it('should call forEach on toc array', () => {
      navigation.toc = [
        { id: 'ch1', href: 'chapter1.html', label: 'Chapter 1', subitems: [] },
        { id: 'ch2', href: 'chapter2.html', label: 'Chapter 2', subitems: [] },
      ];

      const mockFn = jest.fn();
      navigation.forEach(mockFn);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith(navigation.toc[0], 0, navigation.toc);
      expect(mockFn).toHaveBeenCalledWith(navigation.toc[1], 1, navigation.toc);
    });
  });

  describe('parse - JSON format', () => {
    it('should parse from JSON object when not XML', () => {
      const jsonData = [
        {
          id: 'ch1',
          href: 'chapter1.html',
          title: 'Chapter 1',
          children: [
            { id: 'ch1-1', href: 'chapter1.html#section1', title: 'Section 1' },
          ],
        },
      ];

      navigation.parse(jsonData);

      expect(navigation.toc).toHaveLength(1);
      expect(navigation.toc[0].id).toBe('ch1');
      expect(navigation.toc[0].label).toBe('Chapter 1');
      expect(navigation.toc[0].subitems).toHaveLength(1);
      expect(navigation.length).toBe(2);
    });

    it('should handle empty JSON array', () => {
      navigation.parse([]);
      expect(navigation.toc).toEqual([]);
      expect(navigation.length).toBe(0);
    });

    it('should handle complex nested JSON structure', () => {
      const jsonData = [
        {
          id: 'ch1',
          href: 'chapter1.html',
          title: 'Chapter 1',
          children: [
            {
              id: 'ch1-1',
              href: 'chapter1.html#section1',
              title: 'Section 1',
              children: [
                {
                  id: 'ch1-1-1',
                  href: 'chapter1.html#subsection1',
                  title: 'Subsection 1',
                },
              ],
            },
          ],
        },
        {
          id: 'ch2',
          href: 'chapter2.html',
          title: 'Chapter 2',
        },
      ];

      navigation.parse(jsonData);

      expect(navigation.toc).toHaveLength(2);
      expect(navigation.toc[0].subitems).toHaveLength(1);
      expect(navigation.toc[0].subitems[0].subitems).toHaveLength(1);
      expect(navigation.toc[0].subitems[0].subitems[0].label).toBe(
        'Subsection 1'
      );
      expect(navigation.length).toBe(4); // ch1, ch1-1, ch1-1-1, ch2
    });
  });

  describe('edge cases', () => {
    it('should handle empty toc for unpack', () => {
      navigation.toc = [];
      navigation.unpack(navigation.toc);
      expect(navigation.length).toBe(0);
      expect(navigation.tocByHref).toEqual({});
      expect(navigation.tocById).toEqual({});
    });

    it('should handle items without id or href', () => {
      navigation.toc = [
        { label: 'Chapter 1', subitems: [] },
        { id: 'ch2', label: 'Chapter 2', subitems: [] },
        { href: 'chapter3.html', label: 'Chapter 3', subitems: [] },
      ];
      navigation.unpack(navigation.toc);

      expect(navigation.length).toBe(3);
      expect(navigation.tocById['ch2']).toBe(1);
      expect(navigation.tocByHref['chapter3.html']).toBe(2);
    });

    it('should handle getByIndex with index out of bounds', () => {
      const navItems = [
        { id: 'ch1', href: 'chapter1.html', label: 'Chapter 1', subitems: [] },
      ];

      const result = navigation.getByIndex('ch1', 999, navItems);
      expect(result).toBeUndefined();
    });
  });

  describe('complete workflow test', () => {
    it('should handle complete workflow from JSON to navigation access', () => {
      // Parse JSON data
      const jsonData = [
        {
          id: 'introduction',
          href: 'intro.html',
          title: 'Introduction',
          children: [
            { id: 'overview', href: 'intro.html#overview', title: 'Overview' },
            {
              id: 'objectives',
              href: 'intro.html#objectives',
              title: 'Objectives',
            },
          ],
        },
        {
          id: 'methods',
          href: 'methods.html',
          title: 'Methods and Procedures',
        },
        {
          id: 'conclusion',
          href: 'conclusion.html',
          title: 'Conclusion',
        },
      ];

      navigation.parse(jsonData);

      // Test structure
      expect(navigation.toc).toHaveLength(3);
      expect(navigation.length).toBe(5); // 3 main + 2 sub items

      // Test access by href
      const introChapter = navigation.get('intro.html');
      expect(introChapter.label).toBe('Introduction');
      expect(introChapter.subitems).toHaveLength(2);

      // Test access by href for nested items
      const overviewSection = navigation.get('intro.html#overview');
      expect(overviewSection.label).toBe('Overview');

      // Test access to main chapter by href
      const methodsChapter = navigation.get('methods.html');
      expect(methodsChapter.label).toBe('Methods and Procedures');
      expect(methodsChapter.href).toBe('methods.html');

      // Test iteration
      let chapterCount = 0;
      navigation.forEach((item: any) => {
        chapterCount++;
        expect(item.label).toBeDefined();
        expect(item.href).toBeDefined();
      });
      expect(chapterCount).toBe(3); // Only top-level items
    });
  });
});
