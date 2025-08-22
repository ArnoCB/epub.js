"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = __importDefault(require("event-emitter"));
const core_1 = require("../../utils/core");
const epubcfi_1 = __importDefault(require("../../epubcfi"));
const contents_1 = __importDefault(require("../../contents"));
const constants_1 = require("../../utils/constants");
class InlineView {
    constructor(section, options) {
        this.added = false;
        this.displayed = false;
        this.rendered = false;
        this.fixedWidth = 0;
        this.fixedHeight = 0;
        this.epubcfi = new epubcfi_1.default();
        this._width = 0;
        this._height = 0;
        this.lockedWidth = 0;
        this.lockedHeight = 0;
        this.stopExpanding = false;
        this.resizing = false;
        this._expanding = false;
        this.rendering = false;
        this._needsReframe = false;
        this.settings = (0, core_1.extend)({
            ignoreClass: '',
            axis: 'vertical',
            width: 0,
            height: 0,
            layout: { format: () => { } },
            globalLayoutProperties: {},
            quest: undefined,
        }, options || {});
        this.id = 'epubjs-view:' + (0, core_1.uuid)();
        this.section = section;
        this.index = section.index;
        this.element = this.container(this.settings.axis);
        this._width = this.settings.width;
        this._height = this.settings.height;
        this.layout = this.settings.layout;
        // Dom events to listen for
        // this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];
    }
    container(axis) {
        const element = document.createElement('div');
        element.classList.add('epub-view');
        // if(this.settings.axis === "horizontal") {
        //   element.style.width = "auto";
        //   element.style.height = "0";
        // } else {
        //   element.style.width = "0";
        //   element.style.height = "auto";
        // }
        element.style.overflow = 'hidden';
        if (axis && axis == 'horizontal') {
            element.style.display = 'inline-block';
        }
        else {
            element.style.display = 'block';
        }
        return element;
    }
    width() {
        return this._width;
    }
    height() {
        return this._height;
    }
    highlight(cfiRange, data, cb, className, styles) {
        console.log('[Inline]: highlight', {
            cfiRange,
            data,
            cb,
            className,
            styles,
        });
        return undefined;
    }
    underline(cfiRange, data = {}, cb, className, styles) {
        console.log('[Inline]: underline', {
            cfiRange,
            data,
            cb,
            className,
            styles,
        });
        return undefined;
    }
    mark(cfiRange, data = {}, cb) {
        console.log('[Inline]: mark', { cfiRange, data, cb });
        return null;
    }
    unhighlight(cfiRange) {
        console.log('[Inline]: unhighlight not implemented', cfiRange);
    }
    ununderline(cfiRange) {
        console.log('[Inline]: ununderline not implemented', cfiRange);
    }
    unmark(cfiRange) {
        console.log('[Inline]: unmark not implemented', cfiRange);
    }
    create() {
        if (this.frame) {
            return this.frame;
        }
        if (!this.element) {
            this.element = this.createContainer();
        }
        this.frame = document.createElement('div');
        this.frame.id = this.id;
        this.frame.style.overflow = 'hidden';
        this.frame.style.wordSpacing = 'initial';
        this.frame.style.lineHeight = 'initial';
        this.resizing = true;
        // this.frame.style.display = "none";
        this.element.style.visibility = 'hidden';
        this.frame.style.visibility = 'hidden';
        if (this.settings.axis === 'horizontal') {
            this.frame.style.width = 'auto';
            this.frame.style.height = '0';
        }
        else {
            this.frame.style.width = '0';
            this.frame.style.height = 'auto';
        }
        this._width = 0;
        this._height = 0;
        this.element.appendChild(this.frame);
        this.added = true;
        this.elementBounds = (0, core_1.bounds)(this.element);
        return this.frame;
    }
    render(request, show = true) {
        // view.onLayout = this.layout.format.bind(this.layout);
        this.create();
        // Fit to size of the container, apply padding
        this.size();
        // Render Chain
        return this.section
            .render(request)
            .then((value) => {
            const contents = value;
            return this.load(contents);
        })
            .then(() => {
            // this.settings.layout.format(view.contents);
            // return this.hooks.layout.trigger(view, this);
        })
            .then(() => {
            // apply the layout function to the contents
            if (this.contents === undefined) {
                throw new Error('Contents not loaded');
            }
            this.settings.layout.format(this.contents);
            // Expand the iframe to the full size of the content
            // this.expand();
            // Listen for events that require an expansion of the iframe
            this.addListeners();
            if (show) {
                this.show();
            }
            this.emit(constants_1.EVENTS.VIEWS.RENDERED, this.section);
        })
            .catch((e) => {
            this.emit(constants_1.EVENTS.VIEWS.LOAD_ERROR, e);
        });
    }
    // Determine locks base on settings
    size(_width, _height) {
        const width = _width || this.settings.width;
        const height = _height || this.settings.height;
        if (this.layout.name === 'pre-paginated') {
            // TODO: check if these are different than the size set in chapter
            this.lock('both', width, height);
        }
        else if (this.settings.axis === 'horizontal') {
            this.lock('height', width, height);
        }
        else {
            this.lock('width', width, height);
        }
    }
    // Lock an axis to element dimensions, taking borders into account
    lock(what, width, height) {
        const elBorders = (0, core_1.borders)(this.element);
        let iframeBorders;
        if (this.frame) {
            iframeBorders = (0, core_1.borders)(this.frame);
        }
        else {
            iframeBorders = { width: 0, height: 0 };
        }
        if (what == 'width' && (0, core_1.isNumber)(width)) {
            this.lockedWidth = width - elBorders.width - iframeBorders.width;
            this.resize(this.lockedWidth, false); //  width keeps ratio correct
        }
        if (what == 'height' && (0, core_1.isNumber)(height)) {
            this.lockedHeight = height - elBorders.height - iframeBorders.height;
            this.resize(false, this.lockedHeight);
        }
        if (what === 'both' && (0, core_1.isNumber)(width) && (0, core_1.isNumber)(height)) {
            this.lockedWidth = width - elBorders.width - iframeBorders.width;
            this.lockedHeight = height - elBorders.height - iframeBorders.height;
            this.resize(this.lockedWidth, this.lockedHeight);
        }
    }
    // Resize a single axis based on content dimensions
    expand() {
        let width = this._width;
        let height = this._height;
        if (!this.frame || this._expanding)
            return;
        this._expanding = true;
        // Expand Horizontally
        if (this.settings.axis === 'horizontal') {
            width = this.contentWidth();
            // keep height
        } // Expand Vertically
        else if (this.settings.axis === 'vertical') {
            height = this.contentHeight();
            // keep width
        }
        // Only Resize if dimensions have changed or
        // if Frame is still hidden, so needs reframing
        if (this._needsReframe || width != this._width || height != this._height) {
            this.resize(width, height);
        }
        this._expanding = false;
    }
    contentWidth() {
        return this.frame?.scrollWidth || 0;
    }
    contentHeight() {
        return this.frame?.scrollHeight || 0;
    }
    resize(width, height) {
        if (!this.frame)
            return;
        if ((0, core_1.isNumber)(width)) {
            this.frame.style.width = width + 'px';
            this._width = width;
        }
        if ((0, core_1.isNumber)(height)) {
            this.frame.style.height = height + 'px';
            this._height = height;
        }
        this.prevBounds = this.elementBounds;
        this.elementBounds = (0, core_1.bounds)(this.element);
        const size = {
            width: this.elementBounds.width,
            height: this.elementBounds.height,
            widthDelta: this.elementBounds.width - this.prevBounds.width,
            heightDelta: this.elementBounds.height - this.prevBounds.height,
        };
        this.onResize(this, size);
        this.emit(constants_1.EVENTS.VIEWS.RESIZED, size);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(content) {
        const loading = new core_1.defer();
        const loaded = loading.promise;
        // Normalize to a Document by parsing strings or extracting from Contents
        let doc;
        if (typeof content === 'string') {
            doc = (0, core_1.parse)(content, 'text/html');
        }
        else {
            // content is a Contents instance
            doc = (0, core_1.parse)(content.content.innerHTML, 'text/html');
        }
        const body = doc.querySelector('body');
        if (body === null) {
            loading.reject(new Error('Failed to load contents'));
            return loaded;
        }
        /*
            var srcs = doc.querySelectorAll("[src]");
    
            Array.prototype.slice.call(srcs)
                .forEach(function(item) {
                    var src = item.getAttribute("src");
                    var assetUri = URI(src);
                    var origin = assetUri.origin();
                    var absoluteUri;
    
                    if (!origin) {
                        absoluteUri = assetUri.absoluteTo(this.section.url);
                        item.src = absoluteUri;
                    }
                }.bind(this));
            */
        this.frame.innerHTML = body.innerHTML;
        this.document = this.frame.ownerDocument;
        this.window = this.document.defaultView;
        if (this.frame === undefined) {
            throw new Error('frame not loaded');
        }
        this.contents = new contents_1.default(this.document, this.frame);
        this.rendering = false;
        loading.resolve(this.contents);
        return loaded;
    }
    // Minimal stub to satisfy the View interface
    reset() {
        // no-op: implemented in other view types
    }
    // Set the axis for the view (horizontal / vertical)
    setAxis(axis) {
        // accept string but coerce to expected axis
        this.settings.axis = axis;
        // recreate container with new axis if needed
        this.element = this.container(this.settings.axis);
    }
    // Called when content finishes loading; matches ambient signature
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLoad(_event, _promise) {
        // stub: override in concrete implementations
        void _event;
        void _promise;
    }
    /**
     * Stub for createContainer to resolve TypeScript errors.
     * Returns a new div element.
     */
    createContainer() {
        return document.createElement('div');
    }
    setLayout(layout) {
        this.layout = layout;
    }
    resizeListenters() {
        // Test size again
        // clearTimeout(this.expanding);
        // this.expanding = setTimeout(this.expand.bind(this), 350);
    }
    addListeners() {
        //TODO: Add content listeners for expanding
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListeners(_layoutFunc) {
        //TODO: remove content listeners for expanding
    }
    display(request) {
        const displayed = new core_1.defer();
        if (!this.displayed) {
            this.render(request).then(() => {
                this.emit(constants_1.EVENTS.VIEWS.DISPLAYED, this);
                this.onDisplayed();
                this.displayed = true;
                displayed.resolve(this);
            });
        }
        else {
            displayed.resolve(this);
        }
        return displayed.promise;
    }
    show() {
        this.element.style.visibility = 'visible';
        if (this.frame) {
            this.frame.style.visibility = 'visible';
        }
        this.emit(constants_1.EVENTS.VIEWS.SHOWN, this);
    }
    hide() {
        // this.frame.style.display = "none";
        this.element.style.visibility = 'hidden';
        this.frame.style.visibility = 'hidden';
        this.stopExpanding = true;
        this.emit(constants_1.EVENTS.VIEWS.HIDDEN, this);
    }
    position() {
        return this.element.getBoundingClientRect();
    }
    locationOf(target) {
        const parentPos = this.frame.getBoundingClientRect();
        if (this.contents === undefined) {
            throw new Error('Contents not loaded');
        }
        const targetPos = this.contents.locationOf(target, this.settings.ignoreClass);
        return {
            left: window.scrollX + parentPos.left + targetPos.left,
            top: window.scrollY + parentPos.top + targetPos.top,
        };
    }
    /**
     * Called when a view is displayed.
     * Override this method to add custom behavior.
     * @param {InlineView} view - The view that was displayed.
     * @suppress {eslint}
     */
    onDisplayed(view) {
        console.log('[InlineView] onDisplayed called', view);
        // Stub, override with a custom functions
    }
    /**
     * Called when a view is resized.
     * Override this method to add custom behavior.
     * @param {InlineView} view - The view being resized.
     * @param {Event} e - The resize event.
     * @suppress {eslint}
     */
    onResize(view, size) {
        // Stub: override with a custom function
        void view;
        void size; // Suppress eslint no-unused-vars
    }
    bounds() {
        if (!this.elementBounds) {
            this.elementBounds = (0, core_1.bounds)(this.element);
        }
        return this.elementBounds;
    }
    offset() {
        return {
            top: this.element.offsetTop,
            left: this.element.offsetLeft,
        };
    }
    destroy() {
        if (this.displayed) {
            this.displayed = false;
            this.removeListeners();
            this.stopExpanding = true;
            this.element.removeChild(this.frame);
            this.displayed = false;
            this.frame = undefined;
        }
    }
}
(0, event_emitter_1.default)(InlineView.prototype);
exports.default = InlineView;
