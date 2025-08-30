import { test, expect } from '@playwright/test';

test('example spreads: repeated next() should advance to next spread (reproducer)', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60_000);

  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // Print page console messages to the test output so we can see debug logs
  page.on('console', (msg) => {
    try {
      // Only forward text for now
      console.log('PAGE:', msg.text());
    } catch {
      // ignore
    }
  });

  // Wait for library and rendition
  await page.waitForFunction(
    () => (window as any).ePub && typeof (window as any).ePub === 'function',
    { timeout: 15000 }
  );
  await page.waitForFunction(
    () =>
      (window as any).rendition &&
      typeof (window as any).rendition.next === 'function',
    { timeout: 15000 }
  );

  // Wait for rendition.started
  await page.evaluate(async () => {
    const r = (window as any).rendition;
    if (r && r.started) {
      try {
        await r.started;
      } catch (e) {}
    }
  });

  // Install relocated listener that saves locations
  await page.evaluate(() => {
    (window as any).__relocated = (window as any).__relocated || [];
    const r = (window as any).rendition;
    if (r && typeof r.on === 'function') {
      r.on('relocated', function (loc: any) {
        (window as any).__relocated.push(loc);
      });
    }
  });

  // Wait for at least one relocated event
  await page.waitForFunction(
    () => (window as any).__relocated && (window as any).__relocated.length > 0,
    { timeout: 10000 }
  );

  const result = await page.evaluate(async () => {
    const r = (window as any).rendition;
    const beforeArr = (window as any).__relocated;
    const before = beforeArr[beforeArr.length - 1];

    // Track all intermediate states for detailed validation
    const states: Array<{
      scrollLeft: number;
      location: any;
      visibleContentCheck: boolean;
    }> = [];

    // Helper function to check if there's visible content
    const checkVisibleContent = async () => {
      const manager = r.manager;
      if (!manager) return false;

      try {
        const visible = manager.visible();
        const hasVisibleViews = visible && visible.length > 0;

        // Also check if the current location shows valid pages
        const currentLoc = manager.currentLocation();
        const hasPages =
          currentLoc &&
          currentLoc.length > 0 &&
          currentLoc[0].pages &&
          currentLoc[0].pages.length > 0;

        return hasVisibleViews && hasPages;
      } catch (e) {
        return false;
      }
    };

    // Record initial state
    states.push({
      scrollLeft: r.manager?.container?.scrollLeft || 0,
      location: beforeArr[beforeArr.length - 1],
      visibleContentCheck: await checkVisibleContent(),
    });

    // Call next() multiple times with state tracking
    for (let i = 0; i < 3; i++) {
      try {
        r.next();
        await new Promise((res) => setTimeout(res, 100));

        // Record state after each next()
        states.push({
          scrollLeft: r.manager?.container?.scrollLeft || 0,
          location: (window as any).__relocated[
            (window as any).__relocated.length - 1
          ],
          visibleContentCheck: await checkVisibleContent(),
        });
      } catch (e) {}
    }

    // Wait briefly for any final relocated events
    const start = Date.now();
    while (
      (window as any).__relocated.length === beforeArr.length &&
      Date.now() - start < 2000
    ) {
      await new Promise((res) => setTimeout(res, 50));
    }

    const afterArr = (window as any).__relocated;
    const after = afterArr[afterArr.length - 1];

    return {
      before,
      after,
      beforeCount: beforeArr.length,
      afterCount: afterArr.length,
      states, // Include detailed state tracking
    };
  });

  console.log(
    'REL_EVENTS beforeCount=',
    result.beforeCount,
    'afterCount=',
    result.afterCount
  );
  console.log('BEFORE:', JSON.stringify(result.before));
  console.log('AFTER:', JSON.stringify(result.after));

  // Log detailed state progression to catch white page issues
  console.log('STATE PROGRESSION:');
  result.states.forEach((state, index) => {
    const startPage = state.location?.start?.displayed?.page || 0;
    const endPage = state.location?.end?.displayed?.page || 0;
    const pages = [startPage, endPage].filter((p) => p > 0);
    console.log(
      `  State ${index}: scrollLeft=${state.scrollLeft}, pages=[${pages.join(',')}], hasContent=${state.visibleContentCheck}`
    );
  });

  // Print the in-page navigation trace for debugging
  const trace = await page.evaluate(() => {
    return (window as any).__navTrace || [];
  });
  console.log('PAGE TRACE:', JSON.stringify(trace, null, 2));

  // Expect that pages or mapping.start changes (i.e., advanced spread)
  expect(result.before).toBeTruthy();
  expect(result.after).toBeTruthy();

  // Extract pages from the actual event structure
  const beforeStartPage = result.before.start?.displayed?.page || 0;
  const beforeEndPage = result.before.end?.displayed?.page || 0;
  const afterStartPage = result.after.start?.displayed?.page || 0;
  const afterEndPage = result.after.end?.displayed?.page || 0;

  const beforePages = [beforeStartPage, beforeEndPage].filter((p) => p > 0);
  const afterPages = [afterStartPage, afterEndPage].filter((p) => p > 0);

  const beforeMapping = result.before.start?.cfi;
  const afterMapping = result.after.start?.cfi;

  // The reproducer expects progress: either pages array changes, or mapping.start changes
  expect(beforePages.join(',')).not.toBe(afterPages.join(','));
  expect(beforeMapping || '').not.toBe(afterMapping || '');

  // NEW: Enhanced assertions to catch white page issues

  // Test if all page content is rendered in DOM (should be true for pagination)
  const domContentCheck = await page.evaluate(() => {
    const container = document.querySelector('#viewer');
    if (!container) return { error: 'No viewer container found' };

    const allText = container.textContent || '';
    const textLength = allText.length;

    // Look for page markers that should span across multiple pages
    // In a typical ebook, we should see content from page 1 through page 10
    const pageMarkers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const pageElement = container.querySelector(
        `[data-page="${i}"], .page-${i}, #page-${i}, #c001p000${i}`
      );
      if (pageElement) {
        pageMarkers.push(`page-${i}-found`);
      }
    }

    // Count iframe contents if present
    const iframes = container.querySelectorAll('iframe');
    let iframeContent = '';
    for (let i = 0; i < iframes.length; i++) {
      try {
        const iframe = iframes[i] as HTMLIFrameElement;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          iframeContent += doc.body?.textContent || '';
        }
      } catch (e) {
        // Cross-origin or other access issues
      }
    }

    return {
      containerTextLength: textLength,
      iframeContentLength: iframeContent.length,
      totalContentLength: textLength + iframeContent.length,
      pageMarkers,
      iframeCount: iframes.length,
      hasSubstantialContent: textLength + iframeContent.length > 1000,
    };
  });

  console.log('DOM CONTENT CHECK:', domContentCheck);

  // Ensure we have visible content in all states (catch white pages)
  const statesWithoutContent = result.states.filter(
    (state) => !state.visibleContentCheck
  );
  if (statesWithoutContent.length > 0) {
    console.error(
      'FOUND STATES WITH NO VISIBLE CONTENT:',
      statesWithoutContent
    );
  }

  // This assertion should FAIL if we have white pages
  expect(statesWithoutContent.length).toBe(0);
  if (statesWithoutContent.length > 0) {
    throw new Error(
      `Found ${statesWithoutContent.length} states with no visible content (white pages). ` +
        `States: ${statesWithoutContent.map((s, i) => `${i}:scrollLeft=${s.scrollLeft}`).join(', ')}`
    );
  }

  // Ensure pages are progressing properly (no gaps, no duplicates beyond reasonable overlap)
  const allPageSequences = result.states
    .map((state) => {
      const startPage = state.location?.start?.displayed?.page || 0;
      const endPage = state.location?.end?.displayed?.page || 0;
      return [startPage, endPage].filter((p) => p > 0);
    })
    .filter((pages) => pages.length > 0);

  console.log(
    'PAGE SEQUENCES:',
    allPageSequences.map((pages) => `[${pages.join(',')}]`).join(' -> ')
  );

  // Ensure we have valid page progression (at least 2 different states with content)
  expect(allPageSequences.length).toBeGreaterThanOrEqual(2);
  if (allPageSequences.length < 2) {
    throw new Error('Should have at least 2 states with valid pages');
  }

  // Check that pages are actually progressing forward
  const firstValidState = allPageSequences[0];
  const lastValidState = allPageSequences[allPageSequences.length - 1];

  const firstMaxPage = Math.max(...firstValidState);
  const lastMaxPage = Math.max(...lastValidState);

  expect(lastMaxPage).toBeGreaterThan(firstMaxPage);
  if (lastMaxPage <= firstMaxPage) {
    throw new Error(
      `Pages should progress forward. First: [${firstValidState.join(',')}], Last: [${lastValidState.join(',')}]`
    );
  }
});
