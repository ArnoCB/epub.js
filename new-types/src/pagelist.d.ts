import EpubCFI from './epubcfi';
export interface PageListItem {
  href: string;
  page: string;
  cfi?: string;
  packageUrl?: string;
}
/**
 * Page List Parser
 * @param {document} [xml]
 */
declare class PageList {
  pages: string[];
  locations: string[];
  epubcfi: EpubCFI | undefined;
  firstPage: number;
  lastPage: number;
  totalPages: number;
  toc: unknown | undefined;
  ncx: unknown | undefined;
  pageList: PageListItem[] | undefined;
  constructor(xml?: Document | null);
  /**
   * Parse PageList Xml
   */
  parse(xml: Document): PageListItem[] | undefined;
  /**
   * Parse a Nav PageList
   * @private
   * @param  {node} navHtml
   * @return {PageList.item[]} list
   */
  private parseNav;
  parseNcx(navXml: Element): PageListItem[];
  ncxItem(item: Node): PageListItem;
  /**
   * Page List Item
   */
  private item;
  /**
   * Process pageList items
   */
  private process;
  /**
   * Get a PageList result from a EpubCFI
   * @param  {string} cfi EpubCFI String
   * @return {number} page
   */
  pageFromCfi(cfi: string): number;
  /**
   * Get an EpubCFI from a Page List Item
   */
  cfiFromPage(pg: string | number): string | undefined;
  /**
   * Get a Page from Book percentage
   */
  pageFromPercentage(percent: number): number;
  /**
   * Returns a value between 0 - 1 corresponding to the location of a page
   */
  percentageFromPage(pg: number): number;
  /**
   * Returns a value between 0 - 1 corresponding to the location of a cfi
   */
  percentageFromCfi(cfi: string): number;
  /**
   * Destroy
   */
  destroy(): void;
}
export default PageList;
