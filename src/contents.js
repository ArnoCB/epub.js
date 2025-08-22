"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = __importDefault(require("event-emitter"));
const core_1 = require("./utils/core");
const epubcfi_1 = __importDefault(require("./epubcfi"));
const mapping_1 = __importDefault(require("./mapping"));
const replacements_1 = require("./utils/replacements");
const constants_1 = require("./utils/constants");
/**
 * Handles DOM manipulation, queries and events for View contents
 */
class Contents {
    constructor(doc, content, cfiBase, sectionIndex) {
        this._size = {
            width: 0,
            height: 0,
        };
        this.epubcfi = new epubcfi_1.default();
        this.called = 0;
        this.active = true;
        this.expanding = undefined;
        this.observer = null;
        this._layoutStyle = null;
        this.readyState = 'loading';
        this.selectionEndTimeout = null;
        this.document = doc;
        this.documentElement = this.document.documentElement;
        this.content = content || this.document.body;
        this.window = this.document.defaultView;
        this.sectionIndex = sectionIndex || 0;
        this.cfiBase = cfiBase || '';
        this.epubReadingSystem('epub.js', constants_1.EPUBJS_VERSION);
        this.listeners();
    }
    /**
     * Get DOM events that are listened for and passed along
     */
    static get listenedEvents() {
        return constants_1.DOM_EVENTS;
    }
    /**
     * Get or Set width
     */
    width(w) {
        // var frame = this.documentElement;
        const frame = this.content;
        if (w && (0, core_1.isNumber)(w)) {
            w = w + 'px';
        }
        if (w) {
            frame.style.width = String(w);
            // this.content.style.width = w;
        }
        return parseInt(this.window.getComputedStyle(frame)['width']);
    }
    /**
     * Get or Set height
     * @param {number} [h]
     * @returns {number} height
     */
    height(h) {
        // var frame = this.documentElement;
        const frame = this.content;
        if (h && (0, core_1.isNumber)(h)) {
            h = h + 'px';
        }
        if (h) {
            frame.style.height = String(h);
            // this.content.style.height = h;
        }
        return parseInt(this.window.getComputedStyle(frame)['height']);
    }
    /**
     * Get or Set width of the contents
     * @param {number} [w]
     * @returns {number} width
     */
    contentWidth(w) {
        const content = this.content || this.document.body;
        if (w && (0, core_1.isNumber)(w)) {
            w = w + 'px';
        }
        if (w) {
            content.style.width = String(w);
        }
        return parseInt(this.window.getComputedStyle(content)['width']);
    }
    /**
     * Get or Set height of the contents
     * @param {number} [h]
     * @returns {number} height
     */
    contentHeight(h) {
        const content = this.content || this.document.body;
        if (h && (0, core_1.isNumber)(h)) {
            h = h + 'px';
        }
        if (h) {
            content.style.height = String(h);
        }
        return parseInt(this.window.getComputedStyle(content)['height']);
    }
    /**
     * Get the width of the text using Range
     */
    textWidth() {
        let width;
        const range = this.document.createRange();
        const content = this.content || this.document.body;
        const border = (0, core_1.borders)(content);
        // Select the contents of frame
        range.selectNodeContents(content);
        // get the width of the text content
        const rect = range.getBoundingClientRect();
        width = rect.width;
        if (border && border.width) {
            width += border.width;
        }
        return Math.round(width);
    }
    /**
     * Get the height of the text using Range
     * @returns {number} height
     */
    textHeight() {
        const range = this.document.createRange();
        const content = this.content || this.document.body;
        range.selectNodeContents(content);
        const rect = range.getBoundingClientRect();
        const height = rect.bottom;
        return Math.round(height);
    }
    /**
     * Get documentElement scrollWidth
     */
    scrollWidth() {
        const width = this.documentElement.scrollWidth;
        return width;
    }
    /**
     * Get documentElement scrollHeight
     */
    scrollHeight() {
        const height = this.documentElement.scrollHeight;
        return height;
    }
    /**
     * Set overflow css style of the contents
     */
    overflow(overflow) {
        if (overflow) {
            this.documentElement.style.overflow = overflow;
        }
        return this.window.getComputedStyle(this.documentElement)['overflow'];
    }
    /**
     * Set overflowX css style of the documentElement
     */
    overflowX(overflow) {
        if (overflow) {
            this.documentElement.style.overflowX = overflow;
        }
        return this.window.getComputedStyle(this.documentElement)['overflowX'];
    }
    /**
     * Set overflowY css style of the documentElement
     */
    overflowY(overflow) {
        if (overflow) {
            this.documentElement.style.overflowY = overflow;
        }
        return this.window.getComputedStyle(this.documentElement)['overflowY'];
    }
    /**
     * Set Css styles on the contents element (typically Body)
     * @param {string} property
     * @param {string} value
     * @param {boolean} [priority] set as "important"
     */
    css(property, value, priority) {
        const content = this.content || this.document.body;
        if (value) {
            content.style.setProperty(property, value, priority ? 'important' : '');
        }
        else {
            content.style.removeProperty(property);
        }
        return this.window.getComputedStyle(content)[property];
    }
    /**
     * Get or Set the viewport element
     * @param {object} [options]
     * @param {string} [options.width]
     * @param {string} [options.height]
     * @param {string} [options.scale]
     * @param {string} [options.minimum]
     * @param {string} [options.maximum]
     * @param {string} [options.scalable]
     */
    viewport(options) {
        // var width, height, scale, minimum, maximum, scalable;
        let $viewport = this.document.querySelector("meta[name='viewport']");
        const parsed = {
            width: undefined,
            height: undefined,
            scale: undefined,
            minimum: undefined,
            maximum: undefined,
            scalable: undefined,
        };
        const newContent = [];
        /*
         * check for the viewport size
         * <meta name="viewport" content="width=1024,height=697" />
         */
        if ($viewport && $viewport.hasAttribute('content')) {
            const content = $viewport.getAttribute('content');
            if (!content)
                return parsed;
            const _width = content.match(/width\s*=\s*([^,]*)/);
            const _height = content.match(/height\s*=\s*([^,]*)/);
            const _scale = content.match(/initial-scale\s*=\s*([^,]*)/);
            const _minimum = content.match(/minimum-scale\s*=\s*([^,]*)/);
            const _maximum = content.match(/maximum-scale\s*=\s*([^,]*)/);
            const _scalable = content.match(/user-scalable\s*=\s*([^,]*)/);
            if (_width && _width.length && typeof _width[1] !== 'undefined') {
                parsed.width = _width[1];
            }
            if (_height && _height.length && typeof _height[1] !== 'undefined') {
                parsed.height = _height[1];
            }
            if (_scale && _scale.length && typeof _scale[1] !== 'undefined') {
                parsed.scale = _scale[1];
            }
            if (_minimum && _minimum.length && typeof _minimum[1] !== 'undefined') {
                parsed.minimum = _minimum[1];
            }
            if (_maximum && _maximum.length && typeof _maximum[1] !== 'undefined') {
                parsed.maximum = _maximum[1];
            }
            if (_scalable &&
                _scalable.length &&
                typeof _scalable[1] !== 'undefined') {
                parsed.scalable = _scalable[1];
            }
        }
        const settings = (0, core_1.defaults)(options || {}, parsed);
        if (options) {
            if (settings.width) {
                newContent.push('width=' + settings.width);
            }
            if (settings.height) {
                newContent.push('height=' + settings.height);
            }
            if (settings.scale) {
                newContent.push('initial-scale=' + settings.scale);
            }
            if (settings.scalable === 'no') {
                newContent.push('minimum-scale=' + settings.scale);
                newContent.push('maximum-scale=' + settings.scale);
                newContent.push('user-scalable=' + settings.scalable);
            }
            else {
                if (settings.scalable) {
                    newContent.push('user-scalable=' + settings.scalable);
                }
                if (settings.minimum) {
                    newContent.push('minimum-scale=' + settings.minimum);
                }
                if (settings.maximum) {
                    newContent.push('minimum-scale=' + settings.maximum);
                }
            }
            if (!$viewport) {
                $viewport = this.document.createElement('meta');
                $viewport.setAttribute('name', 'viewport');
                this.document.querySelector('head').appendChild($viewport);
            }
            $viewport.setAttribute('content', newContent.join(', '));
            this.window.scrollTo(0, 0);
        }
        return settings;
    }
    /**
     * Event emitter for when the contents has expanded
     */
    expand() {
        this.emit(constants_1.EVENTS.CONTENTS.EXPAND);
    }
    /**
     * Add DOM listeners
     */
    listeners() {
        this.imageLoadListeners();
        this.mediaQueryListeners();
        // this.fontLoadListeners();
        this.addEventListeners();
        this.addSelectionListeners();
        if (typeof ResizeObserver === 'undefined') {
            this.resizeListeners();
            this.visibilityListeners();
        }
        else {
            this.resizeObservers();
        }
        // this.mutationObservers();
        this.linksHandler();
    }
    /**
     * Remove DOM listeners
     */
    removeListeners() {
        this.removeEventListeners();
        this.removeSelectionListeners();
        if (this.observer) {
            this.observer.disconnect();
        }
        clearTimeout(this.expanding);
    }
    /**
     * Check if size of contents has changed and
     * emit 'resize' event if it has.
     */
    resizeCheck() {
        const width = this.textWidth();
        const height = this.textHeight();
        if (width != this._size.width || height != this._size.height) {
            this._size = {
                width: width,
                height: height,
            };
            if (this.onResize) {
                this.onResize(this._size);
            }
            this.emit(constants_1.EVENTS.CONTENTS.RESIZE, this._size);
        }
    }
    /**
     * Poll for resize detection
     * @private
     */
    resizeListeners() {
        // Test size again
        clearTimeout(this.expanding);
        requestAnimationFrame(this.resizeCheck.bind(this));
        this.expanding = setTimeout(this.resizeListeners.bind(this), 350);
    }
    /**
     * Listen for visibility of tab to change
     * @private
     */
    visibilityListeners() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.active === false) {
                this.active = true;
                this.resizeListeners();
            }
            else {
                this.active = false;
                clearTimeout(this.expanding);
            }
        });
    }
    /**
     * Listen for media query changes and emit 'expand' event
     * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
     * @private
     */
    mediaQueryListeners() {
        const sheets = this.document.styleSheets;
        const mediaChangeHandler = (m) => {
            if (m.matches && !this._expanding) {
                setTimeout(() => this.expand(), 1);
            }
        };
        for (let i = 0; i < sheets.length; i += 1) {
            let rules;
            // Firefox errors if we access cssRules cross-domain
            try {
                rules = sheets[i].cssRules;
            }
            catch {
                return;
            }
            if (!rules)
                return; // Stylesheets changed
            for (let j = 0; j < rules.length; j += 1) {
                const rule = rules[j];
                // Only CSSMediaRule has a media property
                if (rule.type === CSSRule.MEDIA_RULE && rule.media) {
                    const mql = this.window.matchMedia(rule.media.mediaText);
                    mql.addListener(mediaChangeHandler);
                }
            }
        }
    }
    /**
     * Use ResizeObserver to listen for changes in the DOM and check for resize
     */
    resizeObservers() {
        // create an observer instance
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(this.resizeCheck.bind(this));
        });
        this.observer = resizeObserver;
        // pass in the target node
        resizeObserver.observe(this.document.documentElement);
    }
    /**
     * Use MutationObserver to listen for changes in the DOM and check for resize
     * @private
     */
    mutationObservers() {
        // create an observer instance
        this.observer = new MutationObserver(() => {
            this.resizeCheck();
        });
        // configuration of the observer:
        const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
        };
        // pass in the target node, as well as the observer options
        this.observer.observe(this.document, config);
    }
    /**
     * Test if images are loaded or add listener for when they load
     */
    imageLoadListeners() {
        const images = this.document.querySelectorAll('img');
        let img;
        for (let i = 0; i < images.length; i++) {
            img = images[i];
            if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
                img.onload = this.expand.bind(this);
            }
        }
    }
    /**
     * Listen for font load and check for resize when loaded
     */
    fontLoadListeners() {
        if (!this.document || !this.document.fonts) {
            return;
        }
        this.document.fonts.ready.then(() => {
            this.resizeCheck();
        });
    }
    /**
     * Get the documentElement
     */
    root() {
        if (!this.document)
            return null;
        return this.document.documentElement;
    }
    /**
     * Get the location offset of a EpubCFI or an #id
     */
    locationOf(target, ignoreClass) {
        let position;
        const targetPos = { left: 0, top: 0 };
        if (!this.document)
            return targetPos;
        if (this.epubcfi.isCfiString(target)) {
            const range = new epubcfi_1.default(target).toRange(this.document, ignoreClass);
            if (range) {
                try {
                    if (!range.endContainer ||
                        (range.startContainer == range.endContainer &&
                            range.startOffset == range.endOffset)) {
                        // If the end for the range is not set, it results in collapsed becoming
                        // true. This in turn leads to inconsistent behaviour when calling
                        // getBoundingRect. Wrong bounds lead to the wrong page being displayed.
                        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15684911/
                        let pos = range.startContainer.textContent.indexOf(' ', range.startOffset);
                        if (pos == -1) {
                            pos = range.startContainer.textContent.length;
                        }
                        range.setEnd(range.startContainer, pos);
                    }
                }
                catch (e) {
                    console.error('setting end offset to start container length failed', e);
                }
                if (range.startContainer.nodeType === Node.ELEMENT_NODE &&
                    range.startContainer instanceof Element) {
                    position = range.startContainer.getBoundingClientRect();
                    targetPos.left = position.left;
                    targetPos.top = position.top;
                }
                else {
                    // Construct a new non-collapsed range
                    position = range.getBoundingClientRect();
                }
            }
        }
        else if (typeof target === 'string' && target.indexOf('#') > -1) {
            const id = target.substring(target.indexOf('#') + 1);
            const el = this.document.getElementById(id);
            if (el) {
                position = el.getBoundingClientRect();
            }
        }
        if (position) {
            targetPos.left = position.left;
            targetPos.top = position.top;
        }
        return targetPos;
    }
    /**
     * Append a stylesheet link to the document head
     */
    addStylesheet(src) {
        return new Promise((resolve) => {
            let $stylesheet;
            let ready = false;
            if (!this.document) {
                resolve(false);
                return;
            }
            // Check if link already exists
            $stylesheet = this.document.querySelector("link[href='" + src + "']");
            if ($stylesheet) {
                resolve(true);
                return; // already present
            }
            $stylesheet = this.document.createElement('link');
            $stylesheet.type = 'text/css';
            $stylesheet.rel = 'stylesheet';
            $stylesheet.href = src;
            $stylesheet.onload = () => {
                if (!ready) {
                    ready = true;
                    setTimeout(() => {
                        resolve(true);
                    }, 1);
                }
            };
            this.document.head.appendChild($stylesheet);
        });
    }
    _getStylesheetNode(key) {
        let styleEl;
        key = 'epubjs-inserted-css-' + (key || '');
        if (!this.document)
            return false;
        // Check if link already exists
        styleEl = this.document.getElementById(key);
        if (!styleEl) {
            styleEl = this.document.createElement('style');
            styleEl.id = key;
            // Append style element to head
            this.document.head.appendChild(styleEl);
        }
        return styleEl;
    }
    /**
     * Append stylesheet css
     * @param key If the key is the same, the CSS will be replaced instead of inserted
     */
    addStylesheetCss(serializedCss, key) {
        if (!this.document || !serializedCss)
            return false;
        const styleEl = this._getStylesheetNode(key);
        if (styleEl) {
            styleEl.innerHTML = serializedCss;
        }
        return true;
    }
    /**
     * Append stylesheet rules to a generate stylesheet
     * Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
     * Object: https://github.com/desirable-objects/json-to-css
     * @param {array | object} rules
     * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
     */
    addStylesheetRules(rules, key) {
        if (!this.document || !rules)
            return;
        const styleNode = this._getStylesheetNode(key);
        if (!(styleNode instanceof HTMLStyleElement) || !styleNode.sheet)
            return;
        const styleSheet = styleNode.sheet;
        const selectors = Object.keys(rules);
        selectors.forEach((selector) => {
            const definition = rules[selector];
            if (Array.isArray(definition)) {
                definition.forEach((item) => {
                    const _rules = Object.keys(item);
                    const result = _rules
                        .map((rule) => {
                        return `${rule}:${item[rule]}`;
                    })
                        .join(';');
                    styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
                });
            }
            else {
                const _rules = Object.keys(definition);
                const result = _rules
                    .map((rule) => {
                    return `${rule}:${definition[rule]}`;
                })
                    .join(';');
                styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
            }
        });
    }
    /**
     * Append a script tag to the document head
     */
    addScript(src) {
        return new Promise((resolve) => {
            let ready = false;
            if (!this.document) {
                resolve(false);
                return;
            }
            const $script = this.document.createElement('script');
            $script.type = 'text/javascript';
            $script.async = true;
            $script.src = src;
            $script.onload = function () {
                if (!ready) {
                    ready = true;
                    setTimeout(() => {
                        resolve(true);
                    }, 1);
                }
            };
            this.document.head.appendChild($script);
        });
    }
    /**
     * Add a class to the contents container
     */
    addClass(className) {
        if (!this.document)
            return;
        const content = this.content || this.document.body;
        if (content) {
            content.classList.add(className);
        }
    }
    /**
     * Remove a class from the contents container
     */
    removeClass(className) {
        if (!this.document)
            return;
        const content = this.content || this.document.body;
        if (content) {
            content.classList.remove(className);
        }
    }
    /**
     * Add DOM event listeners
     */
    addEventListeners() {
        if (!this.document) {
            return;
        }
        this._triggerEvent = this.triggerEvent.bind(this);
        constants_1.DOM_EVENTS.forEach((eventName) => {
            this.document.addEventListener(eventName, this._triggerEvent, false);
        });
    }
    /**
     * Remove DOM event listeners
     */
    removeEventListeners() {
        if (!this.document) {
            return;
        }
        constants_1.DOM_EVENTS.forEach((eventName) => {
            this.document.removeEventListener(eventName, this._triggerEvent, false);
        });
        this._triggerEvent = undefined;
    }
    /**
     * Emit passed browser events
     */
    triggerEvent(e) {
        this.emit(e.type, e);
    }
    /**
     * Add listener for text selection
     */
    addSelectionListeners() {
        if (!this.document) {
            return;
        }
        this._onSelectionChange = this.onSelectionChange.bind(this);
        this.document.addEventListener('selectionchange', this._onSelectionChange, {
            passive: true,
        });
    }
    /**
     * Remove listener for text selection
     */
    removeSelectionListeners() {
        if (!this.document) {
            return;
        }
        this.document.removeEventListener('selectionchange', this._onSelectionChange, false);
        this._onSelectionChange = undefined;
    }
    /**
     * Handle getting text on selection
     * @private
     */
    onSelectionChange() {
        if (this.selectionEndTimeout) {
            clearTimeout(this.selectionEndTimeout);
        }
        this.selectionEndTimeout = setTimeout(() => {
            const selection = this.window.getSelection();
            this.triggerSelectedEvent(selection);
        }, 250);
    }
    /**
     * Emit event on text selection
     * @private
     */
    triggerSelectedEvent(selection) {
        let range, cfirange;
        if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            if (!range.collapsed) {
                // cfirange = this.section.cfiFromRange(range);
                cfirange = new epubcfi_1.default(range, this.cfiBase).toString();
                this.emit(constants_1.EVENTS.CONTENTS.SELECTED, cfirange);
                this.emit(constants_1.EVENTS.CONTENTS.SELECTED_RANGE, range);
            }
        }
    }
    /**
     * Get a Dom Range from EpubCFI
     */
    range(_cfi, ignoreClass) {
        const cfi = new epubcfi_1.default(_cfi);
        return cfi.toRange(this.document, ignoreClass);
    }
    /**
     * Get an EpubCFI from a Dom Range
     */
    cfiFromRange(range, ignoreClass) {
        return new epubcfi_1.default(range, this.cfiBase, ignoreClass).toString();
    }
    /**
     * Get an EpubCFI from a Dom node
     */
    cfiFromNode(node, ignoreClass) {
        return new epubcfi_1.default(node, this.cfiBase, ignoreClass).toString();
    }
    /**
     * Size the contents to a given width and height
     */
    size(width, height) {
        const viewport = { scale: '1.0', scalable: 'no' };
        this.layoutStyle('scrolling');
        if (width >= 0) {
            this.width(width);
            viewport.width = String(width);
            this.css('padding', '0 ' + width / 12 + 'px');
        }
        if (height >= 0) {
            this.height(height);
            viewport.height = String(height);
        }
        this.css('margin', '0');
        this.css('box-sizing', 'border-box');
        this.viewport(viewport);
    }
    /**
     * Apply columns to the contents for pagination
     * @param {number} width
     * @param {number} height
     * @param {number} columnWidth
     * @param {number} gap
     */
    columns(width, height, columnWidth, gap, dir) {
        const COLUMN_AXIS = (0, core_1.prefixed)('column-axis');
        const COLUMN_GAP = (0, core_1.prefixed)('column-gap');
        const COLUMN_WIDTH = (0, core_1.prefixed)('column-width');
        const COLUMN_FILL = (0, core_1.prefixed)('column-fill');
        const writingModeValue = this.writingMode();
        const axis = typeof writingModeValue === 'string' &&
            writingModeValue.indexOf('vertical') === 0
            ? 'vertical'
            : 'horizontal';
        this.layoutStyle('paginated');
        if (dir === 'rtl' && axis === 'horizontal') {
            this.direction(dir);
        }
        this.width(width);
        this.height(height);
        // Deal with Mobile trying to scale to viewport
        this.viewport({
            width: String(width),
            height: String(height),
            scale: '1.0',
            scalable: 'no',
        });
        // TODO: inline-block needs more testing
        // Fixes Safari column cut offs, but causes RTL issues
        // this.css("display", "inline-block");
        this.css('overflow-y', 'hidden');
        this.css('margin', '0', true);
        if (axis === 'vertical') {
            this.css('padding-top', gap / 2 + 'px', true);
            this.css('padding-bottom', gap / 2 + 'px', true);
            this.css('padding-left', '20px');
            this.css('padding-right', '20px');
            this.css(COLUMN_AXIS, 'vertical');
        }
        else {
            this.css('padding-top', '20px');
            this.css('padding-bottom', '20px');
            this.css('padding-left', gap / 2 + 'px', true);
            this.css('padding-right', gap / 2 + 'px', true);
            this.css(COLUMN_AXIS, 'horizontal');
        }
        this.css('box-sizing', 'border-box');
        this.css('max-width', 'inherit');
        this.css(COLUMN_FILL, 'auto');
        this.css(COLUMN_GAP, gap + 'px');
        this.css(COLUMN_WIDTH, columnWidth + 'px');
        // Fix glyph clipping in WebKit
        // https://github.com/futurepress/epub.js/issues/983
        this.css('-webkit-line-box-contain', 'block glyphs replaced');
    }
    /**
     * Scale contents from center
     * @param {number} scale
     * @param {number} offsetX
     * @param {number} offsetY
     */
    scaler(scale, offsetX, offsetY) {
        const scaleStr = 'scale(' + scale + ')';
        let translateStr = '';
        // this.css("position", "absolute"));
        this.css('transform-origin', 'top left');
        if (offsetX >= 0 || offsetY >= 0) {
            translateStr =
                ' translate(' + (offsetX || 0) + 'px, ' + (offsetY || 0) + 'px )';
        }
        this.css('transform', scaleStr + translateStr);
    }
    /**
     * Fit contents into a fixed width and height
     * @param {number} width
     * @param {number} height
     */
    fit(width, height, section) {
        const viewport = this.viewport();
        const viewportWidth = parseInt(viewport.width);
        const viewportHeight = parseInt(viewport.height);
        const widthScale = width / viewportWidth;
        const heightScale = height / viewportHeight;
        const scale = widthScale < heightScale ? widthScale : heightScale;
        // the translate does not work as intended, elements can end up unaligned
        // var offsetY = (height - (viewportHeight * scale)) / 2;
        // var offsetX = 0;
        // if (this.sectionIndex % 2 === 1) {
        // 	offsetX = width - (viewportWidth * scale);
        // }
        this.layoutStyle('paginated');
        // scale needs width and height to be set
        this.width(viewportWidth);
        this.height(viewportHeight);
        this.overflow('hidden');
        // Scale to the correct size
        this.scaler(scale, 0, 0);
        // this.scaler(scale, offsetX > 0 ? offsetX : 0, offsetY);
        // background images are not scaled by transform
        this.css('background-size', viewportWidth * scale + 'px ' + viewportHeight * scale + 'px');
        this.css('background-color', 'transparent');
        if (section && section.properties.includes('page-spread-left')) {
            // set margin since scale is weird
            const marginLeft = width - viewportWidth * scale;
            this.css('margin-left', marginLeft + 'px');
        }
    }
    /**
     * Set the direction of the text
     * @param {string} [dir="ltr"] "rtl" | "ltr"
     */
    direction(dir = 'ltr') {
        if (this.documentElement) {
            this.documentElement.style['direction'] = dir;
        }
    }
    mapPage(cfiBase, layout, start, end, dev) {
        // Pass dev as the fourth argument, direction and axis as undefined
        const mapping = new mapping_1.default(layout, undefined, undefined, dev);
        return mapping.page(this, cfiBase, start, end);
    }
    /**
     * Emit event when link in content is clicked
     * @private
     */
    linksHandler() {
        (0, replacements_1.replaceLinks)(this.content, (href) => {
            this.emit(constants_1.EVENTS.CONTENTS.LINK_CLICKED, href);
        });
    }
    /**
     * Set the writingMode of the text
     */
    writingMode(mode) {
        const WRITING_MODE = (0, core_1.prefixed)('writing-mode');
        if (mode !== undefined) {
            this.content.style.setProperty(WRITING_MODE, mode);
            return;
        }
        return this.content.style.getPropertyValue(WRITING_MODE) || 'horizontal-tb';
    }
    /**
     * Set the layoutStyle of the content
     */
    layoutStyle(style) {
        if (style) {
            this._layoutStyle = style;
            navigator.epubReadingSystem.layoutStyle = this._layoutStyle;
        }
        return this._layoutStyle || 'paginated';
    }
    /**
     * Add the epubReadingSystem object to the navigator
     */
    epubReadingSystem(name, version) {
        navigator.epubReadingSystem = {
            name: name,
            version: version,
            layoutStyle: this.layoutStyle(),
            hasFeature: function (feature) {
                switch (feature) {
                    case 'dom-manipulation':
                        return true;
                    case 'layout-changes':
                        return true;
                    case 'touch-events':
                        return true;
                    case 'mouse-events':
                        return true;
                    case 'keyboard-events':
                        return true;
                    case 'spine-scripting':
                        return false;
                    default:
                        return false;
                }
            },
        };
        return navigator.epubReadingSystem;
    }
    destroy() {
        this.removeListeners();
    }
}
(0, event_emitter_1.default)(Contents.prototype);
exports.default = Contents;
