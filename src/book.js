"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = __importDefault(require("event-emitter"));
const core_1 = require("./utils/core");
const url_1 = __importDefault(require("./utils/url"));
const path_1 = __importDefault(require("./utils/path"));
const spine_1 = __importDefault(require("./spine"));
const locations_1 = __importDefault(require("./locations"));
const container_1 = __importDefault(require("./container"));
const packaging_1 = __importDefault(require("./packaging"));
const navigation_1 = __importDefault(require("./navigation"));
const resources_1 = __importDefault(require("./resources"));
const pagelist_1 = __importDefault(require("./pagelist"));
const rendition_1 = __importDefault(require("./rendition"));
const archive_1 = __importDefault(require("./archive"));
const request_1 = __importDefault(require("./utils/request"));
const epubcfi_1 = __importDefault(require("./epubcfi"));
const store_1 = __importDefault(require("./store"));
const displayoptions_1 = __importDefault(require("./displayoptions"));
const constants_1 = require("./utils/constants");
const CONTAINER_PATH = 'META-INF/container.xml';
const IBOOKS_DISPLAY_OPTIONS_PATH = 'META-INF/com.apple.ibooks.display-options.xml';
const INPUT_TYPE = {
    BINARY: 'binary',
    BASE64: 'base64',
    EPUB: 'epub',
    OPF: 'opf',
    MANIFEST: 'json',
    DIRECTORY: 'directory',
};
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
class Book {
    constructor(url, options) {
        this.settings = {};
        this.isOpen = false;
        this.isRendered = false;
        this.archived = false;
        // Allow passing just options to the Book
        if (typeof options === 'undefined' &&
            typeof url !== 'string' &&
            url instanceof Blob === false &&
            url instanceof ArrayBuffer === false) {
            options = url;
            url = undefined;
        }
        this.settings = (0, core_1.extend)(this.settings || {}, {
            requestMethod: undefined,
            requestCredentials: undefined,
            requestHeaders: undefined,
            encoding: undefined,
            replacements: undefined,
            canonical: undefined,
            openAs: undefined,
            store: undefined,
        });
        if (options)
            (0, core_1.extend)(this.settings, options);
        // Promises
        this.opening = new core_1.defer();
        /**
         * @member {promise} opened returns after the book is loaded
         * @memberof Book
         */
        this.opened = this.opening.promise;
        this.loading = {
            manifest: new core_1.defer(),
            spine: new core_1.defer(),
            metadata: new core_1.defer(),
            cover: new core_1.defer(),
            navigation: new core_1.defer(),
            pageList: new core_1.defer(),
            resources: new core_1.defer(),
            displayOptions: new core_1.defer(),
            packaging: new core_1.defer(),
        };
        this.loaded = {
            manifest: this.loading.manifest.promise,
            spine: this.loading.spine.promise,
            metadata: this.loading.metadata.promise,
            cover: this.loading.cover.promise,
            navigation: this.loading.navigation.promise,
            pageList: this.loading.pageList.promise,
            resources: this.loading.resources.promise,
            displayOptions: this.loading.displayOptions.promise,
            packaging: this.loading.packaging.promise,
        };
        /**
         * @member {promise} ready returns after the book is loaded and parsed
         * @memberof Book
         * @private
         */
        this.ready = Promise.all([
            this.loaded.manifest,
            this.loaded.spine,
            this.loaded.metadata,
            this.loaded.cover,
            this.loaded.navigation,
            this.loaded.resources,
            this.loaded.displayOptions,
            this.loaded.packaging,
        ]);
        /**
         * @member {method} request
         * @memberof Book
         * @private
         */
        this.request = this.settings.requestMethod || request_1.default;
        /**
         * @member {Spine} spine
         * @memberof Book
         */
        this.spine = new spine_1.default();
        /**
         * @member {Locations} locations
         * @memberof Book
         */
        this.locations = new locations_1.default(this.spine, (path) => this.load(path));
        /**
         * @member {Navigation} navigation
         * @memberof Book
         */
        this.navigation = undefined;
        /**
         * @member {PageList} pagelist
         * @memberof Book
         */
        this.pageList = undefined;
        /**
         * @member {Url} url
         * @memberof Book
         * @private
         */
        this.url = undefined;
        /**
         * @member {Path} path
         * @memberof Book
         * @private
         */
        this.path = undefined;
        /**
         * @member {Archive} archive
         * @memberof Book
         * @private
         */
        this.archive = undefined;
        /**
         * @member {Store} storage
         * @memberof Book
         * @private
         */
        this.storage = undefined;
        /**
         * @member {Resources} resources
         * @memberof Book
         * @private
         */
        this.resources = undefined;
        /**
         * @member {Rendition} rendition
         * @memberof Book
         * @private
         */
        this.rendition = undefined;
        /**
         * @member {Container} container
         * @memberof Book
         * @private
         */
        this.container = undefined;
        /**
         * @member {Packaging} packaging
         * @memberof Book
         * @private
         */
        this.packaging = undefined;
        /**
         * @member {DisplayOptions} displayOptions
         * @memberof DisplayOptions
         * @private
         */
        this.displayOptions = undefined;
        // this.toc = undefined;
        if (this.settings.store) {
            this.store(this.settings.store);
        }
        if (url) {
            this.open(url, this.settings.openAs).catch(() => {
                const err = new Error('Cannot load book at ' + url);
                this.emit(constants_1.EVENTS.BOOK.OPEN_FAILED, err);
            });
        }
    }
    /**
     * Open a epub or url
     * @param {string | ArrayBuffer} input Url, Path or ArrayBuffer
     * @param {string} [what="binary", "base64", "epub", "opf", "json", "directory"] force opening as a certain type
     * @returns {Promise} of when the book has been loaded
     * @example book.open("/path/to/book.epub")
     */
    async open(input, what) {
        let opening;
        const type = what || this.determineType(input);
        // Convert Blob to ArrayBuffer if needed
        if (input instanceof Blob) {
            return input.arrayBuffer().then((buffer) => this.open(buffer, what));
        }
        if (type === INPUT_TYPE.BINARY) {
            this.archived = true;
            this.url = new url_1.default('/', '');
            opening = this.openEpub(input);
        }
        else if (type === INPUT_TYPE.BASE64) {
            this.archived = true;
            this.url = new url_1.default('/', '');
            opening = this.openEpub(input, type);
        }
        else if (type === INPUT_TYPE.EPUB) {
            this.archived = true;
            this.url = new url_1.default('/', '');
            if (typeof input === 'string') {
                opening = this.request(input, 'binary', this.settings.requestCredentials, this.settings.requestHeaders).then((data) => {
                    if (data instanceof ArrayBuffer) {
                        return this.openEpub(data);
                    }
                    throw new Error('Expected ArrayBuffer for openEpub');
                });
            }
            else {
                throw new Error('Input must be a string for request');
            }
        }
        else if (type == INPUT_TYPE.OPF) {
            this.url = new url_1.default(input);
            if (this.settings.keepAbsoluteUrl) {
                opening = this.openPackaging(input);
            }
            else {
                opening = this.openPackaging(this.url.Path.toString());
            }
        }
        else if (type == INPUT_TYPE.MANIFEST) {
            this.url = new url_1.default(input);
            if (this.settings.keepAbsoluteUrl) {
                opening = this.openManifest(input);
            }
            else {
                opening = this.openManifest(this.url.Path.toString());
            }
        }
        else {
            this.url = new url_1.default(input);
            opening = this.openContainer(CONTAINER_PATH).then((packagePath) => this.openPackaging(packagePath));
        }
        return opening;
    }
    /**
     * Open an archived epub
     */
    async openEpub(data, encoding) {
        const isBase64 = (encoding || this.settings.encoding) === 'base64';
        return this.unarchive(data, isBase64)
            .then(() => {
            return this.openContainer(CONTAINER_PATH);
        })
            .then((packagePath) => {
            return this.openPackaging(packagePath);
        });
    }
    /**
     * Open the epub container
     */
    async openContainer(url) {
        return this.load(url)
            .then((xml) => {
            this.container = new container_1.default(xml);
            const packagePath = this.container.packagePath;
            const resolvedPath = this.resolve(packagePath ?? '');
            if (!resolvedPath)
                throw new Error('Cannot resolve packagePath');
            return resolvedPath;
        })
            .catch((err) => {
            console.error('DEBUG: Error in openContainer:', err);
            throw err;
        });
    }
    /**
     * Open the Open Packaging Format Xml
     */
    async openPackaging(url) {
        console.log('[Book] opening packaging:', url);
        this.path = new path_1.default(url);
        console.log('[Book] packaging path:', this.path);
        return this.load(url).then((xml) => {
            this.packaging = new packaging_1.default(xml);
            console.log('[Book] packaging:', this.packaging);
            return this.unpack(this.packaging);
        });
    }
    /**
     * Open the manifest JSON
     */
    async openManifest(url) {
        this.path = new path_1.default(url);
        return this.load(url).then((json) => {
            console.log('[Book] opening manifest clears packaging', url);
            this.packaging = new packaging_1.default();
            const manifestObj = JSON.parse(json);
            this.packaging.load(manifestObj);
            return this.unpack(this.packaging);
        });
    }
    /**
     * Load a resource from the Book
     */
    load(path) {
        const resolved = this.resolve(path);
        if (resolved === undefined) {
            throw new Error('Cannot resolve path: ' + path);
        }
        if (this.archived) {
            // Determine type based on file extension
            const extension = path.split('.').pop()?.toLowerCase();
            let type;
            if (extension === 'xml' ||
                path.includes('container.xml') ||
                path.includes('.opf')) {
                type = 'xml';
            }
            else if (extension === 'xhtml') {
                type = 'xhtml';
            }
            else if (extension === 'html' || extension === 'htm') {
                type = 'html';
            }
            else if (extension === 'json') {
                type = 'json';
            }
            else if (extension === 'ncx') {
                type = 'ncx';
            }
            if (!type) {
                throw new Error(`Unsupported file extension for archived resource: ${extension}`);
            }
            if (this.archive === undefined) {
                throw new Error('Archive is not defined. Cannot load resource.');
            }
            // Type assertion: Archive.request returns correct type for known extensions
            return this.archive.request(resolved, type);
        }
        return this.request(resolved, '', this.settings.requestCredentials, this.settings.requestHeaders);
    }
    /**
     * Resolve a path to it's absolute position in the Book
     */
    resolve(path, absolute) {
        if (!path) {
            return;
        }
        let resolved = path;
        const isAbsolute = typeof path === 'string' &&
            (path.startsWith('/') || path.indexOf('://') > -1);
        if (isAbsolute) {
            return path;
        }
        if (this.path) {
            resolved = this.path.resolve(path);
        }
        if (absolute != false && this.url) {
            resolved = this.url.resolve(resolved);
        }
        return resolved;
    }
    /**
     * Get a canonical link to a path
     */
    canonical(path) {
        let url = path;
        if (!path) {
            return '';
        }
        if (this.settings.canonical) {
            url = this.settings.canonical(path);
        }
        else {
            url = this.resolve(path, true) ?? '';
        }
        return url;
    }
    /**
     * Determine the type of they input passed to open
     * @private
     * @param  {string} input
     * @return {string}  binary | directory | epub | opf
     */
    determineType(input) {
        if (this.settings.encoding === 'base64') {
            return INPUT_TYPE.BASE64;
        }
        if (typeof input === 'string') {
            const url = new url_1.default(input);
            const path = url.path();
            let extension = path.extension;
            // If there's a search string, remove it before determining type
            if (extension) {
                extension = extension.replace(/\?.*$/, '');
            }
            if (!extension) {
                return INPUT_TYPE.DIRECTORY;
            }
            if (extension === 'epub') {
                return INPUT_TYPE.EPUB;
            }
            if (extension === 'opf') {
                return INPUT_TYPE.OPF;
            }
            if (extension === 'json') {
                return INPUT_TYPE.MANIFEST;
            }
            // Default to binary for unknown extensions
            return INPUT_TYPE.BINARY;
        }
        // Robust type checks for Blob and ArrayBuffer
        if (typeof Blob !== 'undefined' && input instanceof Blob) {
            return INPUT_TYPE.BINARY;
        }
        if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
            return INPUT_TYPE.BINARY;
        }
        // Fallback for unknown types
        return INPUT_TYPE.BINARY;
    }
    /**
     * unpack the contents of the Books packaging
     * @param {Packaging} packaging object
     */
    unpack(packaging) {
        console.log('unpacking packaging:', packaging);
        this.packaging = packaging;
        console.log('[Book] unpacking packaging:', this.packaging);
        this.loading.packaging.resolve(this.packaging);
        if (this.packaging.metadata.layout === '') {
            // rendition:layout not set - check display options if book is pre-paginated
            this.load(this.url?.resolve(IBOOKS_DISPLAY_OPTIONS_PATH) ?? '')
                .then((xml) => {
                this.displayOptions = new displayoptions_1.default(xml);
                this.loading.displayOptions.resolve(this.displayOptions);
            })
                .catch(() => {
                this.displayOptions = new displayoptions_1.default();
                this.loading.displayOptions.resolve(this.displayOptions);
            });
        }
        else {
            this.displayOptions = new displayoptions_1.default();
            this.loading.displayOptions.resolve(this.displayOptions);
        }
        this.spine?.unpack(this.packaging, (path, absolute) => this.resolve(path, absolute) ?? '', (path) => this.canonical(path) ?? '');
        this.resources = new resources_1.default(this.packaging.manifest, {
            archive: this.archive,
            resolver: (path, absolute) => this.resolve(path, absolute) ?? '',
            request: this.request.bind(this),
            replacements: this.settings.replacements || (this.archived ? 'blobUrl' : 'base64'),
        });
        this.loadNavigation(this.packaging).then(() => {
            // this.toc = this.navigation.toc;
            this.loading.navigation.resolve(this.navigation);
        });
        if (this.packaging.coverPath) {
            this.cover = this.resolve(this.packaging.coverPath);
        }
        // Resolve promises
        this.loading.manifest.resolve(this.packaging.manifest);
        this.loading.metadata.resolve(this.packaging.metadata);
        this.loading.spine.resolve(this.spine);
        this.loading.cover.resolve(this.cover);
        this.loading.resources.resolve(this.resources);
        this.loading.pageList.resolve(this.pageList);
        this.isOpen = true;
        if (this.archived ||
            (this.settings.replacements && this.settings.replacements != 'none')) {
            this.replacements()
                .then(() => {
                return this.loaded.displayOptions.then(() => {
                    this.opening.resolve(this);
                });
            })
                .catch((err) => {
                this.opening.reject(err);
            });
        }
        else {
            // Resolve book opened promise
            this.loaded.displayOptions.then(() => {
                this.opening.resolve(this);
            });
        }
    }
    /**
     * Load Navigation and PageList from package
     */
    async loadNavigation(packaging) {
        const navPath = packaging.navPath || packaging.ncxPath;
        const toc = packaging.toc;
        // From json manifest
        if (toc) {
            return new Promise((resolve) => {
                this.navigation = new navigation_1.default(toc);
                if (packaging.pageList) {
                    this.pageList = new pagelist_1.default(packaging.pageList); // TODO: handle page lists from Manifest
                }
                resolve(this.navigation);
            });
        }
        if (!navPath) {
            return new Promise((resolve) => {
                this.navigation = new navigation_1.default();
                this.pageList = new pagelist_1.default();
                resolve(this.navigation);
            });
        }
        return this.load(navPath).then((xml) => {
            this.navigation = new navigation_1.default(xml);
            this.pageList = new pagelist_1.default(xml);
            return this.navigation;
        });
    }
    /**
     * Gets a Section of the Book from the Spine
     * Alias for `book.spine.get`
     */
    section(target) {
        return this.spine?.get(target) || null;
    }
    /**
     * Sugar to render a book to an element
     * @param  {element | string} element element or string to add a rendition to
     * @param  {object} [options]
     * @return {Rendition}
     */
    renderTo(element, options) {
        this.rendition = new rendition_1.default(this, options);
        this.rendition.attachTo(element);
        return this.rendition;
    }
    /**
     * Set if request should use withCredentials
     */
    setRequestCredentials(credentials) {
        this.settings.requestCredentials = credentials;
    }
    /**
     * Set headers request should use
     */
    setRequestHeaders(headers) {
        this.settings.requestHeaders = headers;
    }
    /**
     * Unarchive a zipped epub
     */
    async unarchive(input, isBase64) {
        this.archive = new archive_1.default();
        return this.archive
            .open(input, isBase64)
            .then((result) => {
            return result;
        })
            .catch((err) => {
            throw err;
        });
    }
    /**
     * Store the epubs contents
     */
    store(name) {
        // Use "blobUrl" or "base64" for replacements
        const replacementsSetting = this.settings.replacements && this.settings.replacements !== 'none';
        // Save original url
        const originalUrl = this.url;
        // Save original request method
        const requester = this.settings.requestMethod || request_1.default.bind(this);
        // Create new Store
        this.storage = new store_1.default(name, requester, (path, absolute) => this.resolve(path, absolute) ?? '');
        // Replace request method to go through store
        this.request = (url, type, withCredentials = false, headers = {}) => {
            return this.storage.request(url, type, withCredentials, headers);
        };
        (async () => {
            await this.opened;
            if (this.archived && this.archive && this.storage) {
                const archive = this.archive;
                this.storage.requester = (url, type) => {
                    if (['xml', 'xhtml', 'html', 'json', 'ncx'].includes(type)) {
                        return archive.request(url, type);
                    }
                    return Promise.reject(new Error(`Unsupported archive type: ${type}`));
                };
            }
            // Substitute hook
            const substituteResources = (output, section) => {
                if (this.resources) {
                    section.output = this.resources.substitute(output, section.url);
                }
            };
            if (this.resources) {
                this.resources.settings.replacements =
                    typeof replacementsSetting === 'string'
                        ? replacementsSetting
                        : 'blobUrl';
                await this.resources.replacements();
                await this.resources.replaceCss();
            }
            if (this.storage) {
                if (typeof this.storage.on === 'function') {
                    this.storage.on('offline', () => {
                        this.url = new url_1.default('/', '');
                        if (this.spine?.hooks?.serialize) {
                            this.spine.hooks.serialize.register(substituteResources);
                        }
                    });
                    this.storage.on('online', () => {
                        this.url = originalUrl;
                        if (this.spine?.hooks?.serialize) {
                            this.spine.hooks.serialize.deregister(substituteResources);
                        }
                    });
                }
            }
        })();
        return this.storage;
    }
    /**
     * Get the cover url
     */
    async coverUrl() {
        return this.loaded.cover.then(() => {
            if (!this.cover) {
                return null;
            }
            if (this.archived) {
                if (this.archive === undefined) {
                    return null;
                }
                return this.archive.createUrl(this.cover);
            }
            else {
                return this.cover;
            }
        });
    }
    /**
     * Load replacement urls
     */
    async replacements() {
        if (!this.spine || !this.resources)
            return;
        this.spine.hooks.serialize.register((output, section) => {
            section.output = this.resources.substitute(output, section.url);
        });
        await this.resources.replacements();
        await this.resources.replaceCss();
    }
    /**
     * Find a DOM Range for a given CFI Range
     */
    async getRange(cfiRange) {
        const cfi = new epubcfi_1.default(cfiRange);
        if (this.spine === undefined) {
            return Promise.reject('CFI could not be found, because there is no spine object');
        }
        const item = this.spine.get(cfi.spinePos);
        const _request = this.load;
        if (!item) {
            return Promise.reject('CFI could not be found');
        }
        return item.load(_request).then(function () {
            if (!item.document) {
                return null;
            }
            return cfi.toRange(item.document);
        });
    }
    /**
     * Generates the Book Key using the identifier in the manifest or other string provided
     * @param [identifier] to use instead of metadata identifier
     */
    key(identifier) {
        const ident = identifier || this.packaging?.metadata.identifier || this.url?.filename;
        return `epubjs:${constants_1.EPUBJS_VERSION}:${ident}`;
    }
    /**
     * Destroy the Book and all associated objects
     */
    destroy() {
        this.opened = undefined;
        this.loading = undefined;
        this.loaded = undefined;
        // @ts-expect-error this is only at destroy time
        this.ready = undefined;
        this.isOpen = false;
        this.isRendered = false;
        this.spine?.destroy();
        this.locations?.destroy();
        this.pageList?.destroy();
        this.archive?.destroy();
        this.resources?.destroy();
        this.container?.destroy();
        this.packaging?.destroy();
        this.rendition?.destroy();
        this.displayOptions?.destroy();
        this.spine = undefined;
        this.locations = undefined;
        this.pageList = undefined;
        this.archive = undefined;
        this.resources = undefined;
        this.container = undefined;
        this.packaging = undefined;
        this.rendition = undefined;
        this.navigation = undefined;
        this.url = undefined;
        this.path = undefined;
        this.archived = false;
    }
}
//-- Enable binding events to book
(0, event_emitter_1.default)(Book.prototype);
exports.default = Book;
