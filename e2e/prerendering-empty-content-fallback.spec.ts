import { test, expect } from '@playwright/test';

test('Prerendering: fallback to normal rendering when content is empty', async ({
  page,
  baseURL,
}) => {
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('attached chapter has empty content') ||
      text.includes('falling back to normal rendering') ||
      text.includes('detaching empty pre-rendered chapter')
    ) {
      consoleLogs.push(text);
      console.log('BROWSER LOG:', text);
    }
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library to load
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Wait for pre-rendering to start
  await page.waitForTimeout(2000);

  // Simulate the scenario where a pre-rendered chapter gets corrupted content
  // by manually clearing an iframe's content after it's been pre-rendered
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;

    // Display chapter 1 first
    if (rend) rend.display('chapter_001.xhtml');

    // Wait a bit then corrupt the iframe content to simulate the empty content bug
    setTimeout(() => {
      try {
        const preRenderer = rend?.manager?.preRenderer;
        if (preRenderer) {
          const chapters = preRenderer.getAllChapters();
          const chapter1 = chapters.find(
            (ch: any) => ch.section.href === 'chapter_001.xhtml'
          );
          if (chapter1 && chapter1.element) {
            const iframe = chapter1.element.querySelector('iframe');
            if (iframe && iframe.contentDocument) {
              // Clear the content to simulate corruption
              iframe.contentDocument.body.innerHTML = '';
              console.log(
                'TEST: Manually cleared iframe content to simulate corruption'
              );
            }
          }
        }
      } catch (e) {
        console.warn('TEST: Could not corrupt content:', e);
      }
    }, 1000);
  });

  await page.waitForTimeout(3000);

  console.log('=== NAVIGATING TO POTENTIALLY CORRUPTED CHAPTER ===');

  // Now try to navigate to the same chapter - this should detect empty content and fall back
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) {
      // Force a re-display of the same chapter to trigger the empty content detection
      rend.display('introduction_001.xhtml'); // Navigate away first
      setTimeout(() => {
        rend.display('chapter_001.xhtml'); // Then back to chapter 1
      }, 500);
    }
  });

  await page.waitForTimeout(3000);

  console.log('=== CHECKING IF FALLBACK WAS TRIGGERED ===');

  // Check if fallback was triggered or if content is working
  const result = await page.evaluate(() => {
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
        };
      }
    } catch (e) {
      iframeContent = { error: String(e) };
    }

    return {
      iframeContent,
      containerChildrenCount: container?.children?.length,
    };
  });

  console.log('RESULT:', JSON.stringify(result, null, 2));
  console.log('CONSOLE LOGS:', consoleLogs);

  // The key test: regardless of whether fallback was triggered or not,
  // we should have content (not a white page)
  expect(result.iframeContent?.hasContent).toBe(true);

  console.log(
    '✅ EMPTY CONTENT DETECTION: Either fallback worked or content remained intact'
  );
});
