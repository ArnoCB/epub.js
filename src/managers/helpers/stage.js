"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../utils/core");
const helpers_1 = require("../../utils/helpers");
class Stage {
    constructor(_options) {
        this.settings = _options || {};
        this.id = 'epubjs-container-' + (0, core_1.uuid)();
        this.container = this.create(this.settings);
        if (this.settings.hidden) {
            this.wrapper = this.wrap(this.container);
        }
    }
    /*
     * Creates an element to render to.
     * Resizes to passed width and height or to the elements size
     */
    create(options) {
        let height = options.height; // !== false ? options.height : "100%";
        let width = options.width; // !== false ? options.width : "100%";
        const overflow = options.overflow || false;
        const axis = options.axis || 'vertical';
        const direction = options.direction;
        (0, core_1.extend)(this.settings, options);
        if (options.height && (0, core_1.isNumber)(options.height)) {
            height = options.height + 'px';
        }
        if (options.width && (0, core_1.isNumber)(options.width)) {
            width = options.width + 'px';
        }
        // Create new container element
        const container = document.createElement('div');
        container.id = this.id;
        container.classList.add('epub-container');
        // Style Element
        // container.style.fontSize = "0";
        container.style.wordSpacing = '0';
        container.style.lineHeight = '0';
        container.style.verticalAlign = 'top';
        container.style.position = 'relative';
        if (axis === 'horizontal') {
            // container.style.whiteSpace = "nowrap";
            container.style.display = 'flex';
            container.style.flexDirection = 'row';
            container.style.flexWrap = 'nowrap';
        }
        if (width) {
            container.style.width = width;
        }
        if (height) {
            container.style.height = height;
        }
        if (typeof overflow === 'string') {
            if (overflow === 'scroll' && axis === 'vertical') {
                container.style.overflowY = overflow;
                container.style.overflowX = 'hidden';
            }
            else if (overflow === 'scroll' && axis === 'horizontal') {
                container.style.overflowY = 'hidden';
                container.style.overflowX = overflow;
            }
            else {
                container.style.overflow = overflow;
            }
        }
        if (direction) {
            container.dir = direction;
            container.style['direction'] = direction;
        }
        if (direction && this.settings.fullsize) {
            document.body.style['direction'] = direction;
        }
        return container;
    }
    wrap(container) {
        const wrapper = document.createElement('div');
        wrapper.style.visibility = 'hidden';
        wrapper.style.overflow = 'hidden';
        wrapper.style.width = '0';
        wrapper.style.height = '0';
        wrapper.appendChild(container);
        return wrapper;
    }
    getElement(_element) {
        let element;
        if (typeof _element !== 'string' && (0, core_1.isElement)(_element)) {
            element = _element;
        }
        else if (typeof _element === 'string') {
            element = document.getElementById(_element);
        }
        if (!element) {
            throw new Error('Not an Element');
        }
        return element;
    }
    attachTo(what) {
        const element = this.getElement(what);
        if (!element) {
            return;
        }
        let base;
        if (this.settings.hidden) {
            base = this.wrapper;
        }
        else {
            base = this.container;
        }
        if (base) {
            element.appendChild(base);
        }
        this.element = element;
        return element;
    }
    getContainer() {
        return this.container;
    }
    onResize(func) {
        // Only listen to window for resize event if width and height are not fixed.
        // This applies if it is set to a percent or auto.
        if (!(0, core_1.isNumber)(this.settings.width) || !(0, core_1.isNumber)(this.settings.height)) {
            this.resizeFunc = (0, helpers_1.throttle)(func, 50);
            window.addEventListener('resize', this.resizeFunc, false);
        }
    }
    onOrientationChange(func) {
        this.orientationChangeFunc = func;
        window.addEventListener('orientationchange', this.orientationChangeFunc, false);
    }
    size(width, height) {
        let bounds;
        const _width = width || this.settings.width;
        const _height = height || this.settings.height;
        if (this.element === undefined) {
            // Handle case where element is not defined
            throw new Error('Element is not defined. Please attach the stage to an element first.');
        }
        if (width === undefined) {
            bounds = this.element.getBoundingClientRect();
            if (bounds.width) {
                width = String(Math.floor(bounds.width));
                this.container.style.width = width + 'px';
            }
        }
        else {
            if ((0, core_1.isNumber)(width)) {
                this.container.style.width = width + 'px';
            }
            else {
                this.container.style.width = width;
            }
        }
        if (height === undefined) {
            bounds = bounds || this.element.getBoundingClientRect();
            if (bounds.height) {
                height = String(bounds.height);
                this.container.style.height = height + 'px';
            }
        }
        else {
            if ((0, core_1.isNumber)(height)) {
                this.container.style.height = height + 'px';
            }
            else {
                this.container.style.height = height;
            }
        }
        if (!(0, core_1.isNumber)(width)) {
            width = String(this.container.clientWidth);
        }
        if (!(0, core_1.isNumber)(height)) {
            height = String(this.container.clientHeight);
        }
        this.containerStyles = window.getComputedStyle(this.container);
        this.containerPadding = {
            left: String(parseFloat(this.containerStyles.paddingLeft) || 0),
            right: String(parseFloat(this.containerStyles.paddingRight) || 0),
            top: String(parseFloat(this.containerStyles.paddingTop) || 0),
            bottom: String(parseFloat(this.containerStyles.paddingBottom) || 0),
        };
        // Bounds not set, get them from window
        const _windowBounds = (0, core_1.windowBounds)();
        const bodyStyles = window.getComputedStyle(document.body);
        const bodyPadding = {
            left: String(parseFloat(bodyStyles.paddingLeft) || 0),
            right: String(parseFloat(bodyStyles.paddingRight) || 0),
            top: String(parseFloat(bodyStyles.paddingTop) || 0),
            bottom: String(parseFloat(bodyStyles.paddingBottom) || 0),
        };
        if (!_width) {
            const leftPad = parseFloat(bodyPadding.left ?? '0');
            const rightPad = parseFloat(bodyPadding.right ?? '0');
            width = String(_windowBounds.width - leftPad - rightPad);
        }
        if ((this.settings.fullsize && !_height) || !_height) {
            const topPad = parseFloat(bodyPadding.top ?? '0');
            const bottomPad = parseFloat(bodyPadding.bottom ?? '0');
            height = String(_windowBounds.height - topPad - bottomPad);
        }
        const containerLeft = parseFloat(this.containerPadding?.left ?? '0');
        const containerRight = parseFloat(this.containerPadding?.right ?? '0');
        const containerTop = parseFloat(this.containerPadding?.top ?? '0');
        const containerBottom = parseFloat(this.containerPadding?.bottom ?? '0');
        return {
            width: parseFloat(width) - containerLeft - containerRight,
            height: parseFloat(height) - containerTop - containerBottom,
        };
    }
    bounds() {
        let box;
        if (this.container.style.overflow !== 'visible') {
            box = this.container && this.container.getBoundingClientRect();
        }
        if (!box || !box.width || !box.height) {
            return (0, core_1.windowBounds)();
        }
        else {
            return box;
        }
    }
    getSheet() {
        const style = document.createElement('style');
        // WebKit hack --> https://davidwalsh.name/add-rules-stylesheets
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
    }
    addStyleRules(selector, rulesArray) {
        const scope = '#' + this.id + ' ';
        let rules = '';
        if (!this.sheet) {
            this.sheet = this.getSheet() ?? undefined;
        }
        rulesArray.forEach(function (set) {
            for (const prop in set) {
                if (Object.prototype.hasOwnProperty.call(set, prop)) {
                    rules += prop + ':' + set[prop] + ';';
                }
            }
        });
        this.sheet?.insertRule(scope + selector + ' {' + rules + '}', 0);
    }
    axis(axis) {
        if (axis === 'horizontal') {
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'row';
            this.container.style.flexWrap = 'nowrap';
        }
        else {
            this.container.style.display = 'block';
        }
        this.settings.axis = axis;
    }
    direction(dir) {
        if (this.container) {
            this.container.dir = dir;
            this.container.style['direction'] = dir;
        }
        if (this.settings.fullsize) {
            document.body.style['direction'] = dir;
        }
        this.settings.dir = dir;
    }
    overflow(overflow) {
        if (this.container) {
            if (overflow === 'scroll' && this.settings.axis === 'vertical') {
                this.container.style.overflowY = overflow;
                this.container.style.overflowX = 'hidden';
            }
            else if (overflow === 'scroll' && this.settings.axis === 'horizontal') {
                this.container.style.overflowY = 'hidden';
                this.container.style.overflowX = overflow;
            }
            else {
                this.container.style.overflow = overflow;
            }
        }
        this.settings.overflow = overflow;
    }
    destroy() {
        if (this.element) {
            if (this.element.contains(this.container)) {
                this.element.removeChild(this.container);
            }
            if (this.resizeFunc) {
                window.removeEventListener('resize', this.resizeFunc);
            }
            if (this.orientationChangeFunc) {
                window.removeEventListener('orientationchange', this.orientationChangeFunc);
            }
        }
    }
}
exports.default = Stage;
