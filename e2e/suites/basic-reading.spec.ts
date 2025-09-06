import { test, expect } from '@playwright/test';
import { EPUB_TEST_DATASET } from '../test-dataset';

/**
 * Basic EPUB Reading Tests
 * 
 * This suite tests:
 * 1. Reading a book from a URL (Moby Dick)
 * 2. Reading a book from disk (Alice)
 */

test.describe('Basic EPUB Reading Tests', () => {
  test('can open and read an EPUB from URL (Moby Dick)', async ({ page, baseURL }) => {
    // increase per-test timeout for remote content
    test.setTimeout(120_000);
    test.slow(); // Mark as a slow test

    // Get page console logs for debugging
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(msg.text());
    });
    
    // Navigate to a minimal test page to avoid any example-specific issues
    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);
    
    try {
      // Wait for the EPUB.js library to be loaded
      await page.waitForFunction(() => (window as any).ePub && typeof (window as any).ePub === 'function');
      
      // Create a viewer element
      await page.evaluate(() => {
        const viewer = document.getElementById('viewer');
        if (!viewer) {
          throw new Error('Viewer element not found');
        }
        return true;
      });
      
      // Use the full book URL (not just the package.opf)
      const bookStatus = await page.evaluate(async () => {
        try {
          // Create a book instance with the Moby Dick URL
          const book = (window as any).ePub('https://s3.amazonaws.com/moby-dick/moby-dick.epub');
          
          // Set a global reference for debugging
          (window as any).book = book;
          
          // Wait for the book to open
          await book.opened;
          
          // Create a rendition
          const rendition = book.renderTo('viewer', {
            width: 800,
            height: 600
          });
          
          // Set global reference for debugging
          (window as any).rendition = rendition;
          
          // Display the first page
          await rendition.display();
          
          return {
            success: true,
            isOpen: !!book.isOpen,
            hasPackaging: !!(book.packaging && book.packaging.metadata),
            title: book.packaging?.metadata?.title || '',
            spine: book.spine?.items?.length || 0,
            rendition: !!rendition
          };
        } catch (e) {
          console.error('Error loading book:', e);
          return {
            success: false,
            error: e.message,
            stack: e.stack
          };
        }
      });
      
      console.log('Remote EPUB loading result:', bookStatus);
      
      // If successful, check the book details
      if (bookStatus.success) {
        expect(bookStatus.isOpen).toBe(true);
        expect(bookStatus.hasPackaging).toBe(true);
        
        if (bookStatus.title) {
          expect(bookStatus.title).toContain('Moby');
        }
        
        if (bookStatus.spine) {
          expect(bookStatus.spine).toBeGreaterThan(10);
        }
      } else {
        console.log('Remote EPUB test failed to load properly');
        
        // Take a screenshot for diagnostics
        await page.screenshot({ path: 'test-results/moby-dick-debug.png', fullPage: true });
        console.log('Debug screenshot saved to test-results/moby-dick-debug.png');
        
        // Fail the test with the error message from the book loading
        expect(bookStatus.error).toBeUndefined();
      }
    } catch (error) {
      console.log('Remote EPUB test diagnostics:');
      console.log('Error:', error.message);
      console.log('Recent console logs:', logs.slice(-20));
      
      // Take a screenshot of the current state
      try {
        await page.screenshot({ path: 'test-results/moby-dick-debug.png', fullPage: true });
        console.log('Debug screenshot saved to test-results/moby-dick-debug.png');
      } catch (screenshotError) {
        console.log('Could not take screenshot:', screenshotError.message);
      }
      
      // Fail the test
      expect(error).toBeUndefined();
    }
  });

  test('can open and read an EPUB from disk (Alice)', async ({ page, baseURL }) => {
    test.setTimeout(60_000); // increase timeout for local file loading
    
    // Navigate to test page with local Alice EPUB
    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

    // Wait for the library to load
    await page.waitForFunction(() => (window as any).ePub && typeof (window as any).ePub === 'function');
    
    // Load local EPUB file
    const opened = await page.evaluate(async () => {
      const book = (window as any).ePub('/e2e/fixtures/alice.epub');
      await book.opened;
      
      return {
        isOpen: !!book.isOpen,
        hasArchive: !!book.archive,
        metadata: book.packaging ? {
          title: book.packaging.metadata.title,
          creator: book.packaging.metadata.creator,
        } : null,
        spine: book.spine ? book.spine.items.length : 0,
      };
    });

    expect(opened.isOpen).toBe(true);
    expect(opened.hasArchive).toBe(true);
    expect(opened.metadata).toBeTruthy();
    expect(opened.metadata?.title).toContain('Alice');
    expect(opened.spine).toBeGreaterThan(0);
  });
});
