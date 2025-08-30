import { test, expect } from '@playwright/test';

test('transparent iframe example: next() jumps spine item', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60_000);

  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // wait for library to load
  await page.waitForFunction(
    () => (window as any).ePub && typeof (window as any).ePub === 'function',
    { timeout: 15000 }
  );

  // wait for the example to have created a global rendition
  await page.waitForFunction(
    () =>
      (window as any).rendition &&
      typeof (window as any).rendition.next === 'function',
    { timeout: 15000 }
  );

  // wait for rendition to be started/rendered
  await page.evaluate(async () => {
    const r = (window as any).rendition;
    if (r && r.started) {
      try {
        await r.started;
      } catch (e) {
        // ignore
      }
    }
  });

  // read snapshot of #viewer before interaction
  await page.waitForSelector('#viewer', { timeout: 15000 });

  const beforeSnapshot = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    return viewer ? viewer.innerHTML : '';
  });

  // trigger next (via the example's next link handler)
  // install a relocated counter so we can wait for the rendition to emit relocated
  await page.evaluate(() => {
    (window as any).__relocatedCount = 0;
    const r = (window as any).rendition;
    if (r && typeof r.on === 'function') {
      r.on('relocated', () => {
        (window as any).__relocatedCount += 1;
      });
    }
  });

  // record current relocated count
  const beforeRelocated = await page.evaluate(
    () => (window as any).__relocatedCount || 0
  );

  // trigger next (via the example's next link handler)
  await page.click('#next');

  // wait for relocated event to fire
  await page.waitForFunction(
    (c: number) => (window as any).__relocatedCount > c,
    beforeRelocated,
    { timeout: 15000 }
  );

  const afterSnapshot = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    return viewer ? viewer.innerHTML : '';
  });

  // Confirm the observed change: next() alters the viewer DOM
  expect(afterSnapshot).not.toBe(beforeSnapshot);
});
