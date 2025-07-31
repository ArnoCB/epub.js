'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('./core');
class Queue {
  /**
   * End the queue
   */
  stop() {
    this._q = [];
    this.running = false;
    this.paused = true;
  }
  constructor(context) {
    this._q = [];
    this.context = context;
    this.tick = core_1.requestAnimationFrame;
    this.running = false;
    this.paused = false;
  }
  /**
   * Add an item to the queue
   */
  enqueue(...args) {
    const taskOrPromise = args.shift();
    if (!taskOrPromise) {
      throw new Error('No Task Provided');
    }
    if (typeof taskOrPromise === 'function') {
      // Always execute with the queue's context
      const promise = new Promise((resolve, reject) => {
        this._q.push({
          task: (...taskArgs) =>
            __awaiter(this, void 0, void 0, function* () {
              try {
                // Use Function.prototype.apply to set context
                const result = yield taskOrPromise.apply(
                  this.context,
                  taskArgs
                );
                resolve(result);
                return result;
              } catch (err) {
                reject(err);
                throw err;
              }
            }),
          args: args,
        });
        if (this.paused == false && !this.running) {
          this.run();
        }
      });
      return promise;
    } else if (isPromise(taskOrPromise)) {
      const promise = taskOrPromise;
      this._q.push({ promise });
      if (this.paused == false && !this.running) {
        this.run();
      }
      return promise;
    } else {
      // If not a function or promise, wrap as resolved promise
      const promise = Promise.resolve(taskOrPromise);
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
  run() {
    if (!this.running) {
      this.running = true;
      this._deferredPromise = new Promise((resolve) => {
        this._resolveDeferred = resolve;
      });
    }
    if (this.tick) {
      this.tick.call(globalThis, () => {
        if (this._q.length) {
          this.dequeue().then(() => {
            this.run();
          });
        } else {
          if (this._resolveDeferred) this._resolveDeferred(undefined);
          this.running = undefined;
        }
      });
    }
  }
  /**
   * Run one item
   */
  dequeue() {
    var _a;
    if (this._q.length && !this.paused) {
      const inwait = this._q.shift();
      if (!inwait) return Promise.resolve(undefined);
      const task = inwait.task;
      const args = Array.isArray(inwait.args) ? inwait.args : [];
      if (task) {
        try {
          const result = task.apply(this.context, args);
          if (isPromise(result)) {
            return result.then(
              (value) => {
                if (inwait.resolve) inwait.resolve(value);
                return value;
              },
              (err) => {
                if (inwait.reject) inwait.reject(err);
                return undefined;
              }
            );
          } else {
            if (inwait.resolve) inwait.resolve(result);
            return (_a = inwait.promise) !== null && _a !== void 0
              ? _a
              : Promise.resolve(result);
          }
        } catch (err) {
          if (inwait.reject) inwait.reject(err);
          return Promise.resolve(undefined);
        }
      } else if (inwait.promise) {
        return inwait.promise;
      }
    }
    return Promise.resolve(undefined);
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
function isPromise(value) {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof value.then === 'function'
  );
}
exports.default = Queue;
