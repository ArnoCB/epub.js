import { test, expect } from '@playwright/test';

test('Debug navigation: epigraph -> prev() -> introduction issue', async ({
  page,
  baseURL,
}) => {
  // Capture console logs including our debugging messages
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('DEBUGGING') ||
      text.includes('loadPrevSection') ||
      text.includes('prepend') ||
      text.includes('scrollBackward')
    ) {
      console.log('BROWSER LOG:', text);
    }
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library to load
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(
    () => !!(window as any).getRendition || !!(window as any).getPreRenderer,
    { timeout: 10000 }
  );

  // Wait for pre-rendering to complete
  await page.waitForTimeout(3000);

  // Navigate directly to epigraph
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('epigraph_001.xhtml');
  });

  await page.waitForTimeout(2000);

  // Now test: call prev() directly to go to introduction
  console.log('=== CALLING PREV() FROM EPIGRAPH ===');

  const result = await page.evaluate(async () => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;

    console.log(
      'DEBUGGING: About to call rendition.prev() from epigraph_001.xhtml'
    );

    try {
      const prevResult = await rend.prev();
      console.log('DEBUGGING: rendition.prev() completed, result:', prevResult);

      // Check the resulting state
      const location = rend.currentLocation?.();
      const pre = rend?.manager?.preRenderer;

      return {
        success: true,
        result: prevResult,
        currentHref: location?.start?.href,
        epigraphAttached: pre
          ? pre.getChapter('epigraph_001.xhtml')?.attached
          : null,
        introductionAttached: pre
          ? pre.getChapter('introduction_001.xhtml')?.attached
          : null,
      };
    } catch (error: any) {
      console.error('DEBUGGING: rendition.prev() failed:', error);
      return { success: false, error: error.message };
    }
  });

  console.log('Navigation result:', result);

  // The issue: navigation should work and show introduction
  expect(result.success).toBe(true);
  expect(result.currentHref).toBe('introduction_001.xhtml');
  expect(result.introductionAttached).toBe(true);
});
