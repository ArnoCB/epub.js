/**
 * PageMapEntry type for pre-rendered chapters and page map generation in epub.js
 */
export interface PageMapEntry {
    index: number;
    startCfi: string | null;
    endCfi: string | null;
    pageNumber?: number;
    xOffset?: number;
    yOffset?: number;
}
