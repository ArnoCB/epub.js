/**
 * Core Utilities and Helpers
 */

/**
 * Vendor prefixed requestAnimationFrame
 * @returns {function} requestAnimationFrame
 * @memberof Core
 */
export const requestAnimationFrame =
  typeof window !== 'undefined' ? window.requestAnimationFrame : undefined;

let _URL: typeof URL | undefined;

if (typeof URL !== 'undefined') {
  _URL = URL;
} else if (typeof window !== 'undefined' && typeof window.URL !== 'undefined') {
  _URL = window.URL;
} else {
  _URL = undefined;
}

/**
 * Generates a UUID
 * based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @memberof Core
 */
export function uuid(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
    }
  );
  return uuid;
}

/**
 * Gets the height of a document
 * @memberof Core
 */
export function documentHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
}

/**
 * Checks if a node is an element
 * @memberof Core
 */
export function isElement(obj: Node | undefined): obj is Element {
  return !!(obj && obj.nodeType === Node.ELEMENT_NODE);
}

/**
 * @memberof Core
 */
export function isNumber(n: unknown): n is number {
  return typeof n === 'number' && isFinite(n);
}

/**
 * Checks if a value is a float
 * @memberof Core
 */
export function isFloat(n: unknown): boolean {
  if (typeof n === 'number') {
    return Number.isFinite(n) && Math.floor(n) !== n;
  }

  if (typeof n === 'string') {
    const f = parseFloat(n);
    return !isNaN(f) && n.indexOf('.') > -1 && Math.floor(f) !== f;
  }

  return false;
}

/**
 * Get a prefixed css property
 * @memberof Core
 */
export function prefixed(unprefixed: string): string {
  const vendors = ['Webkit', 'webkit', 'Moz', 'O', 'ms'];
  const prefixes = ['-webkit-', '-webkit-', '-moz-', '-o-', '-ms-'];
  const lower = unprefixed.toLowerCase();
  const length = vendors.length;

  if (typeof document === 'undefined' || lower in document.body.style) {
    return unprefixed;
  }

  for (let i = 0; i < length; i++) {
    const prop = prefixes[i] + lower;
    if (prop in document.body.style) {
      return prop;
    }
  }

  return unprefixed;
}

/**
 * Apply defaults to an object
 * @param {object} obj
 * @returns {object}
 * @memberof Core
 */
export function defaults<T extends object>(
  obj: T,
  ...sources: Partial<T>[]
): T {
  for (const source of sources) {
    for (const prop in source) {
      const key = prop as keyof T;
      if (obj[key] === void 0) obj[key] = source[key] as T[keyof T];
    }
  }
  return obj;
}

/**
 * Extend properties of an object
 * @param {object} target
 * @returns {object}
 * @memberof Core
 */
export function extend<T extends object, S extends object>(
  target: T,
  ...sources: S[]
): T & S {
  sources.forEach(function (source) {
    if (!source) return;
    Object.getOwnPropertyNames(source).forEach(function (propName) {
      Object.defineProperty(
        target,
        propName,
        Object.getOwnPropertyDescriptor(source, propName)!
      );
    });
  });
  return target as T & S;
}

/**
 * Fast quicksort insert for sorted array -- based on:
 *  http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 * @memberof Core
 */
export function insert<T>(
  item: T,
  array: T[],
  compareFunction?: (a: T, b: T) => number
): number {
  const location = locationOf(item, array, compareFunction);
  array.splice(location, 0, item);
  return location;
}

/**
 * Finds where something would fit into a sorted array
 * @memberof Core
 */
export function locationOf<T>(
  item: T,
  array: T[],
  compareFunction?: (a: T, b: T) => number,
  _start?: number,
  _end?: number
): number {
  const start = _start ?? 0;
  const end = _end ?? array.length;
  const pivot = Math.floor(start + (end - start) / 2);
  if (!compareFunction) {
    compareFunction = function (a: T, b: T): number {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    };
  }
  if (end - start <= 0) {
    return pivot;
  }

  const compared = compareFunction(array[pivot], item);

  if (end - start === 1) {
    return compared >= 0 ? pivot : pivot + 1;
  }

  if (compared === 0) {
    return pivot;
  }

  if (compared === -1) {
    return locationOf(item, array, compareFunction, pivot, end);
  }

  return locationOf(item, array, compareFunction, start, pivot);
}

/**
 * Finds index of something in a sorted array
 * Returns -1 if not found
 * @memberof Core
 */
