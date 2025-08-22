import { defer } from './utils/core';
import EpubCFI from './epubcfi';
import Hook from './utils/hook';
import { sprint } from './utils/core';
import Request from './utils/request';

// Define the actual item structure that gets passed to Section constructor
export interface SectionItem {
  idref: string;
  index: number;
  cfiBase: string;
  href: string;
  url?: string;
  canonical?: string;
  properties?: Array<string>;
  linear?: string;
  next: () => Section | undefined;
  prev: () => Section | undefined;
}

// Define the Match interface for search results
interface Match {
  cfi: string;
  excerpt: string;
}

/**
 * Represents a Section of the Book
 *
 * In most books this is equivalent to a Chapter
 * @param item  The spine item representing the section
 * @param hooks hooks for serialize and content
 */
export class Section {
  hooks: { serialize: Hook; content: Hook };
  idref: string;
  linear: undefined | boolean;
  properties: string[];
  index: number;
  href: string;
  url: undefined | string;
  next: () => Section | undefined;
  prev: () => Section | undefined;
  cfiBase: undefined | string;
  canonical: undefined | string;
  request?: (url: string) => Promise<Document>;

  document: undefined | Document;
  contents: undefined | HTMLElement;
  output: undefined | string;

  constructor(item: SectionItem, hooks?: { serialize: Hook; content: Hook }) {
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
    } else {
      this.hooks = { serialize: new Hook(this), content: new Hook(this) };
    }
  }

  /**
   * Load the section from its url
   */
  load<T>(_request?: (url: string) => Promise<T>) {
    const request = _request || this.request || Request;
    const loading = new defer();
    const loaded = loading.promise;

    if (this.contents) {
      loading.resolve(this.contents);
    } else {
      request(this.url!, 'xml', false, {})
        .then((xml) => {
          this.document = xml as Document;
          this.contents = (xml as Document).documentElement;

          return this.hooks!.content.trigger(this.document, this);
        })
        .then(() => {
          loading.resolve(this.contents);
        })
        .catch((error: unknown) => {
          loading.reject(error);
        });
    }

    return loaded;
  }

  /**
   * Render the contents of a section
   */
  render(_request?: (url: string) => Promise<Document>) {
    const rendering = new defer();
    const rendered = rendering.promise;

    this.load(_request)
      .then((contents: unknown) => {
        const serializer = new XMLSerializer();
        this.output = serializer.serializeToString(contents as Node);
        return this.output;
      })
      .then(() => {
        return this.hooks!.serialize.trigger(this.output, this);
      })
      .then(() => {
        rendering.resolve(this.output);
      })
      .catch((error: unknown) => {
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
  find(_query: string): Match[] {
    const matches: Match[] = [];
    const query = _query.toLowerCase();
    const find = (node: Node) => {
      const text = node.textContent?.toLowerCase() || '';
      let range = this.document?.createRange();
      let cfi: string;
      let pos: number = 0;
      let last = -1;
      let excerpt: string;
      const limit = 150;

      while (pos != -1) {
        // Search for the query
        pos = text.indexOf(query, last + 1);

        if (pos != -1) {
          // We found it! Generate a CFI
          range = this.document!.createRange();
          range.setStart(node, pos);
          range.setEnd(node, pos + query.length);

          cfi = this.cfiFromRange(range);

          // Generate the excerpt
          if (node.textContent!.length < limit) {
            excerpt = node.textContent!;
          } else {
            excerpt = node.textContent!.substring(
              pos - limit / 2,
              pos + limit / 2
            );
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
      sprint(this.document.documentElement, function (node: Node) {
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
  search(_query: string, maxSeqEle = 5): Match[] {
    const matches: Match[] = [];
    const excerptLimit = 150;
    const query = _query.toLowerCase();
    const searchInNodes = (nodeList: Node[]) => {
      const textWithCase = nodeList.reduce((acc: string, current: Node) => {
        return acc + (current.textContent || '');
      }, '');
      const text = textWithCase.toLowerCase();
      const pos = text.indexOf(query);
      if (pos != -1) {
        const startNodeIndex = 0,
          endPos = pos + query.length;
        let endNodeIndex = 0,
          l = 0;
        if (pos < (nodeList[startNodeIndex].textContent?.length || 0)) {
          while (endNodeIndex < nodeList.length - 1) {
            l += nodeList[endNodeIndex].textContent?.length || 0;
            if (endPos <= l) {
              break;
            }
            endNodeIndex += 1;
          }

          const startNode = nodeList[startNodeIndex],
            endNode = nodeList[endNodeIndex];
          const range = this.document!.createRange();
          range.setStart(startNode, pos);
          const beforeEndLengthCount = nodeList
            .slice(0, endNodeIndex)
            .reduce((acc: number, current: Node) => {
              return acc + (current.textContent?.length || 0);
            }, 0);
          range.setEnd(
            endNode,
            beforeEndLengthCount > endPos
              ? endPos
              : endPos - beforeEndLengthCount
          );
          const cfi = this.cfiFromRange(range);

          let excerpt = nodeList
            .slice(0, endNodeIndex + 1)
            .reduce((acc: string, current: Node) => {
              return acc + (current.textContent || '');
            }, '');
          if (excerpt.length > excerptLimit) {
            excerpt = excerpt.substring(
              pos - excerptLimit / 2,
              pos + excerptLimit / 2
            );
            excerpt = '...' + excerpt + '...';
          }
          matches.push({
            cfi: cfi,
            excerpt: excerpt,
          });
        }
      }
    };

    const treeWalker = document.createTreeWalker(
      this.document!,
      NodeFilter.SHOW_TEXT
    );
    let node: Node | null,
      nodeList: Node[] = [];
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
  reconcileLayoutSettings(globalLayout: {
    layout: string;
    spread: string;
    orientation: string;
  }) {
    //-- Get the global defaults
    const settings: { [key: string]: string } = {
      layout: globalLayout.layout,
      spread: globalLayout.spread,
      orientation: globalLayout.orientation,
    };

    //-- Get the chapter's display type
    this.properties?.forEach(function (prop: string) {
      const rendition = prop.replace('rendition:', '');
      const split = rendition.indexOf('-');
      let property: string, value: string;

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
  cfiFromRange(_range: Range) {
    return new EpubCFI(_range, this.cfiBase).toString();
  }

  /**
   * Get a CFI from an Element in the Section
   */
  cfiFromElement(el: Node) {
    return new EpubCFI(el, this.cfiBase).toString();
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

    // Note: The object itself will be garbage collected when all references are removed
    // No need to clear primitive properties or create type conflicts
  }
}

export default Section;
module.exports = Section;
