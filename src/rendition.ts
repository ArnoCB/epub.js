// Type definitions for location objects
type DisplayedInfo = {
  page: number;
  total: number;
};

type LocationPoint = {
  index: number;
  href: string;
  cfi: string;
  displayed: DisplayedInfo;
  location?: number;
  percentage?: number;
  page?: number;
  totalPages?: number;
  mapping?: { start: string; end: string };
  pages?: number[];
};

type DisplayedLocation = {
  start: LocationPoint;
  end: LocationPoint;
  atStart?: boolean;
  atEnd?: boolean;
};

type RenditionHooks = {
  display: Hook;
  serialize: Hook;
  content: Hook;
  unloaded: Hook;
  layout: Hook;
  render: Hook;
  show: Hook;
};

export interface RenditionOptions {
  width?: number | string;
  height?: number | string;
  ignoreClass?: string;
  manager?: ViewManager;
  view?: View;
  flow?: Flow;
  layout?: string;
  spread?: Spread;
  minSpreadWidth?: number;
  stylesheet?: string;
  resizeOnOrientationChange?: boolean;
  script?: string;
  infinite?: boolean;
  overflow?: string;
  snap?: boolean | object;
  defaultDirection?: string;
  allowScriptedContent?: boolean;
  allowPopups?: boolean;
  transparency?: boolean;
  direction?: string;
  orientation?: string;
  usePreRendering?: boolean;
  globalLayoutProperties?: {
    flow?: Flow;
    [key: string]: unknown;
  };
}

import EventEmitter from 'event-emitter';
import { defer, isFloat } from './utils/core';
import Hook from './utils/hook';
import EpubCFI from './epubcfi';
import Queue from './utils/queue';
import Layout, { Flow, Spread } from './layout';
import Themes from './themes';
import Annotations from './annotations';
import { EVENTS, DOM_EVENTS } from './utils/constants';
import Book from './book';
import { View } from './managers/helpers/views';
import Contents from './contents';
import { ViewManager } from './managers/helpers/snap';
import { ViewManagerConstructor } from './managers/helpers/snap';
import DefaultViewManager from './managers/default';

type EventEmitterMethods = Pick<EventEmitter, 'emit'>;

/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
 * @class
 * @param {Book} book
 * @param {object} [options]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.ignoreClass] class for the cfi parser to ignore
 * @param {string | function | object} [options.manager='default']
 * @param {string | function} [options.view='iframe']
 * @param {string} [options.layout] layout to force
 * @param {string} [options.spread] force spread value
 * @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
 * @param {string} [options.stylesheet] url of stylesheet to be injected
 * @param {boolean} [options.resizeOnOrientationChange] false to disable orientation events
 * @param {string} [options.script] url of script to be injected
 * @param {boolean | object} [options.snap=false] use snap scrolling
 * @param {string} [options.defaultDirection='ltr'] default text direction
 * @param {boolean} [options.allowScriptedContent=false] enable running scripts in content
 * @param {boolean} [options.allowPopups=false] enable opening popup in content
 */
export class Rendition implements EventEmitterMethods {
  emit!: EventEmitter['emit'];

  settings: RenditionOptions;
  book: Book;
  hooks: RenditionHooks;
  themes: Themes;
  annotations: Annotations;
  epubcfi: EpubCFI;
  q: Queue;
  location: DisplayedLocation | null = null;
  displaying: defer<boolean> | undefined;
  _layout: Layout | undefined;
  ViewManager!: ViewManagerConstructor | undefined;
  manager!: ViewManager;
  starting: defer<void>;
  started: Promise<void>;
  View!: View;