export function indexOfSorted<T>(
  item: T,
  array: T[],
  compareFunction?: (a: T, b: T) => number,
  _start?: number,
  _end?: number
): number {
  const start = _start ?? 0;
  const end = _end ?? array.length;
  const pivot = Math.floor(start + (end - start) / 2);

  if (!compareFunction) {
    compareFunction = function (a: T, b: T): number {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    };
  }

  if (end - start <= 0) {
    return -1;
  }

  const compared = compareFunction(array[pivot], item);

  if (end - start === 1) {
    return compared === 0 ? pivot : -1;
  }

  if (compared === 0) {
    return pivot; // Found
  }

  if (compared === -1) {
    return indexOfSorted(item, array, compareFunction, pivot, end);
  }

  return indexOfSorted(item, array, compareFunction, start, pivot);
}

/**
 * Find the bounds of an element
 * taking padding and margin into account
 * @param {element} el
 * @returns {{ width: Number, height: Number}}
 * @memberof Core
 */
export function bounds(el: Element): { width: number; height: number } {
  const style = window.getComputedStyle(el);
  const widthProps = [
    'width',
    'paddingRight',
    'paddingLeft',
    'marginRight',
    'marginLeft',
    'borderRightWidth',
    'borderLeftWidth',
  ];
  const heightProps = [
    'height',
    'paddingTop',
    'paddingBottom',
    'marginTop',
    'marginBottom',
    'borderTopWidth',
    'borderBottomWidth',
  ];

  let width = 0;
  let height = 0;

  widthProps.forEach(function (prop) {
    width +=
      parseFloat(style[prop as keyof CSSStyleDeclaration] as string) || 0;
  });

  heightProps.forEach(function (prop) {
    height +=
      parseFloat(style[prop as keyof CSSStyleDeclaration] as string) || 0;
  });

  return {
    height: height,
    width: width,
  };
}

/**
 * Find the bounds of an element
 * taking padding, margin and borders into account
 * @memberof Core
 */
export function borders(el: Element): { width: number; height: number } {
  const style = window.getComputedStyle(el);
  const widthProps = [
    'paddingRight',
    'paddingLeft',
    'marginRight',
    'marginLeft',
    'borderRightWidth',
    'borderLeftWidth',
  ];
  const heightProps = [
    'paddingTop',
    'paddingBottom',
    'marginTop',
    'marginBottom',
    'borderTopWidth',
    'borderBottomWidth',
  ];

  let width = 0;
  let height = 0;

  widthProps.forEach(function (prop) {
    width +=
      parseFloat(style[prop as keyof CSSStyleDeclaration] as string) || 0;
  });

  heightProps.forEach(function (prop) {
    height +=
      parseFloat(style[prop as keyof CSSStyleDeclaration] as string) || 0;
  });

  return {
    height: height,
    width: width,
  };
}

/**
 * Find the bounds of any node (Element or Text)
 * If node is a text node, wraps it in a Range and returns its bounding rect.
 * If node is an element, returns its bounding rect directly.
 * Throws if node is not an Element or Text node, or if ownerDocument is missing for text nodes.
 * @memberof Core
 * @throws Error if node is not an Element or Text node, or if ownerDocument is missing for text nodes.
 */
export function nodeBounds(node: Node): DOMRect {
  if (node.nodeType === Node.TEXT_NODE) {
    const doc = node.ownerDocument;
    if (!doc) throw new Error('Text node does not have an ownerDocument');
    const range = doc.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as Element).getBoundingClientRect();
  }
  throw new Error('Node does not support getBoundingClientRect');
}

/**
 * Find the equivalent of getBoundingClientRect of a browser window
 * @memberof Core
 */
export function windowBounds() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width: width,
    height: height,
  };
}

/**
 * Check if extension is xml
 * @memberof Core
 */
export function isXml(ext: string) {
  return ['xml', 'opf', 'ncx'].indexOf(ext) > -1;
}

/**
 * Create a new blob
 * @memberof Core
 */
export function createBlob(content: BlobPart, mime: string): Blob {
  return new Blob([content], { type: mime });
}

/**
 * Create a new blob url
 * @param {BlobPart} content
 * @param {string} mime
 * @returns {string | undefined} url, or undefined if URL API is not available
 * @memberof Core
 */
export function createBlobUrl(
  content: BlobPart,
  mime: string
): string | undefined {
  if (!_URL) return undefined;
  const blob = createBlob(content, mime);
  return _URL.createObjectURL(blob);
}

/**
 * Remove a blob url
 * @param {string} url
 * @memberof Core
 */
export function revokeBlobUrl(url: string) {
  if (!_URL) return;
  return _URL.revokeObjectURL(url);
}

/**
 * Create a new base64 encoded url
 * @memberof Core
 */
