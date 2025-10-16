import EventEmitter from 'event-emitter';
import {
  extend,
  borders,
  uuid,
  isNumber,
  bounds,
  defer,
  createBlobUrl,
  revokeBlobUrl,
} from '../../utils/core';
import EpubCFI from '../../epubcfi';
import Contents from '../../contents';
import { EVENTS } from '../../utils/constants';
import { Highlight, Underline, Mark } from 'marks-pane';
import { View } from '../helpers/views';
import Layout from '../../layout';
import Section from '../../section';
import { StyledPane } from './styled-pane';
import type {
  ExtendedIFrameElement,
  IframeViewSettings,
  MarkElementMap,
} from '../../types';
import type { Axis } from '../../enums';
import type { EventEmitterMethods } from '../../types';

class IframeView implements View, EventEmitterMethods {
  emit!: EventEmitterMethods['emit'];
  on!: EventEmitterMethods['on'];
  off!: EventEmitterMethods['off'];
  once!: EventEmitterMethods['once'];

  settings: IframeViewSettings;

  frame: HTMLIFrameElement | undefined;
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
  pane: StyledPane | undefined;
  highlights: MarkElementMap = {};
  underlines: MarkElementMap = {};

  marks: {
    [key: string]: {
      element: HTMLElement;
      range: Range;
      listeners: Array<(e: Event) => void>;
    };
  } = {};
  iframe: ExtendedIFrameElement | undefined;
  supportsSrcdoc: boolean | undefined;
  window: Window | undefined;
  document: Document | undefined;
  sectionRender: Promise<string> | undefined;
  writingMode: string | undefined;
  contents: Contents | undefined;
  _textWidth: number | undefined;
  _contentWidth: number | undefined;
  _textHeight: number | undefined;
  _contentHeight: number | undefined;
  _needsReframe: boolean = false;
  blobUrl: string | undefined;
  axis?: Axis;
  rendering: boolean = false;
  prevBounds:
    | {
        width: number;
        height: number;
      }
    | undefined;

  constructor(section: Section, options: Partial<IframeViewSettings> = {}) {
    this.settings = extend(
      {
        ignoreClass: '',
        axis: undefined, //options.layout && options.layout.props.flow === "scrolled" ? "vertical" : "horizontal",
        direction: undefined,
        width: 0,
        height: 0,
        layout: undefined,
        globalLayoutProperties: {},
        method: undefined,
        forceRight: false,
        allowScriptedContent: false,
        allowPopups: false,
        transparency: false, // New option for transparent background
      },
      options || {}
    );

    this.id = 'epubjs-view-' + uuid();
    this.section = section;
    this.index = section.index;

    if (this.settings.axis === undefined) {
      throw new Error('Axis is not defined');
    }

    this.element = this.container(this.settings.axis);

    this.added = false;
    this.displayed = false;
    this.rendered = false;

    this.fixedWidth = 0;
    this.fixedHeight = 0;

    // Blank Cfi for Parsing
    this.epubcfi = new EpubCFI();

    this.layout = this.settings.layout!;
    // Dom events to listen for
    // this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];

    this.pane = undefined;
    this.highlights = {};
    this.underlines = {};
    this.marks = {};
  }

  container(axis: Axis) {
    const element = document.createElement('div');

    element.classList.add('epub-view');

    // this.element.style.minHeight = "100px";
    element.style.height = '0px';
    element.style.width = '0px';
    element.style.overflow = 'hidden';
    element.style.position = 'relative';
    element.style.display = 'block';

    if (axis && axis === 'horizontal') {
      element.style.flex = 'none';
    } else {
      element.style.flex = 'initial';
    }

    return element;
  }

