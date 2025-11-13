import Book from './book';
import { Rendition } from './rendition';
import { Locations } from './locations';
import PageList from './pagelist';
import Spine from './spine';
import Path from './utils/path';
import Packaging from './packaging';

// Use a factory function instead of subclass to avoid TypeScript issues
function createTestBook(url?: string | object): Book {
  // Create a regular Book instance
  const book = new Book(url as any);

  // Override emit method to make it safe for tests
  const mockEmit = jest.fn().mockReturnValue(true);
  book.emit = mockEmit;

  // Add other EventEmitter methods
  (book as any).on = jest.fn().mockReturnValue(book);
  (book as any).off = jest.fn().mockReturnValue(book);
  (book as any).once = jest.fn().mockReturnValue(book);

  return book;
}

// Mock iframe.ts as a module
jest.mock('./managers/views/iframe.ts', () => ({
  default: jest.fn(),
}));

describe('Book', () => {
  let book: Book;

  beforeEach(() => {
    // Use our factory function that creates a Book with mocked methods
    book = createTestBook();
  });

  it('should initialize with default public properties', () => {
    expect(book.spine).toBeDefined();
    expect(book.locations).toBeDefined();
    expect(book.navigation).toBeUndefined();
    expect(book.pageList).toBeUndefined();
  });

  it('should resolve canonical paths', () => {
    book = createTestBook('http://example.com/');
    // If Book does not expose a way to set path, mock the method on the instance
    (book as any).path = {
      resolve: jest.fn(() => 'resolved/path'),
    } as unknown as Path;
    const result = book.canonical('file.xhtml');
    expect(result).toContain('example.com');
  });

  it('should generate a key with identifier', () => {
    book.packaging = {
      metadata: { identifier: 'abc' },
    } as unknown as Packaging;
    // Use the constructor to set the url/filename
    book = createTestBook('file.epub');
    // If Book does not expose a way to set packaging after construction, this may need further refactor
    (book as any).packaging = {
      metadata: { identifier: 'abc' },
    } as unknown as Packaging;
    const key = book.key();
    expect(key).toContain('abc');
  });

  it('should destroy public objects', () => {
    book.spine = { destroy: jest.fn() } as unknown as Spine;
    book.locations = { destroy: jest.fn() } as unknown as Locations;
    book.pageList = { destroy: jest.fn() } as unknown as PageList;
    // @ts-expect-error: Accessing private for test
    book.rendition = { destroy: jest.fn() } as unknown as Rendition;
    book.destroy();
    expect(book.spine).toBeUndefined();
    expect(book.locations).toBeUndefined();
    expect(book.pageList).toBeUndefined();
  });

  it('should allow setting request credentials and headers', () => {
    book.setRequestCredentials(true);
    book.setRequestHeaders({ foo: 'bar' });
    expect(book.settings.requestCredentials).toBe(true);
    expect(book.settings.requestHeaders).toEqual({ foo: 'bar' });
  });

  describe('Search functionality', () => {
    describe('getBookHash', () => {
      it('should return empty string initially when archive and path are not set', async () => {
        const hash = await book.getBookHash();
        expect(hash).toBe('');
      });

      it('should generate and return hash when archive and path are available', async () => {
        // Mock archive and path
        const mockBlob = {
          text: jest.fn().mockResolvedValue('mock-opf-content'),
        };
        (book as any).archive = {
          getBlob: jest.fn().mockResolvedValue(mockBlob),
        };
        (book as any).path = {
          toString: jest.fn().mockReturnValue('OEBPS/content.opf'),
        };

        const hash = await book.getBookHash();

        expect(hash).toBeTruthy();
        expect(typeof hash).toBe('string');
        expect((book as any).archive.getBlob).toHaveBeenCalledWith(
          'OEBPS/content.opf'
        );
        expect(mockBlob.text).toHaveBeenCalled();
      });

      it('should return cached hash on subsequent calls', async () => {
        const mockBlob = {
          text: jest.fn().mockResolvedValue('mock-opf-content'),
        };
        (book as any).archive = {
          getBlob: jest.fn().mockResolvedValue(mockBlob),
        };
        (book as any).path = {
          toString: jest.fn().mockReturnValue('OEBPS/content.opf'),
        };

        const hash1 = await book.getBookHash();
        const hash2 = await book.getBookHash();

        expect(hash1).toBe(hash2);
        // getBlob should only be called once since hash is cached
        expect((book as any).archive.getBlob).toHaveBeenCalledTimes(1);
      });

      it('should return uppercase hash', async () => {
        const mockBlob = {
          text: jest.fn().mockResolvedValue('test'),
        };
        (book as any).archive = {
          getBlob: jest.fn().mockResolvedValue(mockBlob),
        };
        (book as any).path = {
          toString: jest.fn().mockReturnValue('OEBPS/content.opf'),
        };

        const hash = await book.getBookHash();

        expect(hash).toBe(hash.toUpperCase());
      });
    });

    describe('searchSection', () => {
      it('should have a searchSection method', () => {
        expect(typeof book.searchSection).toBe('function');
      });

      it('should search a section by index', async () => {
        const mockSection = {
          idref: 'section1',
          load: jest.fn().mockResolvedValue(undefined),
          find: jest
            .fn()
            .mockReturnValue([
              { excerpt: 'found text', cfi: 'epubcfi(/6/4[chap01ref]!/4/2)' },
            ]),
          unload: jest.fn(),
        };

        book.spine = {
          get: jest.fn().mockReturnValue(mockSection),
        } as any;

        (book as any).ready = Promise.resolve([]);
        (book as any).bookHash = 'ABC123';

        const results = await book.searchSection(0, 'test');

        expect(book.spine.get).toHaveBeenCalledWith(0);
        expect(mockSection.load).toHaveBeenCalled();
        expect(mockSection.find).toHaveBeenCalledWith('test');
        expect(mockSection.unload).toHaveBeenCalled();
        expect(results).toEqual([
          {
            searchTerm: 'test',
            fragment: 'found text',
            location: {
              bookHash: 'ABC123',
              cfiRange: 'epubcfi(/6/4[chap01ref]!/4/2)',
            },
          },
        ]);
      });

      it('should search a section by href string', async () => {
        const mockSection = {
          idref: 'section1',
          load: jest.fn().mockResolvedValue(undefined),
          find: jest.fn().mockReturnValue([]),
          unload: jest.fn(),
        };

        book.spine = {
          get: jest.fn().mockReturnValue(mockSection),
        } as any;

        (book as any).ready = Promise.resolve([]);
        (book as any).bookHash = 'ABC123';

        await book.searchSection('chapter1.xhtml', 'test');

        expect(book.spine.get).toHaveBeenCalledWith('chapter1.xhtml');
      });

      it('should search a section by Section object', async () => {
        const mockSection = {
          idref: 'section1',
          find: jest.fn().mockReturnValue([]),
          load: jest.fn().mockResolvedValue(undefined),
          unload: jest.fn(),
        };

        (book as any).ready = Promise.resolve([]);
        (book as any).bookHash = 'ABC123';

        await book.searchSection(mockSection as any, 'test');

        expect(mockSection.load).toHaveBeenCalled();
        expect(mockSection.find).toHaveBeenCalledWith('test');
      });

      it('should throw error when section not found', async () => {
        book.spine = {
          get: jest.fn().mockReturnValue(null),
        } as any;

        (book as any).ready = Promise.resolve([]);

        await expect(book.searchSection(999, 'test')).rejects.toThrow(
          'Section not found: 999'
        );
      });

      it('should unload section even if search fails', async () => {
        const mockSection = {
          idref: 'section1',
          load: jest.fn().mockResolvedValue(undefined),
          find: jest.fn().mockImplementation(() => {
            throw new Error('Find failed');
          }),
          unload: jest.fn(),
        };

        book.spine = {
          get: jest.fn().mockReturnValue(mockSection),
        } as any;

        (book as any).ready = Promise.resolve([]);

        await expect(book.searchSection(0, 'test')).rejects.toThrow(
          'Find failed'
        );
        expect(mockSection.unload).toHaveBeenCalled();
      });
    });

    describe('searchAll', () => {
      it('should have a searchAll method', () => {
        expect(typeof book.searchAll).toBe('function');
      });

      it('should search across all spine items', async () => {
        const mockSection1 = {
          idref: 'section1',
          find: jest
            .fn()
            .mockReturnValue([
              { excerpt: 'result 1', cfi: 'epubcfi(/6/4[chap01ref]!/4/2)' },
            ]),
          load: jest.fn().mockResolvedValue(undefined),
          unload: jest.fn(),
        };

        const mockSection2 = {
          idref: 'section2',
          find: jest
            .fn()
            .mockReturnValue([
              { excerpt: 'result 2', cfi: 'epubcfi(/6/6[chap02ref]!/4/2)' },
            ]),
          load: jest.fn().mockResolvedValue(undefined),
          unload: jest.fn(),
        };

        book.spine = {
          spineItems: [mockSection1, mockSection2],
          get: jest.fn().mockImplementation((item) => item),
        } as any;

        (book as any).ready = Promise.resolve([]);
        (book as any).bookHash = 'ABC123';

        const results = await book.searchAll('test');

        expect(results).toHaveLength(2);
        expect(results[0].fragment).toBe('result 1');
        expect(results[1].fragment).toBe('result 2');
        expect(mockSection1.find).toHaveBeenCalledWith('test');
        expect(mockSection2.find).toHaveBeenCalledWith('test');
      });

      it('should flatten results from multiple sections', async () => {
        const mockSection = {
          idref: 'section1',
          find: jest.fn().mockReturnValue([
            { excerpt: 'result 1', cfi: 'epubcfi(/6/4[chap01ref]!/4/2)' },
            { excerpt: 'result 2', cfi: 'epubcfi(/6/4[chap01ref]!/4/4)' },
          ]),
          load: jest.fn().mockResolvedValue(undefined),
          unload: jest.fn(),
        };

        book.spine = {
          spineItems: [mockSection],
          get: jest.fn().mockImplementation((item) => item),
        } as any;

        (book as any).ready = Promise.resolve([]);
        (book as any).bookHash = 'ABC123';

        const results = await book.searchAll('test');

        expect(results).toHaveLength(2);
        expect(Array.isArray(results)).toBe(true);
      });
    });

    it('should have a title getter that returns a promise', async () => {
      // Mock the loaded metadata
      book = createTestBook();
      (book as any).loaded = {
        metadata: Promise.resolve({ title: 'Test Book Title' }),
      };

      const title = await book.title;
      expect(title).toBe('Test Book Title');
    });
  });
});
