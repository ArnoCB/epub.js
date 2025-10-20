import { isXml, parse } from './core';
import Path from './path';

function request<T = unknown>(
  url: string,
  type: string,
  withCredentials: boolean = false,
  headers: Record<string, string> = {}
): Promise<T> {
  const supportsURL = typeof window != 'undefined' ? window.URL : false;
  const BLOB_RESPONSE = supportsURL ? 'blob' : 'arraybuffer';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    //-- Check from PDF.js:
    //   https://github.com/mozilla/pdf.js/blob/master/web/compatibility.js
    const xhrPrototype = XMLHttpRequest.prototype;

    let header;

    if (!('overrideMimeType' in xhrPrototype)) {
      // IE10 might have response, but not overrideMimeType
      Object.defineProperty(xhrPrototype, 'overrideMimeType', {
        value: function xmlHttpRequestOverrideMimeType() {},
      });
    }

    if (withCredentials) {
      xhr.withCredentials = true;
    }

    xhr.onreadystatechange = handler;
    xhr.onerror = err;

    xhr.open('GET', url, true);

    for (header in headers) {
      xhr.setRequestHeader(header, headers[header]!);
    }

    if (type == 'json') {
      xhr.setRequestHeader('Accept', 'application/json');
    }

    // If type isn"t set, determine it from the file extension
    if (!type) {
      type = new Path(url).extension;
    }

    if (type == 'blob') {
      xhr.responseType = BLOB_RESPONSE;
    }

    if (isXml(type)) {
      // xhr.responseType = "document";
      xhr.overrideMimeType('text/xml'); // for OPF parsing
    }

    if (type == 'xhtml') {
      // xhr.responseType = "document";
    }

    if (type == 'html' || type == 'htm') {
      // xhr.responseType = "document";
    }

    if (type == 'binary') {
      xhr.responseType = 'arraybuffer';
    }

    xhr.send();

    function err(e: ProgressEvent<EventTarget>) {
      reject(e);
    }

    function handler(this: XMLHttpRequest) {
      if (this.readyState === XMLHttpRequest.DONE) {
        let responseXML: Document | null = null;

        if (this.responseType === '' || this.responseType === 'document') {
          responseXML = this.responseXML;
        }

        if (this.status === 200 || this.status === 0 || responseXML) {
          //-- Firefox is reporting 0 for blob urls
          let r;

          if (!this.response && !responseXML) {
            reject({
              status: this.status,
              message: 'Empty Response',
              stack: new Error().stack,
            });
            return;
          }

          if (this.status === 403) {
            reject({
              status: this.status,
              response: this.response,
              message: 'Forbidden',
              stack: new Error().stack,
            });
            return;
          }
          if (responseXML) {
            r = this.responseXML;
          } else if (isXml(type)) {
            // xhr.overrideMimeType("text/xml"); // for OPF parsing
            // If this.responseXML wasn't set, try to parse using a DOMParser from text
            r = parse(this.response, 'text/xml');
          } else if (type == 'xhtml') {
            r = parse(this.response, 'application/xhtml+xml');
          } else if (type == 'html' || type == 'htm') {
            r = parse(this.response, 'text/html');
          } else if (type == 'json') {
            r = JSON.parse(this.response);
          } else if (type == 'blob') {
            if (supportsURL) {
              r = this.response;
            } else {
              //-- Safari doesn't support responseType blob, so create a blob from arraybuffer
              r = new Blob([this.response]);
            }
          } else {
            r = this.response;
          }

          resolve(r);
        } else {
          reject({
            status: this.status,
            message: this.response,
            stack: new Error().stack,
          });
        }
      }
    }
  });
}

export default request;
