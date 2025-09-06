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
    expect(bookResult.url).toBe('/'); // book.url is always '/' (EPUB root path)
  });

  test('opens remote EPUB files (Moby Dick)', async ({ page, baseURL }) => {
    test.setTimeout(120_000); // Increased timeout for remote loading
    test.slow(); // Mark as slow due to network

    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

    // Wait for library to load
    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function',
      { timeout: 30_000 }
    );

    // Use the correct EPUB URL (not the package.opf)
    const epubUrl = 'https://s3.amazonaws.com/moby-dick/moby-dick.epub';

    // Open the EPUB with better error handling
    const bookResult = await page.evaluate(async (url) => {
      try {
        const book = (window as any).ePub(url);

        // Add timeout to book.opened
        const openedPromise = book.opened;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Book opening timed out')), 90000)
        );

        await Promise.race([openedPromise, timeoutPromise]);

        return {
          success: true,
          isOpen: !!book.isOpen,
          url: book.url?.toString() || 'no-url',
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack,
        };
      }
    }, epubUrl);

    expect(bookResult.success).toBe(true);
    expect(bookResult.isOpen).toBe(true);
    expect(bookResult.url).toBe('/'); // book.url is always '/' (EPUB root path)
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

    // Wait for rendition to be fully attached (when container is initialized)
    await page.waitForFunction(
      () => {
        const win: any = window as any;
        const rendition = win.getRendition ? win.getRendition() : win.rendition;
        return rendition?.manager?.container;
      },
      { timeout: 15000 }
    );

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
