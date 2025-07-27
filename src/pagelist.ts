import EpubCFI from './epubcfi';
import {
  querySelectorByType,
  indexOfSorted,
  locationOf,
} from './utils/core';

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
class PageList {
  public pages: string[] = [];
  public locations: string[] = [];
  public epubcfi: EpubCFI | undefined = new EpubCFI();
  public firstPage: number = 0;
  public lastPage: number = 0;
  public totalPages: number = 0;
  public toc: unknown | undefined;
  public ncx: unknown | undefined;
  public pageList: PageListItem[] | undefined = [];

  constructor(xml: Document | null = null) {
    if (xml) {
      this.pageList = this.parse(xml);
    }

    if (this.pageList && this.pageList.length) {
      this.process(this.pageList);
    }
  }

  /**
   * Parse PageList Xml
   */
  parse(xml: Document): PageListItem[] | undefined {
    const html = xml.querySelector('html');
    const ncx = xml.querySelector('ncx');

    if (html) {
      return this.parseNav(html);
    } else if (ncx) {
      return this.parseNcx(ncx);
    }
  }

  /**
   * Parse a Nav PageList
   * @private
   * @param  {node} navHtml
   * @return {PageList.item[]} list
   */
  private parseNav(navHtml: Element): PageListItem[] {
    const navElement = querySelectorByType(navHtml, 'nav', 'page-list');
    const navItems = navElement ? Array.from(navElement.querySelectorAll('li')) : [];
    const list: PageListItem[] = [];

    if (!navItems || navItems.length === 0) return list;

    for (const navItem of navItems) {
      const item = this.item(navItem);
      list.push(item);
    }

    return list;
  }

  parseNcx(navXml: Element): PageListItem[] {
    const list: PageListItem[] = [];
    const pageList = navXml.querySelector('pageList');

    if (!pageList) return list;

    const pageTargets = Array.from(pageList.querySelectorAll('pageTarget'));
    if (!pageTargets || pageTargets.length === 0) {
      return list;
    }
    for (const pageTarget of pageTargets) {
      const item = this.ncxItem(pageTarget);
      list.push(item);
    }
    return list;
  }

  ncxItem(item: Node): PageListItem {
    // Use native querySelector and proper null checks
    const element = item instanceof Element ? item : null;
    if (!element) {
      return { href: '', page: '' };
    }
    const navLabel = element.querySelector('navLabel');
    const navLabelText = navLabel?.querySelector('text');
    const pageText = navLabelText?.textContent?.trim() || '';
    const content = element.querySelector('content');
    const href = content?.getAttribute('src') || '';
    // Always return page as string for PageListItem
    return {
      href,
      page: pageText,
    };
  }

  /**
   * Page List Item
   */
  private item(item: Node): PageListItem {
    const element = item instanceof Element ? item : null;
    const content = element?.querySelector('a');
    const href = content?.getAttribute('href') || '';
    const text = content?.textContent?.trim() || '';
    const isCfi = href.indexOf('epubcfi');

    let split, packageUrl, cfi;

    if (isCfi !== -1) {
      split = href.split('#');
      packageUrl = split[0];
      cfi = split.length > 1 ? split[1] : undefined;
      return {
        cfi,
        href,
        packageUrl,
        page: text,
      };
    } else {
      return {
        href,
        page: text,
      };
    }
  }

  /**
   * Process pageList items
   */
  private process(pageList: PageListItem[]) {
    pageList.forEach((item) => {
      this.pages.push(item.page);
      if (item.cfi) {
        this.locations.push(item.cfi);
      }
    });
    this.firstPage = parseInt(this.pages[0] || '0', 10);
    this.lastPage = parseInt(this.pages[this.pages.length - 1] || '0', 10);
    this.totalPages = this.lastPage - this.firstPage;
  }

  /**
   * Get a PageList result from a EpubCFI
   * @param  {string} cfi EpubCFI String
   * @return {number} page
   */
  pageFromCfi(cfi: string): number {
    let pg = -1;
    if (!this.locations || this.locations.length === 0) {
      return -1;
    }
    let index = indexOfSorted(cfi, this.locations, this.epubcfi?.compare);
    if (index !== -1) {
      pg = parseInt(this.pages[index], 10);
    } else {
      index = locationOf(cfi, this.locations, this.epubcfi?.compare);
      pg = index - 1 >= 0 ? parseInt(this.pages[index - 1], 10) : parseInt(this.pages[0], 10);
      if (isNaN(pg)) {
        pg = -1;
      }
    }
    return pg;
  }

  /**
   * Get an EpubCFI from a Page List Item
   */
  cfiFromPage(pg: string | number): string | undefined {
    const pageStr = typeof pg === 'number' ? pg.toString() : pg;
    const index = this.pages.indexOf(pageStr);
    if (index !== -1) {
      return this.locations[index];
    }
    // TODO: handle pages not in the list
    return undefined;
  }

  /**
   * Get a Page from Book percentage
   */
  pageFromPercentage(percent: number) {
    const pg = Math.round(this.totalPages * percent);
    return pg;
  }

  /**
   * Returns a value between 0 - 1 corresponding to the location of a page
   */
  percentageFromPage(pg: number) {
    const percentage = (pg - this.firstPage) / this.totalPages;
    return Math.round(percentage * 1000) / 1000;
  }

  /**
   * Returns a value between 0 - 1 corresponding to the location of a cfi
   */
  percentageFromCfi(cfi: string) {
    const pg = this.pageFromCfi(cfi);
    const percentage = this.percentageFromPage(pg);
    return percentage;
  }

  /**
   * Destroy
   */
  destroy() {
    this.pages = [];
    this.locations = [];
    this.epubcfi = undefined;
    this.pageList = undefined;

    this.toc = undefined;
    this.ncx = undefined;
  }
}

export default PageList;
