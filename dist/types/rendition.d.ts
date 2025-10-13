import type { DisplayedLocation, RenditionHooks, RenditionOptions } from './types';
import EventEmitter from 'event-emitter';
import { defer } from './utils/core';
import EpubCFI from './epubcfi';
import Queue from './utils/queue';
import Layout, { Flow, Spread } from './layout';
import Themes from './themes';
import Annotations from './annotations';
import Book from './book';
import { View } from './managers/helpers/views';
import Contents from './contents';
import { ViewManager } from './managers/helpers/snap';
import { ViewManagerConstructor } from './managers/helpers/snap';
type EventEmitterMethods = Pick<EventEmitter, 'emit'>;
/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
 * @class
 * @param {Book} book
 * @param {object} [options]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.ignoreClass] class for the cfi parser to ignore
 * @param {string | function | object} [options.manager='default']
 * @param {string | function} [options.view='iframe']
 * @param {string} [options.layout] layout to force
 * @param {string} [options.spread] force spread value
 * @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
 * @param {string} [options.stylesheet] url of stylesheet to be injected
 * @param {boolean} [options.resizeOnOrientationChange] false to disable orientation events
 * @param {string} [options.script] url of script to be injected
 * @param {boolean | object} [options.snap=false] use snap scrolling
 * @param {string} [options.defaultDirection='ltr'] default text direction
 * @param {boolean} [options.allowScriptedContent=false] enable running scripts in content
 * @param {boolean} [options.allowPopups=false] enable opening popup in content
 */
export declare class Rendition implements EventEmitterMethods {
    emit: EventEmitter['emit'];
    settings: RenditionOptions;
    book: Book;
    hooks: RenditionHooks;
    themes: Themes;
    annotations: Annotations;
    epubcfi: EpubCFI;
    q: Queue;
    location: DisplayedLocation | null;
    displaying: defer<boolean> | undefined;
    _layout: Layout | undefined;
    ViewManager: ViewManagerConstructor | undefined;
    manager: ViewManager;
    starting: defer<void>;
    started: Promise<void>;
    View: View;
    constructor(book: Book, options: RenditionOptions);
    /**
     * Set the manager function
     */
    setManager(manager: ViewManager): void;
    /**
     * Start the rendering
     */
    start(): Promise<void>;
    /**
     * Call to attach the container to an element in the dom
     * Container must be attached before rendering can begin
     * @return {Promise}
     */
    attachTo(element: HTMLElement | string): Promise<unknown>;
    /**
     * Display a point in the book
     * The request will be added to the rendering Queue,
     * so it will wait until book is opened, rendering started
     * and all other rendering tasks have finished to be called.
     * @param  {string} target Url or EpubCFI
     * @return {Promise}
     */
    display(target: string | number): Promise<unknown>;
    /**
     * Tells the manager what to display immediately
     *
     * @param  {string} target Url or EpubCFI
     * @return {Promise}
     */
    private _display;
    getContents(): Contents[];
    /**
     * Report what section has been displayed
     */
    private afterDisplayed;
    /**
     * Report what has been removed
     */
    private afterRemoved;
    /**
     * Report resize events and display the last seen location
     */
    private onResized;
    /**
     * Report orientation events and display the last seen location
     * @private
     */
    private onOrientationChange;
    /**
     * Trigger a resize of the views
     * @param {number} [width]
     * @param {number} [height]
     * @param {string} [epubcfi] (optional)
     */
    resize(width: number, height: number, epubcfi?: string): void;
    /**
     * Clear all rendered views
     */
    clear(): void;
    /**
     * Go to the next "page" in the rendition
     */
    next(): Promise<unknown>;
    /**
     * Go to the previous "page" in the rendition
     */
    prev(): Promise<unknown>;
    /**
     * Determine the Layout properties from metadata and settings
     */
    private determineLayoutProperties;
    /**
     * Adjust the flow of the rendition to paginated or scrolled
     * (scrolled-continuous vs scrolled-doc are handled by different view managers)
     */
    flow(flow: Flow): void;
    /**
     * Adjust the layout of the rendition to reflowable or pre-paginated
     * @param  {object} settings
     */
    layout(settings: {
        layout?: string;
        spread?: Spread;
        minSpreadWidth?: number;
        direction?: string;
        flow?: Flow;
    }): Layout | undefined;
    /**
     * Adjust if the rendition uses spreads
     * @param  {int} [min] min width to use spreads at
     */
    spread(spread: Spread, min: number): void;
    /**
     * Adjust the direction of the rendition
     */
    direction(dir: string): void;
    /**
     * Report the current location
     * @fires relocated
     * @fires locationChanged
     */
    reportLocation(): Promise<unknown>;
    /**
     * Get the Current Location object
     */
    currentLocation(): import("./managers/default").PageLocation[];
    /**
     * Creates a Rendition#locationRange from location
     * passed by the Manager
     * @returns {displayedLocation}
     */
    private located;
    /**
     * Remove and Clean Up the Rendition
     */
    destroy(): void;
    /**
     * Pass the events from a view's Contents
     */
    private passEvents;
    /**
     * Emit events passed by a view
     */
    private triggerViewEvent;
    /**
     * Emit a selection event's CFI Range passed from a a view
     * @private
     * @param  {string} cfirange
     */
    triggerSelectedEvent(cfirange: string, contents: Contents): void;
    /**
     * Emit a markClicked event with the cfiRange and data from a mark
     * @private
     * @param  {EpubCFI} cfirange
     */
    triggerMarkEvent(cfiRange: EpubCFI | string, data: object, contents: Contents): void;
    /**
     * Hook to adjust images to fit in columns
     */
    private adjustImages;
    /**
     * Hook to handle link clicks in rendered content
     */
    private handleLinks;
    views(): import("./managers/helpers/views").default | View[];
    /**
     * Hook to handle injecting stylesheet before
     * a Section is serialized
     */
    private injectStylesheet;
    /**
     * Hook to handle injecting scripts before
     * a Section is serialized
     */
    private injectScript;
    /**
     * Hook to handle the document identifier before
     * a Section is serialized
     */
    private injectIdentifier;
}
export default Rendition;
