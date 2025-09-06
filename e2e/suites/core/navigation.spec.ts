import { test, expect } from '@playwright/test';
import {
  waitForRenditionReady,
  navigateToChapter,
  waitForRelocation,
} from '../../test-helpers';

/**
 * Core Navigation Tests
 *
 * Tests basic navigation functionality:
 * 1. Next/previous page navigation
 * 2. Chapter navigation
 * 3. Content visibility during navigation
 * 4. No white pages
 */

test.describe('Core Navigation', () => {
  test('next and previous navigation works', async ({ page, baseURL }) => {
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
      };
    });

    expect(prevResult.hasIframe).toBe(true);
    expect(prevResult.iframeVisible).toBe(true);
    expect(prevResult.currentHref).toMatch(/chapter_001/);
  });

  test('chapter navigation maintains content visibility', async ({
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

    const chapters = [
      'chapter_001.xhtml',
      'chapter_002.xhtml',
      'chapter_003.xhtml',
    ];

    for (const chapter of chapters) {
      await page.evaluate(async (chapterHref) => {
        const win: any = window as any;
        const rendition = win.getRendition ? win.getRendition() : win.rendition;
        await rendition.display(chapterHref);
      }, chapter);

      await page.waitForTimeout(1500); // Allow navigation to settle

      const chapterResult = await page.evaluate((chapterHref) => {
        const win: any = window as any;
        const rendition = win.getRendition ? win.getRendition() : win.rendition;
        const container = rendition.manager.container;
        const iframe = container.querySelector('iframe');

        // Check for content
        let hasTextContent = false;
        try {
          const doc = iframe?.contentDocument;
          const body = doc?.body;
          if (body) {
            const text = (body.textContent || '').trim();
            hasTextContent = text.length > 0;
          }
        } catch (e) {
          // Cross-origin restrictions - assume content exists if iframe is sized
          hasTextContent = iframe
            ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
            : false;
        }

        return {
          chapterHref,
          hasIframe: !!iframe,
          iframeVisible: iframe
            ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
            : false,
          hasTextContent,
          currentLocation: rendition.location?.start?.href || 'unknown',
        };
      }, chapter);

      expect(chapterResult.hasIframe).toBe(true);
      expect(chapterResult.iframeVisible).toBe(true);
      expect(chapterResult.hasTextContent).toBe(true);
      expect(chapterResult.currentLocation).toMatch(
        new RegExp(chapter.replace('.xhtml', ''))
      );
    }
  });

  test('navigation never shows white pages', async ({ page, baseURL }) => {
    test.setTimeout(60_000);

    // Track any white page occurrences
    const whitePageEvents: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('white page') ||
        text.includes('empty content') ||
        text.includes('no content')
      ) {
        whitePageEvents.push(text);
      }
    });

    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for setup
    await page.waitForFunction(
      () => typeof (window as any).ePub === 'function'
    );
    await page.waitForFunction(() => !!(window as any).getRendition, {
      timeout: 10000,
    });
    await page.waitForTimeout(3000); // Allow prerendering

    // Perform multiple navigation operations
    const navigationSequence = [
      'chapter_001.xhtml',
      'next',
      'next',
      'prev',
      'prev',
      'chapter_002.xhtml',
      'prev',
      'next',
      'chapter_003.xhtml',
      'prev',
      'prev',
    ];

    for (const action of navigationSequence) {
      if (action.endsWith('.xhtml')) {
        // Direct chapter navigation
        await page.evaluate(async (chapter) => {
          const win: any = window as any;
          const rendition = win.getRendition
            ? win.getRendition()
            : win.rendition;
          await rendition.display(chapter);
        }, action);
      } else if (action === 'next') {
        await page.evaluate(async () => {
          const win: any = window as any;
          const rendition = win.getRendition
            ? win.getRendition()
            : win.rendition;
          await rendition.next();
        });
      } else if (action === 'prev') {
        await page.evaluate(async () => {
          const win: any = window as any;
          const rendition = win.getRendition
            ? win.getRendition()
            : win.rendition;
          await rendition.prev();
        });
      }

      await page.waitForTimeout(1000); // Allow navigation to settle

      // Check for visible content
      const contentCheck = await page.evaluate((currentAction) => {
        const container =
          document.getElementById('viewer') ||
          document.querySelector('[data-epub-viewer]');
        if (!container) return { hasContainer: false };

        const iframe = container.querySelector('iframe');
        if (!iframe) return { hasContainer: true, hasIframe: false };

        const isVisible = iframe.offsetWidth > 0 && iframe.offsetHeight > 0;

        let hasContent = false;
        try {
          const doc = iframe.contentDocument;
          const body = doc?.body;
          if (body) {
            const text = (body.textContent || '').trim();
            const html = (body.innerHTML || '').trim();
            hasContent = text.length > 0 || html.length > 0;
          }
        } catch (e) {
          // Assume content exists if iframe is properly sized
          hasContent = isVisible;
        }

        return {
          hasContainer: true,
          hasIframe: true,
          isVisible,
          hasContent,
          action: currentAction,
        };
      }, action);

      expect(contentCheck.hasContainer).toBe(true);
      expect(contentCheck.hasIframe).toBe(true);
      expect(contentCheck.isVisible).toBe(true);
      expect(contentCheck.hasContent).toBe(true);
    }

    // Verify no white page events were logged
    expect(whitePageEvents).toEqual([]);
  });
});
