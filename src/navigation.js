'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Navigation Parser
 * @param {document} xml navigation html / xhtml / ncx
 */
class Navigation {
  constructor(xml) {
    this.toc = [];
    this.tocByHref = {};
    this.tocById = {};
    this.landmarks = [];
    this.landmarksByType = {};
    this.length = 0;
    if (xml) {
      this.parse(xml);
    }
  }
  /**
   * Parse out the navigation items
   */
  parse(xml) {
    const isXml = xml.nodeType;
    if (!isXml) {
      this.toc = this.load(xml);
    } else {
      const doc = xml;
      const html = doc.querySelector('html');
      const ncx = doc.querySelector('ncx');
      if (html) {
        this.toc = this.parseNav(doc);
        this.landmarks = this.parseLandmarks(doc);
      } else if (ncx) {
        this.toc = this.parseNcx(doc);
      }
    }
    this.length = 0;
    this.unpack(this.toc);
  }
  /**
   * Unpack navigation items
   * @private
   * @param  {array} toc
   */
  unpack(toc) {
    let item;
    for (let i = 0; i < toc.length; i++) {
      item = toc[i];
      if (item.href) {
        this.tocByHref[item.href] = i;
      }
      if (item.id) {
        this.tocById[item.id] = i;
      }
      this.length++;
      if (item.subitems.length) {
        this.unpack(item.subitems);
      }
    }
  }
  /**
   * Get an item from the navigation
   */
  get(target) {
    let index;
    if (!target) {
      return this.toc;
    }
    if (target.indexOf('#') === 0) {
      index = this.tocById[target.substring(1)];
    } else if (target in this.tocByHref) {
      index = this.tocByHref[target];
    }
    if (index === undefined) {
      return;
    }
    return this.getByIndex(target, index, this.toc);
  }
  /**
   * Get an item from navigation subitems recursively by index
   */
  getByIndex(target, index, navItems) {
    if (navItems.length === 0) {
      return;
    }
    const item = navItems[index];
    if (item && (target === item.id || target === item.href)) {
      return item;
    }
    let result;
    for (let i = 0; i < navItems.length; ++i) {
      result = this.getByIndex(target, index, navItems[i].subitems);
      if (result) {
        break;
      }
    }
    return result;
  }
  /**
   * Get a landmark by type
   * List of types: https://idpf.github.io/epub-vocabs/structure/
   */
  landmark(type) {
    if (!type) {
      return this.landmarks;
    }
    const index = this.landmarksByType[type];
    return this.landmarks[index];
  }
  /**
   * Parse toc from a Epub > 3.0 Nav
   * @private
   * @param  {document} navHtml
   * @return {array} navigation list
   */
  parseNav(navHtml) {
    const navElement = navHtml.querySelector('nav[*|type="toc"]');
    let list = [];
    if (!navElement) return list;
    const navList = navElement.querySelector('ol');
    if (!navList) return list;
    list = this.parseNavList(navList);
    return list;
  }
  /**
   * Parses lists in the toc
   * @param  {document} navListHtml
   * @param  {string} parent id
   * @return {array} navigation list
   */
  parseNavList(navListHtml, parent) {
    const result = [];
    if (!navListHtml) return result;
    if (!navListHtml.children) return result;
    for (let i = 0; i < navListHtml.children.length; i++) {
      const item = this.navItem(navListHtml.children[i], parent);
      if (item) {
        result.push(item);
      }
    }
    return result;
  }
  /**
   * Create a navItem
   */
  navItem(item, parent) {
    let id = item.getAttribute('id') || undefined;
    const content =
      item.querySelector(':scope > a') || item.querySelector(':scope > span');
    if (!content) {
      return;
    }
    const src = content.getAttribute('href') || '';
    if (!id) {
      id = src;
    }
    const text = content.textContent || '';
    let subitems = [];
    const nested = item.querySelector(':scope > ol');
    if (nested) {
      subitems = this.parseNavList(nested, id);
    }
    return {
      id: id,
      href: src,
      label: text,
      subitems: subitems,
      parent: parent,
    };
  }
  /**
   * Parse landmarks from a Epub > 3.0 Nav
   */
  parseLandmarks(navHtml) {
    const navElement = navHtml.querySelector('nav[*|type="landmarks"]');
    const navItems = navElement
      ? Array.from(navElement.querySelectorAll('li'))
      : [];
    const length = navItems.length;
    let i;
    const list = [];
    let item;
    if (!navItems || length === 0) return list;
    for (i = 0; i < length; ++i) {
      item = this.landmarkItem(navItems[i]);
      if (item && item.type) {
        list.push(item);
        this.landmarksByType[item.type] = i;
      }
    }
    return list;
  }
  /**
   * Create a landmarkItem
   * @param  {element} item
   * @return {object} landmarkItem
   */
  landmarkItem(item) {
    const content = item.querySelector('a');
    if (!content) {
      return;
    }
    const type =
      content.getAttributeNS('http://www.idpf.org/2007/ops', 'type') ||
      undefined;
    const href = content.getAttribute('href') || '';
    const text = content.textContent || '';
    return {
      href: href,
      label: text,
      type: type,
    };
  }
  /**
   * Parse from a Epub > 3.0 NC
   */
  parseNcx(tocXml) {
    const navPoints = Array.from(tocXml.querySelectorAll('navPoint'));
    const length = navPoints.length;
    let i;
    const toc = {};
    const list = [];
    let item, parent;
    if (!navPoints || length === 0) return list;
    for (i = 0; i < length; ++i) {
      item = this.ncxItem(navPoints[i]);
      toc[item.id] = item;
      if (!item.parent) {
        list.push(item);
      } else {
        parent = toc[item.parent];
        parent.subitems.push(item);
      }
    }
    return list;
  }
  /**
   * Create a ncxItem
   * @private
   * @param  {element} item
   * @return {object} ncxItem
   */
  ncxItem(item) {
    const id = item.getAttribute('id') || '';
    const content = item.querySelector('content');
    const src = content?.getAttribute('src') || '';
    const navLabel = item.querySelector('navLabel');
    const text = navLabel?.textContent || '';
    const subitems = [];
    const parentNode = item.parentNode;
    let parent;
    if (
      parentNode &&
      parentNode instanceof Element &&
      (parentNode.nodeName === 'navPoint' ||
        parentNode.nodeName.split(':').slice(-1)[0] === 'navPoint')
    ) {
      parent = parentNode.getAttribute('id') || undefined;
    }
    return {
      id,
      href: src,
      label: text,
      subitems,
      parent,
    };
  }
  /**
   * Load Spine Items
   */
  load(json) {
    return json.map((item) => {
      return {
        id: item.id || item.href || '',
        href: item.href || '',
        label: item.title,
        subitems: item.children ? this.load(item.children) : [],
        parent: item.parent,
      };
    });
  }
  /**
   * forEach pass through
   */
  forEach(fn) {
    return this.toc.forEach(fn);
  }
}
exports.default = Navigation;
