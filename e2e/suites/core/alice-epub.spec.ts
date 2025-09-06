import { test, expect } from '@playwright/test';

/**
 * Alice in Wonderland EPUB Tests
 *
 * Tests using the local Alice.epub file for:
 * - Single page mode
 * - Two page spread mode
 * - Both prerendered and non-prerendered modes
 */

test.describe('Alice in Wonderland EPUB', () => {
  test.describe('Single Page Mode', () => {
    test('can load and read Alice EPUB - single page (prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      // Fallback for baseURL if undefined
      const testBaseURL = baseURL || 'http://127.0.0.1:9876';
      await page.goto(`${testBaseURL}/examples/prerendering-example.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice EPUB
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
          spread: 'none',
        });

        // Use prerendering
        (window as any).rendition = rendition;
        await rendition.display();

        return {
          isOpen: !!book.isOpen,
          hasArchive: !!book.archive,
          title: book.packaging?.metadata?.title || '',
          spine: book.spine?.items?.length || 0,
          renditionReady: !!rendition,
        };
      });

      expect(result.isOpen).toBe(true);
      expect(result.hasArchive).toBe(true);
      expect(result.title).toContain('Alice');
      expect(result.spine).toBeGreaterThan(0);
      expect(result.renditionReady).toBe(true);
    });

    test('can load and read Alice EPUB - single page (non-prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      // Fallback for baseURL if undefined
      const testBaseURL = baseURL || 'http://127.0.0.1:9876';
      await page.goto(`${testBaseURL}/e2e/fixtures/epub-test-page.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice EPUB without prerendering
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
          spread: 'none',
        });

        await rendition.display();

        return {
          isOpen: !!book.isOpen,
          title: book.packaging?.metadata?.title || '',
          spine: book.spine?.items?.length || 0,
        };
      });

      expect(result.isOpen).toBe(true);
      expect(result.title).toContain('Alice');
      expect(result.spine).toBeGreaterThan(0);
    });
  });

  test.describe('Two Page Spread Mode', () => {
    test('can load and read Alice EPUB - spread mode (prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      // Fallback for baseURL if undefined
      const testBaseURL = baseURL || 'http://127.0.0.1:9876';
      await page.goto(`${testBaseURL}/examples/prerendering-example.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice EPUB with spread mode
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 1800,
          height: 600,
          spread: 'always',
        });

        await rendition.display();

        return {
          isOpen: !!book.isOpen,
          title: book.packaging?.metadata?.title || '',
          spine: book.spine?.items?.length || 0,
          spreadMode: true,
        };
      });

      expect(result.isOpen).toBe(true);
      expect(result.title).toContain('Alice');
      expect(result.spine).toBeGreaterThan(0);
    });

    test('can load and read Alice EPUB - spread mode (non-prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(60_000);

      // Fallback for baseURL if undefined
      const testBaseURL = baseURL || 'http://127.0.0.1:9876';
      await page.goto(`${testBaseURL}/e2e/fixtures/epub-test-page.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice EPUB with spread mode, no prerendering
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 1800,
          height: 600,
          spread: 'always',
        });

        await rendition.display();

        return {
          isOpen: !!book.isOpen,
          title: book.packaging?.metadata?.title || '',
          spine: book.spine?.items?.length || 0,
        };
      });

      expect(result.isOpen).toBe(true);
      expect(result.title).toContain('Alice');
      expect(result.spine).toBeGreaterThan(0);
    });
  });
});
