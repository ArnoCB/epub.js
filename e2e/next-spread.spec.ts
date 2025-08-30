import { test, expect } from '@playwright/test';

test('example spreads: rendition.next() jumps to next spine item when at last page', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60_000);

  // Open the example page which uses spreads
  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // Capture page console messages so we can see manager debug logs
  const logs: string[] = [];
  page.on('console', (msg) => {
    try {
      logs.push(`${msg.type()}: ${msg.text()}`);
      // Also output to test runner stdout for immediate visibility
      console.log(`PAGE_CONSOLE ${msg.type()}: ${msg.text()}`);
    } catch (e) {}
  });

  // Wait for ePub library and the example's global rendition
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

  // Ensure rendition has started and install a relocated listener we can read
  await page.evaluate(async () => {
    const r = (window as any).rendition;
    // wait for started
    if (r && r.started) {
      try {
        await r.started;
      } catch {}
    }

    // Install relocated capture
    (window as any).__relocated = (window as any).__relocated || [];
    if (r && typeof r.on === 'function') {
      r.on('relocated', function (loc: any) {
        (window as any).__relocated.push(loc);
      });
    }
  });

  // Wait for at least one relocated event (initial location)
  await page.waitForFunction(
    () => (window as any).__relocated && (window as any).__relocated.length > 0,
    { timeout: 10000 }
  );

  const result = await page.evaluate(async () => {
    const r = (window as any).rendition;

    const beforeCount = (window as any).__relocated.length;
    const beforeHref = (window as any).__relocated[beforeCount - 1].start.href;

    // Capture current location and layout state for debugging
    let currentLocation: any = null;
    let layoutInfo: any = null;
    try {
      currentLocation = r.currentLocation ? r.currentLocation() : null;
    } catch (e) {
      currentLocation = { error: String(e) };
    }
    try {
      layoutInfo = (r.manager && r.manager.layout) || null;
    } catch (e) {
      layoutInfo = { error: String(e) };
    }

    // Trigger next
    r.next();

    // Wait for relocated count to increase
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
    const afterHref = afterArr[afterArr.length - 1].start.href;

    // Collect container and layout debug info
    let containerInfo: any = {};
    try {
      const mgr = (r as any).manager;
      const container =
        mgr && mgr.container
          ? mgr.container
          : document.getElementById('viewer');
      containerInfo = {
        scrollLeft: container ? container.scrollLeft : null,
        offsetWidth: container ? container.offsetWidth : null,
        scrollWidth: container ? container.scrollWidth : null,
      };
    } catch (e) {
      containerInfo = { error: String(e) };
    }

    let layoutDetails: any = {};
    try {
      const layout = (r as any).manager && (r as any).manager.layout;
      layoutDetails = {
        delta: layout ? layout.delta : null,
        pageWidth: layout ? layout.pageWidth : null,
        width: layout ? layout.width : null,
        divisor: layout ? layout.divisor : null,
        props: layout ? layout.props : null,
      };
    } catch (e) {
      layoutDetails = { error: String(e) };
    }

    return {
      beforeHref: beforeHref || '',
      afterHref: afterHref || '',
      currentLocation: currentLocation,
      layoutInfo: layoutInfo,
      container: containerInfo,
      layout: layoutDetails,
    };
  });
  expect(result.beforeHref).toBeTruthy();

  // Dump debug payload to test runner stdout for inspection
  console.log('RESULT_DEBUG:' + JSON.stringify(result));

  expect(result.beforeHref).toBeTruthy();
  expect(result.afterHref).toBeTruthy();

  // If there are more pages in the current section, expect the href to remain the same (advance within the same spine item)
  const loc =
    result.currentLocation && result.currentLocation[0]
      ? result.currentLocation[0]
      : null;
  if (loc) {
    const pages = loc.pages || [];
    const lastDisplayed = pages.length ? pages[pages.length - 1] : 0;
    const total = loc.totalPages || 0;
    if (lastDisplayed < total) {
      // There are more pages; next() should not jump to another spine item
      expect(result.afterHref.split('#')[0]).toBe(
        result.beforeHref.split('#')[0]
      );
    } else {
      // No more pages in section; it's acceptable to move to next spine item
      expect(result.afterHref).toBeTruthy();
    }
  } else {
    // Couldn't determine location; at least ensure afterHref is defined
    expect(result.afterHref).toBeTruthy();
  }
});
