/**
 * Simple, lightweight page map generator for prerenderer
 */
import { Section } from '../../section';
import { View } from './views';
import { CfiResolver } from './cfi-resolver';
export interface PageMapEntry {
    index: number;
    startCfi: string | null;
    endCfi: string | null;
    pageNumber?: number;
    xOffset?: number;
    yOffset?: number;
}
export interface PageMapResult {
    pageCount: number;
    pageMap: PageMapEntry[];
    hasWhitePages: boolean;
    whitePageIndices: number[];
}
export declare class PageMapGenerator {
    private cfiResolver;
    constructor(cfiResolver?: CfiResolver);
    /**
     * Helper to detect and warn about redundant range CFIs
     */
    private validateCfi;
    /**
     * Generate a simple page map directly from a rendered view
     */
    generatePageMap(view: View, section: Section, viewportWidth: number, viewportHeight: number): Promise<PageMapResult>;
    /**
     * Create minimal page map for empty content
     */
    private createMinimalPageMap;
    /**
     * Simple page count calculation
     */
    private calculatePageCount;
    /**
     * Create basic page map with CFIs
     */
    private createBasicPageMap;
    /**
     * Find first visible element using robust DOM traversal
     * Avoids hardcoded tag names which may be localized or custom
     */
    private findFirstVisibleElement;
    /**
     * Find last visible element in a page region for end CFI generation
     */
    private findLastVisibleElement;
    /**
     * Find the last element with text content in the entire chapter
     */
    private findLastElementInChapter;
}
