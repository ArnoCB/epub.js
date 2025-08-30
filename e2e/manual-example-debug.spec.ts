import { test, expect } from '@playwright/test';

test('debug manual example: reproduce white pages issue with Moby Dick', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60_000);

  // Use the exact same example that's failing manually
  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // Print page console messages to debug
  page.on('console', (msg) => {
    try {
      console.log('PAGE:', msg.text());
    } catch {
      // ignore
    }
  });

  // Wait for library and rendition (same as the example)
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

  // Wait for rendition.started (same as working test)
  await page.evaluate(async () => {
    const r = (window as any).rendition;
    if (r && r.started) {
      try {
        await r.started;
      } catch (e) {}
    }
  });

  // Debug: Log the exact setup being used
  const setupInfo = await page.evaluate(() => {
    const r = (window as any).rendition;
    return {
      manager: r?.manager?.constructor?.name,
      settings: r?.settings,
      layoutDivisor: r?.layout?.divisor,
      layoutSettings: r?.layout?.settings,
      containerElement: r?.container?.tagName,
      containerClass: r?.container?.className,
      axis: r?.manager?.settings?.axis,
      flow: r?.manager?.settings?.flow,
    };
  });

  console.log('MANUAL EXAMPLE SETUP:', JSON.stringify(setupInfo, null, 2));

  // Wait a moment for everything to initialize
  await page.waitForTimeout(1000);

  // Test the exact same scenario: click next 4 times
  const result = await page.evaluate(async () => {
    const nextButton = document.getElementById('next');
    if (!nextButton) return { error: 'No next button found' };

    // Track states like in the working test
    const states: Array<{
      clickNumber: number;
      scrollLeft: number;
      location: any;
      visibleContentCheck: boolean;
    }> = [];

    const checkVisibleContent = async () => {
      const r = (window as any).rendition;
      const manager = r?.manager;
      if (!manager) return false;

      try {
        const visible = manager.visible();
        const hasVisibleViews = visible && visible.length > 0;
        console.log('MANUAL DEBUG: visible views count=', visible?.length);

        if (hasVisibleViews) {
          // Check if any view has actual content
          for (let i = 0; i < visible.length; i++) {
            const view = visible[i];
            if (view && view.contents && view.contents.document) {
              const doc = view.contents.document;
              const bodyText = doc.body?.textContent?.trim() || '';
              const hasText = bodyText.length > 1000; // Substantial content
              console.log(
                `MANUAL DEBUG: view ${i} body text length=`,
                bodyText.length,
                'hasText=',
                hasText
              );
              if (hasText) return true;
            }
          }
        }
        return false;
      } catch (e) {
        console.log('MANUAL DEBUG: error checking content', e);
        return false;
      }
    };

    const getActualScrollLeft = () => {
      const r = (window as any).rendition;
      const manager = r?.manager;
      if (!manager || !manager.container) return 0;

      // Get the actual container scroll position
      const containerScrollLeft = manager.container.scrollLeft || 0;
      console.log(
        'MANUAL DEBUG: manager.container.scrollLeft=',
        containerScrollLeft
      );
      return containerScrollLeft;
    };

    // Get initial state
    const initialScrollLeft = getActualScrollLeft();
    const initialLocation = (window as any).__relocated?.[
      (window as any).__relocated?.length - 1
    ];
    const initialContent = await checkVisibleContent();

    states.push({
      clickNumber: 0,
      scrollLeft: initialScrollLeft,
      location: initialLocation,
      visibleContentCheck: initialContent,
    });

    // Click next 4 times and record states
    for (let i = 1; i <= 4; i++) {
      console.log(`MANUAL DEBUG: Clicking next (${i}/4)`);

      // Click the button
      nextButton.click();

      // Wait for potential relocations
      await new Promise((resolve) => setTimeout(resolve, 500));

      const scrollLeft = getActualScrollLeft();
      const location = (window as any).__relocated?.[
        (window as any).__relocated?.length - 1
      ];
      const hasContent = await checkVisibleContent();

      console.log(
        `MANUAL DEBUG: After click ${i}: scrollLeft=${scrollLeft}, hasContent=${hasContent}`
      );

      states.push({
        clickNumber: i,
        scrollLeft,
        location,
        visibleContentCheck: hasContent,
      });
    }

    return {
      states,
      setupInfo: {
        manager: (window as any).rendition?.manager?.constructor?.name,
        layoutDivisor: (window as any).rendition?.layout?.divisor,
        axis: (window as any).rendition?.manager?.settings?.axis,
      },
    };
  });

  console.log('MANUAL EXAMPLE RESULT:', JSON.stringify(result, null, 2));

  // Check if we got valid results
  if (!result.states) {
    throw new Error('Failed to get states from manual example');
  }

  // Log each state
  console.log('\nMANUAL STATE PROGRESSION:');
  result.states.forEach((state) => {
    const pages =
      state.location?.start?.displayed?.page &&
      state.location?.end?.displayed?.page
        ? [
            state.location.start.displayed.page,
            state.location.end.displayed.page,
          ]
        : 'unknown';
    console.log(
      `  Click ${state.clickNumber}: scrollLeft=${state.scrollLeft}, pages=${JSON.stringify(pages)}, hasContent=${state.visibleContentCheck}`
    );
  });

  // Find states without content (white pages)
  const statesWithoutContent = result.states.filter(
    (state) => !state.visibleContentCheck
  );
  console.log('\nSTATES WITHOUT CONTENT:', statesWithoutContent.length);

  // This should PASS if the manual example works, FAIL if it shows white pages
  if (statesWithoutContent.length > 0) {
    console.error(
      '❌ MANUAL EXAMPLE HAS WHITE PAGES - This reproduces the user issue!'
    );
    console.error(
      'White page states:',
      statesWithoutContent
        .map((s) => `click-${s.clickNumber}:scrollLeft=${s.scrollLeft}`)
        .join(', ')
    );

    // Don't fail the test - we want to see this issue to debug it
    // expect(statesWithoutContent.length).toBe(0);
  } else {
    console.log('✅ MANUAL EXAMPLE WORKS - No white pages found');
  }

  // For now, always pass so we can see the debug output
  expect(result.states.length).toBeGreaterThan(0);
});
