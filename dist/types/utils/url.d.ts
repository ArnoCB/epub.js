import Path from './path';
/**
 * Creates a Url object for parsing and manipulation of a url string
 *
 * Defaults to window.location.href
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
