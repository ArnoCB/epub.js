/**
 * PageMapEntry type for pre-rendered chapters and page map generation in epub.js
 */

export interface PageMapEntry {
  index: number; // 1-based page index within the chapter
  startCfi: string | null; // CFI at the start of this page for precise positioning
  endCfi: string | null; // CFI at the end of this page for range calculations
  pageNumber?: number; // Global page number across the book (optional)
  xOffset?: number; // horizontal offset for paginated flow
  yOffset?: number; // vertical offset for scrolled flow
}
