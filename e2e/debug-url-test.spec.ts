import { test, expect } from '@playwright/test';

test('debug book.url value for Alice EPUB', async ({ page, baseURL }) => {
  test.setTimeout(60_000);

  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for the library to load
  await page.waitForFunction(
    () => (window as any).ePub && typeof (window as any).ePub === 'function'
  );

  // Load remote EPUB and check URL  
  const urlInfo = await page.evaluate(async () => {
    const book = (window as any).ePub('https://s3.amazonaws.com/moby-dick/moby-dick.epub');
    await book.opened;

    return {
      url: book.url?.toString() || 'no-url',
      urlType: typeof book.url,
      isOpen: !!book.isOpen,
      hasArchive: !!book.archive,
    };
  });

  console.log('Book URL Info:', urlInfo);
  
  // Just log the results
  expect(urlInfo.isOpen).toBe(true);
});
