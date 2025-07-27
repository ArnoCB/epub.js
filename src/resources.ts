import { substitute } from './utils/replacements';
import { createBase64Url, createBlobUrl, blob2base64 } from './utils/core';
import Url from './utils/url';
import mime from './utils/mime';
import Path from './utils/path';
import path from 'path-webpack';
import { PackagingManifestObject } from 'types/packaging';
import { ResourcesOptions } from 'types/resources';

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
  public settings: ResourcesOptions;
  public manifest: PackagingManifestObject | undefined;
  public resources: any[] = [];
  public replacementUrls: string[] = [];
  public html: any[] = [];
  public assets: any[] = [];
  public css: any[] = [];

  public urls: string[] = [];
  public cssUrls: string[] = [];

  constructor(manifest: PackagingManifestObject, options: ResourcesOptions) {
    this.settings = {
      replacements: (options && options.replacements) || 'base64',
      archive: options && options.archive,
      resolver: options && options.resolver,
      request: options && options.request,
    };

    this.process(manifest);
  }

  /**
   * Process resources
   * @param {Manifest} manifest
   */
  process(manifest: PackagingManifestObject) {
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
   * @private
   */
  split() {
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
   * @private
   */
  splitUrls() {
    this.urls = this.assets.map((item) => item.href);
    this.cssUrls = this.css.map((item) => item.href);
  }

  /**
   * Create a url to a resource
   * @param {string} url
   * @return {Promise<string>} Promise resolves with url string
   */
  createUrl(url: string): Promise<string> {
    const parsedUrl = new Url(url);
    const mimeType = mime.lookup(parsedUrl.filename);

    if (this.settings.archive) {
      return this.settings.archive.createUrl(url, {
        base64: this.settings.replacements === 'base64',
      });
    } else {
      if (this.settings.replacements === 'base64') {
        return this.settings
          .request(url, 'blob')
          .then((blob) => {
            return blob2base64(blob);
          })
          .then((blob) => {
            return createBase64Url(blob, mimeType);
          });
      } else {
        return this.settings.request(url, 'blob').then((blob) => {
          return createBlobUrl(blob, mimeType);
        });
      }
    }
  }

  /**
   * Create blob urls for all the assets
   * @return {Promise}         returns replacement urls
   */
  replacements() {
    if (this.settings.replacements === 'none') {
      return Promise.resolve(this.urls);
    }
    
    const replacements = this.urls.map((url) => {
      const absolute = this.settings.resolver(url);
      return this.createUrl(absolute).catch(() => {
        return null;
      });
    });
    return Promise.all(replacements).then((replacementUrls) => {
      this.replacementUrls = replacementUrls.filter((url) => {
        return typeof url === 'string';
      });
      console.log('[Resources] replacements resolved', this.replacementUrls);
      return replacementUrls;
    });
  }

  /**
   * Replace URLs in CSS resources
   * @private
   * @param  {Archive} [archive]
   * @param  {method} [resolver]
   * @return {Promise}
   */
  replaceCss(archive, resolver) {
    console.log('[Resources] replaceCss called');
    const replaced = [];
    archive = archive || this.settings.archive;
    resolver = resolver || this.settings.resolver;
    this.cssUrls.forEach(
      function (href) {
        const replacement = this.createCssFile(href, archive, resolver).then(
          function (replacementUrl) {
            const indexInUrls = this.urls.indexOf(href);
            if (indexInUrls > -1) {
              this.replacementUrls[indexInUrls] = replacementUrl;
            }
          }.bind(this)
        );
        replaced.push(replacement);
      }.bind(this)
    );
  }

  /**
   * Create a new CSS file with the replaced URLs
   * @private
   * @param  {string} href the original css file
   * @return {Promise}  returns a BlobUrl to the new CSS file or a data url
   */
  createCssFile(href) {
    console.log('[Resources] createCssFile called', { href });
    let newUrl;
    if (path.isAbsolute(href)) {
      console.log('[Resources] createCssFile: isAbsolute, resolving empty');
      return new Promise(function (resolve) {
        resolve();
      });
    }
    const absolute = this.settings.resolver(href);
    let textResponse;
    if (this.settings.archive) {
      textResponse = this.settings.archive.getText(absolute);
    } else {
      textResponse = this.settings.request(absolute, 'text');
    }
    const relUrls = this.urls.map((assetHref) => {
      const resolved = this.settings.resolver(assetHref);
      const relative = new Path(absolute).relative(resolved);
      return relative;
    });
    if (!textResponse) {
      console.log(
        '[Resources] createCssFile: textResponse missing, resolving empty'
      );
      return new Promise(function (resolve) {
        resolve();
      });
    }
    return textResponse.then(
      (text) => {
        text = substitute(text, relUrls, this.replacementUrls);
        if (this.settings.replacements === 'base64') {
          newUrl = createBase64Url(text, 'text/css');
        } else {
          newUrl = createBlobUrl(text, 'text/css');
        }
        console.log('[Resources] createCssFile: resolved', { href, newUrl });
        return newUrl;
      },
      () => {
        console.log('[Resources] createCssFile: error, resolving empty');
        return new Promise(function (resolve) {
          resolve();
        });
      }
    );
  }

  /**
   * Resolve all resources URLs relative to an absolute URL
   * @param  {string} absolute to be resolved to
   * @param  {resolver} [resolver]
   * @return {string[]} array with relative Urls
   */
  relativeTo(absolute: string, resolver?: (url: string) => string | undefined): string[] {
    resolver = resolver || this.settings.resolver;

    if (!resolver) {
      throw new Error('No resolver provided to resolve relative URLs');
    }

    // Get Urls relative to current sections
    return this.urls.map(
      (href) => {
        const resolved = resolver(href);
        if (!resolved) {
          return '';
        }
        const relative = new Path(absolute).relative(resolved);
        return relative;
      }
    );
  }

  /**
   * Get a URL for a resource
   */
  get(path: string): Promise<string> {
    const indexInUrls = this.urls.indexOf(path);
    if (indexInUrls === -1) {
      return Promise.resolve('');
    }

    if (this.replacementUrls.length) {
      return Promise.resolve(this.replacementUrls[indexInUrls]);
    }
     
    return this.createUrl(path);
  }

  /**
   * Substitute urls in content, with replacements,
   * relative to a url if provided
   */
  substitute(content: string, url?: string): string {
    let relUrls;
    if (url) {
      relUrls = this.relativeTo(url);
    } else {
      relUrls = this.urls;
    }
    return substitute(content, relUrls, this.replacementUrls);
  }

  destroy() {
    this.settings = undefined;
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

export default Resources;
