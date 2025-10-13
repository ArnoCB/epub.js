import { type, isNumber, findChildren } from './utils/core';
import type {
  CustomRange,
  CFIStep,
  CFITerminal,
  CFIComponent,
  CFIRange,
} from './types';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;

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

class EpubCFI {
  public str: string = '';
  public base: CFIComponent = {
    steps: [],
    terminal: { offset: null, assertion: null },
  };

  public spinePos: number = 0;
  public range: boolean = false;

  public start: CFIComponent | null = null;
  public end: CFIComponent | null = null;
  public path: CFIComponent = {
    steps: [],
    terminal: { offset: null, assertion: null },
  };

  /**
   * Convert custom range objects to DOM Range
   */
  static resolveToDomRange(
    input: string | Range | CustomRange,
    doc: Document
  ): Range | null {
    if (!input || typeof input === 'string') return null;

    if (
      'startContainer' in input &&
      'endContainer' in input &&
      typeof doc.createRange === 'function'
    ) {
      const range = doc.createRange();
      range.setStart(input.startContainer as Node, input.startOffset as number);
      range.setEnd(input.endContainer as Node, input.endOffset as number);
      return range;
    }

    return input as Range;
  }

  /**
   * Helper to get offset from a CFIComponent, falling back to another if needed
   */
  private getOffset(
    comp: CFIComponent | null | undefined,
    fallback: CFIComponent
  ): number {
    return comp && comp.terminal.offset != null
      ? comp.terminal.offset
      : fallback.terminal.offset != null
        ? fallback.terminal.offset
        : 0;
  }

  constructor(
    cfiFrom: string | Range | Node = '',
    base: string | CFIComponent = {
      steps: [],
      terminal: { offset: null, assertion: null },
    },
    ignoreClass?: string
  ) {
    this.base =
      typeof base === 'string'
        ? this.parseComponent(base)
        : 'steps' in base
          ? base
          : { steps: [], terminal: { offset: null, assertion: null } };

    if (cfiFrom) {
      this.init(cfiFrom, ignoreClass);
    }
  }

  private init(cfiFrom: string | Range | Node, ignoreClass?: string) {
    switch (this.checkType(cfiFrom)) {
      case 'string': {
        this.str = cfiFrom as string;
        const parsed = this.parse(this.str);
        Object.assign(this, {
          base: parsed.base,
          spinePos: parsed.spinePos,
          range: !!(parsed.range && parsed.start && parsed.end),
          path: parsed.path,
          start: parsed.start,
          end: parsed.end,
        });
        break;
      }
      case 'range': {
        const { path, start, end } = this.fromRange(
          cfiFrom as Range,
          this.base,
          ignoreClass
        );
        Object.assign(this, { range: true, path, start, end });
        break;
      }
      case 'customRange': {
        const custom = cfiFrom as CustomRange;
        const fakeRange = {
          startContainer: custom.startContainer,
          startOffset: custom.startOffset,
          endContainer: custom.endContainer,
          endOffset: custom.endOffset,
          collapsed:
            custom.startContainer === custom.endContainer &&
            custom.startOffset === custom.endOffset,
        } as Range;

        const { path, start, end } = this.fromRange(
          fakeRange,
          this.base,
          ignoreClass
        );
        Object.assign(this, { range: true, path, start, end });
        break;
      }
      case 'node': {
        const { path } = this.fromNode(cfiFrom as Node, this.base, ignoreClass);
        Object.assign(this, { range: false, path, start: null, end: null });
        break;
      }
      case 'EpubCFI': {
        const sourceCfi = cfiFrom as unknown as EpubCFI;
        Object.assign(this, {
          str: sourceCfi.str,
          base: sourceCfi.base,
          spinePos: sourceCfi.spinePos,
          range: sourceCfi.range,
          path: sourceCfi.path,
          start: sourceCfi.start,
          end: sourceCfi.end,
        });
        break;
      }
      default:
        throw new TypeError(
          `Invalid argument type for EpubCFI constructor: ${typeof cfiFrom}`
        );
    }
  }

