"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./utils/core");
const request_1 = __importDefault(require("./utils/request"));
const mime_1 = __importDefault(require("./utils/mime"));
const jszip_1 = __importDefault(require("jszip"));
/**
 * Handles Unzipping a requesting files from an Epub Archive
 */
class Archive {
    constructor() {
        this.urlCache = {};
        this.checkRequirements();
    }
    /**
     * Checks to see if JSZip exists in global namspace,
     * Requires JSZip if it isn't there
  
     */
    checkRequirements() {
        try {
            this.zip = new jszip_1.default();
        }
        catch {
            throw new Error('JSZip lib not loaded');
        }
    }
    /**
     * Open an archive
     */
    async open(input, isBase64) {
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
    async openUrl(zipUrl, isBase64) {
        return (0, request_1.default)(zipUrl, 'binary', false, {}).then((data) => this.getZip().loadAsync(data, { base64: isBase64 }));
    }
    async request(url, type) {
        let response;
        if (type === 'blob') {
            response = this.getBlob(url, undefined);
        }
        else {
            response = this.getText(url);
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
        }
        catch (err) {
            console.error('[Archive] request error', err);
            throw err;
        }
    }
    /**
     * Handle the response from request
     */
    handleResponse(response, type) {
        switch (type) {
            case 'json':
                return JSON.parse(response);
            case 'ncx':
            case 'opf':
            case 'xml':
                return (0, core_1.parse)(response, 'text/xml');
            case 'xhtml':
                return (0, core_1.parse)(response, 'application/xhtml+xml');
            case 'html':
            case 'htm':
                return (0, core_1.parse)(response, 'text/html');
            default:
                return response;
        }
    }
    /**
     * Get a Blob from Archive by Url
     */
    getBlob(url, mimeType) {
        const decodededUrl = decodeURIComponent(url.slice(1)); // Remove first slash
        const entry = this.getZip().file(decodededUrl);
        if (entry) {
            mimeType = mimeType || mime_1.default.lookup(entry.name);
            return entry
                .async('uint8array')
                .then(function (uint8array) {
                return new Blob([uint8array], { type: mimeType });
            })
                .catch((err) => {
                console.error('[Archive] getBlob error', err);
                throw err;
            });
        }
        else {
            console.error('[Archive] getBlob: file not found', url);
            return Promise.reject({
                message: 'File not found in the epub: ' + url,
                stack: new Error().stack,
            });
        }
    }
    getText(url) {
        const decodededUrl = decodeURIComponent(url.slice(1)); // Remove first slash
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
        }
        else {
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
    getBase64(url, mimeType) {
        const decodededUrl = decodeURIComponent(url.slice(1)); // Remove first slash
        const entry = this.getZip().file(decodededUrl);
        if (entry) {
            mimeType = mimeType || mime_1.default.lookup(entry.name);
            return entry.async('base64').then(function (data) {
                return 'data:' + mimeType + ';base64,' + data;
            });
        }
        else {
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
    async createUrl(url, options) {
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
    revokeUrl(url) {
        const _URL = window.URL || window.webkitURL;
        const fromCache = this.urlCache[url];
        if (fromCache)
            _URL.revokeObjectURL(fromCache);
    }
    destroy() {
        const _URL = window.URL || window.webkitURL;
        for (const fromCache in this.urlCache) {
            _URL.revokeObjectURL(fromCache);
        }
        this.zip = undefined;
        this.urlCache = {};
    }
    getZip() {
        if (!this.zip)
            throw new Error('Archive has been destroyed or not initialized');
        return this.zip;
    }
}
exports.default = Archive;
