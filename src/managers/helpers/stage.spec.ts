import Stage from './stage';

beforeAll(() => {
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
    }),
  });
});

describe('Stage', () => {
  let documentMock: any;
  let windowMock: any;
  let container: any;

  beforeEach(() => {
    container = {
      style: {},
      classList: { add: jest.fn() },
      appendChild: jest.fn(),
      getBoundingClientRect: jest.fn(() => ({ width: 100, height: 200 })),
      clientWidth: 100,
      clientHeight: 200,
      dir: undefined,
    };
    documentMock = {
      createElement: jest.fn(() => container),
      getElementById: jest.fn(() => container),
      head: { appendChild: jest.fn() },
      body: { style: {} },
    };
    windowMock = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getComputedStyle: jest.fn(() => ({
        'padding-left': '0',
        'padding-right': '0',
        'padding-top': '0',
        'padding-bottom': '0',
      })),
      innerWidth: 100,
      innerHeight: 200,
    };
    global.document = documentMock;
    global.window = windowMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should construct and create container', () => {
    const stage = new Stage({ width: '100', height: '200' });
    expect(stage.container).toBeInstanceOf(HTMLDivElement);
    expect(stage.container.classList.contains('epub-container')).toBe(true);
  });

  test('should wrap container if hidden', () => {
    const stage = new Stage({ hidden: true });
    expect(stage.wrapper).toBeInstanceOf(HTMLDivElement);
  });

  test('should create container with correct styles', () => {
    const stage = new Stage({
      width: '100',
      height: '200',
      axis: 'horizontal',
      overflow: 'scroll',
      direction: 'rtl',
    });
    expect(stage.container.style.display).toBe('flex');
    expect(stage.container.style.flexDirection).toBe('row');
    expect(stage.container.style.overflowX).toBe('scroll');
    expect(stage.container.dir).toBe('rtl');
    expect(stage.container.style.direction).toBe('rtl');
  });

  test('should attach to element', () => {
    const stage = new Stage({});
    const el = document.createElement('div');
    document.body.appendChild(el);
    stage.attachTo(el);
    expect(el.contains(stage.container)).toBe(true);
    expect(stage.element).toBe(el);
  });

  test('should get container', () => {
    const stage = new Stage({});
    expect(stage.getContainer()).toBe(stage.container);
  });

  test('should add resize and orientation listeners', () => {
    const stage = new Stage({});
    const resizeFn = jest.fn();
    jest.spyOn(window, 'addEventListener');
    stage.onResize(resizeFn);
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      false
    );
    const orientFn = jest.fn();
    stage.onOrientationChange(orientFn);
    expect(window.addEventListener).toHaveBeenCalledWith(
      'orientationchange',
      orientFn,
      false
    );
  });

  test('should calculate size', () => {
    const stage = new Stage({ width: '100', height: '200' });
    stage.element = container;
    stage.container = container;
    const size = stage.size('100', '200');
    expect(size.width).toBe(100);
    expect(size.height).toBe(200);
  });

  test('should get bounds', () => {
    const stage = new Stage({});
    stage.container = container;
    container.style.overflow = 'hidden';
    container.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 200,
    }));
    expect(stage.bounds()).toEqual({ width: 100, height: 200 });
  });

  test('should add style rules', () => {
    const stage = new Stage({});
    stage.sheet = { insertRule: jest.fn() } as any;
    stage.id = 'test-id';
    stage.addStyleRules('div', [{ color: 'red', 'font-size': '12px' }]);
    expect(stage.sheet!.insertRule).toHaveBeenCalledWith(
      '#test-id div {color:red;font-size:12px;}',
      0
    );
  });

  test('should set axis and direction', () => {
    const stage = new Stage({});
    stage.axis('horizontal');
    expect(stage.container.style.display).toBe('flex');
    stage.axis('vertical');
    expect(stage.container.style.display).toBe('block');
    stage.direction('rtl');
    expect(stage.container.dir).toBe('rtl');
    expect(stage.container.style.direction).toBe('rtl');
  });

  test('should set overflow', () => {
    const stage = new Stage({ axis: 'vertical' });
    stage.overflow('scroll');
    expect(stage.container.style.overflowY).toBe('scroll');
    expect(stage.container.style.overflowX).toBe('hidden');
    stage.settings.axis = 'horizontal';
    stage.overflow('scroll');
    expect(stage.container.style.overflowX).toBe('scroll');
    expect(stage.container.style.overflowY).toBe('hidden');
  });

  test('should destroy and remove listeners', () => {
    const stage = new Stage({});
    const el = document.createElement('div');
    document.body.appendChild(el);
    stage.attachTo(el);
    jest.spyOn(window, 'removeEventListener');
    stage.resizeFunc = jest.fn();
    stage.orientationChangeFunc = jest.fn();
    stage.destroy();
    expect(
      el.contains(stage.container) ||
        (stage.wrapper ? el.contains(stage.wrapper) : false)
    ).toBe(false);
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      stage.resizeFunc
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'orientationchange',
      stage.orientationChangeFunc
    );
  });
});
