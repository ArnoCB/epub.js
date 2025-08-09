"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const replacements_1 = require("./utils/replacements");
const core_1 = require("./utils/core");
const url_1 = __importDefault(require("./utils/url"));
const mime_1 = __importDefault(require("./utils/mime"));
const path_1 = __importDefault(require("./utils/path"));
/**
 * Handle Package Resources
 * @class
 * @param {Manifest} manifest
 * @param {object} [options]
 * @param {string} [options.replacements="base64"]
 * @param {Archive} [options.archive]
 * @param {method} [options.resolver]
 */
class Resources {
    constructor(manifest, options) {
        this.settings = {
            replacements: options.replacements || 'base64',
            archive: options.archive,
            resolver: options.resolver,
            request: options.request,
        };
        this.process(manifest);
    }
    /**
     * Process resources
     */
    process(manifest) {
        this.manifest = manifest;
        this.resources = Object.keys(manifest).map(function (key) {
            return manifest[key];
        });
        this.replacementUrls = [];
        this.html = [];
        this.assets = [];
        this.css = [];
        this.urls = [];
        this.cssUrls = [];
        this.split();
        this.splitUrls();
    }
    /**
     * Split resources by type
     */
    split() {
        // Initialize arrays in case resources is undefined
        this.html = [];
        this.assets = [];
        this.css = [];
        // Return early if resources is undefined
        if (!this.resources) {
            return;
        }
        // HTML
        this.html = this.resources.filter(function (item) {
            if (item.type === 'application/xhtml+xml' || item.type === 'text/html') {
                return true;
            }
        });
        // Exclude HTML
        this.assets = this.resources.filter(function (item) {
            if (item.type !== 'application/xhtml+xml' && item.type !== 'text/html') {
                return true;
            }
        });
        // Only CSS
        this.css = this.resources.filter(function (item) {
            if (item.type === 'text/css') {
                return true;
            }
        });
    }
    /**
     * Convert split resources into Urls
     */
    splitUrls() {
        // Initialize arrays in case assets/css is undefined
        this.urls = [];
        this.cssUrls = [];
        // Return early if assets or css is undefined
        if (!this.assets || !this.css) {
            return;
        }
        // All Assets Urls
        this.urls = this.assets.map((item) => item.href);
        // Css Urls
        this.cssUrls = this.css.map(function (item) {
            return item.href;
        });
    }
    /**
     * Create a url to a resource
     */
    async createUrl(url) {
        const parsedUrl = new url_1.default(url);
        // mime.lookup always returns a string (defaultValue if no match)
        const mimeType = mime_1.default.lookup(parsedUrl.filename);
        if (this.settings === undefined) {
            throw new Error(`Resources settings are not defined`);
        }
        if (this.settings.archive) {
            return this.settings.archive.createUrl(url, {
                base64: this.settings.replacements === 'base64',
            });
        }
        else {
            if (!this.settings.request) {
                throw new Error(`Request method is not defined`);
            }
            if (this.settings.replacements === 'base64') {
                return this.settings
                    .request(url, 'blob')
                    .then((response) => {
                    if (!(response instanceof Blob)) {
                        throw new Error('Expected Blob response for base64 conversion');
                    }
                    return (0, core_1.blob2base64)(response);
                })
                    .then((base64String) => {
                    const dataUrl = (0, core_1.createBase64Url)(base64String, mimeType);
                    if (!dataUrl) {
                        throw new Error('Failed to create base64 URL');
                    }
                    return dataUrl;
                });
            }
            else {
                return this.settings.request(url, 'blob').then((response) => {
                    if (!(response instanceof Blob)) {
                        throw new Error('Expected Blob response for blob URL creation');
                    }
                    const blobUrl = (0, core_1.createBlobUrl)(response, mimeType);
                    if (!blobUrl) {
                        throw new Error('Failed to create blob URL');
                    }
                    return blobUrl;
                });
            }
        }
    }
    /**
     * Create blob urls for all the assets
     * @return returns replacement urls
     */
    async replacements() {
        if (!this.settings || this.settings.replacements === 'none') {
            return Promise.resolve(this.urls ?? []);
        }
        if (this.urls === undefined) {
            return Promise.resolve([]);
        }
        const replacements = this.urls.map((url) => {
            if (!this.settings.resolver) {
                return Promise.resolve(null);
            }
            const absolute = this.settings.resolver(url);
            return this.createUrl(absolute).catch((err) => {
                console.error(err);
                return null;
            });
        });
        return Promise.all(replacements).then((replacementUrls) => {
            this.replacementUrls = replacementUrls.filter((url) => {
                return typeof url === 'string';
            });
            return replacementUrls;
        });
    }
    /**
     * Replace URLs in CSS resources
     */
    replaceCss() {
        const replaced = [];
        this.cssUrls?.forEach((href) => {
            const replacement = this.createCssFile(href).then((replacementUrl) => {
                // switch the url in the replacementUrls
                const indexInUrls = this.urls?.indexOf(href);
                if (indexInUrls && indexInUrls > -1) {
                    this.replacementUrls[indexInUrls] = replacementUrl;
                }
            });
            replaced.push(replacement);
        });
        return Promise.all(replaced);
    }
    /**
     * Create a new CSS file with the replaced URLs
     * @param  href the original css file
     * @return returns a BlobUrl to the new CSS file or a data url
     */
    createCssFile(href) {
        let newUrl;
        // Check if href is an absolute path or URL
        if (href.startsWith('/') || href.includes('://')) {
            return Promise.resolve();
        }
        if (!this.settings.resolver) {
            return Promise.resolve();
        }
        const absolute = this.settings.resolver(href);
        // Get the text of the css file from the archive
        let textResponse;
        if (this.settings.archive) {
            textResponse = this.settings.archive.getText(absolute);
        }
        else if (this.settings.request) {
            textResponse = this.settings.request(absolute, 'text');
        }
        else {
            return Promise.resolve();
        }
        // Get asset links relative to css file
        const relUrls = this.urls?.map((assetHref) => {
            const resolved = this.settings.resolver(assetHref);
            const relative = new path_1.default(absolute).relative(resolved);
            return relative;
        }) || [];
        if (!textResponse) {
            // file not found, don't replace
            return Promise.resolve();
        }
        return textResponse.then((text) => {
            // Ensure text is a string (it should be when request type is 'text')
            const textContent = typeof text === 'string' ? text : String(text);
            // Replacements in the css text
            const processedText = (0, replacements_1.substitute)(textContent, relUrls, this.replacementUrls || []);
            // Get the new url
            if (this.settings.replacements === 'base64') {
                newUrl = (0, core_1.createBase64Url)(processedText, 'text/css');
            }
            else {
                newUrl = (0, core_1.createBlobUrl)(processedText, 'text/css');
            }
            return newUrl;
        }, () => {
            // handle response errors
            return Promise.resolve();
        });
    }
    /**
     * Resolve all resources URLs relative to an absolute URL
     * @param  {string} absolute to be resolved to
     * @param  {resolver} [resolver]
     * @return {string[]} array with relative Urls
     */
    relativeTo(absolute, resolver) {
        resolver = resolver || this.settings.resolver;
        if (!this.urls) {
            return [];
        }
        // Get Urls relative to current sections
        return this.urls.map((href) => {
            const resolved = resolver(href);
            const relative = new path_1.default(absolute).relative(resolved);
            return relative;
        });
    }
    /**
     * Get a URL for a resource
     */
    get(path) {
        if (!this.urls) {
            return;
        }
        const indexInUrls = this.urls.indexOf(path);
        if (indexInUrls === -1) {
            return;
        }
        if (this.replacementUrls && this.replacementUrls.length) {
            return Promise.resolve(this.replacementUrls[indexInUrls]);
        }
        else {
            return this.createUrl(path);
        }
    }
    /**
     * Substitute urls in content, with replacements,
     * relative to a url if provided
     */
    substitute(content, url) {
        let relUrls;
        if (url) {
            relUrls = this.relativeTo(url);
        }
        else {
            relUrls = this.urls || [];
        }
        return (0, replacements_1.substitute)(content, relUrls, this.replacementUrls || []);
    }
    destroy() {
        // Clear all properties for cleanup
        this.manifest = undefined;
        this.resources = undefined;
        this.replacementUrls = undefined;
        this.html = undefined;
        this.assets = undefined;
        this.css = undefined;
        this.urls = undefined;
        this.cssUrls = undefined;
    }
}
module.exports = Resources;
exports.default = Resources;
