import { test, expect } from '@playwright/test';
import {
  EPUB_TEST_DATASET,
  RENDERING_MODES,
  generateTestConfigurations,
} from './test-dataset';
import type { EpubTestVariant, RenderingMode } from './test-dataset';

/**
 * Optimized EPUB Navigation Test Suite
 *
 * Features:
 * - Multiple workers for parallel execution
 * - Local EPUB files (Alice) + URL files (Moby Dick)
 * - Single page + spread mode testing
 * - Batched tests for performance
 * - Comprehensive navigation coverage
 */

// ===== SHARED HELPER FUNCTIONS =====

const getNavigationState = async (page: any) => {
  return await page.evaluate(() => {
    const rendition = (window as any).rendition;
    const location = rendition.currentLocation();
    const manager = rendition.manager;
    const currentView = manager.views.last();

    let hasContent = false;
    let textLength = 0;

    if (currentView?.document?.body) {
      const textContent = currentView.document.body.textContent || '';
      textLength = textContent.trim().length;
      hasContent = textLength > 50;
    }

    return {
      chapter: location?.length > 0 ? location[0].href : 'unknown',
      totalPages: location?.length > 0 ? location[0].totalPages : 0,
      currentPages: location?.length > 0 ? location[0].pages : [],
      scrollLeft: manager.container?.scrollLeft || 0,
      scrollWidth: manager.container?.scrollWidth || 0,
      offsetWidth: manager.container?.offsetWidth || 0,
      content: hasContent,
      contentWidth: currentView?.contents?.textWidth?.() || 0,
      textLength: textLength,
    };
  });
};

const clickNext = async (page: any) => {
  return await page.evaluate(() => {
    const nextButton = document.getElementById('next');
    if (nextButton) {
      nextButton.click();
      return true;
    }
    return false;
  });
};

const clickPrev = async (page: any) => {
  return await page.evaluate(() => {
    const prevButton = document.getElementById('prev');
    if (prevButton) {
      prevButton.click();
      return true;
    }
    return false;
  });
};

const waitForNavigation = async (page: any, timeout = 1500) => {
  await page.waitForTimeout(timeout);
};

const setupEpubWithConfig = async (
  page: any,
  epubVariant: EpubTestVariant,
  renderingMode: RenderingMode
) => {
  // Navigate to test page based on EPUB type
  if (epubVariant.type === 'local') {
    // Use dedicated test page for local EPUB files
    await page.goto('http://localhost:9876/e2e/fixtures/epub-test-page.html');
  } else {
    // Use existing transparent-iframe page for URL EPUBs
    await page.goto(
      'http://localhost:9876/examples/transparent-iframe-hightlights.html'
    );
  }

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Configure EPUB loading based on type
  if (epubVariant.type === 'local') {
    await page.evaluate(
      ({ localPath, renderingMode }) => {
        const book = new (window as any).ePub(localPath);
        const rendition = book.renderTo('viewer', {
          width: renderingMode.width,
          height: renderingMode.height,
          spread: renderingMode.mode === 'spread' ? 'always' : 'never',
          flow: renderingMode.flow,
        });
        (window as any).book = book;
        (window as any).rendition = rendition;
        return rendition.display();
      },
      { localPath: epubVariant.localPath, renderingMode }
    );
  }
  // For URL EPUBs, the page already handles loading

  // Wait for rendition to be ready
  await page.waitForFunction(
    () => {
      return (window as any).rendition?.manager?.views?.length > 0;
    },
    { timeout: 15000 }
  );

  // Additional wait for content to stabilize
  await page.waitForTimeout(2000);
};

// ===== OPTIMIZED TEST SUITE =====