  /**
   * Check the type of constructor input
   */
  private checkType(cfi: string | Range | Node) {
    if (this.isCfiString(cfi)) return 'string';

    if (
      cfi &&
      typeof cfi === 'object' &&
      (type(cfi) === 'Range' ||
        (typeof (cfi as Range).startContainer !== 'undefined' &&
          typeof (cfi as Range).collapsed !== 'undefined'))
    ) {
      return 'range';
    }

    if (
      cfi &&
      typeof cfi === 'object' &&
      typeof (cfi as Node).nodeType !== 'undefined'
    ) {
      return 'node';
    }

    if (
      cfi &&
      typeof cfi === 'object' &&
      typeof (cfi as CustomRange).startContainer !== 'undefined' &&
      typeof (cfi as CustomRange).startOffset !== 'undefined' &&
      typeof (cfi as CustomRange).endContainer !== 'undefined' &&
      typeof (cfi as CustomRange).endOffset !== 'undefined' &&
      !('collapsed' in cfi)
    ) {
      return 'customRange';
    }

    if (cfi && typeof cfi === 'object' && cfi instanceof EpubCFI) {
      return 'EpubCFI';
    }

    return false;
  }

  /**
   * Parse a cfi string to a CFI object representation
   */
  private parse(cfiStr: string): {
    spinePos: number;
    range: boolean;
    base: CFIComponent;
    path: CFIComponent;
    start: CFIComponent | null;
    end: CFIComponent | null;
  } {
    const emptyComponent: CFIComponent = {
      steps: [],
      terminal: { offset: null, assertion: null },
    };
    if (typeof cfiStr !== 'string') {
      return {
        spinePos: -1,
        range: false,
        base: emptyComponent,
        path: emptyComponent,
        start: null,
        end: null,
      };
    }
    if (cfiStr.startsWith('epubcfi(') && cfiStr.endsWith(')')) {
      cfiStr = cfiStr.slice(8, -1);
    }
    const baseComponent = this.getChapterComponent(cfiStr);
    if (!baseComponent) {
      return {
        spinePos: -1,
        range: false,
        base: emptyComponent,
        path: emptyComponent,
        start: null,
        end: null,
      };
    }
    const base = this.parseComponent(baseComponent);
    const pathComponent = this.getPathComponent(cfiStr);
    const path =
      typeof pathComponent === 'string'
        ? this.parseComponent(pathComponent)
        : emptyComponent;
    const range = this.getRange(cfiStr);
    const start = range ? this.parseComponent(range[0]) : null;
    const end = range ? this.parseComponent(range[1]) : null;
    const isRange = !!range;
    const spinePos = base.steps[1]?.index ?? -1;
    return { spinePos, range: isRange, base, path, start, end };
  }

  parseComponent(componentStr: string): CFIComponent {
    const component: CFIComponent = {
      steps: [],
      terminal: { offset: null, assertion: null },
    };

    const parts = componentStr.split(':');
    let steps = parts[0].split('/');
    let terminal;

    if (parts.length > 1) {
      terminal = parts[1];
      component.terminal = this.parseTerminal(terminal);
    }

    // Remove empty first element if path starts with '/'
    if (steps.length > 0 && steps[0] === '') {
      steps = steps.slice(1);
    }

    component.steps = steps
      .map((step: string) => this.parseStep(step))
      .filter(Boolean) as CFIStep[];

    return component;
  }

  parseStep(stepStr: string): CFIStep | undefined {
    let id: string | null = null;
    const tagName: string | null = null;
    let type: 'element' | 'text';
    let index: number;

    const has_brackets = stepStr.match(/\[(.*)\]/);
    if (has_brackets && has_brackets[1]) {
      id = has_brackets[1];
    }

    const num = parseInt(stepStr);
    if (isNaN(num)) {
      return;
    }

    if (num % 2 === 0) {
      type = 'element';
      index = num / 2 - 1;
    } else {
      type = 'text';
      index = (num - 1) / 2;
    }

    return { type, index, id, tagName };
  }

  parseTerminal(terminalStr: string): CFITerminal {
    let characterOffset: number | null;
    let textLocationAssertion: string | null = null;
    const assertion = terminalStr.match(/\[(.*)\]/);

    if (assertion && assertion[1]) {
      characterOffset = parseInt(terminalStr.split('[')[0]);
      textLocationAssertion = assertion[1];
    } else {
      characterOffset = parseInt(terminalStr);
    }

    if (!isNumber(characterOffset)) {
      characterOffset = null;
    }

    return { offset: characterOffset, assertion: textLocationAssertion };
  }

  getChapterComponent(cfiStr: string) {
    const indirection = cfiStr.split('!');

    return indirection[0];
  }

