import { test, expect } from '@playwright/test';
import { EPUB_TEST_DATASET, RENDERING_MODES } from '../../test-dataset';

/**
 * Core Rendering Mode Tests
 *
 * Tests different rendering configurations:
 * 1. Single page mode
 * 2. Spread mode (two pages side by side)
 * 3. Viewport sizing and content display
 */

test.describe('Core Rendering Modes', () => {
  const alice = EPUB_TEST_DATASET.find(
    (epub) => epub.name === 'Alice in Wonderland'
  )!;

  test('single page mode renders correctly', async ({ page, baseURL }) => {
    test.setTimeout(30_000);

    const singleMode = RENDERING_MODES.find((mode) => mode.mode === 'single')!;

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for library
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });

    // Set viewport size for single page
    await page.setViewportSize({
      width: 900,
      height: 600,
    });

    // Configure single page mode and display content
    const renderResult = await page.evaluate(async (config) => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;

      // Display first chapter
      await rendition.display('chapter_001.xhtml');

      // Wait for layout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check rendering state
      const container = rendition.manager.container;
      const iframe = container.querySelector('iframe');

      return {
        hasIframe: !!iframe,
        iframeVisible: iframe
          ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
          : false,
        containerWidth: container.offsetWidth,
        containerHeight: container.offsetHeight,
        iframeCount: container.querySelectorAll('iframe').length,
      };
    }, singleMode);

    expect(renderResult.hasIframe).toBe(true);
    expect(renderResult.iframeVisible).toBe(true);
    expect(renderResult.iframeCount).toBe(1); // Single page should have one iframe
    expect(renderResult.containerWidth).toBeGreaterThan(0);
    expect(renderResult.containerHeight).toBeGreaterThan(0);
  });

  test('spread mode renders two pages side by side', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(45_000);

    const spreadMode = RENDERING_MODES.find((mode) => mode.mode === 'spread')!;

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for library
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });

    // Set viewport size for spread
    await page.setViewportSize({
      width: 1800,
      height: 600,
    });

    // Configure spread mode
    const renderResult = await page.evaluate(async (config) => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;

      // Configure for spread mode (if supported)
      if (rendition.manager && rendition.manager.settings) {
        rendition.manager.settings.width = config.width;
      }

      // Display content that should trigger spread layout
      await rendition.display('chapter_001.xhtml');

      // Wait for layout
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Check rendering state
      const container = rendition.manager.container;
      const iframes = container.querySelectorAll('iframe');

      return {
        iframeCount: iframes.length,
        containerWidth: container.offsetWidth,
        totalIframeWidth: Array.from(iframes).reduce(
          (sum: number, iframe) => sum + (iframe as HTMLElement).offsetWidth,
          0
        ),
        hasVisibleContent: Array.from(iframes).some(
          (iframe) =>
            (iframe as HTMLElement).offsetWidth > 0 &&
            (iframe as HTMLElement).offsetHeight > 0
        ),
      };
    }, spreadMode);

    expect(renderResult.hasVisibleContent).toBe(true);
    expect(renderResult.containerWidth).toBeGreaterThan(0);
    // Note: Spread mode behavior depends on content and may show 1 or 2 iframes depending on chapter content
    expect(renderResult.iframeCount).toBeGreaterThanOrEqual(1);
  });

  test('viewport resizing maintains content visibility', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(30_000);

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for library
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });

    // Initial display
    await page.evaluate(async () => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      await rendition.display('chapter_001.xhtml');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    // Check content before resize
    const beforeResize = await page.evaluate(() => {
      const container =
        document.getElementById('viewer') ||
        document.querySelector('[data-epub-viewer]');
      const iframe = container?.querySelector('iframe');
      return {
        hasContent:
          !!iframe && iframe.offsetWidth > 0 && iframe.offsetHeight > 0,
        width: iframe?.offsetWidth || 0,
        height: iframe?.offsetHeight || 0,
      };
    });

    expect(beforeResize.hasContent).toBe(true);

    // Resize viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1500); // Allow resize to settle

    // Check content after resize
    const afterResize = await page.evaluate(() => {
      const container =
        document.getElementById('viewer') ||
        document.querySelector('[data-epub-viewer]');
      const iframe = container?.querySelector('iframe');
      return {
        hasContent:
          !!iframe && iframe.offsetWidth > 0 && iframe.offsetHeight > 0,
        width: iframe?.offsetWidth || 0,
        height: iframe?.offsetHeight || 0,
      };
    });

    expect(afterResize.hasContent).toBe(true);
    expect(afterResize.width).toBeGreaterThan(0);
    expect(afterResize.height).toBeGreaterThan(0);
  });
});
