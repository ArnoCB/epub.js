'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('./utils/core');
const request_1 = __importDefault(require('./utils/request'));
const mime_1 = __importDefault(require('./utils/mime'));
const path_1 = __importDefault(require('./utils/path'));
const event_emitter_1 = __importDefault(require('event-emitter'));
const localforage_1 = __importDefault(require('localforage'));
/**
 * Handles saving and requesting files from local storage
 * @class
 * @param {string} name This should be the name of the application for modals
 * @param {function} [requester]
 * @param {function} [resolver]
 */
class Store {
  constructor(name, requester, resolver) {
    this.urlCache = {};
    this.online = true;
    this._status = undefined;
    this.storage = undefined;
    this.name = name;
    this.requester = requester || request_1.default;
    this.resolver = resolver;
    this.checkRequirements();
    this.addListeners();
  }
  /**
   * Checks to see if localForage exists in global namspace,
   * Requires localForage if it isn't there
   */
  checkRequirements() {
    try {
      if (typeof localforage_1.default === 'undefined') {
        throw new Error('localForage lib not loaded');
      }
      this.storage = localforage_1.default.createInstance({
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
        `Failed to initialize localForage storage: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Add online and offline event listeners
   * @private
   */
  addListeners() {
    this._status = this.status.bind(this);
    window.addEventListener('online', this._status);
    window.addEventListener('offline', this._status);
  }
  /**
   * Remove online and offline event listeners
   */
  removeListeners() {
    if (!this._status) return;
    window.removeEventListener('online', this._status);
    window.removeEventListener('offline', this._status);
    this._status = undefined;
  }
  /**
   * Update the online / offline status
   */
  status() {
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
  async add(resources, force = false) {
    const mapped = resources.resources.map((item) => {
      const { href } = item;
      const url = this.resolver(href);
      const encodedUrl = window.encodeURIComponent(url);
      return this.storage.getItem(encodedUrl).then((item) => {
        if (!item || force) {
          return this.requester(url, 'binary').then((data) => {
            return this.storage.setItem(encodedUrl, data);
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
  async put(url, withCredentials, headers) {
    const encodedUrl = window.encodeURIComponent(url);
    return this.storage.getItem(encodedUrl).then((result) => {
      if (!result) {
        return this.requester(
          url,
          'binary',
          withCredentials ?? false,
          headers ?? {}
        ).then((data) => {
          return this.storage.setItem(encodedUrl, data);
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
  async request(url, type, withCredentials = false, headers = {}) {
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
  async retrieve(url, type) {
    const path = new path_1.default(url);
    // If type isn't set, determine it from the file extension
    if (!type) {
      type = path.extension;
    }
    let response;
    if (type == 'blob') {
      response = this.getBlob(url);
    } else {
      response = this.getText(url);
    }
    return response.then((r) => {
      const deferred = new core_1.defer();
      let result;
      if (r) {
        result = this.handleResponse(r, type);
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
  handleResponse(response, type) {
    let r;
    if (type == 'json') {
      r = JSON.parse(response);
    } else if ((0, core_1.isXml)(type)) {
      r = (0, core_1.parse)(response, 'text/xml');
    } else if (type == 'xhtml') {
      r = (0, core_1.parse)(response, 'application/xhtml+xml');
    } else if (type == 'html' || type == 'htm') {
      r = (0, core_1.parse)(response, 'text/html');
    } else {
      r = response;
    }
    return r;
  }
  /**
   * Get a Blob from Storage by Url
   */
  async getBlob(url, mimeType) {
    const encodedUrl = window.encodeURIComponent(url);
    return this.storage.getItem(encodedUrl).then(function (uint8array) {
      if (!uint8array) return;
      mimeType = mimeType || mime_1.default.lookup(url);
      return new Blob([uint8array], { type: mimeType });
    });
  }
  /**
   * Get Text from Storage by Url
   * @param  {string} url
   * @param  {string} [mimeType]
   * @return {Promise<string | undefined>}
   */
  getText(url, mimeType) {
    const encodedUrl = window.encodeURIComponent(url);
    mimeType = mimeType || mime_1.default.lookup(url);
    return this.storage.getItem(encodedUrl).then(function (uint8array) {
      const deferred = new core_1.defer();
      const reader = new FileReader();
      if (!uint8array) return;
      const blob = new Blob([uint8array], { type: mimeType });
      reader.addEventListener('loadend', () => {
        deferred.resolve(reader.result);
      });
      reader.readAsText(blob, mimeType);
      return deferred.promise;
    });
  }
  /**
   * Get a base64 encoded result from Storage by Url
   * @return base64 encoded
   */
  getBase64(url, mimeType) {
    const encodedUrl = window.encodeURIComponent(url);
    mimeType = mimeType || mime_1.default.lookup(url);
    return this.storage.getItem(encodedUrl).then((uint8array) => {
      const deferred = new core_1.defer();
      const reader = new FileReader();
      if (!uint8array) return;
      const blob = new Blob([uint8array], { type: mimeType });
      reader.addEventListener('loadend', () => {
        deferred.resolve(reader.result);
      });
      reader.readAsDataURL(blob);
      return deferred.promise;
    });
  }
  /**
   * Create a Url from a stored item
   */
  createUrl(url, options) {
    const deferred = new core_1.defer();
    const _URL = window.URL || window.webkitURL;
    let tempUrl;
    let response;
    const useBase64 = options && options.base64;
    if (url in this.urlCache) {
      deferred.resolve(this.urlCache[url]);
      return deferred.promise;
    }
    if (useBase64) {
      response = this.getBase64(url);
      if (response) {
        response.then((tempUrl) => {
          if (tempUrl) {
            this.urlCache[url] = tempUrl;
            deferred.resolve(tempUrl);
          }
        });
      }
    } else {
      response = this.getBlob(url);
      if (response) {
        response.then((blob) => {
          if (blob) {
            tempUrl = _URL.createObjectURL(blob);
            this.urlCache[url] = tempUrl;
            deferred.resolve(tempUrl);
          }
        });
      }
    }
    if (!response) {
      deferred.reject({
        message: 'File not found in storage: ' + url,
        stack: new Error().stack,
      });
    }
    return deferred.promise;
  }
  /**
   * Revoke Temp Url for a archive item
   */
  revokeUrl(url) {
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
(0, event_emitter_1.default)(Store.prototype);
exports.default = Store;