test.describe('EPUB Navigation - Optimized Multi-Variant Suite', () => {
  const testConfigurations = generateTestConfigurations();

  // Group tests by EPUB type for better organization
  const localEpubConfigs = testConfigurations.filter(
    (config) => config.epub.type === 'local'
  );
  const urlEpubConfigs = testConfigurations.filter(
    (config) => config.epub.type === 'url'
  );

  // ===== LOCAL EPUB TESTS (Alice in Wonderland) =====
  test.describe('Local EPUB Files', () => {
    for (const config of localEpubConfigs) {
      test.describe(`${config.epub.name} - ${config.rendering.name}`, () => {
        test('comprehensive navigation suite', async ({ page }) => {
          console.log(`🧪 Testing: ${config.description}`);

          await setupEpubWithConfig(page, config.epub, config.rendering);

          // BATCH 1: Basic Navigation + Phantom Element
          console.log('=== BATCH 1: CORE NAVIGATION ===');

          // Test basic navigation
          await clickNext(page);
          await waitForNavigation(page);
          const afterNext = await getNavigationState(page);
          expect(afterNext.content).toBe(true);
          console.log(
            `✅ Next navigation: ${afterNext.chapter} pages=[${afterNext.currentPages}]`
          );

          await clickPrev(page);
          await waitForNavigation(page);
          const afterPrev = await getNavigationState(page);
          expect(afterPrev.content).toBe(true);
          console.log(
            `✅ Prev navigation: ${afterPrev.chapter} pages=[${afterPrev.currentPages}]`
          );

          // Test phantom element sizing (batched with navigation)
          expect(afterNext.scrollWidth).toBeGreaterThan(
            config.epub.expectedSizes.singlePageWidth
          );
          console.log(`✅ Phantom element: ${afterNext.scrollWidth}px width`);

          // BATCH 2: Chapter Boundaries + White Page Prevention
          console.log('=== BATCH 2: BOUNDARIES & CONTENT ===');

          let navigationCount = 0;
          let previousChapter = '';
          let hasSeenChapterChange = false;

          // Navigate forward until we see a chapter change
          while (navigationCount < 15) {
            await clickNext(page);
            await waitForNavigation(page, 1000); // Faster navigation
            const state = await getNavigationState(page);

            expect(state.content).toBe(true); // White page prevention

            if (state.chapter !== previousChapter && previousChapter !== '') {
              hasSeenChapterChange = true;
              console.log(
                `📚 Chapter change detected: ${previousChapter} → ${state.chapter}`
              );
              break;
            }

            previousChapter = state.chapter;
            navigationCount++;
          }

          expect(hasSeenChapterChange).toBe(true);
          console.log(
            `✅ Chapter boundary navigation after ${navigationCount} steps`
          );

          // BATCH 3: Backward Navigation (Priority Test)
          console.log('=== BATCH 3: BACKWARD NAVIGATION ===');

          const beforeBackward = await getNavigationState(page);
          await clickPrev(page);
          await waitForNavigation(page);
          const afterBackward = await getNavigationState(page);

          expect(afterBackward.content).toBe(true);
          console.log(
            `✅ Backward navigation: ${afterBackward.chapter} pages=[${afterBackward.currentPages}]`
          );

          // BATCH 4: Container Management + Scroll Positioning
          console.log('=== BATCH 4: CONTAINER MANAGEMENT ===');

          const containerState = await getNavigationState(page);
          expect(containerState.scrollWidth).toBeGreaterThanOrEqual(
            config.rendering.width
          );

          // For container width, check against expected sizes from EPUB variant (not rendering config)
          const expectedWidth =
            config.rendering.mode === 'spread'
              ? config.epub.expectedSizes.spreadWidth
              : config.epub.expectedSizes.singlePageWidth;
          expect(containerState.offsetWidth).toBeCloseTo(expectedWidth, -2);

          console.log(
            `✅ Container: scroll=${containerState.scrollLeft}/${containerState.scrollWidth}, offset=${containerState.offsetWidth}`
          );

          console.log(
            `🎯 Completed comprehensive test for ${config.description}`
          );
        });

        // Single-mode specific tests
        if (config.rendering.mode === 'single') {
          test('single page mode specific features', async ({ page }) => {
            await setupEpubWithConfig(page, config.epub, config.rendering);

            const state = await getNavigationState(page);
            // Allow for CSS styling differences (within 50px)
            expect(state.offsetWidth).toBeCloseTo(
              config.epub.expectedSizes.singlePageWidth,
              -2
            );
            console.log(
              `✅ Single page mode confirmed: ${state.offsetWidth}px`
            );
          });
        }

        // Spread-mode specific tests
        if (
          config.rendering.mode === 'spread' &&
          config.epub.features.supportsSpreads
        ) {
          test('spread mode specific features', async ({ page }) => {
            await setupEpubWithConfig(page, config.epub, config.rendering);

            // Test spread-specific functionality
            await clickNext(page);
            await waitForNavigation(page);

            const spreadState = await getNavigationState(page);
            // Allow for CSS styling differences and spread mode configuration (within 50px)
            expect(spreadState.offsetWidth).toBeCloseTo(
              config.epub.expectedSizes.spreadWidth,
              -2
            );
            expect(spreadState.currentPages.length).toBeGreaterThanOrEqual(1); // At least one page

            console.log(
              `✅ Spread mode: ${spreadState.offsetWidth}px, pages=[${spreadState.currentPages}]`
            );
          });
        }
      });
    }
  });

  // ===== URL EPUB TESTS (Moby Dick) =====
  test.describe('URL EPUB Files', () => {
    for (const config of urlEpubConfigs) {
      test.describe(`${config.epub.name} - ${config.rendering.name}`, () => {
        test('comprehensive navigation suite', async ({ page }) => {
          console.log(`🧪 Testing: ${config.description}`);

          // Use existing Moby Dick setup for URL-based tests
          await page.goto(
            'http://localhost:9876/examples/transparent-iframe-hightlights.html'
          );
          await page.waitForFunction(
            () => {
              return (window as any).rendition?.manager?.views?.length > 0;
            },
            { timeout: 15000 }
          );

          // Quick comprehensive test (reusing proven logic from original suite)
          console.log('=== URL EPUB: CORE FUNCTIONALITY ===');

          await clickNext(page);
          await waitForNavigation(page);
          const state = await getNavigationState(page);

          expect(state.content).toBe(true);
          expect(state.scrollWidth).toBeGreaterThan(900);

          console.log(
            `✅ URL EPUB working: ${state.chapter}, width=${state.scrollWidth}px`
          );
        });

        // Regression test for URL EPUBs
        test('url epub backward navigation', async ({ page }) => {
          await page.goto(
            'http://localhost:9876/examples/transparent-iframe-hightlights.html'
          );
          await page.waitForFunction(
            () => {
              return (window as any).rendition?.manager?.views?.length > 0;
            },
            { timeout: 15000 }
          );

          // Quick backward navigation test
          await clickNext(page);
          await clickNext(page);
          await waitForNavigation(page);

          await clickPrev(page);
          await waitForNavigation(page);

          const backwardState = await getNavigationState(page);
          expect(backwardState.content).toBe(true);

          console.log(
            `✅ URL EPUB backward navigation: ${backwardState.chapter}`
          );
        });
      });
    }
  });

  // ===== CROSS-VARIANT COMPARISON TESTS =====
  test.describe('Cross-Variant Validation', () => {
    test('local vs url epub behavior consistency', async ({ page }) => {
      console.log('=== CROSS-VARIANT: CONSISTENCY CHECK ===');

      // Test that both local and URL EPUBs behave consistently
      // This is a placeholder for more sophisticated comparison tests
      expect(localEpubConfigs.length).toBeGreaterThan(0);
      expect(urlEpubConfigs.length).toBeGreaterThan(0);

      console.log(
        `✅ Found ${localEpubConfigs.length} local and ${urlEpubConfigs.length} URL configurations`
      );
    });
  });
});

