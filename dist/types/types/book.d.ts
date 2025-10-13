// Options for creating/opening a Book
export type BookOptions = {
  requestMethod?: (
    url: string,
    type?: string,
    withCredentials?: boolean,
    headers?: Record<string, string>
  ) => Promise<string | Blob | JSON | Document | XMLDocument>;
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
