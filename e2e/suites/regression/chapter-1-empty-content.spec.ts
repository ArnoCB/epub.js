import { test, expect } from '@playwright/test';

test('Regression test: Navigate back to chapter 1 should show content, not empty page', async ({
  page,
  baseURL,
}) => {
  // Capture console logs to understand the flow
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('DefaultViewManager') ||
      text.includes('BookPreRenderer') ||
      text.includes('textLength') ||
      text.includes('chapter already attached')
    ) {
      consoleLogs.push(text);
    }
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library to load
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Wait for initial pre-rendering to complete
  await page.waitForTimeout(3000);

  // Navigate to chapter 1 first time
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('chapter_001.xhtml');
  });

  await page.waitForTimeout(2000);

  // Check content on first load
  const firstLoadState = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const container = rend?.manager?.container;

    let iframeContent: any = null;
    try {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        const body = iframe.contentDocument.body;
        iframeContent = {
          textLength: body?.textContent?.trim()?.length || 0,
          htmlLength: body?.innerHTML?.length || 0,
          hasContent: (body?.textContent?.trim()?.length || 0) > 0,
          snippet: body?.textContent?.trim()?.slice(0, 100) || '',
        };
      }
    } catch (e) {
      iframeContent = { error: String(e) };
    }

    return {
      iframeContent,
      containerScrollLeft: container?.scrollLeft,
    };
  });

  // Navigate away to epigraph
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('epigraph_001.xhtml');
  });

  await page.waitForTimeout(2000);

  // Navigate back to chapter 1 - this should trigger the regression
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('chapter_001.xhtml');
  });

  await page.waitForTimeout(3000);

  // Check content after navigating back
  const secondLoadState = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const container = rend?.manager?.container;

    let iframeContent: any = null;
    try {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        const body = iframe.contentDocument.body;
        iframeContent = {
          textLength: body?.textContent?.trim()?.length || 0,
          htmlLength: body?.innerHTML?.length || 0,
          hasContent: (body?.textContent?.trim()?.length || 0) > 0,
          snippet: body?.textContent?.trim()?.slice(0, 100) || '',
        };
      }
    } catch (e) {
      iframeContent = { error: String(e) };
    }

    return {
      iframeContent,
      containerScrollLeft: container?.scrollLeft,
    };
  });

  // The critical test: second load should have content, not be empty
  expect(secondLoadState.iframeContent?.hasContent).toBe(true);
});
