import { test, expect } from '@playwright/test';

/**
 * Regression Tests
 *
 * Tests for specific bugs that were fixed to ensure they don't reoccur:
 * - Resize viewport white page issues
 * - Chapter navigation problems
 * - Prerendering content preservation
 */

test.describe('Regression Tests', () => {
  test.describe('Resize Issues', () => {
    test('viewport content survives window resize (regular chapters)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice and display a regular chapter
      await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
        });

        (window as any).rendition = rendition;
        await rendition.display('chapter_001.xhtml');

        // Wait for content to be ready
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      // Check content before resize
      const beforeResize = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return { hasContent: false };

        const body = iframe.contentDocument.body;
        return {
          hasContent:
            body && body.textContent && body.textContent.trim().length > 0,
          textLength: body?.textContent?.trim().length || 0,
        };
      });

      expect(beforeResize.hasContent).toBe(true);
      expect(beforeResize.textLength).toBeGreaterThan(100);

      // Resize the window
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(1000);

      // Check content after resize - should still be there
      const afterResize = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return { hasContent: false };

        const body = iframe.contentDocument.body;
        return {
          hasContent:
            body && body.textContent && body.textContent.trim().length > 0,
          textLength: body?.textContent?.trim().length || 0,
        };
      });

      expect(afterResize.hasContent).toBe(true);
      expect(afterResize.textLength).toBeGreaterThan(100);
    });

    test('white page content survives window resize', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice and display title page (white page)
      await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
        });

        (window as any).rendition = rendition;
        await rendition.display('titlepage.xhtml');

        // Wait for content to be ready
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      // Check content before resize
      const beforeResize = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return { hasIframe: false };

        const body = iframe.contentDocument.body;
        return {
          hasIframe: true,
          hasBody: !!body,
          hasHTML: body?.innerHTML?.length > 0,
        };
      });

      expect(beforeResize.hasIframe).toBe(true);
      expect(beforeResize.hasBody).toBe(true);

      // Resize the window
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(1000);

      // Check content after resize - iframe should still exist and be accessible
      const afterResize = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return { hasIframe: false };

        const body = iframe.contentDocument.body;
        return {
          hasIframe: true,
          hasBody: !!body,
          hasHTML: body?.innerHTML?.length > 0,
        };
      });

      expect(afterResize.hasIframe).toBe(true);
      expect(afterResize.hasBody).toBe(true);
    });
  });

  test.describe('Navigation Issues', () => {
    test('chapter 1 content persists after navigation', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice
      await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
        });

        (window as any).rendition = rendition;
        await rendition.display('chapter_001.xhtml');

        // Wait for content
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      // Check initial content
      const firstLoad = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        return {
          hasContent:
            (iframe?.contentDocument?.body?.textContent?.trim().length || 0) >
            0,
        };
      });

      expect(firstLoad.hasContent).toBe(true);

      // Navigate to another chapter
      await page.evaluate(async () => {
        await (window as any).rendition.display('chapter_002.xhtml');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // Navigate back to chapter 1
      await page.evaluate(async () => {
        await (window as any).rendition.display('chapter_001.xhtml');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      // Check content is still there
      const secondLoad = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        return {
          hasContent:
            (iframe?.contentDocument?.body?.textContent?.trim().length || 0) >
            0,
        };
      });

      expect(secondLoad.hasContent).toBe(true);
    });
  });
});
