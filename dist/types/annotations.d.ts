import Rendition from './rendition';
import Annotation from './annotation';
import type { MarkType } from './types';
/**
 * Handles managing adding & removing Annotations
 */
export declare class Annotations {
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
export default Annotations;
