import { test, expect } from '@playwright/test';

test('Debug white pages with correct page numbers', async ({ page }) => {
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

  console.log('=== WHITE PAGES WITH CORRECT PAGE NUMBERS DEBUG ===');

  // Test multiple next clicks to see when white pages appear
  for (let i = 0; i < 5; i++) {
    const beforeState = await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const currentView = manager.views.last();

      // Check if content is actually visible
      const hasTextContent =
        currentView?.document?.body?.textContent?.trim()?.length > 0;
      const bodyInnerHTML = currentView?.document?.body?.innerHTML || '';
      const hasVisibleElements =
        bodyInnerHTML.includes('<p>') ||
        bodyInnerHTML.includes('<div>') ||
        bodyInnerHTML.includes('text');

      return {
        chapter: location?.[0]?.href || 'unknown',
        displayedPages: location?.[0]?.pages || [],
        totalPages: location?.[0]?.totalPages || 0,
        scrollLeft: manager.container.scrollLeft,
        scrollWidth: manager.container.scrollWidth,
        contentWidth: currentView?.contents?.textWidth?.() || 0,
        hasTextContent,
        hasVisibleElements,
        bodyTextLength:
          currentView?.document?.body?.textContent?.trim()?.length || 0,
        bodyHTML: bodyInnerHTML.substring(0, 200), // First 200 chars of body HTML
      };
    });

    console.log(`Before click ${i + 1}:`);
    console.log(`  Chapter: ${beforeState.chapter}`);
    console.log(
      `  Pages: [${beforeState.displayedPages}] of ${beforeState.totalPages}`
    );
    console.log(
      `  Scroll: ${beforeState.scrollLeft}/${beforeState.scrollWidth}`
    );
    console.log(`  Content width: ${beforeState.contentWidth}`);
    console.log(`  Has text content: ${beforeState.hasTextContent}`);
    console.log(`  Has visible elements: ${beforeState.hasVisibleElements}`);
    console.log(`  Body text length: ${beforeState.bodyTextLength}`);
    console.log(`  Body HTML preview: ${beforeState.bodyHTML}`);

    // Click next
    await page.evaluate(() => {
      const nextButton = document.getElementById('next');
      if (nextButton) nextButton.click();
    });

    await page.waitForTimeout(2000);

    const afterState = await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const currentView = manager.views.last();

      const hasTextContent =
        currentView?.document?.body?.textContent?.trim()?.length > 0;
      const bodyInnerHTML = currentView?.document?.body?.innerHTML || '';
      const hasVisibleElements =
        bodyInnerHTML.includes('<p>') ||
        bodyInnerHTML.includes('<div>') ||
        bodyInnerHTML.includes('text');

      return {
        chapter: location?.[0]?.href || 'unknown',
        displayedPages: location?.[0]?.pages || [],
        totalPages: location?.[0]?.totalPages || 0,
        scrollLeft: manager.container.scrollLeft,
        scrollWidth: manager.container.scrollWidth,
        contentWidth: currentView?.contents?.textWidth?.() || 0,
        hasTextContent,
        hasVisibleElements,
        bodyTextLength:
          currentView?.document?.body?.textContent?.trim()?.length || 0,
        bodyHTML: bodyInnerHTML.substring(0, 200),
      };
    });

    console.log(`After click ${i + 1}:`);
    console.log(`  Chapter: ${afterState.chapter}`);
    console.log(
      `  Pages: [${afterState.displayedPages}] of ${afterState.totalPages}`
    );
    console.log(`  Scroll: ${afterState.scrollLeft}/${afterState.scrollWidth}`);
    console.log(`  Content width: ${afterState.contentWidth}`);
    console.log(`  Has text content: ${afterState.hasTextContent}`);
    console.log(`  Has visible elements: ${afterState.hasVisibleElements}`);
    console.log(`  Body text length: ${afterState.bodyTextLength}`);

    // Detect white page with correct page numbers
    if (
      !afterState.hasTextContent &&
      afterState.displayedPages.length > 0 &&
      Math.max(...afterState.displayedPages) <= afterState.totalPages
    ) {
      console.log(`🚨 WHITE PAGE DETECTED WITH CORRECT PAGE NUMBERS!`);
      console.log(
        `   Showing page ${Math.max(...afterState.displayedPages)} of ${afterState.totalPages} but no content visible`
      );
      console.log(
        `   Scroll position: ${afterState.scrollLeft}/${afterState.scrollWidth}`
      );
      console.log(`   Content width: ${afterState.contentWidth}`);

      // This is the issue we need to fix
      break;
    }

    console.log('---');
  }
});
