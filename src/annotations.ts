import Rendition from './rendition';
import { View } from './managers/helpers/views';
import Annotation from './annotation';
import EpubCFI from './epubcfi';

type MarkType = 'highlight' | 'underline' | 'mark';

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

export default Annotations;
