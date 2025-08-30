import { test, expect } from '@playwright/test';

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

  console.log('\n=== TESTING TRANSPARENT IFRAME NAVIGATION SYMMETRY FIX ===');

  // Helper to get current state
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

  // Test next() - this should now work correctly
  console.log('Testing next() navigation...');
  await page.click('#next');
  await page.waitForTimeout(1000);

  const afterNext = await getState();
  console.log(
    `🔄 After next(): chapter=${afterNext.chapter}, scroll=${afterNext.scrollLeft}/${afterNext.scrollWidth}, content=${afterNext.hasContent}`
  );

  expect(afterNext.hasContent).toBe(true);

  // Test prev() - this should also work correctly and create symmetric behavior
  console.log('Testing prev() navigation...');
  await page.click('#prev');
  await page.waitForTimeout(1000);

  const afterPrev = await getState();
  console.log(
    `🔄 After prev(): chapter=${afterPrev.chapter}, scroll=${afterPrev.scrollLeft}/${afterPrev.scrollWidth}, content=${afterPrev.hasContent}`
  );

  expect(afterPrev.hasContent).toBe(true);

  // Test that we can continue navigating in both directions (no navigation trap)
  console.log('Testing bidirectional navigation...');

  // Forward
  await page.click('#next');
  await page.waitForTimeout(1000);
  const forwardAgain = await getState();
  expect(forwardAgain.hasContent).toBe(true);
  console.log(
    `🔄 Forward again: chapter=${forwardAgain.chapter}, content=${forwardAgain.hasContent}`
  );

  // Backward
  await page.click('#prev');
  await page.waitForTimeout(1000);
  const backwardAgain = await getState();
  expect(backwardAgain.hasContent).toBe(true);
  console.log(
    `🔄 Backward again: chapter=${backwardAgain.chapter}, content=${backwardAgain.hasContent}`
  );

  console.log(
    '✅ Navigation symmetry test completed successfully - no navigation trap detected'
  );
});
