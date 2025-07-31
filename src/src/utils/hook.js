'use strict';
/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are async.
 * @example this.content = new EPUBJS.Hook(this);
 */
Object.defineProperty(exports, '__esModule', { value: true });
class Hook {
  constructor(context) {
    this.context = context || this;
    this.hooks = [];
  }
  /**
     * Adds a function to be run before a hook completes
     * @example this.content.register(function(){...});
     */
  register(...tasks) {
    for (const task of tasks) {
      if (typeof task === 'function') {
        this.hooks.push(task);
      }
      else if (Array.isArray(task)) {
        for (const fn of task) {
          if (typeof fn === 'function') {
            this.hooks.push(fn);
          }
        }
      }
    }
  }
  /**
     * Removes a function
     * @example this.content.deregister(function(){...});
     */
  deregister(func) {
    const idx = this.hooks.indexOf(func);
    if (idx !== -1) {
      this.hooks.splice(idx, 1);
    }
  }
  /**
     * Triggers a hook to run all functions
     * @example this.content.trigger(args).then(function(){...});
     */
  trigger(...args) {
    const context = this.context;
    const promises = [];
    this.hooks.forEach((task) => {
      try {
        const executing = task.apply(context, args);
        if (executing &&
                    typeof executing === 'object' &&
                    typeof executing.then === 'function') {
          promises.push(executing);
        }
      }
      catch (err) {
        console.log(err);
      }
      // Otherwise Task resolves immediately, continue
    });
    return Promise.all(promises);
  }
  // Adds a function to be run before a hook completes
  list() {
    return this.hooks;
  }
  clear() {
    return (this.hooks = []);
  }
}
exports.default = Hook;
