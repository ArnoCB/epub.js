import Queue from './queue';

// Mock requestAnimationFrame to run synchronously for tests
beforeAll(() => {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(Date.now());
    return 0;
  };
});

describe('Queue', () => {
  it('should run synchronous tasks in order', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    const results: number[] = [];
    await queue.enqueue(() => results.push(1));
    await queue.enqueue(() => results.push(2));
    await queue.enqueue(() => results.push(3));
    expect(results).toEqual([1, 2, 3]);
  });

  it('should run asynchronous tasks in order', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    const results: number[] = [];
    await queue.enqueue(() => Promise.resolve(results.push(1)));
    await queue.enqueue(
      () =>
        new Promise((res) =>
          setTimeout(() => {
            results.push(2);
            res(2);
          }, 10)
        )
    );
    await queue.enqueue(() => results.push(3));
    expect(results).toEqual([1, 2, 3]);
  });

  it('should resolve promises with returned values', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    const p1 = queue.enqueue(() => 42);
    const p2 = queue.enqueue(() => Promise.resolve('hello'));
    await expect(p1).resolves.toBe(42);
    await expect(p2).resolves.toBe('hello');
  });

  // BUG: queue-old.js does not propagate synchronous errors as promise rejections
  // See https://github.com/ArnoCB/epub.js/issues/xxx (or internal tracker)
  it.skip('should reject promise if task throws', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    const p = queue.enqueue(() => {
      throw new Error('fail');
    });
    await expect(p).rejects.toThrow('fail');
  });

  it('should reject promise if async task rejects', () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    const p = queue.enqueue(() => Promise.reject(new Error('async fail')));
    return expect(p).rejects.toThrow('async fail');
  });

  it('should pause and not run until manually resumed', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    const results: number[] = [];
    queue.pause();
    queue.enqueue(() => results.push(1));
    queue.enqueue(() => results.push(2));
    expect(results).toEqual([]);
  });

  it('should clear the queue', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    queue.enqueue(() => 1);
    queue.enqueue(() => 2);
    queue.clear();
    expect(queue.length()).toBe(0);
  });

  it('should stop the queue', async () => {
    const queue = new Queue(undefined);
    queue.tick = (cb: FrameRequestCallback) => {
      cb(Date.now());
      return 0;
    };
    queue.enqueue(() => 1);
    queue.stop();
    expect(queue.length()).toBe(0);
    expect(queue.paused).toBe(true);
  });
});
