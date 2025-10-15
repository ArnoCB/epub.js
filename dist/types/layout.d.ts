import EventEmitter from 'event-emitter';
import Section from './section';
import Contents from './contents';
import type { Flow, Spread, Axis } from './types/common';
import type { LayoutSettings, LayoutProps } from './types/layout';
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on'>;
/**
 * Figures out the CSS values to apply for a layout
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
     */
    flow(flow: Flow): Flow;
    /**
     * Switch between using spreads or not, and set the
     * width at which they switch to single.
     */
    spread(spread: Spread, min?: number): boolean;
    /**
     * Calculate the dimensions of the pagination
     */
    calculate(_width: number, _height: number, _gap?: number): void;
    /**
     * Apply Css to a Document
     */
    format(contents: Contents, section?: Section, axis?: Axis): void;
    /**
     * Count number of pages
     */
    count(totalLength: number, pageLength?: number): {
        spreads: number;
        pages: number;
    };
    /**
     * Update props that have changed
     */
    private update;
}
export default Layout;
