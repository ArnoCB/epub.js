import { test, expect } from '@playwright/test';

// Reproduces the white page when navigating back from chapter_001.xhtml
// Ensures pre-rendered prepend path yields visible content

test('Navigate to chapter 1, then prev() back shows content (no white page)', async ({
  page,
  baseURL,
}) => {
  // Collect relevant console logs for diagnostics
  const logs: string[] = [];
  page.on('console', (msg) => {
    const t = msg.text();
    if (/(DefaultViewManager|BookPreRenderer)/.test(t)) logs.push(t);
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for ePub and rendition
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Give pre-rendering a moment
  await page.waitForTimeout(1500);

  // Display chapter 1 (forward path)
  await page.evaluate(() => {
    const w: any = window as any;
    const r = w.getRendition ? w.getRendition() : w.rendition;
    r.display('chapter_001.xhtml');
  });
  await page.waitForTimeout(1000);

  // Now go prev() to trigger prepend path (should go to epigraph)
  await page.evaluate(() => {
    const w: any = window as any;
    const r = w.getRendition ? w.getRendition() : w.rendition;
    return r.prev();
  });

  // Wait for layout/scroll settle
  await page.waitForTimeout(1200);

  // Inspect currently visible iframe in viewer
  const state = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    const iframe = viewer?.querySelector('iframe') as HTMLIFrameElement | null;
    let textLength = -1,
      htmlLength = -1,
      ready = 'unknown',
      scrollWidth = -1;
    let snippet = '';
    try {
      if (iframe && iframe.contentDocument) {
        const body = iframe.contentDocument.body;
        ready = iframe.contentDocument.readyState;
        textLength = (body?.textContent || '').trim().length;
        htmlLength = (body?.innerHTML || '').trim().length;
        scrollWidth = body?.scrollWidth || 0;
        snippet = (body?.textContent || '').trim().slice(0, 150);
      }
    } catch {}
    return { textLength, htmlLength, ready, scrollWidth, snippet };
  });

  // Assert we did not land on an empty/white page
  expect(state.textLength).toBeGreaterThan(0);
  expect(state.htmlLength).toBeGreaterThan(0);
  expect(state.scrollWidth).toBeGreaterThan(0);

  // Helpful output when failing
  if (!(state.textLength > 0 && state.htmlLength > 0)) {
    console.log('DIAG logs (subset):', logs.slice(-20));
    console.log('State:', state);
  }
});
