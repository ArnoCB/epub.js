/**
 * Creates a Path object for parsing and manipulation of a path strings
 *
 * Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
 * @param	pathString	a url string (relative or absolute)
 * @class
 */
declare class Path {
    private _path;
    private _directory;
    private _filename;
    private _extension;
    constructor(pathString: string);
    get directory(): string;
    get path(): string;
    get filename(): string;
    get extension(): string;
    /**
     * Parse the path: https://nodejs.org/api/path.html#path_path_parse_path
     * Mimics Node.js path.parse for POSIX paths.
     */
    parse(what: string): {
        dir: string;
        base: string;
        ext: string;
        name: string;
    };
    /**
     * @param	{string} what
     * @returns {boolean}
     */
    isAbsolute(what: string | undefined): boolean;
    /**
     * Check if path ends with a directory
     * @param	{string} what
     * @returns {boolean}
     */
    isDirectory(what: string): boolean;
    /**
     * Resolve a path against the directory of the Path.
     * Joins this.directory and what, normalizing slashes.
     * https://nodejs.org/api/path.html#path_path_resolve_paths
     * @param	{string} what
     * @returns {string} resolved
  
     */
    resolve(what: string): string;
    /**
     * Resolve a path relative to the directory of the Path
     *
     * https://nodejs.org/api/path.html#path_path_relative_from_to
     * @param	{string} what
     * @returns {string} relative
     */
    relative(what: string): string;
    toString(): string;
}
export default Path;
