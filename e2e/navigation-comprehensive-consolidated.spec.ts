import { test, expect } from '@playwright/test';

test.describe('EPUB Navigation - Comprehensive Edge Cases Prevention Suite', () => {
  // Helper functions
  const getNavigationState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const container = manager.container;
      const currentView = manager.views.last();

      // Get actual visible content in current viewport
      let visibleText = '';
      let visibleElementCount = 0;

      if (currentView && currentView.document) {
        const viewportLeft = container.scrollLeft;
        const viewportRight = viewportLeft + container.offsetWidth;

        // Check what's actually visible in the viewport
        const allElements = currentView.document.querySelectorAll(
          'p, h1, h2, h3, div, span'
        );
        for (const element of allElements) {
          const rect = element.getBoundingClientRect();
          const elementLeft = rect.left + viewportLeft;
          const elementRight = elementLeft + rect.width;

          // Element is visible if it overlaps with viewport
          if (elementRight > viewportLeft && elementLeft < viewportRight) {
            visibleElementCount++;
            if (element.textContent && element.textContent.trim()) {
              visibleText += element.textContent.trim().substring(0, 50) + ' ';
            }
          }
        }
      }

      return {
        chapter: location?.[0]?.href || 'unknown',
        displayedPages: location?.[0]?.pages || [],
        totalPages: location?.[0]?.totalPages || 0,
        scrollLeft: container.scrollLeft,
        scrollWidth: container.scrollWidth,
        offsetWidth: container.offsetWidth,
        contentWidth: currentView?.contents?.textWidth?.() || 0,

        // Viewport visibility checks
        visibleText: visibleText.trim().substring(0, 100),
        visibleElementCount,
        isWhitePage:
          visibleElementCount === 0 || visibleText.trim().length === 0,

        // Content existence (what we were checking before)
        totalTextContent:
          currentView?.document?.body?.textContent?.trim()?.length || 0,
        hasContent:
          currentView?.document?.body?.textContent?.trim()?.length > 0,
      };
    });
  };

  const clickNext = async (page: any) => {
    await page.evaluate(() => {
      const nextButton = document.getElementById('next');
      if (nextButton) nextButton.click();
    });
    await page.waitForTimeout(1500);
  };

  const clickPrev = async (page: any) => {
    await page.evaluate(() => {
      const prevButton = document.getElementById('prev');
      if (prevButton) prevButton.click();
    });
    await page.waitForTimeout(1500);
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
    await page.waitForTimeout(2000); // Let it fully load
  };

  // Test 1: No white pages in viewport (the real issue)
  test('should never show white pages in viewport', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST: NO WHITE PAGES IN VIEWPORT ===');

    let clickCount = 0;
    const MAX_CLICKS = 20;

    while (clickCount < MAX_CLICKS) {
      const state = await getNavigationState(page);

      console.log(
        `State ${clickCount}: ${state.chapter} pages=[${state.displayedPages}]/${state.totalPages} scroll=${state.scrollLeft}/${state.scrollWidth}`
      );
      console.log(
        `  Visible elements: ${state.visibleElementCount}, Visible text: "${state.visibleText}"`
      );
      console.log(`  Is white page: ${state.isWhitePage}`);

      // Critical test: never show white pages in viewport
      expect(state.isWhitePage).toBe(false);
      if (state.isWhitePage) {
        console.error(`🚨 WHITE PAGE IN VIEWPORT DETECTED!`);
        console.error(
          `   Chapter: ${state.chapter}, Pages: [${state.displayedPages}]/${state.totalPages}`
        );
        console.error(
          `   Scroll: ${state.scrollLeft}/${state.scrollWidth}, Content width: ${state.contentWidth}`
        );
        console.error(
          `   Visible elements: ${state.visibleElementCount}, Has content: ${state.hasContent}`
        );
        break;
      }

      // Also verify page numbers don't exceed total
      if (state.displayedPages.length > 0 && state.totalPages > 0) {
        const maxDisplayedPage = Math.max(...state.displayedPages);
        expect(maxDisplayedPage).toBeLessThanOrEqual(state.totalPages);
      }

      await clickNext(page);
      clickCount++;

      // Stop at reasonable depth
      if (state.chapter.includes('chapter_004')) break;
    }

    console.log('✅ No white pages in viewport test completed');
  });

  // Test 2: Page numbers must be valid
  test('should never show invalid page numbers', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST: VALID PAGE NUMBERS ===');

    for (let i = 0; i < 15; i++) {
      const state = await getNavigationState(page);
      console.log(
        `Click ${i}: ${state.chapter} pages=[${state.displayedPages}]/${state.totalPages}`
      );

      // Page numbers must be valid
      if (state.displayedPages.length > 0 && state.totalPages > 0) {
        const maxPage = Math.max(...state.displayedPages);
        const minPage = Math.min(...state.displayedPages);

        expect(maxPage).toBeLessThanOrEqual(state.totalPages);
        expect(minPage).toBeGreaterThan(0);

        if (maxPage > state.totalPages) {
          console.error(
            `🚨 INVALID PAGE NUMBERS: showing page ${maxPage} of ${state.totalPages}`
          );
          break;
        }
      }

      await clickNext(page);
    }

    console.log('✅ Valid page numbers test completed');
  });

  // Test 3: Intra-chapter navigation before jumping
  test('should scroll within chapters before jumping to next chapter', async ({
    page,
  }) => {
    await setupEpub(page);
    console.log('=== TEST: INTRA-CHAPTER NAVIGATION ===');

    const startState = await getNavigationState(page);
    let currentChapter = startState.chapter;
    let sameChapterClicks = 0;

    for (let i = 0; i < 12; i++) {
      const state = await getNavigationState(page);

      // Must never show white pages
      expect(state.isWhitePage).toBe(false);

      if (state.chapter === currentChapter) {
        sameChapterClicks++;
      } else {
        console.log(
          `📚 Chapter transition: ${currentChapter} → ${state.chapter} after ${sameChapterClicks} clicks`
        );

        // Should have multiple clicks within chapter before jumping (except very short chapters)
        if (
          i > 0 &&
          !currentChapter.includes('unknown') &&
          !currentChapter.includes('epigraph')
        ) {
          expect(sameChapterClicks).toBeGreaterThan(1);
        }

        currentChapter = state.chapter;
        sameChapterClicks = 1;
      }

      await clickNext(page);
    }

    console.log('✅ Intra-chapter navigation test completed');
  });

  // Test 4: Bidirectional navigation
  test('should handle prev() correctly', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST: BIDIRECTIONAL NAVIGATION ===');

    // Navigate forward a few times
    await clickNext(page);
    await clickNext(page);
    await clickNext(page);

    const beforePrev = await getNavigationState(page);
    console.log(
      `Before prev: ${beforePrev.chapter} pages=[${beforePrev.displayedPages}] scroll=${beforePrev.scrollLeft}`
    );

    // Go back
    await clickPrev(page);

    const afterPrev = await getNavigationState(page);
    console.log(
      `After prev: ${afterPrev.chapter} pages=[${afterPrev.displayedPages}] scroll=${afterPrev.scrollLeft}`
    );

    // Must not show white page after going back
    expect(afterPrev.isWhitePage).toBe(false);

    console.log('✅ Bidirectional navigation test completed');
  });
});
