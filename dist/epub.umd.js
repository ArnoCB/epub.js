(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ePub = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	// ES3 safe
	var _undefined$1 = void 0;

	var is$4 = function (value) { return value !== _undefined$1 && value !== null; };

	// prettier-ignore
	var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

	var is$3 = function (value) {
		if (!is$4(value)) return false;
		return hasOwnProperty.call(possibleTypes, typeof value);
	};

	var is$2 = function (value) {
		if (!is$3(value)) return false;
		try {
			if (!value.constructor) return false;
			return value.constructor.prototype === value;
		} catch (error) {
			return false;
		}
	};

	var is$1 = function (value) {
		if (typeof value !== "function") return false;

		if (!hasOwnProperty.call(value, "length")) return false;

		try {
			if (typeof value.length !== "number") return false;
			if (typeof value.call !== "function") return false;
			if (typeof value.apply !== "function") return false;
		} catch (error) {
			return false;
		}

		return !is$2(value);
	};

	var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

	var is = function (value) {
		if (!is$1(value)) return false;
		if (classRe.test(functionToString.call(value))) return false;
		return true;
	};

	var isImplemented$2 = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== "function") return false;
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
	};

	var isImplemented$1 = function () {
		try {
			Object.keys("primitive");
			return true;
		} catch (e) {
			return false;
		}
	};

	// eslint-disable-next-line no-empty-function
	var noop = function () {};

	var _undefined = noop(); // Support ES3 engines

	var isValue = function (val) { return val !== _undefined && val !== null; };

	var keys$1 = Object.keys;

	var shim$2 = function (object) { return keys$1(isValue(object) ? Object(object) : object); };

	var keys = isImplemented$1() ? Object.keys : shim$2;

	var validValue = function (value) {
		if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};

	var max   = Math.max;

	var shim$1 = function (dest, src /*, …srcn*/) {
		var error, i, length = max(arguments.length, 2), assign;
		dest = Object(validValue(dest));
		assign = function (key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};

	var assign = isImplemented$2() ? Object.assign : shim$1;

	var forEach = Array.prototype.forEach, create = Object.create;

	var process$2 = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	// eslint-disable-next-line no-unused-vars
	var normalizeOptions = function (opts1 /*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (!isValue(options)) return;
			process$2(Object(options), result);
		});
		return result;
	};

	var str = "razdwatrzy";

	var isImplemented = function () {
		if (typeof str.contains !== "function") return false;
		return str.contains("dwa") === true && str.contains("foo") === false;
	};

	var indexOf = String.prototype.indexOf;

	var shim = function (searchString /*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};

	var contains$1 = isImplemented() ? String.prototype.contains : shim;

	var d_1 = createCommonjsModule(function (module) {



	var d = (module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if (arguments.length < 2 || typeof dscr !== "string") {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (is$4(dscr)) {
			c = contains$1.call(dscr, "c");
			e = contains$1.call(dscr, "e");
			w = contains$1.call(dscr, "w");
		} else {
			c = w = true;
			e = false;
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOptions(options), desc);
	});

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== "string") {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (!is$4(get)) {
			get = undefined;
		} else if (!is(get)) {
			options = get;
			get = set = undefined;
		} else if (!is$4(set)) {
			set = undefined;
		} else if (!is(set)) {
			options = set;
			set = undefined;
		}
		if (is$4(dscr)) {
			c = contains$1.call(dscr, "c");
			e = contains$1.call(dscr, "e");
		} else {
			c = true;
			e = false;
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOptions(options), desc);
	};
	});

	var validCallable = function (fn) {
		if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
		return fn;
	};

	var eventEmitter = createCommonjsModule(function (module, exports) {

	var apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		validCallable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		validCallable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		validCallable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d_1(on),
		once: d_1(once),
		off: d_1(off),
		emit: d_1(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;
	});
	eventEmitter.methods;

	var core = createCommonjsModule(function (module, exports) {

	  /**
	   * Core Utilities and Helpers
	   * @module Core
	   */
	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
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
	  exports.requestAnimationFrame = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined;
	  var _URL;
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
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = (d + Math.random() * 16) % 16 | 0;
	      d = Math.floor(d / 16);
	      return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
	    });
	    return uuid;
	  }
	  /**
	   * Gets the height of a document
	   * @returns {number} height
	   * @memberof Core
	   */
	  function documentHeight() {
	    return Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
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
	      var f = parseFloat(n);
	      return !isNaN(f) && n.indexOf('.') > -1 && Math.floor(f) !== f;
	    }
	    return false;
	  }
	  /**
	   * Get a prefixed css property
	   * @memberof Core
	   */
	  function prefixed(unprefixed) {
	    var vendors = ['Webkit', 'webkit', 'Moz', 'O', 'ms'];
	    var prefixes = ['-webkit-', '-webkit-', '-moz-', '-o-', '-ms-'];
	    var lower = unprefixed.toLowerCase();
	    var length = vendors.length;
	    if (typeof document === 'undefined' || lower in document.body.style) {
	      return unprefixed;
	    }
	    for (var i = 0; i < length; i++) {
	      var prop = prefixes[i] + lower;
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
	  function defaults(obj) {
	    var sources = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	      sources[_i - 1] = arguments[_i];
	    }
	    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
	      var source = sources_1[_a];
	      for (var prop in source) {
	        var key = prop;
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
	  function extend(target) {
	    var sources = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	      sources[_i - 1] = arguments[_i];
	    }
	    sources.forEach(function (source) {
	      if (!source) return;
	      Object.getOwnPropertyNames(source).forEach(function (propName) {
	        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
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
	    var location = locationOf(item, array, compareFunction);
	    array.splice(location, 0, item);
	    return location;
	  }
	  /**
	   * Finds where something would fit into a sorted array
	   * @memberof Core
	   */
	  function locationOf(item, array, compareFunction, _start, _end) {
	    var start = _start !== null && _start !== void 0 ? _start : 0;
	    var end = _end !== null && _end !== void 0 ? _end : array.length;
	    var pivot = Math.floor(start + (end - start) / 2);
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
	    var compared = compareFunction(array[pivot], item);
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
	    var start = _start !== null && _start !== void 0 ? _start : 0;
	    var end = _end !== null && _end !== void 0 ? _end : array.length;
	    var pivot = Math.floor(start + (end - start) / 2);
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
	    var compared = compareFunction(array[pivot], item);
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
	    var style = window.getComputedStyle(el);
	    var widthProps = ['width', 'paddingRight', 'paddingLeft', 'marginRight', 'marginLeft', 'borderRightWidth', 'borderLeftWidth'];
	    var heightProps = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'borderTopWidth', 'borderBottomWidth'];
	    var width = 0;
	    var height = 0;
	    widthProps.forEach(function (prop) {
	      width += parseFloat(style[prop]) || 0;
	    });
	    heightProps.forEach(function (prop) {
	      height += parseFloat(style[prop]) || 0;
	    });
	    return {
	      height: height,
	      width: width
	    };
	  }
	  /**
	   * Find the bounds of an element
	   * taking padding, margin and borders into account
	   * @memberof Core
	   */
	  function borders(el) {
	    var style = window.getComputedStyle(el);
	    var widthProps = ['paddingRight', 'paddingLeft', 'marginRight', 'marginLeft', 'borderRightWidth', 'borderLeftWidth'];
	    var heightProps = ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'borderTopWidth', 'borderBottomWidth'];
	    var width = 0;
	    var height = 0;
	    widthProps.forEach(function (prop) {
	      width += parseFloat(style[prop]) || 0;
	    });
	    heightProps.forEach(function (prop) {
	      height += parseFloat(style[prop]) || 0;
	    });
	    return {
	      height: height,
	      width: width
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
	      var doc = node.ownerDocument;
	      if (!doc) throw new Error('Text node does not have an ownerDocument');
	      var range = doc.createRange();
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
	    var width = window.innerWidth;
	    var height = window.innerHeight;
	    return {
	      top: 0,
	      left: 0,
	      right: width,
	      bottom: height,
	      width: width,
	      height: height
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
	    return new Blob([content], {
	      type: mime
	    });
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
	    var blob = createBlob(content, mime);
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
	    var data = btoa(content);
	    var datauri = 'data:' + mime + ';base64,' + data;
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
	    var elements;
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
	    var q, filtered;
	    if (typeof el.querySelector != 'undefined') {
	      sel += '[';
	      for (var prop in props) {
	        sel += prop + "~='" + props[prop] + "'";
	      }
	      sel += ']';
	      return el.querySelector(sel);
	    } else {
	      q = el.getElementsByTagName(sel);
	      filtered = Array.prototype.slice.call(q, 0).filter(function (el) {
	        for (var prop in props) {
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
	    var doc = root.ownerDocument || root;
	    if (doc && 'createTreeWalker' in doc && typeof doc.createTreeWalker !== 'undefined') {
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
	    var treeWalker = document.createTreeWalker(root, filter, null);
	    var node;
	    while (node = treeWalker.nextNode()) {
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
	    var child = node.firstChild;
	    while (child) {
	      var walked = walk(child, callback);
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
	      var reader = new FileReader();
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
	    return html.querySelector("".concat(element, "[*|type=\"").concat(type, "\"]"));
	  }
	  /**
	   * Find direct descendents of an element
	  
	   * @memberof Core
	   */
	  function findChildren(el) {
	    var result = [];
	    var childNodes = el.childNodes;
	    for (var i = 0; i < childNodes.length; i++) {
	      var node = childNodes[i];
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
	    var nodes = [];
	    var current = node;
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
	    var result = [];
	    var childNodes = el.childNodes;
	    for (var i = 0; i < childNodes.length; i++) {
	      var node = childNodes[i];
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
	    var result = [];
	    if (node === null || tagname === '') return result;
	    var parent = node.parentNode;
	    while (parent && parent.nodeType === Node.ELEMENT_NODE) {
	      var el = parent;
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
	  var defer = /** @class */function () {
	    function defer() {
	      var _this = this;
	      this.id = uuid();
	      this.promise = new Promise(function (resolve, reject) {
	        _this.resolve = resolve;
	        _this.reject = reject;
	      });
	      // Removed Object.freeze(this) to allow resolve/reject to work as expected
	    }
	    return defer;
	  }();
	  exports.defer = defer;
	});
	var core$1 = unwrapExports(core);
	var core_1 = core.defer;
	var core_2 = core.requestAnimationFrame;
	var core_3 = core.uuid;
	var core_4 = core.documentHeight;
	var core_5 = core.isElement;
	var core_6 = core.isNumber;
	var core_7 = core.isFloat;
	var core_8 = core.prefixed;
	var core_9 = core.defaults;
	var core_10 = core.extend;
	var core_11 = core.insert;
	var core_12 = core.locationOf;
	var core_13 = core.indexOfSorted;
	var core_14 = core.bounds;
	var core_15 = core.borders;
	var core_16 = core.nodeBounds;
	var core_17 = core.windowBounds;
	var core_18 = core.isXml;
	var core_19 = core.createBlob;
	var core_20 = core.createBlobUrl;
	var core_21 = core.revokeBlobUrl;
	var core_22 = core.createBase64Url;
	var core_23 = core.type;
	var core_24 = core.parse;
	var core_25 = core.qs;
	var core_26 = core.qsa;
	var core_27 = core.qsp;
	var core_28 = core.sprint;
	var core_29 = core.treeWalker;
	var core_30 = core.walk;
	var core_31 = core.blob2base64;
	var core_32 = core.querySelectorByType;
	var core_33 = core.findChildren;
	var core_34 = core.parents;
	var core_35 = core.filterChildren;
	var core_36 = core.getParentByTagName;

	var utils = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': core$1,
		__moduleExports: core,
		defer: core_1,
		requestAnimationFrame: core_2,
		uuid: core_3,
		documentHeight: core_4,
		isElement: core_5,
		isNumber: core_6,
		isFloat: core_7,
		prefixed: core_8,
		defaults: core_9,
		extend: core_10,
		insert: core_11,
		locationOf: core_12,
		indexOfSorted: core_13,
		bounds: core_14,
		borders: core_15,
		nodeBounds: core_16,
		windowBounds: core_17,
		isXml: core_18,
		createBlob: core_19,
		createBlobUrl: core_20,
		revokeBlobUrl: core_21,
		createBase64Url: core_22,
		type: core_23,
		parse: core_24,
		qs: core_25,
		qsa: core_26,
		qsp: core_27,
		sprint: core_28,
		treeWalker: core_29,
		walk: core_30,
		blob2base64: core_31,
		querySelectorByType: core_32,
		findChildren: core_33,
		parents: core_34,
		filterChildren: core_35,
		getParentByTagName: core_36
	});

	if (!process$1) {
	  var process$1 = {
	    "cwd" : function () { return '/' }
	  };
	}

	function assertPath(path) {
	  if (typeof path !== 'string') {
	    throw new TypeError('Path must be a string. Received ' + path);
	  }
	}

	// Resolves . and .. elements in a path with directory names
	function normalizeStringPosix(path, allowAboveRoot) {
	  var res = '';
	  var lastSlash = -1;
	  var dots = 0;
	  var code;
	  for (var i = 0; i <= path.length; ++i) {
	    if (i < path.length)
	      code = path.charCodeAt(i);
	    else if (code === 47/*/*/)
	      break;
	    else
	      code = 47/*/*/;
	    if (code === 47/*/*/) {
	      if (lastSlash === i - 1 || dots === 1) ; else if (lastSlash !== i - 1 && dots === 2) {
	        if (res.length < 2 ||
	            res.charCodeAt(res.length - 1) !== 46/*.*/ ||
	            res.charCodeAt(res.length - 2) !== 46/*.*/) {
	          if (res.length > 2) {
	            var start = res.length - 1;
	            var j = start;
	            for (; j >= 0; --j) {
	              if (res.charCodeAt(j) === 47/*/*/)
	                break;
	            }
	            if (j !== start) {
	              if (j === -1)
	                res = '';
	              else
	                res = res.slice(0, j);
	              lastSlash = i;
	              dots = 0;
	              continue;
	            }
	          } else if (res.length === 2 || res.length === 1) {
	            res = '';
	            lastSlash = i;
	            dots = 0;
	            continue;
	          }
	        }
	        if (allowAboveRoot) {
	          if (res.length > 0)
	            res += '/..';
	          else
	            res = '..';
	        }
	      } else {
	        if (res.length > 0)
	          res += '/' + path.slice(lastSlash + 1, i);
	        else
	          res = path.slice(lastSlash + 1, i);
	      }
	      lastSlash = i;
	      dots = 0;
	    } else if (code === 46/*.*/ && dots !== -1) {
	      ++dots;
	    } else {
	      dots = -1;
	    }
	  }
	  return res;
	}

	function _format(sep, pathObject) {
	  var dir = pathObject.dir || pathObject.root;
	  var base = pathObject.base ||
	    ((pathObject.name || '') + (pathObject.ext || ''));
	  if (!dir) {
	    return base;
	  }
	  if (dir === pathObject.root) {
	    return dir + base;
	  }
	  return dir + sep + base;
	}

	var posix = {
	  // path.resolve([from ...], to)
	  resolve: function resolve() {
	    var resolvedPath = '';
	    var resolvedAbsolute = false;
	    var cwd;

	    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	      var path;
	      if (i >= 0)
	        path = arguments[i];
	      else {
	        if (cwd === undefined)
	          cwd = process$1.cwd();
	        path = cwd;
	      }

	      assertPath(path);

	      // Skip empty entries
	      if (path.length === 0) {
	        continue;
	      }

	      resolvedPath = path + '/' + resolvedPath;
	      resolvedAbsolute = path.charCodeAt(0) === 47/*/*/;
	    }

	    // At this point the path should be resolved to a full absolute path, but
	    // handle relative paths to be safe (might happen when process.cwd() fails)

	    // Normalize the path
	    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

	    if (resolvedAbsolute) {
	      if (resolvedPath.length > 0)
	        return '/' + resolvedPath;
	      else
	        return '/';
	    } else if (resolvedPath.length > 0) {
	      return resolvedPath;
	    } else {
	      return '.';
	    }
	  },


	  normalize: function normalize(path) {
	    assertPath(path);

	    if (path.length === 0)
	      return '.';

	    var isAbsolute = path.charCodeAt(0) === 47/*/*/;
	    var trailingSeparator = path.charCodeAt(path.length - 1) === 47/*/*/;

	    // Normalize the path
	    path = normalizeStringPosix(path, !isAbsolute);

	    if (path.length === 0 && !isAbsolute)
	      path = '.';
	    if (path.length > 0 && trailingSeparator)
	      path += '/';

	    if (isAbsolute)
	      return '/' + path;
	    return path;
	  },


	  isAbsolute: function isAbsolute(path) {
	    assertPath(path);
	    return path.length > 0 && path.charCodeAt(0) === 47/*/*/;
	  },


	  join: function join() {
	    if (arguments.length === 0)
	      return '.';
	    var joined;
	    for (var i = 0; i < arguments.length; ++i) {
	      var arg = arguments[i];
	      assertPath(arg);
	      if (arg.length > 0) {
	        if (joined === undefined)
	          joined = arg;
	        else
	          joined += '/' + arg;
	      }
	    }
	    if (joined === undefined)
	      return '.';
	    return posix.normalize(joined);
	  },


	  relative: function relative(from, to) {
	    assertPath(from);
	    assertPath(to);

	    if (from === to)
	      return '';

	    from = posix.resolve(from);
	    to = posix.resolve(to);

	    if (from === to)
	      return '';

	    // Trim any leading backslashes
	    var fromStart = 1;
	    for (; fromStart < from.length; ++fromStart) {
	      if (from.charCodeAt(fromStart) !== 47/*/*/)
	        break;
	    }
	    var fromEnd = from.length;
	    var fromLen = (fromEnd - fromStart);

	    // Trim any leading backslashes
	    var toStart = 1;
	    for (; toStart < to.length; ++toStart) {
	      if (to.charCodeAt(toStart) !== 47/*/*/)
	        break;
	    }
	    var toEnd = to.length;
	    var toLen = (toEnd - toStart);

	    // Compare paths to find the longest common path from root
	    var length = (fromLen < toLen ? fromLen : toLen);
	    var lastCommonSep = -1;
	    var i = 0;
	    for (; i <= length; ++i) {
	      if (i === length) {
	        if (toLen > length) {
	          if (to.charCodeAt(toStart + i) === 47/*/*/) {
	            // We get here if `from` is the exact base path for `to`.
	            // For example: from='/foo/bar'; to='/foo/bar/baz'
	            return to.slice(toStart + i + 1);
	          } else if (i === 0) {
	            // We get here if `from` is the root
	            // For example: from='/'; to='/foo'
	            return to.slice(toStart + i);
	          }
	        } else if (fromLen > length) {
	          if (from.charCodeAt(fromStart + i) === 47/*/*/) {
	            // We get here if `to` is the exact base path for `from`.
	            // For example: from='/foo/bar/baz'; to='/foo/bar'
	            lastCommonSep = i;
	          } else if (i === 0) {
	            // We get here if `to` is the root.
	            // For example: from='/foo'; to='/'
	            lastCommonSep = 0;
	          }
	        }
	        break;
	      }
	      var fromCode = from.charCodeAt(fromStart + i);
	      var toCode = to.charCodeAt(toStart + i);
	      if (fromCode !== toCode)
	        break;
	      else if (fromCode === 47/*/*/)
	        lastCommonSep = i;
	    }

	    var out = '';
	    // Generate the relative path based on the path difference between `to`
	    // and `from`
	    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
	      if (i === fromEnd || from.charCodeAt(i) === 47/*/*/) {
	        if (out.length === 0)
	          out += '..';
	        else
	          out += '/..';
	      }
	    }

	    // Lastly, append the rest of the destination (`to`) path that comes after
	    // the common path parts
	    if (out.length > 0)
	      return out + to.slice(toStart + lastCommonSep);
	    else {
	      toStart += lastCommonSep;
	      if (to.charCodeAt(toStart) === 47/*/*/)
	        ++toStart;
	      return to.slice(toStart);
	    }
	  },


	  _makeLong: function _makeLong(path) {
	    return path;
	  },


	  dirname: function dirname(path) {
	    assertPath(path);
	    if (path.length === 0)
	      return '.';
	    var code = path.charCodeAt(0);
	    var hasRoot = (code === 47/*/*/);
	    var end = -1;
	    var matchedSlash = true;
	    for (var i = path.length - 1; i >= 1; --i) {
	      code = path.charCodeAt(i);
	      if (code === 47/*/*/) {
	        if (!matchedSlash) {
	          end = i;
	          break;
	        }
	      } else {
	        // We saw the first non-path separator
	        matchedSlash = false;
	      }
	    }

	    if (end === -1)
	      return hasRoot ? '/' : '.';
	    if (hasRoot && end === 1)
	      return '//';
	    return path.slice(0, end);
	  },


	  basename: function basename(path, ext) {
	    if (ext !== undefined && typeof ext !== 'string')
	      throw new TypeError('"ext" argument must be a string');
	    assertPath(path);

	    var start = 0;
	    var end = -1;
	    var matchedSlash = true;
	    var i;

	    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
	      if (ext.length === path.length && ext === path)
	        return '';
	      var extIdx = ext.length - 1;
	      var firstNonSlashEnd = -1;
	      for (i = path.length - 1; i >= 0; --i) {
	        var code = path.charCodeAt(i);
	        if (code === 47/*/*/) {
	          // If we reached a path separator that was not part of a set of path
	          // separators at the end of the string, stop now
	          if (!matchedSlash) {
	            start = i + 1;
	            break;
	          }
	        } else {
	          if (firstNonSlashEnd === -1) {
	            // We saw the first non-path separator, remember this index in case
	            // we need it if the extension ends up not matching
	            matchedSlash = false;
	            firstNonSlashEnd = i + 1;
	          }
	          if (extIdx >= 0) {
	            // Try to match the explicit extension
	            if (code === ext.charCodeAt(extIdx)) {
	              if (--extIdx === -1) {
	                // We matched the extension, so mark this as the end of our path
	                // component
	                end = i;
	              }
	            } else {
	              // Extension does not match, so our result is the entire path
	              // component
	              extIdx = -1;
	              end = firstNonSlashEnd;
	            }
	          }
	        }
	      }

	      if (start === end)
	        end = firstNonSlashEnd;
	      else if (end === -1)
	        end = path.length;
	      return path.slice(start, end);
	    } else {
	      for (i = path.length - 1; i >= 0; --i) {
	        if (path.charCodeAt(i) === 47/*/*/) {
	          // If we reached a path separator that was not part of a set of path
	          // separators at the end of the string, stop now
	          if (!matchedSlash) {
	            start = i + 1;
	            break;
	          }
	        } else if (end === -1) {
	          // We saw the first non-path separator, mark this as the end of our
	          // path component
	          matchedSlash = false;
	          end = i + 1;
	        }
	      }

	      if (end === -1)
	        return '';
	      return path.slice(start, end);
	    }
	  },


	  extname: function extname(path) {
	    assertPath(path);
	    var startDot = -1;
	    var startPart = 0;
	    var end = -1;
	    var matchedSlash = true;
	    // Track the state of characters (if any) we see before our first dot and
	    // after any path separator we find
	    var preDotState = 0;
	    for (var i = path.length - 1; i >= 0; --i) {
	      var code = path.charCodeAt(i);
	      if (code === 47/*/*/) {
	        // If we reached a path separator that was not part of a set of path
	        // separators at the end of the string, stop now
	        if (!matchedSlash) {
	          startPart = i + 1;
	          break;
	        }
	        continue;
	      }
	      if (end === -1) {
	        // We saw the first non-path separator, mark this as the end of our
	        // extension
	        matchedSlash = false;
	        end = i + 1;
	      }
	      if (code === 46/*.*/) {
	        // If this is our first dot, mark it as the start of our extension
	        if (startDot === -1)
	          startDot = i;
	        else if (preDotState !== 1)
	          preDotState = 1;
	      } else if (startDot !== -1) {
	        // We saw a non-dot and non-path separator before our dot, so we should
	        // have a good chance at having a non-empty extension
	        preDotState = -1;
	      }
	    }

	    if (startDot === -1 ||
	        end === -1 ||
	        // We saw a non-dot character immediately before the dot
	        preDotState === 0 ||
	        // The (right-most) trimmed path component is exactly '..'
	        (preDotState === 1 &&
	         startDot === end - 1 &&
	         startDot === startPart + 1)) {
	      return '';
	    }
	    return path.slice(startDot, end);
	  },


	  format: function format(pathObject) {
	    if (pathObject === null || typeof pathObject !== 'object') {
	      throw new TypeError(
	        'Parameter "pathObject" must be an object, not ' + typeof(pathObject)
	      );
	    }
	    return _format('/', pathObject);
	  },


	  parse: function parse(path) {
	    assertPath(path);

	    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
	    if (path.length === 0)
	      return ret;
	    var code = path.charCodeAt(0);
	    var isAbsolute = (code === 47/*/*/);
	    var start;
	    if (isAbsolute) {
	      ret.root = '/';
	      start = 1;
	    } else {
	      start = 0;
	    }
	    var startDot = -1;
	    var startPart = 0;
	    var end = -1;
	    var matchedSlash = true;
	    var i = path.length - 1;

	    // Track the state of characters (if any) we see before our first dot and
	    // after any path separator we find
	    var preDotState = 0;

	    // Get non-dir info
	    for (; i >= start; --i) {
	      code = path.charCodeAt(i);
	      if (code === 47/*/*/) {
	        // If we reached a path separator that was not part of a set of path
	        // separators at the end of the string, stop now
	        if (!matchedSlash) {
	          startPart = i + 1;
	          break;
	        }
	        continue;
	      }
	      if (end === -1) {
	        // We saw the first non-path separator, mark this as the end of our
	        // extension
	        matchedSlash = false;
	        end = i + 1;
	      }
	      if (code === 46/*.*/) {
	        // If this is our first dot, mark it as the start of our extension
	        if (startDot === -1)
	          startDot = i;
	        else if (preDotState !== 1)
	          preDotState = 1;
	      } else if (startDot !== -1) {
	        // We saw a non-dot and non-path separator before our dot, so we should
	        // have a good chance at having a non-empty extension
	        preDotState = -1;
	      }
	    }

	    if (startDot === -1 ||
	        end === -1 ||
	        // We saw a non-dot character immediately before the dot
	        preDotState === 0 ||
	        // The (right-most) trimmed path component is exactly '..'
	        (preDotState === 1 &&
	         startDot === end - 1 &&
	         startDot === startPart + 1)) {
	      if (end !== -1) {
	        if (startPart === 0 && isAbsolute)
	          ret.base = ret.name = path.slice(1, end);
	        else
	          ret.base = ret.name = path.slice(startPart, end);
	      }
	    } else {
	      if (startPart === 0 && isAbsolute) {
	        ret.name = path.slice(1, startDot);
	        ret.base = path.slice(1, end);
	      } else {
	        ret.name = path.slice(startPart, startDot);
	        ret.base = path.slice(startPart, end);
	      }
	      ret.ext = path.slice(startDot, end);
	    }

	    if (startPart > 0)
	      ret.dir = path.slice(0, startPart - 1);
	    else if (isAbsolute)
	      ret.dir = '/';

	    return ret;
	  },


	  sep: '/',
	  delimiter: ':',
	  posix: null
	};


	var path$1 = posix;

	var path = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  /**
	   * Creates a Path object for parsing and manipulation of a path strings
	   *
	   * Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
	   * @param	pathString	a url string (relative or absolute)
	   * @class
	   */
	  var Path = /** @class */function () {
	    function Path(pathString) {
	      var normalized;
	      var parsed;
	      if (pathString.indexOf('://') > -1) {
	        // Always use the pathname for URLs (strips protocol/host)
	        var urlObj = new URL(pathString);
	        normalized = urlObj.pathname.replace(/\\/g, '/').replace(/\/+/g, '/');
	        parsed = this.parse(normalized);
	        this._path = normalized;
	        // Directory: strip filename from pathname, ensure trailing slash
	        var dir = normalized.replace(/[^/]*$/, '');
	        if (!dir.endsWith('/')) dir += '/';
	        this._directory = dir;
	      } else {
	        normalized = pathString.replace(/\\/g, '/').replace(/\/+/g, '/');
	        parsed = this.parse(normalized);
	        this._path = normalized;
	        this._directory = this.isDirectory(normalized) ? normalized : parsed.dir + '/';
	        if (!this._directory.endsWith('/')) this._directory += '/';
	      }
	      this._filename = parsed.base;
	      this._extension = parsed.ext.slice(1);
	    }
	    Object.defineProperty(Path.prototype, "directory", {
	      get: function () {
	        return this._directory;
	      },
	      enumerable: false,
	      configurable: true
	    });
	    Object.defineProperty(Path.prototype, "path", {
	      get: function () {
	        return this._path;
	      },
	      enumerable: false,
	      configurable: true
	    });
	    Object.defineProperty(Path.prototype, "filename", {
	      get: function () {
	        return this._filename;
	      },
	      enumerable: false,
	      configurable: true
	    });
	    Object.defineProperty(Path.prototype, "extension", {
	      get: function () {
	        return this._extension;
	      },
	      enumerable: false,
	      configurable: true
	    });
	    /**
	     * Parse the path: https://nodejs.org/api/path.html#path_path_parse_path
	     * Mimics Node.js path.parse for POSIX paths.
	     */
	    Path.prototype.parse = function (what) {
	      var re = /^(.*[\\/])?([^\\/]+?)(\.[^.]*)?$/;
	      var match = re.exec(what) || [];
	      var dir = match[1] ? match[1].replace(/[\\/]+$/, '') : '';
	      var base = match[2] ? match[2] + (match[3] || '') : '';
	      var ext = match[3] || '';
	      var name = match[2] || '';
	      return {
	        dir: dir,
	        base: base,
	        ext: ext,
	        name: name
	      };
	    };
	    /**
	     * @param	{string} what
	     * @returns {boolean}
	     */
	    Path.prototype.isAbsolute = function (what) {
	      return path$1.default.isAbsolute(what || this.path);
	    };
	    /**
	     * Check if path ends with a directory
	     * @param	{string} what
	     * @returns {boolean}
	     */
	    Path.prototype.isDirectory = function (what) {
	      return what.charAt(what.length - 1) === '/';
	    };
	    /**
	     * Resolve a path against the directory of the Path.
	     * Joins this.directory and what, normalizing slashes.
	     * https://nodejs.org/api/path.html#path_path_resolve_paths
	     * @param	{string} what
	     * @returns {string} resolved
	        */
	    Path.prototype.resolve = function (what) {
	      var base = this.directory;
	      if (!base.endsWith('/')) base += '/';
	      var result = base + what;
	      result = result.replace(/\/+/g, '/').replace(/\/\.\//g, '/');
	      // Check for absolute path
	      if (typeof what === 'string' && (what.startsWith('/') || what.indexOf('://') > -1)) {
	        throw new Error('[Path.resolve] Cannot resolve an absolute path: ' + what);
	      }
	      // Remove '..' segments
	      var parts = result.split('/');
	      var stack = [];
	      for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
	        var part = parts_1[_i];
	        if (part === '..') {
	          stack.pop();
	        } else if (part !== '') {
	          stack.push(part);
	        }
	      }
	      return '/' + stack.join('/');
	    };
	    /**
	     * Resolve a path relative to the directory of the Path
	     *
	     * https://nodejs.org/api/path.html#path_path_relative_from_to
	     * @param	{string} what
	     * @returns {string} relative
	     */
	    Path.prototype.relative = function (what) {
	      var isAbsolute = what && what.indexOf('://') > -1;
	      if (isAbsolute) {
	        return what;
	      }
	      // Remove leading slashes for both paths
	      var from = this.directory.replace(/^\/+/, '');
	      var to = what.replace(/^\/+/, '');
	      var fromParts = from.split('/').filter(Boolean);
	      var toParts = to.split('/').filter(Boolean);
	      // Find common prefix
	      var i = 0;
	      while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
	        i++;
	      }
	      // Go up for the remaining fromParts, then down for the remaining toParts
	      var up = fromParts.length - i;
	      var down = toParts.slice(i);
	      return (up ? '../'.repeat(up) : '') + down.join('/');
	    };
	    Path.prototype.toString = function () {
	      return this.path;
	    };
	    return Path;
	  }();
	  exports.default = Path;
	});
	var Path = unwrapExports(path);

	var url = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  /**
	   * creates a Url object for parsing and manipulation of a url string
	   * @param	{string} urlString	a url string (relative or absolute)
	   * @param	{string} [baseString] optional base for the url,
	   * default to window.location.href
	   */
	  var Url = /** @class */function () {
	    function Url(urlString, baseString) {
	      var absolute = urlString.indexOf('://') > -1;
	      var pathname = urlString;
	      var basePath;
	      this.Url = undefined;
	      this.href = urlString;
	      this.protocol = '';
	      this.origin = '';
	      this.hash = '';
	      this.hash = '';
	      this.search = '';
	      this.base = baseString;
	      if (!absolute && baseString !== undefined && typeof baseString !== 'string' && window && window.location) {
	        this.base = window.location.href;
	      }
	      // URL Polyfill doesn't throw an error if base is empty
	      if (absolute || this.base) {
	        try {
	          if (this.base) {
	            // Safari doesn't like an undefined base
	            this.Url = new URL(urlString, this.base);
	          } else {
	            this.Url = new URL(urlString);
	          }
	          this.href = this.Url.href;
	          this.protocol = this.Url.protocol;
	          this.origin = this.Url.origin;
	          this.hash = this.Url.hash;
	          this.search = this.Url.search;
	          pathname = this.Url.pathname + (this.Url.search ? this.Url.search : '');
	        } catch (_a) {
	          // Skip URL parsing
	          this.Url = undefined;
	          // resolve the pathname from the base
	          if (this.base) {
	            basePath = new path.default(this.base);
	            pathname = basePath.resolve(pathname);
	          }
	        }
	      }
	      this.Path = new path.default(pathname);
	      this.directory = this.Path.directory;
	      this.filename = this.Path.filename;
	      this.extension = this.Path.extension;
	    }
	    Url.prototype.path = function () {
	      return this.Path;
	    };
	    /**
	     * Resolves a relative path to a absolute url
	     */
	    Url.prototype.resolve = function (what) {
	      // If what is an absolute path, join directly to origin
	      if (what.startsWith('/')) {
	        return this.origin + what;
	      }
	      // If what is a full URL, return as is
	      if (what.indexOf('://') > -1) {
	        return what;
	      }
	      var fullpath = this.Path.resolve(what);
	      return this.origin + fullpath;
	    };
	    /**
	     * Resolve a path relative to the url
	     */
	    Url.prototype.relative = function (what) {
	      return this.Path.relative(what);
	    };
	    Url.prototype.toString = function () {
	      return this.href;
	    };
	    return Url;
	  }();
	  exports.default = Url;
	});
	var Url = unwrapExports(url);

	const ELEMENT_NODE$2 = 1;
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
	  * @class
	  @param {string | Range | Node } [cfiFrom]
	  @param {string | object} [base]
	  @param {string} [ignoreClass] class to ignore when parsing DOM
	*/
	class EpubCFI {
	  constructor(cfiFrom, base, ignoreClass) {
	    var type;
	    this.str = '';
	    this.base = {};
	    this.spinePos = 0; // For compatibility

	    this.range = false; // true || false;

	    this.path = {};
	    this.start = null;
	    this.end = null;

	    // Allow instantiation without the "new" keyword
	    if (!(this instanceof EpubCFI)) {
	      return new EpubCFI(cfiFrom, base, ignoreClass);
	    }
	    if (typeof base === 'string') {
	      this.base = this.parseComponent(base);
	    } else if (typeof base === 'object' && base.steps) {
	      this.base = base;
	    }
	    type = this.checkType(cfiFrom);
	    if (type === 'string') {
	      this.str = cfiFrom;
	      return core_10(this, this.parse(cfiFrom));
	    } else if (type === 'range') {
	      return core_10(this, this.fromRange(cfiFrom, this.base, ignoreClass));
	    } else if (type === 'node') {
	      return core_10(this, this.fromNode(cfiFrom, this.base, ignoreClass));
	    } else if (type === 'EpubCFI' && cfiFrom.path) {
	      return cfiFrom;
	    } else if (!cfiFrom) {
	      return this;
	    } else {
	      throw new TypeError('not a valid argument for EpubCFI');
	    }
	  }

	  /**
	   * Check the type of constructor input
	   * @private
	   */
	  checkType(cfi) {
	    if (this.isCfiString(cfi)) {
	      return 'string';
	      // Is a range object
	    } else if (cfi && typeof cfi === 'object' && (core_23(cfi) === 'Range' || typeof cfi.startContainer != 'undefined')) {
	      return 'range';
	    } else if (cfi && typeof cfi === 'object' && typeof cfi.nodeType != 'undefined') {
	      // || typeof cfi === "function"
	      return 'node';
	    } else if (cfi && typeof cfi === 'object' && cfi instanceof EpubCFI) {
	      return 'EpubCFI';
	    } else {
	      return false;
	    }
	  }

	  /**
	   * Parse a cfi string to a CFI object representation
	   * @param {string} cfiStr
	   * @returns {object} cfi
	   */
	  parse(cfiStr) {
	    var cfi = {
	      spinePos: -1,
	      range: false,
	      base: {},
	      path: {},
	      start: null,
	      end: null
	    };
	    var baseComponent, pathComponent, range;
	    if (typeof cfiStr !== 'string') {
	      return {
	        spinePos: -1
	      };
	    }
	    if (cfiStr.indexOf('epubcfi(') === 0 && cfiStr[cfiStr.length - 1] === ')') {
	      // Remove initial epubcfi( and ending )
	      cfiStr = cfiStr.slice(8, cfiStr.length - 1);
	    }
	    baseComponent = this.getChapterComponent(cfiStr);

	    // Make sure this is a valid cfi or return
	    if (!baseComponent) {
	      return {
	        spinePos: -1
	      };
	    }
	    cfi.base = this.parseComponent(baseComponent);
	    pathComponent = this.getPathComponent(cfiStr);
	    cfi.path = this.parseComponent(pathComponent);
	    range = this.getRange(cfiStr);
	    if (range) {
	      cfi.range = true;
	      cfi.start = this.parseComponent(range[0]);
	      cfi.end = this.parseComponent(range[1]);
	    }

	    // Get spine node position
	    // cfi.spineSegment = cfi.base.steps[1];

	    // Chapter segment is always the second step
	    cfi.spinePos = cfi.base.steps[1].index;
	    return cfi;
	  }
	  parseComponent(componentStr) {
	    var component = {
	      steps: [],
	      terminal: {
	        offset: null,
	        assertion: null
	      }
	    };
	    var parts = componentStr.split(':');
	    var steps = parts[0].split('/');
	    var terminal;
	    if (parts.length > 1) {
	      terminal = parts[1];
	      component.terminal = this.parseTerminal(terminal);
	    }
	    if (steps[0] === '') {
	      steps.shift(); // Ignore the first slash
	    }
	    component.steps = steps.map(function (step) {
	      return this.parseStep(step);
	    }.bind(this));
	    return component;
	  }
	  parseStep(stepStr) {
	    var type, num, index, has_brackets, id;
	    has_brackets = stepStr.match(/\[(.*)\]/);
	    if (has_brackets && has_brackets[1]) {
	      id = has_brackets[1];
	    }

	    //-- Check if step is a text node or element
	    num = parseInt(stepStr);
	    if (isNaN(num)) {
	      return;
	    }
	    if (num % 2 === 0) {
	      // Even = is an element
	      type = 'element';
	      index = num / 2 - 1;
	    } else {
	      type = 'text';
	      index = (num - 1) / 2;
	    }
	    return {
	      type: type,
	      index: index,
	      id: id || null
	    };
	  }
	  parseTerminal(termialStr) {
	    var characterOffset, textLocationAssertion;
	    var assertion = termialStr.match(/\[(.*)\]/);
	    if (assertion && assertion[1]) {
	      characterOffset = parseInt(termialStr.split('[')[0]);
	      textLocationAssertion = assertion[1];
	    } else {
	      characterOffset = parseInt(termialStr);
	    }
	    if (!core_6(characterOffset)) {
	      characterOffset = null;
	    }
	    return {
	      offset: characterOffset,
	      assertion: textLocationAssertion
	    };
	  }
	  getChapterComponent(cfiStr) {
	    var indirection = cfiStr.split('!');
	    return indirection[0];
	  }
	  getPathComponent(cfiStr) {
	    var indirection = cfiStr.split('!');
	    if (indirection[1]) {
	      let ranges = indirection[1].split(',');
	      return ranges[0];
	    }
	  }
	  getRange(cfiStr) {
	    var ranges = cfiStr.split(',');
	    if (ranges.length === 3) {
	      return [ranges[1], ranges[2]];
	    }
	    return false;
	  }
	  getCharecterOffsetComponent(cfiStr) {
	    var splitStr = cfiStr.split(':');
	    return splitStr[1] || '';
	  }
	  joinSteps(steps) {
	    if (!steps) {
	      return '';
	    }
	    return steps.map(function (part) {
	      var segment = '';
	      if (part.type === 'element') {
	        segment += (part.index + 1) * 2;
	      }
	      if (part.type === 'text') {
	        segment += 1 + 2 * part.index; // TODO: double check that this is odd
	      }
	      if (part.id) {
	        segment += '[' + part.id + ']';
	      }
	      return segment;
	    }).join('/');
	  }
	  segmentString(segment) {
	    var segmentString = '/';
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
	   * @returns {string} epubcfi
	   */
	  toString() {
	    var cfiString = 'epubcfi(';
	    cfiString += this.segmentString(this.base);
	    cfiString += '!';
	    cfiString += this.segmentString(this.path);

	    // Add Range, if present
	    if (this.range && this.start) {
	      cfiString += ',';
	      cfiString += this.segmentString(this.start);
	    }
	    if (this.range && this.end) {
	      cfiString += ',';
	      cfiString += this.segmentString(this.end);
	    }
	    cfiString += ')';
	    return cfiString;
	  }

	  /**
	   * Compare which of two CFIs is earlier in the text
	   * @returns {number} First is earlier = -1, Second is earlier = 1, They are equal = 0
	   */
	  compare(cfiOne, cfiTwo) {
	    var stepsA, stepsB;
	    var terminalA, terminalB;
	    if (typeof cfiOne === 'string') {
	      cfiOne = new EpubCFI(cfiOne);
	    }
	    if (typeof cfiTwo === 'string') {
	      cfiTwo = new EpubCFI(cfiTwo);
	    }
	    // Compare Spine Positions
	    if (cfiOne.spinePos > cfiTwo.spinePos) {
	      return 1;
	    }
	    if (cfiOne.spinePos < cfiTwo.spinePos) {
	      return -1;
	    }
	    if (cfiOne.range) {
	      stepsA = cfiOne.path.steps.concat(cfiOne.start.steps);
	      terminalA = cfiOne.start.terminal;
	    } else {
	      stepsA = cfiOne.path.steps;
	      terminalA = cfiOne.path.terminal;
	    }
	    if (cfiTwo.range) {
	      stepsB = cfiTwo.path.steps.concat(cfiTwo.start.steps);
	      terminalB = cfiTwo.start.terminal;
	    } else {
	      stepsB = cfiTwo.path.steps;
	      terminalB = cfiTwo.path.terminal;
	    }

	    // Compare Each Step in the First item
	    for (var i = 0; i < stepsA.length; i++) {
	      if (!stepsA[i]) {
	        return -1;
	      }
	      if (!stepsB[i]) {
	        return 1;
	      }
	      if (stepsA[i].index > stepsB[i].index) {
	        return 1;
	      }
	      if (stepsA[i].index < stepsB[i].index) {
	        return -1;
	      }
	      // Otherwise continue checking
	    }

	    // All steps in First equal to Second and First is Less Specific
	    if (stepsA.length < stepsB.length) {
	      return -1;
	    }

	    // Compare the character offset of the text node
	    if (terminalA.offset > terminalB.offset) {
	      return 1;
	    }
	    if (terminalA.offset < terminalB.offset) {
	      return -1;
	    }

	    // CFI's are equal
	    return 0;
	  }
	  step(node) {
	    var nodeType = node.nodeType === TEXT_NODE ? 'text' : 'element';
	    return {
	      id: node.id,
	      tagName: node.tagName,
	      type: nodeType,
	      index: this.position(node)
	    };
	  }
	  filteredStep(node, ignoreClass) {
	    var filteredNode = this.filter(node, ignoreClass);
	    var nodeType;

	    // Node filtered, so ignore
	    if (!filteredNode) {
	      return;
	    }

	    // Otherwise add the filter node in
	    nodeType = filteredNode.nodeType === TEXT_NODE ? 'text' : 'element';
	    return {
	      id: filteredNode.id,
	      tagName: filteredNode.tagName,
	      type: nodeType,
	      index: this.filteredPosition(filteredNode, ignoreClass)
	    };
	  }
	  pathTo(node, offset, ignoreClass) {
	    var segment = {
	      steps: [],
	      terminal: {
	        offset: null,
	        assertion: null
	      }
	    };
	    var currentNode = node;
	    var step;
	    while (currentNode && currentNode.parentNode && currentNode.parentNode.nodeType != DOCUMENT_NODE) {
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
	    if (offset != null && offset >= 0) {
	      segment.terminal.offset = offset;

	      // Make sure we are getting to a textNode if there is an offset
	      if (segment.steps[segment.steps.length - 1].type != 'text') {
	        segment.steps.push({
	          type: 'text',
	          index: 0
	        });
	      }
	    }
	    return segment;
	  }
	  equalStep(stepA, stepB) {
	    if (!stepA || !stepB) {
	      return false;
	    }
	    if (stepA.index === stepB.index && stepA.id === stepB.id && stepA.type === stepB.type) {
	      return true;
	    }
	    return false;
	  }

	  /**
	   * Create a CFI object from a Range
	   * @param {Range} range
	   * @param {string | object} base
	   * @param {string} [ignoreClass]
	   * @returns {object} cfi
	   */
	  fromRange(range, base, ignoreClass) {
	    var cfi = {
	      range: false,
	      base: {},
	      path: {},
	      start: null,
	      end: null
	    };
	    var start = range.startContainer;
	    var end = range.endContainer;
	    var startOffset = range.startOffset;
	    var endOffset = range.endOffset;
	    var needsIgnoring = false;
	    if (ignoreClass) {
	      // Tell pathTo if / what to ignore
	      needsIgnoring = start.ownerDocument.querySelector('.' + ignoreClass) != null;
	    }
	    if (typeof base === 'string') {
	      cfi.base = this.parseComponent(base);
	      cfi.spinePos = cfi.base.steps[1].index;
	    } else if (typeof base === 'object') {
	      cfi.base = base;
	    }
	    if (range.collapsed) {
	      if (needsIgnoring) {
	        startOffset = this.patchOffset(start, startOffset, ignoreClass);
	      }
	      cfi.path = this.pathTo(start, startOffset, ignoreClass);
	    } else {
	      cfi.range = true;
	      if (needsIgnoring) {
	        startOffset = this.patchOffset(start, startOffset, ignoreClass);
	      }
	      cfi.start = this.pathTo(start, startOffset, ignoreClass);
	      if (needsIgnoring) {
	        endOffset = this.patchOffset(end, endOffset, ignoreClass);
	      }
	      cfi.end = this.pathTo(end, endOffset, ignoreClass);

	      // Create a new empty path
	      cfi.path = {
	        steps: [],
	        terminal: null
	      };

	      // Push steps that are shared between start and end to the common path
	      var len = cfi.start.steps.length;
	      var i;
	      for (i = 0; i < len; i++) {
	        if (this.equalStep(cfi.start.steps[i], cfi.end.steps[i])) {
	          if (i === len - 1) {
	            // Last step is equal, check terminals
	            if (cfi.start.terminal === cfi.end.terminal) {
	              // CFI's are equal
	              cfi.path.steps.push(cfi.start.steps[i]);
	              // Not a range
	              cfi.range = false;
	            }
	          } else {
	            cfi.path.steps.push(cfi.start.steps[i]);
	          }
	        } else {
	          break;
	        }
	      }
	      cfi.start.steps = cfi.start.steps.slice(cfi.path.steps.length);
	      cfi.end.steps = cfi.end.steps.slice(cfi.path.steps.length);

	      // TODO: Add Sanity check to make sure that the end if greater than the start
	    }
	    return cfi;
	  }

	  /**
	   * Create a CFI object from a Node
	   * @param {Node} anchor
	   * @param {string | object} base
	   * @param {string} [ignoreClass]
	   * @returns {object} cfi
	   */
	  fromNode(anchor, base, ignoreClass) {
	    var cfi = {
	      range: false,
	      base: {},
	      path: {},
	      start: null,
	      end: null
	    };
	    if (typeof base === 'string') {
	      cfi.base = this.parseComponent(base);
	      cfi.spinePos = cfi.base.steps[1].index;
	    } else if (typeof base === 'object') {
	      cfi.base = base;
	    }
	    cfi.path = this.pathTo(anchor, null, ignoreClass);
	    return cfi;
	  }
	  filter(anchor, ignoreClass) {
	    var needsIgnoring;
	    var sibling; // to join with
	    var parent, previousSibling, nextSibling;
	    var isText = false;
	    if (anchor.nodeType === TEXT_NODE) {
	      isText = true;
	      parent = anchor.parentNode;
	      needsIgnoring = anchor.parentNode.classList.contains(ignoreClass);
	    } else {
	      isText = false;
	      needsIgnoring = anchor.classList.contains(ignoreClass);
	    }
	    if (needsIgnoring && isText) {
	      previousSibling = parent.previousSibling;
	      nextSibling = parent.nextSibling;

	      // If the sibling is a text node, join the nodes
	      if (previousSibling && previousSibling.nodeType === TEXT_NODE) {
	        sibling = previousSibling;
	      } else if (nextSibling && nextSibling.nodeType === TEXT_NODE) {
	        sibling = nextSibling;
	      }
	      if (sibling) {
	        return sibling;
	      } else {
	        // Parent will be ignored on next step
	        return anchor;
	      }
	    } else if (needsIgnoring && !isText) {
	      // Otherwise just skip the element node
	      return false;
	    } else {
	      // No need to filter
	      return anchor;
	    }
	  }
	  patchOffset(anchor, offset, ignoreClass) {
	    if (anchor.nodeType != TEXT_NODE) {
	      throw new Error('Anchor must be a text node');
	    }
	    var curr = anchor;
	    var totalOffset = offset;

	    // If the parent is a ignored node, get offset from it's start
	    if (anchor.parentNode.classList.contains(ignoreClass)) {
	      curr = anchor.parentNode;
	    }
	    while (curr.previousSibling) {
	      if (curr.previousSibling.nodeType === ELEMENT_NODE$2) {
	        // Originally a text node, so join
	        if (curr.previousSibling.classList.contains(ignoreClass)) {
	          totalOffset += curr.previousSibling.textContent.length;
	        } else {
	          break; // Normal node, dont join
	        }
	      } else {
	        // If the previous sibling is a text node, join the nodes
	        totalOffset += curr.previousSibling.textContent.length;
	      }
	      curr = curr.previousSibling;
	    }
	    return totalOffset;
	  }
	  normalizedMap(children, nodeType, ignoreClass) {
	    var output = {};
	    var prevIndex = -1;
	    var i,
	      len = children.length;
	    var currNodeType;
	    var prevNodeType;
	    for (i = 0; i < len; i++) {
	      currNodeType = children[i].nodeType;

	      // Check if needs ignoring
	      if (currNodeType === ELEMENT_NODE$2 && children[i].classList.contains(ignoreClass)) {
	        currNodeType = TEXT_NODE;
	      }
	      if (i > 0 && currNodeType === TEXT_NODE && prevNodeType === TEXT_NODE) {
	        // join text nodes
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
	    var children, index;
	    if (anchor.nodeType === ELEMENT_NODE$2) {
	      children = anchor.parentNode.children;
	      if (!children) {
	        children = core_33(anchor.parentNode);
	      }
	      index = Array.prototype.indexOf.call(children, anchor);
	    } else {
	      children = this.textNodes(anchor.parentNode);
	      index = children.indexOf(anchor);
	    }
	    return index;
	  }
	  filteredPosition(anchor, ignoreClass) {
	    var children, index, map;
	    if (anchor.nodeType === ELEMENT_NODE$2) {
	      children = anchor.parentNode.children;
	      map = this.normalizedMap(children, ELEMENT_NODE$2, ignoreClass);
	    } else {
	      children = anchor.parentNode.childNodes;
	      // Inside an ignored node
	      if (anchor.parentNode.classList.contains(ignoreClass)) {
	        anchor = anchor.parentNode;
	        children = anchor.parentNode.childNodes;
	      }
	      map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
	    }
	    index = Array.prototype.indexOf.call(children, anchor);
	    return map[index];
	  }
	  stepsToXpath(steps) {
	    var xpath = ['.', '*'];
	    steps.forEach(function (step) {
	      var position = step.index + 1;
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

	  /*
	   To get the last step if needed:
	   // Get the terminal step
	  lastStep = steps[steps.length-1];
	  // Get the query string
	  query = this.stepsToQuery(steps);
	  // Find the containing element
	  startContainerParent = doc.querySelector(query);
	  // Find the text node within that element
	  if(startContainerParent && lastStep.type == "text") {
	    container = startContainerParent.childNodes[lastStep.index];
	  }
	  */
	  stepsToQuerySelector(steps) {
	    var query = ['html'];
	    steps.forEach(function (step) {
	      var position = step.index + 1;
	      if (step.id) {
	        query.push('#' + step.id);
	      } else if (step.type === 'text') ; else {
	        query.push('*:nth-child(' + position + ')');
	      }
	    });
	    return query.join('>');
	  }
	  textNodes(container, ignoreClass) {
	    return Array.prototype.slice.call(container.childNodes).filter(function (node) {
	      if (node.nodeType === TEXT_NODE) {
	        return true;
	      } else if (ignoreClass && node.classList.contains(ignoreClass)) {
	        return true;
	      }
	      return false;
	    });
	  }
	  walkToNode(steps, _doc, ignoreClass) {
	    var doc = _doc || document;
	    var container = doc.documentElement;
	    var children;
	    var step;
	    var len = steps.length;
	    var i;
	    for (i = 0; i < len; i++) {
	      step = steps[i];
	      if (step.type === 'element') {
	        //better to get a container using id as some times step.index may not be correct
	        //For ex.https://github.com/futurepress/epub.js/issues/561
	        if (step.id) {
	          container = doc.getElementById(step.id);
	        } else {
	          children = container.children || core_33(container);
	          container = children[step.index];
	        }
	      } else if (step.type === 'text') {
	        container = this.textNodes(container, ignoreClass)[step.index];
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
	    var doc = _doc || document;
	    var container;
	    var xpath;
	    if (!ignoreClass && typeof doc.evaluate != 'undefined') {
	      xpath = this.stepsToXpath(steps);
	      container = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	    } else if (ignoreClass) {
	      container = this.walkToNode(steps, doc, ignoreClass);
	    } else {
	      container = this.walkToNode(steps, doc);
	    }
	    return container;
	  }
	  fixMiss(steps, offset, _doc, ignoreClass) {
	    var container = this.findNode(steps.slice(0, -1), _doc, ignoreClass);
	    var children = container.childNodes;
	    var map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
	    var child;
	    var len;
	    var lastStepIndex = steps[steps.length - 1].index;
	    for (let childIndex in map) {
	      if (!Object.prototype.hasOwnProperty.call(map, childIndex)) return;
	      if (map[childIndex] === lastStepIndex) {
	        child = children[childIndex];
	        len = child.textContent.length;
	        if (offset > len) {
	          offset = offset - len;
	        } else {
	          if (child.nodeType === ELEMENT_NODE$2) {
	            container = child.childNodes[0];
	          } else {
	            container = child;
	          }
	          break;
	        }
	      }
	    }
	    return {
	      container: container,
	      offset: offset
	    };
	  }

	  /**
	   * Creates a DOM range representing a CFI
	   * @param {document} _doc document referenced in the base
	   * @param {string} [ignoreClass]
	   * @return {Range}
	   */
	  toRange(_doc, ignoreClass) {
	    var doc = _doc || document;
	    var range;
	    var start, end, startContainer, endContainer;
	    var cfi = this;
	    var startSteps, endSteps;
	    var needsIgnoring = ignoreClass ? doc.querySelector('.' + ignoreClass) != null : false;
	    var missed;
	    range = doc.createRange();
	    if (cfi.range) {
	      start = cfi.start;
	      startSteps = cfi.path.steps.concat(start.steps);
	      startContainer = this.findNode(startSteps, doc, needsIgnoring ? ignoreClass : null);
	      end = cfi.end;
	      endSteps = cfi.path.steps.concat(end.steps);
	      endContainer = this.findNode(endSteps, doc, needsIgnoring ? ignoreClass : null);
	    } else {
	      start = cfi.path;
	      startSteps = cfi.path.steps;
	      startContainer = this.findNode(cfi.path.steps, doc, needsIgnoring ? ignoreClass : null);
	    }
	    if (startContainer) {
	      try {
	        if (start.terminal.offset != null) {
	          range.setStart(startContainer, start.terminal.offset);
	        } else {
	          range.setStart(startContainer, 0);
	        }
	      } catch (e) {
	        missed = this.fixMiss(startSteps, start.terminal.offset, doc, needsIgnoring ? ignoreClass : null);
	        range.setStart(missed.container, missed.offset);
	      }
	    } else {
	      console.log('No startContainer found for', this.toString());
	      // No start found
	      return null;
	    }
	    if (endContainer) {
	      try {
	        if (end.terminal.offset != null) {
	          range.setEnd(endContainer, end.terminal.offset);
	        } else {
	          range.setEnd(endContainer, 0);
	        }
	      } catch (e) {
	        missed = this.fixMiss(endSteps, cfi.end.terminal.offset, doc, needsIgnoring ? ignoreClass : null);
	        range.setEnd(missed.container, missed.offset);
	      }
	    }

	    // doc.defaultView.getSelection().addRange(range);
	    return range;
	  }

	  /**
	   * Check if a string is wrapped with "epubcfi()"
	   * @param {string} str
	   * @returns {boolean}
	   */
	  isCfiString(str) {
	    if (typeof str === 'string' && str.indexOf('epubcfi(') === 0 && str[str.length - 1] === ')') {
	      return true;
	    }
	    return false;
	  }
	  generateChapterComponent(_spineNodeIndex, _pos, id) {
	    var pos = parseInt(_pos),
	      spineNodeIndex = (_spineNodeIndex + 1) * 2,
	      cfi = '/' + spineNodeIndex + '/';
	    cfi += (pos + 1) * 2;
	    if (id) {
	      cfi += '[' + id + ']';
	    }
	    return cfi;
	  }

	  /**
	   * Collapse a CFI Range to a single CFI Position
	   * @param {boolean} [toStart=false]
	   */
	  collapse(toStart) {
	    if (!this.range) {
	      return;
	    }
	    this.range = false;
	    if (toStart) {
	      this.path.steps = this.path.steps.concat(this.start.steps);
	      this.path.terminal = this.start.terminal;
	    } else {
	      this.path.steps = this.path.steps.concat(this.end.steps);
	      this.path.terminal = this.end.terminal;
	    }
	  }
	}

	var hook = createCommonjsModule(function (module, exports) {

	  /**
	   * Hooks allow for injecting functions that must all complete in order before finishing
	   * They will execute in parallel but all must finish before continuing
	   * Functions may return a promise if they are async.
	   * @example this.content = new EPUBJS.Hook(this);
	   */
	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var Hook = /** @class */function () {
	    function Hook(context) {
	      this.context = context || this;
	      this.hooks = [];
	    }
	    /**
	     * Adds a function to be run before a hook completes
	     * @example this.content.register(function(){...});
	     */
	    Hook.prototype.register = function () {
	      var tasks = [];
	      for (var _i = 0; _i < arguments.length; _i++) {
	        tasks[_i] = arguments[_i];
	      }
	      for (var _a = 0, tasks_1 = tasks; _a < tasks_1.length; _a++) {
	        var task = tasks_1[_a];
	        if (typeof task === 'function') {
	          this.hooks.push(task);
	        } else if (Array.isArray(task)) {
	          for (var _b = 0, task_1 = task; _b < task_1.length; _b++) {
	            var fn = task_1[_b];
	            if (typeof fn === 'function') {
	              this.hooks.push(fn);
	            }
	          }
	        }
	      }
	    };
	    /**
	     * Removes a function
	     * @example this.content.deregister(function(){...});
	     */
	    Hook.prototype.deregister = function (func) {
	      var idx = this.hooks.indexOf(func);
	      if (idx !== -1) {
	        this.hooks.splice(idx, 1);
	      }
	    };
	    /**
	     * Triggers a hook to run all functions
	     * @example this.content.trigger(args).then(function(){...});
	     */
	    Hook.prototype.trigger = function () {
	      var args = [];
	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }
	      var context = this.context;
	      var promises = [];
	      this.hooks.forEach(function (task) {
	        try {
	          var executing = task.apply(context, args);
	          if (executing && typeof executing === 'object' && typeof executing.then === 'function') {
	            promises.push(executing);
	          }
	        } catch (err) {
	          console.log(err);
	        }
	        // Otherwise Task resolves immediately, continue
	      });
	      return Promise.all(promises);
	    };
	    // Adds a function to be run before a hook completes
	    Hook.prototype.list = function () {
	      return this.hooks;
	    };
	    Hook.prototype.clear = function () {
	      return this.hooks = [];
	    };
	    return Hook;
	  }();
	  exports.default = Hook;
	});
	var Hook = unwrapExports(hook);

	var replacements = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.replaceBase = replaceBase;
	  exports.replaceCanonical = replaceCanonical;
	  exports.replaceMeta = replaceMeta;
	  exports.replaceLinks = replaceLinks;
	  exports.substitute = substitute;
	  function replaceBase(doc, section) {
	    var _a;
	    var base;
	    var url = (_a = section.url) !== null && _a !== void 0 ? _a : '';
	    var absolute = url.indexOf('://') > -1;
	    if (!doc) {
	      return;
	    }
	    var head = doc.querySelector('head');
	    if (!head) return;
	    base = head.querySelector('base');
	    if (!base) {
	      base = doc.createElement('base');
	      head.insertBefore(base, head.firstChild);
	    }
	    // Fix for Safari (from or before 2019) crashing if the url doesn't have an origin
	    if (!absolute && globalThis.window && globalThis.window.location) {
	      url = globalThis.window.location.origin + url;
	    }
	    base.setAttribute('href', url);
	  }
	  function replaceCanonical(doc, section) {
	    var link;
	    var url = section.canonical;
	    if (!doc) {
	      return;
	    }
	    var head = doc.querySelector('head');
	    if (!head) return;
	    link = head.querySelector("link[rel='canonical']");
	    if (link) {
	      link.setAttribute('href', url !== null && url !== void 0 ? url : '');
	    } else {
	      link = doc.createElement('link');
	      link.setAttribute('rel', 'canonical');
	      link.setAttribute('href', url !== null && url !== void 0 ? url : '');
	      head.appendChild(link);
	    }
	  }
	  function replaceMeta(doc, section) {
	    var meta;
	    var id = section.idref;
	    if (!doc) {
	      return;
	    }
	    var head = doc.querySelector('head');
	    if (!head) return;
	    meta = head.querySelector("link[property='dc.identifier']");
	    if (meta) {
	      meta.setAttribute('content', id !== null && id !== void 0 ? id : '');
	    } else {
	      meta = doc.createElement('meta');
	      meta.setAttribute('name', 'dc.identifier');
	      meta.setAttribute('content', id !== null && id !== void 0 ? id : '');
	      head.appendChild(meta);
	    }
	  }
	  // TODO: move me to Contents
	  function replaceLinks(contents, fn) {
	    var _a;
	    var links = contents.querySelectorAll('a[href]');
	    if (!links.length) {
	      return;
	    }
	    var base = contents.ownerDocument.documentElement.querySelector('base');
	    var location = base ? (_a = base.getAttribute('href')) !== null && _a !== void 0 ? _a : undefined : undefined;
	    var replaceLink = function (link) {
	      var _a;
	      var href = (_a = link.getAttribute('href')) !== null && _a !== void 0 ? _a : '';
	      if (href.indexOf('mailto:') === 0) {
	        return;
	      }
	      var absolute = href.indexOf('://') > -1;
	      if (absolute) {
	        link.setAttribute('target', '_blank');
	      } else {
	        var linkUrl_1;
	        try {
	          linkUrl_1 = new url.default(href, location);
	        } catch (_b) {
	          // NOOP
	        }
	        link.onclick = function () {
	          if (linkUrl_1 && linkUrl_1.hash) {
	            fn(linkUrl_1.Path.path + linkUrl_1.hash);
	          } else if (linkUrl_1) {
	            fn(linkUrl_1.Path.path);
	          } else {
	            fn(href);
	          }
	          return false;
	        };
	      }
	    };
	    for (var i = 0; i < links.length; i++) {
	      replaceLink(links[i]);
	    }
	  }
	  function substitute(content, urls, replacements) {
	    urls.forEach(function (url, i) {
	      if (url && replacements[i]) {
	        // Account for special characters in the file name.
	        // See https://stackoverflow.com/a/6318729.
	        url = url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	        content = content.replace(new RegExp(url, 'g'), replacements[i]);
	      }
	    });
	    return content;
	  }
	});
	unwrapExports(replacements);
	var replacements_1 = replacements.replaceBase;
	var replacements_2 = replacements.replaceCanonical;
	var replacements_3 = replacements.replaceMeta;
	var replacements_4 = replacements.replaceLinks;
	var replacements_5 = replacements.substitute;

	var request_1 = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  function request(url, type, withCredentials, headers) {
	    var supportsURL = typeof window != 'undefined' ? window.URL : false; // TODO: fallback for url if window isn't defined
	    var BLOB_RESPONSE = supportsURL ? 'blob' : 'arraybuffer';
	    return new Promise(function (resolve, reject) {
	      var xhr = new XMLHttpRequest();
	      //-- Check from PDF.js:
	      //   https://github.com/mozilla/pdf.js/blob/master/web/compatibility.js
	      var xhrPrototype = XMLHttpRequest.prototype;
	      var header;
	      if (!('overrideMimeType' in xhrPrototype)) {
	        // IE10 might have response, but not overrideMimeType
	        Object.defineProperty(xhrPrototype, 'overrideMimeType', {
	          value: function xmlHttpRequestOverrideMimeType() {}
	        });
	      }
	      if (withCredentials) {
	        xhr.withCredentials = true;
	      }
	      xhr.onreadystatechange = handler;
	      xhr.onerror = err;
	      xhr.open('GET', url, true);
	      for (header in headers) {
	        xhr.setRequestHeader(header, headers[header]);
	      }
	      if (type == 'json') {
	        xhr.setRequestHeader('Accept', 'application/json');
	      }
	      // If type isn"t set, determine it from the file extension
	      if (!type) {
	        type = new path.default(url).extension;
	      }
	      if (type == 'blob') {
	        xhr.responseType = BLOB_RESPONSE;
	      }
	      if ((0, core.isXml)(type)) {
	        // xhr.responseType = "document";
	        xhr.overrideMimeType('text/xml'); // for OPF parsing
	      }
	      if (type == 'binary') {
	        xhr.responseType = 'arraybuffer';
	      }
	      xhr.send();
	      function err(e) {
	        reject(e);
	      }
	      function handler() {
	        if (this.readyState === XMLHttpRequest.DONE) {
	          var responseXML = null;
	          if (this.responseType === '' || this.responseType === 'document') {
	            responseXML = this.responseXML;
	          }
	          if (this.status === 200 || this.status === 0 || responseXML) {
	            //-- Firefox is reporting 0 for blob urls
	            var r = void 0;
	            if (!this.response && !responseXML) {
	              reject({
	                status: this.status,
	                message: 'Empty Response',
	                stack: new Error().stack
	              });
	              return;
	            }
	            if (this.status === 403) {
	              reject({
	                status: this.status,
	                response: this.response,
	                message: 'Forbidden',
	                stack: new Error().stack
	              });
	              return;
	            }
	            if (responseXML) {
	              r = this.responseXML;
	            } else if ((0, core.isXml)(type)) {
	              // xhr.overrideMimeType("text/xml"); // for OPF parsing
	              // If this.responseXML wasn't set, try to parse using a DOMParser from text
	              r = (0, core.parse)(this.response, 'text/xml');
	            } else if (type == 'xhtml') {
	              r = (0, core.parse)(this.response, 'application/xhtml+xml');
	            } else if (type == 'html' || type == 'htm') {
	              r = (0, core.parse)(this.response, 'text/html');
	            } else if (type == 'json') {
	              r = JSON.parse(this.response);
	            } else if (type == 'blob') {
	              if (supportsURL) {
	                r = this.response;
	              } else {
	                //-- Safari doesn't support responseType blob, so create a blob from arraybuffer
	                r = new Blob([this.response]);
	              }
	            } else {
	              r = this.response;
	            }
	            resolve(r);
	          } else {
	            reject({
	              status: this.status,
	              message: this.response,
	              stack: new Error().stack
	            });
	          }
	        }
	      }
	    });
	  }
	  exports.default = request;
	});
	var request = unwrapExports(request_1);

	/**
	 * Represents a Section of the Book
	 *
	 * In most books this is equivalent to a Chapter
	 * @param {object} item  The spine item representing the section
	 * @param {object} hooks hooks for serialize and content
	 */
	class Section {
	  constructor(item, hooks) {
	    this.idref = item.idref;
	    this.linear = item.linear === 'yes';
	    this.properties = item.properties;
	    this.index = item.index;
	    this.href = item.href;
	    this.url = item.url;
	    this.canonical = item.canonical;
	    this.next = item.next;
	    this.prev = item.prev;
	    this.cfiBase = item.cfiBase;
	    if (hooks) {
	      this.hooks = hooks;
	    } else {
	      this.hooks = {};
	      this.hooks.serialize = new Hook(this);
	      this.hooks.content = new Hook(this);
	    }
	    this.document = undefined;
	    this.contents = undefined;
	    this.output = undefined;
	  }

	  /**
	   * Load the section from its url
	   * @param  {method} [_request] a request method to use for loading
	   * @return {document} a promise with the xml document
	   */
	  load(_request) {
	    var request$1 = _request || this.request || request;
	    var loading = new core_1();
	    var loaded = loading.promise;
	    if (this.contents) {
	      loading.resolve(this.contents);
	    } else {
	      request$1(this.url).then(function (xml) {
	        // var directory = new Url(this.url).directory;

	        this.document = xml;
	        this.contents = xml.documentElement;
	        return this.hooks.content.trigger(this.document, this);
	      }.bind(this)).then(function () {
	        loading.resolve(this.contents);
	      }.bind(this)).catch(function (error) {
	        loading.reject(error);
	      });
	    }
	    return loaded;
	  }

	  /**
	   * Adds a base tag for resolving urls in the section
	   * @private
	   */
	  base() {
	    return replacements_1(this.document, this);
	  }

	  /**
	   * Render the contents of a section
	   * @param  {method} [_request] a request method to use for loading
	   * @return {string} output a serialized XML Document
	   */
	  render(_request) {
	    var rendering = new core_1();
	    var rendered = rendering.promise;
	    this.output; // TODO: better way to return this from hooks?

	    this.load(_request).then(contents => {
	      const serializer = new XMLSerializer();
	      this.output = serializer.serializeToString(contents);
	      return this.output;
	    }).then(function () {
	      return this.hooks.serialize.trigger(this.output, this);
	    }.bind(this)).then(function () {
	      rendering.resolve(this.output);
	    }.bind(this)).catch(function (error) {
	      rendering.reject(error);
	    });
	    return rendered;
	  }

	  /**
	   * Find a string in a section
	   * @param  {string} _query The query string to find
	   * @return {object[]} A list of matches, with form {cfi, excerpt}
	   */
	  find(_query) {
	    var section = this;
	    /**
	     * @typedef {Object} Match
	     * @property {string} cfi - The CFI string.
	     * @property {string} excerpt - The excerpt text.
	     */

	    /**
	     * @type {Match[]}
	     */
	    var matches = [];
	    var query = _query.toLowerCase();
	    var find = function (node) {
	      var text = node.textContent.toLowerCase();
	      var range = section.document.createRange();
	      var cfi;
	      var pos;
	      var last = -1;
	      var excerpt;
	      var limit = 150;
	      while (pos != -1) {
	        // Search for the query
	        pos = text.indexOf(query, last + 1);
	        if (pos != -1) {
	          // We found it! Generate a CFI
	          range = section.document.createRange();
	          range.setStart(node, pos);
	          range.setEnd(node, pos + query.length);
	          cfi = section.cfiFromRange(range);

	          // Generate the excerpt
	          if (node.textContent.length < limit) {
	            excerpt = node.textContent;
	          } else {
	            excerpt = node.textContent.substring(pos - limit / 2, pos + limit / 2);
	            excerpt = '...' + excerpt + '...';
	          }

	          // Add the CFI to the matches list
	          matches.push({
	            cfi: cfi,
	            excerpt: excerpt
	          });
	        }
	        last = pos;
	      }
	    };
	    core_28(section.document, function (node) {
	      find(node);
	    });
	    return matches;
	  }

	  /**
	   * Search a string in multiple sequential Element of the section. If the document.createTreeWalker api is missed(eg: IE8), use `find` as a fallback.
	   * @param  {string} _query The query string to search
	   * @param  {int} maxSeqEle The maximum number of Element that are combined for search, default value is 5.
	   * @return {object[]} A list of matches, with form {cfi, excerpt}
	   */
	  search(_query, maxSeqEle = 5) {
	    if (typeof document.createTreeWalker == 'undefined') {
	      return this.find(_query);
	    }
	    let matches = [];
	    const excerptLimit = 150;
	    const section = this;
	    const query = _query.toLowerCase();
	    const search = function (nodeList) {
	      const textWithCase = nodeList.reduce((acc, current) => {
	        return acc + current.textContent;
	      }, '');
	      const text = textWithCase.toLowerCase();
	      const pos = text.indexOf(query);
	      if (pos != -1) {
	        const startNodeIndex = 0,
	          endPos = pos + query.length;
	        let endNodeIndex = 0,
	          l = 0;
	        if (pos < nodeList[startNodeIndex].length) {
	          let cfi;
	          while (endNodeIndex < nodeList.length - 1) {
	            l += nodeList[endNodeIndex].length;
	            if (endPos <= l) {
	              break;
	            }
	            endNodeIndex += 1;
	          }
	          let startNode = nodeList[startNodeIndex],
	            endNode = nodeList[endNodeIndex];
	          let range = section.document.createRange();
	          range.setStart(startNode, pos);
	          let beforeEndLengthCount = nodeList.slice(0, endNodeIndex).reduce((acc, current) => {
	            return acc + current.textContent.length;
	          }, 0);
	          range.setEnd(endNode, beforeEndLengthCount > endPos ? endPos : endPos - beforeEndLengthCount);
	          cfi = section.cfiFromRange(range);
	          let excerpt = nodeList.slice(0, endNodeIndex + 1).reduce((acc, current) => {
	            return acc + current.textContent;
	          }, '');
	          if (excerpt.length > excerptLimit) {
	            excerpt = excerpt.substring(pos - excerptLimit / 2, pos + excerptLimit / 2);
	            excerpt = '...' + excerpt + '...';
	          }
	          matches.push({
	            cfi: cfi,
	            excerpt: excerpt
	          });
	        }
	      }
	    };
	    const treeWalker = document.createTreeWalker(section.document, NodeFilter.SHOW_TEXT, null, false);
	    let node,
	      nodeList = [];
	    while (node = treeWalker.nextNode()) {
	      nodeList.push(node);
	      if (nodeList.length == maxSeqEle) {
	        search(nodeList.slice(0, maxSeqEle));
	        nodeList = nodeList.slice(1, maxSeqEle);
	      }
	    }
	    if (nodeList.length > 0) {
	      search(nodeList);
	    }
	    return matches;
	  }

	  /**
	   * Reconciles the current chapters layout properties with
	   * the global layout properties.
	   * @param {object} globalLayout  The global layout settings object, chapter properties string
	   * @return {object} layoutProperties Object with layout properties
	   */
	  reconcileLayoutSettings(globalLayout) {
	    //-- Get the global defaults
	    var settings = {
	      layout: globalLayout.layout,
	      spread: globalLayout.spread,
	      orientation: globalLayout.orientation
	    };

	    //-- Get the chapter's display type
	    this.properties.forEach(function (prop) {
	      var rendition = prop.replace('rendition:', '');
	      var split = rendition.indexOf('-');
	      var property, value;
	      if (split != -1) {
	        property = rendition.slice(0, split);
	        value = rendition.slice(split + 1);
	        settings[property] = value;
	      }
	    });
	    return settings;
	  }

	  /**
	   * Get a CFI from a Range in the Section
	   * @param  {range} _range
	   * @return {string} cfi an EpubCFI string
	   */
	  cfiFromRange(_range) {
	    return new EpubCFI(_range, this.cfiBase).toString();
	  }

	  /**
	   * Get a CFI from an Element in the Section
	   * @param  {element} el
	   * @return {string} cfi an EpubCFI string
	   */
	  cfiFromElement(el) {
	    return new EpubCFI(el, this.cfiBase).toString();
	  }

	  /**
	   * Unload the section document
	   */
	  unload() {
	    this.document = undefined;
	    this.contents = undefined;
	    this.output = undefined;
	  }
	  destroy() {
	    this.unload();
	    this.hooks.serialize.clear();
	    this.hooks.content.clear();
	    this.hooks = undefined;
	    this.idref = undefined;
	    this.linear = undefined;
	    this.properties = undefined;
	    this.index = undefined;
	    this.href = undefined;
	    this.url = undefined;
	    this.next = undefined;
	    this.prev = undefined;
	    this.cfiBase = undefined;
	  }
	}

	/**
	 * A collection of Spine Items
	 */
	class Spine {
	  constructor() {
	    /**
	     * @type {Section[]}
	     */
	    this.spineItems = [];
	    this.spineByHref = {};
	    this.spineById = {};
	    this.hooks = {};
	    this.hooks.serialize = new Hook();
	    this.hooks.content = new Hook();

	    // Register replacements
	    this.hooks.content.register(replacements_1);
	    this.hooks.content.register(replacements_2);
	    this.hooks.content.register(replacements_3);
	    this.epubcfi = new EpubCFI();
	    this.loaded = false;
	    this.items = undefined;
	    this.manifest = undefined;
	    this.spineNodeIndex = undefined;
	    this.baseUrl = undefined;
	    this.length = undefined;
	  }

	  /**
	   * Unpack items from a opf into spine items
	   * @param  {Packaging} _package
	   * @param  {method} resolver URL resolver
	   * @param  {method} canonical Resolve canonical url
	   */
	  unpack(_package, resolver, canonical) {
	    this.items = _package.spine;
	    this.manifest = _package.manifest;
	    this.spineNodeIndex = _package.spineNodeIndex;
	    this.baseUrl = _package.baseUrl || _package.basePath || '';
	    this.length = this.items.length;
	    this.items.forEach((item, index) => {
	      var manifestItem = this.manifest[item.idref];
	      var spineItem;
	      item.index = index;
	      item.cfiBase = this.epubcfi.generateChapterComponent(this.spineNodeIndex, item.index, item.id);
	      if (item.href) {
	        item.url = resolver(item.href, true);
	        item.canonical = canonical(item.href);
	      }
	      if (manifestItem) {
	        item.href = manifestItem.href;
	        item.url = resolver(item.href, true);
	        item.canonical = canonical(item.href);
	        if (manifestItem.properties.length) {
	          item.properties.push.apply(item.properties, manifestItem.properties);
	        }
	      }
	      if (item.linear === 'yes') {
	        item.prev = function () {
	          let prevIndex = item.index;
	          while (prevIndex > 0) {
	            let prev = this.get(prevIndex - 1);
	            if (prev && prev.linear) {
	              return prev;
	            }
	            prevIndex -= 1;
	          }
	          return;
	        }.bind(this);
	        item.next = function () {
	          let nextIndex = item.index;
	          while (nextIndex < this.spineItems.length - 1) {
	            let next = this.get(nextIndex + 1);
	            if (next && next.linear) {
	              return next;
	            }
	            nextIndex += 1;
	          }
	          return;
	        }.bind(this);
	      } else {
	        item.prev = function () {
	          return;
	        };
	        item.next = function () {
	          return;
	        };
	      }
	      spineItem = new Section(item, this.hooks);
	      this.append(spineItem);
	    });
	    this.loaded = true;
	  }

	  /**
	   * Get an item from the spine
	   * @param  {string|number} [target]
	   * @return {Section} section
	   * @example spine.get();
	   * @example spine.get(1);
	   * @example spine.get("chap1.html");
	   * @example spine.get("#id1234");
	   */
	  get(target) {
	    var index = 0;
	    if (typeof target === 'undefined') {
	      while (index < this.spineItems.length) {
	        let next = this.spineItems[index];
	        if (next && next.linear) {
	          break;
	        }
	        index += 1;
	      }
	    } else if (this.epubcfi.isCfiString(target)) {
	      let cfi = new EpubCFI(target);
	      index = cfi.spinePos;
	    } else if (typeof target === 'number' || isNaN(target) === false) {
	      index = target;
	    } else if (typeof target === 'string' && target.indexOf('#') === 0) {
	      index = this.spineById[target.substring(1)];
	    } else if (typeof target === 'string') {
	      // Remove fragments
	      target = target.split('#')[0];
	      index = this.spineByHref[target] || this.spineByHref[encodeURI(target)];
	    }
	    return this.spineItems[index] || null;
	  }

	  /**
	   * Append a Section to the Spine
	   * @private
	   * @param  {Section} section
	   */
	  append(section) {
	    var index = this.spineItems.length;
	    section.index = index;
	    this.spineItems.push(section);

	    // Encode and Decode href lookups
	    // see pr for details: https://github.com/futurepress/epub.js/pull/358
	    this.spineByHref[decodeURI(section.href)] = index;
	    this.spineByHref[encodeURI(section.href)] = index;
	    this.spineByHref[section.href] = index;
	    this.spineById[section.idref] = index;
	    return index;
	  }

	  /**
	   * Prepend a Section to the Spine
	   * @private
	   * @param  {Section} section
	   */
	  prepend(section) {
	    // var index = this.spineItems.unshift(section);
	    this.spineByHref[section.href] = 0;
	    this.spineById[section.idref] = 0;

	    // Re-index
	    this.spineItems.forEach(function (item, index) {
	      item.index = index;
	    });
	    return 0;
	  }

	  // insert(section, index) {
	  //
	  // };

	  /**
	   * Remove a Section from the Spine
	   * @private
	   * @param  {Section} section
	   */
	  remove(section) {
	    var index = this.spineItems.indexOf(section);
	    if (index > -1) {
	      delete this.spineByHref[section.href];
	      delete this.spineById[section.idref];
	      return this.spineItems.splice(index, 1);
	    }
	  }

	  /**
	   * Loop over the Sections in the Spine
	   * @return {method} forEach
	   */
	  each() {
	    return this.spineItems.forEach.apply(this.spineItems, arguments);
	  }

	  /**
	   * Find the first Section in the Spine
	   * @return {Section} first section
	   */
	  first() {
	    let index = 0;
	    do {
	      let next = this.get(index);
	      if (next && next.linear) {
	        return next;
	      }
	      index += 1;
	    } while (index < this.spineItems.length);
	  }

	  /**
	   * Find the last Section in the Spine
	   * @return {Section} last section
	   */
	  last() {
	    let index = this.spineItems.length - 1;
	    do {
	      let prev = this.get(index);
	      if (prev && prev.linear) {
	        return prev;
	      }
	      index -= 1;
	    } while (index >= 0);
	  }
	  destroy() {
	    this.each(section => section.destroy());
	    this.spineItems = undefined;
	    this.spineByHref = undefined;
	    this.spineById = undefined;
	    this.hooks.serialize.clear();
	    this.hooks.content.clear();
	    this.hooks = undefined;
	    this.epubcfi = undefined;
	    this.loaded = false;
	    this.items = undefined;
	    this.manifest = undefined;
	    this.spineNodeIndex = undefined;
	    this.baseUrl = undefined;
	    this.length = undefined;
	  }
	}

	var queue = createCommonjsModule(function (module, exports) {

	  var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function (thisArg, _arguments, P, generator) {
	    function adopt(value) {
	      return value instanceof P ? value : new P(function (resolve) {
	        resolve(value);
	      });
	    }
	    return new (P || (P = Promise))(function (resolve, reject) {
	      function fulfilled(value) {
	        try {
	          step(generator.next(value));
	        } catch (e) {
	          reject(e);
	        }
	      }
	      function rejected(value) {
	        try {
	          step(generator["throw"](value));
	        } catch (e) {
	          reject(e);
	        }
	      }
	      function step(result) {
	        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
	      }
	      step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	  };
	  var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
	    var _ = {
	        label: 0,
	        sent: function () {
	          if (t[0] & 1) throw t[1];
	          return t[1];
	        },
	        trys: [],
	        ops: []
	      },
	      f,
	      y,
	      t,
	      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
	    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
	      return this;
	    }), g;
	    function verb(n) {
	      return function (v) {
	        return step([n, v]);
	      };
	    }
	    function step(op) {
	      if (f) throw new TypeError("Generator is already executing.");
	      while (g && (g = 0, op[0] && (_ = 0)), _) try {
	        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	        if (y = 0, t) op = [op[0] & 2, t.value];
	        switch (op[0]) {
	          case 0:
	          case 1:
	            t = op;
	            break;
	          case 4:
	            _.label++;
	            return {
	              value: op[1],
	              done: false
	            };
	          case 5:
	            _.label++;
	            y = op[1];
	            op = [0];
	            continue;
	          case 7:
	            op = _.ops.pop();
	            _.trys.pop();
	            continue;
	          default:
	            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
	              _ = 0;
	              continue;
	            }
	            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
	              _.label = op[1];
	              break;
	            }
	            if (op[0] === 6 && _.label < t[1]) {
	              _.label = t[1];
	              t = op;
	              break;
	            }
	            if (t && _.label < t[2]) {
	              _.label = t[2];
	              _.ops.push(op);
	              break;
	            }
	            if (t[2]) _.ops.pop();
	            _.trys.pop();
	            continue;
	        }
	        op = body.call(thisArg, _);
	      } catch (e) {
	        op = [6, e];
	        y = 0;
	      } finally {
	        f = t = 0;
	      }
	      if (op[0] & 5) throw op[1];
	      return {
	        value: op[0] ? op[1] : void 0,
	        done: true
	      };
	    }
	  };
	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var Queue = /** @class */function () {
	    function Queue(context) {
	      this._q = [];
	      this.context = context;
	      this.tick = core.requestAnimationFrame;
	      this.running = false;
	      this.paused = false;
	    }
	    /**
	     * End the queue
	     */
	    Queue.prototype.stop = function () {
	      this._q = [];
	      this.running = false;
	      this.paused = true;
	    };
	    /**
	     * Add an item to the queue
	     */
	    Queue.prototype.enqueue = function () {
	      var _this = this;
	      var args = [];
	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }
	      var taskOrPromise = args.shift();
	      if (!taskOrPromise) {
	        throw new Error('No Task Provided');
	      }
	      if (typeof taskOrPromise === 'function') {
	        // Always execute with the queue's context
	        var promise = new Promise(function (resolve, reject) {
	          _this._q.push({
	            task: function () {
	              var taskArgs = [];
	              for (var _i = 0; _i < arguments.length; _i++) {
	                taskArgs[_i] = arguments[_i];
	              }
	              return __awaiter(_this, void 0, void 0, function () {
	                var result, err_1;
	                return __generator(this, function (_a) {
	                  switch (_a.label) {
	                    case 0:
	                      _a.trys.push([0, 2,, 3]);
	                      return [4 /*yield*/, taskOrPromise.apply(this.context, taskArgs)];
	                    case 1:
	                      result = _a.sent();
	                      resolve(result);
	                      return [2 /*return*/, result];
	                    case 2:
	                      err_1 = _a.sent();
	                      reject(err_1);
	                      throw err_1;
	                    case 3:
	                      return [2 /*return*/];
	                  }
	                });
	              });
	            },
	            args: args
	          });
	          if (_this.paused == false && !_this.running) {
	            _this.run();
	          }
	        });
	        return promise;
	      } else if (isPromise(taskOrPromise)) {
	        var promise = taskOrPromise;
	        this._q.push({
	          promise: promise
	        });
	        if (this.paused == false && !this.running) {
	          this.run();
	        }
	        return promise;
	      } else {
	        // If not a function or promise, wrap as resolved promise
	        var promise = Promise.resolve(taskOrPromise);
	        this._q.push({
	          promise: promise
	        });
	        if (this.paused == false && !this.running) {
	          this.run();
	        }
	        return promise;
	      }
	    };
	    /**
	     * Run one item
	     */
	    // Run All Immediately
	    Queue.prototype.dump = function () {
	      while (this._q.length) {
	        this.dequeue();
	      }
	    };
	    /**
	     * Run all tasks sequentially, at convince
	     */
	    Queue.prototype.run = function () {
	      var _this = this;
	      if (!this.running) {
	        this.running = true;
	        this._deferredPromise = new Promise(function (resolve) {
	          _this._resolveDeferred = resolve;
	        });
	      }
	      if (this.tick) {
	        this.tick.call(globalThis, function () {
	          if (_this._q.length) {
	            _this.dequeue().then(function () {
	              _this.run();
	            });
	          } else {
	            if (_this._resolveDeferred) _this._resolveDeferred(undefined);
	            _this.running = undefined;
	          }
	        });
	      }
	    };
	    /**
	     * Run one item
	     */
	    Queue.prototype.dequeue = function () {
	      var _a;
	      if (this._q.length && !this.paused) {
	        var inwait_1 = this._q.shift();
	        if (!inwait_1) return Promise.resolve(undefined);
	        var task = inwait_1.task;
	        var args = Array.isArray(inwait_1.args) ? inwait_1.args : [];
	        if (task) {
	          try {
	            var result = task.apply(this.context, args);
	            if (isPromise(result)) {
	              return result.then(function (value) {
	                if (inwait_1.resolve) inwait_1.resolve(value);
	                return value;
	              }, function (err) {
	                if (inwait_1.reject) inwait_1.reject(err);
	                return undefined;
	              });
	            } else {
	              if (inwait_1.resolve) inwait_1.resolve(result);
	              return (_a = inwait_1.promise) !== null && _a !== void 0 ? _a : Promise.resolve(result);
	            }
	          } catch (err) {
	            if (inwait_1.reject) inwait_1.reject(err);
	            return Promise.resolve(undefined);
	          }
	        } else if (inwait_1.promise) {
	          return inwait_1.promise;
	        }
	      }
	      return Promise.resolve(undefined);
	    };
	    Queue.prototype.clear = function () {
	      this._q = [];
	    };
	    /**
	     * Get the number of tasks in the queue
	     */
	    Queue.prototype.length = function () {
	      return this._q.length;
	    };
	    /**
	     * Pause a running queue
	     */
	    Queue.prototype.pause = function () {
	      this.paused = true;
	    };
	    return Queue;
	  }();
	  function isPromise(value) {
	    return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
	  }
	  exports.default = Queue;
	});
	var Queue = unwrapExports(queue);

	var constants = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.EVENTS = exports.DOM_EVENTS = exports.EPUBJS_VERSION = void 0;
	  exports.EPUBJS_VERSION = '0.3';
	  // Dom events to listen for
	  exports.DOM_EVENTS = ['keydown', 'keyup', 'keypressed', 'mouseup', 'mousedown', 'mousemove', 'click', 'touchend', 'touchstart', 'touchmove'];
	  exports.EVENTS = {
	    BOOK: {
	      OPEN_FAILED: 'openFailed'
	    },
	    CONTENTS: {
	      EXPAND: 'expand',
	      RESIZE: 'resize',
	      SELECTED: 'selected',
	      SELECTED_RANGE: 'selectedRange',
	      LINK_CLICKED: 'linkClicked'
	    },
	    LOCATIONS: {
	      CHANGED: 'changed'
	    },
	    MANAGERS: {
	      RESIZE: 'resize',
	      RESIZED: 'resized',
	      ORIENTATION_CHANGE: 'orientationchange',
	      ADDED: 'added',
	      SCROLL: 'scroll',
	      SCROLLED: 'scrolled',
	      REMOVED: 'removed'
	    },
	    VIEWS: {
	      AXIS: 'axis',
	      WRITING_MODE: 'writingMode',
	      LOAD_ERROR: 'loaderror',
	      RENDERED: 'rendered',
	      RESIZED: 'resized',
	      DISPLAYED: 'displayed',
	      SHOWN: 'shown',
	      HIDDEN: 'hidden',
	      MARK_CLICKED: 'markClicked'
	    },
	    RENDITION: {
	      STARTED: 'started',
	      ATTACHED: 'attached',
	      DISPLAYED: 'displayed',
	      DISPLAY_ERROR: 'displayerror',
	      RENDERED: 'rendered',
	      REMOVED: 'removed',
	      RESIZED: 'resized',
	      ORIENTATION_CHANGE: 'orientationchange',
	      LOCATION_CHANGED: 'locationChanged',
	      RELOCATED: 'relocated',
	      MARK_CLICKED: 'markClicked',
	      SELECTED: 'selected',
	      LAYOUT: 'layout'
	    },
	    LAYOUT: {
	      UPDATED: 'updated'
	    },
	    ANNOTATION: {
	      ATTACH: 'attach',
	      DETACH: 'detach'
	    }
	  };
	});
	unwrapExports(constants);
	var constants_1 = constants.EVENTS;
	var constants_2 = constants.DOM_EVENTS;
	var constants_3 = constants.EPUBJS_VERSION;

	/**
	 * Find Locations for a Book
	 * @param {Spine} spine
	 * @param {request} request
	 * @param {number} [pause=100]
	 */
	class Locations {
	  constructor(spine, request, pause) {
	    this.spine = spine;
	    this.request = request;
	    this.pause = pause || 100;
	    this.q = new Queue(this);
	    this.epubcfi = new EpubCFI();
	    this._locations = [];
	    this._locationsWords = [];
	    this.total = 0;
	    this.break = 150;
	    this._current = 0;
	    this._wordCounter = 0;
	    this.currentLocation = '';
	    this._currentCfi = '';
	    this.processingTimeout = undefined;
	  }

	  /**
	   * Load all of sections in the book to generate locations
	   * @param  {int} chars how many chars to split on
	   * @return {Promise<Array<string>>} locations
	   */
	  generate(chars) {
	    if (chars) {
	      this.break = chars;
	    }
	    this.q.pause();
	    this.spine.each(function (section) {
	      if (section.linear) {
	        this.q.enqueue(this.process.bind(this), section);
	      }
	    }.bind(this));
	    return this.q.run().then(function () {
	      this.total = this._locations.length - 1;
	      if (this._currentCfi) {
	        this.currentLocation = this._currentCfi;
	      }
	      return this._locations;
	      // console.log(this.percentage(this.book.rendition.location.start), this.percentage(this.book.rendition.location.end));
	    }.bind(this));
	  }
	  createRange() {
	    return {
	      startContainer: undefined,
	      startOffset: undefined,
	      endContainer: undefined,
	      endOffset: undefined
	    };
	  }
	  process(section) {
	    return section.load(this.request).then(function (contents) {
	      var completed = new core_1();
	      var locations = this.parse(contents, section.cfiBase);
	      this._locations = this._locations.concat(locations);
	      section.unload();
	      this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
	      return completed.promise;
	    }.bind(this));
	  }
	  parse(contents, cfiBase, chars) {
	    var locations = [];
	    var range;
	    var doc = contents.ownerDocument;
	    var body = core_25(doc, 'body');
	    var counter = 0;
	    var prev;
	    var _break = chars || this.break;
	    var parser = function (node) {
	      var len = node.length;
	      var dist;
	      var pos = 0;
	      if (node.textContent.trim().length === 0) {
	        return false; // continue
	      }

	      // Start range
	      if (counter == 0) {
	        range = this.createRange();
	        range.startContainer = node;
	        range.startOffset = 0;
	      }
	      dist = _break - counter;

	      // Node is smaller than a break,
	      // skip over it
	      if (dist > len) {
	        counter += len;
	        pos = len;
	      }
	      while (pos < len) {
	        dist = _break - counter;
	        if (counter === 0) {
	          // Start new range
	          pos += 1;
	          range = this.createRange();
	          range.startContainer = node;
	          range.startOffset = pos;
	        }

	        // pos += dist;

	        // Gone over
	        if (pos + dist >= len) {
	          // Continue counter for next node
	          counter += len - pos;
	          // break
	          pos = len;
	          // At End
	        } else {
	          // Advance pos
	          pos += dist;

	          // End the previous range
	          range.endContainer = node;
	          range.endOffset = pos;
	          // cfi = section.cfiFromRange(range);
	          let cfi = new EpubCFI(range, cfiBase).toString();
	          locations.push(cfi);
	          counter = 0;
	        }
	      }
	      prev = node;
	    };
	    core_28(body, parser.bind(this));

	    // Close remaining
	    if (range && range.startContainer && prev) {
	      range.endContainer = prev;
	      range.endOffset = prev.length;
	      let cfi = new EpubCFI(range, cfiBase).toString();
	      locations.push(cfi);
	      counter = 0;
	    }
	    return locations;
	  }

	  /**
	   * Load all of sections in the book to generate locations
	   * @param  {string} startCfi start position
	   * @param  {int} wordCount how many words to split on
	   * @param  {int} count result count
	   * @return {object} locations
	   */
	  generateFromWords(startCfi, wordCount, count) {
	    var start = startCfi ? new EpubCFI(startCfi) : undefined;
	    this.q.pause();
	    this._locationsWords = [];
	    this._wordCounter = 0;
	    this.spine.each(function (section) {
	      if (section.linear) {
	        if (start) {
	          if (section.index >= start.spinePos) {
	            this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
	          }
	        } else {
	          this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
	        }
	      }
	    }.bind(this));
	    return this.q.run().then(function () {
	      if (this._currentCfi) {
	        this.currentLocation = this._currentCfi;
	      }
	      return this._locationsWords;
	    }.bind(this));
	  }
	  processWords(section, wordCount, startCfi, count) {
	    if (count && this._locationsWords.length >= count) {
	      return Promise.resolve();
	    }
	    return section.load(this.request).then(function (contents) {
	      var completed = new core_1();
	      var locations = this.parseWords(contents, section, wordCount, startCfi);
	      var remainingCount = count - this._locationsWords.length;
	      this._locationsWords = this._locationsWords.concat(locations.length >= count ? locations.slice(0, remainingCount) : locations);
	      section.unload();
	      this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
	      return completed.promise;
	    }.bind(this));
	  }

	  //http://stackoverflow.com/questions/18679576/counting-words-in-string
	  countWords(s) {
	    s = s.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
	    s = s.replace(/[ ]{2,}/gi, ' '); //2 or more space to 1
	    s = s.replace(/\n /, '\n'); // exclude newline with a start spacing
	    return s.split(' ').length;
	  }
	  parseWords(contents, section, wordCount, startCfi) {
	    var cfiBase = section.cfiBase;
	    var locations = [];
	    var doc = contents.ownerDocument;
	    var body = core_25(doc, 'body');
	    var _break = wordCount;
	    var foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
	    var startNode;
	    if (startCfi && section.index === startCfi.spinePos) {
	      startNode = startCfi.findNode(startCfi.range ? startCfi.path.steps.concat(startCfi.start.steps) : startCfi.path.steps, contents.ownerDocument);
	    }
	    var parser = function (node) {
	      if (!foundStartNode) {
	        if (node === startNode) {
	          foundStartNode = true;
	        } else {
	          return false;
	        }
	      }
	      if (node.textContent.length < 10) {
	        if (node.textContent.trim().length === 0) {
	          return false;
	        }
	      }
	      var len = this.countWords(node.textContent);
	      var dist;
	      var pos = 0;
	      if (len === 0) {
	        return false; // continue
	      }
	      dist = _break - this._wordCounter;

	      // Node is smaller than a break,
	      // skip over it
	      if (dist > len) {
	        this._wordCounter += len;
	        pos = len;
	      }
	      while (pos < len) {
	        dist = _break - this._wordCounter;

	        // Gone over
	        if (pos + dist >= len) {
	          // Continue counter for next node
	          this._wordCounter += len - pos;
	          // break
	          pos = len;
	          // At End
	        } else {
	          // Advance pos
	          pos += dist;
	          let cfi = new EpubCFI(node, cfiBase);
	          locations.push({
	            cfi: cfi.toString(),
	            wordCount: this._wordCounter
	          });
	          this._wordCounter = 0;
	        }
	      }
	    };
	    core_28(body, parser.bind(this));
	    return locations;
	  }

	  /**
	   * Get a location from an EpubCFI
	   * @param {EpubCFI} cfi
	   * @return {number}
	   */
	  locationFromCfi(cfi) {
	    let loc;
	    if (EpubCFI.prototype.isCfiString(cfi)) {
	      cfi = new EpubCFI(cfi);
	    }
	    // Check if the location has not been set yet
	    if (this._locations.length === 0) {
	      return -1;
	    }
	    loc = core_12(cfi, this._locations, this.epubcfi.compare);
	    if (loc > this.total) {
	      return this.total;
	    }
	    return loc;
	  }

	  /**
	   * Get a percentage position in locations from an EpubCFI
	   * @param {EpubCFI} cfi
	   * @return {number}
	   */
	  percentageFromCfi(cfi) {
	    if (this._locations.length === 0) {
	      return null;
	    }
	    // Find closest cfi
	    var loc = this.locationFromCfi(cfi);
	    // Get percentage in total
	    return this.percentageFromLocation(loc);
	  }

	  /**
	   * Get a percentage position from a location index
	   * @param {number} location
	   * @return {number}
	   */
	  percentageFromLocation(loc) {
	    if (!loc || !this.total) {
	      return 0;
	    }
	    return loc / this.total;
	  }

	  /**
	   * Get an EpubCFI from location index
	   * @param {number} loc
	   * @return {EpubCFI} cfi
	   */
	  cfiFromLocation(loc) {
	    var cfi = -1;
	    // check that pg is an int
	    if (typeof loc != 'number') {
	      loc = parseInt(loc);
	    }
	    if (loc >= 0 && loc < this._locations.length) {
	      cfi = this._locations[loc];
	    }
	    return cfi;
	  }

	  /**
	   * Get an EpubCFI from location percentage
	   * @param {number} percentage
	   * @return {EpubCFI} cfi
	   */
	  cfiFromPercentage(percentage) {
	    let loc;
	    if (percentage > 1) {
	      console.warn('Normalize cfiFromPercentage value to between 0 - 1');
	    }

	    // Make sure 1 goes to very end
	    if (percentage >= 1) {
	      let cfi = new EpubCFI(this._locations[this.total]);
	      cfi.collapse();
	      return cfi.toString();
	    }
	    loc = Math.ceil(this.total * percentage);
	    return this.cfiFromLocation(loc);
	  }

	  /**
	   * Load locations from JSON
	   * @param {json} locations
	   */
	  load(locations) {
	    if (typeof locations === 'string') {
	      this._locations = JSON.parse(locations);
	    } else {
	      this._locations = locations;
	    }
	    this.total = this._locations.length - 1;
	    return this._locations;
	  }

	  /**
	   * Save locations to JSON
	   * @return {json}
	   */
	  save() {
	    return JSON.stringify(this._locations);
	  }
	  getCurrent() {
	    return this._current;
	  }
	  setCurrent(curr) {
	    var loc;
	    if (typeof curr == 'string') {
	      this._currentCfi = curr;
	    } else if (typeof curr == 'number') {
	      this._current = curr;
	    } else {
	      return;
	    }
	    if (this._locations.length === 0) {
	      return;
	    }
	    if (typeof curr == 'string') {
	      loc = this.locationFromCfi(curr);
	      this._current = loc;
	    } else {
	      loc = curr;
	    }
	    this.emit(constants_1.LOCATIONS.CHANGED, {
	      percentage: this.percentageFromLocation(loc)
	    });
	  }

	  /**
	   * Get the current location
	   */
	  get currentLocation() {
	    return this._current;
	  }

	  /**
	   * Set the current location
	   */
	  set currentLocation(curr) {
	    this.setCurrent(curr);
	  }

	  /**
	   * Locations length
	   */
	  length() {
	    return this._locations.length;
	  }
	  destroy() {
	    this.spine = undefined;
	    this.request = undefined;
	    this.pause = undefined;
	    this.q.stop();
	    this.q = undefined;
	    this.epubcfi = undefined;
	    this._locations = undefined;
	    this.total = undefined;
	    this.break = undefined;
	    this._current = undefined;
	    this.currentLocation = undefined;
	    this._currentCfi = undefined;
	    clearTimeout(this.processingTimeout);
	  }
	}
	eventEmitter(Locations.prototype);

	/**
	 * Handles Parsing and Accessing an Epub Container
	 * @class
	 * @param {document} [containerDocument] xml document
	 */
	class Container {
	  constructor(containerDocument) {
	    this.packagePath = '';
	    this.directory = '';
	    this.encoding = '';
	    if (containerDocument) {
	      this.parse(containerDocument);
	    }
	  }

	  /**
	   * Parse the Container XML
	   * @param  {document} containerDocument
	   */
	  parse(containerDocument) {
	    //-- <rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>
	    var rootfile;
	    if (!containerDocument) {
	      throw new Error('Container File Not Found');
	    }
	    rootfile = core_25(containerDocument, 'rootfile');
	    if (!rootfile) {
	      throw new Error('No RootFile Found');
	    }
	    this.packagePath = rootfile.getAttribute('full-path');
	    this.directory = path$1.dirname(this.packagePath);
	    this.encoding = containerDocument.xmlEncoding;
	  }
	  destroy() {
	    this.packagePath = undefined;
	    this.directory = undefined;
	    this.encoding = undefined;
	  }
	}

	const ELEMENT_NODE$1 = 1;
	/**
	 * Gets the index of a node in its parent
	 * @param {Node} node
	 * @param {string} typeId
	 * @return {number} index
	 * @memberof Core
	 */
	function indexOfNode(node, typeId) {
	  var parent = node.parentNode;
	  var children = parent.childNodes;
	  var sib;
	  var index = -1;
	  for (var i = 0; i < children.length; i++) {
	    sib = children[i];
	    if (sib.nodeType === typeId) {
	      index++;
	    }
	    if (sib == node) break;
	  }
	  return index;
	}
	function indexOfElementNode(elementNode) {
	  return indexOfNode(elementNode, ELEMENT_NODE$1);
	}

	/**
	 * Open Packaging Format Parser
	 * @class
	 * @param {document} packageDocument OPF XML
	 */
	class Packaging {
	  constructor(packageDocument) {
	    this.manifest = {};
	    this.navPath = '';
	    this.ncxPath = '';
	    this.coverPath = '';
	    this.spineNodeIndex = 0;
	    this.spine = [];
	    this.metadata = {};
	    if (packageDocument) {
	      this.parse(packageDocument);
	    }
	  }

	  /**
	   * Parse OPF XML
	   * @param  {document} packageDocument OPF XML
	   * @return {object} parsed package parts
	   */
	  parse(packageDocument) {
	    var metadataNode, manifestNode, spineNode;
	    if (!packageDocument) {
	      throw new Error('Package File Not Found');
	    }
	    metadataNode = core_25(packageDocument, 'metadata');
	    if (!metadataNode) {
	      throw new Error('No Metadata Found');
	    }
	    manifestNode = core_25(packageDocument, 'manifest');
	    if (!manifestNode) {
	      throw new Error('No Manifest Found');
	    }
	    spineNode = core_25(packageDocument, 'spine');
	    if (!spineNode) {
	      throw new Error('No Spine Found');
	    }
	    this.manifest = this.parseManifest(manifestNode);
	    this.navPath = this.findNavPath(manifestNode);
	    this.ncxPath = this.findNcxPath(manifestNode, spineNode);
	    this.coverPath = this.findCoverPath(packageDocument);
	    this.spineNodeIndex = indexOfElementNode(spineNode);
	    this.spine = this.parseSpine(spineNode, this.manifest);
	    this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
	    this.metadata = this.parseMetadata(metadataNode);
	    this.metadata.direction = spineNode.getAttribute('page-progression-direction');
	    return {
	      metadata: this.metadata,
	      spine: this.spine,
	      manifest: this.manifest,
	      navPath: this.navPath,
	      ncxPath: this.ncxPath,
	      coverPath: this.coverPath,
	      spineNodeIndex: this.spineNodeIndex
	    };
	  }

	  /**
	   * Parse Metadata
	   * @private
	   * @param  {node} xml
	   * @return {object} metadata
	   */
	  parseMetadata(xml) {
	    var metadata = {};
	    metadata.title = this.getElementText(xml, 'title');
	    metadata.creator = this.getElementText(xml, 'creator');
	    metadata.description = this.getElementText(xml, 'description');
	    metadata.pubdate = this.getElementText(xml, 'date');
	    metadata.publisher = this.getElementText(xml, 'publisher');
	    metadata.identifier = this.getElementText(xml, 'identifier');
	    metadata.language = this.getElementText(xml, 'language');
	    metadata.rights = this.getElementText(xml, 'rights');
	    metadata.modified_date = this.getPropertyText(xml, 'dcterms:modified');
	    metadata.layout = this.getPropertyText(xml, 'rendition:layout');
	    metadata.orientation = this.getPropertyText(xml, 'rendition:orientation');
	    metadata.flow = this.getPropertyText(xml, 'rendition:flow');
	    metadata.viewport = this.getPropertyText(xml, 'rendition:viewport');
	    metadata.media_active_class = this.getPropertyText(xml, 'media:active-class');
	    metadata.spread = this.getPropertyText(xml, 'rendition:spread');
	    // metadata.page_prog_dir = packageXml.querySelector("spine").getAttribute("page-progression-direction");

	    return metadata;
	  }

	  /**
	   * Parse Manifest
	   * @private
	   * @param  {node} manifestXml
	   * @return {object} manifest
	   */
	  parseManifest(manifestXml) {
	    var manifest = {};

	    //-- Turn items into an array
	    // var selected = manifestXml.querySelectorAll("item");
	    var selected = core_26(manifestXml, 'item');
	    var items = Array.prototype.slice.call(selected);

	    //-- Create an object with the id as key
	    items.forEach(function (item) {
	      var id = item.getAttribute('id'),
	        href = item.getAttribute('href') || '',
	        type = item.getAttribute('media-type') || '',
	        overlay = item.getAttribute('media-overlay') || '',
	        properties = item.getAttribute('properties') || '';
	      manifest[id] = {
	        href: href,
	        // "url" : href,
	        type: type,
	        overlay: overlay,
	        properties: properties.length ? properties.split(' ') : []
	      };
	    });
	    return manifest;
	  }

	  /**
	   * Parse Spine
	   * @private
	   * @param  {node} spineXml
	   * @param  {Packaging.manifest} manifest
	   * @return {object} spine
	   */
	  parseSpine(spineXml, _manifest) {
	    var spine = [];
	    var selected = core_26(spineXml, 'itemref');
	    var items = Array.prototype.slice.call(selected);

	    // var epubcfi = new EpubCFI();

	    //-- Add to array to maintain ordering and cross reference with manifest
	    items.forEach(function (item, index) {
	      var idref = item.getAttribute('idref');
	      // var cfiBase = epubcfi.generateChapterComponent(spineNodeIndex, index, Id);
	      var props = item.getAttribute('properties') || '';
	      var propArray = props.length ? props.split(' ') : [];
	      // var manifestProps = manifest[Id].properties;
	      // var manifestPropArray = manifestProps.length ? manifestProps.split(" ") : [];

	      var itemref = {
	        id: item.getAttribute('id'),
	        idref: idref,
	        linear: item.getAttribute('linear') || 'yes',
	        properties: propArray,
	        // "href" : manifest[Id].href,
	        // "url" :  manifest[Id].url,
	        index: index
	        // "cfiBase" : cfiBase
	      };
	      spine.push(itemref);
	    });
	    return spine;
	  }

	  /**
	   * Find Unique Identifier
	   * @private
	   * @param  {node} packageXml
	   * @return {string} Unique Identifier text
	   */
	  findUniqueIdentifier(packageXml) {
	    var uniqueIdentifierId = packageXml.documentElement.getAttribute('unique-identifier');
	    if (!uniqueIdentifierId) {
	      return '';
	    }
	    var identifier = packageXml.getElementById(uniqueIdentifierId);
	    if (!identifier) {
	      return '';
	    }
	    if (identifier.localName === 'identifier' && identifier.namespaceURI === 'http://purl.org/dc/elements/1.1/') {
	      return identifier.childNodes.length > 0 ? identifier.childNodes[0].nodeValue.trim() : '';
	    }
	    return '';
	  }

	  /**
	   * Find TOC NAV
	   * @private
	   * @param {element} manifestNode
	   * @return {string}
	   */
	  findNavPath(manifestNode) {
	    // Find item with property "nav"
	    // Should catch nav regardless of order
	    // var node = manifestNode.querySelector("item[properties$='nav'], item[properties^='nav '], item[properties*=' nav ']");
	    var node = core_27(manifestNode, 'item', {
	      properties: 'nav'
	    });
	    return node ? node.getAttribute('href') : false;
	  }

	  /**
	   * Find TOC NCX
	   * media-type="application/x-dtbncx+xml" href="toc.ncx"
	   * @private
	   * @param {element} manifestNode
	   * @param {element} spineNode
	   * @return {string}
	   */
	  findNcxPath(manifestNode, spineNode) {
	    // var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
	    var node = core_27(manifestNode, 'item', {
	      'media-type': 'application/x-dtbncx+xml'
	    });
	    var tocId;

	    // If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
	    // according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
	    // "The item that describes the NCX must be referenced by the spine toc attribute."
	    if (!node) {
	      tocId = spineNode.getAttribute('toc');
	      if (tocId) {
	        // node = manifestNode.querySelector("item[id='" + tocId + "']");
	        node = manifestNode.querySelector(`#${tocId}`);
	      }
	    }
	    return node ? node.getAttribute('href') : false;
	  }

	  /**
	   * Find the Cover Path
	   * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
	   * Fallback for Epub 2.0
	   * @private
	   * @param  {node} packageXml
	   * @return {string} href
	   */
	  findCoverPath(packageXml) {
	    var pkg = core_25(packageXml, 'package');
	    pkg.getAttribute('version');

	    // Try parsing cover with epub 3.
	    // var node = packageXml.querySelector("item[properties='cover-image']");
	    var node = core_27(packageXml, 'item', {
	      properties: 'cover-image'
	    });
	    if (node) return node.getAttribute('href');

	    // Fallback to epub 2.
	    var metaCover = core_27(packageXml, 'meta', {
	      name: 'cover'
	    });
	    if (metaCover) {
	      var coverId = metaCover.getAttribute('content');
	      // var cover = packageXml.querySelector("item[id='" + coverId + "']");
	      var cover = packageXml.getElementById(coverId);
	      return cover ? cover.getAttribute('href') : '';
	    } else {
	      return false;
	    }
	  }

	  /**
	   * Get text of a namespaced element
	   * @private
	   * @param  {node} xml
	   * @param  {string} tag
	   * @return {string} text
	   */
	  getElementText(xml, tag) {
	    var found = xml.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', tag);
	    var el;
	    if (!found || found.length === 0) return '';
	    el = found[0];
	    if (el.childNodes.length) {
	      return el.childNodes[0].nodeValue;
	    }
	    return '';
	  }

	  /**
	   * Get text by property
	   * @private
	   * @param  {node} xml
	   * @param  {string} property
	   * @return {string} text
	   */
	  getPropertyText(xml, property) {
	    var el = core_27(xml, 'meta', {
	      property: property
	    });
	    if (el && el.childNodes.length) {
	      return el.childNodes[0].nodeValue;
	    }
	    return '';
	  }

	  /**
	   * Load JSON Manifest
	   * @param  {document} packageDocument OPF XML
	   * @return {object} parsed package parts
	   */
	  load(json) {
	    this.metadata = json.metadata;
	    let spine = json.readingOrder || json.spine;
	    this.spine = spine.map((item, index) => {
	      item.index = index;
	      item.linear = item.linear || 'yes';
	      return item;
	    });
	    json.resources.forEach((item, index) => {
	      this.manifest[index] = item;
	      if (item.rel && item.rel[0] === 'cover') {
	        this.coverPath = item.href;
	      }
	    });
	    this.spineNodeIndex = 0;
	    this.toc = json.toc.map(item => {
	      item.label = item.title;
	      return item;
	    });
	    return {
	      metadata: this.metadata,
	      spine: this.spine,
	      manifest: this.manifest,
	      navPath: this.navPath,
	      ncxPath: this.ncxPath,
	      coverPath: this.coverPath,
	      spineNodeIndex: this.spineNodeIndex,
	      toc: this.toc
	    };
	  }
	  destroy() {
	    this.manifest = undefined;
	    this.navPath = undefined;
	    this.ncxPath = undefined;
	    this.coverPath = undefined;
	    this.spineNodeIndex = undefined;
	    this.spine = undefined;
	    this.metadata = undefined;
	  }
	}

	/**
	 * Navigation Parser
	 * @param {document} xml navigation html / xhtml / ncx
	 */
	class Navigation {
	  constructor(xml) {
	    this.toc = [];
	    this.tocByHref = {};
	    this.tocById = {};
	    this.landmarks = [];
	    this.landmarksByType = {};
	    this.length = 0;
	    if (xml) {
	      this.parse(xml);
	    }
	  }

	  /**
	   * Parse out the navigation items
	   * @param {document} xml navigation html / xhtml / ncx
	   */
	  parse(xml) {
	    let isXml = xml.nodeType;
	    let html;
	    let ncx;
	    if (isXml) {
	      html = core_25(xml, 'html');
	      ncx = core_25(xml, 'ncx');
	    }
	    if (!isXml) {
	      this.toc = this.load(xml);
	    } else if (html) {
	      this.toc = this.parseNav(xml);
	      this.landmarks = this.parseLandmarks(xml);
	    } else if (ncx) {
	      this.toc = this.parseNcx(xml);
	    }
	    this.length = 0;
	    this.unpack(this.toc);
	  }

	  /**
	   * Unpack navigation items
	   * @private
	   * @param  {array} toc
	   */
	  unpack(toc) {
	    var item;
	    for (var i = 0; i < toc.length; i++) {
	      item = toc[i];
	      if (item.href) {
	        this.tocByHref[item.href] = i;
	      }
	      if (item.id) {
	        this.tocById[item.id] = i;
	      }
	      this.length++;
	      if (item.subitems.length) {
	        this.unpack(item.subitems);
	      }
	    }
	  }

	  /**
	   * Get an item from the navigation
	   * @param  {string} target
	   * @return {object} navItem
	   */
	  get(target) {
	    var index;
	    if (!target) {
	      return this.toc;
	    }
	    if (target.indexOf('#') === 0) {
	      index = this.tocById[target.substring(1)];
	    } else if (target in this.tocByHref) {
	      index = this.tocByHref[target];
	    }
	    return this.getByIndex(target, index, this.toc);
	  }

	  /**
	   * Get an item from navigation subitems recursively by index
	   * @param  {string} target
	   * @param  {number} index
	   * @param  {array} navItems
	   * @return {object} navItem
	   */
	  getByIndex(target, index, navItems) {
	    if (navItems.length === 0) {
	      return;
	    }
	    const item = navItems[index];
	    if (item && (target === item.id || target === item.href)) {
	      return item;
	    } else {
	      let result;
	      for (let i = 0; i < navItems.length; ++i) {
	        result = this.getByIndex(target, index, navItems[i].subitems);
	        if (result) {
	          break;
	        }
	      }
	      return result;
	    }
	  }

	  /**
	   * Get a landmark by type
	   * List of types: https://idpf.github.io/epub-vocabs/structure/
	   * @param  {string} type
	   * @return {object} landmarkItem
	   */
	  landmark(type) {
	    var index;
	    if (!type) {
	      return this.landmarks;
	    }
	    index = this.landmarksByType[type];
	    return this.landmarks[index];
	  }

	  /**
	   * Parse toc from a Epub > 3.0 Nav
	   * @private
	   * @param  {document} navHtml
	   * @return {array} navigation list
	   */
	  parseNav(navHtml) {
	    var navElement = core_32(navHtml, 'nav', 'toc');
	    var list = [];
	    if (!navElement) return list;
	    let navList = core_35(navElement, 'ol', true);
	    if (!navList) return list;
	    list = this.parseNavList(navList);
	    return list;
	  }

	  /**
	   * Parses lists in the toc
	   * @param  {document} navListHtml
	   * @param  {string} parent id
	   * @return {array} navigation list
	   */
	  parseNavList(navListHtml, parent) {
	    const result = [];
	    if (!navListHtml) return result;
	    if (!navListHtml.children) return result;
	    for (let i = 0; i < navListHtml.children.length; i++) {
	      const item = this.navItem(navListHtml.children[i], parent);
	      if (item) {
	        result.push(item);
	      }
	    }
	    return result;
	  }

	  /**
	   * Create a navItem
	   * @private
	   * @param  {element} item
	   * @return {object} navItem
	   */
	  navItem(item, parent) {
	    let id = item.getAttribute('id') || undefined;
	    let content = core_35(item, 'a', true) || core_35(item, 'span', true);
	    if (!content) {
	      return;
	    }
	    let src = content.getAttribute('href') || '';
	    if (!id) {
	      id = src;
	    }
	    let text = content.textContent || '';
	    let subitems = [];
	    let nested = core_35(item, 'ol', true);
	    if (nested) {
	      subitems = this.parseNavList(nested, id);
	    }
	    return {
	      id: id,
	      href: src,
	      label: text,
	      subitems: subitems,
	      parent: parent
	    };
	  }

	  /**
	   * Parse landmarks from a Epub > 3.0 Nav
	   * @private
	   * @param  {document} navHtml
	   * @return {array} landmarks list
	   */
	  parseLandmarks(navHtml) {
	    var navElement = core_32(navHtml, 'nav', 'landmarks');
	    var navItems = navElement ? core_26(navElement, 'li') : [];
	    var length = navItems.length;
	    var i;
	    var list = [];
	    var item;
	    if (!navItems || length === 0) return list;
	    for (i = 0; i < length; ++i) {
	      item = this.landmarkItem(navItems[i]);
	      if (item) {
	        list.push(item);
	        this.landmarksByType[item.type] = i;
	      }
	    }
	    return list;
	  }

	  /**
	   * Create a landmarkItem
	   * @private
	   * @param  {element} item
	   * @return {object} landmarkItem
	   */
	  landmarkItem(item) {
	    let content = core_35(item, 'a', true);
	    if (!content) {
	      return;
	    }
	    let type = content.getAttributeNS('http://www.idpf.org/2007/ops', 'type') || undefined;
	    let href = content.getAttribute('href') || '';
	    let text = content.textContent || '';
	    return {
	      href: href,
	      label: text,
	      type: type
	    };
	  }

	  /**
	   * Parse from a Epub > 3.0 NC
	   * @private
	   * @param  {document} navHtml
	   * @return {array} navigation list
	   */
	  parseNcx(tocXml) {
	    var navPoints = core_26(tocXml, 'navPoint');
	    var length = navPoints.length;
	    var i;
	    var toc = {};
	    var list = [];
	    var item, parent;
	    if (!navPoints || length === 0) return list;
	    for (i = 0; i < length; ++i) {
	      item = this.ncxItem(navPoints[i]);
	      toc[item.id] = item;
	      if (!item.parent) {
	        list.push(item);
	      } else {
	        parent = toc[item.parent];
	        parent.subitems.push(item);
	      }
	    }
	    return list;
	  }

	  /**
	   * Create a ncxItem
	   * @private
	   * @param  {element} item
	   * @return {object} ncxItem
	   */
	  ncxItem(item) {
	    var id = item.getAttribute('id') || false,
	      content = core_25(item, 'content'),
	      src = content.getAttribute('src'),
	      navLabel = core_25(item, 'navLabel'),
	      text = navLabel.textContent ? navLabel.textContent : '',
	      subitems = [],
	      parentNode = item.parentNode,
	      parent;
	    if (parentNode && (parentNode.nodeName === 'navPoint' || parentNode.nodeName.split(':').slice(-1)[0] === 'navPoint')) {
	      parent = parentNode.getAttribute('id');
	    }
	    return {
	      id: id,
	      href: src,
	      label: text,
	      subitems: subitems,
	      parent: parent
	    };
	  }

	  /**
	   * Load Spine Items
	   * @param  {object} json the items to be loaded
	   * @return {Array} navItems
	   */
	  load(json) {
	    return json.map(item => {
	      item.label = item.title;
	      item.subitems = item.children ? this.load(item.children) : [];
	      return item;
	    });
	  }

	  /**
	   * forEach pass through
	   * @param  {Function} fn function to run on each item
	   * @return {method} forEach loop
	   */
	  forEach(fn) {
	    return this.toc.forEach(fn);
	  }
	}

	var mime = createCommonjsModule(function (module, exports) {

	  /*
	   From Zip.js, by Gildas Lormeau
	  edited down
	   */
	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var table = {
	    application: {
	      ecmascript: ['es', 'ecma'],
	      javascript: 'js',
	      ogg: 'ogx',
	      pdf: 'pdf',
	      postscript: ['ps', 'ai', 'eps', 'epsi', 'epsf', 'eps2', 'eps3'],
	      'rdf+xml': 'rdf',
	      smil: ['smi', 'smil'],
	      'xhtml+xml': ['xhtml', 'xht'],
	      xml: ['xml', 'xsl', 'xsd', 'opf', 'ncx'],
	      zip: 'zip',
	      'x-httpd-eruby': 'rhtml',
	      'x-latex': 'latex',
	      'x-maker': ['frm', 'maker', 'frame', 'fm', 'fb', 'book', 'fbdoc'],
	      'x-object': 'o',
	      'x-shockwave-flash': ['swf', 'swfl'],
	      'x-silverlight': 'scr',
	      'epub+zip': 'epub',
	      'font-tdpfr': 'pfr',
	      'inkml+xml': ['ink', 'inkml'],
	      json: 'json',
	      'jsonml+json': 'jsonml',
	      'mathml+xml': 'mathml',
	      'metalink+xml': 'metalink',
	      mp4: 'mp4s',
	      // "oebps-package+xml" : "opf",
	      'omdoc+xml': 'omdoc',
	      oxps: 'oxps',
	      'vnd.amazon.ebook': 'azw',
	      widget: 'wgt',
	      // "x-dtbncx+xml" : "ncx",
	      'x-dtbook+xml': 'dtb',
	      'x-dtbresource+xml': 'res',
	      'x-font-bdf': 'bdf',
	      'x-font-ghostscript': 'gsf',
	      'x-font-linux-psf': 'psf',
	      'x-font-otf': 'otf',
	      'x-font-pcf': 'pcf',
	      'x-font-snf': 'snf',
	      'x-font-ttf': ['ttf', 'ttc'],
	      'x-font-type1': ['pfa', 'pfb', 'pfm', 'afm'],
	      'x-font-woff': 'woff',
	      'x-mobipocket-ebook': ['prc', 'mobi'],
	      'x-mspublisher': 'pub',
	      'x-nzb': 'nzb',
	      'x-tgif': 'obj',
	      'xaml+xml': 'xaml',
	      'xml-dtd': 'dtd',
	      'xproc+xml': 'xpl',
	      'xslt+xml': 'xslt',
	      'internet-property-stream': 'acx',
	      'x-compress': 'z',
	      'x-compressed': 'tgz',
	      'x-gzip': 'gz'
	    },
	    audio: {
	      flac: 'flac',
	      midi: ['mid', 'midi', 'kar', 'rmi'],
	      mpeg: ['mpga', 'mpega', 'mp2', 'mp3', 'm4a', 'mp2a', 'm2a', 'm3a'],
	      mpegurl: 'm3u',
	      ogg: ['oga', 'ogg', 'spx'],
	      'x-aiff': ['aif', 'aiff', 'aifc'],
	      'x-ms-wma': 'wma',
	      'x-wav': 'wav',
	      adpcm: 'adp',
	      mp4: 'mp4a',
	      webm: 'weba',
	      'x-aac': 'aac',
	      'x-caf': 'caf',
	      'x-matroska': 'mka',
	      'x-pn-realaudio-plugin': 'rmp',
	      xm: 'xm',
	      mid: ['mid', 'rmi']
	    },
	    image: {
	      gif: 'gif',
	      ief: 'ief',
	      jpeg: ['jpeg', 'jpg', 'jpe'],
	      pcx: 'pcx',
	      png: 'png',
	      'svg+xml': ['svg', 'svgz'],
	      tiff: ['tiff', 'tif'],
	      'x-icon': 'ico',
	      bmp: 'bmp',
	      webp: 'webp',
	      'x-pict': ['pic', 'pct'],
	      'x-tga': 'tga',
	      'cis-cod': 'cod'
	    },
	    text: {
	      'cache-manifest': ['manifest', 'appcache'],
	      css: 'css',
	      csv: 'csv',
	      html: ['html', 'htm', 'shtml', 'stm'],
	      mathml: 'mml',
	      plain: ['txt', 'text', 'brf', 'conf', 'def', 'list', 'log', 'in', 'bas'],
	      richtext: 'rtx',
	      'tab-separated-values': 'tsv',
	      'x-bibtex': 'bib'
	    },
	    video: {
	      mpeg: ['mpeg', 'mpg', 'mpe', 'm1v', 'm2v', 'mp2', 'mpa', 'mpv2'],
	      mp4: ['mp4', 'mp4v', 'mpg4'],
	      quicktime: ['qt', 'mov'],
	      ogg: 'ogv',
	      'vnd.mpegurl': ['mxu', 'm4u'],
	      'x-flv': 'flv',
	      'x-la-asf': ['lsf', 'lsx'],
	      'x-mng': 'mng',
	      'x-ms-asf': ['asf', 'asx', 'asr'],
	      'x-ms-wm': 'wm',
	      'x-ms-wmv': 'wmv',
	      'x-ms-wmx': 'wmx',
	      'x-ms-wvx': 'wvx',
	      'x-msvideo': 'avi',
	      'x-sgi-movie': 'movie',
	      'x-matroska': ['mpv', 'mkv', 'mk3d', 'mks'],
	      '3gpp2': '3g2',
	      h261: 'h261',
	      h263: 'h263',
	      h264: 'h264',
	      jpeg: 'jpgv',
	      jpm: ['jpm', 'jpgm'],
	      mj2: ['mj2', 'mjp2'],
	      'vnd.ms-playready.media.pyv': 'pyv',
	      'vnd.uvvu.mp4': ['uvu', 'uvvu'],
	      'vnd.vivo': 'viv',
	      webm: 'webm',
	      'x-f4v': 'f4v',
	      'x-m4v': 'm4v',
	      'x-ms-vob': 'vob',
	      'x-smv': 'smv'
	    }
	  };
	  var mimeTypes = function () {
	    var type, subtype, val, index;
	    var mimeTypes = {};
	    for (type in table) {
	      if (Object.prototype.hasOwnProperty.call(table, type)) {
	        for (subtype in table[type]) {
	          if (Object.prototype.hasOwnProperty.call(table[type], subtype)) {
	            val = table[type][subtype];
	            if (typeof val == 'string') {
	              mimeTypes[val] = type + '/' + subtype;
	            } else {
	              for (index = 0; index < val.length; index++) {
	                mimeTypes[val[index]] = type + '/' + subtype;
	              }
	            }
	          }
	        }
	      }
	    }
	    return mimeTypes;
	  }();
	  var defaultValue = 'text/plain';
	  function lookup(filename) {
	    if (!filename) return defaultValue;
	    var ext = filename.split('.').pop();
	    if (!ext) return defaultValue;
	    return mimeTypes[ext.toLowerCase()] || defaultValue;
	  }
	  exports.default = {
	    lookup: lookup
	  };
	});
	var mime$1 = unwrapExports(mime);

	/**
	 * Handle Package Resources
	 * @class
	 * @param {Manifest} manifest
	 * @param {object} [options]
	 * @param {string} [options.replacements="base64"]
	 * @param {Archive} [options.archive]
	 * @param {method} [options.resolver]
	 */
	class Resources {
	  constructor(manifest, options) {
	    this.settings = {
	      replacements: options && options.replacements || 'base64',
	      archive: options && options.archive,
	      resolver: options && options.resolver,
	      request: options && options.request
	    };
	    this.process(manifest);
	  }

	  /**
	   * Process resources
	   * @param {Manifest} manifest
	   */
	  process(manifest) {
	    this.manifest = manifest;
	    this.resources = Object.keys(manifest).map(function (key) {
	      return manifest[key];
	    });
	    this.replacementUrls = [];
	    this.html = [];
	    this.assets = [];
	    this.css = [];
	    this.urls = [];
	    this.cssUrls = [];
	    this.split();
	    this.splitUrls();
	  }

	  /**
	   * Split resources by type
	   * @private
	   */
	  split() {
	    // HTML
	    this.html = this.resources.filter(function (item) {
	      if (item.type === 'application/xhtml+xml' || item.type === 'text/html') {
	        return true;
	      }
	    });

	    // Exclude HTML
	    this.assets = this.resources.filter(function (item) {
	      if (item.type !== 'application/xhtml+xml' && item.type !== 'text/html') {
	        return true;
	      }
	    });

	    // Only CSS
	    this.css = this.resources.filter(function (item) {
	      if (item.type === 'text/css') {
	        return true;
	      }
	    });
	  }

	  /**
	   * Convert split resources into Urls
	   * @private
	   */
	  splitUrls() {
	    // All Assets Urls
	    this.urls = this.assets.map(function (item) {
	      return item.href;
	    }.bind(this));

	    // Css Urls
	    this.cssUrls = this.css.map(function (item) {
	      return item.href;
	    });
	  }

	  /**
	   * Create a url to a resource
	   * @param {string} url
	   * @return {Promise<string>} Promise resolves with url string
	   */
	  createUrl(url) {
	    var parsedUrl = new Url(url);
	    var mimeType = mime$1.lookup(parsedUrl.filename);
	    if (this.settings.archive) {
	      return this.settings.archive.createUrl(url, {
	        base64: this.settings.replacements === 'base64'
	      });
	    } else {
	      if (this.settings.replacements === 'base64') {
	        return this.settings.request(url, 'blob').then(blob => {
	          return core_31(blob);
	        }).then(blob => {
	          return core_22(blob, mimeType);
	        });
	      } else {
	        return this.settings.request(url, 'blob').then(blob => {
	          return core_20(blob, mimeType);
	        });
	      }
	    }
	  }

	  /**
	   * Create blob urls for all the assets
	   * @return {Promise}         returns replacement urls
	   */
	  replacements() {
	    if (this.settings.replacements === 'none') {
	      return new Promise(function (resolve) {
	        resolve(this.urls);
	      }.bind(this));
	    }
	    var replacements = this.urls.map(url => {
	      var absolute = this.settings.resolver(url);
	      return this.createUrl(absolute).catch(err => {
	        console.error(err);
	        return null;
	      });
	    });
	    return Promise.all(replacements).then(replacementUrls => {
	      this.replacementUrls = replacementUrls.filter(url => {
	        return typeof url === 'string';
	      });
	      return replacementUrls;
	    });
	  }

	  /**
	   * Replace URLs in CSS resources
	   * @private
	   * @param  {Archive} [archive]
	   * @param  {method} [resolver]
	   * @return {Promise}
	   */
	  replaceCss(archive, resolver) {
	    var replaced = [];
	    archive = archive || this.settings.archive;
	    resolver = resolver || this.settings.resolver;
	    this.cssUrls.forEach(function (href) {
	      var replacement = this.createCssFile(href, archive, resolver).then(function (replacementUrl) {
	        // switch the url in the replacementUrls
	        var indexInUrls = this.urls.indexOf(href);
	        if (indexInUrls > -1) {
	          this.replacementUrls[indexInUrls] = replacementUrl;
	        }
	      }.bind(this));
	      replaced.push(replacement);
	    }.bind(this));
	    return Promise.all(replaced);
	  }

	  /**
	   * Create a new CSS file with the replaced URLs
	   * @private
	   * @param  {string} href the original css file
	   * @return {Promise}  returns a BlobUrl to the new CSS file or a data url
	   */
	  createCssFile(href) {
	    var newUrl;
	    if (path$1.isAbsolute(href)) {
	      return new Promise(function (resolve) {
	        resolve();
	      });
	    }
	    var absolute = this.settings.resolver(href);

	    // Get the text of the css file from the archive
	    var textResponse;
	    if (this.settings.archive) {
	      textResponse = this.settings.archive.getText(absolute);
	    } else {
	      textResponse = this.settings.request(absolute, 'text');
	    }

	    // Get asset links relative to css file
	    var relUrls = this.urls.map(assetHref => {
	      var resolved = this.settings.resolver(assetHref);
	      var relative = new Path(absolute).relative(resolved);
	      return relative;
	    });
	    if (!textResponse) {
	      // file not found, don't replace
	      return new Promise(function (resolve) {
	        resolve();
	      });
	    }
	    return textResponse.then(text => {
	      // Replacements in the css text
	      text = replacements_5(text, relUrls, this.replacementUrls);

	      // Get the new url
	      if (this.settings.replacements === 'base64') {
	        newUrl = core_22(text, 'text/css');
	      } else {
	        newUrl = core_20(text, 'text/css');
	      }
	      return newUrl;
	    }, () => {
	      // handle response errors
	      return new Promise(function (resolve) {
	        resolve();
	      });
	    });
	  }

	  /**
	   * Resolve all resources URLs relative to an absolute URL
	   * @param  {string} absolute to be resolved to
	   * @param  {resolver} [resolver]
	   * @return {string[]} array with relative Urls
	   */
	  relativeTo(absolute, resolver) {
	    resolver = resolver || this.settings.resolver;

	    // Get Urls relative to current sections
	    return this.urls.map(function (href) {
	      var resolved = resolver(href);
	      var relative = new Path(absolute).relative(resolved);
	      return relative;
	    }.bind(this));
	  }

	  /**
	   * Get a URL for a resource
	   * @param  {string} path
	   * @return {string} url
	   */
	  get(path) {
	    var indexInUrls = this.urls.indexOf(path);
	    if (indexInUrls === -1) {
	      return;
	    }
	    if (this.replacementUrls.length) {
	      return new Promise(function (resolve) {
	        resolve(this.replacementUrls[indexInUrls]);
	      }.bind(this));
	    } else {
	      return this.createUrl(path);
	    }
	  }

	  /**
	   * Substitute urls in content, with replacements,
	   * relative to a url if provided
	   * @param  {string} content
	   * @param  {string} [url]   url to resolve to
	   * @return {string}         content with urls substituted
	   */
	  substitute(content, url) {
	    var relUrls;
	    if (url) {
	      relUrls = this.relativeTo(url);
	    } else {
	      relUrls = this.urls;
	    }
	    return replacements_5(content, relUrls, this.replacementUrls);
	  }
	  destroy() {
	    this.settings = undefined;
	    this.manifest = undefined;
	    this.resources = undefined;
	    this.replacementUrls = undefined;
	    this.html = undefined;
	    this.assets = undefined;
	    this.css = undefined;
	    this.urls = undefined;
	    this.cssUrls = undefined;
	  }
	}

	/**
	 * Page List Parser
	 * @param {document} [xml]
	 */
	class PageList {
	  constructor(xml) {
	    this.pages = [];
	    this.locations = [];
	    this.epubcfi = new EpubCFI();
	    this.firstPage = 0;
	    this.lastPage = 0;
	    this.totalPages = 0;
	    this.toc = undefined;
	    this.ncx = undefined;
	    if (xml) {
	      this.pageList = this.parse(xml);
	    }
	    if (this.pageList && this.pageList.length) {
	      this.process(this.pageList);
	    }
	  }

	  /**
	   * Parse PageList Xml
	   * @param  {document} xml
	   */
	  parse(xml) {
	    var html = core_25(xml, 'html');
	    var ncx = core_25(xml, 'ncx');
	    if (html) {
	      return this.parseNav(xml);
	    } else if (ncx) {
	      return this.parseNcx(xml);
	    }
	  }

	  /**
	   * Parse a Nav PageList
	   * @private
	   * @param  {node} navHtml
	   * @return {PageList.item[]} list
	   */
	  parseNav(navHtml) {
	    var navElement = core_32(navHtml, 'nav', 'page-list');
	    var navItems = navElement ? core_26(navElement, 'li') : [];
	    var length = navItems.length;
	    var i;
	    var list = [];
	    var item;
	    if (!navItems || length === 0) return list;
	    for (i = 0; i < length; ++i) {
	      item = this.item(navItems[i]);
	      list.push(item);
	    }
	    return list;
	  }
	  parseNcx(navXml) {
	    var list = [];
	    var i = 0;
	    var item;
	    var pageList;
	    var pageTargets;
	    var length = 0;
	    pageList = core_25(navXml, 'pageList');
	    if (!pageList) return list;
	    pageTargets = core_26(pageList, 'pageTarget');
	    length = pageTargets.length;
	    if (!pageTargets || pageTargets.length === 0) {
	      return list;
	    }
	    for (i = 0; i < length; ++i) {
	      item = this.ncxItem(pageTargets[i]);
	      list.push(item);
	    }
	    return list;
	  }
	  ncxItem(item) {
	    var navLabel = core_25(item, 'navLabel');
	    var navLabelText = core_25(navLabel, 'text');
	    var pageText = navLabelText.textContent;
	    var content = core_25(item, 'content');
	    var href = content.getAttribute('src');
	    var page = parseInt(pageText, 10);
	    return {
	      href: href,
	      page: page
	    };
	  }

	  /**
	   * Page List Item
	   * @private
	   * @param  {node} item
	   * @return {object} pageListItem
	   */
	  item(item) {
	    var content = core_25(item, 'a'),
	      href = content.getAttribute('href') || '',
	      text = content.textContent || '',
	      page = parseInt(text),
	      isCfi = href.indexOf('epubcfi'),
	      split,
	      packageUrl,
	      cfi;
	    if (isCfi != -1) {
	      split = href.split('#');
	      packageUrl = split[0];
	      cfi = split.length > 1 ? split[1] : false;
	      return {
	        cfi: cfi,
	        href: href,
	        packageUrl: packageUrl,
	        page: page
	      };
	    } else {
	      return {
	        href: href,
	        page: page
	      };
	    }
	  }

	  /**
	   * Process pageList items
	   * @private
	   * @param  {array} pageList
	   */
	  process(pageList) {
	    pageList.forEach(function (item) {
	      this.pages.push(item.page);
	      if (item.cfi) {
	        this.locations.push(item.cfi);
	      }
	    }, this);
	    this.firstPage = parseInt(this.pages[0]);
	    this.lastPage = parseInt(this.pages[this.pages.length - 1]);
	    this.totalPages = this.lastPage - this.firstPage;
	  }

	  /**
	   * Get a PageList result from a EpubCFI
	   * @param  {string} cfi EpubCFI String
	   * @return {number} page
	   */
	  pageFromCfi(cfi) {
	    var pg = -1;

	    // Check if the pageList has not been set yet
	    if (this.locations.length === 0) {
	      return -1;
	    }

	    // TODO: check if CFI is valid?

	    // check if the cfi is in the location list
	    // var index = this.locations.indexOf(cfi);
	    var index = core_13(cfi, this.locations, this.epubcfi.compare);
	    if (index != -1) {
	      pg = this.pages[index];
	    } else {
	      // Otherwise add it to the list of locations
	      // Insert it in the correct position in the locations page
	      //index = EPUBJS.core.insert(cfi, this.locations, this.epubcfi.compare);
	      index = core_12(cfi, this.locations, this.epubcfi.compare);
	      // Get the page at the location just before the new one, or return the first
	      pg = index - 1 >= 0 ? this.pages[index - 1] : this.pages[0];
	      if (pg !== undefined) ; else {
	        pg = -1;
	      }
	    }
	    return pg;
	  }

	  /**
	   * Get an EpubCFI from a Page List Item
	   * @param  {string | number} pg
	   * @return {string} cfi
	   */
	  cfiFromPage(pg) {
	    var cfi = -1;
	    // check that pg is an int
	    if (typeof pg != 'number') {
	      pg = parseInt(pg);
	    }

	    // check if the cfi is in the page list
	    // Pages could be unsorted.
	    var index = this.pages.indexOf(pg);
	    if (index != -1) {
	      cfi = this.locations[index];
	    }
	    // TODO: handle pages not in the list
	    return cfi;
	  }

	  /**
	   * Get a Page from Book percentage
	   * @param  {number} percent
	   * @return {number} page
	   */
	  pageFromPercentage(percent) {
	    var pg = Math.round(this.totalPages * percent);
	    return pg;
	  }

	  /**
	   * Returns a value between 0 - 1 corresponding to the location of a page
	   * @param  {number} pg the page
	   * @return {number} percentage
	   */
	  percentageFromPage(pg) {
	    var percentage = (pg - this.firstPage) / this.totalPages;
	    return Math.round(percentage * 1000) / 1000;
	  }

	  /**
	   * Returns a value between 0 - 1 corresponding to the location of a cfi
	   * @param  {string} cfi EpubCFI String
	   * @return {number} percentage
	   */
	  percentageFromCfi(cfi) {
	    var pg = this.pageFromCfi(cfi);
	    var percentage = this.percentageFromPage(pg);
	    return percentage;
	  }

	  /**
	   * Destroy
	   */
	  destroy() {
	    this.pages = undefined;
	    this.locations = undefined;
	    this.epubcfi = undefined;
	    this.pageList = undefined;
	    this.toc = undefined;
	    this.ncx = undefined;
	  }
	}

	/**
	 * Figures out the CSS values to apply for a layout
	 * @class
	 * @param {object} settings
	 * @param {string} [settings.layout='reflowable']
	 * @param {string} [settings.spread]
	 * @param {number} [settings.minSpreadWidth=800]
	 * @param {boolean} [settings.evenSpreads=false]
	 */
	class Layout {
	  constructor(settings) {
	    this.settings = settings;
	    this.name = settings.layout || 'reflowable';
	    this._spread = settings.spread === 'none' ? false : true;
	    this._minSpreadWidth = settings.minSpreadWidth || 800;
	    this._evenSpreads = settings.evenSpreads || false;
	    if (settings.flow === 'scrolled' || settings.flow === 'scrolled-continuous' || settings.flow === 'scrolled-doc') {
	      this._flow = 'scrolled';
	    } else {
	      this._flow = 'paginated';
	    }
	    this.width = 0;
	    this.height = 0;
	    this.spreadWidth = 0;
	    this.delta = 0;
	    this.columnWidth = 0;
	    this.gap = 0;
	    this.divisor = 1;
	    this.props = {
	      name: this.name,
	      spread: this._spread,
	      flow: this._flow,
	      width: 0,
	      height: 0,
	      spreadWidth: 0,
	      delta: 0,
	      columnWidth: 0,
	      gap: 0,
	      divisor: 1
	    };
	  }

	  /**
	   * Switch the flow between paginated and scrolled
	   * @param  {string} flow paginated | scrolled
	   * @return {string} simplified flow
	   */
	  flow(flow) {
	    if (typeof flow != 'undefined') {
	      if (flow === 'scrolled' || flow === 'scrolled-continuous' || flow === 'scrolled-doc') {
	        this._flow = 'scrolled';
	      } else {
	        this._flow = 'paginated';
	      }
	      // this.props.flow = this._flow;
	      this.update({
	        flow: this._flow
	      });
	    }
	    return this._flow;
	  }

	  /**
	   * Switch between using spreads or not, and set the
	   * width at which they switch to single.
	   * @param  {string} spread "none" | "always" | "auto"
	   * @param  {number} min integer in pixels
	   * @return {boolean} spread true | false
	   */
	  spread(spread, min) {
	    if (spread) {
	      this._spread = spread === 'none' ? false : true;
	      // this.props.spread = this._spread;
	      this.update({
	        spread: this._spread
	      });
	    }
	    if (min >= 0) {
	      this._minSpreadWidth = min;
	    }
	    return this._spread;
	  }

	  /**
	   * Calculate the dimensions of the pagination
	   * @param  {number} _width  width of the rendering
	   * @param  {number} _height height of the rendering
	   * @param  {number} _gap    width of the gap between columns
	   */
	  calculate(_width, _height, _gap) {
	    var divisor = 1;
	    var gap = _gap || 0;

	    //-- Check the width and create even width columns
	    // var fullWidth = Math.floor(_width);
	    var width = _width;
	    var height = _height;
	    var section = Math.floor(width / 12);
	    var columnWidth;
	    var spreadWidth;
	    var pageWidth;
	    var delta;
	    if (this._spread && width >= this._minSpreadWidth) {
	      divisor = 2;
	    } else {
	      divisor = 1;
	    }
	    if (this.name === 'reflowable' && this._flow === 'paginated' && !(_gap >= 0)) {
	      gap = section % 2 === 0 ? section : section - 1;
	    }
	    if (this.name === 'pre-paginated') {
	      gap = 0;
	    }

	    //-- Double Page
	    if (divisor > 1) {
	      // width = width - gap;
	      // columnWidth = (width - gap) / divisor;
	      // gap = gap / divisor;
	      columnWidth = width / divisor - gap;
	      pageWidth = columnWidth + gap;
	    } else {
	      columnWidth = width;
	      pageWidth = width;
	    }
	    if (this.name === 'pre-paginated' && divisor > 1) {
	      width = columnWidth;
	    }
	    spreadWidth = columnWidth * divisor + gap;
	    delta = width;
	    this.width = width;
	    this.height = height;
	    this.spreadWidth = spreadWidth;
	    this.pageWidth = pageWidth;
	    this.delta = delta;
	    this.columnWidth = columnWidth;
	    this.gap = gap;
	    this.divisor = divisor;

	    // this.props.width = width;
	    // this.props.height = _height;
	    // this.props.spreadWidth = spreadWidth;
	    // this.props.pageWidth = pageWidth;
	    // this.props.delta = delta;
	    //
	    // this.props.columnWidth = colWidth;
	    // this.props.gap = gap;
	    // this.props.divisor = divisor;

	    this.update({
	      width,
	      height,
	      spreadWidth,
	      pageWidth,
	      delta,
	      columnWidth,
	      gap,
	      divisor
	    });
	  }

	  /**
	   * Apply Css to a Document
	   * @param  {Contents} contents
	   * @return {Promise}
	   */
	  format(contents, section, axis) {
	    var formating;
	    if (this.name === 'pre-paginated') {
	      formating = contents.fit(this.columnWidth, this.height, section);
	    } else if (this._flow === 'paginated') {
	      formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.settings.direction);
	    } else if (axis && axis === 'horizontal') {
	      formating = contents.size(null, this.height);
	    } else {
	      formating = contents.size(this.width, null);
	    }
	    return formating; // might be a promise in some View Managers
	  }

	  /**
	   * Count number of pages
	   * @param  {number} totalLength
	   * @param  {number} pageLength
	   * @return {{spreads: Number, pages: Number}}
	   */
	  count(totalLength, pageLength) {
	    let spreads, pages;
	    if (this.name === 'pre-paginated') {
	      spreads = 1;
	      pages = 1;
	    } else if (this._flow === 'paginated') {
	      pageLength = pageLength || this.delta;
	      spreads = Math.ceil(totalLength / pageLength);
	      pages = spreads * this.divisor;
	    } else {
	      // scrolled
	      pageLength = pageLength || this.height;
	      spreads = Math.ceil(totalLength / pageLength);
	      pages = spreads;
	    }
	    return {
	      spreads,
	      pages
	    };
	  }

	  /**
	   * Update props that have changed
	   * @private
	   * @param  {object} props
	   */
	  update(props) {
	    // Remove props that haven't changed
	    Object.keys(props).forEach(propName => {
	      if (this.props[propName] === props[propName]) {
	        delete props[propName];
	      }
	    });
	    if (Object.keys(props).length > 0) {
	      let newProps = core_10(this.props, props);
	      this.emit(constants_1.LAYOUT.UPDATED, newProps, props);
	    }
	  }
	}
	eventEmitter(Layout.prototype);

	var themes = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  });

	  /**
	   * Themes to apply to displayed content
	   * @class
	   * @param {Rendition} rendition
	   */
	  var Themes = /** @class */function () {
	    function Themes(rendition) {
	      this._themes = {
	        default: {
	          rules: {},
	          url: '',
	          serialized: '',
	          injected: false
	        }
	      };
	      this._overrides = {};
	      this._current = 'default';
	      this._injected = [];
	      this.rendition = rendition;
	      this.rendition.hooks.content.register(this.inject.bind(this));
	      this.rendition.hooks.content.register(this.overrides.bind(this));
	    }
	    Themes.prototype.register = function () {
	      var args = [];
	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }
	      if (args.length === 0) {
	        return;
	      }
	      // themes.register({ light: {...}, dark: {...} })
	      if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0]) && args[0] !== null && !(args[0] instanceof String)) {
	        return this.registerThemes(args[0]);
	      }
	      // themes.register("light", "http://example.com/light.css")
	      if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
	        return this.registerUrl(args[0], args[1]);
	      }
	      // themes.register("light", { body: { color: "purple" } })
	      if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
	        return this.registerRules(args[0], args[1]);
	      }
	      // themes.register("http://example.com/default.css")
	      if (args.length === 1 && typeof args[0] === 'string') {
	        return this.default(args[0]);
	      }
	      // themes.register({ body: { color: "purple" } })
	      if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
	        return this.default(args[0]);
	      }
	    };
	    /**
	     * Add a default theme to be used by a rendition
	     * @param {object | string} theme
	     * @example themes.register("http://example.com/default.css")
	     * @example themes.register({ "body": { "color": "purple"}})
	     */
	    Themes.prototype.default = function (theme) {
	      if (!theme) {
	        return;
	      }
	      if (typeof theme === 'string') {
	        return this.registerUrl('default', theme);
	      }
	      if (typeof theme === 'object') {
	        return this.registerRules('default', theme);
	      }
	    };
	    /**
	     * Register themes object
	     * @param {object} themes
	     */
	    Themes.prototype.registerThemes = function (themes) {
	      for (var theme in themes) {
	        if (Object.prototype.hasOwnProperty.call(themes, theme)) {
	          if (typeof themes[theme] === 'string') {
	            this.registerUrl(theme, themes[theme]);
	          } else {
	            this.registerRules(theme, themes[theme]);
	          }
	        }
	      }
	    };
	    /**
	     * Register a theme by passing its css as string
	     * @param {string} name
	     * @param {string} css
	     */
	    Themes.prototype.registerCss = function (name, css) {
	      if (this._themes === undefined) {
	        throw new Error('Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.');
	      }
	      this._themes[name] = {
	        serialized: css
	      };
	      if (this._injected && this._injected.includes(name) || name == 'default') {
	        this.update(name);
	      }
	    };
	    /**
	     * Register a url
	     * @param {string} name
	     * @param {string} input
	     */
	    Themes.prototype.registerUrl = function (name, input) {
	      var url$1 = new url.default(input);
	      if (this._themes === undefined) {
	        throw new Error('Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.');
	      }
	      this._themes[name] = {
	        url: url$1.toString()
	      };
	      if (this._injected && this._injected.includes(name) || name == 'default') {
	        this.update(name);
	      }
	    };
	    /**
	     * Register rule
	     * @param {string} name
	     * @param {object} rules
	     */
	    Themes.prototype.registerRules = function (name, rules) {
	      if (this._themes === undefined) {
	        throw new Error('Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.');
	      }
	      this._themes[name] = {
	        rules: rules
	      };
	      // TODO: serialize css rules
	      if (this._injected && this._injected.includes(name) || name == 'default') {
	        this.update(name);
	      }
	    };
	    /**
	     * Select a theme
	     */
	    Themes.prototype.select = function (name) {
	      var prev = this._current;
	      this._current = name;
	      this.update(name);
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      var contents = this.rendition.getContents();
	      if (Array.isArray(contents)) {
	        contents.forEach(function (content) {
	          content.removeClass(prev);
	          content.addClass(name);
	        });
	      }
	    };
	    /**
	     * Update a theme
	     * @param {string} name
	     */
	    Themes.prototype.update = function (name) {
	      var _this = this;
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      var contents = this.rendition.getContents();
	      if (Array.isArray(contents)) {
	        contents.forEach(function (content) {
	          _this.add(name, content);
	        });
	      }
	    };
	    /**
	     * Inject all themes into contents
	     * @param {Contents} contents
	     */
	    Themes.prototype.inject = function (contents) {
	      var _a;
	      var links = [];
	      var themes = this._themes;
	      var theme;
	      for (var name_1 in themes) {
	        if (Object.prototype.hasOwnProperty.call(themes, name_1) && (name_1 === this._current || name_1 === 'default')) {
	          theme = themes[name_1];
	          if (theme.rules && Object.keys(theme.rules).length > 0 || theme.url && links.indexOf(theme.url) === -1) {
	            this.add(name_1, contents);
	          }
	          (_a = this._injected) === null || _a === void 0 ? void 0 : _a.push(name_1);
	        }
	      }
	      if (this._current !== undefined && this._current != 'default') {
	        contents.addClass(this._current);
	      }
	    };
	    /**
	     * Add Theme to contents
	     * @param {string} name
	     * @param {Contents} contents
	     */
	    Themes.prototype.add = function (name, contents) {
	      var theme = this._themes ? this._themes[name] : undefined;
	      if (!theme || !contents) {
	        return;
	      }
	      if (theme.url) {
	        contents.addStylesheet(theme.url);
	      } else if (theme.serialized) {
	        contents.addStylesheetCss(theme.serialized, name);
	        theme.injected = true;
	      } else if (theme.rules) {
	        contents.addStylesheetRules(theme.rules, name);
	        theme.injected = true;
	      }
	    };
	    /**
	     * Add override
	     * @param {string} name
	     * @param {string} value
	     * @param {boolean} priority
	     */
	    Themes.prototype.override = function (name, value, priority) {
	      if (priority === void 0) {
	        priority = false;
	      }
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      var contents = this.rendition.getContents();
	      if (this._overrides === undefined) {
	        this._overrides = {};
	      }
	      this._overrides[name] = {
	        value: value,
	        priority: priority === true
	      };
	      var override = this._overrides[name];
	      if (Array.isArray(contents)) {
	        contents.forEach(function (content) {
	          content.css(name, override.value, override.priority);
	        });
	      }
	    };
	    Themes.prototype.removeOverride = function (name) {
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      var contents = this.rendition.getContents();
	      if (this._overrides !== undefined && this._overrides[name] !== undefined) {
	        delete this._overrides[name];
	      }
	      if (Array.isArray(contents)) {
	        contents.forEach(function (content) {
	          content.css(name, undefined, undefined);
	        });
	      }
	    };
	    /**
	     * Add all overrides
	     */
	    Themes.prototype.overrides = function (contents) {
	      var overrides = this._overrides;
	      for (var rule in overrides) {
	        if (Object.prototype.hasOwnProperty.call(overrides, rule)) {
	          contents.css(rule, overrides[rule].value, overrides[rule].priority);
	        }
	      }
	    };
	    /**
	     * Adjust the font size of a rendition
	     */
	    Themes.prototype.fontSize = function (size) {
	      this.override('font-size', size);
	    };
	    /**
	     * Adjust the font-family of a rendition
	     */
	    Themes.prototype.font = function (f) {
	      this.override('font-family', f, true);
	    };
	    Themes.prototype.destroy = function () {
	      this.rendition = undefined;
	      this._themes = undefined;
	      this._overrides = undefined;
	      this._current = undefined;
	      this._injected = undefined;
	    };
	    return Themes;
	  }();
	  exports.default = Themes;
	});
	var Themes = unwrapExports(themes);

	/**
	 * Handles managing adding & removing Annotations
	 * @param {Rendition} rendition
	 * @class
	 */
	class Annotations {
	  constructor(rendition) {
	    this.rendition = rendition;
	    this.highlights = [];
	    this.underlines = [];
	    this.marks = [];
	    this._annotations = {};
	    this._annotationsBySectionIndex = {};
	    this.rendition.hooks.render.register(this.inject.bind(this));
	    this.rendition.hooks.unloaded.register(this.clear.bind(this));
	  }

	  /**
	   * Add an annotation to store
	   * @param {string} type Type of annotation to add: "highlight", "underline", "mark"
	   * @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	   * @param {object} data Data to assign to annotation
	   * @param {function} [cb] Callback after annotation is added
	   * @param {string} className CSS class to assign to annotation
	   * @param {object} styles CSS styles to assign to annotation
	   * @returns {Annotation} annotation
	   */
	  add(type, cfiRange, data, cb, className, styles) {
	    let hash = encodeURI(cfiRange + type);
	    let cfi = new EpubCFI(cfiRange);
	    let sectionIndex = cfi.spinePos;
	    let annotation = new Annotation({
	      type,
	      cfiRange,
	      data,
	      sectionIndex,
	      cb,
	      className,
	      styles
	    });
	    this._annotations[hash] = annotation;
	    if (sectionIndex in this._annotationsBySectionIndex) {
	      this._annotationsBySectionIndex[sectionIndex].push(hash);
	    } else {
	      this._annotationsBySectionIndex[sectionIndex] = [hash];
	    }
	    let views = this.rendition.views();
	    views.forEach(view => {
	      if (annotation.sectionIndex === view.index) {
	        annotation.attach(view);
	      }
	    });
	    return annotation;
	  }

	  /**
	   * Remove an annotation from store
	   * @param {EpubCFI} cfiRange EpubCFI range the annotation is attached to
	   * @param {string} type Type of annotation to add: "highlight", "underline", "mark"
	   */
	  remove(cfiRange, type) {
	    let hash = encodeURI(cfiRange + type);
	    if (hash in this._annotations) {
	      let annotation = this._annotations[hash];
	      if (type && annotation.type !== type) {
	        return;
	      }
	      let views = this.rendition.views();
	      views.forEach(view => {
	        this._removeFromAnnotationBySectionIndex(annotation.sectionIndex, hash);
	        if (annotation.sectionIndex === view.index) {
	          annotation.detach(view);
	        }
	      });
	      delete this._annotations[hash];
	    }
	  }

	  /**
	   * Remove an annotations by Section Index
	   * @private
	   */
	  _removeFromAnnotationBySectionIndex(sectionIndex, hash) {
	    this._annotationsBySectionIndex[sectionIndex] = this._annotationsAt(sectionIndex).filter(h => h !== hash);
	  }

	  /**
	   * Get annotations by Section Index
	   * @private
	   */
	  _annotationsAt(index) {
	    return this._annotationsBySectionIndex[index];
	  }

	  /**
	   * Add a highlight to the store
	   * @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	   * @param {object} data Data to assign to annotation
	   * @param {function} cb Callback after annotation is clicked
	   * @param {string} className CSS class to assign to annotation
	   * @param {object} styles CSS styles to assign to annotation
	   */
	  highlight(cfiRange, data, cb, className, styles) {
	    return this.add('highlight', cfiRange, data, cb, className, styles);
	  }

	  /**
	   * Add a underline to the store
	   * @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	   * @param {object} data Data to assign to annotation
	   * @param {function} cb Callback after annotation is clicked
	   * @param {string} className CSS class to assign to annotation
	   * @param {object} styles CSS styles to assign to annotation
	   */
	  underline(cfiRange, data, cb, className, styles) {
	    return this.add('underline', cfiRange, data, cb, className, styles);
	  }

	  /**
	   * Add a mark to the store
	   * @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	   * @param {object} data Data to assign to annotation
	   * @param {function} cb Callback after annotation is clicked
	   */
	  mark(cfiRange, data, cb) {
	    return this.add('mark', cfiRange, data, cb);
	  }

	  /**
	   * iterate over annotations in the store
	   */
	  each() {
	    return this._annotations.forEach.apply(this._annotations, arguments);
	  }

	  /**
	   * Hook for injecting annotation into a view
	   * @param {View} view
	   * @private
	   */
	  inject(view) {
	    let sectionIndex = view.index;
	    if (sectionIndex in this._annotationsBySectionIndex) {
	      let annotations = this._annotationsBySectionIndex[sectionIndex];
	      annotations.forEach(hash => {
	        let annotation = this._annotations[hash];
	        annotation.attach(view);
	      });
	    }
	  }

	  /**
	   * Hook for removing annotation from a view
	   * @param {View} view
	   * @private
	   */
	  clear(view) {
	    let sectionIndex = view.index;
	    if (sectionIndex in this._annotationsBySectionIndex) {
	      let annotations = this._annotationsBySectionIndex[sectionIndex];
	      annotations.forEach(hash => {
	        let annotation = this._annotations[hash];
	        annotation.detach(view);
	      });
	    }
	  }

	  /**
	   * [Not Implemented] Show annotations
	   * @TODO: needs implementation in View
	   */
	  show() {}

	  /**
	   * [Not Implemented] Hide annotations
	   * @TODO: needs implementation in View
	   */
	  hide() {}
	}

	/**
	 * Annotation object
	 * @class
	 * @param {object} options
	 * @param {string} options.type Type of annotation to add: "highlight", "underline", "mark"
	 * @param {EpubCFI} options.cfiRange EpubCFI range to attach annotation to
	 * @param {object} options.data Data to assign to annotation
	 * @param {int} options.sectionIndex Index in the Spine of the Section annotation belongs to
	 * @param {function} [options.cb] Callback after annotation is clicked
	 * @param {string} className CSS class to assign to annotation
	 * @param {object} styles CSS styles to assign to annotation
	 * @returns {Annotation} annotation
	 */
	class Annotation {
	  constructor({
	    type,
	    cfiRange,
	    data,
	    sectionIndex,
	    cb,
	    className,
	    styles
	  }) {
	    this.type = type;
	    this.cfiRange = cfiRange;
	    this.data = data;
	    this.sectionIndex = sectionIndex;
	    this.mark = undefined;
	    this.cb = cb;
	    this.className = className;
	    this.styles = styles;
	  }

	  /**
	   * Update stored data
	   * @param {object} data
	   */
	  update(data) {
	    this.data = data;
	  }

	  /**
	   * Add to a view
	   * @param {View} view
	   */
	  attach(view) {
	    let {
	      cfiRange,
	      data,
	      type,
	      cb,
	      className,
	      styles
	    } = this;
	    let result;
	    if (type === 'highlight') {
	      result = view.highlight(cfiRange, data, cb, className, styles);
	    } else if (type === 'underline') {
	      result = view.underline(cfiRange, data, cb, className, styles);
	    } else if (type === 'mark') {
	      result = view.mark(cfiRange, data, cb);
	    }
	    this.mark = result;
	    this.emit(constants_1.ANNOTATION.ATTACH, result);
	    return result;
	  }

	  /**
	   * Remove from a view
	   * @param {View} view
	   */
	  detach(view) {
	    let {
	      cfiRange,
	      type
	    } = this;
	    let result;
	    if (view) {
	      if (type === 'highlight') {
	        result = view.unhighlight(cfiRange);
	      } else if (type === 'underline') {
	        result = view.ununderline(cfiRange);
	      } else if (type === 'mark') {
	        result = view.unmark(cfiRange);
	      }
	    }
	    this.mark = undefined;
	    this.emit(constants_1.ANNOTATION.DETACH, result);
	    return result;
	  }

	  /**
	   * [Not Implemented] Get text of an annotation
	   * @TODO: needs implementation in contents
	   */
	  text() {}
	}
	eventEmitter(Annotation.prototype);

	/**
	 * Map text locations to CFI ranges
	 * @class
	 * @param {Layout} layout Layout to apply
	 * @param {string} [direction="ltr"] Text direction
	 * @param {string} [axis="horizontal"] vertical or horizontal axis
	 * @param {boolean} [dev] toggle developer highlighting
	 */
	class Mapping {
	  constructor(layout, direction, axis, dev = false) {
	    this.layout = layout;
	    this.horizontal = axis === 'horizontal' ? true : false;
	    this.direction = direction || 'ltr';
	    this._dev = dev;
	  }

	  /**
	   * Find CFI pairs for entire section at once
	   */
	  section(view) {
	    var ranges = this.findRanges(view);
	    var map = this.rangeListToCfiList(view.section.cfiBase, ranges);
	    return map;
	  }

	  /**
	   * Find CFI pairs for a page
	   * @param {Contents} contents Contents from view
	   * @param {string} cfiBase string of the base for a cfi
	   * @param {number} start position to start at
	   * @param {number} end position to end at
	   */
	  page(contents, cfiBase, start, end) {
	    var root = contents && contents.document ? contents.document.body : false;
	    var result;
	    if (!root) {
	      return;
	    }
	    result = this.rangePairToCfiPair(cfiBase, {
	      start: this.findStart(root, start, end),
	      end: this.findEnd(root, start, end)
	    });
	    if (this._dev === true) {
	      let doc = contents.document;
	      let startRange = new EpubCFI(result.start).toRange(doc);
	      let endRange = new EpubCFI(result.end).toRange(doc);
	      let selection = doc.defaultView.getSelection();
	      let r = doc.createRange();
	      selection.removeAllRanges();
	      r.setStart(startRange.startContainer, startRange.startOffset);
	      r.setEnd(endRange.endContainer, endRange.endOffset);
	      selection.addRange(r);
	    }
	    return result;
	  }

	  /**
	   * Walk a node, preforming a function on each node it finds
	   * @private
	   * @param {Node} root Node to walkToNode
	   * @param {function} func walk function
	   * @return {*} returns the result of the walk function
	   */
	  walk(root, func) {
	    // IE11 has strange issue, if root is text node IE throws exception on
	    // calling treeWalker.nextNode(), saying
	    // Unexpected call to method or property access instead of returning null value
	    if (root && root.nodeType === Node.TEXT_NODE) {
	      return;
	    }
	    // safeFilter is required so that it can work in IE as filter is a function for IE
	    // and for other browser filter is an object.
	    var filter = {
	      acceptNode: function (node) {
	        if (node.data.trim().length > 0) {
	          return NodeFilter.FILTER_ACCEPT;
	        } else {
	          return NodeFilter.FILTER_REJECT;
	        }
	      }
	    };
	    var safeFilter = filter.acceptNode;
	    safeFilter.acceptNode = filter.acceptNode;
	    var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, safeFilter, false);
	    var node;
	    var result;
	    while (node = treeWalker.nextNode()) {
	      result = func(node);
	      if (result) break;
	    }
	    return result;
	  }
	  findRanges(view) {
	    var columns = [];
	    var scrollWidth = view.contents.scrollWidth();
	    var spreads = Math.ceil(scrollWidth / this.layout.spreadWidth);
	    var count = spreads * this.layout.divisor;
	    var columnWidth = this.layout.columnWidth;
	    var gap = this.layout.gap;
	    var start, end;
	    for (var i = 0; i < count.pages; i++) {
	      start = (columnWidth + gap) * i;
	      end = columnWidth * (i + 1) + gap * i;
	      columns.push({
	        start: this.findStart(view.document.body, start, end),
	        end: this.findEnd(view.document.body, start, end)
	      });
	    }
	    return columns;
	  }

	  /**
	   * Find Start Range
	   * @private
	   * @param {Node} root root node
	   * @param {number} start position to start at
	   * @param {number} end position to end at
	   * @return {Range}
	   */
	  findStart(root, start, end) {
	    var stack = [root];
	    var $el;
	    var found;
	    var $prev = root;
	    while (stack.length) {
	      $el = stack.shift();
	      found = this.walk($el, node => {
	        var left, right, top, bottom;
	        var elPos;
	        elPos = core_16(node);
	        if (this.horizontal && this.direction === 'ltr') {
	          left = this.horizontal ? elPos.left : elPos.top;
	          right = this.horizontal ? elPos.right : elPos.bottom;
	          if (left >= start && left <= end) {
	            return node;
	          } else if (right > start) {
	            return node;
	          } else {
	            $prev = node;
	            stack.push(node);
	          }
	        } else if (this.horizontal && this.direction === 'rtl') {
	          left = elPos.left;
	          right = elPos.right;
	          if (right <= end && right >= start) {
	            return node;
	          } else if (left < end) {
	            return node;
	          } else {
	            $prev = node;
	            stack.push(node);
	          }
	        } else {
	          top = elPos.top;
	          bottom = elPos.bottom;
	          if (top >= start && top <= end) {
	            return node;
	          } else if (bottom > start) {
	            return node;
	          } else {
	            $prev = node;
	            stack.push(node);
	          }
	        }
	      });
	      if (found) {
	        return this.findTextStartRange(found, start, end);
	      }
	    }

	    // Return last element
	    return this.findTextStartRange($prev, start, end);
	  }

	  /**
	   * Find End Range
	   * @private
	   * @param {Node} root root node
	   * @param {number} start position to start at
	   * @param {number} end position to end at
	   * @return {Range}
	   */
	  findEnd(root, start, end) {
	    var stack = [root];
	    var $el;
	    var $prev = root;
	    var found;
	    while (stack.length) {
	      $el = stack.shift();
	      found = this.walk($el, node => {
	        var left, right, top, bottom;
	        var elPos;
	        elPos = core_16(node);
	        if (this.horizontal && this.direction === 'ltr') {
	          left = Math.round(elPos.left);
	          right = Math.round(elPos.right);
	          if (left > end && $prev) {
	            return $prev;
	          } else if (right > end) {
	            return node;
	          } else {
	            $prev = node;
	            stack.push(node);
	          }
	        } else if (this.horizontal && this.direction === 'rtl') {
	          left = Math.round(this.horizontal ? elPos.left : elPos.top);
	          right = Math.round(this.horizontal ? elPos.right : elPos.bottom);
	          if (right < start && $prev) {
	            return $prev;
	          } else if (left < start) {
	            return node;
	          } else {
	            $prev = node;
	            stack.push(node);
	          }
	        } else {
	          top = Math.round(elPos.top);
	          bottom = Math.round(elPos.bottom);
	          if (top > end && $prev) {
	            return $prev;
	          } else if (bottom > end) {
	            return node;
	          } else {
	            $prev = node;
	            stack.push(node);
	          }
	        }
	      });
	      if (found) {
	        return this.findTextEndRange(found, start, end);
	      }
	    }

	    // end of chapter
	    return this.findTextEndRange($prev, start, end);
	  }

	  /**
	   * Find Text Start Range
	   * @private
	   * @param {Node} root root node
	   * @param {number} start position to start at
	   * @param {number} end position to end at
	   * @return {Range}
	   */
	  findTextStartRange(node, start, end) {
	    var ranges = this.splitTextNodeIntoRanges(node);
	    var range;
	    var pos;
	    var left, top, right;
	    for (var i = 0; i < ranges.length; i++) {
	      range = ranges[i];
	      pos = range.getBoundingClientRect();
	      if (this.horizontal && this.direction === 'ltr') {
	        left = pos.left;
	        if (left >= start) {
	          return range;
	        }
	      } else if (this.horizontal && this.direction === 'rtl') {
	        right = pos.right;
	        if (right <= end) {
	          return range;
	        }
	      } else {
	        top = pos.top;
	        if (top >= start) {
	          return range;
	        }
	      }

	      // prev = range;
	    }
	    return ranges[0];
	  }

	  /**
	   * Find Text End Range
	   * @private
	   * @param {Node} root root node
	   * @param {number} start position to start at
	   * @param {number} end position to end at
	   * @return {Range}
	   */
	  findTextEndRange(node, start, end) {
	    var ranges = this.splitTextNodeIntoRanges(node);
	    var prev;
	    var range;
	    var pos;
	    var left, right, top, bottom;
	    for (var i = 0; i < ranges.length; i++) {
	      range = ranges[i];
	      pos = range.getBoundingClientRect();
	      if (this.horizontal && this.direction === 'ltr') {
	        left = pos.left;
	        right = pos.right;
	        if (left > end && prev) {
	          return prev;
	        } else if (right > end) {
	          return range;
	        }
	      } else if (this.horizontal && this.direction === 'rtl') {
	        left = pos.left;
	        right = pos.right;
	        if (right < start && prev) {
	          return prev;
	        } else if (left < start) {
	          return range;
	        }
	      } else {
	        top = pos.top;
	        bottom = pos.bottom;
	        if (top > end && prev) {
	          return prev;
	        } else if (bottom > end) {
	          return range;
	        }
	      }
	      prev = range;
	    }

	    // Ends before limit
	    return ranges[ranges.length - 1];
	  }

	  /**
	   * Split up a text node into ranges for each word
	   * @private
	   * @param {Node} root root node
	   * @param {string} [_splitter] what to split on
	   * @return {Range[]}
	   */
	  splitTextNodeIntoRanges(node, _splitter) {
	    var ranges = [];
	    var textContent = node.textContent || '';
	    var text = textContent.trim();
	    var range;
	    var doc = node.ownerDocument;
	    var splitter = _splitter || ' ';
	    var pos = text.indexOf(splitter);
	    if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
	      range = doc.createRange();
	      range.selectNodeContents(node);
	      return [range];
	    }
	    range = doc.createRange();
	    range.setStart(node, 0);
	    range.setEnd(node, pos);
	    ranges.push(range);
	    range = false;
	    while (pos != -1) {
	      pos = text.indexOf(splitter, pos + 1);
	      if (pos > 0) {
	        if (range) {
	          range.setEnd(node, pos);
	          ranges.push(range);
	        }
	        range = doc.createRange();
	        range.setStart(node, pos + 1);
	      }
	    }
	    if (range) {
	      range.setEnd(node, text.length);
	      ranges.push(range);
	    }
	    return ranges;
	  }

	  /**
	   * Turn a pair of ranges into a pair of CFIs
	   * @private
	   * @param {string} cfiBase base string for an EpubCFI
	   * @param {object} rangePair { start: Range, end: Range }
	   * @return {object} { start: "epubcfi(...)", end: "epubcfi(...)" }
	   */
	  rangePairToCfiPair(cfiBase, rangePair) {
	    var startRange = rangePair.start;
	    var endRange = rangePair.end;
	    startRange.collapse(true);
	    endRange.collapse(false);
	    let startCfi = new EpubCFI(startRange, cfiBase).toString();
	    let endCfi = new EpubCFI(endRange, cfiBase).toString();
	    return {
	      start: startCfi,
	      end: endCfi
	    };
	  }
	  rangeListToCfiList(cfiBase, columns) {
	    var map = [];
	    var cifPair;
	    for (var i = 0; i < columns.length; i++) {
	      cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);
	      map.push(cifPair);
	    }
	    return map;
	  }

	  /**
	   * Set the axis for mapping
	   * @param {string} axis horizontal | vertical
	   * @return {boolean} is it horizontal?
	   */
	  axis(axis) {
	    if (axis) {
	      this.horizontal = axis === 'horizontal' ? true : false;
	    }
	    return this.horizontal;
	  }
	}

	const hasNavigator = typeof navigator !== 'undefined';
	const isChrome = hasNavigator && /Chrome/.test(navigator.userAgent);
	const isWebkit = hasNavigator && !isChrome && /AppleWebKit/.test(navigator.userAgent);
	const ELEMENT_NODE = 1;

	/**
	 * Handles DOM manipulation, queries and events for View contents
	 * @class
	 * @param {document} doc Document
	 * @param {element} content Parent Element (typically Body)
	 * @param {string} cfiBase Section component of CFIs
	 * @param {number} sectionIndex Index in Spine of Conntent's Section
	 */
	class Contents {
	  constructor(doc, content, cfiBase, sectionIndex) {
	    // Blank Cfi for Parsing
	    this.epubcfi = new EpubCFI();
	    this.document = doc;
	    this.documentElement = this.document.documentElement;
	    this.content = content || this.document.body;
	    this.window = this.document.defaultView;
	    this._size = {
	      width: 0,
	      height: 0
	    };
	    this.sectionIndex = sectionIndex || 0;
	    this.cfiBase = cfiBase || '';
	    this.epubReadingSystem('epub.js', constants_3);
	    this.called = 0;
	    this.active = true;
	    this.listeners();
	  }

	  /**
	   * Get DOM events that are listened for and passed along
	   */
	  static get listenedEvents() {
	    return constants_2;
	  }

	  /**
	   * Get or Set width
	   * @param {number} [w]
	   * @returns {number} width
	   */
	  width(w) {
	    // var frame = this.documentElement;
	    var frame = this.content;
	    if (w && core_6(w)) {
	      w = w + 'px';
	    }
	    if (w) {
	      frame.style.width = w;
	      // this.content.style.width = w;
	    }
	    return parseInt(this.window.getComputedStyle(frame)['width']);
	  }

	  /**
	   * Get or Set height
	   * @param {number} [h]
	   * @returns {number} height
	   */
	  height(h) {
	    // var frame = this.documentElement;
	    var frame = this.content;
	    if (h && core_6(h)) {
	      h = h + 'px';
	    }
	    if (h) {
	      frame.style.height = h;
	      // this.content.style.height = h;
	    }
	    return parseInt(this.window.getComputedStyle(frame)['height']);
	  }

	  /**
	   * Get or Set width of the contents
	   * @param {number} [w]
	   * @returns {number} width
	   */
	  contentWidth(w) {
	    var content = this.content || this.document.body;
	    if (w && core_6(w)) {
	      w = w + 'px';
	    }
	    if (w) {
	      content.style.width = w;
	    }
	    return parseInt(this.window.getComputedStyle(content)['width']);
	  }

	  /**
	   * Get or Set height of the contents
	   * @param {number} [h]
	   * @returns {number} height
	   */
	  contentHeight(h) {
	    var content = this.content || this.document.body;
	    if (h && core_6(h)) {
	      h = h + 'px';
	    }
	    if (h) {
	      content.style.height = h;
	    }
	    return parseInt(this.window.getComputedStyle(content)['height']);
	  }

	  /**
	   * Get the width of the text using Range
	   * @returns {number} width
	   */
	  textWidth() {
	    let rect;
	    let width;
	    let range = this.document.createRange();
	    let content = this.content || this.document.body;
	    let border = core_15(content);

	    // Select the contents of frame
	    range.selectNodeContents(content);

	    // get the width of the text content
	    rect = range.getBoundingClientRect();
	    width = rect.width;
	    if (border && border.width) {
	      width += border.width;
	    }
	    return Math.round(width);
	  }

	  /**
	   * Get the height of the text using Range
	   * @returns {number} height
	   */
	  textHeight() {
	    let rect;
	    let height;
	    let range = this.document.createRange();
	    let content = this.content || this.document.body;
	    range.selectNodeContents(content);
	    rect = range.getBoundingClientRect();
	    height = rect.bottom;
	    return Math.round(height);
	  }

	  /**
	   * Get documentElement scrollWidth
	   * @returns {number} width
	   */
	  scrollWidth() {
	    var width = this.documentElement.scrollWidth;
	    return width;
	  }

	  /**
	   * Get documentElement scrollHeight
	   * @returns {number} height
	   */
	  scrollHeight() {
	    var height = this.documentElement.scrollHeight;
	    return height;
	  }

	  /**
	   * Set overflow css style of the contents
	   * @param {string} [overflow]
	   */
	  overflow(overflow) {
	    if (overflow) {
	      this.documentElement.style.overflow = overflow;
	    }
	    return this.window.getComputedStyle(this.documentElement)['overflow'];
	  }

	  /**
	   * Set overflowX css style of the documentElement
	   * @param {string} [overflow]
	   */
	  overflowX(overflow) {
	    if (overflow) {
	      this.documentElement.style.overflowX = overflow;
	    }
	    return this.window.getComputedStyle(this.documentElement)['overflowX'];
	  }

	  /**
	   * Set overflowY css style of the documentElement
	   * @param {string} [overflow]
	   */
	  overflowY(overflow) {
	    if (overflow) {
	      this.documentElement.style.overflowY = overflow;
	    }
	    return this.window.getComputedStyle(this.documentElement)['overflowY'];
	  }

	  /**
	   * Set Css styles on the contents element (typically Body)
	   * @param {string} property
	   * @param {string} value
	   * @param {boolean} [priority] set as "important"
	   */
	  css(property, value, priority) {
	    var content = this.content || this.document.body;
	    if (value) {
	      content.style.setProperty(property, value, priority ? 'important' : '');
	    } else {
	      content.style.removeProperty(property);
	    }
	    return this.window.getComputedStyle(content)[property];
	  }

	  /**
	   * Get or Set the viewport element
	   * @param {object} [options]
	   * @param {string} [options.width]
	   * @param {string} [options.height]
	   * @param {string} [options.scale]
	   * @param {string} [options.minimum]
	   * @param {string} [options.maximum]
	   * @param {string} [options.scalable]
	   */
	  viewport(options) {
	    // var width, height, scale, minimum, maximum, scalable;
	    var $viewport = this.document.querySelector("meta[name='viewport']");
	    var parsed = {
	      width: undefined,
	      height: undefined,
	      scale: undefined,
	      minimum: undefined,
	      maximum: undefined,
	      scalable: undefined
	    };
	    var newContent = [];
	    var settings = {};

	    /*
	     * check for the viewport size
	     * <meta name="viewport" content="width=1024,height=697" />
	     */
	    if ($viewport && $viewport.hasAttribute('content')) {
	      let content = $viewport.getAttribute('content');
	      let _width = content.match(/width\s*=\s*([^,]*)/);
	      let _height = content.match(/height\s*=\s*([^,]*)/);
	      let _scale = content.match(/initial-scale\s*=\s*([^,]*)/);
	      let _minimum = content.match(/minimum-scale\s*=\s*([^,]*)/);
	      let _maximum = content.match(/maximum-scale\s*=\s*([^,]*)/);
	      let _scalable = content.match(/user-scalable\s*=\s*([^,]*)/);
	      if (_width && _width.length && typeof _width[1] !== 'undefined') {
	        parsed.width = _width[1];
	      }
	      if (_height && _height.length && typeof _height[1] !== 'undefined') {
	        parsed.height = _height[1];
	      }
	      if (_scale && _scale.length && typeof _scale[1] !== 'undefined') {
	        parsed.scale = _scale[1];
	      }
	      if (_minimum && _minimum.length && typeof _minimum[1] !== 'undefined') {
	        parsed.minimum = _minimum[1];
	      }
	      if (_maximum && _maximum.length && typeof _maximum[1] !== 'undefined') {
	        parsed.maximum = _maximum[1];
	      }
	      if (_scalable && _scalable.length && typeof _scalable[1] !== 'undefined') {
	        parsed.scalable = _scalable[1];
	      }
	    }
	    settings = core_9(options || {}, parsed);
	    if (options) {
	      if (settings.width) {
	        newContent.push('width=' + settings.width);
	      }
	      if (settings.height) {
	        newContent.push('height=' + settings.height);
	      }
	      if (settings.scale) {
	        newContent.push('initial-scale=' + settings.scale);
	      }
	      if (settings.scalable === 'no') {
	        newContent.push('minimum-scale=' + settings.scale);
	        newContent.push('maximum-scale=' + settings.scale);
	        newContent.push('user-scalable=' + settings.scalable);
	      } else {
	        if (settings.scalable) {
	          newContent.push('user-scalable=' + settings.scalable);
	        }
	        if (settings.minimum) {
	          newContent.push('minimum-scale=' + settings.minimum);
	        }
	        if (settings.maximum) {
	          newContent.push('minimum-scale=' + settings.maximum);
	        }
	      }
	      if (!$viewport) {
	        $viewport = this.document.createElement('meta');
	        $viewport.setAttribute('name', 'viewport');
	        this.document.querySelector('head').appendChild($viewport);
	      }
	      $viewport.setAttribute('content', newContent.join(', '));
	      this.window.scrollTo(0, 0);
	    }
	    return settings;
	  }

	  /**
	   * Event emitter for when the contents has expanded
	   * @private
	   */
	  expand() {
	    this.emit(constants_1.CONTENTS.EXPAND);
	  }

	  /**
	   * Add DOM listeners
	   * @private
	   */
	  listeners() {
	    this.imageLoadListeners();
	    this.mediaQueryListeners();

	    // this.fontLoadListeners();

	    this.addEventListeners();
	    this.addSelectionListeners();

	    // this.transitionListeners();

	    if (typeof ResizeObserver === 'undefined') {
	      this.resizeListeners();
	      this.visibilityListeners();
	    } else {
	      this.resizeObservers();
	    }

	    // this.mutationObservers();

	    this.linksHandler();
	  }

	  /**
	   * Remove DOM listeners
	   * @private
	   */
	  removeListeners() {
	    this.removeEventListeners();
	    this.removeSelectionListeners();
	    if (this.observer) {
	      this.observer.disconnect();
	    }
	    clearTimeout(this.expanding);
	  }

	  /**
	   * Check if size of contents has changed and
	   * emit 'resize' event if it has.
	   * @private
	   */
	  resizeCheck() {
	    let width = this.textWidth();
	    let height = this.textHeight();
	    if (width != this._size.width || height != this._size.height) {
	      this._size = {
	        width: width,
	        height: height
	      };
	      this.onResize && this.onResize(this._size);
	      this.emit(constants_1.CONTENTS.RESIZE, this._size);
	    }
	  }

	  /**
	   * Poll for resize detection
	   * @private
	   */
	  resizeListeners() {
	    // Test size again
	    clearTimeout(this.expanding);
	    requestAnimationFrame(this.resizeCheck.bind(this));
	    this.expanding = setTimeout(this.resizeListeners.bind(this), 350);
	  }

	  /**
	   * Listen for visibility of tab to change
	   * @private
	   */
	  visibilityListeners() {
	    document.addEventListener('visibilitychange', () => {
	      if (document.visibilityState === 'visible' && this.active === false) {
	        this.active = true;
	        this.resizeListeners();
	      } else {
	        this.active = false;
	        clearTimeout(this.expanding);
	      }
	    });
	  }

	  /**
	   * Use css transitions to detect resize
	   * @private
	   */
	  transitionListeners() {
	    let body = this.content;
	    body.style['transitionProperty'] = 'font, font-size, font-size-adjust, font-stretch, font-variation-settings, font-weight, width, height';
	    body.style['transitionDuration'] = '0.001ms';
	    body.style['transitionTimingFunction'] = 'linear';
	    body.style['transitionDelay'] = '0';
	    this._resizeCheck = this.resizeCheck.bind(this);
	    this.document.addEventListener('transitionend', this._resizeCheck);
	  }

	  /**
	   * Listen for media query changes and emit 'expand' event
	   * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
	   * @private
	   */
	  mediaQueryListeners() {
	    var sheets = this.document.styleSheets;
	    var mediaChangeHandler = function (m) {
	      if (m.matches && !this._expanding) {
	        setTimeout(this.expand.bind(this), 1);
	      }
	    }.bind(this);
	    for (var i = 0; i < sheets.length; i += 1) {
	      var rules;
	      // Firefox errors if we access cssRules cross-domain
	      try {
	        rules = sheets[i].cssRules;
	      } catch (e) {
	        return;
	      }
	      if (!rules) return; // Stylesheets changed
	      for (var j = 0; j < rules.length; j += 1) {
	        //if (rules[j].constructor === CSSMediaRule) {
	        if (rules[j].media) {
	          var mql = this.window.matchMedia(rules[j].media.mediaText);
	          mql.addListener(mediaChangeHandler);
	          //mql.onchange = mediaChangeHandler;
	        }
	      }
	    }
	  }

	  /**
	   * Use ResizeObserver to listen for changes in the DOM and check for resize
	   * @private
	   */
	  resizeObservers() {
	    // create an observer instance
	    this.observer = new ResizeObserver(() => {
	      requestAnimationFrame(this.resizeCheck.bind(this));
	    });

	    // pass in the target node
	    this.observer.observe(this.document.documentElement);
	  }

	  /**
	   * Use MutationObserver to listen for changes in the DOM and check for resize
	   * @private
	   */
	  mutationObservers() {
	    // create an observer instance
	    this.observer = new MutationObserver(() => {
	      this.resizeCheck();
	    });

	    // configuration of the observer:
	    let config = {
	      attributes: true,
	      childList: true,
	      characterData: true,
	      subtree: true
	    };

	    // pass in the target node, as well as the observer options
	    this.observer.observe(this.document, config);
	  }

	  /**
	   * Test if images are loaded or add listener for when they load
	   * @private
	   */
	  imageLoadListeners() {
	    var images = this.document.querySelectorAll('img');
	    var img;
	    for (var i = 0; i < images.length; i++) {
	      img = images[i];
	      if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
	        img.onload = this.expand.bind(this);
	      }
	    }
	  }

	  /**
	   * Listen for font load and check for resize when loaded
	   * @private
	   */
	  fontLoadListeners() {
	    if (!this.document || !this.document.fonts) {
	      return;
	    }
	    this.document.fonts.ready.then(function () {
	      this.resizeCheck();
	    }.bind(this));
	  }

	  /**
	   * Get the documentElement
	   * @returns {element} documentElement
	   */
	  root() {
	    if (!this.document) return null;
	    return this.document.documentElement;
	  }

	  /**
	   * Get the location offset of a EpubCFI or an #id
	   * @param {string | EpubCFI} target
	   * @param {string} [ignoreClass] for the cfi
	   * @returns { {left: Number, top: Number }
	   */
	  locationOf(target, ignoreClass) {
	    var position;
	    var targetPos = {
	      left: 0,
	      top: 0
	    };
	    if (!this.document) return targetPos;
	    if (this.epubcfi.isCfiString(target)) {
	      let range = new EpubCFI(target).toRange(this.document, ignoreClass);
	      if (range) {
	        try {
	          if (!range.endContainer || range.startContainer == range.endContainer && range.startOffset == range.endOffset) {
	            // If the end for the range is not set, it results in collapsed becoming
	            // true. This in turn leads to inconsistent behaviour when calling
	            // getBoundingRect. Wrong bounds lead to the wrong page being displayed.
	            // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15684911/
	            let pos = range.startContainer.textContent.indexOf(' ', range.startOffset);
	            if (pos == -1) {
	              pos = range.startContainer.textContent.length;
	            }
	            range.setEnd(range.startContainer, pos);
	          }
	        } catch (e) {
	          console.error('setting end offset to start container length failed', e);
	        }
	        if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
	          position = range.startContainer.getBoundingClientRect();
	          targetPos.left = position.left;
	          targetPos.top = position.top;
	        } else {
	          // Webkit does not handle collapsed range bounds correctly
	          // https://bugs.webkit.org/show_bug.cgi?id=138949

	          // Construct a new non-collapsed range
	          if (isWebkit) {
	            let container = range.startContainer;
	            let newRange = new Range();
	            try {
	              if (container.nodeType === ELEMENT_NODE) {
	                position = container.getBoundingClientRect();
	              } else if (range.startOffset + 2 < container.length) {
	                newRange.setStart(container, range.startOffset);
	                newRange.setEnd(container, range.startOffset + 2);
	                position = newRange.getBoundingClientRect();
	              } else if (range.startOffset - 2 > 0) {
	                newRange.setStart(container, range.startOffset - 2);
	                newRange.setEnd(container, range.startOffset);
	                position = newRange.getBoundingClientRect();
	              } else {
	                // empty, return the parent element
	                position = container.parentNode.getBoundingClientRect();
	              }
	            } catch (e) {
	              console.error(e, e.stack);
	            }
	          } else {
	            position = range.getBoundingClientRect();
	          }
	        }
	      }
	    } else if (typeof target === 'string' && target.indexOf('#') > -1) {
	      let id = target.substring(target.indexOf('#') + 1);
	      let el = this.document.getElementById(id);
	      if (el) {
	        if (isWebkit) {
	          // Webkit reports incorrect bounding rects in Columns
	          let newRange = new Range();
	          newRange.selectNode(el);
	          position = newRange.getBoundingClientRect();
	        } else {
	          position = el.getBoundingClientRect();
	        }
	      }
	    }
	    if (position) {
	      targetPos.left = position.left;
	      targetPos.top = position.top;
	    }
	    return targetPos;
	  }

	  /**
	   * Append a stylesheet link to the document head
	   * @param {string} src url
	   */
	  addStylesheet(src) {
	    return new Promise(function (resolve) {
	      var $stylesheet;
	      var ready = false;
	      if (!this.document) {
	        resolve(false);
	        return;
	      }

	      // Check if link already exists
	      $stylesheet = this.document.querySelector("link[href='" + src + "']");
	      if ($stylesheet) {
	        resolve(true);
	        return; // already present
	      }
	      $stylesheet = this.document.createElement('link');
	      $stylesheet.type = 'text/css';
	      $stylesheet.rel = 'stylesheet';
	      $stylesheet.href = src;
	      $stylesheet.onload = $stylesheet.onreadystatechange = function () {
	        if (!ready && (!this.readyState || this.readyState == 'complete')) {
	          ready = true;
	          // Let apply
	          setTimeout(() => {
	            resolve(true);
	          }, 1);
	        }
	      };
	      this.document.head.appendChild($stylesheet);
	    }.bind(this));
	  }
	  _getStylesheetNode(key) {
	    var styleEl;
	    key = 'epubjs-inserted-css-' + (key || '');
	    if (!this.document) return false;

	    // Check if link already exists
	    styleEl = this.document.getElementById(key);
	    if (!styleEl) {
	      styleEl = this.document.createElement('style');
	      styleEl.id = key;
	      // Append style element to head
	      this.document.head.appendChild(styleEl);
	    }
	    return styleEl;
	  }

	  /**
	   * Append stylesheet css
	   * @param {string} serializedCss
	   * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
	   */
	  addStylesheetCss(serializedCss, key) {
	    if (!this.document || !serializedCss) return false;
	    var styleEl;
	    styleEl = this._getStylesheetNode(key);
	    styleEl.innerHTML = serializedCss;
	    return true;
	  }

	  /**
	   * Append stylesheet rules to a generate stylesheet
	   * Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
	   * Object: https://github.com/desirable-objects/json-to-css
	   * @param {array | object} rules
	   * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
	   */
	  addStylesheetRules(rules, key) {
	    var styleSheet;
	    if (!this.document || !rules || rules.length === 0) return;

	    // Grab style sheet
	    styleSheet = this._getStylesheetNode(key).sheet;
	    if (Object.prototype.toString.call(rules) === '[object Array]') {
	      for (var i = 0, rl = rules.length; i < rl; i++) {
	        var j = 1,
	          rule = rules[i],
	          selector = rules[i][0],
	          propStr = '';
	        // If the second argument of a rule is an array of arrays, correct our variables.
	        if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
	          rule = rule[1];
	          j = 0;
	        }
	        for (var pl = rule.length; j < pl; j++) {
	          var prop = rule[j];
	          propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
	        }

	        // Insert CSS Rule
	        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
	      }
	    } else {
	      const selectors = Object.keys(rules);
	      selectors.forEach(selector => {
	        const definition = rules[selector];
	        if (Array.isArray(definition)) {
	          definition.forEach(item => {
	            const _rules = Object.keys(item);
	            const result = _rules.map(rule => {
	              return `${rule}:${item[rule]}`;
	            }).join(';');
	            styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
	          });
	        } else {
	          const _rules = Object.keys(definition);
	          const result = _rules.map(rule => {
	            return `${rule}:${definition[rule]}`;
	          }).join(';');
	          styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
	        }
	      });
	    }
	  }

	  /**
	   * Append a script tag to the document head
	   * @param {string} src url
	   * @returns {Promise} loaded
	   */
	  addScript(src) {
	    return new Promise(function (resolve) {
	      var $script;
	      var ready = false;
	      if (!this.document) {
	        resolve(false);
	        return;
	      }
	      $script = this.document.createElement('script');
	      $script.type = 'text/javascript';
	      $script.async = true;
	      $script.src = src;
	      $script.onload = $script.onreadystatechange = function () {
	        if (!ready && (!this.readyState || this.readyState == 'complete')) {
	          ready = true;
	          setTimeout(function () {
	            resolve(true);
	          }, 1);
	        }
	      };
	      this.document.head.appendChild($script);
	    }.bind(this));
	  }

	  /**
	   * Add a class to the contents container
	   * @param {string} className
	   */
	  addClass(className) {
	    var content;
	    if (!this.document) return;
	    content = this.content || this.document.body;
	    if (content) {
	      content.classList.add(className);
	    }
	  }

	  /**
	   * Remove a class from the contents container
	   * @param {string} removeClass
	   */
	  removeClass(className) {
	    var content;
	    if (!this.document) return;
	    content = this.content || this.document.body;
	    if (content) {
	      content.classList.remove(className);
	    }
	  }

	  /**
	   * Add DOM event listeners
	   * @private
	   */
	  addEventListeners() {
	    if (!this.document) {
	      return;
	    }
	    this._triggerEvent = this.triggerEvent.bind(this);
	    constants_2.forEach(function (eventName) {
	      this.document.addEventListener(eventName, this._triggerEvent, {
	        passive: true
	      });
	    }, this);
	  }

	  /**
	   * Remove DOM event listeners
	   * @private
	   */
	  removeEventListeners() {
	    if (!this.document) {
	      return;
	    }
	    constants_2.forEach(function (eventName) {
	      this.document.removeEventListener(eventName, this._triggerEvent, {
	        passive: true
	      });
	    }, this);
	    this._triggerEvent = undefined;
	  }

	  /**
	   * Emit passed browser events
	   * @private
	   */
	  triggerEvent(e) {
	    this.emit(e.type, e);
	  }

	  /**
	   * Add listener for text selection
	   * @private
	   */
	  addSelectionListeners() {
	    if (!this.document) {
	      return;
	    }
	    this._onSelectionChange = this.onSelectionChange.bind(this);
	    this.document.addEventListener('selectionchange', this._onSelectionChange, {
	      passive: true
	    });
	  }

	  /**
	   * Remove listener for text selection
	   * @private
	   */
	  removeSelectionListeners() {
	    if (!this.document) {
	      return;
	    }
	    this.document.removeEventListener('selectionchange', this._onSelectionChange, {
	      passive: true
	    });
	    this._onSelectionChange = undefined;
	  }

	  /**
	   * Handle getting text on selection
	   * @private
	   */
	  onSelectionChange() {
	    if (this.selectionEndTimeout) {
	      clearTimeout(this.selectionEndTimeout);
	    }
	    this.selectionEndTimeout = setTimeout(function () {
	      var selection = this.window.getSelection();
	      this.triggerSelectedEvent(selection);
	    }.bind(this), 250);
	  }

	  /**
	   * Emit event on text selection
	   * @private
	   */
	  triggerSelectedEvent(selection) {
	    var range, cfirange;
	    if (selection && selection.rangeCount > 0) {
	      range = selection.getRangeAt(0);
	      if (!range.collapsed) {
	        // cfirange = this.section.cfiFromRange(range);
	        cfirange = new EpubCFI(range, this.cfiBase).toString();
	        this.emit(constants_1.CONTENTS.SELECTED, cfirange);
	        this.emit(constants_1.CONTENTS.SELECTED_RANGE, range);
	      }
	    }
	  }

	  /**
	   * Get a Dom Range from EpubCFI
	   * @param {EpubCFI} _cfi
	   * @param {string} [ignoreClass]
	   * @returns {Range} range
	   */
	  range(_cfi, ignoreClass) {
	    var cfi = new EpubCFI(_cfi);
	    return cfi.toRange(this.document, ignoreClass);
	  }

	  /**
	   * Get an EpubCFI from a Dom Range
	   * @param {Range} range
	   * @param {string} [ignoreClass]
	   * @returns {EpubCFI} cfi
	   */
	  cfiFromRange(range, ignoreClass) {
	    return new EpubCFI(range, this.cfiBase, ignoreClass).toString();
	  }

	  /**
	   * Get an EpubCFI from a Dom node
	   * @param {node} node
	   * @param {string} [ignoreClass]
	   * @returns {EpubCFI} cfi
	   */
	  cfiFromNode(node, ignoreClass) {
	    return new EpubCFI(node, this.cfiBase, ignoreClass).toString();
	  }

	  // TODO: find where this is used - remove?
	  map(layout) {
	    var map = new Mapping(layout);
	    return map.section();
	  }

	  /**
	   * Size the contents to a given width and height
	   * @param {number} [width]
	   * @param {number} [height]
	   */
	  size(width, height) {
	    var viewport = {
	      scale: 1.0,
	      scalable: 'no'
	    };
	    this.layoutStyle('scrolling');
	    if (width >= 0) {
	      this.width(width);
	      viewport.width = width;
	      this.css('padding', '0 ' + width / 12 + 'px');
	    }
	    if (height >= 0) {
	      this.height(height);
	      viewport.height = height;
	    }
	    this.css('margin', '0');
	    this.css('box-sizing', 'border-box');
	    this.viewport(viewport);
	  }

	  /**
	   * Apply columns to the contents for pagination
	   * @param {number} width
	   * @param {number} height
	   * @param {number} columnWidth
	   * @param {number} gap
	   */
	  columns(width, height, columnWidth, gap, dir) {
	    let COLUMN_AXIS = core_8('column-axis');
	    let COLUMN_GAP = core_8('column-gap');
	    let COLUMN_WIDTH = core_8('column-width');
	    let COLUMN_FILL = core_8('column-fill');
	    let writingMode = this.writingMode();
	    let axis = writingMode.indexOf('vertical') === 0 ? 'vertical' : 'horizontal';
	    this.layoutStyle('paginated');
	    if (dir === 'rtl' && axis === 'horizontal') {
	      this.direction(dir);
	    }
	    this.width(width);
	    this.height(height);

	    // Deal with Mobile trying to scale to viewport
	    this.viewport({
	      width: width,
	      height: height,
	      scale: 1.0,
	      scalable: 'no'
	    });

	    // TODO: inline-block needs more testing
	    // Fixes Safari column cut offs, but causes RTL issues
	    // this.css("display", "inline-block");

	    this.css('overflow-y', 'hidden');
	    this.css('margin', '0', true);
	    if (axis === 'vertical') {
	      this.css('padding-top', gap / 2 + 'px', true);
	      this.css('padding-bottom', gap / 2 + 'px', true);
	      this.css('padding-left', '20px');
	      this.css('padding-right', '20px');
	      this.css(COLUMN_AXIS, 'vertical');
	    } else {
	      this.css('padding-top', '20px');
	      this.css('padding-bottom', '20px');
	      this.css('padding-left', gap / 2 + 'px', true);
	      this.css('padding-right', gap / 2 + 'px', true);
	      this.css(COLUMN_AXIS, 'horizontal');
	    }
	    this.css('box-sizing', 'border-box');
	    this.css('max-width', 'inherit');
	    this.css(COLUMN_FILL, 'auto');
	    this.css(COLUMN_GAP, gap + 'px');
	    this.css(COLUMN_WIDTH, columnWidth + 'px');

	    // Fix glyph clipping in WebKit
	    // https://github.com/futurepress/epub.js/issues/983
	    this.css('-webkit-line-box-contain', 'block glyphs replaced');
	  }

	  /**
	   * Scale contents from center
	   * @param {number} scale
	   * @param {number} offsetX
	   * @param {number} offsetY
	   */
	  scaler(scale, offsetX, offsetY) {
	    var scaleStr = 'scale(' + scale + ')';
	    var translateStr = '';
	    // this.css("position", "absolute"));
	    this.css('transform-origin', 'top left');
	    if (offsetX >= 0 || offsetY >= 0) {
	      translateStr = ' translate(' + (offsetX || 0) + 'px, ' + (offsetY || 0) + 'px )';
	    }
	    this.css('transform', scaleStr + translateStr);
	  }

	  /**
	   * Fit contents into a fixed width and height
	   * @param {number} width
	   * @param {number} height
	   */
	  fit(width, height, section) {
	    var viewport = this.viewport();
	    var viewportWidth = parseInt(viewport.width);
	    var viewportHeight = parseInt(viewport.height);
	    var widthScale = width / viewportWidth;
	    var heightScale = height / viewportHeight;
	    var scale = widthScale < heightScale ? widthScale : heightScale;

	    // the translate does not work as intended, elements can end up unaligned
	    // var offsetY = (height - (viewportHeight * scale)) / 2;
	    // var offsetX = 0;
	    // if (this.sectionIndex % 2 === 1) {
	    // 	offsetX = width - (viewportWidth * scale);
	    // }

	    this.layoutStyle('paginated');

	    // scale needs width and height to be set
	    this.width(viewportWidth);
	    this.height(viewportHeight);
	    this.overflow('hidden');

	    // Scale to the correct size
	    this.scaler(scale, 0, 0);
	    // this.scaler(scale, offsetX > 0 ? offsetX : 0, offsetY);

	    // background images are not scaled by transform
	    this.css('background-size', viewportWidth * scale + 'px ' + viewportHeight * scale + 'px');
	    this.css('background-color', 'transparent');
	    if (section && section.properties.includes('page-spread-left')) {
	      // set margin since scale is weird
	      var marginLeft = width - viewportWidth * scale;
	      this.css('margin-left', marginLeft + 'px');
	    }
	  }

	  /**
	   * Set the direction of the text
	   * @param {string} [dir="ltr"] "rtl" | "ltr"
	   */
	  direction(dir) {
	    if (this.documentElement) {
	      this.documentElement.style['direction'] = dir;
	    }
	  }
	  mapPage(cfiBase, layout, start, end, dev) {
	    var mapping = new Mapping(layout, dev);
	    return mapping.page(this, cfiBase, start, end);
	  }

	  /**
	   * Emit event when link in content is clicked
	   * @private
	   */
	  linksHandler() {
	    replacements_4(this.content, href => {
	      this.emit(constants_1.CONTENTS.LINK_CLICKED, href);
	    });
	  }

	  /**
	   * Set the writingMode of the text
	   * @param {string} [mode="horizontal-tb"] "horizontal-tb" | "vertical-rl" | "vertical-lr"
	   */
	  writingMode(mode) {
	    let WRITING_MODE = core_8('writing-mode');
	    if (mode && this.documentElement) {
	      this.documentElement.style[WRITING_MODE] = mode;
	    }
	    return this.window.getComputedStyle(this.documentElement)[WRITING_MODE] || '';
	  }

	  /**
	   * Set the layoutStyle of the content
	   * @param {string} [style="paginated"] "scrolling" | "paginated"
	   * @private
	   */
	  layoutStyle(style) {
	    if (style) {
	      this._layoutStyle = style;
	      navigator.epubReadingSystem.layoutStyle = this._layoutStyle;
	    }
	    return this._layoutStyle || 'paginated';
	  }

	  /**
	   * Add the epubReadingSystem object to the navigator
	   * @param {string} name
	   * @param {string} version
	   * @private
	   */
	  epubReadingSystem(name, version) {
	    navigator.epubReadingSystem = {
	      name: name,
	      version: version,
	      layoutStyle: this.layoutStyle(),
	      hasFeature: function (feature) {
	        switch (feature) {
	          case 'dom-manipulation':
	            return true;
	          case 'layout-changes':
	            return true;
	          case 'touch-events':
	            return true;
	          case 'mouse-events':
	            return true;
	          case 'keyboard-events':
	            return true;
	          case 'spine-scripting':
	            return false;
	          default:
	            return false;
	        }
	      }
	    };
	    return navigator.epubReadingSystem;
	  }
	  destroy() {
	    // this.document.removeEventListener('transitionend', this._resizeCheck);

	    this.removeListeners();
	  }
	}
	eventEmitter(Contents.prototype);

	function createElement(name) {
	    return document.createElementNS('http://www.w3.org/2000/svg', name);
	}
	var svg = {
	    createElement: createElement
	};

	var events = {
	    proxyMouse: proxyMouse
	};
	function proxyMouse(target, tracked) {
	    let eventTarget = target;
	    if (target.nodeName === 'iframe' || target.nodeName === 'IFRAME') {
	        try {
	            eventTarget = target.contentDocument || target;
	        }
	        catch (_a) {
	            eventTarget = target;
	        }
	    }
	    function dispatch(e) {
	        // We walk through the set of tracked elements in reverse order so that
	        // events are sent to those most recently added first.
	        //
	        // This is the least surprising behaviour as it simulates the way the
	        // browser would work if items added later were drawn "on top of"
	        // earlier ones.
	        for (let i = tracked.length - 1; i >= 0; i--) {
	            const t = tracked[i];
	            let x, y;
	            if ('touches' in e && e.touches.length) {
	                x = e.touches[0].clientX;
	                y = e.touches[0].clientY;
	            }
	            else {
	                x = e.clientX;
	                y = e.clientY;
	            }
	            if (!contains(t, target, x, y))
	                continue;
	            t.dispatchEvent(clone(e));
	            break;
	        }
	    }
	    for (const ev of ['mouseup', 'mousedown', 'click']) {
	        eventTarget.addEventListener(ev, (e) => dispatch(e), false);
	    }
	    eventTarget.addEventListener('touchstart', (e) => dispatch(e), false);
	}
	/**
	 * Clone a mouse event object.
	 */
	function clone(e) {
	    if ('touches' in e) {
	        // TouchEvent: cloning is not supported, just return the original event
	        return e;
	    }
	    const opts = Object.assign({}, e, { bubbles: false });
	    return new MouseEvent(e.type, opts);
	}
	/**
	 * Check if the item contains the point denoted by the passed coordinates
	 */
	function contains(item, target, x, y) {
	    const offset = target.getBoundingClientRect();
	    function rectContains(r, x, y) {
	        const top = r.top - offset.top;
	        const left = r.left - offset.left;
	        const bottom = top + r.height;
	        const right = left + r.width;
	        return top <= y && left <= x && bottom > y && right > x;
	    }
	    // Check overall bounding box first
	    const rect = item.getBoundingClientRect();
	    if (!rectContains(rect, x, y)) {
	        return false;
	    }
	    // Then continue to check each child rect
	    const rects = item.getClientRects();
	    for (let i = 0, len = rects.length; i < len; i++) {
	        if (rectContains(rects[i], x, y)) {
	            return true;
	        }
	    }
	    return false;
	}

	class Pane {
	    constructor(target, container = document.body) {
	        this.target = target;
	        this.element = svg.createElement('svg');
	        this.marks = [];
	        // Match the coordinates of the target element
	        this.element.style.position = 'absolute';
	        this.element.setAttribute('pointer-events', 'none');
	        // Set up mouse event proxying between the target element and the marks
	        events.proxyMouse(this.target, this.marks);
	        this.container = container;
	        this.container.appendChild(this.element);
	        this.render();
	    }
	    addMark(mark) {
	        const g = svg.createElement('g');
	        this.element.appendChild(g);
	        mark.bind(g, this.container);
	        this.marks.push(mark);
	        mark.render();
	        return mark;
	    }
	    removeMark(mark) {
	        const idx = this.marks.indexOf(mark);
	        if (idx === -1) {
	            return;
	        }
	        const el = mark.unbind();
	        if (el) {
	            this.element.removeChild(el);
	        }
	        this.marks.splice(idx, 1);
	    }
	    render() {
	        setCoords(this.element, coords(this.target, this.container));
	        for (let m of this.marks) {
	            m.render();
	        }
	    }
	}
	class Mark {
	    constructor() {
	        this.container = null;
	        this.range = null;
	        this.element = null;
	    }
	    bind(element, container) {
	        this.element = element;
	        this.container = container;
	    }
	    unbind() {
	        const el = this.element;
	        this.element = null;
	        return el;
	    }
	    render() { }
	    dispatchEvent(e) {
	        if (!this.element)
	            return;
	        this.element.dispatchEvent(e);
	    }
	    getBoundingClientRect() {
	        // Always return a DOMRect, fallback to a default zero rect if element is missing
	        if (this.element) {
	            return this.element.getBoundingClientRect();
	        }
	        // Fallback: return a DOMRect with all zeros
	        return new DOMRect(0, 0, 0, 0);
	    }
	    getClientRects() {
	        var _a;
	        const rects = [];
	        let el = (_a = this.element) === null || _a === void 0 ? void 0 : _a.firstChild;
	        while (el) {
	            if (el instanceof Element) {
	                rects.push(el.getBoundingClientRect());
	            }
	            el = el.nextSibling;
	        }
	        return rects;
	    }
	    filteredRanges() {
	        if (!this.range) {
	            return [];
	        }
	        // De-duplicate the boxes
	        const rects = Array.from(this.range.getClientRects());
	        const stringRects = rects.map((r) => JSON.stringify(r));
	        const setRects = new Set(stringRects);
	        return Array.from(setRects).map((sr) => JSON.parse(sr));
	    }
	}
	class Highlight extends Mark {
	    constructor(range, className, data = {}, attributes = {}) {
	        super();
	        this.range = range;
	        this.className = className;
	        this.data = data;
	        this.attributes = attributes;
	    }
	    bind(element, container) {
	        super.bind(element, container);
	        for (let attr in this.data) {
	            if (Object.prototype.hasOwnProperty.call(this.data, attr)) {
	                if (this.element instanceof HTMLElement) {
	                    this.element.dataset[attr] = this.data[attr];
	                }
	            }
	        }
	        for (let attr in this.attributes) {
	            if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
	                if (this.element instanceof HTMLElement ||
	                    this.element instanceof SVGElement) {
	                    this.element.setAttribute(attr, this.attributes[attr]);
	                }
	            }
	        }
	        if (this.className) {
	            if (this.element instanceof HTMLElement ||
	                this.element instanceof SVGElement) {
	                this.element.classList.add(this.className);
	            }
	        }
	    }
	    render() {
	        if (!this.element || !this.container)
	            return;
	        while (this.element.firstChild) {
	            this.element.removeChild(this.element.firstChild);
	        }
	        const docFrag = this.element.ownerDocument.createDocumentFragment();
	        const filtered = this.filteredRanges();
	        const offset = this.element.getBoundingClientRect();
	        const container = this.container.getBoundingClientRect();
	        for (let i = 0, len = filtered.length; i < len; i++) {
	            const r = filtered[i];
	            const el = svg.createElement('rect');
	            el.setAttribute('x', String(r.left - offset.left + container.left));
	            el.setAttribute('y', String(r.top - offset.top + container.top));
	            el.setAttribute('height', String(r.height));
	            el.setAttribute('width', String(r.width));
	            docFrag.appendChild(el);
	        }
	        this.element.appendChild(docFrag);
	    }
	}
	class Underline extends Highlight {
	    constructor(range, className, data = {}, attributes = {}) {
	        super(range, className, data, attributes);
	    }
	    render() {
	        if (!this.element || !this.container)
	            return;
	        while (this.element.firstChild) {
	            this.element.removeChild(this.element.firstChild);
	        }
	        const docFrag = this.element.ownerDocument.createDocumentFragment();
	        const filtered = this.filteredRanges();
	        const offset = this.element.getBoundingClientRect();
	        const container = this.container.getBoundingClientRect();
	        for (let i = 0, len = filtered.length; i < len; i++) {
	            const r = filtered[i];
	            const rect = svg.createElement('rect');
	            rect.setAttribute('x', String(r.left - offset.left + container.left));
	            rect.setAttribute('y', String(r.top - offset.top + container.top));
	            rect.setAttribute('height', String(r.height));
	            rect.setAttribute('width', String(r.width));
	            rect.setAttribute('fill', 'none');
	            const line = svg.createElement('line');
	            line.setAttribute('x1', String(r.left - offset.left + container.left));
	            line.setAttribute('x2', String(r.left - offset.left + container.left + r.width));
	            line.setAttribute('y1', String(r.top - offset.top + container.top + r.height - 1));
	            line.setAttribute('y2', String(r.top - offset.top + container.top + r.height - 1));
	            line.setAttribute('stroke-width', '1');
	            line.setAttribute('stroke', 'black');
	            line.setAttribute('stroke-linecap', 'square');
	            docFrag.appendChild(rect);
	            docFrag.appendChild(line);
	        }
	        this.element.appendChild(docFrag);
	    }
	}
	function coords(el, container) {
	    const offset = container.getBoundingClientRect();
	    const rect = el.getBoundingClientRect();
	    return {
	        top: rect.top - offset.top,
	        left: rect.left - offset.left,
	        height: el.scrollHeight,
	        width: el.scrollWidth
	    };
	}
	function setCoords(el, coords) {
	    el.style.setProperty('top', `${coords.top}px`, 'important');
	    el.style.setProperty('left', `${coords.left}px`, 'important');
	    el.style.setProperty('height', `${coords.height}px`, 'important');
	    el.style.setProperty('width', `${coords.width}px`, 'important');
	}

	// Subclass Pane to inject custom SVG styling
	class StyledPane extends Pane {
	  constructor(target, container, transparency) {
	    super(target, container);
	    console.debug('[StyledPane] Used for overlay');
	    // Add custom styling to the SVG element only if transparency is true
	    if (transparency) {
	      console.debug('[StyledPane] Transparency block executed');
	      this.element.style.zIndex = '-3';
	      this.element.style.position = 'absolute';
	    }
	    // You can add more styles if needed
	    this.element.style.zIndex = '-3';
	    this.element.style.position = 'absolute';
	  }
	}
	class IframeView {
	  constructor(section, options) {
	    this.settings = core_10({
	      ignoreClass: '',
	      axis: undefined,
	      //options.layout && options.layout.props.flow === "scrolled" ? "vertical" : "horizontal",
	      direction: undefined,
	      width: 0,
	      height: 0,
	      layout: undefined,
	      globalLayoutProperties: {},
	      method: undefined,
	      forceRight: false,
	      allowScriptedContent: false,
	      allowPopups: false,
	      transparency: false // New option for transparent background
	    }, options || {});
	    this.id = 'epubjs-view-' + core_3();
	    this.section = section;
	    this.index = section.index;
	    this.element = this.container(this.settings.axis);
	    this.added = false;
	    this.displayed = false;
	    this.rendered = false;

	    // this.width  = this.settings.width;
	    // this.height = this.settings.height;

	    this.fixedWidth = 0;
	    this.fixedHeight = 0;

	    // Blank Cfi for Parsing
	    this.epubcfi = new EpubCFI();
	    this.layout = this.settings.layout;
	    // Dom events to listen for
	    // this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];

	    this.pane = undefined;
	    this.highlights = {};
	    this.underlines = {};
	    this.marks = {};
	  }
	  container(axis) {
	    var element = document.createElement('div');
	    element.classList.add('epub-view');

	    // this.element.style.minHeight = "100px";
	    element.style.height = '0px';
	    element.style.width = '0px';
	    element.style.overflow = 'hidden';
	    element.style.position = 'relative';
	    element.style.display = 'block';
	    if (axis && axis == 'horizontal') {
	      element.style.flex = 'none';
	    } else {
	      element.style.flex = 'initial';
	    }
	    return element;
	  }
	  create() {
	    if (this.iframe) {
	      return this.iframe;
	    }
	    if (!this.element) {
	      this.element = this.createContainer();
	    }
	    this.iframe = document.createElement('iframe');
	    this.iframe.id = this.id;
	    this.iframe.scrolling = 'no'; // Might need to be removed: breaks ios width calculations
	    this.iframe.style.overflow = 'hidden';
	    this.iframe.seamless = 'seamless';
	    this.iframe.style.border = 'none';

	    // Set transparent background if option is enabled
	    if (this.settings.transparency) {
	      this.iframe.style.background = 'transparent';
	      this.iframe.allowTransparency = 'true';
	    }

	    // sandbox
	    this.iframe.sandbox = 'allow-same-origin';
	    if (this.settings.allowScriptedContent) {
	      this.iframe.sandbox += ' allow-scripts';
	    }
	    if (this.settings.allowPopups) {
	      this.iframe.sandbox += ' allow-popups';
	    }
	    this.iframe.setAttribute('enable-annotation', 'true');
	    this.resizing = true;

	    // this.iframe.style.display = "none";
	    this.element.style.visibility = 'hidden';
	    this.iframe.style.visibility = 'hidden';
	    this.iframe.style.width = '0';
	    this.iframe.style.height = '0';
	    this._width = 0;
	    this._height = 0;
	    this.element.setAttribute('ref', this.index);
	    this.added = true;
	    this.elementBounds = core_14(this.element);

	    // if(width || height){
	    //   this.resize(width, height);
	    // } else if(this.width && this.height){
	    //   this.resize(this.width, this.height);
	    // } else {
	    //   this.iframeBounds = bounds(this.iframe);
	    // }

	    if ('srcdoc' in this.iframe) {
	      this.supportsSrcdoc = true;
	    } else {
	      this.supportsSrcdoc = false;
	    }
	    if (!this.settings.method) {
	      this.settings.method = this.supportsSrcdoc ? 'srcdoc' : 'write';
	    }
	    return this.iframe;
	  }
	  render(request) {
	    // view.onLayout = this.layout.format.bind(this.layout);
	    this.create();

	    // Fit to size of the container, apply padding
	    this.size();
	    if (!this.sectionRender) {
	      this.sectionRender = this.section.render(request);
	    }

	    // Render Chain
	    return this.sectionRender.then(function (contents) {
	      return this.load(contents);
	    }.bind(this)).then(function () {
	      // find and report the writingMode axis
	      let writingMode = this.contents.writingMode();

	      // Set the axis based on the flow and writing mode
	      let axis;
	      if (this.settings.flow === 'scrolled') {
	        axis = writingMode.indexOf('vertical') === 0 ? 'horizontal' : 'vertical';
	      } else {
	        axis = writingMode.indexOf('vertical') === 0 ? 'vertical' : 'horizontal';
	      }
	      if (writingMode.indexOf('vertical') === 0 && this.settings.flow === 'paginated') {
	        this.layout.delta = this.layout.height;
	      }
	      this.setAxis(axis);
	      this.emit(constants_1.VIEWS.AXIS, axis);
	      this.setWritingMode(writingMode);
	      this.emit(constants_1.VIEWS.WRITING_MODE, writingMode);

	      // apply the layout function to the contents
	      this.layout.format(this.contents, this.section, this.axis);

	      // Listen for events that require an expansion of the iframe
	      this.addListeners();
	      return new Promise(resolve => {
	        // Expand the iframe to the full size of the content
	        this.expand();
	        if (this.settings.forceRight) {
	          this.element.style.marginLeft = this.width() + 'px';
	        }
	        resolve();
	      });
	    }.bind(this), function (e) {
	      this.emit(constants_1.VIEWS.LOAD_ERROR, e);
	      return new Promise((resolve, reject) => {
	        reject(e);
	      });
	    }.bind(this)).then(function () {
	      this.emit(constants_1.VIEWS.RENDERED, this.section);
	    }.bind(this));
	  }
	  reset() {
	    if (this.iframe) {
	      this.iframe.style.width = '0';
	      this.iframe.style.height = '0';
	      this._width = 0;
	      this._height = 0;
	      this._textWidth = undefined;
	      this._contentWidth = undefined;
	      this._textHeight = undefined;
	      this._contentHeight = undefined;
	    }
	    this._needsReframe = true;
	  }

	  // Determine locks base on settings
	  size(_width, _height) {
	    var width = _width || this.settings.width;
	    var height = _height || this.settings.height;
	    if (this.layout.name === 'pre-paginated') {
	      this.lock('both', width, height);
	    } else if (this.settings.axis === 'horizontal') {
	      this.lock('height', width, height);
	    } else {
	      this.lock('width', width, height);
	    }
	    this.settings.width = width;
	    this.settings.height = height;
	  }

	  // Lock an axis to element dimensions, taking borders into account
	  lock(what, width, height) {
	    var elBorders = core_15(this.element);
	    var iframeBorders;
	    if (this.iframe) {
	      iframeBorders = core_15(this.iframe);
	    } else {
	      iframeBorders = {
	        width: 0,
	        height: 0
	      };
	    }
	    if (what == 'width' && core_6(width)) {
	      this.lockedWidth = width - elBorders.width - iframeBorders.width;
	      // this.resize(this.lockedWidth, width); //  width keeps ratio correct
	    }
	    if (what == 'height' && core_6(height)) {
	      this.lockedHeight = height - elBorders.height - iframeBorders.height;
	      // this.resize(width, this.lockedHeight);
	    }
	    if (what === 'both' && core_6(width) && core_6(height)) {
	      this.lockedWidth = width - elBorders.width - iframeBorders.width;
	      this.lockedHeight = height - elBorders.height - iframeBorders.height;
	      // this.resize(this.lockedWidth, this.lockedHeight);
	    }
	    if (this.displayed && this.iframe) {
	      // this.contents.layout();
	      this.expand();
	    }
	  }

	  // Resize a single axis based on content dimensions
	  expand() {
	    var width = this.lockedWidth;
	    var height = this.lockedHeight;
	    var columns;
	    if (!this.iframe || this._expanding) return;
	    this._expanding = true;
	    if (this.layout.name === 'pre-paginated') {
	      width = this.layout.columnWidth;
	      height = this.layout.height;
	    }
	    // Expand Horizontally
	    else if (this.settings.axis === 'horizontal') {
	      // Get the width of the text
	      width = this.contents.textWidth();
	      if (width % this.layout.pageWidth > 0) {
	        width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
	      }
	      if (this.settings.forceEvenPages) {
	        columns = width / this.layout.pageWidth;
	        if (this.layout.divisor > 1 && this.layout.name === 'reflowable' && columns % 2 > 0) {
	          // add a blank page
	          width += this.layout.pageWidth;
	        }
	      }
	    } // Expand Vertically
	    else if (this.settings.axis === 'vertical') {
	      height = this.contents.textHeight();
	      if (this.settings.flow === 'paginated' && height % this.layout.height > 0) {
	        height = Math.ceil(height / this.layout.height) * this.layout.height;
	      }
	    }

	    // Only Resize if dimensions have changed or
	    // if Frame is still hidden, so needs reframing
	    if (this._needsReframe || width != this._width || height != this._height) {
	      this.reframe(width, height);
	    }
	    this._expanding = false;
	  }
	  reframe(width, height) {
	    var size;
	    if (core_6(width)) {
	      this.element.style.width = width + 'px';
	      this.iframe.style.width = width + 'px';
	      this._width = width;
	    }
	    if (core_6(height)) {
	      this.element.style.height = height + 'px';
	      this.iframe.style.height = height + 'px';
	      this._height = height;
	    }
	    let widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
	    let heightDelta = this.prevBounds ? height - this.prevBounds.height : height;
	    size = {
	      width: width,
	      height: height,
	      widthDelta: widthDelta,
	      heightDelta: heightDelta
	    };
	    this.pane && this.pane.render();
	    requestAnimationFrame(() => {
	      let mark;
	      for (let m in this.marks) {
	        if (Object.prototype.hasOwnProperty.call(this.marks, m)) {
	          mark = this.marks[m];
	          this.placeMark(mark.element, mark.range);
	        }
	      }
	    });
	    this.onResize(this, size);
	    this.emit(constants_1.VIEWS.RESIZED, size);
	    this.prevBounds = size;
	    this.elementBounds = core_14(this.element);
	  }
	  load(contents) {
	    var loading = new core_1();
	    var loaded = loading.promise;
	    if (!this.iframe) {
	      loading.reject(new Error('No Iframe Available'));
	      return loaded;
	    }
	    this.iframe.onload = function (event) {
	      this.onLoad(event, loading);
	    }.bind(this);
	    if (this.settings.method === 'blobUrl') {
	      this.blobUrl = core_20(contents, 'application/xhtml+xml');
	      this.iframe.src = this.blobUrl;
	      this.element.appendChild(this.iframe);
	    } else if (this.settings.method === 'srcdoc') {
	      this.iframe.srcdoc = contents;
	      this.element.appendChild(this.iframe);
	    } else {
	      this.element.appendChild(this.iframe);
	      this.document = this.iframe.contentDocument;
	      if (!this.document) {
	        loading.reject(new Error('No Document Available'));
	        return loaded;
	      }
	      this.iframe.contentDocument.open();
	      // For Cordova windows platform
	      if (typeof window.MSApp !== 'undefined' && window.MSApp.execUnsafeLocalFunction) {
	        var outerThis = this;
	        window.MSApp.execUnsafeLocalFunction(function () {
	          outerThis.iframe.contentDocument.write(contents);
	        });
	      } else {
	        this.iframe.contentDocument.write(contents);
	      }
	      this.iframe.contentDocument.close();
	    }
	    return loaded;
	  }
	  onLoad(event, promise) {
	    this.window = this.iframe.contentWindow;
	    this.document = this.iframe.contentDocument;

	    // Inject transparent background if option is enabled
	    if (this.settings.transparency && this.document && this.document.body) {
	      this.document.body.style.background = 'transparent';
	      // Also inject a style tag for full coverage
	      const style = this.document.createElement('style');
	      style.innerHTML = 'html, body { background: transparent !important; }';
	      this.document.head.appendChild(style);
	    }
	    this.contents = new Contents(this.document, this.document.body, this.section.cfiBase, this.section.index);
	    this.rendering = false;
	    var link = this.document.querySelector("link[rel='canonical']");
	    if (link) {
	      link.setAttribute('href', this.section.canonical);
	    } else {
	      link = this.document.createElement('link');
	      link.setAttribute('rel', 'canonical');
	      link.setAttribute('href', this.section.canonical);
	      this.document.querySelector('head').appendChild(link);
	    }
	    this.contents.on(constants_1.CONTENTS.EXPAND, () => {
	      if (this.displayed && this.iframe) {
	        this.expand();
	        if (this.contents) {
	          this.layout.format(this.contents);
	        }
	      }
	    });
	    this.contents.on(constants_1.CONTENTS.RESIZE, () => {
	      if (this.displayed && this.iframe) {
	        this.expand();
	        if (this.contents) {
	          this.layout.format(this.contents);
	        }
	      }
	    });
	    promise.resolve(this.contents);
	  }
	  setLayout(layout) {
	    this.layout = layout;
	    if (this.contents) {
	      this.layout.format(this.contents);
	      this.expand();
	    }
	  }
	  setAxis(axis) {
	    this.settings.axis = axis;
	    if (axis == 'horizontal') {
	      this.element.style.flex = 'none';
	    } else {
	      this.element.style.flex = 'initial';
	    }
	    this.size();
	  }
	  setWritingMode(mode) {
	    // this.element.style.writingMode = writingMode;
	    this.writingMode = mode;
	  }
	  addListeners() {
	    //TODO: Add content listeners for expanding
	  }
	  removeListeners() {
	    //TODO: remove content listeners for expanding
	  }
	  display(request) {
	    var displayed = new core_1();
	    if (!this.displayed) {
	      this.render(request).then(function () {
	        this.emit(constants_1.VIEWS.DISPLAYED, this);
	        this.onDisplayed(this);
	        this.displayed = true;
	        displayed.resolve(this);
	      }.bind(this), function (err) {
	        displayed.reject(err, this);
	      });
	    } else {
	      displayed.resolve(this);
	    }
	    return displayed.promise;
	  }
	  show() {
	    this.element.style.visibility = 'visible';
	    if (this.iframe) {
	      this.iframe.style.visibility = 'visible';

	      // Remind Safari to redraw the iframe
	      this.iframe.style.transform = 'translateZ(0)';
	      this.iframe.offsetWidth;
	      this.iframe.style.transform = null;
	    }
	    this.emit(constants_1.VIEWS.SHOWN, this);
	  }
	  hide() {
	    // this.iframe.style.display = "none";
	    this.element.style.visibility = 'hidden';
	    this.iframe.style.visibility = 'hidden';
	    this.stopExpanding = true;
	    this.emit(constants_1.VIEWS.HIDDEN, this);
	  }
	  offset() {
	    return {
	      top: this.element.offsetTop,
	      left: this.element.offsetLeft
	    };
	  }
	  width() {
	    return this._width;
	  }
	  height() {
	    return this._height;
	  }
	  position() {
	    return this.element.getBoundingClientRect();
	  }
	  locationOf(target) {
	    var targetPos = this.contents.locationOf(target, this.settings.ignoreClass);
	    return {
	      left: targetPos.left,
	      top: targetPos.top
	    };
	  }
	  onDisplayed() {
	    // Stub, override with a custom functions
	  }
	  onResize() {
	    // Stub, override with a custom functions
	  }
	  bounds(force) {
	    if (force || !this.elementBounds) {
	      this.elementBounds = core_14(this.element);
	    }
	    return this.elementBounds;
	  }
	  highlight(cfiRange, data = {}, cb, className = 'epubjs-hl', styles = {}) {
	    if (!this.contents) {
	      return;
	    }
	    let attributes;
	    if (this.settings.transparency) {
	      attributes = Object.assign({
	        fill: 'yellow',
	        'fill-opacity': '1.0',
	        'mix-blend-mode': 'normal'
	      }, styles);
	    } else {
	      attributes = Object.assign({
	        fill: 'yellow',
	        'fill-opacity': '0.3',
	        'mix-blend-mode': 'multiply'
	      }, styles);
	    }
	    let range = this.contents.range(cfiRange);
	    let emitter = () => {
	      this.emit(constants_1.VIEWS.MARK_CLICKED, cfiRange, data);
	    };
	    data['epubcfi'] = cfiRange;
	    if (!this.pane) {
	      this.pane = new StyledPane(this.iframe, this.element, this.settings.transparency);
	    }
	    let m = new Highlight(range, className, data, attributes);
	    let h = this.pane.addMark(m);
	    this.highlights[cfiRange] = {
	      mark: h,
	      element: h.element,
	      listeners: [emitter, cb]
	    };
	    h.element.setAttribute('ref', className);
	    h.element.addEventListener('click', emitter);
	    h.element.addEventListener('touchstart', emitter);
	    if (cb) {
	      h.element.addEventListener('click', cb);
	      h.element.addEventListener('touchstart', cb);
	    }
	    return h;
	  }
	  underline(cfiRange, data = {}, cb, className = 'epubjs-ul', styles = {}) {
	    if (!this.contents) {
	      return;
	    }
	    const attributes = Object.assign({
	      stroke: 'black',
	      'stroke-opacity': '0.3',
	      'mix-blend-mode': 'multiply'
	    }, styles);
	    let range = this.contents.range(cfiRange);
	    let emitter = () => {
	      this.emit(constants_1.VIEWS.MARK_CLICKED, cfiRange, data);
	    };
	    data['epubcfi'] = cfiRange;
	    if (!this.pane) {
	      this.pane = new StyledPane(this.iframe, this.element, this.settings.transparency);
	    }
	    let m = new Underline(range, className, data, attributes);
	    let h = this.pane.addMark(m);
	    this.underlines[cfiRange] = {
	      mark: h,
	      element: h.element,
	      listeners: [emitter, cb]
	    };
	    h.element.setAttribute('ref', className);
	    h.element.addEventListener('click', emitter);
	    h.element.addEventListener('touchstart', emitter);
	    if (cb) {
	      h.element.addEventListener('click', cb);
	      h.element.addEventListener('touchstart', cb);
	    }
	    return h;
	  }
	  mark(cfiRange, data = {}, cb) {
	    if (!this.contents) {
	      return;
	    }
	    if (cfiRange in this.marks) {
	      let item = this.marks[cfiRange];
	      return item;
	    }
	    let range = this.contents.range(cfiRange);
	    if (!range) {
	      return;
	    }
	    let container = range.commonAncestorContainer;
	    let parent = container.nodeType === 1 ? container : container.parentNode;
	    let emitter = () => {
	      this.emit(constants_1.VIEWS.MARK_CLICKED, cfiRange, data);
	    };
	    if (range.collapsed && container.nodeType === 1) {
	      range = new Range();
	      range.selectNodeContents(container);
	    } else if (range.collapsed) {
	      // Webkit doesn't like collapsed ranges
	      range = new Range();
	      range.selectNodeContents(parent);
	    }
	    let mark = this.document.createElement('a');
	    mark.setAttribute('ref', 'epubjs-mk');
	    mark.style.position = 'absolute';
	    mark.dataset['epubcfi'] = cfiRange;
	    if (data) {
	      Object.keys(data).forEach(key => {
	        mark.dataset[key] = data[key];
	      });
	    }
	    if (cb) {
	      mark.addEventListener('click', cb);
	      mark.addEventListener('touchstart', cb);
	    }
	    mark.addEventListener('click', emitter);
	    mark.addEventListener('touchstart', emitter);
	    this.placeMark(mark, range);
	    this.element.appendChild(mark);
	    this.marks[cfiRange] = {
	      element: mark,
	      range: range,
	      listeners: [emitter, cb]
	    };
	    return parent;
	  }
	  placeMark(element, range) {
	    let top, right, left;
	    if (this.layout.name === 'pre-paginated' || this.settings.axis !== 'horizontal') {
	      let pos = range.getBoundingClientRect();
	      top = pos.top;
	      right = pos.right;
	    } else {
	      // Element might break columns, so find the left most element
	      let rects = range.getClientRects();
	      let rect;
	      for (var i = 0; i != rects.length; i++) {
	        rect = rects[i];
	        if (!left || rect.left < left) {
	          left = rect.left;
	          // right = rect.right;
	          right = Math.ceil(left / this.layout.props.pageWidth) * this.layout.props.pageWidth - this.layout.gap / 2;
	          top = rect.top;
	        }
	      }
	    }
	    element.style.top = `${top}px`;
	    element.style.left = `${right}px`;
	  }
	  unhighlight(cfiRange) {
	    let item;
	    if (cfiRange in this.highlights) {
	      item = this.highlights[cfiRange];
	      this.pane.removeMark(item.mark);
	      item.listeners.forEach(l => {
	        if (l) {
	          item.element.removeEventListener('click', l);
	          item.element.removeEventListener('touchstart', l);
	        }
	      });
	      delete this.highlights[cfiRange];
	    }
	  }
	  ununderline(cfiRange) {
	    let item;
	    if (cfiRange in this.underlines) {
	      item = this.underlines[cfiRange];
	      this.pane.removeMark(item.mark);
	      item.listeners.forEach(l => {
	        if (l) {
	          item.element.removeEventListener('click', l);
	          item.element.removeEventListener('touchstart', l);
	        }
	      });
	      delete this.underlines[cfiRange];
	    }
	  }
	  unmark(cfiRange) {
	    let item;
	    if (cfiRange in this.marks) {
	      item = this.marks[cfiRange];
	      this.element.removeChild(item.element);
	      item.listeners.forEach(l => {
	        if (l) {
	          item.element.removeEventListener('click', l);
	          item.element.removeEventListener('touchstart', l);
	        }
	      });
	      delete this.marks[cfiRange];
	    }
	  }
	  destroy() {
	    for (let cfiRange in this.highlights) {
	      this.unhighlight(cfiRange);
	    }
	    for (let cfiRange in this.underlines) {
	      this.ununderline(cfiRange);
	    }
	    for (let cfiRange in this.marks) {
	      this.unmark(cfiRange);
	    }
	    if (this.blobUrl) {
	      core_21(this.blobUrl);
	    }
	    if (this.displayed) {
	      this.displayed = false;
	      this.removeListeners();
	      this.contents.destroy();
	      this.stopExpanding = true;
	      this.element.removeChild(this.iframe);
	      if (this.pane) {
	        this.pane.element.remove();
	        this.pane = undefined;
	      }
	      this.iframe = undefined;
	      this.contents = undefined;
	      this._textWidth = null;
	      this._textHeight = null;
	      this._width = null;
	      this._height = null;
	    }

	    // this.element.style.height = "0px";
	    // this.element.style.width = "0px";
	  }
	}
	eventEmitter(IframeView.prototype);

	var scrolltype = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = scrollType;
	  exports.createDefiner = createDefiner;
	  // Detect RTL scroll type
	  // Based on https://github.com/othree/jquery.rtl-scroll-type/blob/master/src/jquery.rtl-scroll.js
	  function scrollType() {
	    var type = 'reverse';
	    var definer = createDefiner();
	    document.body.appendChild(definer);
	    if (definer.scrollLeft > 0) {
	      type = 'default';
	    } else {
	      // Modern browsers: always use scrollIntoView logic
	      definer.children[0].children[1].scrollIntoView();
	      if (definer.scrollLeft < 0) {
	        type = 'negative';
	      }
	    }
	    document.body.removeChild(definer);
	    return type;
	  }
	  function createDefiner() {
	    var definer = document.createElement('div');
	    definer.dir = 'rtl';
	    definer.style.position = 'fixed';
	    definer.style.width = '1px';
	    definer.style.height = '1px';
	    definer.style.top = '0px';
	    definer.style.left = '0px';
	    definer.style.overflow = 'hidden';
	    var innerDiv = document.createElement('div');
	    innerDiv.style.width = '2px';
	    var spanA = document.createElement('span');
	    spanA.style.width = '1px';
	    spanA.style.display = 'inline-block';
	    var spanB = document.createElement('span');
	    spanB.style.width = '1px';
	    spanB.style.display = 'inline-block';
	    innerDiv.appendChild(spanA);
	    innerDiv.appendChild(spanB);
	    definer.appendChild(innerDiv);
	    return definer;
	  }
	});
	var scrollType = unwrapExports(scrolltype);
	scrolltype.createDefiner;

	var helpers = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.debounce = debounce;
	  exports.throttle = throttle;
	  /**
	   * Creates a debounced function that delays invoking the provided function
	   * until after the specified wait time has elapsed since the last invocation.
	   */
	  function debounce(func, wait) {
	    var timeout;
	    return function () {
	      var _this = this;
	      var args = [];
	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }
	      clearTimeout(timeout);
	      timeout = setTimeout(function () {
	        return func.apply(_this, args);
	      }, wait);
	    };
	  }
	  /**
	   * Creates a throttled function that only invokes the provided function
	   * at most once per every specified wait time.
	   */
	  function throttle(func, wait) {
	    var lastCall = 0;
	    return function () {
	      var args = [];
	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }
	      var now = Date.now();
	      if (now - lastCall >= wait) {
	        lastCall = now;
	        func.apply(this, args);
	      }
	    };
	  }
	});
	unwrapExports(helpers);
	var helpers_1 = helpers.debounce;
	var helpers_2 = helpers.throttle;

	class Stage {
	  constructor(_options) {
	    this.settings = _options || {};
	    this.id = 'epubjs-container-' + core_3();
	    this.container = this.create(this.settings);
	    if (this.settings.hidden) {
	      this.wrapper = this.wrap(this.container);
	    }
	  }

	  /*
	   * Creates an element to render to.
	   * Resizes to passed width and height or to the elements size
	   */
	  create(options) {
	    let height = options.height; // !== false ? options.height : "100%";
	    let width = options.width; // !== false ? options.width : "100%";
	    let overflow = options.overflow || false;
	    let axis = options.axis || 'vertical';
	    let direction = options.direction;
	    core_10(this.settings, options);
	    if (options.height && core_6(options.height)) {
	      height = options.height + 'px';
	    }
	    if (options.width && core_6(options.width)) {
	      width = options.width + 'px';
	    }

	    // Create new container element
	    let container = document.createElement('div');
	    container.id = this.id;
	    container.classList.add('epub-container');

	    // Style Element
	    // container.style.fontSize = "0";
	    container.style.wordSpacing = '0';
	    container.style.lineHeight = '0';
	    container.style.verticalAlign = 'top';
	    container.style.position = 'relative';
	    if (axis === 'horizontal') {
	      // container.style.whiteSpace = "nowrap";
	      container.style.display = 'flex';
	      container.style.flexDirection = 'row';
	      container.style.flexWrap = 'nowrap';
	    }
	    if (width) {
	      container.style.width = width;
	    }
	    if (height) {
	      container.style.height = height;
	    }
	    if (overflow) {
	      if (overflow === 'scroll' && axis === 'vertical') {
	        container.style['overflow-y'] = overflow;
	        container.style['overflow-x'] = 'hidden';
	      } else if (overflow === 'scroll' && axis === 'horizontal') {
	        container.style['overflow-y'] = 'hidden';
	        container.style['overflow-x'] = overflow;
	      } else {
	        container.style['overflow'] = overflow;
	      }
	    }
	    if (direction) {
	      container.dir = direction;
	      container.style['direction'] = direction;
	    }
	    if (direction && this.settings.fullsize) {
	      document.body.style['direction'] = direction;
	    }
	    return container;
	  }
	  wrap(container) {
	    var wrapper = document.createElement('div');
	    wrapper.style.visibility = 'hidden';
	    wrapper.style.overflow = 'hidden';
	    wrapper.style.width = '0';
	    wrapper.style.height = '0';
	    wrapper.appendChild(container);
	    return wrapper;
	  }
	  getElement(_element) {
	    var element;
	    if (core_5(_element)) {
	      element = _element;
	    } else if (typeof _element === 'string') {
	      element = document.getElementById(_element);
	    }
	    if (!element) {
	      throw new Error('Not an Element');
	    }
	    return element;
	  }
	  attachTo(what) {
	    var element = this.getElement(what);
	    if (!element) {
	      return;
	    }
	    var base;
	    if (this.settings.hidden) {
	      base = this.wrapper;
	    } else {
	      base = this.container;
	    }
	    element.appendChild(base);
	    this.element = element;
	    return element;
	  }
	  getContainer() {
	    return this.container;
	  }
	  onResize(func) {
	    // Only listen to window for resize event if width and height are not fixed.
	    // This applies if it is set to a percent or auto.
	    if (!core_6(this.settings.width) || !core_6(this.settings.height)) {
	      this.resizeFunc = helpers_2(func, 50);
	      window.addEventListener('resize', this.resizeFunc, false);
	    }
	  }
	  onOrientationChange(func) {
	    this.orientationChangeFunc = func;
	    window.addEventListener('orientationchange', this.orientationChangeFunc, false);
	  }
	  size(width, height) {
	    var bounds;
	    let _width = width || this.settings.width;
	    let _height = height || this.settings.height;

	    // If width or height are set to false, inherit them from containing element
	    if (width === null) {
	      bounds = this.element.getBoundingClientRect();
	      if (bounds.width) {
	        width = Math.floor(bounds.width);
	        this.container.style.width = width + 'px';
	      }
	    } else {
	      if (core_6(width)) {
	        this.container.style.width = width + 'px';
	      } else {
	        this.container.style.width = width;
	      }
	    }
	    if (height === null) {
	      bounds = bounds || this.element.getBoundingClientRect();
	      if (bounds.height) {
	        height = bounds.height;
	        this.container.style.height = height + 'px';
	      }
	    } else {
	      if (core_6(height)) {
	        this.container.style.height = height + 'px';
	      } else {
	        this.container.style.height = height;
	      }
	    }
	    if (!core_6(width)) {
	      width = this.container.clientWidth;
	    }
	    if (!core_6(height)) {
	      height = this.container.clientHeight;
	    }
	    this.containerStyles = window.getComputedStyle(this.container);
	    this.containerPadding = {
	      left: parseFloat(this.containerStyles['padding-left']) || 0,
	      right: parseFloat(this.containerStyles['padding-right']) || 0,
	      top: parseFloat(this.containerStyles['padding-top']) || 0,
	      bottom: parseFloat(this.containerStyles['padding-bottom']) || 0
	    };

	    // Bounds not set, get them from window
	    let _windowBounds = core_17();
	    let bodyStyles = window.getComputedStyle(document.body);
	    let bodyPadding = {
	      left: parseFloat(bodyStyles['padding-left']) || 0,
	      right: parseFloat(bodyStyles['padding-right']) || 0,
	      top: parseFloat(bodyStyles['padding-top']) || 0,
	      bottom: parseFloat(bodyStyles['padding-bottom']) || 0
	    };
	    if (!_width) {
	      width = _windowBounds.width - bodyPadding.left - bodyPadding.right;
	    }
	    if (this.settings.fullsize && !_height || !_height) {
	      height = _windowBounds.height - bodyPadding.top - bodyPadding.bottom;
	    }
	    return {
	      width: width - this.containerPadding.left - this.containerPadding.right,
	      height: height - this.containerPadding.top - this.containerPadding.bottom
	    };
	  }
	  bounds() {
	    let box;
	    if (this.container.style.overflow !== 'visible') {
	      box = this.container && this.container.getBoundingClientRect();
	    }
	    if (!box || !box.width || !box.height) {
	      return core_17();
	    } else {
	      return box;
	    }
	  }
	  getSheet() {
	    var style = document.createElement('style');

	    // WebKit hack --> https://davidwalsh.name/add-rules-stylesheets
	    style.appendChild(document.createTextNode(''));
	    document.head.appendChild(style);
	    return style.sheet;
	  }
	  addStyleRules(selector, rulesArray) {
	    var scope = '#' + this.id + ' ';
	    var rules = '';
	    if (!this.sheet) {
	      this.sheet = this.getSheet();
	    }
	    rulesArray.forEach(function (set) {
	      for (var prop in set) {
	        if (Object.prototype.hasOwnProperty.call(set, prop)) {
	          rules += prop + ':' + set[prop] + ';';
	        }
	      }
	    });
	    this.sheet.insertRule(scope + selector + ' {' + rules + '}', 0);
	  }
	  axis(axis) {
	    if (axis === 'horizontal') {
	      this.container.style.display = 'flex';
	      this.container.style.flexDirection = 'row';
	      this.container.style.flexWrap = 'nowrap';
	    } else {
	      this.container.style.display = 'block';
	    }
	    this.settings.axis = axis;
	  }

	  // orientation(orientation) {
	  // 	if (orientation === "landscape") {
	  //
	  // 	} else {
	  //
	  // 	}
	  //
	  // 	this.orientation = orientation;
	  // }

	  direction(dir) {
	    if (this.container) {
	      this.container.dir = dir;
	      this.container.style['direction'] = dir;
	    }
	    if (this.settings.fullsize) {
	      document.body.style['direction'] = dir;
	    }
	    this.settings.dir = dir;
	  }
	  overflow(overflow) {
	    if (this.container) {
	      if (overflow === 'scroll' && this.settings.axis === 'vertical') {
	        this.container.style['overflow-y'] = overflow;
	        this.container.style['overflow-x'] = 'hidden';
	      } else if (overflow === 'scroll' && this.settings.axis === 'horizontal') {
	        this.container.style['overflow-y'] = 'hidden';
	        this.container.style['overflow-x'] = overflow;
	      } else {
	        this.container.style['overflow'] = overflow;
	      }
	    }
	    this.settings.overflow = overflow;
	  }
	  destroy() {
	    if (this.element) {
	      if (this.settings.hidden) {
	        this.wrapper;
	      } else {
	        this.container;
	      }
	      if (this.element.contains(this.container)) {
	        this.element.removeChild(this.container);
	      }
	      window.removeEventListener('resize', this.resizeFunc);
	      window.removeEventListener('orientationChange', this.orientationChangeFunc);
	    }
	  }
	}

	class Views {
	  constructor(container) {
	    this.container = container;
	    this._views = [];
	    this.length = 0;
	    this.hidden = false;
	  }
	  all() {
	    return this._views;
	  }
	  first() {
	    return this._views[0];
	  }
	  last() {
	    return this._views[this._views.length - 1];
	  }
	  indexOf(view) {
	    return this._views.indexOf(view);
	  }
	  slice() {
	    return this._views.slice.apply(this._views, arguments);
	  }
	  get(i) {
	    return this._views[i];
	  }
	  append(view) {
	    this._views.push(view);
	    if (this.container) {
	      this.container.appendChild(view.element);
	    }
	    this.length++;
	    return view;
	  }
	  prepend(view) {
	    this._views.unshift(view);
	    if (this.container) {
	      this.container.insertBefore(view.element, this.container.firstChild);
	    }
	    this.length++;
	    return view;
	  }
	  insert(view, index) {
	    this._views.splice(index, 0, view);
	    if (this.container) {
	      if (index < this.container.children.length) {
	        this.container.insertBefore(view.element, this.container.children[index]);
	      } else {
	        this.container.appendChild(view.element);
	      }
	    }
	    this.length++;
	    return view;
	  }
	  remove(view) {
	    var index = this._views.indexOf(view);
	    if (index > -1) {
	      this._views.splice(index, 1);
	    }
	    this.destroy(view);
	    this.length--;
	  }
	  destroy(view) {
	    if (view.displayed) {
	      view.destroy();
	    }
	    if (this.container) {
	      this.container.removeChild(view.element);
	    }
	    view = null;
	  }

	  // Iterators

	  forEach() {
	    return this._views.forEach.apply(this._views, arguments);
	  }
	  clear() {
	    // Remove all views
	    var view;
	    var len = this.length;
	    if (!this.length) return;
	    for (var i = 0; i < len; i++) {
	      view = this._views[i];
	      this.destroy(view);
	    }
	    this._views = [];
	    this.length = 0;
	  }
	  find(section) {
	    var view;
	    var len = this.length;
	    for (var i = 0; i < len; i++) {
	      view = this._views[i];
	      if (view.displayed && view.section.index == section.index) {
	        return view;
	      }
	    }
	  }
	  displayed() {
	    var displayed = [];
	    var view;
	    var len = this.length;
	    for (var i = 0; i < len; i++) {
	      view = this._views[i];
	      if (view.displayed) {
	        displayed.push(view);
	      }
	    }
	    return displayed;
	  }
	  show() {
	    var view;
	    var len = this.length;
	    for (var i = 0; i < len; i++) {
	      view = this._views[i];
	      if (view.displayed) {
	        view.show();
	      }
	    }
	    this.hidden = false;
	  }
	  hide() {
	    var view;
	    var len = this.length;
	    for (var i = 0; i < len; i++) {
	      view = this._views[i];
	      if (view.displayed) {
	        view.hide();
	      }
	    }
	    this.hidden = true;
	  }
	}

	class DefaultViewManager {
	  constructor(options) {
	    this.name = 'default';
	    this.optsSettings = options.settings;
	    this.View = options.view;
	    this.request = options.request;
	    this.renditionQueue = options.queue;
	    this.q = new Queue(this);
	    this.settings = core_10(this.settings || {}, {
	      infinite: true,
	      hidden: false,
	      width: undefined,
	      height: undefined,
	      axis: undefined,
	      writingMode: undefined,
	      flow: 'scrolled',
	      ignoreClass: '',
	      fullsize: undefined,
	      allowScriptedContent: false,
	      allowPopups: false
	    });
	    core_10(this.settings, options.settings || {});
	    this.viewSettings = {
	      ignoreClass: this.settings.ignoreClass,
	      axis: this.settings.axis,
	      flow: this.settings.flow,
	      layout: this.layout,
	      method: this.settings.method,
	      // srcdoc, blobUrl, write
	      width: 0,
	      height: 0,
	      forceEvenPages: true,
	      allowScriptedContent: this.settings.allowScriptedContent,
	      allowPopups: this.settings.allowPopups
	    };
	    this.rendered = false;
	  }
	  render(element, size) {
	    let tag = element.tagName;
	    if (typeof this.settings.fullsize === 'undefined' && tag && (tag.toLowerCase() == 'body' || tag.toLowerCase() == 'html')) {
	      this.settings.fullsize = true;
	    }
	    if (this.settings.fullsize) {
	      this.settings.overflow = 'visible';
	      this.overflow = this.settings.overflow;
	    }
	    this.settings.size = size;
	    this.settings.rtlScrollType = scrollType();

	    // Save the stage
	    this.stage = new Stage({
	      width: size.width,
	      height: size.height,
	      overflow: this.overflow,
	      hidden: this.settings.hidden,
	      axis: this.settings.axis,
	      fullsize: this.settings.fullsize,
	      direction: this.settings.direction
	    });
	    this.stage.attachTo(element);

	    // Get this stage container div
	    this.container = this.stage.getContainer();

	    // Views array methods
	    this.views = new Views(this.container);

	    // Calculate Stage Size
	    this._bounds = this.bounds();
	    this._stageSize = this.stage.size();

	    // Set the dimensions for views
	    this.viewSettings.width = this._stageSize.width;
	    this.viewSettings.height = this._stageSize.height;

	    // Function to handle a resize event.
	    // Will only attach if width and height are both fixed.
	    this.stage.onResize(this.onResized.bind(this));
	    this.stage.onOrientationChange(this.onOrientationChange.bind(this));

	    // Add Event Listeners
	    this.addEventListeners();

	    // Add Layout method
	    // this.applyLayoutMethod();
	    if (this.layout) {
	      this.updateLayout();
	    }
	    this.rendered = true;
	  }
	  addEventListeners() {
	    var scroller;
	    window.addEventListener('unload', function () {
	      this.destroy();
	    }.bind(this));
	    if (!this.settings.fullsize) {
	      scroller = this.container;
	    } else {
	      scroller = window;
	    }
	    this._onScroll = this.onScroll.bind(this);
	    scroller.addEventListener('scroll', this._onScroll);
	  }
	  removeEventListeners() {
	    var scroller;
	    if (!this.settings.fullsize) {
	      scroller = this.container;
	    } else {
	      scroller = window;
	    }
	    scroller.removeEventListener('scroll', this._onScroll);
	    this._onScroll = undefined;
	  }
	  destroy() {
	    clearTimeout(this.orientationTimeout);
	    clearTimeout(this.resizeTimeout);
	    clearTimeout(this.afterScrolled);
	    this.clear();
	    this.removeEventListeners();
	    this.stage.destroy();
	    this.rendered = false;

	    /*
	       clearTimeout(this.trimTimeout);
	      if(this.settings.hidden) {
	        this.element.removeChild(this.wrapper);
	      } else {
	        this.element.removeChild(this.container);
	      }
	    */
	  }
	  onOrientationChange() {
	    let {
	      orientation
	    } = window;
	    if (this.optsSettings.resizeOnOrientationChange) {
	      this.resize();
	    }

	    // Per ampproject:
	    // In IOS 10.3, the measured size of an element is incorrect if the
	    // element size depends on window size directly and the measurement
	    // happens in window.resize event. Adding a timeout for correct
	    // measurement. See https://github.com/ampproject/amphtml/issues/8479
	    clearTimeout(this.orientationTimeout);
	    this.orientationTimeout = setTimeout(function () {
	      this.orientationTimeout = undefined;
	      if (this.optsSettings.resizeOnOrientationChange) {
	        this.resize();
	      }
	      this.emit(constants_1.MANAGERS.ORIENTATION_CHANGE, orientation);
	    }.bind(this), 500);
	  }
	  onResized() {
	    this.resize();
	  }
	  resize(width, height, epubcfi) {
	    let stageSize = this.stage.size(width, height);

	    // For Safari, wait for orientation to catch up
	    // if the window is a square
	    this.winBounds = core_17();
	    if (this.orientationTimeout && this.winBounds.width === this.winBounds.height) {
	      // reset the stage size for next resize
	      this._stageSize = undefined;
	      return;
	    }
	    if (this._stageSize && this._stageSize.width === stageSize.width && this._stageSize.height === stageSize.height) {
	      // Size is the same, no need to resize
	      return;
	    }
	    this._stageSize = stageSize;
	    this._bounds = this.bounds();

	    // Clear current views
	    this.clear();

	    // Update for new views
	    this.viewSettings.width = this._stageSize.width;
	    this.viewSettings.height = this._stageSize.height;
	    this.updateLayout();
	    this.emit(constants_1.MANAGERS.RESIZED, {
	      width: this._stageSize.width,
	      height: this._stageSize.height
	    }, epubcfi);
	  }
	  createView(section, forceRight) {
	    return new this.View(section, core_10(this.viewSettings, {
	      forceRight
	    }));
	  }
	  handleNextPrePaginated(forceRight, section, action) {
	    let next;
	    if (this.layout.name === 'pre-paginated' && this.layout.divisor > 1) {
	      if (forceRight || section.index === 0) {
	        // First page (cover) should stand alone for pre-paginated books
	        return;
	      }
	      next = section.next();
	      if (next && !next.properties.includes('page-spread-left')) {
	        return action.call(this, next);
	      }
	    }
	  }
	  display(section, target) {
	    var displaying = new core_1();
	    var displayed = displaying.promise;

	    // Check if moving to target is needed
	    if (target === section.href || core_6(target)) {
	      target = undefined;
	    }

	    // Check to make sure the section we want isn't already shown
	    var visible = this.views.find(section);

	    // View is already shown, just move to correct location in view
	    if (visible && section && this.layout.name !== 'pre-paginated') {
	      let offset = visible.offset();
	      if (this.settings.direction === 'ltr') {
	        this.scrollTo(offset.left, offset.top, true);
	      } else {
	        let width = visible.width();
	        this.scrollTo(offset.left + width, offset.top, true);
	      }
	      if (target) {
	        let offset = visible.locationOf(target);
	        let width = visible.width();
	        this.moveTo(offset, width);
	      }
	      displaying.resolve();
	      return displayed;
	    }

	    // Hide all current views
	    this.clear();
	    let forceRight = false;
	    if (this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && section.properties.includes('page-spread-right')) {
	      forceRight = true;
	    }
	    this.add(section, forceRight).then(function (view) {
	      // Move to correct place within the section, if needed
	      if (target) {
	        let offset = view.locationOf(target);
	        let width = view.width();
	        this.moveTo(offset, width);
	      }
	    }.bind(this), err => {
	      displaying.reject(err);
	    }).then(function () {
	      return this.handleNextPrePaginated(forceRight, section, this.add);
	    }.bind(this)).then(function () {
	      this.views.show();
	      displaying.resolve();
	    }.bind(this));
	    // .then(function(){
	    // 	return this.hooks.display.trigger(view);
	    // }.bind(this))
	    // .then(function(){
	    // 	this.views.show();
	    // }.bind(this));
	    return displayed;
	  }
	  afterDisplayed(view) {
	    this.emit(constants_1.MANAGERS.ADDED, view);
	  }
	  afterResized(view) {
	    this.emit(constants_1.MANAGERS.RESIZE, view.section);
	  }
	  moveTo(offset, width) {
	    var distX = 0,
	      distY = 0;
	    if (!this.isPaginated) {
	      distY = offset.top;
	    } else {
	      distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
	      if (distX + this.layout.delta > this.container.scrollWidth) {
	        distX = this.container.scrollWidth - this.layout.delta;
	      }
	      distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;
	      if (distY + this.layout.delta > this.container.scrollHeight) {
	        distY = this.container.scrollHeight - this.layout.delta;
	      }
	    }
	    if (this.settings.direction === 'rtl') {
	      /***
	        the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
	        to distX or use `Math.ceil` function, or multiply offset.left by -1
	        before `Math.floor`
	      */
	      distX = distX + this.layout.delta;
	      distX = distX - width;
	    }
	    this.scrollTo(distX, distY, true);
	  }
	  add(section, forceRight) {
	    var view = this.createView(section, forceRight);
	    this.views.append(view);

	    // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
	    view.onDisplayed = this.afterDisplayed.bind(this);
	    view.onResize = this.afterResized.bind(this);
	    view.on(constants_1.VIEWS.AXIS, axis => {
	      this.updateAxis(axis);
	    });
	    view.on(constants_1.VIEWS.WRITING_MODE, mode => {
	      this.updateWritingMode(mode);
	    });
	    return view.display(this.request);
	  }
	  append(section, forceRight) {
	    var view = this.createView(section, forceRight);
	    this.views.append(view);
	    view.onDisplayed = this.afterDisplayed.bind(this);
	    view.onResize = this.afterResized.bind(this);
	    view.on(constants_1.VIEWS.AXIS, axis => {
	      this.updateAxis(axis);
	    });
	    view.on(constants_1.VIEWS.WRITING_MODE, mode => {
	      this.updateWritingMode(mode);
	    });
	    return view.display(this.request);
	  }
	  prepend(section, forceRight) {
	    var view = this.createView(section, forceRight);
	    view.on(constants_1.VIEWS.RESIZED, bounds => {
	      this.counter(bounds);
	    });
	    this.views.prepend(view);
	    view.onDisplayed = this.afterDisplayed.bind(this);
	    view.onResize = this.afterResized.bind(this);
	    view.on(constants_1.VIEWS.AXIS, axis => {
	      this.updateAxis(axis);
	    });
	    view.on(constants_1.VIEWS.WRITING_MODE, mode => {
	      this.updateWritingMode(mode);
	    });
	    return view.display(this.request);
	  }
	  counter(bounds) {
	    if (this.settings.axis === 'vertical') {
	      this.scrollBy(0, bounds.heightDelta, true);
	    } else {
	      this.scrollBy(bounds.widthDelta, 0, true);
	    }
	  }

	  // resizeView(view) {
	  //
	  // 	if(this.settings.globalLayoutProperties.layout === "pre-paginated") {
	  // 		view.lock("both", this.bounds.width, this.bounds.height);
	  // 	} else {
	  // 		view.lock("width", this.bounds.width, this.bounds.height);
	  // 	}
	  //
	  // };

	  next() {
	    var next;
	    var left;
	    let dir = this.settings.direction;
	    if (!this.views.length) return;
	    if (this.isPaginated && this.settings.axis === 'horizontal' && (!dir || dir === 'ltr')) {
	      this.scrollLeft = this.container.scrollLeft;
	      left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;
	      if (left <= this.container.scrollWidth) {
	        this.scrollBy(this.layout.delta, 0, true);
	      } else {
	        next = this.views.last().section.next();
	      }
	    } else if (this.isPaginated && this.settings.axis === 'horizontal' && dir === 'rtl') {
	      this.scrollLeft = this.container.scrollLeft;
	      if (this.settings.rtlScrollType === 'default') {
	        left = this.container.scrollLeft;
	        if (left > 0) {
	          this.scrollBy(this.layout.delta, 0, true);
	        } else {
	          next = this.views.last().section.next();
	        }
	      } else {
	        left = this.container.scrollLeft + this.layout.delta * -1;
	        if (left > this.container.scrollWidth * -1) {
	          this.scrollBy(this.layout.delta, 0, true);
	        } else {
	          next = this.views.last().section.next();
	        }
	      }
	    } else if (this.isPaginated && this.settings.axis === 'vertical') {
	      this.scrollTop = this.container.scrollTop;
	      let top = this.container.scrollTop + this.container.offsetHeight;
	      if (top < this.container.scrollHeight) {
	        this.scrollBy(0, this.layout.height, true);
	      } else {
	        next = this.views.last().section.next();
	      }
	    } else {
	      next = this.views.last().section.next();
	    }
	    if (next) {
	      this.clear();
	      // The new section may have a different writing-mode from the old section. Thus, we need to update layout.
	      this.updateLayout();
	      let forceRight = false;
	      if (this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && next.properties.includes('page-spread-right')) {
	        forceRight = true;
	      }
	      return this.append(next, forceRight).then(function () {
	        return this.handleNextPrePaginated(forceRight, next, this.append);
	      }.bind(this), err => {
	        return err;
	      }).then(function () {
	        // Reset position to start for scrolled-doc vertical-rl in default mode
	        if (!this.isPaginated && this.settings.axis === 'horizontal' && this.settings.direction === 'rtl' && this.settings.rtlScrollType === 'default') {
	          this.scrollTo(this.container.scrollWidth, 0, true);
	        }
	        this.views.show();
	      }.bind(this));
	    }
	  }
	  prev() {
	    var prev;
	    var left;
	    let dir = this.settings.direction;
	    if (!this.views.length) return;
	    if (this.isPaginated && this.settings.axis === 'horizontal' && (!dir || dir === 'ltr')) {
	      this.scrollLeft = this.container.scrollLeft;
	      left = this.container.scrollLeft;
	      if (left > 0) {
	        this.scrollBy(-this.layout.delta, 0, true);
	      } else {
	        prev = this.views.first().section.prev();
	      }
	    } else if (this.isPaginated && this.settings.axis === 'horizontal' && dir === 'rtl') {
	      this.scrollLeft = this.container.scrollLeft;
	      if (this.settings.rtlScrollType === 'default') {
	        left = this.container.scrollLeft + this.container.offsetWidth;
	        if (left < this.container.scrollWidth) {
	          this.scrollBy(-this.layout.delta, 0, true);
	        } else {
	          prev = this.views.first().section.prev();
	        }
	      } else {
	        left = this.container.scrollLeft;
	        if (left < 0) {
	          this.scrollBy(-this.layout.delta, 0, true);
	        } else {
	          prev = this.views.first().section.prev();
	        }
	      }
	    } else if (this.isPaginated && this.settings.axis === 'vertical') {
	      this.scrollTop = this.container.scrollTop;
	      let top = this.container.scrollTop;
	      if (top > 0) {
	        this.scrollBy(0, -this.layout.height, true);
	      } else {
	        prev = this.views.first().section.prev();
	      }
	    } else {
	      prev = this.views.first().section.prev();
	    }
	    if (prev) {
	      this.clear();
	      // The new section may have a different writing-mode from the old section. Thus, we need to update layout.
	      this.updateLayout();
	      let forceRight = false;
	      if (this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && typeof prev.prev() !== 'object') {
	        forceRight = true;
	      }
	      return this.prepend(prev, forceRight).then(function () {
	        var left;
	        if (this.layout.name === 'pre-paginated' && this.layout.divisor > 1) {
	          left = prev.prev();
	          if (left) {
	            return this.prepend(left);
	          }
	        }
	      }.bind(this), err => {
	        return err;
	      }).then(function () {
	        if (this.isPaginated && this.settings.axis === 'horizontal') {
	          if (this.settings.direction === 'rtl') {
	            if (this.settings.rtlScrollType === 'default') {
	              this.scrollTo(0, 0, true);
	            } else {
	              this.scrollTo(this.container.scrollWidth * -1 + this.layout.delta, 0, true);
	            }
	          } else {
	            this.scrollTo(this.container.scrollWidth - this.layout.delta, 0, true);
	          }
	        }
	        this.views.show();
	      }.bind(this));
	    }
	  }
	  current() {
	    var visible = this.visible();
	    if (visible.length) {
	      // Current is the last visible view
	      return visible[visible.length - 1];
	    }
	    return null;
	  }
	  clear() {
	    // this.q.clear();

	    if (this.views) {
	      this.views.hide();
	      this.scrollTo(0, 0, true);
	      this.views.clear();
	    }
	  }
	  currentLocation() {
	    this.updateLayout();
	    if (this.isPaginated && this.settings.axis === 'horizontal') {
	      this.location = this.paginatedLocation();
	    } else {
	      this.location = this.scrolledLocation();
	    }
	    return this.location;
	  }
	  scrolledLocation() {
	    let visible = this.visible();
	    let container = this.container.getBoundingClientRect();
	    let pageHeight = container.height < window.innerHeight ? container.height : window.innerHeight;
	    let pageWidth = container.width < window.innerWidth ? container.width : window.innerWidth;
	    let vertical = this.settings.axis === 'vertical';
	    this.settings.direction === 'rtl';
	    let offset = 0;
	    let used = 0;
	    if (this.settings.fullsize) {
	      offset = vertical ? window.scrollY : window.scrollX;
	    }
	    let sections = visible.map(view => {
	      let {
	        index,
	        href
	      } = view.section;
	      let position = view.position();
	      let width = view.width();
	      let height = view.height();
	      let startPos;
	      let endPos;
	      let stopPos;
	      let totalPages;
	      if (vertical) {
	        startPos = offset + container.top - position.top + used;
	        endPos = startPos + pageHeight - used;
	        totalPages = this.layout.count(height, pageHeight).pages;
	        stopPos = pageHeight;
	      } else {
	        startPos = offset + container.left - position.left + used;
	        endPos = startPos + pageWidth - used;
	        totalPages = this.layout.count(width, pageWidth).pages;
	        stopPos = pageWidth;
	      }
	      let currPage = Math.ceil(startPos / stopPos);
	      let pages = [];
	      let endPage = Math.ceil(endPos / stopPos);

	      // Reverse page counts for horizontal rtl
	      if (this.settings.direction === 'rtl' && !vertical) {
	        let tempStartPage = currPage;
	        currPage = totalPages - endPage;
	        endPage = totalPages - tempStartPage;
	      }
	      pages = [];
	      for (var i = currPage; i <= endPage; i++) {
	        let pg = i + 1;
	        pages.push(pg);
	      }
	      let mapping = this.mapping.page(view.contents, view.section.cfiBase, startPos, endPos);
	      return {
	        index,
	        href,
	        pages,
	        totalPages,
	        mapping
	      };
	    });
	    return sections;
	  }
	  paginatedLocation() {
	    let visible = this.visible();
	    let container = this.container.getBoundingClientRect();
	    let left = 0;
	    let used = 0;
	    if (this.settings.fullsize) {
	      left = window.scrollX;
	    }
	    let sections = visible.map(view => {
	      let {
	        index,
	        href
	      } = view.section;
	      let offset;
	      let position = view.position();
	      let width = view.width();

	      // Find mapping
	      let start;
	      let end;
	      let pageWidth;
	      if (this.settings.direction === 'rtl') {
	        offset = container.right - left;
	        pageWidth = Math.min(Math.abs(offset - position.left), this.layout.width) - used;
	        end = position.width - (position.right - offset) - used;
	        start = end - pageWidth;
	      } else {
	        offset = container.left + left;
	        pageWidth = Math.min(position.right - offset, this.layout.width) - used;
	        start = offset - position.left + used;
	        end = start + pageWidth;
	      }
	      used += pageWidth;
	      let mapping = this.mapping.page(view.contents, view.section.cfiBase, start, end);
	      let totalPages = this.layout.count(width).pages;
	      let startPage = Math.floor(start / this.layout.pageWidth);
	      let pages = [];
	      let endPage = Math.floor(end / this.layout.pageWidth);

	      // start page should not be negative
	      if (startPage < 0) {
	        startPage = 0;
	        endPage = endPage + 1;
	      }

	      // Reverse page counts for rtl
	      if (this.settings.direction === 'rtl') {
	        let tempStartPage = startPage;
	        startPage = totalPages - endPage;
	        endPage = totalPages - tempStartPage;
	      }
	      for (var i = startPage + 1; i <= endPage; i++) {
	        let pg = i;
	        pages.push(pg);
	      }
	      return {
	        index,
	        href,
	        pages,
	        totalPages,
	        mapping
	      };
	    });
	    return sections;
	  }
	  isVisible(view, offsetPrev, offsetNext, _container) {
	    var position = view.position();
	    var container = _container || this.bounds();
	    if (this.settings.axis === 'horizontal' && position.right > container.left - offsetPrev && position.left < container.right + offsetNext) {
	      return true;
	    } else if (this.settings.axis === 'vertical' && position.bottom > container.top - offsetPrev && position.top < container.bottom + offsetNext) {
	      return true;
	    }
	    return false;
	  }
	  visible() {
	    var container = this.bounds();
	    var views = this.views.displayed();
	    var viewsLength = views.length;
	    var visible = [];
	    var isVisible;
	    var view;
	    for (var i = 0; i < viewsLength; i++) {
	      view = views[i];
	      isVisible = this.isVisible(view, 0, 0, container);
	      if (isVisible === true) {
	        visible.push(view);
	      }
	    }
	    return visible;
	  }
	  scrollBy(x, y, silent) {
	    let dir = this.settings.direction === 'rtl' ? -1 : 1;
	    if (silent) {
	      this.ignore = true;
	    }
	    if (!this.settings.fullsize) {
	      if (x) this.container.scrollLeft += x * dir;
	      if (y) this.container.scrollTop += y;
	    } else {
	      window.scrollBy(x * dir, y * dir);
	    }
	    this.scrolled = true;
	  }
	  scrollTo(x, y, silent) {
	    if (silent) {
	      this.ignore = true;
	    }
	    if (!this.settings.fullsize) {
	      this.container.scrollLeft = x;
	      this.container.scrollTop = y;
	    } else {
	      window.scrollTo(x, y);
	    }
	    this.scrolled = true;
	  }
	  onScroll() {
	    let scrollTop;
	    let scrollLeft;
	    if (!this.settings.fullsize) {
	      scrollTop = this.container.scrollTop;
	      scrollLeft = this.container.scrollLeft;
	    } else {
	      scrollTop = window.scrollY;
	      scrollLeft = window.scrollX;
	    }
	    this.scrollTop = scrollTop;
	    this.scrollLeft = scrollLeft;
	    if (!this.ignore) {
	      this.emit(constants_1.MANAGERS.SCROLL, {
	        top: scrollTop,
	        left: scrollLeft
	      });
	      clearTimeout(this.afterScrolled);
	      this.afterScrolled = setTimeout(function () {
	        this.emit(constants_1.MANAGERS.SCROLLED, {
	          top: this.scrollTop,
	          left: this.scrollLeft
	        });
	      }.bind(this), 20);
	    } else {
	      this.ignore = false;
	    }
	  }
	  bounds() {
	    var bounds;
	    bounds = this.stage.bounds();
	    return bounds;
	  }
	  applyLayout(layout) {
	    this.layout = layout;
	    this.updateLayout();
	    if (this.views && this.views.length > 0 && this.layout.name === 'pre-paginated') {
	      this.display(this.views.first().section);
	    }
	    // this.manager.layout(this.layout.format);
	  }
	  updateLayout() {
	    if (!this.stage) {
	      return;
	    }
	    this._stageSize = this.stage.size();
	    if (!this.isPaginated) {
	      this.layout.calculate(this._stageSize.width, this._stageSize.height);
	    } else {
	      this.layout.calculate(this._stageSize.width, this._stageSize.height, this.settings.gap);

	      // Set the look ahead offset for what is visible
	      this.settings.offset = this.layout.delta / this.layout.divisor;

	      // this.stage.addStyleRules("iframe", [{"margin-right" : this.layout.gap + "px"}]);
	    }

	    // Set the dimensions for views
	    this.viewSettings.width = this.layout.width;
	    this.viewSettings.height = this.layout.height;
	    this.setLayout(this.layout);
	  }
	  setLayout(layout) {
	    this.viewSettings.layout = layout;
	    this.mapping = new Mapping(layout.props, this.settings.direction, this.settings.axis);
	    if (this.views) {
	      this.views.forEach(function (view) {
	        if (view) {
	          view.setLayout(layout);
	        }
	      });
	    }
	  }
	  updateWritingMode(mode) {
	    this.writingMode = mode;
	  }
	  updateAxis(axis, forceUpdate) {
	    if (!forceUpdate && axis === this.settings.axis) {
	      return;
	    }
	    this.settings.axis = axis;
	    this.stage && this.stage.axis(axis);
	    this.viewSettings.axis = axis;
	    if (this.mapping) {
	      this.mapping = new Mapping(this.layout.props, this.settings.direction, this.settings.axis);
	    }
	    if (this.layout) {
	      if (axis === 'vertical') {
	        this.layout.spread('none');
	      } else {
	        this.layout.spread(this.layout.settings.spread);
	      }
	    }
	  }
	  updateFlow(flow, defaultScrolledOverflow = 'auto') {
	    let isPaginated = flow === 'paginated' || flow === 'auto';
	    this.isPaginated = isPaginated;
	    if (flow === 'scrolled-doc' || flow === 'scrolled-continuous' || flow === 'scrolled') {
	      this.updateAxis('vertical');
	    } else {
	      this.updateAxis('horizontal');
	    }
	    this.viewSettings.flow = flow;
	    if (!this.settings.overflow) {
	      this.overflow = isPaginated ? 'hidden' : defaultScrolledOverflow;
	    } else {
	      this.overflow = this.settings.overflow;
	    }
	    this.stage && this.stage.overflow(this.overflow);
	    this.updateLayout();
	  }
	  getContents() {
	    var contents = [];
	    if (!this.views) {
	      return contents;
	    }
	    this.views.forEach(function (view) {
	      const viewContents = view && view.contents;
	      if (viewContents) {
	        contents.push(viewContents);
	      }
	    });
	    return contents;
	  }
	  direction(dir = 'ltr') {
	    this.settings.direction = dir;
	    this.stage && this.stage.direction(dir);
	    this.viewSettings.direction = dir;
	    this.updateLayout();
	  }
	  isRendered() {
	    return this.rendered;
	  }
	}

	//-- Enable binding events to Manager
	eventEmitter(DefaultViewManager.prototype);

	// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
	const PI_D2 = Math.PI / 2;
	const EASING_EQUATIONS = {
	  easeOutSine: function (pos) {
	    return Math.sin(pos * PI_D2);
	  },
	  easeInOutSine: function (pos) {
	    return -0.5 * (Math.cos(Math.PI * pos) - 1);
	  },
	  easeInOutQuint: function (pos) {
	    if ((pos /= 0.5) < 1) {
	      return 0.5 * Math.pow(pos, 5);
	    }
	    return 0.5 * (Math.pow(pos - 2, 5) + 2);
	  },
	  easeInCubic: function (pos) {
	    return Math.pow(pos, 3);
	  }
	};
	class Snap {
	  constructor(manager, options) {
	    this.settings = core_10({
	      duration: 80,
	      minVelocity: 0.2,
	      minDistance: 10,
	      easing: EASING_EQUATIONS['easeInCubic']
	    }, options || {});
	    this.supportsTouch = this.supportsTouch();
	    if (this.supportsTouch) {
	      this.setup(manager);
	    }
	  }
	  setup(manager) {
	    this.manager = manager;
	    this.layout = this.manager.settings.fullsize;
	    if (this.fullsize) {
	      this.element = this.manager.stage.element;
	      this.scroller = window;
	      this.disableScroll();
	    } else {
	      this.element = this.manager.stage.container;
	      this.scroller = this.element;
	      this.element.style['WebkitOverflowScrolling'] = 'touch';
	    }

	    // this.overflow = this.manager.overflow;

	    // set lookahead offset to page width
	    this.manager.settings.offset = this.layout.width;
	    this.manager.settings.afterScrolledTimeout = this.settings.duration * 2;
	    this.isVertical = this.manager.settings.axis === 'vertical';

	    // disable snapping if not paginated or axis in not horizontal
	    if (!this.manager.isPaginated || this.isVertical) {
	      return;
	    }
	    this.touchCanceler = false;
	    this.resizeCanceler = false;
	    this.snapping = false;
	    this.scrollLeft;
	    this.scrollTop;
	    this.startTouchX = undefined;
	    this.startTouchY = undefined;
	    this.startTime = undefined;
	    this.endTouchX = undefined;
	    this.endTouchY = undefined;
	    this.endTime = undefined;
	    this.addListeners();
	  }
	  supportsTouch() {
	    if ('ontouchstart' in window || typeof window.DocumentTouch !== 'undefined' && document instanceof window.DocumentTouch) {
	      return true;
	    }
	    return false;
	  }
	  disableScroll() {
	    this.element.style.overflow = 'hidden';
	  }
	  enableScroll() {
	    this.element.style.overflow = '';
	  }
	  addListeners() {
	    this._onResize = this.onResize.bind(this);
	    window.addEventListener('resize', this._onResize);
	    this._onScroll = this.onScroll.bind(this);
	    this.scroller.addEventListener('scroll', this._onScroll);
	    this._onTouchStart = this.onTouchStart.bind(this);
	    this.scroller.addEventListener('touchstart', this._onTouchStart, {
	      passive: true
	    });
	    this.on('touchstart', this._onTouchStart);
	    this._onTouchMove = this.onTouchMove.bind(this);
	    this.scroller.addEventListener('touchmove', this._onTouchMove, {
	      passive: true
	    });
	    this.on('touchmove', this._onTouchMove);
	    this._onTouchEnd = this.onTouchEnd.bind(this);
	    this.scroller.addEventListener('touchend', this._onTouchEnd, {
	      passive: true
	    });
	    this.on('touchend', this._onTouchEnd);
	    this._afterDisplayed = this.afterDisplayed.bind(this);
	    this.manager.on(constants_1.MANAGERS.ADDED, this._afterDisplayed);
	  }
	  removeListeners() {
	    window.removeEventListener('resize', this._onResize);
	    this._onResize = undefined;
	    this.scroller.removeEventListener('scroll', this._onScroll);
	    this._onScroll = undefined;
	    this.scroller.removeEventListener('touchstart', this._onTouchStart, {
	      passive: true
	    });
	    this.off('touchstart', this._onTouchStart);
	    this._onTouchStart = undefined;
	    this.scroller.removeEventListener('touchmove', this._onTouchMove, {
	      passive: true
	    });
	    this.off('touchmove', this._onTouchMove);
	    this._onTouchMove = undefined;
	    this.scroller.removeEventListener('touchend', this._onTouchEnd, {
	      passive: true
	    });
	    this.off('touchend', this._onTouchEnd);
	    this._onTouchEnd = undefined;
	    this.manager.off(constants_1.MANAGERS.ADDED, this._afterDisplayed);
	    this._afterDisplayed = undefined;
	  }
	  afterDisplayed(view) {
	    let contents = view.contents;
	    ['touchstart', 'touchmove', 'touchend'].forEach(e => {
	      contents.on(e, ev => this.triggerViewEvent(ev, contents));
	    });
	  }
	  triggerViewEvent(e, contents) {
	    this.emit(e.type, e, contents);
	  }
	  onScroll() {
	    this.scrollLeft = this.fullsize ? window.scrollX : this.scroller.scrollLeft;
	    this.scrollTop = this.fullsize ? window.scrollY : this.scroller.scrollTop;
	  }
	  onResize() {
	    this.resizeCanceler = true;
	  }
	  onTouchStart(e) {
	    let {
	      screenX,
	      screenY
	    } = e.touches[0];
	    if (this.fullsize) {
	      this.enableScroll();
	    }
	    this.touchCanceler = true;
	    if (!this.startTouchX) {
	      this.startTouchX = screenX;
	      this.startTouchY = screenY;
	      this.startTime = this.now();
	    }
	    this.endTouchX = screenX;
	    this.endTouchY = screenY;
	    this.endTime = this.now();
	  }
	  onTouchMove(e) {
	    let {
	      screenX,
	      screenY
	    } = e.touches[0];
	    let deltaY = Math.abs(screenY - this.endTouchY);
	    this.touchCanceler = true;
	    if (!this.fullsize && deltaY < 10) {
	      this.element.scrollLeft -= screenX - this.endTouchX;
	    }
	    this.endTouchX = screenX;
	    this.endTouchY = screenY;
	    this.endTime = this.now();
	  }
	  onTouchEnd() {
	    if (this.fullsize) {
	      this.disableScroll();
	    }
	    this.touchCanceler = false;
	    let swipped = this.wasSwiped();
	    if (swipped !== 0) {
	      this.snap(swipped);
	    } else {
	      this.snap();
	    }
	    this.startTouchX = undefined;
	    this.startTouchY = undefined;
	    this.startTime = undefined;
	    this.endTouchX = undefined;
	    this.endTouchY = undefined;
	    this.endTime = undefined;
	  }
	  wasSwiped() {
	    let snapWidth = this.layout.pageWidth * this.layout.divisor;
	    let distance = this.endTouchX - this.startTouchX;
	    let absolute = Math.abs(distance);
	    let time = this.endTime - this.startTime;
	    let velocity = distance / time;
	    let minVelocity = this.settings.minVelocity;
	    if (absolute <= this.settings.minDistance || absolute >= snapWidth) {
	      return 0;
	    }
	    if (velocity > minVelocity) {
	      // previous
	      return -1;
	    } else if (velocity < -minVelocity) {
	      // next
	      return 1;
	    }
	  }
	  needsSnap() {
	    let left = this.scrollLeft;
	    let snapWidth = this.layout.pageWidth * this.layout.divisor;
	    return left % snapWidth !== 0;
	  }
	  snap(howMany = 0) {
	    let left = this.scrollLeft;
	    let snapWidth = this.layout.pageWidth * this.layout.divisor;
	    let snapTo = Math.round(left / snapWidth) * snapWidth;
	    if (howMany) {
	      snapTo += howMany * snapWidth;
	    }
	    return this.smoothScrollTo(snapTo);
	  }
	  smoothScrollTo(destination) {
	    const deferred = new core_1();
	    const start = this.scrollLeft;
	    const startTime = this.now();
	    const duration = this.settings.duration;
	    this.snapping = true;

	    // add animation loop
	    function tick() {
	      const now = this.now();
	      const time = Math.min(1, (now - startTime) / duration);
	      if (this.touchCanceler || this.resizeCanceler) {
	        this.resizeCanceler = false;
	        this.snapping = false;
	        deferred.resolve();
	        return;
	      }
	      if (time < 1) {
	        window.requestAnimationFrame(tick.bind(this));
	        this.scrollTo(start + (destination - start) * time, 0);
	      } else {
	        this.scrollTo(destination, 0);
	        this.snapping = false;
	        deferred.resolve();
	      }
	    }
	    tick.call(this);
	    return deferred.promise;
	  }
	  scrollTo(left = 0, top = 0) {
	    if (this.fullsize) {
	      window.scroll(left, top);
	    } else {
	      this.scroller.scrollLeft = left;
	      this.scroller.scrollTop = top;
	    }
	  }
	  now() {
	    return 'now' in window.performance ? performance.now() : new Date().getTime();
	  }
	  destroy() {
	    if (!this.scroller) {
	      return;
	    }
	    if (this.fullsize) {
	      this.enableScroll();
	    }
	    this.removeListeners();
	    this.scroller = undefined;
	  }
	}
	eventEmitter(Snap.prototype);

	class ContinuousViewManager extends DefaultViewManager {
	  constructor(options) {
	    super(options);
	    this.name = 'continuous';
	    this.settings = core_10(this.settings || {}, {
	      infinite: true,
	      overflow: undefined,
	      axis: undefined,
	      writingMode: undefined,
	      flow: 'scrolled',
	      offset: 500,
	      offsetDelta: 250,
	      width: undefined,
	      height: undefined,
	      snap: false,
	      afterScrolledTimeout: 10,
	      allowScriptedContent: false,
	      allowPopups: false,
	      transparency: false
	    });
	    core_10(this.settings, options.settings || {});

	    // Gap can be 0, but defaults doesn't handle that
	    if (options.settings.gap != 'undefined' && options.settings.gap === 0) {
	      this.settings.gap = options.settings.gap;
	    }
	    this.viewSettings = {
	      ignoreClass: this.settings.ignoreClass,
	      axis: this.settings.axis,
	      flow: this.settings.flow,
	      layout: this.layout,
	      width: 0,
	      height: 0,
	      forceEvenPages: false,
	      allowScriptedContent: this.settings.allowScriptedContent,
	      allowPopups: this.settings.allowPopups,
	      transparency: this.settings.transparency
	    };
	    this.scrollTop = 0;
	    this.scrollLeft = 0;
	  }
	  display(section, target) {
	    return DefaultViewManager.prototype.display.call(this, section, target).then(function () {
	      return this.fill();
	    }.bind(this));
	  }
	  fill(_full) {
	    var full = _full || new core_1();
	    this.q.enqueue(() => {
	      return this.check();
	    }).then(result => {
	      if (result) {
	        this.fill(full);
	      } else {
	        full.resolve();
	      }
	    });
	    return full.promise;
	  }
	  moveTo(offset) {
	    // var bounds = this.stage.bounds();
	    // var dist = Math.floor(offset.top / bounds.height) * bounds.height;
	    var distX = 0,
	      distY = 0;
	    if (!this.isPaginated) {
	      distY = offset.top;
	    } else {
	      distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
	    }
	    if (distX > 0 || distY > 0) {
	      this.scrollBy(distX, distY, true);
	    }
	  }
	  afterResized(view) {
	    this.emit(constants_1.MANAGERS.RESIZE, view.section);
	  }

	  // Remove Previous Listeners if present
	  removeShownListeners(view) {
	    // view.off("shown", this.afterDisplayed);
	    // view.off("shown", this.afterDisplayedAbove);
	    view.onDisplayed = function () {};
	  }
	  add(section) {
	    var view = this.createView(section);
	    this.views.append(view);
	    view.on(constants_1.VIEWS.RESIZED, () => {
	      view.expanded = true;
	    });
	    view.on(constants_1.VIEWS.AXIS, axis => {
	      this.updateAxis(axis);
	    });
	    view.on(constants_1.VIEWS.WRITING_MODE, mode => {
	      this.updateWritingMode(mode);
	    });

	    // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
	    view.onDisplayed = this.afterDisplayed.bind(this);
	    view.onResize = this.afterResized.bind(this);
	    return view.display(this.request);
	  }
	  append(section) {
	    var view = this.createView(section);
	    view.on(constants_1.VIEWS.RESIZED, () => {
	      view.expanded = true;
	    });
	    view.on(constants_1.VIEWS.AXIS, axis => {
	      this.updateAxis(axis);
	    });
	    view.on(constants_1.VIEWS.WRITING_MODE, mode => {
	      this.updateWritingMode(mode);
	    });
	    this.views.append(view);
	    view.onDisplayed = this.afterDisplayed.bind(this);
	    return view;
	  }
	  prepend(section) {
	    var view = this.createView(section);
	    view.on(constants_1.VIEWS.RESIZED, bounds => {
	      this.counter(bounds);
	      view.expanded = true;
	    });
	    view.on(constants_1.VIEWS.AXIS, axis => {
	      this.updateAxis(axis);
	    });
	    view.on(constants_1.VIEWS.WRITING_MODE, mode => {
	      this.updateWritingMode(mode);
	    });
	    this.views.prepend(view);
	    view.onDisplayed = this.afterDisplayed.bind(this);
	    return view;
	  }
	  counter(bounds) {
	    if (this.settings.axis === 'vertical') {
	      this.scrollBy(0, bounds.heightDelta, true);
	    } else {
	      this.scrollBy(bounds.widthDelta, 0, true);
	    }
	  }
	  update(_offset) {
	    var container = this.bounds();
	    var views = this.views.all();
	    var viewsLength = views.length;
	    var offset = typeof _offset != 'undefined' ? _offset : this.settings.offset || 0;
	    var isVisible;
	    var view;
	    var updating = new core_1();
	    var promises = [];
	    for (var i = 0; i < viewsLength; i++) {
	      view = views[i];
	      isVisible = this.isVisible(view, offset, offset, container);
	      if (isVisible === true) {
	        // console.log("visible " + view.index, view.displayed);

	        if (!view.displayed) {
	          let displayed = view.display(this.request).then(function (view) {
	            view.show();
	          }, () => {
	            view.hide();
	          });
	          promises.push(displayed);
	        } else {
	          view.show();
	        }
	      } else {
	        this.q.enqueue(view.destroy.bind(view));
	        // console.log("hidden " + view.index, view.displayed);

	        clearTimeout(this.trimTimeout);
	        this.trimTimeout = setTimeout(function () {
	          this.q.enqueue(this.trim.bind(this));
	        }.bind(this), 250);
	      }
	    }
	    if (promises.length) {
	      return Promise.all(promises).catch(err => {
	        updating.reject(err);
	      });
	    } else {
	      updating.resolve();
	      return updating.promise;
	    }
	  }
	  check(_offsetLeft, _offsetTop) {
	    var checking = new core_1();
	    var newViews = [];
	    var horizontal = this.settings.axis === 'horizontal';
	    var delta = this.settings.offset || 0;
	    if (_offsetLeft && horizontal) {
	      delta = _offsetLeft;
	    }
	    if (_offsetTop && !horizontal) {
	      delta = _offsetTop;
	    }
	    var bounds = this._bounds; // bounds saved this until resize

	    let offset = horizontal ? this.scrollLeft : this.scrollTop;
	    let visibleLength = horizontal ? Math.floor(bounds.width) : bounds.height;
	    let contentLength = horizontal ? this.container.scrollWidth : this.container.scrollHeight;
	    let writingMode = this.writingMode && this.writingMode.indexOf('vertical') === 0 ? 'vertical' : 'horizontal';
	    let rtlScrollType = this.settings.rtlScrollType;
	    let rtl = this.settings.direction === 'rtl';
	    if (!this.settings.fullsize) {
	      // Scroll offset starts at width of element
	      if (rtl && rtlScrollType === 'default' && writingMode === 'horizontal') {
	        offset = contentLength - visibleLength - offset;
	      }
	      // Scroll offset starts at 0 and goes negative
	      if (rtl && rtlScrollType === 'negative' && writingMode === 'horizontal') {
	        offset = offset * -1;
	      }
	    } else {
	      // Scroll offset starts at 0 and goes negative
	      if (horizontal && rtl && rtlScrollType === 'negative' || !horizontal && rtl && rtlScrollType === 'default') {
	        offset = offset * -1;
	      }
	    }
	    let prepend = () => {
	      let first = this.views.first();
	      let prev = first && first.section.prev();
	      if (prev) {
	        newViews.push(this.prepend(prev));
	      }
	    };
	    let append = () => {
	      let last = this.views.last();
	      let next = last && last.section.next();
	      if (next) {
	        newViews.push(this.append(next));
	      }
	    };
	    let end = offset + visibleLength + delta;
	    let start = offset - delta;
	    if (end >= contentLength) {
	      append();
	    }
	    if (start < 0) {
	      prepend();
	    }
	    let promises = newViews.map(view => {
	      return view.display(this.request);
	    });
	    if (newViews.length) {
	      return Promise.all(promises).then(() => {
	        return this.check();
	      }).then(() => {
	        // Check to see if anything new is on screen after rendering
	        return this.update(delta);
	      }, err => {
	        return err;
	      });
	    } else {
	      this.q.enqueue(function () {
	        this.update();
	      }.bind(this));
	      checking.resolve(false);
	      return checking.promise;
	    }
	  }
	  trim() {
	    var task = new core_1();
	    var displayed = this.views.displayed();
	    var first = displayed[0];
	    var last = displayed[displayed.length - 1];
	    var firstIndex = this.views.indexOf(first);
	    var lastIndex = this.views.indexOf(last);
	    var above = this.views.slice(0, firstIndex);
	    var below = this.views.slice(lastIndex + 1);

	    // Erase all but last above
	    for (var i = 0; i < above.length - 1; i++) {
	      this.erase(above[i], above);
	    }

	    // Erase all except first below
	    for (var j = 1; j < below.length; j++) {
	      this.erase(below[j]);
	    }
	    task.resolve();
	    return task.promise;
	  }
	  erase(view, above) {
	    //Trim

	    var prevTop;
	    var prevLeft;
	    if (!this.settings.fullsize) {
	      prevTop = this.container.scrollTop;
	      prevLeft = this.container.scrollLeft;
	    } else {
	      prevTop = window.scrollY;
	      prevLeft = window.scrollX;
	    }
	    var bounds = view.bounds();
	    this.views.remove(view);
	    if (above) {
	      if (this.settings.axis === 'vertical') {
	        this.scrollTo(0, prevTop - bounds.height, true);
	      } else {
	        if (this.settings.direction === 'rtl') {
	          if (!this.settings.fullsize) {
	            this.scrollTo(prevLeft, 0, true);
	          } else {
	            this.scrollTo(prevLeft + Math.floor(bounds.width), 0, true);
	          }
	        } else {
	          this.scrollTo(prevLeft - Math.floor(bounds.width), 0, true);
	        }
	      }
	    }
	  }
	  addEventListeners() {
	    window.addEventListener('unload', function () {
	      this.ignore = true;
	      // this.scrollTo(0,0);
	      this.destroy();
	    }.bind(this));
	    this.addScrollListeners();
	    if (this.isPaginated && this.settings.snap) {
	      this.snapper = new Snap(this, this.settings.snap && typeof this.settings.snap === 'object' && this.settings.snap);
	    }
	  }
	  addScrollListeners() {
	    var scroller;
	    this.tick = core_2;
	    let dir = this.settings.direction === 'rtl' && this.settings.rtlScrollType === 'default' ? -1 : 1;
	    this.scrollDeltaVert = 0;
	    this.scrollDeltaHorz = 0;
	    if (!this.settings.fullsize) {
	      scroller = this.container;
	      this.scrollTop = this.container.scrollTop;
	      this.scrollLeft = this.container.scrollLeft;
	    } else {
	      scroller = window;
	      this.scrollTop = window.scrollY * dir;
	      this.scrollLeft = window.scrollX * dir;
	    }
	    this._onScroll = this.onScroll.bind(this);
	    scroller.addEventListener('scroll', this._onScroll);
	    this._scrolled = helpers_1(this.scrolled.bind(this), 30);
	    // this.tick.call(window, this.onScroll.bind(this));

	    this.didScroll = false;
	  }
	  removeEventListeners() {
	    var scroller;
	    if (!this.settings.fullsize) {
	      scroller = this.container;
	    } else {
	      scroller = window;
	    }
	    scroller.removeEventListener('scroll', this._onScroll);
	    this._onScroll = undefined;
	  }
	  onScroll() {
	    let scrollTop;
	    let scrollLeft;
	    let dir = this.settings.direction === 'rtl' && this.settings.rtlScrollType === 'default' ? -1 : 1;
	    if (!this.settings.fullsize) {
	      scrollTop = this.container.scrollTop;
	      scrollLeft = this.container.scrollLeft;
	    } else {
	      scrollTop = window.scrollY * dir;
	      scrollLeft = window.scrollX * dir;
	    }
	    this.scrollTop = scrollTop;
	    this.scrollLeft = scrollLeft;
	    if (!this.ignore) {
	      this._scrolled();
	    } else {
	      this.ignore = false;
	    }
	    this.scrollDeltaVert += Math.abs(scrollTop - this.prevScrollTop);
	    this.scrollDeltaHorz += Math.abs(scrollLeft - this.prevScrollLeft);
	    this.prevScrollTop = scrollTop;
	    this.prevScrollLeft = scrollLeft;
	    clearTimeout(this.scrollTimeout);
	    this.scrollTimeout = setTimeout(function () {
	      this.scrollDeltaVert = 0;
	      this.scrollDeltaHorz = 0;
	    }.bind(this), 150);
	    clearTimeout(this.afterScrolled);
	    this.didScroll = false;
	  }
	  scrolled() {
	    this.q.enqueue(function () {
	      return this.check();
	    }.bind(this));
	    this.emit(constants_1.MANAGERS.SCROLL, {
	      top: this.scrollTop,
	      left: this.scrollLeft
	    });
	    clearTimeout(this.afterScrolled);
	    this.afterScrolled = setTimeout(function () {
	      // Don't report scroll if we are about the snap
	      if (this.snapper && this.snapper.supportsTouch && this.snapper.needsSnap()) {
	        return;
	      }
	      this.emit(constants_1.MANAGERS.SCROLLED, {
	        top: this.scrollTop,
	        left: this.scrollLeft
	      });
	    }.bind(this), this.settings.afterScrolledTimeout);
	  }
	  next() {
	    let delta = this.layout.props.name === 'pre-paginated' && this.layout.props.spread ? this.layout.props.delta * 2 : this.layout.props.delta;
	    if (!this.views.length) return;
	    if (this.isPaginated && this.settings.axis === 'horizontal') {
	      this.scrollBy(delta, 0, true);
	    } else {
	      this.scrollBy(0, this.layout.height, true);
	    }
	    this.q.enqueue(function () {
	      return this.check();
	    }.bind(this));
	  }
	  prev() {
	    let delta = this.layout.props.name === 'pre-paginated' && this.layout.props.spread ? this.layout.props.delta * 2 : this.layout.props.delta;
	    if (!this.views.length) return;
	    if (this.isPaginated && this.settings.axis === 'horizontal') {
	      this.scrollBy(-delta, 0, true);
	    } else {
	      this.scrollBy(0, -this.layout.height, true);
	    }
	    this.q.enqueue(function () {
	      return this.check();
	    }.bind(this));
	  }
	  updateFlow(flow) {
	    if (this.rendered && this.snapper) {
	      this.snapper.destroy();
	      this.snapper = undefined;
	    }
	    super.updateFlow(flow, 'scroll');
	    if (this.rendered && this.isPaginated && this.settings.snap) {
	      this.snapper = new Snap(this, this.settings.snap && typeof this.settings.snap === 'object' && this.settings.snap);
	    }
	  }
	  destroy() {
	    super.destroy();
	    if (this.snapper) {
	      this.snapper.destroy();
	    }
	  }
	}

	/**
	 * Displays an Epub as a series of Views for each Section.
	 * Requires Manager and View class to handle specifics of rendering
	 * the section content.
	 * @class
	 * @param {Book} book
	 * @param {object} [options]
	 * @param {number} [options.width]
	 * @param {number} [options.height]
	 * @param {string} [options.ignoreClass] class for the cfi parser to ignore
	 * @param {string | function | object} [options.manager='default']
	 * @param {string | function} [options.view='iframe']
	 * @param {string} [options.layout] layout to force
	 * @param {string} [options.spread] force spread value
	 * @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
	 * @param {string} [options.stylesheet] url of stylesheet to be injected
	 * @param {boolean} [options.resizeOnOrientationChange] false to disable orientation events
	 * @param {string} [options.script] url of script to be injected
	 * @param {boolean | object} [options.snap=false] use snap scrolling
	 * @param {string} [options.defaultDirection='ltr'] default text direction
	 * @param {boolean} [options.allowScriptedContent=false] enable running scripts in content
	 * @param {boolean} [options.allowPopups=false] enable opening popup in content
	 */
	class Rendition {
	  constructor(book, options) {
	    this.settings = core_10(this.settings || {}, {
	      width: null,
	      height: null,
	      ignoreClass: '',
	      manager: 'default',
	      view: 'iframe',
	      flow: null,
	      layout: null,
	      spread: null,
	      minSpreadWidth: 800,
	      stylesheet: null,
	      resizeOnOrientationChange: true,
	      script: null,
	      snap: false,
	      defaultDirection: 'ltr',
	      allowScriptedContent: false,
	      allowPopups: false
	    });
	    core_10(this.settings, options);
	    if (typeof this.settings.manager === 'object') {
	      this.manager = this.settings.manager;
	    }
	    this.book = book;

	    /**
	     * Adds Hook methods to the Rendition prototype
	     * @member {object} hooks
	     * @property {Hook} hooks.content
	     * @memberof Rendition
	     */
	    this.hooks = {};
	    this.hooks.display = new Hook(this);
	    this.hooks.serialize = new Hook(this);
	    this.hooks.content = new Hook(this);
	    this.hooks.unloaded = new Hook(this);
	    this.hooks.layout = new Hook(this);
	    this.hooks.render = new Hook(this);
	    this.hooks.show = new Hook(this);
	    this.hooks.content.register(this.handleLinks.bind(this));
	    this.hooks.content.register(this.passEvents.bind(this));
	    this.hooks.content.register(this.adjustImages.bind(this));
	    this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));
	    if (this.settings.stylesheet) {
	      this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
	    }
	    if (this.settings.script) {
	      this.book.spine.hooks.content.register(this.injectScript.bind(this));
	    }

	    /**
	     * @member {Themes} themes
	     * @memberof Rendition
	     */
	    this.themes = new Themes(this);

	    /**
	     * @member {Annotations} annotations
	     * @memberof Rendition
	     */
	    this.annotations = new Annotations(this);
	    this.epubcfi = new EpubCFI();
	    this.q = new Queue(this);

	    /**
	     * A Rendered Location Range
	     * @typedef location
	     * @type {Object}
	     * @property {object} start
	     * @property {string} start.index
	     * @property {string} start.href
	     * @property {object} start.displayed
	     * @property {EpubCFI} start.cfi
	     * @property {number} start.location
	     * @property {number} start.percentage
	     * @property {number} start.displayed.page
	     * @property {number} start.displayed.total
	     * @property {object} end
	     * @property {string} end.index
	     * @property {string} end.href
	     * @property {object} end.displayed
	     * @property {EpubCFI} end.cfi
	     * @property {number} end.location
	     * @property {number} end.percentage
	     * @property {number} end.displayed.page
	     * @property {number} end.displayed.total
	     * @property {boolean} atStart
	     * @property {boolean} atEnd
	     * @memberof Rendition
	     */
	    this.location = undefined;

	    // Hold queue until book is opened
	    this.q.enqueue(this.book.opened);
	    this.starting = new core_1();
	    /**
	     * @member {promise} started returns after the rendition has started
	     * @memberof Rendition
	     */
	    this.started = this.starting.promise;

	    // Block the queue until rendering is started
	    this.q.enqueue(this.start);
	  }

	  /**
	   * Set the manager function
	   * @param {function} manager
	   */
	  setManager(manager) {
	    this.manager = manager;
	  }

	  /**
	   * Require the manager from passed string, or as a class function
	   * @param  {string|object} manager [description]
	   * @return {method}
	   */
	  requireManager(manager) {
	    var viewManager;

	    // If manager is a string, try to load from imported managers
	    if (typeof manager === 'string' && manager === 'default') {
	      viewManager = DefaultViewManager;
	    } else if (typeof manager === 'string' && manager === 'continuous') {
	      viewManager = ContinuousViewManager;
	    } else {
	      // otherwise, assume we were passed a class function
	      viewManager = manager;
	    }
	    return viewManager;
	  }

	  /**
	   * Require the view from passed string, or as a class function
	   * @param  {string|object} view
	   * @return {view}
	   */
	  requireView(view) {
	    var View;

	    // If view is a string, try to load from imported views,
	    if (typeof view == 'string' && view === 'iframe') {
	      View = IframeView;
	    } else {
	      // otherwise, assume we were passed a class function
	      View = view;
	    }
	    return View;
	  }

	  /**
	   * Start the rendering
	   * @return {Promise} rendering has started
	   */
	  start() {
	    if (!this.settings.layout && (this.book.package.metadata.layout === 'pre-paginated' || this.book.displayOptions.fixedLayout === 'true')) {
	      this.settings.layout = 'pre-paginated';
	    }
	    switch (this.book.package.metadata.spread) {
	      case 'none':
	        this.settings.spread = 'none';
	        break;
	      case 'both':
	        this.settings.spread = true;
	        break;
	    }
	    if (!this.manager) {
	      this.ViewManager = this.requireManager(this.settings.manager);
	      this.View = this.requireView(this.settings.view);
	      this.manager = new this.ViewManager({
	        view: this.View,
	        queue: this.q,
	        request: this.book.load.bind(this.book),
	        settings: this.settings
	      });
	    }
	    this.direction(this.book.package.metadata.direction || this.settings.defaultDirection);

	    // Parse metadata to get layout props
	    this.settings.globalLayoutProperties = this.determineLayoutProperties(this.book.package.metadata);
	    this.flow(this.settings.globalLayoutProperties.flow);
	    this.layout(this.settings.globalLayoutProperties);

	    // Listen for displayed views
	    this.manager.on(constants_1.MANAGERS.ADDED, this.afterDisplayed.bind(this));
	    this.manager.on(constants_1.MANAGERS.REMOVED, this.afterRemoved.bind(this));

	    // Listen for resizing
	    this.manager.on(constants_1.MANAGERS.RESIZED, this.onResized.bind(this));

	    // Listen for rotation
	    this.manager.on(constants_1.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));

	    // Listen for scroll changes
	    this.manager.on(constants_1.MANAGERS.SCROLLED, this.reportLocation.bind(this));

	    /**
	     * Emit that rendering has started
	     * @event started
	     * @memberof Rendition
	     */
	    this.emit(constants_1.RENDITION.STARTED);

	    // Start processing queue
	    this.starting.resolve();
	  }

	  /**
	   * Call to attach the container to an element in the dom
	   * Container must be attached before rendering can begin
	   * @param  {element} element to attach to
	   * @return {Promise}
	   */
	  attachTo(element) {
	    return this.q.enqueue(function () {
	      // Start rendering
	      this.manager.render(element, {
	        width: this.settings.width,
	        height: this.settings.height
	      });

	      /**
	       * Emit that rendering has attached to an element
	       * @event attached
	       * @memberof Rendition
	       */
	      this.emit(constants_1.RENDITION.ATTACHED);
	    }.bind(this));
	  }

	  /**
	   * Display a point in the book
	   * The request will be added to the rendering Queue,
	   * so it will wait until book is opened, rendering started
	   * and all other rendering tasks have finished to be called.
	   * @param  {string} target Url or EpubCFI
	   * @return {Promise}
	   */
	  display(target) {
	    if (this.displaying) {
	      this.displaying.resolve();
	    }
	    return this.q.enqueue(this._display, target);
	  }

	  /**
	   * Tells the manager what to display immediately
	   * @private
	   * @param  {string} target Url or EpubCFI
	   * @return {Promise}
	   */
	  _display(target) {
	    if (!this.book) {
	      return;
	    }
	    var displaying = new core_1();
	    var displayed = displaying.promise;
	    var section;
	    this.displaying = displaying;

	    // Check if this is a book percentage
	    if (this.book.locations.length() && core_7(target)) {
	      target = this.book.locations.cfiFromPercentage(parseFloat(target));
	    }
	    section = this.book.spine.get(target);
	    if (!section) {
	      displaying.reject(new Error('No Section Found'));
	      return displayed;
	    }
	    this.manager.display(section, target).then(() => {
	      displaying.resolve(section);
	      this.displaying = undefined;

	      /**
	       * Emit that a section has been displayed
	       * @event displayed
	       * @param {Section} section
	       * @memberof Rendition
	       */
	      this.emit(constants_1.RENDITION.DISPLAYED, section);
	      this.reportLocation();
	    }, err => {
	      /**
	       * Emit that has been an error displaying
	       * @event displayError
	       * @param {Section} section
	       * @memberof Rendition
	       */
	      this.emit(constants_1.RENDITION.DISPLAY_ERROR, err);
	    });
	    return displayed;
	  }

	  /*
	  render(view, show) {
	  	// view.onLayout = this.layout.format.bind(this.layout);
	  view.create();
	  	// Fit to size of the container, apply padding
	  this.manager.resizeView(view);
	  	// Render Chain
	  return view.section.render(this.book.request)
	  	.then(function(contents){
	  		return view.load(contents);
	  	}.bind(this))
	  	.then(function(doc){
	  		return this.hooks.content.trigger(view, this);
	  	}.bind(this))
	  	.then(function(){
	  		this.layout.format(view.contents);
	  		return this.hooks.layout.trigger(view, this);
	  	}.bind(this))
	  	.then(function(){
	  		return view.display();
	  	}.bind(this))
	  	.then(function(){
	  		return this.hooks.render.trigger(view, this);
	  	}.bind(this))
	  	.then(function(){
	  		if(show !== false) {
	  			this.q.enqueue(function(view){
	  				view.show();
	  			}, view);
	  		}
	  		// this.map = new Map(view, this.layout);
	  		this.hooks.show.trigger(view, this);
	  		this.trigger("rendered", view.section);
	  		}.bind(this))
	  	.catch(function(e){
	  		this.trigger("loaderror", e);
	  	}.bind(this));
	  }
	  */

	  /**
	   * Report what section has been displayed
	   * @private
	   * @param  {*} view
	   */
	  afterDisplayed(view) {
	    view.on(constants_1.VIEWS.MARK_CLICKED, (cfiRange, data) => this.triggerMarkEvent(cfiRange, data, view.contents));
	    this.hooks.render.trigger(view, this).then(() => {
	      if (view.contents) {
	        this.hooks.content.trigger(view.contents, this).then(() => {
	          /**
	           * Emit that a section has been rendered
	           * @event rendered
	           * @param {Section} section
	           * @param {View} view
	           * @memberof Rendition
	           */
	          this.emit(constants_1.RENDITION.RENDERED, view.section, view);
	        });
	      } else {
	        this.emit(constants_1.RENDITION.RENDERED, view.section, view);
	      }
	    });
	  }

	  /**
	   * Report what has been removed
	   * @private
	   * @param  {*} view
	   */
	  afterRemoved(view) {
	    this.hooks.unloaded.trigger(view, this).then(() => {
	      /**
	       * Emit that a section has been removed
	       * @event removed
	       * @param {Section} section
	       * @param {View} view
	       * @memberof Rendition
	       */
	      this.emit(constants_1.RENDITION.REMOVED, view.section, view);
	    });
	  }

	  /**
	   * Report resize events and display the last seen location
	   * @private
	   */
	  onResized(size, epubcfi) {
	    /**
	     * Emit that the rendition has been resized
	     * @event resized
	     * @param {number} width
	     * @param {height} height
	     * @param {string} epubcfi (optional)
	     * @memberof Rendition
	     */
	    this.emit(constants_1.RENDITION.RESIZED, {
	      width: size.width,
	      height: size.height
	    }, epubcfi);
	    if (this.location && this.location.start) {
	      this.display(epubcfi || this.location.start.cfi);
	    }
	  }

	  /**
	   * Report orientation events and display the last seen location
	   * @private
	   */
	  onOrientationChange(orientation) {
	    /**
	     * Emit that the rendition has been rotated
	     * @event orientationchange
	     * @param {string} orientation
	     * @memberof Rendition
	     */
	    this.emit(constants_1.RENDITION.ORIENTATION_CHANGE, orientation);
	  }

	  /**
	   * Move the Rendition to a specific offset
	   * Usually you would be better off calling display()
	   * @param {object} offset
	   */
	  moveTo(offset) {
	    this.manager.moveTo(offset);
	  }

	  /**
	   * Trigger a resize of the views
	   * @param {number} [width]
	   * @param {number} [height]
	   * @param {string} [epubcfi] (optional)
	   */
	  resize(width, height, epubcfi) {
	    if (width) {
	      this.settings.width = width;
	    }
	    if (height) {
	      this.settings.height = height;
	    }
	    this.manager.resize(width, height, epubcfi);
	  }

	  /**
	   * Clear all rendered views
	   */
	  clear() {
	    this.manager.clear();
	  }

	  /**
	   * Go to the next "page" in the rendition
	   * @return {Promise}
	   */
	  next() {
	    return this.q.enqueue(this.manager.next.bind(this.manager)).then(this.reportLocation.bind(this));
	  }

	  /**
	   * Go to the previous "page" in the rendition
	   * @return {Promise}
	   */
	  prev() {
	    return this.q.enqueue(this.manager.prev.bind(this.manager)).then(this.reportLocation.bind(this));
	  }

	  //-- http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	  /**
	   * Determine the Layout properties from metadata and settings
	   * @private
	   * @param  {object} metadata
	   * @return {object} properties
	   */
	  determineLayoutProperties(metadata) {
	    var properties;
	    var layout = this.settings.layout || metadata.layout || 'reflowable';
	    var spread = this.settings.spread || metadata.spread || 'auto';
	    var orientation = this.settings.orientation || metadata.orientation || 'auto';
	    var flow = this.settings.flow || metadata.flow || 'auto';
	    var viewport = metadata.viewport || '';
	    var minSpreadWidth = this.settings.minSpreadWidth || metadata.minSpreadWidth || 800;
	    var direction = this.settings.direction || metadata.direction || 'ltr';
	    if ((this.settings.width === 0 || this.settings.width > 0) && (this.settings.height === 0 || this.settings.height > 0)) ;
	    properties = {
	      layout: layout,
	      spread: spread,
	      orientation: orientation,
	      flow: flow,
	      viewport: viewport,
	      minSpreadWidth: minSpreadWidth,
	      direction: direction
	    };
	    return properties;
	  }

	  /**
	   * Adjust the flow of the rendition to paginated or scrolled
	   * (scrolled-continuous vs scrolled-doc are handled by different view managers)
	   * @param  {string} flow
	   */
	  flow(flow) {
	    var _flow = flow;
	    if (flow === 'scrolled' || flow === 'scrolled-doc' || flow === 'scrolled-continuous') {
	      _flow = 'scrolled';
	    }
	    if (flow === 'auto' || flow === 'paginated') {
	      _flow = 'paginated';
	    }
	    this.settings.flow = flow;
	    if (this._layout) {
	      this._layout.flow(_flow);
	    }
	    if (this.manager && this._layout) {
	      this.manager.applyLayout(this._layout);
	    }
	    if (this.manager) {
	      this.manager.updateFlow(_flow);
	    }
	    if (this.manager && this.manager.isRendered() && this.location) {
	      this.manager.clear();
	      this.display(this.location.start.cfi);
	    }
	  }

	  /**
	   * Adjust the layout of the rendition to reflowable or pre-paginated
	   * @param  {object} settings
	   */
	  layout(settings) {
	    if (settings) {
	      this._layout = new Layout(settings);
	      this._layout.spread(settings.spread, this.settings.minSpreadWidth);

	      // this.mapping = new Mapping(this._layout.props);

	      this._layout.on(constants_1.LAYOUT.UPDATED, (props, changed) => {
	        this.emit(constants_1.RENDITION.LAYOUT, props, changed);
	      });
	    }
	    if (this.manager && this._layout) {
	      this.manager.applyLayout(this._layout);
	    }
	    return this._layout;
	  }

	  /**
	   * Adjust if the rendition uses spreads
	   * @param  {string} spread none | auto (TODO: implement landscape, portrait, both)
	   * @param  {int} [min] min width to use spreads at
	   */
	  spread(spread, min) {
	    this.settings.spread = spread;
	    if (min) {
	      this.settings.minSpreadWidth = min;
	    }
	    if (this._layout) {
	      this._layout.spread(spread, min);
	    }
	    if (this.manager && this.manager.isRendered()) {
	      this.manager.updateLayout();
	    }
	  }

	  /**
	   * Adjust the direction of the rendition
	   * @param  {string} dir
	   */
	  direction(dir) {
	    this.settings.direction = dir || 'ltr';
	    if (this.manager) {
	      this.manager.direction(this.settings.direction);
	    }
	    if (this.manager && this.manager.isRendered() && this.location) {
	      this.manager.clear();
	      this.display(this.location.start.cfi);
	    }
	  }

	  /**
	   * Report the current location
	   * @fires relocated
	   * @fires locationChanged
	   */
	  reportLocation() {
	    return this.q.enqueue(function reportedLocation() {
	      requestAnimationFrame(function reportedLocationAfterRAF() {
	        var location = this.manager.currentLocation();
	        if (location && location.then && typeof location.then === 'function') {
	          location.then(function (result) {
	            let located = this.located(result);
	            if (!located || !located.start || !located.end) {
	              return;
	            }
	            this.location = located;
	            this.emit(constants_1.RENDITION.LOCATION_CHANGED, {
	              index: this.location.start.index,
	              href: this.location.start.href,
	              start: this.location.start.cfi,
	              end: this.location.end.cfi,
	              percentage: this.location.start.percentage
	            });
	            this.emit(constants_1.RENDITION.RELOCATED, this.location);
	          }.bind(this));
	        } else if (location) {
	          let located = this.located(location);
	          if (!located || !located.start || !located.end) {
	            return;
	          }
	          this.location = located;

	          /**
	           * @event locationChanged
	           * @deprecated
	           * @type {object}
	           * @property {number} index
	           * @property {string} href
	           * @property {EpubCFI} start
	           * @property {EpubCFI} end
	           * @property {number} percentage
	           * @memberof Rendition
	           */
	          this.emit(constants_1.RENDITION.LOCATION_CHANGED, {
	            index: this.location.start.index,
	            href: this.location.start.href,
	            start: this.location.start.cfi,
	            end: this.location.end.cfi,
	            percentage: this.location.start.percentage
	          });

	          /**
	           * @event relocated
	           * @type {displayedLocation}
	           * @memberof Rendition
	           */
	          this.emit(constants_1.RENDITION.RELOCATED, this.location);
	        }
	      }.bind(this));
	    }.bind(this));
	  }

	  /**
	   * Get the Current Location object
	   * @return {displayedLocation | promise} location (may be a promise)
	   */
	  currentLocation() {
	    var location = this.manager.currentLocation();
	    if (location && location.then && typeof location.then === 'function') {
	      location.then(function (result) {
	        let located = this.located(result);
	        return located;
	      }.bind(this));
	    } else if (location) {
	      let located = this.located(location);
	      return located;
	    }
	  }

	  /**
	   * Creates a Rendition#locationRange from location
	   * passed by the Manager
	   * @returns {displayedLocation}
	   * @private
	   */
	  located(location) {
	    if (!location.length) {
	      return {};
	    }
	    let start = location[0];
	    let end = location[location.length - 1];
	    let located = {
	      start: {
	        index: start.index,
	        href: start.href,
	        cfi: start.mapping.start,
	        displayed: {
	          page: start.pages[0] || 1,
	          total: start.totalPages
	        }
	      },
	      end: {
	        index: end.index,
	        href: end.href,
	        cfi: end.mapping.end,
	        displayed: {
	          page: end.pages[end.pages.length - 1] || 1,
	          total: end.totalPages
	        }
	      }
	    };
	    let locationStart = this.book.locations.locationFromCfi(start.mapping.start);
	    let locationEnd = this.book.locations.locationFromCfi(end.mapping.end);
	    if (locationStart != null) {
	      located.start.location = locationStart;
	      located.start.percentage = this.book.locations.percentageFromLocation(locationStart);
	    }
	    if (locationEnd != null) {
	      located.end.location = locationEnd;
	      located.end.percentage = this.book.locations.percentageFromLocation(locationEnd);
	    }
	    let pageStart = this.book.pageList.pageFromCfi(start.mapping.start);
	    let pageEnd = this.book.pageList.pageFromCfi(end.mapping.end);
	    if (pageStart != -1) {
	      located.start.page = pageStart;
	    }
	    if (pageEnd != -1) {
	      located.end.page = pageEnd;
	    }
	    if (end.index === this.book.spine.last().index && located.end.displayed.page >= located.end.displayed.total) {
	      located.atEnd = true;
	    }
	    if (start.index === this.book.spine.first().index && located.start.displayed.page === 1) {
	      located.atStart = true;
	    }
	    return located;
	  }

	  /**
	   * Remove and Clean Up the Rendition
	   */
	  destroy() {
	    // Clear the queue
	    // this.q.clear();
	    // this.q = undefined;

	    this.manager && this.manager.destroy();
	    this.book = undefined;

	    // this.views = null;

	    // this.hooks.display.clear();
	    // this.hooks.serialize.clear();
	    // this.hooks.content.clear();
	    // this.hooks.layout.clear();
	    // this.hooks.render.clear();
	    // this.hooks.show.clear();
	    // this.hooks = {};

	    // this.themes.destroy();
	    // this.themes = undefined;

	    // this.epubcfi = undefined;

	    // this.starting = undefined;
	    // this.started = undefined;
	  }

	  /**
	   * Pass the events from a view's Contents
	   * @private
	   * @param  {Contents} view contents
	   */
	  passEvents(contents) {
	    constants_2.forEach(e => {
	      contents.on(e, ev => this.triggerViewEvent(ev, contents));
	    });
	    contents.on(constants_1.CONTENTS.SELECTED, e => this.triggerSelectedEvent(e, contents));
	  }

	  /**
	   * Emit events passed by a view
	   * @private
	   * @param  {event} e
	   */
	  triggerViewEvent(e, contents) {
	    this.emit(e.type, e, contents);
	  }

	  /**
	   * Emit a selection event's CFI Range passed from a a view
	   * @private
	   * @param  {string} cfirange
	   */
	  triggerSelectedEvent(cfirange, contents) {
	    /**
	     * Emit that a text selection has occurred
	     * @event selected
	     * @param {string} cfirange
	     * @param {Contents} contents
	     * @memberof Rendition
	     */
	    this.emit(constants_1.RENDITION.SELECTED, cfirange, contents);
	  }

	  /**
	   * Emit a markClicked event with the cfiRange and data from a mark
	   * @private
	   * @param  {EpubCFI} cfirange
	   */
	  triggerMarkEvent(cfiRange, data, contents) {
	    /**
	     * Emit that a mark was clicked
	     * @event markClicked
	     * @param {EpubCFI} cfirange
	     * @param {object} data
	     * @param {Contents} contents
	     * @memberof Rendition
	     */
	    this.emit(constants_1.RENDITION.MARK_CLICKED, cfiRange, data, contents);
	  }

	  /**
	   * Get a Range from a Visible CFI
	   * @param  {string} cfi EpubCfi String
	   * @param  {string} ignoreClass
	   * @return {range}
	   */
	  getRange(cfi, ignoreClass) {
	    var _cfi = new EpubCFI(cfi);
	    var found = this.manager.visible().filter(function (view) {
	      if (_cfi.spinePos === view.index) return true;
	    });

	    // Should only every return 1 item
	    if (found.length) {
	      return found[0].contents.range(_cfi, ignoreClass);
	    }
	  }

	  /**
	   * Hook to adjust images to fit in columns
	   * @param  {Contents} contents
	   * @private
	   */
	  adjustImages(contents) {
	    if (this._layout.name === 'pre-paginated') {
	      return new Promise(function (resolve) {
	        resolve();
	      });
	    }
	    let computed = contents.window.getComputedStyle(contents.content, null);
	    let height = (contents.content.offsetHeight - (parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom))) * 0.95;
	    let horizontalPadding = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
	    contents.addStylesheetRules({
	      img: {
	        'max-width': (this._layout.columnWidth ? this._layout.columnWidth - horizontalPadding + 'px' : '100%') + '!important',
	        'max-height': height + 'px' + '!important',
	        'object-fit': 'contain',
	        'page-break-inside': 'avoid',
	        'break-inside': 'avoid',
	        'box-sizing': 'border-box'
	      },
	      svg: {
	        'max-width': (this._layout.columnWidth ? this._layout.columnWidth - horizontalPadding + 'px' : '100%') + '!important',
	        'max-height': height + 'px' + '!important',
	        'page-break-inside': 'avoid',
	        'break-inside': 'avoid'
	      }
	    });
	    return new Promise(function (resolve) {
	      // Wait to apply
	      setTimeout(function () {
	        resolve();
	      }, 1);
	    });
	  }

	  /**
	   * Get the Contents object of each rendered view
	   * @returns {Contents[]}
	   */
	  getContents() {
	    return this.manager ? this.manager.getContents() : [];
	  }

	  /**
	   * Get the views member from the manager
	   * @returns {Views}
	   */
	  views() {
	    let views = this.manager ? this.manager.views : undefined;
	    return views || [];
	  }

	  /**
	   * Hook to handle link clicks in rendered content
	   * @param  {Contents} contents
	   * @private
	   */
	  handleLinks(contents) {
	    if (contents) {
	      contents.on(constants_1.CONTENTS.LINK_CLICKED, href => {
	        let relative = this.book.path.relative(href);
	        this.display(relative);
	      });
	    }
	  }

	  /**
	   * Hook to handle injecting stylesheet before
	   * a Section is serialized
	   * @param  {document} doc
	   * @param  {Section} section
	   * @private
	   */
	  injectStylesheet(doc) {
	    let style = doc.createElement('link');
	    style.setAttribute('type', 'text/css');
	    style.setAttribute('rel', 'stylesheet');
	    style.setAttribute('href', this.settings.stylesheet);
	    doc.getElementsByTagName('head')[0].appendChild(style);
	  }

	  /**
	   * Hook to handle injecting scripts before
	   * a Section is serialized
	   * @param  {document} doc
	   * @param  {Section} section
	   * @private
	   */
	  injectScript(doc) {
	    let script = doc.createElement('script');
	    script.setAttribute('type', 'text/javascript');
	    script.setAttribute('src', this.settings.script);
	    script.textContent = ' '; // Needed to prevent self closing tag
	    doc.getElementsByTagName('head')[0].appendChild(script);
	  }

	  /**
	   * Hook to handle the document identifier before
	   * a Section is serialized
	   * @param  {document} doc
	   * @param  {Section} section
	   * @private
	   */
	  injectIdentifier(doc) {
	    let ident = this.book.packaging.metadata.identifier;
	    let meta = doc.createElement('meta');
	    meta.setAttribute('name', 'dc.relation.ispartof');
	    if (ident) {
	      meta.setAttribute('content', ident);
	    }
	    doc.getElementsByTagName('head')[0].appendChild(meta);
	  }
	}

	//-- Enable binding events to Renderer
	eventEmitter(Rendition.prototype);

	var jszip = createCommonjsModule(function (module, exports) {
	/*!

	JSZip v3.10.1 - A JavaScript class for generating and reading zip files
	<http://stuartk.com/jszip>

	(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
	Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

	JSZip uses the library pako released under the MIT license :
	https://github.com/nodeca/pako/blob/main/LICENSE
	*/

	(function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	var utils = require("./utils");
	var support = require("./support");
	// private property
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


	// public method for encoding
	exports.encode = function(input) {
	    var output = [];
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0, len = input.length, remainingBytes = len;

	    var isArray = utils.getTypeOf(input) !== "string";
	    while (i < input.length) {
	        remainingBytes = len - i;

	        if (!isArray) {
	            chr1 = input.charCodeAt(i++);
	            chr2 = i < len ? input.charCodeAt(i++) : 0;
	            chr3 = i < len ? input.charCodeAt(i++) : 0;
	        } else {
	            chr1 = input[i++];
	            chr2 = i < len ? input[i++] : 0;
	            chr3 = i < len ? input[i++] : 0;
	        }

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = remainingBytes > 1 ? (((chr2 & 15) << 2) | (chr3 >> 6)) : 64;
	        enc4 = remainingBytes > 2 ? (chr3 & 63) : 64;

	        output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));

	    }

	    return output.join("");
	};

	// public method for decoding
	exports.decode = function(input) {
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0, resultIndex = 0;

	    var dataUrlPrefix = "data:";

	    if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
	        // This is a common error: people give a data url
	        // (data:image/png;base64,iVBOR...) with a {base64: true} and
	        // wonders why things don't work.
	        // We can detect that the string input looks like a data url but we
	        // *can't* be sure it is one: removing everything up to the comma would
	        // be too dangerous.
	        throw new Error("Invalid base64 input, it looks like a data url.");
	    }

	    input = input.replace(/[^A-Za-z0-9+/=]/g, "");

	    var totalLength = input.length * 3 / 4;
	    if(input.charAt(input.length - 1) === _keyStr.charAt(64)) {
	        totalLength--;
	    }
	    if(input.charAt(input.length - 2) === _keyStr.charAt(64)) {
	        totalLength--;
	    }
	    if (totalLength % 1 !== 0) {
	        // totalLength is not an integer, the length does not match a valid
	        // base64 content. That can happen if:
	        // - the input is not a base64 content
	        // - the input is *almost* a base64 content, with a extra chars at the
	        //   beginning or at the end
	        // - the input uses a base64 variant (base64url for example)
	        throw new Error("Invalid base64 input, bad content length.");
	    }
	    var output;
	    if (support.uint8array) {
	        output = new Uint8Array(totalLength|0);
	    } else {
	        output = new Array(totalLength|0);
	    }

	    while (i < input.length) {

	        enc1 = _keyStr.indexOf(input.charAt(i++));
	        enc2 = _keyStr.indexOf(input.charAt(i++));
	        enc3 = _keyStr.indexOf(input.charAt(i++));
	        enc4 = _keyStr.indexOf(input.charAt(i++));

	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;

	        output[resultIndex++] = chr1;

	        if (enc3 !== 64) {
	            output[resultIndex++] = chr2;
	        }
	        if (enc4 !== 64) {
	            output[resultIndex++] = chr3;
	        }

	    }

	    return output;
	};

	},{"./support":30,"./utils":32}],2:[function(require,module,exports){

	var external = require("./external");
	var DataWorker = require("./stream/DataWorker");
	var Crc32Probe = require("./stream/Crc32Probe");
	var DataLengthProbe = require("./stream/DataLengthProbe");

	/**
	 * Represent a compressed object, with everything needed to decompress it.
	 * @constructor
	 * @param {number} compressedSize the size of the data compressed.
	 * @param {number} uncompressedSize the size of the data after decompression.
	 * @param {number} crc32 the crc32 of the decompressed file.
	 * @param {object} compression the type of compression, see lib/compressions.js.
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
	 */
	function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
	    this.compressedSize = compressedSize;
	    this.uncompressedSize = uncompressedSize;
	    this.crc32 = crc32;
	    this.compression = compression;
	    this.compressedContent = data;
	}

	CompressedObject.prototype = {
	    /**
	     * Create a worker to get the uncompressed content.
	     * @return {GenericWorker} the worker.
	     */
	    getContentWorker: function () {
	        var worker = new DataWorker(external.Promise.resolve(this.compressedContent))
	            .pipe(this.compression.uncompressWorker())
	            .pipe(new DataLengthProbe("data_length"));

	        var that = this;
	        worker.on("end", function () {
	            if (this.streamInfo["data_length"] !== that.uncompressedSize) {
	                throw new Error("Bug : uncompressed data size mismatch");
	            }
	        });
	        return worker;
	    },
	    /**
	     * Create a worker to get the compressed content.
	     * @return {GenericWorker} the worker.
	     */
	    getCompressedWorker: function () {
	        return new DataWorker(external.Promise.resolve(this.compressedContent))
	            .withStreamInfo("compressedSize", this.compressedSize)
	            .withStreamInfo("uncompressedSize", this.uncompressedSize)
	            .withStreamInfo("crc32", this.crc32)
	            .withStreamInfo("compression", this.compression)
	        ;
	    }
	};

	/**
	 * Chain the given worker with other workers to compress the content with the
	 * given compression.
	 * @param {GenericWorker} uncompressedWorker the worker to pipe.
	 * @param {Object} compression the compression object.
	 * @param {Object} compressionOptions the options to use when compressing.
	 * @return {GenericWorker} the new worker compressing the content.
	 */
	CompressedObject.createWorkerFrom = function (uncompressedWorker, compression, compressionOptions) {
	    return uncompressedWorker
	        .pipe(new Crc32Probe())
	        .pipe(new DataLengthProbe("uncompressedSize"))
	        .pipe(compression.compressWorker(compressionOptions))
	        .pipe(new DataLengthProbe("compressedSize"))
	        .withStreamInfo("compression", compression);
	};

	module.exports = CompressedObject;

	},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(require,module,exports){

	var GenericWorker = require("./stream/GenericWorker");

	exports.STORE = {
	    magic: "\x00\x00",
	    compressWorker : function () {
	        return new GenericWorker("STORE compression");
	    },
	    uncompressWorker : function () {
	        return new GenericWorker("STORE decompression");
	    }
	};
	exports.DEFLATE = require("./flate");

	},{"./flate":7,"./stream/GenericWorker":28}],4:[function(require,module,exports){

	var utils = require("./utils");

	/**
	 * The following functions come from pako, from pako/lib/zlib/crc32.js
	 * released under the MIT license, see pako https://github.com/nodeca/pako/
	 */

	// Use ordinary array, since untyped makes no boost here
	function makeTable() {
	    var c, table = [];

	    for(var n =0; n < 256; n++){
	        c = n;
	        for(var k =0; k < 8; k++){
	            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	        }
	        table[n] = c;
	    }

	    return table;
	}

	// Create table on load. Just 255 signed longs. Not a problem.
	var crcTable = makeTable();


	function crc32(crc, buf, len, pos) {
	    var t = crcTable, end = pos + len;

	    crc = crc ^ (-1);

	    for (var i = pos; i < end; i++ ) {
	        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
	    }

	    return (crc ^ (-1)); // >>> 0;
	}

	// That's all for the pako functions.

	/**
	 * Compute the crc32 of a string.
	 * This is almost the same as the function crc32, but for strings. Using the
	 * same function for the two use cases leads to horrible performances.
	 * @param {Number} crc the starting value of the crc.
	 * @param {String} str the string to use.
	 * @param {Number} len the length of the string.
	 * @param {Number} pos the starting position for the crc32 computation.
	 * @return {Number} the computed crc32.
	 */
	function crc32str(crc, str, len, pos) {
	    var t = crcTable, end = pos + len;

	    crc = crc ^ (-1);

	    for (var i = pos; i < end; i++ ) {
	        crc = (crc >>> 8) ^ t[(crc ^ str.charCodeAt(i)) & 0xFF];
	    }

	    return (crc ^ (-1)); // >>> 0;
	}

	module.exports = function crc32wrapper(input, crc) {
	    if (typeof input === "undefined" || !input.length) {
	        return 0;
	    }

	    var isArray = utils.getTypeOf(input) !== "string";

	    if(isArray) {
	        return crc32(crc|0, input, input.length, 0);
	    } else {
	        return crc32str(crc|0, input, input.length, 0);
	    }
	};

	},{"./utils":32}],5:[function(require,module,exports){
	exports.base64 = false;
	exports.binary = false;
	exports.dir = false;
	exports.createFolders = true;
	exports.date = null;
	exports.compression = null;
	exports.compressionOptions = null;
	exports.comment = null;
	exports.unixPermissions = null;
	exports.dosPermissions = null;

	},{}],6:[function(require,module,exports){

	// load the global object first:
	// - it should be better integrated in the system (unhandledRejection in node)
	// - the environment may have a custom Promise implementation (see zone.js)
	var ES6Promise = null;
	if (typeof Promise !== "undefined") {
	    ES6Promise = Promise;
	} else {
	    ES6Promise = require("lie");
	}

	/**
	 * Let the user use/change some implementations.
	 */
	module.exports = {
	    Promise: ES6Promise
	};

	},{"lie":37}],7:[function(require,module,exports){
	var USE_TYPEDARRAY = (typeof Uint8Array !== "undefined") && (typeof Uint16Array !== "undefined") && (typeof Uint32Array !== "undefined");

	var pako = require("pako");
	var utils = require("./utils");
	var GenericWorker = require("./stream/GenericWorker");

	var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";

	exports.magic = "\x08\x00";

	/**
	 * Create a worker that uses pako to inflate/deflate.
	 * @constructor
	 * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
	 * @param {Object} options the options to use when (de)compressing.
	 */
	function FlateWorker(action, options) {
	    GenericWorker.call(this, "FlateWorker/" + action);

	    this._pako = null;
	    this._pakoAction = action;
	    this._pakoOptions = options;
	    // the `meta` object from the last chunk received
	    // this allow this worker to pass around metadata
	    this.meta = {};
	}

	utils.inherits(FlateWorker, GenericWorker);

	/**
	 * @see GenericWorker.processChunk
	 */
	FlateWorker.prototype.processChunk = function (chunk) {
	    this.meta = chunk.meta;
	    if (this._pako === null) {
	        this._createPako();
	    }
	    this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
	};

	/**
	 * @see GenericWorker.flush
	 */
	FlateWorker.prototype.flush = function () {
	    GenericWorker.prototype.flush.call(this);
	    if (this._pako === null) {
	        this._createPako();
	    }
	    this._pako.push([], true);
	};
	/**
	 * @see GenericWorker.cleanUp
	 */
	FlateWorker.prototype.cleanUp = function () {
	    GenericWorker.prototype.cleanUp.call(this);
	    this._pako = null;
	};

	/**
	 * Create the _pako object.
	 * TODO: lazy-loading this object isn't the best solution but it's the
	 * quickest. The best solution is to lazy-load the worker list. See also the
	 * issue #446.
	 */
	FlateWorker.prototype._createPako = function () {
	    this._pako = new pako[this._pakoAction]({
	        raw: true,
	        level: this._pakoOptions.level || -1 // default compression
	    });
	    var self = this;
	    this._pako.onData = function(data) {
	        self.push({
	            data : data,
	            meta : self.meta
	        });
	    };
	};

	exports.compressWorker = function (compressionOptions) {
	    return new FlateWorker("Deflate", compressionOptions);
	};
	exports.uncompressWorker = function () {
	    return new FlateWorker("Inflate", {});
	};

	},{"./stream/GenericWorker":28,"./utils":32,"pako":38}],8:[function(require,module,exports){

	var utils = require("../utils");
	var GenericWorker = require("../stream/GenericWorker");
	var utf8 = require("../utf8");
	var crc32 = require("../crc32");
	var signature = require("../signature");

	/**
	 * Transform an integer into a string in hexadecimal.
	 * @private
	 * @param {number} dec the number to convert.
	 * @param {number} bytes the number of bytes to generate.
	 * @returns {string} the result.
	 */
	var decToHex = function(dec, bytes) {
	    var hex = "", i;
	    for (i = 0; i < bytes; i++) {
	        hex += String.fromCharCode(dec & 0xff);
	        dec = dec >>> 8;
	    }
	    return hex;
	};

	/**
	 * Generate the UNIX part of the external file attributes.
	 * @param {Object} unixPermissions the unix permissions or null.
	 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
	 * @return {Number} a 32 bit integer.
	 *
	 * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
	 *
	 * TTTTsstrwxrwxrwx0000000000ADVSHR
	 * ^^^^____________________________ file type, see zipinfo.c (UNX_*)
	 *     ^^^_________________________ setuid, setgid, sticky
	 *        ^^^^^^^^^________________ permissions
	 *                 ^^^^^^^^^^______ not used ?
	 *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
	 */
	var generateUnixExternalFileAttr = function (unixPermissions, isDir) {

	    var result = unixPermissions;
	    if (!unixPermissions) {
	        // I can't use octal values in strict mode, hence the hexa.
	        //  040775 => 0x41fd
	        // 0100664 => 0x81b4
	        result = isDir ? 0x41fd : 0x81b4;
	    }
	    return (result & 0xFFFF) << 16;
	};

	/**
	 * Generate the DOS part of the external file attributes.
	 * @param {Object} dosPermissions the dos permissions or null.
	 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
	 * @return {Number} a 32 bit integer.
	 *
	 * Bit 0     Read-Only
	 * Bit 1     Hidden
	 * Bit 2     System
	 * Bit 3     Volume Label
	 * Bit 4     Directory
	 * Bit 5     Archive
	 */
	var generateDosExternalFileAttr = function (dosPermissions) {
	    // the dir flag is already set for compatibility
	    return (dosPermissions || 0)  & 0x3F;
	};

	/**
	 * Generate the various parts used in the construction of the final zip file.
	 * @param {Object} streamInfo the hash with information about the compressed file.
	 * @param {Boolean} streamedContent is the content streamed ?
	 * @param {Boolean} streamingEnded is the stream finished ?
	 * @param {number} offset the current offset from the start of the zip file.
	 * @param {String} platform let's pretend we are this platform (change platform dependents fields)
	 * @param {Function} encodeFileName the function to encode the file name / comment.
	 * @return {Object} the zip parts.
	 */
	var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
	    var file = streamInfo["file"],
	        compression = streamInfo["compression"],
	        useCustomEncoding = encodeFileName !== utf8.utf8encode,
	        encodedFileName = utils.transformTo("string", encodeFileName(file.name)),
	        utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)),
	        comment = file.comment,
	        encodedComment = utils.transformTo("string", encodeFileName(comment)),
	        utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)),
	        useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,
	        useUTF8ForComment = utfEncodedComment.length !== comment.length,
	        dosTime,
	        dosDate,
	        extraFields = "",
	        unicodePathExtraField = "",
	        unicodeCommentExtraField = "",
	        dir = file.dir,
	        date = file.date;


	    var dataInfo = {
	        crc32 : 0,
	        compressedSize : 0,
	        uncompressedSize : 0
	    };

	    // if the content is streamed, the sizes/crc32 are only available AFTER
	    // the end of the stream.
	    if (!streamedContent || streamingEnded) {
	        dataInfo.crc32 = streamInfo["crc32"];
	        dataInfo.compressedSize = streamInfo["compressedSize"];
	        dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
	    }

	    var bitflag = 0;
	    if (streamedContent) {
	        // Bit 3: the sizes/crc32 are set to zero in the local header.
	        // The correct values are put in the data descriptor immediately
	        // following the compressed data.
	        bitflag |= 0x0008;
	    }
	    if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
	        // Bit 11: Language encoding flag (EFS).
	        bitflag |= 0x0800;
	    }


	    var extFileAttr = 0;
	    var versionMadeBy = 0;
	    if (dir) {
	        // dos or unix, we set the dos dir flag
	        extFileAttr |= 0x00010;
	    }
	    if(platform === "UNIX") {
	        versionMadeBy = 0x031E; // UNIX, version 3.0
	        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
	    } else { // DOS or other, fallback to DOS
	        versionMadeBy = 0x0014; // DOS, version 2.0
	        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions);
	    }

	    // date
	    // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
	    // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
	    // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html

	    dosTime = date.getUTCHours();
	    dosTime = dosTime << 6;
	    dosTime = dosTime | date.getUTCMinutes();
	    dosTime = dosTime << 5;
	    dosTime = dosTime | date.getUTCSeconds() / 2;

	    dosDate = date.getUTCFullYear() - 1980;
	    dosDate = dosDate << 4;
	    dosDate = dosDate | (date.getUTCMonth() + 1);
	    dosDate = dosDate << 5;
	    dosDate = dosDate | date.getUTCDate();

	    if (useUTF8ForFileName) {
	        // set the unicode path extra field. unzip needs at least one extra
	        // field to correctly handle unicode path, so using the path is as good
	        // as any other information. This could improve the situation with
	        // other archive managers too.
	        // This field is usually used without the utf8 flag, with a non
	        // unicode path in the header (winrar, winzip). This helps (a bit)
	        // with the messy Windows' default compressed folders feature but
	        // breaks on p7zip which doesn't seek the unicode path extra field.
	        // So for now, UTF-8 everywhere !
	        unicodePathExtraField =
	            // Version
	            decToHex(1, 1) +
	            // NameCRC32
	            decToHex(crc32(encodedFileName), 4) +
	            // UnicodeName
	            utfEncodedFileName;

	        extraFields +=
	            // Info-ZIP Unicode Path Extra Field
	            "\x75\x70" +
	            // size
	            decToHex(unicodePathExtraField.length, 2) +
	            // content
	            unicodePathExtraField;
	    }

	    if(useUTF8ForComment) {

	        unicodeCommentExtraField =
	            // Version
	            decToHex(1, 1) +
	            // CommentCRC32
	            decToHex(crc32(encodedComment), 4) +
	            // UnicodeName
	            utfEncodedComment;

	        extraFields +=
	            // Info-ZIP Unicode Path Extra Field
	            "\x75\x63" +
	            // size
	            decToHex(unicodeCommentExtraField.length, 2) +
	            // content
	            unicodeCommentExtraField;
	    }

	    var header = "";

	    // version needed to extract
	    header += "\x0A\x00";
	    // general purpose bit flag
	    header += decToHex(bitflag, 2);
	    // compression method
	    header += compression.magic;
	    // last mod file time
	    header += decToHex(dosTime, 2);
	    // last mod file date
	    header += decToHex(dosDate, 2);
	    // crc-32
	    header += decToHex(dataInfo.crc32, 4);
	    // compressed size
	    header += decToHex(dataInfo.compressedSize, 4);
	    // uncompressed size
	    header += decToHex(dataInfo.uncompressedSize, 4);
	    // file name length
	    header += decToHex(encodedFileName.length, 2);
	    // extra field length
	    header += decToHex(extraFields.length, 2);


	    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;

	    var dirRecord = signature.CENTRAL_FILE_HEADER +
	        // version made by (00: DOS)
	        decToHex(versionMadeBy, 2) +
	        // file header (common to file and central directory)
	        header +
	        // file comment length
	        decToHex(encodedComment.length, 2) +
	        // disk number start
	        "\x00\x00" +
	        // internal file attributes TODO
	        "\x00\x00" +
	        // external file attributes
	        decToHex(extFileAttr, 4) +
	        // relative offset of local header
	        decToHex(offset, 4) +
	        // file name
	        encodedFileName +
	        // extra field
	        extraFields +
	        // file comment
	        encodedComment;

	    return {
	        fileRecord: fileRecord,
	        dirRecord: dirRecord
	    };
	};

	/**
	 * Generate the EOCD record.
	 * @param {Number} entriesCount the number of entries in the zip file.
	 * @param {Number} centralDirLength the length (in bytes) of the central dir.
	 * @param {Number} localDirLength the length (in bytes) of the local dir.
	 * @param {String} comment the zip file comment as a binary string.
	 * @param {Function} encodeFileName the function to encode the comment.
	 * @return {String} the EOCD record.
	 */
	var generateCentralDirectoryEnd = function (entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
	    var dirEnd = "";
	    var encodedComment = utils.transformTo("string", encodeFileName(comment));

	    // end of central dir signature
	    dirEnd = signature.CENTRAL_DIRECTORY_END +
	        // number of this disk
	        "\x00\x00" +
	        // number of the disk with the start of the central directory
	        "\x00\x00" +
	        // total number of entries in the central directory on this disk
	        decToHex(entriesCount, 2) +
	        // total number of entries in the central directory
	        decToHex(entriesCount, 2) +
	        // size of the central directory   4 bytes
	        decToHex(centralDirLength, 4) +
	        // offset of start of central directory with respect to the starting disk number
	        decToHex(localDirLength, 4) +
	        // .ZIP file comment length
	        decToHex(encodedComment.length, 2) +
	        // .ZIP file comment
	        encodedComment;

	    return dirEnd;
	};

	/**
	 * Generate data descriptors for a file entry.
	 * @param {Object} streamInfo the hash generated by a worker, containing information
	 * on the file entry.
	 * @return {String} the data descriptors.
	 */
	var generateDataDescriptors = function (streamInfo) {
	    var descriptor = "";
	    descriptor = signature.DATA_DESCRIPTOR +
	        // crc-32                          4 bytes
	        decToHex(streamInfo["crc32"], 4) +
	        // compressed size                 4 bytes
	        decToHex(streamInfo["compressedSize"], 4) +
	        // uncompressed size               4 bytes
	        decToHex(streamInfo["uncompressedSize"], 4);

	    return descriptor;
	};


	/**
	 * A worker to concatenate other workers to create a zip file.
	 * @param {Boolean} streamFiles `true` to stream the content of the files,
	 * `false` to accumulate it.
	 * @param {String} comment the comment to use.
	 * @param {String} platform the platform to use, "UNIX" or "DOS".
	 * @param {Function} encodeFileName the function to encode file names and comments.
	 */
	function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
	    GenericWorker.call(this, "ZipFileWorker");
	    // The number of bytes written so far. This doesn't count accumulated chunks.
	    this.bytesWritten = 0;
	    // The comment of the zip file
	    this.zipComment = comment;
	    // The platform "generating" the zip file.
	    this.zipPlatform = platform;
	    // the function to encode file names and comments.
	    this.encodeFileName = encodeFileName;
	    // Should we stream the content of the files ?
	    this.streamFiles = streamFiles;
	    // If `streamFiles` is false, we will need to accumulate the content of the
	    // files to calculate sizes / crc32 (and write them *before* the content).
	    // This boolean indicates if we are accumulating chunks (it will change a lot
	    // during the lifetime of this worker).
	    this.accumulate = false;
	    // The buffer receiving chunks when accumulating content.
	    this.contentBuffer = [];
	    // The list of generated directory records.
	    this.dirRecords = [];
	    // The offset (in bytes) from the beginning of the zip file for the current source.
	    this.currentSourceOffset = 0;
	    // The total number of entries in this zip file.
	    this.entriesCount = 0;
	    // the name of the file currently being added, null when handling the end of the zip file.
	    // Used for the emitted metadata.
	    this.currentFile = null;



	    this._sources = [];
	}
	utils.inherits(ZipFileWorker, GenericWorker);

	/**
	 * @see GenericWorker.push
	 */
	ZipFileWorker.prototype.push = function (chunk) {

	    var currentFilePercent = chunk.meta.percent || 0;
	    var entriesCount = this.entriesCount;
	    var remainingFiles = this._sources.length;

	    if(this.accumulate) {
	        this.contentBuffer.push(chunk);
	    } else {
	        this.bytesWritten += chunk.data.length;

	        GenericWorker.prototype.push.call(this, {
	            data : chunk.data,
	            meta : {
	                currentFile : this.currentFile,
	                percent : entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
	            }
	        });
	    }
	};

	/**
	 * The worker started a new source (an other worker).
	 * @param {Object} streamInfo the streamInfo object from the new source.
	 */
	ZipFileWorker.prototype.openedSource = function (streamInfo) {
	    this.currentSourceOffset = this.bytesWritten;
	    this.currentFile = streamInfo["file"].name;

	    var streamedContent = this.streamFiles && !streamInfo["file"].dir;

	    // don't stream folders (because they don't have any content)
	    if(streamedContent) {
	        var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
	        this.push({
	            data : record.fileRecord,
	            meta : {percent:0}
	        });
	    } else {
	        // we need to wait for the whole file before pushing anything
	        this.accumulate = true;
	    }
	};

	/**
	 * The worker finished a source (an other worker).
	 * @param {Object} streamInfo the streamInfo object from the finished source.
	 */
	ZipFileWorker.prototype.closedSource = function (streamInfo) {
	    this.accumulate = false;
	    var streamedContent = this.streamFiles && !streamInfo["file"].dir;
	    var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);

	    this.dirRecords.push(record.dirRecord);
	    if(streamedContent) {
	        // after the streamed file, we put data descriptors
	        this.push({
	            data : generateDataDescriptors(streamInfo),
	            meta : {percent:100}
	        });
	    } else {
	        // the content wasn't streamed, we need to push everything now
	        // first the file record, then the content
	        this.push({
	            data : record.fileRecord,
	            meta : {percent:0}
	        });
	        while(this.contentBuffer.length) {
	            this.push(this.contentBuffer.shift());
	        }
	    }
	    this.currentFile = null;
	};

	/**
	 * @see GenericWorker.flush
	 */
	ZipFileWorker.prototype.flush = function () {

	    var localDirLength = this.bytesWritten;
	    for(var i = 0; i < this.dirRecords.length; i++) {
	        this.push({
	            data : this.dirRecords[i],
	            meta : {percent:100}
	        });
	    }
	    var centralDirLength = this.bytesWritten - localDirLength;

	    var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);

	    this.push({
	        data : dirEnd,
	        meta : {percent:100}
	    });
	};

	/**
	 * Prepare the next source to be read.
	 */
	ZipFileWorker.prototype.prepareNextSource = function () {
	    this.previous = this._sources.shift();
	    this.openedSource(this.previous.streamInfo);
	    if (this.isPaused) {
	        this.previous.pause();
	    } else {
	        this.previous.resume();
	    }
	};

	/**
	 * @see GenericWorker.registerPrevious
	 */
	ZipFileWorker.prototype.registerPrevious = function (previous) {
	    this._sources.push(previous);
	    var self = this;

	    previous.on("data", function (chunk) {
	        self.processChunk(chunk);
	    });
	    previous.on("end", function () {
	        self.closedSource(self.previous.streamInfo);
	        if(self._sources.length) {
	            self.prepareNextSource();
	        } else {
	            self.end();
	        }
	    });
	    previous.on("error", function (e) {
	        self.error(e);
	    });
	    return this;
	};

	/**
	 * @see GenericWorker.resume
	 */
	ZipFileWorker.prototype.resume = function () {
	    if(!GenericWorker.prototype.resume.call(this)) {
	        return false;
	    }

	    if (!this.previous && this._sources.length) {
	        this.prepareNextSource();
	        return true;
	    }
	    if (!this.previous && !this._sources.length && !this.generatedError) {
	        this.end();
	        return true;
	    }
	};

	/**
	 * @see GenericWorker.error
	 */
	ZipFileWorker.prototype.error = function (e) {
	    var sources = this._sources;
	    if(!GenericWorker.prototype.error.call(this, e)) {
	        return false;
	    }
	    for(var i = 0; i < sources.length; i++) {
	        try {
	            sources[i].error(e);
	        } catch(e) {
	            // the `error` exploded, nothing to do
	        }
	    }
	    return true;
	};

	/**
	 * @see GenericWorker.lock
	 */
	ZipFileWorker.prototype.lock = function () {
	    GenericWorker.prototype.lock.call(this);
	    var sources = this._sources;
	    for(var i = 0; i < sources.length; i++) {
	        sources[i].lock();
	    }
	};

	module.exports = ZipFileWorker;

	},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(require,module,exports){

	var compressions = require("../compressions");
	var ZipFileWorker = require("./ZipFileWorker");

	/**
	 * Find the compression to use.
	 * @param {String} fileCompression the compression defined at the file level, if any.
	 * @param {String} zipCompression the compression defined at the load() level.
	 * @return {Object} the compression object to use.
	 */
	var getCompression = function (fileCompression, zipCompression) {

	    var compressionName = fileCompression || zipCompression;
	    var compression = compressions[compressionName];
	    if (!compression) {
	        throw new Error(compressionName + " is not a valid compression method !");
	    }
	    return compression;
	};

	/**
	 * Create a worker to generate a zip file.
	 * @param {JSZip} zip the JSZip instance at the right root level.
	 * @param {Object} options to generate the zip file.
	 * @param {String} comment the comment to use.
	 */
	exports.generateWorker = function (zip, options, comment) {

	    var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
	    var entriesCount = 0;
	    try {

	        zip.forEach(function (relativePath, file) {
	            entriesCount++;
	            var compression = getCompression(file.options.compression, options.compression);
	            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
	            var dir = file.dir, date = file.date;

	            file._compressWorker(compression, compressionOptions)
	                .withStreamInfo("file", {
	                    name : relativePath,
	                    dir : dir,
	                    date : date,
	                    comment : file.comment || "",
	                    unixPermissions : file.unixPermissions,
	                    dosPermissions : file.dosPermissions
	                })
	                .pipe(zipFileWorker);
	        });
	        zipFileWorker.entriesCount = entriesCount;
	    } catch (e) {
	        zipFileWorker.error(e);
	    }

	    return zipFileWorker;
	};

	},{"../compressions":3,"./ZipFileWorker":8}],10:[function(require,module,exports){

	/**
	 * Representation a of zip file in js
	 * @constructor
	 */
	function JSZip() {
	    // if this constructor is used without `new`, it adds `new` before itself:
	    if(!(this instanceof JSZip)) {
	        return new JSZip();
	    }

	    if(arguments.length) {
	        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
	    }

	    // object containing the files :
	    // {
	    //   "folder/" : {...},
	    //   "folder/data.txt" : {...}
	    // }
	    // NOTE: we use a null prototype because we do not
	    // want filenames like "toString" coming from a zip file
	    // to overwrite methods and attributes in a normal Object.
	    this.files = Object.create(null);

	    this.comment = null;

	    // Where we are in the hierarchy
	    this.root = "";
	    this.clone = function() {
	        var newObj = new JSZip();
	        for (var i in this) {
	            if (typeof this[i] !== "function") {
	                newObj[i] = this[i];
	            }
	        }
	        return newObj;
	    };
	}
	JSZip.prototype = require("./object");
	JSZip.prototype.loadAsync = require("./load");
	JSZip.support = require("./support");
	JSZip.defaults = require("./defaults");

	// TODO find a better way to handle this version,
	// a require('package.json').version doesn't work with webpack, see #327
	JSZip.version = "3.10.1";

	JSZip.loadAsync = function (content, options) {
	    return new JSZip().loadAsync(content, options);
	};

	JSZip.external = require("./external");
	module.exports = JSZip;

	},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(require,module,exports){
	var utils = require("./utils");
	var external = require("./external");
	var utf8 = require("./utf8");
	var ZipEntries = require("./zipEntries");
	var Crc32Probe = require("./stream/Crc32Probe");
	var nodejsUtils = require("./nodejsUtils");

	/**
	 * Check the CRC32 of an entry.
	 * @param {ZipEntry} zipEntry the zip entry to check.
	 * @return {Promise} the result.
	 */
	function checkEntryCRC32(zipEntry) {
	    return new external.Promise(function (resolve, reject) {
	        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
	        worker.on("error", function (e) {
	            reject(e);
	        })
	            .on("end", function () {
	                if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
	                    reject(new Error("Corrupted zip : CRC32 mismatch"));
	                } else {
	                    resolve();
	                }
	            })
	            .resume();
	    });
	}

	module.exports = function (data, options) {
	    var zip = this;
	    options = utils.extend(options || {}, {
	        base64: false,
	        checkCRC32: false,
	        optimizedBinaryString: false,
	        createFolders: false,
	        decodeFileName: utf8.utf8decode
	    });

	    if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
	        return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
	    }

	    return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64)
	        .then(function (data) {
	            var zipEntries = new ZipEntries(options);
	            zipEntries.load(data);
	            return zipEntries;
	        }).then(function checkCRC32(zipEntries) {
	            var promises = [external.Promise.resolve(zipEntries)];
	            var files = zipEntries.files;
	            if (options.checkCRC32) {
	                for (var i = 0; i < files.length; i++) {
	                    promises.push(checkEntryCRC32(files[i]));
	                }
	            }
	            return external.Promise.all(promises);
	        }).then(function addFiles(results) {
	            var zipEntries = results.shift();
	            var files = zipEntries.files;
	            for (var i = 0; i < files.length; i++) {
	                var input = files[i];

	                var unsafeName = input.fileNameStr;
	                var safeName = utils.resolve(input.fileNameStr);

	                zip.file(safeName, input.decompressed, {
	                    binary: true,
	                    optimizedBinaryString: true,
	                    date: input.date,
	                    dir: input.dir,
	                    comment: input.fileCommentStr.length ? input.fileCommentStr : null,
	                    unixPermissions: input.unixPermissions,
	                    dosPermissions: input.dosPermissions,
	                    createFolders: options.createFolders
	                });
	                if (!input.dir) {
	                    zip.file(safeName).unsafeOriginalName = unsafeName;
	                }
	            }
	            if (zipEntries.zipComment.length) {
	                zip.comment = zipEntries.zipComment;
	            }

	            return zip;
	        });
	};

	},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(require,module,exports){

	var utils = require("../utils");
	var GenericWorker = require("../stream/GenericWorker");

	/**
	 * A worker that use a nodejs stream as source.
	 * @constructor
	 * @param {String} filename the name of the file entry for this stream.
	 * @param {Readable} stream the nodejs stream.
	 */
	function NodejsStreamInputAdapter(filename, stream) {
	    GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
	    this._upstreamEnded = false;
	    this._bindStream(stream);
	}

	utils.inherits(NodejsStreamInputAdapter, GenericWorker);

	/**
	 * Prepare the stream and bind the callbacks on it.
	 * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
	 * @param {Stream} stream the nodejs stream to use.
	 */
	NodejsStreamInputAdapter.prototype._bindStream = function (stream) {
	    var self = this;
	    this._stream = stream;
	    stream.pause();
	    stream
	        .on("data", function (chunk) {
	            self.push({
	                data: chunk,
	                meta : {
	                    percent : 0
	                }
	            });
	        })
	        .on("error", function (e) {
	            if(self.isPaused) {
	                this.generatedError = e;
	            } else {
	                self.error(e);
	            }
	        })
	        .on("end", function () {
	            if(self.isPaused) {
	                self._upstreamEnded = true;
	            } else {
	                self.end();
	            }
	        });
	};
	NodejsStreamInputAdapter.prototype.pause = function () {
	    if(!GenericWorker.prototype.pause.call(this)) {
	        return false;
	    }
	    this._stream.pause();
	    return true;
	};
	NodejsStreamInputAdapter.prototype.resume = function () {
	    if(!GenericWorker.prototype.resume.call(this)) {
	        return false;
	    }

	    if(this._upstreamEnded) {
	        this.end();
	    } else {
	        this._stream.resume();
	    }

	    return true;
	};

	module.exports = NodejsStreamInputAdapter;

	},{"../stream/GenericWorker":28,"../utils":32}],13:[function(require,module,exports){

	var Readable = require("readable-stream").Readable;

	var utils = require("../utils");
	utils.inherits(NodejsStreamOutputAdapter, Readable);

	/**
	* A nodejs stream using a worker as source.
	* @see the SourceWrapper in http://nodejs.org/api/stream.html
	* @constructor
	* @param {StreamHelper} helper the helper wrapping the worker
	* @param {Object} options the nodejs stream options
	* @param {Function} updateCb the update callback.
	*/
	function NodejsStreamOutputAdapter(helper, options, updateCb) {
	    Readable.call(this, options);
	    this._helper = helper;

	    var self = this;
	    helper.on("data", function (data, meta) {
	        if (!self.push(data)) {
	            self._helper.pause();
	        }
	        if(updateCb) {
	            updateCb(meta);
	        }
	    })
	        .on("error", function(e) {
	            self.emit("error", e);
	        })
	        .on("end", function () {
	            self.push(null);
	        });
	}


	NodejsStreamOutputAdapter.prototype._read = function() {
	    this._helper.resume();
	};

	module.exports = NodejsStreamOutputAdapter;

	},{"../utils":32,"readable-stream":16}],14:[function(require,module,exports){

	module.exports = {
	    /**
	     * True if this is running in Nodejs, will be undefined in a browser.
	     * In a browser, browserify won't include this file and the whole module
	     * will be resolved an empty object.
	     */
	    isNode : typeof Buffer !== "undefined",
	    /**
	     * Create a new nodejs Buffer from an existing content.
	     * @param {Object} data the data to pass to the constructor.
	     * @param {String} encoding the encoding to use.
	     * @return {Buffer} a new Buffer.
	     */
	    newBufferFrom: function(data, encoding) {
	        if (Buffer.from && Buffer.from !== Uint8Array.from) {
	            return Buffer.from(data, encoding);
	        } else {
	            if (typeof data === "number") {
	                // Safeguard for old Node.js versions. On newer versions,
	                // Buffer.from(number) / Buffer(number, encoding) already throw.
	                throw new Error("The \"data\" argument must not be a number");
	            }
	            return new Buffer(data, encoding);
	        }
	    },
	    /**
	     * Create a new nodejs Buffer with the specified size.
	     * @param {Integer} size the size of the buffer.
	     * @return {Buffer} a new Buffer.
	     */
	    allocBuffer: function (size) {
	        if (Buffer.alloc) {
	            return Buffer.alloc(size);
	        } else {
	            var buf = new Buffer(size);
	            buf.fill(0);
	            return buf;
	        }
	    },
	    /**
	     * Find out if an object is a Buffer.
	     * @param {Object} b the object to test.
	     * @return {Boolean} true if the object is a Buffer, false otherwise.
	     */
	    isBuffer : function(b){
	        return Buffer.isBuffer(b);
	    },

	    isStream : function (obj) {
	        return obj &&
	            typeof obj.on === "function" &&
	            typeof obj.pause === "function" &&
	            typeof obj.resume === "function";
	    }
	};

	},{}],15:[function(require,module,exports){
	var utf8 = require("./utf8");
	var utils = require("./utils");
	var GenericWorker = require("./stream/GenericWorker");
	var StreamHelper = require("./stream/StreamHelper");
	var defaults = require("./defaults");
	var CompressedObject = require("./compressedObject");
	var ZipObject = require("./zipObject");
	var generate = require("./generate");
	var nodejsUtils = require("./nodejsUtils");
	var NodejsStreamInputAdapter = require("./nodejs/NodejsStreamInputAdapter");


	/**
	 * Add a file in the current folder.
	 * @private
	 * @param {string} name the name of the file
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
	 * @param {Object} originalOptions the options of the file
	 * @return {Object} the new file.
	 */
	var fileAdd = function(name, data, originalOptions) {
	    // be sure sub folders exist
	    var dataType = utils.getTypeOf(data),
	        parent;


	    /*
	     * Correct options.
	     */

	    var o = utils.extend(originalOptions || {}, defaults);
	    o.date = o.date || new Date();
	    if (o.compression !== null) {
	        o.compression = o.compression.toUpperCase();
	    }

	    if (typeof o.unixPermissions === "string") {
	        o.unixPermissions = parseInt(o.unixPermissions, 8);
	    }

	    // UNX_IFDIR  0040000 see zipinfo.c
	    if (o.unixPermissions && (o.unixPermissions & 0x4000)) {
	        o.dir = true;
	    }
	    // Bit 4    Directory
	    if (o.dosPermissions && (o.dosPermissions & 0x0010)) {
	        o.dir = true;
	    }

	    if (o.dir) {
	        name = forceTrailingSlash(name);
	    }
	    if (o.createFolders && (parent = parentFolder(name))) {
	        folderAdd.call(this, parent, true);
	    }

	    var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
	    if (!originalOptions || typeof originalOptions.binary === "undefined") {
	        o.binary = !isUnicodeString;
	    }


	    var isCompressedEmpty = (data instanceof CompressedObject) && data.uncompressedSize === 0;

	    if (isCompressedEmpty || o.dir || !data || data.length === 0) {
	        o.base64 = false;
	        o.binary = true;
	        data = "";
	        o.compression = "STORE";
	        dataType = "string";
	    }

	    /*
	     * Convert content to fit.
	     */

	    var zipObjectContent = null;
	    if (data instanceof CompressedObject || data instanceof GenericWorker) {
	        zipObjectContent = data;
	    } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
	        zipObjectContent = new NodejsStreamInputAdapter(name, data);
	    } else {
	        zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
	    }

	    var object = new ZipObject(name, zipObjectContent, o);
	    this.files[name] = object;
	    /*
	    TODO: we can't throw an exception because we have async promises
	    (we can have a promise of a Date() for example) but returning a
	    promise is useless because file(name, data) returns the JSZip
	    object for chaining. Should we break that to allow the user
	    to catch the error ?

	    return external.Promise.resolve(zipObjectContent)
	    .then(function () {
	        return object;
	    });
	    */
	};

	/**
	 * Find the parent folder of the path.
	 * @private
	 * @param {string} path the path to use
	 * @return {string} the parent folder, or ""
	 */
	var parentFolder = function (path) {
	    if (path.slice(-1) === "/") {
	        path = path.substring(0, path.length - 1);
	    }
	    var lastSlash = path.lastIndexOf("/");
	    return (lastSlash > 0) ? path.substring(0, lastSlash) : "";
	};

	/**
	 * Returns the path with a slash at the end.
	 * @private
	 * @param {String} path the path to check.
	 * @return {String} the path with a trailing slash.
	 */
	var forceTrailingSlash = function(path) {
	    // Check the name ends with a /
	    if (path.slice(-1) !== "/") {
	        path += "/"; // IE doesn't like substr(-1)
	    }
	    return path;
	};

	/**
	 * Add a (sub) folder in the current folder.
	 * @private
	 * @param {string} name the folder's name
	 * @param {boolean=} [createFolders] If true, automatically create sub
	 *  folders. Defaults to false.
	 * @return {Object} the new folder.
	 */
	var folderAdd = function(name, createFolders) {
	    createFolders = (typeof createFolders !== "undefined") ? createFolders : defaults.createFolders;

	    name = forceTrailingSlash(name);

	    // Does this folder already exist?
	    if (!this.files[name]) {
	        fileAdd.call(this, name, null, {
	            dir: true,
	            createFolders: createFolders
	        });
	    }
	    return this.files[name];
	};

	/**
	* Cross-window, cross-Node-context regular expression detection
	* @param  {Object}  object Anything
	* @return {Boolean}        true if the object is a regular expression,
	* false otherwise
	*/
	function isRegExp(object) {
	    return Object.prototype.toString.call(object) === "[object RegExp]";
	}

	// return the actual prototype of JSZip
	var out = {
	    /**
	     * @see loadAsync
	     */
	    load: function() {
	        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	    },


	    /**
	     * Call a callback function for each entry at this folder level.
	     * @param {Function} cb the callback function:
	     * function (relativePath, file) {...}
	     * It takes 2 arguments : the relative path and the file.
	     */
	    forEach: function(cb) {
	        var filename, relativePath, file;
	        // ignore warning about unwanted properties because this.files is a null prototype object
	        /* eslint-disable-next-line guard-for-in */
	        for (filename in this.files) {
	            file = this.files[filename];
	            relativePath = filename.slice(this.root.length, filename.length);
	            if (relativePath && filename.slice(0, this.root.length) === this.root) { // the file is in the current root
	                cb(relativePath, file); // TODO reverse the parameters ? need to be clean AND consistent with the filter search fn...
	            }
	        }
	    },

	    /**
	     * Filter nested files/folders with the specified function.
	     * @param {Function} search the predicate to use :
	     * function (relativePath, file) {...}
	     * It takes 2 arguments : the relative path and the file.
	     * @return {Array} An array of matching elements.
	     */
	    filter: function(search) {
	        var result = [];
	        this.forEach(function (relativePath, entry) {
	            if (search(relativePath, entry)) { // the file matches the function
	                result.push(entry);
	            }

	        });
	        return result;
	    },

	    /**
	     * Add a file to the zip file, or search a file.
	     * @param   {string|RegExp} name The name of the file to add (if data is defined),
	     * the name of the file to find (if no data) or a regex to match files.
	     * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
	     * @param   {Object} o     File options
	     * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
	     * a file (when searching by string) or an array of files (when searching by regex).
	     */
	    file: function(name, data, o) {
	        if (arguments.length === 1) {
	            if (isRegExp(name)) {
	                var regexp = name;
	                return this.filter(function(relativePath, file) {
	                    return !file.dir && regexp.test(relativePath);
	                });
	            }
	            else { // text
	                var obj = this.files[this.root + name];
	                if (obj && !obj.dir) {
	                    return obj;
	                } else {
	                    return null;
	                }
	            }
	        }
	        else { // more than one argument : we have data !
	            name = this.root + name;
	            fileAdd.call(this, name, data, o);
	        }
	        return this;
	    },

	    /**
	     * Add a directory to the zip file, or search.
	     * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
	     * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
	     */
	    folder: function(arg) {
	        if (!arg) {
	            return this;
	        }

	        if (isRegExp(arg)) {
	            return this.filter(function(relativePath, file) {
	                return file.dir && arg.test(relativePath);
	            });
	        }

	        // else, name is a new folder
	        var name = this.root + arg;
	        var newFolder = folderAdd.call(this, name);

	        // Allow chaining by returning a new object with this folder as the root
	        var ret = this.clone();
	        ret.root = newFolder.name;
	        return ret;
	    },

	    /**
	     * Delete a file, or a directory and all sub-files, from the zip
	     * @param {string} name the name of the file to delete
	     * @return {JSZip} this JSZip object
	     */
	    remove: function(name) {
	        name = this.root + name;
	        var file = this.files[name];
	        if (!file) {
	            // Look for any folders
	            if (name.slice(-1) !== "/") {
	                name += "/";
	            }
	            file = this.files[name];
	        }

	        if (file && !file.dir) {
	            // file
	            delete this.files[name];
	        } else {
	            // maybe a folder, delete recursively
	            var kids = this.filter(function(relativePath, file) {
	                return file.name.slice(0, name.length) === name;
	            });
	            for (var i = 0; i < kids.length; i++) {
	                delete this.files[kids[i].name];
	            }
	        }

	        return this;
	    },

	    /**
	     * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
	     */
	    generate: function() {
	        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	    },

	    /**
	     * Generate the complete zip file as an internal stream.
	     * @param {Object} options the options to generate the zip file :
	     * - compression, "STORE" by default.
	     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
	     * @return {StreamHelper} the streamed zip file.
	     */
	    generateInternalStream: function(options) {
	        var worker, opts = {};
	        try {
	            opts = utils.extend(options || {}, {
	                streamFiles: false,
	                compression: "STORE",
	                compressionOptions : null,
	                type: "",
	                platform: "DOS",
	                comment: null,
	                mimeType: "application/zip",
	                encodeFileName: utf8.utf8encode
	            });

	            opts.type = opts.type.toLowerCase();
	            opts.compression = opts.compression.toUpperCase();

	            // "binarystring" is preferred but the internals use "string".
	            if(opts.type === "binarystring") {
	                opts.type = "string";
	            }

	            if (!opts.type) {
	                throw new Error("No output type specified.");
	            }

	            utils.checkSupport(opts.type);

	            // accept nodejs `process.platform`
	            if(
	                opts.platform === "darwin" ||
	                opts.platform === "freebsd" ||
	                opts.platform === "linux" ||
	                opts.platform === "sunos"
	            ) {
	                opts.platform = "UNIX";
	            }
	            if (opts.platform === "win32") {
	                opts.platform = "DOS";
	            }

	            var comment = opts.comment || this.comment || "";
	            worker = generate.generateWorker(this, opts, comment);
	        } catch (e) {
	            worker = new GenericWorker("error");
	            worker.error(e);
	        }
	        return new StreamHelper(worker, opts.type || "string", opts.mimeType);
	    },
	    /**
	     * Generate the complete zip file asynchronously.
	     * @see generateInternalStream
	     */
	    generateAsync: function(options, onUpdate) {
	        return this.generateInternalStream(options).accumulate(onUpdate);
	    },
	    /**
	     * Generate the complete zip file asynchronously.
	     * @see generateInternalStream
	     */
	    generateNodeStream: function(options, onUpdate) {
	        options = options || {};
	        if (!options.type) {
	            options.type = "nodebuffer";
	        }
	        return this.generateInternalStream(options).toNodejsStream(onUpdate);
	    }
	};
	module.exports = out;

	},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(require,module,exports){
	/*
	 * This file is used by module bundlers (browserify/webpack/etc) when
	 * including a stream implementation. We use "readable-stream" to get a
	 * consistent behavior between nodejs versions but bundlers often have a shim
	 * for "stream". Using this shim greatly improve the compatibility and greatly
	 * reduce the final size of the bundle (only one stream implementation, not
	 * two).
	 */
	module.exports = require("stream");

	},{"stream":undefined}],17:[function(require,module,exports){
	var DataReader = require("./DataReader");
	var utils = require("../utils");

	function ArrayReader(data) {
	    DataReader.call(this, data);
	    for(var i = 0; i < this.data.length; i++) {
	        data[i] = data[i] & 0xFF;
	    }
	}
	utils.inherits(ArrayReader, DataReader);
	/**
	 * @see DataReader.byteAt
	 */
	ArrayReader.prototype.byteAt = function(i) {
	    return this.data[this.zero + i];
	};
	/**
	 * @see DataReader.lastIndexOfSignature
	 */
	ArrayReader.prototype.lastIndexOfSignature = function(sig) {
	    var sig0 = sig.charCodeAt(0),
	        sig1 = sig.charCodeAt(1),
	        sig2 = sig.charCodeAt(2),
	        sig3 = sig.charCodeAt(3);
	    for (var i = this.length - 4; i >= 0; --i) {
	        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
	            return i - this.zero;
	        }
	    }

	    return -1;
	};
	/**
	 * @see DataReader.readAndCheckSignature
	 */
	ArrayReader.prototype.readAndCheckSignature = function (sig) {
	    var sig0 = sig.charCodeAt(0),
	        sig1 = sig.charCodeAt(1),
	        sig2 = sig.charCodeAt(2),
	        sig3 = sig.charCodeAt(3),
	        data = this.readData(4);
	    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
	};
	/**
	 * @see DataReader.readData
	 */
	ArrayReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    if(size === 0) {
	        return [];
	    }
	    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = ArrayReader;

	},{"../utils":32,"./DataReader":18}],18:[function(require,module,exports){
	var utils = require("../utils");

	function DataReader(data) {
	    this.data = data; // type : see implementation
	    this.length = data.length;
	    this.index = 0;
	    this.zero = 0;
	}
	DataReader.prototype = {
	    /**
	     * Check that the offset will not go too far.
	     * @param {string} offset the additional offset to check.
	     * @throws {Error} an Error if the offset is out of bounds.
	     */
	    checkOffset: function(offset) {
	        this.checkIndex(this.index + offset);
	    },
	    /**
	     * Check that the specified index will not be too far.
	     * @param {string} newIndex the index to check.
	     * @throws {Error} an Error if the index is out of bounds.
	     */
	    checkIndex: function(newIndex) {
	        if (this.length < this.zero + newIndex || newIndex < 0) {
	            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + (newIndex) + "). Corrupted zip ?");
	        }
	    },
	    /**
	     * Change the index.
	     * @param {number} newIndex The new index.
	     * @throws {Error} if the new index is out of the data.
	     */
	    setIndex: function(newIndex) {
	        this.checkIndex(newIndex);
	        this.index = newIndex;
	    },
	    /**
	     * Skip the next n bytes.
	     * @param {number} n the number of bytes to skip.
	     * @throws {Error} if the new index is out of the data.
	     */
	    skip: function(n) {
	        this.setIndex(this.index + n);
	    },
	    /**
	     * Get the byte at the specified index.
	     * @param {number} i the index to use.
	     * @return {number} a byte.
	     */
	    byteAt: function() {
	        // see implementations
	    },
	    /**
	     * Get the next number with a given byte size.
	     * @param {number} size the number of bytes to read.
	     * @return {number} the corresponding number.
	     */
	    readInt: function(size) {
	        var result = 0,
	            i;
	        this.checkOffset(size);
	        for (i = this.index + size - 1; i >= this.index; i--) {
	            result = (result << 8) + this.byteAt(i);
	        }
	        this.index += size;
	        return result;
	    },
	    /**
	     * Get the next string with a given byte size.
	     * @param {number} size the number of bytes to read.
	     * @return {string} the corresponding string.
	     */
	    readString: function(size) {
	        return utils.transformTo("string", this.readData(size));
	    },
	    /**
	     * Get raw data without conversion, <size> bytes.
	     * @param {number} size the number of bytes to read.
	     * @return {Object} the raw data, implementation specific.
	     */
	    readData: function() {
	        // see implementations
	    },
	    /**
	     * Find the last occurrence of a zip signature (4 bytes).
	     * @param {string} sig the signature to find.
	     * @return {number} the index of the last occurrence, -1 if not found.
	     */
	    lastIndexOfSignature: function() {
	        // see implementations
	    },
	    /**
	     * Read the signature (4 bytes) at the current position and compare it with sig.
	     * @param {string} sig the expected signature
	     * @return {boolean} true if the signature matches, false otherwise.
	     */
	    readAndCheckSignature: function() {
	        // see implementations
	    },
	    /**
	     * Get the next date.
	     * @return {Date} the date.
	     */
	    readDate: function() {
	        var dostime = this.readInt(4);
	        return new Date(Date.UTC(
	            ((dostime >> 25) & 0x7f) + 1980, // year
	            ((dostime >> 21) & 0x0f) - 1, // month
	            (dostime >> 16) & 0x1f, // day
	            (dostime >> 11) & 0x1f, // hour
	            (dostime >> 5) & 0x3f, // minute
	            (dostime & 0x1f) << 1)); // second
	    }
	};
	module.exports = DataReader;

	},{"../utils":32}],19:[function(require,module,exports){
	var Uint8ArrayReader = require("./Uint8ArrayReader");
	var utils = require("../utils");

	function NodeBufferReader(data) {
	    Uint8ArrayReader.call(this, data);
	}
	utils.inherits(NodeBufferReader, Uint8ArrayReader);

	/**
	 * @see DataReader.readData
	 */
	NodeBufferReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = NodeBufferReader;

	},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(require,module,exports){
	var DataReader = require("./DataReader");
	var utils = require("../utils");

	function StringReader(data) {
	    DataReader.call(this, data);
	}
	utils.inherits(StringReader, DataReader);
	/**
	 * @see DataReader.byteAt
	 */
	StringReader.prototype.byteAt = function(i) {
	    return this.data.charCodeAt(this.zero + i);
	};
	/**
	 * @see DataReader.lastIndexOfSignature
	 */
	StringReader.prototype.lastIndexOfSignature = function(sig) {
	    return this.data.lastIndexOf(sig) - this.zero;
	};
	/**
	 * @see DataReader.readAndCheckSignature
	 */
	StringReader.prototype.readAndCheckSignature = function (sig) {
	    var data = this.readData(4);
	    return sig === data;
	};
	/**
	 * @see DataReader.readData
	 */
	StringReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    // this will work because the constructor applied the "& 0xff" mask.
	    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = StringReader;

	},{"../utils":32,"./DataReader":18}],21:[function(require,module,exports){
	var ArrayReader = require("./ArrayReader");
	var utils = require("../utils");

	function Uint8ArrayReader(data) {
	    ArrayReader.call(this, data);
	}
	utils.inherits(Uint8ArrayReader, ArrayReader);
	/**
	 * @see DataReader.readData
	 */
	Uint8ArrayReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    if(size === 0) {
	        // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
	        return new Uint8Array(0);
	    }
	    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = Uint8ArrayReader;

	},{"../utils":32,"./ArrayReader":17}],22:[function(require,module,exports){

	var utils = require("../utils");
	var support = require("../support");
	var ArrayReader = require("./ArrayReader");
	var StringReader = require("./StringReader");
	var NodeBufferReader = require("./NodeBufferReader");
	var Uint8ArrayReader = require("./Uint8ArrayReader");

	/**
	 * Create a reader adapted to the data.
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
	 * @return {DataReader} the data reader.
	 */
	module.exports = function (data) {
	    var type = utils.getTypeOf(data);
	    utils.checkSupport(type);
	    if (type === "string" && !support.uint8array) {
	        return new StringReader(data);
	    }
	    if (type === "nodebuffer") {
	        return new NodeBufferReader(data);
	    }
	    if (support.uint8array) {
	        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
	    }
	    return new ArrayReader(utils.transformTo("array", data));
	};

	},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(require,module,exports){
	exports.LOCAL_FILE_HEADER = "PK\x03\x04";
	exports.CENTRAL_FILE_HEADER = "PK\x01\x02";
	exports.CENTRAL_DIRECTORY_END = "PK\x05\x06";
	exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x06\x07";
	exports.ZIP64_CENTRAL_DIRECTORY_END = "PK\x06\x06";
	exports.DATA_DESCRIPTOR = "PK\x07\x08";

	},{}],24:[function(require,module,exports){

	var GenericWorker = require("./GenericWorker");
	var utils = require("../utils");

	/**
	 * A worker which convert chunks to a specified type.
	 * @constructor
	 * @param {String} destType the destination type.
	 */
	function ConvertWorker(destType) {
	    GenericWorker.call(this, "ConvertWorker to " + destType);
	    this.destType = destType;
	}
	utils.inherits(ConvertWorker, GenericWorker);

	/**
	 * @see GenericWorker.processChunk
	 */
	ConvertWorker.prototype.processChunk = function (chunk) {
	    this.push({
	        data : utils.transformTo(this.destType, chunk.data),
	        meta : chunk.meta
	    });
	};
	module.exports = ConvertWorker;

	},{"../utils":32,"./GenericWorker":28}],25:[function(require,module,exports){

	var GenericWorker = require("./GenericWorker");
	var crc32 = require("../crc32");
	var utils = require("../utils");

	/**
	 * A worker which calculate the crc32 of the data flowing through.
	 * @constructor
	 */
	function Crc32Probe() {
	    GenericWorker.call(this, "Crc32Probe");
	    this.withStreamInfo("crc32", 0);
	}
	utils.inherits(Crc32Probe, GenericWorker);

	/**
	 * @see GenericWorker.processChunk
	 */
	Crc32Probe.prototype.processChunk = function (chunk) {
	    this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
	    this.push(chunk);
	};
	module.exports = Crc32Probe;

	},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(require,module,exports){

	var utils = require("../utils");
	var GenericWorker = require("./GenericWorker");

	/**
	 * A worker which calculate the total length of the data flowing through.
	 * @constructor
	 * @param {String} propName the name used to expose the length
	 */
	function DataLengthProbe(propName) {
	    GenericWorker.call(this, "DataLengthProbe for " + propName);
	    this.propName = propName;
	    this.withStreamInfo(propName, 0);
	}
	utils.inherits(DataLengthProbe, GenericWorker);

	/**
	 * @see GenericWorker.processChunk
	 */
	DataLengthProbe.prototype.processChunk = function (chunk) {
	    if(chunk) {
	        var length = this.streamInfo[this.propName] || 0;
	        this.streamInfo[this.propName] = length + chunk.data.length;
	    }
	    GenericWorker.prototype.processChunk.call(this, chunk);
	};
	module.exports = DataLengthProbe;


	},{"../utils":32,"./GenericWorker":28}],27:[function(require,module,exports){

	var utils = require("../utils");
	var GenericWorker = require("./GenericWorker");

	// the size of the generated chunks
	// TODO expose this as a public variable
	var DEFAULT_BLOCK_SIZE = 16 * 1024;

	/**
	 * A worker that reads a content and emits chunks.
	 * @constructor
	 * @param {Promise} dataP the promise of the data to split
	 */
	function DataWorker(dataP) {
	    GenericWorker.call(this, "DataWorker");
	    var self = this;
	    this.dataIsReady = false;
	    this.index = 0;
	    this.max = 0;
	    this.data = null;
	    this.type = "";

	    this._tickScheduled = false;

	    dataP.then(function (data) {
	        self.dataIsReady = true;
	        self.data = data;
	        self.max = data && data.length || 0;
	        self.type = utils.getTypeOf(data);
	        if(!self.isPaused) {
	            self._tickAndRepeat();
	        }
	    }, function (e) {
	        self.error(e);
	    });
	}

	utils.inherits(DataWorker, GenericWorker);

	/**
	 * @see GenericWorker.cleanUp
	 */
	DataWorker.prototype.cleanUp = function () {
	    GenericWorker.prototype.cleanUp.call(this);
	    this.data = null;
	};

	/**
	 * @see GenericWorker.resume
	 */
	DataWorker.prototype.resume = function () {
	    if(!GenericWorker.prototype.resume.call(this)) {
	        return false;
	    }

	    if (!this._tickScheduled && this.dataIsReady) {
	        this._tickScheduled = true;
	        utils.delay(this._tickAndRepeat, [], this);
	    }
	    return true;
	};

	/**
	 * Trigger a tick a schedule an other call to this function.
	 */
	DataWorker.prototype._tickAndRepeat = function() {
	    this._tickScheduled = false;
	    if(this.isPaused || this.isFinished) {
	        return;
	    }
	    this._tick();
	    if(!this.isFinished) {
	        utils.delay(this._tickAndRepeat, [], this);
	        this._tickScheduled = true;
	    }
	};

	/**
	 * Read and push a chunk.
	 */
	DataWorker.prototype._tick = function() {

	    if(this.isPaused || this.isFinished) {
	        return false;
	    }

	    var size = DEFAULT_BLOCK_SIZE;
	    var data = null, nextIndex = Math.min(this.max, this.index + size);
	    if (this.index >= this.max) {
	        // EOF
	        return this.end();
	    } else {
	        switch(this.type) {
	        case "string":
	            data = this.data.substring(this.index, nextIndex);
	            break;
	        case "uint8array":
	            data = this.data.subarray(this.index, nextIndex);
	            break;
	        case "array":
	        case "nodebuffer":
	            data = this.data.slice(this.index, nextIndex);
	            break;
	        }
	        this.index = nextIndex;
	        return this.push({
	            data : data,
	            meta : {
	                percent : this.max ? this.index / this.max * 100 : 0
	            }
	        });
	    }
	};

	module.exports = DataWorker;

	},{"../utils":32,"./GenericWorker":28}],28:[function(require,module,exports){

	/**
	 * A worker that does nothing but passing chunks to the next one. This is like
	 * a nodejs stream but with some differences. On the good side :
	 * - it works on IE 6-9 without any issue / polyfill
	 * - it weights less than the full dependencies bundled with browserify
	 * - it forwards errors (no need to declare an error handler EVERYWHERE)
	 *
	 * A chunk is an object with 2 attributes : `meta` and `data`. The former is an
	 * object containing anything (`percent` for example), see each worker for more
	 * details. The latter is the real data (String, Uint8Array, etc).
	 *
	 * @constructor
	 * @param {String} name the name of the stream (mainly used for debugging purposes)
	 */
	function GenericWorker(name) {
	    // the name of the worker
	    this.name = name || "default";
	    // an object containing metadata about the workers chain
	    this.streamInfo = {};
	    // an error which happened when the worker was paused
	    this.generatedError = null;
	    // an object containing metadata to be merged by this worker into the general metadata
	    this.extraStreamInfo = {};
	    // true if the stream is paused (and should not do anything), false otherwise
	    this.isPaused = true;
	    // true if the stream is finished (and should not do anything), false otherwise
	    this.isFinished = false;
	    // true if the stream is locked to prevent further structure updates (pipe), false otherwise
	    this.isLocked = false;
	    // the event listeners
	    this._listeners = {
	        "data":[],
	        "end":[],
	        "error":[]
	    };
	    // the previous worker, if any
	    this.previous = null;
	}

	GenericWorker.prototype = {
	    /**
	     * Push a chunk to the next workers.
	     * @param {Object} chunk the chunk to push
	     */
	    push : function (chunk) {
	        this.emit("data", chunk);
	    },
	    /**
	     * End the stream.
	     * @return {Boolean} true if this call ended the worker, false otherwise.
	     */
	    end : function () {
	        if (this.isFinished) {
	            return false;
	        }

	        this.flush();
	        try {
	            this.emit("end");
	            this.cleanUp();
	            this.isFinished = true;
	        } catch (e) {
	            this.emit("error", e);
	        }
	        return true;
	    },
	    /**
	     * End the stream with an error.
	     * @param {Error} e the error which caused the premature end.
	     * @return {Boolean} true if this call ended the worker with an error, false otherwise.
	     */
	    error : function (e) {
	        if (this.isFinished) {
	            return false;
	        }

	        if(this.isPaused) {
	            this.generatedError = e;
	        } else {
	            this.isFinished = true;

	            this.emit("error", e);

	            // in the workers chain exploded in the middle of the chain,
	            // the error event will go downward but we also need to notify
	            // workers upward that there has been an error.
	            if(this.previous) {
	                this.previous.error(e);
	            }

	            this.cleanUp();
	        }
	        return true;
	    },
	    /**
	     * Add a callback on an event.
	     * @param {String} name the name of the event (data, end, error)
	     * @param {Function} listener the function to call when the event is triggered
	     * @return {GenericWorker} the current object for chainability
	     */
	    on : function (name, listener) {
	        this._listeners[name].push(listener);
	        return this;
	    },
	    /**
	     * Clean any references when a worker is ending.
	     */
	    cleanUp : function () {
	        this.streamInfo = this.generatedError = this.extraStreamInfo = null;
	        this._listeners = [];
	    },
	    /**
	     * Trigger an event. This will call registered callback with the provided arg.
	     * @param {String} name the name of the event (data, end, error)
	     * @param {Object} arg the argument to call the callback with.
	     */
	    emit : function (name, arg) {
	        if (this._listeners[name]) {
	            for(var i = 0; i < this._listeners[name].length; i++) {
	                this._listeners[name][i].call(this, arg);
	            }
	        }
	    },
	    /**
	     * Chain a worker with an other.
	     * @param {Worker} next the worker receiving events from the current one.
	     * @return {worker} the next worker for chainability
	     */
	    pipe : function (next) {
	        return next.registerPrevious(this);
	    },
	    /**
	     * Same as `pipe` in the other direction.
	     * Using an API with `pipe(next)` is very easy.
	     * Implementing the API with the point of view of the next one registering
	     * a source is easier, see the ZipFileWorker.
	     * @param {Worker} previous the previous worker, sending events to this one
	     * @return {Worker} the current worker for chainability
	     */
	    registerPrevious : function (previous) {
	        if (this.isLocked) {
	            throw new Error("The stream '" + this + "' has already been used.");
	        }

	        // sharing the streamInfo...
	        this.streamInfo = previous.streamInfo;
	        // ... and adding our own bits
	        this.mergeStreamInfo();
	        this.previous =  previous;
	        var self = this;
	        previous.on("data", function (chunk) {
	            self.processChunk(chunk);
	        });
	        previous.on("end", function () {
	            self.end();
	        });
	        previous.on("error", function (e) {
	            self.error(e);
	        });
	        return this;
	    },
	    /**
	     * Pause the stream so it doesn't send events anymore.
	     * @return {Boolean} true if this call paused the worker, false otherwise.
	     */
	    pause : function () {
	        if(this.isPaused || this.isFinished) {
	            return false;
	        }
	        this.isPaused = true;

	        if(this.previous) {
	            this.previous.pause();
	        }
	        return true;
	    },
	    /**
	     * Resume a paused stream.
	     * @return {Boolean} true if this call resumed the worker, false otherwise.
	     */
	    resume : function () {
	        if(!this.isPaused || this.isFinished) {
	            return false;
	        }
	        this.isPaused = false;

	        // if true, the worker tried to resume but failed
	        var withError = false;
	        if(this.generatedError) {
	            this.error(this.generatedError);
	            withError = true;
	        }
	        if(this.previous) {
	            this.previous.resume();
	        }

	        return !withError;
	    },
	    /**
	     * Flush any remaining bytes as the stream is ending.
	     */
	    flush : function () {},
	    /**
	     * Process a chunk. This is usually the method overridden.
	     * @param {Object} chunk the chunk to process.
	     */
	    processChunk : function(chunk) {
	        this.push(chunk);
	    },
	    /**
	     * Add a key/value to be added in the workers chain streamInfo once activated.
	     * @param {String} key the key to use
	     * @param {Object} value the associated value
	     * @return {Worker} the current worker for chainability
	     */
	    withStreamInfo : function (key, value) {
	        this.extraStreamInfo[key] = value;
	        this.mergeStreamInfo();
	        return this;
	    },
	    /**
	     * Merge this worker's streamInfo into the chain's streamInfo.
	     */
	    mergeStreamInfo : function () {
	        for(var key in this.extraStreamInfo) {
	            if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key)) {
	                continue;
	            }
	            this.streamInfo[key] = this.extraStreamInfo[key];
	        }
	    },

	    /**
	     * Lock the stream to prevent further updates on the workers chain.
	     * After calling this method, all calls to pipe will fail.
	     */
	    lock: function () {
	        if (this.isLocked) {
	            throw new Error("The stream '" + this + "' has already been used.");
	        }
	        this.isLocked = true;
	        if (this.previous) {
	            this.previous.lock();
	        }
	    },

	    /**
	     *
	     * Pretty print the workers chain.
	     */
	    toString : function () {
	        var me = "Worker " + this.name;
	        if (this.previous) {
	            return this.previous + " -> " + me;
	        } else {
	            return me;
	        }
	    }
	};

	module.exports = GenericWorker;

	},{}],29:[function(require,module,exports){

	var utils = require("../utils");
	var ConvertWorker = require("./ConvertWorker");
	var GenericWorker = require("./GenericWorker");
	var base64 = require("../base64");
	var support = require("../support");
	var external = require("../external");

	var NodejsStreamOutputAdapter = null;
	if (support.nodestream) {
	    try {
	        NodejsStreamOutputAdapter = require("../nodejs/NodejsStreamOutputAdapter");
	    } catch(e) {
	        // ignore
	    }
	}

	/**
	 * Apply the final transformation of the data. If the user wants a Blob for
	 * example, it's easier to work with an U8intArray and finally do the
	 * ArrayBuffer/Blob conversion.
	 * @param {String} type the name of the final type
	 * @param {String|Uint8Array|Buffer} content the content to transform
	 * @param {String} mimeType the mime type of the content, if applicable.
	 * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
	 */
	function transformZipOutput(type, content, mimeType) {
	    switch(type) {
	    case "blob" :
	        return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
	    case "base64" :
	        return base64.encode(content);
	    default :
	        return utils.transformTo(type, content);
	    }
	}

	/**
	 * Concatenate an array of data of the given type.
	 * @param {String} type the type of the data in the given array.
	 * @param {Array} dataArray the array containing the data chunks to concatenate
	 * @return {String|Uint8Array|Buffer} the concatenated data
	 * @throws Error if the asked type is unsupported
	 */
	function concat (type, dataArray) {
	    var i, index = 0, res = null, totalLength = 0;
	    for(i = 0; i < dataArray.length; i++) {
	        totalLength += dataArray[i].length;
	    }
	    switch(type) {
	    case "string":
	        return dataArray.join("");
	    case "array":
	        return Array.prototype.concat.apply([], dataArray);
	    case "uint8array":
	        res = new Uint8Array(totalLength);
	        for(i = 0; i < dataArray.length; i++) {
	            res.set(dataArray[i], index);
	            index += dataArray[i].length;
	        }
	        return res;
	    case "nodebuffer":
	        return Buffer.concat(dataArray);
	    default:
	        throw new Error("concat : unsupported type '"  + type + "'");
	    }
	}

	/**
	 * Listen a StreamHelper, accumulate its content and concatenate it into a
	 * complete block.
	 * @param {StreamHelper} helper the helper to use.
	 * @param {Function} updateCallback a callback called on each update. Called
	 * with one arg :
	 * - the metadata linked to the update received.
	 * @return Promise the promise for the accumulation.
	 */
	function accumulate(helper, updateCallback) {
	    return new external.Promise(function (resolve, reject){
	        var dataArray = [];
	        var chunkType = helper._internalType,
	            resultType = helper._outputType,
	            mimeType = helper._mimeType;
	        helper
	            .on("data", function (data, meta) {
	                dataArray.push(data);
	                if(updateCallback) {
	                    updateCallback(meta);
	                }
	            })
	            .on("error", function(err) {
	                dataArray = [];
	                reject(err);
	            })
	            .on("end", function (){
	                try {
	                    var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
	                    resolve(result);
	                } catch (e) {
	                    reject(e);
	                }
	                dataArray = [];
	            })
	            .resume();
	    });
	}

	/**
	 * An helper to easily use workers outside of JSZip.
	 * @constructor
	 * @param {Worker} worker the worker to wrap
	 * @param {String} outputType the type of data expected by the use
	 * @param {String} mimeType the mime type of the content, if applicable.
	 */
	function StreamHelper(worker, outputType, mimeType) {
	    var internalType = outputType;
	    switch(outputType) {
	    case "blob":
	    case "arraybuffer":
	        internalType = "uint8array";
	        break;
	    case "base64":
	        internalType = "string";
	        break;
	    }

	    try {
	        // the type used internally
	        this._internalType = internalType;
	        // the type used to output results
	        this._outputType = outputType;
	        // the mime type
	        this._mimeType = mimeType;
	        utils.checkSupport(internalType);
	        this._worker = worker.pipe(new ConvertWorker(internalType));
	        // the last workers can be rewired without issues but we need to
	        // prevent any updates on previous workers.
	        worker.lock();
	    } catch(e) {
	        this._worker = new GenericWorker("error");
	        this._worker.error(e);
	    }
	}

	StreamHelper.prototype = {
	    /**
	     * Listen a StreamHelper, accumulate its content and concatenate it into a
	     * complete block.
	     * @param {Function} updateCb the update callback.
	     * @return Promise the promise for the accumulation.
	     */
	    accumulate : function (updateCb) {
	        return accumulate(this, updateCb);
	    },
	    /**
	     * Add a listener on an event triggered on a stream.
	     * @param {String} evt the name of the event
	     * @param {Function} fn the listener
	     * @return {StreamHelper} the current helper.
	     */
	    on : function (evt, fn) {
	        var self = this;

	        if(evt === "data") {
	            this._worker.on(evt, function (chunk) {
	                fn.call(self, chunk.data, chunk.meta);
	            });
	        } else {
	            this._worker.on(evt, function () {
	                utils.delay(fn, arguments, self);
	            });
	        }
	        return this;
	    },
	    /**
	     * Resume the flow of chunks.
	     * @return {StreamHelper} the current helper.
	     */
	    resume : function () {
	        utils.delay(this._worker.resume, [], this._worker);
	        return this;
	    },
	    /**
	     * Pause the flow of chunks.
	     * @return {StreamHelper} the current helper.
	     */
	    pause : function () {
	        this._worker.pause();
	        return this;
	    },
	    /**
	     * Return a nodejs stream for this helper.
	     * @param {Function} updateCb the update callback.
	     * @return {NodejsStreamOutputAdapter} the nodejs stream.
	     */
	    toNodejsStream : function (updateCb) {
	        utils.checkSupport("nodestream");
	        if (this._outputType !== "nodebuffer") {
	            // an object stream containing blob/arraybuffer/uint8array/string
	            // is strange and I don't know if it would be useful.
	            // I you find this comment and have a good usecase, please open a
	            // bug report !
	            throw new Error(this._outputType + " is not supported by this method");
	        }

	        return new NodejsStreamOutputAdapter(this, {
	            objectMode : this._outputType !== "nodebuffer"
	        }, updateCb);
	    }
	};


	module.exports = StreamHelper;

	},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(require,module,exports){

	exports.base64 = true;
	exports.array = true;
	exports.string = true;
	exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
	exports.nodebuffer = typeof Buffer !== "undefined";
	// contains true if JSZip can read/generate Uint8Array, false otherwise.
	exports.uint8array = typeof Uint8Array !== "undefined";

	if (typeof ArrayBuffer === "undefined") {
	    exports.blob = false;
	}
	else {
	    var buffer = new ArrayBuffer(0);
	    try {
	        exports.blob = new Blob([buffer], {
	            type: "application/zip"
	        }).size === 0;
	    }
	    catch (e) {
	        try {
	            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
	            var builder = new Builder();
	            builder.append(buffer);
	            exports.blob = builder.getBlob("application/zip").size === 0;
	        }
	        catch (e) {
	            exports.blob = false;
	        }
	    }
	}

	try {
	    exports.nodestream = !!require("readable-stream").Readable;
	} catch(e) {
	    exports.nodestream = false;
	}

	},{"readable-stream":16}],31:[function(require,module,exports){

	var utils = require("./utils");
	var support = require("./support");
	var nodejsUtils = require("./nodejsUtils");
	var GenericWorker = require("./stream/GenericWorker");

	/**
	 * The following functions come from pako, from pako/lib/utils/strings
	 * released under the MIT license, see pako https://github.com/nodeca/pako/
	 */

	// Table with utf8 lengths (calculated by first byte of sequence)
	// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
	// because max possible codepoint is 0x10ffff
	var _utf8len = new Array(256);
	for (var i=0; i<256; i++) {
	    _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);
	}
	_utf8len[254]=_utf8len[254]=1; // Invalid sequence start

	// convert string to array (typed, when possible)
	var string2buf = function (str) {
	    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

	    // count binary size
	    for (m_pos = 0; m_pos < str_len; m_pos++) {
	        c = str.charCodeAt(m_pos);
	        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
	            c2 = str.charCodeAt(m_pos+1);
	            if ((c2 & 0xfc00) === 0xdc00) {
	                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	                m_pos++;
	            }
	        }
	        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
	    }

	    // allocate buffer
	    if (support.uint8array) {
	        buf = new Uint8Array(buf_len);
	    } else {
	        buf = new Array(buf_len);
	    }

	    // convert
	    for (i=0, m_pos = 0; i < buf_len; m_pos++) {
	        c = str.charCodeAt(m_pos);
	        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
	            c2 = str.charCodeAt(m_pos+1);
	            if ((c2 & 0xfc00) === 0xdc00) {
	                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	                m_pos++;
	            }
	        }
	        if (c < 0x80) {
	            /* one byte */
	            buf[i++] = c;
	        } else if (c < 0x800) {
	            /* two bytes */
	            buf[i++] = 0xC0 | (c >>> 6);
	            buf[i++] = 0x80 | (c & 0x3f);
	        } else if (c < 0x10000) {
	            /* three bytes */
	            buf[i++] = 0xE0 | (c >>> 12);
	            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	            buf[i++] = 0x80 | (c & 0x3f);
	        } else {
	            /* four bytes */
	            buf[i++] = 0xf0 | (c >>> 18);
	            buf[i++] = 0x80 | (c >>> 12 & 0x3f);
	            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	            buf[i++] = 0x80 | (c & 0x3f);
	        }
	    }

	    return buf;
	};

	// Calculate max possible position in utf8 buffer,
	// that will not break sequence. If that's not possible
	// - (very small limits) return max size as is.
	//
	// buf[] - utf8 bytes array
	// max   - length limit (mandatory);
	var utf8border = function(buf, max) {
	    var pos;

	    max = max || buf.length;
	    if (max > buf.length) { max = buf.length; }

	    // go back from last position, until start of sequence found
	    pos = max-1;
	    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

	    // Fuckup - very small and broken sequence,
	    // return max, because we should return something anyway.
	    if (pos < 0) { return max; }

	    // If we came to start of buffer - that means vuffer is too small,
	    // return max too.
	    if (pos === 0) { return max; }

	    return (pos + _utf8len[buf[pos]] > max) ? pos : max;
	};

	// convert array to string
	var buf2string = function (buf) {
	    var i, out, c, c_len;
	    var len = buf.length;

	    // Reserve max possible length (2 words per char)
	    // NB: by unknown reasons, Array is significantly faster for
	    //     String.fromCharCode.apply than Uint16Array.
	    var utf16buf = new Array(len*2);

	    for (out=0, i=0; i<len;) {
	        c = buf[i++];
	        // quick process ascii
	        if (c < 0x80) { utf16buf[out++] = c; continue; }

	        c_len = _utf8len[c];
	        // skip 5 & 6 byte codes
	        if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len-1; continue; }

	        // apply mask on first byte
	        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
	        // join the rest
	        while (c_len > 1 && i < len) {
	            c = (c << 6) | (buf[i++] & 0x3f);
	            c_len--;
	        }

	        // terminated by end of string?
	        if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

	        if (c < 0x10000) {
	            utf16buf[out++] = c;
	        } else {
	            c -= 0x10000;
	            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
	            utf16buf[out++] = 0xdc00 | (c & 0x3ff);
	        }
	    }

	    // shrinkBuf(utf16buf, out)
	    if (utf16buf.length !== out) {
	        if(utf16buf.subarray) {
	            utf16buf = utf16buf.subarray(0, out);
	        } else {
	            utf16buf.length = out;
	        }
	    }

	    // return String.fromCharCode.apply(null, utf16buf);
	    return utils.applyFromCharCode(utf16buf);
	};


	// That's all for the pako functions.


	/**
	 * Transform a javascript string into an array (typed if possible) of bytes,
	 * UTF-8 encoded.
	 * @param {String} str the string to encode
	 * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
	 */
	exports.utf8encode = function utf8encode(str) {
	    if (support.nodebuffer) {
	        return nodejsUtils.newBufferFrom(str, "utf-8");
	    }

	    return string2buf(str);
	};


	/**
	 * Transform a bytes array (or a representation) representing an UTF-8 encoded
	 * string into a javascript string.
	 * @param {Array|Uint8Array|Buffer} buf the data de decode
	 * @return {String} the decoded string.
	 */
	exports.utf8decode = function utf8decode(buf) {
	    if (support.nodebuffer) {
	        return utils.transformTo("nodebuffer", buf).toString("utf-8");
	    }

	    buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);

	    return buf2string(buf);
	};

	/**
	 * A worker to decode utf8 encoded binary chunks into string chunks.
	 * @constructor
	 */
	function Utf8DecodeWorker() {
	    GenericWorker.call(this, "utf-8 decode");
	    // the last bytes if a chunk didn't end with a complete codepoint.
	    this.leftOver = null;
	}
	utils.inherits(Utf8DecodeWorker, GenericWorker);

	/**
	 * @see GenericWorker.processChunk
	 */
	Utf8DecodeWorker.prototype.processChunk = function (chunk) {

	    var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);

	    // 1st step, re-use what's left of the previous chunk
	    if (this.leftOver && this.leftOver.length) {
	        if(support.uint8array) {
	            var previousData = data;
	            data = new Uint8Array(previousData.length + this.leftOver.length);
	            data.set(this.leftOver, 0);
	            data.set(previousData, this.leftOver.length);
	        } else {
	            data = this.leftOver.concat(data);
	        }
	        this.leftOver = null;
	    }

	    var nextBoundary = utf8border(data);
	    var usableData = data;
	    if (nextBoundary !== data.length) {
	        if (support.uint8array) {
	            usableData = data.subarray(0, nextBoundary);
	            this.leftOver = data.subarray(nextBoundary, data.length);
	        } else {
	            usableData = data.slice(0, nextBoundary);
	            this.leftOver = data.slice(nextBoundary, data.length);
	        }
	    }

	    this.push({
	        data : exports.utf8decode(usableData),
	        meta : chunk.meta
	    });
	};

	/**
	 * @see GenericWorker.flush
	 */
	Utf8DecodeWorker.prototype.flush = function () {
	    if(this.leftOver && this.leftOver.length) {
	        this.push({
	            data : exports.utf8decode(this.leftOver),
	            meta : {}
	        });
	        this.leftOver = null;
	    }
	};
	exports.Utf8DecodeWorker = Utf8DecodeWorker;

	/**
	 * A worker to endcode string chunks into utf8 encoded binary chunks.
	 * @constructor
	 */
	function Utf8EncodeWorker() {
	    GenericWorker.call(this, "utf-8 encode");
	}
	utils.inherits(Utf8EncodeWorker, GenericWorker);

	/**
	 * @see GenericWorker.processChunk
	 */
	Utf8EncodeWorker.prototype.processChunk = function (chunk) {
	    this.push({
	        data : exports.utf8encode(chunk.data),
	        meta : chunk.meta
	    });
	};
	exports.Utf8EncodeWorker = Utf8EncodeWorker;

	},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(require,module,exports){

	var support = require("./support");
	var base64 = require("./base64");
	var nodejsUtils = require("./nodejsUtils");
	var external = require("./external");
	require("setimmediate");


	/**
	 * Convert a string that pass as a "binary string": it should represent a byte
	 * array but may have > 255 char codes. Be sure to take only the first byte
	 * and returns the byte array.
	 * @param {String} str the string to transform.
	 * @return {Array|Uint8Array} the string in a binary format.
	 */
	function string2binary(str) {
	    var result = null;
	    if (support.uint8array) {
	        result = new Uint8Array(str.length);
	    } else {
	        result = new Array(str.length);
	    }
	    return stringToArrayLike(str, result);
	}

	/**
	 * Create a new blob with the given content and the given type.
	 * @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
	 * an Uint8Array because the stock browser of android 4 won't accept it (it
	 * will be silently converted to a string, "[object Uint8Array]").
	 *
	 * Use only ONE part to build the blob to avoid a memory leak in IE11 / Edge:
	 * when a large amount of Array is used to create the Blob, the amount of
	 * memory consumed is nearly 100 times the original data amount.
	 *
	 * @param {String} type the mime type of the blob.
	 * @return {Blob} the created blob.
	 */
	exports.newBlob = function(part, type) {
	    exports.checkSupport("blob");

	    try {
	        // Blob constructor
	        return new Blob([part], {
	            type: type
	        });
	    }
	    catch (e) {

	        try {
	            // deprecated, browser only, old way
	            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
	            var builder = new Builder();
	            builder.append(part);
	            return builder.getBlob(type);
	        }
	        catch (e) {

	            // well, fuck ?!
	            throw new Error("Bug : can't construct the Blob.");
	        }
	    }


	};
	/**
	 * The identity function.
	 * @param {Object} input the input.
	 * @return {Object} the same input.
	 */
	function identity(input) {
	    return input;
	}

	/**
	 * Fill in an array with a string.
	 * @param {String} str the string to use.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
	 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
	 */
	function stringToArrayLike(str, array) {
	    for (var i = 0; i < str.length; ++i) {
	        array[i] = str.charCodeAt(i) & 0xFF;
	    }
	    return array;
	}

	/**
	 * An helper for the function arrayLikeToString.
	 * This contains static information and functions that
	 * can be optimized by the browser JIT compiler.
	 */
	var arrayToStringHelper = {
	    /**
	     * Transform an array of int into a string, chunk by chunk.
	     * See the performances notes on arrayLikeToString.
	     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	     * @param {String} type the type of the array.
	     * @param {Integer} chunk the chunk size.
	     * @return {String} the resulting string.
	     * @throws Error if the chunk is too big for the stack.
	     */
	    stringifyByChunk: function(array, type, chunk) {
	        var result = [], k = 0, len = array.length;
	        // shortcut
	        if (len <= chunk) {
	            return String.fromCharCode.apply(null, array);
	        }
	        while (k < len) {
	            if (type === "array" || type === "nodebuffer") {
	                result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
	            }
	            else {
	                result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
	            }
	            k += chunk;
	        }
	        return result.join("");
	    },
	    /**
	     * Call String.fromCharCode on every item in the array.
	     * This is the naive implementation, which generate A LOT of intermediate string.
	     * This should be used when everything else fail.
	     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	     * @return {String} the result.
	     */
	    stringifyByChar: function(array){
	        var resultStr = "";
	        for(var i = 0; i < array.length; i++) {
	            resultStr += String.fromCharCode(array[i]);
	        }
	        return resultStr;
	    },
	    applyCanBeUsed : {
	        /**
	         * true if the browser accepts to use String.fromCharCode on Uint8Array
	         */
	        uint8array : (function () {
	            try {
	                return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
	            } catch (e) {
	                return false;
	            }
	        })(),
	        /**
	         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
	         */
	        nodebuffer : (function () {
	            try {
	                return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
	            } catch (e) {
	                return false;
	            }
	        })()
	    }
	};

	/**
	 * Transform an array-like object to a string.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	 * @return {String} the result.
	 */
	function arrayLikeToString(array) {
	    // Performances notes :
	    // --------------------
	    // String.fromCharCode.apply(null, array) is the fastest, see
	    // see http://jsperf.com/converting-a-uint8array-to-a-string/2
	    // but the stack is limited (and we can get huge arrays !).
	    //
	    // result += String.fromCharCode(array[i]); generate too many strings !
	    //
	    // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
	    // TODO : we now have workers that split the work. Do we still need that ?
	    var chunk = 65536,
	        type = exports.getTypeOf(array),
	        canUseApply = true;
	    if (type === "uint8array") {
	        canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
	    } else if (type === "nodebuffer") {
	        canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
	    }

	    if (canUseApply) {
	        while (chunk > 1) {
	            try {
	                return arrayToStringHelper.stringifyByChunk(array, type, chunk);
	            } catch (e) {
	                chunk = Math.floor(chunk / 2);
	            }
	        }
	    }

	    // no apply or chunk error : slow and painful algorithm
	    // default browser on android 4.*
	    return arrayToStringHelper.stringifyByChar(array);
	}

	exports.applyFromCharCode = arrayLikeToString;


	/**
	 * Copy the data from an array-like to an other array-like.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
	 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
	 */
	function arrayLikeToArrayLike(arrayFrom, arrayTo) {
	    for (var i = 0; i < arrayFrom.length; i++) {
	        arrayTo[i] = arrayFrom[i];
	    }
	    return arrayTo;
	}

	// a matrix containing functions to transform everything into everything.
	var transform = {};

	// string to ?
	transform["string"] = {
	    "string": identity,
	    "array": function(input) {
	        return stringToArrayLike(input, new Array(input.length));
	    },
	    "arraybuffer": function(input) {
	        return transform["string"]["uint8array"](input).buffer;
	    },
	    "uint8array": function(input) {
	        return stringToArrayLike(input, new Uint8Array(input.length));
	    },
	    "nodebuffer": function(input) {
	        return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
	    }
	};

	// array to ?
	transform["array"] = {
	    "string": arrayLikeToString,
	    "array": identity,
	    "arraybuffer": function(input) {
	        return (new Uint8Array(input)).buffer;
	    },
	    "uint8array": function(input) {
	        return new Uint8Array(input);
	    },
	    "nodebuffer": function(input) {
	        return nodejsUtils.newBufferFrom(input);
	    }
	};

	// arraybuffer to ?
	transform["arraybuffer"] = {
	    "string": function(input) {
	        return arrayLikeToString(new Uint8Array(input));
	    },
	    "array": function(input) {
	        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
	    },
	    "arraybuffer": identity,
	    "uint8array": function(input) {
	        return new Uint8Array(input);
	    },
	    "nodebuffer": function(input) {
	        return nodejsUtils.newBufferFrom(new Uint8Array(input));
	    }
	};

	// uint8array to ?
	transform["uint8array"] = {
	    "string": arrayLikeToString,
	    "array": function(input) {
	        return arrayLikeToArrayLike(input, new Array(input.length));
	    },
	    "arraybuffer": function(input) {
	        return input.buffer;
	    },
	    "uint8array": identity,
	    "nodebuffer": function(input) {
	        return nodejsUtils.newBufferFrom(input);
	    }
	};

	// nodebuffer to ?
	transform["nodebuffer"] = {
	    "string": arrayLikeToString,
	    "array": function(input) {
	        return arrayLikeToArrayLike(input, new Array(input.length));
	    },
	    "arraybuffer": function(input) {
	        return transform["nodebuffer"]["uint8array"](input).buffer;
	    },
	    "uint8array": function(input) {
	        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
	    },
	    "nodebuffer": identity
	};

	/**
	 * Transform an input into any type.
	 * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
	 * If no output type is specified, the unmodified input will be returned.
	 * @param {String} outputType the output type.
	 * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
	 * @throws {Error} an Error if the browser doesn't support the requested output type.
	 */
	exports.transformTo = function(outputType, input) {
	    if (!input) {
	        // undefined, null, etc
	        // an empty string won't harm.
	        input = "";
	    }
	    if (!outputType) {
	        return input;
	    }
	    exports.checkSupport(outputType);
	    var inputType = exports.getTypeOf(input);
	    var result = transform[inputType][outputType](input);
	    return result;
	};

	/**
	 * Resolve all relative path components, "." and "..", in a path. If these relative components
	 * traverse above the root then the resulting path will only contain the final path component.
	 *
	 * All empty components, e.g. "//", are removed.
	 * @param {string} path A path with / or \ separators
	 * @returns {string} The path with all relative path components resolved.
	 */
	exports.resolve = function(path) {
	    var parts = path.split("/");
	    var result = [];
	    for (var index = 0; index < parts.length; index++) {
	        var part = parts[index];
	        // Allow the first and last component to be empty for trailing slashes.
	        if (part === "." || (part === "" && index !== 0 && index !== parts.length - 1)) {
	            continue;
	        } else if (part === "..") {
	            result.pop();
	        } else {
	            result.push(part);
	        }
	    }
	    return result.join("/");
	};

	/**
	 * Return the type of the input.
	 * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
	 * @param {Object} input the input to identify.
	 * @return {String} the (lowercase) type of the input.
	 */
	exports.getTypeOf = function(input) {
	    if (typeof input === "string") {
	        return "string";
	    }
	    if (Object.prototype.toString.call(input) === "[object Array]") {
	        return "array";
	    }
	    if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
	        return "nodebuffer";
	    }
	    if (support.uint8array && input instanceof Uint8Array) {
	        return "uint8array";
	    }
	    if (support.arraybuffer && input instanceof ArrayBuffer) {
	        return "arraybuffer";
	    }
	};

	/**
	 * Throw an exception if the type is not supported.
	 * @param {String} type the type to check.
	 * @throws {Error} an Error if the browser doesn't support the requested type.
	 */
	exports.checkSupport = function(type) {
	    var supported = support[type.toLowerCase()];
	    if (!supported) {
	        throw new Error(type + " is not supported by this platform");
	    }
	};

	exports.MAX_VALUE_16BITS = 65535;
	exports.MAX_VALUE_32BITS = -1; // well, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF" is parsed as -1

	/**
	 * Prettify a string read as binary.
	 * @param {string} str the string to prettify.
	 * @return {string} a pretty string.
	 */
	exports.pretty = function(str) {
	    var res = "",
	        code, i;
	    for (i = 0; i < (str || "").length; i++) {
	        code = str.charCodeAt(i);
	        res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
	    }
	    return res;
	};

	/**
	 * Defer the call of a function.
	 * @param {Function} callback the function to call asynchronously.
	 * @param {Array} args the arguments to give to the callback.
	 */
	exports.delay = function(callback, args, self) {
	    setImmediate(function () {
	        callback.apply(self || null, args || []);
	    });
	};

	/**
	 * Extends a prototype with an other, without calling a constructor with
	 * side effects. Inspired by nodejs' `utils.inherits`
	 * @param {Function} ctor the constructor to augment
	 * @param {Function} superCtor the parent constructor to use
	 */
	exports.inherits = function (ctor, superCtor) {
	    var Obj = function() {};
	    Obj.prototype = superCtor.prototype;
	    ctor.prototype = new Obj();
	};

	/**
	 * Merge the objects passed as parameters into a new one.
	 * @private
	 * @param {...Object} var_args All objects to merge.
	 * @return {Object} a new object with the data of the others.
	 */
	exports.extend = function() {
	    var result = {}, i, attr;
	    for (i = 0; i < arguments.length; i++) { // arguments is not enumerable in some browsers
	        for (attr in arguments[i]) {
	            if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") {
	                result[attr] = arguments[i][attr];
	            }
	        }
	    }
	    return result;
	};

	/**
	 * Transform arbitrary content into a Promise.
	 * @param {String} name a name for the content being processed.
	 * @param {Object} inputData the content to process.
	 * @param {Boolean} isBinary true if the content is not an unicode string
	 * @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
	 * @param {Boolean} isBase64 true if the string content is encoded with base64.
	 * @return {Promise} a promise in a format usable by JSZip.
	 */
	exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {

	    // if inputData is already a promise, this flatten it.
	    var promise = external.Promise.resolve(inputData).then(function(data) {


	        var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);

	        if (isBlob && typeof FileReader !== "undefined") {
	            return new external.Promise(function (resolve, reject) {
	                var reader = new FileReader();

	                reader.onload = function(e) {
	                    resolve(e.target.result);
	                };
	                reader.onerror = function(e) {
	                    reject(e.target.error);
	                };
	                reader.readAsArrayBuffer(data);
	            });
	        } else {
	            return data;
	        }
	    });

	    return promise.then(function(data) {
	        var dataType = exports.getTypeOf(data);

	        if (!dataType) {
	            return external.Promise.reject(
	                new Error("Can't read the data of '" + name + "'. Is it " +
	                          "in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
	            );
	        }
	        // special case : it's way easier to work with Uint8Array than with ArrayBuffer
	        if (dataType === "arraybuffer") {
	            data = exports.transformTo("uint8array", data);
	        } else if (dataType === "string") {
	            if (isBase64) {
	                data = base64.decode(data);
	            }
	            else if (isBinary) {
	                // optimizedBinaryString === true means that the file has already been filtered with a 0xFF mask
	                if (isOptimizedBinaryString !== true) {
	                    // this is a string, not in a base64 format.
	                    // Be sure that this is a correct "binary string"
	                    data = string2binary(data);
	                }
	            }
	        }
	        return data;
	    });
	};

	},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"setimmediate":54}],33:[function(require,module,exports){
	var readerFor = require("./reader/readerFor");
	var utils = require("./utils");
	var sig = require("./signature");
	var ZipEntry = require("./zipEntry");
	var support = require("./support");
	//  class ZipEntries {{{
	/**
	 * All the entries in the zip file.
	 * @constructor
	 * @param {Object} loadOptions Options for loading the stream.
	 */
	function ZipEntries(loadOptions) {
	    this.files = [];
	    this.loadOptions = loadOptions;
	}
	ZipEntries.prototype = {
	    /**
	     * Check that the reader is on the specified signature.
	     * @param {string} expectedSignature the expected signature.
	     * @throws {Error} if it is an other signature.
	     */
	    checkSignature: function(expectedSignature) {
	        if (!this.reader.readAndCheckSignature(expectedSignature)) {
	            this.reader.index -= 4;
	            var signature = this.reader.readString(4);
	            throw new Error("Corrupted zip or bug: unexpected signature " + "(" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
	        }
	    },
	    /**
	     * Check if the given signature is at the given index.
	     * @param {number} askedIndex the index to check.
	     * @param {string} expectedSignature the signature to expect.
	     * @return {boolean} true if the signature is here, false otherwise.
	     */
	    isSignature: function(askedIndex, expectedSignature) {
	        var currentIndex = this.reader.index;
	        this.reader.setIndex(askedIndex);
	        var signature = this.reader.readString(4);
	        var result = signature === expectedSignature;
	        this.reader.setIndex(currentIndex);
	        return result;
	    },
	    /**
	     * Read the end of the central directory.
	     */
	    readBlockEndOfCentral: function() {
	        this.diskNumber = this.reader.readInt(2);
	        this.diskWithCentralDirStart = this.reader.readInt(2);
	        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
	        this.centralDirRecords = this.reader.readInt(2);
	        this.centralDirSize = this.reader.readInt(4);
	        this.centralDirOffset = this.reader.readInt(4);

	        this.zipCommentLength = this.reader.readInt(2);
	        // warning : the encoding depends of the system locale
	        // On a linux machine with LANG=en_US.utf8, this field is utf8 encoded.
	        // On a windows machine, this field is encoded with the localized windows code page.
	        var zipComment = this.reader.readData(this.zipCommentLength);
	        var decodeParamType = support.uint8array ? "uint8array" : "array";
	        // To get consistent behavior with the generation part, we will assume that
	        // this is utf8 encoded unless specified otherwise.
	        var decodeContent = utils.transformTo(decodeParamType, zipComment);
	        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
	    },
	    /**
	     * Read the end of the Zip 64 central directory.
	     * Not merged with the method readEndOfCentral :
	     * The end of central can coexist with its Zip64 brother,
	     * I don't want to read the wrong number of bytes !
	     */
	    readBlockZip64EndOfCentral: function() {
	        this.zip64EndOfCentralSize = this.reader.readInt(8);
	        this.reader.skip(4);
	        // this.versionMadeBy = this.reader.readString(2);
	        // this.versionNeeded = this.reader.readInt(2);
	        this.diskNumber = this.reader.readInt(4);
	        this.diskWithCentralDirStart = this.reader.readInt(4);
	        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
	        this.centralDirRecords = this.reader.readInt(8);
	        this.centralDirSize = this.reader.readInt(8);
	        this.centralDirOffset = this.reader.readInt(8);

	        this.zip64ExtensibleData = {};
	        var extraDataSize = this.zip64EndOfCentralSize - 44,
	            index = 0,
	            extraFieldId,
	            extraFieldLength,
	            extraFieldValue;
	        while (index < extraDataSize) {
	            extraFieldId = this.reader.readInt(2);
	            extraFieldLength = this.reader.readInt(4);
	            extraFieldValue = this.reader.readData(extraFieldLength);
	            this.zip64ExtensibleData[extraFieldId] = {
	                id: extraFieldId,
	                length: extraFieldLength,
	                value: extraFieldValue
	            };
	        }
	    },
	    /**
	     * Read the end of the Zip 64 central directory locator.
	     */
	    readBlockZip64EndOfCentralLocator: function() {
	        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
	        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
	        this.disksCount = this.reader.readInt(4);
	        if (this.disksCount > 1) {
	            throw new Error("Multi-volumes zip are not supported");
	        }
	    },
	    /**
	     * Read the local files, based on the offset read in the central part.
	     */
	    readLocalFiles: function() {
	        var i, file;
	        for (i = 0; i < this.files.length; i++) {
	            file = this.files[i];
	            this.reader.setIndex(file.localHeaderOffset);
	            this.checkSignature(sig.LOCAL_FILE_HEADER);
	            file.readLocalPart(this.reader);
	            file.handleUTF8();
	            file.processAttributes();
	        }
	    },
	    /**
	     * Read the central directory.
	     */
	    readCentralDir: function() {
	        var file;

	        this.reader.setIndex(this.centralDirOffset);
	        while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
	            file = new ZipEntry({
	                zip64: this.zip64
	            }, this.loadOptions);
	            file.readCentralPart(this.reader);
	            this.files.push(file);
	        }

	        if (this.centralDirRecords !== this.files.length) {
	            if (this.centralDirRecords !== 0 && this.files.length === 0) {
	                // We expected some records but couldn't find ANY.
	                // This is really suspicious, as if something went wrong.
	                throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
	            }
	        }
	    },
	    /**
	     * Read the end of central directory.
	     */
	    readEndOfCentral: function() {
	        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
	        if (offset < 0) {
	            // Check if the content is a truncated zip or complete garbage.
	            // A "LOCAL_FILE_HEADER" is not required at the beginning (auto
	            // extractible zip for example) but it can give a good hint.
	            // If an ajax request was used without responseType, we will also
	            // get unreadable data.
	            var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);

	            if (isGarbage) {
	                throw new Error("Can't find end of central directory : is this a zip file ? " +
	                                "If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
	            } else {
	                throw new Error("Corrupted zip: can't find end of central directory");
	            }

	        }
	        this.reader.setIndex(offset);
	        var endOfCentralDirOffset = offset;
	        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
	        this.readBlockEndOfCentral();


	        /* extract from the zip spec :
	            4)  If one of the fields in the end of central directory
	                record is too small to hold required data, the field
	                should be set to -1 (0xFFFF or 0xFFFFFFFF) and the
	                ZIP64 format record should be created.
	            5)  The end of central directory record and the
	                Zip64 end of central directory locator record must
	                reside on the same disk when splitting or spanning
	                an archive.
	         */
	        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
	            this.zip64 = true;

	            /*
	            Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from
	            the zip file can fit into a 32bits integer. This cannot be solved : JavaScript represents
	            all numbers as 64-bit double precision IEEE 754 floating point numbers.
	            So, we have 53bits for integers and bitwise operations treat everything as 32bits.
	            see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators
	            and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5
	            */

	            // should look for a zip64 EOCD locator
	            offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
	            if (offset < 0) {
	                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
	            }
	            this.reader.setIndex(offset);
	            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
	            this.readBlockZip64EndOfCentralLocator();

	            // now the zip64 EOCD record
	            if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
	                // console.warn("ZIP64 end of central directory not where expected.");
	                this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
	                if (this.relativeOffsetEndOfZip64CentralDir < 0) {
	                    throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
	                }
	            }
	            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
	            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
	            this.readBlockZip64EndOfCentral();
	        }

	        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
	        if (this.zip64) {
	            expectedEndOfCentralDirOffset += 20; // end of central dir 64 locator
	            expectedEndOfCentralDirOffset += 12 /* should not include the leading 12 bytes */ + this.zip64EndOfCentralSize;
	        }

	        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;

	        if (extraBytes > 0) {
	            // console.warn(extraBytes, "extra bytes at beginning or within zipfile");
	            if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) ; else {
	                // the offset is wrong, update the "zero" of the reader
	                // this happens if data has been prepended (crx files for example)
	                this.reader.zero = extraBytes;
	            }
	        } else if (extraBytes < 0) {
	            throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
	        }
	    },
	    prepareReader: function(data) {
	        this.reader = readerFor(data);
	    },
	    /**
	     * Read a zip file and create ZipEntries.
	     * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
	     */
	    load: function(data) {
	        this.prepareReader(data);
	        this.readEndOfCentral();
	        this.readCentralDir();
	        this.readLocalFiles();
	    }
	};
	// }}} end of ZipEntries
	module.exports = ZipEntries;

	},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(require,module,exports){
	var readerFor = require("./reader/readerFor");
	var utils = require("./utils");
	var CompressedObject = require("./compressedObject");
	var crc32fn = require("./crc32");
	var utf8 = require("./utf8");
	var compressions = require("./compressions");
	var support = require("./support");

	var MADE_BY_DOS = 0x00;
	var MADE_BY_UNIX = 0x03;

	/**
	 * Find a compression registered in JSZip.
	 * @param {string} compressionMethod the method magic to find.
	 * @return {Object|null} the JSZip compression object, null if none found.
	 */
	var findCompression = function(compressionMethod) {
	    for (var method in compressions) {
	        if (!Object.prototype.hasOwnProperty.call(compressions, method)) {
	            continue;
	        }
	        if (compressions[method].magic === compressionMethod) {
	            return compressions[method];
	        }
	    }
	    return null;
	};

	// class ZipEntry {{{
	/**
	 * An entry in the zip file.
	 * @constructor
	 * @param {Object} options Options of the current file.
	 * @param {Object} loadOptions Options for loading the stream.
	 */
	function ZipEntry(options, loadOptions) {
	    this.options = options;
	    this.loadOptions = loadOptions;
	}
	ZipEntry.prototype = {
	    /**
	     * say if the file is encrypted.
	     * @return {boolean} true if the file is encrypted, false otherwise.
	     */
	    isEncrypted: function() {
	        // bit 1 is set
	        return (this.bitFlag & 0x0001) === 0x0001;
	    },
	    /**
	     * say if the file has utf-8 filename/comment.
	     * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
	     */
	    useUTF8: function() {
	        // bit 11 is set
	        return (this.bitFlag & 0x0800) === 0x0800;
	    },
	    /**
	     * Read the local part of a zip file and add the info in this object.
	     * @param {DataReader} reader the reader to use.
	     */
	    readLocalPart: function(reader) {
	        var compression, localExtraFieldsLength;

	        // we already know everything from the central dir !
	        // If the central dir data are false, we are doomed.
	        // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.
	        // The less data we get here, the more reliable this should be.
	        // Let's skip the whole header and dash to the data !
	        reader.skip(22);
	        // in some zip created on windows, the filename stored in the central dir contains \ instead of /.
	        // Strangely, the filename here is OK.
	        // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes
	        // or APPNOTE#4.4.17.1, "All slashes MUST be forward slashes '/'") but there are a lot of bad zip generators...
	        // Search "unzip mismatching "local" filename continuing with "central" filename version" on
	        // the internet.
	        //
	        // I think I see the logic here : the central directory is used to display
	        // content and the local directory is used to extract the files. Mixing / and \
	        // may be used to display \ to windows users and use / when extracting the files.
	        // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394
	        this.fileNameLength = reader.readInt(2);
	        localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir
	        // the fileName is stored as binary data, the handleUTF8 method will take care of the encoding.
	        this.fileName = reader.readData(this.fileNameLength);
	        reader.skip(localExtraFieldsLength);

	        if (this.compressedSize === -1 || this.uncompressedSize === -1) {
	            throw new Error("Bug or corrupted zip : didn't get enough information from the central directory " + "(compressedSize === -1 || uncompressedSize === -1)");
	        }

	        compression = findCompression(this.compressionMethod);
	        if (compression === null) { // no compression found
	            throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
	        }
	        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
	    },

	    /**
	     * Read the central part of a zip file and add the info in this object.
	     * @param {DataReader} reader the reader to use.
	     */
	    readCentralPart: function(reader) {
	        this.versionMadeBy = reader.readInt(2);
	        reader.skip(2);
	        // this.versionNeeded = reader.readInt(2);
	        this.bitFlag = reader.readInt(2);
	        this.compressionMethod = reader.readString(2);
	        this.date = reader.readDate();
	        this.crc32 = reader.readInt(4);
	        this.compressedSize = reader.readInt(4);
	        this.uncompressedSize = reader.readInt(4);
	        var fileNameLength = reader.readInt(2);
	        this.extraFieldsLength = reader.readInt(2);
	        this.fileCommentLength = reader.readInt(2);
	        this.diskNumberStart = reader.readInt(2);
	        this.internalFileAttributes = reader.readInt(2);
	        this.externalFileAttributes = reader.readInt(4);
	        this.localHeaderOffset = reader.readInt(4);

	        if (this.isEncrypted()) {
	            throw new Error("Encrypted zip are not supported");
	        }

	        // will be read in the local part, see the comments there
	        reader.skip(fileNameLength);
	        this.readExtraFields(reader);
	        this.parseZIP64ExtraField(reader);
	        this.fileComment = reader.readData(this.fileCommentLength);
	    },

	    /**
	     * Parse the external file attributes and get the unix/dos permissions.
	     */
	    processAttributes: function () {
	        this.unixPermissions = null;
	        this.dosPermissions = null;
	        var madeBy = this.versionMadeBy >> 8;

	        // Check if we have the DOS directory flag set.
	        // We look for it in the DOS and UNIX permissions
	        // but some unknown platform could set it as a compatibility flag.
	        this.dir = this.externalFileAttributes & 0x0010 ? true : false;

	        if(madeBy === MADE_BY_DOS) {
	            // first 6 bits (0 to 5)
	            this.dosPermissions = this.externalFileAttributes & 0x3F;
	        }

	        if(madeBy === MADE_BY_UNIX) {
	            this.unixPermissions = (this.externalFileAttributes >> 16) & 0xFFFF;
	            // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);
	        }

	        // fail safe : if the name ends with a / it probably means a folder
	        if (!this.dir && this.fileNameStr.slice(-1) === "/") {
	            this.dir = true;
	        }
	    },

	    /**
	     * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
	     * @param {DataReader} reader the reader to use.
	     */
	    parseZIP64ExtraField: function() {
	        if (!this.extraFields[0x0001]) {
	            return;
	        }

	        // should be something, preparing the extra reader
	        var extraReader = readerFor(this.extraFields[0x0001].value);

	        // I really hope that these 64bits integer can fit in 32 bits integer, because js
	        // won't let us have more.
	        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
	            this.uncompressedSize = extraReader.readInt(8);
	        }
	        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
	            this.compressedSize = extraReader.readInt(8);
	        }
	        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
	            this.localHeaderOffset = extraReader.readInt(8);
	        }
	        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
	            this.diskNumberStart = extraReader.readInt(4);
	        }
	    },
	    /**
	     * Read the central part of a zip file and add the info in this object.
	     * @param {DataReader} reader the reader to use.
	     */
	    readExtraFields: function(reader) {
	        var end = reader.index + this.extraFieldsLength,
	            extraFieldId,
	            extraFieldLength,
	            extraFieldValue;

	        if (!this.extraFields) {
	            this.extraFields = {};
	        }

	        while (reader.index + 4 < end) {
	            extraFieldId = reader.readInt(2);
	            extraFieldLength = reader.readInt(2);
	            extraFieldValue = reader.readData(extraFieldLength);

	            this.extraFields[extraFieldId] = {
	                id: extraFieldId,
	                length: extraFieldLength,
	                value: extraFieldValue
	            };
	        }

	        reader.setIndex(end);
	    },
	    /**
	     * Apply an UTF8 transformation if needed.
	     */
	    handleUTF8: function() {
	        var decodeParamType = support.uint8array ? "uint8array" : "array";
	        if (this.useUTF8()) {
	            this.fileNameStr = utf8.utf8decode(this.fileName);
	            this.fileCommentStr = utf8.utf8decode(this.fileComment);
	        } else {
	            var upath = this.findExtraFieldUnicodePath();
	            if (upath !== null) {
	                this.fileNameStr = upath;
	            } else {
	                // ASCII text or unsupported code page
	                var fileNameByteArray =  utils.transformTo(decodeParamType, this.fileName);
	                this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
	            }

	            var ucomment = this.findExtraFieldUnicodeComment();
	            if (ucomment !== null) {
	                this.fileCommentStr = ucomment;
	            } else {
	                // ASCII text or unsupported code page
	                var commentByteArray =  utils.transformTo(decodeParamType, this.fileComment);
	                this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
	            }
	        }
	    },

	    /**
	     * Find the unicode path declared in the extra field, if any.
	     * @return {String} the unicode path, null otherwise.
	     */
	    findExtraFieldUnicodePath: function() {
	        var upathField = this.extraFields[0x7075];
	        if (upathField) {
	            var extraReader = readerFor(upathField.value);

	            // wrong version
	            if (extraReader.readInt(1) !== 1) {
	                return null;
	            }

	            // the crc of the filename changed, this field is out of date.
	            if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
	                return null;
	            }

	            return utf8.utf8decode(extraReader.readData(upathField.length - 5));
	        }
	        return null;
	    },

	    /**
	     * Find the unicode comment declared in the extra field, if any.
	     * @return {String} the unicode comment, null otherwise.
	     */
	    findExtraFieldUnicodeComment: function() {
	        var ucommentField = this.extraFields[0x6375];
	        if (ucommentField) {
	            var extraReader = readerFor(ucommentField.value);

	            // wrong version
	            if (extraReader.readInt(1) !== 1) {
	                return null;
	            }

	            // the crc of the comment changed, this field is out of date.
	            if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
	                return null;
	            }

	            return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
	        }
	        return null;
	    }
	};
	module.exports = ZipEntry;

	},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(require,module,exports){

	var StreamHelper = require("./stream/StreamHelper");
	var DataWorker = require("./stream/DataWorker");
	var utf8 = require("./utf8");
	var CompressedObject = require("./compressedObject");
	var GenericWorker = require("./stream/GenericWorker");

	/**
	 * A simple object representing a file in the zip file.
	 * @constructor
	 * @param {string} name the name of the file
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
	 * @param {Object} options the options of the file
	 */
	var ZipObject = function(name, data, options) {
	    this.name = name;
	    this.dir = options.dir;
	    this.date = options.date;
	    this.comment = options.comment;
	    this.unixPermissions = options.unixPermissions;
	    this.dosPermissions = options.dosPermissions;

	    this._data = data;
	    this._dataBinary = options.binary;
	    // keep only the compression
	    this.options = {
	        compression : options.compression,
	        compressionOptions : options.compressionOptions
	    };
	};

	ZipObject.prototype = {
	    /**
	     * Create an internal stream for the content of this object.
	     * @param {String} type the type of each chunk.
	     * @return StreamHelper the stream.
	     */
	    internalStream: function (type) {
	        var result = null, outputType = "string";
	        try {
	            if (!type) {
	                throw new Error("No output type specified.");
	            }
	            outputType = type.toLowerCase();
	            var askUnicodeString = outputType === "string" || outputType === "text";
	            if (outputType === "binarystring" || outputType === "text") {
	                outputType = "string";
	            }
	            result = this._decompressWorker();

	            var isUnicodeString = !this._dataBinary;

	            if (isUnicodeString && !askUnicodeString) {
	                result = result.pipe(new utf8.Utf8EncodeWorker());
	            }
	            if (!isUnicodeString && askUnicodeString) {
	                result = result.pipe(new utf8.Utf8DecodeWorker());
	            }
	        } catch (e) {
	            result = new GenericWorker("error");
	            result.error(e);
	        }

	        return new StreamHelper(result, outputType, "");
	    },

	    /**
	     * Prepare the content in the asked type.
	     * @param {String} type the type of the result.
	     * @param {Function} onUpdate a function to call on each internal update.
	     * @return Promise the promise of the result.
	     */
	    async: function (type, onUpdate) {
	        return this.internalStream(type).accumulate(onUpdate);
	    },

	    /**
	     * Prepare the content as a nodejs stream.
	     * @param {String} type the type of each chunk.
	     * @param {Function} onUpdate a function to call on each internal update.
	     * @return Stream the stream.
	     */
	    nodeStream: function (type, onUpdate) {
	        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
	    },

	    /**
	     * Return a worker for the compressed content.
	     * @private
	     * @param {Object} compression the compression object to use.
	     * @param {Object} compressionOptions the options to use when compressing.
	     * @return Worker the worker.
	     */
	    _compressWorker: function (compression, compressionOptions) {
	        if (
	            this._data instanceof CompressedObject &&
	            this._data.compression.magic === compression.magic
	        ) {
	            return this._data.getCompressedWorker();
	        } else {
	            var result = this._decompressWorker();
	            if(!this._dataBinary) {
	                result = result.pipe(new utf8.Utf8EncodeWorker());
	            }
	            return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
	        }
	    },
	    /**
	     * Return a worker for the decompressed content.
	     * @private
	     * @return Worker the worker.
	     */
	    _decompressWorker : function () {
	        if (this._data instanceof CompressedObject) {
	            return this._data.getContentWorker();
	        } else if (this._data instanceof GenericWorker) {
	            return this._data;
	        } else {
	            return new DataWorker(this._data);
	        }
	    }
	};

	var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
	var removedFn = function () {
	    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	};

	for(var i = 0; i < removedMethods.length; i++) {
	    ZipObject.prototype[removedMethods[i]] = removedFn;
	}
	module.exports = ZipObject;

	},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(require,module,exports){
	(function (global){
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	var scheduleDrain;

	{
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}

	}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	},{}],37:[function(require,module,exports){
	var immediate = require('immediate');

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];

	module.exports = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype["finally"] = function (callback) {
	  if (typeof callback !== 'function') {
	    return this;
	  }
	  var p = this.constructor;
	  return this.then(resolve, reject);

	  function resolve(value) {
	    function yes () {
	      return value;
	    }
	    return p.resolve(callback()).then(yes);
	  }
	  function reject(reason) {
	    function no () {
	      throw reason;
	    }
	    return p.resolve(callback()).then(no);
	  }
	};
	Promise.prototype["catch"] = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	Promise.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	Promise.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	Promise.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	Promise.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}

	},{"immediate":36}],38:[function(require,module,exports){

	var assign    = require('./lib/utils/common').assign;

	var deflate   = require('./lib/deflate');
	var inflate   = require('./lib/inflate');
	var constants = require('./lib/zlib/constants');

	var pako = {};

	assign(pako, deflate, inflate, constants);

	module.exports = pako;

	},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(require,module,exports){


	var zlib_deflate = require('./zlib/deflate');
	var utils        = require('./utils/common');
	var strings      = require('./utils/strings');
	var msg          = require('./zlib/messages');
	var ZStream      = require('./zlib/zstream');

	var toString = Object.prototype.toString;

	/* Public constants ==========================================================*/
	/* ===========================================================================*/

	var Z_NO_FLUSH      = 0;
	var Z_FINISH        = 4;

	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	var Z_SYNC_FLUSH    = 2;

	var Z_DEFAULT_COMPRESSION = -1;

	var Z_DEFAULT_STRATEGY    = 0;

	var Z_DEFLATED  = 8;

	/* ===========================================================================*/


	/**
	 * class Deflate
	 *
	 * Generic JS-style wrapper for zlib calls. If you don't need
	 * streaming behaviour - use more simple functions: [[deflate]],
	 * [[deflateRaw]] and [[gzip]].
	 **/

	/* internal
	 * Deflate.chunks -> Array
	 *
	 * Chunks of output data, if [[Deflate#onData]] not overriden.
	 **/

	/**
	 * Deflate.result -> Uint8Array|Array
	 *
	 * Compressed result, generated by default [[Deflate#onData]]
	 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
	 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
	 * push a chunk with explicit flush (call [[Deflate#push]] with
	 * `Z_SYNC_FLUSH` param).
	 **/

	/**
	 * Deflate.err -> Number
	 *
	 * Error code after deflate finished. 0 (Z_OK) on success.
	 * You will not need it in real life, because deflate errors
	 * are possible only on wrong options or bad `onData` / `onEnd`
	 * custom handlers.
	 **/

	/**
	 * Deflate.msg -> String
	 *
	 * Error message, if [[Deflate.err]] != 0
	 **/


	/**
	 * new Deflate(options)
	 * - options (Object): zlib deflate options.
	 *
	 * Creates new deflator instance with specified params. Throws exception
	 * on bad params. Supported options:
	 *
	 * - `level`
	 * - `windowBits`
	 * - `memLevel`
	 * - `strategy`
	 * - `dictionary`
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Additional options, for internal needs:
	 *
	 * - `chunkSize` - size of generated data chunks (16K by default)
	 * - `raw` (Boolean) - do raw deflate
	 * - `gzip` (Boolean) - create gzip wrapper
	 * - `to` (String) - if equal to 'string', then result will be "binary string"
	 *    (each char code [0..255])
	 * - `header` (Object) - custom header for gzip
	 *   - `text` (Boolean) - true if compressed data believed to be text
	 *   - `time` (Number) - modification time, unix timestamp
	 *   - `os` (Number) - operation system code
	 *   - `extra` (Array) - array of bytes with extra data (max 65536)
	 *   - `name` (String) - file name (binary string)
	 *   - `comment` (String) - comment (binary string)
	 *   - `hcrc` (Boolean) - true if header crc should be added
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	 *
	 * var deflate = new pako.Deflate({ level: 3});
	 *
	 * deflate.push(chunk1, false);
	 * deflate.push(chunk2, true);  // true -> last chunk
	 *
	 * if (deflate.err) { throw new Error(deflate.err); }
	 *
	 * console.log(deflate.result);
	 * ```
	 **/
	function Deflate(options) {
	  if (!(this instanceof Deflate)) return new Deflate(options);

	  this.options = utils.assign({
	    level: Z_DEFAULT_COMPRESSION,
	    method: Z_DEFLATED,
	    chunkSize: 16384,
	    windowBits: 15,
	    memLevel: 8,
	    strategy: Z_DEFAULT_STRATEGY,
	    to: ''
	  }, options || {});

	  var opt = this.options;

	  if (opt.raw && (opt.windowBits > 0)) {
	    opt.windowBits = -opt.windowBits;
	  }

	  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
	    opt.windowBits += 16;
	  }

	  this.err    = 0;      // error code, if happens (0 = Z_OK)
	  this.msg    = '';     // error message
	  this.ended  = false;  // used to avoid multiple onEnd() calls
	  this.chunks = [];     // chunks of compressed data

	  this.strm = new ZStream();
	  this.strm.avail_out = 0;

	  var status = zlib_deflate.deflateInit2(
	    this.strm,
	    opt.level,
	    opt.method,
	    opt.windowBits,
	    opt.memLevel,
	    opt.strategy
	  );

	  if (status !== Z_OK) {
	    throw new Error(msg[status]);
	  }

	  if (opt.header) {
	    zlib_deflate.deflateSetHeader(this.strm, opt.header);
	  }

	  if (opt.dictionary) {
	    var dict;
	    // Convert data if needed
	    if (typeof opt.dictionary === 'string') {
	      // If we need to compress text, change encoding to utf8.
	      dict = strings.string2buf(opt.dictionary);
	    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
	      dict = new Uint8Array(opt.dictionary);
	    } else {
	      dict = opt.dictionary;
	    }

	    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

	    if (status !== Z_OK) {
	      throw new Error(msg[status]);
	    }

	    this._dict_set = true;
	  }
	}

	/**
	 * Deflate#push(data[, mode]) -> Boolean
	 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
	 *   converted to utf8 byte sequence.
	 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
	 *
	 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
	 * new compressed chunks. Returns `true` on success. The last data block must have
	 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	 * can use mode Z_SYNC_FLUSH, keeping the compression context.
	 *
	 * On fail call [[Deflate#onEnd]] with error code and return false.
	 *
	 * We strongly recommend to use `Uint8Array` on input for best speed (output
	 * array format is detected automatically). Also, don't skip last param and always
	 * use the same type in your code (boolean or number). That will improve JS speed.
	 *
	 * For regular `Array`-s make sure all elements are [0..255].
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * push(chunk, false); // push one of data chunks
	 * ...
	 * push(chunk, true);  // push last chunk
	 * ```
	 **/
	Deflate.prototype.push = function (data, mode) {
	  var strm = this.strm;
	  var chunkSize = this.options.chunkSize;
	  var status, _mode;

	  if (this.ended) { return false; }

	  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

	  // Convert data if needed
	  if (typeof data === 'string') {
	    // If we need to compress text, change encoding to utf8.
	    strm.input = strings.string2buf(data);
	  } else if (toString.call(data) === '[object ArrayBuffer]') {
	    strm.input = new Uint8Array(data);
	  } else {
	    strm.input = data;
	  }

	  strm.next_in = 0;
	  strm.avail_in = strm.input.length;

	  do {
	    if (strm.avail_out === 0) {
	      strm.output = new utils.Buf8(chunkSize);
	      strm.next_out = 0;
	      strm.avail_out = chunkSize;
	    }
	    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

	    if (status !== Z_STREAM_END && status !== Z_OK) {
	      this.onEnd(status);
	      this.ended = true;
	      return false;
	    }
	    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
	      if (this.options.to === 'string') {
	        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
	      } else {
	        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
	      }
	    }
	  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

	  // Finalize on the last chunk.
	  if (_mode === Z_FINISH) {
	    status = zlib_deflate.deflateEnd(this.strm);
	    this.onEnd(status);
	    this.ended = true;
	    return status === Z_OK;
	  }

	  // callback interim results if Z_SYNC_FLUSH.
	  if (_mode === Z_SYNC_FLUSH) {
	    this.onEnd(Z_OK);
	    strm.avail_out = 0;
	    return true;
	  }

	  return true;
	};


	/**
	 * Deflate#onData(chunk) -> Void
	 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
	 *   on js engine support. When string output requested, each chunk
	 *   will be string.
	 *
	 * By default, stores data blocks in `chunks[]` property and glue
	 * those in `onEnd`. Override this handler, if you need another behaviour.
	 **/
	Deflate.prototype.onData = function (chunk) {
	  this.chunks.push(chunk);
	};


	/**
	 * Deflate#onEnd(status) -> Void
	 * - status (Number): deflate status. 0 (Z_OK) on success,
	 *   other if not.
	 *
	 * Called once after you tell deflate that the input stream is
	 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	 * or if an error happened. By default - join collected chunks,
	 * free memory and fill `results` / `err` properties.
	 **/
	Deflate.prototype.onEnd = function (status) {
	  // On success - join
	  if (status === Z_OK) {
	    if (this.options.to === 'string') {
	      this.result = this.chunks.join('');
	    } else {
	      this.result = utils.flattenChunks(this.chunks);
	    }
	  }
	  this.chunks = [];
	  this.err = status;
	  this.msg = this.strm.msg;
	};


	/**
	 * deflate(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * Compress `data` with deflate algorithm and `options`.
	 *
	 * Supported options are:
	 *
	 * - level
	 * - windowBits
	 * - memLevel
	 * - strategy
	 * - dictionary
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Sugar (options):
	 *
	 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	 *   negative windowBits implicitly.
	 * - `to` (String) - if equal to 'string', then result will be "binary string"
	 *    (each char code [0..255])
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
	 *
	 * console.log(pako.deflate(data));
	 * ```
	 **/
	function deflate(input, options) {
	  var deflator = new Deflate(options);

	  deflator.push(input, true);

	  // That will never happens, if you don't cheat with options :)
	  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

	  return deflator.result;
	}


	/**
	 * deflateRaw(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * The same as [[deflate]], but creates raw data, without wrapper
	 * (header and adler32 crc).
	 **/
	function deflateRaw(input, options) {
	  options = options || {};
	  options.raw = true;
	  return deflate(input, options);
	}


	/**
	 * gzip(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * The same as [[deflate]], but create gzip wrapper instead of
	 * deflate one.
	 **/
	function gzip(input, options) {
	  options = options || {};
	  options.gzip = true;
	  return deflate(input, options);
	}


	exports.Deflate = Deflate;
	exports.deflate = deflate;
	exports.deflateRaw = deflateRaw;
	exports.gzip = gzip;

	},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(require,module,exports){


	var zlib_inflate = require('./zlib/inflate');
	var utils        = require('./utils/common');
	var strings      = require('./utils/strings');
	var c            = require('./zlib/constants');
	var msg          = require('./zlib/messages');
	var ZStream      = require('./zlib/zstream');
	var GZheader     = require('./zlib/gzheader');

	var toString = Object.prototype.toString;

	/**
	 * class Inflate
	 *
	 * Generic JS-style wrapper for zlib calls. If you don't need
	 * streaming behaviour - use more simple functions: [[inflate]]
	 * and [[inflateRaw]].
	 **/

	/* internal
	 * inflate.chunks -> Array
	 *
	 * Chunks of output data, if [[Inflate#onData]] not overriden.
	 **/

	/**
	 * Inflate.result -> Uint8Array|Array|String
	 *
	 * Uncompressed result, generated by default [[Inflate#onData]]
	 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
	 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
	 * push a chunk with explicit flush (call [[Inflate#push]] with
	 * `Z_SYNC_FLUSH` param).
	 **/

	/**
	 * Inflate.err -> Number
	 *
	 * Error code after inflate finished. 0 (Z_OK) on success.
	 * Should be checked if broken data possible.
	 **/

	/**
	 * Inflate.msg -> String
	 *
	 * Error message, if [[Inflate.err]] != 0
	 **/


	/**
	 * new Inflate(options)
	 * - options (Object): zlib inflate options.
	 *
	 * Creates new inflator instance with specified params. Throws exception
	 * on bad params. Supported options:
	 *
	 * - `windowBits`
	 * - `dictionary`
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Additional options, for internal needs:
	 *
	 * - `chunkSize` - size of generated data chunks (16K by default)
	 * - `raw` (Boolean) - do raw inflate
	 * - `to` (String) - if equal to 'string', then result will be converted
	 *   from utf8 to utf16 (javascript) string. When string output requested,
	 *   chunk length can differ from `chunkSize`, depending on content.
	 *
	 * By default, when no options set, autodetect deflate/gzip data format via
	 * wrapper header.
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	 *
	 * var inflate = new pako.Inflate({ level: 3});
	 *
	 * inflate.push(chunk1, false);
	 * inflate.push(chunk2, true);  // true -> last chunk
	 *
	 * if (inflate.err) { throw new Error(inflate.err); }
	 *
	 * console.log(inflate.result);
	 * ```
	 **/
	function Inflate(options) {
	  if (!(this instanceof Inflate)) return new Inflate(options);

	  this.options = utils.assign({
	    chunkSize: 16384,
	    windowBits: 0,
	    to: ''
	  }, options || {});

	  var opt = this.options;

	  // Force window size for `raw` data, if not set directly,
	  // because we have no header for autodetect.
	  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
	    opt.windowBits = -opt.windowBits;
	    if (opt.windowBits === 0) { opt.windowBits = -15; }
	  }

	  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
	  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
	      !(options && options.windowBits)) {
	    opt.windowBits += 32;
	  }

	  // Gzip header has no info about windows size, we can do autodetect only
	  // for deflate. So, if window size not set, force it to max when gzip possible
	  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
	    // bit 3 (16) -> gzipped data
	    // bit 4 (32) -> autodetect gzip/deflate
	    if ((opt.windowBits & 15) === 0) {
	      opt.windowBits |= 15;
	    }
	  }

	  this.err    = 0;      // error code, if happens (0 = Z_OK)
	  this.msg    = '';     // error message
	  this.ended  = false;  // used to avoid multiple onEnd() calls
	  this.chunks = [];     // chunks of compressed data

	  this.strm   = new ZStream();
	  this.strm.avail_out = 0;

	  var status  = zlib_inflate.inflateInit2(
	    this.strm,
	    opt.windowBits
	  );

	  if (status !== c.Z_OK) {
	    throw new Error(msg[status]);
	  }

	  this.header = new GZheader();

	  zlib_inflate.inflateGetHeader(this.strm, this.header);
	}

	/**
	 * Inflate#push(data[, mode]) -> Boolean
	 * - data (Uint8Array|Array|ArrayBuffer|String): input data
	 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
	 *
	 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
	 * new output chunks. Returns `true` on success. The last data block must have
	 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
	 *
	 * On fail call [[Inflate#onEnd]] with error code and return false.
	 *
	 * We strongly recommend to use `Uint8Array` on input for best speed (output
	 * format is detected automatically). Also, don't skip last param and always
	 * use the same type in your code (boolean or number). That will improve JS speed.
	 *
	 * For regular `Array`-s make sure all elements are [0..255].
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * push(chunk, false); // push one of data chunks
	 * ...
	 * push(chunk, true);  // push last chunk
	 * ```
	 **/
	Inflate.prototype.push = function (data, mode) {
	  var strm = this.strm;
	  var chunkSize = this.options.chunkSize;
	  var dictionary = this.options.dictionary;
	  var status, _mode;
	  var next_out_utf8, tail, utf8str;
	  var dict;

	  // Flag to properly process Z_BUF_ERROR on testing inflate call
	  // when we check that all output data was flushed.
	  var allowBufError = false;

	  if (this.ended) { return false; }
	  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

	  // Convert data if needed
	  if (typeof data === 'string') {
	    // Only binary strings can be decompressed on practice
	    strm.input = strings.binstring2buf(data);
	  } else if (toString.call(data) === '[object ArrayBuffer]') {
	    strm.input = new Uint8Array(data);
	  } else {
	    strm.input = data;
	  }

	  strm.next_in = 0;
	  strm.avail_in = strm.input.length;

	  do {
	    if (strm.avail_out === 0) {
	      strm.output = new utils.Buf8(chunkSize);
	      strm.next_out = 0;
	      strm.avail_out = chunkSize;
	    }

	    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

	    if (status === c.Z_NEED_DICT && dictionary) {
	      // Convert data if needed
	      if (typeof dictionary === 'string') {
	        dict = strings.string2buf(dictionary);
	      } else if (toString.call(dictionary) === '[object ArrayBuffer]') {
	        dict = new Uint8Array(dictionary);
	      } else {
	        dict = dictionary;
	      }

	      status = zlib_inflate.inflateSetDictionary(this.strm, dict);

	    }

	    if (status === c.Z_BUF_ERROR && allowBufError === true) {
	      status = c.Z_OK;
	      allowBufError = false;
	    }

	    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
	      this.onEnd(status);
	      this.ended = true;
	      return false;
	    }

	    if (strm.next_out) {
	      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

	        if (this.options.to === 'string') {

	          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

	          tail = strm.next_out - next_out_utf8;
	          utf8str = strings.buf2string(strm.output, next_out_utf8);

	          // move tail
	          strm.next_out = tail;
	          strm.avail_out = chunkSize - tail;
	          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

	          this.onData(utf8str);

	        } else {
	          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
	        }
	      }
	    }

	    // When no more input data, we should check that internal inflate buffers
	    // are flushed. The only way to do it when avail_out = 0 - run one more
	    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
	    // Here we set flag to process this error properly.
	    //
	    // NOTE. Deflate does not return error in this case and does not needs such
	    // logic.
	    if (strm.avail_in === 0 && strm.avail_out === 0) {
	      allowBufError = true;
	    }

	  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

	  if (status === c.Z_STREAM_END) {
	    _mode = c.Z_FINISH;
	  }

	  // Finalize on the last chunk.
	  if (_mode === c.Z_FINISH) {
	    status = zlib_inflate.inflateEnd(this.strm);
	    this.onEnd(status);
	    this.ended = true;
	    return status === c.Z_OK;
	  }

	  // callback interim results if Z_SYNC_FLUSH.
	  if (_mode === c.Z_SYNC_FLUSH) {
	    this.onEnd(c.Z_OK);
	    strm.avail_out = 0;
	    return true;
	  }

	  return true;
	};


	/**
	 * Inflate#onData(chunk) -> Void
	 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
	 *   on js engine support. When string output requested, each chunk
	 *   will be string.
	 *
	 * By default, stores data blocks in `chunks[]` property and glue
	 * those in `onEnd`. Override this handler, if you need another behaviour.
	 **/
	Inflate.prototype.onData = function (chunk) {
	  this.chunks.push(chunk);
	};


	/**
	 * Inflate#onEnd(status) -> Void
	 * - status (Number): inflate status. 0 (Z_OK) on success,
	 *   other if not.
	 *
	 * Called either after you tell inflate that the input stream is
	 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	 * or if an error happened. By default - join collected chunks,
	 * free memory and fill `results` / `err` properties.
	 **/
	Inflate.prototype.onEnd = function (status) {
	  // On success - join
	  if (status === c.Z_OK) {
	    if (this.options.to === 'string') {
	      // Glue & convert here, until we teach pako to send
	      // utf8 alligned strings to onData
	      this.result = this.chunks.join('');
	    } else {
	      this.result = utils.flattenChunks(this.chunks);
	    }
	  }
	  this.chunks = [];
	  this.err = status;
	  this.msg = this.strm.msg;
	};


	/**
	 * inflate(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * Decompress `data` with inflate/ungzip and `options`. Autodetect
	 * format via wrapper header by default. That's why we don't provide
	 * separate `ungzip` method.
	 *
	 * Supported options are:
	 *
	 * - windowBits
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information.
	 *
	 * Sugar (options):
	 *
	 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	 *   negative windowBits implicitly.
	 * - `to` (String) - if equal to 'string', then result will be converted
	 *   from utf8 to utf16 (javascript) string. When string output requested,
	 *   chunk length can differ from `chunkSize`, depending on content.
	 *
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
	 *   , output;
	 *
	 * try {
	 *   output = pako.inflate(input);
	 * } catch (err)
	 *   console.log(err);
	 * }
	 * ```
	 **/
	function inflate(input, options) {
	  var inflator = new Inflate(options);

	  inflator.push(input, true);

	  // That will never happens, if you don't cheat with options :)
	  if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

	  return inflator.result;
	}


	/**
	 * inflateRaw(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * The same as [[inflate]], but creates raw data, without wrapper
	 * (header and adler32 crc).
	 **/
	function inflateRaw(input, options) {
	  options = options || {};
	  options.raw = true;
	  return inflate(input, options);
	}


	/**
	 * ungzip(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * Just shortcut to [[inflate]], because it autodetects format
	 * by header.content. Done for convenience.
	 **/


	exports.Inflate = Inflate;
	exports.inflate = inflate;
	exports.inflateRaw = inflateRaw;
	exports.ungzip  = inflate;

	},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(require,module,exports){


	var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
	                (typeof Uint16Array !== 'undefined') &&
	                (typeof Int32Array !== 'undefined');


	exports.assign = function (obj /*from1, from2, from3, ...*/) {
	  var sources = Array.prototype.slice.call(arguments, 1);
	  while (sources.length) {
	    var source = sources.shift();
	    if (!source) { continue; }

	    if (typeof source !== 'object') {
	      throw new TypeError(source + 'must be non-object');
	    }

	    for (var p in source) {
	      if (source.hasOwnProperty(p)) {
	        obj[p] = source[p];
	      }
	    }
	  }

	  return obj;
	};


	// reduce buffer size, avoiding mem copy
	exports.shrinkBuf = function (buf, size) {
	  if (buf.length === size) { return buf; }
	  if (buf.subarray) { return buf.subarray(0, size); }
	  buf.length = size;
	  return buf;
	};


	var fnTyped = {
	  arraySet: function (dest, src, src_offs, len, dest_offs) {
	    if (src.subarray && dest.subarray) {
	      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
	      return;
	    }
	    // Fallback to ordinary array
	    for (var i = 0; i < len; i++) {
	      dest[dest_offs + i] = src[src_offs + i];
	    }
	  },
	  // Join array of chunks to single array.
	  flattenChunks: function (chunks) {
	    var i, l, len, pos, chunk, result;

	    // calculate data length
	    len = 0;
	    for (i = 0, l = chunks.length; i < l; i++) {
	      len += chunks[i].length;
	    }

	    // join chunks
	    result = new Uint8Array(len);
	    pos = 0;
	    for (i = 0, l = chunks.length; i < l; i++) {
	      chunk = chunks[i];
	      result.set(chunk, pos);
	      pos += chunk.length;
	    }

	    return result;
	  }
	};

	var fnUntyped = {
	  arraySet: function (dest, src, src_offs, len, dest_offs) {
	    for (var i = 0; i < len; i++) {
	      dest[dest_offs + i] = src[src_offs + i];
	    }
	  },
	  // Join array of chunks to single array.
	  flattenChunks: function (chunks) {
	    return [].concat.apply([], chunks);
	  }
	};


	// Enable/Disable typed arrays use, for testing
	//
	exports.setTyped = function (on) {
	  if (on) {
	    exports.Buf8  = Uint8Array;
	    exports.Buf16 = Uint16Array;
	    exports.Buf32 = Int32Array;
	    exports.assign(exports, fnTyped);
	  } else {
	    exports.Buf8  = Array;
	    exports.Buf16 = Array;
	    exports.Buf32 = Array;
	    exports.assign(exports, fnUntyped);
	  }
	};

	exports.setTyped(TYPED_OK);

	},{}],42:[function(require,module,exports){


	var utils = require('./common');


	// Quick check if we can use fast array to bin string conversion
	//
	// - apply(Array) can fail on Android 2.2
	// - apply(Uint8Array) can fail on iOS 5.1 Safary
	//
	var STR_APPLY_OK = true;
	var STR_APPLY_UIA_OK = true;

	try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
	try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


	// Table with utf8 lengths (calculated by first byte of sequence)
	// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
	// because max possible codepoint is 0x10ffff
	var _utf8len = new utils.Buf8(256);
	for (var q = 0; q < 256; q++) {
	  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
	}
	_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


	// convert string to array (typed, when possible)
	exports.string2buf = function (str) {
	  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

	  // count binary size
	  for (m_pos = 0; m_pos < str_len; m_pos++) {
	    c = str.charCodeAt(m_pos);
	    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
	      c2 = str.charCodeAt(m_pos + 1);
	      if ((c2 & 0xfc00) === 0xdc00) {
	        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	        m_pos++;
	      }
	    }
	    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
	  }

	  // allocate buffer
	  buf = new utils.Buf8(buf_len);

	  // convert
	  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
	    c = str.charCodeAt(m_pos);
	    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
	      c2 = str.charCodeAt(m_pos + 1);
	      if ((c2 & 0xfc00) === 0xdc00) {
	        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	        m_pos++;
	      }
	    }
	    if (c < 0x80) {
	      /* one byte */
	      buf[i++] = c;
	    } else if (c < 0x800) {
	      /* two bytes */
	      buf[i++] = 0xC0 | (c >>> 6);
	      buf[i++] = 0x80 | (c & 0x3f);
	    } else if (c < 0x10000) {
	      /* three bytes */
	      buf[i++] = 0xE0 | (c >>> 12);
	      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	      buf[i++] = 0x80 | (c & 0x3f);
	    } else {
	      /* four bytes */
	      buf[i++] = 0xf0 | (c >>> 18);
	      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
	      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	      buf[i++] = 0x80 | (c & 0x3f);
	    }
	  }

	  return buf;
	};

	// Helper (used in 2 places)
	function buf2binstring(buf, len) {
	  // use fallback for big arrays to avoid stack overflow
	  if (len < 65537) {
	    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
	      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
	    }
	  }

	  var result = '';
	  for (var i = 0; i < len; i++) {
	    result += String.fromCharCode(buf[i]);
	  }
	  return result;
	}


	// Convert byte array to binary string
	exports.buf2binstring = function (buf) {
	  return buf2binstring(buf, buf.length);
	};


	// Convert binary string (typed, when possible)
	exports.binstring2buf = function (str) {
	  var buf = new utils.Buf8(str.length);
	  for (var i = 0, len = buf.length; i < len; i++) {
	    buf[i] = str.charCodeAt(i);
	  }
	  return buf;
	};


	// convert array to string
	exports.buf2string = function (buf, max) {
	  var i, out, c, c_len;
	  var len = max || buf.length;

	  // Reserve max possible length (2 words per char)
	  // NB: by unknown reasons, Array is significantly faster for
	  //     String.fromCharCode.apply than Uint16Array.
	  var utf16buf = new Array(len * 2);

	  for (out = 0, i = 0; i < len;) {
	    c = buf[i++];
	    // quick process ascii
	    if (c < 0x80) { utf16buf[out++] = c; continue; }

	    c_len = _utf8len[c];
	    // skip 5 & 6 byte codes
	    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

	    // apply mask on first byte
	    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
	    // join the rest
	    while (c_len > 1 && i < len) {
	      c = (c << 6) | (buf[i++] & 0x3f);
	      c_len--;
	    }

	    // terminated by end of string?
	    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

	    if (c < 0x10000) {
	      utf16buf[out++] = c;
	    } else {
	      c -= 0x10000;
	      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
	      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
	    }
	  }

	  return buf2binstring(utf16buf, out);
	};


	// Calculate max possible position in utf8 buffer,
	// that will not break sequence. If that's not possible
	// - (very small limits) return max size as is.
	//
	// buf[] - utf8 bytes array
	// max   - length limit (mandatory);
	exports.utf8border = function (buf, max) {
	  var pos;

	  max = max || buf.length;
	  if (max > buf.length) { max = buf.length; }

	  // go back from last position, until start of sequence found
	  pos = max - 1;
	  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

	  // Fuckup - very small and broken sequence,
	  // return max, because we should return something anyway.
	  if (pos < 0) { return max; }

	  // If we came to start of buffer - that means vuffer is too small,
	  // return max too.
	  if (pos === 0) { return max; }

	  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
	};

	},{"./common":41}],43:[function(require,module,exports){

	// Note: adler32 takes 12% for level 0 and 2% for level 6.
	// It doesn't worth to make additional optimizationa as in original.
	// Small size is preferable.

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	function adler32(adler, buf, len, pos) {
	  var s1 = (adler & 0xffff) |0,
	      s2 = ((adler >>> 16) & 0xffff) |0,
	      n = 0;

	  while (len !== 0) {
	    // Set limit ~ twice less than 5552, to keep
	    // s2 in 31-bits, because we force signed ints.
	    // in other case %= will fail.
	    n = len > 2000 ? 2000 : len;
	    len -= n;

	    do {
	      s1 = (s1 + buf[pos++]) |0;
	      s2 = (s2 + s1) |0;
	    } while (--n);

	    s1 %= 65521;
	    s2 %= 65521;
	  }

	  return (s1 | (s2 << 16)) |0;
	}


	module.exports = adler32;

	},{}],44:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	module.exports = {

	  /* Allowed flush values; see deflate() and inflate() below for details */
	  Z_NO_FLUSH:         0,
	  Z_PARTIAL_FLUSH:    1,
	  Z_SYNC_FLUSH:       2,
	  Z_FULL_FLUSH:       3,
	  Z_FINISH:           4,
	  Z_BLOCK:            5,
	  Z_TREES:            6,

	  /* Return codes for the compression/decompression functions. Negative values
	  * are errors, positive values are used for special but normal events.
	  */
	  Z_OK:               0,
	  Z_STREAM_END:       1,
	  Z_NEED_DICT:        2,
	  Z_ERRNO:           -1,
	  Z_STREAM_ERROR:    -2,
	  Z_DATA_ERROR:      -3,
	  //Z_MEM_ERROR:     -4,
	  Z_BUF_ERROR:       -5,
	  //Z_VERSION_ERROR: -6,

	  /* compression levels */
	  Z_NO_COMPRESSION:         0,
	  Z_BEST_SPEED:             1,
	  Z_BEST_COMPRESSION:       9,
	  Z_DEFAULT_COMPRESSION:   -1,


	  Z_FILTERED:               1,
	  Z_HUFFMAN_ONLY:           2,
	  Z_RLE:                    3,
	  Z_FIXED:                  4,
	  Z_DEFAULT_STRATEGY:       0,

	  /* Possible values of the data_type field (though see inflate()) */
	  Z_BINARY:                 0,
	  Z_TEXT:                   1,
	  //Z_ASCII:                1, // = Z_TEXT (deprecated)
	  Z_UNKNOWN:                2,

	  /* The deflate compression method */
	  Z_DEFLATED:               8
	  //Z_NULL:                 null // Use -1 or null inline, depending on var type
	};

	},{}],45:[function(require,module,exports){

	// Note: we can't get significant speed boost here.
	// So write code to minimize size - no pregenerated tables
	// and array tools dependencies.

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	// Use ordinary array, since untyped makes no boost here
	function makeTable() {
	  var c, table = [];

	  for (var n = 0; n < 256; n++) {
	    c = n;
	    for (var k = 0; k < 8; k++) {
	      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	    }
	    table[n] = c;
	  }

	  return table;
	}

	// Create table on load. Just 255 signed longs. Not a problem.
	var crcTable = makeTable();


	function crc32(crc, buf, len, pos) {
	  var t = crcTable,
	      end = pos + len;

	  crc ^= -1;

	  for (var i = pos; i < end; i++) {
	    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
	  }

	  return (crc ^ (-1)); // >>> 0;
	}


	module.exports = crc32;

	},{}],46:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils   = require('../utils/common');
	var trees   = require('./trees');
	var adler32 = require('./adler32');
	var crc32   = require('./crc32');
	var msg     = require('./messages');

	/* Public constants ==========================================================*/
	/* ===========================================================================*/


	/* Allowed flush values; see deflate() and inflate() below for details */
	var Z_NO_FLUSH      = 0;
	var Z_PARTIAL_FLUSH = 1;
	//var Z_SYNC_FLUSH    = 2;
	var Z_FULL_FLUSH    = 3;
	var Z_FINISH        = 4;
	var Z_BLOCK         = 5;
	//var Z_TREES         = 6;


	/* Return codes for the compression/decompression functions. Negative values
	 * are errors, positive values are used for special but normal events.
	 */
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	//var Z_NEED_DICT     = 2;
	//var Z_ERRNO         = -1;
	var Z_STREAM_ERROR  = -2;
	var Z_DATA_ERROR    = -3;
	//var Z_MEM_ERROR     = -4;
	var Z_BUF_ERROR     = -5;
	//var Z_VERSION_ERROR = -6;


	/* compression levels */
	//var Z_NO_COMPRESSION      = 0;
	//var Z_BEST_SPEED          = 1;
	//var Z_BEST_COMPRESSION    = 9;
	var Z_DEFAULT_COMPRESSION = -1;


	var Z_FILTERED            = 1;
	var Z_HUFFMAN_ONLY        = 2;
	var Z_RLE                 = 3;
	var Z_FIXED               = 4;
	var Z_DEFAULT_STRATEGY    = 0;

	/* Possible values of the data_type field (though see inflate()) */
	//var Z_BINARY              = 0;
	//var Z_TEXT                = 1;
	//var Z_ASCII               = 1; // = Z_TEXT
	var Z_UNKNOWN             = 2;


	/* The deflate compression method */
	var Z_DEFLATED  = 8;

	/*============================================================================*/


	var MAX_MEM_LEVEL = 9;
	/* Maximum value for memLevel in deflateInit2 */
	var MAX_WBITS = 15;
	/* 32K LZ77 window */
	var DEF_MEM_LEVEL = 8;


	var LENGTH_CODES  = 29;
	/* number of length codes, not counting the special END_BLOCK code */
	var LITERALS      = 256;
	/* number of literal bytes 0..255 */
	var L_CODES       = LITERALS + 1 + LENGTH_CODES;
	/* number of Literal or Length codes, including the END_BLOCK code */
	var D_CODES       = 30;
	/* number of distance codes */
	var BL_CODES      = 19;
	/* number of codes used to transfer the bit lengths */
	var HEAP_SIZE     = 2 * L_CODES + 1;
	/* maximum heap size */
	var MAX_BITS  = 15;
	/* All codes must not exceed MAX_BITS bits */

	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

	var PRESET_DICT = 0x20;

	var INIT_STATE = 42;
	var EXTRA_STATE = 69;
	var NAME_STATE = 73;
	var COMMENT_STATE = 91;
	var HCRC_STATE = 103;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;

	var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
	var BS_BLOCK_DONE     = 2; /* block flush performed */
	var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
	var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

	var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

	function err(strm, errorCode) {
	  strm.msg = msg[errorCode];
	  return errorCode;
	}

	function rank(f) {
	  return ((f) << 1) - ((f) > 4 ? 9 : 0);
	}

	function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


	/* =========================================================================
	 * Flush as much pending output as possible. All deflate() output goes
	 * through this function so some applications may wish to modify it
	 * to avoid allocating a large strm->output buffer and copying into it.
	 * (See also read_buf()).
	 */
	function flush_pending(strm) {
	  var s = strm.state;

	  //_tr_flush_bits(s);
	  var len = s.pending;
	  if (len > strm.avail_out) {
	    len = strm.avail_out;
	  }
	  if (len === 0) { return; }

	  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
	  strm.next_out += len;
	  s.pending_out += len;
	  strm.total_out += len;
	  strm.avail_out -= len;
	  s.pending -= len;
	  if (s.pending === 0) {
	    s.pending_out = 0;
	  }
	}


	function flush_block_only(s, last) {
	  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
	  s.block_start = s.strstart;
	  flush_pending(s.strm);
	}


	function put_byte(s, b) {
	  s.pending_buf[s.pending++] = b;
	}


	/* =========================================================================
	 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
	 * IN assertion: the stream state is correct and there is enough room in
	 * pending_buf.
	 */
	function putShortMSB(s, b) {
	//  put_byte(s, (Byte)(b >> 8));
	//  put_byte(s, (Byte)(b & 0xff));
	  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
	  s.pending_buf[s.pending++] = b & 0xff;
	}


	/* ===========================================================================
	 * Read a new buffer from the current input stream, update the adler32
	 * and total number of bytes read.  All deflate() input goes through
	 * this function so some applications may wish to modify it to avoid
	 * allocating a large strm->input buffer and copying from it.
	 * (See also flush_pending()).
	 */
	function read_buf(strm, buf, start, size) {
	  var len = strm.avail_in;

	  if (len > size) { len = size; }
	  if (len === 0) { return 0; }

	  strm.avail_in -= len;

	  // zmemcpy(buf, strm->next_in, len);
	  utils.arraySet(buf, strm.input, strm.next_in, len, start);
	  if (strm.state.wrap === 1) {
	    strm.adler = adler32(strm.adler, buf, len, start);
	  }

	  else if (strm.state.wrap === 2) {
	    strm.adler = crc32(strm.adler, buf, len, start);
	  }

	  strm.next_in += len;
	  strm.total_in += len;

	  return len;
	}


	/* ===========================================================================
	 * Set match_start to the longest match starting at the given string and
	 * return its length. Matches shorter or equal to prev_length are discarded,
	 * in which case the result is equal to prev_length and match_start is
	 * garbage.
	 * IN assertions: cur_match is the head of the hash chain for the current
	 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
	 * OUT assertion: the match length is not greater than s->lookahead.
	 */
	function longest_match(s, cur_match) {
	  var chain_length = s.max_chain_length;      /* max hash chain length */
	  var scan = s.strstart; /* current string */
	  var match;                       /* matched string */
	  var len;                           /* length of current match */
	  var best_len = s.prev_length;              /* best match length so far */
	  var nice_match = s.nice_match;             /* stop if match long enough */
	  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
	      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

	  var _win = s.window; // shortcut

	  var wmask = s.w_mask;
	  var prev  = s.prev;

	  /* Stop when cur_match becomes <= limit. To simplify the code,
	   * we prevent matches with the string of window index 0.
	   */

	  var strend = s.strstart + MAX_MATCH;
	  var scan_end1  = _win[scan + best_len - 1];
	  var scan_end   = _win[scan + best_len];

	  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
	   * It is easy to get rid of this optimization if necessary.
	   */
	  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

	  /* Do not waste too much time if we already have a good match: */
	  if (s.prev_length >= s.good_match) {
	    chain_length >>= 2;
	  }
	  /* Do not look for matches beyond the end of the input. This is necessary
	   * to make deflate deterministic.
	   */
	  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

	  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

	  do {
	    // Assert(cur_match < s->strstart, "no future");
	    match = cur_match;

	    /* Skip to next match if the match length cannot increase
	     * or if the match length is less than 2.  Note that the checks below
	     * for insufficient lookahead only occur occasionally for performance
	     * reasons.  Therefore uninitialized memory will be accessed, and
	     * conditional jumps will be made that depend on those values.
	     * However the length of the match is limited to the lookahead, so
	     * the output of deflate is not affected by the uninitialized values.
	     */

	    if (_win[match + best_len]     !== scan_end  ||
	        _win[match + best_len - 1] !== scan_end1 ||
	        _win[match]                !== _win[scan] ||
	        _win[++match]              !== _win[scan + 1]) {
	      continue;
	    }

	    /* The check at best_len-1 can be removed because it will be made
	     * again later. (This heuristic is not always a win.)
	     * It is not necessary to compare scan[2] and match[2] since they
	     * are always equal when the other bytes match, given that
	     * the hash keys are equal and that HASH_BITS >= 8.
	     */
	    scan += 2;
	    match++;
	    // Assert(*scan == *match, "match[2]?");

	    /* We check for insufficient lookahead only every 8th comparison;
	     * the 256th check will be made at strstart+258.
	     */
	    do {
	      /*jshint noempty:false*/
	    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             scan < strend);

	    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

	    len = MAX_MATCH - (strend - scan);
	    scan = strend - MAX_MATCH;

	    if (len > best_len) {
	      s.match_start = cur_match;
	      best_len = len;
	      if (len >= nice_match) {
	        break;
	      }
	      scan_end1  = _win[scan + best_len - 1];
	      scan_end   = _win[scan + best_len];
	    }
	  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

	  if (best_len <= s.lookahead) {
	    return best_len;
	  }
	  return s.lookahead;
	}


	/* ===========================================================================
	 * Fill the window when the lookahead becomes insufficient.
	 * Updates strstart and lookahead.
	 *
	 * IN assertion: lookahead < MIN_LOOKAHEAD
	 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
	 *    At least one byte has been read, or avail_in == 0; reads are
	 *    performed for at least two bytes (required for the zip translate_eol
	 *    option -- not supported here).
	 */
	function fill_window(s) {
	  var _w_size = s.w_size;
	  var p, n, m, more, str;

	  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

	  do {
	    more = s.window_size - s.lookahead - s.strstart;

	    // JS ints have 32 bit, block below not needed
	    /* Deal with !@#$% 64K limit: */
	    //if (sizeof(int) <= 2) {
	    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
	    //        more = wsize;
	    //
	    //  } else if (more == (unsigned)(-1)) {
	    //        /* Very unlikely, but possible on 16 bit machine if
	    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
	    //         */
	    //        more--;
	    //    }
	    //}


	    /* If the window is almost full and there is insufficient lookahead,
	     * move the upper half to the lower one to make room in the upper half.
	     */
	    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

	      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
	      s.match_start -= _w_size;
	      s.strstart -= _w_size;
	      /* we now have strstart >= MAX_DIST */
	      s.block_start -= _w_size;

	      /* Slide the hash table (could be avoided with 32 bit values
	       at the expense of memory usage). We slide even when level == 0
	       to keep the hash table consistent if we switch back to level > 0
	       later. (Using level 0 permanently is not an optimal usage of
	       zlib, so we don't care about this pathological case.)
	       */

	      n = s.hash_size;
	      p = n;
	      do {
	        m = s.head[--p];
	        s.head[p] = (m >= _w_size ? m - _w_size : 0);
	      } while (--n);

	      n = _w_size;
	      p = n;
	      do {
	        m = s.prev[--p];
	        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
	        /* If n is not on any hash chain, prev[n] is garbage but
	         * its value will never be used.
	         */
	      } while (--n);

	      more += _w_size;
	    }
	    if (s.strm.avail_in === 0) {
	      break;
	    }

	    /* If there was no sliding:
	     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
	     *    more == window_size - lookahead - strstart
	     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
	     * => more >= window_size - 2*WSIZE + 2
	     * In the BIG_MEM or MMAP case (not yet supported),
	     *   window_size == input_size + MIN_LOOKAHEAD  &&
	     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
	     * Otherwise, window_size == 2*WSIZE so more >= 2.
	     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
	     */
	    //Assert(more >= 2, "more < 2");
	    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
	    s.lookahead += n;

	    /* Initialize the hash value now that we have some input: */
	    if (s.lookahead + s.insert >= MIN_MATCH) {
	      str = s.strstart - s.insert;
	      s.ins_h = s.window[str];

	      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
	//#if MIN_MATCH != 3
	//        Call update_hash() MIN_MATCH-3 more times
	//#endif
	      while (s.insert) {
	        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
	        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

	        s.prev[str & s.w_mask] = s.head[s.ins_h];
	        s.head[s.ins_h] = str;
	        str++;
	        s.insert--;
	        if (s.lookahead + s.insert < MIN_MATCH) {
	          break;
	        }
	      }
	    }
	    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
	     * but this is not important since only literal bytes will be emitted.
	     */

	  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

	  /* If the WIN_INIT bytes after the end of the current data have never been
	   * written, then zero those bytes in order to avoid memory check reports of
	   * the use of uninitialized (or uninitialised as Julian writes) bytes by
	   * the longest match routines.  Update the high water mark for the next
	   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
	   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
	   */
	//  if (s.high_water < s.window_size) {
	//    var curr = s.strstart + s.lookahead;
	//    var init = 0;
	//
	//    if (s.high_water < curr) {
	//      /* Previous high water mark below current data -- zero WIN_INIT
	//       * bytes or up to end of window, whichever is less.
	//       */
	//      init = s.window_size - curr;
	//      if (init > WIN_INIT)
	//        init = WIN_INIT;
	//      zmemzero(s->window + curr, (unsigned)init);
	//      s->high_water = curr + init;
	//    }
	//    else if (s->high_water < (ulg)curr + WIN_INIT) {
	//      /* High water mark at or above current data, but below current data
	//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
	//       * to end of window, whichever is less.
	//       */
	//      init = (ulg)curr + WIN_INIT - s->high_water;
	//      if (init > s->window_size - s->high_water)
	//        init = s->window_size - s->high_water;
	//      zmemzero(s->window + s->high_water, (unsigned)init);
	//      s->high_water += init;
	//    }
	//  }
	//
	//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
	//    "not enough room for search");
	}

	/* ===========================================================================
	 * Copy without compression as much as possible from the input stream, return
	 * the current block state.
	 * This function does not insert new strings in the dictionary since
	 * uncompressible data is probably not useful. This function is used
	 * only for the level=0 compression option.
	 * NOTE: this function should be optimized to avoid extra copying from
	 * window to pending_buf.
	 */
	function deflate_stored(s, flush) {
	  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
	   * to pending_buf_size, and each stored block has a 5 byte header:
	   */
	  var max_block_size = 0xffff;

	  if (max_block_size > s.pending_buf_size - 5) {
	    max_block_size = s.pending_buf_size - 5;
	  }

	  /* Copy as much as possible from input to output: */
	  for (;;) {
	    /* Fill the window as much as possible: */
	    if (s.lookahead <= 1) {

	      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
	      //  s->block_start >= (long)s->w_size, "slide too late");
	//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
	//        s.block_start >= s.w_size)) {
	//        throw  new Error("slide too late");
	//      }

	      fill_window(s);
	      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }

	      if (s.lookahead === 0) {
	        break;
	      }
	      /* flush the current block */
	    }
	    //Assert(s->block_start >= 0L, "block gone");
	//    if (s.block_start < 0) throw new Error("block gone");

	    s.strstart += s.lookahead;
	    s.lookahead = 0;

	    /* Emit a stored block if pending_buf will be full: */
	    var max_start = s.block_start + max_block_size;

	    if (s.strstart === 0 || s.strstart >= max_start) {
	      /* strstart == 0 is possible when wraparound on 16-bit machine */
	      s.lookahead = s.strstart - max_start;
	      s.strstart = max_start;
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/


	    }
	    /* Flush if we may have to slide, otherwise block_start may become
	     * negative and the data will be gone:
	     */
	    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }

	  s.insert = 0;

	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }

	  if (s.strstart > s.block_start) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }

	  return BS_NEED_MORE;
	}

	/* ===========================================================================
	 * Compress as much as possible from the input stream, return the current
	 * block state.
	 * This function does not perform lazy evaluation of matches and inserts
	 * new strings in the dictionary only for unmatched strings or for short
	 * matches. It is used only for the fast compression options.
	 */
	function deflate_fast(s, flush) {
	  var hash_head;        /* head of the hash chain */
	  var bflush;           /* set if current block must be flushed */

	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the next match, plus MIN_MATCH bytes to insert the
	     * string following the next match.
	     */
	    if (s.lookahead < MIN_LOOKAHEAD) {
	      fill_window(s);
	      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) {
	        break; /* flush the current block */
	      }
	    }

	    /* Insert the string window[strstart .. strstart+2] in the
	     * dictionary, and set hash_head to the head of the hash chain:
	     */
	    hash_head = 0/*NIL*/;
	    if (s.lookahead >= MIN_MATCH) {
	      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	      s.head[s.ins_h] = s.strstart;
	      /***/
	    }

	    /* Find the longest match, discarding those <= prev_length.
	     * At this point we have always match_length < MIN_MATCH
	     */
	    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
	      /* To simplify the code, we prevent matches with the string
	       * of window index 0 (in particular we have to avoid a match
	       * of the string with itself at the start of the input file).
	       */
	      s.match_length = longest_match(s, hash_head);
	      /* longest_match() sets match_start */
	    }
	    if (s.match_length >= MIN_MATCH) {
	      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

	      /*** _tr_tally_dist(s, s.strstart - s.match_start,
	                     s.match_length - MIN_MATCH, bflush); ***/
	      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

	      s.lookahead -= s.match_length;

	      /* Insert new strings in the hash table only if the match length
	       * is not too large. This saves time but degrades compression.
	       */
	      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
	        s.match_length--; /* string at strstart already in table */
	        do {
	          s.strstart++;
	          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	          s.head[s.ins_h] = s.strstart;
	          /***/
	          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
	           * always MIN_MATCH bytes ahead.
	           */
	        } while (--s.match_length !== 0);
	        s.strstart++;
	      } else
	      {
	        s.strstart += s.match_length;
	        s.match_length = 0;
	        s.ins_h = s.window[s.strstart];
	        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
	        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

	//#if MIN_MATCH != 3
	//                Call UPDATE_HASH() MIN_MATCH-3 more times
	//#endif
	        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
	         * matter since it will be recomputed at next deflate call.
	         */
	      }
	    } else {
	      /* No match, output a literal byte */
	      //Tracevv((stderr,"%c", s.window[s.strstart]));
	      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

	      s.lookahead--;
	      s.strstart++;
	    }
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}

	/* ===========================================================================
	 * Same as above, but achieves better compression. We use a lazy
	 * evaluation for matches: a match is finally adopted only if there is
	 * no better match at the next window position.
	 */
	function deflate_slow(s, flush) {
	  var hash_head;          /* head of hash chain */
	  var bflush;              /* set if current block must be flushed */

	  var max_insert;

	  /* Process the input block. */
	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the next match, plus MIN_MATCH bytes to insert the
	     * string following the next match.
	     */
	    if (s.lookahead < MIN_LOOKAHEAD) {
	      fill_window(s);
	      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) { break; } /* flush the current block */
	    }

	    /* Insert the string window[strstart .. strstart+2] in the
	     * dictionary, and set hash_head to the head of the hash chain:
	     */
	    hash_head = 0/*NIL*/;
	    if (s.lookahead >= MIN_MATCH) {
	      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	      s.head[s.ins_h] = s.strstart;
	      /***/
	    }

	    /* Find the longest match, discarding those <= prev_length.
	     */
	    s.prev_length = s.match_length;
	    s.prev_match = s.match_start;
	    s.match_length = MIN_MATCH - 1;

	    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
	        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
	      /* To simplify the code, we prevent matches with the string
	       * of window index 0 (in particular we have to avoid a match
	       * of the string with itself at the start of the input file).
	       */
	      s.match_length = longest_match(s, hash_head);
	      /* longest_match() sets match_start */

	      if (s.match_length <= 5 &&
	         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

	        /* If prev_match is also MIN_MATCH, match_start is garbage
	         * but we will ignore the current match anyway.
	         */
	        s.match_length = MIN_MATCH - 1;
	      }
	    }
	    /* If there was a match at the previous step and the current
	     * match is not better, output the previous match:
	     */
	    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
	      max_insert = s.strstart + s.lookahead - MIN_MATCH;
	      /* Do not insert strings in hash table beyond this. */

	      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

	      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
	                     s.prev_length - MIN_MATCH, bflush);***/
	      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
	      /* Insert in hash table all strings up to the end of the match.
	       * strstart-1 and strstart are already inserted. If there is not
	       * enough lookahead, the last two strings are not inserted in
	       * the hash table.
	       */
	      s.lookahead -= s.prev_length - 1;
	      s.prev_length -= 2;
	      do {
	        if (++s.strstart <= max_insert) {
	          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	          s.head[s.ins_h] = s.strstart;
	          /***/
	        }
	      } while (--s.prev_length !== 0);
	      s.match_available = 0;
	      s.match_length = MIN_MATCH - 1;
	      s.strstart++;

	      if (bflush) {
	        /*** FLUSH_BLOCK(s, 0); ***/
	        flush_block_only(s, false);
	        if (s.strm.avail_out === 0) {
	          return BS_NEED_MORE;
	        }
	        /***/
	      }

	    } else if (s.match_available) {
	      /* If there was no match at the previous position, output a
	       * single literal. If there was a match but the current match
	       * is longer, truncate the previous match to a single literal.
	       */
	      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
	      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

	      if (bflush) {
	        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
	        flush_block_only(s, false);
	        /***/
	      }
	      s.strstart++;
	      s.lookahead--;
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	    } else {
	      /* There is no previous match to compare with, wait for
	       * the next step to decide.
	       */
	      s.match_available = 1;
	      s.strstart++;
	      s.lookahead--;
	    }
	  }
	  //Assert (flush != Z_NO_FLUSH, "no flush?");
	  if (s.match_available) {
	    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
	    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
	    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

	    s.match_available = 0;
	  }
	  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }

	  return BS_BLOCK_DONE;
	}


	/* ===========================================================================
	 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
	 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
	 * deflate switches away from Z_RLE.)
	 */
	function deflate_rle(s, flush) {
	  var bflush;            /* set if current block must be flushed */
	  var prev;              /* byte at distance one to match */
	  var scan, strend;      /* scan goes up to strend for length of run */

	  var _win = s.window;

	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the longest run, plus one for the unrolled loop.
	     */
	    if (s.lookahead <= MAX_MATCH) {
	      fill_window(s);
	      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) { break; } /* flush the current block */
	    }

	    /* See how many times the previous byte repeats */
	    s.match_length = 0;
	    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
	      scan = s.strstart - 1;
	      prev = _win[scan];
	      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
	        strend = s.strstart + MAX_MATCH;
	        do {
	          /*jshint noempty:false*/
	        } while (prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 scan < strend);
	        s.match_length = MAX_MATCH - (strend - scan);
	        if (s.match_length > s.lookahead) {
	          s.match_length = s.lookahead;
	        }
	      }
	      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
	    }

	    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
	    if (s.match_length >= MIN_MATCH) {
	      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

	      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
	      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

	      s.lookahead -= s.match_length;
	      s.strstart += s.match_length;
	      s.match_length = 0;
	    } else {
	      /* No match, output a literal byte */
	      //Tracevv((stderr,"%c", s->window[s->strstart]));
	      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

	      s.lookahead--;
	      s.strstart++;
	    }
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = 0;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}

	/* ===========================================================================
	 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
	 * (It will be regenerated if this run of deflate switches away from Huffman.)
	 */
	function deflate_huff(s, flush) {
	  var bflush;             /* set if current block must be flushed */

	  for (;;) {
	    /* Make sure that we have a literal to write. */
	    if (s.lookahead === 0) {
	      fill_window(s);
	      if (s.lookahead === 0) {
	        if (flush === Z_NO_FLUSH) {
	          return BS_NEED_MORE;
	        }
	        break;      /* flush the current block */
	      }
	    }

	    /* Output a literal byte */
	    s.match_length = 0;
	    //Tracevv((stderr,"%c", s->window[s->strstart]));
	    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
	    s.lookahead--;
	    s.strstart++;
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = 0;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}

	/* Values for max_lazy_match, good_match and max_chain_length, depending on
	 * the desired pack level (0..9). The values given below have been tuned to
	 * exclude worst case performance for pathological files. Better values may be
	 * found for specific files.
	 */
	function Config(good_length, max_lazy, nice_length, max_chain, func) {
	  this.good_length = good_length;
	  this.max_lazy = max_lazy;
	  this.nice_length = nice_length;
	  this.max_chain = max_chain;
	  this.func = func;
	}

	var configuration_table;

	configuration_table = [
	  /*      good lazy nice chain */
	  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
	  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
	  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
	  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

	  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
	  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
	  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
	  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
	  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
	  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
	];


	/* ===========================================================================
	 * Initialize the "longest match" routines for a new zlib stream
	 */
	function lm_init(s) {
	  s.window_size = 2 * s.w_size;

	  /*** CLEAR_HASH(s); ***/
	  zero(s.head); // Fill with NIL (= 0);

	  /* Set the default configuration parameters:
	   */
	  s.max_lazy_match = configuration_table[s.level].max_lazy;
	  s.good_match = configuration_table[s.level].good_length;
	  s.nice_match = configuration_table[s.level].nice_length;
	  s.max_chain_length = configuration_table[s.level].max_chain;

	  s.strstart = 0;
	  s.block_start = 0;
	  s.lookahead = 0;
	  s.insert = 0;
	  s.match_length = s.prev_length = MIN_MATCH - 1;
	  s.match_available = 0;
	  s.ins_h = 0;
	}


	function DeflateState() {
	  this.strm = null;            /* pointer back to this zlib stream */
	  this.status = 0;            /* as the name implies */
	  this.pending_buf = null;      /* output still pending */
	  this.pending_buf_size = 0;  /* size of pending_buf */
	  this.pending_out = 0;       /* next pending byte to output to the stream */
	  this.pending = 0;           /* nb of bytes in the pending buffer */
	  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
	  this.gzhead = null;         /* gzip header information to write */
	  this.gzindex = 0;           /* where in extra, name, or comment */
	  this.method = Z_DEFLATED; /* can only be DEFLATED */
	  this.last_flush = -1;   /* value of flush param for previous deflate call */

	  this.w_size = 0;  /* LZ77 window size (32K by default) */
	  this.w_bits = 0;  /* log2(w_size)  (8..16) */
	  this.w_mask = 0;  /* w_size - 1 */

	  this.window = null;
	  /* Sliding window. Input bytes are read into the second half of the window,
	   * and move to the first half later to keep a dictionary of at least wSize
	   * bytes. With this organization, matches are limited to a distance of
	   * wSize-MAX_MATCH bytes, but this ensures that IO is always
	   * performed with a length multiple of the block size.
	   */

	  this.window_size = 0;
	  /* Actual size of window: 2*wSize, except when the user input buffer
	   * is directly used as sliding window.
	   */

	  this.prev = null;
	  /* Link to older string with same hash index. To limit the size of this
	   * array to 64K, this link is maintained only for the last 32K strings.
	   * An index in this array is thus a window index modulo 32K.
	   */

	  this.head = null;   /* Heads of the hash chains or NIL. */

	  this.ins_h = 0;       /* hash index of string to be inserted */
	  this.hash_size = 0;   /* number of elements in hash table */
	  this.hash_bits = 0;   /* log2(hash_size) */
	  this.hash_mask = 0;   /* hash_size-1 */

	  this.hash_shift = 0;
	  /* Number of bits by which ins_h must be shifted at each input
	   * step. It must be such that after MIN_MATCH steps, the oldest
	   * byte no longer takes part in the hash key, that is:
	   *   hash_shift * MIN_MATCH >= hash_bits
	   */

	  this.block_start = 0;
	  /* Window position at the beginning of the current output block. Gets
	   * negative when the window is moved backwards.
	   */

	  this.match_length = 0;      /* length of best match */
	  this.prev_match = 0;        /* previous match */
	  this.match_available = 0;   /* set if previous match exists */
	  this.strstart = 0;          /* start of string to insert */
	  this.match_start = 0;       /* start of matching string */
	  this.lookahead = 0;         /* number of valid bytes ahead in window */

	  this.prev_length = 0;
	  /* Length of the best match at previous step. Matches not greater than this
	   * are discarded. This is used in the lazy match evaluation.
	   */

	  this.max_chain_length = 0;
	  /* To speed up deflation, hash chains are never searched beyond this
	   * length.  A higher limit improves compression ratio but degrades the
	   * speed.
	   */

	  this.max_lazy_match = 0;
	  /* Attempt to find a better match only when the current match is strictly
	   * smaller than this value. This mechanism is used only for compression
	   * levels >= 4.
	   */
	  // That's alias to max_lazy_match, don't use directly
	  //this.max_insert_length = 0;
	  /* Insert new strings in the hash table only if the match length is not
	   * greater than this length. This saves time but degrades compression.
	   * max_insert_length is used only for compression levels <= 3.
	   */

	  this.level = 0;     /* compression level (1..9) */
	  this.strategy = 0;  /* favor or force Huffman coding*/

	  this.good_match = 0;
	  /* Use a faster search when the previous match is longer than this */

	  this.nice_match = 0; /* Stop searching when current match exceeds this */

	              /* used by trees.c: */

	  /* Didn't use ct_data typedef below to suppress compiler warning */

	  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
	  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
	  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

	  // Use flat array of DOUBLE size, with interleaved fata,
	  // because JS does not support effective
	  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
	  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
	  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
	  zero(this.dyn_ltree);
	  zero(this.dyn_dtree);
	  zero(this.bl_tree);

	  this.l_desc   = null;         /* desc. for literal tree */
	  this.d_desc   = null;         /* desc. for distance tree */
	  this.bl_desc  = null;         /* desc. for bit length tree */

	  //ush bl_count[MAX_BITS+1];
	  this.bl_count = new utils.Buf16(MAX_BITS + 1);
	  /* number of codes at each bit length for an optimal tree */

	  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
	  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
	  zero(this.heap);

	  this.heap_len = 0;               /* number of elements in the heap */
	  this.heap_max = 0;               /* element of largest frequency */
	  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
	   * The same heap array is used to build all trees.
	   */

	  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
	  zero(this.depth);
	  /* Depth of each subtree used as tie breaker for trees of equal frequency
	   */

	  this.l_buf = 0;          /* buffer index for literals or lengths */

	  this.lit_bufsize = 0;
	  /* Size of match buffer for literals/lengths.  There are 4 reasons for
	   * limiting lit_bufsize to 64K:
	   *   - frequencies can be kept in 16 bit counters
	   *   - if compression is not successful for the first block, all input
	   *     data is still in the window so we can still emit a stored block even
	   *     when input comes from standard input.  (This can also be done for
	   *     all blocks if lit_bufsize is not greater than 32K.)
	   *   - if compression is not successful for a file smaller than 64K, we can
	   *     even emit a stored file instead of a stored block (saving 5 bytes).
	   *     This is applicable only for zip (not gzip or zlib).
	   *   - creating new Huffman trees less frequently may not provide fast
	   *     adaptation to changes in the input data statistics. (Take for
	   *     example a binary file with poorly compressible code followed by
	   *     a highly compressible string table.) Smaller buffer sizes give
	   *     fast adaptation but have of course the overhead of transmitting
	   *     trees more frequently.
	   *   - I can't count above 4
	   */

	  this.last_lit = 0;      /* running index in l_buf */

	  this.d_buf = 0;
	  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
	   * the same number of elements. To use different lengths, an extra flag
	   * array would be necessary.
	   */

	  this.opt_len = 0;       /* bit length of current block with optimal trees */
	  this.static_len = 0;    /* bit length of current block with static trees */
	  this.matches = 0;       /* number of string matches in current block */
	  this.insert = 0;        /* bytes at end of window left to insert */


	  this.bi_buf = 0;
	  /* Output buffer. bits are inserted starting at the bottom (least
	   * significant bits).
	   */
	  this.bi_valid = 0;
	  /* Number of valid bits in bi_buf.  All bits above the last valid bit
	   * are always zero.
	   */

	  // Used for window memory init. We safely ignore it for JS. That makes
	  // sense only for pointers and memory check tools.
	  //this.high_water = 0;
	  /* High water mark offset in window for initialized bytes -- bytes above
	   * this are set to zero in order to avoid memory check warnings when
	   * longest match routines access bytes past the input.  This is then
	   * updated to the new high water mark.
	   */
	}


	function deflateResetKeep(strm) {
	  var s;

	  if (!strm || !strm.state) {
	    return err(strm, Z_STREAM_ERROR);
	  }

	  strm.total_in = strm.total_out = 0;
	  strm.data_type = Z_UNKNOWN;

	  s = strm.state;
	  s.pending = 0;
	  s.pending_out = 0;

	  if (s.wrap < 0) {
	    s.wrap = -s.wrap;
	    /* was made negative by deflate(..., Z_FINISH); */
	  }
	  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
	  strm.adler = (s.wrap === 2) ?
	    0  // crc32(0, Z_NULL, 0)
	  :
	    1; // adler32(0, Z_NULL, 0)
	  s.last_flush = Z_NO_FLUSH;
	  trees._tr_init(s);
	  return Z_OK;
	}


	function deflateReset(strm) {
	  var ret = deflateResetKeep(strm);
	  if (ret === Z_OK) {
	    lm_init(strm.state);
	  }
	  return ret;
	}


	function deflateSetHeader(strm, head) {
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
	  strm.state.gzhead = head;
	  return Z_OK;
	}


	function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
	  if (!strm) { // === Z_NULL
	    return Z_STREAM_ERROR;
	  }
	  var wrap = 1;

	  if (level === Z_DEFAULT_COMPRESSION) {
	    level = 6;
	  }

	  if (windowBits < 0) { /* suppress zlib wrapper */
	    wrap = 0;
	    windowBits = -windowBits;
	  }

	  else if (windowBits > 15) {
	    wrap = 2;           /* write gzip wrapper instead */
	    windowBits -= 16;
	  }


	  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
	    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
	    strategy < 0 || strategy > Z_FIXED) {
	    return err(strm, Z_STREAM_ERROR);
	  }


	  if (windowBits === 8) {
	    windowBits = 9;
	  }
	  /* until 256-byte window bug fixed */

	  var s = new DeflateState();

	  strm.state = s;
	  s.strm = strm;

	  s.wrap = wrap;
	  s.gzhead = null;
	  s.w_bits = windowBits;
	  s.w_size = 1 << s.w_bits;
	  s.w_mask = s.w_size - 1;

	  s.hash_bits = memLevel + 7;
	  s.hash_size = 1 << s.hash_bits;
	  s.hash_mask = s.hash_size - 1;
	  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

	  s.window = new utils.Buf8(s.w_size * 2);
	  s.head = new utils.Buf16(s.hash_size);
	  s.prev = new utils.Buf16(s.w_size);

	  // Don't need mem init magic for JS.
	  //s.high_water = 0;  /* nothing written to s->window yet */

	  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

	  s.pending_buf_size = s.lit_bufsize * 4;

	  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
	  //s->pending_buf = (uchf *) overlay;
	  s.pending_buf = new utils.Buf8(s.pending_buf_size);

	  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
	  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
	  s.d_buf = 1 * s.lit_bufsize;

	  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
	  s.l_buf = (1 + 2) * s.lit_bufsize;

	  s.level = level;
	  s.strategy = strategy;
	  s.method = method;

	  return deflateReset(strm);
	}

	function deflateInit(strm, level) {
	  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
	}


	function deflate(strm, flush) {
	  var old_flush, s;
	  var beg, val; // for gzip header write only

	  if (!strm || !strm.state ||
	    flush > Z_BLOCK || flush < 0) {
	    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
	  }

	  s = strm.state;

	  if (!strm.output ||
	      (!strm.input && strm.avail_in !== 0) ||
	      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
	    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
	  }

	  s.strm = strm; /* just in case */
	  old_flush = s.last_flush;
	  s.last_flush = flush;

	  /* Write the header */
	  if (s.status === INIT_STATE) {

	    if (s.wrap === 2) { // GZIP header
	      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
	      put_byte(s, 31);
	      put_byte(s, 139);
	      put_byte(s, 8);
	      if (!s.gzhead) { // s->gzhead == Z_NULL
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, s.level === 9 ? 2 :
	                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
	                     4 : 0));
	        put_byte(s, OS_CODE);
	        s.status = BUSY_STATE;
	      }
	      else {
	        put_byte(s, (s.gzhead.text ? 1 : 0) +
	                    (s.gzhead.hcrc ? 2 : 0) +
	                    (!s.gzhead.extra ? 0 : 4) +
	                    (!s.gzhead.name ? 0 : 8) +
	                    (!s.gzhead.comment ? 0 : 16)
	                );
	        put_byte(s, s.gzhead.time & 0xff);
	        put_byte(s, (s.gzhead.time >> 8) & 0xff);
	        put_byte(s, (s.gzhead.time >> 16) & 0xff);
	        put_byte(s, (s.gzhead.time >> 24) & 0xff);
	        put_byte(s, s.level === 9 ? 2 :
	                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
	                     4 : 0));
	        put_byte(s, s.gzhead.os & 0xff);
	        if (s.gzhead.extra && s.gzhead.extra.length) {
	          put_byte(s, s.gzhead.extra.length & 0xff);
	          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
	        }
	        if (s.gzhead.hcrc) {
	          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
	        }
	        s.gzindex = 0;
	        s.status = EXTRA_STATE;
	      }
	    }
	    else // DEFLATE header
	    {
	      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
	      var level_flags = -1;

	      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
	        level_flags = 0;
	      } else if (s.level < 6) {
	        level_flags = 1;
	      } else if (s.level === 6) {
	        level_flags = 2;
	      } else {
	        level_flags = 3;
	      }
	      header |= (level_flags << 6);
	      if (s.strstart !== 0) { header |= PRESET_DICT; }
	      header += 31 - (header % 31);

	      s.status = BUSY_STATE;
	      putShortMSB(s, header);

	      /* Save the adler32 of the preset dictionary: */
	      if (s.strstart !== 0) {
	        putShortMSB(s, strm.adler >>> 16);
	        putShortMSB(s, strm.adler & 0xffff);
	      }
	      strm.adler = 1; // adler32(0L, Z_NULL, 0);
	    }
	  }

	//#ifdef GZIP
	  if (s.status === EXTRA_STATE) {
	    if (s.gzhead.extra/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */

	      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            break;
	          }
	        }
	        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
	        s.gzindex++;
	      }
	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (s.gzindex === s.gzhead.extra.length) {
	        s.gzindex = 0;
	        s.status = NAME_STATE;
	      }
	    }
	    else {
	      s.status = NAME_STATE;
	    }
	  }
	  if (s.status === NAME_STATE) {
	    if (s.gzhead.name/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	      //int val;

	      do {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            val = 1;
	            break;
	          }
	        }
	        // JS specific: little magic to add zero terminator to end of string
	        if (s.gzindex < s.gzhead.name.length) {
	          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
	        } else {
	          val = 0;
	        }
	        put_byte(s, val);
	      } while (val !== 0);

	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (val === 0) {
	        s.gzindex = 0;
	        s.status = COMMENT_STATE;
	      }
	    }
	    else {
	      s.status = COMMENT_STATE;
	    }
	  }
	  if (s.status === COMMENT_STATE) {
	    if (s.gzhead.comment/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	      //int val;

	      do {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            val = 1;
	            break;
	          }
	        }
	        // JS specific: little magic to add zero terminator to end of string
	        if (s.gzindex < s.gzhead.comment.length) {
	          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
	        } else {
	          val = 0;
	        }
	        put_byte(s, val);
	      } while (val !== 0);

	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (val === 0) {
	        s.status = HCRC_STATE;
	      }
	    }
	    else {
	      s.status = HCRC_STATE;
	    }
	  }
	  if (s.status === HCRC_STATE) {
	    if (s.gzhead.hcrc) {
	      if (s.pending + 2 > s.pending_buf_size) {
	        flush_pending(strm);
	      }
	      if (s.pending + 2 <= s.pending_buf_size) {
	        put_byte(s, strm.adler & 0xff);
	        put_byte(s, (strm.adler >> 8) & 0xff);
	        strm.adler = 0; //crc32(0L, Z_NULL, 0);
	        s.status = BUSY_STATE;
	      }
	    }
	    else {
	      s.status = BUSY_STATE;
	    }
	  }
	//#endif

	  /* Flush as much pending output as possible */
	  if (s.pending !== 0) {
	    flush_pending(strm);
	    if (strm.avail_out === 0) {
	      /* Since avail_out is 0, deflate will be called again with
	       * more output space, but possibly with both pending and
	       * avail_in equal to zero. There won't be anything to do,
	       * but this is not an error situation so make sure we
	       * return OK instead of BUF_ERROR at next call of deflate:
	       */
	      s.last_flush = -1;
	      return Z_OK;
	    }

	    /* Make sure there is something to do and avoid duplicate consecutive
	     * flushes. For repeated and useless calls with Z_FINISH, we keep
	     * returning Z_STREAM_END instead of Z_BUF_ERROR.
	     */
	  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
	    flush !== Z_FINISH) {
	    return err(strm, Z_BUF_ERROR);
	  }

	  /* User must not provide more input after the first FINISH: */
	  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
	    return err(strm, Z_BUF_ERROR);
	  }

	  /* Start a new block or continue the current one.
	   */
	  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
	    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
	    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
	      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
	        configuration_table[s.level].func(s, flush));

	    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
	      s.status = FINISH_STATE;
	    }
	    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
	      if (strm.avail_out === 0) {
	        s.last_flush = -1;
	        /* avoid BUF_ERROR next call, see above */
	      }
	      return Z_OK;
	      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
	       * of deflate should use the same flush parameter to make sure
	       * that the flush is complete. So we don't have to output an
	       * empty block here, this will be done at next call. This also
	       * ensures that for a very small output buffer, we emit at most
	       * one empty block.
	       */
	    }
	    if (bstate === BS_BLOCK_DONE) {
	      if (flush === Z_PARTIAL_FLUSH) {
	        trees._tr_align(s);
	      }
	      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

	        trees._tr_stored_block(s, 0, 0, false);
	        /* For a full flush, this empty block will be recognized
	         * as a special marker by inflate_sync().
	         */
	        if (flush === Z_FULL_FLUSH) {
	          /*** CLEAR_HASH(s); ***/             /* forget history */
	          zero(s.head); // Fill with NIL (= 0);

	          if (s.lookahead === 0) {
	            s.strstart = 0;
	            s.block_start = 0;
	            s.insert = 0;
	          }
	        }
	      }
	      flush_pending(strm);
	      if (strm.avail_out === 0) {
	        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
	        return Z_OK;
	      }
	    }
	  }
	  //Assert(strm->avail_out > 0, "bug2");
	  //if (strm.avail_out <= 0) { throw new Error("bug2");}

	  if (flush !== Z_FINISH) { return Z_OK; }
	  if (s.wrap <= 0) { return Z_STREAM_END; }

	  /* Write the trailer */
	  if (s.wrap === 2) {
	    put_byte(s, strm.adler & 0xff);
	    put_byte(s, (strm.adler >> 8) & 0xff);
	    put_byte(s, (strm.adler >> 16) & 0xff);
	    put_byte(s, (strm.adler >> 24) & 0xff);
	    put_byte(s, strm.total_in & 0xff);
	    put_byte(s, (strm.total_in >> 8) & 0xff);
	    put_byte(s, (strm.total_in >> 16) & 0xff);
	    put_byte(s, (strm.total_in >> 24) & 0xff);
	  }
	  else
	  {
	    putShortMSB(s, strm.adler >>> 16);
	    putShortMSB(s, strm.adler & 0xffff);
	  }

	  flush_pending(strm);
	  /* If avail_out is zero, the application will call deflate again
	   * to flush the rest.
	   */
	  if (s.wrap > 0) { s.wrap = -s.wrap; }
	  /* write the trailer only once! */
	  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
	}

	function deflateEnd(strm) {
	  var status;

	  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
	    return Z_STREAM_ERROR;
	  }

	  status = strm.state.status;
	  if (status !== INIT_STATE &&
	    status !== EXTRA_STATE &&
	    status !== NAME_STATE &&
	    status !== COMMENT_STATE &&
	    status !== HCRC_STATE &&
	    status !== BUSY_STATE &&
	    status !== FINISH_STATE
	  ) {
	    return err(strm, Z_STREAM_ERROR);
	  }

	  strm.state = null;

	  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
	}


	/* =========================================================================
	 * Initializes the compression dictionary from the given byte
	 * sequence without producing any compressed output.
	 */
	function deflateSetDictionary(strm, dictionary) {
	  var dictLength = dictionary.length;

	  var s;
	  var str, n;
	  var wrap;
	  var avail;
	  var next;
	  var input;
	  var tmpDict;

	  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
	    return Z_STREAM_ERROR;
	  }

	  s = strm.state;
	  wrap = s.wrap;

	  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
	    return Z_STREAM_ERROR;
	  }

	  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
	  if (wrap === 1) {
	    /* adler32(strm->adler, dictionary, dictLength); */
	    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
	  }

	  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

	  /* if dictionary would fill window, just replace the history */
	  if (dictLength >= s.w_size) {
	    if (wrap === 0) {            /* already empty otherwise */
	      /*** CLEAR_HASH(s); ***/
	      zero(s.head); // Fill with NIL (= 0);
	      s.strstart = 0;
	      s.block_start = 0;
	      s.insert = 0;
	    }
	    /* use the tail */
	    // dictionary = dictionary.slice(dictLength - s.w_size);
	    tmpDict = new utils.Buf8(s.w_size);
	    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
	    dictionary = tmpDict;
	    dictLength = s.w_size;
	  }
	  /* insert dictionary into window and hash */
	  avail = strm.avail_in;
	  next = strm.next_in;
	  input = strm.input;
	  strm.avail_in = dictLength;
	  strm.next_in = 0;
	  strm.input = dictionary;
	  fill_window(s);
	  while (s.lookahead >= MIN_MATCH) {
	    str = s.strstart;
	    n = s.lookahead - (MIN_MATCH - 1);
	    do {
	      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

	      s.prev[str & s.w_mask] = s.head[s.ins_h];

	      s.head[s.ins_h] = str;
	      str++;
	    } while (--n);
	    s.strstart = str;
	    s.lookahead = MIN_MATCH - 1;
	    fill_window(s);
	  }
	  s.strstart += s.lookahead;
	  s.block_start = s.strstart;
	  s.insert = s.lookahead;
	  s.lookahead = 0;
	  s.match_length = s.prev_length = MIN_MATCH - 1;
	  s.match_available = 0;
	  strm.next_in = next;
	  strm.input = input;
	  strm.avail_in = avail;
	  s.wrap = wrap;
	  return Z_OK;
	}


	exports.deflateInit = deflateInit;
	exports.deflateInit2 = deflateInit2;
	exports.deflateReset = deflateReset;
	exports.deflateResetKeep = deflateResetKeep;
	exports.deflateSetHeader = deflateSetHeader;
	exports.deflate = deflate;
	exports.deflateEnd = deflateEnd;
	exports.deflateSetDictionary = deflateSetDictionary;
	exports.deflateInfo = 'pako deflate (from Nodeca project)';

	/* Not implemented
	exports.deflateBound = deflateBound;
	exports.deflateCopy = deflateCopy;
	exports.deflateParams = deflateParams;
	exports.deflatePending = deflatePending;
	exports.deflatePrime = deflatePrime;
	exports.deflateTune = deflateTune;
	*/

	},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	function GZheader() {
	  /* true if compressed data believed to be text */
	  this.text       = 0;
	  /* modification time */
	  this.time       = 0;
	  /* extra flags (not used when writing a gzip file) */
	  this.xflags     = 0;
	  /* operating system */
	  this.os         = 0;
	  /* pointer to extra field or Z_NULL if none */
	  this.extra      = null;
	  /* extra field length (valid if extra != Z_NULL) */
	  this.extra_len  = 0; // Actually, we don't need it in JS,
	                       // but leave for few code modifications

	  //
	  // Setup limits is not necessary because in js we should not preallocate memory
	  // for inflate use constant limit in 65536 bytes
	  //

	  /* space at extra (only when reading header) */
	  // this.extra_max  = 0;
	  /* pointer to zero-terminated file name or Z_NULL */
	  this.name       = '';
	  /* space at name (only when reading header) */
	  // this.name_max   = 0;
	  /* pointer to zero-terminated comment or Z_NULL */
	  this.comment    = '';
	  /* space at comment (only when reading header) */
	  // this.comm_max   = 0;
	  /* true if there was or will be a header crc */
	  this.hcrc       = 0;
	  /* true when done reading gzip header (not used when writing a gzip file) */
	  this.done       = false;
	}

	module.exports = GZheader;

	},{}],48:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	// See state defs from inflate.js
	var BAD = 30;       /* got a data error -- remain here until reset */
	var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

	/*
	   Decode literal, length, and distance codes and write out the resulting
	   literal and match bytes until either not enough input or output is
	   available, an end-of-block is encountered, or a data error is encountered.
	   When large enough input and output buffers are supplied to inflate(), for
	   example, a 16K input buffer and a 64K output buffer, more than 95% of the
	   inflate execution time is spent in this routine.

	   Entry assumptions:

	        state.mode === LEN
	        strm.avail_in >= 6
	        strm.avail_out >= 258
	        start >= strm.avail_out
	        state.bits < 8

	   On return, state.mode is one of:

	        LEN -- ran out of enough output space or enough available input
	        TYPE -- reached end of block code, inflate() to interpret next block
	        BAD -- error in block data

	   Notes:

	    - The maximum input bits used by a length/distance pair is 15 bits for the
	      length code, 5 bits for the length extra, 15 bits for the distance code,
	      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
	      Therefore if strm.avail_in >= 6, then there is enough input to avoid
	      checking for available input while decoding.

	    - The maximum bytes that a single length/distance pair can output is 258
	      bytes, which is the maximum length that can be coded.  inflate_fast()
	      requires strm.avail_out >= 258 for each loop to avoid checking for
	      output space.
	 */
	module.exports = function inflate_fast(strm, start) {
	  var state;
	  var _in;                    /* local strm.input */
	  var last;                   /* have enough input while in < last */
	  var _out;                   /* local strm.output */
	  var beg;                    /* inflate()'s initial strm.output */
	  var end;                    /* while out < end, enough space available */
	//#ifdef INFLATE_STRICT
	  var dmax;                   /* maximum distance from zlib header */
	//#endif
	  var wsize;                  /* window size or zero if not using window */
	  var whave;                  /* valid bytes in the window */
	  var wnext;                  /* window write index */
	  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
	  var s_window;               /* allocated sliding window, if wsize != 0 */
	  var hold;                   /* local strm.hold */
	  var bits;                   /* local strm.bits */
	  var lcode;                  /* local strm.lencode */
	  var dcode;                  /* local strm.distcode */
	  var lmask;                  /* mask for first level of length codes */
	  var dmask;                  /* mask for first level of distance codes */
	  var here;                   /* retrieved table entry */
	  var op;                     /* code bits, operation, extra bits, or */
	                              /*  window position, window bytes to copy */
	  var len;                    /* match length, unused bytes */
	  var dist;                   /* match distance */
	  var from;                   /* where to copy match from */
	  var from_source;


	  var input, output; // JS specific, because we have no pointers

	  /* copy state to local variables */
	  state = strm.state;
	  //here = state.here;
	  _in = strm.next_in;
	  input = strm.input;
	  last = _in + (strm.avail_in - 5);
	  _out = strm.next_out;
	  output = strm.output;
	  beg = _out - (start - strm.avail_out);
	  end = _out + (strm.avail_out - 257);
	//#ifdef INFLATE_STRICT
	  dmax = state.dmax;
	//#endif
	  wsize = state.wsize;
	  whave = state.whave;
	  wnext = state.wnext;
	  s_window = state.window;
	  hold = state.hold;
	  bits = state.bits;
	  lcode = state.lencode;
	  dcode = state.distcode;
	  lmask = (1 << state.lenbits) - 1;
	  dmask = (1 << state.distbits) - 1;


	  /* decode literals and length/distances until end-of-block or not enough
	     input data or output space */

	  top:
	  do {
	    if (bits < 15) {
	      hold += input[_in++] << bits;
	      bits += 8;
	      hold += input[_in++] << bits;
	      bits += 8;
	    }

	    here = lcode[hold & lmask];

	    dolen:
	    for (;;) { // Goto emulation
	      op = here >>> 24/*here.bits*/;
	      hold >>>= op;
	      bits -= op;
	      op = (here >>> 16) & 0xff/*here.op*/;
	      if (op === 0) {                          /* literal */
	        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
	        //        "inflate:         literal '%c'\n" :
	        //        "inflate:         literal 0x%02x\n", here.val));
	        output[_out++] = here & 0xffff/*here.val*/;
	      }
	      else if (op & 16) {                     /* length base */
	        len = here & 0xffff/*here.val*/;
	        op &= 15;                           /* number of extra bits */
	        if (op) {
	          if (bits < op) {
	            hold += input[_in++] << bits;
	            bits += 8;
	          }
	          len += hold & ((1 << op) - 1);
	          hold >>>= op;
	          bits -= op;
	        }
	        //Tracevv((stderr, "inflate:         length %u\n", len));
	        if (bits < 15) {
	          hold += input[_in++] << bits;
	          bits += 8;
	          hold += input[_in++] << bits;
	          bits += 8;
	        }
	        here = dcode[hold & dmask];

	        dodist:
	        for (;;) { // goto emulation
	          op = here >>> 24/*here.bits*/;
	          hold >>>= op;
	          bits -= op;
	          op = (here >>> 16) & 0xff/*here.op*/;

	          if (op & 16) {                      /* distance base */
	            dist = here & 0xffff/*here.val*/;
	            op &= 15;                       /* number of extra bits */
	            if (bits < op) {
	              hold += input[_in++] << bits;
	              bits += 8;
	              if (bits < op) {
	                hold += input[_in++] << bits;
	                bits += 8;
	              }
	            }
	            dist += hold & ((1 << op) - 1);
	//#ifdef INFLATE_STRICT
	            if (dist > dmax) {
	              strm.msg = 'invalid distance too far back';
	              state.mode = BAD;
	              break top;
	            }
	//#endif
	            hold >>>= op;
	            bits -= op;
	            //Tracevv((stderr, "inflate:         distance %u\n", dist));
	            op = _out - beg;                /* max distance in output */
	            if (dist > op) {                /* see if copy from window */
	              op = dist - op;               /* distance back in window */
	              if (op > whave) {
	                if (state.sane) {
	                  strm.msg = 'invalid distance too far back';
	                  state.mode = BAD;
	                  break top;
	                }

	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility
	//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
	//                if (len <= op - whave) {
	//                  do {
	//                    output[_out++] = 0;
	//                  } while (--len);
	//                  continue top;
	//                }
	//                len -= op - whave;
	//                do {
	//                  output[_out++] = 0;
	//                } while (--op > whave);
	//                if (op === 0) {
	//                  from = _out - dist;
	//                  do {
	//                    output[_out++] = output[from++];
	//                  } while (--len);
	//                  continue top;
	//                }
	//#endif
	              }
	              from = 0; // window index
	              from_source = s_window;
	              if (wnext === 0) {           /* very common case */
	                from += wsize - op;
	                if (op < len) {         /* some from window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = _out - dist;  /* rest from output */
	                  from_source = output;
	                }
	              }
	              else if (wnext < op) {      /* wrap around window */
	                from += wsize + wnext - op;
	                op -= wnext;
	                if (op < len) {         /* some from end of window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = 0;
	                  if (wnext < len) {  /* some from start of window */
	                    op = wnext;
	                    len -= op;
	                    do {
	                      output[_out++] = s_window[from++];
	                    } while (--op);
	                    from = _out - dist;      /* rest from output */
	                    from_source = output;
	                  }
	                }
	              }
	              else {                      /* contiguous in window */
	                from += wnext - op;
	                if (op < len) {         /* some from window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = _out - dist;  /* rest from output */
	                  from_source = output;
	                }
	              }
	              while (len > 2) {
	                output[_out++] = from_source[from++];
	                output[_out++] = from_source[from++];
	                output[_out++] = from_source[from++];
	                len -= 3;
	              }
	              if (len) {
	                output[_out++] = from_source[from++];
	                if (len > 1) {
	                  output[_out++] = from_source[from++];
	                }
	              }
	            }
	            else {
	              from = _out - dist;          /* copy direct from output */
	              do {                        /* minimum length is three */
	                output[_out++] = output[from++];
	                output[_out++] = output[from++];
	                output[_out++] = output[from++];
	                len -= 3;
	              } while (len > 2);
	              if (len) {
	                output[_out++] = output[from++];
	                if (len > 1) {
	                  output[_out++] = output[from++];
	                }
	              }
	            }
	          }
	          else if ((op & 64) === 0) {          /* 2nd level distance code */
	            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
	            continue dodist;
	          }
	          else {
	            strm.msg = 'invalid distance code';
	            state.mode = BAD;
	            break top;
	          }

	          break; // need to emulate goto via "continue"
	        }
	      }
	      else if ((op & 64) === 0) {              /* 2nd level length code */
	        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
	        continue dolen;
	      }
	      else if (op & 32) {                     /* end-of-block */
	        //Tracevv((stderr, "inflate:         end of block\n"));
	        state.mode = TYPE;
	        break top;
	      }
	      else {
	        strm.msg = 'invalid literal/length code';
	        state.mode = BAD;
	        break top;
	      }

	      break; // need to emulate goto via "continue"
	    }
	  } while (_in < last && _out < end);

	  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
	  len = bits >> 3;
	  _in -= len;
	  bits -= len << 3;
	  hold &= (1 << bits) - 1;

	  /* update state and return */
	  strm.next_in = _in;
	  strm.next_out = _out;
	  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
	  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
	  state.hold = hold;
	  state.bits = bits;
	  return;
	};

	},{}],49:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils         = require('../utils/common');
	var adler32       = require('./adler32');
	var crc32         = require('./crc32');
	var inflate_fast  = require('./inffast');
	var inflate_table = require('./inftrees');

	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;

	/* Public constants ==========================================================*/
	/* ===========================================================================*/


	/* Allowed flush values; see deflate() and inflate() below for details */
	//var Z_NO_FLUSH      = 0;
	//var Z_PARTIAL_FLUSH = 1;
	//var Z_SYNC_FLUSH    = 2;
	//var Z_FULL_FLUSH    = 3;
	var Z_FINISH        = 4;
	var Z_BLOCK         = 5;
	var Z_TREES         = 6;


	/* Return codes for the compression/decompression functions. Negative values
	 * are errors, positive values are used for special but normal events.
	 */
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	var Z_NEED_DICT     = 2;
	//var Z_ERRNO         = -1;
	var Z_STREAM_ERROR  = -2;
	var Z_DATA_ERROR    = -3;
	var Z_MEM_ERROR     = -4;
	var Z_BUF_ERROR     = -5;
	//var Z_VERSION_ERROR = -6;

	/* The deflate compression method */
	var Z_DEFLATED  = 8;


	/* STATES ====================================================================*/
	/* ===========================================================================*/


	var    HEAD = 1;       /* i: waiting for magic header */
	var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
	var    TIME = 3;       /* i: waiting for modification time (gzip) */
	var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
	var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
	var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
	var    NAME = 7;       /* i: waiting for end of file name (gzip) */
	var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
	var    HCRC = 9;       /* i: waiting for header crc (gzip) */
	var    DICTID = 10;    /* i: waiting for dictionary check value */
	var    DICT = 11;      /* waiting for inflateSetDictionary() call */
	var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
	var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
	var        STORED = 14;    /* i: waiting for stored size (length and complement) */
	var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
	var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
	var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
	var        LENLENS = 18;   /* i: waiting for code length code lengths */
	var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
	var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
	var            LEN = 21;       /* i: waiting for length/lit/eob code */
	var            LENEXT = 22;    /* i: waiting for length extra bits */
	var            DIST = 23;      /* i: waiting for distance code */
	var            DISTEXT = 24;   /* i: waiting for distance extra bits */
	var            MATCH = 25;     /* o: waiting for output space to copy string */
	var            LIT = 26;       /* o: waiting for output space to write literal */
	var    CHECK = 27;     /* i: waiting for 32-bit check value */
	var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
	var    DONE = 29;      /* finished check, done -- remain here until reset */
	var    BAD = 30;       /* got a data error -- remain here until reset */
	var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
	var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

	/* ===========================================================================*/



	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

	var MAX_WBITS = 15;
	/* 32K LZ77 window */
	var DEF_WBITS = MAX_WBITS;


	function zswap32(q) {
	  return  (((q >>> 24) & 0xff) +
	          ((q >>> 8) & 0xff00) +
	          ((q & 0xff00) << 8) +
	          ((q & 0xff) << 24));
	}


	function InflateState() {
	  this.mode = 0;             /* current inflate mode */
	  this.last = false;          /* true if processing last block */
	  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
	  this.havedict = false;      /* true if dictionary provided */
	  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
	  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
	  this.check = 0;             /* protected copy of check value */
	  this.total = 0;             /* protected copy of output count */
	  // TODO: may be {}
	  this.head = null;           /* where to save gzip header information */

	  /* sliding window */
	  this.wbits = 0;             /* log base 2 of requested window size */
	  this.wsize = 0;             /* window size or zero if not using window */
	  this.whave = 0;             /* valid bytes in the window */
	  this.wnext = 0;             /* window write index */
	  this.window = null;         /* allocated sliding window, if needed */

	  /* bit accumulator */
	  this.hold = 0;              /* input bit accumulator */
	  this.bits = 0;              /* number of bits in "in" */

	  /* for string and stored block copying */
	  this.length = 0;            /* literal or length of data to copy */
	  this.offset = 0;            /* distance back to copy string from */

	  /* for table and code decoding */
	  this.extra = 0;             /* extra bits needed */

	  /* fixed and dynamic code tables */
	  this.lencode = null;          /* starting table for length/literal codes */
	  this.distcode = null;         /* starting table for distance codes */
	  this.lenbits = 0;           /* index bits for lencode */
	  this.distbits = 0;          /* index bits for distcode */

	  /* dynamic table building */
	  this.ncode = 0;             /* number of code length code lengths */
	  this.nlen = 0;              /* number of length code lengths */
	  this.ndist = 0;             /* number of distance code lengths */
	  this.have = 0;              /* number of code lengths in lens[] */
	  this.next = null;              /* next available space in codes[] */

	  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
	  this.work = new utils.Buf16(288); /* work area for code table building */

	  /*
	   because we don't have pointers in js, we use lencode and distcode directly
	   as buffers so we don't need codes
	  */
	  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
	  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
	  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
	  this.sane = 0;                   /* if false, allow invalid distance too far */
	  this.back = 0;                   /* bits back of last unprocessed length/lit */
	  this.was = 0;                    /* initial length of match */
	}

	function inflateResetKeep(strm) {
	  var state;

	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  strm.total_in = strm.total_out = state.total = 0;
	  strm.msg = ''; /*Z_NULL*/
	  if (state.wrap) {       /* to support ill-conceived Java test suite */
	    strm.adler = state.wrap & 1;
	  }
	  state.mode = HEAD;
	  state.last = 0;
	  state.havedict = 0;
	  state.dmax = 32768;
	  state.head = null/*Z_NULL*/;
	  state.hold = 0;
	  state.bits = 0;
	  //state.lencode = state.distcode = state.next = state.codes;
	  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
	  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

	  state.sane = 1;
	  state.back = -1;
	  //Tracev((stderr, "inflate: reset\n"));
	  return Z_OK;
	}

	function inflateReset(strm) {
	  var state;

	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  state.wsize = 0;
	  state.whave = 0;
	  state.wnext = 0;
	  return inflateResetKeep(strm);

	}

	function inflateReset2(strm, windowBits) {
	  var wrap;
	  var state;

	  /* get the state */
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;

	  /* extract wrap request from windowBits parameter */
	  if (windowBits < 0) {
	    wrap = 0;
	    windowBits = -windowBits;
	  }
	  else {
	    wrap = (windowBits >> 4) + 1;
	    if (windowBits < 48) {
	      windowBits &= 15;
	    }
	  }

	  /* set number of window bits, free window if different */
	  if (windowBits && (windowBits < 8 || windowBits > 15)) {
	    return Z_STREAM_ERROR;
	  }
	  if (state.window !== null && state.wbits !== windowBits) {
	    state.window = null;
	  }

	  /* update state and reset the rest of it */
	  state.wrap = wrap;
	  state.wbits = windowBits;
	  return inflateReset(strm);
	}

	function inflateInit2(strm, windowBits) {
	  var ret;
	  var state;

	  if (!strm) { return Z_STREAM_ERROR; }
	  //strm.msg = Z_NULL;                 /* in case we return an error */

	  state = new InflateState();

	  //if (state === Z_NULL) return Z_MEM_ERROR;
	  //Tracev((stderr, "inflate: allocated\n"));
	  strm.state = state;
	  state.window = null/*Z_NULL*/;
	  ret = inflateReset2(strm, windowBits);
	  if (ret !== Z_OK) {
	    strm.state = null/*Z_NULL*/;
	  }
	  return ret;
	}

	function inflateInit(strm) {
	  return inflateInit2(strm, DEF_WBITS);
	}


	/*
	 Return state with length and distance decoding tables and index sizes set to
	 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
	 If BUILDFIXED is defined, then instead this routine builds the tables the
	 first time it's called, and returns those tables the first time and
	 thereafter.  This reduces the size of the code by about 2K bytes, in
	 exchange for a little execution time.  However, BUILDFIXED should not be
	 used for threaded applications, since the rewriting of the tables and virgin
	 may not be thread-safe.
	 */
	var virgin = true;

	var lenfix, distfix; // We have no pointers in JS, so keep tables separate

	function fixedtables(state) {
	  /* build fixed huffman tables if first call (may not be thread safe) */
	  if (virgin) {
	    var sym;

	    lenfix = new utils.Buf32(512);
	    distfix = new utils.Buf32(32);

	    /* literal/length table */
	    sym = 0;
	    while (sym < 144) { state.lens[sym++] = 8; }
	    while (sym < 256) { state.lens[sym++] = 9; }
	    while (sym < 280) { state.lens[sym++] = 7; }
	    while (sym < 288) { state.lens[sym++] = 8; }

	    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

	    /* distance table */
	    sym = 0;
	    while (sym < 32) { state.lens[sym++] = 5; }

	    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

	    /* do this just once */
	    virgin = false;
	  }

	  state.lencode = lenfix;
	  state.lenbits = 9;
	  state.distcode = distfix;
	  state.distbits = 5;
	}


	/*
	 Update the window with the last wsize (normally 32K) bytes written before
	 returning.  If window does not exist yet, create it.  This is only called
	 when a window is already in use, or when output has been written during this
	 inflate call, but the end of the deflate stream has not been reached yet.
	 It is also called to create a window for dictionary data when a dictionary
	 is loaded.

	 Providing output buffers larger than 32K to inflate() should provide a speed
	 advantage, since only the last 32K of output is copied to the sliding window
	 upon return from inflate(), and since all distances after the first 32K of
	 output will fall in the output data, making match copies simpler and faster.
	 The advantage may be dependent on the size of the processor's data caches.
	 */
	function updatewindow(strm, src, end, copy) {
	  var dist;
	  var state = strm.state;

	  /* if it hasn't been done already, allocate space for the window */
	  if (state.window === null) {
	    state.wsize = 1 << state.wbits;
	    state.wnext = 0;
	    state.whave = 0;

	    state.window = new utils.Buf8(state.wsize);
	  }

	  /* copy state->wsize or less output bytes into the circular window */
	  if (copy >= state.wsize) {
	    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
	    state.wnext = 0;
	    state.whave = state.wsize;
	  }
	  else {
	    dist = state.wsize - state.wnext;
	    if (dist > copy) {
	      dist = copy;
	    }
	    //zmemcpy(state->window + state->wnext, end - copy, dist);
	    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
	    copy -= dist;
	    if (copy) {
	      //zmemcpy(state->window, end - copy, copy);
	      utils.arraySet(state.window, src, end - copy, copy, 0);
	      state.wnext = copy;
	      state.whave = state.wsize;
	    }
	    else {
	      state.wnext += dist;
	      if (state.wnext === state.wsize) { state.wnext = 0; }
	      if (state.whave < state.wsize) { state.whave += dist; }
	    }
	  }
	  return 0;
	}

	function inflate(strm, flush) {
	  var state;
	  var input, output;          // input/output buffers
	  var next;                   /* next input INDEX */
	  var put;                    /* next output INDEX */
	  var have, left;             /* available input and output */
	  var hold;                   /* bit buffer */
	  var bits;                   /* bits in bit buffer */
	  var _in, _out;              /* save starting available input and output */
	  var copy;                   /* number of stored or match bytes to copy */
	  var from;                   /* where to copy match bytes from */
	  var from_source;
	  var here = 0;               /* current decoding table entry */
	  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
	  //var last;                   /* parent table entry */
	  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
	  var len;                    /* length to copy for repeats, bits to drop */
	  var ret;                    /* return code */
	  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
	  var opts;

	  var n; // temporary var for NEED_BITS

	  var order = /* permutation of code lengths */
	    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


	  if (!strm || !strm.state || !strm.output ||
	      (!strm.input && strm.avail_in !== 0)) {
	    return Z_STREAM_ERROR;
	  }

	  state = strm.state;
	  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


	  //--- LOAD() ---
	  put = strm.next_out;
	  output = strm.output;
	  left = strm.avail_out;
	  next = strm.next_in;
	  input = strm.input;
	  have = strm.avail_in;
	  hold = state.hold;
	  bits = state.bits;
	  //---

	  _in = have;
	  _out = left;
	  ret = Z_OK;

	  inf_leave: // goto emulation
	  for (;;) {
	    switch (state.mode) {
	    case HEAD:
	      if (state.wrap === 0) {
	        state.mode = TYPEDO;
	        break;
	      }
	      //=== NEEDBITS(16);
	      while (bits < 16) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
	        state.check = 0/*crc32(0L, Z_NULL, 0)*/;
	        //=== CRC2(state.check, hold);
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        state.check = crc32(state.check, hbuf, 2, 0);
	        //===//

	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = FLAGS;
	        break;
	      }
	      state.flags = 0;           /* expect zlib header */
	      if (state.head) {
	        state.head.done = false;
	      }
	      if (!(state.wrap & 1) ||   /* check if zlib header allowed */
	        (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
	        strm.msg = 'incorrect header check';
	        state.mode = BAD;
	        break;
	      }
	      if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
	        strm.msg = 'unknown compression method';
	        state.mode = BAD;
	        break;
	      }
	      //--- DROPBITS(4) ---//
	      hold >>>= 4;
	      bits -= 4;
	      //---//
	      len = (hold & 0x0f)/*BITS(4)*/ + 8;
	      if (state.wbits === 0) {
	        state.wbits = len;
	      }
	      else if (len > state.wbits) {
	        strm.msg = 'invalid window size';
	        state.mode = BAD;
	        break;
	      }
	      state.dmax = 1 << len;
	      //Tracev((stderr, "inflate:   zlib header ok\n"));
	      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
	      state.mode = hold & 0x200 ? DICTID : TYPE;
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      break;
	    case FLAGS:
	      //=== NEEDBITS(16); */
	      while (bits < 16) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      state.flags = hold;
	      if ((state.flags & 0xff) !== Z_DEFLATED) {
	        strm.msg = 'unknown compression method';
	        state.mode = BAD;
	        break;
	      }
	      if (state.flags & 0xe000) {
	        strm.msg = 'unknown header flags set';
	        state.mode = BAD;
	        break;
	      }
	      if (state.head) {
	        state.head.text = ((hold >> 8) & 1);
	      }
	      if (state.flags & 0x0200) {
	        //=== CRC2(state.check, hold);
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        state.check = crc32(state.check, hbuf, 2, 0);
	        //===//
	      }
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = TIME;
	      /* falls through */
	    case TIME:
	      //=== NEEDBITS(32); */
	      while (bits < 32) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if (state.head) {
	        state.head.time = hold;
	      }
	      if (state.flags & 0x0200) {
	        //=== CRC4(state.check, hold)
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        hbuf[2] = (hold >>> 16) & 0xff;
	        hbuf[3] = (hold >>> 24) & 0xff;
	        state.check = crc32(state.check, hbuf, 4, 0);
	        //===
	      }
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = OS;
	      /* falls through */
	    case OS:
	      //=== NEEDBITS(16); */
	      while (bits < 16) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if (state.head) {
	        state.head.xflags = (hold & 0xff);
	        state.head.os = (hold >> 8);
	      }
	      if (state.flags & 0x0200) {
	        //=== CRC2(state.check, hold);
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        state.check = crc32(state.check, hbuf, 2, 0);
	        //===//
	      }
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = EXLEN;
	      /* falls through */
	    case EXLEN:
	      if (state.flags & 0x0400) {
	        //=== NEEDBITS(16); */
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.length = hold;
	        if (state.head) {
	          state.head.extra_len = hold;
	        }
	        if (state.flags & 0x0200) {
	          //=== CRC2(state.check, hold);
	          hbuf[0] = hold & 0xff;
	          hbuf[1] = (hold >>> 8) & 0xff;
	          state.check = crc32(state.check, hbuf, 2, 0);
	          //===//
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	      }
	      else if (state.head) {
	        state.head.extra = null/*Z_NULL*/;
	      }
	      state.mode = EXTRA;
	      /* falls through */
	    case EXTRA:
	      if (state.flags & 0x0400) {
	        copy = state.length;
	        if (copy > have) { copy = have; }
	        if (copy) {
	          if (state.head) {
	            len = state.head.extra_len - state.length;
	            if (!state.head.extra) {
	              // Use untyped array for more conveniend processing later
	              state.head.extra = new Array(state.head.extra_len);
	            }
	            utils.arraySet(
	              state.head.extra,
	              input,
	              next,
	              // extra field is limited to 65536 bytes
	              // - no need for additional size check
	              copy,
	              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
	              len
	            );
	            //zmemcpy(state.head.extra + len, next,
	            //        len + copy > state.head.extra_max ?
	            //        state.head.extra_max - len : copy);
	          }
	          if (state.flags & 0x0200) {
	            state.check = crc32(state.check, input, copy, next);
	          }
	          have -= copy;
	          next += copy;
	          state.length -= copy;
	        }
	        if (state.length) { break inf_leave; }
	      }
	      state.length = 0;
	      state.mode = NAME;
	      /* falls through */
	    case NAME:
	      if (state.flags & 0x0800) {
	        if (have === 0) { break inf_leave; }
	        copy = 0;
	        do {
	          // TODO: 2 or 1 bytes?
	          len = input[next + copy++];
	          /* use constant limit because in js we should not preallocate memory */
	          if (state.head && len &&
	              (state.length < 65536 /*state.head.name_max*/)) {
	            state.head.name += String.fromCharCode(len);
	          }
	        } while (len && copy < have);

	        if (state.flags & 0x0200) {
	          state.check = crc32(state.check, input, copy, next);
	        }
	        have -= copy;
	        next += copy;
	        if (len) { break inf_leave; }
	      }
	      else if (state.head) {
	        state.head.name = null;
	      }
	      state.length = 0;
	      state.mode = COMMENT;
	      /* falls through */
	    case COMMENT:
	      if (state.flags & 0x1000) {
	        if (have === 0) { break inf_leave; }
	        copy = 0;
	        do {
	          len = input[next + copy++];
	          /* use constant limit because in js we should not preallocate memory */
	          if (state.head && len &&
	              (state.length < 65536 /*state.head.comm_max*/)) {
	            state.head.comment += String.fromCharCode(len);
	          }
	        } while (len && copy < have);
	        if (state.flags & 0x0200) {
	          state.check = crc32(state.check, input, copy, next);
	        }
	        have -= copy;
	        next += copy;
	        if (len) { break inf_leave; }
	      }
	      else if (state.head) {
	        state.head.comment = null;
	      }
	      state.mode = HCRC;
	      /* falls through */
	    case HCRC:
	      if (state.flags & 0x0200) {
	        //=== NEEDBITS(16); */
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if (hold !== (state.check & 0xffff)) {
	          strm.msg = 'header crc mismatch';
	          state.mode = BAD;
	          break;
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	      }
	      if (state.head) {
	        state.head.hcrc = ((state.flags >> 9) & 1);
	        state.head.done = true;
	      }
	      strm.adler = state.check = 0;
	      state.mode = TYPE;
	      break;
	    case DICTID:
	      //=== NEEDBITS(32); */
	      while (bits < 32) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      strm.adler = state.check = zswap32(hold);
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = DICT;
	      /* falls through */
	    case DICT:
	      if (state.havedict === 0) {
	        //--- RESTORE() ---
	        strm.next_out = put;
	        strm.avail_out = left;
	        strm.next_in = next;
	        strm.avail_in = have;
	        state.hold = hold;
	        state.bits = bits;
	        //---
	        return Z_NEED_DICT;
	      }
	      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
	      state.mode = TYPE;
	      /* falls through */
	    case TYPE:
	      if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
	      /* falls through */
	    case TYPEDO:
	      if (state.last) {
	        //--- BYTEBITS() ---//
	        hold >>>= bits & 7;
	        bits -= bits & 7;
	        //---//
	        state.mode = CHECK;
	        break;
	      }
	      //=== NEEDBITS(3); */
	      while (bits < 3) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      state.last = (hold & 0x01)/*BITS(1)*/;
	      //--- DROPBITS(1) ---//
	      hold >>>= 1;
	      bits -= 1;
	      //---//

	      switch ((hold & 0x03)/*BITS(2)*/) {
	      case 0:                             /* stored block */
	        //Tracev((stderr, "inflate:     stored block%s\n",
	        //        state.last ? " (last)" : ""));
	        state.mode = STORED;
	        break;
	      case 1:                             /* fixed block */
	        fixedtables(state);
	        //Tracev((stderr, "inflate:     fixed codes block%s\n",
	        //        state.last ? " (last)" : ""));
	        state.mode = LEN_;             /* decode codes */
	        if (flush === Z_TREES) {
	          //--- DROPBITS(2) ---//
	          hold >>>= 2;
	          bits -= 2;
	          //---//
	          break inf_leave;
	        }
	        break;
	      case 2:                             /* dynamic block */
	        //Tracev((stderr, "inflate:     dynamic codes block%s\n",
	        //        state.last ? " (last)" : ""));
	        state.mode = TABLE;
	        break;
	      case 3:
	        strm.msg = 'invalid block type';
	        state.mode = BAD;
	      }
	      //--- DROPBITS(2) ---//
	      hold >>>= 2;
	      bits -= 2;
	      //---//
	      break;
	    case STORED:
	      //--- BYTEBITS() ---// /* go to byte boundary */
	      hold >>>= bits & 7;
	      bits -= bits & 7;
	      //---//
	      //=== NEEDBITS(32); */
	      while (bits < 32) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
	        strm.msg = 'invalid stored block lengths';
	        state.mode = BAD;
	        break;
	      }
	      state.length = hold & 0xffff;
	      //Tracev((stderr, "inflate:       stored length %u\n",
	      //        state.length));
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = COPY_;
	      if (flush === Z_TREES) { break inf_leave; }
	      /* falls through */
	    case COPY_:
	      state.mode = COPY;
	      /* falls through */
	    case COPY:
	      copy = state.length;
	      if (copy) {
	        if (copy > have) { copy = have; }
	        if (copy > left) { copy = left; }
	        if (copy === 0) { break inf_leave; }
	        //--- zmemcpy(put, next, copy); ---
	        utils.arraySet(output, input, next, copy, put);
	        //---//
	        have -= copy;
	        next += copy;
	        left -= copy;
	        put += copy;
	        state.length -= copy;
	        break;
	      }
	      //Tracev((stderr, "inflate:       stored end\n"));
	      state.mode = TYPE;
	      break;
	    case TABLE:
	      //=== NEEDBITS(14); */
	      while (bits < 14) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
	      //--- DROPBITS(5) ---//
	      hold >>>= 5;
	      bits -= 5;
	      //---//
	      state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
	      //--- DROPBITS(5) ---//
	      hold >>>= 5;
	      bits -= 5;
	      //---//
	      state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
	      //--- DROPBITS(4) ---//
	      hold >>>= 4;
	      bits -= 4;
	      //---//
	//#ifndef PKZIP_BUG_WORKAROUND
	      if (state.nlen > 286 || state.ndist > 30) {
	        strm.msg = 'too many length or distance symbols';
	        state.mode = BAD;
	        break;
	      }
	//#endif
	      //Tracev((stderr, "inflate:       table sizes ok\n"));
	      state.have = 0;
	      state.mode = LENLENS;
	      /* falls through */
	    case LENLENS:
	      while (state.have < state.ncode) {
	        //=== NEEDBITS(3);
	        while (bits < 3) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
	        //--- DROPBITS(3) ---//
	        hold >>>= 3;
	        bits -= 3;
	        //---//
	      }
	      while (state.have < 19) {
	        state.lens[order[state.have++]] = 0;
	      }
	      // We have separate tables & no pointers. 2 commented lines below not needed.
	      //state.next = state.codes;
	      //state.lencode = state.next;
	      // Switch to use dynamic table
	      state.lencode = state.lendyn;
	      state.lenbits = 7;

	      opts = { bits: state.lenbits };
	      ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
	      state.lenbits = opts.bits;

	      if (ret) {
	        strm.msg = 'invalid code lengths set';
	        state.mode = BAD;
	        break;
	      }
	      //Tracev((stderr, "inflate:       code lengths ok\n"));
	      state.have = 0;
	      state.mode = CODELENS;
	      /* falls through */
	    case CODELENS:
	      while (state.have < state.nlen + state.ndist) {
	        for (;;) {
	          here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;

	          if ((here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        if (here_val < 16) {
	          //--- DROPBITS(here.bits) ---//
	          hold >>>= here_bits;
	          bits -= here_bits;
	          //---//
	          state.lens[state.have++] = here_val;
	        }
	        else {
	          if (here_val === 16) {
	            //=== NEEDBITS(here.bits + 2);
	            n = here_bits + 2;
	            while (bits < n) {
	              if (have === 0) { break inf_leave; }
	              have--;
	              hold += input[next++] << bits;
	              bits += 8;
	            }
	            //===//
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            if (state.have === 0) {
	              strm.msg = 'invalid bit length repeat';
	              state.mode = BAD;
	              break;
	            }
	            len = state.lens[state.have - 1];
	            copy = 3 + (hold & 0x03);//BITS(2);
	            //--- DROPBITS(2) ---//
	            hold >>>= 2;
	            bits -= 2;
	            //---//
	          }
	          else if (here_val === 17) {
	            //=== NEEDBITS(here.bits + 3);
	            n = here_bits + 3;
	            while (bits < n) {
	              if (have === 0) { break inf_leave; }
	              have--;
	              hold += input[next++] << bits;
	              bits += 8;
	            }
	            //===//
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            len = 0;
	            copy = 3 + (hold & 0x07);//BITS(3);
	            //--- DROPBITS(3) ---//
	            hold >>>= 3;
	            bits -= 3;
	            //---//
	          }
	          else {
	            //=== NEEDBITS(here.bits + 7);
	            n = here_bits + 7;
	            while (bits < n) {
	              if (have === 0) { break inf_leave; }
	              have--;
	              hold += input[next++] << bits;
	              bits += 8;
	            }
	            //===//
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            len = 0;
	            copy = 11 + (hold & 0x7f);//BITS(7);
	            //--- DROPBITS(7) ---//
	            hold >>>= 7;
	            bits -= 7;
	            //---//
	          }
	          if (state.have + copy > state.nlen + state.ndist) {
	            strm.msg = 'invalid bit length repeat';
	            state.mode = BAD;
	            break;
	          }
	          while (copy--) {
	            state.lens[state.have++] = len;
	          }
	        }
	      }

	      /* handle error breaks in while */
	      if (state.mode === BAD) { break; }

	      /* check for end-of-block code (better have one) */
	      if (state.lens[256] === 0) {
	        strm.msg = 'invalid code -- missing end-of-block';
	        state.mode = BAD;
	        break;
	      }

	      /* build code tables -- note: do not change the lenbits or distbits
	         values here (9 and 6) without reading the comments in inftrees.h
	         concerning the ENOUGH constants, which depend on those values */
	      state.lenbits = 9;

	      opts = { bits: state.lenbits };
	      ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
	      // We have separate tables & no pointers. 2 commented lines below not needed.
	      // state.next_index = opts.table_index;
	      state.lenbits = opts.bits;
	      // state.lencode = state.next;

	      if (ret) {
	        strm.msg = 'invalid literal/lengths set';
	        state.mode = BAD;
	        break;
	      }

	      state.distbits = 6;
	      //state.distcode.copy(state.codes);
	      // Switch to use dynamic table
	      state.distcode = state.distdyn;
	      opts = { bits: state.distbits };
	      ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
	      // We have separate tables & no pointers. 2 commented lines below not needed.
	      // state.next_index = opts.table_index;
	      state.distbits = opts.bits;
	      // state.distcode = state.next;

	      if (ret) {
	        strm.msg = 'invalid distances set';
	        state.mode = BAD;
	        break;
	      }
	      //Tracev((stderr, 'inflate:       codes ok\n'));
	      state.mode = LEN_;
	      if (flush === Z_TREES) { break inf_leave; }
	      /* falls through */
	    case LEN_:
	      state.mode = LEN;
	      /* falls through */
	    case LEN:
	      if (have >= 6 && left >= 258) {
	        //--- RESTORE() ---
	        strm.next_out = put;
	        strm.avail_out = left;
	        strm.next_in = next;
	        strm.avail_in = have;
	        state.hold = hold;
	        state.bits = bits;
	        //---
	        inflate_fast(strm, _out);
	        //--- LOAD() ---
	        put = strm.next_out;
	        output = strm.output;
	        left = strm.avail_out;
	        next = strm.next_in;
	        input = strm.input;
	        have = strm.avail_in;
	        hold = state.hold;
	        bits = state.bits;
	        //---

	        if (state.mode === TYPE) {
	          state.back = -1;
	        }
	        break;
	      }
	      state.back = 0;
	      for (;;) {
	        here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
	        here_bits = here >>> 24;
	        here_op = (here >>> 16) & 0xff;
	        here_val = here & 0xffff;

	        if (here_bits <= bits) { break; }
	        //--- PULLBYTE() ---//
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	        //---//
	      }
	      if (here_op && (here_op & 0xf0) === 0) {
	        last_bits = here_bits;
	        last_op = here_op;
	        last_val = here_val;
	        for (;;) {
	          here = state.lencode[last_val +
	                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;

	          if ((last_bits + here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        //--- DROPBITS(last.bits) ---//
	        hold >>>= last_bits;
	        bits -= last_bits;
	        //---//
	        state.back += last_bits;
	      }
	      //--- DROPBITS(here.bits) ---//
	      hold >>>= here_bits;
	      bits -= here_bits;
	      //---//
	      state.back += here_bits;
	      state.length = here_val;
	      if (here_op === 0) {
	        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
	        //        "inflate:         literal '%c'\n" :
	        //        "inflate:         literal 0x%02x\n", here.val));
	        state.mode = LIT;
	        break;
	      }
	      if (here_op & 32) {
	        //Tracevv((stderr, "inflate:         end of block\n"));
	        state.back = -1;
	        state.mode = TYPE;
	        break;
	      }
	      if (here_op & 64) {
	        strm.msg = 'invalid literal/length code';
	        state.mode = BAD;
	        break;
	      }
	      state.extra = here_op & 15;
	      state.mode = LENEXT;
	      /* falls through */
	    case LENEXT:
	      if (state.extra) {
	        //=== NEEDBITS(state.extra);
	        n = state.extra;
	        while (bits < n) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
	        //--- DROPBITS(state.extra) ---//
	        hold >>>= state.extra;
	        bits -= state.extra;
	        //---//
	        state.back += state.extra;
	      }
	      //Tracevv((stderr, "inflate:         length %u\n", state.length));
	      state.was = state.length;
	      state.mode = DIST;
	      /* falls through */
	    case DIST:
	      for (;;) {
	        here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
	        here_bits = here >>> 24;
	        here_op = (here >>> 16) & 0xff;
	        here_val = here & 0xffff;

	        if ((here_bits) <= bits) { break; }
	        //--- PULLBYTE() ---//
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	        //---//
	      }
	      if ((here_op & 0xf0) === 0) {
	        last_bits = here_bits;
	        last_op = here_op;
	        last_val = here_val;
	        for (;;) {
	          here = state.distcode[last_val +
	                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;

	          if ((last_bits + here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        //--- DROPBITS(last.bits) ---//
	        hold >>>= last_bits;
	        bits -= last_bits;
	        //---//
	        state.back += last_bits;
	      }
	      //--- DROPBITS(here.bits) ---//
	      hold >>>= here_bits;
	      bits -= here_bits;
	      //---//
	      state.back += here_bits;
	      if (here_op & 64) {
	        strm.msg = 'invalid distance code';
	        state.mode = BAD;
	        break;
	      }
	      state.offset = here_val;
	      state.extra = (here_op) & 15;
	      state.mode = DISTEXT;
	      /* falls through */
	    case DISTEXT:
	      if (state.extra) {
	        //=== NEEDBITS(state.extra);
	        n = state.extra;
	        while (bits < n) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
	        //--- DROPBITS(state.extra) ---//
	        hold >>>= state.extra;
	        bits -= state.extra;
	        //---//
	        state.back += state.extra;
	      }
	//#ifdef INFLATE_STRICT
	      if (state.offset > state.dmax) {
	        strm.msg = 'invalid distance too far back';
	        state.mode = BAD;
	        break;
	      }
	//#endif
	      //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
	      state.mode = MATCH;
	      /* falls through */
	    case MATCH:
	      if (left === 0) { break inf_leave; }
	      copy = _out - left;
	      if (state.offset > copy) {         /* copy from window */
	        copy = state.offset - copy;
	        if (copy > state.whave) {
	          if (state.sane) {
	            strm.msg = 'invalid distance too far back';
	            state.mode = BAD;
	            break;
	          }
	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility
	//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
	//          Trace((stderr, "inflate.c too far\n"));
	//          copy -= state.whave;
	//          if (copy > state.length) { copy = state.length; }
	//          if (copy > left) { copy = left; }
	//          left -= copy;
	//          state.length -= copy;
	//          do {
	//            output[put++] = 0;
	//          } while (--copy);
	//          if (state.length === 0) { state.mode = LEN; }
	//          break;
	//#endif
	        }
	        if (copy > state.wnext) {
	          copy -= state.wnext;
	          from = state.wsize - copy;
	        }
	        else {
	          from = state.wnext - copy;
	        }
	        if (copy > state.length) { copy = state.length; }
	        from_source = state.window;
	      }
	      else {                              /* copy from output */
	        from_source = output;
	        from = put - state.offset;
	        copy = state.length;
	      }
	      if (copy > left) { copy = left; }
	      left -= copy;
	      state.length -= copy;
	      do {
	        output[put++] = from_source[from++];
	      } while (--copy);
	      if (state.length === 0) { state.mode = LEN; }
	      break;
	    case LIT:
	      if (left === 0) { break inf_leave; }
	      output[put++] = state.length;
	      left--;
	      state.mode = LEN;
	      break;
	    case CHECK:
	      if (state.wrap) {
	        //=== NEEDBITS(32);
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          // Use '|' insdead of '+' to make sure that result is signed
	          hold |= input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        _out -= left;
	        strm.total_out += _out;
	        state.total += _out;
	        if (_out) {
	          strm.adler = state.check =
	              /*UPDATE(state.check, put - _out, _out);*/
	              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

	        }
	        _out = left;
	        // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
	        if ((state.flags ? hold : zswap32(hold)) !== state.check) {
	          strm.msg = 'incorrect data check';
	          state.mode = BAD;
	          break;
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        //Tracev((stderr, "inflate:   check matches trailer\n"));
	      }
	      state.mode = LENGTH;
	      /* falls through */
	    case LENGTH:
	      if (state.wrap && state.flags) {
	        //=== NEEDBITS(32);
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if (hold !== (state.total & 0xffffffff)) {
	          strm.msg = 'incorrect length check';
	          state.mode = BAD;
	          break;
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        //Tracev((stderr, "inflate:   length matches trailer\n"));
	      }
	      state.mode = DONE;
	      /* falls through */
	    case DONE:
	      ret = Z_STREAM_END;
	      break inf_leave;
	    case BAD:
	      ret = Z_DATA_ERROR;
	      break inf_leave;
	    case MEM:
	      return Z_MEM_ERROR;
	    case SYNC:
	      /* falls through */
	    default:
	      return Z_STREAM_ERROR;
	    }
	  }

	  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

	  /*
	     Return from inflate(), updating the total counts and the check value.
	     If there was no progress during the inflate() call, return a buffer
	     error.  Call updatewindow() to create and/or update the window state.
	     Note: a memory error from inflate() is non-recoverable.
	   */

	  //--- RESTORE() ---
	  strm.next_out = put;
	  strm.avail_out = left;
	  strm.next_in = next;
	  strm.avail_in = have;
	  state.hold = hold;
	  state.bits = bits;
	  //---

	  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
	                      (state.mode < CHECK || flush !== Z_FINISH))) {
	    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
	  }
	  _in -= strm.avail_in;
	  _out -= strm.avail_out;
	  strm.total_in += _in;
	  strm.total_out += _out;
	  state.total += _out;
	  if (state.wrap && _out) {
	    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
	      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
	  }
	  strm.data_type = state.bits + (state.last ? 64 : 0) +
	                    (state.mode === TYPE ? 128 : 0) +
	                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
	  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
	    ret = Z_BUF_ERROR;
	  }
	  return ret;
	}

	function inflateEnd(strm) {

	  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
	    return Z_STREAM_ERROR;
	  }

	  var state = strm.state;
	  if (state.window) {
	    state.window = null;
	  }
	  strm.state = null;
	  return Z_OK;
	}

	function inflateGetHeader(strm, head) {
	  var state;

	  /* check state */
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

	  /* save header structure */
	  state.head = head;
	  head.done = false;
	  return Z_OK;
	}

	function inflateSetDictionary(strm, dictionary) {
	  var dictLength = dictionary.length;

	  var state;
	  var dictid;
	  var ret;

	  /* check state */
	  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
	  state = strm.state;

	  if (state.wrap !== 0 && state.mode !== DICT) {
	    return Z_STREAM_ERROR;
	  }

	  /* check for correct dictionary identifier */
	  if (state.mode === DICT) {
	    dictid = 1; /* adler32(0, null, 0)*/
	    /* dictid = adler32(dictid, dictionary, dictLength); */
	    dictid = adler32(dictid, dictionary, dictLength, 0);
	    if (dictid !== state.check) {
	      return Z_DATA_ERROR;
	    }
	  }
	  /* copy dictionary to window using updatewindow(), which will amend the
	   existing dictionary if appropriate */
	  ret = updatewindow(strm, dictionary, dictLength, dictLength);
	  if (ret) {
	    state.mode = MEM;
	    return Z_MEM_ERROR;
	  }
	  state.havedict = 1;
	  // Tracev((stderr, "inflate:   dictionary set\n"));
	  return Z_OK;
	}

	exports.inflateReset = inflateReset;
	exports.inflateReset2 = inflateReset2;
	exports.inflateResetKeep = inflateResetKeep;
	exports.inflateInit = inflateInit;
	exports.inflateInit2 = inflateInit2;
	exports.inflate = inflate;
	exports.inflateEnd = inflateEnd;
	exports.inflateGetHeader = inflateGetHeader;
	exports.inflateSetDictionary = inflateSetDictionary;
	exports.inflateInfo = 'pako inflate (from Nodeca project)';

	/* Not implemented
	exports.inflateCopy = inflateCopy;
	exports.inflateGetDictionary = inflateGetDictionary;
	exports.inflateMark = inflateMark;
	exports.inflatePrime = inflatePrime;
	exports.inflateSync = inflateSync;
	exports.inflateSyncPoint = inflateSyncPoint;
	exports.inflateUndermine = inflateUndermine;
	*/

	},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils = require('../utils/common');

	var MAXBITS = 15;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;

	var lbase = [ /* Length codes 257..285 base */
	  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
	  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
	];

	var lext = [ /* Length codes 257..285 extra */
	  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
	  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
	];

	var dbase = [ /* Distance codes 0..29 base */
	  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
	  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
	  8193, 12289, 16385, 24577, 0, 0
	];

	var dext = [ /* Distance codes 0..29 extra */
	  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
	  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
	  28, 28, 29, 29, 64, 64
	];

	module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
	{
	  var bits = opts.bits;
	      //here = opts.here; /* table entry for duplication */

	  var len = 0;               /* a code's length in bits */
	  var sym = 0;               /* index of code symbols */
	  var min = 0, max = 0;          /* minimum and maximum code lengths */
	  var root = 0;              /* number of index bits for root table */
	  var curr = 0;              /* number of index bits for current table */
	  var drop = 0;              /* code bits to drop for sub-table */
	  var left = 0;                   /* number of prefix codes available */
	  var used = 0;              /* code entries in table used */
	  var huff = 0;              /* Huffman code */
	  var incr;              /* for incrementing code, index */
	  var fill;              /* index for replicating entries */
	  var low;               /* low bits for current root entry */
	  var mask;              /* mask for low root bits */
	  var next;             /* next available space in table */
	  var base = null;     /* base value table to use */
	  var base_index = 0;
	//  var shoextra;    /* extra bits table to use */
	  var end;                    /* use base and extra for symbol > end */
	  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
	  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
	  var extra = null;
	  var extra_index = 0;

	  var here_bits, here_op, here_val;

	  /*
	   Process a set of code lengths to create a canonical Huffman code.  The
	   code lengths are lens[0..codes-1].  Each length corresponds to the
	   symbols 0..codes-1.  The Huffman code is generated by first sorting the
	   symbols by length from short to long, and retaining the symbol order
	   for codes with equal lengths.  Then the code starts with all zero bits
	   for the first code of the shortest length, and the codes are integer
	   increments for the same length, and zeros are appended as the length
	   increases.  For the deflate format, these bits are stored backwards
	   from their more natural integer increment ordering, and so when the
	   decoding tables are built in the large loop below, the integer codes
	   are incremented backwards.

	   This routine assumes, but does not check, that all of the entries in
	   lens[] are in the range 0..MAXBITS.  The caller must assure this.
	   1..MAXBITS is interpreted as that code length.  zero means that that
	   symbol does not occur in this code.

	   The codes are sorted by computing a count of codes for each length,
	   creating from that a table of starting indices for each length in the
	   sorted table, and then entering the symbols in order in the sorted
	   table.  The sorted table is work[], with that space being provided by
	   the caller.

	   The length counts are used for other purposes as well, i.e. finding
	   the minimum and maximum length codes, determining if there are any
	   codes at all, checking for a valid set of lengths, and looking ahead
	   at length counts to determine sub-table sizes when building the
	   decoding tables.
	   */

	  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
	  for (len = 0; len <= MAXBITS; len++) {
	    count[len] = 0;
	  }
	  for (sym = 0; sym < codes; sym++) {
	    count[lens[lens_index + sym]]++;
	  }

	  /* bound code lengths, force root to be within code lengths */
	  root = bits;
	  for (max = MAXBITS; max >= 1; max--) {
	    if (count[max] !== 0) { break; }
	  }
	  if (root > max) {
	    root = max;
	  }
	  if (max === 0) {                     /* no symbols to code at all */
	    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
	    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
	    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
	    table[table_index++] = (1 << 24) | (64 << 16) | 0;


	    //table.op[opts.table_index] = 64;
	    //table.bits[opts.table_index] = 1;
	    //table.val[opts.table_index++] = 0;
	    table[table_index++] = (1 << 24) | (64 << 16) | 0;

	    opts.bits = 1;
	    return 0;     /* no symbols, but wait for decoding to report error */
	  }
	  for (min = 1; min < max; min++) {
	    if (count[min] !== 0) { break; }
	  }
	  if (root < min) {
	    root = min;
	  }

	  /* check for an over-subscribed or incomplete set of lengths */
	  left = 1;
	  for (len = 1; len <= MAXBITS; len++) {
	    left <<= 1;
	    left -= count[len];
	    if (left < 0) {
	      return -1;
	    }        /* over-subscribed */
	  }
	  if (left > 0 && (type === CODES || max !== 1)) {
	    return -1;                      /* incomplete set */
	  }

	  /* generate offsets into symbol table for each length for sorting */
	  offs[1] = 0;
	  for (len = 1; len < MAXBITS; len++) {
	    offs[len + 1] = offs[len] + count[len];
	  }

	  /* sort symbols by length, by symbol order within each length */
	  for (sym = 0; sym < codes; sym++) {
	    if (lens[lens_index + sym] !== 0) {
	      work[offs[lens[lens_index + sym]]++] = sym;
	    }
	  }

	  /*
	   Create and fill in decoding tables.  In this loop, the table being
	   filled is at next and has curr index bits.  The code being used is huff
	   with length len.  That code is converted to an index by dropping drop
	   bits off of the bottom.  For codes where len is less than drop + curr,
	   those top drop + curr - len bits are incremented through all values to
	   fill the table with replicated entries.

	   root is the number of index bits for the root table.  When len exceeds
	   root, sub-tables are created pointed to by the root entry with an index
	   of the low root bits of huff.  This is saved in low to check for when a
	   new sub-table should be started.  drop is zero when the root table is
	   being filled, and drop is root when sub-tables are being filled.

	   When a new sub-table is needed, it is necessary to look ahead in the
	   code lengths to determine what size sub-table is needed.  The length
	   counts are used for this, and so count[] is decremented as codes are
	   entered in the tables.

	   used keeps track of how many table entries have been allocated from the
	   provided *table space.  It is checked for LENS and DIST tables against
	   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
	   the initial root table size constants.  See the comments in inftrees.h
	   for more information.

	   sym increments through all symbols, and the loop terminates when
	   all codes of length max, i.e. all codes, have been processed.  This
	   routine permits incomplete codes, so another loop after this one fills
	   in the rest of the decoding tables with invalid code markers.
	   */

	  /* set up for code type */
	  // poor man optimization - use if-else instead of switch,
	  // to avoid deopts in old v8
	  if (type === CODES) {
	    base = extra = work;    /* dummy value--not used */
	    end = 19;

	  } else if (type === LENS) {
	    base = lbase;
	    base_index -= 257;
	    extra = lext;
	    extra_index -= 257;
	    end = 256;

	  } else {                    /* DISTS */
	    base = dbase;
	    extra = dext;
	    end = -1;
	  }

	  /* initialize opts for loop */
	  huff = 0;                   /* starting code */
	  sym = 0;                    /* starting code symbol */
	  len = min;                  /* starting code length */
	  next = table_index;              /* current table to fill in */
	  curr = root;                /* current table index bits */
	  drop = 0;                   /* current bits to drop from code for index */
	  low = -1;                   /* trigger new sub-table when len > root */
	  used = 1 << root;          /* use root table entries */
	  mask = used - 1;            /* mask for comparing low */

	  /* check available table space */
	  if ((type === LENS && used > ENOUGH_LENS) ||
	    (type === DISTS && used > ENOUGH_DISTS)) {
	    return 1;
	  }

	  /* process all codes and make table entries */
	  for (;;) {
	    /* create table entry */
	    here_bits = len - drop;
	    if (work[sym] < end) {
	      here_op = 0;
	      here_val = work[sym];
	    }
	    else if (work[sym] > end) {
	      here_op = extra[extra_index + work[sym]];
	      here_val = base[base_index + work[sym]];
	    }
	    else {
	      here_op = 32 + 64;         /* end of block */
	      here_val = 0;
	    }

	    /* replicate for those indices with low len bits equal to huff */
	    incr = 1 << (len - drop);
	    fill = 1 << curr;
	    min = fill;                 /* save offset to next table */
	    do {
	      fill -= incr;
	      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
	    } while (fill !== 0);

	    /* backwards increment the len-bit code huff */
	    incr = 1 << (len - 1);
	    while (huff & incr) {
	      incr >>= 1;
	    }
	    if (incr !== 0) {
	      huff &= incr - 1;
	      huff += incr;
	    } else {
	      huff = 0;
	    }

	    /* go to next symbol, update count, len */
	    sym++;
	    if (--count[len] === 0) {
	      if (len === max) { break; }
	      len = lens[lens_index + work[sym]];
	    }

	    /* create new sub-table if needed */
	    if (len > root && (huff & mask) !== low) {
	      /* if first time, transition to sub-tables */
	      if (drop === 0) {
	        drop = root;
	      }

	      /* increment past last table */
	      next += min;            /* here min is 1 << curr */

	      /* determine length of next table */
	      curr = len - drop;
	      left = 1 << curr;
	      while (curr + drop < max) {
	        left -= count[curr + drop];
	        if (left <= 0) { break; }
	        curr++;
	        left <<= 1;
	      }

	      /* check for enough space */
	      used += 1 << curr;
	      if ((type === LENS && used > ENOUGH_LENS) ||
	        (type === DISTS && used > ENOUGH_DISTS)) {
	        return 1;
	      }

	      /* point entry in root table to sub-table */
	      low = huff & mask;
	      /*table.op[low] = curr;
	      table.bits[low] = root;
	      table.val[low] = next - opts.table_index;*/
	      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
	    }
	  }

	  /* fill in remaining table entry if code is incomplete (guaranteed to have
	   at most one remaining entry, since if the code is incomplete, the
	   maximum code length that was allowed to get this far is one bit) */
	  if (huff !== 0) {
	    //table.op[next + huff] = 64;            /* invalid code marker */
	    //table.bits[next + huff] = len - drop;
	    //table.val[next + huff] = 0;
	    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
	  }

	  /* set return parameters */
	  //opts.table_index += used;
	  opts.bits = root;
	  return 0;
	};

	},{"../utils/common":41}],51:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	module.exports = {
	  2:      'need dictionary',     /* Z_NEED_DICT       2  */
	  1:      'stream end',          /* Z_STREAM_END      1  */
	  0:      '',                    /* Z_OK              0  */
	  '-1':   'file error',          /* Z_ERRNO         (-1) */
	  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
	  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
	  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
	  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
	  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
	};

	},{}],52:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils = require('../utils/common');

	/* Public constants ==========================================================*/
	/* ===========================================================================*/


	//var Z_FILTERED          = 1;
	//var Z_HUFFMAN_ONLY      = 2;
	//var Z_RLE               = 3;
	var Z_FIXED               = 4;
	//var Z_DEFAULT_STRATEGY  = 0;

	/* Possible values of the data_type field (though see inflate()) */
	var Z_BINARY              = 0;
	var Z_TEXT                = 1;
	//var Z_ASCII             = 1; // = Z_TEXT
	var Z_UNKNOWN             = 2;

	/*============================================================================*/


	function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

	// From zutil.h

	var STORED_BLOCK = 0;
	var STATIC_TREES = 1;
	var DYN_TREES    = 2;
	/* The three kinds of block type */

	var MIN_MATCH    = 3;
	var MAX_MATCH    = 258;
	/* The minimum and maximum match lengths */

	// From deflate.h
	/* ===========================================================================
	 * Internal compression state.
	 */

	var LENGTH_CODES  = 29;
	/* number of length codes, not counting the special END_BLOCK code */

	var LITERALS      = 256;
	/* number of literal bytes 0..255 */

	var L_CODES       = LITERALS + 1 + LENGTH_CODES;
	/* number of Literal or Length codes, including the END_BLOCK code */

	var D_CODES       = 30;
	/* number of distance codes */

	var BL_CODES      = 19;
	/* number of codes used to transfer the bit lengths */

	var HEAP_SIZE     = 2 * L_CODES + 1;
	/* maximum heap size */

	var MAX_BITS      = 15;
	/* All codes must not exceed MAX_BITS bits */

	var Buf_size      = 16;
	/* size of bit buffer in bi_buf */


	/* ===========================================================================
	 * Constants
	 */

	var MAX_BL_BITS = 7;
	/* Bit length codes must not exceed MAX_BL_BITS bits */

	var END_BLOCK   = 256;
	/* end of block literal code */

	var REP_3_6     = 16;
	/* repeat previous bit length 3-6 times (2 bits of repeat count) */

	var REPZ_3_10   = 17;
	/* repeat a zero length 3-10 times  (3 bits of repeat count) */

	var REPZ_11_138 = 18;
	/* repeat a zero length 11-138 times  (7 bits of repeat count) */

	/* eslint-disable comma-spacing,array-bracket-spacing */
	var extra_lbits =   /* extra bits for each length code */
	  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

	var extra_dbits =   /* extra bits for each distance code */
	  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

	var extra_blbits =  /* extra bits for each bit length code */
	  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

	var bl_order =
	  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
	/* eslint-enable comma-spacing,array-bracket-spacing */

	/* The lengths of the bit length codes are sent in order of decreasing
	 * probability, to avoid transmitting the lengths for unused bit length codes.
	 */

	/* ===========================================================================
	 * Local data. These are initialized only once.
	 */

	// We pre-fill arrays with 0 to avoid uninitialized gaps

	var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

	// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
	var static_ltree  = new Array((L_CODES + 2) * 2);
	zero(static_ltree);
	/* The static literal tree. Since the bit lengths are imposed, there is no
	 * need for the L_CODES extra codes used during heap construction. However
	 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
	 * below).
	 */

	var static_dtree  = new Array(D_CODES * 2);
	zero(static_dtree);
	/* The static distance tree. (Actually a trivial tree since all codes use
	 * 5 bits.)
	 */

	var _dist_code    = new Array(DIST_CODE_LEN);
	zero(_dist_code);
	/* Distance codes. The first 256 values correspond to the distances
	 * 3 .. 258, the last 256 values correspond to the top 8 bits of
	 * the 15 bit distances.
	 */

	var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
	zero(_length_code);
	/* length code for each normalized match length (0 == MIN_MATCH) */

	var base_length   = new Array(LENGTH_CODES);
	zero(base_length);
	/* First normalized length for each code (0 = MIN_MATCH) */

	var base_dist     = new Array(D_CODES);
	zero(base_dist);
	/* First normalized distance for each code (0 = distance of 1) */


	function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

	  this.static_tree  = static_tree;  /* static tree or NULL */
	  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
	  this.extra_base   = extra_base;   /* base index for extra_bits */
	  this.elems        = elems;        /* max number of elements in the tree */
	  this.max_length   = max_length;   /* max bit length for the codes */

	  // show if `static_tree` has data or dummy - needed for monomorphic objects
	  this.has_stree    = static_tree && static_tree.length;
	}


	var static_l_desc;
	var static_d_desc;
	var static_bl_desc;


	function TreeDesc(dyn_tree, stat_desc) {
	  this.dyn_tree = dyn_tree;     /* the dynamic tree */
	  this.max_code = 0;            /* largest code with non zero frequency */
	  this.stat_desc = stat_desc;   /* the corresponding static tree */
	}



	function d_code(dist) {
	  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
	}


	/* ===========================================================================
	 * Output a short LSB first on the stream.
	 * IN assertion: there is enough room in pendingBuf.
	 */
	function put_short(s, w) {
	//    put_byte(s, (uch)((w) & 0xff));
	//    put_byte(s, (uch)((ush)(w) >> 8));
	  s.pending_buf[s.pending++] = (w) & 0xff;
	  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
	}


	/* ===========================================================================
	 * Send a value on a given number of bits.
	 * IN assertion: length <= 16 and value fits in length bits.
	 */
	function send_bits(s, value, length) {
	  if (s.bi_valid > (Buf_size - length)) {
	    s.bi_buf |= (value << s.bi_valid) & 0xffff;
	    put_short(s, s.bi_buf);
	    s.bi_buf = value >> (Buf_size - s.bi_valid);
	    s.bi_valid += length - Buf_size;
	  } else {
	    s.bi_buf |= (value << s.bi_valid) & 0xffff;
	    s.bi_valid += length;
	  }
	}


	function send_code(s, c, tree) {
	  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
	}


	/* ===========================================================================
	 * Reverse the first len bits of a code, using straightforward code (a faster
	 * method would use a table)
	 * IN assertion: 1 <= len <= 15
	 */
	function bi_reverse(code, len) {
	  var res = 0;
	  do {
	    res |= code & 1;
	    code >>>= 1;
	    res <<= 1;
	  } while (--len > 0);
	  return res >>> 1;
	}


	/* ===========================================================================
	 * Flush the bit buffer, keeping at most 7 bits in it.
	 */
	function bi_flush(s) {
	  if (s.bi_valid === 16) {
	    put_short(s, s.bi_buf);
	    s.bi_buf = 0;
	    s.bi_valid = 0;

	  } else if (s.bi_valid >= 8) {
	    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
	    s.bi_buf >>= 8;
	    s.bi_valid -= 8;
	  }
	}


	/* ===========================================================================
	 * Compute the optimal bit lengths for a tree and update the total bit length
	 * for the current block.
	 * IN assertion: the fields freq and dad are set, heap[heap_max] and
	 *    above are the tree nodes sorted by increasing frequency.
	 * OUT assertions: the field len is set to the optimal bit length, the
	 *     array bl_count contains the frequencies for each bit length.
	 *     The length opt_len is updated; static_len is also updated if stree is
	 *     not null.
	 */
	function gen_bitlen(s, desc)
	//    deflate_state *s;
	//    tree_desc *desc;    /* the tree descriptor */
	{
	  var tree            = desc.dyn_tree;
	  var max_code        = desc.max_code;
	  var stree           = desc.stat_desc.static_tree;
	  var has_stree       = desc.stat_desc.has_stree;
	  var extra           = desc.stat_desc.extra_bits;
	  var base            = desc.stat_desc.extra_base;
	  var max_length      = desc.stat_desc.max_length;
	  var h;              /* heap index */
	  var n, m;           /* iterate over the tree elements */
	  var bits;           /* bit length */
	  var xbits;          /* extra bits */
	  var f;              /* frequency */
	  var overflow = 0;   /* number of elements with bit length too large */

	  for (bits = 0; bits <= MAX_BITS; bits++) {
	    s.bl_count[bits] = 0;
	  }

	  /* In a first pass, compute the optimal bit lengths (which may
	   * overflow in the case of the bit length tree).
	   */
	  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

	  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
	    n = s.heap[h];
	    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
	    if (bits > max_length) {
	      bits = max_length;
	      overflow++;
	    }
	    tree[n * 2 + 1]/*.Len*/ = bits;
	    /* We overwrite tree[n].Dad which is no longer needed */

	    if (n > max_code) { continue; } /* not a leaf node */

	    s.bl_count[bits]++;
	    xbits = 0;
	    if (n >= base) {
	      xbits = extra[n - base];
	    }
	    f = tree[n * 2]/*.Freq*/;
	    s.opt_len += f * (bits + xbits);
	    if (has_stree) {
	      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
	    }
	  }
	  if (overflow === 0) { return; }

	  // Trace((stderr,"\nbit length overflow\n"));
	  /* This happens for example on obj2 and pic of the Calgary corpus */

	  /* Find the first bit length which could increase: */
	  do {
	    bits = max_length - 1;
	    while (s.bl_count[bits] === 0) { bits--; }
	    s.bl_count[bits]--;      /* move one leaf down the tree */
	    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
	    s.bl_count[max_length]--;
	    /* The brother of the overflow item also moves one step up,
	     * but this does not affect bl_count[max_length]
	     */
	    overflow -= 2;
	  } while (overflow > 0);

	  /* Now recompute all bit lengths, scanning in increasing frequency.
	   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
	   * lengths instead of fixing only the wrong ones. This idea is taken
	   * from 'ar' written by Haruhiko Okumura.)
	   */
	  for (bits = max_length; bits !== 0; bits--) {
	    n = s.bl_count[bits];
	    while (n !== 0) {
	      m = s.heap[--h];
	      if (m > max_code) { continue; }
	      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
	        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
	        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
	        tree[m * 2 + 1]/*.Len*/ = bits;
	      }
	      n--;
	    }
	  }
	}


	/* ===========================================================================
	 * Generate the codes for a given tree and bit counts (which need not be
	 * optimal).
	 * IN assertion: the array bl_count contains the bit length statistics for
	 * the given tree and the field len is set for all tree elements.
	 * OUT assertion: the field code is set for all tree elements of non
	 *     zero code length.
	 */
	function gen_codes(tree, max_code, bl_count)
	//    ct_data *tree;             /* the tree to decorate */
	//    int max_code;              /* largest code with non zero frequency */
	//    ushf *bl_count;            /* number of codes at each bit length */
	{
	  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
	  var code = 0;              /* running code value */
	  var bits;                  /* bit index */
	  var n;                     /* code index */

	  /* The distribution counts are first used to generate the code values
	   * without bit reversal.
	   */
	  for (bits = 1; bits <= MAX_BITS; bits++) {
	    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
	  }
	  /* Check that the bit counts in bl_count are consistent. The last code
	   * must be all ones.
	   */
	  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
	  //        "inconsistent bit counts");
	  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

	  for (n = 0;  n <= max_code; n++) {
	    var len = tree[n * 2 + 1]/*.Len*/;
	    if (len === 0) { continue; }
	    /* Now reverse the bits */
	    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

	    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
	    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
	  }
	}


	/* ===========================================================================
	 * Initialize the various 'constant' tables.
	 */
	function tr_static_init() {
	  var n;        /* iterates over tree elements */
	  var bits;     /* bit counter */
	  var length;   /* length value */
	  var code;     /* code value */
	  var dist;     /* distance index */
	  var bl_count = new Array(MAX_BITS + 1);
	  /* number of codes at each bit length for an optimal tree */

	  // do check in _tr_init()
	  //if (static_init_done) return;

	  /* For some embedded targets, global variables are not initialized: */
	/*#ifdef NO_INIT_GLOBAL_POINTERS
	  static_l_desc.static_tree = static_ltree;
	  static_l_desc.extra_bits = extra_lbits;
	  static_d_desc.static_tree = static_dtree;
	  static_d_desc.extra_bits = extra_dbits;
	  static_bl_desc.extra_bits = extra_blbits;
	#endif*/

	  /* Initialize the mapping length (0..255) -> length code (0..28) */
	  length = 0;
	  for (code = 0; code < LENGTH_CODES - 1; code++) {
	    base_length[code] = length;
	    for (n = 0; n < (1 << extra_lbits[code]); n++) {
	      _length_code[length++] = code;
	    }
	  }
	  //Assert (length == 256, "tr_static_init: length != 256");
	  /* Note that the length 255 (match length 258) can be represented
	   * in two different ways: code 284 + 5 bits or code 285, so we
	   * overwrite length_code[255] to use the best encoding:
	   */
	  _length_code[length - 1] = code;

	  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
	  dist = 0;
	  for (code = 0; code < 16; code++) {
	    base_dist[code] = dist;
	    for (n = 0; n < (1 << extra_dbits[code]); n++) {
	      _dist_code[dist++] = code;
	    }
	  }
	  //Assert (dist == 256, "tr_static_init: dist != 256");
	  dist >>= 7; /* from now on, all distances are divided by 128 */
	  for (; code < D_CODES; code++) {
	    base_dist[code] = dist << 7;
	    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
	      _dist_code[256 + dist++] = code;
	    }
	  }
	  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

	  /* Construct the codes of the static literal tree */
	  for (bits = 0; bits <= MAX_BITS; bits++) {
	    bl_count[bits] = 0;
	  }

	  n = 0;
	  while (n <= 143) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 8;
	    n++;
	    bl_count[8]++;
	  }
	  while (n <= 255) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 9;
	    n++;
	    bl_count[9]++;
	  }
	  while (n <= 279) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 7;
	    n++;
	    bl_count[7]++;
	  }
	  while (n <= 287) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 8;
	    n++;
	    bl_count[8]++;
	  }
	  /* Codes 286 and 287 do not exist, but we must include them in the
	   * tree construction to get a canonical Huffman tree (longest code
	   * all ones)
	   */
	  gen_codes(static_ltree, L_CODES + 1, bl_count);

	  /* The static distance tree is trivial: */
	  for (n = 0; n < D_CODES; n++) {
	    static_dtree[n * 2 + 1]/*.Len*/ = 5;
	    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
	  }

	  // Now data ready and we can init static trees
	  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
	  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
	  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

	  //static_init_done = true;
	}


	/* ===========================================================================
	 * Initialize a new block.
	 */
	function init_block(s) {
	  var n; /* iterates over tree elements */

	  /* Initialize the trees. */
	  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
	  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
	  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

	  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
	  s.opt_len = s.static_len = 0;
	  s.last_lit = s.matches = 0;
	}


	/* ===========================================================================
	 * Flush the bit buffer and align the output on a byte boundary
	 */
	function bi_windup(s)
	{
	  if (s.bi_valid > 8) {
	    put_short(s, s.bi_buf);
	  } else if (s.bi_valid > 0) {
	    //put_byte(s, (Byte)s->bi_buf);
	    s.pending_buf[s.pending++] = s.bi_buf;
	  }
	  s.bi_buf = 0;
	  s.bi_valid = 0;
	}

	/* ===========================================================================
	 * Copy a stored block, storing first the length and its
	 * one's complement if requested.
	 */
	function copy_block(s, buf, len, header)
	//DeflateState *s;
	//charf    *buf;    /* the input data */
	//unsigned len;     /* its length */
	//int      header;  /* true if block header must be written */
	{
	  bi_windup(s);        /* align on byte boundary */

	  if (header) {
	    put_short(s, len);
	    put_short(s, ~len);
	  }
	//  while (len--) {
	//    put_byte(s, *buf++);
	//  }
	  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
	  s.pending += len;
	}

	/* ===========================================================================
	 * Compares to subtrees, using the tree depth as tie breaker when
	 * the subtrees have equal frequency. This minimizes the worst case length.
	 */
	function smaller(tree, n, m, depth) {
	  var _n2 = n * 2;
	  var _m2 = m * 2;
	  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
	         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
	}

	/* ===========================================================================
	 * Restore the heap property by moving down the tree starting at node k,
	 * exchanging a node with the smallest of its two sons if necessary, stopping
	 * when the heap property is re-established (each father smaller than its
	 * two sons).
	 */
	function pqdownheap(s, tree, k)
	//    deflate_state *s;
	//    ct_data *tree;  /* the tree to restore */
	//    int k;               /* node to move down */
	{
	  var v = s.heap[k];
	  var j = k << 1;  /* left son of k */
	  while (j <= s.heap_len) {
	    /* Set j to the smallest of the two sons: */
	    if (j < s.heap_len &&
	      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
	      j++;
	    }
	    /* Exit if v is smaller than both sons */
	    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

	    /* Exchange v with the smallest son */
	    s.heap[k] = s.heap[j];
	    k = j;

	    /* And continue down the tree, setting j to the left son of k */
	    j <<= 1;
	  }
	  s.heap[k] = v;
	}


	// inlined manually
	// var SMALLEST = 1;

	/* ===========================================================================
	 * Send the block data compressed using the given Huffman trees
	 */
	function compress_block(s, ltree, dtree)
	//    deflate_state *s;
	//    const ct_data *ltree; /* literal tree */
	//    const ct_data *dtree; /* distance tree */
	{
	  var dist;           /* distance of matched string */
	  var lc;             /* match length or unmatched char (if dist == 0) */
	  var lx = 0;         /* running index in l_buf */
	  var code;           /* the code to send */
	  var extra;          /* number of extra bits to send */

	  if (s.last_lit !== 0) {
	    do {
	      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
	      lc = s.pending_buf[s.l_buf + lx];
	      lx++;

	      if (dist === 0) {
	        send_code(s, lc, ltree); /* send a literal byte */
	        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
	      } else {
	        /* Here, lc is the match length - MIN_MATCH */
	        code = _length_code[lc];
	        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
	        extra = extra_lbits[code];
	        if (extra !== 0) {
	          lc -= base_length[code];
	          send_bits(s, lc, extra);       /* send the extra length bits */
	        }
	        dist--; /* dist is now the match distance - 1 */
	        code = d_code(dist);
	        //Assert (code < D_CODES, "bad d_code");

	        send_code(s, code, dtree);       /* send the distance code */
	        extra = extra_dbits[code];
	        if (extra !== 0) {
	          dist -= base_dist[code];
	          send_bits(s, dist, extra);   /* send the extra distance bits */
	        }
	      } /* literal or match pair ? */

	      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
	      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
	      //       "pendingBuf overflow");

	    } while (lx < s.last_lit);
	  }

	  send_code(s, END_BLOCK, ltree);
	}


	/* ===========================================================================
	 * Construct one Huffman tree and assigns the code bit strings and lengths.
	 * Update the total bit length for the current block.
	 * IN assertion: the field freq is set for all tree elements.
	 * OUT assertions: the fields len and code are set to the optimal bit length
	 *     and corresponding code. The length opt_len is updated; static_len is
	 *     also updated if stree is not null. The field max_code is set.
	 */
	function build_tree(s, desc)
	//    deflate_state *s;
	//    tree_desc *desc; /* the tree descriptor */
	{
	  var tree     = desc.dyn_tree;
	  var stree    = desc.stat_desc.static_tree;
	  var has_stree = desc.stat_desc.has_stree;
	  var elems    = desc.stat_desc.elems;
	  var n, m;          /* iterate over heap elements */
	  var max_code = -1; /* largest code with non zero frequency */
	  var node;          /* new node being created */

	  /* Construct the initial heap, with least frequent element in
	   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
	   * heap[0] is not used.
	   */
	  s.heap_len = 0;
	  s.heap_max = HEAP_SIZE;

	  for (n = 0; n < elems; n++) {
	    if (tree[n * 2]/*.Freq*/ !== 0) {
	      s.heap[++s.heap_len] = max_code = n;
	      s.depth[n] = 0;

	    } else {
	      tree[n * 2 + 1]/*.Len*/ = 0;
	    }
	  }

	  /* The pkzip format requires that at least one distance code exists,
	   * and that at least one bit should be sent even if there is only one
	   * possible code. So to avoid special checks later on we force at least
	   * two codes of non zero frequency.
	   */
	  while (s.heap_len < 2) {
	    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
	    tree[node * 2]/*.Freq*/ = 1;
	    s.depth[node] = 0;
	    s.opt_len--;

	    if (has_stree) {
	      s.static_len -= stree[node * 2 + 1]/*.Len*/;
	    }
	    /* node is 0 or 1 so it does not have extra bits */
	  }
	  desc.max_code = max_code;

	  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
	   * establish sub-heaps of increasing lengths:
	   */
	  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

	  /* Construct the Huffman tree by repeatedly combining the least two
	   * frequent nodes.
	   */
	  node = elems;              /* next internal node of the tree */
	  do {
	    //pqremove(s, tree, n);  /* n = node of least frequency */
	    /*** pqremove ***/
	    n = s.heap[1/*SMALLEST*/];
	    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
	    pqdownheap(s, tree, 1/*SMALLEST*/);
	    /***/

	    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

	    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
	    s.heap[--s.heap_max] = m;

	    /* Create a new node father of n and m */
	    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
	    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
	    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

	    /* and insert the new node in the heap */
	    s.heap[1/*SMALLEST*/] = node++;
	    pqdownheap(s, tree, 1/*SMALLEST*/);

	  } while (s.heap_len >= 2);

	  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

	  /* At this point, the fields freq and dad are set. We can now
	   * generate the bit lengths.
	   */
	  gen_bitlen(s, desc);

	  /* The field len is now set, we can generate the bit codes */
	  gen_codes(tree, max_code, s.bl_count);
	}


	/* ===========================================================================
	 * Scan a literal or distance tree to determine the frequencies of the codes
	 * in the bit length tree.
	 */
	function scan_tree(s, tree, max_code)
	//    deflate_state *s;
	//    ct_data *tree;   /* the tree to be scanned */
	//    int max_code;    /* and its largest code of non zero frequency */
	{
	  var n;                     /* iterates over all tree elements */
	  var prevlen = -1;          /* last emitted length */
	  var curlen;                /* length of current code */

	  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

	  var count = 0;             /* repeat count of the current code */
	  var max_count = 7;         /* max repeat count */
	  var min_count = 4;         /* min repeat count */

	  if (nextlen === 0) {
	    max_count = 138;
	    min_count = 3;
	  }
	  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

	  for (n = 0; n <= max_code; n++) {
	    curlen = nextlen;
	    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

	    if (++count < max_count && curlen === nextlen) {
	      continue;

	    } else if (count < min_count) {
	      s.bl_tree[curlen * 2]/*.Freq*/ += count;

	    } else if (curlen !== 0) {

	      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
	      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

	    } else if (count <= 10) {
	      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

	    } else {
	      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
	    }

	    count = 0;
	    prevlen = curlen;

	    if (nextlen === 0) {
	      max_count = 138;
	      min_count = 3;

	    } else if (curlen === nextlen) {
	      max_count = 6;
	      min_count = 3;

	    } else {
	      max_count = 7;
	      min_count = 4;
	    }
	  }
	}


	/* ===========================================================================
	 * Send a literal or distance tree in compressed form, using the codes in
	 * bl_tree.
	 */
	function send_tree(s, tree, max_code)
	//    deflate_state *s;
	//    ct_data *tree; /* the tree to be scanned */
	//    int max_code;       /* and its largest code of non zero frequency */
	{
	  var n;                     /* iterates over all tree elements */
	  var prevlen = -1;          /* last emitted length */
	  var curlen;                /* length of current code */

	  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

	  var count = 0;             /* repeat count of the current code */
	  var max_count = 7;         /* max repeat count */
	  var min_count = 4;         /* min repeat count */

	  /* tree[max_code+1].Len = -1; */  /* guard already set */
	  if (nextlen === 0) {
	    max_count = 138;
	    min_count = 3;
	  }

	  for (n = 0; n <= max_code; n++) {
	    curlen = nextlen;
	    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

	    if (++count < max_count && curlen === nextlen) {
	      continue;

	    } else if (count < min_count) {
	      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

	    } else if (curlen !== 0) {
	      if (curlen !== prevlen) {
	        send_code(s, curlen, s.bl_tree);
	        count--;
	      }
	      //Assert(count >= 3 && count <= 6, " 3_6?");
	      send_code(s, REP_3_6, s.bl_tree);
	      send_bits(s, count - 3, 2);

	    } else if (count <= 10) {
	      send_code(s, REPZ_3_10, s.bl_tree);
	      send_bits(s, count - 3, 3);

	    } else {
	      send_code(s, REPZ_11_138, s.bl_tree);
	      send_bits(s, count - 11, 7);
	    }

	    count = 0;
	    prevlen = curlen;
	    if (nextlen === 0) {
	      max_count = 138;
	      min_count = 3;

	    } else if (curlen === nextlen) {
	      max_count = 6;
	      min_count = 3;

	    } else {
	      max_count = 7;
	      min_count = 4;
	    }
	  }
	}


	/* ===========================================================================
	 * Construct the Huffman tree for the bit lengths and return the index in
	 * bl_order of the last bit length code to send.
	 */
	function build_bl_tree(s) {
	  var max_blindex;  /* index of last bit length code of non zero freq */

	  /* Determine the bit length frequencies for literal and distance trees */
	  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
	  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

	  /* Build the bit length tree: */
	  build_tree(s, s.bl_desc);
	  /* opt_len now includes the length of the tree representations, except
	   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
	   */

	  /* Determine the number of bit length codes to send. The pkzip format
	   * requires that at least 4 bit length codes be sent. (appnote.txt says
	   * 3 but the actual value used is 4.)
	   */
	  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
	    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
	      break;
	    }
	  }
	  /* Update opt_len to include the bit length tree and counts */
	  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
	  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
	  //        s->opt_len, s->static_len));

	  return max_blindex;
	}


	/* ===========================================================================
	 * Send the header for a block using dynamic Huffman trees: the counts, the
	 * lengths of the bit length codes, the literal tree and the distance tree.
	 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
	 */
	function send_all_trees(s, lcodes, dcodes, blcodes)
	//    deflate_state *s;
	//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
	{
	  var rank;                    /* index in bl_order */

	  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
	  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
	  //        "too many codes");
	  //Tracev((stderr, "\nbl counts: "));
	  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
	  send_bits(s, dcodes - 1,   5);
	  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
	  for (rank = 0; rank < blcodes; rank++) {
	    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
	    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
	  }
	  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

	  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
	  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

	  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
	  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
	}


	/* ===========================================================================
	 * Check if the data type is TEXT or BINARY, using the following algorithm:
	 * - TEXT if the two conditions below are satisfied:
	 *    a) There are no non-portable control characters belonging to the
	 *       "black list" (0..6, 14..25, 28..31).
	 *    b) There is at least one printable character belonging to the
	 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
	 * - BINARY otherwise.
	 * - The following partially-portable control characters form a
	 *   "gray list" that is ignored in this detection algorithm:
	 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
	 * IN assertion: the fields Freq of dyn_ltree are set.
	 */
	function detect_data_type(s) {
	  /* black_mask is the bit mask of black-listed bytes
	   * set bits 0..6, 14..25, and 28..31
	   * 0xf3ffc07f = binary 11110011111111111100000001111111
	   */
	  var black_mask = 0xf3ffc07f;
	  var n;

	  /* Check for non-textual ("black-listed") bytes. */
	  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
	    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
	      return Z_BINARY;
	    }
	  }

	  /* Check for textual ("white-listed") bytes. */
	  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
	      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
	    return Z_TEXT;
	  }
	  for (n = 32; n < LITERALS; n++) {
	    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
	      return Z_TEXT;
	    }
	  }

	  /* There are no "black-listed" or "white-listed" bytes:
	   * this stream either is empty or has tolerated ("gray-listed") bytes only.
	   */
	  return Z_BINARY;
	}


	var static_init_done = false;

	/* ===========================================================================
	 * Initialize the tree data structures for a new zlib stream.
	 */
	function _tr_init(s)
	{

	  if (!static_init_done) {
	    tr_static_init();
	    static_init_done = true;
	  }

	  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
	  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
	  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

	  s.bi_buf = 0;
	  s.bi_valid = 0;

	  /* Initialize the first block of the first file: */
	  init_block(s);
	}


	/* ===========================================================================
	 * Send a stored block
	 */
	function _tr_stored_block(s, buf, stored_len, last)
	//DeflateState *s;
	//charf *buf;       /* input block */
	//ulg stored_len;   /* length of input block */
	//int last;         /* one if this is the last block for a file */
	{
	  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
	  copy_block(s, buf, stored_len, true); /* with header */
	}


	/* ===========================================================================
	 * Send one empty static block to give enough lookahead for inflate.
	 * This takes 10 bits, of which 7 may remain in the bit buffer.
	 */
	function _tr_align(s) {
	  send_bits(s, STATIC_TREES << 1, 3);
	  send_code(s, END_BLOCK, static_ltree);
	  bi_flush(s);
	}


	/* ===========================================================================
	 * Determine the best encoding for the current block: dynamic trees, static
	 * trees or store, and output the encoded block to the zip file.
	 */
	function _tr_flush_block(s, buf, stored_len, last)
	//DeflateState *s;
	//charf *buf;       /* input block, or NULL if too old */
	//ulg stored_len;   /* length of input block */
	//int last;         /* one if this is the last block for a file */
	{
	  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
	  var max_blindex = 0;        /* index of last bit length code of non zero freq */

	  /* Build the Huffman trees unless a stored block is forced */
	  if (s.level > 0) {

	    /* Check if the file is binary or text */
	    if (s.strm.data_type === Z_UNKNOWN) {
	      s.strm.data_type = detect_data_type(s);
	    }

	    /* Construct the literal and distance trees */
	    build_tree(s, s.l_desc);
	    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
	    //        s->static_len));

	    build_tree(s, s.d_desc);
	    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
	    //        s->static_len));
	    /* At this point, opt_len and static_len are the total bit lengths of
	     * the compressed block data, excluding the tree representations.
	     */

	    /* Build the bit length tree for the above two trees, and get the index
	     * in bl_order of the last bit length code to send.
	     */
	    max_blindex = build_bl_tree(s);

	    /* Determine the best encoding. Compute the block lengths in bytes. */
	    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
	    static_lenb = (s.static_len + 3 + 7) >>> 3;

	    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
	    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
	    //        s->last_lit));

	    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

	  } else {
	    // Assert(buf != (char*)0, "lost buf");
	    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
	  }

	  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
	    /* 4: two words for the lengths */

	    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
	     * Otherwise we can't have processed more than WSIZE input bytes since
	     * the last block flush, because compression would have been
	     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
	     * transform a block into a stored block.
	     */
	    _tr_stored_block(s, buf, stored_len, last);

	  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

	    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
	    compress_block(s, static_ltree, static_dtree);

	  } else {
	    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
	    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
	    compress_block(s, s.dyn_ltree, s.dyn_dtree);
	  }
	  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
	  /* The above check is made mod 2^32, for files larger than 512 MB
	   * and uLong implemented on 32 bits.
	   */
	  init_block(s);

	  if (last) {
	    bi_windup(s);
	  }
	  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
	  //       s->compressed_len-7*last));
	}

	/* ===========================================================================
	 * Save the match info and tally the frequency counts. Return true if
	 * the current block must be flushed.
	 */
	function _tr_tally(s, dist, lc)
	//    deflate_state *s;
	//    unsigned dist;  /* distance of matched string */
	//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
	{
	  //var out_length, in_length, dcode;

	  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
	  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

	  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
	  s.last_lit++;

	  if (dist === 0) {
	    /* lc is the unmatched char */
	    s.dyn_ltree[lc * 2]/*.Freq*/++;
	  } else {
	    s.matches++;
	    /* Here, lc is the match length - MIN_MATCH */
	    dist--;             /* dist = match distance - 1 */
	    //Assert((ush)dist < (ush)MAX_DIST(s) &&
	    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
	    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

	    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
	    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
	  }

	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility

	//#ifdef TRUNCATE_BLOCK
	//  /* Try to guess if it is profitable to stop the current block here */
	//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
	//    /* Compute an upper bound for the compressed length */
	//    out_length = s.last_lit*8;
	//    in_length = s.strstart - s.block_start;
	//
	//    for (dcode = 0; dcode < D_CODES; dcode++) {
	//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
	//    }
	//    out_length >>>= 3;
	//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
	//    //       s->last_lit, in_length, out_length,
	//    //       100L - out_length*100L/in_length));
	//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
	//      return true;
	//    }
	//  }
	//#endif

	  return (s.last_lit === s.lit_bufsize - 1);
	  /* We avoid equality with lit_bufsize because of wraparound at 64K
	   * on 16 bit machines and because stored blocks are restricted to
	   * 64K-1 bytes.
	   */
	}

	exports._tr_init  = _tr_init;
	exports._tr_stored_block = _tr_stored_block;
	exports._tr_flush_block  = _tr_flush_block;
	exports._tr_tally = _tr_tally;
	exports._tr_align = _tr_align;

	},{"../utils/common":41}],53:[function(require,module,exports){

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	function ZStream() {
	  /* next input byte */
	  this.input = null; // JS specific, because we have no pointers
	  this.next_in = 0;
	  /* number of bytes available at input */
	  this.avail_in = 0;
	  /* total number of input bytes read so far */
	  this.total_in = 0;
	  /* next output byte should be put there */
	  this.output = null; // JS specific, because we have no pointers
	  this.next_out = 0;
	  /* remaining free space at output */
	  this.avail_out = 0;
	  /* total number of bytes output so far */
	  this.total_out = 0;
	  /* last error message, NULL if no error */
	  this.msg = ''/*Z_NULL*/;
	  /* not visible by applications */
	  this.state = null;
	  /* best guess about the data type: binary or text */
	  this.data_type = 2/*Z_UNKNOWN*/;
	  /* adler32 value of the uncompressed data */
	  this.adler = 0;
	}

	module.exports = ZStream;

	},{}],54:[function(require,module,exports){
	(function (global){
	(function (global, undefined$1) {

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined$1, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	},{}]},{},[10])(10)
	});
	});

	/**
	 * Handles Unzipping a requesting files from an Epub Archive
	 * @class
	 */
	class Archive {
	  constructor() {
	    this.zip = undefined;
	    this.urlCache = {};
	    this.checkRequirements();
	  }

	  /**
	   * Checks to see if JSZip exists in global namspace,
	   * Requires JSZip if it isn't there
	   * @private
	   */
	  checkRequirements() {
	    try {
	      this.zip = new jszip();
	    } catch (e) {
	      throw new Error('JSZip lib not loaded');
	    }
	  }

	  /**
	   * Open an archive
	   * @param  {binary} input
	   * @param  {boolean} [isBase64] tells JSZip if the input data is base64 encoded
	   * @return {Promise} zipfile
	   */
	  open(input, isBase64) {
	    return this.zip.loadAsync(input, {
	      base64: isBase64
	    });
	  }

	  /**
	   * Load and Open an archive
	   * @param  {string} zipUrl
	   * @param  {boolean} [isBase64] tells JSZip if the input data is base64 encoded
	   * @return {Promise} zipfile
	   */
	  openUrl(zipUrl, isBase64) {
	    return request(zipUrl, 'binary').then(function (data) {
	      return this.zip.loadAsync(data, {
	        base64: isBase64
	      });
	    }.bind(this));
	  }

	  /**
	   * Request a url from the archive
	   * @param  {string} url  a url to request from the archive
	   * @param  {string} [type] specify the type of the returned result
	   * @return {Promise<Blob | string | JSON | Document | XMLDocument>}
	   */
	  request(url, type) {
	    var deferred = new core_1();
	    var response;
	    var path = new Path(url);

	    // If type isn't set, determine it from the file extension
	    if (!type) {
	      type = path.extension;
	    }
	    if (type == 'blob') {
	      response = this.getBlob(url);
	    } else {
	      response = this.getText(url);
	    }
	    if (response) {
	      response.then(function (r) {
	        let result = this.handleResponse(r, type);
	        deferred.resolve(result);
	      }.bind(this));
	    } else {
	      deferred.reject({
	        message: 'File not found in the epub: ' + url,
	        stack: new Error().stack
	      });
	    }
	    return deferred.promise;
	  }

	  /**
	   * Handle the response from request
	   * @private
	   * @param  {any} response
	   * @param  {string} [type]
	   * @return {any} the parsed result
	   */
	  handleResponse(response, type) {
	    var r;
	    if (type == 'json') {
	      r = JSON.parse(response);
	    } else if (core_18(type)) {
	      r = core_24(response, 'text/xml');
	    } else if (type == 'xhtml') {
	      r = core_24(response, 'application/xhtml+xml');
	    } else if (type == 'html' || type == 'htm') {
	      r = core_24(response, 'text/html');
	    } else {
	      r = response;
	    }
	    return r;
	  }

	  /**
	   * Get a Blob from Archive by Url
	   * @param  {string} url
	   * @param  {string} [mimeType]
	   * @return {Blob}
	   */
	  getBlob(url, mimeType) {
	    var decodededUrl = window.decodeURIComponent(url.substr(1)); // Remove first slash
	    var entry = this.zip.file(decodededUrl);
	    if (entry) {
	      mimeType = mimeType || mime$1.lookup(entry.name);
	      return entry.async('uint8array').then(function (uint8array) {
	        return new Blob([uint8array], {
	          type: mimeType
	        });
	      });
	    }
	  }

	  /**
	   * Get Text from Archive by Url
	   * @param  {string} url
	   * @param  {string} [encoding]
	   * @return {string}
	   */
	  getText(url) {
	    var decodededUrl = window.decodeURIComponent(url.substr(1)); // Remove first slash
	    var entry = this.zip.file(decodededUrl);
	    if (entry) {
	      return entry.async('string').then(function (text) {
	        return text;
	      });
	    }
	  }

	  /**
	   * Get a base64 encoded result from Archive by Url
	   * @param  {string} url
	   * @param  {string} [mimeType]
	   * @return {string} base64 encoded
	   */
	  getBase64(url, mimeType) {
	    var decodededUrl = window.decodeURIComponent(url.substr(1)); // Remove first slash
	    var entry = this.zip.file(decodededUrl);
	    if (entry) {
	      mimeType = mimeType || mime$1.lookup(entry.name);
	      return entry.async('base64').then(function (data) {
	        return 'data:' + mimeType + ';base64,' + data;
	      });
	    }
	  }

	  /**
	   * Create a Url from an unarchived item
	   * @param  {string} url
	   * @param  {object} [options.base64] use base64 encoding or blob url
	   * @return {Promise} url promise with Url string
	   */
	  createUrl(url, options) {
	    var deferred = new core_1();
	    var _URL = window.URL || window.webkitURL || window.mozURL;
	    var tempUrl;
	    var response;
	    var useBase64 = options && options.base64;
	    if (url in this.urlCache) {
	      deferred.resolve(this.urlCache[url]);
	      return deferred.promise;
	    }
	    if (useBase64) {
	      response = this.getBase64(url);
	      if (response) {
	        response.then(function (tempUrl) {
	          this.urlCache[url] = tempUrl;
	          deferred.resolve(tempUrl);
	        }.bind(this));
	      }
	    } else {
	      response = this.getBlob(url);
	      if (response) {
	        response.then(function (blob) {
	          tempUrl = _URL.createObjectURL(blob);
	          this.urlCache[url] = tempUrl;
	          deferred.resolve(tempUrl);
	        }.bind(this));
	      }
	    }
	    if (!response) {
	      deferred.reject({
	        message: 'File not found in the epub: ' + url,
	        stack: new Error().stack
	      });
	    }
	    return deferred.promise;
	  }

	  /**
	   * Revoke Temp Url for a archive item
	   * @param  {string} url url of the item in the archive
	   */
	  revokeUrl(url) {
	    var _URL = window.URL || window.webkitURL || window.mozURL;
	    var fromCache = this.urlCache[url];
	    if (fromCache) _URL.revokeObjectURL(fromCache);
	  }
	  destroy() {
	    var _URL = window.URL || window.webkitURL || window.mozURL;
	    for (let fromCache in this.urlCache) {
	      _URL.revokeObjectURL(fromCache);
	    }
	    this.zip = undefined;
	    this.urlCache = {};
	  }
	}

	var localforage = createCommonjsModule(function (module, exports) {
	/*!
	    localForage -- Offline Storage, Improved
	    Version 1.10.0
	    https://localforage.github.io/localForage
	    (c) 2013-2017 Mozilla, Apache License 2.0
	*/
	(function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	(function (global){
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	var scheduleDrain;

	{
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}

	}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	},{}],2:[function(_dereq_,module,exports){
	var immediate = _dereq_(1);

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];

	module.exports = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype["catch"] = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	Promise.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	Promise.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	Promise.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	Promise.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}

	},{"1":1}],3:[function(_dereq_,module,exports){
	(function (global){
	if (typeof global.Promise !== 'function') {
	  global.Promise = _dereq_(2);
	}

	}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	},{"2":2}],4:[function(_dereq_,module,exports){

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function getIDB() {
	    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
	    try {
	        if (typeof indexedDB !== 'undefined') {
	            return indexedDB;
	        }
	        if (typeof webkitIndexedDB !== 'undefined') {
	            return webkitIndexedDB;
	        }
	        if (typeof mozIndexedDB !== 'undefined') {
	            return mozIndexedDB;
	        }
	        if (typeof OIndexedDB !== 'undefined') {
	            return OIndexedDB;
	        }
	        if (typeof msIndexedDB !== 'undefined') {
	            return msIndexedDB;
	        }
	    } catch (e) {
	        return;
	    }
	}

	var idb = getIDB();

	function isIndexedDBValid() {
	    try {
	        // Initialize IndexedDB; fall back to vendor-prefixed versions
	        // if needed.
	        if (!idb || !idb.open) {
	            return false;
	        }
	        // We mimic PouchDB here;
	        //
	        // We test for openDatabase because IE Mobile identifies itself
	        // as Safari. Oh the lulz...
	        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

	        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

	        // Safari <10.1 does not meet our requirements for IDB support
	        // (see: https://github.com/pouchdb/pouchdb/issues/5572).
	        // Safari 10.1 shipped with fetch, we can use that to detect it.
	        // Note: this creates issues with `window.fetch` polyfills and
	        // overrides; see:
	        // https://github.com/localForage/localForage/issues/856
	        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
	        // some outdated implementations of IDB that appear on Samsung
	        // and HTC Android devices <4.4 are missing IDBKeyRange
	        // See: https://github.com/mozilla/localForage/issues/128
	        // See: https://github.com/mozilla/localForage/issues/272
	        typeof IDBKeyRange !== 'undefined';
	    } catch (e) {
	        return false;
	    }
	}

	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	function createBlob(parts, properties) {
	    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
	    parts = parts || [];
	    properties = properties || {};
	    try {
	        return new Blob(parts, properties);
	    } catch (e) {
	        if (e.name !== 'TypeError') {
	            throw e;
	        }
	        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
	        var builder = new Builder();
	        for (var i = 0; i < parts.length; i += 1) {
	            builder.append(parts[i]);
	        }
	        return builder.getBlob(properties.type);
	    }
	}

	// This is CommonJS because lie is an external dependency, so Rollup
	// can just ignore it.
	if (typeof Promise === 'undefined') {
	    // In the "nopromises" build this will just throw if you don't have
	    // a global promise object, but it would throw anyway later.
	    _dereq_(3);
	}
	var Promise$1 = Promise;

	function executeCallback(promise, callback) {
	    if (callback) {
	        promise.then(function (result) {
	            callback(null, result);
	        }, function (error) {
	            callback(error);
	        });
	    }
	}

	function executeTwoCallbacks(promise, callback, errorCallback) {
	    if (typeof callback === 'function') {
	        promise.then(callback);
	    }

	    if (typeof errorCallback === 'function') {
	        promise["catch"](errorCallback);
	    }
	}

	function normalizeKey(key) {
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }

	    return key;
	}

	function getCallback() {
	    if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
	        return arguments[arguments.length - 1];
	    }
	}

	// Some code originally from async_storage.js in
	// [Gaia](https://github.com/mozilla-b2g/gaia).

	var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
	var supportsBlobs = void 0;
	var dbContexts = {};
	var toString = Object.prototype.toString;

	// Transaction Modes
	var READ_ONLY = 'readonly';
	var READ_WRITE = 'readwrite';

	// Transform a binary string to an array buffer, because otherwise
	// weird stuff happens when you try to work with the binary string directly.
	// It is known.
	// From http://stackoverflow.com/questions/14967647/ (continues on next line)
	// encode-decode-image-with-base64-breaks-image (2013-04-21)
	function _binStringToArrayBuffer(bin) {
	    var length = bin.length;
	    var buf = new ArrayBuffer(length);
	    var arr = new Uint8Array(buf);
	    for (var i = 0; i < length; i++) {
	        arr[i] = bin.charCodeAt(i);
	    }
	    return buf;
	}

	//
	// Blobs are not supported in all versions of IndexedDB, notably
	// Chrome <37 and Android <5. In those versions, storing a blob will throw.
	//
	// Various other blob bugs exist in Chrome v37-42 (inclusive).
	// Detecting them is expensive and confusing to users, and Chrome 37-42
	// is at very low usage worldwide, so we do a hacky userAgent check instead.
	//
	// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
	// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
	// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
	//
	// Code borrowed from PouchDB. See:
	// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
	//
	function _checkBlobSupportWithoutCaching(idb) {
	    return new Promise$1(function (resolve) {
	        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
	        var blob = createBlob(['']);
	        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

	        txn.onabort = function (e) {
	            // If the transaction aborts now its due to not being able to
	            // write to the database, likely due to the disk being full
	            e.preventDefault();
	            e.stopPropagation();
	            resolve(false);
	        };

	        txn.oncomplete = function () {
	            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
	            var matchedEdge = navigator.userAgent.match(/Edge\//);
	            // MS Edge pretends to be Chrome 42:
	            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
	            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
	        };
	    })["catch"](function () {
	        return false; // error, so assume unsupported
	    });
	}

	function _checkBlobSupport(idb) {
	    if (typeof supportsBlobs === 'boolean') {
	        return Promise$1.resolve(supportsBlobs);
	    }
	    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
	        supportsBlobs = value;
	        return supportsBlobs;
	    });
	}

	function _deferReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];

	    // Create a deferred object representing the current database operation.
	    var deferredOperation = {};

	    deferredOperation.promise = new Promise$1(function (resolve, reject) {
	        deferredOperation.resolve = resolve;
	        deferredOperation.reject = reject;
	    });

	    // Enqueue the deferred operation.
	    dbContext.deferredOperations.push(deferredOperation);

	    // Chain its promise to the database readiness.
	    if (!dbContext.dbReady) {
	        dbContext.dbReady = deferredOperation.promise;
	    } else {
	        dbContext.dbReady = dbContext.dbReady.then(function () {
	            return deferredOperation.promise;
	        });
	    }
	}

	function _advanceReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];

	    // Dequeue a deferred operation.
	    var deferredOperation = dbContext.deferredOperations.pop();

	    // Resolve its promise (which is part of the database readiness
	    // chain of promises).
	    if (deferredOperation) {
	        deferredOperation.resolve();
	        return deferredOperation.promise;
	    }
	}

	function _rejectReadiness(dbInfo, err) {
	    var dbContext = dbContexts[dbInfo.name];

	    // Dequeue a deferred operation.
	    var deferredOperation = dbContext.deferredOperations.pop();

	    // Reject its promise (which is part of the database readiness
	    // chain of promises).
	    if (deferredOperation) {
	        deferredOperation.reject(err);
	        return deferredOperation.promise;
	    }
	}

	function _getConnection(dbInfo, upgradeNeeded) {
	    return new Promise$1(function (resolve, reject) {
	        dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

	        if (dbInfo.db) {
	            if (upgradeNeeded) {
	                _deferReadiness(dbInfo);
	                dbInfo.db.close();
	            } else {
	                return resolve(dbInfo.db);
	            }
	        }

	        var dbArgs = [dbInfo.name];

	        if (upgradeNeeded) {
	            dbArgs.push(dbInfo.version);
	        }

	        var openreq = idb.open.apply(idb, dbArgs);

	        if (upgradeNeeded) {
	            openreq.onupgradeneeded = function (e) {
	                var db = openreq.result;
	                try {
	                    db.createObjectStore(dbInfo.storeName);
	                    if (e.oldVersion <= 1) {
	                        // Added when support for blob shims was added
	                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
	                    }
	                } catch (ex) {
	                    if (ex.name === 'ConstraintError') {
	                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
	                    } else {
	                        throw ex;
	                    }
	                }
	            };
	        }

	        openreq.onerror = function (e) {
	            e.preventDefault();
	            reject(openreq.error);
	        };

	        openreq.onsuccess = function () {
	            var db = openreq.result;
	            db.onversionchange = function (e) {
	                // Triggered when the database is modified (e.g. adding an objectStore) or
	                // deleted (even when initiated by other sessions in different tabs).
	                // Closing the connection here prevents those operations from being blocked.
	                // If the database is accessed again later by this instance, the connection
	                // will be reopened or the database recreated as needed.
	                e.target.close();
	            };
	            resolve(db);
	            _advanceReadiness(dbInfo);
	        };
	    });
	}

	function _getOriginalConnection(dbInfo) {
	    return _getConnection(dbInfo, false);
	}

	function _getUpgradedConnection(dbInfo) {
	    return _getConnection(dbInfo, true);
	}

	function _isUpgradeNeeded(dbInfo, defaultVersion) {
	    if (!dbInfo.db) {
	        return true;
	    }

	    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
	    var isDowngrade = dbInfo.version < dbInfo.db.version;
	    var isUpgrade = dbInfo.version > dbInfo.db.version;

	    if (isDowngrade) {
	        // If the version is not the default one
	        // then warn for impossible downgrade.
	        if (dbInfo.version !== defaultVersion) {
	            console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
	        }
	        // Align the versions to prevent errors.
	        dbInfo.version = dbInfo.db.version;
	    }

	    if (isUpgrade || isNewStore) {
	        // If the store is new then increment the version (if needed).
	        // This will trigger an "upgradeneeded" event which is required
	        // for creating a store.
	        if (isNewStore) {
	            var incVersion = dbInfo.db.version + 1;
	            if (incVersion > dbInfo.version) {
	                dbInfo.version = incVersion;
	            }
	        }

	        return true;
	    }

	    return false;
	}

	// encode a blob for indexeddb engines that don't support blobs
	function _encodeBlob(blob) {
	    return new Promise$1(function (resolve, reject) {
	        var reader = new FileReader();
	        reader.onerror = reject;
	        reader.onloadend = function (e) {
	            var base64 = btoa(e.target.result || '');
	            resolve({
	                __local_forage_encoded_blob: true,
	                data: base64,
	                type: blob.type
	            });
	        };
	        reader.readAsBinaryString(blob);
	    });
	}

	// decode an encoded blob
	function _decodeBlob(encodedBlob) {
	    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
	    return createBlob([arrayBuff], { type: encodedBlob.type });
	}

	// is this one of our fancy encoded blobs?
	function _isEncodedBlob(value) {
	    return value && value.__local_forage_encoded_blob;
	}

	// Specialize the default `ready()` function by making it dependent
	// on the current database operations. Thus, the driver will be actually
	// ready when it's been initialized (default) *and* there are no pending
	// operations on the database (initiated by some other instances).
	function _fullyReady(callback) {
	    var self = this;

	    var promise = self._initReady().then(function () {
	        var dbContext = dbContexts[self._dbInfo.name];

	        if (dbContext && dbContext.dbReady) {
	            return dbContext.dbReady;
	        }
	    });

	    executeTwoCallbacks(promise, callback, callback);
	    return promise;
	}

	// Try to establish a new db connection to replace the
	// current one which is broken (i.e. experiencing
	// InvalidStateError while creating a transaction).
	function _tryReconnect(dbInfo) {
	    _deferReadiness(dbInfo);

	    var dbContext = dbContexts[dbInfo.name];
	    var forages = dbContext.forages;

	    for (var i = 0; i < forages.length; i++) {
	        var forage = forages[i];
	        if (forage._dbInfo.db) {
	            forage._dbInfo.db.close();
	            forage._dbInfo.db = null;
	        }
	    }
	    dbInfo.db = null;

	    return _getOriginalConnection(dbInfo).then(function (db) {
	        dbInfo.db = db;
	        if (_isUpgradeNeeded(dbInfo)) {
	            // Reopen the database for upgrading.
	            return _getUpgradedConnection(dbInfo);
	        }
	        return db;
	    }).then(function (db) {
	        // store the latest db reference
	        // in case the db was upgraded
	        dbInfo.db = dbContext.db = db;
	        for (var i = 0; i < forages.length; i++) {
	            forages[i]._dbInfo.db = db;
	        }
	    })["catch"](function (err) {
	        _rejectReadiness(dbInfo, err);
	        throw err;
	    });
	}

	// FF doesn't like Promises (micro-tasks) and IDDB store operations,
	// so we have to do it with callbacks
	function createTransaction(dbInfo, mode, callback, retries) {
	    if (retries === undefined) {
	        retries = 1;
	    }

	    try {
	        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
	        callback(null, tx);
	    } catch (err) {
	        if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
	            return Promise$1.resolve().then(function () {
	                if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
	                    // increase the db version, to create the new ObjectStore
	                    if (dbInfo.db) {
	                        dbInfo.version = dbInfo.db.version + 1;
	                    }
	                    // Reopen the database for upgrading.
	                    return _getUpgradedConnection(dbInfo);
	                }
	            }).then(function () {
	                return _tryReconnect(dbInfo).then(function () {
	                    createTransaction(dbInfo, mode, callback, retries - 1);
	                });
	            })["catch"](callback);
	        }

	        callback(err);
	    }
	}

	function createDbContext() {
	    return {
	        // Running localForages sharing a database.
	        forages: [],
	        // Shared database.
	        db: null,
	        // Database readiness (promise).
	        dbReady: null,
	        // Deferred operations on the database.
	        deferredOperations: []
	    };
	}

	// Open the IndexedDB database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };

	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }

	    // Get the current context of the database;
	    var dbContext = dbContexts[dbInfo.name];

	    // ...or create a new context.
	    if (!dbContext) {
	        dbContext = createDbContext();
	        // Register the new context in the global container.
	        dbContexts[dbInfo.name] = dbContext;
	    }

	    // Register itself as a running localForage in the current context.
	    dbContext.forages.push(self);

	    // Replace the default `ready()` function with the specialized one.
	    if (!self._initReady) {
	        self._initReady = self.ready;
	        self.ready = _fullyReady;
	    }

	    // Create an array of initialization states of the related localForages.
	    var initPromises = [];

	    function ignoreErrors() {
	        // Don't handle errors here,
	        // just makes sure related localForages aren't pending.
	        return Promise$1.resolve();
	    }

	    for (var j = 0; j < dbContext.forages.length; j++) {
	        var forage = dbContext.forages[j];
	        if (forage !== self) {
	            // Don't wait for itself...
	            initPromises.push(forage._initReady()["catch"](ignoreErrors));
	        }
	    }

	    // Take a snapshot of the related localForages.
	    var forages = dbContext.forages.slice(0);

	    // Initialize the connection process only when
	    // all the related localForages aren't pending.
	    return Promise$1.all(initPromises).then(function () {
	        dbInfo.db = dbContext.db;
	        // Get the connection or open a new one without upgrade.
	        return _getOriginalConnection(dbInfo);
	    }).then(function (db) {
	        dbInfo.db = db;
	        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
	            // Reopen the database for upgrading.
	            return _getUpgradedConnection(dbInfo);
	        }
	        return db;
	    }).then(function (db) {
	        dbInfo.db = dbContext.db = db;
	        self._dbInfo = dbInfo;
	        // Share the final connection amongst related localForages.
	        for (var k = 0; k < forages.length; k++) {
	            var forage = forages[k];
	            if (forage !== self) {
	                // Self is already up-to-date.
	                forage._dbInfo.db = dbInfo.db;
	                forage._dbInfo.version = dbInfo.version;
	            }
	        }
	    });
	}

	function getItem(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.get(key);

	                    req.onsuccess = function () {
	                        var value = req.result;
	                        if (value === undefined) {
	                            value = null;
	                        }
	                        if (_isEncodedBlob(value)) {
	                            value = _decodeBlob(value);
	                        }
	                        resolve(value);
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Iterate over all items stored in database.
	function iterate(iterator, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.openCursor();
	                    var iterationNumber = 1;

	                    req.onsuccess = function () {
	                        var cursor = req.result;

	                        if (cursor) {
	                            var value = cursor.value;
	                            if (_isEncodedBlob(value)) {
	                                value = _decodeBlob(value);
	                            }
	                            var result = iterator(value, cursor.key, iterationNumber++);

	                            // when the iterator callback returns any
	                            // (non-`undefined`) value, then we stop
	                            // the iteration immediately
	                            if (result !== void 0) {
	                                resolve(result);
	                            } else {
	                                cursor["continue"]();
	                            }
	                        } else {
	                            resolve();
	                        }
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);

	    return promise;
	}

	function setItem(key, value, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        var dbInfo;
	        self.ready().then(function () {
	            dbInfo = self._dbInfo;
	            if (toString.call(value) === '[object Blob]') {
	                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
	                    if (blobSupport) {
	                        return value;
	                    }
	                    return _encodeBlob(value);
	                });
	            }
	            return value;
	        }).then(function (value) {
	            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);

	                    // The reason we don't _save_ null is because IE 10 does
	                    // not support saving the `null` type in IndexedDB. How
	                    // ironic, given the bug below!
	                    // See: https://github.com/mozilla/localForage/issues/161
	                    if (value === null) {
	                        value = undefined;
	                    }

	                    var req = store.put(value, key);

	                    transaction.oncomplete = function () {
	                        // Cast to undefined so the value passed to
	                        // callback/promise is the same as what one would get out
	                        // of `getItem()` later. This leads to some weirdness
	                        // (setItem('foo', undefined) will return `null`), but
	                        // it's not my fault localStorage is our baseline and that
	                        // it's weird.
	                        if (value === undefined) {
	                            value = null;
	                        }

	                        resolve(value);
	                    };
	                    transaction.onabort = transaction.onerror = function () {
	                        var err = req.error ? req.error : req.transaction.error;
	                        reject(err);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function removeItem(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    // We use a Grunt task to make this safe for IE and some
	                    // versions of Android (including those used by Cordova).
	                    // Normally IE won't like `.delete()` and will insist on
	                    // using `['delete']()`, but we have a build step that
	                    // fixes this for us now.
	                    var req = store["delete"](key);
	                    transaction.oncomplete = function () {
	                        resolve();
	                    };

	                    transaction.onerror = function () {
	                        reject(req.error);
	                    };

	                    // The request will be also be aborted if we've exceeded our storage
	                    // space.
	                    transaction.onabort = function () {
	                        var err = req.error ? req.error : req.transaction.error;
	                        reject(err);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function clear(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.clear();

	                    transaction.oncomplete = function () {
	                        resolve();
	                    };

	                    transaction.onabort = transaction.onerror = function () {
	                        var err = req.error ? req.error : req.transaction.error;
	                        reject(err);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function length(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.count();

	                    req.onsuccess = function () {
	                        resolve(req.result);
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function key(n, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        if (n < 0) {
	            resolve(null);

	            return;
	        }

	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var advanced = false;
	                    var req = store.openKeyCursor();

	                    req.onsuccess = function () {
	                        var cursor = req.result;
	                        if (!cursor) {
	                            // this means there weren't enough keys
	                            resolve(null);

	                            return;
	                        }

	                        if (n === 0) {
	                            // We have the first key, return it if that's what they
	                            // wanted.
	                            resolve(cursor.key);
	                        } else {
	                            if (!advanced) {
	                                // Otherwise, ask the cursor to skip ahead n
	                                // records.
	                                advanced = true;
	                                cursor.advance(n);
	                            } else {
	                                // When we get here, we've got the nth key.
	                                resolve(cursor.key);
	                            }
	                        }
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function keys(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.openKeyCursor();
	                    var keys = [];

	                    req.onsuccess = function () {
	                        var cursor = req.result;

	                        if (!cursor) {
	                            resolve(keys);
	                            return;
	                        }

	                        keys.push(cursor.key);
	                        cursor["continue"]();
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function dropInstance(options, callback) {
	    callback = getCallback.apply(this, arguments);

	    var currentConfig = this.config();
	    options = typeof options !== 'function' && options || {};
	    if (!options.name) {
	        options.name = options.name || currentConfig.name;
	        options.storeName = options.storeName || currentConfig.storeName;
	    }

	    var self = this;
	    var promise;
	    if (!options.name) {
	        promise = Promise$1.reject('Invalid arguments');
	    } else {
	        var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

	        var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
	            var dbContext = dbContexts[options.name];
	            var forages = dbContext.forages;
	            dbContext.db = db;
	            for (var i = 0; i < forages.length; i++) {
	                forages[i]._dbInfo.db = db;
	            }
	            return db;
	        });

	        if (!options.storeName) {
	            promise = dbPromise.then(function (db) {
	                _deferReadiness(options);

	                var dbContext = dbContexts[options.name];
	                var forages = dbContext.forages;

	                db.close();
	                for (var i = 0; i < forages.length; i++) {
	                    var forage = forages[i];
	                    forage._dbInfo.db = null;
	                }

	                var dropDBPromise = new Promise$1(function (resolve, reject) {
	                    var req = idb.deleteDatabase(options.name);

	                    req.onerror = function () {
	                        var db = req.result;
	                        if (db) {
	                            db.close();
	                        }
	                        reject(req.error);
	                    };

	                    req.onblocked = function () {
	                        // Closing all open connections in onversionchange handler should prevent this situation, but if
	                        // we do get here, it just means the request remains pending - eventually it will succeed or error
	                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
	                    };

	                    req.onsuccess = function () {
	                        var db = req.result;
	                        if (db) {
	                            db.close();
	                        }
	                        resolve(db);
	                    };
	                });

	                return dropDBPromise.then(function (db) {
	                    dbContext.db = db;
	                    for (var i = 0; i < forages.length; i++) {
	                        var _forage = forages[i];
	                        _advanceReadiness(_forage._dbInfo);
	                    }
	                })["catch"](function (err) {
	                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
	                    throw err;
	                });
	            });
	        } else {
	            promise = dbPromise.then(function (db) {
	                if (!db.objectStoreNames.contains(options.storeName)) {
	                    return;
	                }

	                var newVersion = db.version + 1;

	                _deferReadiness(options);

	                var dbContext = dbContexts[options.name];
	                var forages = dbContext.forages;

	                db.close();
	                for (var i = 0; i < forages.length; i++) {
	                    var forage = forages[i];
	                    forage._dbInfo.db = null;
	                    forage._dbInfo.version = newVersion;
	                }

	                var dropObjectPromise = new Promise$1(function (resolve, reject) {
	                    var req = idb.open(options.name, newVersion);

	                    req.onerror = function (err) {
	                        var db = req.result;
	                        db.close();
	                        reject(err);
	                    };

	                    req.onupgradeneeded = function () {
	                        var db = req.result;
	                        db.deleteObjectStore(options.storeName);
	                    };

	                    req.onsuccess = function () {
	                        var db = req.result;
	                        db.close();
	                        resolve(db);
	                    };
	                });

	                return dropObjectPromise.then(function (db) {
	                    dbContext.db = db;
	                    for (var j = 0; j < forages.length; j++) {
	                        var _forage2 = forages[j];
	                        _forage2._dbInfo.db = db;
	                        _advanceReadiness(_forage2._dbInfo);
	                    }
	                })["catch"](function (err) {
	                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
	                    throw err;
	                });
	            });
	        }
	    }

	    executeCallback(promise, callback);
	    return promise;
	}

	var asyncStorage = {
	    _driver: 'asyncStorage',
	    _initStorage: _initStorage,
	    _support: isIndexedDBValid(),
	    iterate: iterate,
	    getItem: getItem,
	    setItem: setItem,
	    removeItem: removeItem,
	    clear: clear,
	    length: length,
	    key: key,
	    keys: keys,
	    dropInstance: dropInstance
	};

	function isWebSQLValid() {
	    return typeof openDatabase === 'function';
	}

	// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
	// it to Base64, so this is how we store it to prevent very strange errors with less
	// verbose ways of binary <-> string data storage.
	var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	var BLOB_TYPE_PREFIX = '~~local_forage_type~';
	var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

	var SERIALIZED_MARKER = '__lfsc__:';
	var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

	// OMG the serializations!
	var TYPE_ARRAYBUFFER = 'arbf';
	var TYPE_BLOB = 'blob';
	var TYPE_INT8ARRAY = 'si08';
	var TYPE_UINT8ARRAY = 'ui08';
	var TYPE_UINT8CLAMPEDARRAY = 'uic8';
	var TYPE_INT16ARRAY = 'si16';
	var TYPE_INT32ARRAY = 'si32';
	var TYPE_UINT16ARRAY = 'ur16';
	var TYPE_UINT32ARRAY = 'ui32';
	var TYPE_FLOAT32ARRAY = 'fl32';
	var TYPE_FLOAT64ARRAY = 'fl64';
	var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

	var toString$1 = Object.prototype.toString;

	function stringToBuffer(serializedString) {
	    // Fill the string into a ArrayBuffer.
	    var bufferLength = serializedString.length * 0.75;
	    var len = serializedString.length;
	    var i;
	    var p = 0;
	    var encoded1, encoded2, encoded3, encoded4;

	    if (serializedString[serializedString.length - 1] === '=') {
	        bufferLength--;
	        if (serializedString[serializedString.length - 2] === '=') {
	            bufferLength--;
	        }
	    }

	    var buffer = new ArrayBuffer(bufferLength);
	    var bytes = new Uint8Array(buffer);

	    for (i = 0; i < len; i += 4) {
	        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
	        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
	        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
	        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

	        /*jslint bitwise: true */
	        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
	        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
	        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	    }
	    return buffer;
	}

	// Converts a buffer to a string to store, serialized, in the backend
	// storage library.
	function bufferToString(buffer) {
	    // base64-arraybuffer
	    var bytes = new Uint8Array(buffer);
	    var base64String = '';
	    var i;

	    for (i = 0; i < bytes.length; i += 3) {
	        /*jslint bitwise: true */
	        base64String += BASE_CHARS[bytes[i] >> 2];
	        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
	        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
	        base64String += BASE_CHARS[bytes[i + 2] & 63];
	    }

	    if (bytes.length % 3 === 2) {
	        base64String = base64String.substring(0, base64String.length - 1) + '=';
	    } else if (bytes.length % 3 === 1) {
	        base64String = base64String.substring(0, base64String.length - 2) + '==';
	    }

	    return base64String;
	}

	// Serialize a value, afterwards executing a callback (which usually
	// instructs the `setItem()` callback/promise to be executed). This is how
	// we store binary data with localStorage.
	function serialize(value, callback) {
	    var valueType = '';
	    if (value) {
	        valueType = toString$1.call(value);
	    }

	    // Cannot use `value instanceof ArrayBuffer` or such here, as these
	    // checks fail when running the tests using casper.js...
	    //
	    // TODO: See why those tests fail and use a better solution.
	    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
	        // Convert binary arrays to a string and prefix the string with
	        // a special marker.
	        var buffer;
	        var marker = SERIALIZED_MARKER;

	        if (value instanceof ArrayBuffer) {
	            buffer = value;
	            marker += TYPE_ARRAYBUFFER;
	        } else {
	            buffer = value.buffer;

	            if (valueType === '[object Int8Array]') {
	                marker += TYPE_INT8ARRAY;
	            } else if (valueType === '[object Uint8Array]') {
	                marker += TYPE_UINT8ARRAY;
	            } else if (valueType === '[object Uint8ClampedArray]') {
	                marker += TYPE_UINT8CLAMPEDARRAY;
	            } else if (valueType === '[object Int16Array]') {
	                marker += TYPE_INT16ARRAY;
	            } else if (valueType === '[object Uint16Array]') {
	                marker += TYPE_UINT16ARRAY;
	            } else if (valueType === '[object Int32Array]') {
	                marker += TYPE_INT32ARRAY;
	            } else if (valueType === '[object Uint32Array]') {
	                marker += TYPE_UINT32ARRAY;
	            } else if (valueType === '[object Float32Array]') {
	                marker += TYPE_FLOAT32ARRAY;
	            } else if (valueType === '[object Float64Array]') {
	                marker += TYPE_FLOAT64ARRAY;
	            } else {
	                callback(new Error('Failed to get type for BinaryArray'));
	            }
	        }

	        callback(marker + bufferToString(buffer));
	    } else if (valueType === '[object Blob]') {
	        // Conver the blob to a binaryArray and then to a string.
	        var fileReader = new FileReader();

	        fileReader.onload = function () {
	            // Backwards-compatible prefix for the blob type.
	            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

	            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
	        };

	        fileReader.readAsArrayBuffer(value);
	    } else {
	        try {
	            callback(JSON.stringify(value));
	        } catch (e) {
	            console.error("Couldn't convert value into a JSON string: ", value);

	            callback(null, e);
	        }
	    }
	}

	// Deserialize data we've inserted into a value column/field. We place
	// special markers into our strings to mark them as encoded; this isn't
	// as nice as a meta field, but it's the only sane thing we can do whilst
	// keeping localStorage support intact.
	//
	// Oftentimes this will just deserialize JSON content, but if we have a
	// special marker (SERIALIZED_MARKER, defined above), we will extract
	// some kind of arraybuffer/binary data/typed array out of the string.
	function deserialize(value) {
	    // If we haven't marked this string as being specially serialized (i.e.
	    // something other than serialized JSON), we can just return it and be
	    // done with it.
	    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
	        return JSON.parse(value);
	    }

	    // The following code deals with deserializing some kind of Blob or
	    // TypedArray. First we separate out the type of data we're dealing
	    // with from the data itself.
	    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
	    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

	    var blobType;
	    // Backwards-compatible blob type serialization strategy.
	    // DBs created with older versions of localForage will simply not have the blob type.
	    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
	        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
	        blobType = matcher[1];
	        serializedString = serializedString.substring(matcher[0].length);
	    }
	    var buffer = stringToBuffer(serializedString);

	    // Return the right type based on the code/type set during
	    // serialization.
	    switch (type) {
	        case TYPE_ARRAYBUFFER:
	            return buffer;
	        case TYPE_BLOB:
	            return createBlob([buffer], { type: blobType });
	        case TYPE_INT8ARRAY:
	            return new Int8Array(buffer);
	        case TYPE_UINT8ARRAY:
	            return new Uint8Array(buffer);
	        case TYPE_UINT8CLAMPEDARRAY:
	            return new Uint8ClampedArray(buffer);
	        case TYPE_INT16ARRAY:
	            return new Int16Array(buffer);
	        case TYPE_UINT16ARRAY:
	            return new Uint16Array(buffer);
	        case TYPE_INT32ARRAY:
	            return new Int32Array(buffer);
	        case TYPE_UINT32ARRAY:
	            return new Uint32Array(buffer);
	        case TYPE_FLOAT32ARRAY:
	            return new Float32Array(buffer);
	        case TYPE_FLOAT64ARRAY:
	            return new Float64Array(buffer);
	        default:
	            throw new Error('Unkown type: ' + type);
	    }
	}

	var localforageSerializer = {
	    serialize: serialize,
	    deserialize: deserialize,
	    stringToBuffer: stringToBuffer,
	    bufferToString: bufferToString
	};

	/*
	 * Includes code from:
	 *
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */

	function createDbTable(t, dbInfo, callback, errorCallback) {
	    t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
	}

	// Open the WebSQL database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage$1(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };

	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
	        }
	    }

	    var dbInfoPromise = new Promise$1(function (resolve, reject) {
	        // Open the database; the openDatabase API will automatically
	        // create it for us if it doesn't exist.
	        try {
	            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
	        } catch (e) {
	            return reject(e);
	        }

	        // Create our key/value table if it doesn't exist.
	        dbInfo.db.transaction(function (t) {
	            createDbTable(t, dbInfo, function () {
	                self._dbInfo = dbInfo;
	                resolve();
	            }, function (t, error) {
	                reject(error);
	            });
	        }, reject);
	    });

	    dbInfo.serializer = localforageSerializer;
	    return dbInfoPromise;
	}

	function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
	    t.executeSql(sqlStatement, args, callback, function (t, error) {
	        if (error.code === error.SYNTAX_ERR) {
	            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
	                if (!results.rows.length) {
	                    // if the table is missing (was deleted)
	                    // re-create it table and retry
	                    createDbTable(t, dbInfo, function () {
	                        t.executeSql(sqlStatement, args, callback, errorCallback);
	                    }, errorCallback);
	                } else {
	                    errorCallback(t, error);
	                }
	            }, errorCallback);
	        } else {
	            errorCallback(t, error);
	        }
	    }, errorCallback);
	}

	function getItem$1(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).value : null;

	                    // Check to see if this is serialized content we need to
	                    // unpack.
	                    if (result) {
	                        result = dbInfo.serializer.deserialize(result);
	                    }

	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function iterate$1(iterator, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;

	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var rows = results.rows;
	                    var length = rows.length;

	                    for (var i = 0; i < length; i++) {
	                        var item = rows.item(i);
	                        var result = item.value;

	                        // Check to see if this is serialized content
	                        // we need to unpack.
	                        if (result) {
	                            result = dbInfo.serializer.deserialize(result);
	                        }

	                        result = iterator(result, item.key, i + 1);

	                        // void(0) prevents problems with redefinition
	                        // of `undefined`.
	                        if (result !== void 0) {
	                            resolve(result);
	                            return;
	                        }
	                    }

	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function _setItem(key, value, callback, retriesLeft) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            // The localStorage API doesn't return undefined values in an
	            // "expected" way, so undefined is always cast to null in all
	            // drivers. See: https://github.com/mozilla/localForage/pull/42
	            if (value === undefined) {
	                value = null;
	            }

	            // Save the original value to pass to the callback.
	            var originalValue = value;

	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    dbInfo.db.transaction(function (t) {
	                        tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
	                            resolve(originalValue);
	                        }, function (t, error) {
	                            reject(error);
	                        });
	                    }, function (sqlError) {
	                        // The transaction failed; check
	                        // to see if it's a quota error.
	                        if (sqlError.code === sqlError.QUOTA_ERR) {
	                            // We reject the callback outright for now, but
	                            // it's worth trying to re-run the transaction.
	                            // Even if the user accepts the prompt to use
	                            // more storage on Safari, this error will
	                            // be called.
	                            //
	                            // Try to re-run the transaction.
	                            if (retriesLeft > 0) {
	                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
	                                return;
	                            }
	                            reject(sqlError);
	                        }
	                    });
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function setItem$1(key, value, callback) {
	    return _setItem.apply(this, [key, value, callback, 1]);
	}

	function removeItem$1(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Deletes every item in the table.
	// TODO: Find out if this resets the AUTO_INCREMENT number.
	function clear$1(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Does a simple `COUNT(key)` to get the number of items stored in
	// localForage.
	function length$1(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                // Ahhh, SQL makes this one soooooo easy.
	                tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var result = results.rows.item(0).c;
	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Return the key located at key index X; essentially gets the key from a
	// `WHERE id = ?`. This is the most efficient way I can think to implement
	// this rarely-used (in my experience) part of the API, but it can seem
	// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
	// the ID of each key will change every time it's updated. Perhaps a stored
	// procedure for the `setItem()` SQL would solve this problem?
	// TODO: Don't change ID on `setItem()`.
	function key$1(n, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).key : null;
	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function keys$1(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var keys = [];

	                    for (var i = 0; i < results.rows.length; i++) {
	                        keys.push(results.rows.item(i).key);
	                    }

	                    resolve(keys);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// https://www.w3.org/TR/webdatabase/#databases
	// > There is no way to enumerate or delete the databases available for an origin from this API.
	function getAllStoreNames(db) {
	    return new Promise$1(function (resolve, reject) {
	        db.transaction(function (t) {
	            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
	                var storeNames = [];

	                for (var i = 0; i < results.rows.length; i++) {
	                    storeNames.push(results.rows.item(i).name);
	                }

	                resolve({
	                    db: db,
	                    storeNames: storeNames
	                });
	            }, function (t, error) {
	                reject(error);
	            });
	        }, function (sqlError) {
	            reject(sqlError);
	        });
	    });
	}

	function dropInstance$1(options, callback) {
	    callback = getCallback.apply(this, arguments);

	    var currentConfig = this.config();
	    options = typeof options !== 'function' && options || {};
	    if (!options.name) {
	        options.name = options.name || currentConfig.name;
	        options.storeName = options.storeName || currentConfig.storeName;
	    }

	    var self = this;
	    var promise;
	    if (!options.name) {
	        promise = Promise$1.reject('Invalid arguments');
	    } else {
	        promise = new Promise$1(function (resolve) {
	            var db;
	            if (options.name === currentConfig.name) {
	                // use the db reference of the current instance
	                db = self._dbInfo.db;
	            } else {
	                db = openDatabase(options.name, '', '', 0);
	            }

	            if (!options.storeName) {
	                // drop all database tables
	                resolve(getAllStoreNames(db));
	            } else {
	                resolve({
	                    db: db,
	                    storeNames: [options.storeName]
	                });
	            }
	        }).then(function (operationInfo) {
	            return new Promise$1(function (resolve, reject) {
	                operationInfo.db.transaction(function (t) {
	                    function dropTable(storeName) {
	                        return new Promise$1(function (resolve, reject) {
	                            t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
	                                resolve();
	                            }, function (t, error) {
	                                reject(error);
	                            });
	                        });
	                    }

	                    var operations = [];
	                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
	                        operations.push(dropTable(operationInfo.storeNames[i]));
	                    }

	                    Promise$1.all(operations).then(function () {
	                        resolve();
	                    })["catch"](function (e) {
	                        reject(e);
	                    });
	                }, function (sqlError) {
	                    reject(sqlError);
	                });
	            });
	        });
	    }

	    executeCallback(promise, callback);
	    return promise;
	}

	var webSQLStorage = {
	    _driver: 'webSQLStorage',
	    _initStorage: _initStorage$1,
	    _support: isWebSQLValid(),
	    iterate: iterate$1,
	    getItem: getItem$1,
	    setItem: setItem$1,
	    removeItem: removeItem$1,
	    clear: clear$1,
	    length: length$1,
	    key: key$1,
	    keys: keys$1,
	    dropInstance: dropInstance$1
	};

	function isLocalStorageValid() {
	    try {
	        return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
	        // in IE8 typeof localStorage.setItem === 'object'
	        !!localStorage.setItem;
	    } catch (e) {
	        return false;
	    }
	}

	function _getKeyPrefix(options, defaultConfig) {
	    var keyPrefix = options.name + '/';

	    if (options.storeName !== defaultConfig.storeName) {
	        keyPrefix += options.storeName + '/';
	    }
	    return keyPrefix;
	}

	// Check if localStorage throws when saving an item
	function checkIfLocalStorageThrows() {
	    var localStorageTestKey = '_localforage_support_test';

	    try {
	        localStorage.setItem(localStorageTestKey, true);
	        localStorage.removeItem(localStorageTestKey);

	        return false;
	    } catch (e) {
	        return true;
	    }
	}

	// Check if localStorage is usable and allows to save an item
	// This method checks if localStorage is usable in Safari Private Browsing
	// mode, or in any other case where the available quota for localStorage
	// is 0 and there wasn't any saved items yet.
	function _isLocalStorageUsable() {
	    return !checkIfLocalStorageThrows() || localStorage.length > 0;
	}

	// Config the localStorage backend, using options set in the config.
	function _initStorage$2(options) {
	    var self = this;
	    var dbInfo = {};
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }

	    dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

	    if (!_isLocalStorageUsable()) {
	        return Promise$1.reject();
	    }

	    self._dbInfo = dbInfo;
	    dbInfo.serializer = localforageSerializer;

	    return Promise$1.resolve();
	}

	// Remove all keys from the datastore, effectively destroying all data in
	// the app's key/value store!
	function clear$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var keyPrefix = self._dbInfo.keyPrefix;

	        for (var i = localStorage.length - 1; i >= 0; i--) {
	            var key = localStorage.key(i);

	            if (key.indexOf(keyPrefix) === 0) {
	                localStorage.removeItem(key);
	            }
	        }
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Retrieve an item from the store. Unlike the original async_storage
	// library in Gaia, we don't modify return values at all. If a key's value
	// is `undefined`, we pass that value to the callback function.
	function getItem$2(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result = localStorage.getItem(dbInfo.keyPrefix + key);

	        // If a result was found, parse it from the serialized
	        // string into a JS object. If result isn't truthy, the key
	        // is likely undefined and we'll pass it straight to the
	        // callback.
	        if (result) {
	            result = dbInfo.serializer.deserialize(result);
	        }

	        return result;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Iterate over all items in the store.
	function iterate$2(iterator, callback) {
	    var self = this;

	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var keyPrefix = dbInfo.keyPrefix;
	        var keyPrefixLength = keyPrefix.length;
	        var length = localStorage.length;

	        // We use a dedicated iterator instead of the `i` variable below
	        // so other keys we fetch in localStorage aren't counted in
	        // the `iterationNumber` argument passed to the `iterate()`
	        // callback.
	        //
	        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
	        var iterationNumber = 1;

	        for (var i = 0; i < length; i++) {
	            var key = localStorage.key(i);
	            if (key.indexOf(keyPrefix) !== 0) {
	                continue;
	            }
	            var value = localStorage.getItem(key);

	            // If a result was found, parse it from the serialized
	            // string into a JS object. If result isn't truthy, the
	            // key is likely undefined and we'll pass it straight
	            // to the iterator.
	            if (value) {
	                value = dbInfo.serializer.deserialize(value);
	            }

	            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

	            if (value !== void 0) {
	                return value;
	            }
	        }
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Same as localStorage's key() method, except takes a callback.
	function key$2(n, callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result;
	        try {
	            result = localStorage.key(n);
	        } catch (error) {
	            result = null;
	        }

	        // Remove the prefix from the key, if a key is found.
	        if (result) {
	            result = result.substring(dbInfo.keyPrefix.length);
	        }

	        return result;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function keys$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var length = localStorage.length;
	        var keys = [];

	        for (var i = 0; i < length; i++) {
	            var itemKey = localStorage.key(i);
	            if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
	                keys.push(itemKey.substring(dbInfo.keyPrefix.length));
	            }
	        }

	        return keys;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Supply the number of keys in the datastore to the callback function.
	function length$2(callback) {
	    var self = this;
	    var promise = self.keys().then(function (keys) {
	        return keys.length;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Remove an item from the store, nice and simple.
	function removeItem$2(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        localStorage.removeItem(dbInfo.keyPrefix + key);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Set a key's value and run an optional callback once the value is set.
	// Unlike Gaia's implementation, the callback function is passed the value,
	// in case you want to operate on that value only after you're sure it
	// saved, or something like that.
	function setItem$2(key, value, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = self.ready().then(function () {
	        // Convert undefined values to null.
	        // https://github.com/mozilla/localForage/pull/42
	        if (value === undefined) {
	            value = null;
	        }

	        // Save the original value to pass to the callback.
	        var originalValue = value;

	        return new Promise$1(function (resolve, reject) {
	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    try {
	                        localStorage.setItem(dbInfo.keyPrefix + key, value);
	                        resolve(originalValue);
	                    } catch (e) {
	                        // localStorage capacity exceeded.
	                        // TODO: Make this a specific error/event.
	                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
	                            reject(e);
	                        }
	                        reject(e);
	                    }
	                }
	            });
	        });
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function dropInstance$2(options, callback) {
	    callback = getCallback.apply(this, arguments);

	    options = typeof options !== 'function' && options || {};
	    if (!options.name) {
	        var currentConfig = this.config();
	        options.name = options.name || currentConfig.name;
	        options.storeName = options.storeName || currentConfig.storeName;
	    }

	    var self = this;
	    var promise;
	    if (!options.name) {
	        promise = Promise$1.reject('Invalid arguments');
	    } else {
	        promise = new Promise$1(function (resolve) {
	            if (!options.storeName) {
	                resolve(options.name + '/');
	            } else {
	                resolve(_getKeyPrefix(options, self._defaultConfig));
	            }
	        }).then(function (keyPrefix) {
	            for (var i = localStorage.length - 1; i >= 0; i--) {
	                var key = localStorage.key(i);

	                if (key.indexOf(keyPrefix) === 0) {
	                    localStorage.removeItem(key);
	                }
	            }
	        });
	    }

	    executeCallback(promise, callback);
	    return promise;
	}

	var localStorageWrapper = {
	    _driver: 'localStorageWrapper',
	    _initStorage: _initStorage$2,
	    _support: isLocalStorageValid(),
	    iterate: iterate$2,
	    getItem: getItem$2,
	    setItem: setItem$2,
	    removeItem: removeItem$2,
	    clear: clear$2,
	    length: length$2,
	    key: key$2,
	    keys: keys$2,
	    dropInstance: dropInstance$2
	};

	var sameValue = function sameValue(x, y) {
	    return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
	};

	var includes = function includes(array, searchElement) {
	    var len = array.length;
	    var i = 0;
	    while (i < len) {
	        if (sameValue(array[i], searchElement)) {
	            return true;
	        }
	        i++;
	    }

	    return false;
	};

	var isArray = Array.isArray || function (arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	};

	// Drivers are stored here when `defineDriver()` is called.
	// They are shared across all instances of localForage.
	var DefinedDrivers = {};

	var DriverSupport = {};

	var DefaultDrivers = {
	    INDEXEDDB: asyncStorage,
	    WEBSQL: webSQLStorage,
	    LOCALSTORAGE: localStorageWrapper
	};

	var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

	var OptionalDriverMethods = ['dropInstance'];

	var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

	var DefaultConfig = {
	    description: '',
	    driver: DefaultDriverOrder.slice(),
	    name: 'localforage',
	    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
	    // we can use without a prompt.
	    size: 4980736,
	    storeName: 'keyvaluepairs',
	    version: 1.0
	};

	function callWhenReady(localForageInstance, libraryMethod) {
	    localForageInstance[libraryMethod] = function () {
	        var _args = arguments;
	        return localForageInstance.ready().then(function () {
	            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
	        });
	    };
	}

	function extend() {
	    for (var i = 1; i < arguments.length; i++) {
	        var arg = arguments[i];

	        if (arg) {
	            for (var _key in arg) {
	                if (arg.hasOwnProperty(_key)) {
	                    if (isArray(arg[_key])) {
	                        arguments[0][_key] = arg[_key].slice();
	                    } else {
	                        arguments[0][_key] = arg[_key];
	                    }
	                }
	            }
	        }
	    }

	    return arguments[0];
	}

	var LocalForage = function () {
	    function LocalForage(options) {
	        _classCallCheck(this, LocalForage);

	        for (var driverTypeKey in DefaultDrivers) {
	            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
	                var driver = DefaultDrivers[driverTypeKey];
	                var driverName = driver._driver;
	                this[driverTypeKey] = driverName;

	                if (!DefinedDrivers[driverName]) {
	                    // we don't need to wait for the promise,
	                    // since the default drivers can be defined
	                    // in a blocking manner
	                    this.defineDriver(driver);
	                }
	            }
	        }

	        this._defaultConfig = extend({}, DefaultConfig);
	        this._config = extend({}, this._defaultConfig, options);
	        this._driverSet = null;
	        this._initDriver = null;
	        this._ready = false;
	        this._dbInfo = null;

	        this._wrapLibraryMethodsWithReady();
	        this.setDriver(this._config.driver)["catch"](function () {});
	    }

	    // Set any config values for localForage; can be called anytime before
	    // the first API call (e.g. `getItem`, `setItem`).
	    // We loop through options so we don't overwrite existing config
	    // values.


	    LocalForage.prototype.config = function config(options) {
	        // If the options argument is an object, we use it to set values.
	        // Otherwise, we return either a specified config value or all
	        // config values.
	        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
	            // If localforage is ready and fully initialized, we can't set
	            // any new configuration values. Instead, we return an error.
	            if (this._ready) {
	                return new Error("Can't call config() after localforage " + 'has been used.');
	            }

	            for (var i in options) {
	                if (i === 'storeName') {
	                    options[i] = options[i].replace(/\W/g, '_');
	                }

	                if (i === 'version' && typeof options[i] !== 'number') {
	                    return new Error('Database version must be a number.');
	                }

	                this._config[i] = options[i];
	            }

	            // after all config options are set and
	            // the driver option is used, try setting it
	            if ('driver' in options && options.driver) {
	                return this.setDriver(this._config.driver);
	            }

	            return true;
	        } else if (typeof options === 'string') {
	            return this._config[options];
	        } else {
	            return this._config;
	        }
	    };

	    // Used to define a custom driver, shared across all instances of
	    // localForage.


	    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
	        var promise = new Promise$1(function (resolve, reject) {
	            try {
	                var driverName = driverObject._driver;
	                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

	                // A driver name should be defined and not overlap with the
	                // library-defined, default drivers.
	                if (!driverObject._driver) {
	                    reject(complianceError);
	                    return;
	                }

	                var driverMethods = LibraryMethods.concat('_initStorage');
	                for (var i = 0, len = driverMethods.length; i < len; i++) {
	                    var driverMethodName = driverMethods[i];

	                    // when the property is there,
	                    // it should be a method even when optional
	                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
	                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
	                        reject(complianceError);
	                        return;
	                    }
	                }

	                var configureMissingMethods = function configureMissingMethods() {
	                    var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
	                        return function () {
	                            var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
	                            var promise = Promise$1.reject(error);
	                            executeCallback(promise, arguments[arguments.length - 1]);
	                            return promise;
	                        };
	                    };

	                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
	                        var optionalDriverMethod = OptionalDriverMethods[_i];
	                        if (!driverObject[optionalDriverMethod]) {
	                            driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
	                        }
	                    }
	                };

	                configureMissingMethods();

	                var setDriverSupport = function setDriverSupport(support) {
	                    if (DefinedDrivers[driverName]) {
	                        console.info('Redefining LocalForage driver: ' + driverName);
	                    }
	                    DefinedDrivers[driverName] = driverObject;
	                    DriverSupport[driverName] = support;
	                    // don't use a then, so that we can define
	                    // drivers that have simple _support methods
	                    // in a blocking manner
	                    resolve();
	                };

	                if ('_support' in driverObject) {
	                    if (driverObject._support && typeof driverObject._support === 'function') {
	                        driverObject._support().then(setDriverSupport, reject);
	                    } else {
	                        setDriverSupport(!!driverObject._support);
	                    }
	                } else {
	                    setDriverSupport(true);
	                }
	            } catch (e) {
	                reject(e);
	            }
	        });

	        executeTwoCallbacks(promise, callback, errorCallback);
	        return promise;
	    };

	    LocalForage.prototype.driver = function driver() {
	        return this._driver || null;
	    };

	    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
	        var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

	        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
	        return getDriverPromise;
	    };

	    LocalForage.prototype.getSerializer = function getSerializer(callback) {
	        var serializerPromise = Promise$1.resolve(localforageSerializer);
	        executeTwoCallbacks(serializerPromise, callback);
	        return serializerPromise;
	    };

	    LocalForage.prototype.ready = function ready(callback) {
	        var self = this;

	        var promise = self._driverSet.then(function () {
	            if (self._ready === null) {
	                self._ready = self._initDriver();
	            }

	            return self._ready;
	        });

	        executeTwoCallbacks(promise, callback, callback);
	        return promise;
	    };

	    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
	        var self = this;

	        if (!isArray(drivers)) {
	            drivers = [drivers];
	        }

	        var supportedDrivers = this._getSupportedDrivers(drivers);

	        function setDriverToConfig() {
	            self._config.driver = self.driver();
	        }

	        function extendSelfWithDriver(driver) {
	            self._extend(driver);
	            setDriverToConfig();

	            self._ready = self._initStorage(self._config);
	            return self._ready;
	        }

	        function initDriver(supportedDrivers) {
	            return function () {
	                var currentDriverIndex = 0;

	                function driverPromiseLoop() {
	                    while (currentDriverIndex < supportedDrivers.length) {
	                        var driverName = supportedDrivers[currentDriverIndex];
	                        currentDriverIndex++;

	                        self._dbInfo = null;
	                        self._ready = null;

	                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
	                    }

	                    setDriverToConfig();
	                    var error = new Error('No available storage method found.');
	                    self._driverSet = Promise$1.reject(error);
	                    return self._driverSet;
	                }

	                return driverPromiseLoop();
	            };
	        }

	        // There might be a driver initialization in progress
	        // so wait for it to finish in order to avoid a possible
	        // race condition to set _dbInfo
	        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
	            return Promise$1.resolve();
	        }) : Promise$1.resolve();

	        this._driverSet = oldDriverSetDone.then(function () {
	            var driverName = supportedDrivers[0];
	            self._dbInfo = null;
	            self._ready = null;

	            return self.getDriver(driverName).then(function (driver) {
	                self._driver = driver._driver;
	                setDriverToConfig();
	                self._wrapLibraryMethodsWithReady();
	                self._initDriver = initDriver(supportedDrivers);
	            });
	        })["catch"](function () {
	            setDriverToConfig();
	            var error = new Error('No available storage method found.');
	            self._driverSet = Promise$1.reject(error);
	            return self._driverSet;
	        });

	        executeTwoCallbacks(this._driverSet, callback, errorCallback);
	        return this._driverSet;
	    };

	    LocalForage.prototype.supports = function supports(driverName) {
	        return !!DriverSupport[driverName];
	    };

	    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
	        extend(this, libraryMethodsAndProperties);
	    };

	    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
	        var supportedDrivers = [];
	        for (var i = 0, len = drivers.length; i < len; i++) {
	            var driverName = drivers[i];
	            if (this.supports(driverName)) {
	                supportedDrivers.push(driverName);
	            }
	        }
	        return supportedDrivers;
	    };

	    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
	        // Add a stub for each driver API method that delays the call to the
	        // corresponding driver method until localForage is ready. These stubs
	        // will be replaced by the driver methods as soon as the driver is
	        // loaded, so there is no performance impact.
	        for (var i = 0, len = LibraryMethods.length; i < len; i++) {
	            callWhenReady(this, LibraryMethods[i]);
	        }
	    };

	    LocalForage.prototype.createInstance = function createInstance(options) {
	        return new LocalForage(options);
	    };

	    return LocalForage;
	}();

	// The actual localForage object that we expose as a module or via a
	// global. It's extended by pulling in one of our other libraries.


	var localforage_js = new LocalForage();

	module.exports = localforage_js;

	},{"3":3}]},{},[4])(4)
	});
	});

	/**
	 * Handles saving and requesting files from local storage
	 * @class
	 * @param {string} name This should be the name of the application for modals
	 * @param {function} [requester]
	 * @param {function} [resolver]
	 */
	class Store {
	  constructor(name, requester, resolver) {
	    this.urlCache = {};
	    this.storage = undefined;
	    this.name = name;
	    this.requester = requester || request;
	    this.resolver = resolver;
	    this.online = true;
	    this.checkRequirements();
	    this.addListeners();
	  }

	  /**
	   * Checks to see if localForage exists in global namspace,
	   * Requires localForage if it isn't there
	   * @private
	   */
	  checkRequirements() {
	    try {
	      let store;
	      if (typeof localforage === 'undefined') {
	        store = localforage;
	      }
	      this.storage = store.createInstance({
	        name: this.name
	      });
	    } catch (e) {
	      throw new Error('localForage lib not loaded');
	    }
	  }

	  /**
	   * Add online and offline event listeners
	   * @private
	   */
	  addListeners() {
	    this._status = this.status.bind(this);
	    window.addEventListener('online', this._status);
	    window.addEventListener('offline', this._status);
	  }

	  /**
	   * Remove online and offline event listeners
	   * @private
	   */
	  removeListeners() {
	    window.removeEventListener('online', this._status);
	    window.removeEventListener('offline', this._status);
	    this._status = undefined;
	  }

	  /**
	   * Update the online / offline status
	   * @private
	   */
	  status() {
	    let online = navigator.onLine;
	    this.online = online;
	    if (online) {
	      this.emit('online', this);
	    } else {
	      this.emit('offline', this);
	    }
	  }

	  /**
	   * Add all of a book resources to the store
	   * @param  {Resources} resources  book resources
	   * @param  {boolean} [force] force resaving resources
	   * @return {Promise<object>} store objects
	   */
	  add(resources, force) {
	    let mapped = resources.resources.map(item => {
	      let {
	        href
	      } = item;
	      let url = this.resolver(href);
	      let encodedUrl = window.encodeURIComponent(url);
	      return this.storage.getItem(encodedUrl).then(item => {
	        if (!item || force) {
	          return this.requester(url, 'binary').then(data => {
	            return this.storage.setItem(encodedUrl, data);
	          });
	        } else {
	          return item;
	        }
	      });
	    });
	    return Promise.all(mapped);
	  }

	  /**
	   * Put binary data from a url to storage
	   * @param  {string} url  a url to request from storage
	   * @param  {boolean} [withCredentials]
	   * @param  {object} [headers]
	   * @return {Promise<Blob>}
	   */
	  put(url, withCredentials, headers) {
	    let encodedUrl = window.encodeURIComponent(url);
	    return this.storage.getItem(encodedUrl).then(result => {
	      if (!result) {
	        return this.requester(url, 'binary', withCredentials, headers).then(data => {
	          return this.storage.setItem(encodedUrl, data);
	        });
	      }
	      return result;
	    });
	  }

	  /**
	   * Request a url
	   * @param  {string} url  a url to request from storage
	   * @param  {string} [type] specify the type of the returned result
	   * @param  {boolean} [withCredentials]
	   * @param  {object} [headers]
	   * @return {Promise<Blob | string | JSON | Document | XMLDocument>}
	   */
	  request(url, type, withCredentials, headers) {
	    if (this.online) {
	      // From network
	      return this.requester(url, type, withCredentials, headers).then(data => {
	        // save to store if not present
	        this.put(url);
	        return data;
	      });
	    } else {
	      // From store
	      return this.retrieve(url, type);
	    }
	  }

	  /**
	   * Request a url from storage
	   * @param  {string} url  a url to request from storage
	   * @param  {string} [type] specify the type of the returned result
	   * @return {Promise<Blob | string | JSON | Document | XMLDocument>}
	   */
	  retrieve(url, type) {
	    var response;
	    var path = new Path(url);

	    // If type isn't set, determine it from the file extension
	    if (!type) {
	      type = path.extension;
	    }
	    if (type == 'blob') {
	      response = this.getBlob(url);
	    } else {
	      response = this.getText(url);
	    }
	    return response.then(r => {
	      var deferred = new core_1();
	      var result;
	      if (r) {
	        result = this.handleResponse(r, type);
	        deferred.resolve(result);
	      } else {
	        deferred.reject({
	          message: 'File not found in storage: ' + url,
	          stack: new Error().stack
	        });
	      }
	      return deferred.promise;
	    });
	  }

	  /**
	   * Handle the response from request
	   * @private
	   * @param  {any} response
	   * @param  {string} [type]
	   * @return {any} the parsed result
	   */
	  handleResponse(response, type) {
	    var r;
	    if (type == 'json') {
	      r = JSON.parse(response);
	    } else if (core_18(type)) {
	      r = core_24(response, 'text/xml');
	    } else if (type == 'xhtml') {
	      r = core_24(response, 'application/xhtml+xml');
	    } else if (type == 'html' || type == 'htm') {
	      r = core_24(response, 'text/html');
	    } else {
	      r = response;
	    }
	    return r;
	  }

	  /**
	   * Get a Blob from Storage by Url
	   * @param  {string} url
	   * @param  {string} [mimeType]
	   * @return {Blob}
	   */
	  getBlob(url, mimeType) {
	    let encodedUrl = window.encodeURIComponent(url);
	    return this.storage.getItem(encodedUrl).then(function (uint8array) {
	      if (!uint8array) return;
	      mimeType = mimeType || mime$1.lookup(url);
	      return new Blob([uint8array], {
	        type: mimeType
	      });
	    });
	  }

	  /**
	   * Get Text from Storage by Url
	   * @param  {string} url
	   * @param  {string} [mimeType]
	   * @return {string}
	   */
	  getText(url, mimeType) {
	    let encodedUrl = window.encodeURIComponent(url);
	    mimeType = mimeType || mime$1.lookup(url);
	    return this.storage.getItem(encodedUrl).then(function (uint8array) {
	      var deferred = new core_1();
	      var reader = new FileReader();
	      var blob;
	      if (!uint8array) return;
	      blob = new Blob([uint8array], {
	        type: mimeType
	      });
	      reader.addEventListener('loadend', () => {
	        deferred.resolve(reader.result);
	      });
	      reader.readAsText(blob, mimeType);
	      return deferred.promise;
	    });
	  }

	  /**
	   * Get a base64 encoded result from Storage by Url
	   * @param  {string} url
	   * @param  {string} [mimeType]
	   * @return {string} base64 encoded
	   */
	  getBase64(url, mimeType) {
	    let encodedUrl = window.encodeURIComponent(url);
	    mimeType = mimeType || mime$1.lookup(url);
	    return this.storage.getItem(encodedUrl).then(uint8array => {
	      var deferred = new core_1();
	      var reader = new FileReader();
	      var blob;
	      if (!uint8array) return;
	      blob = new Blob([uint8array], {
	        type: mimeType
	      });
	      reader.addEventListener('loadend', () => {
	        deferred.resolve(reader.result);
	      });
	      reader.readAsDataURL(blob, mimeType);
	      return deferred.promise;
	    });
	  }

	  /**
	   * Create a Url from a stored item
	   * @param  {string} url
	   * @param  {object} [options.base64] use base64 encoding or blob url
	   * @return {Promise} url promise with Url string
	   */
	  createUrl(url, options) {
	    var deferred = new core_1();
	    var _URL = window.URL || window.webkitURL || window.mozURL;
	    var tempUrl;
	    var response;
	    var useBase64 = options && options.base64;
	    if (url in this.urlCache) {
	      deferred.resolve(this.urlCache[url]);
	      return deferred.promise;
	    }
	    if (useBase64) {
	      response = this.getBase64(url);
	      if (response) {
	        response.then(function (tempUrl) {
	          this.urlCache[url] = tempUrl;
	          deferred.resolve(tempUrl);
	        }.bind(this));
	      }
	    } else {
	      response = this.getBlob(url);
	      if (response) {
	        response.then(function (blob) {
	          tempUrl = _URL.createObjectURL(blob);
	          this.urlCache[url] = tempUrl;
	          deferred.resolve(tempUrl);
	        }.bind(this));
	      }
	    }
	    if (!response) {
	      deferred.reject({
	        message: 'File not found in storage: ' + url,
	        stack: new Error().stack
	      });
	    }
	    return deferred.promise;
	  }

	  /**
	   * Revoke Temp Url for a archive item
	   * @param  {string} url url of the item in the store
	   */
	  revokeUrl(url) {
	    var _URL = window.URL || window.webkitURL || window.mozURL;
	    var fromCache = this.urlCache[url];
	    if (fromCache) _URL.revokeObjectURL(fromCache);
	  }
	  destroy() {
	    var _URL = window.URL || window.webkitURL || window.mozURL;
	    for (let fromCache in this.urlCache) {
	      _URL.revokeObjectURL(fromCache);
	    }
	    this.urlCache = {};
	    this.removeListeners();
	  }
	}
	eventEmitter(Store.prototype);

	/**
	 * Open DisplayOptions Format Parser
	 * @class
	 * @param {document} displayOptionsDocument XML
	 */
	class DisplayOptions {
	  constructor(displayOptionsDocument) {
	    this.interactive = '';
	    this.fixedLayout = '';
	    this.openToSpread = '';
	    this.orientationLock = '';
	    if (displayOptionsDocument) {
	      this.parse(displayOptionsDocument);
	    }
	  }

	  /**
	   * Parse XML
	   * @param  {document} displayOptionsDocument XML
	   * @return {DisplayOptions} self
	   */
	  parse(displayOptionsDocument) {
	    if (!displayOptionsDocument) {
	      return this;
	    }
	    const displayOptionsNode = core_25(displayOptionsDocument, 'display_options');
	    if (!displayOptionsNode) {
	      return this;
	    }
	    const options = core_26(displayOptionsNode, 'option');
	    options.forEach(el => {
	      let value = '';
	      if (el.childNodes.length) {
	        value = el.childNodes[0].nodeValue;
	      }
	      switch (el.attributes.name.value) {
	        case 'interactive':
	          this.interactive = value;
	          break;
	        case 'fixed-layout':
	          this.fixedLayout = value;
	          break;
	        case 'open-to-spread':
	          this.openToSpread = value;
	          break;
	        case 'orientation-lock':
	          this.orientationLock = value;
	          break;
	      }
	    });
	    return this;
	  }
	  destroy() {
	    this.interactive = undefined;
	    this.fixedLayout = undefined;
	    this.openToSpread = undefined;
	    this.orientationLock = undefined;
	  }
	}

	const CONTAINER_PATH = 'META-INF/container.xml';
	const IBOOKS_DISPLAY_OPTIONS_PATH = 'META-INF/com.apple.ibooks.display-options.xml';
	const INPUT_TYPE = {
	  BINARY: 'binary',
	  BASE64: 'base64',
	  EPUB: 'epub',
	  OPF: 'opf',
	  MANIFEST: 'json',
	  DIRECTORY: 'directory'
	};

	/**
	 * An Epub representation with methods for the loading, parsing and manipulation
	 * of its contents.
	 * @class
	 * @param {string} [url]
	 * @param {object} [options]
	 * @param {method} [options.requestMethod] a request function to use instead of the default
	 * @param {boolean} [options.requestCredentials=undefined] send the xhr request withCredentials
	 * @param {object} [options.requestHeaders=undefined] send the xhr request headers
	 * @param {string} [options.encoding=binary] optional to pass 'binary' or base64' for archived Epubs
	 * @param {string} [options.replacements=none] use base64, blobUrl, or none for replacing assets in archived Epubs
	 * @param {method} [options.canonical] optional function to determine canonical urls for a path
	 * @param {string} [options.openAs] optional string to determine the input type
	 * @param {boolean} [options.keepAbsoluteUrl=false] whether to keep the absolute URL when opening
	 * @param {string} [options.store=false] cache the contents in local storage, value should be the name of the reader
	 * @returns {Book}
	 * @example new Book("/path/to/book.epub", {})
	 * @example new Book({ replacements: "blobUrl" })
	 */
	class Book {
	  constructor(url, options) {
	    // Allow passing just options to the Book
	    if (typeof options === 'undefined' && typeof url !== 'string' && url instanceof Blob === false && url instanceof ArrayBuffer === false) {
	      options = url;
	      url = undefined;
	    }
	    this.settings = core_10(this.settings || {}, {
	      requestMethod: undefined,
	      requestCredentials: undefined,
	      requestHeaders: undefined,
	      encoding: undefined,
	      replacements: undefined,
	      canonical: undefined,
	      openAs: undefined,
	      store: undefined
	    });
	    core_10(this.settings, options);

	    // Promises
	    this.opening = new core_1();

	    /**
	     * @member {promise} opened returns after the book is loaded
	     * @memberof Book
	     */
	    this.opened = this.opening.promise;
	    this.isOpen = false;
	    this.loading = {
	      manifest: new core_1(),
	      spine: new core_1(),
	      metadata: new core_1(),
	      cover: new core_1(),
	      navigation: new core_1(),
	      pageList: new core_1(),
	      resources: new core_1(),
	      displayOptions: new core_1()
	    };
	    this.loaded = {
	      manifest: this.loading.manifest.promise,
	      spine: this.loading.spine.promise,
	      metadata: this.loading.metadata.promise,
	      cover: this.loading.cover.promise,
	      navigation: this.loading.navigation.promise,
	      pageList: this.loading.pageList.promise,
	      resources: this.loading.resources.promise,
	      displayOptions: this.loading.displayOptions.promise
	    };

	    /**
	     * @member {promise} ready returns after the book is loaded and parsed
	     * @memberof Book
	     * @private
	     */
	    this.ready = Promise.all([this.loaded.manifest, this.loaded.spine, this.loaded.metadata, this.loaded.cover, this.loaded.navigation, this.loaded.resources, this.loaded.displayOptions]);

	    // Queue for methods used before opening
	    this.isRendered = false;
	    // this._q = queue(this);

	    /**
	     * @member {method} request
	     * @memberof Book
	     * @private
	     */
	    this.request = this.settings.requestMethod || request;

	    /**
	     * @member {Spine} spine
	     * @memberof Book
	     */
	    this.spine = new Spine();

	    /**
	     * @member {Locations} locations
	     * @memberof Book
	     */
	    this.locations = new Locations(this.spine, this.load.bind(this));

	    /**
	     * @member {Navigation} navigation
	     * @memberof Book
	     */
	    this.navigation = undefined;

	    /**
	     * @member {PageList} pagelist
	     * @memberof Book
	     */
	    this.pageList = undefined;

	    /**
	     * @member {Url} url
	     * @memberof Book
	     * @private
	     */
	    this.url = undefined;

	    /**
	     * @member {Path} path
	     * @memberof Book
	     * @private
	     */
	    this.path = undefined;

	    /**
	     * @member {boolean} archived
	     * @memberof Book
	     * @private
	     */
	    this.archived = false;

	    /**
	     * @member {Archive} archive
	     * @memberof Book
	     * @private
	     */
	    this.archive = undefined;

	    /**
	     * @member {Store} storage
	     * @memberof Book
	     * @private
	     */
	    this.storage = undefined;

	    /**
	     * @member {Resources} resources
	     * @memberof Book
	     * @private
	     */
	    this.resources = undefined;

	    /**
	     * @member {Rendition} rendition
	     * @memberof Book
	     * @private
	     */
	    this.rendition = undefined;

	    /**
	     * @member {Container} container
	     * @memberof Book
	     * @private
	     */
	    this.container = undefined;

	    /**
	     * @member {Packaging} packaging
	     * @memberof Book
	     * @private
	     */
	    this.packaging = undefined;

	    /**
	     * @member {DisplayOptions} displayOptions
	     * @memberof DisplayOptions
	     * @private
	     */
	    this.displayOptions = undefined;

	    // this.toc = undefined;
	    if (this.settings.store) {
	      this.store(this.settings.store);
	    }
	    if (url) {
	      this.open(url, this.settings.openAs).catch(() => {
	        var err = new Error('Cannot load book at ' + url);
	        this.emit(constants_1.BOOK.OPEN_FAILED, err);
	      });
	    }
	  }

	  /**
	   * Open a epub or url
	   * @param {string | ArrayBuffer} input Url, Path or ArrayBuffer
	   * @param {string} [what="binary", "base64", "epub", "opf", "json", "directory"] force opening as a certain type
	   * @returns {Promise} of when the book has been loaded
	   * @example book.open("/path/to/book.epub")
	   */
	  open(input, what) {
	    var opening;
	    var type = what || this.determineType(input);
	    if (type === INPUT_TYPE.BINARY) {
	      this.archived = true;
	      this.url = new Url('/', '');
	      opening = this.openEpub(input);
	    } else if (type === INPUT_TYPE.BASE64) {
	      this.archived = true;
	      this.url = new Url('/', '');
	      opening = this.openEpub(input, type);
	    } else if (type === INPUT_TYPE.EPUB) {
	      this.archived = true;
	      this.url = new Url('/', '');
	      opening = this.request(input, 'binary', this.settings.requestCredentials, this.settings.requestHeaders).then(this.openEpub.bind(this));
	    } else if (type == INPUT_TYPE.OPF) {
	      this.url = new Url(input);
	      if (this.settings.keepAbsoluteUrl) {
	        opening = this.openPackaging(input);
	      } else {
	        opening = this.openPackaging(this.url.Path.toString());
	      }
	    } else if (type == INPUT_TYPE.MANIFEST) {
	      this.url = new Url(input);
	      if (this.settings.keepAbsoluteUrl) {
	        opening = this.openManifest(input);
	      } else {
	        opening = this.openManifest(this.url.Path.toString());
	      }
	    } else {
	      this.url = new Url(input);
	      opening = this.openContainer(CONTAINER_PATH).then(this.openPackaging.bind(this));
	    }
	    return opening;
	  }

	  /**
	   * Open an archived epub
	   * @private
	   * @param  {binary} data
	   * @param  {string} [encoding]
	   * @return {Promise}
	   */
	  openEpub(data, encoding) {
	    return this.unarchive(data, encoding || this.settings.encoding).then(() => {
	      return this.openContainer(CONTAINER_PATH);
	    }).then(packagePath => {
	      return this.openPackaging(packagePath);
	    });
	  }

	  /**
	   * Open the epub container
	   * @private
	   * @param  {string} url
	   * @return {string} packagePath
	   */
	  openContainer(url) {
	    return this.load(url).then(xml => {
	      this.container = new Container(xml);
	      return this.resolve(this.container.packagePath);
	    });
	  }

	  /**
	   * Open the Open Packaging Format Xml
	   * @private
	   * @param  {string} url
	   * @return {Promise}
	   */
	  openPackaging(url) {
	    this.path = new Path(url);
	    return this.load(url).then(xml => {
	      this.packaging = new Packaging(xml);
	      return this.unpack(this.packaging);
	    });
	  }

	  /**
	   * Open the manifest JSON
	   * @private
	   * @param  {string} url
	   * @return {Promise}
	   */
	  openManifest(url) {
	    this.path = new Path(url);
	    return this.load(url).then(json => {
	      this.packaging = new Packaging();
	      this.packaging.load(json);
	      return this.unpack(this.packaging);
	    });
	  }

	  /**
	   * Load a resource from the Book
	   * @param  {string} path path to the resource to load
	   * @return {Promise}     returns a promise with the requested resource
	   */
	  load(path) {
	    var resolved = this.resolve(path);
	    if (this.archived) {
	      return this.archive.request(resolved);
	    } else {
	      return this.request(resolved, null, this.settings.requestCredentials, this.settings.requestHeaders);
	    }
	  }

	  /**
	   * Resolve a path to it's absolute position in the Book
	   * @param  {string} path
	   * @param  {boolean} [absolute] force resolving the full URL
	   * @return {string}          the resolved path string
	   */
	  resolve(path, absolute) {
	    if (!path) {
	      return;
	    }
	    let resolved = path;
	    let isAbsolute = typeof path === 'string' && (path.startsWith('/') || path.indexOf('://') > -1);
	    if (isAbsolute) {
	      return path;
	    }
	    if (this.path) {
	      resolved = this.path.resolve(path);
	    }
	    if (absolute != false && this.url) {
	      resolved = this.url.resolve(resolved);
	    }
	    return resolved;
	  }

	  /**
	   * Get a canonical link to a path
	   * @param  {string} path
	   * @return {string} the canonical path string
	   */
	  canonical(path) {
	    var url = path;
	    if (!path) {
	      return '';
	    }
	    if (this.settings.canonical) {
	      url = this.settings.canonical(path);
	    } else {
	      url = this.resolve(path, true);
	    }
	    return url;
	  }

	  /**
	   * Determine the type of they input passed to open
	   * @private
	   * @param  {string} input
	   * @return {string}  binary | directory | epub | opf
	   */
	  determineType(input) {
	    var url;
	    var path;
	    var extension;
	    if (this.settings.encoding === 'base64') {
	      return INPUT_TYPE.BASE64;
	    }
	    if (typeof input != 'string') {
	      return INPUT_TYPE.BINARY;
	    }
	    url = new Url(input);
	    path = url.path();
	    extension = path.extension;

	    // If there's a search string, remove it before determining type
	    if (extension) {
	      extension = extension.replace(/\?.*$/, '');
	    }
	    if (!extension) {
	      return INPUT_TYPE.DIRECTORY;
	    }
	    if (extension === 'epub') {
	      return INPUT_TYPE.EPUB;
	    }
	    if (extension === 'opf') {
	      return INPUT_TYPE.OPF;
	    }
	    if (extension === 'json') {
	      return INPUT_TYPE.MANIFEST;
	    }
	  }

	  /**
	   * unpack the contents of the Books packaging
	   * @private
	   * @param {Packaging} packaging object
	   */
	  unpack(packaging) {
	    this.package = packaging; //TODO: deprecated this

	    if (this.packaging.metadata.layout === '') {
	      // rendition:layout not set - check display options if book is pre-paginated
	      this.load(this.url.resolve(IBOOKS_DISPLAY_OPTIONS_PATH)).then(xml => {
	        this.displayOptions = new DisplayOptions(xml);
	        this.loading.displayOptions.resolve(this.displayOptions);
	      }).catch(() => {
	        this.displayOptions = new DisplayOptions();
	        this.loading.displayOptions.resolve(this.displayOptions);
	      });
	    } else {
	      this.displayOptions = new DisplayOptions();
	      this.loading.displayOptions.resolve(this.displayOptions);
	    }
	    this.spine.unpack(this.packaging, this.resolve.bind(this), this.canonical.bind(this));
	    this.resources = new Resources(this.packaging.manifest, {
	      archive: this.archive,
	      resolver: this.resolve.bind(this),
	      request: this.request.bind(this),
	      replacements: this.settings.replacements || (this.archived ? 'blobUrl' : 'base64')
	    });
	    this.loadNavigation(this.packaging).then(() => {
	      // this.toc = this.navigation.toc;
	      this.loading.navigation.resolve(this.navigation);
	    });
	    if (this.packaging.coverPath) {
	      this.cover = this.resolve(this.packaging.coverPath);
	    }
	    // Resolve promises
	    this.loading.manifest.resolve(this.packaging.manifest);
	    this.loading.metadata.resolve(this.packaging.metadata);
	    this.loading.spine.resolve(this.spine);
	    this.loading.cover.resolve(this.cover);
	    this.loading.resources.resolve(this.resources);
	    this.loading.pageList.resolve(this.pageList);
	    this.isOpen = true;
	    if (this.archived || this.settings.replacements && this.settings.replacements != 'none') {
	      this.replacements().then(() => {
	        this.loaded.displayOptions.then(() => {
	          this.opening.resolve(this);
	        });
	      }).catch(err => {
	        console.error(err);
	      });
	    } else {
	      // Resolve book opened promise
	      this.loaded.displayOptions.then(() => {
	        this.opening.resolve(this);
	      });
	    }
	  }

	  /**
	   * Load Navigation and PageList from package
	   * @private
	   * @param {Packaging} packaging
	   */
	  loadNavigation(packaging) {
	    let navPath = packaging.navPath || packaging.ncxPath;
	    let toc = packaging.toc;

	    // From json manifest
	    if (toc) {
	      return new Promise(resolve => {
	        this.navigation = new Navigation(toc);
	        if (packaging.pageList) {
	          this.pageList = new PageList(packaging.pageList); // TODO: handle page lists from Manifest
	        }
	        resolve(this.navigation);
	      });
	    }
	    if (!navPath) {
	      return new Promise(resolve => {
	        this.navigation = new Navigation();
	        this.pageList = new PageList();
	        resolve(this.navigation);
	      });
	    }
	    return this.load(navPath, 'xml').then(xml => {
	      this.navigation = new Navigation(xml);
	      this.pageList = new PageList(xml);
	      return this.navigation;
	    });
	  }

	  /**
	   * Gets a Section of the Book from the Spine
	   * Alias for `book.spine.get`
	   * @param {string} target
	   * @return {Section}
	   */
	  section(target) {
	    return this.spine.get(target);
	  }

	  /**
	   * Sugar to render a book to an element
	   * @param  {element | string} element element or string to add a rendition to
	   * @param  {object} [options]
	   * @return {Rendition}
	   */
	  renderTo(element, options) {
	    this.rendition = new Rendition(this, options);
	    this.rendition.attachTo(element);
	    return this.rendition;
	  }

	  /**
	   * Set if request should use withCredentials
	   * @param {boolean} credentials
	   */
	  setRequestCredentials(credentials) {
	    this.settings.requestCredentials = credentials;
	  }

	  /**
	   * Set headers request should use
	   * @param {object} headers
	   */
	  setRequestHeaders(headers) {
	    this.settings.requestHeaders = headers;
	  }

	  /**
	   * Unarchive a zipped epub
	   * @private
	   * @param  {binary} input epub data
	   * @param  {string} [encoding]
	   * @return {Archive}
	   */
	  unarchive(input, encoding) {
	    this.archive = new Archive();
	    return this.archive.open(input, encoding);
	  }

	  /**
	   * Store the epubs contents
	   * @private
	   * @param  {binary} input epub data
	   * @param  {string} [encoding]
	   * @return {Store}
	   */
	  store(name) {
	    // Use "blobUrl" or "base64" for replacements
	    let replacementsSetting = this.settings.replacements && this.settings.replacements !== 'none';
	    // Save original url
	    let originalUrl = this.url;
	    // Save original request method
	    let requester = this.settings.requestMethod || request.bind(this);
	    // Create new Store
	    this.storage = new Store(name, requester, this.resolve.bind(this));
	    // Replace request method to go through store
	    this.request = this.storage.request.bind(this.storage);
	    this.opened.then(() => {
	      if (this.archived) {
	        this.storage.requester = this.archive.request.bind(this.archive);
	      }
	      // Substitute hook
	      let substituteResources = (output, section) => {
	        section.output = this.resources.substitute(output, section.url);
	      };

	      // Set to use replacements
	      this.resources.settings.replacements = replacementsSetting || 'blobUrl';
	      // Create replacement urls
	      this.resources.replacements().then(() => {
	        return this.resources.replaceCss();
	      });
	      this.storage.on('offline', () => {
	        // Remove url to use relative resolving for hrefs
	        this.url = new Url('/', '');
	        // Add hook to replace resources in contents
	        this.spine.hooks.serialize.register(substituteResources);
	      });
	      this.storage.on('online', () => {
	        // Restore original url
	        this.url = originalUrl;
	        // Remove hook
	        this.spine.hooks.serialize.deregister(substituteResources);
	      });
	    });
	    return this.storage;
	  }

	  /**
	   * Get the cover url
	   * @return {Promise<?string>} coverUrl
	   */
	  coverUrl() {
	    return this.loaded.cover.then(() => {
	      if (!this.cover) {
	        return null;
	      }
	      if (this.archived) {
	        return this.archive.createUrl(this.cover);
	      } else {
	        return this.cover;
	      }
	    });
	  }

	  /**
	   * Load replacement urls
	   * @private
	   * @return {Promise} completed loading urls
	   */
	  replacements() {
	    this.spine.hooks.serialize.register((output, section) => {
	      section.output = this.resources.substitute(output, section.url);
	    });
	    return this.resources.replacements().then(() => {
	      return this.resources.replaceCss();
	    });
	  }

	  /**
	   * Find a DOM Range for a given CFI Range
	   * @param  {EpubCFI} cfiRange a epub cfi range
	   * @return {Promise}
	   */
	  getRange(cfiRange) {
	    var cfi = new EpubCFI(cfiRange);
	    var item = this.spine.get(cfi.spinePos);
	    var _request = this.load.bind(this);
	    if (!item) {
	      return new Promise((resolve, reject) => {
	        reject('CFI could not be found');
	      });
	    }
	    return item.load(_request).then(function () {
	      var range = cfi.toRange(item.document);
	      return range;
	    });
	  }

	  /**
	   * Generates the Book Key using the identifier in the manifest or other string provided
	   * @param  {string} [identifier] to use instead of metadata identifier
	   * @return {string} key
	   */
	  key(identifier) {
	    var ident = identifier || this.packaging.metadata.identifier || this.url.filename;
	    return `epubjs:${constants_3}:${ident}`;
	  }

	  /**
	   * Destroy the Book and all associated objects
	   */
	  destroy() {
	    this.opened = undefined;
	    this.loading = undefined;
	    this.loaded = undefined;
	    this.ready = undefined;
	    this.isOpen = false;
	    this.isRendered = false;
	    this.spine && this.spine.destroy();
	    this.locations && this.locations.destroy();
	    this.pageList && this.pageList.destroy();
	    this.archive && this.archive.destroy();
	    this.resources && this.resources.destroy();
	    this.container && this.container.destroy();
	    this.packaging && this.packaging.destroy();
	    this.rendition && this.rendition.destroy();
	    this.displayOptions && this.displayOptions.destroy();
	    this.spine = undefined;
	    this.locations = undefined;
	    this.pageList = undefined;
	    this.archive = undefined;
	    this.resources = undefined;
	    this.container = undefined;
	    this.packaging = undefined;
	    this.rendition = undefined;
	    this.navigation = undefined;
	    this.url = undefined;
	    this.path = undefined;
	    this.archived = false;
	  }
	}

	//-- Enable binding events to book
	eventEmitter(Book.prototype);

	/**
	 * Creates a new Book
	 * @param {string|ArrayBuffer} url URL, Path or ArrayBuffer
	 * @param {object} options to pass to the book
	 * @returns {Book} a new Book object
	 * @example ePub("/path/to/book.epub", {})
	 */
	function ePub(url, options) {
	  return new Book(url, options);
	}
	ePub.VERSION = constants_3;
	if (typeof global !== 'undefined') {
	  global.EPUBJS_VERSION = constants_3;
	}
	ePub.Book = Book;
	ePub.Rendition = Rendition;
	ePub.Contents = Contents;
	ePub.CFI = EpubCFI;
	ePub.utils = utils;

	exports.Book = Book;
	exports.Contents = Contents;
	exports.EpubCFI = EpubCFI;
	exports.Rendition = Rendition;
	exports["default"] = ePub;
	exports.utils = utils;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=epub.umd.js.map
