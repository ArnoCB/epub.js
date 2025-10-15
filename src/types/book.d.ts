/**
 * - requestMethod: A request function to use instead of the default
 * - requestCredentials: send the xhr request withCredentials
 * - requestHeaders: send the xhr request headers
 * - encoding: optional to pass 'binary' or base64' for archived Epubs
 * - replacements: use base64, blobUrl, or none for replacing assets in archived Epubs
 * - canonical: optional function to determine canonical urls for a path
 * - openAs: optional string to determine the input type
 * - keepAbsoluteUrl: whether to keep the absolute URL when opening
 * - store: cache the contents in local storage, value should be the name of the reader
 */

export type BookRequestFunction = (
  url: string,
  type: string,
  withCredentials?: boolean,
  headers?: Record<string, string>
) => Promise<string | Blob | JSON | Document | XMLDocument>;

export type BookOptions = {
  requestMethod?: BookRequestFunction;
  requestCredentials?: boolean;
  requestHeaders?: Record<string, string>;
  encoding?: 'binary' | 'base64';
  replacements?: 'base64' | 'blobUrl' | 'none';
  canonical?: (path: string) => string;
  openAs?: string;
  keepAbsoluteUrl?: boolean;
  store?: string | false;
  [key: string]: unknown;
};
