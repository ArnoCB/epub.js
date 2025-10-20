/**
 * Event emitter implementation for EPUB.js
 * Using composition pattern instead of mixins for better TypeScript support
 */

// Import type definitions from types directory
import type {
  EventEmitterMethods,
  EventListener,
} from '../types/event-emitter-methods';

// EventEmitter data storage interface
interface EventEmitterData {
  [type: string]: EventListener | EventListener[];
}

/**
 * @deprecated Use EventEmitterBase class with composition pattern instead
 * This function is kept for backward compatibility with tests
 */
export type WithEventEmitter<T extends object> = T & EventEmitterMethods;

/**
 * @deprecated Use EventEmitterBase class with composition pattern instead
 * This function is kept for backward compatibility with tests
 */
export function applyEventEmitter<T extends object>(
  obj: T
): WithEventEmitter<T> {
  console.warn(
    'applyEventEmitter is deprecated. Use EventEmitterBase with composition pattern instead.'
  );

  // Create EventEmitterBase and attach to object
  const emitter = new EventEmitterBase();

  // Define all methods on the object that delegate to the emitter
  Object.defineProperties(obj, {
    __ee__: {
      value: emitter['__ee__'],
      configurable: true,
      enumerable: false,
      writable: true,
    },
    on: {
      value: function (type: string, listener: EventListener) {
        emitter.on(type, listener);
        return this;
      },
      configurable: true,
      writable: true,
    },
    once: {
      value: function (type: string, listener: EventListener) {
        emitter.once(type, listener);
        return this;
      },
      configurable: true,
      writable: true,
    },
    off: {
      value: function (type: string, listener: EventListener) {
        emitter.off(type, listener);
        return this;
      },
      configurable: true,
      writable: true,
    },
    emit: {
      value: function (type: string, ...args: unknown[]) {
        emitter.emit(type, ...args);
      },
      configurable: true,
      writable: true,
    },
  });

  return obj as WithEventEmitter<T>;
}

/**
 * @deprecated Use new EventEmitterBase() instead
 * This function is kept for backward compatibility with tests
 */
export function createEventEmitter(): EventEmitterMethods {
  console.warn(
    'createEventEmitter is deprecated. Use new EventEmitterBase() instead.'
  );
  return new EventEmitterBase();
}

/**
 * EventEmitter class for composition pattern
 * This class can be used as a member in other classes to provide event functionality
 * Example:
 * ```
 * class MyClass {
 *   private _events = new EventEmitterBase();
 *
 *   on(type: string, listener: EventListener) {
 *     this._events.on(type, listener);
 *     return this;
 *   }
 *
 *   emit(type: string, ...args: unknown[]) {
 *     this._events.emit(type, ...args);
 *   }
 * }
 * ```
 */
export class EventEmitterBase implements EventEmitterMethods {
  private __ee__: EventEmitterData = {};

  /**
   * Add an event listener
   * @param type Event name
   * @param listener Function to call when event is emitted
   */
  on(type: string, listener: (...args: unknown[]) => void): this {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this.__ee__[type]) {
      this.__ee__[type] = listener;
    } else if (Array.isArray(this.__ee__[type])) {
      (this.__ee__[type] as Array<(...args: unknown[]) => void>).push(listener);
    } else {
      this.__ee__[type] = [
        this.__ee__[type] as (...args: unknown[]) => void,
        listener,
      ];
    }

    return this;
  }

  /**
   * Add an event listener that will be called only once
   * @param type Event name
   * @param listener Function to call when event is emitted
   */
  once(type: string, listener: (...args: unknown[]) => void): this {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    // Define the wrapper that will be removed after the first execution
    const wrapped = (...args: unknown[]): void => {
      this.off(type, wrapped);
      listener(...args);
    };

    // Store reference to original listener for later removal
    Object.defineProperty(wrapped, '__eeOnceListener__', {
      value: listener,
      configurable: true,
      enumerable: false,
    });

    return this.on(type, wrapped);
  }

  /**
   * Remove an event listener
   * @param type Event name
   * @param listener Function to remove
   */
  off(type: string, listener: (...args: unknown[]) => void): this {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this.__ee__[type]) {
      return this;
    }

    const listeners = this.__ee__[type];

    if (Array.isArray(listeners)) {
      const index = listeners.findIndex((item) => {
        return (
          item === listener ||
          // Check if it's a once wrapper
          (Object.prototype.hasOwnProperty.call(item, '__eeOnceListener__') &&
            (
              item as unknown as {
                __eeOnceListener__: (...args: unknown[]) => void;
              }
            ).__eeOnceListener__ === listener)
        );
      });

      if (index !== -1) {
        if (listeners.length === 2) {
          // When only 2 listeners, make the remaining one the direct value
          const remainingIndex = index === 0 ? 1 : 0;
          if (remainingIndex < listeners.length) {
            this.__ee__[type] = listeners[remainingIndex] as (
              ...args: unknown[]
            ) => void;
          } else {
            delete this.__ee__[type];
          }
        } else {
          listeners.splice(index, 1);
        }
      }
    } else if (
      listeners === listener ||
      (Object.prototype.hasOwnProperty.call(listeners, '__eeOnceListener__') &&
        (
          listeners as unknown as {
            __eeOnceListener__: (...args: unknown[]) => void;
          }
        ).__eeOnceListener__ === listener)
    ) {
      delete this.__ee__[type];
    }

    return this;
  }

  /**
   * Emit an event
   * @param type Event name
   * @param args Arguments to pass to listeners
   */
  emit(type: string, ...args: unknown[]): void {
    if (!this.__ee__[type]) {
      return;
    }

    const listeners = this.__ee__[type];

    if (Array.isArray(listeners)) {
      // Create a copy to avoid issues if listeners are added/removed during emit
      const listenersCopy = [...listeners];

      // When a listener is removed during emission, we need to check if it's still
      // in the original array before calling it
      for (const listener of listenersCopy) {
        // Check if the listener is still in the original array
        // (might have been removed by another listener)
        const isRemoved =
          !Array.isArray(this.__ee__[type]) ||
          !this.__ee__[type].includes(listener);

        if (isRemoved) {
          continue; // Skip removed listeners
        }

        try {
          listener(...args);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      }
    } else {
      try {
        const fn = listeners as (...args: unknown[]) => void;
        fn(...args);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    }
  }
}
