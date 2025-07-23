import Hook from './hook';

describe('Hook', () => {
  it('should register and list hooks', () => {
    const hook = new Hook({});
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    hook.register(fn1, fn2);
    expect(hook.list()).toContain(fn1);
    expect(hook.list()).toContain(fn2);
    expect(hook.list().length).toBe(2);
  });

  it('should deregister hooks', () => {
    const hook = new Hook({});
    const fn = jest.fn();
    hook.register(fn);
    expect(hook.list()).toContain(fn);
    hook.deregister(fn);
    expect(hook.list()).not.toContain(fn);
  });

  it('should clear all hooks', () => {
    const hook = new Hook({});
    hook.register(jest.fn(), jest.fn());
    expect(hook.list().length).toBe(2);
    hook.clear();
    expect(hook.list().length).toBe(0);
  });

  it('should trigger all hooks with arguments', async () => {
    const hook = new Hook({});
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    hook.register(fn1, fn2);
    await hook.trigger('foo', 42);
    expect(fn1).toHaveBeenCalledWith('foo', 42);
    expect(fn2).toHaveBeenCalledWith('foo', 42);
  });

  it('should handle hooks that return promises', async () => {
    const hook = new Hook({});
    const fn1 = jest.fn().mockResolvedValue('done1');
    const fn2 = jest.fn().mockResolvedValue('done2');
    hook.register(fn1, fn2);
    const results = await hook.trigger('bar');
    expect(results).toEqual(['done1', 'done2']);
  });

  it('should handle hooks that throw errors', async () => {
    const hook = new Hook({});
    const fn1 = jest.fn(() => {
      throw new Error('fail');
    });
    const fn2 = jest.fn();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    hook.register(fn1, fn2);
    await hook.trigger('baz');
    expect(fn1).toHaveBeenCalledWith('baz');
    expect(fn2).toHaveBeenCalledWith('baz');
    expect(logSpy).toHaveBeenCalledWith(expect.any(Error));
    logSpy.mockRestore();
  });

  it('should register arrays of hooks', () => {
    const hook = new Hook({});
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    hook.register([fn1, fn2]);
    expect(hook.list()).toContain(fn1);
    expect(hook.list()).toContain(fn2);
  });
});
