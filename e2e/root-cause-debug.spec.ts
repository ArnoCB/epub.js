import { test, expect } from '@playwright/test';

test('Debug root cause: container sizing and scroll values', async ({
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

  console.log('=== ROOT CAUSE DEBUG: CONTAINER SIZING ===');

  // Get initial container dimensions and scroll info
  const initialState = await page.evaluate(() => {
    const rendition = (window as any).rendition;
    const manager = rendition.manager;
    const container = manager.container;
    const currentView = manager.views.last();

    return {
      // Container dimensions
      containerScrollLeft: container.scrollLeft,
      containerScrollWidth: container.scrollWidth,
      containerOffsetWidth: container.offsetWidth,

      // Content dimensions
      contentWidth: currentView?.contents?.textWidth?.() || 0,

      // Layout info
      layoutDelta: manager.layout.delta,
      layoutPageWidth: manager.layout.pageWidth,
      layoutDivisor: manager.layout.divisor,

      // Test the next() logic calculation
      leftCheck:
        container.scrollLeft + container.offsetWidth + manager.layout.delta,
      canScroll:
        container.scrollLeft + container.offsetWidth + manager.layout.delta <=
        container.scrollWidth,

      // Current location
      currentLocation: rendition.currentLocation(),
    };
  });

  console.log('📊 Initial Container State:');
  console.log(`   scrollLeft: ${initialState.containerScrollLeft}`);
  console.log(`   scrollWidth: ${initialState.containerScrollWidth}`);
  console.log(`   offsetWidth: ${initialState.containerOffsetWidth}`);
  console.log(`   contentWidth: ${initialState.contentWidth}`);
  console.log(`   layout.delta: ${initialState.layoutDelta}`);
  console.log(`   layout.pageWidth: ${initialState.layoutPageWidth}`);
  console.log(`   layout.divisor: ${initialState.layoutDivisor}`);
  console.log(`   leftCheck: ${initialState.leftCheck}`);
  console.log(`   canScroll: ${initialState.canScroll}`);
  console.log(
    `   currentLocation: ${JSON.stringify(initialState.currentLocation, null, 2)}`
  );

  // The root cause: if scrollWidth == offsetWidth, we can never scroll within section
  if (initialState.containerScrollWidth === initialState.containerOffsetWidth) {
    console.log(
      '🚨 ROOT CAUSE FOUND: scrollWidth equals offsetWidth - container not sized for content'
    );
    console.log(
      `   Expected: scrollWidth (${initialState.containerScrollWidth}) should be larger than offsetWidth (${initialState.containerOffsetWidth})`
    );
    console.log(
      `   Expected: scrollWidth should approximately equal contentWidth (${initialState.contentWidth})`
    );
  }

  // Test one click to see what happens
  await page.evaluate(() => {
    const nextButton = document.getElementById('next');
    if (nextButton) {
      console.log('🔄 Clicking next...');
      nextButton.click();
    }
  });

  await page.waitForTimeout(2000);

  const afterClickState = await page.evaluate(() => {
    const rendition = (window as any).rendition;
    const manager = rendition.manager;
    const container = manager.container;
    const currentView = manager.views.last();

    return {
      containerScrollLeft: container.scrollLeft,
      containerScrollWidth: container.scrollWidth,
      containerOffsetWidth: container.offsetWidth,
      contentWidth: currentView?.contents?.textWidth?.() || 0,
      leftCheck:
        container.scrollLeft + container.offsetWidth + manager.layout.delta,
      canScroll:
        container.scrollLeft + container.offsetWidth + manager.layout.delta <=
        container.scrollWidth,
      currentLocation: rendition.currentLocation(),
    };
  });

  console.log('📊 After Click State:');
  console.log(`   scrollLeft: ${afterClickState.containerScrollLeft}`);
  console.log(`   scrollWidth: ${afterClickState.containerScrollWidth}`);
  console.log(`   offsetWidth: ${afterClickState.containerOffsetWidth}`);
  console.log(`   contentWidth: ${afterClickState.contentWidth}`);
  console.log(`   leftCheck: ${afterClickState.leftCheck}`);
  console.log(`   canScroll: ${afterClickState.canScroll}`);
  console.log(
    `   currentLocation: ${JSON.stringify(afterClickState.currentLocation, null, 2)}`
  );

  // Compare chapter changes
  const initialChapter = initialState.currentLocation?.[0]?.href || 'unknown';
  const afterClickChapter =
    afterClickState.currentLocation?.[0]?.href || 'unknown';

  if (initialChapter !== afterClickChapter) {
    console.log(`📚 Chapter jumped: ${initialChapter} → ${afterClickChapter}`);
    console.log(
      '🚨 This confirms the issue: immediate chapter jump without scrolling'
    );
  } else {
    console.log(`📄 Same chapter: ${initialChapter} (scrolled within section)`);
  }
});