  create() {
    if (this.iframe) return this.iframe;

    if (!this.element) {
      this.element = this.createContainer();
    }

    this.iframe = document.createElement('iframe');
    this.iframe.id = this.id;
    this.iframe.scrolling = 'no'; // Might need to be removed: breaks ios width calculations
    this.iframe.style.overflow = 'hidden';
    this.iframe.seamless = 'seamless';
    this.iframe.style.border = 'none';

    // Set transparent background if option is enabled
    if (this.settings.transparency) {
      this.iframe.style.background = 'transparent';
      this.iframe.allowTransparency = 'true';
    }

    // sandbox
    this.iframe.sandbox = 'allow-same-origin';

    if (this.settings.allowScriptedContent) {
      this.iframe.sandbox += ' allow-scripts';
    }

    if (this.settings.allowPopups) {
      this.iframe.sandbox += ' allow-popups';
    }

    this.iframe.setAttribute('enable-annotation', 'true');

    this.resizing = true;

    // this.iframe.style.display = "none";
    this.element.style.visibility = 'hidden';
    this.iframe.style.visibility = 'hidden';

    this.iframe.style.width = '0';
    this.iframe.style.height = '0';
    this._width = 0;
    this._height = 0;

    this.element.setAttribute('ref', String(this.index));

    this.added = true;

    this.elementBounds = bounds(this.element);

    if ('srcdoc' in this.iframe) {
      this.supportsSrcdoc = true;
    } else {
      this.supportsSrcdoc = false;
    }

    if (!this.settings.method) {
      this.settings.method = this.supportsSrcdoc ? 'srcdoc' : 'write';
    }

    return this.iframe;
  }

  /**
   * Stub for createContainer to resolve TypeScript errors.
   * Returns a new div element.
   */
  createContainer(): HTMLElement {
    return document.createElement('div');
  }

  async render(request?: (url: string) => Promise<Document>): Promise<void> {
    this.create();

    // Fit to size of the container, apply padding
    this.size();

    if (!this.sectionRender) {
      this.sectionRender = this.section.render(request) as Promise<string>;
    }

    // Render Chain
    return this.sectionRender
      .then((contents: string) => {
        return this.load(contents);
      })
      .then(() => {
        // find and report the writingMode axis
        const writingMode = this.contents!.writingMode();

        // Set the axis based on the flow and writing mode
        let axis: Axis;
        if (this.settings.flow === 'scrolled') {
          axis =
            writingMode!.indexOf('vertical') === 0 ? 'horizontal' : 'vertical';
        } else {
          axis =
            writingMode!.indexOf('vertical') === 0 ? 'vertical' : 'horizontal';
        }

        if (
          writingMode!.indexOf('vertical') === 0 &&
          this.settings.flow === 'paginated'
        ) {
          this.layout.delta = this.layout.height;
        }

        this.setAxis(axis);
        this.emit(EVENTS.VIEWS.AXIS, axis);

        this.setWritingMode(writingMode!);
        this.emit(EVENTS.VIEWS.WRITING_MODE, writingMode!);

        // apply the layout function to the contents
        this.layout.format(this.contents!, this.section, this.axis);

        // Listen for events that require an expansion of the iframe
        this.addListeners();

        // Expand the iframe to the full size of the content
        this.expand();
        if (this.settings.forceRight) {
          this.element.style.marginLeft = this.width() + 'px';
        }
      })
      .then(() => {
        // Mark as rendered for external checks
        this.rendered = true;
        this.emit(EVENTS.VIEWS.RENDERED, this.section);
      })
      .catch((e: Event) => {
        this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
        return Promise.reject(e);
      });
  }

  reset() {
    if (this.iframe) {
      this.iframe.style.width = '0';
      this.iframe.style.height = '0';
      this._width = 0;
      this._height = 0;
      this._textWidth = undefined;
      this._contentWidth = undefined;
      this._textHeight = undefined;
      this._contentHeight = undefined;
    }
    this._needsReframe = true;
  }

  // Determine locks base on settings
  size(_width?: number, _height?: number) {
    // Prefer explicit numeric sizes. If not provided (or non-numeric),
    // measure the containing element so pages are sized to the container,
    // not the window.
    let width = _width ?? this.settings.width;
    let height = _height ?? this.settings.height;

    // If width/height are not numeric, fall back to the element's bounding rect
    try {
      const rect = this.element.getBoundingClientRect();
      if (!isNumber(width) || width === 0) {
        width = Math.floor(rect.width);
      }
      if (!isNumber(height) || height === 0) {
        height = Math.floor(rect.height);
      }
    } catch {
      // if element is not yet in the DOM, leave provided values
    }

    if (this.layout && this.layout.name === 'pre-paginated') {
      this.lock('both', width as number, height as number);
    } else if (this.settings.axis === 'horizontal') {
      this.lock('height', width as number, height as number);
    } else {
      this.lock('width', width as number, height as number);
    }

    this.settings.width = width as number;
    this.settings.height = height as number;
  }

