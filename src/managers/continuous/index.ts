import { extend, defer, requestAnimationFrame } from '../../utils/core';
import DefaultViewManager, { DefaultViewManagerSettings } from '../default';
import Snap from '../helpers/snap';
import { EVENTS } from '../../utils/constants';
import { debounce } from '../../utils/helpers';
import { ViewManager } from '../helpers/snap';
import { Axis, Flow } from 'src/layout';
import Section from '../../section';
import { View } from '../helpers/views';
import EventEmitter from 'event-emitter';
import IframeView from '../views/iframe';

type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off'>;

class ContinuousViewManager
  extends DefaultViewManager
  implements ViewManager, EventEmitterMethods
{
  trimTimeout: NodeJS.Timeout | undefined;
  snapper: Snap | undefined;
  scrollDeltaVert: number = 0;
  scrollDeltaHorz: number = 0;
  _scrolled!: () => void;
  didScroll: boolean | undefined;
  scrollTimeout: NodeJS.Timeout | undefined;
  tick: ((callback: FrameRequestCallback) => number) | undefined;

  // These are probably sensible values for a starting position
  prevScrollTop: number = 0;
  prevScrollLeft: number = 0;

  constructor(options: {
    settings: DefaultViewManagerSettings;
    view?: View | undefined;
    request?: (url: string) => Promise<Document>;
    queue?: unknown;
    [key: string]: unknown;
  }) {
    super(options);

    this.name = 'continuous';

    this.settings = extend(this.settings || {}, {
      infinite: true,
      overflow: undefined,
      axis: undefined,
      writingMode: undefined,
      flow: 'scrolled',
      offset: 500,
      offsetDelta: 250,
      width: undefined,
      height: undefined,
      snap: false,
      afterScrolledTimeout: 10,
      allowScriptedContent: false,
      allowPopups: false,
      transparency: false,
    });

    extend(this.settings, options.settings || {});

    // Gap can be 0, but defaults doesn't handle that
    if (options.settings.gap && options.settings.gap === 0) {
      this.settings.gap = options.settings.gap;
    }

    this.viewSettings = {
      ignoreClass: this.settings.ignoreClass,
      axis: this.settings.axis,
      flow: this.settings.flow,
      layout: this.layout,
      width: 0,
      height: 0,
      forceEvenPages: false,
      allowScriptedContent: this.settings.allowScriptedContent,
      allowPopups: this.settings.allowPopups,
      transparency: this.settings.transparency,
    };

    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  async display(section: Section, target?: HTMLElement | string) {
    return DefaultViewManager.prototype.display
      .call(this, section, target)
      .then(() => {
        return this.fill();
      });
  }

  fill(_full?: defer) {
    const full = _full || new defer();

    this.q
      .enqueue(() => {
        return this.check();
      })
      .then((result) => {
        if (result) {
          this.fill(full);
        } else {
          full.resolve(undefined);
        }
      });

    return full.promise;
  }

  afterResized(view: View) {
    this.emit(EVENTS.MANAGERS.RESIZE, view.section);
  }

  // Remove Previous Listeners if present
  removeShownListeners(view: View) {
    // view.off("shown", this.afterDisplayed);
    // view.off("shown", this.afterDisplayedAbove);
    view.onDisplayed = function () {};
  }

  async add(section: Section): Promise<View> {
    const view = this.createView(section);

    this.views.append(view);

    view.on(EVENTS.VIEWS.RESIZED, () => {
      // @todo: neither view has 'expanded' implemented
      // view.expanded = true;
    });

    view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
      this.updateAxis(axis);
    });

    view.on(EVENTS.VIEWS.WRITING_MODE, (mode: string) => {
      this.updateWritingMode(mode);
    });

    // view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
    view.onDisplayed = this.afterDisplayed.bind(this);
    view.onResize = this.afterResized.bind(this);

    return view.display(this.request).then(() => view);
  }

  append(section: Section): Promise<View> {
    const view = this.createView(section);

    view.on(EVENTS.VIEWS.RESIZED, () => {
      // @todo: neither view has 'expanded' implemented
      // view.expanded = true;
    });

    view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
      this.updateAxis(axis);
    });

    view.on(EVENTS.VIEWS.WRITING_MODE, (mode: string) => {
      this.updateWritingMode(mode);
    });

    this.views.append(view);

    view.onDisplayed = this.afterDisplayed.bind(this);

    return Promise.resolve(view);
  }

  prepend(section: Section): Promise<IframeView> {
    const view = this.createView(section);

    view.on(
      EVENTS.VIEWS.RESIZED,
      (bounds: { heightDelta: number; widthDelta: number }) => {
        this.counter(bounds);
        // @todo: neither view has 'expanded' implemented
        // view.expanded = true;
      }
    );

    view.on(EVENTS.VIEWS.AXIS, (axis: Axis) => {
      this.updateAxis(axis);
    });

    view.on(EVENTS.VIEWS.WRITING_MODE, (mode: string) => {
      this.updateWritingMode(mode);
    });

    this.views.prepend(view);

    view.onDisplayed = this.afterDisplayed.bind(this);

    return Promise.resolve(view);
  }

  counter(bounds: { heightDelta: number; widthDelta: number }) {
    if (this.settings.axis === 'vertical') {
      this.scrollBy(0, bounds.heightDelta, true);
    } else {
      this.scrollBy(bounds.widthDelta, 0, true);
    }
  }

  async update(_offset?: number) {
    const container = this.bounds() as DOMRect;
    const views = this.views.all();
    const viewsLength = views.length;
    const visible = [];
    const offset =
      typeof _offset != 'undefined' ? _offset : this.settings.offset || 0;
    let isVisible;
    let view: View;

    const updating = new defer();
    const promises = [];
    for (let i = 0; i < viewsLength; i++) {
      view = views[i];

      isVisible = this.isVisible(view, offset, offset, container);

      if (isVisible === true) {
        if (!view.displayed) {
          const displayed = view.display(this.request).then(
            (v) => {
              (v as View).show();
            },
            () => {
              view.hide();
            }
          );
          promises.push(displayed);
        } else {
          view.show();
        }
        visible.push(view);
      } else {
        this.q.enqueue(view.destroy.bind(view));
        // console.log("hidden " + view.index, view.displayed);

        clearTimeout(this.trimTimeout);
        this.trimTimeout = setTimeout(() => {
          this.q.enqueue(this.trim.bind(this));
        }, 250);
      }
    }

    if (promises.length) {
      return Promise.all(promises).catch((err) => {
        updating.reject(err);
      });
    } else {
      updating.resolve(undefined);
      return updating.promise;
    }
  }

  /**
   * A dynamic pagination/virtualization check that ensures the visible content is filled and loads more
   * views as needed when scrolling near the edges.
   *
   * Returns false if no new views needed to be appended or prepended—i.e., the visible area
   * is already filled and no additional content needs to be loaded.
   */
  check(_offsetLeft?: number, _offsetTop?: number): Promise<boolean> {
    const checking = new defer<boolean>();
    const newViews: View[] = [];

    const horizontal = this.settings.axis === 'horizontal';
    let delta = this.settings.offset || 0;

    if (_offsetLeft && horizontal) {
      delta = _offsetLeft;
    }

    if (_offsetTop && !horizontal) {
      delta = _offsetTop;
    }

    const bounds = this._bounds; // bounds saved this until resize

    let width: number = 0;

    if ('width' in bounds) {
      // bounds is DOMRect
      width = bounds.width;
    } else {
      // bounds is custom object, calculate width if needed
      width = bounds.right - bounds.left;
    }

    let height: number = 0;

    if ('height' in bounds) {
      // bounds is DOMRect
      height = bounds.height;
    } else {
      // bounds is custom object, calculate height if needed
      height = bounds.bottom - bounds.top;
    }

    let offset: number = horizontal ? this.scrollLeft! : this.scrollTop!;
    const visibleLength = horizontal ? Math.floor(width) : height;
    const contentLength = horizontal
      ? this.container.scrollWidth
      : this.container.scrollHeight;
    const writingMode =
      this.writingMode && this.writingMode.indexOf('vertical') === 0
        ? 'vertical'
        : 'horizontal';
    const rtlScrollType = this.settings.rtlScrollType;
    const rtl = this.settings.direction === 'rtl';

    if (!this.settings.fullsize) {
      // Scroll offset starts at width of element
      if (rtl && rtlScrollType === 'default' && writingMode === 'horizontal') {
        offset = contentLength - visibleLength - offset;
      }
      // Scroll offset starts at 0 and goes negative
      if (rtl && rtlScrollType === 'negative' && writingMode === 'horizontal') {
        offset = offset * -1;
      }
    } else {
      // Scroll offset starts at 0 and goes negative
      if (
        (horizontal && rtl && rtlScrollType === 'negative') ||
        (!horizontal && rtl && rtlScrollType === 'default')
      ) {
        offset = offset * -1;
      }
    }

    const prepend = async () => {
      const first = this.views.first();
      const prev = first && first.section!.prev();

      if (prev) {
        newViews.push(await this.prepend(prev));
      }
    };

    const append = async () => {
      const last = this.views.last();
      const next = last && last.section!.next();

      if (next) {
        newViews.push(await this.append(next));
      }
    };

    const end = offset + visibleLength + delta;
    const start = offset - delta;

    if (end >= contentLength) {
      append();
    }

    if (start < 0) {
      prepend();
    }

    const promises = newViews.map((view) => {
      return view.display(this.request);
    });

    if (newViews.length) {
      return Promise.all(promises)
        .then(() => {
          return this.check();
        })
        .then(
          () => {
            // Check to see if anything new is on screen after rendering
            return this.update(delta);
          },
          (err) => {
            return err;
          }
        );
    } else {
      this.q.enqueue(() => {
        this.update();
      });
      checking.resolve(false);
      return checking.promise;
    }
  }

  trim() {
    const task = new defer();
    const displayed = this.views.displayed();
    const first = displayed[0];
    const last = displayed[displayed.length - 1];
    const firstIndex = this.views.indexOf(first);
    const lastIndex = this.views.indexOf(last);
    const above = this.views.slice(0, firstIndex);
    const below = this.views.slice(lastIndex + 1);

    // Erase all but last above
    for (let i = 0; i < above.length - 1; i++) {
      this.erase(above[i], above);
    }

    // Erase all except first below
    for (let j = 1; j < below.length; j++) {
      this.erase(below[j]);
    }

    task.resolve(undefined);
    return task.promise;
  }

  erase(view: View, above?: View[]) {
    let prevTop;
    let prevLeft;

    if (!this.settings.fullsize) {
      prevTop = this.container.scrollTop;
      prevLeft = this.container.scrollLeft;
    } else {
      prevTop = window.scrollY;
      prevLeft = window.scrollX;
    }

    const bounds = view.bounds()!;

    this.views.remove(view);

    if (above) {
      if (this.settings.axis === 'vertical') {
        this.scrollTo(0, prevTop - bounds.height, true);
      } else {
        if (this.settings.direction === 'rtl') {
          if (!this.settings.fullsize) {
            this.scrollTo(prevLeft, 0, true);
          } else {
            this.scrollTo(prevLeft + Math.floor(bounds.width), 0, true);
          }
        } else {
          this.scrollTo(prevLeft - Math.floor(bounds.width), 0, true);
        }
      }
    }
  }

  moveTo(offset: { top: number; left: number }) {
    let distX = 0,
      distY = 0;
    if (!this.isPaginated) {
      distY = offset.top;
    } else {
      distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
    }
    if (distX > 0 || distY > 0) {
      this.scrollBy(distX, distY, true);
    }
  }

  addEventListeners() {
    window.addEventListener('unload', () => {
      this.ignore = true;
      // this.scrollTo(0,0);
      this.destroy();
    });

    this.addScrollListeners();

    if (this.isPaginated && this.settings.snap) {
      this.snapper = new Snap(
        this,
        typeof this.settings.snap === 'object' ? { ...this.settings.snap } : {}
      );
    }
  }

  addScrollListeners() {
    let scroller;

    this.tick = requestAnimationFrame;

    const dir =
      this.settings.direction === 'rtl' &&
      this.settings.rtlScrollType === 'default'
        ? -1
        : 1;

    this.scrollDeltaVert = 0;
    this.scrollDeltaHorz = 0;

    if (!this.settings.fullsize) {
      scroller = this.container;
      this.scrollTop = this.container.scrollTop;
      this.scrollLeft = this.container.scrollLeft;
    } else {
      scroller = window;
      this.scrollTop = window.scrollY * dir;
      this.scrollLeft = window.scrollX * dir;
    }

    this._onScroll = this.onScroll.bind(this);
    scroller.addEventListener('scroll', this._onScroll);
    this._scrolled = debounce(this.hasScrolled.bind(this), 30);
    this.didScroll = false;
  }

  removeEventListeners() {
    let scroller;

    if (!this.settings.fullsize) {
      scroller = this.container;
    } else {
      scroller = window;
    }

    scroller.removeEventListener('scroll', this._onScroll!);
    this._onScroll = undefined;
  }

  onScroll() {
    let scrollTop;
    let scrollLeft;
    const dir =
      this.settings.direction === 'rtl' &&
      this.settings.rtlScrollType === 'default'
        ? -1
        : 1;

    if (!this.settings.fullsize) {
      scrollTop = this.container.scrollTop;
      scrollLeft = this.container.scrollLeft;
    } else {
      scrollTop = window.scrollY * dir;
      scrollLeft = window.scrollX * dir;
    }

    this.scrollTop = scrollTop;
    this.scrollLeft = scrollLeft;

    if (!this.ignore) {
      this._scrolled();
    } else {
      this.ignore = false;
    }

    this.scrollDeltaVert += Math.abs(scrollTop - this.prevScrollTop);
    this.scrollDeltaHorz += Math.abs(scrollLeft - this.prevScrollLeft);

    this.prevScrollTop = scrollTop;
    this.prevScrollLeft = scrollLeft;

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.scrollDeltaVert = 0;
      this.scrollDeltaHorz = 0;
    }, 150);

    clearTimeout(this.afterScrolled);

    this.didScroll = false;
  }

  hasScrolled(): void {
    this.q.enqueue(() => {
      return this.check();
    });

    this.emit(EVENTS.MANAGERS.SCROLL, {
      top: this.scrollTop,
      left: this.scrollLeft,
    });

    clearTimeout(this.afterScrolled);
    this.afterScrolled = setTimeout(() => {
      // Don't report scroll if we are about the snap
      if (
        this.snapper &&
        this.snapper.supportsTouch() &&
        this.snapper.needsSnap()
      ) {
        return;
      }

      this.emit(EVENTS.MANAGERS.SCROLLED, {
        top: this.scrollTop,
        left: this.scrollLeft,
      });
    }, this.settings.afterScrolledTimeout);
  }

  next() {
    const delta =
      this.layout.props.name === 'pre-paginated' && this.layout.props.spread
        ? this.layout.props.delta * 2
        : this.layout.props.delta;

    if (!this.views.length) return Promise.resolve();

    if (this.isPaginated && this.settings.axis === 'horizontal') {
      this.scrollBy(delta, 0, true);
    } else {
      this.scrollBy(0, this.layout.height, true);
    }

    this.q.enqueue(() => {
      return this.check().then(() => {});
    });

    return Promise.resolve();
  }

  prev() {
    const delta =
      this.layout.props.name === 'pre-paginated' && this.layout.props.spread
        ? this.layout.props.delta * 2
        : this.layout.props.delta;

    if (!this.views.length) return Promise.resolve();

    if (this.isPaginated && this.settings.axis === 'horizontal') {
      this.scrollBy(-delta, 0, true);
    } else {
      this.scrollBy(0, -this.layout.height, true);
    }

    this.q.enqueue(() => {
      return this.check().then(() => {});
    });

    return Promise.resolve();
  }

  updateFlow(flow: Flow) {
    if (this.rendered && this.snapper) {
      this.snapper.destroy();
      this.snapper = undefined;
    }

    super.updateFlow(flow, 'scroll');

    if (this.rendered && this.isPaginated && this.settings.snap) {
      this.snapper = new Snap(
        this,
        typeof this.settings.snap === 'object'
          ? (this.settings.snap as { [key: string]: unknown })
          : ({} as { [key: string]: unknown })
      );
    }
  }

  destroy() {
    super.destroy();

    if (this.snapper) {
      this.snapper.destroy();
    }
  }
}

export default ContinuousViewManager;
