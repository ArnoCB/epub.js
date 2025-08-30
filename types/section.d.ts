import Hook from './utils/hook';
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
export declare class Section {
  hooks: {
    serialize: Hook;
    content: Hook;
  };
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
  constructor(
    item: SectionItem,
    hooks?: {
      serialize: Hook;
      content: Hook;
    }
  );
  /**
   * Load the section from its url
   */
  load<T>(_request?: (url: string) => Promise<T>): Promise<unknown>;
  /**
   * Render the contents of a section
   */
  render(_request?: (url: string) => Promise<Document>): Promise<unknown>;
  /**
   * Find a string in a section using node-by-node searching.
   * This method searches within individual text nodes, making it suitable
   * for simple text searches. For more advanced cross-element searching,
   * consider using the search() method instead.
   * @param  {string} _query The query string to find
   * @return {Match[]} A list of matches, with form {cfi, excerpt}
   */
  find(_query: string): Match[];
  /**
   * Search a string in multiple sequential elements of the section.
   * This method can find text that spans across multiple DOM elements,
   * making it more powerful than find() for complex text searches.
   * Uses document.createTreeWalker for efficient DOM traversal.
   * @param maxSeqEle The maximum number of elements that are combined for search, default value is 5
   */
  search(_query: string, maxSeqEle?: number): Match[];
  /**
   * Reconciles the current chapters layout properties with
   * the global layout properties.
   * @return layoutProperties Object with layout properties
   */
  reconcileLayoutSettings(globalLayout: {
    layout: string;
    spread: string;
    orientation: string;
  }): {
    [key: string]: string;
  };
  /**
   * Get a CFI from a Range in the Section
   */
  cfiFromRange(_range: Range): string;
  /**
   * Get a CFI from an Element in the Section
   */
  cfiFromElement(el: Node): string;
  /**
   * Unload the section document
   */
  unload(): void;
  destroy(): void;
}
export default Section;
