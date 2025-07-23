import { debounce, throttle } from './helpers';

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
