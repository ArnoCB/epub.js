import { test, expect } from '@playwright/test';

/**
 * Rendering Mode Tests
 *
 * Tests for different EPUB rendering modes:
 * - Single page mode
 * - Two page spread mode
 * - Scrolled vs paginated
 */

test.describe('Rendering Modes', () => {
  test.describe('Single Page Mode', () => {
    test('renders Alice in single page mode', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
          spread: 'none', // Force single page
        });

        await rendition.display();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          width: rendition.manager.container.clientWidth,
          spread: rendition.settings.spread,
          isDisplayed: !!rendition.manager.views.displayed().length,
        };
      });

      expect(result.width).toBe(900);
      expect(result.spread).toBe('none');
      expect(result.isDisplayed).toBe(true);
    });
  });

  test.describe('Two Page Spread Mode', () => {
    test('renders Alice in spread mode', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 1800,
          height: 600,
          spread: 'always', // Force spread mode
        });

        await rendition.display();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          width: rendition.manager.container.clientWidth,
          spread: rendition.settings.spread,
          isDisplayed: !!rendition.manager.views.displayed().length,
        };
      });

      expect(result.width).toBe(1800);
      expect(result.spread).toBe('always');
      expect(result.isDisplayed).toBe(true);
    });
  });

  test.describe('Flow Modes', () => {
    test('renders Alice in paginated flow', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
          flow: 'paginated',
        });

        await rendition.display();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          flow: rendition.settings.flow,
          isDisplayed: !!rendition.manager.views.displayed().length,
          hasManager: !!rendition.manager,
        };
      });

      expect(result.flow).toBe('paginated');
      expect(result.isDisplayed).toBe(true);
      expect(result.hasManager).toBe(true);
    });

    test('renders Alice in scrolled flow', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/scrolled.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      const result = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
          flow: 'scrolled',
        });

        await rendition.display();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          flow: rendition.settings.flow,
          isDisplayed: !!rendition.manager.views.displayed().length,
          hasManager: !!rendition.manager,
        };
      });

      expect(result.flow).toBe('scrolled');
      expect(result.isDisplayed).toBe(true);
      expect(result.hasManager).toBe(true);
    });
  });
});
