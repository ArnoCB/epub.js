"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const epubcfi_1 = __importDefault(require("./epubcfi"));
const hook_1 = __importDefault(require("./utils/hook"));
const section_1 = __importDefault(require("./section"));
const replacements_1 = require("./utils/replacements");
/**
 * A collection of Spine Items
 */
class Spine {
    constructor() {
        this.spineItems = [];
        this.spineByHref = {};
        this.spineById = {};
        this.hooks = {
            serialize: new hook_1.default(),
            content: new hook_1.default(),
        };
        this.epubcfi = new epubcfi_1.default();
        this.loaded = false;
        this.items = undefined;
        this.manifest = undefined;
        this.spineNodeIndex = undefined;
        this.baseUrl = undefined;
        this.length = undefined;
        // Register replacements
        this.hooks.content.register(replacements_1.replaceBase);
        this.hooks.content.register(replacements_1.replaceCanonical);
        this.hooks.content.register(replacements_1.replaceMeta);
    }
    /**
     * Unpack items from a opf into spine items
     * @param  {Packaging} _package
     * @param  {method} resolver URL resolver
     * @param  {method} canonical Resolve canonical url
     */
    unpack(_package, resolver, canonical) {
        this.items = _package.spine;
        this.manifest = _package.manifest;
        this.spineNodeIndex = _package.spineNodeIndex;
        this.baseUrl = _package.baseUrl || _package.basePath || '';
        this.length = this.items.length;
        if (!this.manifest) {
            throw new Error('Manifest is missing');
        }
        this.items.forEach((item, index) => {
            const manifestItem = this.manifest[item.idref];
            item.index = index;
            item.cfiBase = this.epubcfi.generateChapterComponent(this.spineNodeIndex, item.index, item.id);
            if (item.href) {
                item.url = resolver(item.href, true);
                item.canonical = canonical(item.href);
            }
            if (manifestItem) {
                item.href = manifestItem.href;
                item.url = resolver(item.href, true);
                item.canonical = canonical(item.href);
                if (manifestItem.properties.length) {
                    item.properties.push(...manifestItem.properties);
                }
            }
            if (item.linear === 'yes') {
                item.prev = () => {
                    let prevIndex = item.index;
                    while (prevIndex > 0) {
                        const prev = this.get(prevIndex - 1);
                        if (prev && prev.linear) {
                            return prev;
                        }
                        prevIndex -= 1;
                    }
                    return;
                };
                item.next = () => {
                    let nextIndex = item.index;
                    while (nextIndex < this.spineItems.length - 1) {
                        const next = this.get(nextIndex + 1);
                        if (next && next.linear) {
                            return next;
                        }
                        nextIndex += 1;
                    }
                    return;
                };
            }
            else {
                item.prev = () => {
                    return undefined;
                };
                item.next = () => {
                    return undefined;
                };
            }
            const spineItem = new section_1.default(item, this.hooks);
            this.append(spineItem);
        });
        this.loaded = true;
    }
    /**
     * Get an item from the spine
     * @example spine.get();
     * @example spine.get(1);
     * @example spine.get("chap1.html");
     * @example spine.get("#id1234");
     */
    get(target) {
        let index = 0;
        if (typeof target === 'undefined') {
            while (index < this.spineItems.length) {
                const next = this.spineItems[index];
                if (next && next.linear) {
                    break;
                }
                index += 1;
            }
        }
        else if (this.epubcfi.isCfiString(target)) {
            const cfi = new epubcfi_1.default(target);
            index = cfi.spinePos;
        }
        else if (typeof target === 'number' ||
            (typeof target === 'string' && !isNaN(Number(target)))) {
            index = typeof target === 'number' ? target : Number(target);
        }
        else if (typeof target === 'string' && target.indexOf('#') === 0) {
            index = this.spineById[target.substring(1)];
        }
        else if (typeof target === 'string') {
            // Remove fragments
            target = target.split('#')[0];
            index = this.spineByHref[target] || this.spineByHref[encodeURI(target)];
        }
        return this.spineItems[index] || null;
    }
    /**
     * Append a Section to the Spine
     */
    append(section) {
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
    prepend(section) {
        // var index = this.spineItems.unshift(section);
        this.spineByHref[section.href] = 0;
        this.spineById[section.idref] = 0;
        // Re-index
        this.spineItems.forEach(function (item, index) {
            item.index = index;
        });
        return 0;
    }
    // insert(section, index) {
    //
    // };
    /**
     * Remove a Section from the Spine
     */
    remove(section) {
        const index = this.spineItems.indexOf(section);
        if (index > -1) {
            delete this.spineByHref[section.href];
            delete this.spineById[section.idref];
            return this.spineItems.splice(index, 1);
        }
    }
    /**
     * Loop over the Sections in the Spine
     */
    each(...args) {
        return this.spineItems.forEach(...args);
    }
    /**
     * Find the first Section in the Spine
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
    last() {
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
        this.spineItems.forEach((section) => section.destroy());
        this.hooks.serialize.clear();
        this.hooks.content.clear();
        // Clear properties that are legitimately optional
        this.loaded = false;
        this.items = undefined;
        this.manifest = undefined;
        this.spineNodeIndex = undefined;
        this.baseUrl = undefined;
        this.length = undefined;
        // Note: Required properties (spineItems, hooks, etc.) don't need to be cleared
        // The entire object will be garbage collected when all references are removed
    }
}
exports.default = Spine;
module.exports = Spine;
