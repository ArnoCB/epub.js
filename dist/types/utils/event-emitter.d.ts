/**
 * Event emitter implementation for EPUB.js
 * Using composition pattern instead of mixins for better TypeScript support
 */
import type { EventEmitterMethods } from '../types/event-emitter-methods';
/**
 * @deprecated Use EventEmitterBase class with composition pattern instead
 * This function is kept for backward compatibility with tests
 */
export type WithEventEmitter<T extends object> = T & EventEmitterMethods;
/**
 * @deprecated Use EventEmitterBase class with composition pattern instead
 * This function is kept for backward compatibility with tests
 */
export declare function applyEventEmitter<T extends object>(obj: T): WithEventEmitter<T>;
/**
 * @deprecated Use new EventEmitterBase() instead
 * This function is kept for backward compatibility with tests
 */
export declare function createEventEmitter(): EventEmitterMethods;
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
export declare class EventEmitterBase implements EventEmitterMethods {
    private __ee__;
    /**
     * Add an event listener
     * @param type Event name
     * @param listener Function to call when event is emitted
     */
    on(type: string, listener: (...args: unknown[]) => void): this;
    /**
     * Add an event listener that will be called only once
     * @param type Event name
     * @param listener Function to call when event is emitted
     */
    once(type: string, listener: (...args: unknown[]) => void): this;
    /**
     * Remove an event listener
     * @param type Event name
     * @param listener Function to remove
     */
    off(type: string, listener: (...args: unknown[]) => void): this;
    /**
     * Emit an event
     * @param type Event name
     * @param args Arguments to pass to listeners
     */
    emit(type: string, ...args: unknown[]): void;
}
