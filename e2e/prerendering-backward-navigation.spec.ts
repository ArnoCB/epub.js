import { test, expect } from '@playwright/test';

// Extend window type for epub.js
declare global {
  interface Window {
    rendition?: any;
  }
}

test('Prerendering: backward navigation from chapter 1 to epigraph', async ({
  page,
}) => {
  // Load the Moby Dick example with prerendering enabled
  await page.goto('http://localhost:8080/examples/prerendering-example.html');

  // Navigate to chapter 1 first
  await page.evaluate(async () => {
    // Wait for rendition to be ready
    let attempts = 0;
    while (!window.rendition && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.rendition) {
      throw new Error('Rendition not available after waiting');
    }

    // Navigate to chapter 1
    await window.rendition.display('chapter_001.xhtml');
  });

  // Wait for navigation to complete
  await page.waitForTimeout(2000);

  console.log('=== STARTING FROM CHAPTER 1 ===');

  // Get initial state
  let initialState = await page.evaluate(() => {
    const container = window.rendition?.manager?.container;
    return {
      containerScrollLeft: container?.scrollLeft || 0,
      containerScrollWidth: container?.scrollWidth || 0,
      currentHref: window.rendition?.location?.start?.href || 'unknown',
    };
  });

  console.log('Initial state:', initialState);

  // Attempt to go to previous chapter
  await page.evaluate(async () => {
    console.log('[DEBUGGING] About to call prev() from test');
    await window.rendition.prev();
  });

  // Wait for navigation
  await page.waitForTimeout(3000);

  console.log('=== AFTER CLICKING PREV (SHOULD GO TO EPIGRAPH) ===');

  // Check final state
  let finalState = await page.evaluate(() => {
    const container = window.rendition?.manager?.container;
    const iframe = container?.querySelector('iframe');

    let iframeContent: {
      textLength: number;
      htmlLength: number;
      readyState: string;
      bodySnippet: string;
    } | null = null;

    if (iframe) {
      try {
        const doc = iframe.contentDocument;
        if (doc && doc.body) {
          const textLength = (doc.body.textContent || '').length;
          const htmlLength = (doc.body.innerHTML || '').length;
          const readyState = doc.readyState;
          const bodySnippet = (doc.body.textContent || '').substring(0, 100);

          iframeContent = {
            textLength,
            htmlLength,
            readyState,
            bodySnippet,
          };
        }
      } catch (e) {
        console.log('Could not access iframe content:', e.message);
      }
    }

    return {
      containerScrollLeft: container?.scrollLeft || 0,
      containerScrollTop: container?.scrollTop || 0,
      containerScrollWidth: container?.scrollWidth || 0,
      containerChildrenCount: container?.children?.length || 0,
      currentHref: window.rendition?.location?.start?.href || 'unknown',
      iframeContent,
    };
  });

  console.log('FINAL STATE:', finalState);

  // Verify we successfully navigated to epigraph
  expect(finalState.currentHref).toBe('epigraph_001.xhtml');

  // Verify iframe has content (not empty/white page)
  expect(finalState.iframeContent).toBeTruthy();
  expect(finalState.iframeContent!.textLength).toBeGreaterThan(0);
  expect(finalState.iframeContent!.htmlLength).toBeGreaterThan(0);
  expect(finalState.iframeContent!.readyState).toBe('complete');

  console.log(
    '✅ BACKWARD NAVIGATION FIX VERIFIED: prev from chapter 1 to epigraph works without white pages'
  );
});