  getPathComponent(cfiStr: string) {
    const indirection = cfiStr.split('!');
    if (indirection[1]) {
      // Always return the part before the first comma (if any)
      return indirection[1].split(',')[0];
    }
  }

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
  getRange(cfiStr: string): string[] | false {
    const ranges = cfiStr.split(',');

    if (ranges.length === 3) {
      return [ranges[1], ranges[2]];
    }

    return false;
  }

  getCharacterOffsetComponent(cfiStr: string): string {
    const splitStr = cfiStr.split(':');
    return splitStr[1] || '';
  }

  joinSteps(steps: CFIStep[]): string {
    if (!steps?.length) return '';

    return steps
      .map((part) => {
        const value =
          part.type === 'element' ? (part.index + 1) * 2 : 1 + 2 * part.index;
        return `${value}${part.id ? `[${part.id}]` : ''}`;
      })
      .join('/');
  }

  segmentString(segment: CFIComponent) {
    let segmentString = '/' + this.joinSteps(segment.steps);

    const terminal = segment.terminal;
    if (!terminal) return segmentString; // early return if no terminal

    if (terminal.offset != null) segmentString += `:${terminal.offset}`;
    if (terminal.assertion != null) segmentString += `[${terminal.assertion}]`;

    return segmentString;
  }

  /**
   * Convert CFI to a epubcfi(...) string
   */
  toString(): string {
    let cfiString = 'epubcfi(';
    cfiString += this.segmentString(this.base);
    cfiString += '!';
    if (this.range && this.start && this.end) {
      cfiString += this.segmentString(this.path);
      cfiString += ',' + this.segmentString(this.start);
      cfiString += ',' + this.segmentString(this.end);
    } else {
      cfiString += this.segmentString(this.path);
    }

    cfiString += ')';
    return cfiString;
  }

  /**
   * Compare which of two CFIs is earlier in the text
   * @returns First is earlier = -1, Second is earlier = 1, They are equal = 0
   */
  compare(cfiOne: string | EpubCFI, cfiTwo: string | EpubCFI): number {
    if (typeof cfiOne === 'string') cfiOne = new EpubCFI(cfiOne);
    if (typeof cfiTwo === 'string') cfiTwo = new EpubCFI(cfiTwo);

    // Compare spine positions
    if (cfiOne.spinePos !== cfiTwo.spinePos) {
      return cfiOne.spinePos > cfiTwo.spinePos ? 1 : -1;
    }

    const getStepsAndTerminal = (cfi: EpubCFI) =>
      cfi.range && cfi.start && cfi.end
        ? {
            steps: cfi.path.steps.concat(cfi.start.steps),
            terminal: cfi.start.terminal,
          }
        : { steps: cfi.path.steps, terminal: cfi.path.terminal };

    const { steps: stepsA, terminal: terminalA } = getStepsAndTerminal(cfiOne);
    const { steps: stepsB, terminal: terminalB } = getStepsAndTerminal(cfiTwo);

    for (let i = 0; i < Math.max(stepsA.length, stepsB.length); i++) {
      const a = stepsA[i],
        b = stepsB[i];
      if (!a) return -1;
      if (!b) return 1;
      if (a.index !== b.index) return a.index > b.index ? 1 : -1;
    }

    if (terminalA.offset == null || terminalB.offset == null) return -1;
    if (terminalA.offset !== terminalB.offset) {
      return terminalA.offset > terminalB.offset ? 1 : -1;
    }

    return 0;
  }

  step(node: Node): object | undefined {
    const nodeType: 'element' | 'text' =
      node.nodeType === TEXT_NODE ? 'text' : 'element';
    let id: string | null = null;
    let tagName: string | null = null;
    if (node.nodeType === ELEMENT_NODE) {
      id = (node as Element).id;
      tagName = (node as Element).tagName;
    }
    return { type: nodeType, index: this.position(node), id, tagName };
  }

  filteredStep(node: Node, ignoreClass: string): object | undefined {
    const filteredNode = this.filter(node, ignoreClass);
    if (!filteredNode) {
      return;
    }

    const nodeType: 'element' | 'text' =
      filteredNode.nodeType === TEXT_NODE ? 'text' : 'element';

    let id: string | null = null;
    let tagName: string | null = null;

    if (filteredNode.nodeType === ELEMENT_NODE) {
      id = (filteredNode as Element).id;
      tagName = (filteredNode as Element).tagName;
    }

    return {
      type: nodeType,
      index: this.filteredPosition(filteredNode, ignoreClass),
      id,
      tagName,
    };
  }

