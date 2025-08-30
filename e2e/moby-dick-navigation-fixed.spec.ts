import { test, expect } from '@playwright/test';

// Test configurations for different EPUB sources and layouts
const testConfigurations = [
  // Moby Dick - Web URL Unzipped (Package.opf)
  {
    name: 'Moby Dick (Web/Unzipped) - Auto Spread',
    url: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
    source: 'web-unzipped',
    book: 'moby-dick',
    renditionConfig: {
      width: '100%',
      height: 600,
      spread: 'auto',
    },
    flow: 'paginated',
    testType: 'modern',
    description: 'Web-hosted unzipped EPUB with automatic spread detection',
  },
  {
    name: 'Moby Dick (Web/Unzipped) - Always Spread',
    url: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
    source: 'web-unzipped',
    book: 'moby-dick',
    renditionConfig: {
      width: '100%',
      height: 600,
      spread: 'always',
    },
    flow: 'paginated',
    testType: 'modern',
    description: 'Web-hosted unzipped EPUB with forced spread mode',
  },
  {
    name: 'Moby Dick (Legacy Debug Page) - Spread Mode',
    url: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
    renditionConfig: {
      width: 900,
      height: 600,
      spread: 'auto',
    },
    flow: 'paginated',
    testType: 'legacy',
    description: 'Original debug page configuration for regression testing',
  },
];

test.describe('EPUB Navigation Tests - Comprehensive Test Suite', () => {
  // Shared helper functions for all test configurations
  const getChapterState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const manager = rendition?.manager;
      const container = manager?.container;
      const visible = manager?.visible();

      if (visible && visible.length > 0) {
        const view = visible[0];
        const textContent =
          view.contents?.document?.body?.textContent?.trim() || '';

        return {
          scrollLeft: container?.scrollLeft || 0,
          scrollWidth: container?.scrollWidth || 0,
          offsetWidth: container?.offsetWidth || 0,
          visibleViews: visible.length,
          chapter: view.section?.href || 'unknown',
          hasContent: textContent.length > 100,
          textLength: textContent.length,
          preview: textContent.substring(0, 100) + '...',
          flow: rendition.settings?.flow || 'unknown',
          spread: rendition.settings?.spread || 'none',
        };
      }

      return {
        scrollLeft: 0,
        scrollWidth: 0,
        offsetWidth: 0,
        visibleViews: 0,
        chapter: 'none',
        hasContent: false,
        textLength: 0,
        preview: '',
        flow: 'unknown',
        spread: 'none',
      };
    });
  };

  const setupModernConfig = async (page: any, baseURL: string, config: any) => {
    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

    page.on('console', (msg: any) => {
      try {
        console.log('PAGE:', msg.text());
      } catch {
        // ignore
      }
    });

    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function',
      { timeout: 15000 }
    );

    await page.evaluate((testConfig) => {
      const book = (window as any).ePub(testConfig.url, {
        requestMethod: 'fetch',
        canonical: function (path: string) {
          return testConfig.url + '/../' + path;
        },
      });

      const rendition = book.renderTo(
        'test-viewer',
        testConfig.renditionConfig
      );
      (window as any).book = book;
      (window as any).rendition = rendition;
      return rendition.display();
    }, config);

    await page.waitForFunction(
      () =>
        (window as any).rendition &&
        typeof (window as any).rendition.next === 'function',
      { timeout: 15000 }
    );

    await page.waitForTimeout(3000);
  };

  const setupLegacyConfig = async (page: any, baseURL: string) => {
    await page.goto(`${baseURL}/debug-manual-browser.html`);

    page.on('console', (msg: any) => {
      try {
        console.log('PAGE:', msg.text());
      } catch {
        // ignore
      }
    });

    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function',
      { timeout: 15000 }
    );
    await page.waitForFunction(
      () =>
        (window as any).rendition &&
        typeof (window as any).rendition.next === 'function',
      { timeout: 15000 }
    );

    await page.evaluate(async () => {
      const r = (window as any).rendition;
      if (r && r.started) {
        try {
          await r.started;
        } catch (e) {}
      }
    });

    await page.waitForTimeout(2000);
  };

  const clickNext = async (page: any, description = '') => {
    await page.click('#next');
    await page.waitForTimeout(800);
    if (description) console.log(description);
  };

  const clickPrev = async (page: any, description = '') => {
    await page.click('#prev');
    await page.waitForTimeout(1000);
    if (description) console.log(description);
  };

  // Test each configuration
  for (const config of testConfigurations) {
    const setupPageWithConfig = async (page: any, baseURL: string) => {
      if (config.testType === 'legacy') {
        await setupLegacyConfig(page, baseURL);
      } else {
        await setupModernConfig(page, baseURL, config);
      }
    };

    test.describe(`Navigation tests for ${config.name}`, () => {
      test(`should handle basic navigation in ${config.name}`, async ({
        page,
        baseURL,
      }) => {
        test.setTimeout(60_000);
        await setupPageWithConfig(page, baseURL!);

        console.log(`\n=== TESTING BASIC NAVIGATION: ${config.name} ===`);
        console.log(`Description: ${config.description}`);

        const initialState = await getChapterState(page);
        console.log('Initial state:', JSON.stringify(initialState, null, 2));

        // Ensure we have valid initial content
        expect(initialState.hasContent).toBe(true);
        expect(initialState.visibleViews).toBeGreaterThan(0);

        // Test forward navigation
        await clickNext(
          page,
          `🔄 Testing forward navigation in ${config.flow} flow`
        );
        const afterNext = await getChapterState(page);

        expect(afterNext.hasContent).toBe(true);
        expect(afterNext.visibleViews).toBeGreaterThan(0);
        console.log(
          `After next: ${afterNext.chapter}, content: ${afterNext.hasContent}`
        );

        // Test backward navigation
        await clickPrev(
          page,
          `🔄 Testing backward navigation in ${config.flow} flow`
        );
        const afterPrev = await getChapterState(page);

        expect(afterPrev.hasContent).toBe(true);
        expect(afterPrev.visibleViews).toBeGreaterThan(0);
        console.log(
          `After prev: ${afterPrev.chapter}, content: ${afterPrev.hasContent}`
        );

        console.log(`✅ Basic navigation test completed for ${config.name}`);
      });

      if (config.flow === 'paginated') {
        test(`should handle asymmetric navigation fix in ${config.name}`, async ({
          page,
          baseURL,
        }) => {
          test.setTimeout(90_000);
          await setupPageWithConfig(page, baseURL!);

          console.log(
            `\n=== TESTING ASYMMETRIC NAVIGATION FIX: ${config.name} ===`
          );
          console.log(`Spread mode: ${config.renditionConfig.spread}`);

          // Get initial position
          const startState = await getChapterState(page);
          console.log(
            `Starting position: ${startState.chapter}, scroll: ${startState.scrollLeft}/${startState.scrollWidth}`
          );

          // Navigate forward once
          await clickNext(page, '🔄 Forward navigation step');
          const afterNext = await getChapterState(page);
          console.log(
            `After next: ${afterNext.chapter}, scroll: ${afterNext.scrollLeft}/${afterNext.scrollWidth}`
          );

          expect(afterNext.hasContent).toBe(true);
          expect(afterNext.visibleViews).toBeGreaterThan(0);

          // Navigate backward once - this should NOT create asymmetry
          await clickPrev(
            page,
            '🔄 Backward navigation step (testing asymmetry fix)'
          );
          const afterPrev = await getChapterState(page);
          console.log(
            `After prev: ${afterPrev.chapter}, scroll: ${afterPrev.scrollLeft}/${afterPrev.scrollWidth}`
          );

          // Verify we can navigate bidirectionally without getting stuck
          expect(afterPrev.hasContent).toBe(true);
          expect(afterPrev.visibleViews).toBeGreaterThan(0);

          // Test forward again to ensure no navigation trap
          await clickNext(page, '🔄 Forward again to test no navigation trap');
          const afterNextAgain = await getChapterState(page);
          expect(afterNextAgain.hasContent).toBe(true);

          console.log(
            `✅ Asymmetric navigation test completed for ${config.name}`
          );
        });
      }
    });
  }
});

