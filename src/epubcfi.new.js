'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('./utils/core');
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
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
class EpubCFI {
  /**
   * Robustly convert custom range objects to DOM Range, with logging for compatibility
   */
  /**
   * Robustly convert custom range objects to DOM Range, with logging for compatibility
   */
  static resolveToDomRange(input, doc) {
    console.log('[EpubCFI.resolveToDomRange] Input:', input);
    if (typeof input !== 'string' && input && typeof input === 'object') {
      // Custom range object detected
      if (input.startContainer && input.endContainer) {
        // Looks like a DOM Range or CustomRange
        if (typeof doc.createRange === 'function') {
          const range = doc.createRange();
          range.setStart(input.startContainer, input.startOffset);
          range.setEnd(input.endContainer, input.endOffset);
          console.log(
            '[EpubCFI.resolveToDomRange] Converted custom range object to DOM Range:',
            range
          );
          return range;
        }
      }
      // Fallback: return the custom range object as-is
      console.warn(
        '[EpubCFI.resolveToDomRange] Returning custom range object as-is:',
        input
      );
      return input;
    }
    // If string, not a range
    return null;
  }
  // ...existing code...
  /**
   * Helper to get offset from a CFIComponent, falling back to another if needed
   */
  getOffset(comp, fallback) {
    return comp && comp.terminal.offset != null
      ? comp.terminal.offset
      : fallback.terminal.offset != null
        ? fallback.terminal.offset
        : 0;
  }
  constructor(
    cfiFrom,
    base = {
      steps: [],
      terminal: { offset: null, assertion: null },
    },
    ignoreClass
  ) {
    this.str = '';
    this.base = {
      steps: [],
      terminal: { offset: null, assertion: null },
    };
    this.spinePos = 0;
    this.range = false;
    this.start = null;
    this.end = null;
    this.path = {
      steps: [],
      terminal: { offset: null, assertion: null },
    };
    // Accept no arguments, default to empty string
    if (typeof cfiFrom === 'undefined') cfiFrom = '';
    // Normalize base
    let baseComponent;
    if (typeof base === 'string') {
      baseComponent = this.parseComponent(base);
    } else if (base && typeof base === 'object' && 'steps' in base) {
      baseComponent = base;
    } else {
      baseComponent = {
        steps: [],
        terminal: { offset: null, assertion: null },
      };
    }
    this.base = baseComponent;
    const type = this.checkType(cfiFrom);
    switch (type) {
      case 'string': {
        this.str = cfiFrom;
        const parsed = this.parse(this.str);
        this.base = parsed.base;
        this.spinePos = parsed.spinePos;
        this.range = !!parsed.range && !!parsed.start && !!parsed.end;
        this.path = parsed.path;
        this.start = parsed.start;
        this.end = parsed.end;
        break;
      }
      case 'range': {
        const rangeObj = this.fromRange(cfiFrom, this.base, ignoreClass);
        this.range = true;
        this.path = rangeObj.path;
        this.start = rangeObj.start;
        this.end = rangeObj.end;
        break;
      }
      case 'customRange': {
        // Convert CustomRange to DOM Range-like for fromRange
        const custom = cfiFrom;
        const fakeRange = {
          startContainer: custom.startContainer,
          startOffset: custom.startOffset,
          endContainer: custom.endContainer,
          endOffset: custom.endOffset,
          collapsed:
            custom.startContainer === custom.endContainer &&
            custom.startOffset === custom.endOffset,
        };
        const rangeObj = this.fromRange(fakeRange, this.base, ignoreClass);
        this.range = true;
        this.path = rangeObj.path;
        this.start = rangeObj.start;
        this.end = rangeObj.end;
        break;
      }
      case 'node': {
        const nodeObj = this.fromNode(cfiFrom, this.base, ignoreClass);
        this.range = false;
        this.path = nodeObj.path;
        this.start = null;
        this.end = null;
        break;
      }
      case 'EpubCFI': {
        return cfiFrom;
      }
      default: {
        if (!cfiFrom) return this;
        throw new TypeError('not a valid argument for EpubCFI');
      }
    }
  }
  /**
   * Check the type of constructor input
   */
  checkType(cfi) {
    if (this.isCfiString(cfi)) {
      return 'string';
    } else if (
      cfi &&
      typeof cfi === 'object' &&
      ((0, core_1.type)(cfi) === 'Range' ||
        (typeof cfi.startContainer != 'undefined' &&
          typeof cfi.collapsed !== 'undefined'))
    ) {
      return 'range';
    } else if (
      cfi &&
      typeof cfi === 'object' &&
      typeof cfi.nodeType != 'undefined'
    ) {
      return 'node';
    } else if (
      cfi &&
      typeof cfi === 'object' &&
      typeof cfi.startContainer !== 'undefined' &&
      typeof cfi.startOffset !== 'undefined' &&
      typeof cfi.endContainer !== 'undefined' &&
      typeof cfi.endOffset !== 'undefined' &&
      !('collapsed' in cfi)
    ) {
      return 'customRange';
    } else if (cfi && typeof cfi === 'object' && cfi instanceof EpubCFI) {
      return 'EpubCFI';
    } else {
      return false;
    }
  }
  /**
   * Parse a cfi string to a CFI object representation
   */
  parse(cfiStr) {
    var _a, _b;
    const emptyComponent = {
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
    const spinePos =
      (_b =
        (_a = base.steps[1]) === null || _a === void 0 ? void 0 : _a.index) !==
        null && _b !== void 0
        ? _b
        : -1;
    return { spinePos, range: isRange, base, path, start, end };
  }
  parseComponent(componentStr) {
    const component = {
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
    component.steps = steps.map((step) => this.parseStep(step)).filter(Boolean);
    return component;
  }
  parseStep(stepStr) {
    let id = null;
    const tagName = null;
    let type;
    let index;
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
  parseTerminal(terminalStr) {
    let characterOffset;
    let textLocationAssertion = null;
    const assertion = terminalStr.match(/\[(.*)\]/);
    if (assertion && assertion[1]) {
      characterOffset = parseInt(terminalStr.split('[')[0]);
      textLocationAssertion = assertion[1];
    } else {
      characterOffset = parseInt(terminalStr);
    }
    if (!(0, core_1.isNumber)(characterOffset)) {
      characterOffset = null;
    }
    return { offset: characterOffset, assertion: textLocationAssertion };
  }
  getChapterComponent(cfiStr) {
    const indirection = cfiStr.split('!');
    return indirection[0];
  }
  getPathComponent(cfiStr) {
    const indirection = cfiStr.split('!');
    if (indirection[1]) {
      // Always return the part before the first comma (if any)
      return indirection[1].split(',')[0];
    }
  }
  getRange(cfiStr) {
    const ranges = cfiStr.split(',');
    if (ranges.length === 3) {
      return [ranges[1], ranges[2]];
    }
    return false;
  }
  getCharacterOffsetComponent(cfiStr) {
    const splitStr = cfiStr.split(':');
    return splitStr[1] || '';
  }
  joinSteps(steps) {
    if (!(steps === null || steps === void 0 ? void 0 : steps.length))
      return '';
    return steps
      .map((part) => {
        const value =
          part.type === 'element' ? (part.index + 1) * 2 : 1 + 2 * part.index;
        return `${value}${part.id ? `[${part.id}]` : ''}`;
      })
      .join('/');
  }
  segmentString(segment) {
    let segmentString = '/';
    segmentString += this.joinSteps(segment.steps);
    if (segment.terminal && segment.terminal.offset != null) {
      segmentString += ':' + segment.terminal.offset;
    }
    if (segment.terminal && segment.terminal.assertion != null) {
      segmentString += '[' + segment.terminal.assertion + ']';
    }
    return segmentString;
  }
  /**
   * Convert CFI to a epubcfi(...) string
   */
  toString() {
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
  compare(cfiOne, cfiTwo) {
    if (typeof cfiOne === 'string') cfiOne = new EpubCFI(cfiOne);
    if (typeof cfiTwo === 'string') cfiTwo = new EpubCFI(cfiTwo);
    // Compare spine positions
    if (cfiOne.spinePos !== cfiTwo.spinePos) {
      return cfiOne.spinePos > cfiTwo.spinePos ? 1 : -1;
    }
    const getStepsAndTerminal = (cfi) =>
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
    if (terminalA.offset !== terminalB.offset)
      return terminalA.offset > terminalB.offset ? 1 : -1;
    return 0;
  }
  step(node) {
    const nodeType = node.nodeType === TEXT_NODE ? 'text' : 'element';
    let id = null;
    let tagName = null;
    if (node.nodeType === ELEMENT_NODE) {
      id = node.id;
      tagName = node.tagName;
    }
    return { type: nodeType, index: this.position(node), id, tagName };
  }
  filteredStep(node, ignoreClass) {
    const filteredNode = this.filter(node, ignoreClass);
    if (!filteredNode) {
      return;
    }
    const nodeType = filteredNode.nodeType === TEXT_NODE ? 'text' : 'element';
    let id = null;
    let tagName = null;
    if (filteredNode.nodeType === ELEMENT_NODE) {
      id = filteredNode.id;
      tagName = filteredNode.tagName;
    }
    return {
      type: nodeType,
      index: this.filteredPosition(filteredNode, ignoreClass),
      id,
      tagName,
    };
  }
  pathTo(node, offset, ignoreClass) {
    const segment = {
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
        segment.steps.unshift(step);
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
        segment.steps.unshift(step);
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
  equalStep(stepA, stepB) {
    if (!stepA || !stepB) {
      return false;
    }
    if (
      stepA.index === stepB.index &&
      stepA.id === stepB.id &&
      stepA.type === stepB.type
    ) {
      return true;
    }
    return false;
  }
  /**
   * Create a CFI range object from a DOM Range
   */
  fromRange(range, base, ignoreClass) {
    var _a;
    let start, end, startOffset, endOffset;
    if (range instanceof Range) {
      start = range.startContainer;
      end = range.endContainer;
      startOffset = range.startOffset;
      endOffset = range.endOffset;
    } else {
      start = end = range;
      startOffset = endOffset = 0;
    }
    const needsIgnoring = !!(
      ignoreClass &&
      ((_a = start.ownerDocument) === null || _a === void 0
        ? void 0
        : _a.querySelector('.' + ignoreClass))
    );
    const patch = (node, offset) =>
      needsIgnoring && typeof ignoreClass === 'string'
        ? this.patchOffset(node, offset, ignoreClass)
        : offset;
    if (range.collapsed) {
      startOffset = patch(start, startOffset);
      const path = this.pathTo(start, startOffset, ignoreClass);
      return { path, start: path, end: path };
    }
    startOffset = patch(start, startOffset);
    endOffset = patch(end, endOffset);
    const startComp = this.pathTo(start, startOffset, ignoreClass);
    const endComp = this.pathTo(end, endOffset, ignoreClass);
    // Find common path steps
    const path = {
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
      startComp.terminal === endComp.terminal
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
  fromNode(anchor, base, ignoreClass) {
    const cfi = {
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
  filter(anchor, ignoreClass) {
    const isText = anchor.nodeType === TEXT_NODE;
    const parent = isText ? anchor.parentNode : null;
    const needsIgnoring = isText
      ? !!(
          parent &&
          parent instanceof Element &&
          parent.classList.contains(ignoreClass)
        )
      : anchor instanceof Element && anchor.classList.contains(ignoreClass);
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
  patchOffset(anchor, offset, ignoreClass) {
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
      curr = anchor.parentNode;
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
  normalizedMap(children, nodeType, ignoreClass) {
    const output = {};
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
        node.classList.contains(
          ignoreClass !== null && ignoreClass !== void 0 ? ignoreClass : ''
        )
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
  position(anchor) {
    const parent = anchor.parentNode;
    if (!(parent instanceof Element)) return -1;
    if (anchor.nodeType === ELEMENT_NODE) {
      const children = Array.from(parent.children);
      return children.indexOf(anchor);
    } else {
      const textNodes = this.textNodes(parent);
      return textNodes.indexOf(anchor);
    }
  }
  filteredPosition(anchor, ignoreClass) {
    const parent = anchor.parentNode;
    if (!parent || !(parent instanceof Element)) return -1;
    let children;
    let map;
    if (anchor.nodeType === ELEMENT_NODE) {
      children = Array.from(parent.children);
      map = this.normalizedMap(children, ELEMENT_NODE, ignoreClass);
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
  stepsToXpath(steps) {
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
  stepsToQuerySelector(steps) {
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
  textNodes(container, ignoreClass) {
    return Array.prototype.slice
      .call(container.childNodes)
      .filter(function (node) {
        return (
          node.nodeType === TEXT_NODE ||
          node.classList.contains(
            ignoreClass !== null && ignoreClass !== void 0 ? ignoreClass : ''
          )
        );
      });
  }
  walkToNode(steps, _doc, ignoreClass) {
    const doc = _doc || document;
    let container = doc.documentElement;
    let children;
    let step;
    const len = steps.length;
    let i;
    for (i = 0; i < len; i++) {
      step = steps[i];
      if (step.type === 'element') {
        //better to get a container using id as some times step.index may not be correct
        //For ex.https://github.com/futurepress/epub.js/issues/561
        if (step.id) {
          container = doc.getElementById(step.id);
        } else {
          children =
            container instanceof Element
              ? Array.from(container.children)
              : container
                ? []
                : [];
          container = children[step.index];
        }
      } else if (step.type === 'text') {
        const textNodesArr = this.textNodes(
          container,
          ignoreClass !== null && ignoreClass !== void 0 ? ignoreClass : ''
        );
        container = textNodesArr[step.index];
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
  findNode(steps, _doc, ignoreClass) {
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
  fixMiss(steps, offset, _doc, ignoreClass) {
    var _a, _b;
    let container = this.findNode(steps.slice(0, -1), _doc, ignoreClass);
    if (!container) return;
    const children = container.childNodes;
    const map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
    const lastStepIndex = steps[steps.length - 1].index;
    for (let i = 0; i < children.length; i++) {
      if (map[i] !== lastStepIndex) continue;
      const child = children[i];
      const len =
        (_b =
          (_a = child.textContent) === null || _a === void 0
            ? void 0
            : _a.length) !== null && _b !== void 0
          ? _b
          : 0;
      if (offset > len) {
        offset -= len;
        continue;
      }
      container = child.nodeType === ELEMENT_NODE ? child.childNodes[0] : child;
      break;
    }
    return { container, offset };
  }
  toRange(_doc, ignoreClass) {
    var _a, _b;
    console.log('[EpubCFI.toRange] Converting to Range:', this.toString());
    const doc = _doc || document;
    // Log document structure for debugging
    try {
      console.log(
        '[EpubCFI.toRange] doc.documentElement:',
        doc.documentElement
      );
      console.log('[EpubCFI.toRange] doc.body:', doc.body);
      if (doc.body) {
        console.log(
          '[EpubCFI.toRange] doc.body.childNodes:',
          Array.from(doc.body.childNodes)
        );
      }
    } catch (e) {
      console.warn('[EpubCFI.toRange] Error logging document structure:', e);
    }
    // Defensive: if this is a custom range object, convert to DOM Range
    const isCustomRange = (obj) => {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        'startContainer' in obj &&
        'endContainer' in obj
      );
    };
    console.log('isCustomRange:', isCustomRange(this));
    if (isCustomRange(this)) {
      const domRange = EpubCFI.resolveToDomRange(this, doc);
      console.log(
        '[EpubCFI.toRange] Converted custom range to DOM Range:',
        domRange
      );
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
    console.log(
      '[EpubCFI.toRange] startSteps:',
      startSteps,
      'endSteps:',
      endSteps
    );
    const startContainer = this.findNode(startSteps, doc, useIgnore);
    const endContainer = endSteps
      ? this.findNode(endSteps, doc, useIgnore)
      : undefined;
    console.log(
      '[EpubCFI.toRange] startContainer:',
      startContainer,
      'endContainer:',
      endContainer
    );
    if (!startContainer) {
      console.log('No startContainer found for', this.toString());
      return null;
    }
    try {
      range.setStart(startContainer, this.getOffset(this.start, this.path));
    } catch (_c) {
      const missed = this.fixMiss(
        startSteps,
        this.getOffset(this.start, this.path),
        doc,
        useIgnore
      );
      if (missed === null || missed === void 0 ? void 0 : missed.container)
        range.setStart(
          missed.container,
          (_a = missed.offset) !== null && _a !== void 0 ? _a : 0
        );
    }
    if (endContainer && this.end) {
      try {
        range.setEnd(endContainer, this.getOffset(this.end, this.path));
      } catch (_d) {
        const missed = this.fixMiss(
          endSteps,
          this.getOffset(this.end, this.path),
          doc,
          useIgnore
        );
        if (missed === null || missed === void 0 ? void 0 : missed.container)
          range.setEnd(
            missed.container,
            (_b = missed.offset) !== null && _b !== void 0 ? _b : 0
          );
      }
    }
    return range;
  }
  /**
   * Check if a string is wrapped with "epubcfi()"
   */
  isCfiString(str) {
    if (
      typeof str === 'string' &&
      str.indexOf('epubcfi(') === 0 &&
      str[str.length - 1] === ')'
    ) {
      return true;
    }
    return false;
  }
  generateChapterComponent(spineNodeIndex, pos, id) {
    const cfiSpine = `/${(spineNodeIndex + 1) * 2}/`;
    const cfiPos = `${(pos + 1) * 2}`;
    const cfiId = id ? `[${id}]` : '';
    return `${cfiSpine}${cfiPos}${cfiId}`;
  }
  /**
   * Collapse a CFI Range to a single CFI Position
   */
  collapse(toStart = false) {
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
exports.default = EpubCFI;
