import Book from './book';
import { Rendition } from './rendition';
import { Locations } from './locations';
import PageList from './pagelist';
import Spine from './spine';
import Path from './utils/path';
import Url from './utils/url';
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
    expect(book.rendition).toBeUndefined();
  });

  it('should resolve canonical paths', () => {
    book = new Book();

    book.url = new Url('http://example.com/');
    book.path = { resolve: jest.fn(() => 'resolved/path') } as unknown as Path;
    const result = book.canonical('file.xhtml');
    expect(result).toContain('example.com');
  });

  it('should generate a key with identifier', () => {
    book.packaging = {
      metadata: { identifier: 'abc' },
    } as unknown as Packaging;
    book.url = { filename: 'file.epub' } as unknown as Url;
    const key = book.key();
    expect(key).toContain('abc');
  });

  it('should destroy public objects', () => {
    book.spine = { destroy: jest.fn() } as unknown as Spine;
    book.locations = { destroy: jest.fn() } as unknown as Locations;
    book.pageList = { destroy: jest.fn() } as unknown as PageList;
    book.rendition = { destroy: jest.fn() } as unknown as Rendition;
    book.destroy();
    expect(book.spine).toBeUndefined();
    expect(book.locations).toBeUndefined();
    expect(book.pageList).toBeUndefined();
    expect(book.rendition).toBeUndefined();
  });

  it('should allow setting request credentials and headers', () => {
    book.setRequestCredentials(true);
    book.setRequestHeaders({ foo: 'bar' });
    expect(book.settings.requestCredentials).toBe(true);
    expect(book.settings.requestHeaders).toEqual({ foo: 'bar' });
  });
});
