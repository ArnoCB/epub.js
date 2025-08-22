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
declare class Layout implements EventEmitterMethods {
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
  emit: EventEmitter['emit'];
  on: EventEmitter['on'];
  constructor(settings: LayoutSettings);
  /**
   * Switch the flow between paginated and scrolled
   * @param  {string} flow paginated | scrolled
   * @return {string} simplified flow
   */
  flow(flow: Flow): Flow;
  /**
   * Switch between using spreads or not, and set the
   * width at which they switch to single.
   * @param  {string} spread "none" | "always" | "auto"
   * @param  {number} min integer in pixels
   * @return {boolean} spread true | false
   */
  spread(spread: Spread, min?: number): boolean;
  /**
   * Calculate the dimensions of the pagination
   * @param  {number} _width  width of the rendering
   * @param  {number} _height height of the rendering
   * @param  {number} _gap    width of the gap between columns
   */
  calculate(_width: number, _height: number, _gap?: number): void;
  /**
   * Apply Css to a Document
   */
  format(contents: Contents, section?: Section, axis?: Axis): void;
  /**
   * Count number of pages
   */
  count(
    totalLength: number,
    pageLength?: number
  ): {
    spreads: number;
    pages: number;
  };
  /**
   * Update props that have changed
   */
  private update;
}
export default Layout;
