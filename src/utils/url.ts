import Path from './path';
import path from 'path-webpack';

/**
 * creates a Url object for parsing and manipulation of a url string
 * @param	{string} urlString	a url string (relative or absolute)
 * @param	{string} [baseString] optional base for the url,
 * default to window.location.href
 */
class Url {
  Url: URL | undefined;
  Path: Path;
  href: string;
  protocol: string;
  origin: string;
  hash: string;
  search: string;
  base: string | undefined;
  directory: string;
  filename: string;
  extension: string;

  constructor(urlString: string, baseString?: string | undefined) {
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

    if (
      !absolute &&
      baseString !== undefined &&
      typeof baseString !== 'string' &&
      window &&
      window.location
    ) {
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
      } catch {
        // Skip URL parsing
        this.Url = undefined;

        // resolve the pathname from the base
        if (this.base) {
          basePath = new Path(this.base);
          pathname = basePath.resolve(pathname);
        }
      }
    }

    this.Path = new Path(pathname);
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
  resolve(what: string) {
    const isAbsolute = what.indexOf('://') > -1;
    if (isAbsolute) {
      return what;
    }
    const fullpath = path.resolve(this.directory, what);
    return this.origin + fullpath;
  }

  /**
   * Resolve a path relative to the url
   */
  relative(what: string) {
    return path.relative(what, this.directory);
  }

  toString() {
    return this.href;
  }
}

export default Url;
