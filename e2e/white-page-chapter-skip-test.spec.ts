import { test, expect } from '@playwright/test';

test.describe('White Page and Chapter Skip Prevention', () => {
  test('should not show white pages or skip chapters in transparent iframe', async ({
    page,
  }) => {
    // Load the transparent iframe example
    await page.goto(
      'http://localhost:8080/examples/transparent-iframe-hightlights.html'
    );

    // Wait for the book to load
    await page.waitForSelector('#viewer iframe', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow extra time for content to render

    console.log('=== TESTING WHITE PAGE AND CHAPTER SKIP PREVENTION ===');

    // Track navigation through multiple chapters
    let consecutiveNextClicks = 0;
    let currentChapter = '';
    let chapterHistory: string[] = [];

    for (let i = 0; i < 15; i++) {
      // Get current chapter and scroll state
      const state = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#viewer iframe'
        ) as HTMLIFrameElement;
        if (!iframe || !iframe.contentWindow) return null;

        const location = (window as any).rendition?.currentLocation();
        if (!location || !location.length) return null;

        const currentLoc = location[location.length - 1];
        const chapter = currentLoc.href;

        // Check if iframe shows actual content or white page
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const viewerDiv = iframeDoc.querySelector('div[style*="overflow"]');
        const hasVisibleText = iframeDoc.body.innerText.trim().length > 100;

        // Get scroll info
        const scrollLeft = viewerDiv ? viewerDiv.scrollLeft : 0;
        const scrollWidth = viewerDiv ? viewerDiv.scrollWidth : 0;
        const offsetWidth = viewerDiv
          ? (viewerDiv as HTMLElement).offsetWidth
          : 0;

        return {
          chapter,
          scrollLeft,
          scrollWidth,
          offsetWidth,
          hasContent: hasVisibleText,
          displayedPages: currentLoc.displayed || { page: 0, total: 0 },
        };
      });

      if (!state) {
        await page.waitForTimeout(500);
        continue;
      }

      console.log(
        `🔄 Click ${i + 1}: chapter=${state.chapter}, scroll=${state.scrollLeft}/${state.scrollWidth}, content=${state.hasContent}, pages=${state.displayedPages.page}/${state.displayedPages.total}`
      );

      // Track chapter changes
      if (state.chapter !== currentChapter) {
        if (currentChapter) {
          chapterHistory.push(`${currentChapter} → ${state.chapter}`);
        }
        currentChapter = state.chapter;
      }

      // Check for white pages
      expect(state.hasContent).toBe(true);

      // Check for reasonable scroll position (not way beyond content)
      if (state.scrollWidth > 0) {
        const scrollRatio = state.scrollLeft / state.scrollWidth;
        expect(scrollRatio).toBeLessThanOrEqual(1.1); // Allow small tolerance
      }

      // Click next
      await page.click('#next');
      await page.waitForTimeout(500); // Allow navigation to complete
      consecutiveNextClicks++;
    }

    console.log('📚 Navigation history:', chapterHistory);

    // Verify we made reasonable progress (not stuck, not skipping too much)
    expect(chapterHistory.length).toBeGreaterThanOrEqual(1); // Should have made some progress
    expect(chapterHistory.length).toBeLessThanOrEqual(8); // Should not skip too many chapters

    console.log('✅ White page and chapter skip test completed');
  });
});
