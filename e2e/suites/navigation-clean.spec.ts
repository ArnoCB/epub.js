import { test, expect } from '@playwright/test';

/**
 * Navigation Tests
 *
 * Tests for EPUB navigation features:
 * - Chapter navigation
 * - Page navigation
 * - Table of contents
 * - Bookmarks and locations
 */

test.describe('EPUB Navigation', () => {
  test.describe('Chapter Navigation', () => {
    test('can navigate between chapters in Alice EPUB', async ({
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
      const setup = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
        });

        (window as any).rendition = rendition;
        (window as any).book = book;
        await rendition.display();

        return {
          totalChapters: book.spine?.items?.length || 0,
        };
      });

      expect(setup.totalChapters).toBeGreaterThan(5);

      // Navigate to specific chapters
      const chapters = [
        'chapter_001.xhtml',
        'chapter_002.xhtml',
        'chapter_003.xhtml',
      ];

      for (const chapter of chapters) {
        await page.evaluate(async (chapterHref) => {
          await (window as any).rendition.display(chapterHref);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }, chapter);

        // Verify chapter is displayed
        const currentChapter = await page.evaluate(() => {
          const location = (window as any).rendition?.currentLocation();
          return location?.start?.href || '';
        });

        expect(currentChapter).toContain(chapter.replace('.xhtml', ''));
      }
    });

    test('can use prev/next navigation', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice and start at first chapter
      await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
        });

        (window as any).rendition = rendition;
        await rendition.display('chapter_001.xhtml');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // Go to next chapter
      await page.evaluate(async () => {
        await (window as any).rendition.next();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // Should be on chapter 2 now
      const secondChapter = await page.evaluate(() => {
        const location = (window as any).rendition?.currentLocation();
        return location?.start?.href || '';
      });

      expect(secondChapter).toContain('chapter_002');

      // Go back to previous chapter
      await page.evaluate(async () => {
        await (window as any).rendition.prev();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // Should be back on chapter 1
      const firstChapter = await page.evaluate(() => {
        const location = (window as any).rendition?.currentLocation();
        return location?.start?.href || '';
      });

      expect(firstChapter).toContain('chapter_001');
    });
  });

  test.describe('Table of Contents', () => {
    test('can access and use table of contents', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Wait for library to load
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function'
      );

      // Load Alice and check TOC
      const tocData = await page.evaluate(async () => {
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        await book.opened;

        const rendition = book.renderTo('viewer', {
          width: 900,
          height: 600,
        });

        (window as any).rendition = rendition;
        (window as any).book = book;
        await rendition.display();

        // Get table of contents
        const nav = book.navigation;
        return {
          hasToc: !!nav?.toc,
          tocLength: nav?.toc?.length || 0,
          tocItems:
            nav?.toc?.slice(0, 3)?.map((item: any) => ({
              label: item.label,
              href: item.href,
            })) || [],
        };
      });

      expect(tocData.hasToc).toBe(true);
      expect(tocData.tocLength).toBeGreaterThan(0);
      expect(tocData.tocItems.length).toBeGreaterThan(0);

      // Navigate using TOC item if available
      if (tocData.tocItems.length > 0) {
        const firstTocItem = tocData.tocItems[0];
        await page.evaluate(async (href) => {
          await (window as any).rendition.display(href);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }, firstTocItem.href);

        // Verify navigation worked
        const currentLocation = await page.evaluate(() => {
          const location = (window as any).rendition?.currentLocation();
          return location?.start?.href || '';
        });

        expect(currentLocation).toBeTruthy();
      }
    });
  });
});
