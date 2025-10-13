// Setup polyfills for Node.js environment
import type { Direction, Flow, LayoutType, Orientation, Spread } from './types';
import { TextEncoder, TextDecoder } from 'util';
import Packaging from './packaging';
Object.assign(global, { TextDecoder, TextEncoder });

import { JSDOM } from 'jsdom';

/**
 * Helper function to create a mock package.opf document
 */
function createMockPackageDocument(
  customMetadata?: any,
  customManifest?: any,
  customSpine?: any
): XMLDocument {
  const metadata = customMetadata || {
    title: 'Test Book',
    creator: 'Test Author',
    identifier: 'test-id-123',
    language: 'en',
    description: 'A test book',
    pubdate: '2024-01-01',
    publisher: 'Test Publisher',
    rights: 'All rights reserved',
  };

  const manifest = customManifest || [
    {
      id: 'nav',
      href: 'nav.xhtml',
      mediaType: 'application/xhtml+xml',
      properties: 'nav',
    },
    {
      id: 'chapter1',
      href: 'chapter1.xhtml',
      mediaType: 'application/xhtml+xml',
    },
    {
      id: 'chapter2',
      href: 'chapter2.xhtml',
      mediaType: 'application/xhtml+xml',
    },
    { id: 'ncx', href: 'toc.ncx', mediaType: 'application/x-dtbncx+xml' },
    {
      id: 'cover-image',
      href: 'cover.jpg',
      mediaType: 'image/jpeg',
      properties: 'cover-image',
    },
  ];

  const spine = customSpine || [{ idref: 'chapter1' }, { idref: 'chapter2' }];

  const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
    <package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
      <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>${metadata.title}</dc:title>
        <dc:creator>${metadata.creator}</dc:creator>
        <dc:identifier id="uid">${metadata.identifier}</dc:identifier>
        <dc:language>${metadata.language}</dc:language>
        <dc:description>${metadata.description}</dc:description>
        <dc:date>${metadata.pubdate}</dc:date>
        <dc:publisher>${metadata.publisher}</dc:publisher>
        <dc:rights>${metadata.rights}</dc:rights>
        <meta property="dcterms:modified">2024-01-01T00:00:00Z</meta>
      </metadata>
      <manifest>
        ${manifest
          .map(
            (item: any) =>
              `<item id="${item.id}" href="${item.href}" media-type="${item.mediaType}"${item.properties ? ` properties="${item.properties}"` : ''}/>`
          )
          .join('\n        ')}
      </manifest>
      <spine toc="ncx">
        ${spine
          .map((item: any) => `<itemref idref="${item.idref}"/>`)
          .join('\n        ')}
      </spine>
    </package>`;

  const dom = new JSDOM(packageXml, { contentType: 'text/xml' });
  return dom.window.document;
}

describe('Packaging', () => {
  describe('constructor', () => {
    it('should create instance without package document', () => {
      const packaging = new Packaging();

      expect(packaging).toBeInstanceOf(Object);
      // Properties are initialized as empty objects/arrays, not undefined
      expect(packaging.manifest).toEqual({});
      expect(packaging.spine).toEqual([]);
      expect(packaging.metadata).toEqual({});
    });

    it('should create instance and parse package document when provided', () => {
      const packageDoc = createMockPackageDocument();
      const packaging = new Packaging(packageDoc);

      expect(packaging).toBeInstanceOf(Object);
      expect(packaging.manifest).toBeDefined();
      expect(packaging.spine).toBeDefined();
      expect(packaging.metadata).toBeDefined();
    });
  });

  describe('parse', () => {
    let packaging: InstanceType<typeof Packaging>;

    beforeEach(() => {
      packaging = new Packaging();
    });

    it('should throw error when no package document provided', () => {
      expect(() => {
        packaging.parse();
      }).toThrow();
    });

    it('should parse metadata correctly', () => {
      const packageDoc = createMockPackageDocument();

      const result = packaging.parse(packageDoc);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.title).toBe('Test Book');
      expect(result.metadata.creator).toBe('Test Author');
      expect(result.metadata.identifier).toBe('test-id-123');
      expect(result.metadata.language).toBe('en');
    });

    it('should parse manifest correctly', () => {
      const packageDoc = createMockPackageDocument();

      const result = packaging.parse(packageDoc);

      expect(result.manifest).toBeDefined();
      expect(Object.keys(result.manifest)).toHaveLength(5);
      expect(result.manifest['nav']).toBeDefined();
      expect(result.manifest['nav'].href).toBe('nav.xhtml');
      expect(result.manifest['nav'].type).toBe('application/xhtml+xml');
    });

    it('should parse spine correctly', () => {
      const packageDoc = createMockPackageDocument();

      const result = packaging.parse(packageDoc);

      expect(result.spine).toBeDefined();
      expect(result.spine).toHaveLength(2);
      expect(result.spine[0].idref).toBe('chapter1');
      expect(result.spine[1].idref).toBe('chapter2');
    });

    it('should find navigation path correctly', () => {
      const packageDoc = createMockPackageDocument();

      const result = packaging.parse(packageDoc);

      expect(result.navPath).toBe('nav.xhtml');
    });

    it('should find NCX path correctly', () => {
      const packageDoc = createMockPackageDocument();

      const result = packaging.parse(packageDoc);

      // The implementation finds the NCX by media-type
      expect(result.ncxPath).toBe('toc.ncx');
    });

    it('should find cover path correctly', () => {
      const packageDoc = createMockPackageDocument();

      const result = packaging.parse(packageDoc);

      // The implementation looks for cover-image property first, then other methods
      // Our test data has cover-image property, so it should find it
      expect(result.coverPath).toBe('cover.jpg');
    });

    it('should handle missing metadata gracefully', () => {
      const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
          </metadata>
          <manifest>
            <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
          </manifest>
          <spine>
            <itemref idref="chapter1"/>
          </spine>
        </package>`;

      const dom = new JSDOM(packageXml, { contentType: 'text/xml' });
      const packageDoc = dom.window.document;

      const result = packaging.parse(packageDoc);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.title).toBe('');
      expect(result.metadata.creator).toBe('');
    });

    it('should handle empty manifest', () => {
      const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
            <dc:title>Test</dc:title>
          </metadata>
          <manifest>
          </manifest>
          <spine>
          </spine>
        </package>`;

      const dom = new JSDOM(packageXml, { contentType: 'text/xml' });
      const packageDoc = dom.window.document;

      const result = packaging.parse(packageDoc);

      expect(result.manifest).toBeDefined();
      expect(Object.keys(result.manifest)).toHaveLength(0);
    });

    it('should handle empty spine', () => {
      const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
            <dc:title>Test</dc:title>
          </metadata>
          <manifest>
            <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
          </manifest>
          <spine>
          </spine>
        </package>`;

      const dom = new JSDOM(packageXml, { contentType: 'text/xml' });
      const packageDoc = dom.window.document;

      const result = packaging.parse(packageDoc);

      expect(result.spine).toBeDefined();
      expect(result.spine).toHaveLength(0);
    });
  });

  describe('load', () => {
    let packaging: InstanceType<typeof Packaging>;

    beforeEach(() => {
      packaging = new Packaging();
    });

    it('should load from JSON object', () => {
      const jsonData = {
        metadata: {
          title: 'JSON Book',
          creator: 'JSON Author',
          description: 'A test book',
          pubdate: '2023-01-01',
          publisher: 'Test Publisher',
          identifier: 'json-id',
          language: 'en',
          rights: 'All rights reserved',
          modified_date: '2023-01-01T00:00:00Z',
          layout: 'reflowable' as LayoutType,
          orientation: 'auto' as Orientation,
          flow: 'auto' as Flow,
          viewport: '',
          spread: 'auto' as Spread,
          direction: 'ltr' as Direction,
        },
        resources: [
          {
            href: 'chapter1.xhtml',
            type: 'application/xhtml+xml',
            properties: [],
          },
        ],
        readingOrder: [
          { idref: 'item1', properties: [], linear: 'yes', index: 0 },
        ],
        toc: [
          {
            id: 'ch1',
            title: 'Chapter 1',
            href: 'chapter1.xhtml',
            label: 'Chapter 1',
          },
        ],
      };

      // The load function expects a parsed JSON object, not a string
      const result = packaging.load(jsonData);

      expect(result.metadata.title).toBe('JSON Book');
      expect(packaging.manifest[0].href).toBe('chapter1.xhtml');
      expect(packaging.spine[0].idref).toBe('item1');
      expect(packaging.spine[0].index).toBe(0);
      expect(packaging.spine[0].linear).toBe('yes');
    });

    it('should handle invalid JSON gracefully', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        packaging.load('invalid json');
      }).toThrow();
    });
  });

  describe('destroy', () => {
    it('should clean up object references for garbage collection', () => {
      const packageDoc = createMockPackageDocument();
      const packaging = new Packaging(packageDoc);

      // Verify object properties are set
      expect(packaging.manifest).toBeDefined();
      expect(packaging.spine).toBeDefined();
      expect(packaging.metadata).toBeDefined();
      // Note: toc is only set in load method, not constructor

      packaging.destroy();

      // Verify object references are cleared for garbage collection
      expect(packaging.manifest).toBeUndefined();
      expect(packaging.spine).toBeUndefined();
      expect(packaging.metadata).toBeUndefined();
      // toc should also be cleared if it was set
      expect(packaging.toc).toBeUndefined();

      // String properties remain (no memory leak concern)
      // Note: Some may be empty strings or undefined depending on the document
    });
  });

  describe('edge cases and error handling', () => {
    let packaging: InstanceType<typeof Packaging>;

    beforeEach(() => {
      packaging = new Packaging();
    });

    it('should handle malformed XML gracefully', () => {
      // JSDOM actually throws an error for malformed XML, so this documents the actual behavior
      expect(() => {
        const malformedXml =
          '<package><metadata><title>Test</metadata></package>';
        const dom = new JSDOM(malformedXml, { contentType: 'text/xml' });
        const packageDoc = dom.window.document;
        packaging.parse(packageDoc);
      }).toThrow();
    });

    it('should handle missing required elements', () => {
      const minimalXml = `<?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
        </package>`;

      const dom = new JSDOM(minimalXml, { contentType: 'text/xml' });
      const packageDoc = dom.window.document;

      // The actual implementation throws an error when metadata is missing
      expect(() => {
        packaging.parse(packageDoc);
      }).toThrow('No Metadata Found');
    });

    it('should handle spine items with missing manifest entries', () => {
      const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
            <dc:title>Test</dc:title>
          </metadata>
          <manifest>
            <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
          </manifest>
          <spine>
            <itemref idref="chapter1"/>
            <itemref idref="nonexistent"/>
          </spine>
        </package>`;

      const dom = new JSDOM(packageXml, { contentType: 'text/xml' });
      const packageDoc = dom.window.document;

      const result = packaging.parse(packageDoc);

      expect(result.spine).toHaveLength(2);
      expect(result.spine[0].idref).toBe('chapter1');
      expect(result.spine[1].idref).toBe('nonexistent');
    });
  });

  describe('property extraction', () => {
    let packaging: InstanceType<typeof Packaging>;

    beforeEach(() => {
      packaging = new Packaging();
    });

    it('should extract properties from manifest items', () => {
      const manifest = [
        {
          id: 'nav',
          href: 'nav.xhtml',
          mediaType: 'application/xhtml+xml',
          properties: 'nav',
        },
        {
          id: 'scripted',
          href: 'scripted.xhtml',
          mediaType: 'application/xhtml+xml',
          properties: 'scripted',
        },
        {
          id: 'cover',
          href: 'cover.xhtml',
          mediaType: 'application/xhtml+xml',
          properties: 'svg',
        },
      ];

      const packageDoc = createMockPackageDocument(undefined, manifest);
      const result = packaging.parse(packageDoc);

      expect(result.manifest['nav'].properties).toContain('nav');
      expect(result.manifest['scripted'].properties).toContain('scripted');
      expect(result.manifest['cover'].properties).toContain('svg');
    });

    it('should extract properties from spine items', () => {
      const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" version="3.0">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
            <dc:title>Test</dc:title>
          </metadata>
          <manifest>
            <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
            <item id="chapter2" href="chapter2.xhtml" media-type="application/xhtml+xml"/>
          </manifest>
          <spine>
            <itemref idref="chapter1" properties="page-spread-left"/>
            <itemref idref="chapter2" properties="page-spread-right"/>
          </spine>
        </package>`;

      const dom = new JSDOM(packageXml, { contentType: 'text/xml' });
      const packageDoc = dom.window.document;

      const result = packaging.parse(packageDoc);

      expect(result.spine[0].properties).toContain('page-spread-left');
      expect(result.spine[1].properties).toContain('page-spread-right');
    });
  });
});
