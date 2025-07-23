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

    if (protocol > -1) {
      pathString = new URL(pathString).pathname;
    }

    const parsed = this.parse(pathString);

    this._path = pathString;

    if (this.isDirectory(pathString)) {
      this._directory = pathString;
    } else {
      this._directory = parsed.dir + '/';
    }

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
   */
  parse(what: string) {
    return path.parse(what);
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
   * Resolve a path against the directory of the Path
   *
   * https://nodejs.org/api/path.html#path_path_resolve_paths
   * @param	{string} what
   * @returns {string} resolved
   */
  resolve(what: string): string {
    return path.resolve(this.directory, what);
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

    return path.relative(this.directory, what);
  }

  toString() {
    return this.path;
  }
}

export default Path;
