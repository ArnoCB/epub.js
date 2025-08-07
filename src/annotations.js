"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = __importDefault(require("event-emitter"));
const epubcfi_1 = __importDefault(require("./epubcfi"));
const constants_1 = require("./utils/constants");
/**
 * Handles managing adding & removing Annotations
 */
class Annotations {
    constructor(rendition) {
        this.highlights = [];
        this.underlines = [];
        this.marks = [];
        this._annotations = {};
        this._annotationsBySectionIndex = {};
        this.rendition = rendition;
        this.rendition.hooks.render.register(this.inject.bind(this));
        this.rendition.hooks.unloaded.register(this.clear.bind(this));
    }
    /**
     * Add an annotation to store
     */
    add(type, cfiRange, data, cb, className, styles) {
        const hash = encodeURI(cfiRange + type);
        const cfi = new epubcfi_1.default(cfiRange);
        const sectionIndex = cfi.spinePos;
        const annotation = new Annotation({
            type,
            cfiRange,
            data,
            sectionIndex,
            cb,
            className,
            styles,
        });
        this._annotations[hash] = annotation;
        if (sectionIndex in this._annotationsBySectionIndex) {
            this._annotationsBySectionIndex[sectionIndex].push(hash);
        }
        else {
            this._annotationsBySectionIndex[sectionIndex] = [hash];
        }
        const views = this.rendition.views();
        views.forEach((view) => {
            if (annotation.sectionIndex === view.index) {
                annotation.attach(view);
            }
        });
        return annotation;
    }
    /**
     * Remove an annotation from store
     * @param {EpubCFI} cfiRange EpubCFI range the annotation is attached to
     * @param {string} type Type of annotation to add: "highlight", "underline", "mark"
     */
    remove(cfiRange, type) {
        const hash = encodeURI(cfiRange + type);
        if (hash in this._annotations) {
            const annotation = this._annotations[hash];
            if (type && annotation.type !== type) {
                return;
            }
            const views = this.rendition.views();
            views.forEach((view) => {
                this._removeFromAnnotationBySectionIndex(annotation.sectionIndex, hash);
                if (annotation.sectionIndex === view.index) {
                    annotation.detach(view);
                }
            });
            delete this._annotations[hash];
        }
    }
    /**
     * Remove an annotations by Section Index
     * @private
     */
    _removeFromAnnotationBySectionIndex(sectionIndex, hash) {
        this._annotationsBySectionIndex[sectionIndex] = this._annotationsAt(sectionIndex).filter((h) => h !== hash);
    }
    /**
     * Get annotations by Section Index
     * @private
     */
    _annotationsAt(index) {
        return this._annotationsBySectionIndex[index];
    }
    /**
     * Add a highlight to the store
     */
    highlight(cfiRange, data, cb, className, styles) {
        return this.add('highlight', cfiRange, data, cb, className, styles);
    }
    /**
     * Add a underline to the store
     */
    underline(cfiRange, data, cb, className, styles) {
        return this.add('underline', cfiRange, data, cb, className, styles);
    }
    /**
     * Add a mark to the store
  
     */
    mark(cfiRange, data, cb) {
        return this.add('mark', cfiRange, data, cb);
    }
    /**
     * iterate over annotations in the store
     */
    each(callback, thisArg) {
        Object.values(this._annotations).forEach(callback, thisArg);
    }
    /**
     * Hook for injecting annotation into a view
     */
    inject(view) {
        const sectionIndex = view.index;
        if (sectionIndex in this._annotationsBySectionIndex) {
            const annotations = this._annotationsBySectionIndex[sectionIndex];
            annotations.forEach((hash) => {
                const annotation = this._annotations[hash];
                annotation.attach(view);
            });
        }
    }
    /**
     * Hook for removing annotation from a view
     */
    clear(view) {
        const sectionIndex = view.index;
        if (sectionIndex in this._annotationsBySectionIndex) {
            const annotations = this._annotationsBySectionIndex[sectionIndex];
            annotations.forEach((hash) => {
                const annotation = this._annotations[hash];
                annotation.detach(view);
            });
        }
    }
    /**
     * [Not Implemented] Show annotations
     * @TODO: needs implementation in View
     */
    show() { }
    /**
     * [Not Implemented] Hide annotations
     * @TODO: needs implementation in View
     */
    hide() { }
}
/**
 * Annotation object
 * @class
 * @param {object} options
 * @param {string} options.type Type of annotation to add: "highlight", "underline", "mark"
 * @param {EpubCFI} options.cfiRange EpubCFI range to attach annotation to
 * @param {object} options.data Data to assign to annotation
 * @param {int} options.sectionIndex Index in the Spine of the Section annotation belongs to
 * @param {function} [options.cb] Callback after annotation is clicked
 * @param {string} className CSS class to assign to annotation
 * @param {object} styles CSS styles to assign to annotation
 * @returns {Annotation} annotation
 */
class Annotation {
    constructor({ type, cfiRange, data, sectionIndex, cb, className, styles, }) {
        this.type = type;
        this.cfiRange = cfiRange;
        this.data = data;
        this.sectionIndex = sectionIndex;
        this.mark = undefined;
        this.cb = cb;
        this.className = className;
        this.styles = styles;
    }
    /**
     * Update stored data
     */
    update(data) {
        this.data = data;
    }
    /**
     * Add to a view
     */
    attach(view) {
        const { cfiRange, data, type, cb, className, styles } = this;
        let result;
        if (type === 'highlight') {
            result = view.highlight(cfiRange, data, cb, className, styles);
        }
        else if (type === 'underline') {
            result = view.underline(cfiRange, data, cb, className, styles);
        }
        else if (type === 'mark') {
            result = view.mark(cfiRange, data, cb);
        }
        if (typeof result === 'undefined') {
            throw new Error(`Failed to attach annotation of type ${type} to view`);
        }
        this.mark = result;
        this.emit(constants_1.EVENTS.ANNOTATION.ATTACH, result);
        return result;
    }
    /**
     * Remove from a view
     */
    detach(view) {
        const { cfiRange, type } = this;
        let result;
        if (view) {
            if (type === 'highlight') {
                result = view.unhighlight(cfiRange);
            }
            else if (type === 'underline') {
                result = view.ununderline(cfiRange);
            }
            else if (type === 'mark') {
                result = view.unmark(cfiRange);
            }
        }
        this.mark = undefined;
        this.emit(constants_1.EVENTS.ANNOTATION.DETACH, result);
        return result;
    }
    text() { }
}
(0, event_emitter_1.default)(Annotation.prototype);
exports.default = Annotations;
