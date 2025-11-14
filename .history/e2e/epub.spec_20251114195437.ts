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
    await book.ready; // Wait for ready instead of opened to ensure hash is calculated

    return {
      isOpen: !!book.isOpen,
      url:
        book.url && book.url.toString ? book.url.toString() : String(book.url),
      hasArchive: !!book.archive,
      // expose the book hash for verification
      bookHash: await book.getBookHash(),
    };
  });

  expect(opened.isOpen).toBe(true);
  // allow either absolute or relative url endings
  expect(
    opened.url.endsWith('/fixtures/alice/OPS/package.opf') ||
      opened.url.endsWith('/e2e/fixtures/alice/OPS/package.opf')
  ).toBe(true);
  expect(opened.hasArchive).toBe(false);
  // bookHash should be a non-empty uppercase hex string for directory-based epub too
  expect(typeof opened.bookHash).toBe('string');
  expect(opened.bookHash.length).toBeGreaterThan(0);
  expect(/^[A-F0-9]+$/.test(opened.bookHash)).toBe(true);

  // OPEN ARCHIVED EPUB (.epub)
  const archived = await page.evaluate(async () => {
    const book = (window as any).ePub('/e2e/fixtures/alice.epub');
    await book.opened;
    return {
      isOpen: !!book.isOpen,
      hasArchive: !!book.archive,
      // expose the book hash for verification
      bookHash: await book.getBookHash(),
    };
  });

  expect(archived.isOpen).toBe(true);
  expect(archived.hasArchive).toBe(true);
  // bookHash should be a non-empty uppercase hex string when opened from an archived epub
  expect(typeof archived.bookHash).toBe('string');
  expect(archived.bookHash.length).toBeGreaterThan(0);
  expect(/^[A-F0-9]+$/.test(archived.bookHash)).toBe(true);

  // Both books should have the same hash since they're the same content
  expect(archived.bookHash).toBe(opened.bookHash);
});
