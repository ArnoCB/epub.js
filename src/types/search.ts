/**
 * Types for search functionality in epub.js
 *
 * Used by book.ts search methods.
 */

/**
 * Search result with location information
 */
export interface SearchResult {
  /** The search term that was matched */
  searchTerm: string;
  /** Excerpt of text containing the match */
  fragment: string;
  /** Location information for the match */
  location: {
    /** Book hash identifier */
    bookHash: string;
    /** CFI range for the match location */
    cfiRange: string;
  };
}
