import localforage from 'localforage';
import Resources from './resources';
import type { BookRequestFunction, EventEmitterMethods } from './types';
/**
 * Handles saving and requesting files from local storage
 * @param name This should be the name of the application for modals
 */
declare class Store implements Pick<EventEmitterMethods, 'on'> {
    on: EventEmitterMethods['on'];
    storage: typeof localforage | undefined;
    urlCache: Record<string, string>;
    name: string;
    requester: BookRequestFunction;
    resolver: (path: string, absolute?: boolean) => string;
    online: boolean;
    emit: (event: string, ...args: unknown[]) => void;
    private _status;
    constructor(name: string, requester: BookRequestFunction, resolver: (path: string, absolute?: boolean) => string);
    /**
     * Checks to see if localForage exists in global namspace,
     * Requires localForage if it isn't there
     */
    private checkRequirements;
    /**
     * Add online and offline event listeners
     */
    private addListeners;
    /**
     * Remove online and offline event listeners
     */
    private removeListeners;
    /**
     * Update the online / offline status
     */
    private status;
    /**
     * Add all of a book resources to the store
     * @param  {Resources} resources  book resources
     * @param  {boolean} [force] force resaving resources
     * @return {Promise<Array<unknown>>} array of stored objects (typically ArrayBuffers for binary resources)
     */
    add(resources: Resources, force?: boolean): Promise<Array<unknown>>;
    /**
     * Put binary data from a url to storage
     */
    put(url: string, withCredentials?: boolean, headers?: Record<string, string>): Promise<unknown>;
    /**
     * Request a url
     * @param  {string} url  a url to request from storage
     * @param  {string} [type] specify the type of the returned result
     * @param  {boolean} [withCredentials]
     * @param  {object} [headers]
     * @return {Promise<Blob | string | JSON | Document | XMLDocument>}
     */
    request(url: string, type: string, withCredentials?: boolean, headers?: Record<string, string>): Promise<Blob | string | JSON | Document | XMLDocument>;
    /**
     * Request a url from storage
     */
    retrieve(url: string, type?: string): Promise<Blob | string | JSON | Document | XMLDocument>;
    /**
     * Handle the response from request
     */
    private handleResponse;
    /**
     * Get a Blob from Storage by Url
     */
    getBlob(url: string, mimeType?: string): Promise<Blob | undefined>;
    /**
     * Get Text from Storage by Url
     */
    getText(url: string, mimeType?: string): Promise<string | undefined>;
    /**
     * Get a base64 encoded result from Storage by Url
     * @return base64 encoded
     */
    getBase64(url: string, mimeType?: string): Promise<string | undefined>;
    /**
     * Create a Url from a stored item
     */
    createUrl(url: string, options: {
        base64?: boolean;
    }): Promise<string>;
    /**
     * Revoke Temp Url for a archive item
     */
    revokeUrl(url: string): void;
    destroy(): void;
}
export default Store;
