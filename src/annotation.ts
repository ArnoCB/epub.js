import EventEmitter from 'event-emitter';
import { EVENTS } from './utils/constants';
import { View } from './managers/helpers/views';
import type { MarkType, AnnotationData } from './types';

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
export class Annotation {
  public type: MarkType;
  public cfiRange: string;
  public data: Record<string, string>;
  public sectionIndex: number;
  public mark: HTMLElement | undefined;
  public _markInternal:
    | HTMLElement
    | Node
    | { element: HTMLElement }
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

    const cbWrapper: ((e: Event) => void) | undefined = cb
      ? () => {
          cb(this);
        }
      : undefined;

    if (type === 'highlight') {
      result = view.highlight(cfiRange, data, cbWrapper, className, styles);
    } else if (type === 'underline') {
      result = view.underline(cfiRange, data, cbWrapper, className, styles);
    } else if (type === 'mark') {
      result = view.mark(cfiRange, data, cbWrapper);
    }

    if (typeof result === 'undefined') {
      throw new Error(`Failed to attach annotation of type ${type} to view`);
    }

    this._markInternal = result as
      | HTMLElement
      | Node
      | { element: HTMLElement }
      | null
      | undefined;

    if (result && typeof result === 'object' && 'element' in result) {
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

export default Annotation;
