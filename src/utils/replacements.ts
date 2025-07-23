import Url from './url';

export interface Section {
  url?: string;
  canonical?: string;
  idref?: string;
}

export function replaceBase(doc: Document, section: Section): void {
  let base;
  let url = section.url ?? '';
  const absolute = url.indexOf('://') > -1;

  if (!doc) {
    return;
  }

  const head = doc.querySelector('head');
  if (!head) return;
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

export function replaceCanonical(doc: Document, section: Section): void {
  let link;
  const url = section.canonical;

  if (!doc) {
    return;
  }

  const head = doc.querySelector('head');
  if (!head) return;
  link = head.querySelector("link[rel='canonical']");

  if (link) {
    link.setAttribute('href', url ?? '');
  } else {
    link = doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url ?? '');
    head.appendChild(link);
  }
}

export function replaceMeta(doc: Document, section: Section): void {
  let meta;

  const id = section.idref;
  if (!doc) {
    return;
  }

  const head = doc.querySelector('head');
  if (!head) return;
  meta = head.querySelector("link[property='dc.identifier']");

  if (meta) {
    meta.setAttribute('content', id ?? '');
  } else {
    meta = doc.createElement('meta');
    meta.setAttribute('name', 'dc.identifier');
    meta.setAttribute('content', id ?? '');
    head.appendChild(meta);
  }
}

// TODO: move me to Contents
export function replaceLinks(
  contents: Element,
  fn: (href: string) => void
): void {
  const links = contents.querySelectorAll<HTMLAnchorElement>('a[href]');

  if (!links.length) {
    return;
  }

  const base = contents.ownerDocument.documentElement.querySelector('base');
  const location = base ? (base.getAttribute('href') ?? undefined) : undefined;
  const replaceLink = function (link: HTMLAnchorElement): void {
    const href = link.getAttribute('href') ?? '';

    if (href.indexOf('mailto:') === 0) {
      return;
    }

    const absolute = href.indexOf('://') > -1;

    if (absolute) {
      link.setAttribute('target', '_blank');
    } else {
      let linkUrl: Url | undefined;
      try {
        linkUrl = new Url(href, location);
      } catch {
        // NOOP
      }

      link.onclick = function () {
        if (linkUrl && linkUrl.hash) {
          fn(linkUrl.Path.path + linkUrl.hash);
        } else if (linkUrl) {
          fn(linkUrl.Path.path);
        } else {
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

export function substitute(
  content: string,
  urls: string[],
  replacements: string[]
) {
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
