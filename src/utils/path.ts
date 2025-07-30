import path from 'path-webpack';

/**
 * Creates a Path object for parsing and manipulation of a path strings
 *
 * Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
 * @param	pathString	a url string (relative or absolute)
 * @class
 */
class Path {
  private _path: string;
  private _directory: string;
  private _filename: string;
  private _extension: string;

  constructor(pathString: string) {
    const protocol = pathString.indexOf('://');

    let normalized: string;
    if (protocol > -1) {
      // Remote URL: preserve as-is
      normalized = pathString;
    } else {
      // Local path: normalize backslashes and collapse multiple slashes
      normalized = pathString.replace(/\\/g, '/').replace(/\/+/g, '/');
    }

    const parsed = this.parse(normalized);

    this._path = normalized;

    const dir = this.isDirectory(normalized) ? normalized : parsed.dir + '/';
    this._directory =
      protocol > -1
        ? dir // remote: preserve
        : dir.replace(/\/+/g, '/'); // local: collapse multiple slashes
    if (!this._directory.endsWith('/')) this._directory += '/';

    this._filename = parsed.base;
    this._extension = parsed.ext.slice(1);
  }

  public get directory(): string {
    return this._directory;
  }

  public get path(): string {
    return this._path;
  }

  public get filename(): string {
    return this._filename;
  }

  public get extension(): string {
    return this._extension;
  }

  /**
   * Parse the path: https://nodejs.org/api/path.html#path_path_parse_path
   * Mimics Node.js path.parse for POSIX paths.
   */
  parse(what: string) {
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
  isAbsolute(what: string | undefined): boolean {
    return path.isAbsolute(what || this.path);
  }

  /**
   * Check if path ends with a directory
   * @param	{string} what
   * @returns {boolean}
   */
  isDirectory(what: string): boolean {
    return what.charAt(what.length - 1) === '/';
  }

  /**
   * Resolve a path against the directory of the Path.
   * Joins this.directory and what, normalizing slashes.
   * https://nodejs.org/api/path.html#path_path_resolve_paths
   * @param	{string} what
   * @returns {string} resolved

   */
  resolve(what: string): string {
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
    const stack: string[] = [];

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
  relative(what: string): string {
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

export default Path;
