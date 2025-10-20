/**
 * EventEmitter listener type - a function that receives event arguments
 * Using unknown[] rather than any[] for safer type checking
 */
export type EventListener = (...args: unknown[]) => void;
/**
 * Standard interface for event emitter methods
 * This interface defines the contract for objects that have event handling capabilities
 */
export type EventEmitterMethods = {
    /**
     * Emits an event of the specified type with the provided arguments
     * @param type The event type/name
     * @param args Arguments to pass to listeners
     */
    emit: (type: string, ...args: unknown[]) => void;
    /**
     * Registers an event listener for the specified event type
     * @param type The event type/name
     * @param listener The callback function to execute when the event is emitted
     * @returns The event emitter instance for method chaining
     */
    on: (type: string, listener: EventListener) => any;
    /**
     * Removes an event listener for the specified event type
     * @param type The event type/name
     * @param listener The callback function to remove
     * @returns The event emitter instance for method chaining
     */
    off: (type: string, listener: EventListener) => any;
    /**
     * Registers an event listener that will be called only once
     * @param type The event type/name
     * @param listener The callback function to execute once when the event is emitted
     * @returns The event emitter instance for method chaining
     */
    once: (type: string, listener: EventListener) => any;
};
