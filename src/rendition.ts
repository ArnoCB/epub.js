import type {
  LocationPoint,
  DisplayedLocation,
  RenditionHooks,
  ViewManager,
  ViewManagerConstructor,
  RenditionOptions,
  LayoutProps,
  LayoutProperties,
} from './types';
import EventEmitter from 'event-emitter';
import { EventEmitterMethods } from './types';
import {
  defer,
  isFloat,
  EVENTS,
  DOM_EVENTS,
  buildEnrichedLocationPoint,
} from './utils';
import Hook from './utils/hook';
import EpubCFI from './epubcfi';
import Queue from './utils/queue';
import Layout from './layout';
import Themes from './themes';
import Annotations from './annotations';
import Book from './book';
import Views, { View } from './managers/helpers/views';
import Contents from './contents';
import DefaultViewManager from './managers/default';
import { PreRenderingViewManager } from './managers/prerendering';
import type { Direction, Flow, Spread } from './enums';

/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
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
  emit!: EventEmitterMethods['emit'];
  on!: EventEmitterMethods['on'];
  off!: EventEmitterMethods['off'];
  once!: EventEmitterMethods['once'];

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

    this.themes = new Themes(this);

    this.annotations = new Annotations(this);

    this.epubcfi = new EpubCFI();

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

    switch (this.book.packaging.metadata.spread as Spread | 'both') {
      case 'none':
        this.settings.spread = 'none';
        break;
      case 'both':
        this.settings.spread = 'auto';
        break;
    }

    // Create manager in ONE place - always create here, no conditions
    // Debug: usePreRendering = ${this.settings.usePreRendering}

    if (typeof this.settings.manager === 'object') {
      console.debug('[Rendition] Using provided manager object');
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

      // Choose the appropriate view manager based on usePreRendering setting
      const ManagerClass = this.settings.usePreRendering
        ? PreRenderingViewManager
        : DefaultViewManager;

      // Debug: Using manager class = ${ManagerClass.name}

      const baseManagerOptions = {
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
      };

      // Add spine to manager options if using PreRenderingViewManager
      if (this.settings.usePreRendering) {
        const spineItems = this.book.spine?.spineItems || [];
        const preRenderingOptions = {
          ...baseManagerOptions,
          spine: spineItems,
        };

        this.manager = new ManagerClass(preRenderingOptions);
      } else {
        this.manager = new ManagerClass(baseManagerOptions);
      }

      this.ViewManager = ManagerClass as unknown as ViewManagerConstructor;
      this.View = this.settings.view!;
    }

    // Set up manager event listeners now that manager is created
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

    // Manager event listeners are already set up above after manager creation

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
   */
  attachTo(element: HTMLElement | string): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.q.enqueue(() => {
      // Start rendering with the request function
      this.manager.render(element as HTMLElement);

      // If pre-rendering is enabled and we're using the PreRenderingViewManager,
      // start pre-rendering automatically for all spine sections.
      try {
        const hasPreRendering =
          this.settings.usePreRendering &&
          this.manager instanceof PreRenderingViewManager;

        if (hasPreRendering && this.book.spine) {
          const sections = this.book.spine.spineItems || [];

          // Start pre-rendering in the background (don't block attachTo)
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (this.manager as PreRenderingViewManager)
            .startPreRendering(sections)
            .catch((err: Error) => {
              console.warn('[Rendition] Pre-rendering failed to start:', err);
            });
        }
      } catch (e) {
        console.debug('[Rendition] Auto pre-rendering start check failed', e);
      }

      // Ensure the first page is shown after attachment. Use the rendition's display
      // method which will enqueue the request and wait for any pending startup tasks.
      try {
        if (this.book.spine && this.book.spine.length) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.display(0);
        }
      } catch (e) {
        console.debug(
          '[Rendition] Failed to display first section after attach',
          e
        );
      }

      /**
       * Emit that rendering has attached to an element
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
    }

    this.manager.display(section, cfiTarget).then(
      () => {
        displaying.resolve(true);
        this.displaying = undefined;

        /**
         * Emit that a section has been displayed
         */
        this.emit(EVENTS.RENDITION.DISPLAYED, section);
        this.reportLocation();
      },
      (err: Error) => {
        /**
         * Emit that has been an error displaying
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
    // Some views (pre-rendered/offscreen) may not implement the EventEmitter
    // style `on` method. Guard before wiring event handlers to avoid runtime
    // TypeErrors (see prerendered views created by BookPreRenderer).
    if (typeof view.on === 'function') {
      view.on(
        EVENTS.VIEWS.MARK_CLICKED,
        (cfiRange: string, data: Record<string, unknown>) =>
          this.triggerMarkEvent(cfiRange, data, view.contents!)
      );
    } else {
      console.debug(
        '[Rendition] view does not implement .on, skipping MARK_CLICKED wiring for',
        view.section?.href
      );
    }

    this.hooks.render.trigger(view, this).then(() => {
      if (view.contents) {
        this.hooks.content.trigger(view.contents, this).then(() => {
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
      this.manager && this.manager instanceof PreRenderingViewManager;

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
  async next() {
    const queuePromise = this.q.enqueue(this.manager.next.bind(this.manager));
    return queuePromise.then((result) => {
      this.reportLocation();
      return result;
    });
  }

  /**
   * Go to the previous "page" in the rendition
   */
  prev() {
    return this.q
      .enqueue(this.manager.prev.bind(this.manager))
      .then(this.reportLocation.bind(this))
      .catch((error: Error) => {
        throw error;
      });
  }

  /**
   * Determine the Layout properties from metadata and settings
   *
   * @link http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
   */
  private determineLayoutProperties(
    metadata: LayoutProperties
  ): LayoutProperties {
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
   */
  layout(settings: RenditionOptions) {
    if (settings) {
      this._layout = new Layout(settings);
      this._layout.spread(settings.spread!, this.settings.minSpreadWidth!);

      // this.mapping = new Mapping(this._layout.props);

      this._layout.on(
        EVENTS.LAYOUT.UPDATED,
        (props: LayoutProps, changed: Partial<LayoutProps>) => {
          this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
        }
      );
    }

    if (this.manager && this._layout) {
      this.manager.applyLayout(this._layout);
    }

    return this._layout;
  }

  /**
   * Adjust if the rendition uses spreads
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
  direction(dir: Direction) {
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
          this.emit(EVENTS.RENDITION.RELOCATED, this.location);
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
   * Get a Range from a Visible CFI
   * (Used outside of this package)
   */
  getRange(cfi: string, ignoreClass?: string): Range | null {
    const _cfi = new EpubCFI(cfi);
    const found = this.manager.visible().filter(function (view) {
      if (_cfi.spinePos === view.index) return true;
    });

    // Should only ever return 1 item
    if (found.length > 0) {
      return found[0].contents!.range(cfi, ignoreClass);
    }

    return null;
  }

  /**
   * Creates a Rendition#locationRange from location
   * passed by the Manager
   */
  private located(location: LocationPoint[]): DisplayedLocation | null {
    if (!location.length) return null;

    const start: LocationPoint = location[0];
    const end: LocationPoint = location[location.length - 1];

    const located: DisplayedLocation = {
      start: buildEnrichedLocationPoint(start, 'start', this.book),
      end: buildEnrichedLocationPoint(end, 'end', this.book),
    };

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
   */
  private triggerSelectedEvent(cfirange: string, contents: Contents) {
    this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
  }

  /**
   * Emit a markClicked event with the cfiRange and data from a mark
   */
  private triggerMarkEvent(
    cfiRange: EpubCFI | string,
    data: object,
    contents: Contents
  ) {
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

  views(): Views | undefined {
    const views = this.manager ? this.manager.views : undefined;
    return views;
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
