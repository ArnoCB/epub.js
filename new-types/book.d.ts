import type { PackagingManifestJson } from './types/packaging';
import type { PackagingManifestObject } from './packaging';
import EventEmitter from 'event-emitter';
import type { EpubOptions } from './epub.d.ts';
import { defer } from './utils/core';
import Url from './utils/url';
import Path from './utils/path';
import Spine from './spine';
import Locations from './locations';
import Container from './container';
import Packaging from './packaging';
import Navigation from './navigation';
import Resources from './resources';
import PageList from './pagelist';
import Rendition from './rendition';
import Archive from './archive';
import Store from './store';
import DisplayOptions from './displayoptions';
import { Section } from './section';
type EventEmitterMethods = Pick<EventEmitter, 'emit'>;
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
 * @param {boolean} [options.keepAbsoluteUrl=false] whether to keep the absolute URL when opening
 * @param {string} [options.store=false] cache the contents in local storage, value should be the name of the reader
 * @returns {Book}
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */
declare class Book implements EventEmitterMethods {
    emit: EventEmitter['emit'];
    settings: EpubOptions;
    opening: defer<this>;
    opened: Promise<this> | undefined;
    isOpen: boolean;
    loading: {
        manifest: defer<PackagingManifestObject>;
        spine: defer<Spine>;
        metadata: defer<PackagingManifestJson['metadata']>;
        cover: defer<string | undefined>;
        navigation: defer<Navigation | undefined>;
        pageList: defer<PageList | undefined>;
        resources: defer<Resources | undefined>;
        displayOptions: defer<DisplayOptions | undefined>;
        packaging: defer<Packaging>;
    } | undefined;
    loaded: {
        manifest: Promise<PackagingManifestObject>;
        spine: Promise<Spine>;
        metadata: Promise<PackagingManifestJson['metadata']>;
        cover: Promise<string | undefined>;
        navigation: Promise<Navigation | undefined>;
        pageList: Promise<PageList | undefined>;
        resources: Promise<Resources | undefined>;
        displayOptions: Promise<DisplayOptions | undefined>;
        packaging: Promise<Packaging | undefined>;
    } | undefined;
    isRendered: boolean;
    ready: Promise<unknown[]>;
    request: (url: string, type: string, withCredentials?: boolean, headers?: Record<string, string>) => Promise<string | Blob | JSON | Document | XMLDocument>;
    spine: Spine | undefined;
    locations: Locations | undefined;
    navigation: Navigation | undefined;
    pageList: PageList | undefined;
    url: Url | undefined;
    path: Path | undefined;
    private archived;
    archive: Archive | undefined;
    storage: Store | undefined;
    resources: Resources | undefined;
    rendition: Rendition | undefined;
    packaging: Packaging | undefined;
    container: Container | undefined;
    displayOptions: DisplayOptions | undefined;
    cover: string | undefined;
    package: Packaging | undefined;
    constructor(url?: string | Blob | ArrayBuffer | undefined, options?: EpubOptions);
    /**
     * Open a epub or url
     * @param {string | ArrayBuffer} input Url, Path or ArrayBuffer
     * @param {string} [what="binary", "base64", "epub", "opf", "json", "directory"] force opening as a certain type
     * @returns {Promise} of when the book has been loaded
     * @example book.open("/path/to/book.epub")
     */
    open(input: string | ArrayBuffer | Blob, what?: string): Promise<Book | void>;
    /**
     * Open an archived epub
     */
    private openEpub;
    /**
     * Open the epub container
     */
    private openContainer;
    /**
     * Open the Open Packaging Format Xml
     */
    private openPackaging;
    /**
     * Open the manifest JSON
     */
    private openManifest;
    /**
     * Load a resource from the Book
     */
    load<T = unknown>(path: string): Promise<T>;
    /**
     * Resolve a path to it's absolute position in the Book
     */
    resolve(path: string, absolute?: boolean): string | undefined;
    /**
     * Get a canonical link to a path
     */
    canonical(path: string): string;
    /**
     * Determine the type of they input passed to open
     * @private
     * @param  {string} input
     * @return {string}  binary | directory | epub | opf
     */
    determineType(input: string | Blob | ArrayBuffer): string;
    /**
     * unpack the contents of the Books packaging
     * @param {Packaging} packaging object
     */
    private unpack;
    /**
     * Load Navigation and PageList from package
     */
    private loadNavigation;
    /**
     * Gets a Section of the Book from the Spine
     * Alias for `book.spine.get`
     */
    section(target: string): Section | null;
    /**
     * Sugar to render a book to an element
     * @param  {element | string} element element or string to add a rendition to
     * @param  {object} [options]
     * @return {Rendition}
     */
    renderTo(element: HTMLElement | string, options?: object): Rendition;
    /**
     * Set if request should use withCredentials
     */
    setRequestCredentials(credentials: boolean): void;
    /**
     * Set headers request should use
     */
    setRequestHeaders(headers: Record<string, string>): void;
    /**
     * Unarchive a zipped epub
     */
    private unarchive;
    /**
     * Store the epubs contents
     */
    private store;
    /**
     * Get the cover url
     */
    coverUrl(): Promise<string | null>;
    /**
     * Load replacement urls
     */
    private replacements;
    /**
     * Find a DOM Range for a given CFI Range
     */
    getRange(cfiRange: string): Promise<Range | null>;
    /**
     * Generates the Book Key using the identifier in the manifest or other string provided
     * @param [identifier] to use instead of metadata identifier
     */
    key(identifier?: string): string;
    /**
     * Destroy the Book and all associated objects
     */
    destroy(): void;
}
export default Book;
