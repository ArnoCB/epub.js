import type { MarkType, View, AnnotationData } from './types';
/**
 * Annotation object
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
export declare class Annotation {
    private _events;
    emit(type: string, ...args: unknown[]): void;
    type: MarkType;
    cfiRange: string;
    data: Record<string, string>;
    sectionIndex: number;
    mark: HTMLElement | undefined;
    _markInternal: HTMLElement | Node | {
        element: HTMLElement;
    } | null | undefined;
    cb: undefined | ((annotation: Annotation) => void);
    className: string | undefined;
    styles: Record<string, string> | undefined;
    constructor({ type, cfiRange, data, sectionIndex, cb, className, styles, }: AnnotationData);
    /**
     * Update stored data
     */
    update(data: Record<string, string>): void;
    /**
     * Add to a view
     */
    attach(view: View): Node | import("marks-pane", { with: { "resolution-mode": "import" } }).Mark | {
        element: HTMLElement;
        range: Range;
    } | null;
    /**
     * Remove from a view
     */
    detach(view: View): void;
    text(): void;
}
export default Annotation;
