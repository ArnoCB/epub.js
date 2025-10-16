import { defer, isXml, parse } from './utils';
import httpRequest from './utils/request';
import mime from './utils/mime';
import Path from './utils/path';
import EventEmitter from 'event-emitter';
import localforage from 'localforage';
import Resources from './resources';
import type { BookRequestFunction } from './types/book';

type EventEmitterMethods = Pick<EventEmitter, 'on'>;

/**
 * Handles saving and requesting files from local storage
 * @param {string} name This should be the name of the application for modals
 * @param {function} [requester]
 * @param {function} [resolver]
 */
class Store implements EventEmitterMethods {
  on!: EventEmitter['on'];
  storage: typeof localforage | undefined;
  urlCache: Record<string, string> = {};
  name: string;
  requester: BookRequestFunction;
  resolver: (path: string, absolute?: boolean) => string;
  online = true;
  emit!: (event: string, ...args: unknown[]) => void;
  private _status: (() => void) | undefined = undefined;

  constructor(
    name: string,
    requester: BookRequestFunction,
    resolver: (path: string, absolute?: boolean) => string
  ) {
    this.storage = undefined;
    this.name = name;
    this.requester = requester || httpRequest;
    this.resolver = resolver;

    this.checkRequirements();
    this.addListeners();
  }

