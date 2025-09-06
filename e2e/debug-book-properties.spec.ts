import { test, expect } from '@playwright/test';

test('debug all book properties for local Alice EPUB', async ({ page, baseURL }) => {
  test.setTimeout(60_000);

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for the library to load
  await page.waitForFunction(
    () => (window as any).ePub && typeof (window as any).ePub === 'function'
  );

  // Load remote Moby Dick EPUB and check all relevant properties
  const bookInfo = await page.evaluate(async () => {
    const book = (window as any).ePub('https://s3.amazonaws.com/moby-dick/moby-dick.epub');
    await book.opened;

    return {
      url: book.url?.toString() || 'no-url',
      urlType: typeof book.url,
      path: book.path || 'no-path',
      pathType: typeof book.path,
      filename: book.filename || 'no-filename',
      isOpen: !!book.isOpen,
      hasArchive: !!book.archive,
      // Check if there are other URL-like properties
      originalUrl: book.originalUrl || 'no-originalUrl',
      source: book.source || 'no-source',
    };
  });

  console.log('Complete Book Info:', JSON.stringify(bookInfo, null, 2));
  
  // This test is just for debugging, so just verify basic functionality
  expect(bookInfo.isOpen).toBe(true);
  expect(bookInfo.hasArchive).toBe(true);
});
