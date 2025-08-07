"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./utils/core");
const constants_1 = require("./utils/constants");
const event_emitter_1 = __importDefault(require("event-emitter"));
/**
 * Figures out the CSS values to apply for a layout
 * @class
 * @param {object} settings
 * @param {string} [settings.layout='reflowable']
 * @param {string} [settings.spread]
 * @param {number} [settings.minSpreadWidth=800]
 * @param {boolean} [settings.evenSpreads=false]
 */
class Layout {
    constructor(settings) {
        // Set default direction if not provided
        if (!settings.direction) {
            settings.direction = 'ltr';
        }
        this.settings = settings;
        this.name = settings.layout || 'reflowable';
        this._spread = settings.spread === 'none' ? false : true;
        this._minSpreadWidth = settings.minSpreadWidth || 800;
        this._evenSpreads = settings.evenSpreads || false;
        if (settings.flow === 'scrolled' ||
            settings.flow === 'scrolled-continuous' ||
            settings.flow === 'scrolled-doc') {
            this._flow = 'scrolled';
        }
        else {
            this._flow = 'paginated';
        }
        this.width = 0;
        this.height = 0;
        this.spreadWidth = 0;
        this.delta = 0;
        this.columnWidth = 0;
        this.gap = 0;
        this.divisor = 1;
        this.props = {
            name: this.name,
            spread: this._spread,
            flow: this._flow,
            width: 0,
            height: 0,
            spreadWidth: 0,
            delta: 0,
            columnWidth: 0,
            gap: 0,
            divisor: 1,
        };
    }
    /**
     * Switch the flow between paginated and scrolled
     * @param  {string} flow paginated | scrolled
     * @return {string} simplified flow
     */
    flow(flow) {
        if (typeof flow != 'undefined') {
            if (flow === 'scrolled' ||
                flow === 'scrolled-continuous' ||
                flow === 'scrolled-doc') {
                this._flow = 'scrolled';
            }
            else {
                this._flow = 'paginated';
            }
            // this.props.flow = this._flow;
            this.update({ flow: this._flow });
        }
        return this._flow;
    }
    /**
     * Switch between using spreads or not, and set the
     * width at which they switch to single.
     * @param  {string} spread "none" | "always" | "auto"
     * @param  {number} min integer in pixels
     * @return {boolean} spread true | false
     */
    spread(spread, min) {
        if (spread) {
            this._spread = spread === 'none' ? false : true;
            // this.props.spread = this._spread;
            this.update({ spread: this._spread });
        }
        if (min >= 0) {
            this._minSpreadWidth = min;
        }
        return this._spread;
    }
    /**
     * Calculate the dimensions of the pagination
     * @param  {number} _width  width of the rendering
     * @param  {number} _height height of the rendering
     * @param  {number} _gap    width of the gap between columns
     */
    calculate(_width, _height, _gap) {
        let divisor = 1;
        let gap = _gap || 0;
        //-- Check the width and create even width columns
        // var fullWidth = Math.floor(_width);
        let width = _width;
        const height = _height;
        const section = Math.floor(width / 12);
        let columnWidth;
        let pageWidth;
        if (this._spread && width >= this._minSpreadWidth) {
            divisor = 2;
        }
        else {
            divisor = 1;
        }
        if (this.name === 'reflowable' &&
            this._flow === 'paginated' &&
            !(_gap >= 0)) {
            gap = section % 2 === 0 ? section : section - 1;
        }
        if (this.name === 'pre-paginated') {
            gap = 0;
        }
        //-- Double Page
        if (divisor > 1) {
            // width = width - gap;
            // columnWidth = (width - gap) / divisor;
            // gap = gap / divisor;
            columnWidth = width / divisor - gap;
            pageWidth = columnWidth + gap;
        }
        else {
            columnWidth = width;
            pageWidth = width;
        }
        if (this.name === 'pre-paginated' && divisor > 1) {
            width = columnWidth;
        }
        const spreadWidth = columnWidth * divisor + gap;
        const delta = width;
        this.width = width;
        this.height = height;
        this.spreadWidth = spreadWidth;
        this.pageWidth = pageWidth;
        this.delta = delta;
        this.columnWidth = columnWidth;
        this.gap = gap;
        this.divisor = divisor;
        this.update({
            width,
            height,
            spreadWidth,
            pageWidth,
            delta,
            columnWidth,
            gap,
            divisor,
        });
    }
    /**
     * Apply Css to a Document
     */
    format(contents, section, axis) {
        let formating;
        if (this.name === 'pre-paginated') {
            formating = contents.fit(this.columnWidth, this.height);
        }
        else if (this._flow === 'paginated') {
            formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.settings.direction ?? 'ltr');
        }
        else if (axis && axis === 'horizontal') {
            formating = contents.size(null, this.height);
        }
        else {
            formating = contents.size(this.width, null);
        }
        return formating;
    }
    /**
     * Count number of pages
     */
    count(totalLength, pageLength) {
        let spreads, pages;
        if (this.name === 'pre-paginated') {
            spreads = 1;
            pages = 1;
        }
        else if (this._flow === 'paginated') {
            pageLength = pageLength || this.delta;
            spreads = Math.ceil(totalLength / pageLength);
            pages = spreads * this.divisor;
        }
        else {
            // scrolled
            pageLength = pageLength || this.height;
            spreads = Math.ceil(totalLength / pageLength);
            pages = spreads;
        }
        return {
            spreads,
            pages,
        };
    }
    /**
     * Update props that have changed
     */
    update(props) {
        Object.keys(props).forEach((propName) => {
            const key = propName;
            if (this.props[key] === props[key]) {
                delete props[key];
            }
        });
        if (Object.keys(props).length > 0) {
            const newProps = (0, core_1.extend)(this.props, props);
            this.emit(constants_1.EVENTS.LAYOUT.UPDATED, newProps, props);
        }
    }
}
(0, event_emitter_1.default)(Layout.prototype);
exports.default = Layout;
