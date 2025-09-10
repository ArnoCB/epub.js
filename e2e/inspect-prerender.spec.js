const { test } = require('@playwright/test');

test('inspect prerendered marker in iframes', async ({ page }) => {
  const url = process.env.URL || 'http://localhost:8082/';

  const logs = [];
  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text() });
  });

  await page.goto(url, { waitUntil: 'load' });

  // wait for possible prerendering activity
  await page.waitForTimeout(3000);

  // find marker spans in all frames
  const results = [];
  const frames = page.frames();
  for (const f of frames) {
    try {
      const marker = await f.$('span[data-prerendered="true"]');
      if (marker) {
        const outer = await marker.evaluate((el) => el.outerHTML);
        results.push({ frameUrl: f.url(), marker: outer });
      }
    } catch (e) {
      // ignore
    }
  }

  console.log(
    'PLAYWRIGHT_INSPECT_RESULTS:',
    JSON.stringify({ url, logs, results }, null, 2)
  );
});
