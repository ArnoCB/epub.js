import { test, expect } from '@playwright/test';

test('Simple epigraph to introduction navigation test', async ({
  page,
  baseURL,
}) => {
  // Capture console logs
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('DefaultViewManager') ||
      text.includes('prepend') ||
      text.includes('pre-rendered')
    ) {
      console.log('BROWSER LOG:', text);
    }
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library to load
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Wait for pre-rendering to complete
  await page.waitForTimeout(3000);

  // Navigate to epigraph first
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition();
    if (rend) rend.display('epigraph_001.xhtml');
  });

  await page.waitForTimeout(1000);
  console.log('=== NAVIGATED TO EPIGRAPH ===');

  // Now navigate to introduction - this should use our prependPreRendered method
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition();
    if (rend) rend.display('introduction_001.xhtml');
  });

  await page.waitForTimeout(1000);
  console.log('=== NAVIGATED TO INTRODUCTION ===');

  // Check if we have proper content
  const result = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition();
    const container = rend?.manager?.container;
    const pre = rend?.manager?.preRenderer;

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
          bodySnippet: body?.textContent?.trim()?.slice(0, 100) || 'NO CONTENT',
        };
      }
    } catch (e) {
      iframeContent = { error: String(e) };
    }

    return {
      containerScrollWidth: container?.scrollWidth,
      containerChildrenCount: container?.children?.length,
      introductionAttached: pre
        ? pre.getChapter('introduction_001.xhtml')?.attached
        : null,
      epigraphAttached: pre
        ? pre.getChapter('epigraph_001.xhtml')?.attached
        : null,
      iframeContent,
    };
  });

  console.log('FINAL STATE:', JSON.stringify(result, null, 2));

  // Test that navigation to introduction worked and we have content
  expect(result.iframeContent?.textLength).toBeGreaterThan(0);
  expect(result.introductionAttached).toBe(true);

  console.log('✅ EPIGRAPH TO INTRODUCTION NAVIGATION WORKS');
});
