import { test, expect } from '@playwright/test';

test('Verify container scrolling fix - no more white pages from positioning', async ({
  page,
}) => {
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

  console.log('=== CONTAINER SCROLLING FIX VERIFICATION ===');

  // Test the specific issue: container vs view positioning
  for (let i = 0; i < 6; i++) {
    const state = await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const manager = rendition.manager;
      const container = manager.container;
      const currentView = manager.views.last();

      // Check container vs view dimensions and positioning
      const containerRect = container.getBoundingClientRect();
      const viewRect = currentView?.element?.getBoundingClientRect();

      // Check for phantom element (our fix)
      const phantomElement = container.querySelector('.epub-scroll-phantom');

      return {
        containerWidth: container.offsetWidth,
        containerScrollWidth: container.scrollWidth,
        containerScrollLeft: container.scrollLeft,

        viewWidth: currentView?.element?.offsetWidth || 0,
        viewLeft: viewRect?.left || 0,
        viewRight: viewRect?.right || 0,

        phantomExists: !!phantomElement,
        phantomWidth: phantomElement?.offsetWidth || 0,

        // Critical: is content visible in viewport?
        containerLeft: containerRect.left,
        containerRight: containerRect.right,
        contentInViewport: viewRect
          ? viewRect.right > containerRect.left &&
            viewRect.left < containerRect.right
          : false,

        location: rendition.currentLocation()?.[0],
      };
    });

    console.log(`Click ${i}:`);
    console.log(
      `  Container: ${state.containerWidth}px (scrollWidth: ${state.containerScrollWidth}, scrollLeft: ${state.containerScrollLeft})`
    );
    console.log(
      `  View: ${state.viewWidth}px (left: ${state.viewLeft}, right: ${state.viewRight})`
    );
    console.log(
      `  Phantom element: exists=${state.phantomExists}, width=${state.phantomWidth}px`
    );
    console.log(`  Content in viewport: ${state.contentInViewport}`);
    console.log(
      `  Chapter: ${state.location?.href}, pages: [${state.location?.pages}]/${state.location?.totalPages}`
    );

    // Critical test: content must be visible in viewport
    expect(state.contentInViewport).toBe(true);

    if (!state.contentInViewport) {
      console.error(
        `🚨 CONTENT NOT VISIBLE: view positioned outside container viewport`
      );
      console.error(
        `   Container viewport: ${state.containerLeft} to ${state.containerRight}`
      );
      console.error(
        `   View position: ${state.viewLeft} to ${state.viewRight}`
      );
      break;
    }

    // Click next
    await page.evaluate(() => {
      const nextButton = document.getElementById('next');
      if (nextButton) nextButton.click();
    });

    await page.waitForTimeout(1500);

    if (i >= 3 && state.location?.href?.includes('chapter_002')) break;
  }

  console.log('✅ Container scrolling fix verification completed');
});
