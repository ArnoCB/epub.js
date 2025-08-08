"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapping = void 0;
const epubcfi_1 = __importDefault(require("./epubcfi"));
const core_1 = require("./utils/core");
/**
 * Map text locations to CFI ranges
 * @param {Layout} layout Layout to apply
 * @param {string} [direction="ltr"] Text direction
 * @param {string} [axis="horizontal"] vertical or horizontal axis
 * @param {boolean} [dev] toggle developer highlighting
 */
class Mapping {
    constructor(layout, direction, axis, dev = false) {
        this.layout = layout;
        this.horizontal = axis === 'horizontal' ? true : false;
        this.direction = direction || 'ltr';
        this._dev = dev;
    }
    /**
     * Find CFI pairs for entire section at once
     */
    section(view) {
        const ranges = this.findRanges(view);
        const map = this.rangeListToCfiList(view.section.cfiBase, ranges);
        return map;
    }
    /**
     * Find CFI pairs for a page
     */
    page(contents, cfiBase, start, end) {
        const root = contents && contents.document ? contents.document.body : false;
        if (!root) {
            return;
        }
        const result = this.rangePairToCfiPair(cfiBase, {
            start: this.findStart(root, start, end),
            end: this.findEnd(root, start, end),
        });
        if (this._dev === true) {
            const doc = contents.document;
            const startRange = new epubcfi_1.default(result.start).toRange(doc);
            const endRange = new epubcfi_1.default(result.end).toRange(doc);
            if (!startRange || !endRange) {
                throw new Error('Invalid range');
            }
            if (!doc) {
                throw new Error('Document is not available');
            }
            if (!doc.defaultView) {
                throw new Error('Document defaultView is not available');
            }
            const selection = doc.defaultView.getSelection();
            if (!selection) {
                throw new Error('Selection is not available');
            }
            const r = doc.createRange();
            selection?.removeAllRanges();
            r.setStart(startRange.startContainer, startRange.startOffset);
            r.setEnd(endRange.endContainer, endRange.endOffset);
            selection.addRange(r);
        }
        return result;
    }
    /**
     * Walk a node, preforming a function on each node it finds
     */
    walk(root, func) {
        const filter = {
            acceptNode: function (node) {
                if (node.data?.trim().length > 0) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                else {
                    return NodeFilter.FILTER_REJECT;
                }
            },
        };
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter);
        let node;
        let result;
        while ((node = treeWalker.nextNode())) {
            result = func(node);
            if (result)
                break;
        }
        return result;
    }
    findRanges(view) {
        const columns = [];
        const scrollWidth = view.contents.scrollWidth();
        const spreads = Math.ceil(scrollWidth / this.layout.spreadWidth);
        const count = spreads * this.layout.divisor;
        const columnWidth = this.layout.columnWidth;
        const gap = this.layout.gap;
        let start, end;
        for (let i = 0; i < count; i++) {
            start = (columnWidth + gap) * i;
            end = columnWidth * (i + 1) + gap * i;
            columns.push({
                start: this.findStart(view.document.body, start, end),
                end: this.findEnd(view.document.body, start, end),
            });
        }
        return columns;
    }
    /**
     * Find Start Range
     * @private
     * @param {Node} root root node
     * @param {number} start position to start at
     * @param {number} end position to end at
     * @return {Range}
     */
    findStart(root, start, end) {
        const stack = [root];
        let $el;
        let found;
        let $prev = root;
        while (stack.length) {
            $el = stack.shift();
            // This shouldn't happen since we check stack.length, but TypeScript doesn't know that
            if (!$el)
                break;
            found = this.walk($el, (node) => {
                let left, right, top, bottom;
                const elPos = (0, core_1.nodeBounds)(node);
                if (this.horizontal && this.direction === 'ltr') {
                    left = this.horizontal ? elPos.left : elPos.top;
                    right = this.horizontal ? elPos.right : elPos.bottom;
                    if (left >= start && left <= end) {
                        return node;
                    }
                    else if (right > start) {
                        return node;
                    }
                    else {
                        $prev = node;
                        stack.push(node);
                    }
                }
                else if (this.horizontal && this.direction === 'rtl') {
                    left = elPos.left;
                    right = elPos.right;
                    if (right <= end && right >= start) {
                        return node;
                    }
                    else if (left < end) {
                        return node;
                    }
                    else {
                        $prev = node;
                        stack.push(node);
                    }
                }
                else {
                    top = elPos.top;
                    bottom = elPos.bottom;
                    if (top >= start && top <= end) {
                        return node;
                    }
                    else if (bottom > start) {
                        return node;
                    }
                    else {
                        $prev = node;
                        stack.push(node);
                    }
                }
            });
            if (found) {
                return this.findTextStartRange(found, start, end);
            }
        }
        // Return last element
        return this.findTextStartRange($prev, start, end);
    }
    /**
     * Find End Range
     */
    findEnd(root, start, end) {
        const stack = [root];
        let $el;
        let $prev = root;
        let found;
        while (stack.length) {
            $el = stack.shift();
            // This shouldn't happen since we check stack.length, but TypeScript doesn't know that
            if (!$el)
                break;
            found = this.walk($el, (node) => {
                let left, right, top, bottom;
                const elPos = (0, core_1.nodeBounds)(node);
                if (this.horizontal && this.direction === 'ltr') {
                    left = Math.round(elPos.left);
                    right = Math.round(elPos.right);
                    if (left > end && $prev) {
                        return $prev;
                    }
                    else if (right > end) {
                        return node;
                    }
                    else {
                        $prev = node;
                        stack.push(node);
                    }
                }
                else if (this.horizontal && this.direction === 'rtl') {
                    left = Math.round(this.horizontal ? elPos.left : elPos.top);
                    right = Math.round(this.horizontal ? elPos.right : elPos.bottom);
                    if (right < start && $prev) {
                        return $prev;
                    }
                    else if (left < start) {
                        return node;
                    }
                    else {
                        $prev = node;
                        stack.push(node);
                    }
                }
                else {
                    top = Math.round(elPos.top);
                    bottom = Math.round(elPos.bottom);
                    if (top > end && $prev) {
                        return $prev;
                    }
                    else if (bottom > end) {
                        return node;
                    }
                    else {
                        $prev = node;
                        stack.push(node);
                    }
                }
            });
            if (found) {
                return this.findTextEndRange(found, start, end);
            }
        }
        // end of chapter
        return this.findTextEndRange($prev, start, end);
    }
    /**
     * Find Text Start Range
     */
    findTextStartRange(node, start, end) {
        const ranges = this.splitTextNodeIntoRanges(node);
        let range;
        let pos;
        let left, top, right;
        for (let i = 0; i < ranges.length; i++) {
            range = ranges[i];
            pos = range.getBoundingClientRect();
            if (this.horizontal && this.direction === 'ltr') {
                left = pos.left;
                if (left >= start) {
                    return range;
                }
            }
            else if (this.horizontal && this.direction === 'rtl') {
                right = pos.right;
                if (right <= end) {
                    return range;
                }
            }
            else {
                top = pos.top;
                if (top >= start) {
                    return range;
                }
            }
            // prev = range;
        }
        return ranges[0];
    }
    /**
     * Find Text End Range
     */
    findTextEndRange(node, start, end) {
        const ranges = this.splitTextNodeIntoRanges(node);
        let prev;
        let range;
        let pos;
        let left, right, top, bottom;
        for (let i = 0; i < ranges.length; i++) {
            range = ranges[i];
            pos = range.getBoundingClientRect();
            if (this.horizontal && this.direction === 'ltr') {
                left = pos.left;
                right = pos.right;
                if (left > end && prev) {
                    return prev;
                }
                else if (right > end) {
                    return range;
                }
            }
            else if (this.horizontal && this.direction === 'rtl') {
                left = pos.left;
                right = pos.right;
                if (right < start && prev) {
                    return prev;
                }
                else if (left < start) {
                    return range;
                }
            }
            else {
                top = pos.top;
                bottom = pos.bottom;
                if (top > end && prev) {
                    return prev;
                }
                else if (bottom > end) {
                    return range;
                }
            }
            prev = range;
        }
        // Ends before limit
        return ranges[ranges.length - 1];
    }
    /**
     * Split up a text node into ranges for each word
     */
    splitTextNodeIntoRanges(node, _splitter) {
        const ranges = [];
        const textContent = node.textContent || '';
        const text = textContent.trim();
        let range = null;
        const doc = node.ownerDocument;
        if (!doc) {
            throw new Error('Document is not available');
        }
        const splitter = _splitter || ' ';
        let pos = text.indexOf(splitter);
        if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
            range = doc.createRange();
            range.selectNodeContents(node);
            return [range];
        }
        range = doc.createRange();
        range.setStart(node, 0);
        range.setEnd(node, pos);
        ranges.push(range);
        range = null;
        while (pos != -1) {
            pos = text.indexOf(splitter, pos + 1);
            if (pos > 0) {
                if (range) {
                    range.setEnd(node, pos);
                    ranges.push(range);
                }
                range = doc.createRange();
                range.setStart(node, pos + 1);
            }
        }
        if (range) {
            range.setEnd(node, text.length);
            ranges.push(range);
        }
        return ranges;
    }
    /**
     * Turn a pair of ranges into a pair of CFIs
     */
    rangePairToCfiPair(cfiBase, rangePair) {
        const startRange = rangePair.start;
        const endRange = rangePair.end;
        startRange.collapse(true);
        endRange.collapse(false);
        const startCfi = new epubcfi_1.default(startRange, cfiBase).toString();
        const endCfi = new epubcfi_1.default(endRange, cfiBase).toString();
        return {
            start: startCfi,
            end: endCfi,
        };
    }
    rangeListToCfiList(cfiBase, columns) {
        const map = [];
        let cifPair;
        for (let i = 0; i < columns.length; i++) {
            cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);
            map.push(cifPair);
        }
        return map;
    }
    /**
     * Set the axis for mapping
     */
    axis(axis) {
        if (axis) {
            this.horizontal = axis === 'horizontal' ? true : false;
        }
        return this.horizontal;
    }
}
exports.Mapping = Mapping;
exports.default = Mapping;
