import { test, expect } from '@playwright/test';

test('manual transparent iframe boundary issue reproduction', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(30_000);

  // Navigate to the actual example page that's failing
  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // Capture console output to see the MANUAL debug logs
  page.on('console', (msg) => {
    if (
      msg.text().includes('MANUAL:') ||
      msg.text().includes('ERROR') ||
      msg.text().includes('❌')
    ) {
      console.log('CONSOLE:', msg.text());
    }
  });

  // Wait for EPUB to load completely
  await page.waitForFunction(
    () => (window as any).rendition && (window as any).rendition.manager,
    { timeout: 20000 }
  );

  // Wait for initial display to settle - longer wait to match manual behavior
  await page.waitForTimeout(5000);

  // Helper function - get detailed state
  const getDetailedState = async () => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const manager = rendition?.manager;

      if (!manager) return { status: 'no-manager' };

      const visible = manager.visible();
      const container = manager.container;

      if (!visible || visible.length === 0) {
        return {
          status: 'no-visible-views',
          scrollLeft: container?.scrollLeft || 0,
          scrollWidth: container?.scrollWidth || 0,
          offsetWidth: container?.offsetWidth || 0,
        };
      }

      const view = visible[0];
      const chapter = view?.section?.href || 'unknown';

      let hasContent = false;
      let textLength = 0;

      try {
        const body = view?.contents?.document?.body;
        if (body) {
          const text = body.textContent || '';
          textLength = text.trim().length;
          hasContent = textLength > 100;
        }
      } catch (e) {
        // Ignore content access errors
      }

      return {
        status: 'ok',
        chapter,
        hasContent,
        textLength,
        visibleViews: visible.length,
        scrollLeft: container?.scrollLeft || 0,
        scrollWidth: container?.scrollWidth || 0,
        offsetWidth: container?.offsetWidth || 0,
        viewWidth: view?.width || 0,
        viewLeft: view?.offset?.left || 0,
      };
    });
  };

  // 1. Check initial state
  console.log('=== STEP 1: INITIAL STATE ===');
  const initial = await getDetailedState();
  console.log('Initial state:', JSON.stringify(initial, null, 2));

  if (initial.status !== 'ok') {
    throw new Error(`Failed to initialize: ${initial.status}`);
  }

  expect(initial.hasContent).toBe(true);

  // 2. Navigate PREVIOUS from chapter 1 - this should work
  console.log('\n=== STEP 2: NAVIGATE PREVIOUS ===');
  console.log('About to click Previous...');

  // Click the actual prev link in the example
  await page.click('#prev');

  // Wait for navigation and any animations
  await page.waitForTimeout(3000);

  const afterPrev = await getDetailedState();
  console.log('After Previous:', JSON.stringify(afterPrev, null, 2));

  if (afterPrev.status !== 'ok') {
    console.error('❌ FAILED: Previous navigation failed');
    throw new Error(`Failed after prev: ${afterPrev.status}`);
  }

  expect(afterPrev.hasContent).toBe(true);
  console.log('✅ Previous navigation successful');

  // 3. Navigate NEXT back - this is where the manual bug occurs
  console.log('\n=== STEP 3: NAVIGATE NEXT (CRITICAL) ===');
  console.log('About to click Next...');

  // Click the actual next link in the example
  await page.click('#next');

  // Wait for navigation and any animations
  await page.waitForTimeout(3000);

  const afterNext = await getDetailedState();
  console.log('After Next:', JSON.stringify(afterNext, null, 2));

  // Check if we reproduced the bug
  if (afterNext.status !== 'ok') {
    console.error('🔴 BUG REPRODUCED: Next navigation completely failed');
    console.error('Next navigation returned status:', afterNext.status);
    throw new Error(`Failed after next: ${afterNext.status}`);
  }

  if (!afterNext.hasContent) {
    console.error('🔴 BUG REPRODUCED: Next navigation shows white page');
    console.error('State comparison:');
    console.error(
      '  Initial:',
      initial.chapter,
      '(content:',
      initial.hasContent,
      ')'
    );
    console.error(
      '  After prev:',
      afterPrev.chapter,
      '(content:',
      afterPrev.hasContent,
      ')'
    );
    console.error(
      '  After next:',
      afterNext.chapter,
      '(content:',
      afterNext.hasContent,
      ')'
    );
    console.error('Scroll state:', {
      scrollLeft: afterNext.scrollLeft,
      scrollWidth: afterNext.scrollWidth,
      offsetWidth: afterNext.offsetWidth,
    });
  }

  expect(afterNext.hasContent).toBe(true);
  console.log(
    '✅ Next navigation successful - no bug reproduced in automated test'
  );

  // 4. Try a few more navigation cycles to see if we can trigger the bug
  console.log('\n=== STEP 4: ADDITIONAL NAVIGATION CYCLES ===');
  for (let i = 1; i <= 3; i++) {
    console.log(`Cycle ${i}: Previous...`);
    await page.click('#prev');
    await page.waitForTimeout(2000);

    console.log(`Cycle ${i}: Next...`);
    await page.click('#next');
    await page.waitForTimeout(2000);

    const cycleState = await getDetailedState();
    if (!cycleState.hasContent) {
      console.error(`🔴 BUG REPRODUCED in cycle ${i}!`);
      console.error('Cycle state:', JSON.stringify(cycleState, null, 2));
    }
    expect(cycleState.hasContent).toBe(true);
  }

  console.log('✅ All navigation cycles completed successfully');
});