  pathTo(
    node: Node,
    offset: number | null,
    ignoreClass?: string
  ): CFIComponent {
    const segment: CFIComponent = {
      steps: [],
      terminal: {
        offset: null,
        assertion: null,
      },
    };
    let currentNode = node;
    let step;

    while (
      currentNode &&
      currentNode.parentNode &&
      currentNode.parentNode.nodeType != DOCUMENT_NODE
    ) {
      if (ignoreClass) {
        step = this.filteredStep(currentNode, ignoreClass);
      } else {
        step = this.step(currentNode);
      }

      if (step) {
        segment.steps.unshift(step as CFIStep);
      }

      currentNode = currentNode.parentNode;
    }

    // If no steps were added (unattached node), add a step for the node itself
    if (segment.steps.length === 0 && node) {
      if (ignoreClass) {
        step = this.filteredStep(node, ignoreClass);
      } else {
        step = this.step(node);
      }
      if (step) {
        segment.steps.unshift(step as CFIStep);
      }
    }

    if (offset != null && offset >= 0) {
      segment.terminal.offset = offset;

      // Make sure we are getting to a textNode if there is an offset
      const lastStep = segment.steps[segment.steps.length - 1];
      if (!lastStep || lastStep.type !== 'text') {
        segment.steps.push({
          type: 'text',
          index: 0,
        });
      }
    }

    return segment;
  }

  equalStep(stepA: CFIStep | undefined, stepB: CFIStep | undefined): boolean {
    if (!stepA || !stepB) return false;

    return (
      stepA.index === stepB.index &&
      stepA.id === stepB.id &&
      stepA.type === stepB.type
    );
  }

  equalTerminal(terminalA: CFITerminal, terminalB: CFITerminal): boolean {
    return (
      terminalA.offset === terminalB.offset &&
      terminalA.assertion === terminalB.assertion
    );
  }

  /**
   * Create a CFI range object from a DOM Range or CustomRange
   */
  fromRange(
    range: Range | CustomRange,
    base: string | object,
    ignoreClass?: string
  ): CFIRange {
    let start: Node, end: Node, startOffset: number, endOffset: number;

    // Duck-typing for DOM Range detection (works across iframes)
    function isDOMRange(obj: unknown): obj is Range {
      return (
        !!obj &&
        typeof obj === 'object' &&
        'startContainer' in obj &&
        typeof (obj as Record<string, unknown>).startContainer === 'object' &&
        'endContainer' in obj &&
        typeof (obj as Record<string, unknown>).endContainer === 'object' &&
        'startOffset' in obj &&
        typeof (obj as Record<string, unknown>).startOffset === 'number' &&
        'endOffset' in obj &&
        typeof (obj as Record<string, unknown>).endOffset === 'number' &&
        'collapsed' in obj &&
        typeof (obj as Record<string, unknown>).collapsed === 'boolean' &&
        'commonAncestorContainer' in obj &&
        typeof (obj as Record<string, unknown>).commonAncestorContainer ===
          'object'
      );
    }

    // Check if it's a custom range (has the required properties but not necessarily all DOM Range properties)
    function isCustomRange(obj: unknown): obj is CustomRange {
      return (
        !!obj &&
        typeof obj === 'object' &&
        'startContainer' in obj &&
        typeof (obj as Record<string, unknown>).startContainer === 'object' &&
        'endContainer' in obj &&
        typeof (obj as Record<string, unknown>).endContainer === 'object' &&
        'startOffset' in obj &&
        typeof (obj as Record<string, unknown>).startOffset === 'number' &&
        'endOffset' in obj &&
        typeof (obj as Record<string, unknown>).endOffset === 'number'
      );
    }

    if (isDOMRange(range)) {
      start = range.startContainer as Node;
      end = range.endContainer as Node;
      startOffset = range.startOffset as number;
      endOffset = range.endOffset as number;
    } else if (isCustomRange(range)) {
      start = range.startContainer as Node;
      end = range.endContainer as Node;
      startOffset = range.startOffset as number;
      endOffset = range.endOffset as number;
    } else {
      throw new Error('Invalid range object provided to fromRange');
    }

    const needsIgnoring = !!(
      ignoreClass && start.ownerDocument?.querySelector('.' + ignoreClass)
    );

    const patch = (node: Node, offset: number) =>
      needsIgnoring && typeof ignoreClass === 'string'
        ? node.nodeType === TEXT_NODE
          ? this.patchOffset(node, offset, ignoreClass)
          : offset
        : offset;

    // Check if the range is collapsed
    const isCollapsed = start === end && startOffset === endOffset;

    if (isCollapsed) {
      startOffset = patch(start, startOffset);
      const path = this.pathTo(start, startOffset, ignoreClass);
      return { path, start: path, end: path };
    }

    startOffset = patch(start, startOffset);
    endOffset = patch(end, endOffset);
    const startComp = this.pathTo(start, startOffset, ignoreClass);
    const endComp = this.pathTo(end, endOffset, ignoreClass);

    // Find common path steps
    const path: CFIComponent = {
      steps: [],
      terminal: { offset: null, assertion: null },
    };
    const len = startComp.steps.length;
    for (let i = 0; i < len; i++) {
      if (!this.equalStep(startComp.steps[i], endComp.steps[i])) break;
      path.steps.push(startComp.steps[i]);
    }

    // If last step is equal, check terminals
    if (
      len > 0 &&
      this.equalStep(startComp.steps[len - 1], endComp.steps[len - 1]) &&
      this.equalTerminal(startComp.terminal, endComp.terminal)
    ) {
      path.steps.push(startComp.steps[len - 1]);
    }

    // Remove common steps from start/end
    const common = path.steps.length;
    startComp.steps = startComp.steps.slice(common);
    endComp.steps = endComp.steps.slice(common);

    return { path, start: startComp, end: endComp };
  }

