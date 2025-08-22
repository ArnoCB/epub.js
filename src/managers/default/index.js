"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = __importDefault(require("event-emitter"));
const core_1 = require("../../utils/core");
const scrolltype_1 = __importDefault(require("../../utils/scrolltype"));
const mapping_1 = __importDefault(require("../../mapping"));
const queue_1 = __importDefault(require("../../utils/queue"));
const stage_1 = __importDefault(require("../helpers/stage"));
const views_1 = __importDefault(require("../helpers/views"));
const constants_1 = require("../../utils/constants");
const iframe_1 = __importDefault(require("../views/iframe"));
class DefaultViewManager {
    constructor(options) {
        this.name = 'default';
        this.rendered = false;
        this.optsSettings = options.settings;
        this.View = options.view;
        this.request = options.request;
        this.renditionQueue = options.queue;
        this.q = new queue_1.default(this);
        this.settings = {
            infinite: true,
            hidden: false,
            width: undefined,
            height: undefined,
            axis: undefined,
            writingMode: undefined,
            flow: 'scrolled',
            ignoreClass: '',
            fullsize: undefined,
            allowScriptedContent: false,
            allowPopups: false,
            ...(options.settings || {}),
        };
        (0, core_1.extend)(this.settings, options.settings || {});
        this.viewSettings = {
            ignoreClass: this.settings.ignoreClass,
            axis: this.settings.axis,
            flow: this.settings.flow,
            layout: this.layout,
            method: this.settings.method, // srcdoc, blobUrl, write
            width: 0,
            height: 0,
            forceEvenPages: true,
            allowScriptedContent: this.settings.allowScriptedContent,
            allowPopups: this.settings.allowPopups,
        };
        this.rendered = false;
    }
    render(element, size) {
        const tag = element.tagName;
        if (typeof this.settings.fullsize === 'undefined' &&
            tag &&
            (tag.toLowerCase() == 'body' || tag.toLowerCase() == 'html')) {
            this.settings.fullsize = true;
        }
        if (this.settings.fullsize) {
            this.settings.overflow = 'visible';
            this.overflow = this.settings.overflow;
        }
        this.settings.size = size;
        this.settings.rtlScrollType = (0, scrolltype_1.default)();
        // Save the stage
        this.stage = new stage_1.default({
            width: size ? String(size.width) : undefined,
            height: size ? String(size.height) : undefined,
            overflow: this.overflow,
            hidden: this.settings.hidden,
            axis: this.settings.axis,
            fullsize: this.settings.fullsize,
            direction: this.settings.direction,
        });
        this.stage.attachTo(element);
        // Get this stage container div
        this.container = this.stage.getContainer();
        // Views array methods
        this.views = new views_1.default(this.container);
        // Calculate Stage Size
        this._bounds = this.bounds();
        this._stageSize = this.stage.size();
        // Set the dimensions for views
        this.viewSettings.width = this._stageSize.width;
        this.viewSettings.height = this._stageSize.height;
        // Function to handle a resize event.
        // Will only attach if width and height are both fixed.
        this.stage.onResize(this.onResized.bind(this));
        this.stage.onOrientationChange(this.onOrientationChange.bind(this));
        // Add Event Listeners
        this.addEventListeners();
        // Add Layout method
        // this.applyLayoutMethod();
        if (this.layout) {
            this.updateLayout();
        }
        this.rendered = true;
    }
    addEventListeners() {
        let scroller;
        window.addEventListener('unload', () => {
            this.destroy();
        });
        if (!this.settings.fullsize) {
            scroller = this.container;
        }
        else {
            scroller = window;
        }
        this._onScroll = this.onScroll.bind(this);
        scroller.addEventListener('scroll', this._onScroll);
    }
    removeEventListeners() {
        let scroller;
        if (!this.settings.fullsize) {
            scroller = this.container;
        }
        else {
            scroller = window;
        }
        scroller.removeEventListener('scroll', this._onScroll);
        this._onScroll = undefined;
    }
    destroy() {
        clearTimeout(this.orientationTimeout);
        clearTimeout(this.resizeTimeout);
        clearTimeout(this.afterScrolled);
        this.clear();
        this.removeEventListeners();
        this.stage.destroy();
        this.rendered = false;
    }
    onOrientationChange() {
        const { orientation } = window;
        if (this.optsSettings.resizeOnOrientationChange) {
            this.resize();
        }
        // Per ampproject:
        // In IOS 10.3, the measured size of an element is incorrect if the
        // element size depends on window size directly and the measurement
        // happens in window.resize event. Adding a timeout for correct
        // measurement. See https://github.com/ampproject/amphtml/issues/8479
        clearTimeout(this.orientationTimeout);
        this.orientationTimeout = setTimeout(() => {
            this.orientationTimeout = undefined;
            if (this.optsSettings.resizeOnOrientationChange) {
                this.resize();
            }
            this.emit(constants_1.EVENTS.MANAGERS.ORIENTATION_CHANGE, orientation);
        }, 500);
    }
    onResized() {
        this.resize();
    }
    resize(width, height, epubcfi) {
        const stageSize = this.stage.size(width, height);
        // For Safari, wait for orientation to catch up
        // if the window is a square
        this.winBounds = (0, core_1.windowBounds)();
        if (this.orientationTimeout &&
            this.winBounds.width === this.winBounds.height) {
            // reset the stage size for next resize
            this._stageSize = undefined;
            return;
        }
        if (this._stageSize &&
            this._stageSize.width === stageSize.width &&
            this._stageSize.height === stageSize.height) {
            // Size is the same, no need to resize
            return;
        }
        this._stageSize = stageSize;
        this._bounds = this.bounds();
        // Clear current views
        this.clear();
        // Update for new views
        this.viewSettings.width = this._stageSize.width;
        this.viewSettings.height = this._stageSize.height;
        this.updateLayout();
        this.emit(constants_1.EVENTS.MANAGERS.RESIZED, {
            width: this._stageSize.width,
            height: this._stageSize.height,
        }, epubcfi);
    }
    createView(section, forceRight = false) {
        return new iframe_1.default(section, (0, core_1.extend)(this.viewSettings, { forceRight }));
    }
    handleNextPrePaginated(forceRight, section, action) {
        let next;
        if (this.layout.name === 'pre-paginated' && this.layout.divisor > 1) {
            if (forceRight || section.index === 0) {
                // First page (cover) should stand alone for pre-paginated books
                return;
            }
            next = section.next();
            if (next && !next.properties.includes('page-spread-left')) {
                return action.call(this, next);
            }
        }
    }
    display(section, target) {
        const displaying = new core_1.defer();
        const displayed = displaying.promise;
        // Check if moving to target is needed
        if (target === section.href || (0, core_1.isNumber)(target)) {
            target = undefined;
        }
        // Check to make sure the section we want isn't already shown
        const visible = this.views.find(section);
        // View is already shown, just move to correct location in view
        if (visible && section && this.layout.name !== 'pre-paginated') {
            const offset = visible.offset();
            if (this.settings.direction === 'ltr') {
                this.scrollTo(offset.left, offset.top, true);
            }
            else {
                const width = visible.width();
                this.scrollTo(offset.left + width, offset.top, true);
            }
            if (target) {
                const offset = visible.locationOf(target);
                const width = visible.width();
                this.moveTo(offset, width);
            }
            displaying.resolve(undefined);
            return displayed;
        }
        // Hide all current views
        this.clear();
        let forceRight = false;
        if (this.layout.name === 'pre-paginated' &&
            this.layout.divisor === 2 &&
            section.properties.includes('page-spread-right')) {
            forceRight = true;
        }
        this.add(section, forceRight)
            .then((view) => {
            // Move to correct place within the section, if needed
            if (target) {
                const offset = view.locationOf(target);
                const width = view.width();
                this.moveTo(offset, width);
            }
        }, (err) => {
            displaying.reject(err);
        })
            .then(() => {
            return this.handleNextPrePaginated(forceRight, section, this.add);
        })
            .then(() => {
            this.views.show();
            displaying.resolve(undefined);
        });
        return displayed;
    }
    afterDisplayed(view) {
        this.emit(constants_1.EVENTS.MANAGERS.ADDED, view);
    }
    afterResized(view) {
        this.emit(constants_1.EVENTS.MANAGERS.RESIZE, view.section);
    }
    async add(section, forceRight = false) {
        const view = this.createView(section, forceRight);
        this.views.append(view);
        // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
        view.onDisplayed = this.afterDisplayed.bind(this);
        view.onResize = this.afterResized.bind(this);
        view.on(constants_1.EVENTS.VIEWS.AXIS, (axis) => {
            this.updateAxis(axis);
        });
        view.on(constants_1.EVENTS.VIEWS.WRITING_MODE, (mode) => {
            this.updateWritingMode(mode);
        });
        return view.display(this.request).then(() => view);
    }
    moveTo(offset, width) {
        let distX = 0, distY = 0;
        if (!this.isPaginated) {
            distY = offset.top;
        }
        else {
            distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
            if (distX + this.layout.delta > this.container.scrollWidth) {
                distX = this.container.scrollWidth - this.layout.delta;
            }
            distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;
            if (distY + this.layout.delta > this.container.scrollHeight) {
                distY = this.container.scrollHeight - this.layout.delta;
            }
        }
        if (this.settings.direction === 'rtl') {
            /***
                      the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
                      to distX or use `Math.ceil` function, or multiply offset.left by -1
                      before `Math.floor`
                  */
            distX = distX + this.layout.delta;
            distX = distX - width;
        }
        this.scrollTo(distX, distY, true);
    }
    async append(section, forceRight = false) {
        const view = this.createView(section, forceRight);
        this.views.append(view);
        view.onDisplayed = this.afterDisplayed.bind(this);
        view.onResize = this.afterResized.bind(this);
        view.on(constants_1.EVENTS.VIEWS.AXIS, (axis) => {
            this.updateAxis(axis);
        });
        view.on(constants_1.EVENTS.VIEWS.WRITING_MODE, (mode) => {
            this.updateWritingMode(mode);
        });
        return view.display(this.request).then(() => view);
    }
    async prepend(section, forceRight = false) {
        const view = this.createView(section, forceRight);
        view.on(constants_1.EVENTS.VIEWS.RESIZED, (bounds) => {
            this.counter(bounds);
        });
        this.views.prepend(view);
        view.onDisplayed = this.afterDisplayed.bind(this);
        view.onResize = this.afterResized.bind(this);
        view.on(constants_1.EVENTS.VIEWS.AXIS, (axis) => {
            this.updateAxis(axis);
        });
        view.on(constants_1.EVENTS.VIEWS.WRITING_MODE, (mode) => {
            this.updateWritingMode(mode);
        });
        return view.display(this.request).then(() => view);
    }
    counter(bounds) {
        if (this.settings.axis === 'vertical') {
            this.scrollBy(0, bounds.heightDelta, true);
        }
        else {
            this.scrollBy(bounds.widthDelta, 0, true);
        }
    }
    next() {
        let next;
        let left;
        const dir = this.settings.direction;
        if (this.views === undefined || !this.views.length) {
            return Promise.resolve();
        }
        if (this.isPaginated &&
            this.settings.axis === 'horizontal' &&
            (!dir || dir === 'ltr')) {
            this.scrollLeft = this.container.scrollLeft;
            left =
                this.container.scrollLeft +
                    this.container.offsetWidth +
                    this.layout.delta;
            if (left <= this.container.scrollWidth) {
                this.scrollBy(this.layout.delta, 0, true);
            }
            else {
                const lastView = this.views.last();
                if (lastView && lastView.section) {
                    next = lastView.section.next();
                }
            }
        }
        else if (this.isPaginated &&
            this.settings.axis === 'horizontal' &&
            dir === 'rtl') {
            this.scrollLeft = this.container.scrollLeft;
            if (this.settings.rtlScrollType === 'default') {
                left = this.container.scrollLeft;
                if (left > 0) {
                    this.scrollBy(this.layout.delta, 0, true);
                }
                else {
                    const lastView = this.views.last();
                    if (lastView && lastView.section) {
                        next = lastView.section.next();
                    }
                }
            }
            else {
                left = this.container.scrollLeft + this.layout.delta * -1;
                if (left > this.container.scrollWidth * -1) {
                    this.scrollBy(this.layout.delta, 0, true);
                }
                else {
                    const lastView = this.views.last();
                    if (lastView && lastView.section) {
                        next = lastView.section.next();
                    }
                }
            }
        }
        else if (this.isPaginated && this.settings.axis === 'vertical') {
            this.scrollTop = this.container.scrollTop;
            const top = this.container.scrollTop + this.container.offsetHeight;
            if (top < this.container.scrollHeight) {
                this.scrollBy(0, this.layout.height, true);
            }
            else {
                const lastView = this.views.last();
                if (lastView && lastView.section) {
                    next = lastView.section.next();
                }
            }
        }
        else {
            const lastView = this.views.last();
            if (lastView && lastView.section) {
                next = lastView.section.next();
            }
        }
        if (next) {
            this.clear();
            // The new section may have a different writing-mode from the old section. Thus, we need to update layout.
            this.updateLayout();
            let forceRight = false;
            if (this.layout.name === 'pre-paginated' &&
                this.layout.divisor === 2 &&
                next.properties.includes('page-spread-right')) {
                forceRight = true;
            }
            return this.append(next, forceRight)
                .then(() => {
                return this.handleNextPrePaginated(forceRight, next, this.append);
            }, (err) => {
                return err;
            })
                .then(() => {
                // Reset position to start for scrolled-doc vertical-rl in default mode
                if (!this.isPaginated &&
                    this.settings.axis === 'horizontal' &&
                    this.settings.direction === 'rtl' &&
                    this.settings.rtlScrollType === 'default') {
                    this.scrollTo(this.container.scrollWidth, 0, true);
                }
                this.views.show();
            });
        }
        // Return resolved promise when no next section is available
        return Promise.resolve();
    }
    prev() {
        let prev;
        let left;
        const dir = this.settings.direction;
        if (this.views === undefined || !this.views.length) {
            return Promise.resolve();
        }
        if (this.isPaginated &&
            this.settings.axis === 'horizontal' &&
            (!dir || dir === 'ltr')) {
            this.scrollLeft = this.container.scrollLeft;
            left = this.container.scrollLeft;
            if (left > 0) {
                this.scrollBy(-this.layout.delta, 0, true);
            }
            else {
                const firstView = this.views.first();
                if (firstView && firstView.section) {
                    prev = firstView.section.prev();
                }
            }
        }
        else if (this.isPaginated &&
            this.settings.axis === 'horizontal' &&
            dir === 'rtl') {
            this.scrollLeft = this.container.scrollLeft;
            if (this.settings.rtlScrollType === 'default') {
                left = this.container.scrollLeft + this.container.offsetWidth;
                if (left < this.container.scrollWidth) {
                    this.scrollBy(-this.layout.delta, 0, true);
                }
                else {
                    const firstView = this.views.first();
                    if (firstView && firstView.section) {
                        prev = firstView.section.prev();
                    }
                }
            }
            else {
                left = this.container.scrollLeft;
                if (left < 0) {
                    this.scrollBy(-this.layout.delta, 0, true);
                }
                else {
                    const firstView = this.views.first();
                    if (firstView && firstView.section) {
                        prev = firstView.section.prev();
                    }
                }
            }
        }
        else if (this.isPaginated && this.settings.axis === 'vertical') {
            this.scrollTop = this.container.scrollTop;
            const top = this.container.scrollTop;
            if (top > 0) {
                this.scrollBy(0, -this.layout.height, true);
            }
            else {
                const firstView = this.views.first();
                if (firstView && firstView.section) {
                    prev = firstView.section.prev();
                }
            }
        }
        else {
            const firstView = this.views.first();
            if (firstView && firstView.section) {
                prev = firstView.section.prev();
            }
        }
        if (prev) {
            this.clear();
            // The new section may have a different writing-mode from the old section. Thus, we need to update layout.
            this.updateLayout();
            let forceRight = false;
            if (this.layout.name === 'pre-paginated' &&
                this.layout.divisor === 2 &&
                typeof prev.prev() !== 'object') {
                forceRight = true;
            }
            return this.prepend(prev, forceRight)
                .then(() => {
                let left;
                if (this.layout.name === 'pre-paginated' &&
                    this.layout.divisor > 1) {
                    left = prev.prev();
                    if (left) {
                        return this.prepend(left);
                    }
                }
            }, (err) => {
                return err;
            })
                .then(() => {
                if (this.isPaginated && this.settings.axis === 'horizontal') {
                    if (this.settings.direction === 'rtl') {
                        if (this.settings.rtlScrollType === 'default') {
                            this.scrollTo(0, 0, true);
                        }
                        else {
                            this.scrollTo(this.container.scrollWidth * -1 + this.layout.delta, 0, true);
                        }
                    }
                    else {
                        this.scrollTo(this.container.scrollWidth - this.layout.delta, 0, true);
                    }
                }
                this.views.show();
            });
        }
        // Return resolved promise when no prev section is available
        return Promise.resolve();
    }
    current() {
        const visible = this.visible();
        if (visible.length) {
            // Current is the last visible view
            return visible[visible.length - 1];
        }
        return null;
    }
    clear() {
        // this.q.clear();
        if (this.views) {
            this.views.hide();
            this.scrollTo(0, 0, true);
            this.views.clear();
        }
    }
    currentLocation() {
        this.updateLayout();
        if (this.isPaginated && this.settings.axis === 'horizontal') {
            this.location = this.paginatedLocation();
        }
        else {
            this.location = this.scrolledLocation();
        }
        return this.location;
    }
    scrolledLocation() {
        const visible = this.visible();
        const container = this.container.getBoundingClientRect();
        const pageHeight = container.height < window.innerHeight
            ? container.height
            : window.innerHeight;
        const pageWidth = container.width < window.innerWidth ? container.width : window.innerWidth;
        const vertical = this.settings.axis === 'vertical';
        let offset = 0;
        const used = 0;
        if (this.settings.fullsize) {
            offset = vertical ? window.scrollY : window.scrollX;
        }
        const sections = visible.map((view) => {
            const { index, href } = view.section;
            const position = view.position();
            const width = view.width();
            const height = view.height();
            let startPos;
            let endPos;
            let stopPos;
            let totalPages;
            if (vertical) {
                startPos = offset + container.top - position.top + used;
                endPos = startPos + pageHeight - used;
                totalPages = this.layout.count(height, pageHeight).pages;
                stopPos = pageHeight;
            }
            else {
                startPos = offset + container.left - position.left + used;
                endPos = startPos + pageWidth - used;
                totalPages = this.layout.count(width, pageWidth).pages;
                stopPos = pageWidth;
            }
            let currPage = Math.ceil(startPos / stopPos);
            let pages = [];
            let endPage = Math.ceil(endPos / stopPos);
            // Reverse page counts for horizontal rtl
            if (this.settings.direction === 'rtl' && !vertical) {
                const tempStartPage = currPage;
                currPage = totalPages - endPage;
                endPage = totalPages - tempStartPage;
            }
            pages = [];
            for (let i = currPage; i <= endPage; i++) {
                const pg = i + 1;
                pages.push(pg);
            }
            if (this.mapping === undefined) {
                throw new Error('Mapping is not defined');
            }
            const mapping = this.mapping.page(view.contents, view.section.cfiBase, startPos, endPos);
            return {
                index,
                href,
                pages,
                totalPages,
                mapping,
            };
        });
        return sections;
    }
    paginatedLocation() {
        const visible = this.visible();
        const container = this.container.getBoundingClientRect();
        let left = 0;
        let used = 0;
        if (this.settings.fullsize) {
            left = window.scrollX;
        }
        const sections = visible.map((view) => {
            const { index, href } = view.section;
            let offset;
            const position = view.position();
            const width = view.width();
            // Find mapping
            let start;
            let end;
            let pageWidth;
            if (this.settings.direction === 'rtl') {
                offset = container.right - left;
                pageWidth =
                    Math.min(Math.abs(offset - position.left), this.layout.width) - used;
                end = position.width - (position.right - offset) - used;
                start = end - pageWidth;
            }
            else {
                offset = container.left + left;
                pageWidth = Math.min(position.right - offset, this.layout.width) - used;
                start = offset - position.left + used;
                end = start + pageWidth;
            }
            used += pageWidth;
            if (this.mapping === undefined) {
                throw new Error('Mapping is not defined');
            }
            const mapping = this.mapping.page(view.contents, view.section.cfiBase, start, end);
            const totalPages = this.layout.count(width).pages;
            let startPage = 0;
            let endPage = 0;
            const pages = [];
            if (this.layout.pageWidth && this.layout.pageWidth > 0) {
                startPage = Math.floor(start / this.layout.pageWidth);
                endPage = Math.floor(end / this.layout.pageWidth);
                // start page should not be negative
                if (startPage < 0) {
                    startPage = 0;
                    endPage = endPage + 1;
                }
                // Reverse page counts for rtl
                if (this.settings.direction === 'rtl') {
                    const tempStartPage = startPage;
                    startPage = totalPages - endPage;
                    endPage = totalPages - tempStartPage;
                }
                for (let i = startPage + 1; i <= endPage; i++) {
                    const pg = i;
                    pages.push(pg);
                }
            }
            // Always return an object to satisfy the type annotation
            return {
                index,
                href,
                pages,
                totalPages,
                mapping,
            };
        });
        return sections;
    }
    isVisible(view, offsetPrev, offsetNext, _container) {
        const position = view.position();
        const container = _container || this.bounds();
        if (this.settings.axis === 'horizontal' &&
            position.right > container.left - offsetPrev &&
            position.left < container.right + offsetNext) {
            return true;
        }
        else if (this.settings.axis === 'vertical' &&
            position.bottom > container.top - offsetPrev &&
            position.top < container.bottom + offsetNext) {
            return true;
        }
        return false;
    }
    visible() {
        const container = this.bounds();
        const views = this.views.displayed();
        const viewsLength = views.length;
        const visible = [];
        let isVisible;
        let view;
        for (let i = 0; i < viewsLength; i++) {
            view = views[i];
            isVisible = this.isVisible(view, 0, 0, container);
            if (isVisible === true) {
                visible.push(view);
            }
        }
        return visible;
    }
    scrollBy(x, y, silent) {
        const dir = this.settings.direction === 'rtl' ? -1 : 1;
        if (silent) {
            this.ignore = true;
        }
        if (!this.settings.fullsize) {
            if (x)
                this.container.scrollLeft += x * dir;
            if (y)
                this.container.scrollTop += y;
        }
        else {
            window.scrollBy(x * dir, y * dir);
        }
        this.scrolled = true;
    }
    scrollTo(x, y, silent) {
        if (silent) {
            this.ignore = true;
        }
        if (!this.settings.fullsize) {
            this.container.scrollLeft = x;
            this.container.scrollTop = y;
        }
        else {
            window.scrollTo(x, y);
        }
        this.scrolled = true;
    }
    onScroll() {
        let scrollTop;
        let scrollLeft;
        if (!this.settings.fullsize) {
            scrollTop = this.container.scrollTop;
            scrollLeft = this.container.scrollLeft;
        }
        else {
            scrollTop = window.scrollY;
            scrollLeft = window.scrollX;
        }
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
        if (!this.ignore) {
            this.emit(constants_1.EVENTS.MANAGERS.SCROLL, {
                top: scrollTop,
                left: scrollLeft,
            });
            clearTimeout(this.afterScrolled);
            this.afterScrolled = setTimeout(() => {
                this.emit(constants_1.EVENTS.MANAGERS.SCROLLED, {
                    top: this.scrollTop,
                    left: this.scrollLeft,
                });
            }, 20);
        }
        else {
            this.ignore = false;
        }
    }
    bounds() {
        return this.stage.bounds();
    }
    applyLayout(layout) {
        this.layout = layout;
        this.updateLayout();
        if (this.views &&
            this.views.length > 0 &&
            this.layout.name === 'pre-paginated') {
            const firstView = this.views.first();
            if (firstView && firstView.section) {
                this.display(firstView.section);
            }
        }
        // this.manager.layout(this.layout.format);
    }
    updateLayout() {
        if (!this.stage) {
            return;
        }
        this._stageSize = this.stage.size();
        if (!this.isPaginated) {
            this.layout.calculate(this._stageSize.width, this._stageSize.height);
        }
        else {
            this.layout.calculate(this._stageSize.width, this._stageSize.height, this.settings.gap);
            // Set the look ahead offset for what is visible
            this.settings.offset = this.layout.delta / this.layout.divisor;
            // this.stage.addStyleRules("iframe", [{"margin-right" : this.layout.gap + "px"}]);
        }
        // Set the dimensions for views
        this.viewSettings.width = this.layout.width;
        this.viewSettings.height = this.layout.height;
        this.setLayout(this.layout);
    }
    setLayout(layout) {
        this.viewSettings.layout = layout;
        this.mapping = new mapping_1.default(
        // @ts-expect-error this should be fixed at some point
        layout.props, this.settings.direction, this.settings.axis);
        if (this.views) {
            this.views.forEach(function (view) {
                if (view) {
                    view.setLayout(layout);
                }
            });
        }
    }
    updateWritingMode(mode) {
        this.writingMode = mode;
    }
    updateAxis(axis, forceUpdate) {
        if (!forceUpdate && axis === this.settings.axis) {
            return;
        }
        this.settings.axis = axis;
        this.stage?.axis(axis);
        this.viewSettings.axis = axis;
        if (this.mapping) {
            this.mapping = new mapping_1.default(
            // @ts-expect-error this should be fixed at some point
            this.layout.props, this.settings.direction, this.settings.axis);
        }
        if (this.layout) {
            if (axis === 'vertical') {
                this.layout.spread('none');
            }
            else {
                this.layout.spread(this.layout.settings.spread);
            }
        }
    }
    updateFlow(flow, defaultScrolledOverflow = 'auto') {
        const isPaginated = flow === 'paginated' || flow === 'auto';
        this.isPaginated = isPaginated;
        if (flow === 'scrolled-doc' ||
            flow === 'scrolled-continuous' ||
            flow === 'scrolled') {
            this.updateAxis('vertical');
        }
        else {
            this.updateAxis('horizontal');
        }
        this.viewSettings.flow = flow;
        if (!this.settings.overflow) {
            this.overflow = isPaginated ? 'hidden' : defaultScrolledOverflow;
        }
        else {
            this.overflow = this.settings.overflow;
        }
        this.stage?.overflow(this.overflow);
        this.updateLayout();
    }
    getContents() {
        const contents = [];
        if (!this.views) {
            return contents;
        }
        this.views.forEach(function (view) {
            const viewContents = view && view.contents;
            if (viewContents) {
                contents.push(viewContents);
            }
        });
        return contents;
    }
    direction(dir = 'ltr') {
        this.settings.direction = dir;
        this.stage?.direction(dir);
        this.viewSettings.direction = dir;
        this.updateLayout();
    }
    isRendered() {
        return this.rendered;
    }
}
//-- Enable binding events to Manager
(0, event_emitter_1.default)(DefaultViewManager.prototype);
exports.default = DefaultViewManager;
