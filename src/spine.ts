import EpubCFI from './epubcfi';
import Hook from './utils/hook';
import Section from './section';
import {
  replaceBase,
  replaceCanonical,
  replaceMeta,
} from './utils/replacements';
import Packaging from 'types/packaging';

/**
 * A collection of Spine Items
 */
class Spine {
  public spineItems: Section[] = [];
  public spineByHref: { [key: string]: number } = {};
  public spineById: { [key: string]: number } = {};
  public hooks: {
    serialize?: Hook;
    content?: Hook;
  };
 
  public epubcfi: EpubCFI | undefined;
  public items: Packaging['spine'] | undefined;
  public manifest: Packaging['manifest'] | undefined;
  public spineNodeIndex: Packaging['spineNodeIndex'] | undefined;
  public baseUrl: string | undefined;
  public length: number | undefined;
  public loaded: boolean = false;

  constructor() {
    this.hooks = {};
    this.hooks.serialize = new Hook();
    this.hooks.content = new Hook();

    // Register replacements
    this.hooks.content.register(replaceBase);
    this.hooks.content.register(replaceCanonical);
    this.hooks.content.register(replaceMeta);

    this.epubcfi = new EpubCFI();

    this.items = undefined;
    this.manifest = undefined;
    this.spineNodeIndex = undefined;
    this.baseUrl = undefined;
    this.length = undefined;
  }

  /**
   * Unpack items from a opf into spine items
   * @param  {Packaging} _package
   * @param  {method} resolver URL resolver
   * @param  {method} canonical Resolve canonical url
   */
  unpack(_package: Packaging, resolver: (url: string, absolute?: boolean) => string | undefined, canonical: (url: string) => string | undefined) {
    this.items = _package.spine;
    this.manifest = _package.manifest;
    this.spineNodeIndex = _package.spineNodeIndex;
    this.baseUrl = _package.baseUrl || _package.basePath || '';
    this.length = this.items.length;

    this.items.forEach((item, index) => {
      const manifestItem = this.manifest[item.idref];
      let spineItem;

      item.index = index;
      item.cfiBase = this.epubcfi.generateChapterComponent(
        this.spineNodeIndex,
        item.index,
        item.id
      );

      if (item.href) {
        item.url = resolver(item.href, true);
      }

      if (manifestItem) {
        item.href = manifestItem.href;
        item.url = resolver(item.href, true);
        item.canonical = canonical(item.href);

        if (manifestItem.properties.length) {
          item.properties.push.apply(item.properties, manifestItem.properties);
        }
      }

      if (item.linear === 'yes') {
        item.prev = function () {
          let prevIndex = item.index;
          while (prevIndex > 0) {
            const prev = this.get(prevIndex - 1);
            if (prev && prev.linear) {
              return prev;
            }
            prevIndex -= 1;
          }
          return;
        }.bind(this);
        item.next = function () {
          let nextIndex = item.index;
          while (nextIndex < this.spineItems.length - 1) {
            const next = this.get(nextIndex + 1);
            if (next && next.linear) {
              return next;
            }
            nextIndex += 1;
          }
          return;
        }.bind(this);
      } else {
        item.prev = function () {
          return;
        };
        item.next = function () {
          return;
        };
      }

      spineItem = new Section(item, this.hooks);

      this.append(spineItem);
    });

    this.loaded = true;
  }

  /**
   * Get an item from the spine
   * @param  {string|number} [target]
   * @return {Section} section
   * @example spine.get();
   * @example spine.get(1);
   * @example spine.get("chap1.html");
   * @example spine.get("#id1234");
   */
  get(target: string|number|Range|Node): Section | null {
    let index = 0;

    if (typeof target === 'undefined') {
      while (index < this.spineItems.length) {
        const next = this.spineItems[index];
        if (next && next.linear) {
          break;
        }
        index += 1;
      }
    } else if (this.epubcfi.isCfiString(target)) {
      const cfiObj = new EpubCFI(target);
      index = cfiObj.spinePos;
    } else if (target instanceof Range || (target && target.startContainer)) {
      // If target is a DOM Range or range-like, convert to DOM Range and pass to EpubCFI
      let domRange = target instanceof Range ? target : null;
      if (!domRange && target && target.startContainer) {
        domRange = document.createRange();
        domRange.setStart(target.startContainer, target.startOffset);
        domRange.setEnd(target.endContainer, target.endOffset);
      }
      const cfiObj = domRange ? new EpubCFI(domRange) : new EpubCFI(target);
      index = cfiObj.spinePos;
    } else if (typeof target === 'number' || isNaN(target) === false) {
      index = target;
    } else if (typeof target === 'string' && target.indexOf('#') === 0) {
      index = this.spineById[target.substring(1)];
    } else if (typeof target === 'string') {
      // Remove fragments
      target = target.split('#')[0];
      index = this.spineByHref[target] || this.spineByHref[encodeURI(target)];
    }

    return this.spineItems[index] || null;
  }

  /**
   * Append a Section to the Spine
   */
  private append(section: Section) {
    const index = this.spineItems.length;
    section.index = index;

    this.spineItems.push(section);

    // Encode and Decode href lookups
    // see pr for details: https://github.com/futurepress/epub.js/pull/358
    this.spineByHref[decodeURI(section.href)] = index;
    this.spineByHref[encodeURI(section.href)] = index;
    this.spineByHref[section.href] = index;

    this.spineById[section.idref] = index;

    return index;
  }

  /**
   * Prepend a Section to the Spine
   */
  private prepend(section: Section) {
    // var index = this.spineItems.unshift(section);
    this.spineByHref[section.href] = 0;
    this.spineById[section.idref] = 0;

    // Re-index
    this.spineItems.forEach(function (item, index) {
      item.index = index;
    });

    return 0;
  }

  /**
   * Remove a Section from the Spine
   */
  private remove(section: Section) {
    const index = this.spineItems.indexOf(section);

    if (index > -1) {
      delete this.spineByHref[section.href];
      delete this.spineById[section.idref];

      return this.spineItems.splice(index, 1);
    }
  }

  /**
   * Loop over the Sections in the Spine
   * @return {method} forEach
   */
  each() {
    return this.spineItems.forEach.apply(this.spineItems, arguments);
  }

  /**
   * Find the first Section in the Spine
   * @return {Section} first section
   */
  first() {
    let index = 0;

    do {
      const next = this.get(index);

      if (next && next.linear) {
        return next;
      }
      index += 1;
    } while (index < this.spineItems.length);
  }

  /**
   * Find the last Section in the Spine
   */
  last(): Section | undefined {
    let index = this.spineItems.length - 1;

    do {
      const prev = this.get(index);
      if (prev && prev.linear) {
        return prev;
      }
      index -= 1;
    } while (index >= 0);
  }

  destroy() {
    this.each((section) => section.destroy());

    this.spineItems = undefined;
    this.spineByHref = undefined;
    this.spineById = undefined;

    this.hooks.serialize.clear();
    this.hooks.content.clear();
    this.hooks = undefined;

    this.epubcfi = undefined;

    this.loaded = false;

    this.items = undefined;
    this.manifest = undefined;
    this.spineNodeIndex = undefined;
    this.baseUrl = undefined;
    this.length = undefined;
  }
}

export default Spine;
