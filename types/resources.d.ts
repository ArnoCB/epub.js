import { PackagingManifestItem, PackagingManifestObject } from './packaging';
import Archive from './archive';
export interface ResourcesOptions {
    replacements?: string;
    archive?: Archive;
    resolver: ResolverFunction;
    request: (url: string, type: string, withCredentials?: boolean, headers?: Record<string, string>) => Promise<Blob | string | JSON | Document | XMLDocument>;
}
export type ResolverFunction = (path: string, absolute?: boolean) => string;
/**
 * Handle Package Resources
 * @class
 * @param {Manifest} manifest
 * @param {object} [options]
 * @param {string} [options.replacements="base64"]
 * @param {Archive} [options.archive]
 * @param {method} [options.resolver]
 */
declare class Resources {
    settings: {
        replacements?: string;
        archive?: Archive;
        resolver: ResolverFunction;
        request: (url: string, type: string, withCredentials?: boolean, headers?: Record<string, string>) => Promise<Blob | string | JSON | Document | XMLDocument>;
    };
    manifest: undefined | PackagingManifestObject;
    resources: undefined | Array<PackagingManifestItem>;
    replacementUrls: undefined | Array<string>;
    html: undefined | Array<PackagingManifestItem>;
    assets: undefined | Array<PackagingManifestItem>;
    css: undefined | Array<PackagingManifestItem>;
    urls: undefined | Array<string>;
    cssUrls: undefined | Array<string>;
    constructor(manifest: PackagingManifestObject, options: ResourcesOptions);
    /**
     * Process resources
     */
    process(manifest: PackagingManifestObject): void;
    /**
     * Split resources by type
     */
    private split;
    /**
     * Convert split resources into Urls
     */
    private splitUrls;
    /**
     * Create a url to a resource
     */
    createUrl(url: string): Promise<string>;
    /**
     * Create blob urls for all the assets
     * @return returns replacement urls
     */
    replacements(): Promise<(string | null)[]>;
    /**
     * Replace URLs in CSS resources
     */
    replaceCss(): Promise<void[]>;
    /**
     * Create a new CSS file with the replaced URLs
     * @param  href the original css file
     * @return returns a BlobUrl to the new CSS file or a data url
     */
    private createCssFile;
    /**
     * Resolve all resources URLs relative to an absolute URL
     * @param  {string} absolute to be resolved to
     * @param  {resolver} [resolver]
     * @return {string[]} array with relative Urls
     */
    relativeTo(absolute: string, resolver?: ResolverFunction): string[];
    /**
     * Get a URL for a resource
     */
    get(path: string): Promise<string> | undefined;
    /**
     * Substitute urls in content, with replacements,
     * relative to a url if provided
     */
    substitute(content: string, url?: string): string;
    destroy(): void;
}
export default Resources;
