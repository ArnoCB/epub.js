import { EventEmitterBase } from './event-emitter';

describe('EventEmitterBase', () => {
  describe('Base Class functionality', () => {
    let emitter: EventEmitterBase;

    beforeEach(() => {
      emitter = new EventEmitterBase();
    });

    it('should have event emitter methods', () => {
      expect(typeof emitter.on).toBe('function');
      expect(typeof emitter.off).toBe('function');
      expect(typeof emitter.once).toBe('function');
      expect(typeof emitter.emit).toBe('function');
    });

    it('should handle on/emit properly', () => {
      const listener = jest.fn();
      emitter.on('test', listener);
      emitter.emit('test', 'arg1', 'arg2');

      expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should handle once correctly', () => {
      const listener = jest.fn();
      emitter.once('test', listener);

      emitter.emit('test', 'first');
      expect(listener).toHaveBeenCalledWith('first');
      expect(listener).toHaveBeenCalledTimes(1);

      emitter.emit('test', 'second');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle off correctly', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);

      emitter.off('test', listener1);
      emitter.emit('test', 'arg');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith('arg');
    });
  });

  describe('Composition pattern', () => {
    class TestClass {
      private _events = new EventEmitterBase();

      value: string = 'test';

      on(type: string, listener: (...args: unknown[]) => void) {
        this._events.on(type, listener);
        return this;
      }

      once(type: string, listener: (...args: unknown[]) => void) {
        this._events.once(type, listener);
        return this;
      }

      off(type: string, listener: (...args: unknown[]) => void) {
        this._events.off(type, listener);
        return this;
      }

      emit(type: string, ...args: unknown[]) {
        this._events.emit(type, ...args);
      }

      doSomething() {
        this.emit('something', { data: 'test' });
      }
    }

    it('should work correctly with composition pattern', () => {
      const instance = new TestClass();
      const listener = jest.fn();

      instance.on('something', listener);
      instance.doSomething();

      expect(listener).toHaveBeenCalledWith({ data: 'test' });
    });

    it('should maintain chainability', () => {
      const instance = new TestClass();
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      instance.on('event1', listener1).on('event2', listener2);

      instance.emit('event1', 'data1');
      instance.emit('event2', 'data2');

      expect(listener1).toHaveBeenCalledWith('data1');
      expect(listener2).toHaveBeenCalledWith('data2');
    });

    it('should be mockable', () => {
      const instance = new TestClass();

      // We can easily mock the events
      instance.emit = jest.fn();

      instance.doSomething();

      expect(instance.emit).toHaveBeenCalledWith('something', { data: 'test' });
    });
  });
});
