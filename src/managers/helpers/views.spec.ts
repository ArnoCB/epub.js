import Views, { View } from './views';

describe('Views', () => {
  let container: HTMLElement;
  let views: InstanceType<typeof Views>;
  let mockView: View;

  beforeEach(() => {
    container = document.createElement('div');
    views = new Views(container);
    mockView = {
      element: document.createElement('div'),
      displayed: true,
      section: { index: 1 },
      destroy: jest.fn(),
      show: jest.fn(),
      hide: jest.fn(),
      contents: undefined,
    } as unknown as View;
  });

  test('initializes with container and empty views', () => {
    expect(views.container).toBe(container);
    expect(views._views).toEqual([]);
    expect(views.length).toBe(0);
    expect(views.hidden).toBe(false);
  });

  test('append adds view and updates container', () => {
    views.append(mockView);
    expect(views._views).toContain(mockView);
    expect(container.children.length).toBe(1);
    expect(views.length).toBe(1);
  });

  test('prepend adds view to start and updates container', () => {
    views.append(mockView);
    const mockView2 = {
      ...mockView,
      element: document.createElement('div'),
    } as unknown as View;
    views.prepend(mockView2);
    expect(views._views[0]).toBe(mockView2);
    expect(container.firstChild).toBe(mockView2.element);
    expect(views.length).toBe(2);
  });

  test('insert adds view at index and updates container', () => {
    views.append(mockView);
    const mockView2: View = {
      ...mockView,
      element: document.createElement('div'),
    } as unknown as View;
    views.insert(mockView2, 0);
    expect(views._views[0]).toBe(mockView2);
    expect(container.children[0]).toBe(mockView2.element);
    expect(views.length).toBe(2);
  });

  test('remove deletes view and updates container', () => {
    views.append(mockView);
    views.remove(mockView);
    expect(views._views).not.toContain(mockView);
    expect(container.children.length).toBe(0);
    expect(views.length).toBe(0);
    expect(mockView.destroy).toHaveBeenCalled();
  });

  test('destroy removes view from container and calls destroy', () => {
    views.append(mockView);
    views.destroy(mockView);
    expect(container.children.length).toBe(0);
    expect(mockView.destroy).toHaveBeenCalled();
  });

  test('all, first, last, indexOf, get, slice', () => {
    views.append(mockView);
    const mockView2: View = {
      ...mockView,
      element: document.createElement('div'),
    } as unknown as View;
    views.append(mockView2);
    expect(views.all()).toEqual([mockView, mockView2]);
    expect(views.first()).toBe(mockView);
    expect(views.last()).toBe(mockView2);
    expect(views.indexOf(mockView2)).toBe(1);
    expect(views.get(1)).toBe(mockView2);
    expect(views.slice(0, 1)).toEqual([mockView]);
  });

  test('forEach iterates views', () => {
    views.append(mockView);
    const mockView2: View = {
      ...mockView,
      element: document.createElement('div'),
    } as unknown as View;
    views.append(mockView2);
    const arr: View[] = [];
    views.forEach((v: View) => arr.push(v));
    expect(arr).toEqual([mockView, mockView2]);
  });

  test('clear removes all views', () => {
    views.append(mockView);
    const mockView2: View = {
      ...mockView,
      element: document.createElement('div'),
    } as unknown as View;
    views.append(mockView2);
    views.clear();
    expect(views._views).toEqual([]);
    expect(views.length).toBe(0);
    expect(container.children.length).toBe(0);
  });

  test('find returns displayed view by section index', () => {
    views.append(mockView);
    expect(views.find({ index: 1 })).toBe(mockView);
    expect(views.find({ index: 2 })).toBeUndefined();
  });

  test('displayed returns only displayed views', () => {
    views.append(mockView);
    const mockView2: View = {
      ...mockView,
      element: document.createElement('div'),
      displayed: false,
    } as unknown as View;
    views.append(mockView2);
    expect(views.displayed()).toEqual([mockView]);
  });

  test('show calls show on displayed views and sets hidden to false', () => {
    views.append(mockView);
    views.show();
    expect(mockView.show).toHaveBeenCalled();
    expect(views.hidden).toBe(false);
  });

  test('hide calls hide on displayed views and sets hidden to true', () => {
    views.append(mockView);
    views.hide();
    expect(mockView.hide).toHaveBeenCalled();
    expect(views.hidden).toBe(true);
  });
});
