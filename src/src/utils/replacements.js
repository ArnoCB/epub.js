'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.replaceBase = replaceBase;
exports.replaceCanonical = replaceCanonical;
exports.replaceMeta = replaceMeta;
exports.replaceLinks = replaceLinks;
exports.substitute = substitute;
const url_1 = __importDefault(require('./url'));
function replaceBase(doc, section) {
  var _a;
  let base;
  let url = (_a = section.url) !== null && _a !== void 0 ? _a : '';
  const absolute = url.indexOf('://') > -1;
  if (!doc) {
    return;
  }
  const head = doc.querySelector('head');
  if (!head)
    return;
  base = head.querySelector('base');
  if (!base) {
    base = doc.createElement('base');
    head.insertBefore(base, head.firstChild);
  }
  // Fix for Safari (from or before 2019) crashing if the url doesn't have an origin
  if (!absolute && globalThis.window && globalThis.window.location) {
    url = globalThis.window.location.origin + url;
  }
  base.setAttribute('href', url);
}
function replaceCanonical(doc, section) {
  let link;
  const url = section.canonical;
  if (!doc) {
    return;
  }
  const head = doc.querySelector('head');
  if (!head)
    return;
  link = head.querySelector("link[rel='canonical']");
  if (link) {
    link.setAttribute('href', url !== null && url !== void 0 ? url : '');
  }
  else {
    link = doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url !== null && url !== void 0 ? url : '');
    head.appendChild(link);
  }
}
function replaceMeta(doc, section) {
  let meta;
  const id = section.idref;
  if (!doc) {
    return;
  }
  const head = doc.querySelector('head');
  if (!head)
    return;
  meta = head.querySelector("link[property='dc.identifier']");
  if (meta) {
    meta.setAttribute('content', id !== null && id !== void 0 ? id : '');
  }
  else {
    meta = doc.createElement('meta');
    meta.setAttribute('name', 'dc.identifier');
    meta.setAttribute('content', id !== null && id !== void 0 ? id : '');
    head.appendChild(meta);
  }
}
// TODO: move me to Contents
function replaceLinks(contents, fn) {
  var _a;
  const links = contents.querySelectorAll('a[href]');
  if (!links.length) {
    return;
  }
  const base = contents.ownerDocument.documentElement.querySelector('base');
  const location = base ? ((_a = base.getAttribute('href')) !== null && _a !== void 0 ? _a : undefined) : undefined;
  const replaceLink = function (link) {
    var _a;
    const href = (_a = link.getAttribute('href')) !== null && _a !== void 0 ? _a : '';
    if (href.indexOf('mailto:') === 0) {
      return;
    }
    const absolute = href.indexOf('://') > -1;
    if (absolute) {
      link.setAttribute('target', '_blank');
    }
    else {
      let linkUrl;
      try {
        linkUrl = new url_1.default(href, location);
      }
      catch (_b) {
        // NOOP
      }
      link.onclick = function () {
        if (linkUrl && linkUrl.hash) {
          fn(linkUrl.Path.path + linkUrl.hash);
        }
        else if (linkUrl) {
          fn(linkUrl.Path.path);
        }
        else {
          fn(href);
        }
        return false;
      };
    }
  };
  for (let i = 0; i < links.length; i++) {
    replaceLink(links[i]);
  }
}
function substitute(content, urls, replacements) {
  urls.forEach(function (url, i) {
    if (url && replacements[i]) {
      // Account for special characters in the file name.
      // See https://stackoverflow.com/a/6318729.
      url = url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      content = content.replace(new RegExp(url, 'g'), replacements[i]);
    }
  });
  return content;
}
