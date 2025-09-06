import { test, expect } from '@playwright/test';

/**
 * Moby Dick EPUB Tests (Online)
 *
 * Tests using the remote Moby Dick EPUB for:
 * - Single page mode
 * - Two page spread mode
 * - Both prerendered and non-prerendered modes
 */

test.describe('Moby Dick EPUB (Online)', () => {
  test.describe('Single Page Mode', () => {
    test('can load and read Moby Dick EPUB - single page (prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(120_000);
      test.slow(); // Mark as slow due to network loading

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Moby Dick EPUB
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub(
          'https://s3.amazonaws.com/moby-dick/moby-dick.epub'
        );
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
          spread: 'none',
        });

        await rendition.display();

        return {
          isOpen: !!book.isOpen,
          hasPackaging: !!(book.packaging && book.packaging.metadata),
          title: book.packaging?.metadata?.title || '',
          spine: book.spine?.items?.length || 0,
          renditionReady: !!rendition,
        };
      });

      expect(result.isOpen).toBe(true);
      expect(result.hasPackaging).toBe(true);
      expect(result.title).toContain('Moby');
      expect(result.spine).toBeGreaterThan(100); // Moby Dick has many chapters
      expect(result.renditionReady).toBe(true);
    });

    test('can load and read Moby Dick EPUB - single page (non-prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(120_000);
      test.slow();

      await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Moby Dick EPUB without prerendering
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub(
          'https://s3.amazonaws.com/moby-dick/moby-dick.epub'
        );
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
      expect(result.title).toContain('Moby');
      expect(result.spine).toBeGreaterThan(100);
    });
  });

  test.describe('Two Page Spread Mode', () => {
    test('can load and read Moby Dick EPUB - spread mode (prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(120_000);
      test.slow();

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Moby Dick EPUB with spread mode
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub(
          'https://s3.amazonaws.com/moby-dick/moby-dick.epub'
        );
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
      expect(result.title).toContain('Moby');
      expect(result.spine).toBeGreaterThan(100);
    });

    test('can load and read Moby Dick EPUB - spread mode (non-prerendered)', async ({
      page,
      baseURL,
    }) => {
      test.setTimeout(120_000);
      test.slow();

      await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

      // Wait for the library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Moby Dick EPUB with spread mode, no prerendering
      const result = await page.evaluate(async () => {
        const book = (window as any).ePub(
          'https://s3.amazonaws.com/moby-dick/moby-dick.epub'
        );
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
      expect(result.title).toContain('Moby');
      expect(result.spine).toBeGreaterThan(100);
    });
  });
});
