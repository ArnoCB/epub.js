/**
 * Creates a type-safe wrapper around an event handler function.
 * This helper function ensures the event handler's parameter types are compatible with
 * the '(...args: unknown[]) => void' signature required by the event emitter.
 *
 * @param handler The original event handler function with specific parameter types
 * @returns A wrapped handler that conforms to the event emitter's expected signature
 */
export declare function createEventHandler<T extends unknown[]>(handler: (...args: T) => void): (...args: unknown[]) => void;
/**
 * Special version of createEventHandler for DOM event handlers
 * @param handler The DOM event handler function
 * @returns A wrapped handler that conforms to the event emitter's expected signature
 */
export declare function createDomEventHandler(handler: (e: Event) => void): (...args: unknown[]) => void;
