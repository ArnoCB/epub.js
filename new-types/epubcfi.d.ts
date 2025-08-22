interface CustomRange {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
}
interface CFIStep {
    type: 'element' | 'text';
    index: number;
    id?: string | null;
    tagName?: string | null;
}
interface CFITerminal {
    offset: number | null;
    assertion: string | null;
}
interface CFIComponent {
    steps: CFIStep[];
    terminal: CFITerminal;
}
interface CFIRange {
    path: CFIComponent;
    start: CFIComponent;
    end: CFIComponent;
}
/**
  * Parsing and creation of EpubCFIs: http://www.idpf.org/epub/linking/cfi/epub-cfi.html

  * Implements:
  * - Character Offset: epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)
  * - Simple Ranges : epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)

  * Does Not Implement:
  * - Temporal Offset (~)
  * - Spatial Offset (@)
  * - Temporal-Spatial Offset (~ + @)
  * - Text Location Assertion ([)
*/
declare class EpubCFI {
    /**
     * Convert custom range objects to DOM Range
     */
    static resolveToDomRange(input: string | Range | CustomRange, doc: Document): Range | null;
    /**
     * Helper to get offset from a CFIComponent, falling back to another if needed
     */
    private getOffset;
    str: string;
    base: CFIComponent;
    spinePos: number;
    range: boolean;
    start: CFIComponent | null;
    end: CFIComponent | null;
    path: CFIComponent;
    constructor(cfiFrom?: string | Range | Node, base?: string | CFIComponent, ignoreClass?: string);
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
    getChapterComponent(cfiStr: string): string;
    getPathComponent(cfiStr: string): string | undefined;
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
