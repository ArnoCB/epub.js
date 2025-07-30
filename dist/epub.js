import * as __WEBPACK_EXTERNAL_MODULE_JSZip__ from "JSZip";
/******/ var __webpack_modules__ = ({

/***/ 10:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


/*
 From Zip.js, by Gildas Lormeau
edited down
 */
__webpack_unused_export__ = ({
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
exports.A = {
  lookup: lookup
};

/***/ }),

/***/ 11:
/***/ ((module) => {



// eslint-disable-next-line no-empty-function
module.exports = function () {};


/***/ }),

/***/ 17:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.sg = debounce;
exports.nF = throttle;
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

/***/ }),

/***/ 68:
/***/ ((module, exports, __webpack_require__) => {



var d        = __webpack_require__(263)
  , callable = __webpack_require__(499)

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


/***/ }),

/***/ 80:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isPrototype = __webpack_require__(202);

module.exports = function (value) {
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


/***/ }),

/***/ 93:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(380)() ? Object.keys : __webpack_require__(232);


/***/ }),

/***/ 134:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isValue = __webpack_require__(762);

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};


/***/ }),

/***/ 148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isValue = __webpack_require__(762);

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};


/***/ }),

/***/ 175:
/***/ ((module) => {



// ES3 safe
var _undefined = void 0;

module.exports = function (value) { return value !== _undefined && value !== null; };


/***/ }),

/***/ 181:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isValue = __webpack_require__(175);

// prettier-ignore
var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

module.exports = function (value) {
	if (!isValue(value)) return false;
	return hasOwnProperty.call(possibleTypes, typeof value);
};


/***/ }),

/***/ 202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isObject = __webpack_require__(181);

module.exports = function (value) {
	if (!isObject(value)) return false;
	try {
		if (!value.constructor) return false;
		return value.constructor.prototype === value;
	} catch (error) {
		return false;
	}
};


/***/ }),

/***/ 209:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.qY = exports.py = exports.JX = void 0;
exports.JX = '0.3';
// Dom events to listen for
exports.py = ['keydown', 'keyup', 'keypressed', 'mouseup', 'mousedown', 'mousemove', 'click', 'touchend', 'touchstart', 'touchmove'];
exports.qY = {
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

/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(525)() ? String.prototype.contains : __webpack_require__(521);


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isValue = __webpack_require__(762);

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };


/***/ }),

/***/ 263:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isValue         = __webpack_require__(175)
  , isPlainFunction = __webpack_require__(873)
  , assign          = __webpack_require__(596)
  , normalizeOpts   = __webpack_require__(148)
  , contains        = __webpack_require__(214);

var d = (module.exports = function (dscr, value/*, options*/) {
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


/***/ }),

/***/ 293:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var path_1 = __importDefault(__webpack_require__(821));
var path_webpack_1 = __importDefault(__webpack_require__(841));
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
      console.log('[Url] base set from window.location.href:', this.base);
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
  Url.prototype.path = function () {
    return this.Path;
  };
  /**
   * Resolves a relative path to a absolute url
   */
  Url.prototype.resolve = function (what) {
    var isAbsolute = what.indexOf('://') > -1;
    if (isAbsolute) {
      return what;
    }
    var fullpath = path_webpack_1.default.resolve(this.directory, what);
    return this.origin + fullpath;
  };
  /**
   * Resolve a path relative to the url
   */
  Url.prototype.relative = function (what) {
    return path_webpack_1.default.relative(what, this.directory);
  };
  Url.prototype.toString = function () {
    return this.href;
  };
  return Url;
}();
exports["default"] = Url;

/***/ }),

/***/ 339:
/***/ ((module) => {



module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};


/***/ }),

/***/ 375:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.replaceBase = replaceBase;
exports.replaceCanonical = replaceCanonical;
exports.replaceMeta = replaceMeta;
exports.replaceLinks = replaceLinks;
exports.substitute = substitute;
var url_1 = __importDefault(__webpack_require__(293));
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
        linkUrl_1 = new url_1.default(href, location);
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

/***/ }),

/***/ 380:
/***/ ((module) => {



module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};


/***/ }),

/***/ 381:
/***/ ((__unused_webpack_module, exports) => {



/**
 * Core Utilities and Helpers
 * @module Core
 */
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
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

/***/ }),

/***/ 481:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are async.
 * @example this.content = new EPUBJS.Hook(this);
 */
__webpack_unused_export__ = ({
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
exports.A = Hook;

/***/ }),

/***/ 499:
/***/ ((module) => {



module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};


/***/ }),

/***/ 521:
/***/ ((module) => {



var indexOf = String.prototype.indexOf;

module.exports = function (searchString /*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};


/***/ }),

/***/ 525:
/***/ ((module) => {



var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return str.contains("dwa") === true && str.contains("foo") === false;
};


/***/ }),

/***/ 595:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var keys  = __webpack_require__(93)
  , value = __webpack_require__(134)
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
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


/***/ }),

/***/ 596:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(339)() ? Object.assign : __webpack_require__(595);


/***/ }),

/***/ 762:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _undefined = __webpack_require__(11)(); // Support ES3 engines

module.exports = function (val) { return val !== _undefined && val !== null; };


/***/ }),

/***/ 763:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __generator = this && this.__generator || function (thisArg, body) {
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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var core_1 = __webpack_require__(381);
var Queue = /** @class */function () {
  function Queue(context) {
    this._q = [];
    this.context = context;
    this.tick = core_1.requestAnimationFrame;
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
exports["default"] = Queue;

/***/ }),

/***/ 790:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
(function(f){if(true){module.exports=f()}else // removed by dead control flow
{ var g; }})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=undefined;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=undefined;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict';
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

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
'use strict';
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
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(2);
}

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"2":2}],4:[function(_dereq_,module,exports){
'use strict';

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


/***/ }),

/***/ 821:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var path_webpack_1 = __importDefault(__webpack_require__(841));
/**
 * Creates a Path object for parsing and manipulation of a path strings
 *
 * Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
 * @param	pathString	a url string (relative or absolute)
 * @class
 */
var Path = /** @class */function () {
  function Path(pathString) {
    var protocol = pathString.indexOf('://');
    if (protocol > -1) {
      pathString = new URL(pathString).pathname;
    }
    var parsed = this.parse(pathString);
    this._path = pathString;
    if (this.isDirectory(pathString)) {
      this._directory = pathString;
    } else {
      this._directory = parsed.dir + '/';
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
   */
  Path.prototype.parse = function (what) {
    return path_webpack_1.default.parse(what);
  };
  /**
   * @param	{string} what
   * @returns {boolean}
   */
  Path.prototype.isAbsolute = function (what) {
    return path_webpack_1.default.isAbsolute(what || this.path);
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
   * Resolve a path against the directory of the Path
   *
   * https://nodejs.org/api/path.html#path_path_resolve_paths
   * @param	{string} what
   * @returns {string} resolved
   */
  Path.prototype.resolve = function (what) {
    return path_webpack_1.default.resolve(this.directory, what);
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
    return path_webpack_1.default.relative(this.directory, what);
  };
  Path.prototype.toString = function () {
    return this.path;
  };
  return Path;
}();
exports["default"] = Path;

/***/ }),

/***/ 841:
/***/ ((module) => {



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
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
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


module.exports = posix;


/***/ }),

/***/ 873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isFunction = __webpack_require__(80);

var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

module.exports = function (value) {
	if (!isFunction(value)) return false;
	if (classRe.test(functionToString.call(value))) return false;
	return true;
};


/***/ }),

