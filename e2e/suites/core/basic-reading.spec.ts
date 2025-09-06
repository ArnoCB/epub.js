import { test, expect } from '@playwright/test';
import { EPUB_TEST_DATASET } from '../../test-dataset';

/**
 * Core EPUB Reading Tests
 *
 * Tests basic functionality:
 * 1. Opening books from different sources (local files, URLs)
 * 2. Basic rendering in different modes
 * 3. Library initialization
 */

test.describe('Core EPUB Reading', () => {
  test('opens local EPUB files (Alice in Wonderland)', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(30_000);

    const alice = EPUB_TEST_DATASET.find(
      (epub) => epub.name === 'Alice in Wonderland'
    )!;

    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

    // Wait for library to load
    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function'
    );

    // Open the EPUB
    const bookResult = await page.evaluate(async (localPath) => {
      try {
        const book = (window as any).ePub(localPath);
        await book.opened;
        return {
          success: true,
          isOpen: !!book.isOpen,
          hasArchive: !!book.archive,
          url: book.url?.toString() || 'no-url',
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }, alice.localPath);

    expect(bookResult.success).toBe(true);
    expect(bookResult.isOpen).toBe(true);
    expect(bookResult.hasArchive).toBe(true);
    expect(bookResult.url).toMatch(/alice/);
  });

  test('opens remote EPUB files (Moby Dick)', async ({ page, baseURL }) => {
    test.setTimeout(60_000);
    test.slow(); // Mark as slow due to network

    const mobyDick = EPUB_TEST_DATASET.find(
      (epub) => epub.name === 'Moby Dick'
    )!;

    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

    // Wait for library to load
    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function'
    );

    // Open the EPUB
    const bookResult = await page.evaluate(async (url) => {
      try {
        const book = (window as any).ePub(url);
        await book.opened;
        return {
          success: true,
          isOpen: !!book.isOpen,
          url: book.url?.toString() || 'no-url',
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }, mobyDick.url);

    expect(bookResult.success).toBe(true);
    expect(bookResult.isOpen).toBe(true);
    expect(bookResult.url).toMatch(/moby-dick/);
  });

  test('initializes rendition and displays content', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(30_000);

    const alice = EPUB_TEST_DATASET.find(
      (epub) => epub.name === 'Alice in Wonderland'
    )!;

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for library and rendition
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });

    // Get rendition info
    const renditionInfo = await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;

      return {
        hasRendition: !!rendition,
        managerType: rendition?.manager?.constructor?.name || 'unknown',
        containerExists: !!rendition?.manager?.container,
      };
    });

    expect(renditionInfo.hasRendition).toBe(true);
    expect(renditionInfo.managerType).toBe('DefaultViewManager');
    expect(renditionInfo.containerExists).toBe(true);
  });
});
