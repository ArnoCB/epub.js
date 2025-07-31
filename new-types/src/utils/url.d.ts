import Path from './path';
/**
 * creates a Url object for parsing and manipulation of a url string
 * @param	{string} urlString	a url string (relative or absolute)
 * @param	{string} [baseString] optional base for the url,
 * default to window.location.href
 */
declare class Url {
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
    constructor(urlString: string, baseString?: string | undefined);
    path(): Path;
    /**
     * Resolves a relative path to a absolute url
     */
    resolve(what: string): string;
    /**
     * Resolve a path relative to the url
     */
    relative(what: string): string;
    toString(): string;
}
export default Url;
