import Contents from './contents';
import EpubCFI from './epubcfi';
import Layout from './layout';
import { Axis } from './types';
import { nodeBounds } from './utils/core';
import type { Direction } from './types';
import type { ViewParameter } from './types/mapping';

/**
 * Map text locations to CFI ranges
 * @param {string} [direction="ltr"] Text direction
 * @param {string} [axis="horizontal"] vertical or horizontal axis
 * @param {boolean} [dev] toggle developer highlighting
 */
export class Mapping {
  layout: Layout;
  horizontal: boolean;
  direction: Direction;
  _dev: boolean;

  constructor(layout: Layout, direction?: Direction, axis?: Axis, dev = false) {
    this.layout = layout;
    this.horizontal = axis === 'horizontal' ? true : false;
    this.direction = direction || 'ltr';
    this._dev = dev;
  }

  /**
   * Find CFI pairs for entire section at once
   */
  section(view: ViewParameter) {
    const ranges = this.findRanges(view);
    const map = this.rangeListToCfiList(view.section.cfiBase, ranges);
    return map;
  }

  /**
   * Find CFI pairs for a page
   */
  page(contents: Contents, cfiBase: string, start: number, end: number) {
    const root = contents && contents.document ? contents.document.body : false;

    if (!root) return;

    const result = this.rangePairToCfiPair(cfiBase, {
      start: this.findStart(root, start, end),
      end: this.findEnd(root, start, end),
    });

    if (this._dev === true) {
      const doc = contents.document;
      const startRange = new EpubCFI(result.start).toRange(doc);
      const endRange = new EpubCFI(result.end).toRange(doc);

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
  private walk<T>(
    root: Node,
    func: (node: Node) => T | undefined
  ): T | undefined {
    const filter = {
      acceptNode: function (node: Node) {
        if ((node as Text).data?.trim().length > 0) {
          return NodeFilter.FILTER_ACCEPT;
        } else {
          return NodeFilter.FILTER_REJECT;
        }
      },
    };

    const treeWalker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      filter
    );

    let node;
    let result;

    while ((node = treeWalker.nextNode())) {
      result = func(node);
      if (result) break;
    }

    return result;
  }

  findRanges(view: ViewParameter) {
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
   */
  private findStart(root: Node, start: number, end: number) {
    const stack = [root];
    let $el;
    let found;
    let $prev = root;

    while (stack.length) {
      $el = stack.shift();

      // This shouldn't happen since we check stack.length, but TypeScript doesn't know that
      if (!$el) break;

      found = this.walk($el, (node: Node) => {
        let left, right, top, bottom;
        const elPos = nodeBounds(node);

        if (this.horizontal && this.direction === 'ltr') {
          left = this.horizontal ? elPos.left : elPos.top;
          right = this.horizontal ? elPos.right : elPos.bottom;

          if (left >= start && left <= end) {
            return node;
          } else if (right > start) {
            return node;
          } else {
            $prev = node;
            stack.push(node);
          }
        } else if (this.horizontal && this.direction === 'rtl') {
          left = elPos.left;
          right = elPos.right;

          if (right <= end && right >= start) {
            return node;
          } else if (left < end) {
            return node;
          } else {
            $prev = node;
            stack.push(node);
          }
        } else {
          top = elPos.top;
          bottom = elPos.bottom;

          if (top >= start && top <= end) {
            return node;
          } else if (bottom > start) {
            return node;
          } else {
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
  private findEnd(root: Node, start: number, end: number) {
    const stack = [root];
    let $el;
    let $prev = root;
    let found;

    while (stack.length) {
      $el = stack.shift();

      // This shouldn't happen since we check stack.length, but TypeScript doesn't know that
      if (!$el) break;

      found = this.walk($el, (node: Node) => {
        let left, right, top, bottom;
        const elPos = nodeBounds(node);

        if (this.horizontal && this.direction === 'ltr') {
          left = Math.round(elPos.left);
          right = Math.round(elPos.right);

          if (left > end && $prev) {
            return $prev;
          } else if (right > end) {
            return node;
          } else {
            $prev = node;
            stack.push(node);
          }
        } else if (this.horizontal && this.direction === 'rtl') {
          left = Math.round(this.horizontal ? elPos.left : elPos.top);
          right = Math.round(this.horizontal ? elPos.right : elPos.bottom);

          if (right < start && $prev) {
            return $prev;
          } else if (left < start) {
            return node;
          } else {
            $prev = node;
            stack.push(node);
          }
        } else {
          top = Math.round(elPos.top);
          bottom = Math.round(elPos.bottom);

          if (top > end && $prev) {
            return $prev;
          } else if (bottom > end) {
            return node;
          } else {
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
  private findTextStartRange(node: Node, start: number, end: number) {
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
      } else if (this.horizontal && this.direction === 'rtl') {
        right = pos.right;
        if (right <= end) {
          return range;
        }
      } else {
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
  private findTextEndRange(node: Node, start: number, end: number) {
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
        } else if (right > end) {
          return range;
        }
      } else if (this.horizontal && this.direction === 'rtl') {
        left = pos.left;
        right = pos.right;

        if (right < start && prev) {
          return prev;
        } else if (left < start) {
          return range;
        }
      } else {
        top = pos.top;
        bottom = pos.bottom;

        if (top > end && prev) {
          return prev;
        } else if (bottom > end) {
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
  private splitTextNodeIntoRanges(node: Node, _splitter?: string): Range[] {
    const ranges: Range[] = [];
    const textContent = node.textContent || '';
    const text = textContent.trim();
    let range: Range | null = null;
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
  private rangePairToCfiPair(
    cfiBase: string,
    rangePair: { start: Range; end: Range }
  ): { start: string; end: string } {
    const startRange = rangePair.start;
    const endRange = rangePair.end;

    startRange.collapse(true);
    endRange.collapse(false);

    const startCfi = new EpubCFI(startRange, cfiBase).toString();
    const endCfi = new EpubCFI(endRange, cfiBase).toString();

    return {
      start: startCfi,
      end: endCfi,
    };
  }

  rangeListToCfiList(cfiBase: string, columns: { start: Range; end: Range }[]) {
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
  axis(axis: 'horizontal' | 'vertical'): boolean {
    if (axis) {
      this.horizontal = axis === 'horizontal' ? true : false;
    }
    return this.horizontal;
  }
}

export default Mapping;
