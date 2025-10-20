import type { ViewManager, View } from '../../types';
import { extend, defer } from '../../utils/core';
import { EVENTS } from '../../utils/constants';
import { EventEmitterBase } from '../../utils/event-emitter';
import { createDomEventHandler } from '../../utils/event-handler-wrapper';
import Layout from '../../layout';
import Contents from '../../contents';

// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
const PI_D2 = Math.PI / 2;
const EASING_EQUATIONS = {
  easeOutSine: function (pos: number) {
    return Math.sin(pos * PI_D2);
  },
  easeInOutSine: function (pos: number) {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
  },
  easeInOutQuint: function (pos: number) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 5);
    }
    return 0.5 * (Math.pow(pos - 2, 5) + 2);
  },
  easeInCubic: function (pos: number) {
    return Math.pow(pos, 3);
  },
};

class Snap {
  private _events = new EventEmitterBase();

  private isTouchEvent(e: Event): boolean {
    return e instanceof TouchEvent;
  }

  // Event emitter delegate methods
  emit(type: string, ...args: unknown[]): void {
    this._events.emit(type, ...args);
  }

  on(type: string, listener: (...args: unknown[]) => void): this {
    this._events.on(type, listener);
    return this;
  }

  off(type: string, listener: (...args: unknown[]) => void): this {
    this._events.off(type, listener);
    return this;
  }

  touchCanceler!: boolean;
  resizeCanceler!: boolean;
  snapping!: boolean;
  startTouchX: number | undefined;
  startTouchY: number | undefined;
  startTime: number | undefined;
  endTouchX: number | undefined;
  endTouchY: number | undefined;
  endTime: number | undefined;
  scrollLeft: number | undefined;
  scrollTop: number | undefined;
  // a contsructor helper method sets the manager property
  manager!: ViewManager;
  layout: Layout | undefined;
  fullsize: boolean | undefined;
  element!: HTMLElement;
  scroller!: HTMLElement | Window;
  isVertical?: boolean;
  _onResize?: () => void;
  _onScroll?: () => void;
  _onTouchStart?: (e: Event) => void;
  _onTouchMove?: (e: Event) => void;
  _onTouchEnd?: (e: Event) => void;
  _afterDisplayed?: (view: View) => void;

  settings!: {
    duration: number;
    minVelocity: number;
    minDistance: number;
    [key: string]: unknown;
  };

  private _supportsTouch!: boolean;

  constructor(manager: ViewManager, options: { [key: string]: unknown }) {
    this.settings = extend(
      {
        duration: 80,
        minVelocity: 0.2,
        minDistance: 10,
        easing: EASING_EQUATIONS['easeInCubic'],
      },
      options || {}
    );

    this._supportsTouch = this.supportsTouch();

    if (this._supportsTouch) {
      this.setup(manager);
    }
  }

  setup(manager: ViewManager) {
    this.manager = manager;

    this.layout = this.manager.settings.layout;

    if (this.fullsize) {
      if (this.manager.stage.element === undefined) {
        throw new Error('Element is not defined');
      }

      this.element = this.manager.stage.element;
      this.scroller = window;
      this.disableScroll();
    } else {
      if (this.manager.stage.container === undefined) {
        throw new Error('Container is not defined');
      }

      this.element = this.manager.stage.container;
      this.scroller = this.element;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.element.style as any)['WebkitOverflowScrolling'] = 'touch';
    }

    // this.overflow = this.manager.overflow;

    // set lookahead offset to page width
    this.manager.settings.offset = this.layout.width;
    this.manager.settings.afterScrolledTimeout = this.settings.duration * 2;

    this.isVertical = this.manager.settings.axis === 'vertical';

    // disable snapping if not paginated or axis in not horizontal
    if (!this.manager.isPaginated || this.isVertical) {
      return;
    }

    this.touchCanceler = false;
    this.resizeCanceler = false;
    this.snapping = false;

    this.startTouchX = undefined;
    this.startTouchY = undefined;
    this.startTime = undefined;
    this.endTouchX = undefined;
    this.endTouchY = undefined;
    this.endTime = undefined;

