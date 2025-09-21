import { test, expect } from '@playwright/test';
import {
  waitForRenditionReady,
  navigateToChapter,
  waitForRelocation,
} from '../../helpers/test-helpers';

/**
 * Core Navigation Tests
 *
 * Tests navigation functionality:
 * 1. Next/previous page navigation
 * 2. Chapter navigation
 * 3. Table of contents
 * 4. Content visibility during navigation
 * 5. No white pages during navigation
 */

test.describe('Core Navigation', () => {
  test.describe('Page Navigation', () => {
    test('next and previous navigation works with prerenderer', async ({
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
          managerType: rendition.manager.constructor.name,
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
          managerType: rendition.manager.constructor.name,
        };
      });

      expect(prevResult.hasIframe).toBe(true);
      expect(prevResult.iframeVisible).toBe(true);
      expect(prevResult.currentHref).toMatch(/chapter_001/);
    });

    test('next and previous navigation works with default manager', async ({
      page,
      baseURL,
    }) => {
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
          manager: 'default', // Use default manager
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

  test.describe('Chapter Navigation', () => {
    test('maintains content visibility during chapter changes', async ({
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

      // Test navigation through several chapters
      const chapters = [
        'chapter_001.xhtml',
        'chapter_002.xhtml',
        'chapter_003.xhtml',
      ];

      for (const chapter of chapters) {
        await page.evaluate(async (chapterHref) => {
          const win: any = window as any;
          const rendition = win.getRendition
            ? win.getRendition()
            : win.rendition;
          await rendition.display(chapterHref);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }, chapter);

        // Verify content is visible after navigation
        const chapterResult = await page.evaluate((expectedChapter) => {
          const win: any = window as any;
          const rendition = win.getRendition
            ? win.getRendition()
            : win.rendition;
          const container = rendition.manager.container;
          const iframe = container.querySelector('iframe');

          return {
            hasIframe: !!iframe,
            iframeVisible: iframe
              ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
              : false,
            currentHref: rendition.location?.start?.href || 'unknown',
            expectedChapter,
          };
        }, chapter);

        expect(chapterResult.hasIframe).toBe(true);
        expect(chapterResult.iframeVisible).toBe(true);
        expect(chapterResult.currentHref).toMatch(
          new RegExp(chapter.replace('.xhtml', ''))
        );
      }
    });

    test('can navigate between specific chapters', async ({
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
          manager: 'default', // Use default manager for reliable chapter navigation
        });

        (window as any).rendition = rendition;
        (window as any).book = book;
        await rendition.display();

        return {
          totalChapters: book.spine?.items?.length || 0,
          managerType: rendition.manager.constructor.name,
        };
      });

      expect(setup.totalChapters).toBeGreaterThan(5);
      expect(setup.managerType).toBe('DefaultViewManager');

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
          manager: 'default', // Use default manager for TOC tests
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

  test.describe('White Page Prevention', () => {
    test('navigation never shows white pages', async ({ page, baseURL }) => {
      test.setTimeout(60_000);

      await page.goto(`${baseURL}/examples/prerendering-example.html`);

      // Track console for white page warnings
      const logs: string[] = [];
      page.on('console', (msg) => {
        logs.push(msg.text());
      });

      // Wait for setup
      await page.waitForFunction(
        () => typeof (window as any).ePub === 'function'
      );
      await page.waitForFunction(() => !!(window as any).getRendition, {
        timeout: 10000,
      });
      await page.waitForTimeout(2000);

      // Test navigation sequence that could trigger white pages
      const navigationSequence = [
        'chapter_001.xhtml',
        'chapter_002.xhtml',
        'prev', // go back
        'next', // go forward again
        'chapter_003.xhtml',
        'prev', // This used to cause white pages
        'chapter_001.xhtml',
      ];

      for (const nav of navigationSequence) {
        let result;
        if (nav === 'next' || nav === 'prev') {
          result = await page.evaluate(async (direction) => {
            const win: any = window as any;
            const rendition = win.getRendition
              ? win.getRendition()
              : win.rendition;
            await rendition[direction]();
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const container = rendition.manager.container;
            const iframe = container.querySelector('iframe');
            let hasContent = false;

            if (iframe) {
              try {
                const doc = iframe.contentDocument;
                const text = doc?.body?.textContent?.trim() || '';
                hasContent = text.length > 100; // Should have substantial content
              } catch (e) {
                // Cross-origin - assume content exists if iframe is visible
                hasContent = iframe.offsetWidth > 0 && iframe.offsetHeight > 0;
              }
            }

            return {
              hasIframe: !!iframe,
              hasContent,
              currentHref: rendition.location?.start?.href || 'unknown',
            };
          }, nav);
        } else {
          result = await page.evaluate(async (chapterHref) => {
            const win: any = window as any;
            const rendition = win.getRendition
              ? win.getRendition()
              : win.rendition;
            await rendition.display(chapterHref);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const container = rendition.manager.container;
            const iframe = container.querySelector('iframe');
            let hasContent = false;

            if (iframe) {
              try {
                const doc = iframe.contentDocument;
                const text = doc?.body?.textContent?.trim() || '';
                hasContent = text.length > 100; // Should have substantial content
              } catch (e) {
                // Cross-origin - assume content exists if iframe is visible
                hasContent = iframe.offsetWidth > 0 && iframe.offsetHeight > 0;
              }
            }

            return {
              hasIframe: !!iframe,
              hasContent,
              currentHref: rendition.location?.start?.href || 'unknown',
            };
          }, nav);
        }

        // Verify no white page after each step
        expect(result.hasIframe).toBe(true);
        expect(result.hasContent).toBe(true);
        expect(result.currentHref).not.toBe('unknown');

        await page.waitForTimeout(500); // Brief pause between navigation steps
      }

      // Check logs for white page indicators
      const whitePageLogs = logs.filter(
        (log) =>
          log.includes('white page') ||
          log.includes('empty content') ||
          log.includes('no content')
      );

      expect(whitePageLogs).toEqual([]);
    });
  });
});
