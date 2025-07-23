/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are async.
 * @example this.content = new EPUBJS.Hook(this);
 */

type HookTask = (...args: unknown[]) => unknown;

class Hook {
  context: unknown;
  hooks: HookTask[];

  constructor(context: unknown) {
    this.context = context || this;
    this.hooks = [];
  }

  /**
   * Adds a function to be run before a hook completes
   * @example this.content.register(function(){...});
   */
  register(...tasks: (HookTask | HookTask[])[]): void {
    for (const task of tasks) {
      if (typeof task === 'function') {
        this.hooks.push(task);
      } else if (Array.isArray(task)) {
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
  deregister(func: HookTask): void {
    const idx = this.hooks.indexOf(func);
    if (idx !== -1) {
      this.hooks.splice(idx, 1);
    }
  }

  /**
   * Triggers a hook to run all functions
   * @example this.content.trigger(args).then(function(){...});
   */
  trigger(...args: unknown[]): Promise<unknown[]> {
    const context = this.context;
    const promises: Promise<unknown>[] = [];

    this.hooks.forEach((task) => {
      try {
        const executing = task.apply(context, args);
        if (
          executing &&
          typeof executing === 'object' &&
          typeof (executing as Promise<unknown>).then === 'function'
        ) {
          promises.push(executing as Promise<unknown>);
        }
      } catch (err) {
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
export default Hook;
