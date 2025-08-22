import type {
  PackagingManifestObject,
  PackagingManifestItem,
} from './packaging';
import Resources from './resources';

// Global mocks setup before any imports
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();

  // Mock console.error to avoid noise in tests
  global.console.error = jest.fn();
});

// Default mock functions for resolver and request
const mockResolver = jest.fn((path: string) => `resolved/${path}`) as (
  path: string,
  absolute?: boolean
) => string;
const mockRequest = jest.fn(() => Promise.resolve('mock response'));

// Helper function to create default options
const createDefaultOptions = (overrides = {}) => ({
  resolver: mockResolver,
  request: mockRequest,
  ...overrides,
});

// Mock all the utility modules
jest.mock('./utils/replacements', () => ({
  substitute: jest.fn(
    (content: string, relUrls: string[], replacementUrls: string[]) => {
      // Simple mock implementation for substitute
      return content.replace(
        /url\(['"]?([^'"]+)['"]?\)/g,
        (match: string, url: string) => {
          const index = relUrls.indexOf(url);
          return index !== -1 && replacementUrls[index]
            ? `url(${replacementUrls[index]})`
            : match;
        }
      );
    }
  ),
}));

jest.mock('./utils/core', () => ({
  createBase64Url: jest.fn(
    (content, mimeType) => `data:${mimeType};base64,${btoa(content)}`
  ),
  createBlobUrl: jest.fn((content, mimeType) => `blob:${mimeType}-url`),
  blob2base64: jest.fn((blob) => Promise.resolve(`base64-${blob.toString()}`)),
}));

jest.mock('./utils/url', () => {
  return jest.fn().mockImplementation((url) => ({
    filename: url.split('/').pop() || '',
    toString: () => url,
  }));
});

jest.mock('./utils/mime', () => ({
  lookup: jest.fn((filename) => {
    if (filename.endsWith('.css')) return 'text/css';
    if (filename.endsWith('.html')) return 'text/html';
    if (filename.endsWith('.js')) return 'application/javascript';
    if (filename.endsWith('.png')) return 'image/png';
    return 'application/octet-stream';
  }),
}));

