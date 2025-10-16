import type { BookOptions, PackagingManifestJson, PackagingManifestObject, RenditionOptions } from './types';
import type { EventEmitterMethods } from './types';
import { defer } from './utils/core';
import Path from './utils/path';
import Spine from './spine';
import Locations from './locations';
import Packaging from './packaging';
import Navigation from './navigation';
import Resources from './resources';
import PageList from './pagelist';
import Rendition from './rendition';
import DisplayOptions from './displayoptions';
import { Section } from './section';
/**
 * An Epub representation with methods for the loading, parsing and manipulation
 * of its contents.
 *
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */
declare class Book implements Pick<EventEmitterMethods, 'emit'> {
    emit: EventEmitterMethods['emit'];
    settings: BookOptions;
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
    private request;
    spine: Spine;
    locations: Locations | undefined;
    navigation: Navigation | undefined;
    pageList: PageList | undefined;
    private url;
    path: Path | undefined;
    private archived;
    private archive;
    private storage;
    private resources;
    private rendition;
    packaging: Packaging | undefined;
    private container;
    displayOptions: DisplayOptions | undefined;
    cover: string | undefined;
    package: Packaging | undefined;
    constructor(url?: string | Blob | ArrayBuffer | undefined, options?: BookOptions);
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
     */
    private determineType;
    /**
     * unpack the contents of the Books packaging
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
     */
    renderTo(element: HTMLElement | string, options?: RenditionOptions): Rendition;
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
     * Apply iBooks display options overrides to packaging metadata
     */
    private applyDisplayOptionsOverrides;
    /**
     * Destroy the Book and all associated objects
     */
    destroy(): void;
}
export default Book;