  // Lock an axis to element dimensions, taking borders into account
  lock(what: 'width' | 'height' | 'both', width: number, height: number) {
    const elBorders = borders(this.element);
    let iframeBorders;

    if (this.iframe) {
      iframeBorders = borders(this.iframe);
    } else {
      iframeBorders = { width: 0, height: 0 };
    }

    if (what == 'width' && isNumber(width)) {
      this.lockedWidth = width - elBorders.width - iframeBorders.width;
      // this.resize(this.lockedWidth, width); //  width keeps ratio correct
    }

    if (what == 'height' && isNumber(height)) {
      this.lockedHeight = height - elBorders.height - iframeBorders.height;
      // this.resize(width, this.lockedHeight);
    }

    if (what === 'both' && isNumber(width) && isNumber(height)) {
      this.lockedWidth = width - elBorders.width - iframeBorders.width;
      this.lockedHeight = height - elBorders.height - iframeBorders.height;
      // this.resize(this.lockedWidth, this.lockedHeight);
    }

    if (this.displayed && this.iframe) {
      // this.contents.layout();
      this.expand();
    }
  }

  // Resize a single axis based on content dimensions
  expand(): void {
    let width = this.lockedWidth;
    let height = this.lockedHeight;
    let columns;

    if (!this.iframe || this._expanding) return;
    this._expanding = true;

    // Pre-paginated layout
    if (this.layout.name === 'pre-paginated') {
      width = this.layout?.columnWidth ?? width;
      height = this.layout?.height ?? height;
    }
    // Horizontal axis
    else if (this.settings.axis === 'horizontal') {
      if (!this.contents) throw new Error('Contents not loaded');
      if (!this.layout) throw new Error('Layout not defined');

      width = this.contents.textWidth();

      if (this.layout?.pageWidth && width % this.layout.pageWidth > 0) {
        width =
          Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
      }

      if (this.settings.forceEvenPages && this.layout?.pageWidth) {
        columns = width / this.layout.pageWidth;
        if (
          this.layout?.divisor &&
          this.layout.divisor > 1 &&
          this.layout.name === 'reflowable' &&
          columns % 2 > 0
        ) {
          width += this.layout.pageWidth;
        }
      }
    }
    // Vertical axis
    else if (this.settings.axis === 'vertical') {
      if (!this.contents) throw new Error('Contents not loaded');
      height = this.contents.textHeight();
      if (
        this.settings.flow === 'paginated' &&
        this.layout?.height &&
        height % this.layout.height > 0
      ) {
        height = Math.ceil(height / this.layout.height) * this.layout.height;
      }
    }

    // Spread mode support
    if (
      this.layout &&
      this.layout._spread && // or use a getter if available
      typeof this.layout.pageWidth === 'number' &&
      typeof this.layout.divisor === 'number' &&
      this.layout.divisor > 1
    ) {
      // Spread mode logic
      const spreadWidth = this.layout.pageWidth * this.layout.divisor;
      if (
        this._needsReframe ||
        spreadWidth != this._width ||
        height != this._height
      ) {
        this.reframe(spreadWidth, height);
      }
    } else {
      if (
        this._needsReframe ||
        width != this._width ||
        height != this._height
      ) {
        this.reframe(width, height);
      }
    }

    this._expanding = false;
  }

