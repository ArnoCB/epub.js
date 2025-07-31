'use strict';
/**
 * Core Utilities and Helpers
 * @module Core
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.defer = exports.requestAnimationFrame = void 0;
exports.uuid = uuid;
exports.documentHeight = documentHeight;
exports.isElement = isElement;
exports.isNumber = isNumber;
exports.isFloat = isFloat;
exports.prefixed = prefixed;
exports.defaults = defaults;
exports.extend = extend;
exports.insert = insert;
exports.locationOf = locationOf;
exports.indexOfSorted = indexOfSorted;
exports.bounds = bounds;
exports.borders = borders;
exports.nodeBounds = nodeBounds;
exports.windowBounds = windowBounds;
exports.isXml = isXml;
exports.createBlob = createBlob;
exports.createBlobUrl = createBlobUrl;
exports.revokeBlobUrl = revokeBlobUrl;
exports.createBase64Url = createBase64Url;
exports.type = type;
exports.parse = parse;
exports.qs = qs;
exports.qsa = qsa;
exports.qsp = qsp;
exports.sprint = sprint;
exports.treeWalker = treeWalker;
exports.walk = walk;
exports.blob2base64 = blob2base64;
exports.querySelectorByType = querySelectorByType;
exports.findChildren = findChildren;
exports.parents = parents;
exports.filterChildren = filterChildren;
exports.getParentByTagName = getParentByTagName;
/**
 * Vendor prefixed requestAnimationFrame
 * @returns {function} requestAnimationFrame
 * @memberof Core
 */
exports.requestAnimationFrame =
  typeof window !== 'undefined' ? window.requestAnimationFrame : undefined;
