import { Mark } from 'marks-pane';
import Rendition from './rendition';
import { View } from './managers/helpers/views';
type MarkType = 'highlight' | 'underline' | 'mark';
type AnnotationData = {
    type: MarkType;
    cfiRange: string;
    data: Record<string, string>;
    sectionIndex: number;
    cb: undefined | ((annotation: Annotation) => void);
    className: string | undefined;
    styles: Record<string, string> | undefined;
};
/**
 * Handles managing adding & removing Annotations
 */
declare class Annotations {
    rendition: Rendition;
    highlights: Array<Annotation>;
    underlines: Array<Annotation>;
    marks: Array<Annotation>;
    _annotations: {
        [key: string]: Annotation;
    };
    _annotationsBySectionIndex: {
        [key: number]: Array<string>;
    };
    constructor(rendition: Rendition);
    /**
     * Add an annotation to store
     */
    add(type: MarkType, cfiRange: string, data: Record<string, string>, cb?: (annotation: Annotation) => void, className?: string, styles?: Record<string, string>): Annotation;
    /**
     * Remove an annotation from store
     * @param {EpubCFI} cfiRange EpubCFI range the annotation is attached to
     * @param {string} type Type of annotation to add: "highlight", "underline", "mark"
     */
    remove(cfiRange: string, type: MarkType): void;
    /**
     * Remove an annotations by Section Index
     * @private
     */
    _removeFromAnnotationBySectionIndex(sectionIndex: number, hash: string): void;
    /**
     * Get annotations by Section Index
     * @private
     */
    _annotationsAt(index: number): string[];
    /**
     * Add a highlight to the store
     */
    highlight(cfiRange: string, data: Record<string, string>, cb?: (annotation: Annotation) => void, className?: string, styles?: Record<string, string>): Annotation;
    /**
     * Add a underline to the store
     */
    underline(cfiRange: string, data: Record<string, string>, cb?: (annotation: Annotation) => void, className?: string, styles?: Record<string, string>): Annotation;
    /**
     * Add a mark to the store
  
     */
    mark(cfiRange: string, data: Record<string, string>, cb?: (annotation: Annotation) => void): Annotation;
    /**
     * iterate over annotations in the store
     */
    each(callback: (annotation: Annotation, index: number, array: Annotation[]) => void, thisArg?: unknown): void;
    /**
     * Hook for injecting annotation into a view
     */
    private inject;
    /**
     * Hook for removing annotation from a view
     */
    private clear;
    /**
     * [Not Implemented] Show annotations
     * @TODO: needs implementation in View
     */
    show(): void;
    /**
     * [Not Implemented] Hide annotations
     * @TODO: needs implementation in View
     */
    hide(): void;
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
declare class Annotation {
    type: MarkType;
    cfiRange: string;
    data: Record<string, string>;
    sectionIndex: number;
    mark: HTMLElement | undefined;
    _markInternal: HTMLElement | Node | {
        element: HTMLElement;
    } | Mark | null | undefined;
    cb: undefined | ((annotation: Annotation) => void);
    className: string | undefined;
    styles: Record<string, string> | undefined;
    emit: (event: string, ...args: unknown[]) => void;
    constructor({ type, cfiRange, data, sectionIndex, cb, className, styles, }: AnnotationData);
    /**
     * Update stored data
     */
    update(data: Record<string, string>): void;
    /**
     * Add to a view
     */
    attach(view: View): Node | Mark | {
        element: HTMLElement;
        range: Range;
    } | null;
    /**
     * Remove from a view
     */
    detach(view: View): void;
    text(): void;
}
export default Annotations;
