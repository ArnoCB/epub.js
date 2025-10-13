// Types for options and settings
export interface InlineViewOptions {
  ignoreClass?: string;
  axis?: 'vertical' | 'horizontal';
  width?: number;
  height?: number;
  layout?: Layout;
  globalLayoutProperties?: Record<string, unknown>;
  quest?: (url: string) => Promise<Document>;
  [key: string]: unknown;
}

export interface InlineViewSettings {
  // All properties from InlineViewOptions, but required after extend
  ignoreClass: string;
  axis: 'vertical' | 'horizontal';
  width: number;
  height: number;
  layout: Layout;
  globalLayoutProperties: Record<string, unknown>;
}

type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off' | 'once'>;

import EventEmitter from 'event-emitter';
import {
  extend,
  borders,
  uuid,
  isNumber,
  bounds,
  defer,
  parse,
} from '../../utils/core';
import EpubCFI from '../../epubcfi';
import Contents from '../../contents';
import { EVENTS } from '../../utils/constants';
import Layout from '../../layout';
import { View } from '../helpers/views';
import Section from '../../section';

class InlineView implements EventEmitterMethods, View {
  emit!: EventEmitter['emit'];
  on!: EventEmitter['on'];
  off!: EventEmitter['off'];
  once!: EventEmitter['once'];
  settings: InlineViewSettings;
  frame: HTMLDivElement | undefined;
  id: string;
  element: HTMLElement;
  index: number;
  section: Section;
  added: boolean = false;
  displayed: boolean = false;
  rendered: boolean = false;
  fixedWidth: number = 0;
  fixedHeight: number = 0;
  epubcfi: EpubCFI = new EpubCFI();
  layout: Layout;
  elementBounds:
    | {
        width: number;
        height: number;
      }
    | undefined;
  _width: number = 0;
  _height: number = 0;
  lockedWidth: number = 0;
  lockedHeight: number = 0;
  stopExpanding: boolean = false;
  resizing: boolean = false;
  _expanding: boolean = false;
  prevBounds:
    | {
        width: number;
        height: number;
      }
    | undefined;
  contents: Contents | undefined;
  rendering: boolean = false;
  _needsReframe: boolean = false;
  document: Document | undefined;
  window: Window | null | undefined;

  constructor(section: Section, options?: InlineViewOptions) {
    this.settings = extend(
      {
        ignoreClass: '',
        axis: 'vertical',
        width: 0,
        height: 0,
        layout: { format: () => {} },
        globalLayoutProperties: {},
        quest: undefined,
      },
      options || {}
    ) as InlineViewSettings;

    this.id = 'epubjs-view:' + uuid();
    this.section = section;
    this.index = section.index;

    this.element = this.container(this.settings.axis);
    this._width = this.settings.width;
    this._height = this.settings.height;

    this.layout = this.settings.layout;
    // Dom events to listen for
    // this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];
  }

  container(axis: string) {
    const element = document.createElement('div');

    element.classList.add('epub-view');

    // if(this.settings.axis === "horizontal") {
    //   element.style.width = "auto";
    //   element.style.height = "0";
    // } else {
    //   element.style.width = "0";
    //   element.style.height = "auto";
    // }

    element.style.overflow = 'hidden';

    if (axis && axis == 'horizontal') {
      element.style.display = 'inline-block';
    } else {
      element.style.display = 'block';
    }

    return element;
  }

  width() {
    return this._width;
  }

  height() {
    return this._height;
  }

  highlight(
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) {
    console.log('[Inline]: highlight', {
      cfiRange,
      data,
      cb,
      className,
      styles,
    });
    return undefined;
  }

  underline(
    cfiRange: string,
    data: Record<string, string> = {},
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) {
    console.log('[Inline]: underline', {
      cfiRange,
      data,
      cb,
      className,
      styles,
    });
    return undefined;
  }

  mark(
    cfiRange: string,
    data: Record<string, string> = {},
    cb?: (e: Event) => void
  ) {
    console.log('[Inline]: mark', { cfiRange, data, cb });
    return null;
  }

  unhighlight(cfiRange: string): void {
    console.log('[Inline]: unhighlight not implemented', cfiRange);
  }

  ununderline(cfiRange: string): void {
    console.log('[Inline]: ununderline not implemented', cfiRange);
  }

  unmark(cfiRange: string): void {
    console.log('[Inline]: unmark not implemented', cfiRange);
  }