  constructor(book: Book, options: RenditionOptions) {
    this.book = book;
    this.q = new Queue(this);

    this.settings = {
      width: undefined,
      height: undefined,
      ignoreClass: '',
      view: 'iframe' as unknown as View, // or use a proper View instance if available
      flow: undefined,
      layout: undefined,
      spread: undefined,
      minSpreadWidth: 400,
      stylesheet: undefined,
      resizeOnOrientationChange: true,
      script: undefined,
      snap: false,
      defaultDirection: 'ltr',
      allowScriptedContent: false,
      allowPopups: false,
      usePreRendering: false,
      ...options,
    };

    if (typeof this.settings.manager === 'object') {
      this.manager = this.settings.manager;
    } else {
      const layoutInstance = new Layout({
        layout: this.settings.layout || 'reflowable',
        spread: this.settings.spread || 'auto',
        minSpreadWidth:
          typeof this.settings.minSpreadWidth === 'number'
            ? this.settings.minSpreadWidth
            : 400,
        direction: this.settings.direction || 'ltr',
        flow: this.settings.flow || 'auto',
      });
      // Ensure width and height are numbers or undefined
      const width =
        typeof this.settings.width === 'number'
          ? this.settings.width
          : undefined;
      const height =
        typeof this.settings.height === 'number'
          ? this.settings.height
          : undefined;
      this.manager = new DefaultViewManager({
        view: this.settings.view,
        queue: this.q,
        request: this.book.load.bind(this.book),
        settings: {
          ...this.settings,
          layout: layoutInstance,
          width,
          height,
          afterScrolledTimeout: 10,
        },
      });
    }

    this.manager.on(EVENTS.MANAGERS.ADDED, (...args: unknown[]) => {
      const view = args[0] as View;
      this.afterDisplayed(view);
    });

    this.manager.on(EVENTS.MANAGERS.REMOVED, (...args: unknown[]) => {
      const view = args[0] as View;
      this.afterRemoved(view);
    });

    this.manager.on(EVENTS.MANAGERS.RESIZED, (...args: unknown[]) => {
      const size = args[0] as { width: number; height: number };
      const epubcfi = args[1] as string;
      this.onResized(size, epubcfi);
    });

    this.manager.on(
      EVENTS.MANAGERS.ORIENTATION_CHANGE,
      (...args: unknown[]) => {
        const orientation = args[0] as string;
        this.onOrientationChange(orientation);
      }
    );

    this.hooks = {
      display: new Hook(this),
      serialize: new Hook(this),
      content: new Hook(this),
      unloaded: new Hook(this),
      layout: new Hook(this),
      render: new Hook(this),
      show: new Hook(this),
    };

    this.hooks.content.register(this.handleLinks.bind(this));
    this.hooks.content.register(this.passEvents.bind(this));
    this.hooks.content.register(this.adjustImages.bind(this));

    if (this.book.spine === undefined) {
      throw new Error('Book spine is not defined');
    }

    this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));

    if (this.settings.stylesheet) {
      this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
    }

    if (this.settings.script) {
      this.book.spine.hooks.content.register(this.injectScript.bind(this));
    }

    /**
     * @member {Themes} themes
     * @memberof Rendition
     */
    this.themes = new Themes(this);

    /**
     * @member {Annotations} annotations
     * @memberof Rendition
     */
    this.annotations = new Annotations(this);

    this.epubcfi = new EpubCFI();

    /**
     * A Rendered Location Range
     * @typedef location
     * @type {Object}
     * @property {object} start
     * @property {string} start.index
     * @property {string} start.href
     * @property {object} start.displayed
     * @property {EpubCFI} start.cfi
     * @property {number} start.location
     * @property {number} start.percentage
     * @property {number} start.displayed.page
     * @property {number} start.displayed.total
     * @property {object} end
     * @property {string} end.index
     * @property {string} end.href
     * @property {object} end.displayed
     * @property {EpubCFI} end.cfi
     * @property {number} end.location
     * @property {number} end.percentage
     * @property {number} end.displayed.page
     * @property {number} end.displayed.total
     * @property {boolean} atStart
     * @property {boolean} atEnd
     * @memberof Rendition
     */

    this.location = null;

    // Hold queue until book is opened
    this.q.enqueue(this.book.opened);

    this.starting = new defer();

    /**
     * @member {promise} started returns after the rendition has started
     * @memberof Rendition
     */
    this.started = this.starting.promise;

    // Block the queue until rendering is started
    this.q.enqueue(this.start);
  }

  /**
   * Set the manager function
   */
  setManager(manager: ViewManager) {
    this.manager = manager;
  }

  /**
   * Start the rendering
   */
  async start() {
    if (!this.book.packaging || !this.book.packaging.metadata) {
      console.error(
        '[Rendition] start failed: book.packaging or metadata is undefined'
      );
      console.error(JSON.stringify(this.book.ready));
      return;
    }

    if (
      !this.settings.layout &&
      (this.book.packaging.metadata.layout === 'pre-paginated' ||
        this.book.displayOptions!.fixedLayout === 'true')
    ) {
      this.settings.layout = 'pre-paginated';
    }

    switch (this.book.packaging.metadata.spread) {
      case 'none':
        this.settings.spread = 'none';
        break;
      case 'both':
        this.settings.spread = 'auto';
        break;
    }

    if (!this.manager) {
      this.ViewManager = this.settings.manager as ViewManagerConstructor;
      this.View = this.settings.view!;

      if (typeof this.ViewManager === 'function') {
        this.manager = new this.ViewManager({
          view: this.View,
          queue: this.q,
          request: this.book.load.bind(this.book),
          settings: this.settings,
        });
      }
    }

    this.direction(
      (this.book.packaging.metadata.direction ||
        this.settings.defaultDirection)!
    );

    // Parse metadata to get layout props
    this.settings.globalLayoutProperties = this.determineLayoutProperties(
      this.book.packaging.metadata
    );

    this.flow(this.settings.globalLayoutProperties!.flow!);

    this.layout(this.settings.globalLayoutProperties);

    // Listen for displayed views
    this.manager.on(
      EVENTS.MANAGERS.ADDED,
      this.afterDisplayed.bind(this) as (...args: unknown[]) => void
    );

    this.manager.on(
      EVENTS.MANAGERS.REMOVED,
      this.afterRemoved.bind(this) as (...args: unknown[]) => void
    );

    // Listen for resizing
    this.manager.on(
      EVENTS.MANAGERS.RESIZED,
      this.onResized.bind(this) as (...args: unknown[]) => void
    );

    // Listen for rotation
    this.manager.on(
      EVENTS.MANAGERS.ORIENTATION_CHANGE,
      this.onOrientationChange.bind(this) as (...args: unknown[]) => void
    );

    // Listen for scroll changes
    this.manager.on(EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));

    /**
     * Emit that rendering has started
     * @event started
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.STARTED);

    // Start processing queue
    this.starting.resolve();
  }

  /**
   * Call to attach the container to an element in the dom
   * Container must be attached before rendering can begin
   * @return {Promise}
   */
  attachTo(element: HTMLElement | string): Promise<unknown> {
    console.log('[Rendition] *** attachTo METHOD CALLED ***');
    console.log('[Rendition] attachTo called with element:', element);
    console.log('[Rendition] Manager type:', this.manager.constructor.name);
    console.log('[Rendition] Manager settings:', this.manager.settings);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.q.enqueue(() => {
      console.log('[Rendition] *** IN ENQUEUED FUNCTION ***');
      console.log(
        '[Rendition] In enqueued function, about to call manager.render'
      );

      // Start rendering with the request function
      if (typeof element === 'string') {
        console.log('[Rendition] received a string as element:', element);
      }

      console.log('[Rendition] Calling manager.render with element:', element);
      this.manager.render(element as HTMLElement);
      console.log('[Rendition] manager.render call completed');

      /**
       * Emit that rendering has attached to an element
       * @event attached
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.ATTACHED);
    });
  }

  /**
   * Display a point in the book
   * The request will be added to the rendering Queue,
   * so it will wait until book is opened, rendering started
   * and all other rendering tasks have finished to be called.
   * @param  {string} target Url or EpubCFI
   * @return {Promise}
   */
  display(target: string | number): Promise<unknown> {
    if (this.displaying) {
      this.displaying.resolve(true);
    }

    return this.q.enqueue(this._display, target);
  }

  /**
   * Tells the manager what to display immediately
   *
   * @param  {string} target Url or EpubCFI
   * @return {Promise}
   */
  private _display(target: string | number) {
    if (!this.book) {
      console.error('[Rendition] display called without a book');
      return Promise.resolve(false);
    }

    const displaying = new defer<boolean>();
    const displayed = displaying.promise;

    this.displaying = displaying;

    // Check if this is a book percentage
    // Coerce non-string targets to strings for string-based checks below
    const targetStr = typeof target === 'string' ? target : String(target);

    if (
      this.book.locations &&
      this.book.locations.length() &&
      isFloat(targetStr)
    ) {
      target = this.book.locations.cfiFromPercentage(parseFloat(targetStr));
    }

    if (!this.book.spine) {
      console.error('[Rendition] display called without a book spine');
      return Promise.resolve(false);
    }

    const section = this.book.spine!.get(target);

    if (!section) {
      displaying.reject(new Error('No Section Found'));
      return displayed;
    }

    // Extract the CFI fragment for positioning within the section
    let cfiTarget: string | undefined;
    if (targetStr && targetStr.startsWith('epubcfi(')) {
      cfiTarget = targetStr;
      console.debug('[Rendition] CFI target extracted:', cfiTarget);
    } else {
      console.debug(
        '[Rendition] No CFI target found, target type:',
        typeof target,
        'value:',
        targetStr
      );
    }

    console.debug(
      '[Rendition] calling manager.display with section:',
      section.href,
      'cfiTarget:',
      cfiTarget
    );
    this.manager.display(section, cfiTarget).then(
      () => {
        displaying.resolve(true);
        this.displaying = undefined;

        /**
         * Emit that a section has been displayed
         * @event displayed
         * @param {Section} section
         * @memberof Rendition
         */
        this.emit(EVENTS.RENDITION.DISPLAYED, section);
        this.reportLocation();
      },
      (err: Error) => {
        /**
         * Emit that has been an error displaying
         * @event displayError
         * @param {Section} section
         * @memberof Rendition
         */
        this.emit(EVENTS.RENDITION.DISPLAY_ERROR, err);
      }
    );

    return displayed;
  }

  getContents() {
    return this.manager.getContents();
  }

  /**
   * Report what section has been displayed
   */
  private afterDisplayed(view: View) {
    view.on(
      EVENTS.VIEWS.MARK_CLICKED,
      (cfiRange: string, data: Record<string, unknown>) =>
        this.triggerMarkEvent(cfiRange, data, view.contents!)
    );

    this.hooks.render.trigger(view, this).then(() => {
      if (view.contents) {
        this.hooks.content.trigger(view.contents, this).then(() => {
          /**
           * Emit that a section has been rendered
           * @event rendered
           * @param {Section} section
           * @param {View} view
           * @memberof Rendition
           */
          this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
        });
      } else {
        this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
      }
    });
  }

  /**
   * Report what has been removed
   */
  private afterRemoved(view: View) {
    this.hooks.unloaded.trigger(view, this).then(() => {
      /**
       * Emit that a section has been removed
       * @event removed
       * @param {Section} section
       * @param {View} view
       * @memberof Rendition
       */
      this.emit(EVENTS.RENDITION.REMOVED, view.section, view);
    });
  }

  /**
   * Report resize events and display the last seen location
   */
  private onResized(size: { width: number; height: number }, epubcfi: string) {
    /**
     * Emit that the rendition has been resized
     * @event resized
     * @param {number} width
     * @param {height} height
     * @param {string} epubcfi (optional)
     * @memberof Rendition
     */
    this.emit(
      EVENTS.RENDITION.RESIZED,
      {
        width: size.width,
        height: size.height,
      },
      epubcfi
    );

    // Check if we have a pre-rendering enabled manager that can handle resize natively
    // If so, skip the automatic display call to avoid clearing views that were just attached
    const hasPreRendering =
      this.manager &&
      (this.manager as DefaultViewManager).usePreRendering &&
      (this.manager as DefaultViewManager).preRenderer;

    if (this.location && this.location.start && !hasPreRendering) {
      this.display(epubcfi || this.location.start.cfi);
    } else if (hasPreRendering) {
      console.debug(
        '[Rendition] skipping automatic display after resize - pre-rendering manager will handle it'
      );
    }
  }

  /**
   * Report orientation events and display the last seen location
   * @private
   */
  private onOrientationChange(orientation: string) {
    /**
     * Emit that the rendition has been rotated
     * @event orientationchange
     * @param {string} orientation
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
  }

  /**
   * Trigger a resize of the views
   * @param {number} [width]
   * @param {number} [height]
   * @param {string} [epubcfi] (optional)
   */
  resize(width: number, height: number, epubcfi?: string) {
    if (width) {
      this.settings.width = width;
    }

    if (height) {
      this.settings.height = height;
    }

    this.manager.resize(String(width), String(height), epubcfi);
  }

  /**
   * Clear all rendered views
   */
  clear() {
    this.manager.clear();
  }

  /**
   * Go to the next "page" in the rendition
   */
  next() {
    return this.q
      .enqueue(this.manager.next.bind(this.manager))
      .then(this.reportLocation.bind(this));
  }

  /**
   * Go to the previous "page" in the rendition
   */
  prev() {
    console.error(
      '[DEBUGGING] Rendition.prev() called - enqueuing manager.prev'
    );
    return this.q
      .enqueue(this.manager.prev.bind(this.manager))
      .then(this.reportLocation.bind(this))
      .catch((error: Error) => {
        console.error('[DEBUGGING] Rendition.prev() failed:', error);
        throw error;
      });
  }

  //-- http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
  /**
   * Determine the Layout properties from metadata and settings
   */
  private determineLayoutProperties(metadata: {
    layout?: string;
    spread?: string;
    orientation?: string;
    flow?: Flow;
    direction?: string;
    minSpreadWidth?: number;
    viewport?: string;
  }) {
    const layout = this.settings.layout || metadata.layout || 'reflowable';
    const spread = this.settings.spread || metadata.spread || 'auto';
    const orientation =
      this.settings.orientation || metadata.orientation || 'auto';
    const flow = this.settings.flow || metadata.flow || 'auto';
    const viewport = metadata.viewport || '';
    const minSpreadWidth =
      this.settings.minSpreadWidth || metadata.minSpreadWidth || 800;
    const direction = this.settings.direction || metadata.direction || 'ltr';

    return {
      layout: layout,
      spread: spread,
      orientation: orientation,
      flow: flow,
      viewport: viewport,
      minSpreadWidth: minSpreadWidth,
      direction: direction,
    };
  }

  /**
   * Adjust the flow of the rendition to paginated or scrolled
   * (scrolled-continuous vs scrolled-doc are handled by different view managers)
   */
  flow(flow: Flow) {
    let _flow = flow;
    if (
      flow === 'scrolled' ||
      flow === 'scrolled-doc' ||
      flow === 'scrolled-continuous'
    ) {
      _flow = 'scrolled';
    }

    if (flow === 'auto' || flow === 'paginated') {
      _flow = 'paginated';
    }

    this.settings.flow = flow;

    if (this._layout) {
      this._layout.flow(_flow);
    }

    if (this.manager && this._layout) {
      this.manager.applyLayout(this._layout);
    }

    if (this.manager) {
      this.manager.updateFlow(_flow);
    }

    if (this.manager && this.manager.isRendered() && this.location) {
      this.manager.clear();
      this.display(this.location.start.cfi);
    }
  }

  /**
   * Adjust the layout of the rendition to reflowable or pre-paginated
   * @param  {object} settings
   */
  layout(settings: {
    layout?: string;
    spread?: Spread;
    minSpreadWidth?: number;
    direction?: string;
    flow?: Flow;
  }) {
    if (settings) {
      this._layout = new Layout(settings);
      this._layout.spread(settings.spread!, this.settings.minSpreadWidth!);

      // this.mapping = new Mapping(this._layout.props);

      this._layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
        this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
      });
    }

    if (this.manager && this._layout) {
      this.manager.applyLayout(this._layout);
    }

    return this._layout;
  }

  /**
   * Adjust if the rendition uses spreads
   * @param  {int} [min] min width to use spreads at
   */
  spread(spread: Spread, min: number) {
    this.settings.spread = spread;

    if (min) {
      this.settings.minSpreadWidth = min;
    }

    if (this._layout) {
      this._layout.spread(spread, min);
    }

    if (this.manager && this.manager.isRendered()) {
      this.manager.updateLayout();
    }
  }

  /**
   * Adjust the direction of the rendition
   */
  direction(dir: string) {
    this.settings.direction = dir || 'ltr';

    if (this.manager) {
      this.manager.direction(this.settings.direction);
    }

    if (this.manager && this.manager.isRendered() && this.location) {
      this.manager.clear();
      this.display(this.location.start.cfi);
    }
  }

  /**
   * Report the current location
   * @fires relocated
   * @fires locationChanged
   */
  reportLocation() {
    return this.q.enqueue(() => {
      requestAnimationFrame(() => {
        const ts = new Date().toISOString();
        const pageLocations = this.manager.currentLocation();
        if (
          pageLocations &&
          Array.isArray(pageLocations) &&
          pageLocations.length > 0
        ) {
          // Map PageLocation[] to LocationPoint[]
          const locationPoints = pageLocations.map((pl) => ({
            index: pl.index,
            href: pl.href,
            cfi: pl.mapping?.start ?? '',
            displayed: {
              page: pl.pages[0] || 1,
              total: pl.totalPages ?? 0,
            },
            pages: pl.pages,
            totalPages: pl.totalPages,
            mapping: pl.mapping,
          }));
          const located = this.located(locationPoints);

          if (!located) {
            return;
          }

          this.location = located;

          /**
           * @event relocated
           * @type {displayedLocation}
           * @memberof Rendition
           */
          try {
            // push to global trace if present
            try {
              const g = globalThis as typeof globalThis & {
                __navTrace?: unknown[];
              };
              if (g && g.__navTrace) {
                g.__navTrace.push({
                  ts: ts,
                  event: 'relocated',
                  details: this.location,
                });
              }
            } catch {
              // ignore
            }
            this.emit(EVENTS.RENDITION.RELOCATED, this.location);
            console.debug(
              '[Rendition] emitted relocated',
              'ts=',
              ts,
              JSON.stringify(this.location)
            );
          } catch {
            // emit may throw in tests; ignore
          }
        }
      });
    });
  }

  /**
   * Get the Current Location object
   */
  currentLocation() {
    return this.manager.currentLocation();
  }

  /**
   * Creates a Rendition#locationRange from location
   * passed by the Manager
   * @returns {displayedLocation}
   */
  private located(location: LocationPoint[]): DisplayedLocation | null {
    if (!location.length) {
      return null;
    }
    const start: LocationPoint = location[0];
    const end: LocationPoint = location[location.length - 1];

    const located: DisplayedLocation = {
      start: {
        index: start.index,
        href: start.href,
        cfi: start.mapping?.start ?? '',
        displayed: {
          page: start.pages?.[0] ?? 1,
          total: start.totalPages ?? 0,
        },
      },
      end: {
        index: end.index,
        href: end.href,
        cfi: end.mapping?.end ?? '',
        displayed: {
          page: end.pages?.[end.pages?.length - 1] ?? 1,
          total: end.totalPages ?? 0,
        },
      },
    };

    const locationStart = start.mapping?.start
      ? this.book.locations!.locationFromCfi(start.mapping.start)
      : null;

    const locationEnd = end.mapping?.end
      ? this.book.locations!.locationFromCfi(end.mapping.end)
      : null;

    if (locationStart !== null) {
      located.start.location = locationStart;
      located.start.percentage =
        this.book.locations!.percentageFromLocation(locationStart);
    }
    if (locationEnd !== null) {
      located.end.location = locationEnd;
      located.end.percentage =
        this.book.locations!.percentageFromLocation(locationEnd);
    }

    const pageStart = start.mapping?.start
      ? this.book.pageList!.pageFromCfi(start.mapping.start)
      : -1;
    const pageEnd = end.mapping?.end
      ? this.book.pageList!.pageFromCfi(end.mapping.end)
      : -1;

    if (pageStart !== -1) {
      located.start.page = pageStart;
    }
    if (pageEnd !== -1) {
      located.end.page = pageEnd;
    }

    if (
      end.index === this.book.spine!.last()?.index &&
      located.end.displayed.page >= located.end.displayed.total
    ) {
      located.atEnd = true;
    }

    if (
      start.index === this.book.spine!.first()?.index &&
      located.start.displayed.page === 1
    ) {
      located.atStart = true;
    }

    return located;
  }

  /**
   * Remove and Clean Up the Rendition
   */
  destroy() {
    // @todo Clear the queue
    this.manager?.destroy();

    // @ts-expect-error this is only at destroy time
    this.book = undefined;
  }

  /**
   * Pass the events from a view's Contents
   */
  private passEvents(contents: Contents) {
    DOM_EVENTS.forEach((e) => {
      contents.on(e, (ev: Event) => this.triggerViewEvent(ev, contents));
    });

    contents.on(EVENTS.CONTENTS.SELECTED, (e: string) => {
      this.triggerSelectedEvent(e, contents);
    });
  }

  /**
   * Emit events passed by a view
   */
  private triggerViewEvent(e: Event, contents: Contents) {
    this.emit(e.type, e, contents);
  }

  /**
   * Emit a selection event's CFI Range passed from a a view
   * @private
   * @param  {string} cfirange
   */
  triggerSelectedEvent(cfirange: string, contents: Contents) {
    /**
     * Emit that a text selection has occurred
     * @event selected
     * @param {string} cfirange
     * @param {Contents} contents
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
  }

  /**
   * Emit a markClicked event with the cfiRange and data from a mark
   * @private
   * @param  {EpubCFI} cfirange
   */
  triggerMarkEvent(
    cfiRange: EpubCFI | string,
    data: object,
    contents: Contents
  ) {
    /**
     * Emit that a mark was clicked
     * @event markClicked
     * @param {EpubCFI} cfirange
     * @param {object} data
     * @param {Contents} contents
     * @memberof Rendition
     */
    this.emit(EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
  }

  /**
   * Hook to adjust images to fit in columns
   */
  private adjustImages(contents: Contents) {
    if (this._layout === undefined) {
      throw new Error('Layout is not defined');
    }

    if (this._layout.name === 'pre-paginated') {
      return new Promise<void>(function (resolve) {
        resolve();
      });
    }

    if (contents.window === null) {
      return;
    }

    const computed = contents.window.getComputedStyle(contents.content, null);
    const height =
      (contents.content.offsetHeight -
        (parseFloat(computed.paddingTop) +
          parseFloat(computed.paddingBottom))) *
      0.95;
    const horizontalPadding =
      parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);

    contents.addStylesheetRules(
      {
        img: {
          'max-width':
            (this._layout.columnWidth
              ? this._layout.columnWidth - horizontalPadding + 'px'
              : '100%') + '!important',
          'max-height': height + 'px' + '!important',
          'object-fit': 'contain',
          'page-break-inside': 'avoid',
          'break-inside': 'avoid',
          'box-sizing': 'border-box',
        },
        svg: {
          'max-width':
            (this._layout.columnWidth
              ? this._layout.columnWidth - horizontalPadding + 'px'
              : '100%') + '!important',
          'max-height': height + 'px' + '!important',
          'page-break-inside': 'avoid',
          'break-inside': 'avoid',
        },
      },
      'rendition-adjust-images'
    );

    return new Promise<void>(function (resolve) {
      // Wait to apply
      setTimeout(function () {
        resolve();
      }, 1);
    });
  }

  /**
   * Hook to handle link clicks in rendered content
   */
  private handleLinks(contents: Contents) {
    if (contents) {
      contents.on(EVENTS.CONTENTS.LINK_CLICKED, (href: string) => {
        const relative = this.book.path!.relative(href);
        this.display(relative);
      });
    }
  }

  views() {
    const views = this.manager ? this.manager.views : undefined;
    return views || ([] as View[]);
  }

  /**
   * Hook to handle injecting stylesheet before
   * a Section is serialized
   */
  private injectStylesheet(doc: Document) {
    const style = doc.createElement('link');
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    if (this.settings.stylesheet) {
      style.setAttribute('href', this.settings.stylesheet);
    }
    doc.getElementsByTagName('head')[0].appendChild(style);
  }

  /**
   * Hook to handle injecting scripts before
   * a Section is serialized
   */
  private injectScript(doc: Document) {
    const script = doc.createElement('script');
    script.setAttribute('type', 'text/javascript');
    if (this.settings.script) {
      script.setAttribute('src', this.settings.script);
    }
    script.textContent = ' '; // Needed to prevent self closing tag
    doc.getElementsByTagName('head')[0].appendChild(script);
  }

  /**
   * Hook to handle the document identifier before
   * a Section is serialized
   */
  private injectIdentifier(doc: Document) {
    const ident = this.book.packaging!.metadata.identifier;
    const meta = doc.createElement('meta');
    meta.setAttribute('name', 'dc.relation.ispartof');
    if (ident) {
      meta.setAttribute('content', ident);
    }
    doc.getElementsByTagName('head')[0].appendChild(meta);
  }
}

//-- Enable binding events to Renderer
EventEmitter(Rendition.prototype);

export default Rendition;
