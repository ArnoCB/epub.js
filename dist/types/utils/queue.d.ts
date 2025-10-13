import { requestAnimationFrame } from './core';
/**
 * Queue for handling tasks one at a time
 * @param {scope} context what this will resolve to in the tasks
 */
interface QueuedTask<T = unknown> {
    task?: (...args: T[]) => T | Promise<T>;
    args?: T[];
    resolve?: (value?: T) => void;
    reject?: (reason?: unknown) => void;
    promise?: Promise<T>;
}
declare class Queue<T = unknown> {
    /**
     * End the queue
     */
    stop(): void;
    _q: QueuedTask<T>[];
    context: object | undefined;
    tick: typeof requestAnimationFrame;
    running: Promise<T | undefined> | boolean | undefined;
    paused: boolean;
    private _deferredPromise;
    private _resolveDeferred;
    constructor(context: object | undefined);
    /**
     * Add an item to the queue
     */
    enqueue(...args: T[]): Promise<T>;
    /**
     * Run one item
     */
    dump(): void;
    /**
     * Run all tasks sequentially, at convince
     */
    run(): Promise<T | undefined>;
    /**
     * Run one item
     */
    dequeue(): Promise<T | undefined>;
    clear(): void;
    /**
     * Get the number of tasks in the queue
     */
    length(): number;
    /**
     * Pause a running queue
     */
    pause(): void;
}
export default Queue;