  create() {
    if (this.frame) {
      return this.frame;
    }

    if (!this.element) {
      this.element = this.createContainer();
    }

    this.frame = document.createElement('div');
    this.frame.id = this.id;
    this.frame.style.overflow = 'hidden';
    this.frame.style.wordSpacing = 'initial';
    this.frame.style.lineHeight = 'initial';

    this.resizing = true;

    // this.frame.style.display = "none";
    this.element.style.visibility = 'hidden';
    this.frame.style.visibility = 'hidden';

    if (this.settings.axis === 'horizontal') {
      this.frame.style.width = 'auto';
      this.frame.style.height = '0';
    } else {
      this.frame.style.width = '0';
      this.frame.style.height = 'auto';
    }

    this._width = 0;
    this._height = 0;

    this.element.appendChild(this.frame);
    this.added = true;

    this.elementBounds = bounds(this.element);

    return this.frame;
  }

  render(request?: (url: string) => Promise<Document>, show: boolean = true) {
    // view.onLayout = this.layout.format.bind(this.layout);
    this.create();

    // Fit to size of the container, apply padding
    this.size();

    // Render Chain
    return this.section
      .render(request)
      .then((value) => {
        const contents = value as Contents;
        return this.load(contents);
      })
      .then(() => {
        // this.settings.layout.format(view.contents);
        // return this.hooks.layout.trigger(view, this);
      })
      .then(() => {
        // apply the layout function to the contents
        if (this.contents === undefined) {
          throw new Error('Contents not loaded');
        }

        this.settings.layout.format(this.contents);

        // Expand the iframe to the full size of the content
        // this.expand();

        // Listen for events that require an expansion of the iframe
        this.addListeners();

        if (show) {
          this.show();
        }
        this.emit(EVENTS.VIEWS.RENDERED, this.section);
      })
      .catch((e: Error) => {
        this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
      });
  }

  // Determine locks base on settings
  size(_width?: number, _height?: number) {
    const width = _width || this.settings.width;
    const height = _height || this.settings.height;

    if (this.layout.name === 'pre-paginated') {
      // TODO: check if these are different than the size set in chapter
      this.lock('both', width, height);
    } else if (this.settings.axis === 'horizontal') {
      this.lock('height', width, height);
    } else {
      this.lock('width', width, height);
    }
  }

  // Lock an axis to element dimensions, taking borders into account
  lock(what: string, width: number, height: number) {
    const elBorders = borders(this.element);
    let iframeBorders;

    if (this.frame) {
      iframeBorders = borders(this.frame);
    } else {
      iframeBorders = { width: 0, height: 0 };
    }

    if (what == 'width' && isNumber(width)) {
      this.lockedWidth = width - elBorders.width - iframeBorders.width;
      this.resize(this.lockedWidth, false); //  width keeps ratio correct
    }

    if (what == 'height' && isNumber(height)) {
      this.lockedHeight = height - elBorders.height - iframeBorders.height;
      this.resize(false, this.lockedHeight);
    }

    if (what === 'both' && isNumber(width) && isNumber(height)) {
      this.lockedWidth = width - elBorders.width - iframeBorders.width;
      this.lockedHeight = height - elBorders.height - iframeBorders.height;

      this.resize(this.lockedWidth, this.lockedHeight);
    }
  }

  // Resize a single axis based on content dimensions
  expand() {
    let width = this._width;
    let height = this._height;

    if (!this.frame || this._expanding) return;

    this._expanding = true;

    // Expand Horizontally
    if (this.settings.axis === 'horizontal') {
      width = this.contentWidth();
      // keep height
    } // Expand Vertically
    else if (this.settings.axis === 'vertical') {
      height = this.contentHeight();
      // keep width
    }

    // Only Resize if dimensions have changed or
    // if Frame is still hidden, so needs reframing
    if (this._needsReframe || width != this._width || height != this._height) {
      this.resize(width, height);
    }

    this._expanding = false;
  }

  contentWidth() {
    return this.frame?.scrollWidth || 0;
  }

  contentHeight() {
    return this.frame?.scrollHeight || 0;
  }

