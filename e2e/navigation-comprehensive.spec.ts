import { test, expect } from '@playwright/test';

test.describe('EPUB Navigation - Comprehensive Edge Cases Test Suite', () => {
  // Helper functions
  const getDetailedState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const currentView = manager.views.last();
      const hasContent =
        currentView &&
        currentView.document &&
        currentView.document.body &&
        currentView.document.body.textContent.trim().length > 0;

      return {
        // Chapter info
        chapter: location && location.length > 0 ? location[0].href : 'unknown',
        totalPages:
          location && location.length > 0 ? location[0].totalPages : 0,
        currentPages: location && location.length > 0 ? location[0].pages : [],

        // Scroll info
        scrollLeft: manager.container ? manager.container.scrollLeft : 0,
        scrollWidth: manager.container ? manager.container.scrollWidth : 0,
        offsetWidth: manager.container ? manager.container.offsetWidth : 0,

        // Content validation
        content: hasContent,
        contentWidth: currentView?.contents?.textWidth?.() || 0,

        // Navigation state
        layoutDelta: manager.layout?.delta || 0,
        canScrollNext: manager.container
          ? manager.container.scrollLeft +
              manager.container.offsetWidth +
              manager.layout.delta <=
            manager.container.scrollWidth
          : false,
      };
    });
  };

  const clickNext = async (page: any) => {
    return await page.evaluate(() => {
      const nextButton = document.getElementById('next');
      if (nextButton) {
        console.log(
          'MANUAL: next() clicked, current scrollLeft:',
          (window as any).rendition?.manager?.container?.scrollLeft || 0
        );
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
        console.log(
          'MANUAL: prev() clicked, current scrollLeft:',
          (window as any).rendition?.manager?.container?.scrollLeft || 0
        );
        prevButton.click();
        return true;
      }
      return false;
    });
  };

  const waitForNavigation = async (page: any, timeout = 2000) => {
    await page.waitForTimeout(timeout);
  };

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
  };

  // Test 1: White page detection
  test('should never show white pages (content beyond totalPages)', async ({
    page,
  }) => {
    await setupEpub(page);
    console.log('=== TEST 1: WHITE PAGE DETECTION ===');

    let clickCount = 0;
    const MAX_CLICKS = 15;

    while (clickCount < MAX_CLICKS) {
      await clickNext(page);
      await waitForNavigation(page);

      const state = await getDetailedState(page);
      console.log(
        `Click ${clickCount + 1}: ${state.chapter} pages=[${state.currentPages}] total=${state.totalPages} content=${state.content}`
      );

      // Critical: Never show white pages
      expect(state.content).toBe(true);

      // Critical: Never show pages beyond totalPages
      if (state.currentPages.length > 0 && state.totalPages > 0) {
        const maxDisplayedPage = Math.max(...state.currentPages);
        expect(maxDisplayedPage).toBeLessThanOrEqual(state.totalPages);
        if (maxDisplayedPage > state.totalPages) {
          console.error(
            `🚨 WHITE PAGE DETECTED: showing page ${maxDisplayedPage} of ${state.totalPages} total pages`
          );
        }
      }

      clickCount++;

      // Stop if we reach a reasonable chapter depth
      if (
        state.chapter.includes('chapter_003') ||
        state.chapter.includes('chapter_004')
      ) {
        break;
      }
    }

    console.log('✅ White page test completed');
  });

  // Test 2: Intra-chapter navigation before chapter jumps
  test('should navigate within chapters before jumping to next chapter', async ({
    page,
  }) => {
    await setupEpub(page);
    console.log('=== TEST 2: INTRA-CHAPTER NAVIGATION ===');

    const startState = await getDetailedState(page);
    console.log(
      `Starting: ${startState.chapter} pages=[${startState.currentPages}] scroll=${startState.scrollLeft}/${startState.scrollWidth}`
    );

    let currentChapter = startState.chapter;
    let sameChapterScrolls = 0;
    let totalClicks = 0;

    for (let i = 0; i < 10; i++) {
      await clickNext(page);
      await waitForNavigation(page);

      const state = await getDetailedState(page);
      console.log(
        `Click ${i + 1}: ${state.chapter} pages=[${state.currentPages}] scroll=${state.scrollLeft}/${state.scrollWidth} canScrollNext=${state.canScrollNext}`
      );

      expect(state.content).toBe(true);

      if (state.chapter === currentChapter) {
        sameChapterScrolls++;
        // Verify we're actually scrolling within the chapter (scroll position should change)
        if (sameChapterScrolls > 1) {
          expect(state.scrollLeft).toBeGreaterThan(0);
        }
      } else {
        console.log(
          `📚 Chapter transition: ${currentChapter} → ${state.chapter} after ${sameChapterScrolls} intra-chapter scrolls`
        );

        // We should scroll within chapters before jumping (except for very short chapters)
        if (i > 0 && !currentChapter.includes('epigraph')) {
          expect(sameChapterScrolls).toBeGreaterThan(0);
        }

        currentChapter = state.chapter;
        sameChapterScrolls = 0;
      }

      totalClicks++;
    }

    console.log(
      `✅ Intra-chapter navigation test completed. Total clicks: ${totalClicks}`
    );
  });

  // Test 3: Bidirectional navigation symmetry
  test('should handle prev() navigation correctly (go to end of previous chapter)', async ({
    page,
  }) => {
    await setupEpub(page);
    console.log('=== TEST 3: BIDIRECTIONAL NAVIGATION ===');

    // Navigate forward to chapter 2
    await clickNext(page);
    await waitForNavigation(page);
    await clickNext(page);
    await waitForNavigation(page);

    const beforePrevState = await getDetailedState(page);
    console.log(
      `Before prev(): ${beforePrevState.chapter} pages=[${beforePrevState.currentPages}] scroll=${beforePrevState.scrollLeft}`
    );

    // Go back one
    await clickPrev(page);
    await waitForNavigation(page, 3000); // Give more time for complex navigation

    const afterPrevState = await getDetailedState(page);
    console.log(
      `After prev(): ${afterPrevState.chapter} pages=[${afterPrevState.currentPages}] scroll=${afterPrevState.scrollLeft}`
    );

    expect(afterPrevState.content).toBe(true);

    // If we changed chapters, we should be at the END of the previous chapter, not the beginning
    if (afterPrevState.chapter !== beforePrevState.chapter) {
      console.log(
        `📚 Went back to previous chapter: ${afterPrevState.chapter}`
      );

      // Should be showing the last pages of the chapter, not the first
      if (
        afterPrevState.currentPages.length > 0 &&
        afterPrevState.totalPages > 1
      ) {
        const minDisplayedPage = Math.min(...afterPrevState.currentPages);
        expect(minDisplayedPage).toBeGreaterThan(1); // Should NOT be at page 1 (beginning)
        console.log(
          `✅ Correctly positioned at end of previous chapter (page ${minDisplayedPage}+)`
        );
      }
    }

    console.log('✅ Bidirectional navigation test completed');
  });

  // Test 4: Container scroll width expansion
  test('should properly expand container scrollWidth for content', async ({
    page,
  }) => {
    await setupEpub(page);
    console.log('=== TEST 4: CONTAINER SCROLL EXPANSION ===');

    const initialState = await getDetailedState(page);
    console.log(
      `Initial: scrollWidth=${initialState.scrollWidth} offsetWidth=${initialState.offsetWidth} contentWidth=${initialState.contentWidth}`
    );

    // After first click, container should expand if needed
    await clickNext(page);
    await waitForNavigation(page);

    const afterClickState = await getDetailedState(page);
    console.log(
      `After click: scrollWidth=${afterClickState.scrollWidth} offsetWidth=${afterClickState.offsetWidth} contentWidth=${afterClickState.contentWidth}`
    );

    // If content is wider than container, scrollWidth should be expanded
    if (afterClickState.contentWidth > afterClickState.offsetWidth) {
      expect(afterClickState.scrollWidth).toBeGreaterThan(
        afterClickState.offsetWidth
      );
      expect(afterClickState.scrollWidth).toBeGreaterThanOrEqual(
        afterClickState.contentWidth
      );
      console.log('✅ Container properly expanded for content');
    }

    console.log('✅ Container expansion test completed');
  });
});
