import Contents from './contents';
import Layout from './layout';
export interface ViewParameter {
    contents: Contents;
    section: {
        cfiBase: string;
    };
    document: Document;
}
/**
 * Map text locations to CFI ranges
 * @param {Layout} layout Layout to apply
 * @param {string} [direction="ltr"] Text direction
 * @param {string} [axis="horizontal"] vertical or horizontal axis
 * @param {boolean} [dev] toggle developer highlighting
 */
export declare class Mapping {
    layout: Layout;
    horizontal: boolean;
    direction: string;
    _dev: boolean;
    constructor(layout: Layout, direction?: string, axis?: 'horizontal' | 'vertical', dev?: boolean);
    /**
     * Find CFI pairs for entire section at once
     */
    section(view: ViewParameter): {
        start: string;
        end: string;
    }[];
    /**
     * Find CFI pairs for a page
     */
    page(contents: Contents, cfiBase: string, start: number, end: number): {
        start: string;
        end: string;
    } | undefined;
    /**
     * Walk a node, preforming a function on each node it finds
     */
    private walk;
    findRanges(view: ViewParameter): {
        start: Range;
        end: Range;
    }[];
    /**
     * Find Start Range
     * @private
     * @param {Node} root root node
     * @param {number} start position to start at
     * @param {number} end position to end at
     * @return {Range}
     */
    findStart(root: Node, start: number, end: number): Range;
    /**
     * Find End Range
     */
    private findEnd;
    /**
     * Find Text Start Range
     */
    private findTextStartRange;
    /**
     * Find Text End Range
     */
    private findTextEndRange;
    /**
     * Split up a text node into ranges for each word
     */
    private splitTextNodeIntoRanges;
    /**
     * Turn a pair of ranges into a pair of CFIs
     */
    private rangePairToCfiPair;
    rangeListToCfiList(cfiBase: string, columns: {
        start: Range;
        end: Range;
    }[]): {
        start: string;
        end: string;
    }[];
    /**
     * Set the axis for mapping
     */
    axis(axis: 'horizontal' | 'vertical'): boolean;
}
export default Mapping;
