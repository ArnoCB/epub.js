import EventEmitter from 'event-emitter';
import { Mark } from 'marks-pane';
import EpubCFI from './epubcfi';
import { EVENTS } from './utils/constants';
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
class Annotations {
  public rendition: Rendition;
  public highlights: Array<Annotation> = [];
  public underlines: Array<Annotation> = [];
  public marks: Array<Annotation> = [];
  public _annotations: { [key: string]: Annotation } = {};
  public _annotationsBySectionIndex: { [key: number]: Array<string> } = {};

  constructor(rendition: Rendition) {
    this.rendition = rendition;
    this.rendition.hooks.render.register(this.inject.bind(this));
    this.rendition.hooks.unloaded.register(this.clear.bind(this));
  }

  /**
   * Add an annotation to store
   */
  add(
    type: MarkType,
    cfiRange: string,
    data: Record<string, string>,
    cb?: (annotation: Annotation) => void,
    className?: string,
    styles?: Record<string, string>
  ): Annotation {
    const hash = encodeURI(cfiRange + type);
    const cfi = new EpubCFI(cfiRange);
    const sectionIndex = cfi.spinePos;
    const annotation: Annotation = new Annotation({
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
    } else {
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
  remove(cfiRange: string, type: MarkType) {
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
  _removeFromAnnotationBySectionIndex(sectionIndex: number, hash: string) {
    this._annotationsBySectionIndex[sectionIndex] = this._annotationsAt(
      sectionIndex
    ).filter((h) => h !== hash);
  }

  /**
   * Get annotations by Section Index
   * @private
   */
  _annotationsAt(index: number) {
    return this._annotationsBySectionIndex[index];
  }

  /**
   * Add a highlight to the store
   */
  highlight(
    cfiRange: string,
    data: Record<string, string>,
    cb?: (annotation: Annotation) => void,
    className?: string,
    styles?: Record<string, string>
  ) {
    return this.add('highlight', cfiRange, data, cb, className, styles);
  }

  /**
   * Add a underline to the store
   */
  underline(
    cfiRange: string,
    data: Record<string, string>,
    cb?: (annotation: Annotation) => void,
    className?: string,
    styles?: Record<string, string>
  ) {
    return this.add('underline', cfiRange, data, cb, className, styles);
  }

  /**
   * Add a mark to the store

   */
  mark(
    cfiRange: string,
    data: Record<string, string>,
    cb?: (annotation: Annotation) => void
  ) {
    return this.add('mark', cfiRange, data, cb);
  }

  /**
   * iterate over annotations in the store
   */
  each(
    callback: (
      annotation: Annotation,
      index: number,
      array: Annotation[]
    ) => void,
    thisArg?: unknown
  ): void {
    Object.values(this._annotations).forEach(callback, thisArg);
  }

  /**
   * Hook for injecting annotation into a view
   */
  private inject(view: View) {
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
  private clear(view: View) {
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
  show() {}

  /**
   * [Not Implemented] Hide annotations
   * @TODO: needs implementation in View
   */
  hide() {}
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
  public type: MarkType;
  public cfiRange: string;
  public data: Record<string, string>;
  public sectionIndex: number;
  public mark: HTMLElement | undefined;
  // Views may return different types for marks (HTMLElement, Node, Mark, etc.).
  // Allow a union for the most common return shapes.
  public _markInternal:
    | HTMLElement
    | Node
    | { element: HTMLElement }
    | Mark
    | null
    | undefined;
  public cb: undefined | ((annotation: Annotation) => void);
  public className: string | undefined;
  public styles: Record<string, string> | undefined;
  public emit!: (event: string, ...args: unknown[]) => void;

  constructor({
    type,
    cfiRange,
    data,
    sectionIndex,
    cb,
    className,
    styles,
  }: AnnotationData) {
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
  update(data: Record<string, string>) {
    this.data = data;
  }

  /**
   * Add to a view
   */
  attach(view: View) {
    const { cfiRange, data, type, cb, className, styles } = this;
    let result;

    // The view API expects DOM event handlers like (e: Event) => void.
    // User-provided callbacks on Annotation are typed as (annotation: Annotation) => void,
    // so wrap them into an Event handler that forwards the Annotation instance.
    const cbWrapper: ((e: Event) => void) | undefined = cb
      ? () => {
          cb(this);
        }
      : undefined;

    console.log(
      `[Annotations] Attempting to add ${type} annotation with CFI: ${cfiRange}`
    );
    console.log(
      `[Annotations] Found view:`,
      view ? view.constructor.name : 'null'
    );

    if (type === 'highlight') {
      console.log(
        `[Annotations] Calling view.highlight() on ${view ? view.constructor.name : 'null'}`
      );
      result = view.highlight(cfiRange, data, cbWrapper, className, styles);
      console.log(`[Annotations] view.highlight() returned:`, result);
    } else if (type === 'underline') {
      result = view.underline(cfiRange, data, cbWrapper, className, styles);
    } else if (type === 'mark') {
      result = view.mark(cfiRange, data, cbWrapper);
    }

    if (typeof result === 'undefined') {
      throw new Error(`Failed to attach annotation of type ${type} to view`);
    }

    this._markInternal = result;
    // Try to set a HTMLElement mark if possible
    if (result && typeof result === 'object' && 'element' in result) {
      // Mark object with element property
      this.mark = (result as { element: HTMLElement }).element as HTMLElement;
    } else if (result instanceof HTMLElement) {
      this.mark = result as HTMLElement;
    } else {
      this.mark = undefined;
    }
    this.emit(EVENTS.ANNOTATION.ATTACH, result);
    return result;
  }

  /**
   * Remove from a view
   */
  detach(view: View) {
    const { cfiRange, type } = this;
    let result;

    if (view) {
      if (type === 'highlight') {
        result = view.unhighlight(cfiRange);
      } else if (type === 'underline') {
        result = view.ununderline(cfiRange);
      } else if (type === 'mark') {
        result = view.unmark(cfiRange);
      }
    }

    this.mark = undefined;
    this.emit(EVENTS.ANNOTATION.DETACH, result);
    return result;
  }

  text() {}
}

EventEmitter(Annotation.prototype);

export default Annotations;
