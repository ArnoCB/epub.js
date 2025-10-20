import { EventEmitterBase } from './event-emitter';
import type { EventEmitterMethods } from '../types';

// Silence console warnings during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});

describe('EventEmitter', () => {
  describe('EventEmitterBase class', () => {
    it('should have event emitter methods', () => {
      const emitter = new EventEmitterBase();

      expect(typeof emitter.on).toBe('function');
      expect(typeof emitter.off).toBe('function');
      expect(typeof emitter.once).toBe('function');
      expect(typeof emitter.emit).toBe('function');
    });

    it('should initialize with empty event storage', () => {
      const emitter = new EventEmitterBase();

      // @ts-ignore - Testing private property
      expect(emitter.__ee__).toBeDefined();
      // @ts-ignore - Testing private property
      expect(Object.keys(emitter.__ee__).length).toBe(0);
    });
  });

  describe('Event handling functionality', () => {
    let emitter: EventEmitterMethods;

    beforeEach(() => {
      // Using EventEmitterBase directly as recommended
      emitter = new EventEmitterBase();
    });

    describe('on method', () => {
      it('should add a listener and return this', () => {
        const listener = jest.fn();
        const result = emitter.on('test', listener);

        expect(result).toBe(emitter);

        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBe(listener);
      });

      it('should throw if listener is not a function', () => {
        expect(() => {
          // @ts-ignore - Testing property
          emitter.on('test', 'not a function');
        }).toThrow(TypeError);
      });

      it('should handle multiple listeners for the same event', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        emitter.on('test', listener1);
        emitter.on('test', listener2);

        // @ts-ignore - Testing private property
        expect(Array.isArray(emitter.__ee__.test)).toBe(true);
        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toContain(listener1);
        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toContain(listener2);
      });
    });

    describe('off method', () => {
      it('should remove a listener and return this', () => {
        const listener = jest.fn();

        emitter.on('test', listener);
        const result = emitter.off('test', listener);

        expect(result).toBe(emitter);
        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBeUndefined();
      });

      it('should throw if listener is not a function', () => {
        expect(() => {
          // @ts-ignore - Testing property
          emitter.off('test', 'not a function');
        }).toThrow(TypeError);
      });

      it('should remove only the specified listener', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        emitter.on('test', listener1);
        emitter.on('test', listener2);
        emitter.off('test', listener1);

        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBe(listener2);
      });

      it('should do nothing if event or listener does not exist', () => {
        const listener = jest.fn();
        const anotherListener = jest.fn();

        emitter.on('test', listener);
        const result = emitter.off('nonexistent', anotherListener);

        expect(result).toBe(emitter);
        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBe(listener);

        const result2 = emitter.off('test', anotherListener);
        expect(result2).toBe(emitter);
        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBe(listener);
      });
    });

    describe('once method', () => {
      it('should add a one-time listener and return this', () => {
        const listener = jest.fn();
        const result = emitter.once('test', listener);

        expect(result).toBe(emitter);

        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBeDefined();
        // @ts-ignore - Testing private property
        expect(typeof emitter.__ee__.test).toBe('function');
        // @ts-ignore - Testing private property but not the wrapped function
        expect(emitter.__ee__.test).not.toBe(listener);
      });

      it('should throw if listener is not a function', () => {
        expect(() => {
          // @ts-ignore - Testing property
          emitter.once('test', 'not a function');
        }).toThrow(TypeError);
      });

      it('should remove the listener after first emission', () => {
        const listener = jest.fn();

        emitter.once('test', listener);
        emitter.emit('test', 'arg1');

        expect(listener).toHaveBeenCalledWith('arg1');
        expect(listener).toHaveBeenCalledTimes(1);

        emitter.emit('test', 'arg2');
        expect(listener).toHaveBeenCalledTimes(1);
        // @ts-ignore - Testing private property
        expect(emitter.__ee__.test).toBeUndefined();
      });
    });

    describe('emit method', () => {
      it('should call all listeners with the provided arguments', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        emitter.on('test', listener1);
        emitter.on('test', listener2);

        emitter.emit('test', 'arg1', 'arg2');

        expect(listener1).toHaveBeenCalledWith('arg1', 'arg2');
        expect(listener2).toHaveBeenCalledWith('arg1', 'arg2');
      });

      it('should do nothing if event has no listeners', () => {
        // This should not throw
        emitter.emit('nonexistent', 'arg1');
      });

      it('should catch and log errors in listeners', () => {
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation();
        const error = new Error('Test error');

        const listener = jest.fn().mockImplementation(() => {
          throw error;
        });

        emitter.on('test', listener);
        emitter.emit('test');

        expect(listener).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error in event listener:',
          error
        );

        consoleErrorSpy.mockRestore();
      });

      it('should handle removed listeners during emission', () => {
        const listener1 = jest.fn().mockImplementation(() => {
          emitter.off('test', listener2);
        });
        const listener2 = jest.fn();
        const listener3 = jest.fn();

        emitter.on('test', listener1);
        emitter.on('test', listener2);
        emitter.on('test', listener3);

        emitter.emit('test');

        expect(listener1).toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled(); // Removed during emission
        expect(listener3).toHaveBeenCalled();
      });
    });

    describe('Composition pattern', () => {
      // Define the class using composition with EventEmitterBase
      class TestClass implements EventEmitterMethods {
        private _events = new EventEmitterBase();
        value: string = 'test';

        // Implement EventEmitter methods by delegating to _events
        on(type: string, listener: any) {
          this._events.on(type, listener);
          return this;
        }

        once(type: string, listener: any) {
          this._events.once(type, listener);
          return this;
        }

        off(type: string, listener: any) {
          this._events.off(type, listener);
          return this;
        }

        emit(type: string, ...args: unknown[]) {
          this._events.emit(type, ...args);
        }
      }

      it('should properly implement EventEmitter methods', () => {
        const instance = new TestClass();

        expect(typeof instance.on).toBe('function');
        expect(typeof instance.off).toBe('function');
        expect(typeof instance.once).toBe('function');
        expect(typeof instance.emit).toBe('function');
      });

      it('should maintain original properties and methods', () => {
        const instance = new TestClass();
        expect(instance.value).toBe('test');
      });

      it('should work correctly with event handling', () => {
        const instance = new TestClass();
        const listener = jest.fn();

        instance.on('test', listener);
        instance.emit('test', 'arg1');

        expect(listener).toHaveBeenCalledWith('arg1');
      });
    });
  });
});
