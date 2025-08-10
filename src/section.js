"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
const core_1 = require("./utils/core");
const epubcfi_1 = __importDefault(require("./epubcfi"));
const hook_1 = __importDefault(require("./utils/hook"));
const core_2 = require("./utils/core");
const request_1 = __importDefault(require("./utils/request"));
/**
 * Represents a Section of the Book
 *
 * In most books this is equivalent to a Chapter
 * @param item  The spine item representing the section
 * @param hooks hooks for serialize and content
 */
class Section {
    constructor(item, hooks) {
        this.idref = item.idref;
        this.linear = item.linear === 'yes';
        this.properties = item.properties || [];
        this.index = item.index;
        this.href = item.href;
        this.url = item.url;
        this.canonical = item.canonical;
        this.next = item.next;
        this.prev = item.prev;
        this.cfiBase = item.cfiBase;
        if (hooks) {
            this.hooks = hooks;
        }
        else {
            this.hooks = { serialize: new hook_1.default(this), content: new hook_1.default(this) };
        }
    }
    /**
     * Load the section from its url
     */
    load(_request) {
        const request = _request || this.request || request_1.default;
        const loading = new core_1.defer();
        const loaded = loading.promise;
        if (this.contents) {
            loading.resolve(this.contents);
        }
        else {
            request(this.url, 'xml', false, {})
                .then((xml) => {
                // var directory = new Url(this.url).directory;
                this.document = xml;
                this.contents = xml.documentElement;
                return this.hooks.content.trigger(this.document, this);
            })
                .then(() => {
                loading.resolve(this.contents);
            })
                .catch((error) => {
                loading.reject(error);
            });
        }
        return loaded;
    }
    /**
     * Render the contents of a section
     */
    render(_request) {
        const rendering = new core_1.defer();
        const rendered = rendering.promise;
        this.load(_request)
            .then((contents) => {
            const serializer = new XMLSerializer();
            this.output = serializer.serializeToString(contents);
            return this.output;
        })
            .then(() => {
            return this.hooks.serialize.trigger(this.output, this);
        })
            .then(() => {
            rendering.resolve(this.output);
        })
            .catch((error) => {
            rendering.reject(error);
        });
        return rendered;
    }
    /**
     * Find a string in a section using node-by-node searching.
     * This method searches within individual text nodes, making it suitable
     * for simple text searches. For more advanced cross-element searching,
     * consider using the search() method instead.
     * @param  {string} _query The query string to find
     * @return {Match[]} A list of matches, with form {cfi, excerpt}
     */
    find(_query) {
        const matches = [];
        const query = _query.toLowerCase();
        const find = (node) => {
            const text = node.textContent?.toLowerCase() || '';
            let range = this.document?.createRange();
            let cfi;
            let pos = 0;
            let last = -1;
            let excerpt;
            const limit = 150;
            while (pos != -1) {
                // Search for the query
                pos = text.indexOf(query, last + 1);
                if (pos != -1) {
                    // We found it! Generate a CFI
                    range = this.document.createRange();
                    range.setStart(node, pos);
                    range.setEnd(node, pos + query.length);
                    cfi = this.cfiFromRange(range);
                    // Generate the excerpt
                    if (node.textContent.length < limit) {
                        excerpt = node.textContent;
                    }
                    else {
                        excerpt = node.textContent.substring(pos - limit / 2, pos + limit / 2);
                        excerpt = '...' + excerpt + '...';
                    }
                    // Add the CFI to the matches list
                    matches.push({
                        cfi: cfi,
                        excerpt: excerpt,
                    });
                }
                last = pos;
            }
        };
        if (this.document) {
            (0, core_2.sprint)(this.document.documentElement, function (node) {
                find(node);
            });
        }
        return matches;
    }
    /**
     * Search a string in multiple sequential elements of the section.
     * This method can find text that spans across multiple DOM elements,
     * making it more powerful than find() for complex text searches.
     * Uses document.createTreeWalker for efficient DOM traversal.
     * @param maxSeqEle The maximum number of elements that are combined for search, default value is 5
     */
    search(_query, maxSeqEle = 5) {
        const matches = [];
        const excerptLimit = 150;
        const query = _query.toLowerCase();
        const searchInNodes = (nodeList) => {
            const textWithCase = nodeList.reduce((acc, current) => {
                return acc + (current.textContent || '');
            }, '');
            const text = textWithCase.toLowerCase();
            const pos = text.indexOf(query);
            if (pos != -1) {
                const startNodeIndex = 0, endPos = pos + query.length;
                let endNodeIndex = 0, l = 0;
                if (pos < (nodeList[startNodeIndex].textContent?.length || 0)) {
                    while (endNodeIndex < nodeList.length - 1) {
                        l += nodeList[endNodeIndex].textContent?.length || 0;
                        if (endPos <= l) {
                            break;
                        }
                        endNodeIndex += 1;
                    }
                    const startNode = nodeList[startNodeIndex], endNode = nodeList[endNodeIndex];
                    const range = this.document.createRange();
                    range.setStart(startNode, pos);
                    const beforeEndLengthCount = nodeList
                        .slice(0, endNodeIndex)
                        .reduce((acc, current) => {
                        return acc + (current.textContent?.length || 0);
                    }, 0);
                    range.setEnd(endNode, beforeEndLengthCount > endPos
                        ? endPos
                        : endPos - beforeEndLengthCount);
                    const cfi = this.cfiFromRange(range);
                    let excerpt = nodeList
                        .slice(0, endNodeIndex + 1)
                        .reduce((acc, current) => {
                        return acc + (current.textContent || '');
                    }, '');
                    if (excerpt.length > excerptLimit) {
                        excerpt = excerpt.substring(pos - excerptLimit / 2, pos + excerptLimit / 2);
                        excerpt = '...' + excerpt + '...';
                    }
                    matches.push({
                        cfi: cfi,
                        excerpt: excerpt,
                    });
                }
            }
        };
        const treeWalker = document.createTreeWalker(this.document, NodeFilter.SHOW_TEXT);
        let node, nodeList = [];
        while ((node = treeWalker.nextNode())) {
            nodeList.push(node);
            if (nodeList.length == maxSeqEle) {
                searchInNodes(nodeList.slice(0, maxSeqEle));
                nodeList = nodeList.slice(1, maxSeqEle);
            }
        }
        if (nodeList.length > 0) {
            searchInNodes(nodeList);
        }
        return matches;
    }
    /**
     * Reconciles the current chapters layout properties with
     * the global layout properties.
     * @return layoutProperties Object with layout properties
     */
    reconcileLayoutSettings(globalLayout) {
        //-- Get the global defaults
        const settings = {
            layout: globalLayout.layout,
            spread: globalLayout.spread,
            orientation: globalLayout.orientation,
        };
        //-- Get the chapter's display type
        this.properties?.forEach(function (prop) {
            const rendition = prop.replace('rendition:', '');
            const split = rendition.indexOf('-');
            let property, value;
            if (split !== -1) {
                property = rendition.slice(0, split);
                value = rendition.slice(split + 1);
                settings[property] = value;
            }
        });
        return settings;
    }
    /**
     * Get a CFI from a Range in the Section
     */
    cfiFromRange(_range) {
        return new epubcfi_1.default(_range, this.cfiBase).toString();
    }
    /**
     * Get a CFI from an Element in the Section
     */
    cfiFromElement(el) {
        return new epubcfi_1.default(el, this.cfiBase).toString();
    }
    /**
     * Unload the section document
     */
    unload() {
        this.document = undefined;
        this.contents = undefined;
        this.output = undefined;
    }
    destroy() {
        this.unload();
        this.hooks.serialize.clear();
        this.hooks.content.clear();
        // Clear object references to help GC - but don't set to undefined
        // since these properties are typed as required
        this.next = undefined;
        this.prev = undefined;
        // Note: The object itself will be garbage collected when all references are removed
        // No need to clear primitive properties or create type conflicts
    }
}
exports.Section = Section;
exports.default = Section;
module.exports = Section;
