'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path_webpack_1 = __importDefault(require('path-webpack'));
/**
 * Creates a Path object for parsing and manipulation of a path strings
 *
 * Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
 * @param	pathString	a url string (relative or absolute)
 * @class
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
      this._directory = this.isDirectory(normalized)
        ? normalized
        : parsed.dir + '/';
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
    return { dir, base, ext, name };
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
    if (
      typeof what === 'string' &&
      (what.startsWith('/') || what.indexOf('://') > -1)
    ) {
      throw new Error(
        '[Path.resolve] Cannot resolve an absolute path: ' + what
      );
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
    while (
      i < fromParts.length &&
      i < toParts.length &&
      fromParts[i] === toParts[i]
    ) {
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
exports.default = Path;
