import Book from './book';
import Rendition from './rendition';
import CFI from './epubcfi';
import Contents from './contents';
import * as utils from './utils/core';
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
declare const ePub: EPubFactory;
export default ePub;
export { Book, CFI as EpubCFI, Rendition, Contents, utils };
