import { test, expect } from '@playwright/test';

/**
 * Regression Tests
 *
 * Tests for specific bugs that have been fixed:
 * 1. White page navigation issues
 * 2. Empty content after chapter navigation
 * 3. Viewport resize breaking content
 * 4. Prerendering content loss
 */

test.describe('Regression Tests', () => {
  test('no white page when navigating back from chapter 1', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(45_000);

    // Track console logs for debugging
    const logs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (
        /(DefaultViewManager|BookPreRenderer|white page|empty content)/.test(
          text
        )
      ) {
        logs.push(text);
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
    await page.waitForTimeout(2000); // Allow prerendering to start

    // Navigate to chapter 1
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('chapter_001.xhtml');
    });
    await page.waitForTimeout(1500);

    // Go back (prev) - this should trigger the prepend path
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.prev();
    });
    await page.waitForTimeout(2000);

    // Check that we have visible content, not a white page
    const result = await page.evaluate(() => {
      const container =
        document.getElementById('viewer') ||
        document.querySelector('[data-epub-viewer]');
      if (!container) return { error: 'No viewer container found' };

      const iframe = container.querySelector('iframe');
      if (!iframe) return { error: 'No iframe found' };

      const isVisible = iframe.offsetWidth > 0 && iframe.offsetHeight > 0;

      let contentInfo = { hasText: false, hasHTML: false, textLength: 0 };
      try {
        const doc = iframe.contentDocument;
        const body = doc?.body;
        if (body) {
          const text = (body.textContent || '').trim();
          const html = (body.innerHTML || '').trim();
          contentInfo = {
            hasText: text.length > 0,
            hasHTML: html.length > 0,
            textLength: text.length,
          };
        }
      } catch (e) {
        // Cross-origin - assume content exists if iframe is properly sized
        contentInfo = { hasText: true, hasHTML: true, textLength: -1 };
      }

      return {
        hasIframe: true,
        iframeVisible: isVisible,
        ...contentInfo,
        iframeDimensions: {
          width: iframe.offsetWidth,
          height: iframe.offsetHeight,
        },
      };
    });

    if ('error' in result) {
      throw new Error(result.error);
    }

    expect(result.hasIframe).toBe(true);
    expect(result.iframeVisible).toBe(true);
    expect(result.hasText || result.hasHTML).toBe(true);
    expect(result.iframeDimensions.width).toBeGreaterThan(0);
    expect(result.iframeDimensions.height).toBeGreaterThan(0);

    // Ensure no white page indicators in logs
    const whitePageLogs = logs.filter(
      (log) =>
        log.includes('white page') ||
        log.includes('empty content') ||
        log.includes('textLength: 0')
    );
    expect(whitePageLogs).toEqual([]);
  });

  test('viewport resize preserves content visibility', async ({
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

    // Display content
    await page.evaluate(() => {
      const win: any = window as any;
      const rendition = win.getRendition ? win.getRendition() : win.rendition;
      return rendition.display('chapter_001.xhtml');
    });
    await page.waitForTimeout(2000);

    // Check content before resize
    const beforeResize = await page.evaluate(() => {
      const container =
        document.getElementById('viewer') ||
        document.querySelector('[data-epub-viewer]');
      const iframe = container?.querySelector('iframe');

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

      return {
        hasIframe: !!iframe,
        hasContent,
        dimensions: iframe
          ? { width: iframe.offsetWidth, height: iframe.offsetHeight }
          : null,
      };
    });

    expect(beforeResize.hasIframe).toBe(true);
    expect(beforeResize.hasContent).toBe(true);

    // Resize the viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(2000); // Allow resize to complete

    // Check content after resize
    const afterResize = await page.evaluate(() => {
      const container =
        document.getElementById('viewer') ||
        document.querySelector('[data-epub-viewer]');
      const iframe = container?.querySelector('iframe');

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

      return {
        hasIframe: !!iframe,
        hasContent,
        dimensions: iframe
          ? { width: iframe.offsetWidth, height: iframe.offsetHeight }
          : null,
      };
    });

    expect(afterResize.hasIframe).toBe(true);
    expect(afterResize.hasContent).toBe(true);
    expect(afterResize.dimensions).toBeTruthy();
    expect(afterResize.dimensions!.width).toBeGreaterThan(0);
    expect(afterResize.dimensions!.height).toBeGreaterThan(0);
  });

  test('prerendered content survives navigation cycles', async ({
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
    await page.waitForTimeout(3000); // Allow prerendering to complete

    const navigationCycle = [
      'chapter_001.xhtml',
      'chapter_002.xhtml',
      'chapter_001.xhtml', // Navigate back to chapter 1
      'chapter_003.xhtml',
      'chapter_001.xhtml', // Navigate back again
    ];

    for (let i = 0; i < navigationCycle.length; i++) {
      const chapter = navigationCycle[i];

      await page.evaluate(async (chapterHref) => {
        const win: any = window as any;
        const rendition = win.getRendition ? win.getRendition() : win.rendition;
        await rendition.display(chapterHref);
      }, chapter);

      await page.waitForTimeout(1500);
      // Poll for iframe visibility/content up to 1000ms
      let pollResult: any = undefined;
      const maxPolls = 5;
      for (let poll = 0; poll < maxPolls; poll++) {
        const result = await page.evaluate(
          (stepInfo) => {
            const win = window as any;
            const rendition = win.getRendition
              ? win.getRendition()
              : win.rendition;
            const container = rendition.manager.container;
            const iframe = container.querySelector('iframe');
            let contentCheck = { hasText: false, textLength: 0 };
            try {
              const doc = iframe?.contentDocument;
              const body = doc?.body;
              if (body) {
                const text = (body.textContent || '').trim();
                contentCheck = {
                  hasText: text.length > 0,
                  textLength: text.length,
                };
              }
            } catch (e) {
              contentCheck = { hasText: true, textLength: -1 };
            }
            return {
              hasIframe: !!iframe,
              iframeVisible: iframe
                ? iframe.offsetWidth > 0 && iframe.offsetHeight > 0
                : false,
              ...contentCheck,
              currentLocation: rendition.location?.start?.href || 'unknown',
              iframeRect: iframe ? iframe.getBoundingClientRect() : null,
              containerRect: container.getBoundingClientRect(),
              time: Date.now(),
            };
          },
          { step: i + 1, chapter }
        );
        pollResult = result;
        if (pollResult && pollResult.iframeVisible && pollResult.hasText) break;
        await page.waitForTimeout(200);
      }
      // Fallback: if polling never succeeded, use last result or throw
      if (!pollResult) throw new Error('No poll result for iframe visibility');

      // Print diagnostic log
      // eslint-disable-next-line no-console
      // console.log('Prerendered navigation cycle step', i + 1, pollResult);

      expect(pollResult.hasIframe).toBe(true);
      expect(pollResult.iframeVisible).toBe(true);
      expect(pollResult.hasText).toBe(true);
      expect(pollResult.currentLocation).toMatch(
        new RegExp((chapter || '').replace('.xhtml', ''))
      );
    }
  });

  test('white page detection and prevention', async ({ page, baseURL }) => {
    test.setTimeout(45_000);

    // Track any white page related events
    const whitePageEvents: {
      type: string;
      message: string;
      timestamp: number;
    }[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        /(white page|empty content|no content|textLength.*0|htmlLength.*0)/.test(
          text
        )
      ) {
        whitePageEvents.push({
          type: 'console',
          message: text,
          timestamp: Date.now(),
        });
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
    await page.waitForTimeout(2000);

    // Test navigation sequence that previously caused white pages
    const problematicSequence = [
      'chapter_001.xhtml',
      'prev', // This used to cause white pages
      'prev', // Multiple prev operations
      'next',
      'chapter_002.xhtml',
      'prev',
      'chapter_001.xhtml',
    ];

    for (const action of problematicSequence) {
      if (action.endsWith('.xhtml')) {
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

      await page.waitForTimeout(1200);

      // Verify no white page after each step
      const stepCheck = await page.evaluate((stepAction) => {
        const container =
          document.getElementById('viewer') ||
          document.querySelector('[data-epub-viewer]');
        if (!container)
          return { error: `No container found after ${stepAction}` };

        const iframe = container.querySelector('iframe');
        if (!iframe) return { error: `No iframe found after ${stepAction}` };

        const isVisible = iframe.offsetWidth > 0 && iframe.offsetHeight > 0;

        return {
          action: stepAction,
          hasIframe: true,
          iframeVisible: isVisible,
          passed: isVisible,
        };
      }, action);

      expect(stepCheck.hasIframe).toBe(true);
      expect(stepCheck.iframeVisible).toBe(true);
      expect(stepCheck.passed).toBe(true);
    }

    // Final check: ensure no white page events occurred
    const criticalWhitePageEvents = whitePageEvents.filter(
      (event) =>
        event.message.includes('white page detected') ||
        event.message.includes('empty content fallback')
    );

    expect(criticalWhitePageEvents).toEqual([]);
  });
});
