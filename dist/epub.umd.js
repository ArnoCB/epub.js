(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ePub = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				var isInstance = false;
	      try {
	        isInstance = this instanceof a;
	      } catch {}
				if (isInstance) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var epub$1 = {};

	var book = {};

	var eventEmitter = {exports: {}};

	var d = {exports: {}};

	var is$4;
	var hasRequiredIs$4;

	function requireIs$4 () {
		if (hasRequiredIs$4) return is$4;
		hasRequiredIs$4 = 1;

		// ES3 safe
		var _undefined = void 0;

		is$4 = function (value) { return value !== _undefined && value !== null; };
		return is$4;
	}

	var is$3;
	var hasRequiredIs$3;

	function requireIs$3 () {
		if (hasRequiredIs$3) return is$3;
		hasRequiredIs$3 = 1;

		var isValue = requireIs$4();

		// prettier-ignore
		var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

		is$3 = function (value) {
			if (!isValue(value)) return false;
			return hasOwnProperty.call(possibleTypes, typeof value);
		};
		return is$3;
	}

	var is$2;
	var hasRequiredIs$2;

	function requireIs$2 () {
		if (hasRequiredIs$2) return is$2;
		hasRequiredIs$2 = 1;

		var isObject = requireIs$3();

		is$2 = function (value) {
			if (!isObject(value)) return false;
			try {
				if (!value.constructor) return false;
				return value.constructor.prototype === value;
			} catch (error) {
				return false;
			}
		};
		return is$2;
	}

	var is$1;
	var hasRequiredIs$1;

	function requireIs$1 () {
		if (hasRequiredIs$1) return is$1;
		hasRequiredIs$1 = 1;

		var isPrototype = requireIs$2();

		is$1 = function (value) {
			if (typeof value !== "function") return false;

			if (!hasOwnProperty.call(value, "length")) return false;

			try {
				if (typeof value.length !== "number") return false;
				if (typeof value.call !== "function") return false;
				if (typeof value.apply !== "function") return false;
			} catch (error) {
				return false;
			}

			return !isPrototype(value);
		};
		return is$1;
	}

	var is;
	var hasRequiredIs;

	function requireIs () {
		if (hasRequiredIs) return is;
		hasRequiredIs = 1;

		var isFunction = requireIs$1();

		var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

		is = function (value) {
			if (!isFunction(value)) return false;
			if (classRe.test(functionToString.call(value))) return false;
			return true;
		};
		return is;
	}

	var isImplemented$2;
	var hasRequiredIsImplemented$2;

	function requireIsImplemented$2 () {
		if (hasRequiredIsImplemented$2) return isImplemented$2;
		hasRequiredIsImplemented$2 = 1;

		isImplemented$2 = function () {
			var assign = Object.assign, obj;
			if (typeof assign !== "function") return false;
			obj = { foo: "raz" };
			assign(obj, { bar: "dwa" }, { trzy: "trzy" });
			return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
		};
		return isImplemented$2;
	}

	var isImplemented$1;
	var hasRequiredIsImplemented$1;

	function requireIsImplemented$1 () {
		if (hasRequiredIsImplemented$1) return isImplemented$1;
		hasRequiredIsImplemented$1 = 1;

		isImplemented$1 = function () {
			try {
				Object.keys("primitive");
				return true;
			} catch (e) {
				return false;
			}
		};
		return isImplemented$1;
	}

	var noop$1;
	var hasRequiredNoop;

	function requireNoop () {
		if (hasRequiredNoop) return noop$1;
		hasRequiredNoop = 1;

		// eslint-disable-next-line no-empty-function
		noop$1 = function () {};
		return noop$1;
	}

	var isValue;
	var hasRequiredIsValue;

	function requireIsValue () {
		if (hasRequiredIsValue) return isValue;
		hasRequiredIsValue = 1;

		var _undefined = requireNoop()(); // Support ES3 engines

		isValue = function (val) { return val !== _undefined && val !== null; };
		return isValue;
	}

	var shim$2;
	var hasRequiredShim$2;

	function requireShim$2 () {
		if (hasRequiredShim$2) return shim$2;
		hasRequiredShim$2 = 1;

		var isValue = requireIsValue();

		var keys = Object.keys;

		shim$2 = function (object) { return keys(isValue(object) ? Object(object) : object); };
		return shim$2;
	}

	var keys;
	var hasRequiredKeys;

	function requireKeys () {
		if (hasRequiredKeys) return keys;
		hasRequiredKeys = 1;

		keys = requireIsImplemented$1()() ? Object.keys : requireShim$2();
		return keys;
	}

	var validValue;
	var hasRequiredValidValue;

	function requireValidValue () {
		if (hasRequiredValidValue) return validValue;
		hasRequiredValidValue = 1;

		var isValue = requireIsValue();

		validValue = function (value) {
			if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
			return value;
		};
		return validValue;
	}

	var shim$1;
	var hasRequiredShim$1;

	function requireShim$1 () {
		if (hasRequiredShim$1) return shim$1;
		hasRequiredShim$1 = 1;

		var keys  = requireKeys()
		  , value = requireValidValue()
		  , max   = Math.max;

		shim$1 = function (dest, src /*, …srcn*/) {
			var error, i, length = max(arguments.length, 2), assign;
			dest = Object(value(dest));
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
		return shim$1;
	}

	var assign;
	var hasRequiredAssign;

	function requireAssign () {
		if (hasRequiredAssign) return assign;
		hasRequiredAssign = 1;

		assign = requireIsImplemented$2()() ? Object.assign : requireShim$1();
		return assign;
	}

	var normalizeOptions;
	var hasRequiredNormalizeOptions;

	function requireNormalizeOptions () {
		if (hasRequiredNormalizeOptions) return normalizeOptions;
		hasRequiredNormalizeOptions = 1;

		var isValue = requireIsValue();

		var forEach = Array.prototype.forEach, create = Object.create;

		var process = function (src, obj) {
			var key;
			for (key in src) obj[key] = src[key];
		};

		// eslint-disable-next-line no-unused-vars
		normalizeOptions = function (opts1 /*, …options*/) {
			var result = create(null);
			forEach.call(arguments, function (options) {
				if (!isValue(options)) return;
				process(Object(options), result);
			});
			return result;
		};
		return normalizeOptions;
	}

	var isImplemented;
	var hasRequiredIsImplemented;

	function requireIsImplemented () {
		if (hasRequiredIsImplemented) return isImplemented;
		hasRequiredIsImplemented = 1;

		var str = "razdwatrzy";

		isImplemented = function () {
			if (typeof str.contains !== "function") return false;
			return str.contains("dwa") === true && str.contains("foo") === false;
		};
		return isImplemented;
	}

	var shim;
	var hasRequiredShim;

	function requireShim () {
		if (hasRequiredShim) return shim;
		hasRequiredShim = 1;

		var indexOf = String.prototype.indexOf;

		shim = function (searchString /*, position*/) {
			return indexOf.call(this, searchString, arguments[1]) > -1;
		};
		return shim;
	}

	var contains$1;
	var hasRequiredContains;

	function requireContains () {
		if (hasRequiredContains) return contains$1;
		hasRequiredContains = 1;

		contains$1 = requireIsImplemented()() ? String.prototype.contains : requireShim();
		return contains$1;
	}

	var hasRequiredD;

	function requireD () {
		if (hasRequiredD) return d.exports;
		hasRequiredD = 1;

		var isValue         = requireIs$4()
		  , isPlainFunction = requireIs()
		  , assign          = requireAssign()
		  , normalizeOpts   = requireNormalizeOptions()
		  , contains        = requireContains();

		var d$1 = (d.exports = function (dscr, value/*, options*/) {
			var c, e, w, options, desc;
			if (arguments.length < 2 || typeof dscr !== "string") {
				options = value;
				value = dscr;
				dscr = null;
			} else {
				options = arguments[2];
			}
			if (isValue(dscr)) {
				c = contains.call(dscr, "c");
				e = contains.call(dscr, "e");
				w = contains.call(dscr, "w");
			} else {
				c = w = true;
				e = false;
			}

			desc = { value: value, configurable: c, enumerable: e, writable: w };
			return !options ? desc : assign(normalizeOpts(options), desc);
		});

		d$1.gs = function (dscr, get, set/*, options*/) {
			var c, e, options, desc;
			if (typeof dscr !== "string") {
				options = set;
				set = get;
				get = dscr;
				dscr = null;
			} else {
				options = arguments[3];
			}
			if (!isValue(get)) {
				get = undefined;
			} else if (!isPlainFunction(get)) {
				options = get;
				get = set = undefined;
			} else if (!isValue(set)) {
				set = undefined;
			} else if (!isPlainFunction(set)) {
				options = set;
				set = undefined;
			}
			if (isValue(dscr)) {
				c = contains.call(dscr, "c");
				e = contains.call(dscr, "e");
			} else {
				c = true;
				e = false;
			}

			desc = { get: get, set: set, configurable: c, enumerable: e };
			return !options ? desc : assign(normalizeOpts(options), desc);
		};
		return d.exports;
	}

	var validCallable;
	var hasRequiredValidCallable;

	function requireValidCallable () {
		if (hasRequiredValidCallable) return validCallable;
		hasRequiredValidCallable = 1;

		validCallable = function (fn) {
			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
			return fn;
		};
		return validCallable;
	}

	eventEmitter.exports;

	var hasRequiredEventEmitter;

	function requireEventEmitter () {
		if (hasRequiredEventEmitter) return eventEmitter.exports;
		hasRequiredEventEmitter = 1;
		(function (module, exports) {

			var d        = requireD()
			  , callable = requireValidCallable()

			  , apply = Function.prototype.apply, call = Function.prototype.call
			  , create = Object.create, defineProperty = Object.defineProperty
			  , defineProperties = Object.defineProperties
			  , hasOwnProperty = Object.prototype.hasOwnProperty
			  , descriptor = { configurable: true, enumerable: false, writable: true }

			  , on, once, off, emit, methods, descriptors, base;

			on = function (type, listener) {
				var data;

				callable(listener);

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

				callable(listener);
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

				callable(listener);

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
				on: d(on),
				once: d(once),
				off: d(off),
				emit: d(emit)
			};

			base = defineProperties({}, descriptors);

			module.exports = exports = function (o) {
				return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
			};
			exports.methods = methods; 
		} (eventEmitter, eventEmitter.exports));
		return eventEmitter.exports;
	}

	var core = {};

	var hasRequiredCore;
	function requireCore() {
	  if (hasRequiredCore) return core;
	  hasRequiredCore = 1;
	  /**
	   * Core Utilities and Helpers
	   */
	  Object.defineProperty(core, "__esModule", {
	    value: true
	  });
	  core.defer = core.requestAnimationFrame = void 0;
	  core.uuid = uuid;
	  core.documentHeight = documentHeight;
	  core.isElement = isElement;
	  core.isNumber = isNumber;
	  core.isFloat = isFloat;
	  core.prefixed = prefixed;
	  core.defaults = defaults;
	  core.extend = extend;
	  core.insert = insert;
	  core.locationOf = locationOf;
	  core.indexOfSorted = indexOfSorted;
	  core.bounds = bounds;
	  core.borders = borders;
	  core.nodeBounds = nodeBounds;
	  core.windowBounds = windowBounds;
	  core.isXml = isXml;
	  core.createBlob = createBlob;
	  core.createBlobUrl = createBlobUrl;
	  core.revokeBlobUrl = revokeBlobUrl;
	  core.createBase64Url = createBase64Url;
	  core.type = type;
	  core.parse = parse;
	  core.sprint = sprint;
	  core.treeWalker = treeWalker;
	  core.walk = walk;
	  core.blob2base64 = blob2base64;
	  core.querySelectorByType = querySelectorByType;
	  core.findChildren = findChildren;
	  core.parents = parents;
	  core.filterChildren = filterChildren;
	  core.getParentByTagName = getParentByTagName;
	  core.getValidOrDefault = getValidOrDefault;
	  /**
	   * Vendor prefixed requestAnimationFrame
	   */
	  core.requestAnimationFrame = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined;
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
	   */
	  function uuid() {
	    let d = new Date().getTime();
	    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      const r = (d + Math.random() * 16) % 16 | 0;
	      d = Math.floor(d / 16);
	      return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
	    });
	    return uuid;
	  }
	  /**
	   * Gets the height of a document
	   */
	  function documentHeight() {
	    return Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
	  }
	  /**
	   * Checks if a node is an element
	   */
	  function isElement(obj) {
	    return !!(obj && obj.nodeType === Node.ELEMENT_NODE);
	  }
	  function isNumber(n) {
	    return typeof n === 'number' && isFinite(n);
	  }
	  /**
	   * Checks if a value is a float
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
	   */
	  function extend(target, ...sources) {
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
	   */
	  function insert(item, array, compareFunction) {
	    const location = locationOf(item, array, compareFunction);
	    array.splice(location, 0, item);
	    return location;
	  }
	  /**
	   * Finds where something would fit into a sorted array
	   */
	  function locationOf(item, array, compareFunction, _start, _end) {
	    const start = _start ?? 0;
	    const end = _end ?? array.length;
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
	   */
	  function indexOfSorted(item, array, compareFunction, _start, _end) {
	    const start = _start ?? 0;
	    const end = _end ?? array.length;
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
	    const widthProps = ['width', 'paddingRight', 'paddingLeft', 'marginRight', 'marginLeft', 'borderRightWidth', 'borderLeftWidth'];
	    const heightProps = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'borderTopWidth', 'borderBottomWidth'];
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
	      width: width
	    };
	  }
	  /**
	   * Find the bounds of an element
	   * taking padding, margin and borders into account
	   */
	  function borders(el) {
	    const style = window.getComputedStyle(el);
	    const widthProps = ['paddingRight', 'paddingLeft', 'marginRight', 'marginLeft', 'borderRightWidth', 'borderLeftWidth'];
	    const heightProps = ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'borderTopWidth', 'borderBottomWidth'];
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
	    const blob = createBlob(content, mime);
	    return _URL.createObjectURL(blob);
	  }
	  /**
	   * Remove a blob url
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
	  // ...existing code...
	  	// ...existing code...
	  	/**
	   * Sprint through all text nodes in a document
	   * @memberof Core
	   */
	  function sprint(root, func) {
	    const doc = root.ownerDocument || root;
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
	    const treeWalker = document.createTreeWalker(root, filter, null);
	    let node;
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
	   */
	  function querySelectorByType(html, element, type) {
	    return html.querySelector(`${element}[*|type="${type}"]`);
	  }
	  /**
	   * Find direct descendents of an element
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
	  core.defer = defer;
	  /**
	   * Returns a valid value from allowed options or a default if invalid/missing
	   */
	  function getValidOrDefault(value, allowed, defaultValue) {
	    const allowedValues = Array.isArray(allowed) ? allowed : Object.values(allowed);
	    if (typeof value === 'string' && allowedValues.includes(value)) {
	      return value;
	    }
	    return defaultValue;
	  }
	  return core;
	}

	var url = {};

	var path$1 = {};

	var path;
	var hasRequiredPath$1;

	function requirePath$1 () {
		if (hasRequiredPath$1) return path;
		hasRequiredPath$1 = 1;

		if (!process) {
		  var process = {
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
		          cwd = process.cwd();
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


		path = posix;
		return path;
	}

	var hasRequiredPath;
	function requirePath() {
	  if (hasRequiredPath) return path$1;
	  hasRequiredPath = 1;
	  var __importDefault = path$1 && path$1.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(path$1, "__esModule", {
	    value: true
	  });
	  const path_webpack_1 = __importDefault(requirePath$1());
	  /**
	   * Creates a Path object for parsing and manipulation of a path strings
	   *
	   * Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
	   * @param	pathString	a url string (relative or absolute)
	   */
	  class Path {
	    constructor(pathString) {
	      let normalized;
	      let parsed;
	      if (pathString.indexOf('://') > -1) {
	        // Always use the pathname for URLs (strips protocol/host)
	        const urlObj = new URL(pathString);
	        normalized = urlObj.pathname.replace(/\\/g, '/').replace(/\/+/g, '/');
	        parsed = this.parse(normalized);
	        this._path = normalized;
	        // Directory: strip filename from pathname, ensure trailing slash
	        let dir = normalized.replace(/[^/]*$/, '');
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
	    get directory() {
	      return this._directory;
	    }
	    get path() {
	      return this._path;
	    }
	    get filename() {
	      return this._filename;
	    }
	    get extension() {
	      return this._extension;
	    }
	    /**
	     * Parse the path: https://nodejs.org/api/path.html#path_path_parse_path
	     * Mimics Node.js path.parse for POSIX paths.
	     */
	    parse(what) {
	      const re = /^(.*[\\/])?([^\\/]+?)(\.[^.]*)?$/;
	      const match = re.exec(what) || [];
	      const dir = match[1] ? match[1].replace(/[\\/]+$/, '') : '';
	      const base = match[2] ? match[2] + (match[3] || '') : '';
	      const ext = match[3] || '';
	      const name = match[2] || '';
	      return {
	        dir,
	        base,
	        ext,
	        name
	      };
	    }
	    /**
	     * @param	{string} what
	     * @returns {boolean}
	     */
	    isAbsolute(what) {
	      return path_webpack_1.default.isAbsolute(what || this.path);
	    }
	    /**
	     * Check if path ends with a directory
	     * @param	{string} what
	     * @returns {boolean}
	     */
	    isDirectory(what) {
	      return what.charAt(what.length - 1) === '/';
	    }
	    /**
	     * Resolve a path against the directory of the Path.
	     * Joins this.directory and what, normalizing slashes.
	     * https://nodejs.org/api/path.html#path_path_resolve_paths
	     * @param	{string} what
	     * @returns {string} resolved
	         */
	    resolve(what) {
	      let base = this.directory;
	      if (!base.endsWith('/')) base += '/';
	      let result = base + what;
	      result = result.replace(/\/+/g, '/').replace(/\/\.\//g, '/');
	      // Check for absolute path
	      if (typeof what === 'string' && (what.startsWith('/') || what.indexOf('://') > -1)) {
	        throw new Error('[Path.resolve] Cannot resolve an absolute path: ' + what);
	      }
	      // Remove '..' segments
	      const parts = result.split('/');
	      const stack = [];
	      for (const part of parts) {
	        if (part === '..') {
	          stack.pop();
	        } else if (part !== '') {
	          stack.push(part);
	        }
	      }
	      return '/' + stack.join('/');
	    }
	    /**
	     * Resolve a path relative to the directory of the Path
	     *
	     * https://nodejs.org/api/path.html#path_path_relative_from_to
	     * @param	{string} what
	     * @returns {string} relative
	     */
	    relative(what) {
	      const isAbsolute = what && what.indexOf('://') > -1;
	      if (isAbsolute) {
	        return what;
	      }
	      // Remove leading slashes for both paths
	      const from = this.directory.replace(/^\/+/, '');
	      const to = what.replace(/^\/+/, '');
	      const fromParts = from.split('/').filter(Boolean);
	      const toParts = to.split('/').filter(Boolean);
	      // Find common prefix
	      let i = 0;
	      while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
	        i++;
	      }
	      // Go up for the remaining fromParts, then down for the remaining toParts
	      const up = fromParts.length - i;
	      const down = toParts.slice(i);
	      return (up ? '../'.repeat(up) : '') + down.join('/');
	    }
	    toString() {
	      return this.path;
	    }
	  }
	  path$1.default = Path;
	  return path$1;
	}

	var hasRequiredUrl;
	function requireUrl() {
	  if (hasRequiredUrl) return url;
	  hasRequiredUrl = 1;
	  var __importDefault = url && url.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(url, "__esModule", {
	    value: true
	  });
	  const path_1 = __importDefault(requirePath());
	  /**
	   * Creates a Url object for parsing and manipulation of a url string
	   *
	   * Defaults to window.location.href
	   */
	  class Url {
	    constructor(urlString, baseString) {
	      const absolute = urlString.indexOf('://') > -1;
	      let pathname = urlString;
	      let basePath;
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
	        } catch {
	          // Skip URL parsing
	          this.Url = undefined;
	          // resolve the pathname from the base
	          if (this.base) {
	            basePath = new path_1.default(this.base);
	            pathname = basePath.resolve(pathname);
	          }
	        }
	      }
	      this.Path = new path_1.default(pathname);
	      this.directory = this.Path.directory;
	      this.filename = this.Path.filename;
	      this.extension = this.Path.extension;
	    }
	    path() {
	      return this.Path;
	    }
	    /**
	     * Resolves a relative path to a absolute url
	     */
	    resolve(what) {
	      // If what is an absolute path, join directly to origin
	      if (what.startsWith('/')) {
	        return this.origin + what;
	      }
	      // If what is a full URL, return as is
	      if (what.indexOf('://') > -1) {
	        return what;
	      }
	      const fullpath = this.Path.resolve(what);
	      return this.origin + fullpath;
	    }
	    /**
	     * Resolve a path relative to the url
	     */
	    relative(what) {
	      return this.Path.relative(what);
	    }
	    toString() {
	      return this.href;
	    }
	  }
	  url.default = Url;
	  return url;
	}

	var spine$1 = {exports: {}};

	var epubcfi = {};

	var hasRequiredEpubcfi;
	function requireEpubcfi() {
	  if (hasRequiredEpubcfi) return epubcfi;
	  hasRequiredEpubcfi = 1;
	  Object.defineProperty(epubcfi, "__esModule", {
	    value: true
	  });
	  const core_1 = requireCore();
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
	    /**
	     * Convert custom range objects to DOM Range
	     */
	    static resolveToDomRange(input, doc) {
	      if (!input || typeof input === 'string') return null;
	      if ('startContainer' in input && 'endContainer' in input && typeof doc.createRange === 'function') {
	        const range = doc.createRange();
	        range.setStart(input.startContainer, input.startOffset);
	        range.setEnd(input.endContainer, input.endOffset);
	        return range;
	      }
	      return input;
	    }
	    /**
	     * Helper to get offset from a CFIComponent, falling back to another if needed
	     */
	    getOffset(comp, fallback) {
	      return comp && comp.terminal.offset != null ? comp.terminal.offset : fallback.terminal.offset != null ? fallback.terminal.offset : 0;
	    }
	    constructor(cfiFrom = '', base = {
	      steps: [],
	      terminal: {
	        offset: null,
	        assertion: null
	      }
	    }, ignoreClass) {
	      this.str = '';
	      this.base = {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
	      };
	      this.spinePos = 0;
	      this.range = false;
	      this.start = null;
	      this.end = null;
	      this.path = {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
	      };
	      this.base = typeof base === 'string' ? this.parseComponent(base) : 'steps' in base ? base : {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
	      };
	      if (cfiFrom) {
	        this.init(cfiFrom, ignoreClass);
	      }
	    }
	    init(cfiFrom, ignoreClass) {
	      switch (this.checkType(cfiFrom)) {
	        case 'string':
	          {
	            this.str = cfiFrom;
	            const parsed = this.parse(this.str);
	            Object.assign(this, {
	              base: parsed.base,
	              spinePos: parsed.spinePos,
	              range: !!(parsed.range && parsed.start && parsed.end),
	              path: parsed.path,
	              start: parsed.start,
	              end: parsed.end
	            });
	            break;
	          }
	        case 'range':
	          {
	            const {
	              path,
	              start,
	              end
	            } = this.fromRange(cfiFrom, this.base, ignoreClass);
	            Object.assign(this, {
	              range: true,
	              path,
	              start,
	              end
	            });
	            break;
	          }
	        case 'customRange':
	          {
	            const custom = cfiFrom;
	            const fakeRange = {
	              startContainer: custom.startContainer,
	              startOffset: custom.startOffset,
	              endContainer: custom.endContainer,
	              endOffset: custom.endOffset,
	              collapsed: custom.startContainer === custom.endContainer && custom.startOffset === custom.endOffset
	            };
	            const {
	              path,
	              start,
	              end
	            } = this.fromRange(fakeRange, this.base, ignoreClass);
	            Object.assign(this, {
	              range: true,
	              path,
	              start,
	              end
	            });
	            break;
	          }
	        case 'node':
	          {
	            const {
	              path
	            } = this.fromNode(cfiFrom, this.base, ignoreClass);
	            Object.assign(this, {
	              range: false,
	              path,
	              start: null,
	              end: null
	            });
	            break;
	          }
	        case 'EpubCFI':
	          {
	            const sourceCfi = cfiFrom;
	            Object.assign(this, {
	              str: sourceCfi.str,
	              base: sourceCfi.base,
	              spinePos: sourceCfi.spinePos,
	              range: sourceCfi.range,
	              path: sourceCfi.path,
	              start: sourceCfi.start,
	              end: sourceCfi.end
	            });
	            break;
	          }
	        default:
	          throw new TypeError(`Invalid argument type for EpubCFI constructor: ${typeof cfiFrom}`);
	      }
	    }
	    /**
	     * Check the type of constructor input
	     */
	    checkType(cfi) {
	      if (this.isCfiString(cfi)) return 'string';
	      if (cfi && typeof cfi === 'object' && ((0, core_1.type)(cfi) === 'Range' || typeof cfi.startContainer !== 'undefined' && typeof cfi.collapsed !== 'undefined')) {
	        return 'range';
	      }
	      if (cfi && typeof cfi === 'object' && typeof cfi.nodeType !== 'undefined') {
	        return 'node';
	      }
	      if (cfi && typeof cfi === 'object' && typeof cfi.startContainer !== 'undefined' && typeof cfi.startOffset !== 'undefined' && typeof cfi.endContainer !== 'undefined' && typeof cfi.endOffset !== 'undefined' && !('collapsed' in cfi)) {
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
	    parse(cfiStr) {
	      const emptyComponent = {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
	      };
	      if (typeof cfiStr !== 'string') {
	        return {
	          spinePos: -1,
	          range: false,
	          base: emptyComponent,
	          path: emptyComponent,
	          start: null,
	          end: null
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
	          end: null
	        };
	      }
	      const base = this.parseComponent(baseComponent);
	      const pathComponent = this.getPathComponent(cfiStr);
	      const path = typeof pathComponent === 'string' ? this.parseComponent(pathComponent) : emptyComponent;
	      const range = this.getRange(cfiStr);
	      const start = range ? this.parseComponent(range[0]) : null;
	      const end = range ? this.parseComponent(range[1]) : null;
	      const isRange = !!range;
	      const spinePos = base.steps[1]?.index ?? -1;
	      return {
	        spinePos,
	        range: isRange,
	        base,
	        path,
	        start,
	        end
	      };
	    }
	    parseComponent(componentStr) {
	      const component = {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
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
	      component.steps = steps.map(step => this.parseStep(step)).filter(Boolean);
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
	      return {
	        type,
	        index,
	        id,
	        tagName
	      };
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
	      return {
	        offset: characterOffset,
	        assertion: textLocationAssertion
	      };
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
	      if (!steps?.length) return '';
	      return steps.map(part => {
	        const value = part.type === 'element' ? (part.index + 1) * 2 : 1 + 2 * part.index;
	        return `${value}${part.id ? `[${part.id}]` : ''}`;
	      }).join('/');
	    }
	    segmentString(segment) {
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
	      const getStepsAndTerminal = cfi => cfi.range && cfi.start && cfi.end ? {
	        steps: cfi.path.steps.concat(cfi.start.steps),
	        terminal: cfi.start.terminal
	      } : {
	        steps: cfi.path.steps,
	        terminal: cfi.path.terminal
	      };
	      const {
	        steps: stepsA,
	        terminal: terminalA
	      } = getStepsAndTerminal(cfiOne);
	      const {
	        steps: stepsB,
	        terminal: terminalB
	      } = getStepsAndTerminal(cfiTwo);
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
	    step(node) {
	      const nodeType = node.nodeType === TEXT_NODE ? 'text' : 'element';
	      let id = null;
	      let tagName = null;
	      if (node.nodeType === ELEMENT_NODE) {
	        id = node.id;
	        tagName = node.tagName;
	      }
	      return {
	        type: nodeType,
	        index: this.position(node),
	        id,
	        tagName
	      };
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
	        tagName
	      };
	    }
	    pathTo(node, offset, ignoreClass) {
	      const segment = {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
	      };
	      let currentNode = node;
	      let step;
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
	            index: 0
	          });
	        }
	      }
	      return segment;
	    }
	    equalStep(stepA, stepB) {
	      if (!stepA || !stepB) return false;
	      return stepA.index === stepB.index && stepA.id === stepB.id && stepA.type === stepB.type;
	    }
	    equalTerminal(terminalA, terminalB) {
	      return terminalA.offset === terminalB.offset && terminalA.assertion === terminalB.assertion;
	    }
	    /**
	     * Create a CFI range object from a DOM Range or CustomRange
	     */
	    fromRange(range, base, ignoreClass) {
	      let start, end, startOffset, endOffset;
	      // Duck-typing for DOM Range detection (works across iframes)
	      function isDOMRange(obj) {
	        return !!obj && typeof obj === 'object' && 'startContainer' in obj && typeof obj.startContainer === 'object' && 'endContainer' in obj && typeof obj.endContainer === 'object' && 'startOffset' in obj && typeof obj.startOffset === 'number' && 'endOffset' in obj && typeof obj.endOffset === 'number' && 'collapsed' in obj && typeof obj.collapsed === 'boolean' && 'commonAncestorContainer' in obj && typeof obj.commonAncestorContainer === 'object';
	      }
	      // Check if it's a custom range (has the required properties but not necessarily all DOM Range properties)
	      function isCustomRange(obj) {
	        return !!obj && typeof obj === 'object' && 'startContainer' in obj && typeof obj.startContainer === 'object' && 'endContainer' in obj && typeof obj.endContainer === 'object' && 'startOffset' in obj && typeof obj.startOffset === 'number' && 'endOffset' in obj && typeof obj.endOffset === 'number';
	      }
	      if (isDOMRange(range)) {
	        start = range.startContainer;
	        end = range.endContainer;
	        startOffset = range.startOffset;
	        endOffset = range.endOffset;
	      } else if (isCustomRange(range)) {
	        start = range.startContainer;
	        end = range.endContainer;
	        startOffset = range.startOffset;
	        endOffset = range.endOffset;
	      } else {
	        throw new Error('Invalid range object provided to fromRange');
	      }
	      const needsIgnoring = !!(ignoreClass && start.ownerDocument?.querySelector('.' + ignoreClass));
	      const patch = (node, offset) => needsIgnoring && typeof ignoreClass === 'string' ? node.nodeType === TEXT_NODE ? this.patchOffset(node, offset, ignoreClass) : offset : offset;
	      // Check if the range is collapsed
	      const isCollapsed = start === end && startOffset === endOffset;
	      if (isCollapsed) {
	        startOffset = patch(start, startOffset);
	        const path = this.pathTo(start, startOffset, ignoreClass);
	        return {
	          path,
	          start: path,
	          end: path
	        };
	      }
	      startOffset = patch(start, startOffset);
	      endOffset = patch(end, endOffset);
	      const startComp = this.pathTo(start, startOffset, ignoreClass);
	      const endComp = this.pathTo(end, endOffset, ignoreClass);
	      // Find common path steps
	      const path = {
	        steps: [],
	        terminal: {
	          offset: null,
	          assertion: null
	        }
	      };
	      const len = startComp.steps.length;
	      for (let i = 0; i < len; i++) {
	        if (!this.equalStep(startComp.steps[i], endComp.steps[i])) break;
	        path.steps.push(startComp.steps[i]);
	      }
	      // If last step is equal, check terminals
	      if (len > 0 && this.equalStep(startComp.steps[len - 1], endComp.steps[len - 1]) && this.equalTerminal(startComp.terminal, endComp.terminal)) {
	        path.steps.push(startComp.steps[len - 1]);
	      }
	      // Remove common steps from start/end
	      const common = path.steps.length;
	      startComp.steps = startComp.steps.slice(common);
	      endComp.steps = endComp.steps.slice(common);
	      return {
	        path,
	        start: startComp,
	        end: endComp
	      };
	    }
	    /**
	     * Create a CFI object from a Node
	     */
	    fromNode(anchor, base, ignoreClass) {
	      const cfi = {
	        path: {
	          steps: [],
	          terminal: {
	            offset: null,
	            assertion: null
	          }
	        },
	        start: {
	          steps: [],
	          terminal: {
	            offset: null,
	            assertion: null
	          }
	        },
	        end: {
	          steps: [],
	          terminal: {
	            offset: null,
	            assertion: null
	          }
	        }
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
	      let needsIgnoring = false;
	      if (isText) {
	        if (parent instanceof Element && parent.classList.contains(ignoreClass)) {
	          needsIgnoring = true;
	        }
	      } else if (anchor instanceof Element && anchor.classList.contains(ignoreClass)) {
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
	    patchOffset(anchor, offset, ignoreClass) {
	      if (anchor.nodeType != TEXT_NODE) {
	        throw new Error('Anchor must be a text node');
	      }
	      let curr = anchor;
	      let totalOffset = offset;
	      // If the parent is a ignored node, get offset from it's start
	      if (anchor.parentNode && anchor.parentNode instanceof Element && anchor.parentNode.classList.contains(ignoreClass)) {
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
	        if (currNodeType === ELEMENT_NODE && node instanceof Element && node.classList.contains(ignoreClass ?? '')) {
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
	      let children;
	      let index;
	      if (anchor.nodeType === ELEMENT_NODE) {
	        const parent = anchor.parentNode;
	        children = parent ? parent.children : undefined;
	        if (!children && parent) {
	          children = (0, core_1.findChildren)(parent);
	        }
	        index = children ? Array.prototype.indexOf.call(children, anchor) : -1;
	        return index;
	      }
	      if (!anchor.parentNode) {
	        return -1;
	      }
	      children = this.textNodes(anchor.parentNode);
	      index = children.indexOf(anchor);
	      return index;
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
	        } else if (step.type === 'text') ; else {
	          query.push('*:nth-child(' + position + ')');
	        }
	      });
	      return query.join('>');
	    }
	    textNodes(container, ignoreClass) {
	      if (!container || !container.childNodes) {
	        return [];
	      }
	      return Array.prototype.slice.call(container.childNodes).filter(function (node) {
	        if (node.nodeType === TEXT_NODE) {
	          return true;
	        }
	        // Treat elements with ignoreClass as text nodes for CFI positioning
	        if (ignoreClass && node.nodeType === ELEMENT_NODE && node instanceof Element && node.classList.contains(ignoreClass)) {
	          return true;
	        }
	        return false;
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
	            children = container instanceof Element ? Array.from(container.children) : container ? [] : [];
	            container = children[step.index];
	          }
	        } else if (step.type === 'text') {
	          const textNodesArr = this.textNodes(container, ignoreClass ?? '');
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
	        container = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	      } else if (ignoreClass) {
	        container = this.walkToNode(steps, doc, ignoreClass);
	      } else {
	        container = this.walkToNode(steps, doc, undefined);
	      }
	      return container;
	    }
	    fixMiss(steps, offset, _doc, ignoreClass) {
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
	      return {
	        container,
	        offset
	      };
	    }
	    toRange(_doc, ignoreClass) {
	      const doc = _doc || document;
	      // Defensive: if this is a custom range object, convert to DOM Range
	      const isCustomRange = obj => {
	        return typeof obj === 'object' && obj !== null && 'startContainer' in obj && 'endContainer' in obj;
	      };
	      if (isCustomRange(this)) {
	        const domRange = EpubCFI.resolveToDomRange(this, doc);
	        if (domRange) return domRange;
	      }
	      // Otherwise, proceed as before
	      const needsIgnoring = ignoreClass && doc.querySelector('.' + ignoreClass);
	      const useIgnore = needsIgnoring ? ignoreClass : undefined;
	      const range = doc.createRange();
	      const isRange = this.range && this.start && this.end;
	      const startSteps = isRange ? this.path.steps.concat(this.start ? this.start.steps : []) : this.path.steps;
	      const endSteps = isRange ? this.path.steps.concat(this.end ? this.end.steps : []) : undefined;
	      const startContainer = this.findNode(startSteps, doc, useIgnore);
	      const endContainer = endSteps ? this.findNode(endSteps, doc, useIgnore) : undefined;
	      if (!startContainer) {
	        return null;
	      }
	      try {
	        range.setStart(startContainer, this.getOffset(this.start, this.path));
	      } catch {
	        const missed = this.fixMiss(startSteps, this.getOffset(this.start, this.path), doc, useIgnore);
	        if (missed?.container) range.setStart(missed.container, missed.offset ?? 0);
	      }
	      if (endContainer && this.end) {
	        try {
	          range.setEnd(endContainer, this.getOffset(this.end, this.path));
	        } catch {
	          const missed = this.fixMiss(endSteps, this.getOffset(this.end, this.path), doc, useIgnore);
	          if (missed?.container) range.setEnd(missed.container, missed.offset ?? 0);
	        }
	      }
	      return range;
	    }
	    /**
	     * Check if a string is wrapped with "epubcfi()"
	     */
	    isCfiString(str) {
	      if (typeof str === 'string' && str.indexOf('epubcfi(') === 0 && str[str.length - 1] === ')') {
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
	  epubcfi.default = EpubCFI;
	  return epubcfi;
	}

	var hook = {};

	var hasRequiredHook;
	function requireHook() {
	  if (hasRequiredHook) return hook;
	  hasRequiredHook = 1;
	  /**
	   * Hooks allow for injecting functions that must all complete in order before finishing
	   * They will execute in parallel but all must finish before continuing
	   * Functions may return a promise if they are async.
	   * @example this.content = new EPUBJS.Hook(this);
	   */
	  Object.defineProperty(hook, "__esModule", {
	    value: true
	  });
	  class Hook {
	    constructor(context) {
	      this.context = context || this;
	      this.hooks = [];
	    }
	    /**
	     * Adds a function to be run before a hook completes
	     * @example this.content.register(function(){...});
	     */
	    register(...tasks) {
	      for (const task of tasks) {
	        if (typeof task === 'function') {
	          this.hooks.push(task);
	        } else if (Array.isArray(task)) {
	          for (const fn of task) {
	            if (typeof fn === 'function') {
	              this.hooks.push(fn);
	            }
	          }
	        }
	      }
	    }
	    /**
	     * Removes a function
	     * @example this.content.deregister(function(){...});
	     */
	    deregister(func) {
	      const idx = this.hooks.indexOf(func);
	      if (idx !== -1) {
	        this.hooks.splice(idx, 1);
	      }
	    }
	    /**
	     * Triggers a hook to run all functions
	     * @example this.content.trigger(args).then(function(){...});
	     */
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    trigger(...args) {
	      const context = this.context;
	      const promises = [];
	      this.hooks.forEach(task => {
	        try {
	          const executing = task.apply(context, args);
	          if (executing && typeof executing === 'object' &&
	          // eslint-disable-next-line @typescript-eslint/no-explicit-any
	          typeof executing.then === 'function') {
	            // eslint-disable-next-line @typescript-eslint/no-explicit-any
	            promises.push(executing);
	          }
	        } catch (err) {
	          console.log(err);
	        }
	        // Otherwise Task resolves immediately, continue
	      });
	      return Promise.all(promises);
	    }
	    // Adds a function to be run before a hook completes
	    list() {
	      return this.hooks;
	    }
	    clear() {
	      return this.hooks = [];
	    }
	  }
	  hook.default = Hook;
	  return hook;
	}

	var section$1 = {exports: {}};

	var request = {};

	var hasRequiredRequest;
	function requireRequest() {
	  if (hasRequiredRequest) return request;
	  hasRequiredRequest = 1;
	  var __importDefault = request && request.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(request, "__esModule", {
	    value: true
	  });
	  const core_1 = requireCore();
	  const path_1 = __importDefault(requirePath());
	  function request$1(url, type, withCredentials = false, headers = {}) {
	    const supportsURL = typeof window != 'undefined' ? window.URL : false;
	    const BLOB_RESPONSE = supportsURL ? 'blob' : 'arraybuffer';
	    return new Promise((resolve, reject) => {
	      const xhr = new XMLHttpRequest();
	      //-- Check from PDF.js:
	      //   https://github.com/mozilla/pdf.js/blob/master/web/compatibility.js
	      const xhrPrototype = XMLHttpRequest.prototype;
	      let header;
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
	        type = new path_1.default(url).extension;
	      }
	      if (type == 'blob') {
	        xhr.responseType = BLOB_RESPONSE;
	      }
	      if ((0, core_1.isXml)(type)) {
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
	          let responseXML = null;
	          if (this.responseType === '' || this.responseType === 'document') {
	            responseXML = this.responseXML;
	          }
	          if (this.status === 200 || this.status === 0 || responseXML) {
	            //-- Firefox is reporting 0 for blob urls
	            let r;
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
	            } else if ((0, core_1.isXml)(type)) {
	              // xhr.overrideMimeType("text/xml"); // for OPF parsing
	              // If this.responseXML wasn't set, try to parse using a DOMParser from text
	              r = (0, core_1.parse)(this.response, 'text/xml');
	            } else if (type == 'xhtml') {
	              r = (0, core_1.parse)(this.response, 'application/xhtml+xml');
	            } else if (type == 'html' || type == 'htm') {
	              r = (0, core_1.parse)(this.response, 'text/html');
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
	  request.default = request$1;
	  return request;
	}

	var section = section$1.exports;
	var hasRequiredSection;
	function requireSection() {
	  if (hasRequiredSection) return section$1.exports;
	  hasRequiredSection = 1;
	  (function (module, exports) {

	    var __importDefault = section && section.__importDefault || function (mod) {
	      return mod && mod.__esModule ? mod : {
	        "default": mod
	      };
	    };
	    Object.defineProperty(exports, "__esModule", {
	      value: true
	    });
	    exports.Section = void 0;
	    const core_1 = requireCore();
	    const epubcfi_1 = __importDefault(requireEpubcfi());
	    const hook_1 = __importDefault(requireHook());
	    const core_2 = requireCore();
	    const request_1 = __importDefault(requireRequest());
	    /**
	     * Represents a Section of the Book
	     *
	     * In most books this is equivalent to a Chapter
	     * @param item  The spine item representing the section
	     * @param hooks hooks for serialize and content
	     */
	    class Section {
	      constructor(item, hooks) {
	        this.idref = item.idref;
	        this.linear = item.linear === 'yes';
	        this.properties = item.properties || [];
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
	          this.hooks = {
	            serialize: new hook_1.default(this),
	            content: new hook_1.default(this)
	          };
	        }
	      }
	      /**
	       * Load the section from its url
	       */
	      load(_request) {
	        const request = _request || this.request || request_1.default;
	        const loading = new core_1.defer();
	        const loaded = loading.promise;
	        if (this.contents) {
	          loading.resolve(this.contents);
	        } else {
	          request(this.url, 'xml', false, {}).then(xml => {
	            this.document = xml;
	            this.contents = xml.documentElement;
	            return this.hooks.content.trigger(this.document, this);
	          }).then(() => {
	            loading.resolve(this.contents);
	          }).catch(error => {
	            loading.reject(error);
	          });
	        }
	        return loaded;
	      }
	      /**
	       * Render the contents of a section
	       */
	      render(_request) {
	        const rendering = new core_1.defer();
	        this.load(_request).then(contents => {
	          const serializer = new XMLSerializer();
	          this.output = serializer.serializeToString(contents);
	          return this.output;
	        }).then(() => {
	          return this.hooks.serialize.trigger(this.output, this);
	        }).then(() => {
	          rendering.resolve(this.output);
	        }).catch(error => {
	          rendering.reject(error);
	        });
	        return rendering.promise;
	      }
	      /**
	       * Find a string in a section using node-by-node searching.
	       * This method searches within individual text nodes, making it suitable
	       * for simple text searches. For more advanced cross-element searching,
	       * consider using the search() method instead.
	       * @param _query The query string to find
	       * @return list of matches, with form {cfi, excerpt}
	       */
	      find(_query) {
	        const matches = [];
	        const query = _query.toLowerCase();
	        const find = node => {
	          const text = node.textContent?.toLowerCase() || '';
	          let range = this.document?.createRange();
	          let cfi;
	          let pos = 0;
	          let last = -1;
	          let excerpt;
	          const limit = 150;
	          while (pos != -1) {
	            // Search for the query
	            pos = text.indexOf(query, last + 1);
	            if (pos != -1) {
	              // We found it! Generate a CFI
	              range = this.document.createRange();
	              range.setStart(node, pos);
	              range.setEnd(node, pos + query.length);
	              cfi = this.cfiFrom(range);
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
	        if (this.document) {
	          (0, core_2.sprint)(this.document.documentElement, function (node) {
	            find(node);
	          });
	        }
	        return matches;
	      }
	      /**
	       * Search a string in multiple sequential elements of the section.
	       * This method can find text that spans across multiple DOM elements,
	       * making it more powerful than find() for complex text searches.
	       * Uses document.createTreeWalker for efficient DOM traversal.
	       * @param maxSeqEle The maximum number of elements that are combined for search, default value is 5
	       */
	      search(_query, maxSeqEle = 5) {
	        const matches = [];
	        const excerptLimit = 150;
	        const query = _query.toLowerCase();
	        const searchInNodes = nodeList => {
	          const textWithCase = nodeList.reduce((acc, current) => {
	            return acc + (current.textContent || '');
	          }, '');
	          const text = textWithCase.toLowerCase();
	          const pos = text.indexOf(query);
	          if (pos != -1) {
	            const startNodeIndex = 0,
	              endPos = pos + query.length;
	            let endNodeIndex = 0,
	              l = 0;
	            if (pos < (nodeList[startNodeIndex].textContent?.length || 0)) {
	              while (endNodeIndex < nodeList.length - 1) {
	                l += nodeList[endNodeIndex].textContent?.length || 0;
	                if (endPos <= l) {
	                  break;
	                }
	                endNodeIndex += 1;
	              }
	              const startNode = nodeList[startNodeIndex],
	                endNode = nodeList[endNodeIndex];
	              const range = this.document.createRange();
	              range.setStart(startNode, pos);
	              const beforeEndLengthCount = nodeList.slice(0, endNodeIndex).reduce((acc, current) => {
	                return acc + (current.textContent?.length || 0);
	              }, 0);
	              range.setEnd(endNode, beforeEndLengthCount > endPos ? endPos : endPos - beforeEndLengthCount);
	              const cfi = this.cfiFrom(range);
	              let excerpt = nodeList.slice(0, endNodeIndex + 1).reduce((acc, current) => {
	                return acc + (current.textContent || '');
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
	        const treeWalker = document.createTreeWalker(this.document, NodeFilter.SHOW_TEXT);
	        let node,
	          nodeList = [];
	        while (node = treeWalker.nextNode()) {
	          nodeList.push(node);
	          if (nodeList.length == maxSeqEle) {
	            searchInNodes(nodeList.slice(0, maxSeqEle));
	            nodeList = nodeList.slice(1, maxSeqEle);
	          }
	        }
	        if (nodeList.length > 0) {
	          searchInNodes(nodeList);
	        }
	        return matches;
	      }
	      /**
	       * Reconciles the current chapters layout properties with
	       * the global layout properties.
	       */
	      reconcileLayoutSettings(globalLayout) {
	        //-- Get the global defaults
	        const settings = {
	          layout: globalLayout.layout,
	          spread: globalLayout.spread,
	          orientation: globalLayout.orientation
	        };
	        //-- Get the chapter's display type
	        this.properties?.forEach(function (prop) {
	          const rendition = prop.replace('rendition:', '');
	          const split = rendition.indexOf('-');
	          let property, value;
	          if (split !== -1) {
	            property = rendition.slice(0, split);
	            value = rendition.slice(split + 1);
	            settings[property] = value;
	          }
	        });
	        return settings;
	      }
	      /**
	       * Get a CFI from a Range or Element in the Section
	       */
	      cfiFrom(input) {
	        return new epubcfi_1.default(input, this.cfiBase).toString();
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
	      }
	    }
	    exports.Section = Section;
	    exports.default = Section;
	    module.exports = Section;
	  })(section$1, section$1.exports);
	  return section$1.exports;
	}

	var utils = {};

	var constants = {};

	var hasRequiredConstants;
	function requireConstants() {
	  if (hasRequiredConstants) return constants;
	  hasRequiredConstants = 1;
	  Object.defineProperty(constants, "__esModule", {
	    value: true
	  });
	  constants.EVENTS = constants.DOM_EVENTS = constants.EPUBJS_VERSION = void 0;
	  constants.EPUBJS_VERSION = '0.3';
	  // Dom events to listen for
	  constants.DOM_EVENTS = ['keydown', 'keyup', 'keypressed', 'mouseup', 'mousedown', 'mousemove', 'click', 'touchend', 'touchstart', 'touchmove'];
	  constants.EVENTS = {
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
	  return constants;
	}

	var helpers = {};

	var hasRequiredHelpers;
	function requireHelpers() {
	  if (hasRequiredHelpers) return helpers;
	  hasRequiredHelpers = 1;
	  Object.defineProperty(helpers, "__esModule", {
	    value: true
	  });
	  helpers.indexOfElementNode = indexOfElementNode;
	  helpers.debounce = debounce;
	  helpers.throttle = throttle;
	  /**
	   * Gets the index of a node in its parent
	   */
	  function indexOfNode(node, typeId) {
	    const parent = node.parentNode;
	    if (!parent) {
	      return -1;
	    }
	    const children = parent.childNodes;
	    let sib;
	    let index = -1;
	    for (let i = 0; i < children.length; i++) {
	      sib = children[i];
	      if (sib.nodeType === typeId) {
	        index++;
	      }
	      if (sib == node) break;
	    }
	    return index;
	  }
	  function indexOfElementNode(elementNode) {
	    return indexOfNode(elementNode, 1);
	  }
	  /**
	   * Creates a debounced function that delays invoking the provided function
	   * until after the specified wait time has elapsed since the last invocation.
	   */
	  function debounce(func, wait) {
	    let timeout;
	    return function (...args) {
	      clearTimeout(timeout);
	      timeout = setTimeout(() => func.apply(this, args), wait);
	    };
	  }
	  /**
	   * Creates a throttled function that only invokes the provided function
	   * at most once per every specified wait time.
	   */
	  function throttle(func, wait) {
	    let lastCall = 0;
	    return function (...args) {
	      const now = Date.now();
	      if (now - lastCall >= wait) {
	        lastCall = now;
	        func.apply(this, args);
	      }
	    };
	  }
	  return helpers;
	}

	var locationHelpers = {};

	var hasRequiredLocationHelpers;
	function requireLocationHelpers() {
	  if (hasRequiredLocationHelpers) return locationHelpers;
	  hasRequiredLocationHelpers = 1;
	  Object.defineProperty(locationHelpers, "__esModule", {
	    value: true
	  });
	  locationHelpers.buildEnrichedLocationPoint = buildEnrichedLocationPoint;
	  locationHelpers.enrichLocationSide = enrichLocationSide;
	  locationHelpers.buildLocationPoint = buildLocationPoint;
	  function buildEnrichedLocationPoint(point, side, book) {
	    const base = buildLocationPoint(point, side);
	    enrichLocationSide(side, point, base, book);
	    return base;
	  }
	  /**
	   * Enriches a DisplayedLocation side (start or end) with location, percentage, and page info.
	   */
	  function enrichLocationSide(side, point, locatedSide, book) {
	    // Location and percentage
	    const cfi = point.mapping?.[side];
	    if (cfi && book.locations) {
	      const location = book.locations.locationFromCfi(cfi);
	      if (location !== null) {
	        locatedSide.location = location;
	        locatedSide.percentage = book.locations.percentageFromLocation(location);
	      }
	    }
	    // Page
	    if (cfi && book.pageList) {
	      const page = book.pageList.pageFromCfi(cfi);
	      if (page !== -1) {
	        locatedSide.page = page;
	      }
	    }
	  }
	  /**
	   * Builds a DisplayedLocation sub-object (start or end) from a LocationPoint and side ('start' | 'end').
	   */
	  function buildLocationPoint(point, side) {
	    return {
	      index: point.index,
	      href: point.href,
	      cfi: point.mapping?.[side] ?? '',
	      displayed: {
	        page: side === 'start' ? point.pages?.[0] ?? 1 : point.pages?.[point.pages?.length - 1] ?? 1,
	        total: point.totalPages ?? 0
	      }
	    };
	  }
	  return locationHelpers;
	}

	var mime = {};

	var hasRequiredMime;
	function requireMime() {
	  if (hasRequiredMime) return mime;
	  hasRequiredMime = 1;
	  /**
	   * From Zip.js, by Gildas Lormeau
	   * edited down
	   */
	  Object.defineProperty(mime, "__esModule", {
	    value: true
	  });
	  const table = {
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
	  const mimeTypes = function () {
	    let type, subtype, val, index;
	    const mimeTypes = {};
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
	  const defaultValue = 'text/plain';
	  function lookup(filename) {
	    if (!filename) return defaultValue;
	    const ext = filename.split('.').pop();
	    if (!ext) return defaultValue;
	    return mimeTypes[ext.toLowerCase()] || defaultValue;
	  }
	  mime.default = {
	    lookup
	  };
	  return mime;
	}

	var queue$1 = {};

	var hasRequiredQueue;
	function requireQueue() {
	  if (hasRequiredQueue) return queue$1;
	  hasRequiredQueue = 1;
	  Object.defineProperty(queue$1, "__esModule", {
	    value: true
	  });
	  const core_1 = requireCore();
	  class Queue {
	    /**
	     * End the queue
	     */
	    stop() {
	      this._q = [];
	      this.running = false;
	      this.paused = true;
	    }
	    constructor(context) {
	      this._q = [];
	      this.context = context;
	      this.tick = core_1.requestAnimationFrame;
	      this.running = false;
	      this.paused = false;
	    }
	    /**
	     * Add an item to the queue
	     */
	    enqueue(...args) {
	      const taskOrPromise = args.shift();
	      if (!taskOrPromise) {
	        throw new Error('No Task Provided');
	      }
	      if (typeof taskOrPromise === 'function') {
	        // Always execute with the queue's context
	        const promise = new Promise((resolve, reject) => {
	          this._q.push({
	            task: async (...taskArgs) => {
	              try {
	                // Use Function.prototype.apply to set context
	                const result = await taskOrPromise.apply(this.context, taskArgs);
	                resolve(result);
	                return result;
	              } catch (err) {
	                reject(err);
	                throw err;
	              }
	            },
	            args: args
	          });
	          if (this.paused == false && !this.running) {
	            this.run();
	          }
	        });
	        return promise;
	      } else if (isPromise(taskOrPromise)) {
	        const promise = taskOrPromise;
	        this._q.push({
	          promise
	        });
	        if (this.paused == false && !this.running) {
	          this.run();
	        }
	        return promise;
	      } else {
	        // If not a function or promise, wrap as resolved promise
	        const promise = Promise.resolve(taskOrPromise);
	        this._q.push({
	          promise
	        });
	        if (this.paused == false && !this.running) {
	          this.run();
	        }
	        return promise;
	      }
	    }
	    /**
	     * Run one item
	     */
	    // Run All Immediately
	    dump() {
	      while (this._q.length) {
	        this.dequeue();
	      }
	    }
	    /**
	     * Run all tasks sequentially, at convince
	     */
	    run() {
	      if (!this.running) {
	        this.running = true;
	        this._deferredPromise = new Promise(resolve => {
	          this._resolveDeferred = resolve;
	        });
	      }
	      if (this.tick) {
	        this.tick.call(globalThis, () => {
	          if (this._q.length) {
	            this.dequeue().then(() => {
	              this.run();
	            });
	          } else {
	            if (this._resolveDeferred) this._resolveDeferred(undefined);
	            this.running = undefined;
	          }
	        });
	      }
	      return this._deferredPromise;
	    }
	    /**
	     * Run one item
	     */
	    dequeue() {
	      if (this._q.length && !this.paused) {
	        const inwait = this._q.shift();
	        if (!inwait) return Promise.resolve(undefined);
	        const task = inwait.task;
	        const args = Array.isArray(inwait.args) ? inwait.args : [];
	        if (task) {
	          try {
	            const result = task.apply(this.context, args);
	            if (isPromise(result)) {
	              return result.then(value => {
	                if (inwait.resolve) inwait.resolve(value);
	                return value;
	              }, err => {
	                if (inwait.reject) inwait.reject(err);
	                return undefined;
	              });
	            } else {
	              if (inwait.resolve) inwait.resolve(result);
	              return inwait.promise ?? Promise.resolve(result);
	            }
	          } catch (err) {
	            if (inwait.reject) inwait.reject(err);
	            return Promise.resolve(undefined);
	          }
	        } else if (inwait.promise) {
	          return inwait.promise;
	        }
	      }
	      return Promise.resolve(undefined);
	    }
	    clear() {
	      this._q = [];
	    }
	    /**
	     * Get the number of tasks in the queue
	     */
	    length() {
	      return this._q.length;
	    }
	    /**
	     * Pause a running queue
	     */
	    pause() {
	      this.paused = true;
	    }
	  }
	  function isPromise(value) {
	    return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
	  }
	  queue$1.default = Queue;
	  return queue$1;
	}

	var replacements = {};

	var hasRequiredReplacements;
	function requireReplacements() {
	  if (hasRequiredReplacements) return replacements;
	  hasRequiredReplacements = 1;
	  var __importDefault = replacements && replacements.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(replacements, "__esModule", {
	    value: true
	  });
	  replacements.replaceBase = replaceBase;
	  replacements.replaceCanonical = replaceCanonical;
	  replacements.replaceMeta = replaceMeta;
	  replacements.replaceLinks = replaceLinks;
	  replacements.substitute = substitute;
	  const url_1 = __importDefault(requireUrl());
	  function replaceBase(doc, section) {
	    let base;
	    let url = section.url ?? '';
	    const absolute = url.indexOf('://') > -1;
	    if (!doc) {
	      return;
	    }
	    const head = doc.querySelector('head');
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
	    let link;
	    const url = section.canonical;
	    if (!doc) {
	      return;
	    }
	    const head = doc.querySelector('head');
	    if (!head) return;
	    link = head.querySelector("link[rel='canonical']");
	    if (link) {
	      link.setAttribute('href', url ?? '');
	    } else {
	      link = doc.createElement('link');
	      link.setAttribute('rel', 'canonical');
	      link.setAttribute('href', url ?? '');
	      head.appendChild(link);
	    }
	  }
	  function replaceMeta(doc, section) {
	    let meta;
	    const id = section.idref;
	    if (!doc) {
	      return;
	    }
	    const head = doc.querySelector('head');
	    if (!head) return;
	    meta = head.querySelector("link[property='dc.identifier']");
	    if (meta) {
	      meta.setAttribute('content', id ?? '');
	    } else {
	      meta = doc.createElement('meta');
	      meta.setAttribute('name', 'dc.identifier');
	      meta.setAttribute('content', id ?? '');
	      head.appendChild(meta);
	    }
	  }
	  // TODO: move me to Contents
	  function replaceLinks(contents, fn) {
	    const links = contents.querySelectorAll('a[href]');
	    if (!links.length) {
	      return;
	    }
	    const base = contents.ownerDocument.documentElement.querySelector('base');
	    const location = base ? base.getAttribute('href') ?? undefined : undefined;
	    const replaceLink = function (link) {
	      const href = link.getAttribute('href') ?? '';
	      if (href.indexOf('mailto:') === 0) {
	        return;
	      }
	      const absolute = href.indexOf('://') > -1;
	      if (absolute) {
	        link.setAttribute('target', '_blank');
	      } else {
	        let linkUrl;
	        try {
	          linkUrl = new url_1.default(href, location);
	        } catch {
	          // NOOP
	        }
	        link.onclick = function () {
	          if (linkUrl && linkUrl.hash) {
	            fn(linkUrl.Path.path + linkUrl.hash);
	          } else if (linkUrl) {
	            fn(linkUrl.Path.path);
	          } else {
	            fn(href);
	          }
	          return false;
	        };
	      }
	    };
	    for (let i = 0; i < links.length; i++) {
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
	  return replacements;
	}

	var scrolltype = {};

	var hasRequiredScrolltype;
	function requireScrolltype() {
	  if (hasRequiredScrolltype) return scrolltype;
	  hasRequiredScrolltype = 1;
	  Object.defineProperty(scrolltype, "__esModule", {
	    value: true
	  });
	  scrolltype.default = scrollType;
	  scrolltype.createDefiner = createDefiner;
	  // Detect RTL scroll type
	  // Based on https://github.com/othree/jquery.rtl-scroll-type/blob/master/src/jquery.rtl-scroll.js
	  function scrollType() {
	    let type = 'reverse';
	    const definer = createDefiner();
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
	    const definer = document.createElement('div');
	    definer.dir = 'rtl';
	    definer.style.position = 'fixed';
	    definer.style.width = '1px';
	    definer.style.height = '1px';
	    definer.style.top = '0px';
	    definer.style.left = '0px';
	    definer.style.overflow = 'hidden';
	    const innerDiv = document.createElement('div');
	    innerDiv.style.width = '2px';
	    const spanA = document.createElement('span');
	    spanA.style.width = '1px';
	    spanA.style.display = 'inline-block';
	    const spanB = document.createElement('span');
	    spanB.style.width = '1px';
	    spanB.style.display = 'inline-block';
	    innerDiv.appendChild(spanA);
	    innerDiv.appendChild(spanB);
	    definer.appendChild(innerDiv);
	    return definer;
	  }
	  return scrolltype;
	}

	var hasRequiredUtils;
	function requireUtils() {
	  if (hasRequiredUtils) return utils;
	  hasRequiredUtils = 1;
	  (function (exports) {

	    var __createBinding = utils && utils.__createBinding || (Object.create ? function (o, m, k, k2) {
	      if (k2 === undefined) k2 = k;
	      var desc = Object.getOwnPropertyDescriptor(m, k);
	      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	        desc = {
	          enumerable: true,
	          get: function () {
	            return m[k];
	          }
	        };
	      }
	      Object.defineProperty(o, k2, desc);
	    } : function (o, m, k, k2) {
	      if (k2 === undefined) k2 = k;
	      o[k2] = m[k];
	    });
	    var __exportStar = utils && utils.__exportStar || function (m, exports) {
	      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	    };
	    Object.defineProperty(exports, "__esModule", {
	      value: true
	    });
	    __exportStar(requireConstants(), exports);
	    __exportStar(requireCore(), exports);
	    __exportStar(requireHelpers(), exports);
	    __exportStar(requireHook(), exports);
	    __exportStar(requireLocationHelpers(), exports);
	    __exportStar(requireMime(), exports);
	    __exportStar(requirePath(), exports);
	    __exportStar(requireQueue(), exports);
	    __exportStar(requireReplacements(), exports);
	    __exportStar(requireRequest(), exports);
	    __exportStar(requireScrolltype(), exports);
	    __exportStar(requireUrl(), exports);
	  })(utils);
	  return utils;
	}

	var spine = spine$1.exports;
	var hasRequiredSpine;
	function requireSpine() {
	  if (hasRequiredSpine) return spine$1.exports;
	  hasRequiredSpine = 1;
	  (function (module, exports) {

	    var __importDefault = spine && spine.__importDefault || function (mod) {
	      return mod && mod.__esModule ? mod : {
	        "default": mod
	      };
	    };
	    Object.defineProperty(exports, "__esModule", {
	      value: true
	    });
	    exports.Spine = void 0;
	    const epubcfi_1 = __importDefault(requireEpubcfi());
	    const hook_1 = __importDefault(requireHook());
	    const section_1 = __importDefault(requireSection());
	    const utils_1 = requireUtils();
	    /**
	     * A collection of Spine Items
	     */
	    class Spine {
	      constructor() {
	        this.spineItems = [];
	        this.spineByHref = {};
	        this.spineById = {};
	        this.hooks = {
	          serialize: new hook_1.default(),
	          content: new hook_1.default()
	        };
	        this.epubcfi = new epubcfi_1.default();
	        this.loaded = false;
	        this.items = undefined;
	        this.manifest = undefined;
	        this.spineNodeIndex = undefined;
	        this.baseUrl = undefined;
	        this.length = undefined;
	        // Register replacements
	        this.hooks.content.register(utils_1.replaceBase);
	        this.hooks.content.register(utils_1.replaceCanonical);
	        this.hooks.content.register(utils_1.replaceMeta);
	      }
	      /**
	       * Unpack items from a opf into spine items
	       */
	      unpack(_package, resolver, canonical) {
	        this.items = _package.spine;
	        this.manifest = _package.manifest;
	        this.spineNodeIndex = _package.spineNodeIndex;
	        this.baseUrl = _package.baseUrl || _package.basePath || '';
	        this.length = this.items.length;
	        if (!this.manifest) {
	          throw new Error('Manifest is missing');
	        }
	        this.items.forEach((item, index) => {
	          const manifestItem = this.manifest[item.idref];
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
	              item.properties.push(...manifestItem.properties);
	            }
	          }
	          if (item.linear === 'yes') {
	            item.prev = () => {
	              let prevIndex = item.index;
	              while (prevIndex > 0) {
	                const prev = this.get(prevIndex - 1);
	                if (prev && prev.linear) {
	                  return prev;
	                }
	                prevIndex -= 1;
	              }
	              return;
	            };
	            item.next = () => {
	              let nextIndex = item.index;
	              while (nextIndex < this.spineItems.length - 1) {
	                const next = this.get(nextIndex + 1);
	                if (next && next.linear) {
	                  return next;
	                }
	                nextIndex += 1;
	              }
	              return;
	            };
	          } else {
	            item.prev = () => {
	              return undefined;
	            };
	            item.next = () => {
	              return undefined;
	            };
	          }
	          const spineItem = new section_1.default(item, this.hooks);
	          this.append(spineItem);
	        });
	        this.loaded = true;
	      }
	      /**
	       * Get an item from the spine
	       * @example spine.get();
	       * @example spine.get(1);
	       * @example spine.get("chap1.html");
	       * @example spine.get("#id1234");
	       */
	      get(target) {
	        let index = 0;
	        if (typeof target === 'undefined') {
	          while (index < this.spineItems.length) {
	            const next = this.spineItems[index];
	            if (next && next.linear) {
	              break;
	            }
	            index += 1;
	          }
	        } else if (this.epubcfi.isCfiString(target)) {
	          const cfi = new epubcfi_1.default(target);
	          index = cfi.spinePos;
	        } else if (typeof target === 'number' || typeof target === 'string' && !isNaN(Number(target))) {
	          index = typeof target === 'number' ? target : Number(target);
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
	       */
	      append(section) {
	        const index = this.spineItems.length;
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
	       */
	      remove(section) {
	        const index = this.spineItems.indexOf(section);
	        if (index > -1) {
	          delete this.spineByHref[section.href];
	          delete this.spineById[section.idref];
	          return this.spineItems.splice(index, 1);
	        }
	        return undefined;
	      }
	      /**
	       * Loop over the Sections in the Spine
	       */
	      each(...args) {
	        return this.spineItems.forEach(...args);
	      }
	      /**
	       * Find the first Section in the Spine
	       */
	      first() {
	        let index = 0;
	        do {
	          const next = this.get(index);
	          if (next && next.linear) {
	            return next;
	          }
	          index += 1;
	        } while (index < this.spineItems.length);
	        return undefined;
	      }
	      /**
	       * Find the last Section in the Spine
	       */
	      last() {
	        let index = this.spineItems.length - 1;
	        do {
	          const prev = this.get(index);
	          if (prev && prev.linear) {
	            return prev;
	          }
	          index -= 1;
	        } while (index >= 0);
	        return undefined;
	      }
	      destroy() {
	        this.spineItems.forEach(section => section.destroy());
	        this.hooks.serialize.clear();
	        this.hooks.content.clear();
	        // Clear all properties for garbage collection
	        // @ts-expect-error intentionally setting to undefined for garbage collection
	        this.spineItems = undefined;
	        // @ts-expect-error intentionally setting to undefined for garbage collection
	        this.spineByHref = undefined;
	        // @ts-expect-error intentionally setting to undefined for garbage collection
	        this.spineById = undefined;
	        // @ts-expect-error intentionally setting to undefined for garbage collection
	        this.hooks = undefined;
	        // @ts-expect-error intentionally setting to undefined for garbage collection
	        this.epubcfi = undefined;
	        this.loaded = false;
	        this.items = undefined;
	        this.manifest = undefined;
	        this.spineNodeIndex = undefined;
	        this.baseUrl = undefined;
	        this.length = undefined;
	      }
	    }
	    exports.Spine = Spine;
	    exports.default = Spine;
	    module.exports = Spine;
	  })(spine$1, spine$1.exports);
	  return spine$1.exports;
	}

	var locations = {};

	var hasRequiredLocations;
	function requireLocations() {
	  if (hasRequiredLocations) return locations;
	  hasRequiredLocations = 1;
	  var __importDefault = locations && locations.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(locations, "__esModule", {
	    value: true
	  });
	  locations.Locations = void 0;
	  const core_1 = requireCore();
	  const queue_1 = __importDefault(requireQueue());
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const constants_1 = requireConstants();
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  /**
	   * Find Locations for a Book
	   */
	  class Locations {
	    constructor(spine, request, pause) {
	      this.epubcfi = new epubcfi_1.default();
	      this._locationsWords = [];
	      this._locations = [];
	      this.total = 0;
	      this.break = 150;
	      this._current = 0;
	      this._currentCfi = '';
	      this._wordCounter = 0;
	      this.processingTimeout = undefined;
	      this.spine = spine;
	      this.request = request;
	      this.pause = pause || 100;
	      this.q = new queue_1.default(this);
	      this.currentLocation = 0;
	    }
	    /**
	     * Load all of sections in the book to generate locations
	     * @param  {int} chars how many chars to split on
	     * @return {Promise<Array<string>>} locations
	     */
	    async generate(chars) {
	      if (chars) {
	        this.break = chars;
	      }
	      if (this.q === undefined) {
	        throw new Error('Queue is not defined');
	      }
	      if (this.spine === undefined) {
	        throw new Error('Spine is not defined');
	      }
	      this.q.pause();
	      this.spine.each(section => {
	        if (section.linear) {
	          this.q.enqueue(this.process.bind(this), section);
	        }
	      });
	      return this.q.run().then(() => {
	        this.total = this._locations.length - 1;
	        if (this._currentCfi) {
	          this.currentLocation = this._currentCfi;
	        }
	        return this._locations;
	      });
	    }
	    createRange() {
	      return {
	        startContainer: undefined,
	        startOffset: undefined,
	        endContainer: undefined,
	        endOffset: undefined
	      };
	    }
	    async process(section) {
	      // Section.load resolves with the section contents (an Element), not the full Document
	      return section.load(this.request).then(contents => {
	        const completed = new core_1.defer();
	        if (!contents) {
	          // Nothing loaded for this section
	          completed.resolve([]);
	          return completed.promise;
	        }
	        // contents is expected to be the document element for the section
	        const el = contents;
	        const locations = this.parse(el, section.cfiBase);
	        this._locations = this._locations.concat(locations);
	        section.unload();
	        this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
	        return completed.promise;
	      });
	    }
	    parse(contents, cfiBase, chars) {
	      const locations = [];
	      let range;
	      const doc = contents.ownerDocument;
	      const body = doc.querySelector('body');
	      if (!body) {
	        throw new Error('No body element found in document');
	      }
	      let counter = 0;
	      let prev;
	      const _break = chars || this.break || 150;
	      const parser = node => {
	        const textNode = node;
	        const len = textNode.length;
	        let dist;
	        let pos = 0;
	        if (!textNode.textContent || textNode.textContent.trim().length === 0) {
	          return false; // continue
	        }
	        // Start range
	        if (counter == 0) {
	          range = this.createRange();
	          range.startContainer = textNode;
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
	            range.startContainer = textNode;
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
	            if (range) {
	              range.endContainer = textNode;
	              range.endOffset = pos;
	              // cfi = section.cfiFromRange(range);
	              const cfi = new epubcfi_1.default(range, cfiBase).toString();
	              locations.push(cfi);
	            }
	            counter = 0;
	          }
	        }
	        prev = textNode;
	        return undefined;
	      };
	      (0, core_1.sprint)(body, parser);
	      // Close remaining
	      if (range && range.startContainer && prev) {
	        range.endContainer = prev;
	        range.endOffset = prev.length;
	        const cfi = new epubcfi_1.default(range, cfiBase).toString();
	        locations.push(cfi);
	        counter = 0;
	      }
	      return locations;
	    }
	    /**
	     * Load all of sections in the book to generate locations
	     * @param  wordCount how many words to split on
	     * @param  {int} count result count
	     */
	    async generateFromWords(startCfi, wordCount, count) {
	      const start = startCfi ? new epubcfi_1.default(startCfi) : undefined;
	      if (this.q === undefined) {
	        throw new Error('Queue is not defined');
	      }
	      if (this.spine === undefined) {
	        throw new Error('Spine is not defined');
	      }
	      this.q.pause();
	      this._locationsWords = [];
	      this._wordCounter = 0;
	      this.spine.each(section => {
	        if (section.linear) {
	          if (start) {
	            if (section.index >= start.spinePos) {
	              this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
	            }
	          } else {
	            this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
	          }
	        }
	      });
	      return this.q.run().then(() => {
	        if (this._currentCfi) {
	          this.currentLocation = this._currentCfi;
	        }
	        return this._locationsWords;
	      });
	    }
	    async processWords(section, wordCount, startCfi, count) {
	      if (count && this._locationsWords.length >= count) {
	        return Promise.resolve();
	      }
	      // Section.load resolves with the section contents (an Element), not the full Document
	      return section.load(this.request).then(contents => {
	        const completed = new core_1.defer();
	        // Use documentElement for parseWords
	        if (!contents) {
	          completed.resolve([]);
	          return completed.promise;
	        }
	        const el = contents;
	        // contents is already the documentElement for the section
	        const locations = this.parseWords(el, section, wordCount, startCfi);
	        const remainingCount = count - this._locationsWords.length;
	        this._locationsWords = this._locationsWords.concat(locations.length >= count ? locations.slice(0, remainingCount) : locations);
	        section.unload();
	        this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
	        return completed.promise;
	      });
	    }
	    //http://stackoverflow.com/questions/18679576/counting-words-in-string
	    countWords(s) {
	      s = s.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
	      s = s.replace(/[ ]{2,}/gi, ' '); //2 or more space to 1
	      s = s.replace(/\n /, '\n'); // exclude newline with a start spacing
	      return s.split(' ').length;
	    }
	    parseWords(contents, section, wordCount, startCfi) {
	      const cfiBase = section.cfiBase;
	      const locations = [];
	      const doc = contents.ownerDocument;
	      if (!doc) {
	        throw new Error('Document is not defined');
	      }
	      const body = doc.querySelector('body');
	      if (!body) {
	        throw new Error('No body element found in document');
	      }
	      const _break = wordCount;
	      let foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
	      let startNode;
	      if (startCfi && section.index === startCfi.spinePos) {
	        startNode = startCfi.findNode(startCfi.range ? startCfi.path.steps.concat(startCfi.start?.steps || []) : startCfi.path.steps, contents.ownerDocument);
	      }
	      const parser = node => {
	        if (!foundStartNode) {
	          if (node === startNode) {
	            foundStartNode = true;
	          } else {
	            return false;
	          }
	        }
	        if (node.nodeType !== 3 || !node.textContent || node.textContent.length < 10) {
	          if (!node.textContent || node.textContent.trim().length === 0) {
	            return false;
	          }
	        }
	        const len = this.countWords(node.textContent);
	        let dist;
	        let pos = 0;
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
	            const cfi = new epubcfi_1.default(node, cfiBase);
	            locations.push({
	              cfi: cfi.toString(),
	              wordCount: this._wordCounter
	            });
	            this._wordCounter = 0;
	          }
	        }
	        return undefined;
	      };
	      (0, core_1.sprint)(body, parser);
	      return locations;
	    }
	    /**
	     * Get a location from an EpubCFI
	     * @param {EpubCFI} cfi
	     * @return {number}
	     */
	    locationFromCfi(cfiInput) {
	      let cfi;
	      if (epubcfi_1.default.prototype.isCfiString(cfiInput)) {
	        cfi = new epubcfi_1.default(cfiInput);
	      } else {
	        cfi = cfiInput;
	      }
	      // Check if the location has not been set yet
	      if (this._locations === undefined || this._locations.length === 0) {
	        return -1;
	      }
	      if (this.epubcfi === undefined) {
	        throw new Error('EpubCFI is not defined');
	      }
	      const loc = (0, core_1.locationOf)(cfi, this._locations, this.epubcfi.compare);
	      if (this.total === undefined) {
	        return -1;
	      }
	      if (loc > this.total) {
	        return this.total;
	      }
	      return loc;
	    }
	    /**
	     * Get a percentage position in locations from an EpubCFI
	     */
	    percentageFromCfi(cfi) {
	      if (this._locations === undefined || this._locations.length === 0) {
	        return null;
	      }
	      // Find closest cfi
	      const loc = this.locationFromCfi(cfi);
	      // Get percentage in total
	      return this.percentageFromLocation(loc);
	    }
	    /**
	     * Get a percentage position from a location index
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
	     */
	    cfiFromLocation(loc) {
	      if (this._locations === undefined) {
	        return '';
	      }
	      if (loc >= 0 && loc < this._locations.length) {
	        return this._locations[loc];
	      }
	      return '';
	    }
	    /**
	     * Get an EpubCFI from location percentage
	     */
	    cfiFromPercentage(percentage) {
	      if (percentage > 1) {
	        console.warn('Normalize cfiFromPercentage value to between 0 - 1');
	      }
	      if (this._locations === undefined || this.total === undefined) {
	        return '';
	      }
	      // Make sure 1 goes to very end
	      if (percentage >= 1) {
	        const cfi = new epubcfi_1.default(this._locations[this.total]);
	        cfi.collapse();
	        return cfi.toString();
	      }
	      const loc = Math.ceil(this.total * percentage);
	      return this.cfiFromLocation(loc);
	    }
	    /**
	     * Load locations from JSON
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
	     */
	    save() {
	      return JSON.stringify(this._locations);
	    }
	    getCurrent() {
	      return this._current;
	    }
	    setCurrent(curr) {
	      let loc;
	      if (curr === undefined) {
	        return;
	      }
	      if (typeof curr == 'string') {
	        this._currentCfi = curr;
	      } else if (typeof curr == 'number') {
	        this._current = curr;
	      } else {
	        return;
	      }
	      if (this._locations === undefined || this._locations.length === 0) {
	        return;
	      }
	      if (typeof curr == 'string') {
	        loc = this.locationFromCfi(curr);
	        this._current = loc;
	      } else {
	        loc = curr;
	      }
	      this.emit(constants_1.EVENTS.LOCATIONS.CHANGED, {
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
	      return this._locations?.length ?? 0;
	    }
	    destroy() {
	      // @ts-expect-error this is only at destroy time
	      this.spine = undefined;
	      // @ts-expect-error this is only at destroy time
	      this.request = undefined;
	      this.pause = undefined;
	      this.q?.stop();
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
	  locations.Locations = Locations;
	  (0, event_emitter_1.default)(Locations.prototype);
	  locations.default = Locations;
	  return locations;
	}

	var container = {};

	var hasRequiredContainer;
	function requireContainer() {
	  if (hasRequiredContainer) return container;
	  hasRequiredContainer = 1;
	  var __importDefault = container && container.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(container, "__esModule", {
	    value: true
	  });
	  const path_1 = __importDefault(requirePath());
	  /**
	   * Handles Parsing and Accessing an Epub Container
	   */
	  class Container {
	    constructor(containerDocument) {
	      this.packagePath = '';
	      this.directory = '';
	      if (containerDocument) {
	        this.parse(containerDocument);
	      }
	    }
	    /**
	     * Parse the Container XML
	     */
	    parse(containerDocument) {
	      //-- <rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>
	      let rootfile = null;
	      if (!containerDocument) {
	        throw new Error('Container File Not Found');
	      }
	      rootfile = containerDocument.querySelector('rootfile');
	      if (!rootfile) {
	        throw new Error('No RootFile Found');
	      }
	      this.packagePath = rootfile.getAttribute('full-path') || '';
	      this.directory = this.packagePath ? new path_1.default(this.packagePath).directory : '';
	    }
	    destroy() {
	      this.packagePath = undefined;
	      this.directory = undefined;
	    }
	  }
	  container.default = Container;
	  return container;
	}

	var packaging = {};

	var epubEnums = {};

	var hasRequiredEpubEnums;
	function requireEpubEnums() {
	  if (hasRequiredEpubEnums) return epubEnums;
	  hasRequiredEpubEnums = 1;
	  /**
	   * Central type and enumroot for epub.js
	   *
	   * All shared types (layout, direction, orientation, etc.) from the epub specification
	   * should be defined or re-exported here.
	   *
	   * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	   */
	  Object.defineProperty(epubEnums, "__esModule", {
	    value: true
	  });
	  epubEnums.DEFAULT_SPREAD = epubEnums.Spread = epubEnums.DEFAULT_ORIENTATION = epubEnums.Orientation = epubEnums.DEFAULT_LAYOUT_TYPE = epubEnums.LayoutType = epubEnums.DEFAULT_FLOW = epubEnums.Flow = epubEnums.DEFAULT_DIRECTION = epubEnums.Direction = void 0;
	  /**
	   * Reading direction for EPUB content.
	   * @see http://www.idpf.org/epub/301/spec/epub-publications.html#sec-docs-dir
	   */
	  epubEnums.Direction = {
	    ltr: 'ltr',
	    rtl: 'rtl'
	  };
	  epubEnums.DEFAULT_DIRECTION = 'ltr';
	  /**
	   * Flow type for EPUB content rendering.
	   * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	   */
	  epubEnums.Flow = {
	    paginated: 'paginated',
	    scrolled: 'scrolled',
	    'scrolled-continuous': 'scrolled-continuous',
	    'scrolled-doc': 'scrolled-doc',
	    auto: 'auto'
	  };
	  epubEnums.DEFAULT_FLOW = 'auto';
	  /**
	   * Layout type for EPUB rendition.
	   * @see http://www.idpf.org/epub/301/spec/epub-publications.html#rendition-layout
	   * Allowed: 'reflowable' | 'pre-paginated'. Default: 'reflowable'.
	   */
	  epubEnums.LayoutType = {
	    reflowable: 'reflowable',
	    'pre-paginated': 'pre-paginated'
	  };
	  epubEnums.DEFAULT_LAYOUT_TYPE = 'reflowable';
	  /**
	   * Orientation for fixed-layout or viewport settings.
	   * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-elem-viewport
	   */
	  epubEnums.Orientation = {
	    auto: 'auto',
	    landscape: 'landscape',
	    portrait: 'portrait'
	  };
	  epubEnums.DEFAULT_ORIENTATION = 'auto';
	  /**
	   * Spread type for EPUB content rendering.
	   * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	   */
	  epubEnums.Spread = {
	    auto: 'auto',
	    none: 'none',
	    landscape: 'landscape',
	    portrait: 'portrait',
	    both: 'both'
	  };
	  epubEnums.DEFAULT_SPREAD = 'auto';
	  return epubEnums;
	}

	var hasRequiredPackaging;
	function requirePackaging() {
	  if (hasRequiredPackaging) return packaging;
	  hasRequiredPackaging = 1;
	  Object.defineProperty(packaging, "__esModule", {
	    value: true
	  });
	  const helpers_1 = requireHelpers();
	  const core_1 = requireCore();
	  const epub_enums_1 = requireEpubEnums();
	  // Add similar imports for ORIENTATIONS and SPREADS if you have them
	  /**
	   * Open Packaging Format Parser
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
	      this.uniqueIdentifier = '';
	      if (packageDocument) {
	        this.parse(packageDocument);
	      }
	    }
	    /**
	     * Parse OPF XML
	     */
	    parse(packageDocument) {
	      if (!packageDocument) {
	        throw new Error('Package File Not Found');
	      }
	      const metadataNode = packageDocument.querySelector('metadata');
	      if (!metadataNode) {
	        throw new Error('No Metadata Found');
	      }
	      const manifestNode = packageDocument.querySelector('manifest');
	      if (!manifestNode) {
	        throw new Error('No Manifest Found');
	      }
	      const spineNode = packageDocument.querySelector('spine');
	      if (!spineNode) {
	        throw new Error('No Spine Found');
	      }
	      this.manifest = this.parseManifest(manifestNode);
	      this.navPath = this.findNavPath(manifestNode);
	      this.ncxPath = this.findNcxPath(manifestNode, spineNode);
	      this.coverPath = this.findCoverPath(packageDocument);
	      this.spineNodeIndex = (0, helpers_1.indexOfElementNode)(spineNode);
	      this.spine = this.parseSpine(spineNode);
	      this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
	      this.metadata = this.parseMetadata(metadataNode);
	      const dir = spineNode.getAttribute('page-progression-direction');
	      this.metadata.direction = dir === 'ltr' || dir === 'rtl' ? dir : 'ltr';
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
	     */
	    parseMetadata(xml) {
	      return {
	        title: this.getElementText(xml, 'title'),
	        creator: this.getElementText(xml, 'creator'),
	        description: this.getElementText(xml, 'description'),
	        pubdate: this.getElementText(xml, 'date'),
	        publisher: this.getElementText(xml, 'publisher'),
	        identifier: this.getElementText(xml, 'identifier'),
	        language: this.getElementText(xml, 'language'),
	        rights: this.getElementText(xml, 'rights'),
	        modified_date: this.getPropertyText(xml, 'dcterms:modified'),
	        layout: (0, core_1.getValidOrDefault)(this.getPropertyText(xml, 'rendition:layout'), epub_enums_1.LayoutType, epub_enums_1.DEFAULT_LAYOUT_TYPE),
	        orientation: (0, core_1.getValidOrDefault)(this.getPropertyText(xml, 'rendition:orientation'), epub_enums_1.Orientation, epub_enums_1.DEFAULT_ORIENTATION),
	        flow: (0, core_1.getValidOrDefault)(this.getPropertyText(xml, 'rendition:flow'), epub_enums_1.Flow, epub_enums_1.DEFAULT_FLOW),
	        viewport: this.getPropertyText(xml, 'rendition:viewport'),
	        spread: (0, core_1.getValidOrDefault)(this.getPropertyText(xml, 'rendition:spread'), epub_enums_1.Spread, epub_enums_1.DEFAULT_SPREAD),
	        direction: epub_enums_1.DEFAULT_DIRECTION // Will be set later from spine element, set default here
	      };
	    }
	    /**
	     * Parse Manifest
	     */
	    parseManifest(manifestXml) {
	      const manifest = {};
	      //-- Turn items into an array
	      const selected = manifestXml.querySelectorAll('item');
	      const items = Array.prototype.slice.call(selected);
	      //-- Create an object with the id as key
	      items.forEach(function (item) {
	        const id = item.getAttribute('id'),
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
	     */
	    parseSpine(spineXml) {
	      const spine = [];
	      const selected = spineXml.querySelectorAll('itemref');
	      const items = Array.prototype.slice.call(selected);
	      // var epubcfi = new EpubCFI();
	      //-- Add to array to maintain ordering and cross reference with manifest
	      items.forEach(function (item, index) {
	        const idref = item.getAttribute('idref');
	        // var cfiBase = epubcfi.generateChapterComponent(spineNodeIndex, index, Id);
	        const props = item.getAttribute('properties') || '';
	        const propArray = props.length ? props.split(' ') : [];
	        // var manifestProps = manifest[Id].properties;
	        // var manifestPropArray = manifestProps.length ? manifestProps.split(" ") : [];
	        const itemref = {
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
	     * Find the unique identifier text from the package document.
	     */
	    findUniqueIdentifier(packageXml) {
	      const id = packageXml.documentElement.getAttribute('unique-identifier');
	      if (!id) return '';
	      const el = packageXml.getElementById(id);
	      if (!el || el.localName !== 'identifier' || el.namespaceURI !== 'http://purl.org/dc/elements/1.1/') {
	        return '';
	      }
	      return el.textContent?.trim() || '';
	    }
	    /**
	     * Find TOC NAV
	     */
	    findNavPath(manifestNode) {
	      // Find item with property "nav"
	      // Should catch nav regardless of order
	      const node = manifestNode.querySelector("item[properties~='nav']");
	      return node ? node.getAttribute('href') || '' : '';
	    }
	    /**
	     * Find TOC NCX
	     * media-type="application/x-dtbncx+xml" href="toc.ncx"
	     */
	    findNcxPath(manifestNode, spineNode) {
	      // var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
	      let node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
	      let tocId;
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
	      return node ? node.getAttribute('href') || '' : '';
	    }
	    /**
	     * Find the Cover Path and return the href
	     * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
	     * Fallback for Epub 2.0
	     */
	    findCoverPath(packageXml) {
	      const pkg = packageXml.querySelector('package');
	      pkg?.getAttribute('version');
	      // Try parsing cover with epub 3.
	      const node = packageXml.querySelector("item[properties~='cover-image']");
	      if (node) return node.getAttribute('href') || '';
	      // Fallback to epub 2.
	      const metaCover = packageXml.querySelector("meta[name='cover']");
	      if (metaCover) {
	        const coverId = metaCover.getAttribute('content');
	        if (coverId) {
	          const cover = packageXml.getElementById(coverId);
	          return cover ? cover.getAttribute('href') || '' : '';
	        }
	      }
	      return '';
	    }
	    /**
	     * Get text of a namespaced element
	     */
	    getElementText(xml, tag) {
	      const found = xml.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', tag);
	      if (!found || found.length === 0) return '';
	      const el = found[0];
	      if (el.childNodes.length && el.childNodes[0].nodeValue) {
	        return el.childNodes[0].nodeValue;
	      }
	      return '';
	    }
	    /**
	     * Get text by property
	     */
	    getPropertyText(xml, property) {
	      const el = xml.querySelector(`meta[property='${property}']`);
	      if (el && el.childNodes.length) {
	        return el.childNodes[0].nodeValue || '';
	      }
	      return '';
	    }
	    /**
	     * Load JSON Manifest
	     */
	    load(json) {
	      this.metadata = json.metadata;
	      const spine = json.readingOrder || json.spine;
	      this.spine = spine ? spine.map((item, index) => ({
	        idref: item.idref,
	        linear: item.linear || 'yes',
	        properties: item.properties || [],
	        index
	      })) : [];
	      json.resources.forEach((item, index) => {
	        this.manifest[index] = item;
	        if (item.rel && item.rel[0] === 'cover') {
	          this.coverPath = item.href;
	        }
	      });
	      this.spineNodeIndex = 0;
	      this.toc = json.toc ? json.toc.map(item => {
	        const navItem = {
	          id: item.id || '',
	          href: item.href,
	          label: item.label || item.title || '',
	          title: item.title ?? '',
	          subitems: []
	        };
	        return navItem;
	      }) : [];
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
	    destroy() {
	      // @ts-expect-error intentionally setting to undefined for garbage collection
	      this.manifest = undefined;
	      // @ts-expect-error intentionally setting to undefined for garbage collection
	      this.spine = undefined;
	      // @ts-expect-error intentionally setting to undefined for garbage collection
	      this.metadata = undefined;
	      this.toc = undefined;
	    }
	  }
	  packaging.default = Packaging;
	  return packaging;
	}

	var navigation = {};

	var hasRequiredNavigation;
	function requireNavigation() {
	  if (hasRequiredNavigation) return navigation;
	  hasRequiredNavigation = 1;
	  Object.defineProperty(navigation, "__esModule", {
	    value: true
	  });
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
	     */
	    parse(xml) {
	      const isXml = xml.nodeType;
	      if (!isXml) {
	        this.toc = this.load(xml);
	      } else {
	        const doc = xml;
	        const html = doc.querySelector('html');
	        const ncx = doc.querySelector('ncx');
	        if (html) {
	          this.toc = this.parseNav(doc);
	          this.landmarks = this.parseLandmarks(doc);
	        } else if (ncx) {
	          this.toc = this.parseNcx(doc);
	        }
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
	      let item;
	      for (let i = 0; i < toc.length; i++) {
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
	     */
	    get(target) {
	      let index;
	      if (!target) {
	        return this.toc;
	      }
	      if (target.indexOf('#') === 0) {
	        index = this.tocById[target.substring(1)];
	      } else if (target in this.tocByHref) {
	        index = this.tocByHref[target];
	      }
	      if (index === undefined) {
	        return;
	      }
	      return this.getByIndex(target, index, this.toc);
	    }
	    /**
	     * Get an item from navigation subitems recursively by index
	     */
	    getByIndex(target, index, navItems) {
	      if (navItems.length === 0) {
	        return;
	      }
	      const item = navItems[index];
	      if (item && (target === item.id || target === item.href)) {
	        return item;
	      }
	      let result;
	      for (let i = 0; i < navItems.length; ++i) {
	        result = this.getByIndex(target, index, navItems[i].subitems);
	        if (result) {
	          break;
	        }
	      }
	      return result;
	    }
	    /**
	     * Get a landmark by type
	     * List of types: https://idpf.github.io/epub-vocabs/structure/
	     */
	    landmark(type) {
	      if (!type) {
	        return this.landmarks;
	      }
	      const index = this.landmarksByType[type];
	      return this.landmarks[index];
	    }
	    /**
	     * Parse toc from a Epub > 3.0 Nav
	     * @private
	     * @param  {document} navHtml
	     * @return {array} navigation list
	     */
	    parseNav(navHtml) {
	      const navElement = navHtml.querySelector('nav[*|type="toc"]');
	      let list = [];
	      if (!navElement) return list;
	      const navList = navElement.querySelector('ol');
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
	     */
	    navItem(item, parent) {
	      let id = item.getAttribute('id') || undefined;
	      const content = item.querySelector(':scope > a') || item.querySelector(':scope > span');
	      if (!content) {
	        return;
	      }
	      const src = content.getAttribute('href') || '';
	      if (!id) {
	        id = src;
	      }
	      const text = content.textContent || '';
	      let subitems = [];
	      const nested = item.querySelector(':scope > ol');
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
	     */
	    parseLandmarks(navHtml) {
	      const navElement = navHtml.querySelector('nav[*|type="landmarks"]');
	      const navItems = navElement ? Array.from(navElement.querySelectorAll('li')) : [];
	      const length = navItems.length;
	      let i;
	      const list = [];
	      let item;
	      if (!navItems || length === 0) return list;
	      for (i = 0; i < length; ++i) {
	        item = this.landmarkItem(navItems[i]);
	        if (item && item.type) {
	          list.push(item);
	          this.landmarksByType[item.type] = i;
	        }
	      }
	      return list;
	    }
	    /**
	     * Create a landmarkItem
	     * @param  {element} item
	     * @return {object} landmarkItem
	     */
	    landmarkItem(item) {
	      const content = item.querySelector('a');
	      if (!content) {
	        return;
	      }
	      const type = content.getAttributeNS('http://www.idpf.org/2007/ops', 'type') || undefined;
	      const href = content.getAttribute('href') || '';
	      const text = content.textContent || '';
	      return {
	        href: href,
	        label: text,
	        type: type
	      };
	    }
	    /**
	     * Parse from a Epub > 3.0 NC
	     */
	    parseNcx(tocXml) {
	      const navPoints = Array.from(tocXml.querySelectorAll('navPoint'));
	      const length = navPoints.length;
	      let i;
	      const toc = {};
	      const list = [];
	      let item, parent;
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
	      const id = item.getAttribute('id') || '';
	      const content = item.querySelector('content');
	      const src = content?.getAttribute('src') || '';
	      const navLabel = item.querySelector('navLabel');
	      const text = navLabel?.textContent || '';
	      const subitems = [];
	      const parentNode = item.parentNode;
	      let parent;
	      if (parentNode && parentNode instanceof Element && (parentNode.nodeName === 'navPoint' || parentNode.nodeName.split(':').slice(-1)[0] === 'navPoint')) {
	        parent = parentNode.getAttribute('id') || undefined;
	      }
	      return {
	        id,
	        href: src,
	        label: text,
	        subitems,
	        parent
	      };
	    }
	    /**
	     * Load Spine Items
	     */
	    load(json) {
	      return json.map(item => {
	        return {
	          id: item.id || item.href || '',
	          href: item.href || '',
	          label: item.title,
	          subitems: item.children ? this.load(item.children) : [],
	          parent: item.parent
	        };
	      });
	    }
	    /**
	     * forEach pass through
	     */
	    forEach(fn) {
	      return this.toc.forEach(fn);
	    }
	  }
	  navigation.default = Navigation;
	  return navigation;
	}

	var resources$1 = {exports: {}};

	var resources = resources$1.exports;
	var hasRequiredResources;
	function requireResources() {
	  if (hasRequiredResources) return resources$1.exports;
	  hasRequiredResources = 1;
	  (function (module, exports) {

	    var __importDefault = resources && resources.__importDefault || function (mod) {
	      return mod && mod.__esModule ? mod : {
	        "default": mod
	      };
	    };
	    Object.defineProperty(exports, "__esModule", {
	      value: true
	    });
	    const utils_1 = requireUtils();
	    const url_1 = __importDefault(requireUrl());
	    const mime_1 = __importDefault(requireMime());
	    const path_1 = __importDefault(requirePath());
	    /**
	     * Handle Package Resources
	     * @param {Manifest} manifest
	     * @param {object} [options]
	     * @param {string} [options.replacements="base64"]
	     * @param {Archive} [options.archive]
	     * @param {method} [options.resolver]
	     */
	    class Resources {
	      constructor(manifest, options) {
	        this.settings = {
	          replacements: options.replacements || 'base64',
	          archive: options.archive,
	          resolver: options.resolver,
	          request: options.request
	        };
	        this.process(manifest);
	      }
	      /**
	       * Process resources
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
	       */
	      split() {
	        // Initialize arrays in case resources is undefined
	        this.html = [];
	        this.assets = [];
	        this.css = [];
	        // Return early if resources is undefined
	        if (!this.resources) {
	          return;
	        }
	        // HTML
	        this.html = this.resources.filter(function (item) {
	          return item.type === 'application/xhtml+xml' || item.type === 'text/html';
	        });
	        // Exclude HTML
	        this.assets = this.resources.filter(function (item) {
	          return item.type !== 'application/xhtml+xml' && item.type !== 'text/html';
	        });
	        // Only CSS
	        this.css = this.resources.filter(function (item) {
	          return item.type === 'text/css';
	        });
	      }
	      /**
	       * Convert split resources into Urls
	       */
	      splitUrls() {
	        // Initialize arrays in case assets/css is undefined
	        this.urls = [];
	        this.cssUrls = [];
	        // Return early if assets or css is undefined
	        if (!this.assets || !this.css) {
	          return;
	        }
	        // All Assets Urls
	        this.urls = this.assets.map(item => item.href);
	        // Css Urls
	        this.cssUrls = this.css.map(function (item) {
	          return item.href;
	        });
	      }
	      /**
	       * Create a url to a resource
	       */
	      async createUrl(url) {
	        const parsedUrl = new url_1.default(url);
	        // mime.lookup always returns a string (defaultValue if no match)
	        const mimeType = mime_1.default.lookup(parsedUrl.filename);
	        if (this.settings === undefined) {
	          throw new Error(`Resources settings are not defined`);
	        }
	        if (this.settings.archive) {
	          return this.settings.archive.createUrl(url, {
	            base64: this.settings.replacements === 'base64'
	          });
	        }
	        if (!this.settings.request) {
	          throw new Error(`Request method is not defined`);
	        }
	        if (this.settings.replacements === 'base64') {
	          return this.settings.request(url, 'blob').then(response => {
	            if (!(response instanceof Blob)) {
	              throw new Error('Expected Blob response for base64 conversion');
	            }
	            return (0, utils_1.blob2base64)(response);
	          }).then(base64String => {
	            const dataUrl = (0, utils_1.createBase64Url)(base64String, mimeType);
	            if (!dataUrl) {
	              throw new Error('Failed to create base64 URL');
	            }
	            return dataUrl;
	          });
	        }
	        return this.settings.request(url, 'blob').then(response => {
	          if (!(response instanceof Blob)) {
	            throw new Error('Expected Blob response for blob URL creation');
	          }
	          const blobUrl = (0, utils_1.createBlobUrl)(response, mimeType);
	          if (!blobUrl) {
	            throw new Error('Failed to create blob URL');
	          }
	          return blobUrl;
	        });
	      }
	      /**
	       * Create blob urls for all the assets
	       * @return returns replacement urls
	       */
	      async replacements() {
	        if (!this.settings || this.settings.replacements === 'none') {
	          return Promise.resolve(this.urls ?? []);
	        }
	        if (this.urls === undefined) {
	          return Promise.resolve([]);
	        }
	        const replacements = this.urls.map(url => {
	          if (!this.settings.resolver) {
	            return Promise.resolve(null);
	          }
	          const absolute = this.settings.resolver(url);
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
	       */
	      replaceCss() {
	        const replaced = [];
	        this.cssUrls?.forEach(href => {
	          const replacement = this.createCssFile(href).then(replacementUrl => {
	            // switch the url in the replacementUrls
	            const indexInUrls = this.urls?.indexOf(href);
	            if (indexInUrls && indexInUrls > -1) {
	              this.replacementUrls[indexInUrls] = replacementUrl;
	            }
	          });
	          replaced.push(replacement);
	        });
	        return Promise.all(replaced);
	      }
	      /**
	       * Create a new CSS file with the replaced URLs
	       * @param  href the original css file
	       * @return returns a BlobUrl to the new CSS file or a data url
	       */
	      createCssFile(href) {
	        let newUrl;
	        // Check if href is an absolute path or URL
	        if (href.startsWith('/') || href.includes('://')) {
	          return Promise.resolve();
	        }
	        if (!this.settings.resolver) {
	          return Promise.resolve();
	        }
	        const absolute = this.settings.resolver(href);
	        // Get the text of the css file from the archive
	        let textResponse;
	        if (this.settings.archive) {
	          textResponse = this.settings.archive.getText(absolute);
	        } else if (this.settings.request) {
	          textResponse = this.settings.request(absolute, 'text');
	        } else {
	          return Promise.resolve();
	        }
	        // Get asset links relative to css file
	        const relUrls = this.urls?.map(assetHref => {
	          const resolved = this.settings.resolver(assetHref);
	          const relative = new path_1.default(absolute).relative(resolved);
	          return relative;
	        }) || [];
	        if (!textResponse) {
	          // file not found, don't replace
	          return Promise.resolve();
	        }
	        return textResponse.then(text => {
	          // Ensure text is a string (it should be when request type is 'text')
	          const textContent = typeof text === 'string' ? text : String(text);
	          // Replacements in the css text
	          const processedText = (0, utils_1.substitute)(textContent, relUrls, this.replacementUrls || []);
	          // Get the new url
	          if (this.settings.replacements === 'base64') {
	            newUrl = (0, utils_1.createBase64Url)(processedText, 'text/css');
	          } else {
	            newUrl = (0, utils_1.createBlobUrl)(processedText, 'text/css');
	          }
	          return newUrl;
	        }, () => {
	          // handle response errors
	          return Promise.resolve();
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
	        if (!this.urls) {
	          return [];
	        }
	        // Get Urls relative to current sections
	        return this.urls.map(href => {
	          const resolved = resolver(href);
	          const relative = new path_1.default(absolute).relative(resolved);
	          return relative;
	        });
	      }
	      /**
	       * Get a URL for a resource
	       */
	      get(path) {
	        if (!this.urls) {
	          return;
	        }
	        const indexInUrls = this.urls.indexOf(path);
	        if (indexInUrls === -1) {
	          return;
	        }
	        if (this.replacementUrls && this.replacementUrls.length) {
	          return Promise.resolve(this.replacementUrls[indexInUrls]);
	        } else {
	          return this.createUrl(path);
	        }
	      }
	      /**
	       * Substitute urls in content, with replacements,
	       * relative to a url if provided
	       */
	      substitute(content, url) {
	        let relUrls;
	        if (url) {
	          relUrls = this.relativeTo(url);
	        } else {
	          relUrls = this.urls || [];
	        }
	        return (0, utils_1.substitute)(content, relUrls, this.replacementUrls || []);
	      }
	      destroy() {
	        // Clear all properties for cleanup
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
	    module.exports = Resources;
	    exports.default = Resources;
	  })(resources$1, resources$1.exports);
	  return resources$1.exports;
	}

	var pagelist = {};

	var hasRequiredPagelist;
	function requirePagelist() {
	  if (hasRequiredPagelist) return pagelist;
	  hasRequiredPagelist = 1;
	  var __importDefault = pagelist && pagelist.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(pagelist, "__esModule", {
	    value: true
	  });
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const core_1 = requireCore();
	  /**
	   * Page List Parser
	   */
	  class PageList {
	    constructor(xml = null) {
	      this.pages = [];
	      this.locations = [];
	      this.epubcfi = new epubcfi_1.default();
	      this.firstPage = 0;
	      this.lastPage = 0;
	      this.totalPages = 0;
	      this.pageList = [];
	      if (xml) {
	        this.pageList = this.parse(xml);
	      }
	      if (this.pageList && this.pageList.length) {
	        this.process(this.pageList);
	      }
	    }
	    /**
	     * Parse PageList Xml
	     */
	    parse(xml) {
	      const html = xml.querySelector('html');
	      const ncx = xml.querySelector('ncx');
	      if (html) {
	        return this.parseNav(html);
	      } else if (ncx) {
	        return this.parseNcx(ncx);
	      }
	    }
	    /**
	     * Parse a Nav PageList
	     */
	    parseNav(navHtml) {
	      const navElement = (0, core_1.querySelectorByType)(navHtml, 'nav', 'page-list');
	      const navItems = navElement ? Array.from(navElement.querySelectorAll('li')) : [];
	      const list = [];
	      if (!navItems || navItems.length === 0) return list;
	      for (const navItem of navItems) {
	        const item = this.item(navItem);
	        list.push(item);
	      }
	      return list;
	    }
	    parseNcx(navXml) {
	      const list = [];
	      const pageList = navXml.querySelector('pageList');
	      if (!pageList) return list;
	      const pageTargets = Array.from(pageList.querySelectorAll('pageTarget'));
	      if (!pageTargets || pageTargets.length === 0) {
	        return list;
	      }
	      for (const pageTarget of pageTargets) {
	        const item = this.ncxItem(pageTarget);
	        list.push(item);
	      }
	      return list;
	    }
	    ncxItem(item) {
	      // Use native querySelector and proper null checks
	      const element = item instanceof Element ? item : null;
	      if (!element) {
	        return {
	          href: '',
	          page: ''
	        };
	      }
	      const navLabel = element.querySelector('navLabel');
	      const navLabelText = navLabel?.querySelector('text');
	      const pageText = navLabelText?.textContent?.trim() || '';
	      const content = element.querySelector('content');
	      const href = content?.getAttribute('src') || '';
	      // Always return page as string for PageListItem
	      return {
	        href,
	        page: pageText
	      };
	    }
	    /**
	     * Page List Item
	     */
	    item(item) {
	      const element = item instanceof Element ? item : null;
	      const content = element?.querySelector('a');
	      const href = content?.getAttribute('href') || '';
	      const text = content?.textContent?.trim() || '';
	      const isCfi = href.indexOf('epubcfi');
	      let split, packageUrl, cfi;
	      if (isCfi !== -1) {
	        split = href.split('#');
	        packageUrl = split[0];
	        cfi = split.length > 1 ? split[1] : undefined;
	        return {
	          cfi,
	          href,
	          packageUrl,
	          page: text
	        };
	      } else {
	        return {
	          href,
	          page: text
	        };
	      }
	    }
	    /**
	     * Process pageList items
	     */
	    process(pageList) {
	      pageList.forEach(item => {
	        this.pages.push(item.page);
	        if (item.cfi) {
	          this.locations.push(item.cfi);
	        }
	      });
	      this.firstPage = parseInt(this.pages[0] || '0', 10);
	      this.lastPage = parseInt(this.pages[this.pages.length - 1] || '0', 10);
	      this.totalPages = this.lastPage - this.firstPage;
	    }
	    /**
	     * Get a PageList result from a EpubCFI
	     */
	    pageFromCfi(cfi) {
	      let pg = -1;
	      if (!this.locations || this.locations.length === 0) {
	        return -1;
	      }
	      let index = (0, core_1.indexOfSorted)(cfi, this.locations, this.epubcfi?.compare);
	      if (index !== -1) {
	        pg = parseInt(this.pages[index], 10);
	      } else {
	        index = (0, core_1.locationOf)(cfi, this.locations, this.epubcfi?.compare);
	        pg = index - 1 >= 0 ? parseInt(this.pages[index - 1], 10) : parseInt(this.pages[0], 10);
	        if (isNaN(pg)) {
	          pg = -1;
	        }
	      }
	      return pg;
	    }
	    /**
	     * Get an EpubCFI from a Page List Item
	     */
	    cfiFromPage(pg) {
	      const pageStr = typeof pg === 'number' ? pg.toString() : pg;
	      const index = this.pages.indexOf(pageStr);
	      if (index !== -1) {
	        return this.locations[index];
	      }
	      // TODO: handle pages not in the list
	      return undefined;
	    }
	    /**
	     * Get a Page from Book percentage
	     */
	    pageFromPercentage(percent) {
	      const pg = Math.round(this.totalPages * percent);
	      return pg;
	    }
	    /**
	     * Returns a value between 0 - 1 corresponding to the location of a page
	     */
	    percentageFromPage(pg) {
	      const percentage = (pg - this.firstPage) / this.totalPages;
	      return Math.round(percentage * 1000) / 1000;
	    }
	    /**
	     * Returns a value between 0 - 1 corresponding to the location of a cfi
	     */
	    percentageFromCfi(cfi) {
	      const pg = this.pageFromCfi(cfi);
	      const percentage = this.percentageFromPage(pg);
	      return percentage;
	    }
	    /**
	     * Destroy
	     */
	    destroy() {
	      this.pages = [];
	      this.locations = [];
	      this.epubcfi = undefined;
	      this.pageList = undefined;
	      this.toc = undefined;
	      this.ncx = undefined;
	    }
	  }
	  pagelist.default = PageList;
	  return pagelist;
	}

	var rendition = {};

	var layout = {};

	var hasRequiredLayout;
	function requireLayout() {
	  if (hasRequiredLayout) return layout;
	  hasRequiredLayout = 1;
	  var __importDefault = layout && layout.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(layout, "__esModule", {
	    value: true
	  });
	  const core_1 = requireCore();
	  const constants_1 = requireConstants();
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  /**
	   * Figures out the CSS values to apply for a layout
	   * @param {string} [settings.layout='reflowable']
	   * @param {string} [settings.spread]
	   * @param {number} [settings.minSpreadWidth=800]
	   * @param {boolean} [settings.evenSpreads=false]
	   */
	  class Layout {
	    constructor(settings) {
	      // Set default direction if not provided
	      if (!settings.direction) {
	        settings.direction = 'ltr';
	      }
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
	     */
	    spread(spread, min) {
	      if (spread) {
	        this._spread = spread === 'none' ? false : true;
	        // this.props.spread = this._spread;
	        this.update({
	          spread: this._spread
	        });
	      }
	      if (min && min >= 0) {
	        this._minSpreadWidth = min;
	      }
	      return this._spread;
	    }
	    /**
	     * Calculate the dimensions of the pagination
	     */
	    calculate(_width, _height, _gap) {
	      let divisor = 1;
	      let gap = _gap || 0;
	      //-- Check the width and create even width columns
	      // var fullWidth = Math.floor(_width);
	      let width = _width;
	      const height = _height;
	      const section = Math.floor(width / 12);
	      let columnWidth;
	      let pageWidth;
	      if (this._spread && width >= this._minSpreadWidth) {
	        divisor = 2;
	      } else {
	        divisor = 1;
	      }
	      if (this.name === 'reflowable' && this._flow === 'paginated' && !(_gap && _gap >= 0)) {
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
	      const spreadWidth = columnWidth * divisor + gap;
	      const delta = width;
	      this.width = width;
	      this.height = height;
	      this.spreadWidth = spreadWidth;
	      this.pageWidth = pageWidth;
	      this.delta = delta;
	      this.columnWidth = columnWidth;
	      this.gap = gap;
	      this.divisor = divisor;
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
	     */
	    format(contents, section, axis) {
	      let formating;
	      if (this.name === 'pre-paginated') {
	        formating = contents.fit(this.columnWidth, this.height);
	      } else if (this._flow === 'paginated') {
	        formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.settings.direction ?? 'ltr');
	      } else if (axis && axis === 'horizontal') {
	        formating = contents.size(-1, this.height);
	      } else {
	        formating = contents.size(this.width, -1);
	      }
	      return formating;
	    }
	    /**
	     * Count number of pages
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
	     */
	    update(props) {
	      Object.keys(props).forEach(propName => {
	        const key = propName;
	        if (this.props[key] === props[key]) {
	          delete props[key];
	        }
	      });
	      if (Object.keys(props).length > 0) {
	        const newProps = (0, core_1.extend)(this.props, props);
	        this.emit(constants_1.EVENTS.LAYOUT.UPDATED, newProps, props);
	      }
	    }
	  }
	  (0, event_emitter_1.default)(Layout.prototype);
	  layout.default = Layout;
	  return layout;
	}

	var themes = {};

	var hasRequiredThemes;
	function requireThemes() {
	  if (hasRequiredThemes) return themes;
	  hasRequiredThemes = 1;
	  var __importDefault = themes && themes.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(themes, "__esModule", {
	    value: true
	  });
	  const url_1 = __importDefault(requireUrl());
	  /**
	   * Themes to apply to displayed content
	   * @class
	   * @param {Rendition} rendition
	   */
	  class Themes {
	    constructor(rendition) {
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
	    register(...args) {
	      if (args.length === 0) return;
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
	    }
	    /**
	     * Add a default theme to be used by a rendition
	     * @param {object | string} theme
	     * @example themes.register("http://example.com/default.css")
	     * @example themes.register({ "body": { "color": "purple"}})
	     */
	    default(theme) {
	      if (!theme) return;
	      if (typeof theme === 'string') {
	        return this.registerUrl('default', theme);
	      }
	      if (typeof theme === 'object') {
	        return this.registerRules('default', theme);
	      }
	    }
	    /**
	     * Register themes object
	     */
	    registerThemes(themes) {
	      for (const theme in themes) {
	        if (Object.prototype.hasOwnProperty.call(themes, theme)) {
	          if (typeof themes[theme] === 'string') {
	            this.registerUrl(theme, themes[theme]);
	          } else {
	            this.registerRules(theme, themes[theme]);
	          }
	        }
	      }
	    }
	    /**
	     * Register a theme by passing its css as string
	     */
	    registerCss(name, css) {
	      if (this._themes === undefined) {
	        throw new Error('Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.');
	      }
	      this._themes[name] = {
	        serialized: css
	      };
	      if (this._injected && this._injected.includes(name) || name == 'default') {
	        this.update(name);
	      }
	    }
	    /**
	     * Register a url
	     */
	    registerUrl(name, input) {
	      const url = new url_1.default(input);
	      if (this._themes === undefined) {
	        throw new Error('Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.');
	      }
	      this._themes[name] = {
	        url: url.toString()
	      };
	      if (this._injected && this._injected.includes(name) || name == 'default') {
	        this.update(name);
	      }
	    }
	    /**
	     * Register rule
	     */
	    registerRules(name, rules) {
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
	    }
	    /**
	     * Select a theme
	     */
	    select(name) {
	      const prev = this._current;
	      this._current = name;
	      this.update(name);
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      const contents = this.rendition.getContents();
	      if (Array.isArray(contents)) {
	        contents.forEach(content => {
	          content.removeClass(prev);
	          content.addClass(name);
	        });
	      }
	    }
	    /**
	     * Update a theme
	     */
	    update(name) {
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      const contents = this.rendition.getContents();
	      if (Array.isArray(contents)) {
	        contents.forEach(content => {
	          this.add(name, content);
	        });
	      }
	    }
	    /**
	     * Inject all themes into contents
	     */
	    inject(contents) {
	      const links = [];
	      const themes = this._themes;
	      let theme;
	      for (const name in themes) {
	        if (Object.prototype.hasOwnProperty.call(themes, name) && (name === this._current || name === 'default')) {
	          theme = themes[name];
	          if (theme.rules && Object.keys(theme.rules).length > 0 || theme.url && links.indexOf(theme.url) === -1) {
	            this.add(name, contents);
	          }
	          this._injected?.push(name);
	        }
	      }
	      if (this._current !== undefined && this._current != 'default') {
	        contents.addClass(this._current);
	      }
	    }
	    /**
	     * Add Theme to contents
	     */
	    add(name, contents) {
	      const theme = this._themes ? this._themes[name] : undefined;
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
	    }
	    /**
	     * Add override
	     */
	    override(name, value, priority = false) {
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      const contents = this.rendition.getContents();
	      if (this._overrides === undefined) {
	        this._overrides = {};
	      }
	      this._overrides[name] = {
	        value: value,
	        priority: priority === true
	      };
	      const override = this._overrides[name];
	      if (Array.isArray(contents)) {
	        contents.forEach(content => {
	          content.css(name, override.value, override.priority);
	        });
	      }
	    }
	    removeOverride(name) {
	      if (!this.rendition || !this.rendition.getContents) {
	        throw new Error('Rendition is not defined or does not have getContents method');
	      }
	      const contents = this.rendition.getContents();
	      if (this._overrides !== undefined && this._overrides[name] !== undefined) {
	        delete this._overrides[name];
	      }
	      if (Array.isArray(contents)) {
	        contents.forEach(content => {
	          content.css(name, undefined, undefined);
	        });
	      }
	    }
	    /**
	     * Add all overrides
	     */
	    overrides(contents) {
	      const overrides = this._overrides;
	      for (const rule in overrides) {
	        if (Object.prototype.hasOwnProperty.call(overrides, rule)) {
	          contents.css(rule, overrides[rule].value, overrides[rule].priority);
	        }
	      }
	    }
	    /**
	     * Adjust the font size of a rendition
	     */
	    fontSize(size) {
	      this.override('font-size', size);
	    }
	    /**
	     * Adjust the font-family of a rendition
	     */
	    font(f) {
	      this.override('font-family', f, true);
	    }
	    destroy() {
	      this.rendition = undefined;
	      this._themes = undefined;
	      this._overrides = undefined;
	      this._current = undefined;
	      this._injected = undefined;
	    }
	  }
	  themes.default = Themes;
	  return themes;
	}

	var annotations = {};

	var annotation = {};

	var hasRequiredAnnotation;
	function requireAnnotation() {
	  if (hasRequiredAnnotation) return annotation;
	  hasRequiredAnnotation = 1;
	  var __importDefault = annotation && annotation.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(annotation, "__esModule", {
	    value: true
	  });
	  annotation.Annotation = void 0;
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const constants_1 = requireConstants();
	  /**
	   * Annotation object
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
	     */
	    update(data) {
	      this.data = data;
	    }
	    /**
	     * Add to a view
	     */
	    attach(view) {
	      const {
	        cfiRange,
	        data,
	        type,
	        cb,
	        className,
	        styles
	      } = this;
	      let result;
	      const cbWrapper = cb ? () => {
	        cb(this);
	      } : undefined;
	      if (type === 'highlight') {
	        result = view.highlight(cfiRange, data, cbWrapper, className, styles);
	      } else if (type === 'underline') {
	        result = view.underline(cfiRange, data, cbWrapper, className, styles);
	      } else if (type === 'mark') {
	        result = view.mark(cfiRange, data, cbWrapper);
	      }
	      if (typeof result === 'undefined') {
	        throw new Error(`Failed to attach annotation of type ${type} to view`);
	      }
	      this._markInternal = result;
	      if (result && typeof result === 'object' && 'element' in result) {
	        this.mark = result.element;
	      } else if (result instanceof HTMLElement) {
	        this.mark = result;
	      } else {
	        this.mark = undefined;
	      }
	      this.emit(constants_1.EVENTS.ANNOTATION.ATTACH, result);
	      return result;
	    }
	    /**
	     * Remove from a view
	     */
	    detach(view) {
	      const {
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
	      this.emit(constants_1.EVENTS.ANNOTATION.DETACH, result);
	      return result;
	    }
	    text() {}
	  }
	  annotation.Annotation = Annotation;
	  (0, event_emitter_1.default)(Annotation.prototype);
	  annotation.default = Annotation;
	  return annotation;
	}

	var hasRequiredAnnotations;
	function requireAnnotations() {
	  if (hasRequiredAnnotations) return annotations;
	  hasRequiredAnnotations = 1;
	  var __importDefault = annotations && annotations.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(annotations, "__esModule", {
	    value: true
	  });
	  annotations.Annotations = void 0;
	  const annotation_1 = __importDefault(requireAnnotation());
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  /**
	   * Handles managing adding & removing Annotations
	   */
	  class Annotations {
	    constructor(rendition) {
	      this.highlights = [];
	      this.underlines = [];
	      this.marks = [];
	      this._annotations = {};
	      this._annotationsBySectionIndex = {};
	      this.rendition = rendition;
	      this.rendition.hooks.render.register(this.inject.bind(this));
	      this.rendition.hooks.unloaded.register(this.clear.bind(this));
	    }
	    /**
	     * Add an annotation to store
	     */
	    add(type, cfiRange, data, cb, className, styles) {
	      const hash = encodeURI(cfiRange + type);
	      const cfi = new epubcfi_1.default(cfiRange);
	      const sectionIndex = cfi.spinePos;
	      const annotation = new annotation_1.default({
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
	      const views = this.rendition.views();
	      views.forEach(view => {
	        if (annotation.sectionIndex === view.index) {
	          annotation.attach(view);
	        }
	      });
	      return annotation;
	    }
	    /**
	     * Remove an annotation from store
	     */
	    remove(cfiRange, type) {
	      const hash = encodeURI(cfiRange + type);
	      if (hash in this._annotations) {
	        const annotation = this._annotations[hash];
	        if (type && annotation.type !== type) {
	          return;
	        }
	        const views = this.rendition.views();
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
	     */
	    highlight(cfiRange, data, cb, className, styles) {
	      return this.add('highlight', cfiRange, data, cb, className, styles);
	    }
	    /**
	     * Add a underline to the store
	     */
	    underline(cfiRange, data, cb, className, styles) {
	      return this.add('underline', cfiRange, data, cb, className, styles);
	    }
	    /**
	     * Add a mark to the store
	         */
	    mark(cfiRange, data, cb) {
	      return this.add('mark', cfiRange, data, cb);
	    }
	    /**
	     * iterate over annotations in the store
	     */
	    each(callback, thisArg) {
	      Object.values(this._annotations).forEach(callback, thisArg);
	    }
	    /**
	     * Hook for injecting annotation into a view
	     */
	    inject(view) {
	      const sectionIndex = view.index;
	      if (sectionIndex in this._annotationsBySectionIndex) {
	        const annotations = this._annotationsBySectionIndex[sectionIndex];
	        annotations.forEach(hash => {
	          const annotation = this._annotations[hash];
	          annotation.attach(view);
	        });
	      }
	    }
	    /**
	     * Hook for removing annotation from a view
	     */
	    clear(view) {
	      const sectionIndex = view.index;
	      if (sectionIndex in this._annotationsBySectionIndex) {
	        const annotations = this._annotationsBySectionIndex[sectionIndex];
	        annotations.forEach(hash => {
	          const annotation = this._annotations[hash];
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
	  annotations.Annotations = Annotations;
	  annotations.default = Annotations;
	  return annotations;
	}

	var _default = {};

	var mapping = {};

	var hasRequiredMapping;
	function requireMapping() {
	  if (hasRequiredMapping) return mapping;
	  hasRequiredMapping = 1;
	  var __importDefault = mapping && mapping.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(mapping, "__esModule", {
	    value: true
	  });
	  mapping.Mapping = void 0;
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const core_1 = requireCore();
	  /**
	   * Map text locations to CFI range
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
	      const ranges = this.findRanges(view);
	      const map = this.rangeListToCfiList(view.section.cfiBase, ranges);
	      return map;
	    }
	    /**
	     * Find CFI pairs for a page
	     */
	    page(contents, cfiBase, start, end) {
	      const root = contents && contents.document ? contents.document.body : false;
	      if (!root) return;
	      const result = this.rangePairToCfiPair(cfiBase, {
	        start: this.findStart(root, start, end),
	        end: this.findEnd(root, start, end)
	      });
	      if (this._dev === true) {
	        const doc = contents.document;
	        const startRange = new epubcfi_1.default(result.start).toRange(doc);
	        const endRange = new epubcfi_1.default(result.end).toRange(doc);
	        if (!startRange || !endRange) {
	          throw new Error('Invalid range');
	        }
	        if (!doc) {
	          throw new Error('Document is not available');
	        }
	        if (!doc.defaultView) {
	          throw new Error('Document defaultView is not available');
	        }
	        const selection = doc.defaultView.getSelection();
	        if (!selection) {
	          throw new Error('Selection is not available');
	        }
	        const r = doc.createRange();
	        selection?.removeAllRanges();
	        r.setStart(startRange.startContainer, startRange.startOffset);
	        r.setEnd(endRange.endContainer, endRange.endOffset);
	        selection.addRange(r);
	      }
	      return result;
	    }
	    /**
	     * Walk a node, preforming a function on each node it finds
	     */
	    walk(root, func) {
	      const filter = {
	        acceptNode: function (node) {
	          if (node.data?.trim().length > 0) {
	            return NodeFilter.FILTER_ACCEPT;
	          } else {
	            return NodeFilter.FILTER_REJECT;
	          }
	        }
	      };
	      const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter);
	      let node;
	      let result;
	      while (node = treeWalker.nextNode()) {
	        result = func(node);
	        if (result) break;
	      }
	      return result;
	    }
	    findRanges(view) {
	      const columns = [];
	      const scrollWidth = view.contents.scrollWidth();
	      const spreads = Math.ceil(scrollWidth / this.layout.spreadWidth);
	      const count = spreads * this.layout.divisor;
	      const columnWidth = this.layout.columnWidth;
	      const gap = this.layout.gap;
	      let start, end;
	      for (let i = 0; i < count; i++) {
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
	     */
	    findStart(root, start, end) {
	      const stack = [root];
	      let $el;
	      let found;
	      let $prev = root;
	      while (stack.length) {
	        $el = stack.shift();
	        // This shouldn't happen since we check stack.length, but TypeScript doesn't know that
	        if (!$el) break;
	        found = this.walk($el, node => {
	          let left, right, top, bottom;
	          const elPos = (0, core_1.nodeBounds)(node);
	          if (this.horizontal && this.direction === 'ltr') {
	            left = this.horizontal ? elPos.left : elPos.top;
	            right = this.horizontal ? elPos.right : elPos.bottom;
	            if (left >= start && left <= end) {
	              return node;
	            }
	            if (right > start) {
	              return node;
	            }
	            $prev = node;
	            stack.push(node);
	          } else if (this.horizontal && this.direction === 'rtl') {
	            left = elPos.left;
	            right = elPos.right;
	            if (right <= end && right >= start) {
	              return node;
	            }
	            if (left < end) {
	              return node;
	            }
	            $prev = node;
	            stack.push(node);
	          } else {
	            top = elPos.top;
	            bottom = elPos.bottom;
	            if (top >= start && top <= end) {
	              return node;
	            }
	            if (bottom > start) {
	              return node;
	            }
	            $prev = node;
	            stack.push(node);
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
	     */
	    findEnd(root, start, end) {
	      const stack = [root];
	      let $el;
	      let $prev = root;
	      let found;
	      while (stack.length) {
	        $el = stack.shift();
	        // This shouldn't happen since we check stack.length, but TypeScript doesn't know that
	        if (!$el) break;
	        found = this.walk($el, node => {
	          let left, right, top, bottom;
	          const elPos = (0, core_1.nodeBounds)(node);
	          if (this.horizontal && this.direction === 'ltr') {
	            left = Math.round(elPos.left);
	            right = Math.round(elPos.right);
	            if (left > end && $prev) {
	              return $prev;
	            }
	            if (right > end) {
	              return node;
	            }
	            $prev = node;
	            stack.push(node);
	          } else if (this.horizontal && this.direction === 'rtl') {
	            left = Math.round(this.horizontal ? elPos.left : elPos.top);
	            right = Math.round(this.horizontal ? elPos.right : elPos.bottom);
	            if (right < start && $prev) {
	              return $prev;
	            }
	            if (left < start) {
	              return node;
	            }
	            $prev = node;
	            stack.push(node);
	          } else {
	            top = Math.round(elPos.top);
	            bottom = Math.round(elPos.bottom);
	            if (top > end && $prev) {
	              return $prev;
	            }
	            if (bottom > end) {
	              return node;
	            }
	            $prev = node;
	            stack.push(node);
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
	     */
	    findTextStartRange(node, start, end) {
	      const ranges = this.splitTextNodeIntoRanges(node);
	      let range;
	      let pos;
	      let left, top, right;
	      for (let i = 0; i < ranges.length; i++) {
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
	     */
	    findTextEndRange(node, start, end) {
	      const ranges = this.splitTextNodeIntoRanges(node);
	      let prev;
	      let range;
	      let pos;
	      let left, right, top, bottom;
	      for (let i = 0; i < ranges.length; i++) {
	        range = ranges[i];
	        pos = range.getBoundingClientRect();
	        if (this.horizontal && this.direction === 'ltr') {
	          left = pos.left;
	          right = pos.right;
	          if (left > end && prev) {
	            return prev;
	          }
	          if (right > end) {
	            return range;
	          }
	        } else if (this.horizontal && this.direction === 'rtl') {
	          left = pos.left;
	          right = pos.right;
	          if (right < start && prev) {
	            return prev;
	          }
	          if (left < start) {
	            return range;
	          }
	        } else {
	          top = pos.top;
	          bottom = pos.bottom;
	          if (top > end && prev) {
	            return prev;
	          }
	          if (bottom > end) {
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
	     */
	    splitTextNodeIntoRanges(node, _splitter) {
	      const ranges = [];
	      const textContent = node.textContent || '';
	      const text = textContent.trim();
	      let range = null;
	      const doc = node.ownerDocument;
	      if (!doc) {
	        throw new Error('Document is not available');
	      }
	      const splitter = _splitter || ' ';
	      let pos = text.indexOf(splitter);
	      if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
	        range = doc.createRange();
	        range.selectNodeContents(node);
	        return [range];
	      }
	      range = doc.createRange();
	      range.setStart(node, 0);
	      range.setEnd(node, pos);
	      ranges.push(range);
	      range = null;
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
	     */
	    rangePairToCfiPair(cfiBase, rangePair) {
	      const startRange = rangePair.start;
	      const endRange = rangePair.end;
	      startRange.collapse(true);
	      endRange.collapse(false);
	      const startCfi = new epubcfi_1.default(startRange, cfiBase).toString();
	      const endCfi = new epubcfi_1.default(endRange, cfiBase).toString();
	      return {
	        start: startCfi,
	        end: endCfi
	      };
	    }
	    rangeListToCfiList(cfiBase, columns) {
	      const map = [];
	      let cifPair;
	      for (let i = 0; i < columns.length; i++) {
	        cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);
	        map.push(cifPair);
	      }
	      return map;
	    }
	    /**
	     * Set the axis for mapping
	     */
	    axis(axis) {
	      if (axis) {
	        this.horizontal = axis === 'horizontal' ? true : false;
	      }
	      return this.horizontal;
	    }
	  }
	  mapping.Mapping = Mapping;
	  mapping.default = Mapping;
	  return mapping;
	}

	var stage = {};

	var hasRequiredStage;
	function requireStage() {
	  if (hasRequiredStage) return stage;
	  hasRequiredStage = 1;
	  Object.defineProperty(stage, "__esModule", {
	    value: true
	  });
	  stage.Stage = void 0;
	  const utils_1 = requireUtils();
	  class Stage {
	    constructor(_options) {
	      this.settings = _options || {};
	      this.id = 'epubjs-container-' + (0, utils_1.uuid)();
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
	      const overflow = options.overflow || false;
	      const axis = options.axis || 'vertical';
	      const direction = options.direction;
	      (0, utils_1.extend)(this.settings, options);
	      if (options.height && (0, utils_1.isNumber)(options.height)) {
	        height = options.height + 'px';
	      }
	      if (options.width && (0, utils_1.isNumber)(options.width)) {
	        width = options.width + 'px';
	      }
	      // Create new container element
	      const container = document.createElement('div');
	      container.id = this.id;
	      container.classList.add('epub-container');
	      // Style Element
	      // container.style.fontSize = "0";
	      container.style.wordSpacing = '0';
	      container.style.lineHeight = '0';
	      container.style.verticalAlign = 'top';
	      container.style.position = 'relative';
	      // Ensure container always has transparent background and low z-index for highlight visibility
	      container.style.backgroundColor = 'transparent';
	      container.style.zIndex = '0';
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
	      if (typeof overflow === 'string') {
	        if (overflow === 'scroll' && axis === 'vertical') {
	          container.style.overflowY = overflow;
	          container.style.overflowX = 'hidden';
	        } else if (overflow === 'scroll' && axis === 'horizontal') {
	          container.style.overflowY = 'hidden';
	          container.style.overflowX = overflow;
	        } else {
	          container.style.overflow = overflow;
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
	      const wrapper = document.createElement('div');
	      wrapper.style.visibility = 'hidden';
	      wrapper.style.overflow = 'hidden';
	      wrapper.style.width = '0';
	      wrapper.style.height = '0';
	      wrapper.appendChild(container);
	      return wrapper;
	    }
	    getElement(_element) {
	      let element;
	      if (typeof _element !== 'string' && (0, utils_1.isElement)(_element)) {
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
	      const element = this.getElement(what);
	      if (!element) {
	        return;
	      }
	      let base;
	      if (this.settings.hidden) {
	        base = this.wrapper;
	      } else {
	        base = this.container;
	      }
	      if (base) {
	        element.appendChild(base);
	      }
	      this.element = element;
	      return element;
	    }
	    getContainer() {
	      return this.container;
	    }
	    onResize(func) {
	      // Only listen to window for resize event if width and height are not fixed.
	      // This applies if it is set to a percent or auto.
	      if (!(0, utils_1.isNumber)(this.settings.width) || !(0, utils_1.isNumber)(this.settings.height)) {
	        this.resizeFunc = (0, utils_1.throttle)(func, 50);
	        window.addEventListener('resize', this.resizeFunc, false);
	      }
	    }
	    onOrientationChange(func) {
	      this.orientationChangeFunc = func;
	      window.addEventListener('orientationchange', this.orientationChangeFunc, false);
	    }
	    size(width, height) {
	      let bounds;
	      const _width = width || this.settings.width;
	      const _height = height || this.settings.height;
	      if (this.element === undefined) {
	        // Handle case where element is not defined
	        throw new Error('Element is not defined. Please attach the stage to an element first.');
	      }
	      if (width === undefined) {
	        bounds = this.element.getBoundingClientRect();
	        if (bounds.width) {
	          width = String(Math.floor(bounds.width));
	          this.container.style.width = width + 'px';
	        }
	      } else {
	        if ((0, utils_1.isNumber)(width)) {
	          this.container.style.width = width + 'px';
	        } else {
	          this.container.style.width = width;
	        }
	      }
	      if (height === undefined) {
	        bounds = bounds || this.element.getBoundingClientRect();
	        if (bounds.height) {
	          height = String(bounds.height);
	          this.container.style.height = height + 'px';
	        }
	      } else {
	        if ((0, utils_1.isNumber)(height)) {
	          this.container.style.height = height + 'px';
	        } else {
	          this.container.style.height = height;
	        }
	      }
	      if (!(0, utils_1.isNumber)(width)) {
	        width = String(this.container.clientWidth);
	      }
	      if (!(0, utils_1.isNumber)(height)) {
	        height = String(this.container.clientHeight);
	      }
	      this.containerStyles = window.getComputedStyle(this.container);
	      this.containerPadding = {
	        left: String(parseFloat(this.containerStyles.paddingLeft) || 0),
	        right: String(parseFloat(this.containerStyles.paddingRight) || 0),
	        top: String(parseFloat(this.containerStyles.paddingTop) || 0),
	        bottom: String(parseFloat(this.containerStyles.paddingBottom) || 0)
	      };
	      // Bounds not set, get them from window
	      const _windowBounds = (0, utils_1.windowBounds)();
	      const bodyStyles = window.getComputedStyle(document.body);
	      const bodyPadding = {
	        left: String(parseFloat(bodyStyles.paddingLeft) || 0),
	        right: String(parseFloat(bodyStyles.paddingRight) || 0),
	        top: String(parseFloat(bodyStyles.paddingTop) || 0),
	        bottom: String(parseFloat(bodyStyles.paddingBottom) || 0)
	      };
	      if (!_width) {
	        const leftPad = parseFloat(bodyPadding.left ?? '0');
	        const rightPad = parseFloat(bodyPadding.right ?? '0');
	        width = String(_windowBounds.width - leftPad - rightPad);
	      }
	      if (this.settings.fullsize && !_height || !_height) {
	        const topPad = parseFloat(bodyPadding.top ?? '0');
	        const bottomPad = parseFloat(bodyPadding.bottom ?? '0');
	        height = String(_windowBounds.height - topPad - bottomPad);
	      }
	      const containerLeft = parseFloat(this.containerPadding?.left ?? '0');
	      const containerRight = parseFloat(this.containerPadding?.right ?? '0');
	      const containerTop = parseFloat(this.containerPadding?.top ?? '0');
	      const containerBottom = parseFloat(this.containerPadding?.bottom ?? '0');
	      return {
	        width: parseFloat(width) - containerLeft - containerRight,
	        height: parseFloat(height) - containerTop - containerBottom
	      };
	    }
	    bounds() {
	      let box;
	      if (this.container.style.overflow !== 'visible') {
	        box = this.container && this.container.getBoundingClientRect();
	      }
	      if (!box || !box.width || !box.height) {
	        return (0, utils_1.windowBounds)();
	      } else {
	        return box;
	      }
	    }
	    getSheet() {
	      const style = document.createElement('style');
	      // WebKit hack --> https://davidwalsh.name/add-rules-stylesheets
	      style.appendChild(document.createTextNode(''));
	      document.head.appendChild(style);
	      return style.sheet;
	    }
	    addStyleRules(selector, rulesArray) {
	      const scope = '#' + this.id + ' ';
	      let rules = '';
	      if (!this.sheet) {
	        this.sheet = this.getSheet() ?? undefined;
	      }
	      rulesArray.forEach(function (set) {
	        for (const prop in set) {
	          if (Object.prototype.hasOwnProperty.call(set, prop)) {
	            rules += prop + ':' + set[prop] + ';';
	          }
	        }
	      });
	      this.sheet?.insertRule(scope + selector + ' {' + rules + '}', 0);
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
	          this.container.style.overflowY = overflow;
	          this.container.style.overflowX = 'hidden';
	        } else if (overflow === 'scroll' && this.settings.axis === 'horizontal') {
	          this.container.style.overflowY = 'hidden';
	          this.container.style.overflowX = overflow;
	        } else {
	          this.container.style.overflow = overflow;
	        }
	      }
	      this.settings.overflow = overflow;
	    }
	    destroy() {
	      if (this.element) {
	        if (this.element.contains(this.container)) {
	          this.element.removeChild(this.container);
	        }
	        if (this.resizeFunc) {
	          window.removeEventListener('resize', this.resizeFunc);
	        }
	        if (this.orientationChangeFunc) {
	          window.removeEventListener('orientationchange', this.orientationChangeFunc);
	        }
	      }
	    }
	  }
	  stage.Stage = Stage;
	  stage.default = Stage;
	  return stage;
	}

	var views = {};

	var hasRequiredViews;
	function requireViews() {
	  if (hasRequiredViews) return views;
	  hasRequiredViews = 1;
	  Object.defineProperty(views, "__esModule", {
	    value: true
	  });
	  views.Views = void 0;
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
	    slice(...args) {
	      return this._views.slice(...args);
	    }
	    get(i) {
	      return this._views[i];
	    }
	    append(view) {
	      this._views.push(view);
	      if (this.container) {
	        try {
	          // Trace when views are appended to help debug layout invalidation
	          // Note: Debug logging removed to reduce test output noise
	          try {
	            // Use bracket notation to avoid `any` lint rules
	            // Use unknown cast to avoid explicit any
	            const w = window;
	            if (!Array.isArray(w['__prerender_trace'])) {
	              w['__prerender_trace'] = [];
	            }
	            w['__prerender_trace'].push('Views.append: ' + (view.section && view.section.href));
	          } catch (err) {
	            // ignore trace push errors
	            void err;
	          }
	        } catch {
	          // ignore
	        }
	        // WARNING: appendChild() with iframe elements causes content loss!
	        // For prerendered content, this DOM move will clear iframe content.
	        // The prerenderer should handle content preservation/restoration.
	        // We CANNOT avoid iframes due to security requirements - EPUBs contain
	        // untrusted JavaScript that must be sandboxed for user safety.
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
	      const index = this._views.indexOf(view);
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
	    }
	    // Iterators
	    forEach(callback) {
	      return this._views.forEach(callback);
	    }
	    clear() {
	      // Remove all views
	      let view;
	      const len = this.length;
	      if (!this.length) return;
	      for (let i = 0; i < len; i++) {
	        view = this._views[i];
	        this.destroy(view);
	      }
	      this._views = [];
	      this.length = 0;
	    }
	    find(section) {
	      let view;
	      const len = this.length;
	      for (let i = 0; i < len; i++) {
	        view = this._views[i];
	        if (view.displayed && view.section?.index == section.index) {
	          return view;
	        }
	      }
	    }
	    displayed() {
	      const displayed = [];
	      let view;
	      const len = this.length;
	      for (let i = 0; i < len; i++) {
	        view = this._views[i];
	        if (view.displayed) {
	          displayed.push(view);
	        }
	      }
	      return displayed;
	    }
	    show() {
	      let view;
	      const len = this.length;
	      for (let i = 0; i < len; i++) {
	        view = this._views[i];
	        if (view.displayed) {
	          view.show();
	        }
	      }
	      this.hidden = false;
	    }
	    hide() {
	      let view;
	      const len = this.length;
	      for (let i = 0; i < len; i++) {
	        view = this._views[i];
	        if (view.displayed) {
	          view.hide();
	        }
	      }
	      this.hidden = true;
	    }
	  }
	  views.Views = Views;
	  views.default = Views;
	  return views;
	}

	var viewRenderer = {};

	var iframe = {};

	var contents = {};

	var hasRequiredContents;
	function requireContents() {
	  if (hasRequiredContents) return contents;
	  hasRequiredContents = 1;
	  var __importDefault = contents && contents.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(contents, "__esModule", {
	    value: true
	  });
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const utils_1 = requireUtils();
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const mapping_1 = __importDefault(requireMapping());
	  const replacements_1 = requireReplacements();
	  /**
	   * Handles DOM manipulation, queries and events for View contents
	   */
	  class Contents {
	    constructor(doc, content, cfiBase, sectionIndex) {
	      this._size = {
	        width: 0,
	        height: 0
	      };
	      this.epubcfi = new epubcfi_1.default();
	      this.called = 0;
	      this.active = true;
	      this.expanding = undefined;
	      this.observer = null;
	      this._layoutStyle = null;
	      this.readyState = 'loading';
	      this.selectionEndTimeout = null;
	      this.document = doc;
	      this.documentElement = this.document.documentElement;
	      this.content = content || this.document.body;
	      this.window = this.document.defaultView;
	      this.sectionIndex = sectionIndex || 0;
	      this.cfiBase = cfiBase || '';
	      this.epubReadingSystem('epub.js', utils_1.EPUBJS_VERSION);
	      this.listeners();
	    }
	    /**
	     * Get DOM events that are listened for and passed along
	     */
	    static get listenedEvents() {
	      return utils_1.DOM_EVENTS;
	    }
	    /**
	     * Get or Set width
	     */
	    width(w) {
	      // var frame = this.documentElement;
	      const frame = this.content;
	      if (w && (0, utils_1.isNumber)(w)) {
	        w = w + 'px';
	      }
	      if (w) {
	        frame.style.width = String(w);
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
	      const frame = this.content;
	      if (h && (0, utils_1.isNumber)(h)) {
	        h = h + 'px';
	      }
	      if (h) {
	        frame.style.height = String(h);
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
	      const content = this.content || this.document.body;
	      if (w && (0, utils_1.isNumber)(w)) {
	        w = w + 'px';
	      }
	      if (w) {
	        content.style.width = String(w);
	      }
	      return parseInt(this.window.getComputedStyle(content)['width']);
	    }
	    /**
	     * Get or Set height of the contents
	     * @param {number} [h]
	     * @returns {number} height
	     */
	    contentHeight(h) {
	      const content = this.content || this.document.body;
	      if (h && (0, utils_1.isNumber)(h)) {
	        h = h + 'px';
	      }
	      if (h) {
	        content.style.height = String(h);
	      }
	      return parseInt(this.window.getComputedStyle(content)['height']);
	    }
	    /**
	     * Get the width of the text using Range
	     */
	    textWidth() {
	      let width;
	      const range = this.document.createRange();
	      const content = this.content || this.document.body;
	      const border = (0, utils_1.borders)(content);
	      // Select the contents of frame
	      range.selectNodeContents(content);
	      // get the width of the text content
	      const rect = range.getBoundingClientRect();
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
	      const range = this.document.createRange();
	      const content = this.content || this.document.body;
	      range.selectNodeContents(content);
	      const rect = range.getBoundingClientRect();
	      const height = rect.bottom;
	      return Math.round(height);
	    }
	    /**
	     * Get documentElement scrollWidth
	     */
	    scrollWidth() {
	      const width = this.documentElement.scrollWidth;
	      return width;
	    }
	    /**
	     * Get documentElement scrollHeight
	     */
	    scrollHeight() {
	      const height = this.documentElement.scrollHeight;
	      return height;
	    }
	    /**
	     * Set overflow css style of the contents
	     */
	    overflow(overflow) {
	      if (overflow) {
	        this.documentElement.style.overflow = overflow;
	      }
	      return this.window.getComputedStyle(this.documentElement)['overflow'];
	    }
	    /**
	     * Set overflowX css style of the documentElement
	     */
	    overflowX(overflow) {
	      if (overflow) {
	        this.documentElement.style.overflowX = overflow;
	      }
	      return this.window.getComputedStyle(this.documentElement)['overflowX'];
	    }
	    /**
	     * Set overflowY css style of the documentElement
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
	      const content = this.content || this.document.body;
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
	      let $viewport = this.document.querySelector("meta[name='viewport']");
	      const parsed = {
	        width: undefined,
	        height: undefined,
	        scale: undefined,
	        minimum: undefined,
	        maximum: undefined,
	        scalable: undefined
	      };
	      const newContent = [];
	      /*
	       * check for the viewport size
	       * <meta name="viewport" content="width=1024,height=697" />
	       */
	      if ($viewport && $viewport.hasAttribute('content')) {
	        const content = $viewport.getAttribute('content');
	        if (!content) return parsed;
	        const _width = content.match(/width\s*=\s*([^,]*)/);
	        const _height = content.match(/height\s*=\s*([^,]*)/);
	        const _scale = content.match(/initial-scale\s*=\s*([^,]*)/);
	        const _minimum = content.match(/minimum-scale\s*=\s*([^,]*)/);
	        const _maximum = content.match(/maximum-scale\s*=\s*([^,]*)/);
	        const _scalable = content.match(/user-scalable\s*=\s*([^,]*)/);
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
	      const settings = (0, utils_1.defaults)(options || {}, parsed);
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
	     */
	    expand() {
	      this.emit(utils_1.EVENTS.CONTENTS.EXPAND);
	    }
	    /**
	     * Add DOM listeners
	     */
	    listeners() {
	      this.imageLoadListeners();
	      this.mediaQueryListeners();
	      // this.fontLoadListeners();
	      this.addEventListeners();
	      this.addSelectionListeners();
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
	     */
	    resizeCheck() {
	      const width = this.textWidth();
	      const height = this.textHeight();
	      if (width != this._size.width || height != this._size.height) {
	        this._size = {
	          width: width,
	          height: height
	        };
	        if (this.onResize) {
	          this.onResize(this._size);
	        }
	        this.emit(utils_1.EVENTS.CONTENTS.RESIZE, this._size);
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
	     * Listen for media query changes and emit 'expand' event
	     * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
	     * @private
	     */
	    mediaQueryListeners() {
	      const sheets = this.document.styleSheets;
	      const mediaChangeHandler = m => {
	        if (m.matches && !this._expanding) {
	          setTimeout(() => this.expand(), 1);
	        }
	      };
	      for (let i = 0; i < sheets.length; i += 1) {
	        let rules;
	        // Firefox errors if we access cssRules cross-domain
	        try {
	          rules = sheets[i].cssRules;
	        } catch {
	          return;
	        }
	        if (!rules) return; // Stylesheets changed
	        for (let j = 0; j < rules.length; j += 1) {
	          const rule = rules[j];
	          // Only CSSMediaRule has a media property
	          if (rule.type === CSSRule.MEDIA_RULE && rule.media) {
	            const mql = this.window.matchMedia(rule.media.mediaText);
	            mql.addListener(mediaChangeHandler);
	          }
	        }
	      }
	    }
	    /**
	     * Use ResizeObserver to listen for changes in the DOM and check for resize
	     */
	    resizeObservers() {
	      // create an observer instance
	      const resizeObserver = new ResizeObserver(() => {
	        requestAnimationFrame(this.resizeCheck.bind(this));
	      });
	      this.observer = resizeObserver;
	      // pass in the target node
	      resizeObserver.observe(this.document.documentElement);
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
	      const config = {
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
	     */
	    imageLoadListeners() {
	      const images = this.document.querySelectorAll('img');
	      let img;
	      for (let i = 0; i < images.length; i++) {
	        img = images[i];
	        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
	          img.onload = this.expand.bind(this);
	        }
	      }
	    }
	    /**
	     * Listen for font load and check for resize when loaded
	     */
	    // private fontLoadListeners() {
	    //   if (!this.document || !this.document.fonts) {
	    //     return;
	    //   }
	    //   this.document.fonts.ready.then(() => {
	    //     this.resizeCheck();
	    //   });
	    // }
	    /**
	     * Get the documentElement
	     */
	    root() {
	      if (!this.document) return null;
	      return this.document.documentElement;
	    }
	    /**
	     * Get the location offset of a EpubCFI or an #id
	     */
	    locationOf(target, ignoreClass) {
	      let position;
	      const targetPos = {
	        left: 0,
	        top: 0
	      };
	      if (!this.document) return targetPos;
	      if (this.epubcfi.isCfiString(target)) {
	        const range = new epubcfi_1.default(target).toRange(this.document, ignoreClass);
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
	          if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer instanceof Element) {
	            position = range.startContainer.getBoundingClientRect();
	            targetPos.left = position.left;
	            targetPos.top = position.top;
	          } else {
	            // Construct a new non-collapsed range
	            position = range.getBoundingClientRect();
	          }
	        }
	      } else if (typeof target === 'string' && target.indexOf('#') > -1) {
	        const id = target.substring(target.indexOf('#') + 1);
	        const el = this.document.getElementById(id);
	        if (el) {
	          position = el.getBoundingClientRect();
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
	     */
	    addStylesheet(src) {
	      return new Promise(resolve => {
	        let $stylesheet;
	        let ready = false;
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
	        $stylesheet.onload = () => {
	          if (!ready) {
	            ready = true;
	            setTimeout(() => {
	              resolve(true);
	            }, 1);
	          }
	        };
	        this.document.head.appendChild($stylesheet);
	      });
	    }
	    _getStylesheetNode(key) {
	      let styleEl;
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
	     * @param key If the key is the same, the CSS will be replaced instead of inserted
	     */
	    addStylesheetCss(serializedCss, key) {
	      if (!this.document || !serializedCss) return false;
	      const styleEl = this._getStylesheetNode(key);
	      if (styleEl) {
	        styleEl.innerHTML = serializedCss;
	      }
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
	      if (!this.document || !rules) return;
	      const styleNode = this._getStylesheetNode(key);
	      if (!(styleNode instanceof HTMLStyleElement) || !styleNode.sheet) return;
	      const styleSheet = styleNode.sheet;
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
	    /**
	     * Append a script tag to the document head
	     */
	    addScript(src) {
	      return new Promise(resolve => {
	        let ready = false;
	        if (!this.document) {
	          resolve(false);
	          return;
	        }
	        const $script = this.document.createElement('script');
	        $script.type = 'text/javascript';
	        $script.async = true;
	        $script.src = src;
	        $script.onload = function () {
	          if (!ready) {
	            ready = true;
	            setTimeout(() => {
	              resolve(true);
	            }, 1);
	          }
	        };
	        this.document.head.appendChild($script);
	      });
	    }
	    /**
	     * Add a class to the contents container
	     */
	    addClass(className) {
	      if (!this.document) return;
	      const content = this.content || this.document.body;
	      if (content) {
	        content.classList.add(className);
	      }
	    }
	    /**
	     * Remove a class from the contents container
	     */
	    removeClass(className) {
	      if (!this.document) return;
	      const content = this.content || this.document.body;
	      if (content) {
	        content.classList.remove(className);
	      }
	    }
	    /**
	     * Add DOM event listeners
	     */
	    addEventListeners() {
	      if (!this.document) {
	        return;
	      }
	      this._triggerEvent = this.triggerEvent.bind(this);
	      utils_1.DOM_EVENTS.forEach(eventName => {
	        this.document.addEventListener(eventName, this._triggerEvent, false);
	      });
	    }
	    /**
	     * Remove DOM event listeners
	     */
	    removeEventListeners() {
	      if (!this.document) {
	        return;
	      }
	      utils_1.DOM_EVENTS.forEach(eventName => {
	        this.document.removeEventListener(eventName, this._triggerEvent, false);
	      });
	      this._triggerEvent = undefined;
	    }
	    /**
	     * Emit passed browser events
	     */
	    triggerEvent(e) {
	      this.emit(e.type, e);
	    }
	    /**
	     * Add listener for text selection
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
	     */
	    removeSelectionListeners() {
	      if (!this.document) {
	        return;
	      }
	      this.document.removeEventListener('selectionchange', this._onSelectionChange, false);
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
	      this.selectionEndTimeout = setTimeout(() => {
	        const selection = this.window.getSelection();
	        this.triggerSelectedEvent(selection);
	      }, 250);
	    }
	    /**
	     * Emit event on text selection
	     * @private
	     */
	    triggerSelectedEvent(selection) {
	      let range, cfirange;
	      if (selection && selection.rangeCount > 0) {
	        range = selection.getRangeAt(0);
	        if (!range.collapsed) {
	          try {
	            // cfirange = this.section.cfiFromRange(range);
	            cfirange = new epubcfi_1.default(range, this.cfiBase).toString();
	            this.emit(utils_1.EVENTS.CONTENTS.SELECTED, cfirange);
	            this.emit(utils_1.EVENTS.CONTENTS.SELECTED_RANGE, range);
	          } catch (e) {
	            console.error('[Contents] ❌ Error generating CFI from range:', e);
	          }
	        }
	      }
	    }
	    /**
	     * Get a Dom Range from EpubCFI
	     */
	    range(_cfi, ignoreClass) {
	      const cfi = new epubcfi_1.default(_cfi);
	      return cfi.toRange(this.document, ignoreClass);
	    }
	    /**
	     * Get an EpubCFI from a Dom Range
	     */
	    cfiFromRange(range, ignoreClass) {
	      return new epubcfi_1.default(range, this.cfiBase, ignoreClass).toString();
	    }
	    /**
	     * Get an EpubCFI from a Dom node
	     */
	    cfiFromNode(node, ignoreClass) {
	      return new epubcfi_1.default(node, this.cfiBase, ignoreClass).toString();
	    }
	    /**
	     * Size the contents to a given width and height
	     */
	    size(width, height) {
	      const viewport = {
	        scale: '1.0',
	        scalable: 'no'
	      };
	      this.layoutStyle('scrolling');
	      if (width >= 0) {
	        this.width(width);
	        viewport.width = String(width);
	        this.css('padding', '0 ' + width / 12 + 'px');
	      }
	      if (height >= 0) {
	        this.height(height);
	        viewport.height = String(height);
	      }
	      this.css('margin', '0');
	      this.css('box-sizing', 'border-box');
	      this.viewport(viewport);
	    }
	    /**
	     * Apply columns to the contents for pagination
	     */
	    columns(width, height, columnWidth, gap, dir) {
	      const COLUMN_AXIS = (0, utils_1.prefixed)('column-axis');
	      const COLUMN_GAP = (0, utils_1.prefixed)('column-gap');
	      const COLUMN_WIDTH = (0, utils_1.prefixed)('column-width');
	      const COLUMN_FILL = (0, utils_1.prefixed)('column-fill');
	      const writingModeValue = this.writingMode();
	      const axis = typeof writingModeValue === 'string' && writingModeValue.indexOf('vertical') === 0 ? 'vertical' : 'horizontal';
	      this.layoutStyle('paginated');
	      if (dir === 'rtl' && axis === 'horizontal') {
	        this.direction(dir);
	      }
	      this.width(width);
	      this.height(height);
	      // Deal with Mobile trying to scale to viewport
	      this.viewport({
	        width: String(width),
	        height: String(height),
	        scale: '1.0',
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
	      const scaleStr = 'scale(' + scale + ')';
	      let translateStr = '';
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
	      const viewport = this.viewport();
	      const viewportWidth = parseInt(viewport.width);
	      const viewportHeight = parseInt(viewport.height);
	      const widthScale = width / viewportWidth;
	      const heightScale = height / viewportHeight;
	      const scale = widthScale < heightScale ? widthScale : heightScale;
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
	        const marginLeft = width - viewportWidth * scale;
	        this.css('margin-left', marginLeft + 'px');
	      }
	    }
	    /**
	     * Set the direction of the text
	     * @param {string} [dir="ltr"] "rtl" | "ltr"
	     */
	    direction(dir = 'ltr') {
	      if (this.documentElement) {
	        this.documentElement.style['direction'] = dir;
	      }
	    }
	    mapPage(cfiBase, layout, start, end, dev) {
	      // Pass dev as the fourth argument, direction and axis as undefined
	      const mapping = new mapping_1.default(layout, undefined, undefined, dev);
	      return mapping.page(this, cfiBase, start, end);
	    }
	    /**
	     * Emit event when link in content is clicked
	     * @private
	     */
	    linksHandler() {
	      (0, replacements_1.replaceLinks)(this.content, href => {
	        this.emit(utils_1.EVENTS.CONTENTS.LINK_CLICKED, href);
	      });
	    }
	    /**
	     * Set the writingMode of the text
	     */
	    writingMode(mode) {
	      const WRITING_MODE = (0, utils_1.prefixed)('writing-mode');
	      if (mode !== undefined) {
	        this.content.style.setProperty(WRITING_MODE, mode);
	        return;
	      }
	      return this.content.style.getPropertyValue(WRITING_MODE) || 'horizontal-tb';
	    }
	    /**
	     * Set the layoutStyle of the content
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
	      this.removeListeners();
	    }
	  }
	  (0, event_emitter_1.default)(Contents.prototype);
	  contents.default = Contents;
	  return contents;
	}

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

	var marksPane_esm = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Highlight: Highlight,
		Mark: Mark,
		Pane: Pane,
		Underline: Underline
	});

	var require$$5$1 = /*@__PURE__*/getAugmentedNamespace(marksPane_esm);

	var styledPane = {};

	var hasRequiredStyledPane;
	function requireStyledPane() {
	  if (hasRequiredStyledPane) return styledPane;
	  hasRequiredStyledPane = 1;
	  Object.defineProperty(styledPane, "__esModule", {
	    value: true
	  });
	  styledPane.StyledPane = void 0;
	  const marks_pane_1 = require$$5$1;
	  // Subclass Pane to inject custom SVG styling
	  class StyledPane extends marks_pane_1.Pane {
	    constructor(target, container,
	    // eslint-disable-next-line @typescript-eslint/no-unused-vars
	    _transparency) {
	      super(target, container);
	      // @ts-expect-error We should add a public method to get the method in Pane
	      const svgElement = this.element;
	      if (svgElement) {
	        // Apply the exact same styling as the working SVG
	        svgElement.setAttribute('pointer-events', 'none');
	        svgElement.style.position = 'absolute';
	        svgElement.style.top = '0px';
	        svgElement.style.left = '0px';
	        svgElement.style.zIndex = '-3';
	        // Apply important styles to match exactly
	        svgElement.style.setProperty('top', '0px', 'important');
	        svgElement.style.setProperty('left', '0px', 'important');
	      }
	    }
	  }
	  styledPane.StyledPane = StyledPane;
	  return styledPane;
	}

	var hasRequiredIframe;
	function requireIframe() {
	  if (hasRequiredIframe) return iframe;
	  hasRequiredIframe = 1;
	  var __importDefault = iframe && iframe.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(iframe, "__esModule", {
	    value: true
	  });
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const core_1 = requireCore();
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const contents_1 = __importDefault(requireContents());
	  const constants_1 = requireConstants();
	  const marks_pane_1 = require$$5$1;
	  const styled_pane_1 = requireStyledPane();
	  class IframeView {
	    constructor(section, options = {}) {
	      this.added = false;
	      this.displayed = false;
	      this.rendered = false;
	      this.fixedWidth = 0;
	      this.fixedHeight = 0;
	      this.epubcfi = new epubcfi_1.default();
	      this._width = 0;
	      this._height = 0;
	      this.lockedWidth = 0;
	      this.lockedHeight = 0;
	      this.stopExpanding = false;
	      this.resizing = false;
	      this._expanding = false;
	      this.highlights = {};
	      this.underlines = {};
	      this.marks = {};
	      this._needsReframe = false;
	      this.rendering = false;
	      this.settings = (0, core_1.extend)({
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
	      this.id = 'epubjs-view-' + (0, core_1.uuid)();
	      this.section = section;
	      this.index = section.index;
	      if (this.settings.axis === undefined) {
	        throw new Error('Axis is not defined');
	      }
	      this.element = this.container(this.settings.axis);
	      this.added = false;
	      this.displayed = false;
	      this.rendered = false;
	      this.fixedWidth = 0;
	      this.fixedHeight = 0;
	      // Blank Cfi for Parsing
	      this.epubcfi = new epubcfi_1.default();
	      this.layout = this.settings.layout;
	      // Dom events to listen for
	      // this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];
	      this.pane = undefined;
	      this.highlights = {};
	      this.underlines = {};
	      this.marks = {};
	    }
	    container(axis) {
	      const element = document.createElement('div');
	      element.classList.add('epub-view');
	      // this.element.style.minHeight = "100px";
	      element.style.height = '0px';
	      element.style.width = '0px';
	      element.style.overflow = 'hidden';
	      element.style.position = 'relative';
	      element.style.display = 'block';
	      if (axis && axis === 'horizontal') {
	        element.style.flex = 'none';
	      } else {
	        element.style.flex = 'initial';
	      }
	      return element;
	    }
	    create() {
	      if (this.iframe) return this.iframe;
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
	      this.element.setAttribute('ref', String(this.index));
	      this.added = true;
	      this.elementBounds = (0, core_1.bounds)(this.element);
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
	    /**
	     * Stub for createContainer to resolve TypeScript errors.
	     * Returns a new div element.
	     */
	    createContainer() {
	      return document.createElement('div');
	    }
	    async render(request) {
	      this.create();
	      // Fit to size of the container, apply padding
	      this.size();
	      if (!this.sectionRender) {
	        this.sectionRender = this.section.render(request);
	      }
	      // Render Chain
	      return this.sectionRender.then(contents => {
	        return this.load(contents);
	      }).then(() => {
	        // find and report the writingMode axis
	        const writingMode = this.contents.writingMode();
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
	        this.emit(constants_1.EVENTS.VIEWS.AXIS, axis);
	        this.setWritingMode(writingMode);
	        this.emit(constants_1.EVENTS.VIEWS.WRITING_MODE, writingMode);
	        // apply the layout function to the contents
	        this.layout.format(this.contents, this.section, this.axis);
	        // Listen for events that require an expansion of the iframe
	        this.addListeners();
	        // Expand the iframe to the full size of the content
	        this.expand();
	        if (this.settings.forceRight) {
	          this.element.style.marginLeft = this.width() + 'px';
	        }
	      }).then(() => {
	        // Mark as rendered for external checks
	        this.rendered = true;
	        this.emit(constants_1.EVENTS.VIEWS.RENDERED, this.section);
	      }).catch(e => {
	        this.emit(constants_1.EVENTS.VIEWS.LOAD_ERROR, e);
	        return Promise.reject(e);
	      });
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
	      // Prefer explicit numeric sizes. If not provided (or non-numeric),
	      // measure the containing element so pages are sized to the container,
	      // not the window.
	      let width = _width ?? this.settings.width;
	      let height = _height ?? this.settings.height;
	      // If width/height are not numeric, fall back to the element's bounding rect
	      try {
	        const rect = this.element.getBoundingClientRect();
	        if (!(0, core_1.isNumber)(width) || width === 0) {
	          width = Math.floor(rect.width);
	        }
	        if (!(0, core_1.isNumber)(height) || height === 0) {
	          height = Math.floor(rect.height);
	        }
	      } catch {
	        // if element is not yet in the DOM, leave provided values
	      }
	      if (this.layout && this.layout.name === 'pre-paginated') {
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
	      const elBorders = (0, core_1.borders)(this.element);
	      let iframeBorders;
	      if (this.iframe) {
	        iframeBorders = (0, core_1.borders)(this.iframe);
	      } else {
	        iframeBorders = {
	          width: 0,
	          height: 0
	        };
	      }
	      if (what == 'width' && (0, core_1.isNumber)(width)) {
	        this.lockedWidth = width - elBorders.width - iframeBorders.width;
	        // this.resize(this.lockedWidth, width); //  width keeps ratio correct
	      }
	      if (what == 'height' && (0, core_1.isNumber)(height)) {
	        this.lockedHeight = height - elBorders.height - iframeBorders.height;
	        // this.resize(width, this.lockedHeight);
	      }
	      if (what === 'both' && (0, core_1.isNumber)(width) && (0, core_1.isNumber)(height)) {
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
	      let width = this.lockedWidth;
	      let height = this.lockedHeight;
	      let columns;
	      if (!this.iframe || this._expanding) return;
	      this._expanding = true;
	      // Pre-paginated layout
	      if (this.layout.name === 'pre-paginated') {
	        width = this.layout?.columnWidth ?? width;
	        height = this.layout?.height ?? height;
	      }
	      // Horizontal axis
	      else if (this.settings.axis === 'horizontal') {
	        if (!this.contents) throw new Error('Contents not loaded');
	        if (!this.layout) throw new Error('Layout not defined');
	        width = this.contents.textWidth();
	        if (this.layout?.pageWidth && width % this.layout.pageWidth > 0) {
	          width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
	        }
	        if (this.settings.forceEvenPages && this.layout?.pageWidth) {
	          columns = width / this.layout.pageWidth;
	          if (this.layout?.divisor && this.layout.divisor > 1 && this.layout.name === 'reflowable' && columns % 2 > 0) {
	            width += this.layout.pageWidth;
	          }
	        }
	      }
	      // Vertical axis
	      else if (this.settings.axis === 'vertical') {
	        if (!this.contents) throw new Error('Contents not loaded');
	        height = this.contents.textHeight();
	        if (this.settings.flow === 'paginated' && this.layout?.height && height % this.layout.height > 0) {
	          height = Math.ceil(height / this.layout.height) * this.layout.height;
	        }
	      }
	      // Spread mode support
	      if (this.layout && this.layout._spread &&
	      // or use a getter if available
	      typeof this.layout.pageWidth === 'number' && typeof this.layout.divisor === 'number' && this.layout.divisor > 1) {
	        // Spread mode logic
	        const spreadWidth = this.layout.pageWidth * this.layout.divisor;
	        if (this._needsReframe || spreadWidth != this._width || height != this._height) {
	          this.reframe(spreadWidth, height);
	        }
	      } else {
	        if (this._needsReframe || width != this._width || height != this._height) {
	          this.reframe(width, height);
	        }
	      }
	      this._expanding = false;
	    }
	    reframe(width, height) {
	      if (this.iframe === undefined) {
	        throw new Error('Iframe not defined');
	      }
	      if ((0, core_1.isNumber)(width)) {
	        this.element.style.width = width + 'px';
	        this.iframe.style.width = width + 'px';
	        this._width = width;
	      }
	      if ((0, core_1.isNumber)(height)) {
	        this.element.style.height = height + 'px';
	        this.iframe.style.height = height + 'px';
	        this._height = height;
	      }
	      const widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
	      const heightDelta = this.prevBounds ? height - this.prevBounds.height : height;
	      const size = {
	        width: width,
	        height: height,
	        widthDelta: widthDelta,
	        heightDelta: heightDelta
	      };
	      this.pane?.render();
	      requestAnimationFrame(() => {
	        let mark;
	        for (const m in this.marks) {
	          if (Object.prototype.hasOwnProperty.call(this.marks, m)) {
	            mark = this.marks[m];
	            this.placeMark(mark.element, mark.range);
	          }
	        }
	      });
	      this.onResize(this, size);
	      this.emit(constants_1.EVENTS.VIEWS.RESIZED, size);
	      this.prevBounds = size;
	      this.elementBounds = (0, core_1.bounds)(this.element);
	    }
	    load(contents) {
	      const loading = new core_1.defer();
	      if (!this.iframe) {
	        loading.reject(new Error('No Iframe Available'));
	        return loading.promise;
	      }
	      this.iframe.onload = event => {
	        this.onLoad(event, loading);
	      };
	      if (this.settings.method === 'blobUrl') {
	        this.blobUrl = (0, core_1.createBlobUrl)(contents, 'application/xhtml+xml');
	        this.iframe.src = this.blobUrl;
	        this.element.appendChild(this.iframe);
	        return loading.promise;
	      }
	      if (this.settings.method === 'srcdoc') {
	        this.iframe.srcdoc = contents;
	        this.element.appendChild(this.iframe);
	        return loading.promise;
	      }
	      this.element.appendChild(this.iframe);
	      this.document = this.iframe.contentDocument ?? undefined;
	      if (!this.document) {
	        loading.reject(new Error('No Document Available'));
	        return loading.promise;
	      }
	      this.iframe.contentDocument?.open();
	      this.iframe.contentDocument?.write(contents);
	      this.iframe.contentDocument?.close();
	      return loading.promise;
	    }
	    /**
	     * Essential setup for Contents object - used by both normal onLoad and prerendering
	     * This contains only the safe and essential parts needed for highlighting to work
	     */
	    setupContentsForHighlighting(iframe, section, transparency) {
	      const document = iframe.contentDocument;
	      if (!document) {
	        console.warn('[IframeView] No document available for Contents setup');
	        return null;
	      }
	      // Inject transparent background if option is enabled
	      if (transparency && document.body) {
	        document.body.style.background = 'transparent';
	        // Also inject a style tag for full coverage
	        const style = document.createElement('style');
	        style.innerHTML = 'html, body { background: transparent !important; }';
	        document.head.appendChild(style);
	      }
	      // Create Contents object (essential for highlighting)
	      const contents = new contents_1.default(document, document.body, section.cfiBase, section.index);
	      // Set up canonical link (safe)
	      let link = document.querySelector("link[rel='canonical']");
	      if (link) {
	        if (section.canonical) {
	          link.setAttribute('href', section.canonical);
	        }
	      } else {
	        link = document.createElement('link');
	        link.setAttribute('rel', 'canonical');
	        if (section.canonical) {
	          link.setAttribute('href', section.canonical);
	        }
	        document.querySelector('head')?.appendChild(link);
	      }
	      return contents;
	    }
	    /**
	     * Ensures Contents object exists for highlighting/underlining - works for both normal and prerendered views
	     */
	    ensureContentsForMarking() {
	      if (this.contents) return true;
	      // For prerendered views, try to create Contents on-the-fly
	      if (this.iframe && this.iframe.contentDocument && this.section) {
	        try {
	          const contents = this.setupContentsForHighlighting(this.iframe, this.section, this.settings.transparency);
	          if (contents) {
	            this.window = this.iframe.contentWindow ?? undefined;
	            this.document = this.iframe.contentDocument;
	            this.contents = contents;
	            return true;
	          }
	          console.warn('[IframeView] Failed to create Contents for prerendered view - helper returned null');
	          return false;
	        } catch (e) {
	          console.warn('[IframeView] Error creating Contents for prerendered view:', e);
	          return false;
	        }
	      }
	      console.warn('[IframeView] Cannot create Contents - missing iframe, document, or section', {
	        hasIframe: !!this.iframe,
	        hasDocument: !!(this.iframe && this.iframe.contentDocument),
	        hasSection: !!this.section
	      });
	      return false;
	    }
	    onLoad(event, promise) {
	      if (this.iframe === undefined) {
	        throw new Error('Iframe not defined');
	      }
	      this.window = this.iframe.contentWindow ?? undefined;
	      this.document = this.iframe.contentDocument ?? undefined;
	      if (this.document === undefined) {
	        throw new Error('Document not defined');
	      }
	      // Use the shared helper for essential Contents setup
	      const contents = this.setupContentsForHighlighting(this.iframe, this.section, this.settings.transparency);
	      if (!contents) {
	        throw new Error('Failed to create Contents object');
	      }
	      this.contents = contents;
	      this.rendering = false;
	      // Set up event listeners for layout operations (may be disruptive for prerendered content)
	      this.contents.on(constants_1.EVENTS.CONTENTS.EXPAND, () => {
	        if (this.displayed && this.iframe) {
	          this.expand();
	          if (this.contents) {
	            this.layout.format(this.contents);
	          }
	        }
	      });
	      this.contents.on(constants_1.EVENTS.CONTENTS.RESIZE, () => {
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
	      const displayed = new core_1.defer();
	      if (!this.displayed) {
	        this.render(request).then(() => {
	          this.emit(constants_1.EVENTS.VIEWS.DISPLAYED, this);
	          this.onDisplayed(this);
	          this.displayed = true;
	          displayed.resolve(this);
	        }, function (err) {
	          displayed.reject(err);
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
	        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
	        this.iframe.offsetWidth;
	        // @ts-expect-error Part of a redrawing hack for Safari
	        this.iframe.style.transform = null;
	      }
	      this.emit(constants_1.EVENTS.VIEWS.SHOWN, this);
	    }
	    hide() {
	      // this.iframe.style.display = "none";
	      this.element.style.visibility = 'hidden';
	      if (this.iframe) {
	        this.iframe.style.visibility = 'hidden';
	      }
	      this.stopExpanding = true;
	      this.emit(constants_1.EVENTS.VIEWS.HIDDEN, this);
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
	      if (this.contents === undefined) {
	        throw new Error('Contents not loaded');
	      }
	      const targetPos = this.contents.locationOf(target, this.settings.ignoreClass);
	      return {
	        left: targetPos.left,
	        top: targetPos.top
	      };
	    }
	    onDisplayed(view) {
	      console.log('[InlineView] onDisplayed called', view);
	      // Stub, override with a custom functions
	    }
	    onResize(
	    // eslint-disable-next-line @typescript-eslint/no-unused-vars
	    _viewer,
	    // eslint-disable-next-line @typescript-eslint/no-unused-vars
	    _newSize) {
	      // Stub, override with a custom functions
	    }
	    bounds(force = false) {
	      if (force || !this.elementBounds) {
	        this.elementBounds = (0, core_1.bounds)(this.element);
	      }
	      return this.elementBounds;
	    }
	    highlight(cfiRange, data = {}, cb, className = 'epubjs-hl', styles = {}) {
	      if (!this.ensureContentsForMarking()) return;
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
	      // this.contents is ensured to be defined by ensureContentsForMarking
	      const range = this.contents.range(cfiRange);
	      const emitter = () => {
	        this.emit(constants_1.EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
	      };
	      data['epubcfi'] = cfiRange;
	      if (this.iframe === undefined) {
	        throw new Error('Iframe not defined');
	      }
	      if (!this.pane) {
	        this.pane = new styled_pane_1.StyledPane(this.iframe, this.element, this.settings.transparency);
	      }
	      const m = new marks_pane_1.Highlight(range, className, data, attributes);
	      const h = this.pane.addMark(m);
	      // @ts-expect-error we should add a class to Mark to get the element
	      const highlightElement = h.element;
	      this.highlights[cfiRange] = {
	        mark: h,
	        element: highlightElement,
	        listeners: [emitter, cb]
	      };
	      highlightElement.setAttribute('ref', className);
	      highlightElement.addEventListener('click', emitter);
	      highlightElement.addEventListener('touchstart', emitter);
	      if (cb) {
	        highlightElement.addEventListener('click', cb);
	        highlightElement.addEventListener('touchstart', cb);
	      }
	      return h;
	    }
	    underline(cfiRange, data = {}, cb, className = 'epubjs-ul', styles = {}) {
	      if (!this.ensureContentsForMarking()) return;
	      const attributes = Object.assign({
	        stroke: 'black',
	        'stroke-opacity': '0.3',
	        'mix-blend-mode': 'multiply'
	      }, styles);
	      const range = this.contents.range(cfiRange);
	      const emitter = () => {
	        this.emit(constants_1.EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
	      };
	      data['epubcfi'] = cfiRange;
	      if (this.iframe === undefined) {
	        throw new Error('Iframe not defined');
	      }
	      if (!this.pane) {
	        this.pane = new styled_pane_1.StyledPane(this.iframe, this.element, this.settings.transparency);
	      }
	      const m = new marks_pane_1.Underline(range, className, data, attributes);
	      const h = this.pane.addMark(m);
	      // @ts-expect-error we should add a class to Mark to get the element
	      const underlineElement = h.element;
	      this.underlines[cfiRange] = {
	        mark: h,
	        element: underlineElement,
	        listeners: [emitter, cb]
	      };
	      underlineElement.setAttribute('ref', className);
	      underlineElement.addEventListener('click', emitter);
	      underlineElement.addEventListener('touchstart', emitter);
	      if (cb) {
	        underlineElement.addEventListener('click', cb);
	        underlineElement.addEventListener('touchstart', cb);
	      }
	      return h;
	    }
	    mark(cfiRange, data = {}, cb) {
	      if (!this.contents) {
	        return null;
	      }
	      if (cfiRange in this.marks) {
	        const item = this.marks[cfiRange];
	        return item;
	      }
	      let range = this.contents.range(cfiRange);
	      if (!range) {
	        return null;
	      }
	      const container = range.commonAncestorContainer;
	      const parent = container.nodeType === 1 ? container : container.parentNode;
	      const emitter = () => {
	        this.emit(constants_1.EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
	      };
	      if (range.collapsed && container.nodeType === 1) {
	        range = new Range();
	        range.selectNodeContents(container);
	      } else if (range.collapsed) {
	        // Webkit doesn't like collapsed ranges
	        range = new Range();
	        range.selectNodeContents(parent);
	      }
	      const mark = this.document.createElement('a');
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
	        const pos = range.getBoundingClientRect();
	        top = pos.top;
	        right = pos.right;
	      } else {
	        // Element might break columns, so find the left most element
	        const rects = range.getClientRects();
	        if (this.layout === undefined) {
	          throw new Error('Layout not defined');
	        }
	        let rect;
	        for (let i = 0; i != rects.length; i++) {
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
	        if (this.pane === undefined) {
	          throw new Error('Pane not defined');
	        }
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
	      if (cfiRange in this.marks) {
	        const item = this.marks[cfiRange];
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
	      for (const cfiRange in this.highlights) {
	        this.unhighlight(cfiRange);
	      }
	      for (const cfiRange in this.underlines) {
	        this.ununderline(cfiRange);
	      }
	      for (const cfiRange in this.marks) {
	        this.unmark(cfiRange);
	      }
	      if (this.blobUrl) {
	        (0, core_1.revokeBlobUrl)(this.blobUrl);
	      }
	      if (this.displayed) {
	        this.displayed = false;
	        this.removeListeners();
	        this.contents?.destroy();
	        this.stopExpanding = true;
	        if (this.iframe && this.element && this.element.contains(this.iframe)) {
	          this.element.removeChild(this.iframe);
	        }
	        if (this.pane) {
	          this.pane = undefined;
	        }
	        this.iframe = undefined;
	        this.contents = undefined;
	        this._textWidth = undefined;
	        this._textHeight = undefined;
	      }
	      // this.element.style.height = "0px";
	      // this.element.style.width = "0px";
	    }
	  }
	  (0, event_emitter_1.default)(IframeView.prototype);
	  iframe.default = IframeView;
	  return iframe;
	}

	var hasRequiredViewRenderer;
	function requireViewRenderer() {
	  if (hasRequiredViewRenderer) return viewRenderer;
	  hasRequiredViewRenderer = 1;
	  var __importDefault = viewRenderer && viewRenderer.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(viewRenderer, "__esModule", {
	    value: true
	  });
	  viewRenderer.ViewRenderer = void 0;
	  const iframe_1 = __importDefault(requireIframe());
	  const core_1 = requireCore();
	  /**
	   * ViewRenderer - Centralized view creation and rendering logic
	   *
	   * This class abstracts the common view creation and rendering logic that was
	   * previously duplicated between DefaultViewManager and PreRenderer.
	   * It provides consistent rendering behavior across all contexts and supports
	   * different rendering strategies (immediate vs. offscreen).
	   */
	  class ViewRenderer {
	    constructor(settings, request) {
	      this.settings = settings;
	      this.request = request;
	    }
	    /**
	     * Create a new view for a section with optional rendering options
	     */
	    createView(section, options = {}) {
	      const viewSettings = (0, core_1.extend)(this.settings, {
	        forceRight: options.forceRight || false
	      });
	      const view = new iframe_1.default(section, viewSettings);
	      // Ensure EventEmitter methods are available
	      // If they're not, add minimal stubs to prevent errors
	      if (typeof view.on !== 'function') {
	        console.warn('[ViewRenderer] EventEmitter methods not available on view for:', section.href, 'adding stubs');
	        // Add robust EventEmitter stubs to prevent errors
	        view.on = function (...args) {
	          console.debug('[ViewRenderer] view.on stub called with:', args);
	          return view;
	        };
	        view.off = function (...args) {
	          console.debug('[ViewRenderer] view.off stub called with:', args);
	          return view;
	        };
	        view.emit = function (...args) {
	          console.debug('[ViewRenderer] view.emit stub called with:', args);
	          return view;
	        };
	        view.once = function (...args) {
	          console.debug('[ViewRenderer] view.once stub called with:', args);
	          return view;
	        };
	      }
	      return view;
	    }
	    /**
	     * Render a view and optionally attach it to a container
	     * Supports both immediate rendering and offscreen rendering
	     */
	    async renderView(view, options = {}) {
	      try {
	        // Set dimensions if specified
	        if (this.settings.width || this.settings.height) {
	          view.size(this.settings.width, this.settings.height);
	        }
	        // Handle offscreen rendering
	        if (options.offscreen && options.container) {
	          // For offscreen rendering, we need to append the view element to the container
	          options.container.appendChild(view.element);
	          // Load and render the content
	          await view.display(this.request);
	          // Preserve content if requested (for pre-rendering scenarios)
	          if (options.preserveContent) {
	            this.preserveViewContent(view);
	          }
	          return view;
	        }
	        // For regular rendering, the view should be appended to Views collection
	        // by the caller (manager), then display() is called
	        // Load and render the content
	        await view.display(this.request);
	        return view;
	      } catch (error) {
	        console.error('[ViewRenderer] Failed to render view for:', view.section?.href || 'unknown section', error);
	        throw error;
	      }
	    }
	    /**
	     * Preserve view content for later restoration (used in pre-rendering)
	     */
	    preserveViewContent(view) {
	      try {
	        if (view.element && view.element.querySelector('iframe')) {
	          const iframe = view.element.querySelector('iframe');
	          // Store srcdoc attribute if available
	          if (iframe.srcdoc) {
	            view.preservedSrcdoc = iframe.srcdoc;
	          }
	          // Store full document HTML if accessible
	          if (iframe.contentDocument) {
	            view.preservedContent = iframe.contentDocument.documentElement.outerHTML;
	          }
	        }
	      } catch (error) {
	        console.debug('[ViewRenderer] Content preservation failed:', error);
	      }
	    }
	    /**
	     * Update renderer settings
	     */
	    updateSettings(newSettings) {
	      this.settings = (0, core_1.extend)(this.settings, newSettings);
	    }
	    /**
	     * Get current settings
	     */
	    getSettings() {
	      return {
	        ...this.settings
	      };
	    }
	    /**
	     * Create and render a view in one step (for offscreen use)
	     */
	    async createAndRenderView(section, options = {}) {
	      const view = this.createView(section, options);
	      return this.renderView(view, options);
	    }
	    /**
	     * Restore preserved content to a view (for pre-rendered content)
	     */
	    restoreViewContent(view) {
	      try {
	        const iframe = view.element?.querySelector('iframe');
	        if (!iframe) {
	          return false;
	        }
	        // Try to restore from preserved srcdoc
	        const preservedSrcdoc = view.preservedSrcdoc;
	        if (preservedSrcdoc && !iframe.srcdoc) {
	          iframe.srcdoc = preservedSrcdoc;
	          return true;
	        }
	        // Try to restore from preserved full content
	        const preservedContent = view.preservedContent;
	        if (preservedContent && iframe.contentDocument) {
	          iframe.contentDocument.open();
	          iframe.contentDocument.write(preservedContent);
	          iframe.contentDocument.close();
	          return true;
	        }
	        return false;
	      } catch (error) {
	        console.debug('[ViewRenderer] Content restoration failed:', error);
	        return false;
	      }
	    }
	  }
	  viewRenderer.ViewRenderer = ViewRenderer;
	  viewRenderer.default = ViewRenderer;
	  return viewRenderer;
	}

	var hasRequired_default;
	function require_default() {
	  if (hasRequired_default) return _default;
	  hasRequired_default = 1;
	  var __importDefault = _default && _default.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(_default, "__esModule", {
	    value: true
	  });
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const core_1 = requireCore();
	  const scrolltype_1 = __importDefault(requireScrolltype());
	  const mapping_1 = __importDefault(requireMapping());
	  const queue_1 = __importDefault(requireQueue());
	  const stage_1 = __importDefault(requireStage());
	  const views_1 = __importDefault(requireViews());
	  const constants_1 = requireConstants();
	  const view_renderer_1 = requireViewRenderer();
	  class DefaultViewManager {
	    constructor(options) {
	      this.name = 'default';
	      this.rendered = false;
	      this.optsSettings = options.settings;
	      this.View = options.view;
	      this.request = options.request;
	      this.renditionQueue = options.queue;
	      this.q = new queue_1.default(this);
	      this.settings = {
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
	        allowPopups: false,
	        ...(options.settings || {})
	      };
	      (0, core_1.extend)(this.settings, options.settings || {});
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
	        transparency: this.settings.transparency,
	        allowScriptedContent: this.settings.allowScriptedContent,
	        allowPopups: this.settings.allowPopups
	      };
	      this.rendered = false;
	      // Initialize ViewRenderer with consistent settings
	      // Use the actual viewSettings with proper type conversion
	      this.viewRenderer = new view_renderer_1.ViewRenderer({
	        ignoreClass: this.viewSettings.ignoreClass,
	        axis: this.viewSettings.axis,
	        direction: this.settings.direction,
	        width: this.viewSettings.width,
	        height: this.viewSettings.height,
	        layout: this.viewSettings.layout,
	        method: this.viewSettings.method,
	        forceRight: false,
	        allowScriptedContent: this.viewSettings.allowScriptedContent,
	        allowPopups: this.viewSettings.allowPopups,
	        transparency: this.viewSettings.transparency,
	        forceEvenPages: this.viewSettings.forceEvenPages,
	        flow: this.viewSettings.flow
	      }, this.request);
	    }
	    render(element, size) {
	      const tag = element.tagName;
	      if (typeof this.settings.fullsize === 'undefined' && tag && (tag.toLowerCase() == 'body' || tag.toLowerCase() == 'html')) {
	        this.settings.fullsize = true;
	      }
	      if (this.settings.fullsize) {
	        this.settings.overflow = 'visible';
	        this.overflow = this.settings.overflow;
	      }
	      this.settings.size = size;
	      this.settings.rtlScrollType = (0, scrolltype_1.default)();
	      // Save the stage
	      this.stage = new stage_1.default({
	        width: size ? String(size.width) : undefined,
	        height: size ? String(size.height) : undefined,
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
	      this.views = new views_1.default(this.container);
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
	      this.addEventListeners();
	      if (this.layout) {
	        this.updateLayout();
	      }
	      this.rendered = true;
	    }
	    /**
	     * Start pre-rendering all sections from a spine
	     */
	    addEventListeners() {
	      let scroller;
	      window.addEventListener('unload', () => {
	        this.destroy();
	      });
	      if (!this.settings.fullsize) {
	        scroller = this.container;
	      } else {
	        scroller = window;
	      }
	      this._onScroll = this.onScroll.bind(this);
	      scroller.addEventListener('scroll', this._onScroll);
	    }
	    removeEventListeners() {
	      let scroller;
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
	    }
	    onOrientationChange() {
	      if (this.optsSettings.resizeOnOrientationChange) {
	        this.resize();
	      }
	    }
	    onResized() {
	      this.resize();
	    }
	    resize(width, height, epubcfi) {
	      const stageSize = this.stage.size(width, height);
	      // For Safari, wait for orientation to catch up
	      // if the window is a square
	      this.winBounds = (0, core_1.windowBounds)();
	      if (this.orientationTimeout && this.winBounds.width === this.winBounds.height) {
	        // reset the stage size for next resize
	        this._stageSize = undefined;
	        return;
	      }
	      if (this._stageSize && this._stageSize.width === stageSize.width && this._stageSize.height === stageSize.height) {
	        return;
	      }
	      this._stageSize = stageSize;
	      this._bounds = this.bounds();
	      // Update for new views
	      this.viewSettings.width = this._stageSize.width;
	      this.viewSettings.height = this._stageSize.height;
	      this.updateLayout();
	      // Clear views
	      this.clear();
	      this.emit(constants_1.EVENTS.MANAGERS.RESIZED, {
	        width: this._stageSize.width,
	        height: this._stageSize.height
	      }, epubcfi);
	    }
	    createView(section, forceRight = false) {
	      // Update the ViewRenderer settings with current dimensions and settings
	      this.viewRenderer.updateSettings({
	        width: this.viewSettings.width,
	        height: this.viewSettings.height,
	        axis: this.viewSettings.axis,
	        layout: this.viewSettings.layout
	      });
	      return this.viewRenderer.createView(section, {
	        forceRight
	      });
	    }
	    handleNextPrePaginated(forceRight, section, action) {
	      const isPrePaginated = this.layout.name === 'pre-paginated';
	      const hasMultiplePages = this.layout.divisor > 1;
	      if (!isPrePaginated || !hasMultiplePages) {
	        return;
	      }
	      // First page (cover) should stand alone
	      if (forceRight || section.index === 0) {
	        return;
	      }
	      const next = section.next();
	      if (next && !next.properties.includes('page-spread-left')) {
	        return action.call(this, next);
	      }
	    }
	    display(section, target) {
	      const displaying = new core_1.defer();
	      const displayed = displaying.promise;
	      // Check if moving to target is needed
	      if (target === section.href || (0, core_1.isNumber)(target)) {
	        target = undefined;
	      }
	      this.displaySection(section, target, displaying);
	      return displayed;
	    }
	    /**
	     * Original display logic extracted for reuse
	     */
	    displaySection(section, target, displaying) {
	      const deferred = displaying || new core_1.defer();
	      // Check to make sure the section we want isn't already shown
	      const visible = this.views.find(section);
	      // View is already shown, just move to correct location in view
	      if (visible && section && this.layout.name !== 'pre-paginated') {
	        const offset = visible.offset();
	        if (this.settings.direction === 'ltr') {
	          this.scrollTo(offset.left, offset.top, true);
	        } else {
	          const width = visible.width();
	          this.scrollTo(offset.left + width, offset.top, true);
	        }
	        if (target) {
	          const offset = visible.locationOf(target);
	          const width = visible.width();
	          this.moveTo(offset, width);
	        }
	        deferred.resolve(undefined);
	        return;
	      }
	      // Hide all current views
	      this.clear();
	      let forceRight = false;
	      if (this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && section.properties.includes('page-spread-right')) {
	        forceRight = true;
	      }
	      this.add(section, forceRight).then(view => {
	        // Move to correct place within the section, if needed
	        if (target) {
	          const offset = view.locationOf(target);
	          const width = view.width();
	          this.moveTo(offset, width);
	        }
	      }, err => {
	        deferred.reject(err);
	      }).then(() => {
	        return this.handleNextPrePaginated(forceRight, section, this.add);
	      }).then(() => {
	        this.views.show();
	        deferred.resolve(undefined);
	      }).catch(err => {
	        deferred.reject(err);
	      });
	    }
	    afterDisplayed(view) {
	      // Debug info available but commented out to reduce noise
	      // console.debug('[DefaultViewManager] afterDisplayed called for view:', view.section?.href);
	      // Fix: Ensure container scrollWidth can accommodate content width
	      if (view && view.contents) {
	        const contentWidth = view.contents.textWidth();
	        if (contentWidth > this.container.offsetWidth) {
	          // Create/update phantom element to match current chapter's content width
	          let phantomElement = this.container.querySelector('.epub-scroll-phantom');
	          if (!phantomElement) {
	            phantomElement = document.createElement('div');
	            phantomElement.className = 'epub-scroll-phantom';
	            phantomElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            height: 1px;
            pointer-events: none;
            visibility: hidden;
            z-index: -1000;
          `;
	            this.container.appendChild(phantomElement);
	          }
	          // Fix: Ensure phantom width is set correctly and consistently
	          const safeContentWidth = Math.max(contentWidth, this.layout.width);
	          phantomElement.style.width = safeContentWidth + 'px';
	          // Force a reflow to ensure the phantom element takes effect
	          void phantomElement.offsetWidth;
	          // Fix: Ensure view and iframe dimensions are consistent
	          const element = view.element;
	          if (element) {
	            element.style.width = safeContentWidth + 'px';
	            element.style.left = '0px';
	            // Fix: Also resize the iframe inside the view element
	            const iframe = element.querySelector('iframe');
	            if (iframe) {
	              iframe.style.width = safeContentWidth + 'px';
	              // Fix: Ensure iframe positioning is correct for the content
	              iframe.style.left = '0px';
	              iframe.style.position = 'absolute';
	            }
	          }
	          // Fix: Validate that scroll calculations are correct
	          const maxScrollLeft = Math.max(0, this.container.scrollWidth - this.container.offsetWidth);
	          if (this.container.scrollLeft > maxScrollLeft) {
	            console.warn('[DefaultViewManager] afterDisplayed: scroll position exceeds content bounds, adjusting:', this.container.scrollLeft, '->', maxScrollLeft);
	            this.container.scrollLeft = maxScrollLeft;
	          }
	        }
	      }
	      // Delayed re-check: sometimes the iframe/content layout completes slightly
	      // after the view is displayed (especially with spreads). Recompute the
	      // content width shortly after to ensure the phantom element and iframe
	      // sizing reflect the final layout.
	      setTimeout(() => {
	        try {
	          if (!view || !view.contents) return;
	          const newContentWidth = view.contents.textWidth();
	          const phantomElement = this.container.querySelector('.epub-scroll-phantom');
	          const desiredWidth = Math.max(newContentWidth, this.layout.width);
	          if (phantomElement && phantomElement.offsetWidth !== desiredWidth) {
	            phantomElement.style.width = desiredWidth + 'px';
	            // Force reflow
	            void phantomElement.offsetWidth;
	            const element = view.element;
	            if (element) {
	              element.style.width = desiredWidth + 'px';
	              const iframe = element.querySelector('iframe');
	              if (iframe) {
	                iframe.style.width = desiredWidth + 'px';
	              }
	            }
	            // Ensure scrollLeft is within bounds after resizing
	            const maxLeft = Math.max(0, this.container.scrollWidth - this.container.offsetWidth);
	            if (this.container.scrollLeft > maxLeft) {
	              this.container.scrollLeft = maxLeft;
	            }
	          }
	        } catch (e) {
	          console.warn('[DefaultViewManager] delayed afterDisplayed check failed', e);
	        }
	      }, 50);
	      this.emit(constants_1.EVENTS.MANAGERS.ADDED, view);
	    }
	    afterResized(view) {
	      this.emit(constants_1.EVENTS.MANAGERS.RESIZE, view.section);
	    }
	    async add(section, forceRight = false) {
	      const view = this.createView(section, forceRight);
	      this.views.append(view);
	      // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
	      view.onDisplayed = this.afterDisplayed.bind(this);
	      view.onResize = this.afterResized.bind(this);
	      // Check if view has event methods before using them
	      if (typeof view.on === 'function') {
	        view.on(constants_1.EVENTS.VIEWS.AXIS, axis => {
	          this.updateAxis(axis);
	        });
	        view.on(constants_1.EVENTS.VIEWS.WRITING_MODE, mode => {
	          this.updateWritingMode(mode);
	        });
	      } else {
	        console.warn('[DefaultViewManager] view does not have event methods in add():', typeof view.on);
	      }
	      return view.display(this.request).then(() => view);
	    }
	    moveTo(offset, width) {
	      let distX = 0,
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
	    async append(section, forceRight = false) {
	      // Create new view
	      const view = this.createView(section, forceRight);
	      this.views.append(view);
	      view.onDisplayed = this.afterDisplayed.bind(this);
	      view.onResize = this.afterResized.bind(this);
	      // Check if view has event methods before using them
	      if (typeof view.on === 'function') {
	        view.on(constants_1.EVENTS.VIEWS.AXIS, axis => {
	          this.updateAxis(axis);
	        });
	        view.on(constants_1.EVENTS.VIEWS.WRITING_MODE, mode => {
	          this.updateWritingMode(mode);
	        });
	      } else {
	        console.warn('[DefaultViewManager] view does not have event methods in append():', typeof view.on);
	      }
	      return view.display(this.request).then(() => view);
	    }
	    async prepend(section, forceRight = false) {
	      const view = this.createView(section, forceRight);
	      // Check if view has event methods before using them
	      if (typeof view.on === 'function') {
	        view.on(constants_1.EVENTS.VIEWS.RESIZED, bounds => {
	          this.counter(bounds);
	        });
	        view.on(constants_1.EVENTS.VIEWS.AXIS, axis => {
	          this.updateAxis(axis);
	        });
	        view.on(constants_1.EVENTS.VIEWS.WRITING_MODE, mode => {
	          this.updateWritingMode(mode);
	        });
	      } else {
	        console.warn('[DefaultViewManager] view does not have event methods in prepend():', typeof view.on);
	      }
	      this.views.prepend(view);
	      view.onDisplayed = this.afterDisplayed.bind(this);
	      view.onResize = this.afterResized.bind(this);
	      return view.display(this.request).then(() => view);
	    }
	    counter(bounds) {
	      if (this.settings.axis === 'vertical') {
	        this.scrollBy(0, bounds.heightDelta, true);
	      } else {
	        this.scrollBy(bounds.widthDelta, 0, true);
	      }
	    }
	    async next() {
	      if (!this.hasViews()) {
	        return;
	      }
	      // Simple check: if there's no more scrollable content in the current section,
	      // jump to the next section immediately
	      const maxScrollLeft = this.container.scrollWidth - this.container.offsetWidth;
	      const canScrollMore = this.container.scrollLeft < maxScrollLeft;
	      if (!canScrollMore) {
	        // No more content to scroll in current section, go to next section
	        //
	        // IMPORTANT NOTE: Cover pages and other non-linear sections may not have proper
	        // navigation links. The cover page typically has `linear: false` and its
	        // `section.next()` method returns `undefined`. This is correct EPUB behavior -
	        // covers are often standalone and not meant to be part of the sequential
	        // reading experience.
	        //
	        // If you're testing navigation and it seems broken, check if you're starting
	        // from a cover page or other non-linear section. Linear chapters (with
	        // `linear: true`) should have proper navigation links between them.
	        //
	        const currentSection = this.views.last()?.section;
	        const nextSection = currentSection?.next();
	        if (nextSection) {
	          await this.loadNextSection(nextSection);
	          return;
	        }
	      }
	      const section = this.handleScrollForward();
	      if (section) await this.loadNextSection(section);
	    }
	    async prev() {
	      if (!this.hasViews()) return;
	      // Simple check: if we're already at the start of scrollable content,
	      // jump to the previous section immediately
	      const canScrollBack = this.container.scrollLeft > 0;
	      if (!canScrollBack) {
	        // Already at start of current section, go to previous section
	        const prevSection = this.views.first()?.section?.prev();
	        if (prevSection) {
	          await this.loadPrevSection(prevSection);
	          return;
	        } else {
	          return;
	        }
	      }
	      // There is content to scroll back through
	      const section = this.handleScrollBackward();
	      // Check if section exists before trying to load it
	      if (section && section.href) {
	        await this.loadPrevSection(section);
	      }
	    }
	    /* ---------- Helpers ---------- */
	    hasViews() {
	      return this.views && this.views.length > 0;
	    }
	    handleScrollForward() {
	      const {
	        axis,
	        direction,
	        rtlScrollType
	      } = this.settings;
	      if (!this.isPaginated) {
	        return this.views.last()?.section?.next();
	      }
	      if (axis === 'horizontal') {
	        return direction === 'rtl' ? this.scrollForwardRTL(rtlScrollType) : this.scrollForwardLTR();
	      }
	      if (axis === 'vertical') {
	        return this.scrollForwardVertical();
	      }
	      return;
	    }
	    handleScrollBackward() {
	      const {
	        axis,
	        direction,
	        rtlScrollType
	      } = this.settings;
	      if (!this.isPaginated) {
	        return this.views.first()?.section?.prev();
	      }
	      if (axis === 'horizontal') {
	        return direction === 'rtl' ? this.scrollBackwardRTL(rtlScrollType) : this.scrollBackwardLTR();
	      }
	      if (axis === 'vertical') {
	        return this.scrollBackwardVertical();
	      }
	      return;
	    }
	    /* ---------- Directional scroll strategies ---------- */
	    scrollForwardLTR() {
	      const maxScrollLeft = this.container.scrollWidth - this.container.offsetWidth;
	      // Determine a sensible step: prefer layout.pageWidth, fall back to container offsetWidth or layout.delta
	      const step = this.layout.pageWidth && this.layout.pageWidth > 0 ? this.layout.pageWidth : this.container.offsetWidth || this.layout.delta;
	      // If we can still scroll within the current section, do so; otherwise move to next section
	      if (this.container.scrollLeft < maxScrollLeft) {
	        // Don't overshoot the maximum scrollLeft
	        const remaining = Math.max(0, maxScrollLeft - this.container.scrollLeft);
	        const move = Math.min(step, remaining);
	        if (move > 0) {
	          this.scrollBy(move, 0, true);
	          this.rememberScrollPosition();
	          return;
	        }
	      }
	      const nextSection = this.views.last()?.section?.next();
	      return nextSection;
	    }
	    scrollForwardRTL(rtlScrollType) {
	      let left;
	      // Use page-sized steps for RTL as well
	      const step = this.layout.pageWidth && this.layout.pageWidth > 0 ? this.layout.pageWidth : this.container.offsetWidth || this.layout.delta;
	      if (rtlScrollType === 'default') {
	        left = this.container.scrollLeft;
	        if (left > 0) {
	          const move = Math.min(step, left);
	          if (move > 0) {
	            this.scrollBy(move, 0, true);
	            return;
	          }
	        }
	      } else {
	        // non-default RTL (negative scrollLeft) - compute remaining distance
	        left = this.container.scrollLeft - step;
	        const minLeft = this.container.scrollWidth * -1;
	        if (this.container.scrollLeft > minLeft) {
	          // Don't overshoot
	          this.scrollBy(step, 0, true);
	          return;
	        }
	      }
	      return this.views.last()?.section?.next();
	    }
	    scrollForwardVertical() {
	      const top = this.container.scrollTop + this.container.offsetHeight;
	      if (top < this.container.scrollHeight) {
	        this.scrollBy(0, this.layout.height, true);
	        return;
	      }
	      return this.views.last()?.section?.next();
	    }
	    scrollBackwardLTR() {
	      if (this.container.scrollLeft > 0) {
	        const step = this.layout.pageWidth && this.layout.pageWidth > 0 ? this.layout.pageWidth : this.container.offsetWidth || this.layout.delta;
	        const move = Math.min(step, this.container.scrollLeft);
	        this.scrollBy(-move, 0, true);
	        return;
	      }
	      // When at the beginning of the scroll area, move to the previous section if available
	      const firstSection = this.views.first()?.section;
	      if (!firstSection) {
	        return;
	      }
	      const prevSection = firstSection.prev();
	      if (!prevSection) {
	        return;
	      }
	      return prevSection;
	    }
	    scrollBackwardRTL(rtlScrollType) {
	      const step = this.layout.pageWidth && this.layout.pageWidth > 0 ? this.layout.pageWidth : this.container.offsetWidth || this.layout.delta;
	      if (rtlScrollType === 'default') {
	        if (this.container.scrollLeft + this.container.offsetWidth < this.container.scrollWidth) {
	          // Move left by one pagewise step but don't overshoot
	          const remaining = Math.max(0, this.container.scrollWidth - (this.container.scrollLeft + this.container.offsetWidth));
	          const move = Math.min(step, remaining);
	          this.scrollBy(-move, 0, true);
	          return;
	        }
	      } else {
	        if (this.container.scrollLeft < 0) {
	          const move = Math.min(step, Math.abs(this.container.scrollLeft));
	          this.scrollBy(-move, 0, true);
	          return;
	        }
	      }
	      return this.views.first()?.section?.prev();
	    }
	    scrollBackwardVertical() {
	      if (this.container.scrollTop > 0) {
	        this.scrollBy(0, -this.layout.height, true);
	        return;
	      }
	      return this.views.first()?.section?.prev();
	    }
	    /* ---------- Section loading ---------- */
	    async loadNextSection(next) {
	      this.clear();
	      this.updateLayout();
	      const forceRight = this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && next.properties.includes('page-spread-right');
	      await this.append(next, forceRight).then(() => this.handleNextPrePaginated(forceRight, next, this.append), err => err);
	      // Ensure we start at the beginning of the newly loaded section for forward navigation.
	      // This fixes the case where prev() moved to the previous chapter's end and next() should
	      // return to the start of the next chapter but instead lands mid-content due to preserved scroll.
	      if (this.settings.axis === 'horizontal') {
	        if (this.settings.direction === 'rtl' && this.settings.rtlScrollType === 'default') {
	          this.scrollTo(this.container.scrollWidth, 0, true);
	        } else {
	          this.scrollTo(0, 0, true);
	        }
	      }
	      this.views.show();
	    }
	    async loadPrevSection(prev) {
	      // Fix: Validate section before proceeding
	      if (!prev || !prev.href) {
	        console.warn('[DefaultViewManager] loadPrevSection called with invalid section:', prev);
	        return;
	      }
	      this.clear();
	      this.updateLayout();
	      const forceRight = this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && typeof prev.prev() !== 'object';
	      await this.prepend(prev, forceRight).then(async () => {
	        if (this.layout.name === 'pre-paginated' && this.layout.divisor > 1) {
	          const left = prev.prev();
	          if (left) await this.prepend(left);
	        }
	      }, err => {
	        console.error('[DefaultViewManager] Error in loadPrevSection prepend:', err);
	        return err;
	      });
	      // After prepending the previous section, adjust the scroll position
	      // Let adjustScrollAfterPrepend handle all scroll positioning for consistency
	      this.adjustScrollAfterPrepend();
	      this.views.show();
	    }
	    /* ---------- Scroll adjustments ---------- */
	    adjustScrollAfterPrepend() {
	      if (!this.isPaginated || this.settings.axis !== 'horizontal') return;
	      const {
	        rtlScrollType,
	        direction
	      } = this.settings;
	      const containerScrollWidth = this.container.scrollWidth;
	      // Handle scrolling based on direction and whether we're navigating forward or backward
	      // For backward navigation (prev), we need to show the start of the newly added content
	      if (direction === 'rtl') {
	        if (rtlScrollType === 'default') {
	          this.scrollTo(0, 0, true);
	        } else {
	          const targetScrollLeft = containerScrollWidth * -1 + this.layout.delta;
	          this.scrollTo(targetScrollLeft, 0, true);
	        }
	      } else {
	        // For LTR navigation when going backward (prev)
	        // We want to show the beginning of the content (the first page)
	        const targetScrollLeft = 0;
	        this.scrollTo(targetScrollLeft, 0, true);
	      }
	    }
	    rememberScrollPosition() {
	      this.targetScrollLeft = this.container.scrollLeft;
	      setTimeout(() => {
	        if (this.container.scrollLeft !== this.targetScrollLeft) {
	          console.warn('[DefaultViewManager] SCROLL RESET DETECTED!', 'expected=', this.targetScrollLeft, 'actual=', this.container.scrollLeft);
	        }
	      }, 100);
	    }
	    current() {
	      const visible = this.visible();
	      if (visible.length) {
	        // Current is the last visible view
	        return visible[visible.length - 1];
	      }
	      return null;
	    }
	    clear() {
	      try {
	        // Clear called - debug info available in __prerender_trace if needed
	        try {
	          const w = window;
	          if (!Array.isArray(w['__prerender_trace'])) w['__prerender_trace'] = [];
	          w['__prerender_trace'].push('DefaultViewManager.clear');
	        } catch (err) {
	          void err;
	        }
	        // Skip clearing during prerendered attachment
	        // Safe to use 'any' here since we're checking the name first
	        if (this.name === 'prerendering' && this._attaching === true) {
	          return;
	        }
	      } catch {
	        // ignore
	      }
	      // this.q.clear();
	      if (this.views) {
	        try {
	          this.views.hide();
	        } catch (hideError) {
	          console.warn('[DefaultViewManager] error hiding views:', hideError);
	          // Try to hide views individually to isolate the problem
	          const len = this.views.length;
	          for (let i = 0; i < len; i++) {
	            const view = this.views._views[i];
	            if (view && view.displayed && view.hide) {
	              try {
	                view.hide();
	              } catch (individualHideError) {
	                console.warn('[DefaultViewManager] error hiding individual view:', individualHideError);
	              }
	            }
	          }
	        }
	        // Reset scroll position
	        const hasValidScrollPosition = this.container.scrollLeft > 0;
	        const isNavigating = this.views.length > 0;
	        if (!hasValidScrollPosition || !isNavigating) {
	          this.scrollTo(0, 0, true);
	        }
	        this.views.clear();
	      }
	      // Note: Don't remove phantom element here - it should persist across chapters
	      // The phantom element maintains the expanded scrollWidth for the container
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
	      const visible = this.visible();
	      const container = this.container.getBoundingClientRect();
	      // Use container dimensions by default. If fullsize is requested, fall back to window
	      const pageHeight = this.settings.fullsize ? window.innerHeight : container.height;
	      const pageWidth = this.settings.fullsize ? window.innerWidth : container.width;
	      const vertical = this.settings.axis === 'vertical';
	      let offset = 0;
	      const used = 0;
	      if (this.settings.fullsize) {
	        offset = vertical ? window.scrollY : window.scrollX;
	      }
	      const sections = visible.map(view => {
	        const {
	          index,
	          href
	        } = view.section;
	        const position = view.position();
	        const width = view.width();
	        const height = view.height();
	        // Fix: Use actual content width for total page calculation, but container width for viewport calculation
	        let actualWidth = width;
	        if (view.contents && view.contents.textWidth) {
	          const contentWidth = view.contents.textWidth();
	          if (contentWidth > width) {
	            actualWidth = contentWidth;
	          }
	        }
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
	          // Use actual content width for total page count, but container width for viewport pages
	          totalPages = this.layout.count(actualWidth, pageWidth).pages;
	          stopPos = pageWidth; // Use container width, not content width, for page boundaries
	        }
	        let currPage = Math.ceil(startPos / stopPos);
	        let pages = [];
	        let endPage = Math.ceil(endPos / stopPos);
	        // Reverse page counts for horizontal rtl
	        if (this.settings.direction === 'rtl' && !vertical) {
	          const tempStartPage = currPage;
	          currPage = totalPages - endPage;
	          endPage = totalPages - tempStartPage;
	        }
	        pages = [];
	        for (let i = currPage; i <= endPage; i++) {
	          const pg = i + 1;
	          pages.push(pg);
	        }
	        if (this.mapping === undefined) {
	          throw new Error('Mapping is not defined');
	        }
	        const mapping = this.mapping.page(view.contents, view.section.cfiBase, startPos, endPos);
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
	      const visible = this.visible();
	      const container = this.container.getBoundingClientRect();
	      let left = 0;
	      let used = 0;
	      if (this.settings.fullsize) {
	        left = window.scrollX;
	      }
	      const sections = visible.map(view => {
	        const {
	          index,
	          href
	        } = view.section;
	        let offset;
	        const position = view.position();
	        const width = view.width();
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
	        if (this.layout.pageWidth && this.layout.pageWidth > 0) {
	          const maxEnd = start + this.layout.pageWidth;
	          if (end > maxEnd) {
	            end = maxEnd;
	            pageWidth = end - start;
	          }
	        }
	        if (this.mapping === undefined) {
	          throw new Error('Mapping is not defined');
	        }
	        const mapping = this.mapping.page(view.contents, view.section.cfiBase, start, end);
	        // Fix: Use actual scrollable content width for pagination calculation
	        let actualWidth = width;
	        if (view.contents && view.contents.textWidth) {
	          const contentWidth = view.contents.textWidth();
	          if (contentWidth > width) {
	            actualWidth = contentWidth;
	          }
	        }
	        // Calculate total pages using the actual scrollable width
	        // For correct navigation, totalPages should reflect what's actually scrollable
	        let totalPages;
	        const layoutPageWidth = this.layout.pageWidth || this.layout.width;
	        const scrollableWidth = Math.max(this.container.scrollWidth - this.container.offsetWidth + layoutPageWidth, layoutPageWidth);
	        if (this.layout.pageWidth && this.layout.pageWidth > 0) {
	          // Use scrollable width instead of theoretical content width for page calculation
	          totalPages = Math.max(1, Math.ceil(scrollableWidth / this.layout.pageWidth));
	        } else {
	          totalPages = this.layout.count(actualWidth).pages;
	        }
	        let startPage = 0;
	        let endPage = 0;
	        const pages = [];
	        if (this.layout.pageWidth && this.layout.pageWidth > 0) {
	          startPage = Math.floor(start / this.layout.pageWidth);
	          endPage = Math.floor(end / this.layout.pageWidth);
	          // Fix: If we limited the end position to exactly one page width,
	          // endPage should equal startPage to show only one page
	          if (end === start + this.layout.pageWidth) {
	            endPage = startPage;
	          }
	          // start page should not be negative
	          if (startPage < 0) {
	            startPage = 0;
	            endPage = endPage + 1;
	          }
	          // Clamp pages to not exceed totalPages (prevent white pages)
	          startPage = Math.max(0, Math.min(startPage, totalPages - 1));
	          endPage = Math.max(0, Math.min(endPage, totalPages - 1));
	          // Reverse page counts for rtl
	          if (this.settings.direction === 'rtl') {
	            const tempStartPage = startPage;
	            startPage = totalPages - endPage;
	            endPage = totalPages - tempStartPage;
	          }
	          for (let i = startPage + 1; i <= endPage + 1; i++) {
	            const pg = i;
	            if (pg <= totalPages) {
	              // Additional safety check
	              pages.push(pg);
	            }
	          }
	        }
	        // Always return an object to satisfy the type annotation
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
	      const position = view.position();
	      const container = _container || this.bounds();
	      if (this.settings.axis === 'horizontal' && position.right > container.left - offsetPrev && position.left < container.right + offsetNext) {
	        return true;
	      } else if (this.settings.axis === 'vertical' && position.bottom > container.top - offsetPrev && position.top < container.bottom + offsetNext) {
	        return true;
	      }
	      return false;
	    }
	    visible() {
	      const container = this.bounds();
	      const views = this.views.displayed();
	      const viewsLength = views.length;
	      const visible = [];
	      let isVisible;
	      let view;
	      for (let i = 0; i < viewsLength; i++) {
	        view = views[i];
	        isVisible = this.isVisible(view, 0, 0, container);
	        if (isVisible === true) {
	          visible.push(view);
	        }
	      }
	      return visible;
	    }
	    scrollBy(x, y, silent) {
	      const dir = this.settings.direction === 'rtl' ? -1 : 1;
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
	        this.emit(constants_1.EVENTS.MANAGERS.SCROLL, {
	          top: scrollTop,
	          left: scrollLeft
	        });
	        clearTimeout(this.afterScrolled);
	        this.afterScrolled = setTimeout(() => {
	          this.emit(constants_1.EVENTS.MANAGERS.SCROLLED, {
	            top: this.scrollTop,
	            left: this.scrollLeft
	          });
	        }, 20);
	      } else {
	        this.ignore = false;
	      }
	    }
	    bounds() {
	      return this.stage.bounds();
	    }
	    applyLayout(layout) {
	      this.layout = layout;
	      this.updateLayout();
	      if (this.views && this.views.length > 0 && this.layout.name === 'pre-paginated') {
	        const firstView = this.views.first();
	        if (firstView && firstView.section) {
	          this.display(firstView.section);
	        }
	      }
	      // this.manager.layout(this.layout.format);
	    }
	    updateLayout() {
	      try {
	        // Skip updating layout during prerendered attachment
	        // Safe to use type cast here since we're checking the name first
	        if (this.name === 'prerendering' && this._attaching === true) {
	          return;
	        }
	      } catch {
	        // ignore
	      }
	      if (!this.stage) {
	        return;
	      }
	      this._stageSize = this.stage.size();
	      // Prefer the actual container's bounding rect for layout calculations
	      // so page widths/heights match the visible container rather than
	      // falling back to window dimensions.
	      let containerRect;
	      try {
	        containerRect = this.container.getBoundingClientRect();
	      } catch {
	        containerRect = undefined;
	      }
	      const layoutWidth = containerRect && containerRect.width ? containerRect.width : this._stageSize.width;
	      const layoutHeight = containerRect && containerRect.height ? containerRect.height : this._stageSize.height;
	      if (!this.isPaginated) {
	        this.layout.calculate(layoutWidth, layoutHeight);
	      } else {
	        this.layout.calculate(layoutWidth, layoutHeight, this.settings.gap);
	        // Set the look ahead offset for what is visible
	        this.settings.offset = this.layout.delta / this.layout.divisor;
	      }
	      // Set the dimensions for views
	      this.viewSettings.width = this.layout.width;
	      this.viewSettings.height = this.layout.height;
	      this.setLayout(this.layout);
	    }
	    setLayout(layout) {
	      this.viewSettings.layout = layout;
	      this.mapping = new mapping_1.default(
	      // @ts-expect-error this should be fixed at some point
	      layout.props, this.settings.direction, this.settings.axis);
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
	      this.stage?.axis(axis);
	      this.viewSettings.axis = axis;
	      if (this.mapping) {
	        this.mapping = new mapping_1.default(
	        // @ts-expect-error this should be fixed at some point
	        this.layout.props, this.settings.direction, this.settings.axis);
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
	      const isPaginated = flow === 'paginated' || flow === 'auto';
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
	      this.stage?.overflow(this.overflow);
	      this.updateLayout();
	    }
	    getContents() {
	      const contents = [];
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
	      this.stage?.direction(dir);
	      this.viewSettings.direction = dir;
	      this.updateLayout();
	    }
	    isRendered() {
	      return this.rendered;
	    }
	  }
	  //-- Enable binding events to Manager
	  (0, event_emitter_1.default)(DefaultViewManager.prototype);
	  _default.default = DefaultViewManager;
	  return _default;
	}

	var prerendering = {};

	var prerenderer = {};

	var cfiResolver = {};

	var hasRequiredCfiResolver;
	function requireCfiResolver() {
	  if (hasRequiredCfiResolver) return cfiResolver;
	  hasRequiredCfiResolver = 1;
	  Object.defineProperty(cfiResolver, "__esModule", {
	    value: true
	  });
	  cfiResolver.CfiResolver = void 0;
	  class CfiResolver {
	    async resolveForElement(doc, section, el) {
	      if (!el || !section.cfiFrom) return {
	        cfi: undefined
	      };
	      const targets = [this.descendantTextNodeTarget(doc, el), this.elementTarget(el), this.elementRangeTarget(doc, el), this.previousTextNodeTarget(doc, el)];
	      for (const target of targets) {
	        if (!target) continue;
	        const cfi = this.safeCfiPoint(section, target);
	        if (cfi) return {
	          cfi
	        };
	      }
	      return {
	        cfi: this.createApproximateCfi(doc, el, section) ?? undefined
	      };
	    }
	    safeCfiPoint(section, target) {
	      try {
	        let cfi = section.cfiFrom?.(target) || null;
	        if (!cfi) return null;
	        // Normalize: only keep the "point" part of a range
	        const commaIndex = cfi.indexOf(',');
	        if (commaIndex !== -1) {
	          cfi = cfi.slice(0, commaIndex) + ')';
	        }
	        return cfi;
	      } catch {
	        return null;
	      }
	    }
	    // ---- Strategy extractors ----
	    descendantTextNodeTarget(doc, el) {
	      const txt = this.findFirstTextNode(doc, el);
	      if (!txt) return null;
	      const range = doc.createRange();
	      range.setStart(txt, 0);
	      range.setEnd(txt, 0);
	      return range;
	    }
	    elementTarget(el) {
	      return el;
	    }
	    elementRangeTarget(doc, el) {
	      const range = doc.createRange();
	      range.selectNode(el);
	      return range;
	    }
	    previousTextNodeTarget(doc, el) {
	      const txt = this.findPreviousTextNode(doc, el);
	      if (!txt) return null;
	      const range = doc.createRange();
	      range.setStart(txt, 0);
	      range.setEnd(txt, 0);
	      return range;
	    }
	    // ---- Approximation ----
	    createApproximateCfi(doc, el, section) {
	      if (!section.cfiBase) return null;
	      const path = [];
	      let cur = el;
	      while (cur && cur !== doc.documentElement && cur !== doc.body) {
	        const parent = cur.parentNode;
	        if (!parent) break;
	        const index = Array.prototype.indexOf.call(parent.childNodes, cur);
	        if (index !== -1) path.unshift(index);
	        cur = parent;
	      }
	      return `${section.cfiBase}!/approx(${path.join('.')})`;
	    }
	    // ---- Helpers (TreeWalker only) ----
	    findFirstTextNode(doc, el) {
	      const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
	        acceptNode(node) {
	          return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	        }
	      });
	      return walker.nextNode();
	    }
	    findPreviousTextNode(doc, el) {
	      // Create a walker starting at the document root
	      const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
	        acceptNode(node) {
	          return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	        }
	      });
	      let prev = null;
	      let node = walker.nextNode();
	      while (node) {
	        if (node === el) break;
	        prev = node;
	        node = walker.nextNode();
	      }
	      return prev;
	    }
	  }
	  cfiResolver.CfiResolver = CfiResolver;
	  return cfiResolver;
	}

	var pageMapGenerator = {};

	var hasRequiredPageMapGenerator;
	function requirePageMapGenerator() {
	  if (hasRequiredPageMapGenerator) return pageMapGenerator;
	  hasRequiredPageMapGenerator = 1;
	  Object.defineProperty(pageMapGenerator, "__esModule", {
	    value: true
	  });
	  pageMapGenerator.PageMapGenerator = void 0;
	  const cfi_resolver_1 = requireCfiResolver();
	  class PageMapGenerator {
	    constructor(cfiResolver) {
	      this.cfiResolver = cfiResolver || new cfi_resolver_1.CfiResolver();
	    }
	    /**
	     * Helper to detect and warn about redundant range CFIs
	     */
	    validateCfi(cfi, context) {
	      if (!cfi) return;
	      // Check for redundant range CFI pattern
	      const match = cfi.match(/^epubcfi\(([^!]+)!([^,]+),([^,]+),([^,)]+)\)$/);
	      if (match) {
	        const [,, part1, part2, part3] = match;
	        if (part1 === part2 && part2 === part3) {
	          console.warn(`[PageMapGenerator] Redundant range CFI detected in ${context}:`, cfi, 'Consider generating point CFI instead.');
	        }
	      }
	    }
	    /**
	     * Generate a simple page map directly from a rendered view
	     */
	    async generatePageMap(view, section, viewportWidth, viewportHeight) {
	      if (!view.contents?.document?.body) {
	        return this.createMinimalPageMap(section);
	      }
	      const doc = view.contents.document;
	      const body = doc.body;
	      // Simple page count calculation
	      const pageCount = this.calculatePageCount(body, viewportWidth, viewportHeight);
	      // Generate basic page map
	      const pageMap = await this.createBasicPageMap(doc, section, pageCount, viewportWidth);
	      return {
	        pageCount,
	        pageMap,
	        hasWhitePages: false,
	        whitePageIndices: []
	      };
	    }
	    /**
	     * Create minimal page map for empty content
	     */
	    createMinimalPageMap(section) {
	      return {
	        pageCount: 1,
	        pageMap: [{
	          index: 1,
	          startCfi: section.cfiBase || null,
	          endCfi: null,
	          xOffset: 0
	        }],
	        hasWhitePages: false,
	        whitePageIndices: []
	      };
	    }
	    /**
	     * Simple page count calculation
	     */
	    calculatePageCount(body, viewportWidth, viewportHeight) {
	      const scrollWidth = body.scrollWidth || 0;
	      const scrollHeight = body.scrollHeight || 0;
	      // If content is wider than viewport, it's paginated
	      if (scrollWidth > viewportWidth * 1.1) {
	        return Math.max(1, Math.ceil(scrollWidth / viewportWidth));
	      }
	      // Otherwise it's scrolled
	      return Math.max(1, Math.ceil(scrollHeight / viewportHeight));
	    }
	    /**
	     * Create basic page map with CFIs
	     */
	    async createBasicPageMap(doc, section, pageCount, viewportWidth) {
	      const pageMap = [];
	      for (let i = 0; i < pageCount; i++) {
	        const xOffset = i * viewportWidth;
	        // Generate start CFI using robust element selection
	        let startCfi = null;
	        let endCfi = null;
	        try {
	          const startElement = this.findFirstVisibleElement(doc, xOffset, viewportWidth);
	          if (startElement) {
	            const cfiResult = await this.cfiResolver.resolveForElement(doc, section, startElement);
	            startCfi = cfiResult.cfi || null;
	            // Validate CFI format and warn about redundant ranges
	            this.validateCfi(startCfi, `page ${i + 1} of ${section.href}`);
	          }
	          // Generate end CFI for page boundary
	          if (i < pageCount - 1) {
	            // For non-last pages, find the last element in the current page region
	            const endElement = this.findLastVisibleElement(doc, xOffset, viewportWidth);
	            if (endElement) {
	              const endCfiResult = await this.cfiResolver.resolveForElement(doc, section, endElement);
	              endCfi = endCfiResult.cfi || null;
	            }
	          } else {
	            // For the last page, find the last element in the entire chapter
	            const lastElement = this.findLastElementInChapter(doc);
	            if (lastElement) {
	              const endCfiResult = await this.cfiResolver.resolveForElement(doc, section, lastElement);
	              endCfi = endCfiResult.cfi || null;
	            }
	          }
	        } catch (error) {
	          console.debug('CFI generation failed:', error);
	        }
	        // Fallback to section base CFI for first page
	        if (!startCfi && i === 0) {
	          const baseCfi = section.cfiBase;
	          if (baseCfi) {
	            // Ensure the CFI has the proper epubcfi( prefix
	            startCfi = baseCfi.startsWith('epubcfi(') ? baseCfi : `epubcfi(${baseCfi})`;
	          }
	        }
	        pageMap.push({
	          index: i + 1,
	          startCfi,
	          endCfi,
	          xOffset,
	          yOffset: 0
	        });
	      }
	      return pageMap;
	    }
	    /**
	     * Find first visible element using robust DOM traversal
	     * Avoids hardcoded tag names which may be localized or custom
	     */
	    findFirstVisibleElement(doc, xOffset, viewportWidth) {
	      try {
	        const body = doc.body;
	        if (!body) return null;
	        // Use TreeWalker to find all elements with text content
	        const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
	          acceptNode: node => {
	            const element = node;
	            // Skip invisible elements
	            if (element.offsetWidth === 0 && element.offsetHeight === 0) {
	              return NodeFilter.FILTER_REJECT;
	            }
	            // Skip script, style, meta elements
	            const nodeName = element.nodeName.toLowerCase();
	            if (['script', 'style', 'meta', 'link', 'noscript'].includes(nodeName)) {
	              return NodeFilter.FILTER_REJECT;
	            }
	            // Accept elements with text content
	            const hasText = (element.textContent?.trim().length || 0) > 0;
	            return hasText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	          }
	        });
	        // Find element in the specified horizontal region
	        let currentElement = walker.nextNode();
	        while (currentElement) {
	          const rect = currentElement.getBoundingClientRect();
	          // Check if element is within the page region
	          if (rect.left >= xOffset && rect.left < xOffset + viewportWidth) {
	            return currentElement;
	          }
	          currentElement = walker.nextNode();
	        }
	        // Fallback: return first element with text
	        walker.currentNode = body;
	        return walker.nextNode();
	      } catch (error) {
	        console.debug('Error finding visible element:', error);
	        return null;
	      }
	    }
	    /**
	     * Find last visible element in a page region for end CFI generation
	     */
	    findLastVisibleElement(doc, xOffset, viewportWidth) {
	      try {
	        const body = doc.body;
	        if (!body) return null;
	        // Use TreeWalker to find all elements with text content
	        const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
	          acceptNode: node => {
	            const element = node;
	            // Skip invisible elements
	            if (element.offsetWidth === 0 && element.offsetHeight === 0) {
	              return NodeFilter.FILTER_REJECT;
	            }
	            // Skip script, style, meta elements
	            const nodeName = element.nodeName.toLowerCase();
	            if (['script', 'style', 'meta', 'link', 'noscript'].includes(nodeName)) {
	              return NodeFilter.FILTER_REJECT;
	            }
	            // Accept elements with text content
	            const hasText = (element.textContent?.trim().length || 0) > 0;
	            return hasText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	          }
	        });
	        // Find all elements in the specified horizontal region and return the last one
	        let lastElement = null;
	        let currentElement = walker.nextNode();
	        while (currentElement) {
	          const rect = currentElement.getBoundingClientRect();
	          // Check if element is within the page region
	          if (rect.left >= xOffset && rect.left < xOffset + viewportWidth) {
	            lastElement = currentElement;
	          }
	          currentElement = walker.nextNode();
	        }
	        return lastElement;
	      } catch (error) {
	        console.debug('Error finding last visible element:', error);
	        return null;
	      }
	    }
	    /**
	     * Find the last element with text content in the entire chapter
	     */
	    findLastElementInChapter(doc) {
	      try {
	        const body = doc.body;
	        if (!body) return null;
	        // Use TreeWalker to find all elements with text content
	        const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
	          acceptNode: node => {
	            const element = node;
	            // Skip invisible elements
	            if (element.offsetWidth === 0 && element.offsetHeight === 0) {
	              return NodeFilter.FILTER_REJECT;
	            }
	            // Skip script, style, meta elements
	            const nodeName = element.nodeName.toLowerCase();
	            if (['script', 'style', 'meta', 'link', 'noscript'].includes(nodeName)) {
	              return NodeFilter.FILTER_REJECT;
	            }
	            // Accept elements with text content
	            const hasText = (element.textContent?.trim().length || 0) > 0;
	            return hasText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	          }
	        });
	        // Find the last element with text content in the entire chapter
	        let lastElement = null;
	        let currentElement = walker.nextNode();
	        while (currentElement) {
	          lastElement = currentElement;
	          currentElement = walker.nextNode();
	        }
	        return lastElement;
	      } catch (error) {
	        console.debug('Error finding last element in chapter:', error);
	        return null;
	      }
	    }
	  }
	  pageMapGenerator.PageMapGenerator = PageMapGenerator;
	  return pageMapGenerator;
	}

	var hasRequiredPrerenderer;
	function requirePrerenderer() {
	  if (hasRequiredPrerenderer) return prerenderer;
	  hasRequiredPrerenderer = 1;
	  var __importDefault = prerenderer && prerenderer.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(prerenderer, "__esModule", {
	    value: true
	  });
	  prerenderer.BookPreRenderer = void 0;
	  const core_1 = requireCore();
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const constants_1 = requireConstants();
	  const view_renderer_1 = requireViewRenderer();
	  const contents_1 = __importDefault(requireContents());
	  const cfi_resolver_1 = requireCfiResolver();
	  const page_map_generator_1 = requirePageMapGenerator();
	  class BookPreRenderer {
	    /*
	     * CRITICAL BROWSER BEHAVIOR WARNING - IFRAME CONTENT LOSS ON DOM MOVES:
	     *
	     * WHY WE MUST USE IFRAMES (SECURITY REQUIREMENT):
	     * EPUBs are untrusted content that can contain arbitrary JavaScript, CSS, and HTML.
	     * Without iframe sandboxing, malicious EPUB content could:
	     * - Execute scripts in the main document context and steal user data
	     * - Access or modify the reader application's DOM and functionality
	     * - Perform XSS attacks or redirect users to malicious sites
	     * - Override global JavaScript objects and break the reader
	     * - Access localStorage, cookies, and other sensitive browser APIs
	     *
	     * Iframes with sandbox attributes provide ESSENTIAL security isolation by:
	     * - Running EPUB content in a separate, restricted browsing context
	     * - Preventing access to the parent document's DOM and globals
	     * - Limiting script execution and API access via sandbox policies
	     * - Blocking potentially dangerous operations like form submission and popups
	     *
	     * HOWEVER, this security necessity creates a technical challenge because:
	     *
	     * When an iframe element is moved between different DOM containers using methods like:
	     * - appendChild()
	     * - insertBefore()
	     * - removeChild() followed by appendChild()
	     *
	     * The browser will COMPLETELY RESET the iframe's content document, causing:
	     * - iframe.contentDocument to become a fresh, empty document
	     * - All rendered content (HTML, CSS, JavaScript state) to be lost
	     * - iframe.srcdoc content to be cleared
	     * - Any event listeners attached to the iframe content to be removed
	     *
	     * This behavior is consistent across all major browsers (Chrome, Firefox, Safari, Edge)
	     * and is part of the HTML specification for iframe security and lifecycle management.
	     *
	     * IMPACT ON PRERENDERING:
	     * Our prerendering system creates iframes with fully rendered EPUB content to provide:
	     * - Instant page display (no loading delays)
	     * - Accurate page counts for pagination and navigation
	     * - Pre-calculated layout metrics and content dimensions
	     * - Ability to inspect and analyze content before display
	     * - Smooth navigation between chapters without rendering delays
	     * - Precise CFI (Canonical Fragment Identifier) calculation for page boundaries
	     *   to enable accurate navigation and fix "page off" jump issues
	     *
	     * However, when prerendered content needs to be displayed, it must be moved from
	     * offscreen containers to the main viewing container. Each DOM move causes complete
	     * content loss, requiring:
	     *
	     * 1. Content preservation before DOM moves (saving srcdoc/innerHTML)
	     * 2. Content restoration after DOM moves (re-setting srcdoc or using document.write)
	     * 3. Fallback mechanisms when restoration fails
	     *
	     * THIS APPROACH DEFEATS THE PURPOSE OF PRERENDERING because:
	     * - Content must be re-rendered/reloaded, eliminating performance benefits
	     * - Page layout calculations may need to be repeated
	     * - CFI calculations become unreliable or need to be recalculated
	     * - Loading delays are reintroduced during content restoration
	     * - The "instant display" benefit is lost
	     * - Restoration can fail, causing white pages or missing content
	     *
	     * ARCHITECTURAL ALTERNATIVES TO CONSIDER:
	     * The current approach is fundamentally flawed. Better solutions would:
	     *
	     * 1. **CSS Positioning Approach**: Keep iframes in fixed containers and use CSS
	     *    positioning/visibility for display (preserves all prerendering benefits)
	     * 2. **Stable Container Strategy**: Never move iframes, only show/hide them in place
	     * 3. **Content Cloning**: Create new iframes with cloned content instead of moving
	     * 4. **Virtual Container System**: Use a container management system that doesn't
	     *    require physical DOM moves
	     * 5. **Layered Rendering**: Use CSS transforms/layers to bring content into view
	     *    without DOM manipulation
	     *
	     * Any solution that avoids moving iframe elements would:
	     * - Preserve the instant display benefits of prerendering
	     * - Maintain accurate page counts and layout calculations
	     * - Keep CFI calculations valid and enable precise page navigation
	     * - Eliminate content restoration complexity and failure points
	     * - Provide truly smooth navigation between chapters
	     * - Keep the performance advantages that justify prerendering
	     * - Enable advanced features like accurate bookmarking and progress tracking
	     *
	     * The current implementation attempts to work around this limitation through content
	     * preservation and restoration, but this is inherently fragile and can fail in
	     * edge cases, leading to white/empty pages that users may experience.
	     */
	    constructor(container, viewSettings, request) {
	      this._completeEmitted = false;
	      // this.container = container;
	      this.viewSettings = viewSettings;
	      this.chapters = new Map();
	      this.renderingPromises = new Map();
	      this.request = request;
	      // Initialize ViewRenderer with the same settings
	      this.viewRenderer = new view_renderer_1.ViewRenderer({
	        ignoreClass: viewSettings.ignoreClass || '',
	        axis: viewSettings.axis,
	        direction: viewSettings.direction,
	        width: viewSettings.width,
	        height: viewSettings.height,
	        layout: viewSettings.layout,
	        method: viewSettings.method,
	        forceRight: viewSettings.forceRight || false,
	        allowScriptedContent: viewSettings.allowScriptedContent || false,
	        allowPopups: viewSettings.allowPopups || false,
	        transparency: viewSettings.transparency,
	        forceEvenPages: viewSettings.forceEvenPages,
	        flow: viewSettings.flow
	      }, request);
	      // Initialize helpers
	      const cfiResolver = new cfi_resolver_1.CfiResolver();
	      this.pageMapGenerator = new page_map_generator_1.PageMapGenerator(cfiResolver);
	      // Create unattached storage for long-term prerendered content
	      this.unattachedStorage = document.createDocumentFragment();
	      this.currentStatus = {
	        total: 0,
	        rendered: 0,
	        failed: 0,
	        chapters: this.chapters
	      };
	      this.offscreenContainer = document.createElement('div');
	      this.offscreenContainer.style.position = 'absolute';
	      this.offscreenContainer.style.top = '-9999px';
	      this.offscreenContainer.style.left = '-9999px';
	      this.offscreenContainer.style.width = viewSettings.width + 'px';
	      this.offscreenContainer.style.height = viewSettings.height + 'px';
	      this.offscreenContainer.style.overflow = 'hidden';
	      this.offscreenContainer.style.visibility = 'hidden';
	      document.body.appendChild(this.offscreenContainer);
	    }
	    async preRenderBook(sections) {
	      this.currentStatus = {
	        total: sections.length,
	        rendered: 0,
	        failed: 0,
	        chapters: this.chapters
	      };
	      const BATCH_SIZE = 3;
	      for (let i = 0; i < sections.length; i += BATCH_SIZE) {
	        const batch = sections.slice(i, i + BATCH_SIZE);
	        await Promise.allSettled(batch.map(async section => {
	          try {
	            await this.preRenderSection(section);
	            // After a section is prerendered, recompute global page numbers so
	            // each chapter.pageMap.pageNumber reflects its position in the book
	            // using the order of `sections`. This uses already-rendered chapters
	            // (those present in this.chapters) and is safe to call multiple times.
	            try {
	              this.assignGlobalPageNumbers(sections);
	            } catch (e) {
	              console.debug('[BookPreRenderer] assignGlobalPageNumbers failed:', e);
	            }
	            this.currentStatus.rendered++;
	            this.emit('added', this.currentStatus);
	          } catch (error) {
	            this.currentStatus.failed++;
	            console.error('[BookPreRenderer] failed to pre-render:', section.href, error);
	          }
	        }));
	      }
	      if (!this._completeEmitted) {
	        this._completeEmitted = true;
	        this.emit('complete', this.currentStatus);
	      }
	      return this.currentStatus;
	    }
	    // Public methods for chapter access
	    getChapter(sectionHref) {
	      return this.chapters.get(sectionHref);
	    }
	    getAllChapters() {
	      return Array.from(this.chapters.values());
	    }
	    getStatus() {
	      return this.currentStatus;
	    }
	    getDebugInfo() {
	      const chapters = Array.from(this.chapters.entries()).map(([href, chapter]) => ({
	        href,
	        attached: chapter.attached,
	        ...{
	          width: chapter.width,
	          height: chapter.height
	        },
	        pageCount: chapter.pageCount,
	        hasWhitePages: chapter.hasWhitePages,
	        whitePageIndices: chapter.whitePageIndices
	      }));
	      return {
	        totalChapters: this.chapters.size,
	        renderingInProgress: this.renderingPromises.size,
	        chapters
	      };
	    }
	    async preRenderSection(section) {
	      const href = section.href;
	      if (this.chapters.has(href)) {
	        return this.chapters.get(href);
	      }
	      if (this.renderingPromises.has(href)) {
	        await this.renderingPromises.get(href);
	        return this.chapters.get(href);
	      }
	      const rendering = new core_1.defer();
	      const view = this.createView(section);
	      const chapter = {
	        section,
	        view,
	        element: view.element,
	        rendered: rendering,
	        attached: false,
	        width: this.viewSettings.width,
	        height: this.viewSettings.height,
	        pageCount: 0,
	        hasWhitePages: false,
	        whitePageIndices: []
	      };
	      // Prepare a per-chapter deferred that resolves when pageNumbers are assigned
	      const pageNumbersDeferred = new core_1.defer();
	      chapter.pageNumbersDeferred = pageNumbersDeferred;
	      chapter.pageNumbersAssigned = pageNumbersDeferred.promise;
	      this.chapters.set(href, chapter);
	      const renderPromise = this.renderView(view, chapter).then(renderedView => {
	        rendering.resolve(renderedView);
	        return chapter;
	      }).catch(error => {
	        console.error('[BookPreRenderer] renderView failed for:', href, error);
	        rendering.reject(error);
	        throw error;
	      });
	      this.renderingPromises.set(href, renderPromise);
	      try {
	        await renderPromise;
	        this.renderingPromises.delete(href);
	        return chapter;
	      } catch (error) {
	        console.error('[BookPreRenderer] preRenderSection failed for:', href, error);
	        this.renderingPromises.delete(href);
	        this.chapters.delete(href);
	        throw error;
	      }
	    }
	    createView(section) {
	      const view = this.viewRenderer.createView(section);
	      // Set up minimal event handlers
	      view.onDisplayed = () => {};
	      view.onResize = () => {};
	      // Ensure the view is sized to match the target container dimensions
	      // This is critical for consistent layout between pre-rendering and display
	      view.size(this.viewSettings.width, this.viewSettings.height);
	      return view;
	    }
	    /**
	     * Wait for layout to settle before querying element positions
	     */
	    async waitForLayout(doc, ticks = 2) {
	      return new Promise(resolve => {
	        try {
	          const win = doc.defaultView;
	          if (!win) return resolve();
	          let count = 0;
	          const step = () => {
	            count += 1;
	            if (count >= ticks) return resolve();
	            win.requestAnimationFrame(step);
	          };
	          win.requestAnimationFrame(step);
	        } catch {
	          resolve();
	        }
	      });
	    }
	    /**
	     * Simple content analysis using PageMapGenerator
	     */
	    async performAsyncContentAnalysis(chapter, view) {
	      try {
	        // Use the simple PageMapGenerator
	        const result = await this.pageMapGenerator.generatePageMap(view, chapter.section, this.viewSettings.width, this.viewSettings.height);
	        return {
	          pageCount: result.pageCount,
	          pageMap: result.pageMap,
	          hasWhitePages: result.hasWhitePages,
	          whitePageIndices: result.whitePageIndices
	        };
	      } catch (error) {
	        console.error('[BookPreRenderer] Content analysis failed:', chapter.section.href, error);
	        return {
	          pageCount: 1,
	          pageMap: [{
	            index: 1,
	            startCfi: chapter.section.cfiBase || null,
	            endCfi: null,
	            xOffset: 0
	          }],
	          hasWhitePages: false,
	          whitePageIndices: []
	        };
	      }
	    }
	    async renderView(view, chapter) {
	      const href = chapter.section.href;
	      try {
	        // Attach to offscreen container for rendering
	        this.offscreenContainer.appendChild(chapter.element);
	        // Render the view
	        const renderedView = await view.display(this.request);
	        // Measure content dimensions after rendering
	        if (view.contents && view.contents.textWidth) {
	          chapter.width = view.contents.textWidth();
	        } else {
	          chapter.width = this.viewSettings.width;
	        }
	        chapter.height = this.viewSettings.height;
	        // Wait for layout to settle before analyzing content
	        if (view.contents?.document) {
	          await this.waitForLayout(view.contents.document, 3);
	        }
	        // Analyze content with better error handling
	        const analysisResult = await this.performAsyncContentAnalysis(chapter, view);
	        // Update chapter with analysis results
	        chapter.pageCount = analysisResult.pageCount;
	        chapter.pageMap = analysisResult.pageMap;
	        chapter.hasWhitePages = analysisResult.hasWhitePages;
	        chapter.whitePageIndices = analysisResult.whitePageIndices;
	        // Ensure preservation waits for iframe readiness before reading document
	        await this.preserveChapterContent(chapter);
	        // Move to unattached storage
	        if (chapter.element.parentNode === this.offscreenContainer) {
	          this.offscreenContainer.removeChild(chapter.element);
	        }
	        this.unattachedStorage.appendChild(chapter.element);
	        return renderedView;
	      } catch (error) {
	        console.error('[BookPreRenderer] renderView FAILED for:', href, error);
	        if (chapter.element.parentNode === this.offscreenContainer) {
	          this.offscreenContainer.removeChild(chapter.element);
	        }
	        throw error;
	      }
	    }
	    /**
	     * Enhanced content preservation for reliable iframe restoration
	     */
	    async preserveChapterContent(chapter) {
	      const iframe = chapter.element.querySelector('iframe');
	      if (!iframe) return;
	      // Helper: wait for iframe to report readyState 'complete' or for load event
	      const waitForIframeReady = (frame, timeout = 1000) => new Promise(resolve => {
	        try {
	          const doc = frame.contentDocument;
	          if (doc && doc.readyState === 'complete') return resolve(true);
	          let settled = false;
	          const onLoad = () => {
	            if (settled) return;
	            settled = true;
	            cleanup();
	            resolve(true);
	          };
	          const cleanup = () => {
	            try {
	              frame.removeEventListener('load', onLoad);
	            } catch {
	              // Ignore errors
	            }
	            if (timer) clearTimeout(timer);
	          };
	          frame.addEventListener('load', onLoad);
	          // Poll readyState as a fallback for cases where load isn't fired
	          const interval = 50;
	          let elapsed = 0;
	          const poll = () => {
	            try {
	              const d = frame.contentDocument;
	              if (d && d.readyState === 'complete') {
	                if (!settled) {
	                  settled = true;
	                  cleanup();
	                  return resolve(true);
	                }
	              }
	            } catch {
	              // ignore cross-origin access errors
	            }
	            elapsed += interval;
	            if (elapsed >= timeout) {
	              if (!settled) {
	                settled = true;
	                cleanup();
	                return resolve(false);
	              }
	            } else {
	              timer = setTimeout(poll, interval);
	            }
	          };
	          let timer = setTimeout(poll, interval);
	        } catch {
	          return resolve(false);
	        }
	      });
	      try {
	        // Preserve srcdoc attribute immediately where available
	        chapter.preservedSrcdoc = iframe.srcdoc;
	        // Wait briefly for iframe document to become available/complete before reading
	        const ready = await waitForIframeReady(iframe, 1000);
	        if (ready && iframe.contentDocument?.documentElement) {
	          // Reading may fail for cross-origin or other reasons — let outer try handle it
	          chapter.preservedContent = iframe.contentDocument.documentElement.outerHTML;
	        }
	      } catch {
	        // Only catch actual errors preserving iframe content
	        console.error('Failed to preserve iframe content');
	      }
	    }
	    /**
	     * Restore iframe content after DOM moves
	     */
	    restoreChapterContent(chapter) {
	      const iframe = chapter.element.querySelector('iframe');
	      if (!iframe) return false;
	      try {
	        const textContent = iframe.contentDocument?.body?.textContent?.trim() || '';
	        const htmlContent = iframe.contentDocument?.body?.innerHTML?.trim() || '';
	        const isReady = iframe.contentDocument?.readyState === 'complete';
	        // Check if content is missing
	        const hasValidContent = isReady && (textContent.length > 0 || htmlContent.length > 0);
	        if (!hasValidContent && (chapter.preservedSrcdoc || chapter.preservedContent)) {
	          console.debug('[BookPreRenderer] restoring iframe content for:', chapter.section.href);
	          if (chapter.preservedSrcdoc) {
	            // Use preserved srcdoc (already ensured to contain marker during preservation)
	            const markedContent = chapter.preservedSrcdoc;
	            iframe.srcdoc = markedContent;
	            // Force reload to ensure content is properly set
	            iframe.src = 'about:blank';
	            setTimeout(() => {
	              iframe.removeAttribute('src');
	              iframe.srcdoc = markedContent;
	            }, 0);
	          } else if (chapter.preservedContent) {
	            // Fallback: use document.write method
	            if (iframe.contentDocument) {
	              iframe.contentDocument.open();
	              // preservedContent was normalized during preserve to include marker
	              iframe.contentDocument.write(chapter.preservedContent);
	              iframe.contentDocument.close();
	            }
	          }
	          return true;
	        }
	        return false;
	      } catch (e) {
	        console.warn('[BookPreRenderer] error restoring iframe content:', e);
	        return false;
	      }
	    }
	    /**
	     * Public helper to attempt restore for a chapter by href and validate result
	     * Returns true if content is present after restore, false otherwise
	     */
	    async tryRestoreContent(sectionHref) {
	      const chapter = this.chapters.get(sectionHref);
	      if (!chapter) return false;
	      try {
	        const restored = this.restoreChapterContent(chapter);
	        // Validate iframe content after waiting a short while for loads
	        const iframe = chapter.element.querySelector('iframe');
	        let hasValidContent = false;
	        try {
	          if (iframe && iframe.contentDocument) {
	            const body = iframe.contentDocument.body;
	            const txt = body ? (body.textContent || '').trim() : '';
	            const html = body ? (body.innerHTML || '').trim() : '';
	            const isReady = iframe.contentDocument.readyState === 'complete';
	            hasValidContent = isReady && (txt.length > 0 || html.length > 0 || chapter.hasWhitePages);
	          }
	        } catch (e) {
	          console.debug('[BookPreRenderer] tryRestoreContent: cannot access iframe content due to cross-origin or other error', e);
	          hasValidContent = false;
	        }
	        return hasValidContent || restored;
	      } catch (e) {
	        console.warn('[BookPreRenderer] tryRestoreContent failed for', sectionHref, e);
	        return false;
	      }
	    }
	    /**
	     * Returns a promise that resolves when page numbering (pageNumber on pageMap)
	     * has been assigned for the given section href. Returns null if chapter is
	     * not known.
	     */
	    getPageNumbering(sectionHref) {
	      const chapter = this.chapters.get(sectionHref);
	      if (!chapter) return null;
	      if (!chapter.pageNumbersAssigned) return null;
	      return chapter.pageNumbersAssigned;
	    }
	    attachChapter(sectionHref) {
	      const chapter = this.chapters.get(sectionHref);
	      if (!chapter) return null;
	      // If chapter is still being rendered, return null (let caller retry)
	      if (this.renderingPromises.has(sectionHref)) return null;
	      if (chapter.attached) {
	        // Validate that the iframe still has content - sometimes iframe content gets cleared
	        // especially with sandboxing or when elements are moved between containers
	        try {
	          const iframe = chapter.element.querySelector('iframe');
	          if (iframe && iframe.contentDocument) {
	            const body = iframe.contentDocument.body;
	            const hasTextContent = body && (body.textContent || '').trim().length > 0;
	            const hasHtmlStructure = body && (body.innerHTML || '').trim().length > 0;
	            const isReady = iframe.contentDocument.readyState === 'complete';
	            // Accept content if it has either text content OR HTML structure AND is ready
	            // For white pages, be more lenient as they naturally have minimal content
	            const isWhitePage = chapter.hasWhitePages;
	            const hasValidContent = isReady && (hasTextContent || hasHtmlStructure || isWhitePage && body);
	            if (hasValidContent) {
	              return chapter;
	            }
	          }
	        } catch (e) {
	          console.warn('[BookPreRenderer] error validating attached chapter content:', sectionHref, e);
	        }
	      }
	      try {
	        // In spread/pre-paginated mode, we can have up to 2 chapters attached (left + right pages)
	        // For non-spread mode, ensure only one chapter is attached at a time
	        const attachedChapters = Array.from(this.chapters.values()).filter(ch => ch.attached);
	        const isSpreadMode = this.viewSettings.layout && (this.viewSettings.layout.name === 'pre-paginated' || this.viewSettings.layout.spread);
	        const maxAttachedChapters = isSpreadMode ? 2 : 1;
	        if (attachedChapters.length >= maxAttachedChapters) {
	          // If we're at capacity, detach the oldest attached chapter(s)
	          for (let i = 0; i < attachedChapters.length - (maxAttachedChapters - 1); i++) {
	            const toDetach = attachedChapters[i];
	            if (toDetach.section.href !== sectionHref) {
	              this.detachChapter(toDetach.section.href);
	            }
	          }
	        }
	        // Verify element exists and is properly rendered
	        if (!chapter.element) {
	          console.error('[BookPreRenderer] chapter element is null:', sectionHref);
	          return null;
	        }
	        // CLONE-ON-ATTACH: Create a fresh wrapper and iframe from preserved content
	        // to avoid moving the original prerendered iframe (which loses content on DOM moves).
	        const displayWrapper = document.createElement('div');
	        displayWrapper.classList.add('epub-view');
	        // For paginated content, set wrapper to full width so container can detect scrollable content
	        const dims = {
	          width: chapter.width,
	          height: chapter.height
	        };
	        displayWrapper.style.width = dims.width + 'px';
	        displayWrapper.style.height = dims.height + 'px';
	        displayWrapper.style.overflow = 'hidden';
	        displayWrapper.style.position = 'relative';
	        displayWrapper.style.display = 'block';
	        // Create a new iframe for display
	        const newIframe = document.createElement('iframe');
	        newIframe.scrolling = 'no';
	        newIframe.style.border = 'none';
	        const iframeDims = {
	          width: chapter.width,
	          height: chapter.height
	        };
	        newIframe.style.width = iframeDims.width + 'px';
	        newIframe.style.height = iframeDims.height + 'px';
	        newIframe.sandbox = 'allow-same-origin';
	        if (this.viewSettings.allowScriptedContent) {
	          newIframe.sandbox += ' allow-scripts';
	        }
	        if (this.viewSettings.allowPopups) {
	          newIframe.sandbox += ' allow-popups';
	        }
	        // Populate iframe from preservedSrcdoc or preservedContent
	        try {
	          if (chapter.preservedSrcdoc) {
	            newIframe.srcdoc = chapter.preservedSrcdoc;
	          } else if (chapter.preservedContent) {
	            // write will run after iframe is added to DOM; we add a load listener
	            newIframe.src = 'about:blank';
	            newIframe.addEventListener('load', () => {
	              try {
	                const doc = newIframe.contentDocument;
	                if (doc) {
	                  doc.open();
	                  doc.write(chapter.preservedContent);
	                  doc.close();
	                }
	              } catch (e) {
	                console.warn('[BookPreRenderer] clone-on-attach: could not write preserved content to iframe', e);
	              }
	            });
	          }
	        } catch (e) {
	          console.warn('[BookPreRenderer] clone-on-attach: failed to set iframe content', e);
	        }
	        displayWrapper.appendChild(newIframe);
	        // Create a proper IframeView instance for the cloned element
	        // This ensures all IframeView methods like setLayout() are available
	        const clonedView = this.viewRenderer.createView(chapter.section);
	        // Replace the IframeView's element with our cloned element
	        clonedView.element = displayWrapper;
	        // Update the view's internal iframe reference to point to our new iframe
	        // We need to access internal properties to properly initialize the cloned view
	        const iframeView = clonedView;
	        iframeView.iframe = newIframe;
	        iframeView.frame = newIframe;
	        // Set the display state since content is already rendered
	        iframeView.displayed = true;
	        iframeView.rendered = true;
	        // Set the dimensions to match the pre-rendered content
	        // Since we're now pre-rendering with correct target dimensions, use those dimensions
	        iframeView._width = this.viewSettings.width;
	        iframeView._height = this.viewSettings.height;
	        iframeView.lockedWidth = this.viewSettings.width;
	        iframeView.lockedHeight = this.viewSettings.height;
	        iframeView.fixedWidth = this.viewSettings.width;
	        iframeView.fixedHeight = this.viewSettings.height;
	        // Update the wrapper and iframe to use the same dimensions as pre-rendering
	        displayWrapper.style.width = this.viewSettings.width + 'px';
	        displayWrapper.style.height = this.viewSettings.height + 'px';
	        newIframe.style.width = this.viewSettings.width + 'px';
	        newIframe.style.height = this.viewSettings.height + 'px';
	        // Add essential IframeView methods to the cloned view for proper layout support
	        const originalExpand = clonedView.expand?.bind(clonedView);
	        clonedView.expand = () => {
	          // For cloned views, maintain the container dimensions since content is pre-rendered correctly
	          if (originalExpand) {
	            originalExpand();
	          }
	          // Ensure dimensions remain as container dimensions
	          if (newIframe) {
	            newIframe.style.width = this.viewSettings.width + 'px';
	            newIframe.style.height = this.viewSettings.height + 'px';
	          }
	        };
	        const originalSize = clonedView.size?.bind(clonedView);
	        clonedView.size = (width, height) => {
	          // Use container dimensions unless explicitly overridden
	          const finalWidth = width ?? this.viewSettings.width;
	          const finalHeight = height ?? this.viewSettings.height;
	          if (originalSize) {
	            originalSize(finalWidth, finalHeight);
	          }
	          // Update internal dimensions
	          iframeView._width = finalWidth;
	          iframeView._height = finalHeight;
	          iframeView.lockedWidth = finalWidth;
	          iframeView.lockedHeight = finalHeight;
	          // Update iframe dimensions
	          if (newIframe) {
	            newIframe.style.width = finalWidth + 'px';
	            newIframe.style.height = finalHeight + 'px';
	          }
	        };
	        // Add width/height methods that return the current dimensions
	        clonedView.width = () => iframeView._width;
	        clonedView.height = () => iframeView._height;
	        const attachedChapter = {
	          section: chapter.section,
	          view: clonedView,
	          // Now a proper IframeView with all methods
	          element: displayWrapper,
	          rendered: chapter.rendered,
	          attached: false,
	          width: chapter.width,
	          height: chapter.height,
	          pageCount: chapter.pageCount,
	          hasWhitePages: chapter.hasWhitePages,
	          whitePageIndices: chapter.whitePageIndices,
	          preservedSrcdoc: chapter.preservedSrcdoc,
	          preservedContent: chapter.preservedContent,
	          pageMap: chapter.pageMap
	        };
	        // Notify listeners about the cloned view being available (non-destructive)
	        try {
	          // Emit DISPLAYED once the clone iframe reports loaded/ready.
	          const emitDisplayedWhenReady = frame => {
	            try {
	              let settled = false;
	              const onLoad = () => {
	                if (settled) return;
	                settled = true;
	                cleanup();
	                try {
	                  attachedChapter.attached = true;
	                  // Initialize cloned view contents so features that depend on it
	                  // (like highlighting) work correctly. The cloned iframe already
	                  // contains the preserved content, so we can create a Contents
	                  // instance that points at the clone's document.
	                  try {
	                    const doc = frame.contentDocument;
	                    if (doc) {
	                      // Attach window/document/contents to the cloned view
	                      const v = attachedChapter.view;
	                      v.window = frame.contentWindow || undefined;
	                      v.document = doc;
	                      v.contents = new contents_1.default(doc, doc.body, chapter.section.cfiBase, chapter.section.index);
	                      // Wire contents events to mimic IframeView behaviour
	                      v.contents.on(constants_1.EVENTS.CONTENTS.EXPAND, () => {
	                        if (v.displayed) {
	                          try {
	                            if (typeof v.expand === 'function') v.expand();
	                            if (v.contents && v.layout) {
	                              v.layout.format(v.contents);
	                            }
	                          } catch {
	                            // ignore
	                          }
	                        }
	                      });
	                      v.contents.on(constants_1.EVENTS.CONTENTS.RESIZE, () => {
	                        if (v.displayed) {
	                          try {
	                            if (typeof v.expand === 'function') v.expand();
	                            if (v.contents && v.layout) {
	                              v.layout.format(v.contents);
	                            }
	                          } catch {
	                            // ignore
	                          }
	                        }
	                      });
	                      v.rendered = true;
	                      v.displayed = true;
	                    }
	                  } catch {
	                    console.debug('[BookPreRenderer] init cloned contents failed');
	                  }
	                  this.emit(constants_1.EVENTS.VIEWS.DISPLAYED, attachedChapter.view);
	                } catch (err) {
	                  console.debug('[BookPreRenderer] error emitting DISPLAYED after load:', err);
	                }
	              };
	              const cleanup = () => {
	                try {
	                  frame.removeEventListener('load', onLoad);
	                } catch {
	                  // ignore
	                }
	                if (timer) clearTimeout(timer);
	              };
	              frame.addEventListener('load', onLoad);
	              // Fallback: poll readyState for up to 1000ms
	              const interval = 50;
	              let elapsed = 0;
	              const poll = () => {
	                try {
	                  const d = frame.contentDocument;
	                  if (d && d.readyState === 'complete') {
	                    onLoad();
	                    return;
	                  }
	                } catch {
	                  // ignore cross-origin access errors
	                }
	                elapsed += interval;
	                if (elapsed >= 1000) {
	                  // timeout - still emit but mark as possibly incomplete
	                  if (!settled) {
	                    settled = true;
	                    cleanup();
	                    try {
	                      attachedChapter.attached = true;
	                      this.emit(constants_1.EVENTS.VIEWS.DISPLAYED, attachedChapter.view);
	                    } catch (err) {
	                      console.debug('[BookPreRenderer] error emitting DISPLAYED after timeout:', err);
	                    }
	                  }
	                } else {
	                  timer = setTimeout(poll, interval);
	                }
	              };
	              let timer = setTimeout(poll, interval);
	            } catch {
	              // If anything goes wrong, emit immediately as a fallback
	              try {
	                attachedChapter.attached = true;
	                this.emit(constants_1.EVENTS.VIEWS.DISPLAYED, attachedChapter.view);
	              } catch (err2) {
	                console.debug('[BookPreRenderer] emitDisplayedWhenReady fallback failed:', err2);
	              }
	            }
	          };
	          emitDisplayedWhenReady(newIframe);
	        } catch (e) {
	          console.debug(`[BookPreRenderer] error emitting DISPLAYED for clone: ${e}`);
	        }
	        return attachedChapter;
	      } catch (error) {
	        console.error('[BookPreRenderer] failed to attach chapter:', sectionHref, error);
	        chapter.attached = false;
	        return null;
	      }
	    }
	    detachChapter(sectionHref) {
	      const chapter = this.chapters.get(sectionHref);
	      if (!chapter || !chapter.attached) return null;
	      // Remove from whatever container it's currently in
	      if (chapter.element.parentNode) {
	        chapter.element.parentNode.removeChild(chapter.element);
	      }
	      // Store in unattached storage instead of offscreen container
	      this.unattachedStorage.appendChild(chapter.element);
	      chapter.attached = false;
	      this.emit(constants_1.EVENTS.VIEWS.HIDDEN, chapter.view);
	      return chapter;
	    }
	    /**
	     * Assign cumulative page numbers across the book for all prerendered chapters.
	     * This walks the provided sections in order and sums pageCount for already
	     * prerendered chapters to produce a global pageNumber for each page entry.
	     */
	    assignGlobalPageNumbers(sections) {
	      let cumulative = 0;
	      for (const sec of sections) {
	        const href = sec.href;
	        const chapter = this.chapters.get(href);
	        if (!chapter) continue;
	        if (chapter.pageMap && chapter.pageMap.length > 0) {
	          for (let i = 0; i < chapter.pageMap.length; i++) {
	            const entry = chapter.pageMap[i];
	            entry.pageNumber = cumulative + entry.index; // index is 1-based
	          }
	          cumulative += chapter.pageCount || chapter.pageMap.length || 0;
	        } else {
	          // No pageMap yet; still advance cumulative by pageCount if known
	          if (typeof chapter.pageCount === 'number' && chapter.pageCount > 0) {
	            cumulative += chapter.pageCount;
	          }
	        }
	        // Resolve any per-chapter deferred indicating pageNumbers have been assigned
	        try {
	          if (chapter.pageNumbersDeferred) {
	            chapter.pageNumbersDeferred.resolve();
	            delete chapter.pageNumbersDeferred;
	          }
	        } catch {
	          // ignore
	        }
	      }
	    }
	    destroy() {
	      this.chapters.forEach(chapter => {
	        if (chapter.element.parentNode) {
	          chapter.element.parentNode.removeChild(chapter.element);
	        }
	      });
	      if (this.offscreenContainer.parentNode) {
	        this.offscreenContainer.parentNode.removeChild(this.offscreenContainer);
	      }
	      this.chapters.clear();
	      this.renderingPromises.clear();
	    }
	  }
	  prerenderer.BookPreRenderer = BookPreRenderer;
	  (0, event_emitter_1.default)(BookPreRenderer.prototype);
	  prerenderer.default = BookPreRenderer;
	  return prerenderer;
	}

	var hasRequiredPrerendering;
	function requirePrerendering() {
	  if (hasRequiredPrerendering) return prerendering;
	  hasRequiredPrerendering = 1;
	  var __importDefault = prerendering && prerendering.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(prerendering, "__esModule", {
	    value: true
	  });
	  prerendering.BookPreRenderer = prerendering.PreRenderingViewManager = void 0;
	  const default_1 = __importDefault(require_default());
	  const prerenderer_1 = __importDefault(requirePrerenderer());
	  prerendering.BookPreRenderer = prerenderer_1.default;
	  const constants_1 = requireConstants();
	  // Type guard to check if a View is an IframeView
	  function isIframeView(view) {
	    return 'setupContentsForHighlighting' in view && 'settings' in view;
	  }
	  /**
	   * PreRenderingViewManager - Extends DefaultViewManager to add pre-rendering capabilities
	   *
	   * This manager adds prerendering functionality on top of the DefaultViewManager.
	   * The parent DefaultViewManager has no knowledge of prerendering - this manager adds it
	   * as a transparent layer on top.
	   */
	  class PreRenderingViewManager extends default_1.default {
	    // Public getter for compatibility with examples
	    get preRenderer() {
	      return this._preRenderer;
	    }
	    constructor(options) {
	      // Ensure overflow is always hidden in settings
	      if (options.settings) {
	        options.settings.overflow = 'hidden';
	      }
	      super(options);
	      this._preRenderer = null;
	      this.usePreRendering = false;
	      // Guard to ensure prerendering is only started once per manager instance
	      this._preRenderingStarted = false;
	      // Flag to track when we're attaching prerendered content to prevent layout destruction
	      this._attaching = false;
	      // Override the name property
	      this.name = 'prerendering';
	      this.usePreRendering = options.settings.usePreRendering || false;
	      this.settings.overflow = 'hidden';
	      this.overflow = 'hidden';
	    }
	    writeIframeContent(iframe, originalContent, attachedView, section) {
	      iframe.onload = () => {
	        try {
	          const doc = iframe.contentDocument;
	          if (!doc) return;
	          // Write the content
	          doc.open();
	          doc.write(originalContent);
	          doc.close();
	          // Prevent scrollbars
	          if (doc.body) {
	            this.applyNoScrollStyles(doc);
	          }
	          // Setup highlighting if needed
	          if (attachedView && section && doc.body) {
	            this.initializeContents(iframe, doc, attachedView, section);
	          }
	        } catch (err) {
	          console.error('[PreRenderingViewManager] Error writing content to iframe:', err);
	        }
	      };
	    }
	    applyNoScrollStyles(doc) {
	      Object.assign(doc.body.style, {
	        overflow: 'hidden',
	        overflowX: 'hidden',
	        overflowY: 'hidden'
	      });
	      const style = doc.createElement('style');
	      style.textContent = `
    body {
      overflow: hidden !important;
      overflow-x: hidden !important;
      overflow-y: hidden !important;
    }
  `;
	      doc.head.appendChild(style);
	    }
	    initializeContents(iframe, doc, attachedView, section) {
	      console.log('[PreRenderingViewManager] Setting up Contents after content write');
	      const contents = attachedView.setupContentsForHighlighting(iframe, section, attachedView.settings?.transparency);
	      if (!contents) {
	        console.warn('[PreRenderingViewManager] ❌ Failed to create Contents object');
	        return;
	      }
	      attachedView.window = iframe.contentWindow || undefined;
	      attachedView.document = doc;
	      attachedView.contents = contents;
	      console.log('[PreRenderingViewManager] ✅ Contents object created successfully');
	      console.log('[PreRenderingViewManager] Triggering MANAGERS.ADDED event');
	      this.emit(constants_1.EVENTS.MANAGERS.ADDED, attachedView);
	    }
	    async attachPrerendered(section, forceRight, mode) {
	      if (!(this.usePreRendering && this._preRenderer)) {
	        return null;
	      }
	      this._attaching = true;
	      try {
	        const attached = this._preRenderer.attachChapter(section.href);
	        if (!attached || !attached.view) return null;
	        attached.attached = true;
	        // Prevent layout recalculation by removing default handler
	        attached.view.onDisplayed = () => {};
	        // Build wrapper + iframe
	        const wrapperElement = this.createWrapper(forceRight, attached);
	        const iframeElement = this.createIframe(forceRight, attached);
	        wrapperElement.appendChild(iframeElement);
	        // Extract content
	        const originalContent = this.extractContent(attached);
	        // Load content
	        if (isIframeView(attached.view)) {
	          this.writeIframeContent(iframeElement, originalContent, attached.view, attached.section);
	        } else {
	          console.warn('[PreRenderingViewManager] ❌ Expected IframeView but got different view type');
	        }
	        iframeElement.src = 'about:blank';
	        // Update references
	        attached.view.element = wrapperElement;
	        const iframeView = attached.view;
	        iframeView.iframe = iframeElement;
	        iframeView.frame = iframeElement;
	        // Attach to container
	        if (this.container) {
	          this.container.appendChild(wrapperElement);
	        }
	        // Add to collection
	        if (mode === 'append') {
	          this.views.append(attached.view);
	        } else {
	          this.views.prepend(attached.view);
	        }
	        // Update phantom
	        this.updatePhantom(attached.width);
	        return attached.view;
	      } finally {
	        this._attaching = false;
	      }
	    }
	    updatePhantom(contentWidth) {
	      if (!this.container) return;
	      let phantomElement = this.container.querySelector('.epub-scroll-phantom');
	      if (!phantomElement) {
	        phantomElement = document.createElement('div');
	        phantomElement.className = 'epub-scroll-phantom';
	        phantomElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      height: 1px;
      pointer-events: none;
      visibility: hidden;
      z-index: -1000;
    `;
	        this.container.appendChild(phantomElement);
	      }
	      const safeContentWidth = Math.max(contentWidth || 0, this.layout.width);
	      phantomElement.style.width = safeContentWidth + 'px';
	      // Force a reflow
	      void phantomElement.offsetWidth;
	    }
	    createWrapper(forceRight, attached) {
	      const wrapperElement = document.createElement('div');
	      wrapperElement.classList.add('epub-view');
	      wrapperElement.setAttribute('ref', this.views._views.length.toString());
	      const isSpreadView = this.layout && this.layout.divisor > 1;
	      const viewportWidth = this.container?.clientWidth || 0;
	      const viewportHeight = this.container?.clientHeight || 0;
	      const containerWidth = this.container?.clientWidth || 900;
	      if (isSpreadView) {
	        const columnWidth = this.layout?.columnWidth || Math.floor(viewportWidth / 2);
	        // For prerendered content, use the full content width to show all pages
	        const wrapperWidth = attached?.width ? Math.max(attached.width, columnWidth) : columnWidth;
	        wrapperElement.style.width = `${wrapperWidth}px`;
	        wrapperElement.style.height = `${viewportHeight}px`;
	        if (forceRight) {
	          const rightPosition = this.layout?.columnWidth || Math.floor(viewportWidth / 2);
	          const gapAdjustment = this.layout?.gap || 0;
	          wrapperElement.style.left = `${rightPosition + gapAdjustment}px`;
	        } else {
	          wrapperElement.style.left = '0px';
	        }
	      } else {
	        wrapperElement.style.width = `${containerWidth}px`;
	        wrapperElement.style.height = `${viewportHeight}px`;
	        wrapperElement.style.left = '0px';
	      }
	      Object.assign(wrapperElement.style, {
	        overflow: 'hidden',
	        position: 'relative',
	        display: 'block',
	        flex: '0 0 auto',
	        visibility: 'visible'
	      });
	      return wrapperElement;
	    }
	    createIframe(forceRight, attached) {
	      const iframeElement = document.createElement('iframe');
	      iframeElement.style.border = 'none';
	      const iframeWidth = Math.max(attached.width || 0, this.layout.width);
	      iframeElement.style.width = `${iframeWidth}px`;
	      iframeElement.style.height = `${attached.height}px`;
	      Object.assign(iframeElement.style, {
	        overflow: 'hidden',
	        overflowX: 'hidden',
	        overflowY: 'hidden',
	        background: 'transparent',
	        visibility: 'visible',
	        display: 'block',
	        wordSpacing: '0px',
	        lineHeight: 'normal'
	      });
	      iframeElement.setAttribute('sandbox', 'allow-same-origin');
	      if (attached.view?.section?.properties?.includes('scripted')) {
	        iframeElement.setAttribute('sandbox', 'allow-same-origin allow-scripts');
	      }
	      const isSpreadView = this.layout && this.layout.divisor > 1;
	      if (isSpreadView && forceRight && attached.pageCount > 1) {
	        const singlePageWidth = Math.floor(attached.width / attached.pageCount);
	        iframeElement.style.marginLeft = `-${singlePageWidth}px`;
	        return iframeElement;
	      }
	      iframeElement.style.marginLeft = '0px';
	      return iframeElement;
	    }
	    extractContent(attached) {
	      if (attached.preservedContent) return attached.preservedContent;
	      if (attached.preservedSrcdoc) return attached.preservedSrcdoc;
	      try {
	        const originalIframe = attached.element.querySelector('iframe');
	        if (originalIframe) {
	          if (originalIframe.contentDocument?.documentElement) {
	            return '<!DOCTYPE html>' + originalIframe.contentDocument.documentElement.outerHTML;
	          } else if (originalIframe.srcdoc) {
	            return originalIframe.srcdoc;
	          }
	        }
	      } catch (e) {
	        console.warn('[PreRenderingViewManager] Error extracting content:', e);
	      }
	      return '';
	    }
	    async append(section, forceRight = false) {
	      return (await this.attachPrerendered(section, forceRight, 'append')) ?? super.append(section, forceRight);
	    }
	    async prepend(section, forceRight = false) {
	      return (await this.attachPrerendered(section, forceRight, 'prepend')) ?? super.prepend(section, forceRight);
	    }
	    // Pre-rendering specific methods
	    async startPreRendering(sections) {
	      if (!this.usePreRendering || !this._preRenderer) {
	        return;
	      }
	      if (this._preRenderingStarted) {
	        return;
	      }
	      this._preRenderingStarted = true;
	      await this._preRenderer.preRenderBook(sections);
	    }
	    getPreRenderedChapter(sectionHref) {
	      if (!this.usePreRendering || !this._preRenderer) {
	        return undefined;
	      }
	      return this._preRenderer.getChapter(sectionHref);
	    }
	    hasPreRenderedChapter(sectionHref) {
	      if (!this.usePreRendering || !this._preRenderer) {
	        return false;
	      }
	      return !!this._preRenderer.getChapter(sectionHref);
	    }
	    getPreRenderingStatus() {
	      if (!this.usePreRendering || !this._preRenderer) {
	        return {
	          total: 0,
	          rendered: 0,
	          failed: 0,
	          chapters: new Map()
	        };
	      }
	      return this._preRenderer.getStatus();
	    }
	    getAllPreRenderedChapters() {
	      if (!this.usePreRendering || !this._preRenderer) {
	        return [];
	      }
	      return this._preRenderer.getAllChapters();
	    }
	    getPreRenderingDebugInfo() {
	      if (!this.usePreRendering || !this._preRenderer) {
	        return {
	          totalChapters: 0,
	          renderingInProgress: 0,
	          chapters: []
	        };
	      }
	      return this._preRenderer.getDebugInfo();
	    }
	    /**
	     * Get the total number of pages across all chapters in the book
	     */
	    getTotalPages() {
	      return this._preRenderer?.getAllChapters().reduce((sum, ch) => {
	        if (ch.pageCount === undefined) return undefined;
	        return sum + ch.pageCount;
	      }, 0);
	    }
	    /**
	     * Get the current page number across all chapters in the book
	     */
	    getCurrentPage() {
	      const locationInfo = this.currentLocation?.();
	      const chapters = this._preRenderer?.getAllChapters();
	      if (!locationInfo?.length || !chapters?.length) return undefined;
	      const current = locationInfo[0];
	      const currentHref = current.href;
	      const currentPage = current.pages[0] ?? 1;
	      const index = chapters.findIndex(ch => ch.section.href === currentHref);
	      if (index === -1) return undefined;
	      const totalBefore = chapters.slice(0, index).reduce((sum, ch) => {
	        if (ch.pageCount === undefined) return undefined;
	        return sum + ch.pageCount;
	      }, 0);
	      return totalBefore === undefined ? undefined : totalBefore + currentPage;
	    }
	    afterDisplayed(view) {
	      // Check if this is a prerendered view that we just attached
	      const isPrerenderedView = this._preRenderer && view.section && this._preRenderer.getChapter(view.section.href)?.attached === true;
	      if (isPrerenderedView) {
	        // Emit the displayed event so the book knows the content is ready
	        this.emit(constants_1.EVENTS.MANAGERS.ADDED, view);
	        return;
	      }
	      super.afterDisplayed(view);
	    }
	    // Override destroy to clean up pre-renderer
	    destroy() {
	      this._preRenderer?.destroy();
	      return super.destroy();
	    }
	    // Override render to initialize the BookPreRenderer once the container and
	    // Only override render to initialize pre-renderer
	    render(element, size) {
	      // Ensure overflow is explicitly set to hidden
	      this.settings.overflow = 'hidden';
	      this.overflow = 'hidden';
	      // Call parent render first
	      super.render(element, size);
	      // Initialize the pre-renderer now that the DOM container and viewSettings exist
	      if (this.usePreRendering && !this._preRenderer && this.container) {
	        const preRenderViewSettings = {
	          width: this.viewSettings.width || 0,
	          height: this.viewSettings.height || 0,
	          ...this.viewSettings
	        };
	        this._preRenderer = new prerenderer_1.default(this.container, preRenderViewSettings, this.request);
	      }
	    }
	    // Override resize to ensure proper handling of prerendered content during window resize
	    async resize(width, height, epubcfi) {
	      try {
	        // Set _attaching flag to prevent layout destruction during resize
	        this._attaching = true;
	        // Check if any of the current views are prerendered
	        let hasPrerenderedViews = false;
	        const prerenderedSections = [];
	        this.views._views.forEach(view => {
	          if (view && view.section && this._preRenderer?.getChapter(view.section.href)?.attached) {
	            hasPrerenderedViews = true;
	            prerenderedSections.push(view.section);
	          }
	        });
	        // For prerendered content, just update the container dimensions without
	        // trying to modify the prerendered content itself
	        if (hasPrerenderedViews) {
	          // Update container dimensions only
	          const stageSize = this.stage.size(width, height);
	          this._stageSize = stageSize;
	          this._bounds = this.bounds();
	          // Update view settings
	          this.viewSettings.width = this._stageSize.width;
	          this.viewSettings.height = this._stageSize.height;
	          // Update layout information without modifying views
	          if (this.layout) {
	            this.layout.calculate(this._stageSize.width, this._stageSize.height, this.settings.gap);
	            this.settings.offset = this.layout.delta / this.layout.divisor;
	          }
	          // Emit resize event with updated dimensions
	          this.emit(constants_1.EVENTS.MANAGERS.RESIZED, {
	            width: this._stageSize.width,
	            height: this._stageSize.height
	          }, epubcfi);
	          return;
	        }
	        return super.resize(width, height, epubcfi);
	      } catch {
	        // If our custom resize fails, fall back to the default implementation
	        return super.resize(width, height, epubcfi);
	      } finally {
	        // Always reset the attaching flag
	        this._attaching = false;
	      }
	    }
	    isRtlDirection() {
	      return this.settings.direction === 'rtl' && this.settings.axis === 'horizontal';
	    }
	    async navigate(forwardInReadingOrder) {
	      if (!this.views?.length) return;
	      // Determine the "current view" depending on logical navigation direction
	      // forwardInReadingOrder = true  -> use the last view (end of current content)
	      // forwardInReadingOrder = false -> use the first view (start of current content)
	      const currentView = forwardInReadingOrder ? this.views.last() : this.views.first();
	      if (!currentView?.section) return;
	      const currentSection = currentView.section;
	      // Can we scroll inside the current section?
	      const maxScrollLeft = this.container.scrollWidth - this.container.offsetWidth;
	      const canScrollMore = forwardInReadingOrder ? this.container.scrollLeft < maxScrollLeft : this.container.scrollLeft > 0;
	      // Fallback arrow function to call super method if needed
	      const fallback = () => forwardInReadingOrder ? super.next() : super.prev();
	      // Only proceed with pre-rendered navigation if the preRenderer exists
	      if (!this._preRenderer) return fallback();
	      if (canScrollMore) return fallback();
	      // Normalize actual section movement using RTL
	      const actualForward = this.isRtlDirection() ? !forwardInReadingOrder : forwardInReadingOrder;
	      const targetSection = actualForward ? currentSection.next() : currentSection.prev();
	      if (!targetSection) return fallback();
	      this.clear();
	      this.updateLayout();
	      const forceRight = this.layout.name === 'pre-paginated' && this.layout.divisor === 2 && targetSection.properties.includes('page-spread-right');
	      await this.loadSection(targetSection, forwardInReadingOrder, forceRight);
	    }
	    async loadSection(section, goForward, forceRight) {
	      // Append or prepend the section
	      if (goForward) {
	        await this.append(section, forceRight);
	      } else {
	        await this.prepend(section, forceRight);
	      }
	      // Only adjust scroll for horizontal layouts
	      if (this.settings.axis !== 'horizontal') return;
	      const scrollWidth = this.container.scrollWidth;
	      const offsetWidth = this.container.offsetWidth;
	      const isRtlDefault = this.isRtlDirection() && this.settings.rtlScrollType === 'default';
	      // Define scroll positions for next/prev in both directions
	      const rtlOptions = {
	        next: scrollWidth,
	        prev: 0
	      };
	      const ltrOptions = {
	        next: 0,
	        prev: scrollWidth - offsetWidth
	      };
	      const options = isRtlDefault ? rtlOptions : ltrOptions;
	      const scrollPos = goForward ? options.next : options.prev;
	      this.scrollTo(scrollPos, 0, true);
	    }
	    async next() {
	      return this.navigate(true); // forward in reading order
	    }
	    async prev() {
	      return this.navigate(false); // backward in reading order
	    }
	  }
	  prerendering.PreRenderingViewManager = PreRenderingViewManager;
	  prerendering.default = PreRenderingViewManager;
	  return prerendering;
	}

	var hasRequiredRendition;
	function requireRendition() {
	  if (hasRequiredRendition) return rendition;
	  hasRequiredRendition = 1;
	  var __importDefault = rendition && rendition.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(rendition, "__esModule", {
	    value: true
	  });
	  rendition.Rendition = void 0;
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const utils_1 = requireUtils();
	  const hook_1 = __importDefault(requireHook());
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const queue_1 = __importDefault(requireQueue());
	  const layout_1 = __importDefault(requireLayout());
	  const themes_1 = __importDefault(requireThemes());
	  const annotations_1 = __importDefault(requireAnnotations());
	  const default_1 = __importDefault(require_default());
	  const prerendering_1 = requirePrerendering();
	  /**
	   * Displays an Epub as a series of Views for each Section.
	   * Requires Manager and View class to handle specifics of rendering
	   * the section content.
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
	      this.location = null;
	      this.book = book;
	      this.q = new queue_1.default(this);
	      this.settings = {
	        width: undefined,
	        height: undefined,
	        ignoreClass: '',
	        view: 'iframe',
	        // or use a proper View instance if available
	        flow: undefined,
	        layout: undefined,
	        spread: undefined,
	        minSpreadWidth: 400,
	        stylesheet: undefined,
	        resizeOnOrientationChange: true,
	        script: undefined,
	        snap: false,
	        defaultDirection: 'ltr',
	        allowScriptedContent: false,
	        allowPopups: false,
	        usePreRendering: false,
	        ...options
	      };
	      this.hooks = {
	        display: new hook_1.default(this),
	        serialize: new hook_1.default(this),
	        content: new hook_1.default(this),
	        unloaded: new hook_1.default(this),
	        layout: new hook_1.default(this),
	        render: new hook_1.default(this),
	        show: new hook_1.default(this)
	      };
	      this.hooks.content.register(this.handleLinks.bind(this));
	      this.hooks.content.register(this.passEvents.bind(this));
	      this.hooks.content.register(this.adjustImages.bind(this));
	      if (this.book.spine === undefined) {
	        throw new Error('Book spine is not defined');
	      }
	      this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));
	      if (this.settings.stylesheet) {
	        this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
	      }
	      if (this.settings.script) {
	        this.book.spine.hooks.content.register(this.injectScript.bind(this));
	      }
	      this.themes = new themes_1.default(this);
	      this.annotations = new annotations_1.default(this);
	      this.epubcfi = new epubcfi_1.default();
	      this.location = null;
	      // Hold queue until book is opened
	      this.q.enqueue(this.book.opened);
	      this.starting = new utils_1.defer();
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
	     */
	    setManager(manager) {
	      this.manager = manager;
	    }
	    /**
	     * Start the rendering
	     */
	    async start() {
	      if (!this.book.packaging || !this.book.packaging.metadata) {
	        console.error('[Rendition] start failed: book.packaging or metadata is undefined');
	        console.error(JSON.stringify(this.book.ready));
	        return;
	      }
	      if (!this.settings.layout && (this.book.packaging.metadata.layout === 'pre-paginated' || this.book.displayOptions.fixedLayout === 'true')) {
	        this.settings.layout = 'pre-paginated';
	      }
	      switch (this.book.packaging.metadata.spread) {
	        case 'none':
	          this.settings.spread = 'none';
	          break;
	        case 'both':
	          this.settings.spread = 'auto';
	          break;
	      }
	      // Create manager in ONE place - always create here, no conditions
	      // Debug: usePreRendering = ${this.settings.usePreRendering}
	      if (typeof this.settings.manager === 'object') {
	        console.debug('[Rendition] Using provided manager object');
	        this.manager = this.settings.manager;
	      } else {
	        const layoutInstance = new layout_1.default({
	          layout: this.settings.layout || 'reflowable',
	          spread: this.settings.spread || 'auto',
	          minSpreadWidth: typeof this.settings.minSpreadWidth === 'number' ? this.settings.minSpreadWidth : 400,
	          direction: this.settings.direction || 'ltr',
	          flow: this.settings.flow || 'auto'
	        });
	        // Ensure width and height are numbers or undefined
	        const width = typeof this.settings.width === 'number' ? this.settings.width : undefined;
	        const height = typeof this.settings.height === 'number' ? this.settings.height : undefined;
	        // Choose the appropriate view manager based on usePreRendering setting
	        const ManagerClass = this.settings.usePreRendering ? prerendering_1.PreRenderingViewManager : default_1.default;
	        // Debug: Using manager class = ${ManagerClass.name}
	        const baseManagerOptions = {
	          view: this.settings.view,
	          queue: this.q,
	          request: this.book.load.bind(this.book),
	          settings: {
	            ...this.settings,
	            layout: layoutInstance,
	            width,
	            height,
	            afterScrolledTimeout: 10
	          }
	        };
	        // Add spine to manager options if using PreRenderingViewManager
	        if (this.settings.usePreRendering) {
	          const spineItems = this.book.spine?.spineItems || [];
	          const preRenderingOptions = {
	            ...baseManagerOptions,
	            spine: spineItems
	          };
	          this.manager = new ManagerClass(preRenderingOptions);
	        } else {
	          this.manager = new ManagerClass(baseManagerOptions);
	        }
	        this.ViewManager = ManagerClass;
	        this.View = this.settings.view;
	      }
	      // Set up manager event listeners now that manager is created
	      this.manager.on(utils_1.EVENTS.MANAGERS.ADDED, (...args) => {
	        const view = args[0];
	        this.afterDisplayed(view);
	      });
	      this.manager.on(utils_1.EVENTS.MANAGERS.REMOVED, (...args) => {
	        const view = args[0];
	        this.afterRemoved(view);
	      });
	      this.manager.on(utils_1.EVENTS.MANAGERS.RESIZED, (...args) => {
	        const size = args[0];
	        const epubcfi = args[1];
	        this.onResized(size, epubcfi);
	      });
	      this.manager.on(utils_1.EVENTS.MANAGERS.ORIENTATION_CHANGE, (...args) => {
	        const orientation = args[0];
	        this.onOrientationChange(orientation);
	      });
	      this.direction(this.book.packaging.metadata.direction || this.settings.defaultDirection);
	      // Parse metadata to get layout props
	      this.settings.globalLayoutProperties = this.determineLayoutProperties(this.book.packaging.metadata);
	      this.flow(this.settings.globalLayoutProperties.flow);
	      this.layout(this.settings.globalLayoutProperties);
	      // Manager event listeners are already set up above after manager creation
	      // Listen for scroll changes
	      this.manager.on(utils_1.EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));
	      /**
	       * Emit that rendering has started
	       * @event started
	       * @memberof Rendition
	       */
	      this.emit(utils_1.EVENTS.RENDITION.STARTED);
	      // Start processing queue
	      this.starting.resolve();
	    }
	    /**
	     * Call to attach the container to an element in the dom
	     * Container must be attached before rendering can begin
	     */
	    attachTo(element) {
	      // eslint-disable-next-line @typescript-eslint/no-unused-vars
	      return this.q.enqueue(() => {
	        // Start rendering with the request function
	        this.manager.render(element);
	        // If pre-rendering is enabled and we're using the PreRenderingViewManager,
	        // start pre-rendering automatically for all spine sections.
	        try {
	          const hasPreRendering = this.settings.usePreRendering && this.manager instanceof prerendering_1.PreRenderingViewManager;
	          if (hasPreRendering && this.book.spine) {
	            const sections = this.book.spine.spineItems || [];
	            // Start pre-rendering in the background (don't block attachTo)
	            // eslint-disable-next-line @typescript-eslint/no-floating-promises
	            this.manager.startPreRendering(sections).catch(err => {
	              console.warn('[Rendition] Pre-rendering failed to start:', err);
	            });
	          }
	        } catch (e) {
	          console.debug('[Rendition] Auto pre-rendering start check failed', e);
	        }
	        // Ensure the first page is shown after attachment. Use the rendition's display
	        // method which will enqueue the request and wait for any pending startup tasks.
	        try {
	          if (this.book.spine && this.book.spine.length) {
	            // eslint-disable-next-line @typescript-eslint/no-floating-promises
	            this.display(0);
	          }
	        } catch (e) {
	          console.debug('[Rendition] Failed to display first section after attach', e);
	        }
	        /**
	         * Emit that rendering has attached to an element
	         * @event attached
	         * @memberof Rendition
	         */
	        this.emit(utils_1.EVENTS.RENDITION.ATTACHED);
	      });
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
	        this.displaying.resolve(true);
	      }
	      return this.q.enqueue(this._display, target);
	    }
	    /**
	     * Tells the manager what to display immediately
	     *
	     * @param  {string} target Url or EpubCFI
	     * @return {Promise}
	     */
	    _display(target) {
	      if (!this.book) {
	        console.error('[Rendition] display called without a book');
	        return Promise.resolve(false);
	      }
	      const displaying = new utils_1.defer();
	      const displayed = displaying.promise;
	      this.displaying = displaying;
	      // Check if this is a book percentage
	      // Coerce non-string targets to strings for string-based checks below
	      const targetStr = typeof target === 'string' ? target : String(target);
	      if (this.book.locations && this.book.locations.length() && (0, utils_1.isFloat)(targetStr)) {
	        target = this.book.locations.cfiFromPercentage(parseFloat(targetStr));
	      }
	      if (!this.book.spine) {
	        console.error('[Rendition] display called without a book spine');
	        return Promise.resolve(false);
	      }
	      const section = this.book.spine.get(target);
	      if (!section) {
	        displaying.reject(new Error('No Section Found'));
	        return displayed;
	      }
	      // Extract the CFI fragment for positioning within the section
	      let cfiTarget;
	      if (targetStr && targetStr.startsWith('epubcfi(')) {
	        cfiTarget = targetStr;
	      }
	      this.manager.display(section, cfiTarget).then(() => {
	        displaying.resolve(true);
	        this.displaying = undefined;
	        /**
	         * Emit that a section has been displayed
	         * @event displayed
	         * @param {Section} section
	         * @memberof Rendition
	         */
	        this.emit(utils_1.EVENTS.RENDITION.DISPLAYED, section);
	        this.reportLocation();
	      }, err => {
	        /**
	         * Emit that has been an error displaying
	         * @event displayError
	         * @param {Section} section
	         * @memberof Rendition
	         */
	        this.emit(utils_1.EVENTS.RENDITION.DISPLAY_ERROR, err);
	      });
	      return displayed;
	    }
	    getContents() {
	      return this.manager.getContents();
	    }
	    /**
	     * Report what section has been displayed
	     */
	    afterDisplayed(view) {
	      // Some views (pre-rendered/offscreen) may not implement the EventEmitter
	      // style `on` method. Guard before wiring event handlers to avoid runtime
	      // TypeErrors (see prerendered views created by BookPreRenderer).
	      if (typeof view.on === 'function') {
	        view.on(utils_1.EVENTS.VIEWS.MARK_CLICKED, (cfiRange, data) => this.triggerMarkEvent(cfiRange, data, view.contents));
	      } else {
	        console.debug('[Rendition] view does not implement .on, skipping MARK_CLICKED wiring for', view.section?.href);
	      }
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
	            this.emit(utils_1.EVENTS.RENDITION.RENDERED, view.section, view);
	          });
	        } else {
	          this.emit(utils_1.EVENTS.RENDITION.RENDERED, view.section, view);
	        }
	      });
	    }
	    /**
	     * Report what has been removed
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
	        this.emit(utils_1.EVENTS.RENDITION.REMOVED, view.section, view);
	      });
	    }
	    /**
	     * Report resize events and display the last seen location
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
	      this.emit(utils_1.EVENTS.RENDITION.RESIZED, {
	        width: size.width,
	        height: size.height
	      }, epubcfi);
	      // Check if we have a pre-rendering enabled manager that can handle resize natively
	      // If so, skip the automatic display call to avoid clearing views that were just attached
	      const hasPreRendering = this.manager && this.manager instanceof prerendering_1.PreRenderingViewManager;
	      if (this.location && this.location.start && !hasPreRendering) {
	        this.display(epubcfi || this.location.start.cfi);
	      } else if (hasPreRendering) {
	        console.debug('[Rendition] skipping automatic display after resize - pre-rendering manager will handle it');
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
	      this.emit(utils_1.EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
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
	      this.manager.resize(String(width), String(height), epubcfi);
	    }
	    /**
	     * Clear all rendered views
	     */
	    clear() {
	      this.manager.clear();
	    }
	    /**
	     * Go to the next "page" in the rendition
	     */
	    async next() {
	      const queuePromise = this.q.enqueue(this.manager.next.bind(this.manager));
	      return queuePromise.then(result => {
	        this.reportLocation();
	        return result;
	      });
	    }
	    /**
	     * Go to the previous "page" in the rendition
	     */
	    prev() {
	      return this.q.enqueue(this.manager.prev.bind(this.manager)).then(this.reportLocation.bind(this)).catch(error => {
	        throw error;
	      });
	    }
	    /**
	     * Determine the Layout properties from metadata and settings
	     *
	     * @link http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	     */
	    determineLayoutProperties(metadata) {
	      const layout = this.settings.layout || metadata.layout || 'reflowable';
	      const spread = this.settings.spread || metadata.spread || 'auto';
	      const orientation = this.settings.orientation || metadata.orientation || 'auto';
	      const flow = this.settings.flow || metadata.flow || 'auto';
	      const viewport = metadata.viewport || '';
	      const minSpreadWidth = this.settings.minSpreadWidth || metadata.minSpreadWidth || 800;
	      const direction = this.settings.direction || metadata.direction || 'ltr';
	      return {
	        layout: layout,
	        spread: spread,
	        orientation: orientation,
	        flow: flow,
	        viewport: viewport,
	        minSpreadWidth: minSpreadWidth,
	        direction: direction
	      };
	    }
	    /**
	     * Adjust the flow of the rendition to paginated or scrolled
	     * (scrolled-continuous vs scrolled-doc are handled by different view managers)
	     */
	    flow(flow) {
	      let _flow = flow;
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
	     */
	    layout(settings) {
	      if (settings) {
	        this._layout = new layout_1.default(settings);
	        this._layout.spread(settings.spread, this.settings.minSpreadWidth);
	        // this.mapping = new Mapping(this._layout.props);
	        this._layout.on(utils_1.EVENTS.LAYOUT.UPDATED, (props, changed) => {
	          this.emit(utils_1.EVENTS.RENDITION.LAYOUT, props, changed);
	        });
	      }
	      if (this.manager && this._layout) {
	        this.manager.applyLayout(this._layout);
	      }
	      return this._layout;
	    }
	    /**
	     * Adjust if the rendition uses spreads
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
	      return this.q.enqueue(() => {
	        requestAnimationFrame(() => {
	          const pageLocations = this.manager.currentLocation();
	          if (pageLocations && Array.isArray(pageLocations) && pageLocations.length > 0) {
	            // Map PageLocation[] to LocationPoint[]
	            const locationPoints = pageLocations.map(pl => ({
	              index: pl.index,
	              href: pl.href,
	              cfi: pl.mapping?.start ?? '',
	              displayed: {
	                page: pl.pages[0] || 1,
	                total: pl.totalPages ?? 0
	              },
	              pages: pl.pages,
	              totalPages: pl.totalPages,
	              mapping: pl.mapping
	            }));
	            const located = this.located(locationPoints);
	            if (!located) {
	              return;
	            }
	            this.location = located;
	            this.emit(utils_1.EVENTS.RENDITION.RELOCATED, this.location);
	          }
	        });
	      });
	    }
	    /**
	     * Get the Current Location object
	     */
	    currentLocation() {
	      return this.manager.currentLocation();
	    }
	    /**
	     * Get a Range from a Visible CFI
	     * (Used outside of this package)
	     */
	    getRange(cfi, ignoreClass) {
	      const _cfi = new epubcfi_1.default(cfi);
	      const found = this.manager.visible().filter(function (view) {
	        if (_cfi.spinePos === view.index) return true;
	      });
	      // Should only ever return 1 item
	      if (found.length > 0) {
	        return found[0].contents.range(cfi, ignoreClass);
	      }
	      return null;
	    }
	    /**
	     * Creates a Rendition#locationRange from location
	     * passed by the Manager
	     */
	    located(location) {
	      if (!location.length) return null;
	      const start = location[0];
	      const end = location[location.length - 1];
	      const located = {
	        start: (0, utils_1.buildEnrichedLocationPoint)(start, 'start', this.book),
	        end: (0, utils_1.buildEnrichedLocationPoint)(end, 'end', this.book)
	      };
	      if (end.index === this.book.spine.last()?.index && located.end.displayed.page >= located.end.displayed.total) {
	        located.atEnd = true;
	      }
	      if (start.index === this.book.spine.first()?.index && located.start.displayed.page === 1) {
	        located.atStart = true;
	      }
	      return located;
	    }
	    /**
	     * Remove and Clean Up the Rendition
	     */
	    destroy() {
	      // @todo Clear the queue
	      this.manager?.destroy();
	      // @ts-expect-error this is only at destroy time
	      this.book = undefined;
	    }
	    /**
	     * Pass the events from a view's Contents
	     */
	    passEvents(contents) {
	      utils_1.DOM_EVENTS.forEach(e => {
	        contents.on(e, ev => this.triggerViewEvent(ev, contents));
	      });
	      contents.on(utils_1.EVENTS.CONTENTS.SELECTED, e => {
	        this.triggerSelectedEvent(e, contents);
	      });
	    }
	    /**
	     * Emit events passed by a view
	     */
	    triggerViewEvent(e, contents) {
	      this.emit(e.type, e, contents);
	    }
	    /**
	     * Emit a selection event's CFI Range passed from a a view
	     */
	    triggerSelectedEvent(cfirange, contents) {
	      this.emit(utils_1.EVENTS.RENDITION.SELECTED, cfirange, contents);
	    }
	    /**
	     * Emit a markClicked event with the cfiRange and data from a mark
	     */
	    triggerMarkEvent(cfiRange, data, contents) {
	      this.emit(utils_1.EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
	    }
	    /**
	     * Hook to adjust images to fit in columns
	     */
	    adjustImages(contents) {
	      if (this._layout === undefined) {
	        throw new Error('Layout is not defined');
	      }
	      if (this._layout.name === 'pre-paginated') {
	        return new Promise(function (resolve) {
	          resolve();
	        });
	      }
	      if (contents.window === null) {
	        return;
	      }
	      const computed = contents.window.getComputedStyle(contents.content, null);
	      const height = (contents.content.offsetHeight - (parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom))) * 0.95;
	      const horizontalPadding = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
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
	      }, 'rendition-adjust-images');
	      return new Promise(function (resolve) {
	        // Wait to apply
	        setTimeout(function () {
	          resolve();
	        }, 1);
	      });
	    }
	    /**
	     * Hook to handle link clicks in rendered content
	     */
	    handleLinks(contents) {
	      if (contents) {
	        contents.on(utils_1.EVENTS.CONTENTS.LINK_CLICKED, href => {
	          const relative = this.book.path.relative(href);
	          this.display(relative);
	        });
	      }
	    }
	    views() {
	      const views = this.manager ? this.manager.views : undefined;
	      return views;
	    }
	    /**
	     * Hook to handle injecting stylesheet before
	     * a Section is serialized
	     */
	    injectStylesheet(doc) {
	      const style = doc.createElement('link');
	      style.setAttribute('type', 'text/css');
	      style.setAttribute('rel', 'stylesheet');
	      if (this.settings.stylesheet) {
	        style.setAttribute('href', this.settings.stylesheet);
	      }
	      doc.getElementsByTagName('head')[0].appendChild(style);
	    }
	    /**
	     * Hook to handle injecting scripts before
	     * a Section is serialized
	     */
	    injectScript(doc) {
	      const script = doc.createElement('script');
	      script.setAttribute('type', 'text/javascript');
	      if (this.settings.script) {
	        script.setAttribute('src', this.settings.script);
	      }
	      script.textContent = ' '; // Needed to prevent self closing tag
	      doc.getElementsByTagName('head')[0].appendChild(script);
	    }
	    /**
	     * Hook to handle the document identifier before
	     * a Section is serialized
	     */
	    injectIdentifier(doc) {
	      const ident = this.book.packaging.metadata.identifier;
	      const meta = doc.createElement('meta');
	      meta.setAttribute('name', 'dc.relation.ispartof');
	      if (ident) {
	        meta.setAttribute('content', ident);
	      }
	      doc.getElementsByTagName('head')[0].appendChild(meta);
	    }
	  }
	  rendition.Rendition = Rendition;
	  //-- Enable binding events to Renderer
	  (0, event_emitter_1.default)(Rendition.prototype);
	  rendition.default = Rendition;
	  return rendition;
	}

	var archive = {};

	function commonjsRequire(path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	kMaxLength();

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	Buffer.isBuffer = isBuffer;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var process = browser$1;

	/*!

	JSZip v3.10.1 - A JavaScript class for generating and reading zip files
	<http://stuartk.com/jszip>

	(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
	Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

	JSZip uses the library pako released under the MIT license :
	https://github.com/nodeca/pako/blob/main/LICENSE
	*/

	!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else {("undefined"!=typeof window?window:"undefined"!=typeof global$1?global$1:"undefined"!=typeof self?self:this).JSZip=e();}}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t="function"==typeof commonjsRequire&&commonjsRequire;if(!e&&t)return t(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h);}return o[r].exports}for(var l="function"==typeof commonjsRequire&&commonjsRequire,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l};},{"./support":30,"./utils":32}],2:[function(e,t,r){var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i;}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o;},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate");},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return -1^e}(0|t,e,e.length,0):0};},{"./utils":32}],5:[function(e,t,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null;},{}],6:[function(e,t,r){var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n};},{lie:37}],7:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={};}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1);},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0);},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null;},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta});};},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})};},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[];}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}));},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}});}else this.accumulate=!0;},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null;},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}});},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume();},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end();}),e.on("error",function(e){t.error(e);}),this},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return !1;for(var r=0;r<t.length;r++)try{t[r].error(e);}catch(e){}return !0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock();},t.exports=s;},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o);}),o.entriesCount=h;}catch(e){o.error(e);}return o};},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e};}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return (new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n;},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e);}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e();}).resume();})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s);}return t.zipComment.length&&(h.comment=t.zipComment),h})};},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t);}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}});}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e);}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end();});},s.prototype.pause=function(){return !!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s;},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t);}).on("error",function(e){n.emit("error",e);}).on("end",function(){n.push(null);});}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume();},t.exports=n;},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}};},{}],15:[function(e,t,r){function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h;}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return "/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return "[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n);},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t);}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return !t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n);}catch(e){(t=new l("error")).error(e);}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return (e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n;},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream");},{stream:void 0}],17:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t];}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return -1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return [];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0;}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e);},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e;},skip:function(e){this.setIndex(this.index+e);},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i;},{"../utils":32}],19:[function(e,t,r){var n=e("./Uint8ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){var n=e("./ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)};},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b";},{}],24:[function(e,t,r){var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e;}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta});},t.exports=s;},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0);}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e);},t.exports=s;},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0);}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length;}i.prototype.processChunk.call(this,e);},t.exports=s;},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat();},function(e){t.error(e);});}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null;},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0));},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return !1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t);}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s;},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null;}n.prototype={push:function(e){this.emit("data",e);},end:function(){if(this.isFinished)return !1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0;}catch(e){this.emit("error",e);}return !0},error:function(e){return !this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[];},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t);},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.end();}),e.on("error",function(e){t.error(e);}),this},pause:function(){return !this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return !1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e);},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e]);},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock();},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n;},{}],29:[function(e,t,r){var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter");}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t);}).on("error",function(e){n=[],r(e);}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e);}catch(e){r(e);}n=[];}).resume();})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string";}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock();}catch(e){this._worker=new s("error"),this._worker.error(e);}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return "data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta);}):this._worker.on(e,function(){h.delay(t,arguments,r);}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f;},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else {var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size;}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size;}catch(e){r.blob=!1;}}}try{r.nodestream=!!e("readable-stream").Readable;}catch(e){r.nodestream=!1;}},{"readable-stream":16}],31:[function(e,t,s){for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null;}function l(){n.call(this,"utf-8 encode");}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else {for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n);}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length);}else t=this.leftOver.concat(t);this.leftOver=null;}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta});},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null);},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta});},s.Utf8EncodeWorker=l;},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return !1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return !1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2);}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i));}return r.join("/")},a.getTypeOf=function(e){return "string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&e instanceof Uint8Array?"uint8array":o.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[]);});},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r;},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result);},e.onerror=function(e){r(e.target.error);},e.readAsArrayBuffer(n);}):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})};},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e;}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r);},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r};},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes();},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw !this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral();}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e);},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles();}},t.exports=h;},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t;}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize));},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength);},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0);},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4));}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i);},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else {var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else {var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r);}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else {var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i);}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l;},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions};}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker));}catch(e){(t=new h("error")).error(e);}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n;},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2;};}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null;},t.document.documentElement.appendChild(e);}:function(){setTimeout(u,0);};else {var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0);};}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length;}n=!1;}l.exports=function(e){1!==h.push(e)||n||r();};}).call(this,"undefined"!=typeof global$1?global$1:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],37:[function(e,t,r){var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e);}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected);}function f(t,r,n){i(function(){var e;try{e=r(n);}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e);});}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments);}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e));}function i(e){r||(r=!0,l.resolve(t,e));}var s=p(function(){e(i,n);});"error"===s.status&&n(s.value);}function p(e,t){var r={};try{r.value=e(t),r.status="success";}catch(e){r.status="error",r.value=e;}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e);},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e);},h.prototype.callRejected=function(e){l.reject(this.promise,e);},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e);},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else {e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t);}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s));},function(e){i||(i=!0,l.reject(o,e));});}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e));},function(e){n||(n=!0,l.reject(s,e));});var a;return s};},{immediate:36}],38:[function(e,t,r){var n={};(0, e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n;},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0;}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return !1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)));}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e);},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return (t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return (t=t||{}).gzip=!0,n(e,t)};},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header);}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return !1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0);}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e);},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return (t=t||{}).raw=!0,o(e,t)},r.ungzip=o;},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n]);}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){return [].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s));},r.setTyped(n);},{}],42:[function(e,t,r){var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0]);}catch(e){i=!1;}try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(e){s=!1;}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else {for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i);}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t};},{"./common":41}],43:[function(e,t,r){t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521;}return i|s<<16|0};},{}],44:[function(e,t,r){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};},{}],45:[function(e,t,r){var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e};},{}],46:[function(e,t,r){var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return (e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0;}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0));}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm);}function U(e,t){e.pending_buf[e.pending++]=t;}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t;}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a];}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f;}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++;}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--;}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i;}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0;}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0;}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return (e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else {var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1;}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73);}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91);}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103);}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead);}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r);}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};},{}],48:[function(e,t,r){t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else {if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C;}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C;}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C;}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]));}else {for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]));}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p;};},{}],49:[function(e,t,r){var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return (e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1;}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5;}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0;}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0;}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30;}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3;}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else {if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2;}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3;}else {for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7;}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k;}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}u>>>=v,l-=v,r.back+=v;}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra;}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}u>>>=v,l-=v,r.back+=v;}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra;}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window;}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8;}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0;}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0;}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return -4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return -1;if(0<z&&(0===e||1!==w))return -1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]];}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0;}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0};},{"../utils/common":41}],51:[function(e,t,r){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};},{}],52:[function(e,t,r){var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0;}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length;}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t;}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255;}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r);}function L(e,t,r){P(e,r[2*t],r[2*t+1]);}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o));}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0;}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0;}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n;}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t);}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2;}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--);}}(e,t),Z(s,u,e.bl_count);}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4));}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4);}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r;}(e,t,r,!0);}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p);}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e);},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1);}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e);},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8);}(e);};},{"../utils/common":41}],53:[function(e,t,r){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};},{}],54:[function(e,t,r){(function(e){!function(r,n){if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e);});}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1;},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*");}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data);},function(e){t.port2.postMessage(e);}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null;},s.appendChild(t);}):function(e){setTimeout(c,0,e);},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f;}function f(e){delete h[e];}function c(e){if(u)setTimeout(c,0,e);else {var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r);}}(t);}finally{f(e),u=!1;}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length));}}("undefined"==typeof self?void 0===e?this:e:self);}).call(this,"undefined"!=typeof global$1?global$1:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[10])(10)});

	var jszip_min = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

	var require$$3 = /*@__PURE__*/getAugmentedNamespace(jszip_min);

	var hasRequiredArchive;
	function requireArchive() {
	  if (hasRequiredArchive) return archive;
	  hasRequiredArchive = 1;
	  var __importDefault = archive && archive.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(archive, "__esModule", {
	    value: true
	  });
	  const core_1 = requireCore();
	  const request_1 = __importDefault(requireRequest());
	  const mime_1 = __importDefault(requireMime());
	  const jszip_1 = __importDefault(require$$3);
	  /**
	   * Handles Unzipping a requesting files from an Epub Archive
	   */
	  class Archive {
	    constructor() {
	      this.urlCache = {};
	      this.checkRequirements();
	    }
	    /**
	     * Checks to see if JSZip exists and can be instantiated,
	     * Requires JSZip if it isn't there
	     */
	    checkRequirements() {
	      try {
	        // Access JSZip from global scope since that's where it's available
	        const JSZipConstructor = window.JSZip || jszip_1.default;
	        if (!JSZipConstructor) {
	          throw new Error('JSZip not found in global scope or as module');
	        }
	        // Try to instantiate JSZip to verify it works
	        this.zip = new JSZipConstructor();
	      } catch (error) {
	        console.error('[Archive] JSZip initialization failed:', error);
	        throw new Error(`Failed to initialize JSZip: ${error instanceof Error ? error.message : String(error)}`);
	      }
	    }
	    /**
	     * Open an archive
	     */
	    async open(input, isBase64) {
	      return this.getZip().loadAsync(input, {
	        base64: isBase64
	      }).then(zip => {
	        return zip;
	      }).catch(err => {
	        console.error('[Archive] open error', err);
	        throw err;
	      });
	    }
	    /**
	     * Load and Open an archive
	     */
	    async openUrl(zipUrl, isBase64) {
	      return (0, request_1.default)(zipUrl, 'binary', false, {}).then(data => this.getZip().loadAsync(data, {
	        base64: isBase64
	      }));
	    }
	    async request(url, type) {
	      let response;
	      if (type === 'blob') {
	        response = this.getBlob(url, undefined);
	      } else {
	        response = this.getText(url);
	      }
	      if (!response) {
	        console.error('[Archive] request: file not found', url);
	        return Promise.reject({
	          message: 'File not found in the epub: ' + url,
	          stack: new Error().stack
	        });
	      }
	      try {
	        const r = await response;
	        return this.handleResponse(r, type);
	      } catch (err) {
	        console.error('[Archive] request error', err);
	        throw err;
	      }
	    }
	    /**
	     * Handle the response from request
	     */
	    handleResponse(response, type) {
	      switch (type) {
	        case 'json':
	          return JSON.parse(response);
	        case 'ncx':
	        case 'opf':
	        case 'xml':
	          return (0, core_1.parse)(response, 'text/xml');
	        case 'xhtml':
	          return (0, core_1.parse)(response, 'application/xhtml+xml');
	        case 'html':
	        case 'htm':
	          return (0, core_1.parse)(response, 'text/html');
	        default:
	          return response;
	      }
	    }
	    /**
	     * Get a Blob from Archive by Url
	     */
	    getBlob(url, mimeType) {
	      const decodededUrl = decodeURIComponent(url.slice(1)); // Remove first slash
	      const entry = this.getZip().file(decodededUrl);
	      if (entry) {
	        mimeType = mimeType || mime_1.default.lookup(entry.name);
	        return entry.async('uint8array').then(function (uint8array) {
	          return new Blob([new Uint8Array(uint8array)], {
	            type: mimeType
	          });
	        }).catch(err => {
	          console.error('[Archive] getBlob error', err);
	          throw err;
	        });
	      } else {
	        return Promise.reject({
	          message: 'File not found in the epub: ' + url,
	          stack: new Error().stack
	        });
	      }
	    }
	    async getText(url) {
	      const decodededUrl = decodeURIComponent(url.slice(1)); // Remove first slash
	      const entry = this.getZip().file(decodededUrl);
	      if (entry) {
	        return entry.async('string').then(text => {
	          return text;
	        }).catch(err => {
	          console.error('[Archive] getText error', err);
	          throw err;
	        });
	      } else {
	        return Promise.reject({
	          message: 'File not found in the epub: ' + url,
	          stack: new Error().stack
	        });
	      }
	    }
	    /**
	     * Get a base64 encoded result from Archive by Url
	     */
	    async getBase64(url, mimeType) {
	      const decodededUrl = decodeURIComponent(url.slice(1)); // Remove first slash
	      const entry = this.getZip().file(decodededUrl);
	      if (entry) {
	        mimeType = mimeType || mime_1.default.lookup(entry.name);
	        return entry.async('base64').then(function (data) {
	          return 'data:' + mimeType + ';base64,' + data;
	        });
	      } else {
	        console.error('[Archive] getBase64: file not found', url);
	        return Promise.reject({
	          message: 'File not found in the epub: ' + url,
	          stack: new Error().stack
	        });
	      }
	    }
	    /**
	     * Create a Url from an unarchived item
	     */
	    async createUrl(url, options) {
	      const _URL = window.URL || window.webkitURL;
	      const useBase64 = options && options.base64;
	      if (url in this.urlCache) {
	        return this.urlCache[url];
	      }
	      if (useBase64) {
	        const response = this.getBase64(url);
	        if (!response) {
	          return Promise.reject({
	            message: 'File not found in the epub: ' + url,
	            stack: new Error().stack
	          });
	        }
	        const tempUrl = await response;
	        this.urlCache[url] = tempUrl;
	        return tempUrl;
	      }
	      const response = this.getBlob(url);
	      if (!response) {
	        return Promise.reject({
	          message: 'File not found in the epub: ' + url,
	          stack: new Error().stack
	        });
	      }
	      const blob = await response;
	      const tempUrl = _URL.createObjectURL(blob);
	      this.urlCache[url] = tempUrl;
	      return tempUrl;
	    }
	    /**
	     * Revoke Temp Url for a archive item
	     */
	    revokeUrl(url) {
	      const _URL = window.URL || window.webkitURL;
	      const fromCache = this.urlCache[url];
	      if (fromCache) _URL.revokeObjectURL(fromCache);
	    }
	    destroy() {
	      const _URL = window.URL || window.webkitURL;
	      for (const fromCache in this.urlCache) {
	        _URL.revokeObjectURL(fromCache);
	      }
	      this.zip = undefined;
	      this.urlCache = {};
	    }
	    getZip() {
	      if (!this.zip) {
	        const JSZipConstructor = window.JSZip || jszip_1.default;
	        this.zip = new JSZipConstructor();
	      }
	      return this.zip;
	    }
	  }
	  archive.default = Archive;
	  return archive;
	}

	var store = {};

	/*!
	    localForage -- Offline Storage, Improved
	    Version 1.10.0
	    https://localforage.github.io/localForage
	    (c) 2013-2017 Mozilla, Apache License 2.0
	*/
	(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f();}else {var g;if(typeof window!=="undefined"){g=window;}else if(typeof global$1!=="undefined"){g=global$1;}else if(typeof self!=="undefined"){g=self;}else {g=this;}g.localforage = f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

	}).call(this,typeof global$1 !== "undefined" ? global$1 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
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

	}).call(this,typeof global$1 !== "undefined" ? global$1 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
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

	var localforage = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

	var require$$5 = /*@__PURE__*/getAugmentedNamespace(localforage);

	var hasRequiredStore;
	function requireStore() {
	  if (hasRequiredStore) return store;
	  hasRequiredStore = 1;
	  var __importDefault = store && store.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(store, "__esModule", {
	    value: true
	  });
	  const utils_1 = requireUtils();
	  const request_1 = __importDefault(requireRequest());
	  const mime_1 = __importDefault(requireMime());
	  const path_1 = __importDefault(requirePath());
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const localforage_1 = __importDefault(require$$5);
	  /**
	   * Handles saving and requesting files from local storage
	   * @param {string} name This should be the name of the application for modals
	   * @param {function} [requester]
	   * @param {function} [resolver]
	   */
	  class Store {
	    constructor(name, requester, resolver) {
	      this.urlCache = {};
	      this.online = true;
	      this._status = undefined;
	      this.storage = undefined;
	      this.name = name;
	      this.requester = requester || request_1.default;
	      this.resolver = resolver;
	      this.checkRequirements();
	      this.addListeners();
	    }
	    /**
	     * Checks to see if localForage exists in global namspace,
	     * Requires localForage if it isn't there
	     */
	    checkRequirements() {
	      try {
	        if (typeof localforage_1.default === 'undefined') {
	          throw new Error('localForage lib not loaded');
	        }
	        this.storage = localforage_1.default.createInstance({
	          name: this.name
	        });
	      } catch (error) {
	        // Re-throw the original error if it's not about localforage being undefined
	        if (error instanceof Error && error.message === 'localForage lib not loaded') {
	          throw error;
	        }
	        // For other errors, preserve the original error message
	        throw new Error(`Failed to initialize localForage storage: ${error instanceof Error ? error.message : String(error)}`);
	      }
	    }
	    /**
	     * Add online and offline event listeners
	     */
	    addListeners() {
	      this._status = this.status.bind(this);
	      window.addEventListener('online', this._status);
	      window.addEventListener('offline', this._status);
	    }
	    /**
	     * Remove online and offline event listeners
	     */
	    removeListeners() {
	      if (!this._status) return;
	      window.removeEventListener('online', this._status);
	      window.removeEventListener('offline', this._status);
	      this._status = undefined;
	    }
	    /**
	     * Update the online / offline status
	     */
	    status() {
	      const online = navigator.onLine;
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
	     * @return {Promise<Array<unknown>>} array of stored objects (typically ArrayBuffers for binary resources)
	     */
	    async add(resources, force = false) {
	      const mapped = resources.resources.map(item => {
	        const {
	          href
	        } = item;
	        const url = this.resolver(href);
	        const encodedUrl = window.encodeURIComponent(url);
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
	     */
	    async put(url, withCredentials, headers) {
	      const encodedUrl = window.encodeURIComponent(url);
	      return this.storage.getItem(encodedUrl).then(result => {
	        if (!result) {
	          return this.requester(url, 'binary', withCredentials ?? false, headers ?? {}).then(data => {
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
	    async request(url, type, withCredentials = false, headers = {}) {
	      if (this.online) {
	        // From network
	        return this.requester(url, type, withCredentials, headers).then(data => {
	          // save to store if not present
	          this.put(url, withCredentials, headers);
	          return data;
	        });
	      } else {
	        // From store
	        return this.retrieve(url, type);
	      }
	    }
	    /**
	     * Request a url from storage
	     */
	    async retrieve(url, type) {
	      const path = new path_1.default(url);
	      // If type isn't set, determine it from the file extension
	      if (!type) {
	        type = path.extension;
	      }
	      let response;
	      if (type == 'blob') {
	        response = this.getBlob(url);
	      } else {
	        response = this.getText(url);
	      }
	      return response.then(r => {
	        const deferred = new utils_1.defer();
	        let result;
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
	     */
	    handleResponse(response, type) {
	      if (type === 'json') {
	        return JSON.parse(response);
	      }
	      if ((0, utils_1.isXml)(type)) {
	        return (0, utils_1.parse)(response, 'text/xml');
	      }
	      if (type === 'xhtml') {
	        return (0, utils_1.parse)(response, 'application/xhtml+xml');
	      }
	      if (type === 'html' || type === 'htm') {
	        return (0, utils_1.parse)(response, 'text/html');
	      }
	      return response;
	    }
	    /**
	     * Get a Blob from Storage by Url
	     */
	    async getBlob(url, mimeType) {
	      const encodedUrl = window.encodeURIComponent(url);
	      return this.storage.getItem(encodedUrl).then(function (uint8array) {
	        if (!uint8array) return;
	        mimeType = mimeType || mime_1.default.lookup(url);
	        return new Blob([uint8array], {
	          type: mimeType
	        });
	      });
	    }
	    /**
	     * Get Text from Storage by Url
	     */
	    async getText(url, mimeType) {
	      const encodedUrl = window.encodeURIComponent(url);
	      mimeType = mimeType || mime_1.default.lookup(url);
	      return this.storage.getItem(encodedUrl).then(function (uint8array) {
	        const deferred = new utils_1.defer();
	        const reader = new FileReader();
	        if (!uint8array) return;
	        const blob = new Blob([uint8array], {
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
	     * @return base64 encoded
	     */
	    async getBase64(url, mimeType) {
	      const encodedUrl = window.encodeURIComponent(url);
	      mimeType = mimeType || mime_1.default.lookup(url);
	      return this.storage.getItem(encodedUrl).then(uint8array => {
	        const deferred = new utils_1.defer();
	        const reader = new FileReader();
	        if (!uint8array) return;
	        const blob = new Blob([uint8array], {
	          type: mimeType
	        });
	        reader.addEventListener('loadend', () => {
	          deferred.resolve(reader.result);
	        });
	        reader.readAsDataURL(blob);
	        return deferred.promise;
	      });
	    }
	    /**
	     * Create a Url from a stored item
	     */
	    createUrl(url, options) {
	      const deferred = new utils_1.defer();
	      const _URL = window.URL || window.webkitURL;
	      const useBase64 = options && options.base64;
	      if (url in this.urlCache) {
	        deferred.resolve(this.urlCache[url]);
	        return deferred.promise;
	      }
	      const response = useBase64 ? this.getBase64(url) : this.getBlob(url);
	      if (!response) {
	        deferred.reject({
	          message: 'File not found in storage: ' + url,
	          stack: new Error().stack
	        });
	        return deferred.promise;
	      }
	      response.then(result => {
	        if (!result) return;
	        const tempUrl = typeof result === 'string' ? result : _URL.createObjectURL(result);
	        this.urlCache[url] = tempUrl;
	        deferred.resolve(tempUrl);
	      });
	      return deferred.promise;
	    }
	    /**
	     * Revoke Temp Url for a archive item
	     */
	    revokeUrl(url) {
	      const _URL = window.URL || window.webkitURL;
	      const fromCache = this.urlCache[url];
	      if (fromCache) _URL.revokeObjectURL(fromCache);
	    }
	    destroy() {
	      const _URL = window.URL || window.webkitURL;
	      for (const fromCache in this.urlCache) {
	        _URL.revokeObjectURL(fromCache);
	      }
	      this.urlCache = {};
	      this.removeListeners();
	    }
	  }
	  (0, event_emitter_1.default)(Store.prototype);
	  store.default = Store;
	  return store;
	}

	var displayoptions = {};

	var hasRequiredDisplayoptions;
	function requireDisplayoptions() {
	  if (hasRequiredDisplayoptions) return displayoptions;
	  hasRequiredDisplayoptions = 1;
	  Object.defineProperty(displayoptions, "__esModule", {
	    value: true
	  });
	  /**
	   * Open DisplayOptions Format Parser
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
	     */
	    parse(displayOptionsDocument) {
	      if (!displayOptionsDocument) {
	        return this;
	      }
	      const displayOptionsNode = displayOptionsDocument.querySelector('display_options');
	      if (!displayOptionsNode) {
	        return this;
	      }
	      const options = displayOptionsNode.querySelectorAll('option');
	      options.forEach(el => {
	        let value = '';
	        if (el.childNodes.length) {
	          value = el.childNodes[0].nodeValue ?? '';
	        }
	        const name = el.getAttribute('name');
	        switch (name) {
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
	  displayoptions.default = DisplayOptions;
	  return displayoptions;
	}

	var hasRequiredBook;
	function requireBook() {
	  if (hasRequiredBook) return book;
	  hasRequiredBook = 1;
	  var __importDefault = book && book.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(book, "__esModule", {
	    value: true
	  });
	  const event_emitter_1 = __importDefault(requireEventEmitter());
	  const core_1 = requireCore();
	  const url_1 = __importDefault(requireUrl());
	  const path_1 = __importDefault(requirePath());
	  const spine_1 = __importDefault(requireSpine());
	  const locations_1 = __importDefault(requireLocations());
	  const container_1 = __importDefault(requireContainer());
	  const packaging_1 = __importDefault(requirePackaging());
	  const navigation_1 = __importDefault(requireNavigation());
	  const resources_1 = __importDefault(requireResources());
	  const pagelist_1 = __importDefault(requirePagelist());
	  const rendition_1 = __importDefault(requireRendition());
	  const archive_1 = __importDefault(requireArchive());
	  const request_1 = __importDefault(requireRequest());
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  const store_1 = __importDefault(requireStore());
	  const displayoptions_1 = __importDefault(requireDisplayoptions());
	  const constants_1 = requireConstants();
	  const epub_enums_1 = requireEpubEnums();
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
	   *
	   * @example new Book("/path/to/book.epub", {})
	   * @example new Book({ replacements: "blobUrl" })
	   */
	  class Book {
	    constructor(url, options) {
	      this.settings = {};
	      this.isOpen = false;
	      this.isRendered = false;
	      this.archived = false;
	      // Allow passing just options to the Book
	      if (typeof options === 'undefined' && typeof url !== 'string' && url instanceof Blob === false && url instanceof ArrayBuffer === false) {
	        options = url;
	        url = undefined;
	      }
	      this.settings = (0, core_1.extend)(this.settings || {}, {
	        requestMethod: undefined,
	        requestCredentials: undefined,
	        requestHeaders: undefined,
	        encoding: undefined,
	        replacements: undefined,
	        canonical: undefined,
	        openAs: undefined,
	        store: undefined
	      });
	      if (options) (0, core_1.extend)(this.settings, options);
	      // Promises
	      this.opening = new core_1.defer();
	      this.opened = this.opening.promise;
	      this.loading = {
	        manifest: new core_1.defer(),
	        spine: new core_1.defer(),
	        metadata: new core_1.defer(),
	        cover: new core_1.defer(),
	        navigation: new core_1.defer(),
	        pageList: new core_1.defer(),
	        resources: new core_1.defer(),
	        displayOptions: new core_1.defer(),
	        packaging: new core_1.defer()
	      };
	      this.loaded = {
	        manifest: this.loading.manifest.promise,
	        spine: this.loading.spine.promise,
	        metadata: this.loading.metadata.promise,
	        cover: this.loading.cover.promise,
	        navigation: this.loading.navigation.promise,
	        pageList: this.loading.pageList.promise,
	        resources: this.loading.resources.promise,
	        displayOptions: this.loading.displayOptions.promise,
	        packaging: this.loading.packaging.promise
	      };
	      this.ready = Promise.all([this.loaded.manifest, this.loaded.spine, this.loaded.metadata, this.loaded.cover, this.loaded.navigation, this.loaded.resources, this.loaded.displayOptions, this.loaded.packaging]);
	      this.request = this.settings.requestMethod || request_1.default;
	      this.spine = new spine_1.default();
	      this.locations = new locations_1.default(this.spine, path => this.load(path));
	      this.navigation = undefined;
	      this.pageList = undefined;
	      this.url = undefined;
	      this.path = undefined;
	      this.archive = undefined;
	      this.storage = undefined;
	      this.resources = undefined;
	      this.rendition = undefined;
	      this.container = undefined;
	      this.packaging = undefined;
	      this.displayOptions = undefined;
	      // this.toc = undefined;
	      if (this.settings.store) {
	        this.store(this.settings.store);
	      }
	      if (url) {
	        this.open(url, this.settings.openAs).catch(() => {
	          const err = new Error('Cannot load book at ' + url);
	          this.emit(constants_1.EVENTS.BOOK.OPEN_FAILED, err);
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
	    async open(input, what) {
	      let opening;
	      const type = what || this.determineType(input);
	      // Convert Blob to ArrayBuffer if needed
	      if (input instanceof Blob) {
	        return input.arrayBuffer().then(buffer => this.open(buffer, what));
	      }
	      switch (type) {
	        case INPUT_TYPE.BINARY:
	        case INPUT_TYPE.BASE64:
	          this.archived = true;
	          this.url = new url_1.default('/', '');
	          opening = this.openEpub(input, type === INPUT_TYPE.BASE64 ? type : undefined);
	          break;
	        case INPUT_TYPE.EPUB:
	          this.archived = true;
	          this.url = new url_1.default('/', '');
	          if (typeof input === 'string') {
	            opening = this.request(input, 'binary', this.settings.requestCredentials, this.settings.requestHeaders).then(data => {
	              if (data instanceof ArrayBuffer) {
	                return this.openEpub(data);
	              }
	              throw new Error('Expected ArrayBuffer for openEpub');
	            });
	          } else {
	            throw new Error('Input must be a string for request');
	          }
	          break;
	        case INPUT_TYPE.OPF:
	          this.url = new url_1.default(input);
	          opening = this.settings.keepAbsoluteUrl ? this.openPackaging(input) : this.openPackaging(this.url.Path.toString());
	          break;
	        case INPUT_TYPE.MANIFEST:
	          this.url = new url_1.default(input);
	          opening = this.settings.keepAbsoluteUrl ? this.openManifest(input) : this.openManifest(this.url.Path.toString());
	          break;
	        default:
	          this.url = new url_1.default(input);
	          opening = this.openContainer(CONTAINER_PATH).then(packagePath => this.openPackaging(packagePath));
	      }
	      return opening;
	    }
	    /**
	     * Open an archived epub
	     */
	    async openEpub(data, encoding) {
	      const isBase64 = (encoding || this.settings.encoding) === 'base64';
	      return this.unarchive(data, isBase64).then(() => {
	        return this.openContainer(CONTAINER_PATH);
	      }).then(packagePath => {
	        return this.openPackaging(packagePath);
	      });
	    }
	    /**
	     * Open the epub container
	     */
	    async openContainer(url) {
	      return this.load(url).then(xml => {
	        this.container = new container_1.default(xml);
	        const packagePath = this.container.packagePath;
	        const resolvedPath = this.resolve(packagePath ?? '');
	        if (!resolvedPath) throw new Error('Cannot resolve packagePath');
	        return resolvedPath;
	      }).catch(err => {
	        console.error('DEBUG: Error in openContainer:', err);
	        throw err;
	      });
	    }
	    /**
	     * Open the Open Packaging Format Xml
	     */
	    async openPackaging(url) {
	      this.path = new path_1.default(url);
	      return this.load(url).then(xml => {
	        this.packaging = new packaging_1.default(xml);
	        return this.unpack(this.packaging);
	      });
	    }
	    /**
	     * Open the manifest JSON
	     */
	    async openManifest(url) {
	      this.path = new path_1.default(url);
	      return this.load(url).then(json => {
	        this.packaging = new packaging_1.default();
	        const manifestObj = JSON.parse(json);
	        this.packaging.load(manifestObj);
	        return this.unpack(this.packaging);
	      });
	    }
	    /**
	     * Load a resource from the Book
	     */
	    load(path) {
	      const resolved = this.resolve(path);
	      if (resolved === undefined) {
	        throw new Error('Cannot resolve path: ' + path);
	      }
	      if (this.archived) {
	        // Determine type based on file extension
	        const extension = path.split('.').pop()?.toLowerCase();
	        let type;
	        if (extension === 'xml' || path.includes('container.xml') || path.includes('.opf')) {
	          type = 'xml';
	        } else if (extension === 'xhtml') {
	          type = 'xhtml';
	        } else if (extension === 'html' || extension === 'htm') {
	          type = 'html';
	        } else if (extension === 'json') {
	          type = 'json';
	        } else if (extension === 'ncx') {
	          type = 'ncx';
	        }
	        if (!type) {
	          throw new Error(`Unsupported file extension for archived resource: ${extension}`);
	        }
	        if (this.archive === undefined) {
	          throw new Error('Archive is not defined. Cannot load resource.');
	        }
	        // Type assertion: Archive.request returns correct type for known extensions
	        return this.archive.request(resolved, type);
	      }
	      return this.request(resolved, '', this.settings.requestCredentials, this.settings.requestHeaders);
	    }
	    /**
	     * Resolve a path to it's absolute position in the Book
	     */
	    resolve(path, absolute) {
	      if (!path) return;
	      let resolved = path;
	      const isAbsolute = typeof path === 'string' && (path.startsWith('/') || path.indexOf('://') > -1);
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
	     */
	    canonical(path) {
	      let url = path;
	      if (!path) {
	        return '';
	      }
	      if (this.settings.canonical) {
	        url = this.settings.canonical(path);
	      } else {
	        url = this.resolve(path, true) ?? '';
	      }
	      return url;
	    }
	    /**
	     * Determine the type of they input passed to open
	     */
	    determineType(input) {
	      if (this.settings.encoding === 'base64') {
	        return INPUT_TYPE.BASE64;
	      }
	      if (typeof input === 'string') {
	        const url = new url_1.default(input);
	        const path = url.path();
	        let extension = path.extension;
	        // If there's a search string, remove it before determining type
	        if (extension) {
	          extension = extension.replace(/\?.*$/, '');
	        }
	        switch (extension) {
	          case undefined:
	          case '':
	            return INPUT_TYPE.DIRECTORY;
	          case 'epub':
	            return INPUT_TYPE.EPUB;
	          case 'opf':
	            return INPUT_TYPE.OPF;
	          case 'json':
	            return INPUT_TYPE.MANIFEST;
	          default:
	            return INPUT_TYPE.BINARY;
	        }
	      }
	      if (typeof Blob !== 'undefined' && input instanceof Blob) {
	        return INPUT_TYPE.BINARY;
	      }
	      if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
	        return INPUT_TYPE.BINARY;
	      }
	      return INPUT_TYPE.BINARY;
	    }
	    /**
	     * unpack the contents of the Books packaging
	     */
	    unpack(packaging) {
	      this.packaging = packaging;
	      this.loading.packaging.resolve(this.packaging);
	      // Always attempt to load iBooks display options
	      this.load(this.url?.resolve(IBOOKS_DISPLAY_OPTIONS_PATH) ?? '').then(xml => {
	        this.displayOptions = new displayoptions_1.default(xml);
	        this.applyDisplayOptionsOverrides(this.displayOptions);
	        this.loading.displayOptions.resolve(this.displayOptions);
	      }).catch(() => {
	        this.displayOptions = new displayoptions_1.default();
	        this.loading.displayOptions.resolve(this.displayOptions);
	      });
	      this.spine?.unpack(this.packaging, (path, absolute) => this.resolve(path, absolute) ?? '', path => this.canonical(path) ?? '');
	      this.resources = new resources_1.default(this.packaging.manifest, {
	        archive: this.archive,
	        resolver: (path, absolute) => this.resolve(path, absolute) ?? '',
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
	          return this.loaded.displayOptions.then(() => {
	            this.opening.resolve(this);
	          });
	        }).catch(err => {
	          this.opening.reject(err);
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
	     */
	    async loadNavigation(packaging) {
	      const navPath = packaging.navPath || packaging.ncxPath;
	      const toc = packaging.toc;
	      // From json manifest
	      if (toc) {
	        return new Promise(resolve => {
	          this.navigation = new navigation_1.default(toc);
	          if (packaging.pageList) {
	            this.pageList = new pagelist_1.default(packaging.pageList); // TODO: handle page lists from Manifest
	          }
	          resolve(this.navigation);
	        });
	      }
	      if (!navPath) {
	        return new Promise(resolve => {
	          this.navigation = new navigation_1.default();
	          this.pageList = new pagelist_1.default();
	          resolve(this.navigation);
	        });
	      }
	      return this.load(navPath).then(xml => {
	        this.navigation = new navigation_1.default(xml);
	        this.pageList = new pagelist_1.default(xml);
	        return this.navigation;
	      });
	    }
	    /**
	     * Gets a Section of the Book from the Spine
	     * Alias for `book.spine.get`
	     */
	    section(target) {
	      return this.spine?.get(target) || null;
	    }
	    /**
	     * Sugar to render a book to an element
	     */
	    renderTo(element, options) {
	      this.rendition = new rendition_1.default(this, options);
	      this.rendition.attachTo(element);
	      return this.rendition;
	    }
	    /**
	     * Set if request should use withCredentials
	     */
	    setRequestCredentials(credentials) {
	      this.settings.requestCredentials = credentials;
	    }
	    /**
	     * Set headers request should use
	     */
	    setRequestHeaders(headers) {
	      this.settings.requestHeaders = headers;
	    }
	    /**
	     * Unarchive a zipped epub
	     */
	    async unarchive(input, isBase64) {
	      this.archive = new archive_1.default();
	      return this.archive.open(input, isBase64).then(result => {
	        return result;
	      }).catch(err => {
	        throw err;
	      });
	    }
	    /**
	     * Store the epubs contents
	     */
	    store(name) {
	      const replacementsSetting = this.settings.replacements && this.settings.replacements !== 'none';
	      const originalUrl = this.url;
	      const requester = this.settings.requestMethod || request_1.default.bind(this);
	      this.storage = new store_1.default(name, requester, (path, absolute) => this.resolve(path, absolute) ?? '');
	      // Replace request method to go through store
	      this.request = (url, type, withCredentials = false, headers = {}) => {
	        return this.storage.request(url, type, withCredentials, headers);
	      };
	      (async () => {
	        await this.opened;
	        if (this.archived && this.archive && this.storage) {
	          const archive = this.archive;
	          this.storage.requester = (url, type) => {
	            if (['xml', 'xhtml', 'html', 'json', 'ncx'].includes(type)) {
	              return archive.request(url, type);
	            }
	            return Promise.reject(new Error(`Unsupported archive type: ${type}`));
	          };
	        }
	        // Substitute hook
	        const substituteResources = (output, section) => {
	          if (this.resources) {
	            section.output = this.resources.substitute(output, section.url);
	          }
	        };
	        if (this.resources) {
	          this.resources.settings.replacements = typeof replacementsSetting === 'string' ? replacementsSetting : 'blobUrl';
	          await this.resources.replacements();
	          await this.resources.replaceCss();
	        }
	        if (this.storage) {
	          if (typeof this.storage.on === 'function') {
	            this.storage.on('offline', () => {
	              this.url = new url_1.default('/', '');
	              if (this.spine?.hooks?.serialize) {
	                this.spine.hooks.serialize.register(substituteResources);
	              }
	            });
	            this.storage.on('online', () => {
	              this.url = originalUrl;
	              if (this.spine?.hooks?.serialize) {
	                this.spine.hooks.serialize.deregister(substituteResources);
	              }
	            });
	          }
	        }
	      })();
	      return this.storage;
	    }
	    /**
	     * Get the cover url
	     */
	    async coverUrl() {
	      await this.loaded?.cover;
	      if (!this.cover) return null;
	      if (this.archived && this.archive) return this.archive.createUrl(this.cover);
	      return this.archived ? null : this.cover;
	    }
	    /**
	     * Load replacement urls
	     */
	    async replacements() {
	      if (!this.spine || !this.resources) return;
	      this.spine.hooks.serialize.register((output, section) => {
	        section.output = this.resources.substitute(output, section.url);
	      });
	      await this.resources.replacements();
	      await this.resources.replaceCss();
	    }
	    /**
	     * Find a DOM Range for a given CFI Range
	     */
	    async getRange(cfiRange) {
	      const cfi = new epubcfi_1.default(cfiRange);
	      if (this.spine === undefined) {
	        return Promise.reject('CFI could not be found, because there is no spine object');
	      }
	      const item = this.spine.get(cfi.spinePos);
	      const _request = this.load;
	      if (!item) return Promise.reject('CFI could not be found');
	      return item.load(_request).then(function () {
	        if (!item.document) return null;
	        return cfi.toRange(item.document);
	      });
	    }
	    /**
	     * Generates the Book Key using the identifier in the manifest or other string provided
	     * @param [identifier] to use instead of metadata identifier
	     */
	    key(identifier) {
	      const ident = identifier || this.packaging?.metadata.identifier || this.url?.filename;
	      return `epubjs:${constants_1.EPUBJS_VERSION}:${ident}`;
	    }
	    /**
	     * Apply iBooks display options overrides to packaging metadata
	     */
	    applyDisplayOptionsOverrides(displayOptions) {
	      if (!this.packaging || !this.packaging.metadata) return;
	      // fixedLayout: 'true'|'false' (maps to layout)
	      if (displayOptions.fixedLayout === 'true') {
	        this.packaging.metadata.layout = 'pre-paginated';
	      } else if (displayOptions.fixedLayout === 'false') {
	        this.packaging.metadata.layout = 'reflowable';
	      }
	      // orientationLock: 'landscape'|'portrait' (maps to orientation)
	      if (displayOptions.orientationLock === 'landscape' || displayOptions.orientationLock === 'portrait') {
	        this.packaging.metadata.orientation = displayOptions.orientationLock;
	      }
	      // openToSpread: use getValidOrDefault for type safety
	      this.packaging.metadata.spread = (0, core_1.getValidOrDefault)(displayOptions.openToSpread, epub_enums_1.Spread, epub_enums_1.DEFAULT_SPREAD);
	    }
	    /**
	     * Destroy the Book and all associated objects
	     */
	    destroy() {
	      this.opened = undefined;
	      this.loading = undefined;
	      this.loaded = undefined;
	      // @ts-expect-error this is only at destroy time
	      this.ready = undefined;
	      this.isOpen = false;
	      this.isRendered = false;
	      this.spine?.destroy();
	      this.locations?.destroy();
	      this.pageList?.destroy();
	      this.archive?.destroy();
	      this.resources?.destroy();
	      this.container?.destroy();
	      this.packaging?.destroy();
	      this.rendition?.destroy();
	      this.displayOptions?.destroy();
	      // @ts-expect-error this is only at destroy time
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
	  (0, event_emitter_1.default)(Book.prototype);
	  book.default = Book;
	  return book;
	}

	var hasRequiredEpub;
	function requireEpub() {
	  if (hasRequiredEpub) return epub$1;
	  hasRequiredEpub = 1;
	  var __createBinding = epub$1 && epub$1.__createBinding || (Object.create ? function (o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = {
	        enumerable: true,
	        get: function () {
	          return m[k];
	        }
	      };
	    }
	    Object.defineProperty(o, k2, desc);
	  } : function (o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	  });
	  var __setModuleDefault = epub$1 && epub$1.__setModuleDefault || (Object.create ? function (o, v) {
	    Object.defineProperty(o, "default", {
	      enumerable: true,
	      value: v
	    });
	  } : function (o, v) {
	    o["default"] = v;
	  });
	  var __importStar = epub$1 && epub$1.__importStar || function () {
	    var ownKeys = function (o) {
	      ownKeys = Object.getOwnPropertyNames || function (o) {
	        var ar = [];
	        for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
	        return ar;
	      };
	      return ownKeys(o);
	    };
	    return function (mod) {
	      if (mod && mod.__esModule) return mod;
	      var result = {};
	      if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	      __setModuleDefault(result, mod);
	      return result;
	    };
	  }();
	  var __importDefault = epub$1 && epub$1.__importDefault || function (mod) {
	    return mod && mod.__esModule ? mod : {
	      "default": mod
	    };
	  };
	  Object.defineProperty(epub$1, "__esModule", {
	    value: true
	  });
	  epub$1.utils = epub$1.Contents = epub$1.Rendition = epub$1.EpubCFI = epub$1.Book = void 0;
	  const book_1 = __importDefault(requireBook());
	  epub$1.Book = book_1.default;
	  const rendition_1 = __importDefault(requireRendition());
	  epub$1.Rendition = rendition_1.default;
	  const epubcfi_1 = __importDefault(requireEpubcfi());
	  epub$1.EpubCFI = epubcfi_1.default;
	  const contents_1 = __importDefault(requireContents());
	  epub$1.Contents = contents_1.default;
	  const utils = __importStar(requireCore());
	  epub$1.utils = utils;
	  const constants_1 = requireConstants();
	  const ePub = function (url, options) {
	    return new book_1.default(url, options);
	  };
	  // Attach version and helpers like the original JS entry did
	  ePub.VERSION = constants_1.EPUBJS_VERSION;
	  if (typeof commonjsGlobal !== 'undefined') {
	    commonjsGlobal.EPUBJS_VERSION = constants_1.EPUBJS_VERSION;
	  }
	  ePub.Book = book_1.default;
	  ePub.Rendition = rendition_1.default;
	  ePub.Contents = contents_1.default;
	  ePub.CFI = epubcfi_1.default;
	  ePub.utils = utils;
	  epub$1.default = ePub;
	  return epub$1;
	}

	var epubExports = requireEpub();
	var epub = /*@__PURE__*/getDefaultExportFromCjs(epubExports);

	return epub;

}));
//# sourceMappingURL=epub.umd.js.map
