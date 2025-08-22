"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rendition = void 0;
const event_emitter_1 = __importDefault(require("event-emitter"));
const core_1 = require("./utils/core");
const hook_1 = __importDefault(require("./utils/hook"));
const epubcfi_1 = __importDefault(require("./epubcfi"));
const queue_1 = __importDefault(require("./utils/queue"));
const layout_1 = __importDefault(require("./layout"));
const themes_1 = __importDefault(require("./themes"));
const annotations_1 = __importDefault(require("./annotations"));
const constants_1 = require("./utils/constants");
const default_1 = __importDefault(require("./managers/default"));
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
class Rendition {
    constructor(book, options) {
        this.location = null;
        this.book = book;
        this.q = new queue_1.default(this);
        this.settings = {
            width: undefined,
            height: undefined,
            ignoreClass: '',
            view: 'iframe', // or use a proper View instance if available
            flow: undefined,
            layout: undefined,
            spread: undefined,
            minSpreadWidth: 400,
            stylesheet: undefined,
            resizeOnOrientationChange: true,
            script: undefined,
            snap: false,
            defaultDirection: 'ltr',
            allowScriptedContent: false,
            allowPopups: false,
            ...options,
        };
        if (typeof this.settings.manager === 'object') {
            console.log('[Rendition] using existing manager:', this.settings.manager);
            this.manager = this.settings.manager;
        }
        else {
            console.log('[Rendition] creating new manager');
            console.log('[Rendition] creating new layout, settings:', this.settings);
            const layoutInstance = new layout_1.default({
                layout: this.settings.layout || 'reflowable',
                spread: this.settings.spread || 'auto',
                minSpreadWidth: typeof this.settings.minSpreadWidth === 'number'
                    ? this.settings.minSpreadWidth
                    : 400,
                direction: this.settings.direction || 'ltr',
                flow: this.settings.flow || 'auto',
            });
            // Ensure width and height are numbers or undefined
            const width = typeof this.settings.width === 'number'
                ? this.settings.width
                : undefined;
            const height = typeof this.settings.height === 'number'
                ? this.settings.height
                : undefined;
            this.manager = new default_1.default({
                view: this.settings.view,
                queue: this.q,
                request: this.book.load.bind(this.book),
                settings: {
                    ...this.settings,
                    layout: layoutInstance,
                    width,
                    height,
                    afterScrolledTimeout: 10,
                },
            });
        }
        this.manager.on(constants_1.EVENTS.MANAGERS.ADDED, (...args) => {
            const view = args[0];
            console.log('[Rendition] manager on added called with args:', args);
            console.log('[Rendition] manager on afterDisplayed called with view:', view);
            this.afterDisplayed(view);
        });
        this.manager.on(constants_1.EVENTS.MANAGERS.REMOVED, (...args) => {
            const view = args[0];
            this.afterRemoved(view);
        });
        this.manager.on(constants_1.EVENTS.MANAGERS.RESIZED, (...args) => {
            const size = args[0];
            const epubcfi = args[1];
            this.onResized(size, epubcfi);
        });
        this.manager.on(constants_1.EVENTS.MANAGERS.ORIENTATION_CHANGE, (...args) => {
            const orientation = args[0];
            this.onOrientationChange(orientation);
        });
        this.hooks = {
            display: new hook_1.default(this),
            serialize: new hook_1.default(this),
            content: new hook_1.default(this),
            unloaded: new hook_1.default(this),
            layout: new hook_1.default(this),
            render: new hook_1.default(this),
            show: new hook_1.default(this),
        };
        this.hooks.content.register(this.handleLinks.bind(this));
        this.hooks.content.register(this.passEvents.bind(this));
        this.hooks.content.register(this.adjustImages.bind(this));
        if (this.book.spine === undefined) {
            throw new Error('Book spine is not defined');
        }
        this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));
        if (this.settings.stylesheet) {
            this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
        }
        if (this.settings.script) {
            this.book.spine.hooks.content.register(this.injectScript.bind(this));
        }
        /**
         * @member {Themes} themes
         * @memberof Rendition
         */
        this.themes = new themes_1.default(this);
        /**
         * @member {Annotations} annotations
         * @memberof Rendition
         */
        this.annotations = new annotations_1.default(this);
        this.epubcfi = new epubcfi_1.default();
        /**
         * A Rendered Location Range
         * @typedef location
         * @type {Object}
         * @property {object} start
         * @property {string} start.index
         * @property {string} start.href
         * @property {object} start.displayed
         * @property {EpubCFI} start.cfi
         * @property {number} start.location
         * @property {number} start.percentage
         * @property {number} start.displayed.page
         * @property {number} start.displayed.total
         * @property {object} end
         * @property {string} end.index
         * @property {string} end.href
         * @property {object} end.displayed
         * @property {EpubCFI} end.cfi
         * @property {number} end.location
         * @property {number} end.percentage
         * @property {number} end.displayed.page
         * @property {number} end.displayed.total
         * @property {boolean} atStart
         * @property {boolean} atEnd
         * @memberof Rendition
         */
        this.location = null;
        // Hold queue until book is opened
        this.q.enqueue(this.book.opened);
        this.starting = new core_1.defer();
        /**
         * @member {promise} started returns after the rendition has started
         * @memberof Rendition
         */
        this.started = this.starting.promise;
        // Block the queue until rendering is started
        this.q.enqueue(this.start);
    }
    /**
     * Set the manager function
     */
    setManager(manager) {
        this.manager = manager;
    }
    /**
     * Start the rendering
     */
    async start() {
        if (!this.book.packaging || !this.book.packaging.metadata) {
            console.error('[Rendition] start failed: book.packaging or metadata is undefined');
            console.error(JSON.stringify(this.book.ready));
            return;
        }
        if (!this.settings.layout &&
            (this.book.packaging.metadata.layout === 'pre-paginated' ||
                this.book.displayOptions.fixedLayout === 'true')) {
            this.settings.layout = 'pre-paginated';
        }
        switch (this.book.packaging.metadata.spread) {
            case 'none':
                this.settings.spread = 'none';
                break;
            case 'both':
                this.settings.spread = 'auto';
                break;
        }
        if (!this.manager) {
            this.ViewManager = this.settings.manager;
            this.View = this.settings.view;
            if (typeof this.ViewManager === 'function') {
                this.manager = new this.ViewManager({
                    view: this.View,
                    queue: this.q,
                    request: this.book.load.bind(this.book),
                    settings: this.settings,
                });
            }
        }
        this.direction((this.book.packaging.metadata.direction ||
            this.settings.defaultDirection));
        // Parse metadata to get layout props
        this.settings.globalLayoutProperties = this.determineLayoutProperties(this.book.packaging.metadata);
        this.flow(this.settings.globalLayoutProperties.flow);
        this.layout(this.settings.globalLayoutProperties);
        // Listen for displayed views
        this.manager.on(constants_1.EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
        this.manager.on(constants_1.EVENTS.MANAGERS.REMOVED, this.afterRemoved.bind(this));
        // Listen for resizing
        this.manager.on(constants_1.EVENTS.MANAGERS.RESIZED, this.onResized.bind(this));
        // Listen for rotation
        this.manager.on(constants_1.EVENTS.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));
        // Listen for scroll changes
        this.manager.on(constants_1.EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));
        /**
         * Emit that rendering has started
         * @event started
         * @memberof Rendition
         */
        this.emit(constants_1.EVENTS.RENDITION.STARTED);
        // Start processing queue
        this.starting.resolve();
    }
    /**
     * Call to attach the container to an element in the dom
     * Container must be attached before rendering can begin
     * @return {Promise}
     */
    attachTo(element) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return this.q.enqueue(() => {
            // Start rendering with the request function
            if (typeof element === 'string') {
                console.log('[Rendition] received a string as element:', element);
            }
            this.manager.render(element);
            /**
             * Emit that rendering has attached to an element
             * @event attached
             * @memberof Rendition
             */
            this.emit(constants_1.EVENTS.RENDITION.ATTACHED);
        });
    }
    /**
     * Display a point in the book
     * The request will be added to the rendering Queue,
     * so it will wait until book is opened, rendering started
     * and all other rendering tasks have finished to be called.
     * @param  {string} target Url or EpubCFI
     * @return {Promise}
     */
    display(target) {
        console.log('[Rendition] display called with target:', target);
        if (this.displaying) {
            this.displaying.resolve(true);
        }
        return this.q.enqueue(this._display, target);
    }
    /**
     * Tells the manager what to display immediately
     *
     * @param  {string} target Url or EpubCFI
     * @return {Promise}
     */
    _display(target) {
        console.log('[Rendition] _display called with target:', target);
        if (!this.book) {
            console.error('[Rendition] display called without a book');
            return Promise.resolve(false);
        }
        const displaying = new core_1.defer();
        const displayed = displaying.promise;
        this.displaying = displaying;
        // Check if this is a book percentage
        if (this.book.locations &&
            this.book.locations.length() &&
            (0, core_1.isFloat)(target)) {
            target = this.book.locations.cfiFromPercentage(parseFloat(target));
        }
        if (!this.book.spine) {
            console.error('[Rendition] display called without a book spine');
            return Promise.resolve(false);
        }
        const section = this.book.spine.get(target);
        console.log('[Rendition] display called with section from book spine:', section);
        if (!section) {
            displaying.reject(new Error('No Section Found'));
            return displayed;
        }
        this.manager.display(section).then(() => {
            displaying.resolve(true);
            this.displaying = undefined;
            /**
             * Emit that a section has been displayed
             * @event displayed
             * @param {Section} section
             * @memberof Rendition
             */
            this.emit(constants_1.EVENTS.RENDITION.DISPLAYED, section);
            this.reportLocation();
        }, (err) => {
            /**
             * Emit that has been an error displaying
             * @event displayError
             * @param {Section} section
             * @memberof Rendition
             */
            this.emit(constants_1.EVENTS.RENDITION.DISPLAY_ERROR, err);
        });
        return displayed;
    }
    getContents() {
        return this.manager.getContents();
    }
    /**
     * Report what section has been displayed
     */
    afterDisplayed(view) {
        console.log('[Rendition] afterDisplayed called with view:', view);
        view.on(constants_1.EVENTS.VIEWS.MARK_CLICKED, (cfiRange, data) => this.triggerMarkEvent(cfiRange, data, view.contents));
        this.hooks.render.trigger(view, this).then(() => {
            if (view.contents) {
                this.hooks.content.trigger(view.contents, this).then(() => {
                    /**
                     * Emit that a section has been rendered
                     * @event rendered
                     * @param {Section} section
                     * @param {View} view
                     * @memberof Rendition
                     */
                    this.emit(constants_1.EVENTS.RENDITION.RENDERED, view.section, view);
                });
            }
            else {
                this.emit(constants_1.EVENTS.RENDITION.RENDERED, view.section, view);
            }
        });
    }
    /**
     * Report what has been removed
     */
    afterRemoved(view) {
        this.hooks.unloaded.trigger(view, this).then(() => {
            /**
             * Emit that a section has been removed
             * @event removed
             * @param {Section} section
             * @param {View} view
             * @memberof Rendition
             */
            this.emit(constants_1.EVENTS.RENDITION.REMOVED, view.section, view);
        });
    }
    /**
     * Report resize events and display the last seen location
     */
    onResized(size, epubcfi) {
        /**
         * Emit that the rendition has been resized
         * @event resized
         * @param {number} width
         * @param {height} height
         * @param {string} epubcfi (optional)
         * @memberof Rendition
         */
        this.emit(constants_1.EVENTS.RENDITION.RESIZED, {
            width: size.width,
            height: size.height,
        }, epubcfi);
        if (this.location && this.location.start) {
            this.display(epubcfi || this.location.start.cfi);
        }
    }
    /**
     * Report orientation events and display the last seen location
     * @private
     */
    onOrientationChange(orientation) {
        /**
         * Emit that the rendition has been rotated
         * @event orientationchange
         * @param {string} orientation
         * @memberof Rendition
         */
        this.emit(constants_1.EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
    }
    /**
     * Trigger a resize of the views
     * @param {number} [width]
     * @param {number} [height]
     * @param {string} [epubcfi] (optional)
     */
    resize(width, height, epubcfi) {
        if (width) {
            this.settings.width = width;
        }
        if (height) {
            this.settings.height = height;
        }
        this.manager.resize(String(width), String(height), epubcfi);
    }
    /**
     * Clear all rendered views
     */
    clear() {
        this.manager.clear();
    }
    /**
     * Go to the next "page" in the rendition
     */
    next() {
        return this.q
            .enqueue(this.manager.next.bind(this.manager))
            .then(this.reportLocation.bind(this));
    }
    /**
     * Go to the previous "page" in the rendition
     */
    prev() {
        return this.q
            .enqueue(this.manager.prev.bind(this.manager))
            .then(this.reportLocation.bind(this));
    }
    //-- http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
    /**
     * Determine the Layout properties from metadata and settings
     */
    determineLayoutProperties(metadata) {
        const layout = this.settings.layout || metadata.layout || 'reflowable';
        const spread = this.settings.spread || metadata.spread || 'auto';
        const orientation = this.settings.orientation || metadata.orientation || 'auto';
        const flow = this.settings.flow || metadata.flow || 'auto';
        const viewport = metadata.viewport || '';
        const minSpreadWidth = this.settings.minSpreadWidth || metadata.minSpreadWidth || 800;
        const direction = this.settings.direction || metadata.direction || 'ltr';
        return {
            layout: layout,
            spread: spread,
            orientation: orientation,
            flow: flow,
            viewport: viewport,
            minSpreadWidth: minSpreadWidth,
            direction: direction,
        };
    }
    /**
     * Adjust the flow of the rendition to paginated or scrolled
     * (scrolled-continuous vs scrolled-doc are handled by different view managers)
     */
    flow(flow) {
        let _flow = flow;
        if (flow === 'scrolled' ||
            flow === 'scrolled-doc' ||
            flow === 'scrolled-continuous') {
            _flow = 'scrolled';
        }
        if (flow === 'auto' || flow === 'paginated') {
            _flow = 'paginated';
        }
        this.settings.flow = flow;
        if (this._layout) {
            this._layout.flow(_flow);
        }
        if (this.manager && this._layout) {
            this.manager.applyLayout(this._layout);
        }
        if (this.manager) {
            this.manager.updateFlow(_flow);
        }
        if (this.manager && this.manager.isRendered() && this.location) {
            this.manager.clear();
            this.display(this.location.start.cfi);
        }
    }
    /**
     * Adjust the layout of the rendition to reflowable or pre-paginated
     * @param  {object} settings
     */
    layout(settings) {
        if (settings) {
            this._layout = new layout_1.default(settings);
            this._layout.spread(settings.spread, this.settings.minSpreadWidth);
            // this.mapping = new Mapping(this._layout.props);
            this._layout.on(constants_1.EVENTS.LAYOUT.UPDATED, (props, changed) => {
                this.emit(constants_1.EVENTS.RENDITION.LAYOUT, props, changed);
            });
        }
        if (this.manager && this._layout) {
            this.manager.applyLayout(this._layout);
        }
        return this._layout;
    }
    /**
     * Adjust if the rendition uses spreads
     * @param  {int} [min] min width to use spreads at
     */
    spread(spread, min) {
        console.log('[Rendition] spread called with:', spread, min);
        this.settings.spread = spread;
        if (min) {
            this.settings.minSpreadWidth = min;
        }
        if (this._layout) {
            this._layout.spread(spread, min);
        }
        if (this.manager && this.manager.isRendered()) {
            this.manager.updateLayout();
        }
    }
    /**
     * Adjust the direction of the rendition
     */
    direction(dir) {
        this.settings.direction = dir || 'ltr';
        if (this.manager) {
            this.manager.direction(this.settings.direction);
        }
        if (this.manager && this.manager.isRendered() && this.location) {
            this.manager.clear();
            this.display(this.location.start.cfi);
        }
    }
    /**
     * Report the current location
     * @fires relocated
     * @fires locationChanged
     */
    reportLocation() {
        return this.q.enqueue(() => {
            requestAnimationFrame(() => {
                const pageLocations = this.manager.currentLocation();
                if (pageLocations &&
                    Array.isArray(pageLocations) &&
                    pageLocations.length > 0) {
                    // Map PageLocation[] to LocationPoint[]
                    const locationPoints = pageLocations.map((pl) => ({
                        index: pl.index,
                        href: pl.href,
                        cfi: pl.mapping?.start ?? '',
                        displayed: {
                            page: pl.pages[0] || 1,
                            total: pl.totalPages ?? 0,
                        },
                        pages: pl.pages,
                        totalPages: pl.totalPages,
                        mapping: pl.mapping,
                    }));
                    const located = this.located(locationPoints);
                    if (!located) {
                        return;
                    }
                    this.location = located;
                    /**
                     * @event relocated
                     * @type {displayedLocation}
                     * @memberof Rendition
                     */
                    this.emit(constants_1.EVENTS.RENDITION.RELOCATED, this.location);
                }
            });
        });
    }
    /**
     * Get the Current Location object
     */
    currentLocation() {
        return this.manager.currentLocation();
    }
    /**
     * Creates a Rendition#locationRange from location
     * passed by the Manager
     * @returns {displayedLocation}
     */
    located(location) {
        if (!location.length) {
            return null;
        }
        const start = location[0];
        const end = location[location.length - 1];
        const located = {
            start: {
                index: start.index,
                href: start.href,
                cfi: start.mapping?.start ?? '',
                displayed: {
                    page: start.pages?.[0] ?? 1,
                    total: start.totalPages ?? 0,
                },
            },
            end: {
                index: end.index,
                href: end.href,
                cfi: end.mapping?.end ?? '',
                displayed: {
                    page: end.pages?.[end.pages?.length - 1] ?? 1,
                    total: end.totalPages ?? 0,
                },
            },
        };
        const locationStart = start.mapping?.start
            ? this.book.locations.locationFromCfi(start.mapping.start)
            : null;
        const locationEnd = end.mapping?.end
            ? this.book.locations.locationFromCfi(end.mapping.end)
            : null;
        if (locationStart !== null) {
            located.start.location = locationStart;
            located.start.percentage =
                this.book.locations.percentageFromLocation(locationStart);
        }
        if (locationEnd !== null) {
            located.end.location = locationEnd;
            located.end.percentage =
                this.book.locations.percentageFromLocation(locationEnd);
        }
        const pageStart = start.mapping?.start
            ? this.book.pageList.pageFromCfi(start.mapping.start)
            : -1;
        const pageEnd = end.mapping?.end
            ? this.book.pageList.pageFromCfi(end.mapping.end)
            : -1;
        if (pageStart !== -1) {
            located.start.page = pageStart;
        }
        if (pageEnd !== -1) {
            located.end.page = pageEnd;
        }
        if (end.index === this.book.spine.last()?.index &&
            located.end.displayed.page >= located.end.displayed.total) {
            located.atEnd = true;
        }
        if (start.index === this.book.spine.first()?.index &&
            located.start.displayed.page === 1) {
            located.atStart = true;
        }
        return located;
    }
    /**
     * Remove and Clean Up the Rendition
     */
    destroy() {
        // @todo Clear the queue
        this.manager?.destroy();
        // @ts-expect-error this is only at destroy time
        this.book = undefined;
    }
    /**
     * Pass the events from a view's Contents
     */
    passEvents(contents) {
        constants_1.DOM_EVENTS.forEach((e) => {
            contents.on(e, (ev) => this.triggerViewEvent(ev, contents));
        });
        contents.on(constants_1.EVENTS.CONTENTS.SELECTED, (e) => {
            this.triggerSelectedEvent(e, contents);
        });
    }
    /**
     * Emit events passed by a view
     */
    triggerViewEvent(e, contents) {
        this.emit(e.type, e, contents);
    }
    /**
     * Emit a selection event's CFI Range passed from a a view
     * @private
     * @param  {string} cfirange
     */
    triggerSelectedEvent(cfirange, contents) {
        /**
         * Emit that a text selection has occurred
         * @event selected
         * @param {string} cfirange
         * @param {Contents} contents
         * @memberof Rendition
         */
        this.emit(constants_1.EVENTS.RENDITION.SELECTED, cfirange, contents);
    }
    /**
     * Emit a markClicked event with the cfiRange and data from a mark
     * @private
     * @param  {EpubCFI} cfirange
     */
    triggerMarkEvent(cfiRange, data, contents) {
        /**
         * Emit that a mark was clicked
         * @event markClicked
         * @param {EpubCFI} cfirange
         * @param {object} data
         * @param {Contents} contents
         * @memberof Rendition
         */
        this.emit(constants_1.EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
    }
    /**
     * Hook to adjust images to fit in columns
     */
    adjustImages(contents) {
        if (this._layout === undefined) {
            throw new Error('Layout is not defined');
        }
        if (this._layout.name === 'pre-paginated') {
            return new Promise(function (resolve) {
                resolve();
            });
        }
        if (contents.window === null) {
            return;
        }
        const computed = contents.window.getComputedStyle(contents.content, null);
        const height = (contents.content.offsetHeight -
            (parseFloat(computed.paddingTop) +
                parseFloat(computed.paddingBottom))) *
            0.95;
        const horizontalPadding = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
        contents.addStylesheetRules({
            img: {
                'max-width': (this._layout.columnWidth
                    ? this._layout.columnWidth - horizontalPadding + 'px'
                    : '100%') + '!important',
                'max-height': height + 'px' + '!important',
                'object-fit': 'contain',
                'page-break-inside': 'avoid',
                'break-inside': 'avoid',
                'box-sizing': 'border-box',
            },
            svg: {
                'max-width': (this._layout.columnWidth
                    ? this._layout.columnWidth - horizontalPadding + 'px'
                    : '100%') + '!important',
                'max-height': height + 'px' + '!important',
                'page-break-inside': 'avoid',
                'break-inside': 'avoid',
            },
        }, 'rendition-adjust-images');
        return new Promise(function (resolve) {
            // Wait to apply
            setTimeout(function () {
                resolve();
            }, 1);
        });
    }
    /**
     * Hook to handle link clicks in rendered content
     */
    handleLinks(contents) {
        if (contents) {
            contents.on(constants_1.EVENTS.CONTENTS.LINK_CLICKED, (href) => {
                const relative = this.book.path.relative(href);
                this.display(relative);
            });
        }
    }
    views() {
        const views = this.manager ? this.manager.views : undefined;
        return views || [];
    }
    /**
     * Hook to handle injecting stylesheet before
     * a Section is serialized
     */
    injectStylesheet(doc) {
        const style = doc.createElement('link');
        style.setAttribute('type', 'text/css');
        style.setAttribute('rel', 'stylesheet');
        if (this.settings.stylesheet) {
            style.setAttribute('href', this.settings.stylesheet);
        }
        doc.getElementsByTagName('head')[0].appendChild(style);
    }
    /**
     * Hook to handle injecting scripts before
     * a Section is serialized
     */
    injectScript(doc) {
        const script = doc.createElement('script');
        script.setAttribute('type', 'text/javascript');
        if (this.settings.script) {
            script.setAttribute('src', this.settings.script);
        }
        script.textContent = ' '; // Needed to prevent self closing tag
        doc.getElementsByTagName('head')[0].appendChild(script);
    }
    /**
     * Hook to handle the document identifier before
     * a Section is serialized
     */
    injectIdentifier(doc) {
        const ident = this.book.packaging.metadata.identifier;
        const meta = doc.createElement('meta');
        meta.setAttribute('name', 'dc.relation.ispartof');
        if (ident) {
            meta.setAttribute('content', ident);
        }
        doc.getElementsByTagName('head')[0].appendChild(meta);
    }
}
exports.Rendition = Rendition;
//-- Enable binding events to Renderer
(0, event_emitter_1.default)(Rendition.prototype);
exports.default = Rendition;
