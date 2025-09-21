import { test, expect } from '@playwright/test';

test('open epub in real browser', async ({ page, baseURL }) => {
  // increase per-test timeout a bit for slow CI/machines
  test.setTimeout(60_000);

  await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

  // wait for the library to load and expose window.ePub
  await page.waitForFunction(
    () => (window as any).ePub && typeof (window as any).ePub === 'function',
    { timeout: 10000 }
  );

  // OPEN OPF (directory based epub)
  const opened = await page.evaluate(async () => {
    const book = (window as any).ePub('/e2e/fixtures/alice/OPS/package.opf');
    await book.opened;
    return {
      isOpen: !!book.isOpen,
      url:
        book.url && book.url.toString ? book.url.toString() : String(book.url),
    };
  });

  expect(opened.isOpen).toBe(true);
  // allow either absolute or relative url endings
  expect(
    opened.url.endsWith('/fixtures/alice/OPS/package.opf') ||
      opened.url.endsWith('/e2e/fixtures/alice/OPS/package.opf')
  ).toBe(true);

  // OPEN ARCHIVED EPUB (.epub)
  const archived = await page.evaluate(async () => {
    const book = (window as any).ePub('/e2e/fixtures/alice.epub');
    await book.opened;
    return {
      isOpen: !!book.isOpen,
      hasArchive: !!book.archive,
    };
  });

  expect(archived.isOpen).toBe(true);
  expect(archived.hasArchive).toBe(true);
});
