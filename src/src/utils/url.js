'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('./path'));
/**
 * creates a Url object for parsing and manipulation of a url string
 * @param	{string} urlString	a url string (relative or absolute)
 * @param	{string} [baseString] optional base for the url,
 * default to window.location.href
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
    if (!absolute &&
            baseString !== undefined &&
            typeof baseString !== 'string' &&
            window &&
            window.location) {
      this.base = window.location.href;
    }
    // URL Polyfill doesn't throw an error if base is empty
    if (absolute || this.base) {
      try {
        if (this.base) {
          // Safari doesn't like an undefined base
          this.Url = new URL(urlString, this.base);
        }
        else {
          this.Url = new URL(urlString);
        }
        this.href = this.Url.href;
        this.protocol = this.Url.protocol;
        this.origin = this.Url.origin;
        this.hash = this.Url.hash;
        this.search = this.Url.search;
        pathname = this.Url.pathname + (this.Url.search ? this.Url.search : '');
      }
      catch (_a) {
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
exports.default = Url;
