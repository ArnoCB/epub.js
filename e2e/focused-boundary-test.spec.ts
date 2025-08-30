import { test, expect } from '@playwright/test';

test('edge case: navigate back from first chapter then forward again', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(20_000);

  await page.goto(`${baseURL}/debug-manual-browser.html`);

  // Minimal logging - only errors
  page.on('console', (msg) => {
    if (msg.text().includes('ERROR') || msg.text().includes('❌')) {
      console.log('ERROR:', msg.text());
    }
  });

  // Wait for initialization
  await page.waitForFunction(
    () => (window as any).ePub && (window as any).rendition,
    { timeout: 15000 }
  );
  await page.waitForTimeout(2000);

  // Helper function - minimal state check
  const getState = async () => {
    return await page.evaluate(() => {
      const manager = (window as any).rendition?.manager;
      const visible = manager?.visible();

      if (!visible || visible.length === 0)
        return { chapter: 'none', hasContent: false };

      const view = visible[0];
      const chapter = view?.section?.href || 'unknown';

      let hasContent = false;
      if (view?.contents?.document?.body?.textContent) {
        hasContent =
          view.contents.document.body.textContent.trim().length > 100;
      }

      return { chapter, hasContent };
    });
  };

  // 1. Get initial state (should be chapter_001.xhtml)
  const initial = await getState();
  console.log(
    '1. Initial:',
    initial.chapter,
    'hasContent:',
    initial.hasContent
  );
  expect(initial.hasContent).toBe(true);

  // 2. Navigate back from first chapter (critical step)
  await page.click('#prev');
  await page.waitForTimeout(1500);

  const afterPrev = await getState();
  console.log(
    '2. After prev:',
    afterPrev.chapter,
    'hasContent:',
    afterPrev.hasContent
  );

  // 3. Navigate forward again (this is where the bug occurs)
  await page.click('#next');
  await page.waitForTimeout(1500);

  const afterNext = await getState();
  console.log(
    '3. After next:',
    afterNext.chapter,
    'hasContent:',
    afterNext.hasContent
  );

  // 4. The critical assertion - forward should work after boundary navigation
  if (!afterNext.hasContent) {
    console.error(
      '🔴 BUG REPRODUCED: Cannot navigate forward after going back from first chapter'
    );
    console.error('Initial chapter:', initial.chapter);
    console.error('After prev chapter:', afterPrev.chapter);
    console.error('After next chapter:', afterNext.chapter);
  }

  expect(afterNext.hasContent).toBe(true);
  console.log('✅ Forward navigation works after boundary navigation');
});
