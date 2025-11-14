import type {
  ArchiveRequestTypeMap,
  BookOptions,
  BookRequestFunction,
  PackagingManifestJson,
  PackagingManifestObject,
  PackagingMetadataObject,
  RenditionOptions,
  SearchResult,
  Match,
} from './types';
import {
  extend,
  defer,
  getValidOrDefault,
  md5Hex,
  EventEmitterBase,
  EPUBJS_VERSION,
  EVENTS,
} from './utils';
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
import request from './utils/request';
import EpubCFI from './epubcfi';
import Store from './store';
import DisplayOptions from './displayoptions';
import { Section } from './section';
import JSZip from 'jszip';
import { Spread, DEFAULT_SPREAD, Orientation } from './enums/epub-enums';

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
} as const;

type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

/**
 * An Epub representation with methods for the loading, parsing and manipulation
 * of its contents.
 *
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */
export class Book {
  private _events = new EventEmitterBase();

  emit(type: string, ...args: unknown[]): void {
    this._events.emit(type, ...args);
  }

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
        bookHash: defer<string>;
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
        bookHash: Promise<string>;
      }
    | undefined;

  isRendered: boolean = false;

  ready: Promise<unknown[]>;
  private request: BookRequestFunction;
  spine: Spine;

  locations: Locations | undefined;
  navigation: Navigation | undefined;
  pageList: PageList | undefined;

  private url: Url | undefined;
  path: Path | undefined;
  private archived: boolean = false;
  private archive: Archive | undefined;
  private storage: Store | undefined;
  private resources: Resources | undefined;
  private rendition: Rendition | undefined;
  packaging: Packaging | undefined;
  private container: Container | undefined;
  displayOptions: DisplayOptions | undefined;
  private bookHash: string = '';

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
      bookHash: new defer<string>(),
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
      bookHash: this.loading.bookHash.promise,
    };

    this.ready = Promise.all([
      this.loaded.manifest,
      this.loaded.spine,
      this.loaded.metadata,
      this.loaded.cover,
      this.loaded.navigation,
      this.loaded.resources,
      this.loaded.displayOptions,
      this.loaded.packaging,
      this.loaded.bookHash,
    ]);

    this.request = this.settings.requestMethod || request;
    this.spine = new Spine();
    this.locations = new Locations(this.spine, (path) => this.load(path));
    this.navigation = undefined;
    this.pageList = undefined;
    this.url = undefined;
    this.path = undefined;
    this.archive = undefined;
    this.storage = undefined;
    this.resources = undefined;
    this.rendition = undefined;
    this.container = undefined;
    this.packaging = undefined;
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

    switch (type) {
      case INPUT_TYPE.BINARY:
      case INPUT_TYPE.BASE64:
        this.archived = true;
        this.url = new Url('/', '');
        opening = this.openEpub(
          input as ArrayBuffer,
          type === INPUT_TYPE.BASE64 ? type : undefined
        );
        break;
      case INPUT_TYPE.EPUB:
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
        break;
      case INPUT_TYPE.OPF:
        this.url = new Url(input as string);
        opening = this.settings.keepAbsoluteUrl
          ? this.openPackaging(input as string)
          : this.openPackaging(this.url.Path.toString());
        break;
      case INPUT_TYPE.MANIFEST:
        this.url = new Url(input as string);
        opening = this.settings.keepAbsoluteUrl
          ? this.openManifest(input as string)
          : this.openManifest(this.url.Path.toString());
        break;
      default:
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
    if (!path) return;

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
   */
  private determineType(input: string | Blob | ArrayBuffer): InputType {
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

      switch (extension) {
        case undefined:
        case '':
          return INPUT_TYPE.DIRECTORY;
        case 'epub':
          return INPUT_TYPE.EPUB;
        case 'opf':
          return INPUT_TYPE.OPF;
        case 'json':
          return INPUT_TYPE.MANIFEST;
        default:
          return INPUT_TYPE.BINARY;
      }
    }

    if (typeof Blob !== 'undefined' && input instanceof Blob) {
      return INPUT_TYPE.BINARY;
    }

    if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
      return INPUT_TYPE.BINARY;
    }

    return INPUT_TYPE.BINARY;
  }

  /**
   * unpack the contents of the Books packaging
   */
  private unpack(packaging: Packaging) {
    this.packaging = packaging;
    this.loading!.packaging.resolve(this.packaging);

    // Always attempt to load iBooks display options
    this.load<XMLDocument>(this.url?.resolve(IBOOKS_DISPLAY_OPTIONS_PATH) ?? '')
      .then((xml) => {
        this.displayOptions = new DisplayOptions(xml);
        this.applyDisplayOptionsOverrides(this.displayOptions);
        this.loading!.displayOptions.resolve(this.displayOptions);
      })
      .catch(() => {
        this.displayOptions = new DisplayOptions();
        this.loading!.displayOptions.resolve(this.displayOptions);
      });

    this.spine?.unpack(
      this.packaging,
      (path, absolute) => this.resolve(path, absolute) ?? '',
      (path) => this.canonical(path) ?? ''
    );

    this.resources = new Resources(this.packaging.manifest, {
      archive: this.archive!,
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

    // Generate book hash for all books
    this.setBookHash()
      .then(() => {
        this.loading!.bookHash.resolve(this.bookHash);
      })
      .catch((err) => {
        // Log and reject to help debug hash generation failures
        console.error('Failed to generate book hash:', err);
        this.loading!.bookHash.reject(err);
      });

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
          // @todo handle page lists from Manifest
          this.pageList = new PageList(packaging.pageList);
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
   */
  renderTo(
    element: HTMLElement | string,
    options?: RenditionOptions
  ): Rendition {
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
    const replacementsSetting =
      this.settings.replacements && this.settings.replacements !== 'none';
    const originalUrl = this.url;
    const requester = this.settings.requestMethod || request.bind(this);

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

      if (this.storage?.on) {
        this.storage.on('offline', () => {
          this.url = new Url('/', '');
          this.spine?.hooks?.serialize?.register?.(substituteResources);
        });

        this.storage.on('online', () => {
          this.url = originalUrl;
          this.spine?.hooks?.serialize?.deregister?.(substituteResources);
        });
      }
    })();

    return this.storage;
  }

  /**
   * Get the cover url
   */
  async coverUrl(): Promise<string | null> {
    await this.loaded?.cover;

    if (!this.cover) return null;
    if (this.archived && this.archive)
      return this.archive.createUrl(this.cover);

    return this.archived ? null : this.cover;
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

    if (!item) return Promise.reject('CFI could not be found');

    return item.load(_request).then(function () {
      if (!item.document) return null;

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
   * Apply iBooks display options overrides to packaging metadata
   */
  private applyDisplayOptionsOverrides(displayOptions: DisplayOptions) {
    if (!this.packaging || !this.packaging.metadata) return;

    // fixedLayout: 'true'|'false' (maps to layout)
    if (displayOptions.fixedLayout === 'true') {
      this.packaging.metadata.layout = 'pre-paginated';
    } else if (displayOptions.fixedLayout === 'false') {
      this.packaging.metadata.layout = 'reflowable';
    }

    if (
      displayOptions.orientationLock === Orientation.landscape ||
      displayOptions.orientationLock === Orientation.portrait
    ) {
      this.packaging.metadata.orientation = displayOptions.orientationLock;
    }

    // openToSpread: use getValidOrDefault for type safety
    this.packaging.metadata.spread = getValidOrDefault(
      displayOptions.openToSpread,
      Spread,
      DEFAULT_SPREAD
    );
  }

  /**
   * Get the title of the book
   * @returns Promise resolving to the book title
   */
  get title(): Promise<string> {
    return this.loaded!.metadata.then((metadata) => {
      return metadata.title;
    });
  }

  /**
   * Get the book hash identifier
   * If the hash hasn't been generated yet, it will be generated first
   * @returns Promise resolving to the book hash in uppercase
   */
  async getBookHash(): Promise<string> {
    await this.ready;

    return this.bookHash;
  }

  /**
   * Set the book hash by generating MD5 from the OPF content
   */
  private async setBookHash(): Promise<void> {
    if (!this.path) {
      throw new Error(
        'Cannot generate book hash: package path is not available'
      );
    }

    let text: string;

    if (this.archived && this.archive) {
      // For archived books, get content from the archive
      const contentOpfBlob = await this.archive.getBlob(this.path.toString());
      text = await contentOpfBlob.text();
    } else {
      // For non-archived books, load as XML document and serialize it
      const resolved = this.resolve(this.path.toString());
      if (!resolved) {
        throw new Error('Cannot resolve OPF path');
      }
      const doc = await this.load<XMLDocument>(resolved);
      // Serialize the XML document to string for hashing
      const serializer = new XMLSerializer();
      text = serializer.serializeToString(doc);
    }

    this.bookHash = (await md5Hex(text)).toUpperCase();
  }

  /**
   * Search for a string within a single section
   * @param section - The section to search in (can be Section object, section index, or section href)
   * @param searchString - The string to search for
   * @returns Promise resolving to array of search results for that section
   * @example
   * // Search by section index
   * const results = await book.searchSection(0, "query");
   *
   * // Search by section href
   * const results = await book.searchSection("chapter1.xhtml", "query");
   *
   * // Search by Section object
   * const section = book.spine.get(0);
   * const results = await book.searchSection(section, "query");
   */
  async searchSection(
    section: Section | number | string,
    searchString: string
  ): Promise<SearchResult[]> {
    await this.ready;

    // Resolve section to Section object
    let sectionObj: Section | null;

    // Check if it's already a Section object by checking for Section-specific properties
    if (
      typeof section === 'object' &&
      section !== null &&
      'idref' in section &&
      'find' in section
    ) {
      sectionObj = section;
    } else if (typeof section === 'number') {
      sectionObj = this.spine.get(section);
    } else {
      sectionObj = this.spine.get(section);
    }

    if (!sectionObj) {
      throw new Error(`Section not found: ${section}`);
    }

    // Load the section, search, and unload
    try {
      await sectionObj.load(this.load.bind(this));
      const matches = sectionObj.find(searchString);

      return matches.map((match: Match): SearchResult => {
        return {
          searchTerm: searchString,
          fragment: match.excerpt,
          location: {
            bookHash: this.bookHash,
            cfiRange: match.cfi,
          },
        };
      });
    } finally {
      sectionObj.unload();
    }
  }

  /**
   * Search for a string across all sections of the book
   * @param searchString - The string to search for
   * @returns Promise resolving to array of search results with location information
   * @example
   * const results = await book.searchAll("query");
   * // results = [{ searchTerm: "query", fragment: "...text...", location: { bookHash: "ABC123", cfiRange: "epubcfi(...)" }}]
   */
  async searchAll(searchString: string): Promise<SearchResult[]> {
    await this.ready;

    const results = await Promise.all(
      this.spine.spineItems.map((item: Section) =>
        this.searchSection(item, searchString)
      )
    );

    return results.flat();
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

    // @ts-expect-error this is only at destroy time
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

export default Book;