let _URL;
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
function uuid() {
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
 * @returns {number} height
 * @memberof Core
 */
function documentHeight() {
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
function isElement(obj) {
  return !!(obj && obj.nodeType === Node.ELEMENT_NODE);
}
/**
 * @memberof Core
 */
function isNumber(n) {
  return typeof n === 'number' && isFinite(n);
}
/**
 * Checks if a value is a float
 * @memberof Core
 */
function isFloat(n) {
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
function prefixed(unprefixed) {
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
function defaults(obj, ...sources) {
  for (const source of sources) {
    for (const prop in source) {
      const key = prop;
      if (obj[key] === void 0) obj[key] = source[key];
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
function extend(target, ...sources) {
  sources.forEach(function (source) {
    if (!source) return;
    Object.getOwnPropertyNames(source).forEach(function (propName) {
      Object.defineProperty(
        target,
        propName,
        Object.getOwnPropertyDescriptor(source, propName)
      );
    });
  });
  return target;
}
/**
 * Fast quicksort insert for sorted array -- based on:
 *  http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 * @memberof Core
 */
function insert(item, array, compareFunction) {
  const location = locationOf(item, array, compareFunction);
  array.splice(location, 0, item);
  return location;
}
/**
 * Finds where something would fit into a sorted array
 * @memberof Core
 */
function locationOf(item, array, compareFunction, _start, _end) {
  const start = _start !== null && _start !== void 0 ? _start : 0;
  const end = _end !== null && _end !== void 0 ? _end : array.length;
  const pivot = Math.floor(start + (end - start) / 2);
  if (!compareFunction) {
    compareFunction = function (a, b) {
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
function indexOfSorted(item, array, compareFunction, _start, _end) {
  const start = _start !== null && _start !== void 0 ? _start : 0;
  const end = _end !== null && _end !== void 0 ? _end : array.length;
  const pivot = Math.floor(start + (end - start) / 2);
  if (!compareFunction) {
    compareFunction = function (a, b) {
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
function bounds(el) {
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
    width += parseFloat(style[prop]) || 0;
  });
  heightProps.forEach(function (prop) {
    height += parseFloat(style[prop]) || 0;
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
function borders(el) {
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
    width += parseFloat(style[prop]) || 0;
  });
  heightProps.forEach(function (prop) {
    height += parseFloat(style[prop]) || 0;
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
function nodeBounds(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const doc = node.ownerDocument;
    if (!doc) throw new Error('Text node does not have an ownerDocument');
    const range = doc.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return node.getBoundingClientRect();
  }
  throw new Error('Node does not support getBoundingClientRect');
}
/**
 * Find the equivalent of getBoundingClientRect of a browser window
 * @memberof Core
 */
function windowBounds() {
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
function isXml(ext) {
  return ['xml', 'opf', 'ncx'].indexOf(ext) > -1;
}
/**
 * Create a new blob
 * @memberof Core
 */
function createBlob(content, mime) {
  return new Blob([content], { type: mime });
}
/**
 * Create a new blob url
 * @param {BlobPart} content
 * @param {string} mime
 * @returns {string | undefined} url, or undefined if URL API is not available
 * @memberof Core
 */
function createBlobUrl(content, mime) {
  if (!_URL) return undefined;
  const blob = createBlob(content, mime);
  return _URL.createObjectURL(blob);
}
/**
 * Remove a blob url
 * @param {string} url
 * @memberof Core
 */
function revokeBlobUrl(url) {
  if (!_URL) return;
  return _URL.revokeObjectURL(url);
}
/**
 * Create a new base64 encoded url
 * @memberof Core
 */
function createBase64Url(content, mime) {
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
function type(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
/**
 * Parse xml (or html) markup
 * @memberof Core
 */
function parse(markup, mime) {
  // Remove byte order mark before parsing
  // https://www.w3.org/International/questions/qa-byte-order-mark
  if (markup.charCodeAt(0) === 0xfeff) {
    markup = markup.slice(1);
  }
  return new DOMParser().parseFromString(markup, mime);
}
/**
 * @deprecated Use `Element.querySelector` directly instead.
 * querySelector polyfill
 * @memberof Core
 */
function qs(el, sel) {
  let elements;
  if (!el) {
    throw new Error('No Element Provided');
  }
  if (typeof el.querySelector != 'undefined') {
    return el.querySelector(sel);
  } else {
    elements = el.getElementsByTagName(sel);
    if (elements.length) {
      return elements[0];
    }
  }
  return null;
}
/**
 * querySelectorAll polyfill
 * @memberof Core
 * @deprecated Use `Element.querySelectorAll` directly instead.
 */
function qsa(el, sel) {
  if (typeof el.querySelector != 'undefined') {
    return el.querySelectorAll(sel);
  }
  return el.getElementsByTagName(sel);
}
/**
 * querySelector by property
 * @memberof Core
 * @deprecated Use `Element.querySelector` with attribute selectors directly instead.
 * querySelector by property
 */
function qsp(el, sel, props) {
  let q, filtered;
  if (typeof el.querySelector != 'undefined') {
    sel += '[';
    for (const prop in props) {
      sel += prop + "~='" + props[prop] + "'";
    }
    sel += ']';
    return el.querySelector(sel);
  } else {
    q = el.getElementsByTagName(sel);
    filtered = Array.prototype.slice.call(q, 0).filter(function (el) {
      for (const prop in props) {
        if (el.getAttribute(prop) === props[prop]) {
          return true;
        }
      }
      return false;
    });
    if (filtered) {
      return filtered[0];
    }
  }
  return null;
}
/**
 * Sprint through all text nodes in a document
 * @memberof Core
 */
function sprint(root, func) {
  const doc = root.ownerDocument || root;
  if (
    doc &&
    'createTreeWalker' in doc &&
    typeof doc.createTreeWalker !== 'undefined'
  ) {
    treeWalker(root, func, NodeFilter.SHOW_TEXT);
  } else {
    walk(root, function (node) {
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
function treeWalker(root, func, filter) {
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
function walk(node, callback) {
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
function blob2base64(blob) {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(reader.result);
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
function querySelectorByType(html, element, type) {
  return html.querySelector(`${element}[*|type="${type}"]`);
}
/**
 * Find direct descendents of an element

 * @memberof Core
 */
function findChildren(el) {
  const result = [];
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
function parents(node) {
  const nodes = [];
  let current = node;
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
function filterChildren(el, nodeName, single) {
  const result = [];
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === 1 && node.nodeName.toLowerCase() === nodeName) {
      result.push(node);
      if (single) {
        break;
      }
    }
  }
  return result;
}
/**
 * Filter all parents (ancestors) with tag name
 * @memberof Core
 */
function getParentByTagName(node, tagname) {
  const result = [];
  if (node === null || tagname === '') return result;
  let parent = node.parentNode;
  while (parent && parent.nodeType === Node.ELEMENT_NODE) {
    const el = parent;
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
class defer {
  constructor() {
    this.id = uuid();
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    // Removed Object.freeze(this) to allow resolve/reject to work as expected
  }
}
exports.defer = defer;
