import { test, expect } from '@playwright/test';

test('Test rendition.prev() method directly', async ({ page, baseURL }) => {
  // Capture ALL console logs
  page.on('console', (msg) => {
    console.log('BROWSER LOG:', msg.text());
  });

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library to load
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(
    () => !!(window as any).getRendition || !!(window as any).getPreRenderer,
    { timeout: 10000 }
  );

  // Wait a moment for setup
  await page.waitForTimeout(2000);

  // Test calling prev directly
  const result = await page.evaluate(async () => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;

    console.log('Test: rendition exists:', !!rend);
    console.log('Test: rendition.prev exists:', typeof rend?.prev);
    console.log('Test: calling rendition.prev()...');

    try {
      const result = await rend.prev();
      console.log('Test: prev() completed successfully:', result);
      return { success: true, result };
    } catch (error: any) {
      console.error('Test: prev() failed:', error.message);
      return { success: false, error: error.message };
    }
  });

  console.log('Direct prev() test result:', result);

  // Test should complete without errors
  expect(result.success).toBe(true);
});
