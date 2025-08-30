import { test, expect } from '@playwright/test';

test.describe('EPUB Navigation - Consolidated Regression Prevention Suite', () => {
  const setupEpub = async (page: any) => {
    await page.goto(
      'http://localhost:8080/examples/transparent-iframe-hightlights.html'
    );
    await page.waitForFunction(
      () => {
        return (
          (window as any).rendition &&
          (window as any).rendition.manager &&
          (window as any).rendition.manager.views &&
          (window as any).rendition.manager.views.length > 0
        );
      },
      { timeout: 10000 }
    );
    await page.waitForTimeout(2000); // Let content fully load
  };

  const clickNext = async (page: any) => {
    await page.evaluate(() => {
      document.getElementById('next')?.click();
    });
    await page.waitForTimeout(1000);
  };

  const clickPrev = async (page: any) => {
    await page.evaluate(() => {
      document.getElementById('prev')?.click();
    });
    await page.waitForTimeout(1000);
  };

  const getNavigationState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const container = manager.container;
      const currentView = manager.views.last();

      return {
        chapter: location?.[0]?.href || 'unknown',
        pages: location?.[0]?.pages || [],
        totalPages: location?.[0]?.totalPages || 0,
        scrollLeft: container.scrollLeft,
        scrollWidth: container.scrollWidth,
        offsetWidth: container.offsetWidth,
        contentWidth: currentView?.contents?.textWidth?.() || 0,
        hasContent: !!currentView?.document?.body?.textContent?.trim(),
        contentLength:
          currentView?.document?.body?.textContent?.trim()?.length || 0,
      };
    });
  };

  // COMPREHENSIVE REGRESSION TEST - Run this before any navigation changes
  test('Navigation Regression Prevention - All Known Issues', async ({
    page,
  }) => {
    await setupEpub(page);
    console.log('=== NAVIGATION REGRESSION PREVENTION SUITE ===');

    const issues = {
      whitePages: false,
      invalidPageNumbers: false,
      chapterSkipping: false,
      infiniteLoop: false,
      contentPositioning: false,
    };

    let clickCount = 0;
    const MAX_CLICKS = 20;
    let lastState = null;
    let sameStateCount = 0;
    let chapterTransitions = 0;
    let sameChapterClicks = 0;
    let currentChapter = '';

    while (clickCount < MAX_CLICKS) {
      const state = await getNavigationState(page);

      console.log(
        `Click ${clickCount}: ${state.chapter} pages=[${state.pages}]/${state.totalPages} scroll=${state.scrollLeft}/${state.scrollWidth} content=${state.hasContent}`
      );

      // Issue 1: White pages (no content visible)
      if (!state.hasContent || state.contentLength === 0) {
        issues.whitePages = true;
        console.error(`🚨 WHITE PAGE DETECTED at click ${clickCount}`);
      }

      // Issue 2: Invalid page numbers (pages > totalPages)
      if (state.pages.length > 0 && state.totalPages > 0) {
        const maxPage = Math.max(...state.pages);
        if (maxPage > state.totalPages) {
          issues.invalidPageNumbers = true;
          console.error(
            `🚨 INVALID PAGE NUMBERS: page ${maxPage} > ${state.totalPages} total`
          );
        }
      }

      // Issue 3: Chapter skipping without intra-chapter navigation
      if (state.chapter !== currentChapter) {
        if (
          currentChapter &&
          !currentChapter.includes('unknown') &&
          sameChapterClicks < 2
        ) {
          issues.chapterSkipping = true;
          console.error(
            `🚨 CHAPTER SKIPPING: only ${sameChapterClicks} clicks in ${currentChapter}`
          );
        }

        currentChapter = state.chapter;
        chapterTransitions++;
        sameChapterClicks = 1;
      } else {
        sameChapterClicks++;
      }

      // Issue 4: Infinite loops (same state repeated)
      if (lastState && JSON.stringify(state) === JSON.stringify(lastState)) {
        sameStateCount++;
        if (sameStateCount > 3) {
          issues.infiniteLoop = true;
          console.error(`🚨 INFINITE LOOP: same state ${sameStateCount} times`);
          break;
        }
      } else {
        sameStateCount = 0;
      }

      // Issue 5: Content positioning (scrollWidth should expand with content)
      if (
        state.contentWidth > state.offsetWidth &&
        state.scrollWidth <= state.offsetWidth
      ) {
        issues.contentPositioning = true;
        console.error(
          `🚨 CONTENT POSITIONING: contentWidth=${state.contentWidth} but scrollWidth=${state.scrollWidth}`
        );
      }

      lastState = state;
      await clickNext(page);
      clickCount++;

      // Stop at reasonable depth
      if (chapterTransitions >= 3) break;
    }

    // Report all detected issues
    console.log('\n=== REGRESSION TEST RESULTS ===');
    console.log(
      `White pages: ${issues.whitePages ? '❌ FAILED' : '✅ PASSED'}`
    );
    console.log(
      `Invalid page numbers: ${issues.invalidPageNumbers ? '❌ FAILED' : '✅ PASSED'}`
    );
    console.log(
      `Chapter skipping: ${issues.chapterSkipping ? '❌ FAILED' : '✅ PASSED'}`
    );
    console.log(
      `Infinite loops: ${issues.infiniteLoop ? '❌ FAILED' : '✅ PASSED'}`
    );
    console.log(
      `Content positioning: ${issues.contentPositioning ? '❌ FAILED' : '✅ PASSED'}`
    );

    // Fail test if any issues detected
    expect(issues.whitePages).toBe(false);
    expect(issues.invalidPageNumbers).toBe(false);
    expect(issues.chapterSkipping).toBe(false);
    expect(issues.infiniteLoop).toBe(false);
    expect(issues.contentPositioning).toBe(false);

    console.log('✅ ALL NAVIGATION REGRESSION TESTS PASSED');
  });

  // Test bidirectional navigation
  test('Bidirectional Navigation Works', async ({ page }) => {
    await setupEpub(page);
    console.log('=== BIDIRECTIONAL NAVIGATION TEST ===');

    // Go forward a few times
    await clickNext(page);
    await clickNext(page);
    const forwardState = await getNavigationState(page);
    console.log(
      `Forward: ${forwardState.chapter} pages=[${forwardState.pages}]`
    );

    // Go back
    await clickPrev(page);
    const backState = await getNavigationState(page);
    console.log(`Back: ${backState.chapter} pages=[${backState.pages}]`);

    // Must have content after going back
    expect(backState.hasContent).toBe(true);
    expect(backState.contentLength).toBeGreaterThan(0);

    console.log('✅ Bidirectional navigation test passed');
  });
});

// Export this as the standard navigation test suite
// Run this before any navigation changes to prevent regressions
