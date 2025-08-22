import { extend } from './utils/core';
import { EVENTS } from './utils/constants';
import EventEmitter from 'event-emitter';
import { Section } from './utils/replacements';
import Contents from './contents';

type LayoutSettings = {
  layout?: string;
  spread?: Spread;
  minSpreadWidth?: number;
  evenSpreads?: boolean;
  flow?: string;
  direction?: string;
};

export type Flow =
  | 'paginated'
  | 'scrolled'
  | 'scrolled-continuous'
  | 'scrolled-doc'
  | 'auto';
export type Spread = 'none' | 'always' | 'auto';
export type Axis = 'horizontal' | 'vertical';
type LayoutProps = {
  name: string;
  spread: boolean;
  flow: Flow;
  width: number;
  height: number;
  spreadWidth: number;
  delta: number;
  columnWidth: number;
  gap: number;
  divisor: number;
  pageWidth?: number;
};

type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on'>;

/**
 * Figures out the CSS values to apply for a layout
 * @class
 * @param {object} settings
 * @param {string} [settings.layout='reflowable']
 * @param {string} [settings.spread]
 * @param {number} [settings.minSpreadWidth=800]
 * @param {boolean} [settings.evenSpreads=false]
 */
class Layout implements EventEmitterMethods {
  settings: LayoutSettings;
  name: string;
  _spread: boolean;
  _minSpreadWidth: number;
  _evenSpreads: boolean;
  _flow: Flow;
  pageWidth?: number;
  divisor: number;
  width: number;
  height: number;
  spreadWidth: number;
  delta: number;
  columnWidth: number;
  gap: number;
  props: LayoutProps;
  emit!: EventEmitter['emit'];
  on!: EventEmitter['on'];

  constructor(settings: LayoutSettings) {
    // Set default direction if not provided
    if (!settings.direction) {
      settings.direction = 'ltr';
    }
    this.settings = settings;
    this.name = settings.layout || 'reflowable';
    this._spread = settings.spread === 'none' ? false : true;
    this._minSpreadWidth = settings.minSpreadWidth || 800;
    this._evenSpreads = settings.evenSpreads || false;

    if (
      settings.flow === 'scrolled' ||
      settings.flow === 'scrolled-continuous' ||
      settings.flow === 'scrolled-doc'
    ) {
      this._flow = 'scrolled';
    } else {
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
  flow(flow: Flow) {
    if (typeof flow != 'undefined') {
      if (
        flow === 'scrolled' ||
        flow === 'scrolled-continuous' ||
        flow === 'scrolled-doc'
      ) {
        this._flow = 'scrolled';
      } else {
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
  spread(spread: Spread, min?: number) {
    if (spread) {
      this._spread = spread === 'none' ? false : true;
      // this.props.spread = this._spread;
      this.update({ spread: this._spread });
    }

    if (min && min >= 0) {
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
  calculate(_width: number, _height: number, _gap?: number) {
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
    } else {
      divisor = 1;
    }

    if (
      this.name === 'reflowable' &&
      this._flow === 'paginated' &&
      !(_gap && _gap >= 0)
    ) {
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
    } else {
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
  format(contents: Contents, section?: Section, axis?: Axis) {
    let formating;

    if (this.name === 'pre-paginated') {
      formating = contents.fit(this.columnWidth, this.height);
    } else if (this._flow === 'paginated') {
      formating = contents.columns(
        this.width,
        this.height,
        this.columnWidth,
        this.gap,
        this.settings.direction ?? 'ltr'
      );
    } else if (axis && axis === 'horizontal') {
      formating = contents.size(-1, this.height);
    } else {
      formating = contents.size(this.width, -1);
    }

    return formating;
  }

  /**
   * Count number of pages
   */
  count(totalLength: number, pageLength?: number) {
    let spreads, pages;

    if (this.name === 'pre-paginated') {
      spreads = 1;
      pages = 1;
    } else if (this._flow === 'paginated') {
      pageLength = pageLength || this.delta;
      spreads = Math.ceil(totalLength / pageLength);
      pages = spreads * this.divisor;
    } else {
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
  private update(props: Partial<LayoutProps>) {
    Object.keys(props).forEach((propName) => {
      const key = propName as keyof LayoutProps;
      if (this.props[key] === props[key]) {
        delete props[key];
      }
    });

    if (Object.keys(props).length > 0) {
      const newProps = extend(this.props, props);
      this.emit(EVENTS.LAYOUT.UPDATED, newProps, props);
    }
  }
}

EventEmitter(Layout.prototype);

export default Layout;
