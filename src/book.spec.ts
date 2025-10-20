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
});