  /**
   * Create a CFI object from a Node
   */
  fromNode(
    anchor: Node,
    base: string | CFIComponent,
    ignoreClass?: string
  ): CFIRange {
    const cfi: CFIRange = {
      path: { steps: [], terminal: { offset: null, assertion: null } },
      start: { steps: [], terminal: { offset: null, assertion: null } },
      end: { steps: [], terminal: { offset: null, assertion: null } },
    };

    // base and spinePos are not part of CFIRange, so do not assign

    cfi.path = this.pathTo(anchor, null, ignoreClass);
    cfi.start = cfi.path;
    cfi.end = cfi.path;

    return cfi;
  }

  filter(anchor: Node, ignoreClass: string): Node | false {
    const isText = anchor.nodeType === TEXT_NODE;
    const parent = isText ? anchor.parentNode : null;
    let needsIgnoring = false;
    if (isText) {
      if (parent instanceof Element && parent.classList.contains(ignoreClass)) {
        needsIgnoring = true;
      }
    } else if (
      anchor instanceof Element &&
      anchor.classList.contains(ignoreClass)
    ) {
      needsIgnoring = true;
    }

    if (needsIgnoring && isText && parent) {
      const prev = parent.previousSibling;
      const next = parent.nextSibling;
      if (prev && prev.nodeType === TEXT_NODE) return prev;
      if (next && next.nodeType === TEXT_NODE) return next;
      return anchor;
    }
    if (needsIgnoring && !isText) return false;
    return anchor;
  }

  patchOffset(anchor: Node, offset: number, ignoreClass: string): number {
    if (anchor.nodeType != TEXT_NODE) {
      throw new Error('Anchor must be a text node');
    }

    let curr = anchor;
    let totalOffset = offset;

    // If the parent is a ignored node, get offset from it's start
    if (
      anchor.parentNode &&
      anchor.parentNode instanceof Element &&
      anchor.parentNode.classList.contains(ignoreClass)
    ) {
      curr = anchor.parentNode as Node;
    }

    while (curr.previousSibling) {
      const prev = curr.previousSibling;
      if (prev.nodeType === ELEMENT_NODE) {
        if (prev instanceof Element && prev.classList.contains(ignoreClass)) {
          totalOffset += prev.textContent ? prev.textContent.length : 0;
        } else {
          break;
        }
      } else {
        totalOffset += prev.textContent ? prev.textContent.length : 0;
      }
      curr = prev;
    }

    return totalOffset;
  }