    this.addListeners();
  }

  supportsTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  disableScroll() {
    this.element.style.overflow = 'hidden';
  }

  enableScroll() {
    this.element.style.overflow = '';
  }

  addListeners() {
    this._onResize = this.onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    this._onScroll = this.onScroll.bind(this);
    this.scroller.addEventListener('scroll', this._onScroll);

    this._onTouchStart = this.onTouchStart.bind(this);
    this.scroller.addEventListener('touchstart', this._onTouchStart, {
      passive: true,
    });

    this.on('touchstart', createDomEventHandler(this._onTouchStart));

    this._onTouchMove = this.onTouchMove.bind(this);
    this.scroller.addEventListener('touchmove', this._onTouchMove, {
      passive: true,
    });
    this.on('touchmove', createDomEventHandler(this._onTouchMove));

    this._onTouchEnd = this.onTouchEnd.bind(this);
    this.scroller.addEventListener('touchend', this._onTouchEnd, {
      passive: true,
    });
    this.on('touchend', createDomEventHandler(this._onTouchEnd));

    this._afterDisplayed = this.afterDisplayed.bind(this);
    this.manager.on(EVENTS.MANAGERS.ADDED, (...args: unknown[]) => {
      this._afterDisplayed?.(args[0] as View);
    });
  }

  removeListeners() {
    window.removeEventListener('resize', this._onResize!);
    this._onResize = () => {};

    this.scroller.removeEventListener('scroll', this._onScroll!);
    this._onScroll = () => {};

    if (this._onTouchStart) {
      this.scroller.removeEventListener('touchstart', this._onTouchStart);
      this.off!('touchstart', createDomEventHandler(this._onTouchStart));
    }
    this._onTouchStart = () => {};

    if (this._onTouchMove) {
      this.scroller.removeEventListener('touchmove', this._onTouchMove);
      this.off!('touchmove', createDomEventHandler(this._onTouchMove));
    }
    this._onTouchMove = () => {};

    if (this._onTouchEnd) {
      this.scroller.removeEventListener('touchend', this._onTouchEnd);
      this.off!('touchend', createDomEventHandler(this._onTouchEnd));
    }
    this._onTouchEnd = () => {};

    if (this._afterDisplayed) {
      this.manager.off!(EVENTS.MANAGERS.ADDED, (...args: unknown[]) => {
        this._afterDisplayed?.(args[0] as View);
      });
    }
    this._afterDisplayed = () => {};
  }

  afterDisplayed(view: View) {
    const contents = view.contents;
    ['touchstart', 'touchmove', 'touchend'].forEach((e) => {
      contents!.on(e, (...args: unknown[]) => {
        const ev = args[0] as TouchEvent;
        this.triggerViewEvent(ev, contents!);
      });
    });
  }

  triggerViewEvent(e: Event, contents: Contents) {
    this.emit(e.type, e, contents);
  }

  onScroll() {
    // if it is full size, it can only be scrolled by the window
    if (this.scroller instanceof Window || this.fullsize) {
      this.scrollLeft = window.scrollX;
      this.scrollTop = window.scrollY;
    } else {
      this.scrollLeft = (this.scroller as HTMLElement).scrollLeft;
      this.scrollTop = (this.scroller as HTMLElement).scrollTop;
    }
  }

  onResize() {
    this.resizeCanceler = true;
  }

  onTouchStart(e: Event) {
    // check with a helper, so we can mock it in the test
    if (!this.isTouchEvent(e)) return;

    // we know it is a TouchEvent because we checked it earlier
    const { screenX, screenY } = (e as TouchEvent).touches[0]!;

    if (this.fullsize) {
      this.enableScroll();
    }

    this.touchCanceler = true;

    if (!this.startTouchX) {
      this.startTouchX = screenX;
      this.startTouchY = screenY;
      this.startTime = this.now();
    }

    this.endTouchX = screenX;
    this.endTouchY = screenY;
    this.endTime = this.now();
  }

  onTouchMove(e: Event) {
    if (!this.isTouchEvent(e)) return;
    const { screenX, screenY } = (e as TouchEvent).touches[0]!;
    const deltaY =
      this.endTouchY === undefined ? 0 : Math.abs(screenY - this.endTouchY);
    this.touchCanceler = true;

    if (!this.fullsize && deltaY < 10 && this.endTouchX !== undefined) {
      this.element.scrollLeft -= screenX - this.endTouchX;
    }

    this.endTouchX = screenX;
    this.endTouchY = screenY;
    this.endTime = this.now();
  }

  onTouchEnd(e?: Event) {
    if (e && !this.isTouchEvent(e)) return;

    if (this.fullsize) {
      this.disableScroll();
    }

    this.touchCanceler = false;

    const swipped = this.wasSwiped();

    if (swipped !== 0) {
      this.snap(swipped);
    } else {
      this.snap();
    }

    this.startTouchX = undefined;
    this.startTouchY = undefined;
    this.startTime = undefined;
    this.endTouchX = undefined;
    this.endTouchY = undefined;
    this.endTime = undefined;
  }

  wasSwiped() {
    if (this.layout === undefined) {
      throw new Error('Layout is not defined');
    }

    const snapWidth = this.layout.pageWidth! * this.layout.divisor;
    const distance = this.endTouchX! - this.startTouchX!;
    const absolute = Math.abs(distance);
    const time = this.endTime! - this.startTime!;
    const velocity = distance / time;
    const minVelocity = this.settings.minVelocity;

    if (absolute <= this.settings.minDistance || absolute >= snapWidth) {
      return 0;
    }

    if (velocity > minVelocity) {
      // previous
      return -1;
    } else if (velocity < -minVelocity) {
      // next
      return 1;
    }

    return 0;
  }

  needsSnap() {
    const left = this.scrollLeft!;
    if (this.layout === undefined) {
      throw new Error('Layout is not defined');
    }

    const snapWidth = this.layout.pageWidth! * this.layout.divisor;
    return left % snapWidth !== 0;
  }

  snap(howMany = 0) {
    const left = this.scrollLeft;

    if (this.layout === undefined) {
      throw new Error('Layout is not defined');
    }

    const snapWidth = this.layout.pageWidth! * this.layout.divisor;

    if (!snapWidth) {
      throw new Error('snapWidth must be nonzero');
    }

    let snapTo = Math.round(left! / snapWidth) * snapWidth;

    if (howMany) {
      snapTo += howMany * snapWidth;
    }

    return this.smoothScrollTo(snapTo);
  }

  smoothScrollTo(destination: number) {
    const deferred = new defer();
    const start = this.scrollLeft!;
    const startTime = this.now();

    const duration = this.settings.duration;

    this.snapping = true;

    // add animation loop
    const tick = () => {
      const now = this.now();
      const time = Math.min(1, (now - startTime) / duration);

      if (this.touchCanceler || this.resizeCanceler) {
        this.resizeCanceler = false;
        this.snapping = false;
        deferred.resolve(undefined);
        return;
      }

      if (time < 1) {
        window.requestAnimationFrame(tick);
        this.scrollTo(start + (destination - start) * time, 0);
      } else {
        this.scrollTo(destination, 0);
        this.snapping = false;
        deferred.resolve(undefined);
      }
    };

    tick();

    return deferred.promise;
  }

  scrollTo(left = 0, top = 0) {
    if (this.fullsize) {
      window.scroll(left, top);
      return;
    }

    if (this.scroller instanceof Window) {
      window.scroll(left, top);
    } else if (this.scroller) {
      (this.scroller as HTMLElement).scrollLeft = left;
      (this.scroller as HTMLElement).scrollTop = top;
    }
  }

  now() {
    return 'now' in window.performance
      ? performance.now()
      : new Date().getTime();
  }

  destroy() {
    if (!this.scroller) {
      return;
    }

    if (this.fullsize) {
      this.enableScroll();
    }

    this.removeListeners();

    // @ts-expect-error this is only at destroy time
    this.scroller = undefined;
  }
}

export default Snap;
