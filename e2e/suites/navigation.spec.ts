import { test, expect } from '@playwright/test';

/**
 * Core Navigation Tests
 *
 * Tests basic navigation functionality:
 * 1. Next/previous page navigation
 * 2. Chapter navigation
 * 3. Content visibility during navigation
 * 4. No white pages
 */

test.describe('Core Navigation', () => {
  test('next and previous navigation works', async ({ page, baseURL }) => {
    test.setTimeout(45_000);

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for setup
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });
    await page.waitForTimeout(2000); // Allow prerendering to start

    // Start at chapter 1
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('chapter_001.xhtml');
    });
    await page.waitForTimeout(2000);

    // Navigate forward (next)
    const nextResult = await page.evaluate(async () => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      await rendition.next();

      // Check what's visible
      const container = rendition.manager.container;
      const iframe = container.querySelector('iframe');

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        currentHref: rendition.location?.start?.href || 'unknown',
      };
    });

    expect(nextResult.hasIframe).toBe(true);
    expect(nextResult.iframeVisible).toBe(true);
    expect(nextResult.currentHref).toBeTruthy();

    // Navigate backward (prev)
    const prevResult = await page.evaluate(async () => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      await rendition.prev();

      // Check what's visible
      const container = rendition.manager.container;
      const iframe = container.querySelector('iframe');

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        currentHref: rendition.location?.start?.href || 'unknown',
      };
    });

    expect(prevResult.hasIframe).toBe(true);
    expect(prevResult.iframeVisible).toBe(true);
    expect(prevResult.currentHref).toMatch(/chapter_001/);
  });

  // Removed redundant test: 'chapter navigation maintains content visibility' (see regression/white-page-navigation.spec.ts for focused coverage)
});
