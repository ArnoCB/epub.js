import { test, expect } from '@playwright/test';

test('immediate navigation: click previous right away then next', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(30_000);

  await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

  // Capture all console output
  page.on('console', (msg) => {
    if (
      msg.text().includes('MANUAL:') ||
      msg.text().includes('ERROR') ||
      msg.text().includes('❌')
    ) {
      console.log('CONSOLE:', msg.text());
    }
  });

  // Wait for the script to start loading but DON'T wait for full initialization
  // This mimics clicking "previous" right away as a user would
  await page.waitForFunction(() => (window as any).rendition !== undefined, {
    timeout: 10000,
  });

  // Wait just a brief moment (like a human would) then click previous immediately
  await page.waitForTimeout(1000);

  console.log('=== CLICKING PREVIOUS IMMEDIATELY ===');

  // Click previous right away - this is what you're doing manually
  await page.click('#prev');

  // Wait a bit for navigation
  await page.waitForTimeout(3000);

  // Get state after immediate previous click
  const afterPrev = await page.evaluate(() => {
    const rendition = (window as any).rendition;
    const manager = rendition?.manager;

    if (!manager) return { status: 'no-manager' };

    const visible = manager.visible();
    if (!visible || visible.length === 0) {
      return {
        status: 'no-visible-views',
        scrollLeft: manager?.container?.scrollLeft || 0,
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
      textLength = -1; // Error indicator
    }

    return {
      status: 'ok',
      chapter,
      hasContent,
      textLength,
      scrollLeft: manager?.container?.scrollLeft || 0,
      scrollWidth: manager?.container?.scrollWidth || 0,
    };
  });

  console.log('After immediate previous:', JSON.stringify(afterPrev, null, 2));

  // Now click next - this is where your issue occurs
  console.log('\n=== CLICKING NEXT AFTER IMMEDIATE PREVIOUS ===');
  await page.click('#next');

  // Wait for navigation
  await page.waitForTimeout(3000);

  const afterNext = await page.evaluate(() => {
    const rendition = (window as any).rendition;
    const manager = rendition?.manager;

    if (!manager) return { status: 'no-manager' };

    const visible = manager.visible();
    if (!visible || visible.length === 0) {
      return {
        status: 'no-visible-views',
        scrollLeft: manager?.container?.scrollLeft || 0,
        scrollWidth: manager?.container?.scrollWidth || 0,
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
      textLength = -1; // Error indicator
    }

    return {
      status: 'ok',
      chapter,
      hasContent,
      textLength,
      scrollLeft: manager?.container?.scrollLeft || 0,
      scrollWidth: manager?.container?.scrollWidth || 0,
    };
  });

  console.log(
    'After next (where bug should occur):',
    JSON.stringify(afterNext, null, 2)
  );

  // Check if we reproduced the bug
  if (afterNext.status !== 'ok') {
    console.error('🔴 BUG REPRODUCED: Next navigation completely failed');
    console.error('Status:', afterNext.status);
    throw new Error(`Navigation failed with status: ${afterNext.status}`);
  }

  if (!afterNext.hasContent) {
    console.error(
      '🔴 BUG REPRODUCED: Next navigation shows white page after immediate previous'
    );
    console.error('Previous result:', afterPrev);
    console.error('Next result:', afterNext);

    // This should fail the test to show we reproduced the bug
    expect(afterNext.hasContent).toBe(true);
  }

  console.log('✅ Navigation worked (bug not reproduced in this test run)');
});