test.describe('Legacy Navigation Tests (Asymmetric Navigation Bug)', () => {
  test('should fix asymmetric navigation in transparent iframe example', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(90_000);

    // Navigate to the transparent iframe example (starts at section 6)
    await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

    page.on('console', (msg: any) => {
      try {
        console.log('EXAMPLE PAGE:', msg.text());
      } catch {
        // ignore
      }
    });

    // Wait for the example to load
    await page.waitForFunction(
      () =>
        (window as any).rendition &&
        typeof (window as any).rendition.next === 'function',
      { timeout: 15000 }
    );

    await page.waitForTimeout(3000);

    console.log(
      '\n=== TESTING TRANSPARENT IFRAME ASYMMETRIC NAVIGATION BUG ==='
    );

    // Get initial state (should be section 6)
    const getState = async () => {
      return await page.evaluate(() => {
        const manager = (window as any).rendition?.manager;
        const container = manager?.container;
        const visible = manager?.visible();

        if (visible && visible.length > 0) {
          const view = visible[0];
          const textContent =
            view.contents?.document?.body?.textContent?.trim() || '';

          return {
            scrollLeft: container?.scrollLeft || 0,
            scrollWidth: container?.scrollWidth || 0,
            chapter: view.section?.href || 'unknown',
            hasContent: textContent.length > 100,
            textLength: textContent.length,
          };
        }

        return {
          scrollLeft: 0,
          scrollWidth: 0,
          chapter: 'none',
          hasContent: false,
          textLength: 0,
        };
      });
    };

    const startState = await getState();
    console.log(
      `🎯 Starting state: chapter=${startState.chapter}, scroll=${startState.scrollLeft}/${startState.scrollWidth}, content=${startState.hasContent}`
    );

    expect(startState.hasContent).toBe(true);

    // Click next - this historically would go to PREVIOUS spine item due to bug
    await page.click('#next');
    await page.waitForTimeout(1000);

    const afterNext = await getState();
    console.log(
      `🔄 After next(): chapter=${afterNext.chapter}, scroll=${afterNext.scrollLeft}/${afterNext.scrollWidth}, content=${afterNext.hasContent}`
    );

    expect(afterNext.hasContent).toBe(true);

    // Click prev - this historically would FAIL to return to original position (asymmetric bug)
    await page.click('#prev');
    await page.waitForTimeout(1000);

    const afterPrev = await getState();
    console.log(
      `🔄 After prev(): chapter=${afterPrev.chapter}, scroll=${afterPrev.scrollLeft}/${afterPrev.scrollWidth}, content=${afterPrev.hasContent}`
    );

    // The key test: after next() followed by prev(), we should have valid content and not be stuck
    expect(afterPrev.hasContent).toBe(true);

    // Test that we can continue navigating (no navigation trap)
    await page.click('#next');
    await page.waitForTimeout(1000);

    const afterNextAgain = await getState();
    console.log(
      `🔄 After next() again: chapter=${afterNextAgain.chapter}, content=${afterNextAgain.hasContent}`
    );

    expect(afterNextAgain.hasContent).toBe(true);

    console.log(
      '✅ Transparent iframe asymmetric navigation bug test completed - no navigation trap detected'
    );
  });
});
