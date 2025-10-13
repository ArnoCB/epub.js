import { debounce, throttle, indexOfElementNode } from './helpers';

describe('indexOfElementNode', () => {
  it('returns correct index for element nodes', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('span');
    const child2 = document.createElement('span');
    const child3 = document.createElement('span');
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);
    expect(indexOfElementNode(child1)).toBe(0);
    expect(indexOfElementNode(child2)).toBe(1);
    expect(indexOfElementNode(child3)).toBe(2);
  });

  it('returns -1 if node has no parent', () => {
    const orphan = document.createElement('div');
    expect(indexOfElementNode(orphan)).toBe(-1);
  });

  it('ignores non-element siblings', () => {
    const parent = document.createElement('div');
    const text1 = document.createTextNode('a');
    const el1 = document.createElement('span');
    const text2 = document.createTextNode('b');
    const el2 = document.createElement('span');
    parent.appendChild(text1);
    parent.appendChild(el1);
    parent.appendChild(text2);
    parent.appendChild(el2);
    expect(indexOfElementNode(el1)).toBe(0);
    expect(indexOfElementNode(el2)).toBe(1);
  });
});

describe('helpers', () => {
  describe('debounce', () => {
    jest.useFakeTimers();

    it('should delay execution until after wait time', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);
      debounced('a');
      debounced('b');
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledWith('b');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use latest arguments', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 50);
      debounced('x');
      debounced('y');
      jest.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledWith('y');
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should only call once per wait interval', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);
      throttled('a'); // called immediately
      jest.advanceTimersByTime(50);
      throttled('b'); // ignored
      jest.advanceTimersByTime(50);
      throttled('c'); // allowed (100ms since last call)
      expect(fn).toHaveBeenCalledWith('a');
      expect(fn).toHaveBeenCalledWith('c');
      expect(fn).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(100);
      throttled('d'); // allowed (100ms since last call)
      expect(fn).toHaveBeenCalledWith('d');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
