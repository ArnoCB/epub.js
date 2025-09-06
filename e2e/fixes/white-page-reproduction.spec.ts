import { test, expect } from '@playwright/test';

test('Reproduce white page regression: epigraph view attachment issue', async ({
  page,
  baseURL,
}) => {
  // Capture console logs
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('DefaultViewManager') ||
      text.includes('prepend') ||
      text.includes('pre-rendered') ||
      text.includes('Previous button') ||
      text.includes('prev()')
    ) {
      consoleLogs.push(text);
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
  await page.waitForTimeout(2000);

  // Navigate to epigraph first (the problematic starting point)
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('epigraph_001.xhtml');
  });

  // Wait for epigraph to load - check for successful display
  await page.waitForTimeout(3000); // Give time for navigation to complete

  // Log what we actually have in the DOM
  const debug = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const container = rend?.manager?.container;

    if (!container) return { error: 'no container' };

    const iframes = Array.from(container.querySelectorAll('iframe'));
    return {
      containerExists: !!container,
      iframeCount: iframes.length,
      iframes: iframes.map((iframe: any, i: number) => ({
        index: i,
        src: iframe.src || iframe.getAttribute('src'),
        visible: iframe.offsetWidth > 0 && iframe.offsetHeight > 0,
        dimensions: `${iframe.offsetWidth}x${iframe.offsetHeight}`,
      })),
      currentChapter: rend?.manager?.currentChapter || null,
    };
  });

  console.log('=== AFTER NAVIGATING TO EPIGRAPH ===');

  // Collect diagnostics after epigraph navigation
  const epigraphDiag = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const pre = rend?.manager?.preRenderer;
    const container = rend?.manager?.container;

    return {
      containerScrollWidth: container?.scrollWidth,
      containerOffsetWidth: container?.offsetWidth,
      containerScrollLeft: container?.scrollLeft,
      containerChildrenCount: container?.children?.length,
      containerChildren: container
        ? Array.from(container.children).map((el: any) => ({
            tag: el.tagName,
            class: el.className,
            offsetWidth: el.offsetWidth,
            scrollWidth: el.scrollWidth,
          }))
        : [],
      epigraphAttached: pre
        ? pre.getChapter('epigraph_001.xhtml')?.attached
        : null,
      introductionAttached: pre
        ? pre.getChapter('introduction_001.xhtml')?.attached
        : null,
    };
  });

  console.log('EPIGRAPH STATE:', JSON.stringify(epigraphDiag, null, 2));

  // Now navigate to introduction using next button - this is where the white page bug occurred
  await page.click('#next');

  // Wait a moment for navigation to complete
  await page.waitForTimeout(1000);

  console.log('=== AFTER CLICKING NEXT (SHOULD GO TO INTRODUCTION) ===');

  // Collect detailed diagnostics after clicking next (should show introduction)
  const nextDiag = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const pre = rend?.manager?.preRenderer;
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
      containerScrollWidth: container?.scrollWidth,
      containerOffsetWidth: container?.offsetWidth,
      containerScrollLeft: container?.scrollLeft,
      containerChildrenCount: container?.children?.length,
      containerChildren: container
        ? Array.from(container.children).map((el: any) => ({
            tag: el.tagName,
            class: el.className,
            offsetWidth: el.offsetWidth,
            scrollWidth: el.scrollWidth,
            innerHTML: el.innerHTML.slice(0, 200),
          }))
        : [],
      epigraphAttached: pre
        ? pre.getChapter('epigraph_001.xhtml')?.attached
        : null,
      introductionAttached: pre
        ? pre.getChapter('introduction_001.xhtml')?.attached
        : null,
      iframeContent,
    };
  });

  console.log('NEXT STATE:', JSON.stringify(nextDiag, null, 2));

  // Wait a moment for navigation to complete
  await page.waitForTimeout(1000);

  console.log('=== AFTER CLICKING PREV (SHOULD BE introduction_001.xhtml) ===');

  // Collect detailed diagnostics after clicking prev
  const prevDiag = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const pre = rend?.manager?.preRenderer;
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
      containerScrollWidth: container?.scrollWidth,
      containerOffsetWidth: container?.offsetWidth,
      containerScrollLeft: container?.scrollLeft,
      containerChildrenCount: container?.children?.length,
      containerChildren: container
        ? Array.from(container.children).map((el: any) => ({
            tag: el.tagName,
            class: el.className,
            offsetWidth: el.offsetWidth,
            scrollWidth: el.scrollWidth,
            innerHTML: el.innerHTML.slice(0, 200),
          }))
        : [],
      epigraphAttached: pre
        ? pre.getChapter('epigraph_001.xhtml')?.attached
        : null,
      introductionAttached: pre
        ? pre.getChapter('introduction_001.xhtml')?.attached
        : null,
      iframeContent,
      currentLocation: w.__lastRelocated,
    };
  });

  console.log('PREV STATE:', JSON.stringify(prevDiag, null, 2));

  // The issue should be visible:
  // 1. Container has both phantom (4500px) and epigraph view (11700px)
  // 2. scrollLeft is positioned to show empty area
  // 3. introduction chapter should be attached but epigraph should be detached

  // Check if this creates a white page scenario
  const isWhitePage =
    prevDiag.iframeContent && (prevDiag.iframeContent as any).textLength === 0;
  if (isWhitePage) {
    await page.screenshot({
      path: 'tmp/white-page-reproduction.png',
      fullPage: false,
    });
    console.log('WHITE PAGE REPRODUCED - screenshot saved');
  }

  // Test expectations
  expect(prevDiag.epigraphAttached).toBe(false); // Epigraph should be detached
  expect(prevDiag.introductionAttached).toBe(true); // Introduction should be attached
  expect(prevDiag.containerChildren.length).toBe(2); // Should have phantom + introduction view

  // The main container should not have epigraph's width influencing scrollWidth
  expect(prevDiag.containerScrollWidth).not.toBe(11700); // Should not be epigraph width
});