  reframe(width: number, height: number) {
    if (this.iframe === undefined) {
      throw new Error('Iframe not defined');
    }

    if (isNumber(width)) {
      this.element.style.width = width + 'px';
      this.iframe.style.width = width + 'px';
      this._width = width;
    }

    if (isNumber(height)) {
      this.element.style.height = height + 'px';
      this.iframe.style.height = height + 'px';
      this._height = height;
    }

    const widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
    const heightDelta = this.prevBounds
      ? height - this.prevBounds.height
      : height;

    const size = {
      width: width,
      height: height,
      widthDelta: widthDelta,
      heightDelta: heightDelta,
    };

    this.pane?.render();

    requestAnimationFrame(() => {
      let mark: { element: HTMLElement; range: Range } | undefined;
      for (const m in this.marks) {
        if (Object.prototype.hasOwnProperty.call(this.marks, m)) {
          mark = this.marks[m];
          this.placeMark(mark.element, mark.range);
        }
      }
    });

    this.onResize(this, size);
    this.emit(EVENTS.VIEWS.RESIZED, size);
    this.prevBounds = size;

    this.elementBounds = bounds(this.element);
  }

  load(contents: string): Promise<Contents> {
    const loading = new defer<Contents>();

    if (!this.iframe) {
      loading.reject(new Error('No Iframe Available'));
      return loading.promise;
    }

    this.iframe.onload = (event) => {
      this.onLoad(event, loading);
    };

    if (this.settings.method === 'blobUrl') {
      this.blobUrl = createBlobUrl(contents, 'application/xhtml+xml');
      this.iframe.src = this.blobUrl!;
      this.element.appendChild(this.iframe);
      return loading.promise;
    }

    if (this.settings.method === 'srcdoc') {
      this.iframe.srcdoc = contents;
      this.element.appendChild(this.iframe);
      return loading.promise;
    }

    this.element.appendChild(this.iframe);
    this.document = this.iframe.contentDocument ?? undefined;

    if (!this.document) {
      loading.reject(new Error('No Document Available'));
      return loading.promise;
    }

    this.iframe.contentDocument?.open();
    this.iframe.contentDocument?.write(contents);
    this.iframe.contentDocument?.close();

    return loading.promise;
  }

  /**
   * Essential setup for Contents object - used by both normal onLoad and prerendering
   * This contains only the safe and essential parts needed for highlighting to work
   */
  setupContentsForHighlighting(
    iframe: HTMLIFrameElement,
    section: Section,
    transparency?: boolean
  ): Contents | null {
    const document = iframe.contentDocument;

    if (!document) {
      console.warn('[IframeView] No document available for Contents setup');
      return null;
    }

    // Inject transparent background if option is enabled
    if (transparency && document.body) {
      document.body.style.background = 'transparent';
      // Also inject a style tag for full coverage
      const style = document.createElement('style');
      style.innerHTML = 'html, body { background: transparent !important; }';
      document.head.appendChild(style);
    }

    // Create Contents object (essential for highlighting)
    const contents = new Contents(
      document,
      document.body,
      section.cfiBase,
      section.index
    );

    // Set up canonical link (safe)
    let link = document.querySelector("link[rel='canonical']");
    if (link) {
      if (section.canonical) {
        link.setAttribute('href', section.canonical);
      }
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      if (section.canonical) {
        link.setAttribute('href', section.canonical);
      }
      document.querySelector('head')?.appendChild(link);
    }

    return contents;
  }

  /**
   * Ensures Contents object exists for highlighting/underlining - works for both normal and prerendered views
   */
  private ensureContentsForMarking(): boolean {
    if (this.contents) return true;

    // For prerendered views, try to create Contents on-the-fly
    if (this.iframe && this.iframe.contentDocument && this.section) {
      try {
        const contents = this.setupContentsForHighlighting(
          this.iframe,
          this.section,
          this.settings.transparency
        );

        if (contents) {
          this.window = this.iframe.contentWindow ?? undefined;
          this.document = this.iframe.contentDocument;
          this.contents = contents;

          return true;
        }

        console.warn(
          '[IframeView] Failed to create Contents for prerendered view - helper returned null'
        );

        return false;
      } catch (e) {
        console.warn(
          '[IframeView] Error creating Contents for prerendered view:',
          e
        );

        return false;
      }
    }

    console.warn(
      '[IframeView] Cannot create Contents - missing iframe, document, or section',
      {
        hasIframe: !!this.iframe,
        hasDocument: !!(this.iframe && this.iframe.contentDocument),
        hasSection: !!this.section,
      }
    );

    return false;
  }

