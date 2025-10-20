import type { CustomRange, CFIStep, CFITerminal, CFIComponent, CFIRange } from './types';
/**
 * Parsing and creation of EpubCFIs: http://www.idpf.org/epub/linking/cfi/epub-cfi.html
 *
 * Implements EPUB Canonical Fragment Identifier (CFI) specification:
 * @see https://idpf.org/epub/linking/cfi/epub-cfi-20111011.html
 *
 * ## Supported CFI Types:
 * - **Character Offset**: `epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)`
 * - **Simple Ranges**: `epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)`
 *
 * ## CFI Range Format:
 * Range CFIs follow the syntax: `epubcfi(path,start,end)` where:
 * - `path`: Common parent path to both start and end locations
 * - `start`: Local path from parent to start location (relative)
 * - `end`: Local path from parent to end location (relative)
 *
 * ### Within-Element vs Cross-Element Ranges:
 * **Within-element** (preferred for same-element selections):
 * ```
 * epubcfi(/6/20!/4/2/22/3,/:7,/:135)
 * ```
 * - Parent: `/6/20!/4/2/22/3` (points to containing element)
 * - Start: `/:7` (character 7 in current element)
 * - End: `/:135` (character 135 in current element)
 *
 * **Cross-element** (required for multi-element selections):
 * ```
 * epubcfi(/6/18!/4/2,/4/1:54,/6/1:0)
 * ```
 * - Parent: `/6/18!/4/2` (common ancestor)
 * - Start: `/4/1:54` (absolute path to character 54 in element /4/1)
 * - End: `/6/1:0` (absolute path to character 0 in element /6/1)
 *
 * ## Does Not Implement:
 * - Temporal Offset (~)
 * - Spatial Offset (@)
 * - Temporal-Spatial Offset (~ + @)
 * - Text Location Assertion ([text])
 * - Side Bias (;s=a/b)
 */
declare class EpubCFI {
    str: string;
    base: CFIComponent;
    spinePos: number;
    range: boolean;
    start: CFIComponent | null;
    end: CFIComponent | null;
    path: CFIComponent;
    /**
     * Convert custom range objects to DOM Range
     */
    static resolveToDomRange(input: string | Range | CustomRange, doc: Document): Range | null;
    /**
     * Helper to get offset from a CFIComponent, falling back to another if needed
     */
    private getOffset;
    constructor(cfiFrom?: string | Range | Node, base?: string | CFIComponent, ignoreClass?: string);
    private init;
    /**
     * Check the type of constructor input
     */
    private checkType;
    /**
     * Parse a cfi string to a CFI object representation
     */
    private parse;
    parseComponent(componentStr: string): CFIComponent;
    parseStep(stepStr: string): CFIStep | undefined;
    parseTerminal(terminalStr: string): CFITerminal;
    getChapterComponent(cfiStr: string): string | undefined;
    getPathComponent(cfiStr: string): string | undefined;
    /**
     * Extract range components from a CFI string
     *
     * Range CFIs follow the format: `path,start,end` where:
     * - path: Common parent path to both start and end locations
     * - start: Local path from parent to start location (relative)
     * - end: Local path from parent to end location (relative)
     *
     * @example
     * // Within-element range (preferred for same-element selections)
     * getRange("/6/20!/4/2/22/3,/:7,/:135")
     * // Returns: ["/:7", "/:135"]
     *
     * // Cross-element range (required for multi-element selections)
     * getRange("/6/18!/4/2,/4/1:54,/6/1:0")
     * // Returns: ["/4/1:54", "/6/1:0"]
     *
     * @param cfiStr CFI string potentially containing range components
     * @returns Array of [start, end] components, or false if not a range CFI
     */
    getRange(cfiStr: string): string[] | false;
    getCharacterOffsetComponent(cfiStr: string): string;
    joinSteps(steps: CFIStep[]): string;
    segmentString(segment: CFIComponent): string;
    /**
     * Convert CFI to a epubcfi(...) string
     */
    toString(): string;
    /**
     * Compare which of two CFIs is earlier in the text
     * @returns First is earlier = -1, Second is earlier = 1, They are equal = 0
     */
    compare(cfiOne: string | EpubCFI, cfiTwo: string | EpubCFI): number;
    step(node: Node): object | undefined;
    filteredStep(node: Node, ignoreClass: string): object | undefined;
    pathTo(node: Node, offset: number | null, ignoreClass?: string): CFIComponent;
    equalStep(stepA: CFIStep | undefined, stepB: CFIStep | undefined): boolean;
    equalTerminal(terminalA: CFITerminal, terminalB: CFITerminal): boolean;
    /**
     * Create a CFI range object from a DOM Range or CustomRange
     */
    fromRange(range: Range | CustomRange, base: string | object, ignoreClass?: string): CFIRange;
    /**
     * Create a CFI object from a Node
     */
    fromNode(anchor: Node, base: string | CFIComponent, ignoreClass?: string): CFIRange;
    filter(anchor: Node, ignoreClass: string): Node | false;
    patchOffset(anchor: Node, offset: number, ignoreClass: string): number;
    normalizedMap(children: NodeList, nodeType: 1 | 3 | number, ignoreClass?: string): {
        [key: string]: number;
    };
    position(anchor: Node): number;
    filteredPosition(anchor: Node, ignoreClass: string): number;
    stepsToXpath(steps: CFIStep[]): string;
    stepsToQuerySelector(steps: CFIStep[]): string;
    textNodes(container: Node, ignoreClass?: string): Node[];
    walkToNode(steps: CFIStep[], _doc: Document, ignoreClass?: string): Node | null;
    findNode(steps: CFIStep[], _doc: Document, ignoreClass?: string): Node | null;
    private fixMiss;
    toRange(_doc: Document, ignoreClass?: string): Range | null;
    /**
     * Check if a string is wrapped with "epubcfi()"
     */
    isCfiString(str: unknown): boolean;
    generateChapterComponent(spineNodeIndex: number, pos: number, id?: string): string;
    /**
     * Collapse a CFI Range to a single CFI Position
     */
    collapse(toStart?: boolean): void;
}
export default EpubCFI;
