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
const marks_pane_1 = require("marks-pane");
// Subclass Pane to inject custom SVG styling
class StyledPane extends marks_pane_1.Pane {
    constructor(target, container, transparency) {
        super(target, container);
        // @ts-expect-error We should add a public method to get the method in Pane
        const svgElement = this.element;
        // Add custom styling to the SVG element only if transparency is true
        if (transparency) {
            svgElement.style.zIndex = '-3';
            svgElement.style.position = 'absolute';
        }
        // You can add more styles if needed
        svgElement.style.zIndex = '-3';
        svgElement.style.position = 'absolute';
    }
}
class IframeView {
    constructor(section, options = {}) {
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
        this.highlights = {};
        this.underlines = {};
        this.marks = {};
        this._needsReframe = false;
        this.rendering = false;
        this.settings = (0, core_1.extend)({
            ignoreClass: '',
            axis: undefined, //options.layout && options.layout.props.flow === "scrolled" ? "vertical" : "horizontal",
            direction: undefined,
            width: 0,
            height: 0,
            layout: undefined,
            globalLayoutProperties: {},
            method: undefined,
            forceRight: false,
            allowScriptedContent: false,
            allowPopups: false,
            transparency: false, // New option for transparent background
        }, options || {});
        this.id = 'epubjs-view-' + (0, core_1.uuid)();
        this.section = section;
        this.index = section.index;
        if (this.settings.axis === undefined) {
            throw new Error('Axis is not defined');
        }
        this.element = this.container(this.settings.axis);
        this.added = false;
        this.displayed = false;
        this.rendered = false;
        this.fixedWidth = 0;
        this.fixedHeight = 0;
        // Blank Cfi for Parsing
        this.epubcfi = new epubcfi_1.default();
        this.layout = this.settings.layout;
        // Dom events to listen for
        // this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];
        this.pane = undefined;
        this.highlights = {};
        this.underlines = {};
        this.marks = {};
    }
    container(axis) {
        const element = document.createElement('div');
        element.classList.add('epub-view');
        // this.element.style.minHeight = "100px";
        element.style.height = '0px';
        element.style.width = '0px';
        element.style.overflow = 'hidden';
        element.style.position = 'relative';
        element.style.display = 'block';
        if (axis && axis == 'horizontal') {
            element.style.flex = 'none';
        }
        else {
            element.style.flex = 'initial';
        }
        return element;
    }
    create() {
        if (this.iframe) {
            return this.iframe;
        }
        if (!this.element) {
            this.element = this.createContainer();
        }
        this.iframe = document.createElement('iframe');
        this.iframe.id = this.id;
        this.iframe.scrolling = 'no'; // Might need to be removed: breaks ios width calculations
        this.iframe.style.overflow = 'hidden';
        this.iframe.seamless = 'seamless';
        this.iframe.style.border = 'none';
        // Set transparent background if option is enabled
        if (this.settings.transparency) {
            this.iframe.style.background = 'transparent';
            this.iframe.allowTransparency = 'true';
        }
        // sandbox
        this.iframe.sandbox = 'allow-same-origin';
        if (this.settings.allowScriptedContent) {
            this.iframe.sandbox += ' allow-scripts';
        }
        if (this.settings.allowPopups) {
            this.iframe.sandbox += ' allow-popups';
        }
        this.iframe.setAttribute('enable-annotation', 'true');
        this.resizing = true;
        // this.iframe.style.display = "none";
        this.element.style.visibility = 'hidden';
        this.iframe.style.visibility = 'hidden';
        this.iframe.style.width = '0';
        this.iframe.style.height = '0';
        this._width = 0;
        this._height = 0;
        this.element.setAttribute('ref', String(this.index));
        this.added = true;
        this.elementBounds = (0, core_1.bounds)(this.element);
        if ('srcdoc' in this.iframe) {
            this.supportsSrcdoc = true;
        }
        else {
            this.supportsSrcdoc = false;
        }
        if (!this.settings.method) {
            this.settings.method = this.supportsSrcdoc ? 'srcdoc' : 'write';
        }
        return this.iframe;
    }
    /**
     * Stub for createContainer to resolve TypeScript errors.
     * Returns a new div element.
     */
    createContainer() {
        return document.createElement('div');
    }
    render(request) {
        this.create();
        // Fit to size of the container, apply padding
        this.size();
        if (!this.sectionRender) {
            this.sectionRender = this.section.render(request);
        }
        // Render Chain
        return this.sectionRender
            .then((contents) => {
            return this.load(contents);
        })
            .then(() => {
            // find and report the writingMode axis
            const writingMode = this.contents.writingMode();
            // Set the axis based on the flow and writing mode
            let axis;
            if (this.settings.flow === 'scrolled') {
                axis =
                    writingMode.indexOf('vertical') === 0
                        ? 'horizontal'
                        : 'vertical';
            }
            else {
                axis =
                    writingMode.indexOf('vertical') === 0
                        ? 'vertical'
                        : 'horizontal';
            }
            if (writingMode.indexOf('vertical') === 0 &&
                this.settings.flow === 'paginated') {
                this.layout.delta = this.layout.height;
            }
            this.setAxis(axis);
            this.emit(constants_1.EVENTS.VIEWS.AXIS, axis);
            this.setWritingMode(writingMode);
            this.emit(constants_1.EVENTS.VIEWS.WRITING_MODE, writingMode);
            // apply the layout function to the contents
            this.layout.format(this.contents, this.section, this.axis);
            // Listen for events that require an expansion of the iframe
            this.addListeners();
            return new Promise((resolve) => {
                // Expand the iframe to the full size of the content
                this.expand();
                if (this.settings.forceRight) {
                    this.element.style.marginLeft = this.width() + 'px';
                }
                resolve();
            });
        }, (e) => {
            this.emit(constants_1.EVENTS.VIEWS.LOAD_ERROR, e);
            return new Promise((resolve, reject) => {
                reject(e);
            });
        })
            .then(() => {
            this.emit(constants_1.EVENTS.VIEWS.RENDERED, this.section);
        });
    }
    reset() {
        if (this.iframe) {
            this.iframe.style.width = '0';
            this.iframe.style.height = '0';
            this._width = 0;
            this._height = 0;
            this._textWidth = undefined;
            this._contentWidth = undefined;
            this._textHeight = undefined;
            this._contentHeight = undefined;
        }
        this._needsReframe = true;
    }
    // Determine locks base on settings
    size(_width, _height) {
        const width = _width || this.settings.width;
        const height = _height || this.settings.height;
        if (this.layout && this.layout.name === 'pre-paginated') {
            this.lock('both', width, height);
        }
        else if (this.settings.axis === 'horizontal') {
            this.lock('height', width, height);
        }
        else {
            this.lock('width', width, height);
        }
        this.settings.width = width;
        this.settings.height = height;
    }
    // Lock an axis to element dimensions, taking borders into account
    lock(what, width, height) {
        const elBorders = (0, core_1.borders)(this.element);
        let iframeBorders;
        if (this.iframe) {
            iframeBorders = (0, core_1.borders)(this.iframe);
        }
        else {
            iframeBorders = { width: 0, height: 0 };
        }
        if (what == 'width' && (0, core_1.isNumber)(width)) {
            this.lockedWidth = width - elBorders.width - iframeBorders.width;
            // this.resize(this.lockedWidth, width); //  width keeps ratio correct
        }
        if (what == 'height' && (0, core_1.isNumber)(height)) {
            this.lockedHeight = height - elBorders.height - iframeBorders.height;
            // this.resize(width, this.lockedHeight);
        }
        if (what === 'both' && (0, core_1.isNumber)(width) && (0, core_1.isNumber)(height)) {
            this.lockedWidth = width - elBorders.width - iframeBorders.width;
            this.lockedHeight = height - elBorders.height - iframeBorders.height;
            // this.resize(this.lockedWidth, this.lockedHeight);
        }
        if (this.displayed && this.iframe) {
            // this.contents.layout();
            this.expand();
        }
    }
    // Resize a single axis based on content dimensions
    expand() {
        let width = this.lockedWidth;
        let height = this.lockedHeight;
        let columns;
        if (!this.iframe || this._expanding)
            return;
        this._expanding = true;
        // Pre-paginated layout
        if (this.layout.name === 'pre-paginated') {
            width = this.layout?.columnWidth ?? width;
            height = this.layout?.height ?? height;
        }
        // Horizontal axis
        else if (this.settings.axis === 'horizontal') {
            if (!this.contents)
                throw new Error('Contents not loaded');
            if (!this.layout)
                throw new Error('Layout not defined');
            width = this.contents.textWidth();
            if (this.layout?.pageWidth && width % this.layout.pageWidth > 0) {
                width =
                    Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
            }
            if (this.settings.forceEvenPages && this.layout?.pageWidth) {
                columns = width / this.layout.pageWidth;
                if (this.layout?.divisor &&
                    this.layout.divisor > 1 &&
                    this.layout.name === 'reflowable' &&
                    columns % 2 > 0) {
                    width += this.layout.pageWidth;
                }
            }
        }
        // Vertical axis
        else if (this.settings.axis === 'vertical') {
            if (!this.contents)
                throw new Error('Contents not loaded');
            height = this.contents.textHeight();
            if (this.settings.flow === 'paginated' &&
                this.layout?.height &&
                height % this.layout.height > 0) {
                height = Math.ceil(height / this.layout.height) * this.layout.height;
            }
        }
        // Spread mode support
        if (this.layout &&
            this.layout._spread && // or use a getter if available
            typeof this.layout.pageWidth === 'number' &&
            typeof this.layout.divisor === 'number' &&
            this.layout.divisor > 1) {
            // Spread mode logic
            const spreadWidth = this.layout.pageWidth * this.layout.divisor;
            if (this._needsReframe ||
                spreadWidth != this._width ||
                height != this._height) {
                this.reframe(spreadWidth, height);
            }
        }
        else {
            if (this._needsReframe ||
                width != this._width ||
                height != this._height) {
                this.reframe(width, height);
            }
        }
        this._expanding = false;
    }
    reframe(width, height) {
        if (this.iframe === undefined) {
            throw new Error('Iframe not defined');
        }
        if ((0, core_1.isNumber)(width)) {
            this.element.style.width = width + 'px';
            this.iframe.style.width = width + 'px';
            this._width = width;
        }
        if ((0, core_1.isNumber)(height)) {
            this.element.style.height = height + 'px';
            this.iframe.style.height = height + 'px';
            this._height = height;
        }
        const widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
        const heightDelta = this.prevBounds
            ? height - this.prevBounds.height
            : height;
        const size = {
            width: width,
            height: height,
            widthDelta: widthDelta,
            heightDelta: heightDelta,
        };
        this.pane?.render();
        requestAnimationFrame(() => {
            let mark;
            for (const m in this.marks) {
                if (Object.prototype.hasOwnProperty.call(this.marks, m)) {
                    mark = this.marks[m];
                    this.placeMark(mark.element, mark.range);
                }
            }
        });
        this.onResize(this, size);
        this.emit(constants_1.EVENTS.VIEWS.RESIZED, size);
        this.prevBounds = size;
        this.elementBounds = (0, core_1.bounds)(this.element);
    }
    load(contents) {
        const loading = new core_1.defer();
        const loaded = loading.promise;
        if (!this.iframe) {
            loading.reject(new Error('No Iframe Available'));
            return loaded;
        }
        this.iframe.onload = (event) => {
            this.onLoad(event, loading);
        };
        if (this.settings.method === 'blobUrl') {
            this.blobUrl = (0, core_1.createBlobUrl)(contents, 'application/xhtml+xml');
            this.iframe.src = this.blobUrl;
            this.element.appendChild(this.iframe);
        }
        else if (this.settings.method === 'srcdoc') {
            this.iframe.srcdoc = contents;
            this.element.appendChild(this.iframe);
        }
        else {
            this.element.appendChild(this.iframe);
            this.document = this.iframe.contentDocument ?? undefined;
            if (!this.document) {
                loading.reject(new Error('No Document Available'));
                return loaded;
            }
            this.iframe.contentDocument?.open();
            this.iframe.contentDocument?.write(contents);
            this.iframe.contentDocument?.close();
        }
        return loaded;
    }
    onLoad(event, promise) {
        if (this.iframe === undefined) {
            throw new Error('Iframe not defined');
        }
        this.window = this.iframe.contentWindow ?? undefined;
        this.document = this.iframe.contentDocument ?? undefined;
        // Inject transparent background if option is enabled
        if (this.settings.transparency && this.document && this.document.body) {
            this.document.body.style.background = 'transparent';
            // Also inject a style tag for full coverage
            const style = this.document.createElement('style');
            style.innerHTML = 'html, body { background: transparent !important; }';
            this.document.head.appendChild(style);
        }
        if (this.document === undefined) {
            throw new Error('Document not defined');
        }
        this.contents = new contents_1.default(this.document, this.document.body, this.section.cfiBase, this.section.index);
        this.rendering = false;
        let link = this.document.querySelector("link[rel='canonical']");
        if (link) {
            if (this.section.canonical) {
                link.setAttribute('href', this.section.canonical);
            }
        }
        else {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            if (this.section.canonical) {
                link.setAttribute('href', this.section.canonical);
            }
            this.document.querySelector('head')?.appendChild(link);
        }
        this.contents.on(constants_1.EVENTS.CONTENTS.EXPAND, () => {
            if (this.displayed && this.iframe) {
                this.expand();
                if (this.contents) {
                    this.layout.format(this.contents);
                }
            }
        });
        this.contents.on(constants_1.EVENTS.CONTENTS.RESIZE, () => {
            if (this.displayed && this.iframe) {
                this.expand();
                if (this.contents) {
                    this.layout.format(this.contents);
                }
            }
        });
        promise.resolve(this.contents);
    }
    setLayout(layout) {
        this.layout = layout;
        if (this.contents) {
            this.layout.format(this.contents);
            this.expand();
        }
    }
    setAxis(axis) {
        this.settings.axis = axis;
        if (axis == 'horizontal') {
            this.element.style.flex = 'none';
        }
        else {
            this.element.style.flex = 'initial';
        }
        this.size();
    }
    setWritingMode(mode) {
        // this.element.style.writingMode = writingMode;
        this.writingMode = mode;
    }
    addListeners() {
        //TODO: Add content listeners for expanding
    }
    removeListeners() {
        //TODO: remove content listeners for expanding
    }
    display(request) {
        const displayed = new core_1.defer();
        if (!this.displayed) {
            this.render(request).then(() => {
                this.emit(constants_1.EVENTS.VIEWS.DISPLAYED, this);
                this.onDisplayed(this);
                this.displayed = true;
                displayed.resolve(this);
            }, function (err) {
                displayed.reject(err);
            });
        }
        else {
            displayed.resolve(this);
        }
        return displayed.promise;
    }
    show() {
        this.element.style.visibility = 'visible';
        if (this.iframe) {
            this.iframe.style.visibility = 'visible';
            // Remind Safari to redraw the iframe
            this.iframe.style.transform = 'translateZ(0)';
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.iframe.offsetWidth;
            // @ts-expect-error Part of a redrawing hack for Safari
            this.iframe.style.transform = null;
        }
        this.emit(constants_1.EVENTS.VIEWS.SHOWN, this);
    }
    hide() {
        // this.iframe.style.display = "none";
        this.element.style.visibility = 'hidden';
        this.iframe.style.visibility = 'hidden';
        this.stopExpanding = true;
        this.emit(constants_1.EVENTS.VIEWS.HIDDEN, this);
    }
    offset() {
        return {
            top: this.element.offsetTop,
            left: this.element.offsetLeft,
        };
    }
    width() {
        return this._width;
    }
    height() {
        return this._height;
    }
    position() {
        return this.element.getBoundingClientRect();
    }
    locationOf(target) {
        if (this.contents === undefined) {
            throw new Error('Contents not loaded');
        }
        const targetPos = this.contents.locationOf(target, this.settings.ignoreClass);
        return {
            left: targetPos.left,
            top: targetPos.top,
        };
    }
    onDisplayed(view) {
        console.log('[InlineView] onDisplayed called', view);
        // Stub, override with a custom functions
    }
    onResize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _viewer, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _newSize) {
        // Stub, override with a custom functions
    }
    bounds(force = false) {
        if (force || !this.elementBounds) {
            this.elementBounds = (0, core_1.bounds)(this.element);
        }
        return this.elementBounds;
    }
    highlight(cfiRange, data = {}, cb, className = 'epubjs-hl', styles = {}) {
        if (!this.contents) {
            return;
        }
        let attributes;
        if (this.settings.transparency) {
            attributes = Object.assign({ fill: 'yellow', 'fill-opacity': '1.0', 'mix-blend-mode': 'normal' }, styles);
        }
        else {
            attributes = Object.assign({ fill: 'yellow', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply' }, styles);
        }
        const range = this.contents.range(cfiRange);
        const emitter = () => {
            this.emit(constants_1.EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
        };
        data['epubcfi'] = cfiRange;
        if (this.iframe === undefined) {
            throw new Error('Iframe not defined');
        }
        if (!this.pane) {
            this.pane = new StyledPane(this.iframe, this.element, this.settings.transparency);
        }
        const m = new marks_pane_1.Highlight(range, className, data, attributes);
        const h = this.pane.addMark(m);
        // @ts-expect-error we should add a class to Mark to get the element
        const highlightElement = h.element;
        this.highlights[cfiRange] = {
            mark: h,
            element: highlightElement,
            listeners: [emitter, cb],
        };
        highlightElement.setAttribute('ref', className);
        highlightElement.addEventListener('click', emitter);
        highlightElement.addEventListener('touchstart', emitter);
        if (cb) {
            highlightElement.addEventListener('click', cb);
            highlightElement.addEventListener('touchstart', cb);
        }
        return h;
    }
    underline(cfiRange, data = {}, cb, className = 'epubjs-ul', styles = {}) {
        if (!this.contents) {
            return;
        }
        const attributes = Object.assign({
            stroke: 'black',
            'stroke-opacity': '0.3',
            'mix-blend-mode': 'multiply',
        }, styles);
        const range = this.contents.range(cfiRange);
        const emitter = () => {
            this.emit(constants_1.EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
        };
        data['epubcfi'] = cfiRange;
        if (this.iframe === undefined) {
            throw new Error('Iframe not defined');
        }
        if (!this.pane) {
            this.pane = new StyledPane(this.iframe, this.element, this.settings.transparency);
        }
        const m = new marks_pane_1.Underline(range, className, data, attributes);
        const h = this.pane.addMark(m);
        // @ts-expect-error we should add a class to Mark to get the element
        const underlineElement = h.element;
        this.underlines[cfiRange] = {
            mark: h,
            element: underlineElement,
            listeners: [emitter, cb],
        };
        underlineElement.setAttribute('ref', className);
        underlineElement.addEventListener('click', emitter);
        underlineElement.addEventListener('touchstart', emitter);
        if (cb) {
            underlineElement.addEventListener('click', cb);
            underlineElement.addEventListener('touchstart', cb);
        }
        return h;
    }
    mark(cfiRange, data = {}, cb) {
        if (!this.contents) {
            return null;
        }
        if (cfiRange in this.marks) {
            const item = this.marks[cfiRange];
            return item;
        }
        let range = this.contents.range(cfiRange);
        if (!range) {
            return null;
        }
        const container = range.commonAncestorContainer;
        const parent = container.nodeType === 1 ? container : container.parentNode;
        const emitter = () => {
            this.emit(constants_1.EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
        };
        if (range.collapsed && container.nodeType === 1) {
            range = new Range();
            range.selectNodeContents(container);
        }
        else if (range.collapsed) {
            // Webkit doesn't like collapsed ranges
            range = new Range();
            range.selectNodeContents(parent);
        }
        const mark = this.document.createElement('a');
        mark.setAttribute('ref', 'epubjs-mk');
        mark.style.position = 'absolute';
        mark.dataset['epubcfi'] = cfiRange;
        if (data) {
            Object.keys(data).forEach((key) => {
                mark.dataset[key] = data[key];
            });
        }
        if (cb) {
            mark.addEventListener('click', cb);
            mark.addEventListener('touchstart', cb);
        }
        mark.addEventListener('click', emitter);
        mark.addEventListener('touchstart', emitter);
        this.placeMark(mark, range);
        this.element.appendChild(mark);
        this.marks[cfiRange] = {
            element: mark,
            range: range,
            listeners: [emitter, cb],
        };
        return parent;
    }
    placeMark(element, range) {
        let top, right, left;
        if (this.layout.name === 'pre-paginated' ||
            this.settings.axis !== 'horizontal') {
            const pos = range.getBoundingClientRect();
            top = pos.top;
            right = pos.right;
        }
        else {
            // Element might break columns, so find the left most element
            const rects = range.getClientRects();
            if (this.layout === undefined) {
                throw new Error('Layout not defined');
            }
            let rect;
            for (let i = 0; i != rects.length; i++) {
                rect = rects[i];
                if (!left || rect.left < left) {
                    left = rect.left;
                    // right = rect.right;
                    right =
                        Math.ceil(left / this.layout.props.pageWidth) *
                            this.layout.props.pageWidth -
                            this.layout.gap / 2;
                    top = rect.top;
                }
            }
        }
        element.style.top = `${top}px`;
        element.style.left = `${right}px`;
    }
    unhighlight(cfiRange) {
        let item;
        if (cfiRange in this.highlights) {
            item = this.highlights[cfiRange];
            this.pane.removeMark(item.mark);
            item.listeners.forEach((l) => {
                if (l) {
                    item.element.removeEventListener('click', l);
                    item.element.removeEventListener('touchstart', l);
                }
            });
            delete this.highlights[cfiRange];
        }
    }
    ununderline(cfiRange) {
        let item;
        if (cfiRange in this.underlines) {
            if (this.pane === undefined) {
                throw new Error('Pane not defined');
            }
            item = this.underlines[cfiRange];
            this.pane.removeMark(item.mark);
            item.listeners.forEach((l) => {
                if (l) {
                    item.element.removeEventListener('click', l);
                    item.element.removeEventListener('touchstart', l);
                }
            });
            delete this.underlines[cfiRange];
        }
    }
    unmark(cfiRange) {
        if (cfiRange in this.marks) {
            const item = this.marks[cfiRange];
            this.element.removeChild(item.element);
            item.listeners.forEach((l) => {
                if (l) {
                    item.element.removeEventListener('click', l);
                    item.element.removeEventListener('touchstart', l);
                }
            });
            delete this.marks[cfiRange];
        }
    }
    destroy() {
        for (const cfiRange in this.highlights) {
            this.unhighlight(cfiRange);
        }
        for (const cfiRange in this.underlines) {
            this.ununderline(cfiRange);
        }
        for (const cfiRange in this.marks) {
            this.unmark(cfiRange);
        }
        if (this.blobUrl) {
            (0, core_1.revokeBlobUrl)(this.blobUrl);
        }
        if (this.displayed) {
            this.displayed = false;
            this.removeListeners();
            this.contents?.destroy();
            this.stopExpanding = true;
            this.element.removeChild(this.iframe);
            if (this.pane) {
                this.pane = undefined;
            }
            this.iframe = undefined;
            this.contents = undefined;
            this._textWidth = undefined;
            this._textHeight = undefined;
        }
        // this.element.style.height = "0px";
        // this.element.style.width = "0px";
    }
}
(0, event_emitter_1.default)(IframeView.prototype);
exports.default = IframeView;
