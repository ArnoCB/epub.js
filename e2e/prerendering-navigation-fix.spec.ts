import { test, expect } from '@playwright/test';

test('Prerendering navigation: chapter 1 -> prev should not white page', async ({
  page,
  baseURL,
}) => {
  // Capture console logs
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('DefaultViewManager') ||
      text.includes('scrollTo') ||
      text.includes('moveTo')
    ) {
      consoleLogs.push(text);
      console.log('BROWSER LOG:', text);
    }
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library and prerendering to initialize
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(
    () => !!(window as any).getRendition || !!(window as any).getPreRenderer,
    { timeout: 10000 }
  );

  // Wait for pre-rendering to complete
  await page.waitForTimeout(3000);

  // Start from chapter 1 (this is the initial chapter)
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('chapter_001.xhtml');
  });

  // Wait for chapter 1 to load
  await page.waitForTimeout(2000);

  console.log('=== STARTING FROM CHAPTER 1 ===');

  // Navigate back using prev button - this should go to introduction
  await page.click('#prev');

  // Wait for navigation to complete
  await page.waitForTimeout(2000);

  console.log('=== AFTER CLICKING PREV (SHOULD GO TO INTRODUCTION) ===');

  // Check final state - should show introduction content, not a white page
  const finalState = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const container = rend?.manager?.container;

    // Check iframe content
    let iframeContent: any = null;
    try {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        const body = iframe.contentDocument.body;
        iframeContent = {
          textLength: body?.textContent?.trim()?.length || 0,
          htmlLength: body?.innerHTML?.length || 0,
          readyState: iframe.contentDocument.readyState,
          bodySnippet: body?.textContent?.trim()?.slice(0, 100) || 'NO CONTENT',
        };
      }
    } catch (e) {
      iframeContent = { error: String(e) };
    }

    return {
      containerScrollLeft: container?.scrollLeft,
      containerScrollTop: container?.scrollTop, // This should be 0 for horizontal pagination
      containerScrollWidth: container?.scrollWidth,
      containerChildrenCount: container?.children?.length,
      iframeContent,
    };
  });

  console.log('FINAL STATE:', JSON.stringify(finalState, null, 2));

  // Test that navigation worked correctly
  expect(finalState.iframeContent?.textLength).toBeGreaterThan(0); // Should have content, not blank page
  expect(finalState.containerScrollTop).toBe(0); // Should not have vertical scrolling
  expect(finalState.containerScrollWidth).toBeGreaterThan(0); // Should have horizontal content

  console.log(
    '✅ PRERENDERING NAVIGATION FIX VERIFIED: prev navigation works without white pages'
  );
});