  onLoad(event: Event, promise: defer<Contents>) {
    if (this.iframe === undefined) {
      throw new Error('Iframe not defined');
    }

    this.window = this.iframe.contentWindow ?? undefined;
    this.document = this.iframe.contentDocument ?? undefined;

    if (this.document === undefined) {
      throw new Error('Document not defined');
    }

    // Use the shared helper for essential Contents setup
    const contents = this.setupContentsForHighlighting(
      this.iframe,
      this.section,
      this.settings.transparency
    );

    if (!contents) {
      throw new Error('Failed to create Contents object');
    }

    this.contents = contents;

    this.rendering = false;

    // Set up event listeners for layout operations (may be disruptive for prerendered content)
    this.contents.on(EVENTS.CONTENTS.EXPAND, () => {
      if (this.displayed && this.iframe) {
        this.expand();
        if (this.contents) {
          this.layout.format(this.contents);
        }
      }
    });

    this.contents.on(EVENTS.CONTENTS.RESIZE, () => {
      if (this.displayed && this.iframe) {
        this.expand();
        if (this.contents) {
          this.layout.format(this.contents);
        }
      }
    });

    promise.resolve(this.contents);
  }

  setLayout(layout: Layout) {
    this.layout = layout;

    if (this.contents) {
      this.layout.format(this.contents);
      this.expand();
    }
  }

  setAxis(axis: Axis) {
    this.settings.axis = axis;

    if (axis == 'horizontal') {
      this.element.style.flex = 'none';
    } else {
      this.element.style.flex = 'initial';
    }

    this.size();
  }

  setWritingMode(mode: string) {
    // this.element.style.writingMode = writingMode;
    this.writingMode = mode;
  }

  addListeners() {
    //TODO: Add content listeners for expanding
  }

  removeListeners() {
    //TODO: remove content listeners for expanding
  }

  display(request?: (url: string) => Promise<Document>) {
    const displayed = new defer();

    if (!this.displayed) {
      this.render(request).then(
        () => {
          this.emit(EVENTS.VIEWS.DISPLAYED, this);
          this.onDisplayed(this);

          this.displayed = true;
          displayed.resolve(this);
        },
        function (err: Error) {
          displayed.reject(err);
        }
      );
    } else {
      displayed.resolve(this);
    }

    return displayed.promise;
  }

  show() {
    this.element.style.visibility = 'visible';

    if (this.iframe) {
      this.iframe.style.visibility = 'visible';

      // Remind Safari to redraw the iframe
      this.iframe.style.transform = 'translateZ(0)';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.iframe.offsetWidth;
      // @ts-expect-error Part of a redrawing hack for Safari
      this.iframe.style.transform = null;
    }

    this.emit(EVENTS.VIEWS.SHOWN, this);
  }

  hide() {
    // this.iframe.style.display = "none";
    this.element.style.visibility = 'hidden';
    if (this.iframe) {
      this.iframe.style.visibility = 'hidden';
    }

    this.stopExpanding = true;
    this.emit(EVENTS.VIEWS.HIDDEN, this);
  }

  offset() {
    return {
      top: this.element.offsetTop,
      left: this.element.offsetLeft,
    };
  }

  width() {
    return this._width;
  }

  height() {
    return this._height;
  }

  position(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  locationOf(target: HTMLElement) {
    if (this.contents === undefined) {
      throw new Error('Contents not loaded');
    }

    const targetPos = this.contents.locationOf(
      target,
      this.settings.ignoreClass
    );

    return {
      left: targetPos.left,
      top: targetPos.top,
    };
  }

  onDisplayed(view?: View) {
    console.log('[InlineView] onDisplayed called', view);
    // Stub, override with a custom functions
  }

  onResize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _viewer: View,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _newSize?: {
      width: number;
      height: number;
      widthDelta: number;
      heightDelta: number;
    }
  ) {
    // Stub, override with a custom functions
  }