/***/ 889:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var core_1 = __webpack_require__(381);
var path_1 = __importDefault(__webpack_require__(821));
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
      type = new path_1.default(url).extension;
    }
    if (type == 'blob') {
      xhr.responseType = BLOB_RESPONSE;
    }
    if ((0, core_1.isXml)(type)) {
      // xhr.responseType = "document";
      xhr.overrideMimeType('text/xml'); // for OPF parsing
    }
    if (type == 'xhtml') {
      // xhr.responseType = "document";
    }
    if (type == 'html' || type == 'htm') {
      // xhr.responseType = "document";
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
exports["default"] = request;

/***/ }),

/***/ 895:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Ay = scrollType;
__webpack_unused_export__ = createDefiner;
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

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/global */
/******/ (() => {
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/event-emitter/index.js
var event_emitter = __webpack_require__(68);
var event_emitter_default = /*#__PURE__*/__webpack_require__.n(event_emitter);
// EXTERNAL MODULE: ./src/utils/core.js
var core = __webpack_require__(381);
// EXTERNAL MODULE: ./src/utils/url.js
var utils_url = __webpack_require__(293);
var url_default = /*#__PURE__*/__webpack_require__.n(utils_url);
// EXTERNAL MODULE: ./src/utils/path.js
var utils_path = __webpack_require__(821);
var path_default = /*#__PURE__*/__webpack_require__.n(utils_path);
;// ./src/epubcfi.js

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
      return (0,core.extend)(this, this.parse(cfiFrom));
    } else if (type === 'range') {
      return (0,core.extend)(this, this.fromRange(cfiFrom, this.base, ignoreClass));
    } else if (type === 'node') {
      return (0,core.extend)(this, this.fromNode(cfiFrom, this.base, ignoreClass));
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
    } else if (cfi && typeof cfi === 'object' && ((0,core.type)(cfi) === 'Range' || typeof cfi.startContainer != 'undefined')) {
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
    if (!(0,core.isNumber)(characterOffset)) {
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
      if (curr.previousSibling.nodeType === ELEMENT_NODE) {
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
      if (currNodeType === ELEMENT_NODE && children[i].classList.contains(ignoreClass)) {
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
    if (anchor.nodeType === ELEMENT_NODE) {
      children = anchor.parentNode.children;
      if (!children) {
        children = (0,core.findChildren)(anchor.parentNode);
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
    if (anchor.nodeType === ELEMENT_NODE) {
      children = anchor.parentNode.children;
      map = this.normalizedMap(children, ELEMENT_NODE, ignoreClass);
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
          children = container.children || (0,core.findChildren)(container);
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
          if (child.nodeType === ELEMENT_NODE) {
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
/* harmony default export */ const epubcfi = (EpubCFI);
// EXTERNAL MODULE: ./src/utils/hook.js
var hook = __webpack_require__(481);
// EXTERNAL MODULE: ./src/utils/replacements.js
var replacements = __webpack_require__(375);
// EXTERNAL MODULE: ./src/utils/request.js
var utils_request = __webpack_require__(889);
var request_default = /*#__PURE__*/__webpack_require__.n(utils_request);
;// ./src/section.js







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
      this.hooks.serialize = new hook/* default */.A(this);
      this.hooks.content = new hook/* default */.A(this);
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
    var request = _request || this.request || (request_default());
    var loading = new core.defer();
    var loaded = loading.promise;
    if (this.contents) {
      loading.resolve(this.contents);
    } else {
      request(this.url).then(function (xml) {
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
    return (0,replacements.replaceBase)(this.document, this);
  }

  /**
   * Render the contents of a section
   * @param  {method} [_request] a request method to use for loading
   * @return {string} output a serialized XML Document
   */
  render(_request) {
    var rendering = new core.defer();
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
    (0,core.sprint)(section.document, function (node) {
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
    return new epubcfi(_range, this.cfiBase).toString();
  }

  /**
   * Get a CFI from an Element in the Section
   * @param  {element} el
   * @return {string} cfi an EpubCFI string
   */
  cfiFromElement(el) {
    return new epubcfi(el, this.cfiBase).toString();
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
/* harmony default export */ const section = (Section);
;// ./src/spine.js





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
    this.hooks.serialize = new hook/* default */.A();
    this.hooks.content = new hook/* default */.A();

    // Register replacements
    this.hooks.content.register(replacements.replaceBase);
    this.hooks.content.register(replacements.replaceCanonical);
    this.hooks.content.register(replacements.replaceMeta);
    this.epubcfi = new epubcfi();
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
      spineItem = new section(item, this.hooks);
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
      let cfi = new epubcfi(target);
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
/* harmony default export */ const spine = (Spine);
// EXTERNAL MODULE: ./src/utils/queue.js
var queue = __webpack_require__(763);
var queue_default = /*#__PURE__*/__webpack_require__.n(queue);
// EXTERNAL MODULE: ./src/utils/constants.js
var constants = __webpack_require__(209);
;// ./src/locations.js






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
    this.q = new (queue_default())(this);
    this.epubcfi = new epubcfi();
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
      var completed = new core.defer();
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
    var body = (0,core.qs)(doc, 'body');
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
          let cfi = new epubcfi(range, cfiBase).toString();
          locations.push(cfi);
          counter = 0;
        }
      }
      prev = node;
    };
    (0,core.sprint)(body, parser.bind(this));

    // Close remaining
    if (range && range.startContainer && prev) {
      range.endContainer = prev;
      range.endOffset = prev.length;
      let cfi = new epubcfi(range, cfiBase).toString();
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
    var start = startCfi ? new epubcfi(startCfi) : undefined;
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
      var completed = new core.defer();
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
    var body = (0,core.qs)(doc, 'body');
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
          let cfi = new epubcfi(node, cfiBase);
          locations.push({
            cfi: cfi.toString(),
            wordCount: this._wordCounter
          });
          this._wordCounter = 0;
        }
      }
    };
    (0,core.sprint)(body, parser.bind(this));
    return locations;
  }

  /**
   * Get a location from an EpubCFI
   * @param {EpubCFI} cfi
   * @return {number}
   */
  locationFromCfi(cfi) {
    let loc;
    if (epubcfi.prototype.isCfiString(cfi)) {
      cfi = new epubcfi(cfi);
    }
    // Check if the location has not been set yet
    if (this._locations.length === 0) {
      return -1;
    }
    loc = (0,core.locationOf)(cfi, this._locations, this.epubcfi.compare);
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
      let cfi = new epubcfi(this._locations[this.total]);
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
    this.emit(constants/* EVENTS */.qY.LOCATIONS.CHANGED, {
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
event_emitter_default()(Locations.prototype);
/* harmony default export */ const locations = (Locations);
// EXTERNAL MODULE: ./node_modules/path-webpack/path.js
var path = __webpack_require__(841);
var path_webpack_path_default = /*#__PURE__*/__webpack_require__.n(path);
;// ./src/container.js



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
    rootfile = (0,core.qs)(containerDocument, 'rootfile');
    if (!rootfile) {
      throw new Error('No RootFile Found');
    }
    this.packagePath = rootfile.getAttribute('full-path');
    this.directory = path_webpack_path_default().dirname(this.packagePath);
    this.encoding = containerDocument.xmlEncoding;
  }
  destroy() {
    this.packagePath = undefined;
    this.directory = undefined;
    this.encoding = undefined;
  }
}
/* harmony default export */ const container = (Container);
;// ./src/packaging.js

const packaging_ELEMENT_NODE = 1;
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
  return indexOfNode(elementNode, packaging_ELEMENT_NODE);
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
    metadataNode = (0,core.qs)(packageDocument, 'metadata');
    if (!metadataNode) {
      throw new Error('No Metadata Found');
    }
    manifestNode = (0,core.qs)(packageDocument, 'manifest');
    if (!manifestNode) {
      throw new Error('No Manifest Found');
    }
    spineNode = (0,core.qs)(packageDocument, 'spine');
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
    var selected = (0,core.qsa)(manifestXml, 'item');
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
    var selected = (0,core.qsa)(spineXml, 'itemref');
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
    var node = (0,core.qsp)(manifestNode, 'item', {
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
    var node = (0,core.qsp)(manifestNode, 'item', {
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
    var pkg = (0,core.qs)(packageXml, 'package');
    pkg.getAttribute('version');

    // Try parsing cover with epub 3.
    // var node = packageXml.querySelector("item[properties='cover-image']");
    var node = (0,core.qsp)(packageXml, 'item', {
      properties: 'cover-image'
    });
    if (node) return node.getAttribute('href');

    // Fallback to epub 2.
    var metaCover = (0,core.qsp)(packageXml, 'meta', {
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
    var el = (0,core.qsp)(xml, 'meta', {
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
/* harmony default export */ const packaging = (Packaging);
;// ./src/navigation.js


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
      html = (0,core.qs)(xml, 'html');
      ncx = (0,core.qs)(xml, 'ncx');
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
    var navElement = (0,core.querySelectorByType)(navHtml, 'nav', 'toc');
    var list = [];
    if (!navElement) return list;
    let navList = (0,core.filterChildren)(navElement, 'ol', true);
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
    let content = (0,core.filterChildren)(item, 'a', true) || (0,core.filterChildren)(item, 'span', true);
    if (!content) {
      return;
    }
    let src = content.getAttribute('href') || '';
    if (!id) {
      id = src;
    }
    let text = content.textContent || '';
    let subitems = [];
    let nested = (0,core.filterChildren)(item, 'ol', true);
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
    var navElement = (0,core.querySelectorByType)(navHtml, 'nav', 'landmarks');
    var navItems = navElement ? (0,core.qsa)(navElement, 'li') : [];
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
    let content = (0,core.filterChildren)(item, 'a', true);
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
    var navPoints = (0,core.qsa)(tocXml, 'navPoint');
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
      content = (0,core.qs)(item, 'content'),
      src = content.getAttribute('src'),
      navLabel = (0,core.qs)(item, 'navLabel'),
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
/* harmony default export */ const navigation = (Navigation);
// EXTERNAL MODULE: ./src/utils/mime.js
var mime = __webpack_require__(10);
;// ./src/resources.js







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
    var parsedUrl = new (url_default())(url);
    var mimeType = mime/* default */.A.lookup(parsedUrl.filename);
    if (this.settings.archive) {
      return this.settings.archive.createUrl(url, {
        base64: this.settings.replacements === 'base64'
      });
    } else {
      if (this.settings.replacements === 'base64') {
        return this.settings.request(url, 'blob').then(blob => {
          return (0,core.blob2base64)(blob);
        }).then(blob => {
          return (0,core.createBase64Url)(blob, mimeType);
        });
      } else {
        return this.settings.request(url, 'blob').then(blob => {
          return (0,core.createBlobUrl)(blob, mimeType);
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
    if (path_webpack_path_default().isAbsolute(href)) {
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
      var relative = new (path_default())(absolute).relative(resolved);
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
      text = (0,replacements.substitute)(text, relUrls, this.replacementUrls);

      // Get the new url
      if (this.settings.replacements === 'base64') {
        newUrl = (0,core.createBase64Url)(text, 'text/css');
      } else {
        newUrl = (0,core.createBlobUrl)(text, 'text/css');
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
      var relative = new (path_default())(absolute).relative(resolved);
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
    return (0,replacements.substitute)(content, relUrls, this.replacementUrls);
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
/* harmony default export */ const resources = (Resources);
;// ./src/pagelist.js



/**
 * Page List Parser
 * @param {document} [xml]
 */
class PageList {
  constructor(xml) {
    this.pages = [];
    this.locations = [];
    this.epubcfi = new epubcfi();
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
    var html = (0,core.qs)(xml, 'html');
    var ncx = (0,core.qs)(xml, 'ncx');
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
    var navElement = (0,core.querySelectorByType)(navHtml, 'nav', 'page-list');
    var navItems = navElement ? (0,core.qsa)(navElement, 'li') : [];
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
    pageList = (0,core.qs)(navXml, 'pageList');
    if (!pageList) return list;
    pageTargets = (0,core.qsa)(pageList, 'pageTarget');
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
    var navLabel = (0,core.qs)(item, 'navLabel');
    var navLabelText = (0,core.qs)(navLabel, 'text');
    var pageText = navLabelText.textContent;
    var content = (0,core.qs)(item, 'content');
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
    var content = (0,core.qs)(item, 'a'),
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
    var index = (0,core.indexOfSorted)(cfi, this.locations, this.epubcfi.compare);
    if (index != -1) {
      pg = this.pages[index];
    } else {
      // Otherwise add it to the list of locations
      // Insert it in the correct position in the locations page
      //index = EPUBJS.core.insert(cfi, this.locations, this.epubcfi.compare);
      index = (0,core.locationOf)(cfi, this.locations, this.epubcfi.compare);
      // Get the page at the location just before the new one, or return the first
      pg = index - 1 >= 0 ? this.pages[index - 1] : this.pages[0];
      if (pg !== undefined) {
        // Add the new page in so that the locations and page array match up
        //this.pages.splice(index, 0, pg);
      } else {
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
/* harmony default export */ const pagelist = (PageList);
;// ./src/layout.js




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
      let newProps = (0,core.extend)(this.props, props);
      this.emit(constants/* EVENTS */.qY.LAYOUT.UPDATED, newProps, props);
    }
  }
}
event_emitter_default()(Layout.prototype);
/* harmony default export */ const layout = (Layout);
;// ./src/themes.js


/**
 * Themes to apply to displayed content
 * @class
 * @param {Rendition} rendition
 */
class Themes {
  constructor(rendition) {
    this.rendition = rendition;
    this._themes = {
      default: {
        rules: {},
        url: '',
        serialized: ''
      }
    };
    this._overrides = {};
    this._current = 'default';
    this._injected = [];
    this.rendition.hooks.content.register(this.inject.bind(this));
    this.rendition.hooks.content.register(this.overrides.bind(this));
  }

  /**
   * Add themes to be used by a rendition
   * @param {object | Array<object> | string}
   * @example themes.register("light", "http://example.com/light.css")
   * @example themes.register("light", { "body": { "color": "purple"}})
   * @example themes.register({ "light" : {...}, "dark" : {...}})
   */
  register() {
    if (arguments.length === 0) {
      return;
    }
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      return this.registerThemes(arguments[0]);
    }
    if (arguments.length === 1 && typeof arguments[0] === 'string') {
      return this.default(arguments[0]);
    }
    if (arguments.length === 2 && typeof arguments[1] === 'string') {
      return this.registerUrl(arguments[0], arguments[1]);
    }
    if (arguments.length === 2 && typeof arguments[1] === 'object') {
      return this.registerRules(arguments[0], arguments[1]);
    }
  }

  /**
   * Add a default theme to be used by a rendition
   * @param {object | string} theme
   * @example themes.register("http://example.com/default.css")
   * @example themes.register({ "body": { "color": "purple"}})
   */
  default(theme) {
    if (!theme) {
      return;
    }
    if (typeof theme === 'string') {
      return this.registerUrl('default', theme);
    }
    if (typeof theme === 'object') {
      return this.registerRules('default', theme);
    }
  }

  /**
   * Register themes object
   * @param {object} themes
   */
  registerThemes(themes) {
    for (var theme in themes) {
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
   * @param {string} name
   * @param {string} css
   */
  registerCss(name, css) {
    this._themes[name] = {
      serialized: css
    };
    if (this._injected[name] || name == 'default') {
      this.update(name);
    }
  }

  /**
   * Register a url
   * @param {string} name
   * @param {string} input
   */
  registerUrl(name, input) {
    var url = new (url_default())(input);
    this._themes[name] = {
      url: url.toString()
    };
    if (this._injected[name] || name == 'default') {
      this.update(name);
    }
  }

  /**
   * Register rule
   * @param {string} name
   * @param {object} rules
   */
  registerRules(name, rules) {
    this._themes[name] = {
      rules: rules
    };
    // TODO: serialize css rules
    if (this._injected[name] || name == 'default') {
      this.update(name);
    }
  }

  /**
   * Select a theme
   * @param {string} name
   */
  select(name) {
    var prev = this._current;
    var contents;
    this._current = name;
    this.update(name);
    contents = this.rendition.getContents();
    contents.forEach(content => {
      content.removeClass(prev);
      content.addClass(name);
    });
  }

  /**
   * Update a theme
   * @param {string} name
   */
  update(name) {
    var contents = this.rendition.getContents();
    contents.forEach(content => {
      this.add(name, content);
    });
  }

  /**
   * Inject all themes into contents
   * @param {Contents} contents
   */
  inject(contents) {
    var links = [];
    var themes = this._themes;
    var theme;
    for (var name in themes) {
      if (Object.prototype.hasOwnProperty.call(themes, name) && (name === this._current || name === 'default')) {
        theme = themes[name];
        if (theme.rules && Object.keys(theme.rules).length > 0 || theme.url && links.indexOf(theme.url) === -1) {
          this.add(name, contents);
        }
        this._injected.push(name);
      }
    }
    if (this._current != 'default') {
      contents.addClass(this._current);
    }
  }

  /**
   * Add Theme to contents
   * @param {string} name
   * @param {Contents} contents
   */
  add(name, contents) {
    var theme = this._themes[name];
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
   * @param {string} name
   * @param {string} value
   * @param {boolean} priority
   */
  override(name, value, priority) {
    var contents = this.rendition.getContents();
    this._overrides[name] = {
      value: value,
      priority: priority === true
    };
    contents.forEach(content => {
      content.css(name, this._overrides[name].value, this._overrides[name].priority);
    });
  }
  removeOverride(name) {
    var contents = this.rendition.getContents();
    delete this._overrides[name];
    contents.forEach(content => {
      content.css(name);
    });
  }

  /**
   * Add all overrides
   * @param {Content} content
   */
  overrides(contents) {
    var overrides = this._overrides;
    for (var rule in overrides) {
      if (Object.prototype.hasOwnProperty.call(overrides, rule)) {
        contents.css(rule, overrides[rule].value, overrides[rule].priority);
      }
    }
  }

  /**
   * Adjust the font size of a rendition
   * @param {number} size
   */
  fontSize(size) {
    this.override('font-size', size);
  }

  /**
   * Adjust the font-family of a rendition
   * @param {string} f
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
/* harmony default export */ const themes = (Themes);
;// ./src/annotations.js




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
    let cfi = new epubcfi(cfiRange);
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
    this.emit(constants/* EVENTS */.qY.ANNOTATION.ATTACH, result);
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
    this.emit(constants/* EVENTS */.qY.ANNOTATION.DETACH, result);
    return result;
  }

  /**
   * [Not Implemented] Get text of an annotation
   * @TODO: needs implementation in contents
   */
  text() {}
}
event_emitter_default()(Annotation.prototype);
/* harmony default export */ const annotations = (Annotations);
;// ./src/mapping.js



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
      let startRange = new epubcfi(result.start).toRange(doc);
      let endRange = new epubcfi(result.end).toRange(doc);
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
        elPos = (0,core.nodeBounds)(node);
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
        elPos = (0,core.nodeBounds)(node);
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
    let startCfi = new epubcfi(startRange, cfiBase).toString();
    let endCfi = new epubcfi(endRange, cfiBase).toString();
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
/* harmony default export */ const src_mapping = (Mapping);
;// ./src/contents.js






const hasNavigator = typeof navigator !== 'undefined';
const isChrome = hasNavigator && /Chrome/.test(navigator.userAgent);
const isWebkit = hasNavigator && !isChrome && /AppleWebKit/.test(navigator.userAgent);
const contents_ELEMENT_NODE = 1;

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
    this.epubcfi = new epubcfi();
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
    this.epubReadingSystem('epub.js', constants/* EPUBJS_VERSION */.JX);
    this.called = 0;
    this.active = true;
    this.listeners();
  }

  /**
   * Get DOM events that are listened for and passed along
   */
  static get listenedEvents() {
    return constants/* DOM_EVENTS */.py;
  }

  /**
   * Get or Set width
   * @param {number} [w]
   * @returns {number} width
   */
  width(w) {
    // var frame = this.documentElement;
    var frame = this.content;
    if (w && (0,core.isNumber)(w)) {
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
    if (h && (0,core.isNumber)(h)) {
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
    if (w && (0,core.isNumber)(w)) {
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
    if (h && (0,core.isNumber)(h)) {
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
    let border = (0,core.borders)(content);

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
    settings = (0,core.defaults)(options || {}, parsed);
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
    this.emit(constants/* EVENTS */.qY.CONTENTS.EXPAND);
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
      this.emit(constants/* EVENTS */.qY.CONTENTS.RESIZE, this._size);
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
      let range = new epubcfi(target).toRange(this.document, ignoreClass);
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
              if (container.nodeType === contents_ELEMENT_NODE) {
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
    constants/* DOM_EVENTS */.py.forEach(function (eventName) {
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
    constants/* DOM_EVENTS */.py.forEach(function (eventName) {
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
        cfirange = new epubcfi(range, this.cfiBase).toString();
        this.emit(constants/* EVENTS */.qY.CONTENTS.SELECTED, cfirange);
        this.emit(constants/* EVENTS */.qY.CONTENTS.SELECTED_RANGE, range);
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
    var cfi = new epubcfi(_cfi);
    return cfi.toRange(this.document, ignoreClass);
  }

  /**
   * Get an EpubCFI from a Dom Range
   * @param {Range} range
   * @param {string} [ignoreClass]
   * @returns {EpubCFI} cfi
   */
  cfiFromRange(range, ignoreClass) {
    return new epubcfi(range, this.cfiBase, ignoreClass).toString();
  }

  /**
   * Get an EpubCFI from a Dom node
   * @param {node} node
   * @param {string} [ignoreClass]
   * @returns {EpubCFI} cfi
   */
  cfiFromNode(node, ignoreClass) {
    return new epubcfi(node, this.cfiBase, ignoreClass).toString();
  }

  // TODO: find where this is used - remove?
  map(layout) {
    var map = new src_mapping(layout);
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
    let COLUMN_AXIS = (0,core.prefixed)('column-axis');
    let COLUMN_GAP = (0,core.prefixed)('column-gap');
    let COLUMN_WIDTH = (0,core.prefixed)('column-width');
    let COLUMN_FILL = (0,core.prefixed)('column-fill');
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
    var mapping = new src_mapping(layout, dev);
    return mapping.page(this, cfiBase, start, end);
  }

  /**
   * Emit event when link in content is clicked
   * @private
   */
  linksHandler() {
    (0,replacements.replaceLinks)(this.content, href => {
      this.emit(constants/* EVENTS */.qY.CONTENTS.LINK_CLICKED, href);
    });
  }

  /**
   * Set the writingMode of the text
   * @param {string} [mode="horizontal-tb"] "horizontal-tb" | "vertical-rl" | "vertical-lr"
   */
  writingMode(mode) {
    let WRITING_MODE = (0,core.prefixed)('writing-mode');
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
event_emitter_default()(Contents.prototype);
/* harmony default export */ const contents = (Contents);
;// ./node_modules/marks-pane/dist/marks-pane.esm.js
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


//# sourceMappingURL=marks-pane.esm.js.map

;// ./src/managers/views/iframe.js







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
    this.settings = (0,core.extend)({
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
    this.id = 'epubjs-view-' + (0,core.uuid)();
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
    this.epubcfi = new epubcfi();
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
    this.elementBounds = (0,core.bounds)(this.element);

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
      this.emit(constants/* EVENTS */.qY.VIEWS.AXIS, axis);
      this.setWritingMode(writingMode);
      this.emit(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, writingMode);

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
      this.emit(constants/* EVENTS */.qY.VIEWS.LOAD_ERROR, e);
      return new Promise((resolve, reject) => {
        reject(e);
      });
    }.bind(this)).then(function () {
      this.emit(constants/* EVENTS */.qY.VIEWS.RENDERED, this.section);
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
    var elBorders = (0,core.borders)(this.element);
    var iframeBorders;
    if (this.iframe) {
      iframeBorders = (0,core.borders)(this.iframe);
    } else {
      iframeBorders = {
        width: 0,
        height: 0
      };
    }
    if (what == 'width' && (0,core.isNumber)(width)) {
      this.lockedWidth = width - elBorders.width - iframeBorders.width;
      // this.resize(this.lockedWidth, width); //  width keeps ratio correct
    }
    if (what == 'height' && (0,core.isNumber)(height)) {
      this.lockedHeight = height - elBorders.height - iframeBorders.height;
      // this.resize(width, this.lockedHeight);
    }
    if (what === 'both' && (0,core.isNumber)(width) && (0,core.isNumber)(height)) {
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
    if ((0,core.isNumber)(width)) {
      this.element.style.width = width + 'px';
      this.iframe.style.width = width + 'px';
      this._width = width;
    }
    if ((0,core.isNumber)(height)) {
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
    this.emit(constants/* EVENTS */.qY.VIEWS.RESIZED, size);
    this.prevBounds = size;
    this.elementBounds = (0,core.bounds)(this.element);
  }
  load(contents) {
    var loading = new core.defer();
    var loaded = loading.promise;
    if (!this.iframe) {
      loading.reject(new Error('No Iframe Available'));
      return loaded;
    }
    this.iframe.onload = function (event) {
      this.onLoad(event, loading);
    }.bind(this);
    if (this.settings.method === 'blobUrl') {
      this.blobUrl = (0,core.createBlobUrl)(contents, 'application/xhtml+xml');
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
    this.contents = new contents(this.document, this.document.body, this.section.cfiBase, this.section.index);
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
    this.contents.on(constants/* EVENTS */.qY.CONTENTS.EXPAND, () => {
      if (this.displayed && this.iframe) {
        this.expand();
        if (this.contents) {
          this.layout.format(this.contents);
        }
      }
    });
    this.contents.on(constants/* EVENTS */.qY.CONTENTS.RESIZE, () => {
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
    var displayed = new core.defer();
    if (!this.displayed) {
      this.render(request).then(function () {
        this.emit(constants/* EVENTS */.qY.VIEWS.DISPLAYED, this);
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
    this.emit(constants/* EVENTS */.qY.VIEWS.SHOWN, this);
  }
  hide() {
    // this.iframe.style.display = "none";
    this.element.style.visibility = 'hidden';
    this.iframe.style.visibility = 'hidden';
    this.stopExpanding = true;
    this.emit(constants/* EVENTS */.qY.VIEWS.HIDDEN, this);
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
      this.elementBounds = (0,core.bounds)(this.element);
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
      this.emit(constants/* EVENTS */.qY.VIEWS.MARK_CLICKED, cfiRange, data);
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
      this.emit(constants/* EVENTS */.qY.VIEWS.MARK_CLICKED, cfiRange, data);
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
      this.emit(constants/* EVENTS */.qY.VIEWS.MARK_CLICKED, cfiRange, data);
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
      (0,core.revokeBlobUrl)(this.blobUrl);
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
event_emitter_default()(IframeView.prototype);
/* harmony default export */ const iframe = (IframeView);
// EXTERNAL MODULE: ./src/utils/scrolltype.js
var scrolltype = __webpack_require__(895);
// EXTERNAL MODULE: ./src/utils/helpers.js
var helpers = __webpack_require__(17);
;// ./src/managers/helpers/stage.js


class Stage {
  constructor(_options) {
    this.settings = _options || {};
    this.id = 'epubjs-container-' + (0,core.uuid)();
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
    (0,core.extend)(this.settings, options);
    if (options.height && (0,core.isNumber)(options.height)) {
      height = options.height + 'px';
    }
    if (options.width && (0,core.isNumber)(options.width)) {
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
    if ((0,core.isElement)(_element)) {
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
    if (!(0,core.isNumber)(this.settings.width) || !(0,core.isNumber)(this.settings.height)) {
      this.resizeFunc = (0,helpers/* throttle */.nF)(func, 50);
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
      if ((0,core.isNumber)(width)) {
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
      if ((0,core.isNumber)(height)) {
        this.container.style.height = height + 'px';
      } else {
        this.container.style.height = height;
      }
    }
    if (!(0,core.isNumber)(width)) {
      width = this.container.clientWidth;
    }
    if (!(0,core.isNumber)(height)) {
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
    let _windowBounds = (0,core.windowBounds)();
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
      return (0,core.windowBounds)();
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
/* harmony default export */ const stage = (Stage);
;// ./src/managers/helpers/views.js
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
/* harmony default export */ const views = (Views);
;// ./src/managers/default/index.js








class DefaultViewManager {
  constructor(options) {
    this.name = 'default';
    this.optsSettings = options.settings;
    this.View = options.view;
    this.request = options.request;
    this.renditionQueue = options.queue;
    this.q = new (queue_default())(this);
    this.settings = (0,core.extend)(this.settings || {}, {
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
    (0,core.extend)(this.settings, options.settings || {});
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
    this.settings.rtlScrollType = (0,scrolltype/* default */.Ay)();

    // Save the stage
    this.stage = new stage({
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
    this.views = new views(this.container);

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
      this.emit(constants/* EVENTS */.qY.MANAGERS.ORIENTATION_CHANGE, orientation);
    }.bind(this), 500);
  }
  onResized() {
    this.resize();
  }
  resize(width, height, epubcfi) {
    let stageSize = this.stage.size(width, height);

    // For Safari, wait for orientation to catch up
    // if the window is a square
    this.winBounds = (0,core.windowBounds)();
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
    this.emit(constants/* EVENTS */.qY.MANAGERS.RESIZED, {
      width: this._stageSize.width,
      height: this._stageSize.height
    }, epubcfi);
  }
  createView(section, forceRight) {
    return new this.View(section, (0,core.extend)(this.viewSettings, {
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
    var displaying = new core.defer();
    var displayed = displaying.promise;

    // Check if moving to target is needed
    if (target === section.href || (0,core.isNumber)(target)) {
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
    this.emit(constants/* EVENTS */.qY.MANAGERS.ADDED, view);
  }
  afterResized(view) {
    this.emit(constants/* EVENTS */.qY.MANAGERS.RESIZE, view.section);
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
    view.on(constants/* EVENTS */.qY.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    return view.display(this.request);
  }
  append(section, forceRight) {
    var view = this.createView(section, forceRight);
    this.views.append(view);
    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);
    view.on(constants/* EVENTS */.qY.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    return view.display(this.request);
  }
  prepend(section, forceRight) {
    var view = this.createView(section, forceRight);
    view.on(constants/* EVENTS */.qY.VIEWS.RESIZED, bounds => {
      this.counter(bounds);
    });
    this.views.prepend(view);
    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);
    view.on(constants/* EVENTS */.qY.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, mode => {
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
      this.emit(constants/* EVENTS */.qY.MANAGERS.SCROLL, {
        top: scrollTop,
        left: scrollLeft
      });
      clearTimeout(this.afterScrolled);
      this.afterScrolled = setTimeout(function () {
        this.emit(constants/* EVENTS */.qY.MANAGERS.SCROLLED, {
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
    this.mapping = new src_mapping(layout.props, this.settings.direction, this.settings.axis);
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
      this.mapping = new src_mapping(this.layout.props, this.settings.direction, this.settings.axis);
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
event_emitter_default()(DefaultViewManager.prototype);
/* harmony default export */ const managers_default = (DefaultViewManager);
;// ./src/managers/helpers/snap.js




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
    this.settings = (0,core.extend)({
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
    this.manager.on(constants/* EVENTS */.qY.MANAGERS.ADDED, this._afterDisplayed);
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
    this.manager.off(constants/* EVENTS */.qY.MANAGERS.ADDED, this._afterDisplayed);
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
    const deferred = new core.defer();
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
event_emitter_default()(Snap.prototype);
/* harmony default export */ const snap = (Snap);
;// ./src/managers/continuous/index.js





class ContinuousViewManager extends managers_default {
  constructor(options) {
    super(options);
    this.name = 'continuous';
    this.settings = (0,core.extend)(this.settings || {}, {
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
    (0,core.extend)(this.settings, options.settings || {});

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
    return managers_default.prototype.display.call(this, section, target).then(function () {
      return this.fill();
    }.bind(this));
  }
  fill(_full) {
    var full = _full || new core.defer();
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
    this.emit(constants/* EVENTS */.qY.MANAGERS.RESIZE, view.section);
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
    view.on(constants/* EVENTS */.qY.VIEWS.RESIZED, () => {
      view.expanded = true;
    });
    view.on(constants/* EVENTS */.qY.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });

    // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);
    return view.display(this.request);
  }
  append(section) {
    var view = this.createView(section);
    view.on(constants/* EVENTS */.qY.VIEWS.RESIZED, () => {
      view.expanded = true;
    });
    view.on(constants/* EVENTS */.qY.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, mode => {
      this.updateWritingMode(mode);
    });
    this.views.append(view);
    view.onDisplayed = this.afterDisplayed.bind(this);
    return view;
  }
  prepend(section) {
    var view = this.createView(section);
    view.on(constants/* EVENTS */.qY.VIEWS.RESIZED, bounds => {
      this.counter(bounds);
      view.expanded = true;
    });
    view.on(constants/* EVENTS */.qY.VIEWS.AXIS, axis => {
      this.updateAxis(axis);
    });
    view.on(constants/* EVENTS */.qY.VIEWS.WRITING_MODE, mode => {
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
    var visible = [];
    var offset = typeof _offset != 'undefined' ? _offset : this.settings.offset || 0;
    var isVisible;
    var view;
    var updating = new core.defer();
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
        visible.push(view);
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
    var checking = new core.defer();
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
    var task = new core.defer();
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
      this.snapper = new snap(this, this.settings.snap && typeof this.settings.snap === 'object' && this.settings.snap);
    }
  }
  addScrollListeners() {
    var scroller;
    this.tick = core.requestAnimationFrame;
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
    this._scrolled = (0,helpers/* debounce */.sg)(this.scrolled.bind(this), 30);
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
    this.emit(constants/* EVENTS */.qY.MANAGERS.SCROLL, {
      top: this.scrollTop,
      left: this.scrollLeft
    });
    clearTimeout(this.afterScrolled);
    this.afterScrolled = setTimeout(function () {
      // Don't report scroll if we are about the snap
      if (this.snapper && this.snapper.supportsTouch && this.snapper.needsSnap()) {
        return;
      }
      this.emit(constants/* EVENTS */.qY.MANAGERS.SCROLLED, {
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
      this.snapper = new snap(this, this.settings.snap && typeof this.settings.snap === 'object' && this.settings.snap);
    }
  }
  destroy() {
    super.destroy();
    if (this.snapper) {
      this.snapper.destroy();
    }
  }
}
/* harmony default export */ const continuous = (ContinuousViewManager);
;// ./src/rendition.js






// import Mapping from "./mapping";




// Default Views


// Default View Managers



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
    this.settings = (0,core.extend)(this.settings || {}, {
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
    (0,core.extend)(this.settings, options);
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
    this.hooks.display = new hook/* default */.A(this);
    this.hooks.serialize = new hook/* default */.A(this);
    this.hooks.content = new hook/* default */.A(this);
    this.hooks.unloaded = new hook/* default */.A(this);
    this.hooks.layout = new hook/* default */.A(this);
    this.hooks.render = new hook/* default */.A(this);
    this.hooks.show = new hook/* default */.A(this);
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
    this.themes = new themes(this);

    /**
     * @member {Annotations} annotations
     * @memberof Rendition
     */
    this.annotations = new annotations(this);
    this.epubcfi = new epubcfi();
    this.q = new (queue_default())(this);

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
    this.starting = new core.defer();
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
      viewManager = managers_default;
    } else if (typeof manager === 'string' && manager === 'continuous') {
      viewManager = continuous;
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
      View = iframe;
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
    this.manager.on(constants/* EVENTS */.qY.MANAGERS.ADDED, this.afterDisplayed.bind(this));
    this.manager.on(constants/* EVENTS */.qY.MANAGERS.REMOVED, this.afterRemoved.bind(this));

    // Listen for resizing
    this.manager.on(constants/* EVENTS */.qY.MANAGERS.RESIZED, this.onResized.bind(this));

    // Listen for rotation
    this.manager.on(constants/* EVENTS */.qY.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));

    // Listen for scroll changes
    this.manager.on(constants/* EVENTS */.qY.MANAGERS.SCROLLED, this.reportLocation.bind(this));

    /**
     * Emit that rendering has started
     * @event started
     * @memberof Rendition
     */
    this.emit(constants/* EVENTS */.qY.RENDITION.STARTED);

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
      this.emit(constants/* EVENTS */.qY.RENDITION.ATTACHED);
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
    var displaying = new core.defer();
    var displayed = displaying.promise;
    var section;
    this.displaying = displaying;

    // Check if this is a book percentage
    if (this.book.locations.length() && (0,core.isFloat)(target)) {
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
      this.emit(constants/* EVENTS */.qY.RENDITION.DISPLAYED, section);
      this.reportLocation();
    }, err => {
      /**
       * Emit that has been an error displaying
       * @event displayError
       * @param {Section} section
       * @memberof Rendition
       */
      this.emit(constants/* EVENTS */.qY.RENDITION.DISPLAY_ERROR, err);
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
    view.on(constants/* EVENTS */.qY.VIEWS.MARK_CLICKED, (cfiRange, data) => this.triggerMarkEvent(cfiRange, data, view.contents));
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
          this.emit(constants/* EVENTS */.qY.RENDITION.RENDERED, view.section, view);
        });
      } else {
        this.emit(constants/* EVENTS */.qY.RENDITION.RENDERED, view.section, view);
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
      this.emit(constants/* EVENTS */.qY.RENDITION.REMOVED, view.section, view);
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
    this.emit(constants/* EVENTS */.qY.RENDITION.RESIZED, {
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
    this.emit(constants/* EVENTS */.qY.RENDITION.ORIENTATION_CHANGE, orientation);
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
    if ((this.settings.width === 0 || this.settings.width > 0) && (this.settings.height === 0 || this.settings.height > 0)) {
      // viewport = "width="+this.settings.width+", height="+this.settings.height+"";
    }
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
      this._layout = new layout(settings);
      this._layout.spread(settings.spread, this.settings.minSpreadWidth);

      // this.mapping = new Mapping(this._layout.props);

      this._layout.on(constants/* EVENTS */.qY.LAYOUT.UPDATED, (props, changed) => {
        this.emit(constants/* EVENTS */.qY.RENDITION.LAYOUT, props, changed);
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
            this.emit(constants/* EVENTS */.qY.RENDITION.LOCATION_CHANGED, {
              index: this.location.start.index,
              href: this.location.start.href,
              start: this.location.start.cfi,
              end: this.location.end.cfi,
              percentage: this.location.start.percentage
            });
            this.emit(constants/* EVENTS */.qY.RENDITION.RELOCATED, this.location);
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
          this.emit(constants/* EVENTS */.qY.RENDITION.LOCATION_CHANGED, {
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
          this.emit(constants/* EVENTS */.qY.RENDITION.RELOCATED, this.location);
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
    constants/* DOM_EVENTS */.py.forEach(e => {
      contents.on(e, ev => this.triggerViewEvent(ev, contents));
    });
    contents.on(constants/* EVENTS */.qY.CONTENTS.SELECTED, e => this.triggerSelectedEvent(e, contents));
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
    this.emit(constants/* EVENTS */.qY.RENDITION.SELECTED, cfirange, contents);
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
    this.emit(constants/* EVENTS */.qY.RENDITION.MARK_CLICKED, cfiRange, data, contents);
  }

  /**
   * Get a Range from a Visible CFI
   * @param  {string} cfi EpubCfi String
   * @param  {string} ignoreClass
   * @return {range}
   */
  getRange(cfi, ignoreClass) {
    var _cfi = new epubcfi(cfi);
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
      contents.on(constants/* EVENTS */.qY.CONTENTS.LINK_CLICKED, href => {
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
event_emitter_default()(Rendition.prototype);
/* harmony default export */ const rendition = (Rendition);
;// external "JSZip"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_JSZip_namespaceObject = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_JSZip__["default"]) });
;// ./src/archive.js






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
      this.zip = new external_JSZip_namespaceObject["default"]();
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
    return request_default()(zipUrl, 'binary').then(function (data) {
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
    var deferred = new core.defer();
    var response;
    var path = new (path_default())(url);

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
    } else if ((0,core.isXml)(type)) {
      r = (0,core.parse)(response, 'text/xml');
    } else if (type == 'xhtml') {
      r = (0,core.parse)(response, 'application/xhtml+xml');
    } else if (type == 'html' || type == 'htm') {
      r = (0,core.parse)(response, 'text/html');
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
      mimeType = mimeType || mime/* default */.A.lookup(entry.name);
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
      mimeType = mimeType || mime/* default */.A.lookup(entry.name);
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
    var deferred = new core.defer();
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
/* harmony default export */ const archive = (Archive);
// EXTERNAL MODULE: ./node_modules/localforage/dist/localforage.js
var localforage = __webpack_require__(790);
var localforage_default = /*#__PURE__*/__webpack_require__.n(localforage);
;// ./src/store.js







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
    this.requester = requester || (request_default());
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
      if (typeof (localforage_default()) === 'undefined') {
        store = (localforage_default());
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
    var path = new (path_default())(url);

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
      var deferred = new core.defer();
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
    } else if ((0,core.isXml)(type)) {
      r = (0,core.parse)(response, 'text/xml');
    } else if (type == 'xhtml') {
      r = (0,core.parse)(response, 'application/xhtml+xml');
    } else if (type == 'html' || type == 'htm') {
      r = (0,core.parse)(response, 'text/html');
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
      mimeType = mimeType || mime/* default */.A.lookup(url);
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
    mimeType = mimeType || mime/* default */.A.lookup(url);
    return this.storage.getItem(encodedUrl).then(function (uint8array) {
      var deferred = new core.defer();
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
    mimeType = mimeType || mime/* default */.A.lookup(url);
    return this.storage.getItem(encodedUrl).then(uint8array => {
      var deferred = new core.defer();
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
    var deferred = new core.defer();
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
event_emitter_default()(Store.prototype);
/* harmony default export */ const store = (Store);
;// ./src/displayoptions.js


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
    const displayOptionsNode = (0,core.qs)(displayOptionsDocument, 'display_options');
    if (!displayOptionsNode) {
      return this;
    }
    const options = (0,core.qsa)(displayOptionsNode, 'option');
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
/* harmony default export */ const displayoptions = (DisplayOptions);
;// ./src/book.js


















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
    this.settings = (0,core.extend)(this.settings || {}, {
      requestMethod: undefined,
      requestCredentials: undefined,
      requestHeaders: undefined,
      encoding: undefined,
      replacements: undefined,
      canonical: undefined,
      openAs: undefined,
      store: undefined
    });
    (0,core.extend)(this.settings, options);

    // Promises
    this.opening = new core.defer();
    /**
     * @member {promise} opened returns after the book is loaded
     * @memberof Book
     */
    this.opened = this.opening.promise;
    this.isOpen = false;
    this.loading = {
      manifest: new core.defer(),
      spine: new core.defer(),
      metadata: new core.defer(),
      cover: new core.defer(),
      navigation: new core.defer(),
      pageList: new core.defer(),
      resources: new core.defer(),
      displayOptions: new core.defer()
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
    this.request = this.settings.requestMethod || (request_default());

    /**
     * @member {Spine} spine
     * @memberof Book
     */
    this.spine = new spine();

    /**
     * @member {Locations} locations
     * @memberof Book
     */
    this.locations = new locations(this.spine, this.load.bind(this));

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
        this.emit(constants/* EVENTS */.qY.BOOK.OPEN_FAILED, err);
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
      this.url = new (url_default())('/', '');
      opening = this.openEpub(input);
    } else if (type === INPUT_TYPE.BASE64) {
      this.archived = true;
      this.url = new (url_default())('/', '');
      opening = this.openEpub(input, type);
    } else if (type === INPUT_TYPE.EPUB) {
      this.archived = true;
      this.url = new (url_default())('/', '');
      opening = this.request(input, 'binary', this.settings.requestCredentials, this.settings.requestHeaders).then(this.openEpub.bind(this));
    } else if (type == INPUT_TYPE.OPF) {
      this.url = new (url_default())(input);
      opening = this.openPackaging(this.url.Path.toString());
    } else if (type == INPUT_TYPE.MANIFEST) {
      this.url = new (url_default())(input);
      opening = this.openManifest(this.url.Path.toString());
    } else {
      this.url = new (url_default())(input);
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
      this.container = new container(xml);
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
    this.path = new (path_default())(url);
    return this.load(url).then(xml => {
      this.packaging = new packaging(xml);
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
    this.path = new (path_default())(url);
    return this.load(url).then(json => {
      this.packaging = new packaging();
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
    var resolved = path;
    var isAbsolute = path.indexOf('://') > -1;
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
    url = new (url_default())(input);
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
        this.displayOptions = new displayoptions(xml);
        this.loading.displayOptions.resolve(this.displayOptions);
      }).catch(() => {
        this.displayOptions = new displayoptions();
        this.loading.displayOptions.resolve(this.displayOptions);
      });
    } else {
      this.displayOptions = new displayoptions();
      this.loading.displayOptions.resolve(this.displayOptions);
    }
    this.spine.unpack(this.packaging, this.resolve.bind(this), this.canonical.bind(this));
    this.resources = new resources(this.packaging.manifest, {
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
        this.navigation = new navigation(toc);
        if (packaging.pageList) {
          this.pageList = new pagelist(packaging.pageList); // TODO: handle page lists from Manifest
        }
        resolve(this.navigation);
      });
    }
    if (!navPath) {
      return new Promise(resolve => {
        this.navigation = new navigation();
        this.pageList = new pagelist();
        resolve(this.navigation);
      });
    }
    return this.load(navPath, 'xml').then(xml => {
      this.navigation = new navigation(xml);
      this.pageList = new pagelist(xml);
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
    this.rendition = new rendition(this, options);
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
    this.archive = new archive();
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
    let requester = this.settings.requestMethod || request_default().bind(this);
    // Create new Store
    this.storage = new store(name, requester, this.resolve.bind(this));
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
        this.url = new (url_default())('/', '');
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
    var cfi = new epubcfi(cfiRange);
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
    return `epubjs:${constants/* EPUBJS_VERSION */.JX}:${ident}`;
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
event_emitter_default()(Book.prototype);
/* harmony default export */ const book = (Book);
;// ./src/epub.js







/**
 * Creates a new Book
 * @param {string|ArrayBuffer} url URL, Path or ArrayBuffer
 * @param {object} options to pass to the book
 * @returns {Book} a new Book object
 * @example ePub("/path/to/book.epub", {})
 */
function ePub(url, options) {
  return new book(url, options);
}
ePub.VERSION = constants/* EPUBJS_VERSION */.JX;
if (typeof __webpack_require__.g !== 'undefined') {
  __webpack_require__.g.EPUBJS_VERSION = constants/* EPUBJS_VERSION */.JX;
}
ePub.Book = book;
ePub.Rendition = rendition;
ePub.Contents = contents;
ePub.CFI = epubcfi;
ePub.utils = core;
/* harmony default export */ const epub = (ePub);
export { epub as default };

//# sourceMappingURL=epub.js.map