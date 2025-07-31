import Rendition from '../types/rendition';
import Contents from '../types/contents';
/**
 * Themes to apply to displayed content
 * @class
 * @param {Rendition} rendition
 */
declare class Themes {
  rendition: Rendition | undefined;
  private _themes;
  private _overrides;
  private _current;
  private _injected;
  constructor(rendition: Rendition);
  /**
   * Add themes to be used by a rendition
   * @param {object | Array<object> | string}
   * @example themes.register("light", "http://example.com/light.css")
   * @example themes.register("light", { "body": { "color": "purple"}})
   * @example themes.register({ "light" : {...}, "dark" : {...}})
   */
  register(theme: { [key: string]: object }): void;
  register(name: string, url: string): void;
  register(name: string, rules: object): void;
  register(theme: string): void;
  register(theme: object): void;
  /**
   * Add a default theme to be used by a rendition
   * @param {object | string} theme
   * @example themes.register("http://example.com/default.css")
   * @example themes.register({ "body": { "color": "purple"}})
   */
  default(theme: string | object): void;
  /**
   * Register themes object
   * @param {object} themes
   */
  registerThemes(themes: { [key: string]: unknown }): void;
  /**
   * Register a theme by passing its css as string
   * @param {string} name
   * @param {string} css
   */
  registerCss(name: string, css: string): void;
  /**
   * Register a url
   * @param {string} name
   * @param {string} input
   */
  registerUrl(name: string, input: string): void;
  /**
   * Register rule
   * @param {string} name
   * @param {object} rules
   */
  registerRules(name: string, rules: object): void;
  /**
   * Select a theme
   */
  select(name: string): void;
  /**
   * Update a theme
   * @param {string} name
   */
  update(name: string): void;
  /**
   * Inject all themes into contents
   * @param {Contents} contents
   */
  inject(contents: Contents): void;
  /**
   * Add Theme to contents
   * @param {string} name
   * @param {Contents} contents
   */
  add(name: string, contents: Contents): void;
  /**
   * Add override
   * @param {string} name
   * @param {string} value
   * @param {boolean} priority
   */
  override(name: string, value: string, priority?: boolean): void;
  removeOverride(name: string): void;
  /**
   * Add all overrides
   */
  overrides(contents: Contents): void;
  /**
   * Adjust the font size of a rendition
   */
  fontSize(size: number | string): void;
  /**
   * Adjust the font-family of a rendition
   */
  font(f: string): void;
  destroy(): void;
}
export default Themes;