  bounds(force: boolean = false) {
    if (force || !this.elementBounds) {
      this.elementBounds = bounds(this.element);
    }

    return this.elementBounds;
  }

  highlight(
    cfiRange: string,
    data: Record<string, string> = {},
    cb?: (e: Event) => void,
    className = 'epubjs-hl',
    styles = {}
  ): Mark | undefined {
    if (!this.ensureContentsForMarking()) return;

    let attributes;

    if (this.settings.transparency) {
      attributes = Object.assign(
        { fill: 'yellow', 'fill-opacity': '1.0', 'mix-blend-mode': 'normal' },
        styles
      );
    } else {
      attributes = Object.assign(
        { fill: 'yellow', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply' },
        styles
      );
    }

    // this.contents is ensured to be defined by ensureContentsForMarking
    const range = this.contents!.range(cfiRange);

    const emitter = () => {
      this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
    };

    data['epubcfi'] = cfiRange;

    if (this.iframe === undefined) {
      throw new Error('Iframe not defined');
    }

    if (!this.pane) {
      this.pane = new StyledPane(
        this.iframe,
        this.element,
        this.settings.transparency
      );
    }

    const m = new Highlight(range, className, data, attributes);
    const h = this.pane.addMark(m);

    // @ts-expect-error we should add a class to Mark to get the element
    const highlightElement = h.element as HTMLElement;

    this.highlights[cfiRange] = {
      mark: h,
      element: highlightElement,
      listeners: [emitter, cb!],
    };

    highlightElement.setAttribute('ref', className);
    highlightElement.addEventListener('click', emitter);
    highlightElement.addEventListener('touchstart', emitter);

    if (cb) {
      highlightElement.addEventListener('click', cb);
      highlightElement.addEventListener('touchstart', cb);
    }

    return h;
  }

  underline(
    cfiRange: string,
    data: Record<string, string> = {},
    cb?: (e: Event) => void,
    className = 'epubjs-ul',
    styles = {}
  ) {
    if (!this.ensureContentsForMarking()) return;

    const attributes = Object.assign(
      {
        stroke: 'black',
        'stroke-opacity': '0.3',
        'mix-blend-mode': 'multiply',
      },
      styles
    );

    const range = this.contents!.range(cfiRange);
    const emitter = () => {
      this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
    };

    data['epubcfi'] = cfiRange;

    if (this.iframe === undefined) {
      throw new Error('Iframe not defined');
    }

    if (!this.pane) {
      this.pane = new StyledPane(
        this.iframe,
        this.element,
        this.settings.transparency
      );
    }

    const m = new Underline(range, className, data, attributes);
    const h = this.pane.addMark(m);

    // @ts-expect-error we should add a class to Mark to get the element
    const underlineElement = h.element as HTMLElement;

    this.underlines[cfiRange] = {
      mark: h,
      element: underlineElement,
      listeners: [emitter, cb!],
    };

    underlineElement.setAttribute('ref', className);
    underlineElement.addEventListener('click', emitter);
    underlineElement.addEventListener('touchstart', emitter);

    if (cb) {
      underlineElement.addEventListener('click', cb);
      underlineElement.addEventListener('touchstart', cb);
    }
    return h;
  }

  mark(
    cfiRange: string,
    data: Record<string, string> = {},
    cb?: (e: Event) => void
  ): { element: HTMLElement; range: Range } | Node | null {
    if (!this.contents) {
      return null;
    }

    if (cfiRange in this.marks) {
      const item = this.marks[cfiRange];
      return item;
    }

    let range = this.contents.range(cfiRange);

    if (!range) {
      return null;
    }

    const container = range.commonAncestorContainer;
    const parent = container.nodeType === 1 ? container : container.parentNode;

    const emitter = () => {
      this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
    };

    if (range.collapsed && container.nodeType === 1) {
      range = new Range();
      range.selectNodeContents(container);
    } else if (range.collapsed) {
      // Webkit doesn't like collapsed ranges
      range = new Range();
      range.selectNodeContents(parent!);
    }

    const mark = this.document!.createElement('a');
    mark.setAttribute('ref', 'epubjs-mk');
    mark.style.position = 'absolute';

    mark.dataset['epubcfi'] = cfiRange;

    if (data) {
      Object.keys(data).forEach((key) => {
        mark.dataset[key] = data[key];
      });
    }

    if (cb) {
      mark.addEventListener('click', cb);
      mark.addEventListener('touchstart', cb);
    }

    mark.addEventListener('click', emitter);
    mark.addEventListener('touchstart', emitter);

    this.placeMark(mark, range);

    this.element.appendChild(mark);

    this.marks[cfiRange] = {
      element: mark,
      range: range,
      listeners: [emitter, cb!],
    };

    return parent;
  }

  placeMark(element: HTMLElement, range: Range) {
    let top, right, left;

    if (
      this.layout.name === 'pre-paginated' ||
      this.settings.axis !== 'horizontal'
    ) {
      const pos = range.getBoundingClientRect();
      top = pos.top;
      right = pos.right;
    } else {
      // Element might break columns, so find the left most element
      const rects = range.getClientRects();
      if (this.layout === undefined) {
        throw new Error('Layout not defined');
      }

      let rect;
      for (let i = 0; i != rects.length; i++) {
        rect = rects[i];
        if (!left || rect.left < left) {
          left = rect.left;
          // right = rect.right;
          right =
            Math.ceil(left / this.layout.props.pageWidth!) *
              this.layout.props.pageWidth! -
            this.layout.gap / 2;
          top = rect.top;
        }
      }
    }

    element.style.top = `${top}px`;
    element.style.left = `${right}px`;
  }

  unhighlight(cfiRange: string): void {
    let item: {
      mark: Mark;
      element: HTMLElement;
      listeners: Array<(e: Event) => void>;
    };
    if (cfiRange in this.highlights) {
      item = this.highlights[cfiRange];

      this.pane!.removeMark(item.mark);

      item.listeners.forEach((l) => {
        if (l) {
          item.element.removeEventListener('click', l);
          item.element.removeEventListener('touchstart', l);
        }
      });
      delete this.highlights[cfiRange];
    }
  }

  ununderline(cfiRange: string) {
    let item: {
      mark: Mark;
      element: HTMLElement;
      listeners: Array<(e: Event) => void>;
    };

    if (cfiRange in this.underlines) {
      if (this.pane === undefined) {
        throw new Error('Pane not defined');
      }

      item = this.underlines[cfiRange];
      this.pane.removeMark(item.mark);
      item.listeners.forEach((l) => {
        if (l) {
          item.element.removeEventListener('click', l);
          item.element.removeEventListener('touchstart', l);
        }
      });
      delete this.underlines[cfiRange];
    }
  }

  unmark(cfiRange: string) {
    if (cfiRange in this.marks) {
      const item: {
        range: Range;
        element: HTMLElement;
        listeners: Array<(e: Event) => void>;
      } = this.marks[cfiRange];

      this.element.removeChild(item.element);
      item.listeners.forEach((l) => {
        if (l) {
          item.element.removeEventListener('click', l);
          item.element.removeEventListener('touchstart', l);
        }
      });
      delete this.marks[cfiRange];
    }
  }

  destroy() {
    for (const cfiRange in this.highlights) {
      this.unhighlight(cfiRange);
    }

    for (const cfiRange in this.underlines) {
      this.ununderline(cfiRange);
    }

    for (const cfiRange in this.marks) {
      this.unmark(cfiRange);
    }

    if (this.blobUrl) {
      revokeBlobUrl(this.blobUrl);
    }

    if (this.displayed) {
      this.displayed = false;

      this.removeListeners();
      this.contents?.destroy();

      this.stopExpanding = true;
      if (this.iframe && this.element && this.element.contains(this.iframe)) {
        this.element.removeChild(this.iframe);
      }

      if (this.pane) {
        this.pane = undefined;
      }

      this.iframe = undefined;
      this.contents = undefined;
      this._textWidth = undefined;
      this._textHeight = undefined;
    }

    // this.element.style.height = "0px";
    // this.element.style.width = "0px";
  }
}

EventEmitter(IframeView.prototype);

export default IframeView;