export function createBase64Url(
  content: unknown,
  mime: string
): string | undefined {
  if (typeof content !== 'string') {
    return;
  }

  const data = btoa(content);
  const datauri = 'data:' + mime + ';base64,' + data;

  return datauri;
}

/**
 * Get type of an object
 * @memberof Core
 */
export function type(obj: unknown): string {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * Parse xml (or html) markup
 * @memberof Core
 */
export function parse(markup: string, mime: DOMParserSupportedType): Document {
  // Remove byte order mark before parsing
  // https://www.w3.org/International/questions/qa-byte-order-mark
  if (markup.charCodeAt(0) === 0xfeff) {
    markup = markup.slice(1);
  }
  return new DOMParser().parseFromString(markup, mime);
}

/**
 * @deprecated Use `Element.querySelector` directly instead.
// ...existing code...

// ...existing code...

/**
 * Sprint through all text nodes in a document
 * @memberof Core
 */
export function sprint(root: Element, func: (node: Node) => void): void {
  const doc = root.ownerDocument || root;
  if (
    doc &&
    'createTreeWalker' in doc &&
    typeof (doc as Document).createTreeWalker !== 'undefined'
  ) {
    treeWalker(root, func, NodeFilter.SHOW_TEXT);
  } else {
    walk(root, function (node: Node): boolean {
      if (node && node.nodeType === Node.TEXT_NODE) {
        func(node);
      }
      return false;
    });
  }
}

/**
 * Create a treeWalker
 * @memberof Core
 */
export function treeWalker(
  root: Element,
  func: (node: Node) => void,
  filter: number
): void {
  const treeWalker = document.createTreeWalker(root, filter, null);
  let node;
  while ((node = treeWalker.nextNode())) {
    func(node);
  }
}

/**
 * @memberof Core
 * @param {node} node
 * @param {callback} return false for continue,true for break inside callback
 */
export function walk(node: Node, callback: (node: Node) => boolean): boolean {
  if (callback(node)) {
    return true;
  }

  let child = node.firstChild;

  while (child) {
    const walked = walk(child, callback);

    if (walked) {
      return true;
    }

    child = child.nextSibling;
  }

  return false;
}

/**
 * Convert a blob to a base64 encoded string
 * @memberof Core
 */
export function blob2base64(blob: Blob): Promise<string> {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
  });
}

/**
 * querySelector with filter by epub type
 * @param {element} html
 * @param element element type to find
 * @param type epub type to find
 * @memberof Core
 */
export function querySelectorByType(
  html: Element,
  element: string,
  type: string
): Element | null {
  return html.querySelector(`${element}[*|type="${type}"]`);
}

/**
 * Find direct descendents of an element

 * @memberof Core
 */
export function findChildren(el: Element): ChildNode[] {
  const result: ChildNode[] = [];
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === 1) {
      result.push(node);
    }
  }
  return result;
}

/**
 * Find all parents (ancestors) of an element
 * @memberof Core
 */
export function parents(node: Node): Node[] {
  const nodes: Node[] = [];
  let current: Node | null = node;
  while (current) {
    nodes.unshift(current);
    current = current.parentNode;
  }
  return nodes;
}

/**
 * Find all direct descendents of a specific type
 * @param {element} el
 * @param {string} nodeName
 * @param {boolean} [single]
 * @returns {element[]} children
 * @memberof Core
 */
export function filterChildren(
  el: Element,
  nodeName: string,
  single: boolean
): ChildNode[] | ChildNode | null {
  const result: ChildNode[] = [];
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === 1 && node.nodeName.toLowerCase() === nodeName) {
      if (single) {
        return node;
      }
      result.push(node);
    }
  }

  return single ? null : result;
}

/**
 * Filter all parents (ancestors) with tag name
 * @memberof Core
 */
export function getParentByTagName(
  node: Node | null,
  tagname: string
): Element[] {
  const result: Element[] = [];
  if (node === null || tagname === '') return result;
  let parent: Node | null = node.parentNode;
  while (parent && parent.nodeType === Node.ELEMENT_NODE) {
    const el = parent as Element;
    if (el.tagName.toLowerCase() === tagname) {
      result.push(el);
    }
    parent = parent.parentNode;
  }
  return result;
}

/**
 * Creates a new pending promise and provides methods to resolve or reject it.
 * From: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible
 * @memberof Core
 */
export class defer<T = unknown> {
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: unknown) => void;
  public promise: Promise<T>;
  public id: string;

  constructor() {
    this.id = uuid();
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    // Removed Object.freeze(this) to allow resolve/reject to work as expected
  }
}
