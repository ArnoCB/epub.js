import EventEmitter from 'event-emitter';
import EpubCFI from './epubcfi';
import Layout from './layout';
import Section from './section';
import type { Viewport } from './types/viewport';
export type StylesheetRules = [string, ...[string, string, boolean?][]][] | {
    [selector: string]: {
        [property: string]: string;
    } | {
        [property: string]: string;
    }[];
};
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on'>;
/**
 * Handles DOM manipulation, queries and events for View contents
 */
declare class Contents implements EventEmitterMethods {
    emit: EventEmitter['emit'];
    on: EventEmitter['on'];
    document: Document;
    documentElement: HTMLElement;
    content: HTMLElement;
    sectionIndex: number;
    cfiBase: string;
    window: Window | null;
    _size: {
        width: number;
        height: number;
    };
    epubcfi: EpubCFI;
    called: number;
    active: boolean;
    expanding?: NodeJS.Timeout;
    observer: MutationObserver | ResizeObserver | null;
    _layoutStyle: string | null;
    onResize?: (size: {
        width: number;
        height: number;
    }) => void;
    readyState: 'loading' | 'interactive' | 'complete';
    selectionEndTimeout: NodeJS.Timeout | null;
    _onSelectionChange?: (e: Event) => void;
    _triggerEvent?: (e: Event) => void;
    _expanding: number | undefined;
    _resizeCheck: NodeJS.Timeout | undefined;
    constructor(doc: Document, content: HTMLElement, cfiBase?: string, sectionIndex?: number);
    /**
     * Get DOM events that are listened for and passed along
     */
    static get listenedEvents(): string[];
    /**
     * Get or Set width
     */
    width(w?: number | string): number;
    /**
     * Get or Set height
     * @param {number} [h]
     * @returns {number} height
     */
    height(h?: number | string): number;
    /**
     * Get or Set width of the contents
     * @param {number} [w]
     * @returns {number} width
     */
    contentWidth(w?: number | string): number;
    /**
     * Get or Set height of the contents
     * @param {number} [h]
     * @returns {number} height
     */
    contentHeight(h?: number | string): number;
    /**
     * Get the width of the text using Range
     */
    textWidth(): number;
    /**
     * Get the height of the text using Range
     * @returns {number} height
     */
    textHeight(): number;
    /**
     * Get documentElement scrollWidth
     */
    scrollWidth(): number;
    /**
     * Get documentElement scrollHeight
     */
    scrollHeight(): number;
    /**
     * Set overflow css style of the contents
     */
    overflow(overflow?: string): string;
    /**
     * Set overflowX css style of the documentElement
     */
    overflowX(overflow?: string): string;
    /**
     * Set overflowY css style of the documentElement
     */
    overflowY(overflow?: string): string;
    /**
     * Set Css styles on the contents element (typically Body)
     * @param {string} property
     * @param {string} value
     * @param {boolean} [priority] set as "important"
     */
    css(property: string, value?: string, priority?: boolean): string;
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
    viewport(options?: Viewport): Viewport;
    /**
     * Event emitter for when the contents has expanded
     */
    private expand;
    /**
     * Add DOM listeners
     */
    private listeners;
    /**
     * Remove DOM listeners
     */
    private removeListeners;
    /**
     * Check if size of contents has changed and
     * emit 'resize' event if it has.
     */
    private resizeCheck;
    /**
     * Poll for resize detection
     * @private
     */
    resizeListeners(): void;
    /**
     * Listen for visibility of tab to change
     * @private
     */
    visibilityListeners(): void;
    /**
     * Listen for media query changes and emit 'expand' event
     * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
     * @private
     */
    private mediaQueryListeners;
    /**
     * Use ResizeObserver to listen for changes in the DOM and check for resize
     */
    private resizeObservers;
    /**
     * Use MutationObserver to listen for changes in the DOM and check for resize
     * @private
     */
    mutationObservers(): void;
    /**
     * Test if images are loaded or add listener for when they load
     */
    private imageLoadListeners;
    /**
     * Listen for font load and check for resize when loaded
     */
    private fontLoadListeners;
    /**
     * Get the documentElement
     */
    root(): HTMLElement | null;
    /**
     * Get the location offset of a EpubCFI or an #id
     */
    locationOf(target: string | HTMLElement, ignoreClass?: string): {
        left: number;
        top: number;
    };
    /**
     * Append a stylesheet link to the document head
     */
    addStylesheet(src: string): Promise<boolean>;
    _getStylesheetNode(key: string): false | HTMLElement;
    /**
     * Append stylesheet css
     * @param key If the key is the same, the CSS will be replaced instead of inserted
     */
    addStylesheetCss(serializedCss: string, key: string): boolean;
    /**
     * Append stylesheet rules to a generate stylesheet
     * Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
     * Object: https://github.com/desirable-objects/json-to-css
     * @param {array | object} rules
     * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
     */
    addStylesheetRules(rules: {
        [selector: string]: {
            [property: string]: string;
        } | {
            [property: string]: string;
        }[];
    }, key: string): void;
    /**
     * Append a script tag to the document head
     */
    addScript(src: string): Promise<boolean>;
    /**
     * Add a class to the contents container
     */
    addClass(className: string): void;
    /**
     * Remove a class from the contents container
     */
    removeClass(className: string): void;
    /**
     * Add DOM event listeners
     */
    private addEventListeners;
    /**
     * Remove DOM event listeners
     */
    private removeEventListeners;
    /**
     * Emit passed browser events
     */
    private triggerEvent;
    /**
     * Add listener for text selection
     */
    private addSelectionListeners;
    /**
     * Remove listener for text selection
     */
    private removeSelectionListeners;
    /**
     * Handle getting text on selection
     * @private
     */
    onSelectionChange(): void;
    /**
     * Emit event on text selection
     * @private
     */
    triggerSelectedEvent(selection: Selection | null): void;
    /**
     * Get a Dom Range from EpubCFI
     */
    range(_cfi: string, ignoreClass?: string): Range | null;
    /**
     * Get an EpubCFI from a Dom Range
     */
    cfiFromRange(range: Range, ignoreClass?: string): string;
    /**
     * Get an EpubCFI from a Dom node
     */
    cfiFromNode(node: Node, ignoreClass?: string): string;
    /**
     * Size the contents to a given width and height
     */
    size(width: number, height: number): void;
    /**
     * Apply columns to the contents for pagination
     * @param {number} width
     * @param {number} height
     * @param {number} columnWidth
     * @param {number} gap
     */
    columns(width: number, height: number, columnWidth: number, gap: number, dir: string): void;
    /**
     * Scale contents from center
     * @param {number} scale
     * @param {number} offsetX
     * @param {number} offsetY
     */
    scaler(scale: number, offsetX: number, offsetY: number): void;
    /**
     * Fit contents into a fixed width and height
     * @param {number} width
     * @param {number} height
     */
    fit(width: number, height: number, section?: Section): void;
    /**
     * Set the direction of the text
     * @param {string} [dir="ltr"] "rtl" | "ltr"
     */
    direction(dir?: 'rtl' | 'ltr'): void;
    mapPage(cfiBase: string, layout: Layout, start: number, end: number, dev: boolean): {
        start: string;
        end: string;
    } | undefined;
    /**
     * Emit event when link in content is clicked
     * @private
     */
    private linksHandler;
    /**
     * Set the writingMode of the text
     */
    writingMode(mode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr'): string | void;
    /**
     * Set the layoutStyle of the content
     */
    private layoutStyle;
    /**
     * Add the epubReadingSystem object to the navigator
     */
    private epubReadingSystem;
    destroy(): void;
}
export default Contents;
