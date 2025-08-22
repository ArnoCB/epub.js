/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are async.
 * @example this.content = new EPUBJS.Hook(this);
 */
type HookTask = (...args: any[]) => any;
declare class Hook {
  context: unknown;
  hooks: HookTask[];
  constructor(context?: unknown);
  /**
   * Adds a function to be run before a hook completes
   * @example this.content.register(function(){...});
   */
  register(...tasks: (HookTask | HookTask[])[]): void;
  /**
   * Removes a function
   * @example this.content.deregister(function(){...});
   */
  deregister(func: HookTask): void;
  /**
   * Triggers a hook to run all functions
   * @example this.content.trigger(args).then(function(){...});
   */
  trigger(...args: any[]): Promise<any[]>;
  list(): HookTask[];
  clear(): never[];
}
export default Hook;
