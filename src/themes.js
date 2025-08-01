'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var url_1 = require('./utils/url');
/**
 * Themes to apply to displayed content
 * @class
 * @param {Rendition} rendition
 */
var Themes = /** @class */ (function () {
  function Themes(rendition) {
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
  Themes.prototype.register = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
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
  };
  /**
   * Add a default theme to be used by a rendition
   * @param {object | string} theme
   * @example themes.register("http://example.com/default.css")
   * @example themes.register({ "body": { "color": "purple"}})
   */
  Themes.prototype.default = function (theme) {
    if (!theme) {
      return;
    }
    if (typeof theme === 'string') {
      return this.registerUrl('default', theme);
    }
    if (typeof theme === 'object') {
      return this.registerRules('default', theme);
    }
  };
  /**
   * Register themes object
   * @param {object} themes
   */
  Themes.prototype.registerThemes = function (themes) {
    for (var theme in themes) {
      if (Object.prototype.hasOwnProperty.call(themes, theme)) {
        if (typeof themes[theme] === 'string') {
          this.registerUrl(theme, themes[theme]);
        } else {
          this.registerRules(theme, themes[theme]);
        }
      }
    }
  };
  /**
   * Register a theme by passing its css as string
   * @param {string} name
   * @param {string} css
   */
  Themes.prototype.registerCss = function (name, css) {
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
  };
  /**
   * Register a url
   * @param {string} name
   * @param {string} input
   */
  Themes.prototype.registerUrl = function (name, input) {
    var url = new url_1.default(input);
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
  };
  /**
   * Register rule
   * @param {string} name
   * @param {object} rules
   */
  Themes.prototype.registerRules = function (name, rules) {
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
  };
  /**
   * Select a theme
   */
  Themes.prototype.select = function (name) {
    var prev = this._current;
    this._current = name;
    this.update(name);
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }
    var contents = this.rendition.getContents();
    if (Array.isArray(contents)) {
      contents.forEach(function (content) {
        content.removeClass(prev);
        content.addClass(name);
      });
    }
  };
  /**
   * Update a theme
   * @param {string} name
   */
  Themes.prototype.update = function (name) {
    var _this = this;
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }
    var contents = this.rendition.getContents();
    if (Array.isArray(contents)) {
      contents.forEach(function (content) {
        _this.add(name, content);
      });
    }
  };
  /**
   * Inject all themes into contents
   * @param {Contents} contents
   */
  Themes.prototype.inject = function (contents) {
    var _a;
    var links = [];
    var themes = this._themes;
    var theme;
    for (var name_1 in themes) {
      if (
        Object.prototype.hasOwnProperty.call(themes, name_1) &&
        (name_1 === this._current || name_1 === 'default')
      ) {
        theme = themes[name_1];
        if (
          (theme.rules && Object.keys(theme.rules).length > 0) ||
          (theme.url && links.indexOf(theme.url) === -1)
        ) {
          this.add(name_1, contents);
        }
        (_a = this._injected) === null || _a === void 0
          ? void 0
          : _a.push(name_1);
      }
    }
    if (this._current !== undefined && this._current != 'default') {
      contents.addClass(this._current);
    }
  };
  /**
   * Add Theme to contents
   * @param {string} name
   * @param {Contents} contents
   */
  Themes.prototype.add = function (name, contents) {
    var theme = this._themes ? this._themes[name] : undefined;
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
  };
  /**
   * Add override
   * @param {string} name
   * @param {string} value
   * @param {boolean} priority
   */
  Themes.prototype.override = function (name, value, priority) {
    if (priority === void 0) {
      priority = false;
    }
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }
    var contents = this.rendition.getContents();
    if (this._overrides === undefined) {
      this._overrides = {};
    }
    this._overrides[name] = {
      value: value,
      priority: priority === true,
    };
    var override = this._overrides[name];
    if (Array.isArray(contents)) {
      contents.forEach(function (content) {
        content.css(name, override.value, override.priority);
      });
    }
  };
  Themes.prototype.removeOverride = function (name) {
    if (!this.rendition || !this.rendition.getContents) {
      throw new Error(
        'Rendition is not defined or does not have getContents method'
      );
    }
    var contents = this.rendition.getContents();
    if (this._overrides !== undefined && this._overrides[name] !== undefined) {
      delete this._overrides[name];
    }
    if (Array.isArray(contents)) {
      contents.forEach(function (content) {
        content.css(name, undefined, undefined);
      });
    }
  };
  /**
   * Add all overrides
   */
  Themes.prototype.overrides = function (contents) {
    var overrides = this._overrides;
    for (var rule in overrides) {
      if (Object.prototype.hasOwnProperty.call(overrides, rule)) {
        contents.css(rule, overrides[rule].value, overrides[rule].priority);
      }
    }
  };
  /**
   * Adjust the font size of a rendition
   */
  Themes.prototype.fontSize = function (size) {
    this.override('font-size', size);
  };
  /**
   * Adjust the font-family of a rendition
   */
  Themes.prototype.font = function (f) {
    this.override('font-family', f, true);
  };
  Themes.prototype.destroy = function () {
    this.rendition = undefined;
    this._themes = undefined;
    this._overrides = undefined;
    this._current = undefined;
    this._injected = undefined;
  };
  return Themes;
})();
exports.default = Themes;