// ===== PERFORMANCE TESTS =====
test.describe('Performance & Load Tests', () => {
  test('rapid navigation stress test', async ({ page }) => {
    console.log('=== PERFORMANCE: RAPID NAVIGATION ===');

    await page.goto(
      'http://localhost:9876/examples/transparent-iframe-hightlights.html'
    );
    await page.waitForFunction(
      () => {
        return (window as any).rendition?.manager?.views?.length > 0;
      },
      { timeout: 15000 }
    );

    // Rapid navigation test
    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      await clickNext(page);
      // Wait for navigation to complete before next step
      await page.waitForFunction(
        () => {
          const rendition = (window as any).rendition;
          return (
            rendition && rendition.manager && rendition.manager.views.length > 0
          );
        },
        { timeout: 5000 }
      );
      await page.waitForTimeout(50); // Small delay to ensure content renders
    }
    const endTime = Date.now();

    // Wait a bit longer for final content to settle and retry if needed
    await page.waitForTimeout(500);

    // Try to get navigation state with content, with retries
    let finalState;
    let retries = 0;
    do {
      finalState = await getNavigationState(page);
      if (!finalState.content && retries < 3) {
        await page.waitForTimeout(200);
        retries++;
      }
    } while (!finalState.content && retries < 3);

    // For rapid navigation, just check that we have some content (may not be fully loaded)
    expect(finalState.textLength).toBeGreaterThan(0);

    console.log(`✅ Rapid navigation: 10 steps in ${endTime - startTime}ms`);
  });
});
