import { test, expect } from '@playwright/test';

/**
 * Basic EPUB Reading Tests
 * 
 * This simplified test suite focuses on:
 * - Reading a local EPUB file reliably
 */

test.describe('Basic EPUB Reading Tests', () => {
  test('can open and read an EPUB from disk (Alice)', async ({ page, baseURL }) => {
    // Use a reasonable timeout
    test.setTimeout(30_000);
    
    // Go to the simple epub test page
    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);
    
    // Wait for the library to load
    await page.waitForFunction(() => 
      (window as any).ePub !== undefined, 
      { timeout: 5000 }
    );
    
    // Load the local EPUB file
    const bookInfo = await page.evaluate(async () => {
      try {
        // Use the direct approach from epub.spec.ts
        const book = (window as any).ePub('/e2e/fixtures/alice.epub');
        
        // Wait for book to open
        await book.opened;
        
        // Store for testing/debugging
        (window as any).book = book;
        
        return {
          success: true,
          isOpen: book.isOpen === true,
          hasArchive: book.archive !== undefined,
          metadata: book.packaging?.metadata ? {
            title: book.packaging.metadata.title,
            creator: book.packaging.metadata.creator
          } : null,
          spineCount: book.spine?.items?.length || 0
        };
      } catch (error) {
        return {
          success: false,
          error: String(error)
        };
      }
    });
    
    console.log('Book info:', bookInfo);
    
    // Verify that the book opened successfully
    expect(bookInfo.success).toBe(true);
    expect(bookInfo.isOpen).toBe(true);
    expect(bookInfo.hasArchive).toBe(true);
    expect(bookInfo.metadata?.title).toContain('Alice');
    expect(bookInfo.spineCount).toBeGreaterThan(0);
  });
});
