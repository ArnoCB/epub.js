import { test, expect } from '@playwright/test';

/**
 * EPUB.js Regression Tests
 * 
 * This suite tests for specific regression issues that have been fixed:
 * 1. White page navigation issues
 * 2. Empty content fallback
 * 3. Chapter boundary navigation issues
 */

test.describe('EPUB Regression Tests', () => {
  test('no white page when navigating back from chapter 1', async ({ page, baseURL }) => {
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
  });

  test('empty content fallback works correctly', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for ePub and rendition
    await page.waitForFunction(() => typeof (window as any).ePub === 'function');
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });

    // Force load a non-existent chapter to trigger empty content fallback
    await page.evaluate(() => {
      const w: any = window as any;
      const r = w.getRendition ? w.getRendition() : w.rendition;
      // This should trigger empty content fallback
      r.display('non_existent_chapter.xhtml');
    });

    // Wait for fallback to happen
    await page.waitForTimeout(1000);

    // Verify the fallback was handled gracefully
    const hasError = await page.evaluate(() => {
      // Check if there's an error message displayed or if navigation was handled properly
      const rendition = (window as any).rendition;
      return {
        // Check if rendition is still operational
        isOperational: !!rendition && !!rendition.manager && !!rendition.manager.views,
        // Verify there's at least some content displayed
        hasContent: document.getElementById('viewer')?.querySelector('iframe') !== null
      };
    });

    // Rendition should still be operational after failed navigation
    expect(hasError.isOperational).toBeTruthy();
    expect(hasError.hasContent).toBeTruthy();

    // Verify we can still navigate after a failed content load
    await page.click('#next');
    await page.waitForTimeout(500);

    const canNavigate = await page.evaluate(() => {
      const iframe = document.getElementById('viewer')?.querySelector('iframe') as HTMLIFrameElement | null;
      return iframe && iframe.contentDocument && iframe.contentDocument.body;
    });

    expect(canNavigate).toBeTruthy();
  });
});