  /**
   * Checks to see if localForage exists in global namspace,
   * Requires localForage if it isn't there
   */
  private checkRequirements() {
    try {
      if (typeof localforage === 'undefined') {
        throw new Error('localForage lib not loaded');
      }
      this.storage = localforage.createInstance({
        name: this.name,
      });
    } catch (error) {
      // Re-throw the original error if it's not about localforage being undefined
      if (
        error instanceof Error &&
        error.message === 'localForage lib not loaded'
      ) {
        throw error;
      }
      // For other errors, preserve the original error message
      throw new Error(
        `Failed to initialize localForage storage: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Add online and offline event listeners
   */
  private addListeners() {
    this._status = this.status.bind(this);
    window.addEventListener('online', this._status);
    window.addEventListener('offline', this._status);
  }

  /**
   * Remove online and offline event listeners
   */
  private removeListeners() {
    if (!this._status) return;
    window.removeEventListener('online', this._status);
    window.removeEventListener('offline', this._status);
    this._status = undefined;
  }

  /**
   * Update the online / offline status
   */
  private status() {
    const online = navigator.onLine;
    this.online = online;
    if (online) {
      this.emit('online', this);
    } else {
      this.emit('offline', this);
    }
  }

  /**
   * Add all of a book resources to the store
   * @param  {Resources} resources  book resources
   * @param  {boolean} [force] force resaving resources
   * @return {Promise<Array<unknown>>} array of stored objects (typically ArrayBuffers for binary resources)
   */
  async add(
    resources: Resources,
    force: boolean = false
  ): Promise<Array<unknown>> {
    const mapped = resources.resources!.map((item) => {
      const { href } = item;
      const url = this.resolver(href);
      const encodedUrl = window.encodeURIComponent(url);

      return this.storage!.getItem(encodedUrl).then((item: unknown) => {
        if (!item || force) {
          return this.requester(url, 'binary').then((data) => {
            return this.storage!.setItem(encodedUrl, data);
          });
        } else {
          return item;
        }
      });
    });
    return Promise.all(mapped);
  }

  /**
   * Put binary data from a url to storage
   */
  async put(
    url: string,
    withCredentials?: boolean,
    headers?: Record<string, string>
  ): Promise<unknown> {
    const encodedUrl = window.encodeURIComponent(url);

    return this.storage!.getItem(encodedUrl).then((result: unknown) => {
      if (!result) {
        return this.requester(
          url,
          'binary',
          withCredentials ?? false,
          headers ?? {}
        ).then((data) => {
          return this.storage!.setItem(encodedUrl, data);
        });
      }
      return result;
    });
  }

  /**
   * Request a url
   * @param  {string} url  a url to request from storage
   * @param  {string} [type] specify the type of the returned result
   * @param  {boolean} [withCredentials]
   * @param  {object} [headers]
   * @return {Promise<Blob | string | JSON | Document | XMLDocument>}
   */
  async request(
    url: string,
    type: string,
    withCredentials: boolean = false,
    headers: Record<string, string> = {}
  ): Promise<Blob | string | JSON | Document | XMLDocument> {
    if (this.online) {
      // From network
      return this.requester(url, type, withCredentials, headers).then(
        (data) => {
          // save to store if not present
          this.put(url, withCredentials, headers);
          return data;
        }
      );
    } else {
      // From store
      return this.retrieve(url, type);
    }
  }

  /**
   * Request a url from storage
   */
  async retrieve(
    url: string,
    type?: string
  ): Promise<Blob | string | JSON | Document | XMLDocument> {
    const path = new Path(url);

    // If type isn't set, determine it from the file extension
    if (!type) {
      type = path.extension;
    }

    let response: Promise<Blob | string | undefined>;
    if (type == 'blob') {
      response = this.getBlob(url);
    } else {
      response = this.getText(url);
    }

    return response.then((r: Blob | string | undefined) => {
      const deferred = new defer<
        Blob | string | JSON | Document | XMLDocument
      >();
      let result;
      if (r) {
        result = this.handleResponse(r, type!);
        deferred.resolve(result);
      } else {
        deferred.reject({
          message: 'File not found in storage: ' + url,
          stack: new Error().stack,
        });
      }
      return deferred.promise;
    });
  }

  /**
   * Handle the response from request
   */
  private handleResponse(response: string | Blob, type: string) {
    if (type === 'json') {
      return JSON.parse(response as string);
    }

    if (isXml(type)) {
      return parse(response as string, 'text/xml');
    }

    if (type === 'xhtml') {
      return parse(response as string, 'application/xhtml+xml');
    }

    if (type === 'html' || type === 'htm') {
      return parse(response as string, 'text/html');
    }

    return response;
  }

  /**
   * Get a Blob from Storage by Url
   */
  async getBlob(url: string, mimeType?: string): Promise<Blob | undefined> {
    const encodedUrl = window.encodeURIComponent(url);

    return this.storage!.getItem(encodedUrl).then(function (
      uint8array: unknown
    ) {
      if (!uint8array) return;

      mimeType = mimeType || mime.lookup(url);

      return new Blob([uint8array as BlobPart], { type: mimeType });
    });
  }

  /**
   * Get Text from Storage by Url
   */
  async getText(url: string, mimeType?: string): Promise<string | undefined> {
    const encodedUrl = window.encodeURIComponent(url);

    mimeType = mimeType || mime.lookup(url);

    return this.storage!.getItem(encodedUrl).then(function (
      uint8array: unknown
    ) {
      const deferred = new defer<string>();
      const reader = new FileReader();

      if (!uint8array) return;

      const blob = new Blob([uint8array as BlobPart], { type: mimeType });

      reader.addEventListener('loadend', () => {
        deferred.resolve(reader.result as string);
      });

      reader.readAsText(blob, mimeType);

      return deferred.promise;
    });
  }

  /**
   * Get a base64 encoded result from Storage by Url
   * @return base64 encoded
   */
  async getBase64(url: string, mimeType?: string): Promise<string | undefined> {
    const encodedUrl = window.encodeURIComponent(url);

    mimeType = mimeType || mime.lookup(url);

    return this.storage!.getItem(encodedUrl).then((uint8array: unknown) => {
      const deferred = new defer<string>();
      const reader = new FileReader();

      if (!uint8array) return;

      const blob = new Blob([uint8array as BlobPart], { type: mimeType });

      reader.addEventListener('loadend', () => {
        deferred.resolve(reader.result as string);
      });

      reader.readAsDataURL(blob);

      return deferred.promise;
    });
  }

  /**
   * Create a Url from a stored item
   */
  createUrl(url: string, options: { base64?: boolean }): Promise<string> {
    const deferred = new defer<string>();
    const _URL = window.URL || window.webkitURL;
    const useBase64 = options && options.base64;

    if (url in this.urlCache) {
      deferred.resolve(this.urlCache[url]);
      return deferred.promise;
    }

    const response = useBase64 ? this.getBase64(url) : this.getBlob(url);

    if (!response) {
      deferred.reject({
        message: 'File not found in storage: ' + url,
        stack: new Error().stack,
      });

      return deferred.promise;
    }

    response.then((result: string | Blob | undefined) => {
      if (!result) return;

      const tempUrl =
        typeof result === 'string'
          ? result
          : _URL.createObjectURL(result as Blob);

      this.urlCache[url] = tempUrl;
      deferred.resolve(tempUrl);
    });

    return deferred.promise;
  }

  /**
   * Revoke Temp Url for a archive item
   */
  revokeUrl(url: string) {
    const _URL = window.URL || window.webkitURL;
    const fromCache = this.urlCache[url];
    if (fromCache) _URL.revokeObjectURL(fromCache);
  }

  destroy() {
    const _URL = window.URL || window.webkitURL;
    for (const fromCache in this.urlCache) {
      _URL.revokeObjectURL(fromCache);
    }
    this.urlCache = {};
    this.removeListeners();
  }
}

EventEmitter(Store.prototype);

export default Store;
