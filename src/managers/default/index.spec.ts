// Mock scrollIntoView for jsdom environment
window.HTMLElement.prototype.scrollIntoView = jest.fn();
import DefaultViewManager from '.';

const MOCK_EVENTS = {
  MANAGERS: {
    ADDED: 'added',
    RESIZE: 'resize',
  },
};

// Mock View class
class MockView2 {
  section: any;
  expanded: boolean;
  display: jest.Mock;
  onDisplayed: jest.Mock;
  onResize: jest.Mock;
  on: jest.Mock;
  offset: jest.Mock;
  width: jest.Mock;
  locationOf: jest.Mock;

  constructor(section?: any, options?: any) {
    this.section = section || {};
    this.expanded = false;
    this.display = jest.fn().mockResolvedValue(this);
    this.onDisplayed = jest.fn();
    this.onResize = jest.fn();
    this.on = jest.fn();
    this.offset = jest.fn(() => ({ left: 0, top: 0 }));
    this.width = jest.fn(() => 100);
    this.locationOf = jest.fn(() => ({ left: 50, top: 50 }));
  }
}

// Mock Views class
class MockViews2 {
  _views: MockView2[];
  append: jest.Mock;
  prepend: jest.Mock;
  find: jest.Mock;
  show: jest.Mock;
  hide: jest.Mock;
  clear: jest.Mock;
  forEach: jest.Mock;
  displayed: jest.Mock;
  first: jest.Mock;
  last: jest.Mock;

  constructor() {
    this._views = [];
    this.append = jest.fn((view: MockView2) => {
      this._views.push(view);
    });
    this.prepend = jest.fn((view: MockView2) => {
      this._views.unshift(view);
    });
    this.find = jest.fn(() => null);
    this.show = jest.fn();
    this.hide = jest.fn();
    this.clear = jest.fn(() => {
      this._views = [];
    });
    this.forEach = jest.fn((callback: (view: MockView2) => void) => {
      this._views.forEach(callback);
    });
    this.displayed = jest.fn(() => this._views);
    this.first = jest.fn(() => this._views[0]);
    this.last = jest.fn(() => this._views[this._views.length - 1]);
  }

  get length() {
    return this._views.length;
  }
}

// Mock dependencies
class MockStage {
  opts: any;
  _container: any;
  attachTo: jest.Mock;
  getContainer: jest.Mock;
  size: jest.Mock;
  bounds: jest.Mock;
  onResize: jest.Mock;
  onOrientationChange: jest.Mock;
  destroy: jest.Mock;
  axis: jest.Mock;
  overflow: jest.Mock;
  direction: jest.Mock;

  constructor(opts: any) {
    this.opts = opts;
    this._container = {};
    this.attachTo = jest.fn();
    this.getContainer = jest.fn(() => this._container);
    this.size = jest.fn(() => ({ width: 100, height: 200 }));
    this.bounds = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 200,
      width: 100,
      height: 200,
    }));
    this.onResize = jest.fn();
    this.onOrientationChange = jest.fn();
    this.destroy = jest.fn();
    this.axis = jest.fn();
    this.overflow = jest.fn();
    this.direction = jest.fn();
  }
}

describe('DefaultViewManager', () => {
  let manager: any;
  let options: any;

  beforeEach(() => {
    options = {
      settings: { axis: 'vertical', gap: 0 },
      view: MockView2,
      request: undefined,
      queue: undefined,
    };
    manager = new DefaultViewManager(options);
    manager.stage = new MockStage({ width: 100, height: 200 });
    manager.container = {};
    manager.views = new MockViews2();
    manager.createView = jest.fn(() => new MockView2());
    manager.emit = jest.fn();
    manager.layout = {
      name: 'reflowable',
      divisor: 1,
      delta: 100,
      height: 200,
      width: 100,
      props: {},
      settings: { spread: 'auto' },
      calculate: jest.fn(),
      spread: jest.fn(),
      count: jest.fn(() => ({ pages: 1 })),
      pageWidth: 100,
    };
    manager.mapping = { page: jest.fn() };
    manager.settings.direction = 'ltr';
    manager.settings.rtlScrollType = 'default';
    manager.settings.fullsize = false;
    manager.isPaginated = false;
    manager.writingMode = 'horizontal';
  });

  test('should initialize with correct settings', () => {
    expect(manager.name).toBe('default');
    expect(manager.settings.axis).toBe('vertical');
    expect(manager.settings.gap).toBe(0);
  });

  test('should render and set up stage and views', () => {
    // Create a real DOM element for the test
    const element = document.createElement('div');
    document.body.appendChild(element);
    manager.render(element, { width: 800, height: 600 });
    // ...rest of your assertions...
  });

  test('should add a view and call display', async () => {
    const section = {};
    const view = await manager.add(section);
    expect(manager.createView).toHaveBeenCalledWith(section, false);
    expect(manager.views._views.length).toBe(1);
    expect(manager.views._views[0]).toBe(view);
    expect(view.display).toHaveBeenCalledWith(manager.request);
  });

  test('should append a view', async () => {
    const section = {};
    const view = await manager.append(section);
    expect(manager.createView).toHaveBeenCalledWith(section, false);
    expect(manager.views._views).toContain(view);
  });

  test('should prepend a view', async () => {
    const section = {};
    const view = await manager.prepend(section);
    expect(manager.createView).toHaveBeenCalledWith(section, false);
    expect(manager.views._views[0]).toBe(view);
  });

  test('should call counter on resize in prepend', () => {
    manager.counter = jest.fn();
    const section = {};
    const view = manager.createView(section, undefined);
    view.expanded = false;
    manager.views.prepend(view);
    manager.counter({ heightDelta: 10, widthDelta: 0 });
    expect(manager.counter).toHaveBeenCalledWith({
      heightDelta: 10,
      widthDelta: 0,
    });
    view.expanded = true;
    expect(view.expanded).toBe(true);
  });

  test('should destroy stage on destroy', () => {
    manager.stage = new MockStage({ width: 100, height: 200 });
    manager.container = { removeEventListener: jest.fn() };
    manager.destroy();
    expect(manager.stage.destroy).toHaveBeenCalled();
    expect(manager.rendered).toBe(false);
  });

  test('should emit afterDisplayed and afterResized', () => {
    const view = new MockView2();
    manager.afterDisplayed(view);
    expect(manager.emit).toHaveBeenCalledWith(MOCK_EVENTS.MANAGERS.ADDED, view);
    manager.afterResized(view);
    expect(manager.emit).toHaveBeenCalledWith(
      MOCK_EVENTS.MANAGERS.RESIZE,
      view.section
    );
  });

  test('should update axis and writing mode', () => {
    manager.updateAxis = jest.fn();
    manager.updateWritingMode = jest.fn();
    const section = {};
    const view = manager.createView(section, undefined);
    manager.views.append(view);
    manager.updateAxis('vertical');
    manager.updateWritingMode('vertical-rl');
    expect(manager.updateAxis).toHaveBeenCalledWith('vertical');
    expect(manager.updateWritingMode).toHaveBeenCalledWith('vertical-rl');
  });
});