  resize(width: number | false, height: number | false) {
    if (!this.frame) return;

    if (isNumber(width)) {
      this.frame.style.width = width + 'px';
      this._width = width;
    }

    if (isNumber(height)) {
      this.frame.style.height = height + 'px';
      this._height = height;
    }

    this.prevBounds = this.elementBounds;

    this.elementBounds = bounds(this.element);

    const size = {
      width: this.elementBounds.width,
      height: this.elementBounds.height,
      widthDelta: this.elementBounds.width - this.prevBounds!.width,
      heightDelta: this.elementBounds.height - this.prevBounds!.height,
    };

    this.onResize(this, size);

    this.emit(EVENTS.VIEWS.RESIZED, size);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(content: string | any): Promise<any> {
    const loading = new defer();
    const loaded = loading.promise;

    // Normalize to a Document by parsing strings or extracting from Contents
    let doc: Document;
    if (typeof content === 'string') {
      doc = parse(content, 'text/html');
    } else {
      // content is a Contents instance
      doc = parse(content.content.innerHTML, 'text/html');
    }

    const body = doc.querySelector('body');

    if (body === null) {
      loading.reject(new Error('Failed to load contents'));
      return loaded;
    }

    /*
        var srcs = doc.querySelectorAll("[src]");

        Array.prototype.slice.call(srcs)
            .forEach(function(item) {
                var src = item.getAttribute("src");
                var assetUri = URI(src);
                var origin = assetUri.origin();
                var absoluteUri;

                if (!origin) {
                    absoluteUri = assetUri.absoluteTo(this.section.url);
                    item.src = absoluteUri;
                }
            }.bind(this));
        */
    this.frame!.innerHTML = body.innerHTML;

    this.document = this.frame!.ownerDocument;
    this.window = this.document.defaultView;

    if (this.frame === undefined) {
      throw new Error('frame not loaded');
    }

    this.contents = new Contents(this.document, this.frame);

    this.rendering = false;

    loading.resolve(this.contents);

    return loaded;
  }

  // Minimal stub to satisfy the View interface
  reset(): void {
    // no-op: implemented in other view types
  }

  // Set the axis for the view (horizontal / vertical)
  setAxis(axis: string): void {
    // accept string but coerce to expected axis
    this.settings.axis = axis as 'vertical' | 'horizontal';
    // recreate container with new axis if needed
    this.element = this.container(this.settings.axis);
  }

  // Called when content finishes loading; matches ambient signature
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad(_event: Event, _promise: any): void {
    // stub: override in concrete implementations
    void _event;
    void _promise;
  }

  /**
   * Stub for createContainer to resolve TypeScript errors.
   * Returns a new div element.
   */
  createContainer(): HTMLElement {
    return document.createElement('div');
  }

  setLayout(layout: Layout) {
    this.layout = layout;
  }

  resizeListenters() {
    // Test size again
    // clearTimeout(this.expanding);
    // this.expanding = setTimeout(this.expand.bind(this), 350);
  }

  addListeners() {
    //TODO: Add content listeners for expanding
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeListeners(_layoutFunc?: unknown) {
    //TODO: remove content listeners for expanding
  }

  display(request: (url: string) => Promise<Document>) {
    const displayed = new defer();

    if (!this.displayed) {
      this.render(request).then(() => {
        this.emit(EVENTS.VIEWS.DISPLAYED, this);
        this.onDisplayed();

        this.displayed = true;

        displayed.resolve(this);
      });
    } else {
      displayed.resolve(this);
    }

    return displayed.promise;
  }

  show() {
    this.element.style.visibility = 'visible';

    if (this.frame) {
      this.frame.style.visibility = 'visible';
    }

    this.emit(EVENTS.VIEWS.SHOWN, this);
  }

  hide() {
    // this.frame.style.display = "none";
    this.element.style.visibility = 'hidden';
    this.frame!.style.visibility = 'hidden';

    this.stopExpanding = true;
    this.emit(EVENTS.VIEWS.HIDDEN, this);
  }

  position(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  locationOf(target: HTMLElement) {
    const parentPos = this.frame!.getBoundingClientRect();

    if (this.contents === undefined) {
      throw new Error('Contents not loaded');
    }

    const targetPos = this.contents.locationOf(
      target,
      this.settings.ignoreClass
    );

    return {
      left: window.scrollX + parentPos.left + targetPos.left,
      top: window.scrollY + parentPos.top + targetPos.top,
    };
  }

  /**
   * Called when a view is displayed.
   * Override this method to add custom behavior.
   * @param {InlineView} view - The view that was displayed.
   * @suppress {eslint}
   */
  onDisplayed(view?: View) {
    console.log('[InlineView] onDisplayed called', view);
    // Stub, override with a custom functions
  }

  /**
   * Called when a view is resized.
   * Override this method to add custom behavior.
   * @param {InlineView} view - The view being resized.
   * @param {Event} e - The resize event.
   * @suppress {eslint}
   */
  onResize(
    view: View,
    size?: {
      width: number;
      height: number;
      widthDelta: number;
      heightDelta: number;
    }
  ) {
    // Stub: override with a custom function
    void view;
    void size; // Suppress eslint no-unused-vars
  }

  bounds() {
    if (!this.elementBounds) {
      this.elementBounds = bounds(this.element);
    }
    return this.elementBounds;
  }

  offset(): {
    top: number;
    left: number;
  } {
    return {
      top: this.element.offsetTop,
      left: this.element.offsetLeft,
    };
  }

  destroy() {
    if (this.displayed) {
      this.displayed = false;

      this.removeListeners();

      this.stopExpanding = true;
      this.element.removeChild(this.frame!);
      this.displayed = false;
      this.frame = undefined;
    }
  }
}

EventEmitter(InlineView.prototype);

export default InlineView;