  normalizedMap(
    children: NodeList,
    nodeType: 1 | 3 | number,
    ignoreClass?: string
  ) {
    const output: { [key: string]: number } = {};
    let prevIndex = -1;
    let i;
    const len = children.length;
    let currNodeType;
    let prevNodeType;

    for (i = 0; i < len; i++) {
      const node = children[i];
      currNodeType = node.nodeType;
      if (
        currNodeType === ELEMENT_NODE &&
        node instanceof Element &&
        node.classList.contains(ignoreClass ?? '')
      ) {
        currNodeType = TEXT_NODE;
      }
      if (i > 0 && currNodeType === TEXT_NODE && prevNodeType === TEXT_NODE) {
        output[i] = prevIndex;
      } else if (nodeType === currNodeType) {
        prevIndex = prevIndex + 1;
        output[i] = prevIndex;
      }
      prevNodeType = currNodeType;
    }

    return output;
  }

  position(anchor: Node): number {
    let children: HTMLCollection | Node[] | undefined;
    let index: number;

    if (anchor.nodeType === ELEMENT_NODE) {
      const parent = anchor.parentNode as Element | null;
      children = parent ? parent.children : undefined;

      if (!children && parent) {
        children = findChildren(parent);
      }
      index = children ? Array.prototype.indexOf.call(children, anchor) : -1;
      return index;
    }

    if (!anchor.parentNode) {
      return -1;
    }

    children = this.textNodes(anchor.parentNode as Node);
    index = children.indexOf(anchor);

    return index;
  }

  filteredPosition(anchor: Node, ignoreClass: string): number {
    const parent = anchor.parentNode;
    if (!parent || !(parent instanceof Element)) return -1;

    let children: NodeList | Element[];
    let map: { [key: string]: number };

    if (anchor.nodeType === ELEMENT_NODE) {
      children = Array.from(parent.children);
      map = this.normalizedMap(
        children as unknown as NodeList,
        ELEMENT_NODE,
        ignoreClass
      );
    } else {
      children = parent.childNodes;
      if (parent.classList.contains(ignoreClass)) {
        anchor = parent;
        const grand = parent.parentNode;
        if (!grand || !(grand instanceof Element)) return -1;
        children = grand.childNodes;
      }
      map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
    }

    const index = Array.prototype.indexOf.call(children, anchor);
    return map[index];
  }

  stepsToXpath(steps: CFIStep[]): string {
    const xpath = ['.', '*'];

    steps.forEach(function (step) {
      const position = step.index + 1;

      if (step.id) {
        xpath.push('*[position()=' + position + " and @id='" + step.id + "']");
      } else if (step.type === 'text') {
        xpath.push('text()[' + position + ']');
      } else {
        xpath.push('*[' + position + ']');
      }
    });

    return xpath.join('/');
  }

  stepsToQuerySelector(steps: CFIStep[]): string {
    const query = ['html'];

    steps.forEach(function (step) {
      const position = step.index + 1;

      if (step.id) {
        query.push('#' + step.id);
      } else if (step.type === 'text') {
        // unsupported in querySelector
        // query.push("text()[" + position + "]");
      } else {
        query.push('*:nth-child(' + position + ')');
      }
    });

    return query.join('>');
  }

  textNodes(container: Node, ignoreClass?: string): Node[] {
    if (!container || !container.childNodes) {
      return [];
    }

    return Array.prototype.slice
      .call(container.childNodes)
      .filter(function (node) {
        if (node.nodeType === TEXT_NODE) {
          return true;
        }
        // Treat elements with ignoreClass as text nodes for CFI positioning
        if (
          ignoreClass &&
          node.nodeType === ELEMENT_NODE &&
          node instanceof Element &&
          node.classList.contains(ignoreClass)
        ) {
          return true;
        }
        return false;
      });
  }

  walkToNode(steps: CFIStep[], _doc: Document, ignoreClass?: string) {
    const doc = _doc || document;
    let container: Node | null = doc.documentElement;
    let children;
    let step: CFIStep;
    const len = steps.length;
    let i;

    for (i = 0; i < len; i++) {
      step = steps[i];

      if (step.type === 'element') {
        //better to get a container using id as some times step.index may not be correct
        //For ex.https://github.com/futurepress/epub.js/issues/561
        if (step.id) {
          container = doc.getElementById(step.id) as Node | null;
        } else {
          children =
            container instanceof Element
              ? Array.from(container.children)
              : container
                ? []
                : [];
          container = children[step.index] as Node | null;
        }
      } else if (step.type === 'text') {
        const textNodesArr = this.textNodes(container, ignoreClass ?? '');
        container = textNodesArr[step.index] as Node | null;
      }
      if (!container) {
        //Break the for loop as due to incorrect index we can get error if
        //container is undefined so that other functionailties works fine
        //like navigation
        break;
      }
    }

    return container;
  }

