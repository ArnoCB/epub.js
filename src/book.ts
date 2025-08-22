import type { PackagingManifestJson } from './types/packaging';
import type {
  PackagingManifestObject,
  PackagingMetadataObject,
} from './packaging';
import EventEmitter from 'event-emitter';

// Options for creating/opening a Book
export type BookOptions = {
  requestMethod?: (
    url: string,
    type?: string,
    withCredentials?: boolean,
    headers?: Record<string, string>
  ) => Promise<string | Blob | JSON | Document | XMLDocument>;
  requestCredentials?: boolean;
  requestHeaders?: Record<string, string>;
  encoding?: 'binary' | 'base64';
  replacements?: 'base64' | 'blobUrl' | 'none';
  canonical?: (path: string) => string;
  openAs?: string;
  keepAbsoluteUrl?: boolean;
  store?: string | false;
  [key: string]: unknown;
};

import { extend, defer } from './utils/core';
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
import Archive, { type ArchiveRequestTypeMap } from './archive';
import request from './utils/request';
import EpubCFI from './epubcfi';
import Store from './store';
import DisplayOptions from './displayoptions';
import { EPUBJS_VERSION, EVENTS } from './utils/constants';
import { Section } from './section';
import JSZip from 'jszip';

const CONTAINER_PATH = 'META-INF/container.xml';
const IBOOKS_DISPLAY_OPTIONS_PATH =
  'META-INF/com.apple.ibooks.display-options.xml';

const INPUT_TYPE = {
  BINARY: 'binary',
  BASE64: 'base64',
  EPUB: 'epub',
  OPF: 'opf',
  MANIFEST: 'json',
  DIRECTORY: 'directory',
};

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
class Book implements EventEmitterMethods {
  emit!: EventEmitter['emit'];
  settings: BookOptions = {};
  opening: defer<this>;
  opened: Promise<this> | undefined;
  isOpen: boolean = false;

  loading:
    | {
        manifest: defer<PackagingManifestObject>;
        spine: defer<Spine>;
        metadata: defer<PackagingManifestJson['metadata']>;
        cover: defer<string | undefined>;
        navigation: defer<Navigation | undefined>;
        pageList: defer<PageList | undefined>;
        resources: defer<Resources | undefined>;
        displayOptions: defer<DisplayOptions | undefined>;
        packaging: defer<Packaging>;
      }
    | undefined;
  loaded:
    | {
        manifest: Promise<PackagingManifestObject>;
        spine: Promise<Spine>;
        metadata: Promise<PackagingManifestJson['metadata']>;
        cover: Promise<string | undefined>;
        navigation: Promise<Navigation | undefined>;
        pageList: Promise<PageList | undefined>;
        resources: Promise<Resources | undefined>;
        displayOptions: Promise<DisplayOptions | undefined>;
        packaging: Promise<Packaging | undefined>;
      }
    | undefined;

  isRendered: boolean = false;

  ready: Promise<unknown[]>;
  request: (
    url: string,
    type: string,
    withCredentials?: boolean,
    headers?: Record<string, string>
  ) => Promise<string | Blob | JSON | Document | XMLDocument>;
  spine: Spine | undefined;

  locations: Locations | undefined;
  navigation: Navigation | undefined;
  pageList: PageList | undefined;

  url: Url | undefined;
  path: Path | undefined;
  private archived: boolean = false;
  archive: Archive | undefined;

  storage: Store | undefined;
  resources: Resources | undefined;
  rendition: Rendition | undefined;
  packaging: Packaging | undefined;
  container: Container | undefined;
  displayOptions: DisplayOptions | undefined;

  cover: string | undefined;

  package: Packaging | undefined;

