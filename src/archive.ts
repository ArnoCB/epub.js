import { parse } from './utils/core';
import request from './utils/request';
import mime from './utils/mime';
import JSZip from 'jszip';

interface InputByType {
  base64: string;
  string: string;
  text: string;
  binarystring: string;
  array: number[];
  uint8array: Uint8Array;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  stream: NodeJS.ReadableStream;
}

type InputFileFormat =
  | InputByType[keyof InputByType]
  | Promise<InputByType[keyof InputByType]>;

type ArchiveRequestTypeMap = {
  blob: Blob;
  string: string;
  json: object;
  xhtml: Document;
  html: Document;
  htm: Document;
  xml: Document;
  opf: Document;
  ncx: Document;
  text: string;
  base64: string;
};

/**
 * Handles Unzipping a requesting files from an Epub Archive
 */
class Archive {
  private zip!: JSZip | undefined;
  private urlCache: Record<string, string>;

  constructor() {
    this.urlCache = {};
    this.checkRequirements();
  }

  /**
   * Checks to see if JSZip exists in global namspace,
   * Requires JSZip if it isn't there

   */
  private checkRequirements() {
    try {
      this.zip = new JSZip();
    } catch {
      throw new Error('JSZip lib not loaded');
    }
  }

  /**
   * Open an archive
   */
  async open(input: InputFileFormat, isBase64: boolean) {
    return this.getZip()
      .loadAsync(input, { base64: isBase64 })
      .then((zip) => {
        return zip;
      })
      .catch((err) => {
        console.error('[Archive] open error', err);
        throw err;
      });
  }

  /**
   * Load and Open an archive
   */
  async openUrl(zipUrl: string, isBase64: boolean) {
    return request<Blob>(zipUrl, 'binary', false, {}).then((data) =>
      this.getZip().loadAsync(data, { base64: isBase64 })
    );
  }

  async request<K extends keyof ArchiveRequestTypeMap>(
    url: string,
    type: K
  ): Promise<ArchiveRequestTypeMap[K]> {
    let response: Promise<ArchiveRequestTypeMap[K]> | undefined;
    if (type === 'blob') {
      response = this.getBlob(url, undefined) as Promise<
        ArchiveRequestTypeMap[K]
      >;
    } else {
      response = this.getText(url) as Promise<ArchiveRequestTypeMap[K]>;
    }
    if (!response) {
      console.error('[Archive] request: file not found', url);
      return Promise.reject({
        message: 'File not found in the epub: ' + url,
        stack: new Error().stack,
      });
    }
    try {
      const r = await response;
      return this.handleResponse(r, type);
    } catch (err) {
      console.error('[Archive] request error', err);
      throw err;
    }
  }

  /**
   * Handle the response from request
   */
  private handleResponse<K extends keyof ArchiveRequestTypeMap>(
    response: ArchiveRequestTypeMap[K],
    type: K
  ): ArchiveRequestTypeMap[K] {
    switch (type) {
      case 'json':
        return JSON.parse(response as string) as ArchiveRequestTypeMap[K];
      case 'ncx':
      case 'opf':
      case 'xml':
        return parse(
          response as string,
          'text/xml'
        ) as ArchiveRequestTypeMap[K];
      case 'xhtml':
        return parse(
          response as string,
          'application/xhtml+xml'
        ) as ArchiveRequestTypeMap[K];
      case 'html':
      case 'htm':
        return parse(
          response as string,
          'text/html'
        ) as ArchiveRequestTypeMap[K];
      default:
        return response as ArchiveRequestTypeMap[K];
    }
  }

  /**
   * Get a Blob from Archive by Url
   */
  getBlob(url: string, mimeType?: string) {
    const decodededUrl = window.decodeURIComponent(url.slice(1)); // Remove first slash
    const entry = this.getZip().file(decodededUrl);
    if (entry) {
      mimeType = mimeType || mime.lookup(entry.name);
      return entry
        .async('uint8array')
        .then(function (uint8array) {
          return new Blob([uint8array], { type: mimeType });
        })
        .catch((err) => {
          console.error('[Archive] getBlob error', err);
          throw err;
        });
    } else {
      console.error('[Archive] getBlob: file not found', url);
      return Promise.reject({
        message: 'File not found in the epub: ' + url,
        stack: new Error().stack,
      });
    }
  }

  getText(url: string) {
    const decodededUrl = window.decodeURIComponent(url.slice(1)); // Remove first slash
    const entry = this.getZip().file(decodededUrl);
    if (entry) {
      return entry
        .async('string')
        .then((text) => {
          return text;
        })
        .catch((err) => {
          console.error('[Archive] getText error', err);
          throw err;
        });
    } else {
      console.error('[Archive] getText: file not found', url);
      return Promise.reject({
        message: 'File not found in the epub: ' + url,
        stack: new Error().stack,
      });
    }
  }

  /**
   * Get a base64 encoded result from Archive by Url
   */
  getBase64(url: string, mimeType?: string) {
    const decodededUrl = window.decodeURIComponent(url.slice(1)); // Remove first slash
    const entry = this.getZip().file(decodededUrl);

    if (entry) {
      mimeType = mimeType || mime.lookup(entry.name);
      return entry.async('base64').then(function (data) {
        return 'data:' + mimeType + ';base64,' + data;
      });
    } else {
      console.error('[Archive] getBase64: file not found', url);
      return Promise.reject({
        message: 'File not found in the epub: ' + url,
        stack: new Error().stack,
      });
    }
  }

  /**
   * Create a Url from an unarchived item
   */
  async createUrl(
    url: string,
    options?: { base64?: boolean }
  ): Promise<string> {
    const _URL = window.URL || window.webkitURL;
    const useBase64 = options && options.base64;

    if (url in this.urlCache) {
      return this.urlCache[url];
    }

    if (useBase64) {
      const response = this.getBase64(url);
      if (!response) {
        return Promise.reject({
          message: 'File not found in the epub: ' + url,
          stack: new Error().stack,
        });
      }
      const tempUrl = await response;
      this.urlCache[url] = tempUrl;
      return tempUrl;
    }

    const response = this.getBlob(url);

    if (!response) {
      return Promise.reject({
        message: 'File not found in the epub: ' + url,
        stack: new Error().stack,
      });
    }

    const blob = await response;
    const tempUrl = _URL.createObjectURL(blob);
    this.urlCache[url] = tempUrl;
    return tempUrl;
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
    this.zip = undefined;
    this.urlCache = {};
  }

  private getZip(): JSZip {
    if (!this.zip)
      throw new Error('Archive has been destroyed or not initialized');
    return this.zip;
  }
}

export default Archive;
