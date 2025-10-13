import JSZip from 'jszip';
import type { InputFileFormat, ArchiveRequestTypeMap } from './types';
/**
 * Handles Unzipping a requesting files from an Epub Archive
 */
declare class Archive {
    private zip;
    private urlCache;
    constructor();
    /**
     * Checks to see if JSZip exists and can be instantiated,
     * Requires JSZip if it isn't there
     */
    private checkRequirements;
    /**
     * Open an archive
     */
    open(input: InputFileFormat, isBase64: boolean): Promise<JSZip>;
    /**
     * Load and Open an archive
     */
    openUrl(zipUrl: string, isBase64: boolean): Promise<JSZip>;
    request<K extends keyof ArchiveRequestTypeMap>(url: string, type: K): Promise<ArchiveRequestTypeMap[K]>;
    /**
     * Handle the response from request
     */
    private handleResponse;
    /**
     * Get a Blob from Archive by Url
     */
    getBlob(url: string, mimeType?: string): Promise<Blob>;
    getText(url: string): Promise<string>;
    /**
     * Get a base64 encoded result from Archive by Url
     */
    asyncgetBase64(url: string, mimeType?: string): Promise<string>;
    /**
     * Create a Url from an unarchived item
     */
    createUrl(url: string, options?: {
        base64?: boolean;
    }): Promise<string>;
    /**
     * Revoke Temp Url for a archive item
     */
    revokeUrl(url: string): void;
    destroy(): void;
    private getZip;
}
export default Archive;
