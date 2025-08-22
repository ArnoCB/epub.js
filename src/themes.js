'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const url_1 = __importDefault(require('./utils/url'));
/**
 * Themes to apply to displayed content
 * @class
 * @param {Rendition} rendition
 */
class Themes {
  constructor(rendition) {
    this._themes = {
      default: {
        rules: {},
        url: '',
        serialized: '',
        injected: false,
      },
    };
    this._overrides = {};
    this._current = 'default';
    this._injected = [];
    this.rendition = rendition;
    this.rendition.hooks.content.register(this.inject.bind(this));
    this.rendition.hooks.content.register(this.overrides.bind(this));
  }
  register(...args) {
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
      return this.registerThemes(args[0]);
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
      return this.registerRules(args[0], args[1]);
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
  default(theme) {
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
  registerThemes(themes) {
    for (const theme in themes) {
      if (Object.prototype.hasOwnProperty.call(themes, theme)) {
        if (typeof themes[theme] === 'string') {
          this.registerUrl(theme, themes[theme]);
        } else {
          this.registerRules(theme, themes[theme]);
        }
      }
    }
  }
  /**
   * Register a theme by passing its css as string
   * @param {string} name
   * @param {string} css
   */
  registerCss(name, css) {
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
  registerUrl(name, input) {
    const url = new url_1.default(input);
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
  registerRules(name, rules) {
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
  select(name) {
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
  update(name) {
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
  inject(contents) {
    const links = [];
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
  add(name, contents) {
    const theme = this._themes ? this._themes[name] : undefined;
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
  override(name, value, priority = false) {
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
  removeOverride(name) {
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
  overrides(contents) {
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
  fontSize(size) {
    this.override('font-size', size);
  }
  /**
   * Adjust the font-family of a rendition
   */
  font(f) {
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
exports.default = Themes;