  findNode(steps: CFIStep[], _doc: Document, ignoreClass?: string) {
    const doc = _doc || document;
    let container;
    let xpath;

    if (!ignoreClass && typeof doc.evaluate != 'undefined') {
      xpath = this.stepsToXpath(steps);
      container = doc.evaluate(
        xpath,
        doc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    } else if (ignoreClass) {
      container = this.walkToNode(steps, doc, ignoreClass);
    } else {
      container = this.walkToNode(steps, doc, undefined);
    }

    return container;
  }

  private fixMiss(
    steps: CFIStep[],
    offset: number,
    _doc: Document,
    ignoreClass?: string
  ) {
    let container = this.findNode(steps.slice(0, -1), _doc, ignoreClass);
    if (!container) return;

    const children = container.childNodes;
    const map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
    const lastStepIndex = steps[steps.length - 1].index;

    for (let i = 0; i < children.length; i++) {
      if (map[i] !== lastStepIndex) continue;
      const child = children[i];
      const len = child.textContent?.length ?? 0;
      if (offset > len) {
        offset -= len;
        continue;
      }
      container = child.nodeType === ELEMENT_NODE ? child.childNodes[0] : child;
      break;
    }

    return { container, offset };
  }

  public toRange(_doc: Document, ignoreClass?: string): Range | null {
    const doc = _doc || document;
    // Defensive: if this is a custom range object, convert to DOM Range
    const isCustomRange = (obj: unknown): obj is CustomRange => {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        'startContainer' in obj &&
        'endContainer' in obj
      );
    };

    if (isCustomRange(this)) {
      const domRange = EpubCFI.resolveToDomRange(this as CustomRange, doc);

      if (domRange) return domRange;
    }
    // Otherwise, proceed as before
    const needsIgnoring = ignoreClass && doc.querySelector('.' + ignoreClass);
    const useIgnore = needsIgnoring ? ignoreClass : undefined;
    const range = doc.createRange();

    const isRange = this.range && this.start && this.end;
    const startSteps = isRange
      ? this.path.steps.concat(this.start ? this.start.steps : [])
      : this.path.steps;

    const endSteps = isRange
      ? this.path.steps.concat(this.end ? this.end.steps : [])
      : undefined;

    const startContainer = this.findNode(startSteps, doc, useIgnore);
    const endContainer = endSteps
      ? this.findNode(endSteps, doc, useIgnore)
      : undefined;

    if (!startContainer) {
      return null;
    }

    try {
      range.setStart(startContainer, this.getOffset(this.start, this.path));
    } catch {
      const missed = this.fixMiss(
        startSteps,
        this.getOffset(this.start, this.path),
        doc,
        useIgnore
      );
      if (missed?.container)
        range.setStart(missed.container, missed.offset ?? 0);
    }

    if (endContainer && this.end) {
      try {
        range.setEnd(endContainer, this.getOffset(this.end, this.path));
      } catch {
        const missed = this.fixMiss(
          endSteps!,
          this.getOffset(this.end, this.path),
          doc,
          useIgnore
        );
        if (missed?.container)
          range.setEnd(missed.container, missed.offset ?? 0);
      }
    }

    return range;
  }

  /**
   * Check if a string is wrapped with "epubcfi()"
   */
  public isCfiString(str: unknown) {
    if (
      typeof str === 'string' &&
      str.indexOf('epubcfi(') === 0 &&
      str[str.length - 1] === ')'
    ) {
      return true;
    }

    return false;
  }

  public generateChapterComponent(
    spineNodeIndex: number,
    pos: number,
    id?: string
  ): string {
    const cfiSpine = `/${(spineNodeIndex + 1) * 2}/`;
    const cfiPos = `${(pos + 1) * 2}`;
    const cfiId = id ? `[${id}]` : '';
    return `${cfiSpine}${cfiPos}${cfiId}`;
  }

  /**
   * Collapse a CFI Range to a single CFI Position
   */
  collapse(toStart: boolean = false) {
    if (!this.range || !this.start || !this.end) {
      return;
    }

    if (toStart) {
      this.path.steps = this.path.steps.concat(this.start.steps);
      this.path.terminal = this.start.terminal;
    } else {
      this.path.steps = this.path.steps.concat(this.end.steps);
      this.path.terminal = this.end.terminal;
    }

    this.range = false;
    this.start = null;
    this.end = null;
  }
}

export default EpubCFI;
