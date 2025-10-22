import Contents from './contents';
import Layout from './layout';
import { Axis, Direction } from './enums';
import type { ViewParameter } from './types/mapping';
/**
 * Map text locations to CFI range
 */
export declare class Mapping {
    layout: Layout;
    horizontal: boolean;
    direction: Direction;
    constructor(layout: Layout, direction?: Direction, axis?: Axis);
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
     */
    private findStart;
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
    axis(axis: Axis): boolean;
}
export default Mapping;
