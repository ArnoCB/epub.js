import Section from '../../section';
import Contents from '../../contents';
import Layout from '../../layout';
import { Mark } from 'marks-pane';
import EventEmitter from 'event-emitter';

type CanonicalViewConstructor =
  typeof import('../../types/canonical-view').default;
type CanonicalViewInstance = InstanceType<CanonicalViewConstructor>;

export type View = CanonicalViewInstance & {
  on: EventEmitter['on'];
  emit: EventEmitter['emit'];
  off: EventEmitter['off'];
  once: EventEmitter['once'];
  // Runtime-only properties used throughout the codebase
  element: HTMLElement;
  displayed: boolean;
  section?: Section;
  index: number;
  contents?: Contents;
  // Bounds may be a DOMRect or a simple width/height object in some views
  bounds(): DOMRect | { width: number; height: number } | undefined;
  offset(): { top: number; left: number };
  onDisplayed(view?: View): void;
  display(request?: (url: string) => Promise<Document>): Promise<unknown>;
  position(): DOMRect;
  width(): number;
  height(): number;
  size(width?: number, height?: number): void;
  setLayout(layout: Layout): void;
  onResize?(
    view: View,
    size?: {
      width: number;
      height: number;
      widthDelta: number;
      heightDelta: number;
    }
  ): void;
  locationOf(target: HTMLElement | string): { left: number; top: number };
  highlight: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  underline: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  mark: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void
  ) => { element: HTMLElement; range: Range } | Node | null;
  unhighlight: (cfiRange: string) => void;
  ununderline: (cfiRange: string) => void;
  unmark: (cfiRange: string) => void;
  show: () => void;
  hide: () => void;

  destroy: () => void;
};

export type ViewConstructor = new (
  section: Section,
  options: Record<string, unknown>
) => View;

class Views {
  container: HTMLElement;
  _views: View[];
  length: number;
  hidden: boolean;

  constructor(container: HTMLElement) {
    this.container = container;
    this._views = [];
    this.length = 0;
    this.hidden = false;
  }

  all() {
    return this._views;
  }

  first() {
    return this._views[0];
  }

  last() {
    return this._views[this._views.length - 1];
  }

  indexOf(view: View) {
    return this._views.indexOf(view);
  }

  slice(...args: number[]) {
    return this._views.slice(...args);
  }

  get(i: number) {
    return this._views[i];
  }

  append(view: View) {
    this._views.push(view);
    if (this.container) {
      try {
        // Trace when views are appended to help debug layout invalidation
        // Note: Debug logging removed to reduce test output noise
        try {
          // Use bracket notation to avoid `any` lint rules
          // Use unknown cast to avoid explicit any
          const w = window as unknown as Record<string, unknown>;
          if (!Array.isArray(w['__prerender_trace'])) {
            w['__prerender_trace'] = [];
          }
          (w['__prerender_trace'] as string[]).push(
            'Views.append: ' + (view.section && view.section.href)
          );
        } catch (err) {
          // ignore trace push errors
          void err;
        }
      } catch {
        // ignore
      }
      // WARNING: appendChild() with iframe elements causes content loss!
      // For prerendered content, this DOM move will clear iframe content.
      // The prerenderer should handle content preservation/restoration.
      // We CANNOT avoid iframes due to security requirements - EPUBs contain
      // untrusted JavaScript that must be sandboxed for user safety.
      this.container.appendChild(view.element);
    }
    this.length++;
    return view;
  }

  prepend(view: View) {
    this._views.unshift(view);
    if (this.container) {
      this.container.insertBefore(view.element, this.container.firstChild);
    }
    this.length++;
    return view;
  }

  insert(view: View, index: number) {
    this._views.splice(index, 0, view);

    if (this.container) {
      if (index < this.container.children.length) {
        this.container.insertBefore(
          view.element,
          this.container.children[index]
        );
      } else {
        this.container.appendChild(view.element);
      }
    }

    this.length++;
    return view;
  }

  remove(view: View) {
    const index = this._views.indexOf(view);

    if (index > -1) {
      this._views.splice(index, 1);
    }

    this.destroy(view);

    this.length--;
  }

  destroy(view: View) {
    if (view.displayed) {
      view.destroy!();
    }

    if (this.container) {
      this.container.removeChild(view.element);
    }
  }

  // Iterators
  forEach(callback: (view: View) => void) {
    return this._views.forEach(callback);
  }

  clear() {
    // Remove all views
    let view;
    const len = this.length;

    if (!this.length) return;

    for (let i = 0; i < len; i++) {
      view = this._views[i];
      this.destroy(view);
    }

    this._views = [];
    this.length = 0;
  }

  find(section: { index: number }) {
    let view;
    const len = this.length;

    for (let i = 0; i < len; i++) {
      view = this._views[i];
      if (view.displayed && view.section?.index == section.index) {
        return view;
      }
    }
  }

  displayed() {
    const displayed = [];
    let view;
    const len = this.length;

    for (let i = 0; i < len; i++) {
      view = this._views[i];
      if (view.displayed) {
        displayed.push(view);
      }
    }
    return displayed;
  }

  show() {
    let view;
    const len = this.length;

    for (let i = 0; i < len; i++) {
      view = this._views[i];
      if (view.displayed) {
        view.show!();
      }
    }

    this.hidden = false;
  }

  hide() {
    let view;
    const len = this.length;

    for (let i = 0; i < len; i++) {
      view = this._views[i];
      if (view.displayed) {
        view.hide!();
      }
    }

    this.hidden = true;
  }
}

export default Views;
