import Book from './book.js';
import type BookType from '../types/book';
import Rendition from './rendition.js';
import CFI from './epubcfi';
import Contents from './contents.js';
import * as utils from './utils/core';
/**
 * Type for the options parameter (can be improved with a more specific type)
 */
export interface EpubOptionss {
  [key: string]: unknown;
  requestMethod?: (
    url: string,
    type: string,
    withCredentials: object,
    headers: object
  ) => Promise<object>;
  requestCredentials?: object;
  requestHeaders?: object;
  encoding?: string;
  replacements?: string;
  canonical?: (path: string) => string;
  openAs?: string;
  store?: string;
}
/**
 * Type for the ePub function object with static properties
 */
export interface EpubStatic {
  (url: string | ArrayBuffer, options?: EpubOptions): BookType;
  VERSION: string;
  Book: typeof Book;
  Rendition: typeof Rendition;
  Contents: typeof Contents;
  CFI: typeof CFI;
  utils: typeof utils;
}
/**
 * Creates a new Book
 * @param url URL, Path or ArrayBuffer
 * @param options to pass to the book
 * @returns a new Book object
 * @example ePub("/path/to/book.epub", {})
 */
declare const ePub: EpubStatic;
export default ePub;
export { Book, CFI as EpubCFI, Rendition, Contents, utils };
