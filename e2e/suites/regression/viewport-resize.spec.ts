import { test, expect } from '@playwright/test';

/**
 * Resize Regression Tests
 *
 * Tests for viewport resize issues that were previously broken:
 * 1. Regular content survives resize
 * 2. White pages (title pages) survive resize
 * 3. Prerendered content is preserved during resize
 */

test.describe('Resize Regression Tests', () => {
  test('regular chapter content survives window resize', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(45_000);

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for setup
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    // Display a regular chapter with content
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('chapter_001.xhtml');
    });
    await page.waitForTimeout(2000);

    // Verify content before resize
    const beforeResize = await page.evaluate(() => {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe');

      let contentInfo = { hasText: false, textLength: 0 };
      try {
        const doc = iframe?.contentDocument;
        const body = doc?.body;
        if (body) {
          const text = (body.textContent || '').trim();
          contentInfo = { hasText: text.length > 0, textLength: text.length };
        }
      } catch (e) {
        contentInfo = { hasText: true, textLength: -1 };
      }

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        ...contentInfo,
      };
    });

    expect(beforeResize.hasIframe).toBe(true);
    expect(beforeResize.iframeVisible).toBe(true);
    expect(beforeResize.hasText).toBe(true);

    // Resize the window
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(2000); // Allow resize to settle

    // Verify content after resize
    const afterResize = await page.evaluate(() => {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe');

      let contentInfo = { hasText: false, textLength: 0 };
      try {
        const doc = iframe?.contentDocument;
        const body = doc?.body;
        if (body) {
          const text = (body.textContent || '').trim();
          contentInfo = { hasText: text.length > 0, textLength: text.length };
        }
      } catch (e) {
        contentInfo = { hasText: true, textLength: -1 };
      }

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        ...contentInfo,
      };
    });

    expect(afterResize.hasIframe).toBe(true);
    expect(afterResize.iframeVisible).toBe(true);
    expect(afterResize.hasText).toBe(true);
  });

  test('white pages (title page) survive window resize', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(45_000);

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for setup
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });
    await page.waitForTimeout(3000); // Allow prerendering

    // Display a white page (title page with minimal content)
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('titlepage.xhtml');
    });
    await page.waitForTimeout(2000);

    // Verify title page is displayed before resize
    const beforeResize = await page.evaluate(() => {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe');

      let pageInfo = { hasHTML: false, htmlLength: 0, bodyExists: false };
      try {
        const doc = iframe?.contentDocument;
        const body = doc?.body;
        if (body) {
          const html = (body.innerHTML || '').trim();
          pageInfo = {
            hasHTML: html.length > 0,
            htmlLength: html.length,
            bodyExists: true,
          };
        }
      } catch (e) {
        pageInfo = { hasHTML: true, htmlLength: -1, bodyExists: true };
      }

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        ...pageInfo,
      };
    });

    expect(beforeResize.hasIframe).toBe(true);
    expect(beforeResize.iframeVisible).toBe(true);
    expect(beforeResize.bodyExists).toBe(true);

    // Resize the window
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(2000);

    // Verify title page survives resize
    const afterResize = await page.evaluate(() => {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe');

      let pageInfo = { hasHTML: false, htmlLength: 0, bodyExists: false };
      try {
        const doc = iframe?.contentDocument;
        const body = doc?.body;
        if (body) {
          const html = (body.innerHTML || '').trim();
          pageInfo = {
            hasHTML: html.length > 0,
            htmlLength: html.length,
            bodyExists: true,
          };
        }
      } catch (e) {
        pageInfo = { hasHTML: true, htmlLength: -1, bodyExists: true };
      }

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        ...pageInfo,
      };
    });

    expect(afterResize.hasIframe).toBe(true);
    expect(afterResize.iframeVisible).toBe(true);
    expect(afterResize.bodyExists).toBe(true);
  });

  test('prerendered content is preserved during multiple resizes', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(60_000);

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for setup and prerendering
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });
    await page.waitForTimeout(4000); // Allow prerendering to complete

    // Display a prerendered chapter
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('chapter_002.xhtml');
    });
    await page.waitForTimeout(2000);

    const resizeSizes = [
      { width: 1200, height: 800 },
      { width: 800, height: 600 },
      { width: 1400, height: 900 },
      { width: 900, height: 600 },
    ];

    for (let i = 0; i < resizeSizes.length; i++) {
      const size = resizeSizes[i];

      // Resize
      await page.setViewportSize(size);
      await page.waitForTimeout(1500);

      // Check content preservation
      const resizeResult = await page.evaluate((resizeStep) => {
        const viewer = document.getElementById('viewer');
        const iframe = viewer?.querySelector('iframe');

        let contentCheck = { hasContent: false, contentLength: 0 };
        try {
          const doc = iframe?.contentDocument;
          const body = doc?.body;
          if (body) {
            const text = (body.textContent || '').trim();
            const html = (body.innerHTML || '').trim();
            contentCheck = {
              hasContent: text.length > 0 || html.length > 0,
              contentLength: Math.max(text.length, html.length),
            };
          }
        } catch (e) {
          contentCheck = { hasContent: true, contentLength: -1 };
        }

        return {
          resizeStep,
          hasIframe: !!iframe,
          iframeVisible: iframe
            ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
            : false,
          ...contentCheck,
          viewportSize: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        };
      }, i + 1);

      expect(resizeResult.hasIframe).toBe(true);
      expect(resizeResult.iframeVisible).toBe(true);
      expect(resizeResult.hasContent).toBe(true);
    }
  });

  test('resize does not break navigation after resize', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(45_000);

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for setup
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    // Display initial content
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('chapter_001.xhtml');
    });
    await page.waitForTimeout(2000);

    // Resize the window
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(2000);

    // Test navigation after resize
    const navResult = await page.evaluate(async () => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;

      // Try next navigation
      await rendition.next();
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const nextCheck = (() => {
        const iframe = rendition.manager.container.querySelector('iframe');
        let hasContent = false;
        try {
          const doc = iframe?.contentDocument;
          const body = doc?.body;
          if (body) {
            const text = (body.textContent || '').trim();
            hasContent = text.length > 0;
          }
        } catch (e) {
          hasContent = iframe
            ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
            : false;
        }
        return { hasIframe: !!iframe, hasContent };
      })();

      // Try prev navigation
      await rendition.prev();
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const prevCheck = (() => {
        const iframe = rendition.manager.container.querySelector('iframe');
        let hasContent = false;
        try {
          const doc = iframe?.contentDocument;
          const body = doc?.body;
          if (body) {
            const text = (body.textContent || '').trim();
            hasContent = text.length > 0;
          }
        } catch (e) {
          hasContent = iframe
            ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
            : false;
        }
        return { hasIframe: !!iframe, hasContent };
      })();

      return { nextCheck, prevCheck };
    });

    expect(navResult.nextCheck.hasIframe).toBe(true);
    expect(navResult.nextCheck.hasContent).toBe(true);
    expect(navResult.prevCheck.hasIframe).toBe(true);
    expect(navResult.prevCheck.hasContent).toBe(true);
  });
});
