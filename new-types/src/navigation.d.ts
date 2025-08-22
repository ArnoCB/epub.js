export interface NavItem {
  id: string;
  href: string;
  label: string;
  subitems: NavItem[];
  parent?: string;
}
export interface LandmarkItem {
  href: string;
  label: string;
  type?: string;
}
export interface RawNavItem {
  title: string;
  children?: RawNavItem[];
  id?: string;
  href?: string;
  parent?: string;
  [key: string]: unknown;
}
/**
 * Navigation Parser
 * @param {document} xml navigation html / xhtml / ncx
 */
export default class Navigation {
  toc: NavItem[];
  tocByHref: {
    [href: string]: number;
  };
  tocById: {
    [id: string]: number;
  };
  landmarks: LandmarkItem[];
  landmarksByType: {
    [type: string]: number;
  };
  length: number;
  constructor(xml?: Document | RawNavItem[]);
  /**
   * Parse out the navigation items
   */
  parse(xml: Document | RawNavItem[]): void;
  /**
   * Unpack navigation items
   * @private
   * @param  {array} toc
   */
  unpack(toc: NavItem[]): void;
  /**
   * Get an item from the navigation
   */
  get(target: string): NavItem | NavItem[] | undefined;
  /**
   * Get an item from navigation subitems recursively by index
   */
  getByIndex(
    target: string,
    index: number,
    navItems: NavItem[]
  ): NavItem | undefined;
  /**
   * Get a landmark by type
   * List of types: https://idpf.github.io/epub-vocabs/structure/
   */
  landmark(type: string): LandmarkItem | LandmarkItem[] | undefined;
  /**
   * Parse toc from a Epub > 3.0 Nav
   * @private
   * @param  {document} navHtml
   * @return {array} navigation list
   */
  parseNav(navHtml: Document): NavItem[];
  /**
   * Parses lists in the toc
   * @param  {document} navListHtml
   * @param  {string} parent id
   * @return {array} navigation list
   */
  parseNavList(navListHtml: Element, parent?: string): NavItem[];
  /**
   * Create a navItem
   */
  private navItem;
  /**
   * Parse landmarks from a Epub > 3.0 Nav
   */
  private parseLandmarks;
  /**
   * Create a landmarkItem
   * @param  {element} item
   * @return {object} landmarkItem
   */
  private landmarkItem;
  /**
   * Parse from a Epub > 3.0 NC
   */
  private parseNcx;
  /**
   * Create a ncxItem
   * @private
   * @param  {element} item
   * @return {object} ncxItem
   */
  private ncxItem;
  /**
   * Load Spine Items
   */
  load(json: RawNavItem[]): NavItem[];
  /**
   * forEach pass through
   */
  forEach(fn: (item: NavItem, index: number, array: NavItem[]) => void): void;
}
