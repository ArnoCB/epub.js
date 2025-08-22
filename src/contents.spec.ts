import Contents from './contents';

describe('Contents', () => {
  let doc: Document;
  let body: HTMLElement;
  let contents: Contents;
  let originalGetComputedStyle: any;
  let originalGetBoundingClientRect: any;

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('Test');
    body = doc.body;
    contents = new Contents(doc, body, 'cfiBase', 1);
    contents.window = window;

    // Mock getComputedStyle
    originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = jest.fn().mockImplementation((el) => {
      return {
        width: el.style.width || '0',
        height: el.style.height || '0',
        overflow: el.style.overflow || '',
        overflowX: el.style.overflowX || '',
        overflowY: el.style.overflowY || '',
        background: el.style.background || '',
        ['writing-mode']: el.style['writing-mode'] || '',
      };
    });

    // Mock getBoundingClientRect
    originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 50,
      bottom: 50,
    });

    // Mock Range.getBoundingClientRect
    if (window.Range) {
      window.Range.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        bottom: 50,
      });
    }
  });

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    if (window.Range && window.Range.prototype.getBoundingClientRect) {
      (window.Range.prototype.getBoundingClientRect as any) = undefined;
    }
  });

  test('can construct Contents', () => {
    expect(
      () => new Contents(document, document.body, 'cfiBase', 1)
    ).not.toThrow();
  });

  test('initializes with document, content, cfiBase, sectionIndex', () => {
    expect(contents.document).toBe(doc);
    expect(contents.content).toBe(body);
    expect(contents.cfiBase).toBe('cfiBase');
    expect(contents.sectionIndex).toBe(1);
  });

  test('width and height getters/setters', () => {
    expect(contents.width()).toBeGreaterThanOrEqual(0);
    expect(contents.height()).toBeGreaterThanOrEqual(0);
    contents.width(100);
    contents.height(50);
    expect(contents.width()).toBe(100);
    expect(contents.height()).toBe(50);
  });

  test('contentWidth and contentHeight getters/setters', () => {
    expect(contents.contentWidth()).toBeGreaterThanOrEqual(0);
    expect(contents.contentHeight()).toBeGreaterThanOrEqual(0);
    contents.contentWidth(120);
    contents.contentHeight(60);
    expect(contents.contentWidth()).toBe(120);
    expect(contents.contentHeight()).toBe(60);
  });

  test('textWidth and textHeight', () => {
    body.innerHTML = '<div style="width:200px;height:100px;">Hello World</div>';
    expect(contents.textWidth()).toBeGreaterThan(0);
    expect(contents.textHeight()).toBeGreaterThan(0);
  });

  test('scrollWidth and scrollHeight', () => {
    expect(contents.scrollWidth()).toBeGreaterThanOrEqual(0);
    expect(contents.scrollHeight()).toBeGreaterThanOrEqual(0);
  });

  test('overflow, overflowX, overflowY', () => {
    expect(contents.overflow()).toBeDefined();
    expect(contents.overflowX()).toBeDefined();
    expect(contents.overflowY()).toBeDefined();
    contents.overflow('hidden');
    contents.overflowX('scroll');
    contents.overflowY('auto');
    expect(contents.overflow()).toBe('hidden');
    expect(contents.overflowX()).toBe('scroll');
    expect(contents.overflowY()).toBe('auto');
  });

  test('css sets and gets style', () => {
    expect(contents.css('background', '')).toBe('');
    contents.css('background', 'red');
    expect(contents.css('background', '')).toBe('red');
    contents.css('background', '');
    expect(contents.css('background', '')).toBe('red');
  });

  test('addClass and removeClass', () => {
    contents.addClass('test-class');
    expect(body.classList.contains('test-class')).toBe(true);
    contents.removeClass('test-class');
    expect(body.classList.contains('test-class')).toBe(false);
  });

  test('writingMode sets and gets style', () => {
    expect(contents.writingMode()).toBeDefined();
    contents.writingMode('vertical-rl');
    expect(contents.writingMode()).toContain('vertical');
  });

  test('direction sets style', () => {
    contents.direction('rtl');
    expect(doc.documentElement.style.direction).toBe('rtl');
  });

  test('root returns documentElement', () => {
    expect(contents.root()).toBe(doc.documentElement);
  });

  test('destroy removes listeners', () => {
    expect(() => contents.destroy()).not.toThrow();
  });
});
