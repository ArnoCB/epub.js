import { requestAnimationFrame } from './core';

/**
 * Queue for handling tasks one at a time

/**
 * Queue for handling tasks one at a time
 * @class
 * @param {scope} context what this will resolve to in the tasks
 */

interface QueuedTask<T = unknown> {
  task?: (...args: T[]) => T | Promise<T>;
  args?: T[];
  resolve?: (value?: T) => void;
  reject?: (reason?: unknown) => void;
  promise?: Promise<T>;
}

class Queue<T = unknown> {
  /**
   * End the queue
   */
  stop() {
    this._q = [];
    this.running = false;
    this.paused = true;
  }
  _q: QueuedTask<T>[];
  context: object | undefined;
  tick: typeof requestAnimationFrame;
  running: Promise<T | undefined> | boolean | undefined;
  paused: boolean;

  private _deferredPromise: Promise<T | undefined> | undefined;
  private _resolveDeferred: ((value?: T) => void) | undefined;

  constructor(context: object | undefined) {
    this._q = [];
    this.context = context;
    this.tick = requestAnimationFrame;
    this.running = false;
    this.paused = false;
  }

  /**
   * Add an item to the queue
   */
  enqueue(...args: T[]): Promise<T> {
    const taskOrPromise = args.shift();
    if (!taskOrPromise) {
      throw new Error('No Task Provided');
    }
    if (typeof taskOrPromise === 'function') {
      // Always execute with the queue's context
      const promise = new Promise<T>((resolve, reject) => {
        this._q.push({
          task: async (...taskArgs: T[]) => {
            try {
              // Use Function.prototype.apply to set context
              const result = await (
                taskOrPromise as (...args: T[]) => T | Promise<T>
              ).apply(this.context, taskArgs);
              resolve(result as T);
              return result as T;
            } catch (err) {
              reject(err);
              throw err;
            }
          },
          args: args,
        });
        if (this.paused == false && !this.running) {
          this.run();
        }
      });
      return promise;
    } else if (isPromise<T>(taskOrPromise)) {
      const promise = taskOrPromise as Promise<T>;
      this._q.push({ promise });
      if (this.paused == false && !this.running) {
        this.run();
      }
      return promise;
    } else {
      // If not a function or promise, wrap as resolved promise
      const promise = Promise.resolve(taskOrPromise as T);
      this._q.push({ promise });
      if (this.paused == false && !this.running) {
        this.run();
      }
      return promise;
    }
  }

  /**
   * Run one item
   */

  // Run All Immediately
  dump() {
    while (this._q.length) {
      this.dequeue();
    }
  }

  /**
   * Run all tasks sequentially, at convince
   */
  run(): Promise<T | undefined> {
    if (!this.running) {
      this.running = true;
      this._deferredPromise = new Promise<T | undefined>((resolve) => {
        this._resolveDeferred = resolve;
      });
    }

    if (this.tick) {
      this.tick.call(globalThis, () => {
        if (this._q.length) {
          (this.dequeue as () => Promise<T>)().then(() => {
            this.run();
          });
        } else {
          if (this._resolveDeferred) this._resolveDeferred(undefined);
          this.running = undefined;
        }
      });
    }

    return this._deferredPromise!;
  }

  /**
   * Run one item
   */
  dequeue(): Promise<T | undefined> {
    if (this._q.length && !this.paused) {
      const inwait = this._q.shift();
      if (!inwait) return Promise.resolve<T | undefined>(undefined);
      const task = inwait.task;
      const args = Array.isArray(inwait.args) ? inwait.args : [];
      if (task) {
        try {
          const result = task.apply(this.context, args);
          if (isPromise<T>(result)) {
            return (result as Promise<T>).then(
              (value: T) => {
                if (inwait.resolve) inwait.resolve(value);
                return value;
              },
              (err: unknown) => {
                if (inwait.reject) inwait.reject(err);
                return undefined;
              }
            );
          } else {
            if (inwait.resolve) inwait.resolve(result as T);
            return inwait.promise ?? Promise.resolve(result as T);
          }
        } catch (err) {
          if (inwait.reject) inwait.reject(err);
          return Promise.resolve<T | undefined>(undefined);
        }
      } else if (inwait.promise) {
        return inwait.promise;
      }
    }
    return Promise.resolve<T | undefined>(undefined);
  }
  clear() {
    this._q = [];
  }

  /**
   * Get the number of tasks in the queue
   */
  length() {
    return this._q.length;
  }

  /**
   * Pause a running queue
   */
  pause() {
    this.paused = true;
  }
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as Promise<T>).then === 'function'
  );
}
export default Queue;