  constructor(
    url?: string | Blob | ArrayBuffer | undefined,
    options?: BookOptions
  ) {
    // Allow passing just options to the Book
    if (
      typeof options === 'undefined' &&
      typeof url !== 'string' &&
      url instanceof Blob === false &&
      url instanceof ArrayBuffer === false
    ) {
      options = url;
      url = undefined;
    }

    this.settings = extend(this.settings || {}, {
      requestMethod: undefined,
      requestCredentials: undefined,
      requestHeaders: undefined,
      encoding: undefined,
      replacements: undefined,
      canonical: undefined,
      openAs: undefined,
      store: undefined,
    });

    if (options) extend(this.settings, options);

    // Promises
    this.opening = new defer();

    /**
     * @member {promise} opened returns after the book is loaded
     * @memberof Book
     */
    this.opened = this.opening.promise;

    this.loading = {
      manifest: new defer<PackagingManifestObject>(),
      spine: new defer<Spine>(),
      metadata: new defer<PackagingMetadataObject>(),
      cover: new defer<string | undefined>(),
      navigation: new defer<Navigation | undefined>(),
      pageList: new defer<PageList | undefined>(),
      resources: new defer<Resources | undefined>(),
      displayOptions: new defer<DisplayOptions | undefined>(),
      packaging: new defer<Packaging>(),
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
    this.request = this.settings.requestMethod || request;

    /**
     * @member {Spine} spine
     * @memberof Book
     */
    this.spine = new Spine();

    /**
     * @member {Locations} locations
     * @memberof Book
     */
    this.locations = new Locations(this.spine, (path) => this.load(path));

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
        this.emit(EVENTS.BOOK.OPEN_FAILED, err);
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
  async open(
    input: string | ArrayBuffer | Blob,
    what?: string
  ): Promise<Book | void> {
    let opening;
    const type = what || this.determineType(input);

    // Convert Blob to ArrayBuffer if needed
    if (input instanceof Blob) {
      return input.arrayBuffer().then((buffer) => this.open(buffer, what));
    }

    if (type === INPUT_TYPE.BINARY) {
      this.archived = true;
      this.url = new Url('/', '');
      opening = this.openEpub(input as ArrayBuffer);
    } else if (type === INPUT_TYPE.BASE64) {
      this.archived = true;
      this.url = new Url('/', '');
      opening = this.openEpub(input as ArrayBuffer, type);
    } else if (type === INPUT_TYPE.EPUB) {
      this.archived = true;
      this.url = new Url('/', '');
      if (typeof input === 'string') {
        opening = this.request(
          input,
          'binary',
          this.settings.requestCredentials,
          this.settings.requestHeaders
        ).then((data) => {
          if (data instanceof ArrayBuffer) {
            return this.openEpub(data);
          }
          throw new Error('Expected ArrayBuffer for openEpub');
        });
      } else {
        throw new Error('Input must be a string for request');
      }
    } else if (type == INPUT_TYPE.OPF) {
      this.url = new Url(input as string);
      if (this.settings.keepAbsoluteUrl) {
        opening = this.openPackaging(input as string);
      } else {
        opening = this.openPackaging(this.url.Path.toString());
      }
    } else if (type == INPUT_TYPE.MANIFEST) {
      this.url = new Url(input as string);
      if (this.settings.keepAbsoluteUrl) {
        opening = this.openManifest(input as string);
      } else {
        opening = this.openManifest(this.url.Path.toString());
      }
    } else {
      this.url = new Url(input as string);
      opening = this.openContainer(CONTAINER_PATH).then((packagePath) =>
        this.openPackaging(packagePath)
      );
    }

    return opening;
  }

  /**
   * Open an archived epub
   */
  private async openEpub(data: ArrayBuffer, encoding?: string): Promise<void> {
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
  private async openContainer(url: string): Promise<string> {
    return this.load<Document>(url)
      .then((xml) => {
        this.container = new Container(xml as XMLDocument);
        const packagePath = this.container.packagePath;
        const resolvedPath = this.resolve(packagePath ?? '');
        if (!resolvedPath) throw new Error('Cannot resolve packagePath');
        return resolvedPath;
      })
      .catch((err: Error) => {
        console.error('DEBUG: Error in openContainer:', err);
        throw err;
      });
  }

  /**
   * Open the Open Packaging Format Xml
   */
  private async openPackaging(url: string) {
    this.path = new Path(url);
    return this.load<Document>(url).then((xml) => {
      this.packaging = new Packaging(xml as XMLDocument);
      return this.unpack(this.packaging);
    });
  }

  /**
   * Open the manifest JSON
   */
  private async openManifest(url: string): Promise<void> {
    this.path = new Path(url);
    return this.load<string>(url).then((json) => {
      console.log('[Book] opening manifest clears packaging', url);
      this.packaging = new Packaging();
      const manifestObj: PackagingManifestJson = JSON.parse(json);
      this.packaging.load(manifestObj);
      return this.unpack(this.packaging);
    });
  }

  /**
   * Load a resource from the Book
   */
  load<T = unknown>(path: string): Promise<T> {
    const resolved = this.resolve(path);
    if (resolved === undefined) {
      throw new Error('Cannot resolve path: ' + path);
    }
    if (this.archived) {
      // Determine type based on file extension
      const extension = path.split('.').pop()?.toLowerCase();
      let type: keyof ArchiveRequestTypeMap | undefined;
      if (
        extension === 'xml' ||
        path.includes('container.xml') ||
        path.includes('.opf')
      ) {
        type = 'xml';
      } else if (extension === 'xhtml') {
        type = 'xhtml';
      } else if (extension === 'html' || extension === 'htm') {
        type = 'html';
      } else if (extension === 'json') {
        type = 'json';
      } else if (extension === 'ncx') {
        type = 'ncx';
      }
      if (!type) {
        throw new Error(
          `Unsupported file extension for archived resource: ${extension}`
        );
      }
      if (this.archive === undefined) {
        throw new Error('Archive is not defined. Cannot load resource.');
      }
      // Type assertion: Archive.request returns correct type for known extensions
      return this.archive.request(resolved, type) as Promise<
        ArchiveRequestTypeMap[typeof type]
      > as Promise<T>;
    }
    return this.request(
      resolved,
      '',
      this.settings.requestCredentials,
      this.settings.requestHeaders
    ) as Promise<T>;
  }

  /**
   * Resolve a path to it's absolute position in the Book
   */
  resolve(path: string, absolute?: boolean): string | undefined {
    if (!path) {
      return;
    }
    let resolved = path;
    const isAbsolute =
      typeof path === 'string' &&
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
  canonical(path: string): string {
    let url = path;

    if (!path) {
      return '';
    }

    if (this.settings.canonical) {
      url = this.settings.canonical(path);
    } else {
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
  determineType(input: string | Blob | ArrayBuffer): string {
    if (this.settings.encoding === 'base64') {
      return INPUT_TYPE.BASE64;
    }

    if (typeof input === 'string') {
      const url = new Url(input);
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
  private unpack(packaging: Packaging) {
    this.packaging = packaging;
    this.loading!.packaging.resolve(this.packaging);

    if (this.packaging.metadata.layout === '') {
      // rendition:layout not set - check display options if book is pre-paginated
      this.load<XMLDocument>(
        this.url?.resolve(IBOOKS_DISPLAY_OPTIONS_PATH) ?? ''
      )
        .then((xml) => {
          this.displayOptions = new DisplayOptions(xml);
          this.loading!.displayOptions.resolve(this.displayOptions);
        })
        .catch(() => {
          this.displayOptions = new DisplayOptions();
          this.loading!.displayOptions.resolve(this.displayOptions);
        });
    } else {
      this.displayOptions = new DisplayOptions();
      this.loading!.displayOptions.resolve(this.displayOptions);
    }

    this.spine?.unpack(
      this.packaging,
      (path, absolute) => this.resolve(path, absolute) ?? '',
      (path) => this.canonical(path) ?? ''
    );

    this.resources = new Resources(this.packaging.manifest, {
      archive: this.archive,
      resolver: (path, absolute) => this.resolve(path, absolute) ?? '',
      request: this.request.bind(this),
      replacements:
        this.settings.replacements || (this.archived ? 'blobUrl' : 'base64'),
    });

    this.loadNavigation(this.packaging).then(() => {
      // this.toc = this.navigation.toc;
      this.loading!.navigation.resolve(this.navigation);
    });

    if (this.packaging.coverPath) {
      this.cover = this.resolve(this.packaging.coverPath);
    }
    // Resolve promises
    this.loading!.manifest.resolve(this.packaging.manifest);
    this.loading!.metadata.resolve(this.packaging.metadata);
    this.loading!.spine.resolve(this.spine!);
    this.loading!.cover.resolve(this.cover);
    this.loading!.resources.resolve(this.resources);
    this.loading!.pageList.resolve(this.pageList);

    this.isOpen = true;

    if (
      this.archived ||
      (this.settings.replacements && this.settings.replacements != 'none')
    ) {
      this.replacements()
        .then(() => {
          return this.loaded!.displayOptions.then(() => {
            this.opening.resolve(this);
          });
        })
        .catch((err) => {
          this.opening.reject(err);
        });
    } else {
      // Resolve book opened promise
      this.loaded!.displayOptions.then(() => {
        this.opening.resolve(this);
      });
    }
  }

  /**
   * Load Navigation and PageList from package
   */
  private async loadNavigation(packaging: Packaging) {
    const navPath = packaging.navPath || packaging.ncxPath;
    const toc = packaging.toc;

    // From json manifest
    if (toc) {
      return new Promise((resolve) => {
        this.navigation = new Navigation(toc);

        if (packaging.pageList) {
          this.pageList = new PageList(packaging.pageList); // TODO: handle page lists from Manifest
        }

        resolve(this.navigation);
      });
    }

    if (!navPath) {
      return new Promise((resolve) => {
        this.navigation = new Navigation();
        this.pageList = new PageList();

        resolve(this.navigation);
      });
    }

    return this.load<XMLDocument>(navPath).then((xml) => {
      this.navigation = new Navigation(xml);
      this.pageList = new PageList(xml);
      return this.navigation;
    });
  }

  /**
   * Gets a Section of the Book from the Spine
   * Alias for `book.spine.get`
   */
  section(target: string): Section | null {
    return this.spine?.get(target) || null;
  }

  /**
   * Sugar to render a book to an element
   * @param  {element | string} element element or string to add a rendition to
   * @param  {object} [options]
   * @return {Rendition}
   */
  renderTo(element: HTMLElement | string, options?: object): Rendition {
    this.rendition = new Rendition(this, options!);
    this.rendition.attachTo(element);

    return this.rendition;
  }

  /**
   * Set if request should use withCredentials
   */
  setRequestCredentials(credentials: boolean) {
    this.settings.requestCredentials = credentials;
  }

  /**
   * Set headers request should use
   */
  setRequestHeaders(headers: Record<string, string>) {
    this.settings.requestHeaders = headers;
  }

  /**
   * Unarchive a zipped epub
   */
  private async unarchive(
    input: ArrayBuffer | Uint8Array | string,
    isBase64: boolean
  ): Promise<JSZip> {
    this.archive = new Archive();
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
  private store(name: string): Store {
    // Use "blobUrl" or "base64" for replacements
    const replacementsSetting =
      this.settings.replacements && this.settings.replacements !== 'none';
    // Save original url
    const originalUrl = this.url;
    // Save original request method
    const requester = this.settings.requestMethod || request.bind(this);
    // Create new Store
    this.storage = new Store(
      name,
      requester,
      (path: string, absolute?: boolean) => this.resolve(path, absolute) ?? ''
    );
    // Replace request method to go through store
    this.request = (url, type, withCredentials = false, headers = {}) => {
      return this.storage!.request(url, type, withCredentials, headers);
    };

    (async () => {
      await this.opened;
      if (this.archived && this.archive && this.storage) {
        const archive = this.archive;
        this.storage.requester = (url: string, type: string) => {
          if (['xml', 'xhtml', 'html', 'json', 'ncx'].includes(type)) {
            return archive.request(
              url,
              type as keyof ArchiveRequestTypeMap
            ) as Promise<string | Blob | Document | XMLDocument | JSON>;
          }
          return Promise.reject(new Error(`Unsupported archive type: ${type}`));
        };
      }
      // Substitute hook
      const substituteResources = (output: string, section: Section) => {
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
            this.url = new Url('/', '');
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
  async coverUrl(): Promise<string | null> {
    return this.loaded!.cover.then(() => {
      if (!this.cover) {
        return null;
      }

      if (this.archived) {
        if (this.archive === undefined) {
          return null;
        }

        return this.archive.createUrl(this.cover);
      } else {
        return this.cover;
      }
    });
  }

  /**
   * Load replacement urls
   */
  private async replacements(): Promise<void> {
    if (!this.spine || !this.resources) return;

    this.spine.hooks.serialize.register((output, section) => {
      section.output = this.resources!.substitute(output, section.url);
    });

    await this.resources.replacements();
    await this.resources.replaceCss();
  }

  /**
   * Find a DOM Range for a given CFI Range
   */
  async getRange(cfiRange: string): Promise<Range | null> {
    const cfi = new EpubCFI(cfiRange);
    if (this.spine === undefined) {
      return Promise.reject(
        'CFI could not be found, because there is no spine object'
      );
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
  key(identifier?: string): string {
    const ident =
      identifier || this.packaging?.metadata.identifier || this.url?.filename;
    return `epubjs:${EPUBJS_VERSION}:${ident}`;
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
EventEmitter(Book.prototype);

export default Book;
