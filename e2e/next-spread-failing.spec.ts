import { test, expect } from '@playwright/test';

test('example spreads (regression): rendition.next() should jump to next spine item (reproducer)', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60_000);

  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // Wait for library and global rendition
  await page.waitForFunction(
    () => (window as any).ePub && typeof (window as any).ePub === 'function',
    { timeout: 15000 }
  );
  await page.waitForFunction(
    () =>
      (window as any).rendition &&
      typeof (window as any).rendition.next === 'function',
    { timeout: 15000 }
  );

  // Ensure rendition started
  await page.evaluate(async () => {
    const r = (window as any).rendition;
    if (r && r.started) {
      try {
        await r.started;
      } catch (e) {}
    }
  });

  // Install relocated capture
  await page.evaluate(() => {
    (window as any).__relocated = (window as any).__relocated || [];
    const r = (window as any).rendition;
    if (r && typeof r.on === 'function') {
      r.on('relocated', function (loc: any) {
        (window as any).__relocated.push(loc);
      });
    }
  });

  // Wait for initial relocated
  await page.waitForFunction(
    () => (window as any).__relocated && (window as any).__relocated.length > 0,
    { timeout: 10000 }
  );

  const result = await page.evaluate(async () => {
    const r = (window as any).rendition;
    const beforeCount = (window as any).__relocated.length;
    const beforeHref =
      (window as any).__relocated[beforeCount - 1].start.href || '';

    // Call next()
    r.next();

    // Wait for relocated event
    const before = beforeCount;
    await new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if ((window as any).__relocated.length > before)
          return resolve(undefined);
        if (Date.now() - start > 10000)
          return reject(new Error('timed out waiting for relocated'));
        setTimeout(check, 50);
      };
      check();
    });

    const afterArr = (window as any).__relocated;
    const afterHref = afterArr[afterArr.length - 1].start.href || '';

    return { beforeHref, afterHref };
  });

  // Debug output in test log
  console.log(
    'REPRO_BEFORE:',
    result.beforeHref,
    'REPRO_AFTER:',
    result.afterHref
  );

  // We expect next() to advance within the same spine item (do not jump)
  expect(result.beforeHref).toBeTruthy();
  expect(result.afterHref).toBeTruthy();
  expect(result.afterHref.split('#')[0]).toBe(result.beforeHref.split('#')[0]);
});
