/**
 * Core Utilities and Helpers
 */
/**
 * Vendor prefixed requestAnimationFrame
 * @returns {function} requestAnimationFrame
 * @memberof Core
 */
export declare const requestAnimationFrame: (((callback: FrameRequestCallback) => number) & typeof globalThis.requestAnimationFrame) | undefined;
/**
 * Generates a UUID
 * based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @memberof Core
 */
export declare function uuid(): string;
/**
 * Gets the height of a document
 * @memberof Core
 */
export declare function documentHeight(): number;
/**
 * Checks if a node is an element
 * @memberof Core
 */
export declare function isElement(obj: Node | undefined): obj is Element;
/**
 * @memberof Core
 */
export declare function isNumber(n: unknown): n is number;
/**
 * Checks if a value is a float
 * @memberof Core
 */
export declare function isFloat(n: unknown): boolean;
/**
 * Get a prefixed css property
 * @memberof Core
 */
export declare function prefixed(unprefixed: string): string;
/**
 * Apply defaults to an object
 * @param {object} obj
 * @returns {object}
 * @memberof Core
 */
export declare function defaults<T extends object>(obj: T, ...sources: Partial<T>[]): T;
/**
 * Extend properties of an object
 * @param {object} target
 * @returns {object}
 * @memberof Core
 */
export declare function extend<T extends object, S extends object>(target: T, ...sources: S[]): T & S;
/**
 * Fast quicksort insert for sorted array -- based on:
 *  http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 * @memberof Core
 */
export declare function insert<T>(item: T, array: T[], compareFunction?: (a: T, b: T) => number): number;
/**
 * Finds where something would fit into a sorted array
 * @memberof Core
 */
export declare function locationOf<T>(item: T, array: T[], compareFunction?: (a: T, b: T) => number, _start?: number, _end?: number): number;
/**
 * Finds index of something in a sorted array
 * Returns -1 if not found
 * @memberof Core
 */
export declare function indexOfSorted<T>(item: T, array: T[], compareFunction?: (a: T, b: T) => number, _start?: number, _end?: number): number;
/**
 * Find the bounds of an element
 * taking padding and margin into account
 * @param {element} el
 * @returns {{ width: Number, height: Number}}
 * @memberof Core
 */
export declare function bounds(el: Element): {
    width: number;
    height: number;
};
/**
 * Find the bounds of an element
 * taking padding, margin and borders into account
 * @memberof Core
 */
export declare function borders(el: Element): {
    width: number;
    height: number;
};
/**
 * Find the bounds of any node (Element or Text)
 * If node is a text node, wraps it in a Range and returns its bounding rect.
 * If node is an element, returns its bounding rect directly.
 * Throws if node is not an Element or Text node, or if ownerDocument is missing for text nodes.
 * @memberof Core
 * @throws Error if node is not an Element or Text node, or if ownerDocument is missing for text nodes.
 */
export declare function nodeBounds(node: Node): DOMRect;
/**
 * Find the equivalent of getBoundingClientRect of a browser window
 * @memberof Core
 */
export declare function windowBounds(): {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};
/**
 * Check if extension is xml
 * @memberof Core
 */
export declare function isXml(ext: string): boolean;
/**
 * Create a new blob
 * @memberof Core
 */
export declare function createBlob(content: BlobPart, mime: string): Blob;
/**
 * Create a new blob url
 * @param {BlobPart} content
 * @param {string} mime
 * @returns {string | undefined} url, or undefined if URL API is not available
 * @memberof Core
 */
export declare function createBlobUrl(content: BlobPart, mime: string): string | undefined;
/**
 * Remove a blob url
 * @param {string} url
 * @memberof Core
 */
export declare function revokeBlobUrl(url: string): void;
/**
 * Create a new base64 encoded url
 * @memberof Core
 */
export declare function createBase64Url(content: unknown, mime: string): string | undefined;
/**
 * Get type of an object
 * @memberof Core
 */
export declare function type(obj: unknown): string;
/**
 * Parse xml (or html) markup
 * @memberof Core
 */
export declare function parse(markup: string, mime: DOMParserSupportedType): Document;
/**
 * @deprecated Use `Element.querySelector` directly instead.
// ...existing code...

// ...existing code...

/**
 * Sprint through all text nodes in a document
 * @memberof Core
 */
export declare function sprint(root: Element, func: (node: Node) => void): void;
/**
 * Create a treeWalker
 * @memberof Core
 */
export declare function treeWalker(root: Element, func: (node: Node) => void, filter: number): void;
/**
 * @memberof Core
 * @param {node} node
 * @param {callback} return false for continue,true for break inside callback
 */
export declare function walk(node: Node, callback: (node: Node) => boolean): boolean;
/**
 * Convert a blob to a base64 encoded string
 * @memberof Core
 */
export declare function blob2base64(blob: Blob): Promise<string>;
/**
 * querySelector with filter by epub type
 * @param {element} html
 * @param element element type to find
 * @param type epub type to find
 * @memberof Core
 */
export declare function querySelectorByType(html: Element, element: string, type: string): Element | null;
/**
 * Find direct descendents of an element

 * @memberof Core
 */
export declare function findChildren(el: Element): ChildNode[];
/**
 * Find all parents (ancestors) of an element
 * @memberof Core
 */
export declare function parents(node: Node): Node[];
/**
 * Find all direct descendents of a specific type
 * @param {element} el
 * @param {string} nodeName
 * @param {boolean} [single]
 * @returns {element[]} children
 * @memberof Core
 */
export declare function filterChildren(el: Element, nodeName: string, single: boolean): ChildNode[] | ChildNode | null;
/**
 * Filter all parents (ancestors) with tag name
 * @memberof Core
 */
export declare function getParentByTagName(node: Node | null, tagname: string): Element[];
/**
 * Creates a new pending promise and provides methods to resolve or reject it.
 * From: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible
 * @memberof Core
 */
export declare class defer<T = unknown> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
    promise: Promise<T>;
    id: string;
    constructor();
}
/**
 * Returns a valid value from allowed options or a default if invalid/missing
 */
export declare function getValidOrDefault<T extends readonly string[] | {
    [key: string]: string;
}>(value: string | null | undefined, allowed: T, defaultValue: T extends readonly string[] ? T[number] : T[keyof T]): T extends readonly string[] ? T[number] : T[keyof T];
