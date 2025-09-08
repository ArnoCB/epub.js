#!/usr/bin/env node
const { chromium } = require('playwright');

(async () => {
  const url =
    process.argv[2] ||
    'http://localhost:8000/examples/prerendering-example.html';
  console.log('Opening', url);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    try {
      const text = msg.text();
      console.log('[PAGE]', text);
    } catch (e) {
      console.log('[PAGE] <unserializable console message>');
    }
  });

  page.on('pageerror', (err) => {
    console.error('[PAGE ERROR]', err && err.message);
  });

  let completeSeen = false;
  const completePromise = new Promise((resolve) => {
    page.on('console', (msg) => {
      const text = msg.text ? msg.text() : '';
      if (text && /pre-rendering complete/i.test(text)) {
        completeSeen = true;
        resolve(text);
      }
    });

    // Timeout after 20s
    setTimeout(() => {
      resolve(null);
    }, 20000);
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    console.log('Page loaded, waiting for prerendering complete (20s timeout)');

    const result = await completePromise;
    if (result) {
      console.log('Detected complete console line:', result);
    } else {
      console.log('Timeout waiting for prerendering complete');
    }
  } catch (e) {
    console.error('Error loading page:', e && e.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
