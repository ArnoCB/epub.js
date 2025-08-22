import Section from 'src/section';
import Contents from '../../contents';
import Layout from '../../layout';
import { Mark } from 'marks-pane';

// Use the canonical View declaration from the project's types to avoid
// duplicate/incompatible interface definitions between runtime sources
// and the ambient d.ts files.
// Start from the canonical View declaration in `types/managers/view.d.ts`
// and augment it with runtime properties that the Views collection expects.
// The canonical `types/managers/view` provides the public interface for Views.
// At runtime we also require several properties that are not expressible in
// the ambient declaration file (DOM element, displayed flag, helpers, etc.).
// Use an intersection so that whenever `View` is used in the codebase it has
// both the canonical shape and these runtime properties — this prevents
// TypeScript from treating it as the bare ambient type which may be missing
// methods used by the runtime (create, render, size, etc.).
// Get the instance type of the project's canonical View class (default export)
type CanonicalViewConstructor = typeof import('types/managers/view').default;
type CanonicalViewInstance = InstanceType<CanonicalViewConstructor>;

// Use Partial<> to avoid forcing our runtime View implementations to exactly
// match the possibly-outdated/generated ambient d.ts. The runtime code only
// needs a subset of the canonical API; making the canonical instance partial
// reduces spurious type errors while still preserving helpful type info.
export type View = CanonicalViewInstance & {
  // Runtime-only properties used throughout the codebase
  element: HTMLElement;
  displayed: boolean;
  section?: Section;
  index?: number;
  contents?: Contents;
  // Bounds may be a DOMRect or a simple width/height object in some views
  bounds(): DOMRect | { width: number; height: number } | undefined;
  offset(): { top: number; left: number };
  onDisplayed?(view?: View): void;
  display?(request?: (url: string) => Promise<Document>): Promise<unknown>;
  position?(): DOMRect;
  width?(): number;
  height?(): number;
  setLayout?(layout: Layout): void;
  onResize?(
    view: View,
    size?: {
      width: number;
      height: number;
      widthDelta: number;
      heightDelta: number;
    }
  ): void;
  locationOf?(target: HTMLElement | string): { left: number; top: number };
  highlight?: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  underline?: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  mark?: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void
  ) => { element: HTMLElement; range: Range } | Node | null;
  unhighlight?: (cfiRange: string) => void;
  ununderline?: (cfiRange: string) => void;
  unmark?: (cfiRange: string) => void;
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
