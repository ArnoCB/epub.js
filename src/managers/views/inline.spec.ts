import Section from '../../section';
import Contents from '../../contents';
import InlineView from './inline';
import { InlineViewOptions } from '../../types';

describe('InlineView', () => {
  let section: Section;

  const options: InlineViewOptions = {
    axis: 'vertical',
    width: 100,
    height: 200,
    // add other required properties
  };
  let view: InstanceType<typeof InlineView>;

  beforeEach(() => {
    section = {
      index: 1,
      render: jest.fn(() =>
        Promise.resolve(new Contents(document, document.body, 'cfiBase', 1))
      ),
    } as unknown as Section;
    view = new InlineView(section, options);
  });

  test('should initialize with section and options', () => {
    expect(view.section).toBe(section);
    expect(view.settings.axis).toBe('vertical');
    expect(view.settings.width).toBe(100);
    expect(view.settings.height).toBe(200);
    expect(view.index).toBe(1);
    expect(view.element).toBeInstanceOf(HTMLElement);
  });

  test('container() should create a div with correct styles', () => {
    const el = view.container('vertical');
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.classList.contains('epub-view')).toBe(true);
    expect(el.style.overflow).toBe('hidden');
    expect(el.style.display).toBe('block');
  });

  test('create() should create a frame with correct attributes', () => {
    const frame = view.create();
    expect(frame).toBeInstanceOf(HTMLElement);
    expect(frame.id).toBe(view.id);
    expect(frame.style.overflow).toBe('hidden');
    expect(frame.style.wordSpacing).toBe('initial');
    expect(frame.style.lineHeight).toBe('initial');
    expect(view.element.contains(frame)).toBe(true);
  });

  test('render() should call section.render and set up frame', async () => {
    view.settings.layout.format = jest.fn();
    view.addListeners = jest.fn();
    section.render = jest.fn(() =>
      Promise.resolve(new Contents(document, document.body, 'cfiBase', 1))
    );
    const showSpy = jest.spyOn(view, 'show');
    view.emit = jest.fn();
    const addListenersSpy = jest.spyOn(InlineView.prototype, 'addListeners');
    const mockQuest = (url: string) =>
      Promise.resolve(document.implementation.createHTMLDocument(''));
    await view.render(mockQuest, true);
    expect(section.render).toHaveBeenCalled();
    expect(view.frame).toBeInstanceOf(HTMLElement);
    expect(showSpy).toHaveBeenCalled();
    expect(view.show).toHaveBeenCalled();
    expect(view.emit).toHaveBeenCalled();
    expect(view.settings.layout.format).toHaveBeenCalled();
    showSpy.mockRestore();
    addListenersSpy.mockRestore();
  });

  test('size() should call lock with correct axis', () => {
    view.lock = jest.fn();
    view.layout = { name: 'pre-paginated' } as any;
    view.size(100, 200);
    expect(view.lock).toHaveBeenCalledWith('both', 100, 200);
    view.layout = { name: 'reflowable' } as any;
    view.settings.axis = 'horizontal';
    view.size(100, 200);
    expect(view.lock).toHaveBeenCalledWith('height', 100, 200);
    view.settings.axis = 'vertical';
    view.size(100, 200);
    expect(view.lock).toHaveBeenCalledWith('width', 100, 200);
  });

  test('lock() should call resize for width, height, and both', () => {
    view.frame = document.createElement('div');
    view.element = document.createElement('div');
    view.resize = jest.fn();
    view.lock('width', 100, 200);
    expect(view.resize).toHaveBeenCalledWith(100, false);
    view.lock('height', 100, 200);
    expect(view.resize).toHaveBeenCalledWith(false, 200);
    view.lock('both', 100, 200);
    expect(view.resize).toHaveBeenCalledWith(100, 200);
  });

  test('expand() should call contentWidth/contentHeight and resize', () => {
    view.frame = document.createElement('div');
    view.settings.axis = 'horizontal';
    view.contentWidth = jest.fn(() => 123);
    view.resize = jest.fn();

    view._height = 200;
    view.expand();

    expect(view.contentWidth).toHaveBeenCalled();
    expect(view.resize).toHaveBeenCalledWith(123, view._height);
    view.settings.axis = 'vertical';
    view.contentHeight = jest.fn(() => 456);

    view._height = 200;
    view.expand();
    expect(view.contentHeight).toHaveBeenCalled();
    expect(view.resize).toHaveBeenNthCalledWith(1, 123, 200);
    expect(view.resize).toHaveBeenNthCalledWith(2, 100, 456);
  });

  test('resize() should update frame styles and emit event', () => {
    view.frame = document.createElement('div');
    view.element = document.createElement('div');
    view.onResize = jest.fn();
    view.emit = jest.fn();
    view.elementBounds = { width: 50, height: 50 };
    view.prevBounds = { width: 40, height: 40 };
    view.resize(100, 200);
    expect(view.frame.style.width).toBe('100px');
    expect(view.frame.style.height).toBe('200px');
    expect(view.onResize).toHaveBeenCalled();
    expect(view.emit).toHaveBeenCalled();
  });

  test('load() should parse contents and append body', async () => {
    view.frame = document.createElement('div');
    view.element = document.createElement('div');
    jest.spyOn(require('../../utils/core'), 'defer').mockImplementation(() => ({
      promise: Promise.resolve(),
      reject: jest.fn(),
      resolve: jest.fn(),
    }));

    // Create a mock Contents instance
    const mockContents = new Contents(document, document.body, 'cfiBase', 1);
    mockContents.content.innerHTML = 'Test';

    // Call load with the correct type
    await view.load(mockContents);
    expect(view.frame.innerHTML).toContain('Test');
  });
});
