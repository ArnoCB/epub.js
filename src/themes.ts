import Rendition from '../types/rendition';
import Url from './utils/url';
import Contents from '../types/contents';

type Theme = {
  rules?: object;
  url?: string;
  serialized?: string;
  injected?: boolean;
};

/**
 * Themes to apply to displayed content
 * @class
 * @param {Rendition} rendition
 */
class Themes {
  rendition: Rendition | undefined;
  private _themes:
    | {
        [key: string]: Theme;
      }
    | undefined = {
    default: {
      rules: {},
      url: '',
      serialized: '',
      injected: false,
    },
  };

  private _overrides:
    | { [key: string]: { value: string; priority: boolean } }
    | undefined = {};
  private _current: string | undefined = 'default';
  private _injected: string[] | undefined = [];

  constructor(rendition: Rendition) {
    this.rendition = rendition;
    this.rendition.hooks.content.register(this.inject.bind(this));
    this.rendition.hooks.content.register(this.overrides.bind(this));
  }

  /**
   * Add themes to be used by a rendition
   * @param {object | Array<object> | string}
   * @example themes.register("light", "http://example.com/light.css")
   * @example themes.register("light", { "body": { "color": "purple"}})
   * @example themes.register({ "light" : {...}, "dark" : {...}})
   */
  // Overloads
  register(theme: { [key: string]: object }): void;
  register(name: string, url: string): void;
  register(name: string, rules: object): void;
  register(theme: string): void;
  register(theme: object): void;
  register(...args: [unknown?, unknown?]): void {
    if (args.length === 0) {
      return;
    }
    // themes.register({ light: {...}, dark: {...} })
    if (
      args.length === 1 &&
      typeof args[0] === 'object' &&
      !Array.isArray(args[0]) &&
      args[0] !== null &&
      !(args[0] instanceof String)
    ) {
      return this.registerThemes(args[0] as { [key: string]: object });
    }
    // themes.register("light", "http://example.com/light.css")
    if (
      args.length === 2 &&
      typeof args[0] === 'string' &&
      typeof args[1] === 'string'
    ) {
      return this.registerUrl(args[0], args[1]);
    }
    // themes.register("light", { body: { color: "purple" } })
    if (
      args.length === 2 &&
      typeof args[0] === 'string' &&
      typeof args[1] === 'object'
    ) {
      return this.registerRules(args[0], args[1] as object);
    }
    // themes.register("http://example.com/default.css")
    if (args.length === 1 && typeof args[0] === 'string') {
      return this.default(args[0]);
    }
    // themes.register({ body: { color: "purple" } })
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      return this.default(args[0]);
    }
  }

  /**
   * Add a default theme to be used by a rendition
   * @param {object | string} theme
   * @example themes.register("http://example.com/default.css")
   * @example themes.register({ "body": { "color": "purple"}})
   */
  default(theme: string | object) {
    if (!theme) {
      return;
    }
    if (typeof theme === 'string') {
      return this.registerUrl('default', theme);
    }
    if (typeof theme === 'object') {
      return this.registerRules('default', theme);
    }
  }

  /**
   * Register themes object
   * @param {object} themes
   */
  registerThemes(themes: { [key: string]: unknown }) {
    for (const theme in themes) {
      if (Object.prototype.hasOwnProperty.call(themes, theme)) {
        if (typeof themes[theme] === 'string') {
          this.registerUrl(theme, themes[theme]);
        } else {
          this.registerRules(theme, themes[theme] as object);
        }
      }
    }
  }

  /**
   * Register a theme by passing its css as string
   * @param {string} name
   * @param {string} css
   */
  registerCss(name: string, css: string) {
    if (this._themes === undefined) {
      throw new Error(
        'Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.'
      );
    }

    this._themes[name] = { serialized: css };

    if (
      (this._injected && this._injected.includes(name)) ||
      name == 'default'
    ) {
      this.update(name);
    }
  }

  /**
   * Register a url
   */
  registerUrl(name: string, input: string) {
    const url = new Url(input);
    if (this._themes === undefined) {
      throw new Error(
        'Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.'
      );
    }
    this._themes[name] = { url: url.toString() };
    if (
      (this._injected && this._injected.includes(name)) ||
      name == 'default'
    ) {
      this.update(name);
    }
  }

  /**
   * Register rule
   * @param {string} name
   * @param {object} rules
   */
  registerRules(name: string, rules: object) {
    if (this._themes === undefined) {
      throw new Error(
        'Themes are not initialized. Please ensure that the Themes class is instantiated with a Rendition instance.'
      );
    }

    this._themes[name] = { rules: rules };
    // TODO: serialize css rules
    if (
      (this._injected && this._injected.includes(name)) ||
      name == 'default'
    ) {
      this.update(name);
    }
  }

  /**
   * Select a theme
   */
  select(name: string) {
    const prev = this._current;

    this._current = name;
    this.update(name);

    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }

    const contents = this.rendition.getContents();

    if (Array.isArray(contents)) {
      contents.forEach((content) => {
        content.removeClass(prev);
        content.addClass(name);
      });
    }
  }

  /**
   * Update a theme
   * @param {string} name
   */
  update(name: string) {
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }

    const contents = this.rendition.getContents();

    if (Array.isArray(contents)) {
      contents.forEach((content) => {
        this.add(name, content);
      });
    }
  }

  /**
   * Inject all themes into contents
   * @param {Contents} contents
   */
  inject(contents: Contents) {
    const links: string[] = [];
    const themes = this._themes;
    let theme;

    for (const name in themes) {
      if (
        Object.prototype.hasOwnProperty.call(themes, name) &&
        (name === this._current || name === 'default')
      ) {
        theme = themes[name];
        if (
          (theme.rules && Object.keys(theme.rules).length > 0) ||
          (theme.url && links.indexOf(theme.url) === -1)
        ) {
          this.add(name, contents);
        }

        this._injected?.push(name);
      }
    }

    if (this._current !== undefined && this._current != 'default') {
      contents.addClass(this._current);
    }
  }

  /**
   * Add Theme to contents
   * @param {string} name
   * @param {Contents} contents
   */
  add(name: string, contents: Contents) {
    const theme: Theme | undefined = this._themes
      ? this._themes[name]
      : undefined;

    if (!theme || !contents) {
      return;
    }

    if (theme.url) {
      contents.addStylesheet(theme.url);
    } else if (theme.serialized) {
      contents.addStylesheetCss(theme.serialized, name);
      theme.injected = true;
    } else if (theme.rules) {
      contents.addStylesheetRules(theme.rules, name);
      theme.injected = true;
    }
  }

  /**
   * Add override
   * @param {string} name
   * @param {string} value
   * @param {boolean} priority
   */
  override(name: string, value: string, priority: boolean = false) {
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }

    const contents = this.rendition.getContents();

    if (this._overrides === undefined) {
      this._overrides = {};
    }

    this._overrides[name] = {
      value: value,
      priority: priority === true,
    };
    const override = this._overrides[name];

    if (Array.isArray(contents)) {
      contents.forEach((content) => {
        content.css(name, override.value, override.priority);
      });
    }
  }

  removeOverride(name: string) {
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }

    const contents = this.rendition.getContents();

    if (this._overrides !== undefined && this._overrides[name] !== undefined) {
      delete this._overrides[name];
    }

    if (Array.isArray(contents)) {
      contents.forEach((content) => {
        content.css(name, undefined, undefined);
      });
    }
  }

  /**
   * Add all overrides
   */
  overrides(contents: Contents) {
    const overrides = this._overrides;

    for (const rule in overrides) {
      if (Object.prototype.hasOwnProperty.call(overrides, rule)) {
        contents.css(rule, overrides[rule].value, overrides[rule].priority);
      }
    }
  }

  /**
   * Adjust the font size of a rendition
   */
  fontSize(size: number | string) {
    this.override('font-size', size as string);
  }

  /**
   * Adjust the font-family of a rendition
   */
  font(f: string) {
    this.override('font-family', f, true);
  }

  destroy() {
    this.rendition = undefined;
    this._themes = undefined;
    this._overrides = undefined;
    this._current = undefined;
    this._injected = undefined;
  }
}

export default Themes;
