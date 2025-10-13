import Book from './book';
import { Rendition } from './rendition';
import { Locations } from './locations';
import PageList from './pagelist';
import Spine from './spine';
import Path from './utils/path';
import Packaging from './packaging';

// Mock iframe.ts as a module
jest.mock('./managers/views/iframe.ts', () => ({
  default: jest.fn(),
}));

describe('Book', () => {
  let book: Book;

  beforeEach(() => {
    book = new Book();
  });

  it('should initialize with default public properties', () => {
    expect(book.spine).toBeDefined();
    expect(book.locations).toBeDefined();
    expect(book.navigation).toBeUndefined();
    expect(book.pageList).toBeUndefined();
  });

  it('should resolve canonical paths', () => {
    book = new Book('http://example.com/');
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
    book = new Book('file.epub');
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
