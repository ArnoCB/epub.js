import Snap from './snap';

describe('Snap', () => {
  let manager: any;
  let stage: any;
  let container: any;

  beforeEach(() => {
    jest.spyOn(Snap.prototype as any, 'isTouchEvent').mockReturnValue(true);

    container = {
      style: {},
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      scrollLeft: 0,
      scrollTop: 0,
    };
    stage = {
      element: container,
      container: container,
    };
    manager = {
      settings: {
        layout: { width: 800, pageWidth: 800, divisor: 1 },
        axis: 'horizontal',
        offset: 0,
        afterScrolledTimeout: 0,
        paginated: true,
      },
      isPaginated: true,
      stage,
      on: jest.fn(),
      off: jest.fn(),
    };
    // Mock window and document
    global.window = Object.assign(global.window || {}, {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      scroll: jest.fn(),
      scrollX: 0,
      scrollY: 0,
      requestAnimationFrame: (cb: any) => setTimeout(cb, 1),
      performance: { now: () => Date.now() },
    });
    global.document = Object.assign(global.document || {}, {
      instanceof: () => false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should construct and extend options', () => {
    const snap = new Snap(manager, { duration: 123, minVelocity: 0.5 });
    expect(snap.settings.duration).toBe(123);
    expect(snap.settings.minVelocity).toBe(0.5);
    expect(snap.settings.easing).toBeDefined();
  });

  test('should detect touch support', () => {
    const snap = new Snap(manager, {});
    expect(typeof snap.supportsTouch()).toBe('boolean');
  });

  test('should set up listeners if touch is supported', () => {
    const snap = new Snap(manager, {});
    snap.supportsTouch = () => true;
    snap.setup(manager);
    expect(manager.on).toHaveBeenCalled();
    expect(container.addEventListener).toHaveBeenCalled();
  });

  test('should disable and enable scroll', () => {
    const snap = new Snap(manager, {});
    (snap as any).fullsize = false;
    snap.element = container;
    snap.disableScroll();
    expect(container.style.overflow).toBe('hidden');
    snap.enableScroll();
    expect(container.style.overflow).toBe('');
  });

  test('should call onScroll and update scrollLeft/scrollTop', () => {
    const snap = new Snap(manager, {});
    (snap as any).fullsize = false;
    snap.scroller = container;
    container.scrollLeft = 42;
    container.scrollTop = 24;
    snap.onScroll();
    expect(snap.scrollLeft).toBe(42);
    expect(snap.scrollTop).toBe(24);
  });

  test('should call onResize and set resizeCanceler', () => {
    const snap = new Snap(manager, {});
    snap.onResize();
    expect(snap.resizeCanceler).toBe(true);
  });

  test('should handle touch start, move, and end', () => {
    const snap = new Snap(manager, {});
    (snap as any).fullsize = false;
    snap.scroller = container;
    const createTouch = (x: number, y: number) => ({
      identifier: 0,
      target: document.body,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      pageX: x,
      pageY: y,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 0,
    });

    const createTouchEvent = (
      type: string,
      x: number,
      y: number
    ): TouchEvent => {
      return {
        type,
        touches: [createTouch(x, y)],
      } as unknown as TouchEvent;
    };

    snap.onTouchStart(createTouchEvent('touchstart', 10, 20));
    expect(snap.startTouchX).toBe(10);
    expect(snap.startTouchY).toBe(20);
    snap.onTouchMove(createTouchEvent('touchmove', 15, 25));
    expect(snap.endTouchX).toBe(15);
    expect(snap.endTouchY).toBe(25);
    snap.onTouchEnd();
    expect(snap.startTouchX).toBeUndefined();
    expect(snap.endTouchX).toBeUndefined();
  });

  test('should determine swipe direction in wasSwiped', () => {
    const snap = new Snap(manager, {});
    snap.layout = { pageWidth: 100, divisor: 1 } as any;
    snap.startTouchX = 0;
    snap.endTouchX = 50;
    snap.startTime = 0;
    snap.endTime = 100;
    snap.settings.minDistance = 10;
    snap.settings.minVelocity = 0.2;
    expect([0, -1, 1]).toContain(snap.wasSwiped());
  });

  test('should check needsSnap', () => {
    const snap = new Snap(manager, {});
    snap.scrollLeft = 105;
    snap.layout = { pageWidth: 100, divisor: 1 } as any;
    expect(snap.needsSnap()).toBe(true);
    snap.scrollLeft = 100;
    expect(snap.needsSnap()).toBe(false);
  });

  test('should snap to correct position', async () => {
    const snap = new Snap(manager, {});
    snap.scrollLeft = 100;
    snap.layout = { pageWidth: 100, divisor: 1 } as any;
    snap.smoothScrollTo = jest.fn(() => Promise.resolve('done'));
    await expect(snap.snap(1)).resolves.toBe('done');
    expect(snap.smoothScrollTo).toHaveBeenCalled();
  });

  test('should smooth scroll to destination', async () => {
    const snap = new Snap(manager, {});
    snap.scrollLeft = 0;
    snap.layout = { pageWidth: 100, divisor: 1 } as any;
    snap.scrollTo = jest.fn();
    await expect(snap.smoothScrollTo(100)).resolves.toBeUndefined();
    expect(snap.scrollTo).toHaveBeenCalled();
  });

  test('should scrollTo using fullsize and scroller', () => {
    const snap = new Snap(manager, {});
    (snap as any).fullsize = true;
    global.window.scroll = jest.fn();
    snap.scrollTo(10, 20);
    expect(global.window.scroll).toHaveBeenCalledWith(10, 20);
    (snap as any).fullsize = false;
    snap.scroller = container;
    snap.scrollTo(30, 40);
    expect(container.scrollLeft).toBe(30);
    expect(container.scrollTop).toBe(40);
  });

  test('should destroy and remove listeners', () => {
    const snap = new Snap(manager, {});
    snap.scroller = container;
    (snap as any).fullsize = false;
    snap.removeListeners = jest.fn();
    snap.enableScroll = jest.fn();
    snap.destroy();
    expect(snap.removeListeners).toHaveBeenCalled();
    expect(snap.scroller).toBeUndefined();
  });
});