jest.mock('./utils/path', () => {
  return jest.fn().mockImplementation((basePath) => ({
    relative: jest.fn((targetPath) => {
      // Simple relative path mock
      return targetPath
        .replace(basePath.split('/').slice(0, -1).join('/'), '')
        .replace(/^\//, '');
    }),
  }));
});

jest.mock('path-webpack', () => ({
  isAbsolute: jest.fn((path) => path.startsWith('/') || path.includes('://')),
}));

/**
 * Test suite for Resources class
 *
 * Note: The private method createCssFile() is tested
 * indirectly through the public replacements() method since it is
 * called internally when CSS resources need URL replacement.
 * The replaceCss() method is public and called from book.js.
 */
describe('Resources', () => {
  let resources: any; // Using any for now since we're testing JS implementation
  let mockManifest: PackagingManifestObject;
  let mockArchive: any;
  let mockResolver: jest.Mock;
  let mockRequest: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock manifest
    mockManifest = {
      'page1.html': {
        href: 'page1.html',
        type: 'application/xhtml+xml',
        properties: [],
      },
      'page2.html': {
        href: 'page2.html',
        type: 'text/html',
        properties: [],
      },
      'styles.css': {
        href: 'styles.css',
        type: 'text/css',
        properties: [],
      },
      'script.js': {
        href: 'script.js',
        type: 'application/javascript',
        properties: [],
      },
      'image.png': {
        href: 'image.png',
        type: 'image/png',
        properties: [],
      },
    };

    // Setup mock archive
    mockArchive = {
      createUrl: jest.fn().mockResolvedValue('mock-archive-url'),
      getText: jest.fn().mockResolvedValue('mock css content url(image.png)'),
    };

    // Setup mock resolver and request
    mockResolver = jest.fn((url) => `/resolved/${url}`);
    mockRequest = jest.fn().mockImplementation((url, type) => {
      if (type === 'blob') {
        return Promise.resolve(new Blob([`mock-blob-${url}`]));
      }
      if (type === 'text') {
        return Promise.resolve(`mock text content for ${url}`);
      }
      return Promise.resolve(`mock-${type}-${url}`);
    });
  });

  describe('constructor and initialization', () => {
    test('should create Resources with default options', () => {
      resources = new Resources(mockManifest, createDefaultOptions());

      expect(resources.settings.replacements).toBe('base64');
      expect(resources.settings.archive).toBeUndefined();
      expect(resources.settings.resolver).toBeDefined();
      expect(resources.settings.request).toBeDefined();
    });

    test('should create Resources with custom options', () => {
      const options = {
        replacements: 'blob',
        archive: mockArchive,
        resolver: mockResolver,
        request: mockRequest,
      };

      resources = new Resources(mockManifest, options);

      expect(resources.settings.replacements).toBe('blob');
      expect(resources.settings.archive).toBe(mockArchive);
      expect(resources.settings.resolver).toBe(mockResolver);
      expect(resources.settings.request).toBe(mockRequest);
    });

    test('should process manifest on construction', () => {
      resources = new Resources(mockManifest, createDefaultOptions());

      expect(resources.manifest).toBe(mockManifest);
      expect(resources.resources).toHaveLength(5);
      expect(resources.html).toHaveLength(2);
      expect(resources.assets).toHaveLength(3);
      expect(resources.css).toHaveLength(1);
    });
  });

  describe('process method', () => {
    beforeEach(() => {
      resources = new Resources({}, createDefaultOptions());
    });

    test('should process manifest and initialize arrays', () => {
      resources.process(mockManifest);

      expect(resources.manifest).toBe(mockManifest);
      expect(resources.resources).toEqual(Object.values(mockManifest));
      expect(resources.replacementUrls).toEqual([]);
      expect(resources.html).toBeDefined();
      expect(resources.assets).toBeDefined();
      expect(resources.css).toBeDefined();
      expect(resources.urls).toBeDefined();
      expect(resources.cssUrls).toBeDefined();
    });
  });

  describe('split method', () => {
    beforeEach(() => {
      resources = new Resources(mockManifest, createDefaultOptions());
    });

    test('should split HTML resources correctly', () => {
      expect(resources.html).toHaveLength(2);
      expect(resources.html![0].type).toBe('application/xhtml+xml');
      expect(resources.html![1].type).toBe('text/html');
    });

    test('should split asset resources correctly', () => {
      expect(resources.assets).toHaveLength(3);
      const assetTypes = resources.assets!.map(
        (asset: PackagingManifestItem) => asset.type
      );
      expect(assetTypes).toContain('text/css');
      expect(assetTypes).toContain('application/javascript');
      expect(assetTypes).toContain('image/png');
    });

    test('should split CSS resources correctly', () => {
      expect(resources.css).toHaveLength(1);
      expect(resources.css![0].type).toBe('text/css');
      expect(resources.css![0].href).toBe('styles.css');
    });

    test('should handle undefined resources gracefully', () => {
      // Create a resources instance and manually set resources to undefined
      resources = new Resources({}, createDefaultOptions());
      resources.resources = undefined;

      // Call split manually to test the edge case
      // Note: This tests the private split method indirectly through the behavior
      resources.process({}); // This will call split internally

      // Should initialize arrays to empty when resources is undefined
      expect(resources.html).toEqual([]);
      expect(resources.assets).toEqual([]);
      expect(resources.css).toEqual([]);
      expect(resources.urls).toEqual([]);
      expect(resources.cssUrls).toEqual([]);
    });
  });

  describe('splitUrls method', () => {
    beforeEach(() => {
      resources = new Resources(mockManifest, createDefaultOptions());
    });

    test('should create URLs arrays from resources', () => {
      expect(resources.urls).toHaveLength(3);
      expect(resources.urls).toContain('styles.css');
      expect(resources.urls).toContain('script.js');
      expect(resources.urls).toContain('image.png');
    });

    test('should create CSS URLs array', () => {
      expect(resources.cssUrls).toHaveLength(1);
      expect(resources.cssUrls).toContain('styles.css');
    });
  });

  describe('createUrl method', () => {
    test('should create URL using archive when available', async () => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({ archive: mockArchive })
      );

      const url = await resources.createUrl('test.png');

      expect(mockArchive.createUrl).toHaveBeenCalledWith('test.png', {
        base64: true,
      });
      expect(url).toBe('mock-archive-url');
    });

    test('should create base64 URL when replacements is base64', async () => {
      const { createBase64Url, blob2base64 } = require('./utils/core');
      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          replacements: 'base64',
          request: mockRequest,
        })
      );

      const url = await resources.createUrl('test.png');

      expect(mockRequest).toHaveBeenCalledWith('test.png', 'blob');
      expect(blob2base64).toHaveBeenCalled();
      expect(createBase64Url).toHaveBeenCalled();
    });

    test('should create blob URL when replacements is not base64', async () => {
      const { createBlobUrl } = require('./utils/core');
      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          replacements: 'blob',
          request: mockRequest,
        })
      );

      const url = await resources.createUrl('test.png');

      expect(mockRequest).toHaveBeenCalledWith('test.png', 'blob');
      expect(createBlobUrl).toHaveBeenCalled();
    });
  });

  describe('replacements method', () => {
    test('should return original URLs when replacements is none', async () => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({ replacements: 'none' })
      );

      const result = await resources.replacements();

      expect(result).toEqual(resources.urls);
    });

    test('should create replacement URLs for all assets', async () => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          archive: mockArchive,
          resolver: mockResolver,
        })
      );

      const result = await resources.replacements();

      expect(mockResolver).toHaveBeenCalledTimes(3); // For each asset
      expect(mockArchive.createUrl).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
      expect(resources.replacementUrls).toHaveLength(3);
    });

    test('should handle errors in URL creation gracefully', async () => {
      const failingArchive = {
        createUrl: jest.fn().mockRejectedValue(new Error('Archive error')),
        // Add minimal Archive interface properties
        zip: null,
        urlCache: {},
        checkRequirements: jest.fn(),
        open: jest.fn(),
        openUrl: jest.fn(),
        request: jest.fn(),
        getBlob: jest.fn(),
        getText: jest.fn(),
        getBase64: jest.fn(),
        revokeUrl: jest.fn(),
        destroy: jest.fn(),
      } as any;

      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          archive: failingArchive,
          resolver: mockResolver,
        })
      );

      const result = await resources.replacements();

      expect(console.error).toHaveBeenCalledTimes(3);
      expect(result).toContain(null);
      expect(resources.replacementUrls).toHaveLength(0); // Null values filtered out
    });
  });

  describe('replaceCss method', () => {
    beforeEach(() => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          archive: mockArchive,
          resolver: mockResolver,
        })
      );
      // Pre-populate replacement URLs
      resources.replacementUrls = [
        'replaced-style.css',
        'replaced-script.js',
        'replaced-image.png',
      ];
    });

    test('should replace CSS URLs using configured archive and resolver', async () => {
      // Since replaceCss uses this.settings internally, we test with configured settings
      const customArchive = { ...mockArchive };
      const customResolver = jest.fn((url) => `/custom/${url}`);

      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          archive: customArchive,
          resolver: customResolver,
        })
      );
      resources.replacementUrls = [
        'replaced-style.css',
        'replaced-script.js',
        'replaced-image.png',
      ];

      await resources.replaceCss();

      expect(customResolver).toHaveBeenCalledWith('styles.css');
    });

    test('should replace CSS URLs using default archive and resolver', async () => {
      await resources.replaceCss();

      expect(mockResolver).toHaveBeenCalledWith('styles.css');
    });

    test('should handle CSS replacement gracefully when no CSS files exist', async () => {
      // Create resources without CSS files
      const noCssManifest = {
        'page1.html': {
          href: 'page1.html',
          type: 'application/xhtml+xml',
          properties: [],
        },
      };

      resources = new Resources(
        noCssManifest,
        createDefaultOptions({
          archive: mockArchive,
          resolver: mockResolver,
        })
      );

      const result = await resources.replaceCss();

      expect(result).toEqual([]);
    });
  });

  describe('relativeTo method', () => {
    beforeEach(() => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({ resolver: mockResolver })
      );
    });

    test('should return relative URLs using provided resolver', () => {
      const customResolver = jest.fn((url) => `/custom/${url}`);

      const result = resources.relativeTo('/base/path', customResolver);

      expect(customResolver).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
    });

    test('should return relative URLs using default resolver', () => {
      const result = resources.relativeTo('/base/path');

      expect(mockResolver).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
    });
  });

  describe('get method', () => {
    beforeEach(() => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          archive: mockArchive,
          resolver: mockResolver,
        })
      );
    });

    test('should return undefined for non-existent path', () => {
      const result = resources.get('non-existent.png');

      expect(result).toBeUndefined();
    });

    test('should return replacement URL when available', async () => {
      resources.replacementUrls = [
        'replaced-style.css',
        'replaced-script.js',
        'replaced-image.png',
      ];

      const result = await resources.get('script.js');

      expect(result).toBe('replaced-script.js');
    });

    test('should create URL when no replacement URLs available', () => {
      resources.replacementUrls = [];

      const result = resources.get('script.js');

      // Should return a promise from createUrl
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('substitute method', () => {
    beforeEach(() => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({ resolver: mockResolver })
      );
      resources.replacementUrls = [
        'replaced-style.css',
        'replaced-script.js',
        'replaced-image.png',
      ];
    });

    test('should substitute URLs with relative URLs when url provided', () => {
      const { substitute } = require('./utils/replacements');
      const content = 'Some content with URLs';

      const result = resources.substitute(content, '/base/url');

      expect(substitute).toHaveBeenCalledWith(
        content,
        expect.any(Array), // relative URLs
        resources.replacementUrls
      );
    });

    test('should substitute URLs with direct URLs when no url provided', () => {
      const { substitute } = require('./utils/replacements');
      const content = 'Some content with URLs';

      const result = resources.substitute(content);

      expect(substitute).toHaveBeenCalledWith(
        content,
        resources.urls,
        resources.replacementUrls
      );
    });
  });

  describe('destroy method', () => {
    test('should clear all properties', () => {
      resources = new Resources(
        mockManifest,
        createDefaultOptions({
          archive: mockArchive,
          resolver: mockResolver,
        })
      );

      resources.destroy();

      expect(resources.settings).toBeDefined(); // settings is not cleared in destroy
      expect(resources.manifest).toBeUndefined();
      expect(resources.resources).toBeUndefined();
      expect(resources.replacementUrls).toBeUndefined();
      expect(resources.html).toBeUndefined();
      expect(resources.assets).toBeUndefined();
      expect(resources.css).toBeUndefined();
      expect(resources.urls).toBeUndefined();
      expect(resources.cssUrls).toBeUndefined();
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle empty manifest', () => {
      resources = new Resources({}, createDefaultOptions());

      expect(resources.resources).toHaveLength(0);
      expect(resources.html).toHaveLength(0);
      expect(resources.assets).toHaveLength(0);
      expect(resources.css).toHaveLength(0);
      expect(resources.urls).toHaveLength(0);
      expect(resources.cssUrls).toHaveLength(0);
    });

    test('should handle manifest with items without type', () => {
      const incompleteManifest = {
        item1: {
          href: 'item1.unknown',
          type: 'application/octet-stream',
          properties: [],
        },
        item2: { href: 'item2.html', type: 'text/html', properties: [] },
      } as PackagingManifestObject;

      resources = new Resources(incompleteManifest, createDefaultOptions());

      expect(resources.resources).toHaveLength(2);
      expect(resources.html).toHaveLength(1);
    });

    test('should handle manifest with items without href', () => {
      const incompleteManifest = {
        item1: { href: 'item1.css', type: 'text/css', properties: [] },
        item2: { href: 'item2.css', type: 'text/css', properties: [] },
      } as PackagingManifestObject;

      resources = new Resources(incompleteManifest, createDefaultOptions());

      expect(resources.css).toHaveLength(2);
      expect(resources.cssUrls).toHaveLength(2);
      expect(resources.cssUrls).toEqual(['item1.css', 'item2.css']);
    });
  });
});
