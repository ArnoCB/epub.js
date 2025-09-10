const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('capture prerendered snapshot via runtime API', async ({ page }) => {
  const url =
    process.env.EXAMPLES_URL ||
    'http://localhost:8082/prerendering-example.html';
  console.log('Visiting', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for rendition and pre-renderer to exist and for some prerendered chapters to be rendered
  await page.waitForFunction(
    () => {
      try {
        const r = window.getRendition && window.getRendition();
        const pre = window.getPreRenderer && window.getPreRenderer();
        if (!r || !pre) return false;
        const status = pre.getStatus && pre.getStatus();
        return (
          status &&
          status.rendered > 0 &&
          document.getElementById('viewer').querySelector('iframe')
        );
      } catch (e) {
        return false;
      }
    },
    { timeout: 20000 }
  );

  // Wait a bit for any attachment/clone to settle
  await page.waitForTimeout(800);

  const snapshot = await page.evaluate(() => {
    try {
      const pre = window.getPreRenderer && window.getPreRenderer();
      if (!pre) {
        return { error: 'pre-renderer not available' };
      }
      if (typeof pre.captureDebugSnapshotSimple === 'function') {
        return pre.captureDebugSnapshotSimple();
      }
      if (typeof pre.captureDebugSnapshot === 'function') {
        return pre.captureDebugSnapshot();
      }
      return { error: 'no captureDebugSnapshot variant available' };
    } catch (e) {
      return { error: e && e.message ? e.message : String(e) };
    }
  });

  const outPath = '.ai-notes/prerendered-capture.json';
  const outDir = '.ai-notes';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      { url, timestamp: new Date().toISOString(), snapshot },
      null,
      2
    )
  );
  console.log('WROTE', outPath);

  expect(snapshot).toBeTruthy();
  // Basic assertion: snapshot should include preRenderer info or children
  const hasPre = !!snapshot.preRenderer || !!snapshot.preRendererStatus;
  const hasChildren =
    Array.isArray(snapshot.children) && snapshot.children.length > 0;
  expect(hasPre || hasChildren).toBeTruthy();
});
