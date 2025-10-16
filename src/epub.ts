import Book from './book';
import Rendition from './rendition';
import CFI from './epubcfi';
import Contents from './contents';
import * as utils from './utils/core';
import { EPUBJS_VERSION } from './utils';

/**
 * Creates a new Book
 * @param {string|ArrayBuffer} url URL, Path or ArrayBuffer
 * @param {object} options to pass to the book
 * @returns {Book} a new Book object
 * @example ePub("/path/to/book.epub", {})
 */
type EPubFactory = {
  (url: string | ArrayBuffer, options?: Record<string, unknown>): Book;
  VERSION?: string;
  Book?: typeof Book;
  Rendition?: typeof Rendition;
  Contents?: typeof Contents;
  CFI?: typeof CFI;
  utils?: typeof utils;
};

const ePub: EPubFactory = function (
  this: unknown,
  url: string | ArrayBuffer,
  options?: Record<string, unknown>
) {
  return new Book(
    url as unknown as string,
    options as unknown as Record<string, unknown>
  );
} as EPubFactory;

// Attach version and helpers like the original JS entry did
ePub.VERSION = EPUBJS_VERSION;

if (typeof global !== 'undefined') {
  (global as unknown as Record<string, unknown>).EPUBJS_VERSION =
    EPUBJS_VERSION;
}

ePub.Book = Book;
ePub.Rendition = Rendition;
ePub.Contents = Contents;
ePub.CFI = CFI;
ePub.utils = utils;

export default ePub;
export { Book, CFI as EpubCFI, Rendition, Contents, utils };
