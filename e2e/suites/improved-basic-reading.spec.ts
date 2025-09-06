import { test, expect } from '@playwright/test';
import { EPUB_TEST_DATASET } from '../test-dataset';

/**
 * Basic EPUB Reading Tests
 * 
 * This suite tests:
 * 1. Reading a book from a URL
 * 2. Reading a book from disk (Alice)
 */

test.describe('Basic EPUB Reading Tests', () => {
  test('can open and read an EPUB from URL', async ({ page, baseURL }) => {
    // Use a reasonable timeout
    test.setTimeout(60_000);
    
    // Get page console logs for debugging
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(msg.text());
    });
    
    try {
      // Go to the examples page which loads the EPUB.js library
      await page.goto(`${baseURL}/examples/index.html`);
      
      // Wait for the library to load and expose window.ePub
      await page.waitForFunction(
        () => (window as any).ePub && typeof (window as any).ePub === 'function',
        { timeout: 10000 }
      );
      
      // Create the viewer element
      await page.evaluate(() => {
        const viewer = document.createElement('div');
        viewer.id = 'viewer';
        viewer.style.width = '800px';
        viewer.style.height = '600px';
        viewer.style.margin = '0 auto';
        viewer.style.border = '1px solid #ccc';
        document.body.appendChild(viewer);
        return true;
      });
      
      // Use a known-working URL from the EPUB_TEST_DATASET
      const bookUrl = 'https://s3.amazonaws.com/epubjs/books/alice.epub';
      
      // Load book directly in the page
      const bookStatus = await page.evaluate(async (url) => {
        try {
          // Create the book object
          const book = (window as any).ePub(url);
          
          // Set up global references for debugging
          (window as any).book = book;
          
          try {
            // Wait for the book to open
            await book.opened;
            
            // Create a rendition
            const rendition = book.renderTo('viewer', {
              width: 800,
              height: 600,
              spread: 'none'
            });
            
            // Set global rendition for debugging
            (window as any).rendition = rendition;
            
            // Display the first page
            await rendition.display();
            
            return {
              success: true,
              isOpen: !!book.isOpen,
              hasPackaging: !!(book.packaging && book.packaging.metadata),
              title: book.packaging?.metadata?.title || '',
              creator: book.packaging?.metadata?.creator || '',
              spine: book.spine?.items?.length || 0,
              hasRendition: !!rendition,
              error: null
            };
          } catch (openError) {
            return {
              success: false,
              isOpen: !!book.isOpen,
              error: openError.toString(),
              errorType: 'open_error',
              errorDetails: {
                message: openError.message,
                stack: openError.stack
              }
            };
          }
        } catch (initError) {
          return {
            success: false,
            error: initError.toString(),
            errorType: 'init_error',
            errorDetails: {
              message: initError.message,
              stack: initError.stack
            }
          };
        }
      }, bookUrl);
      
      console.log('Remote EPUB loading status:', bookStatus);
      
      // Check if the book loaded successfully
      if (bookStatus.success) {
        expect(bookStatus.isOpen).toBe(true);
        expect(bookStatus.hasPackaging).toBe(true);
        expect(bookStatus.spine).toBeGreaterThan(0);
        expect(bookStatus.title).toContain('Alice');
      } else {
        // If failed due to network issues, skip test rather than fail
        if (bookStatus.error && 
            (bookStatus.error.includes('fetch') || 
             bookStatus.error.includes('network') ||
             bookStatus.error.includes('CORS'))) {
          console.log(`Network error loading remote EPUB: ${bookStatus.error}`);
          test.skip();
        } else {
          // Otherwise, mark test as failed
          console.log(`Failed to load remote EPUB: ${bookStatus.error}`);
          expect(bookStatus.success).toBe(true);
        }
      }
      
      // Take a screenshot for diagnostic purposes
      await page.screenshot({ path: 'test-results/remote-epub-final.png' });
    } catch (error) {
      // Catch any other errors during test execution
      console.error('Unhandled test error:', error);
      console.log('Browser logs:', logs.slice(-10));
      expect(false).toBe(true);
    }
  });

  test('can open and read an EPUB from disk (Alice)', async ({ page, baseURL }) => {
    test.setTimeout(60_000); // increase timeout for local file loading
    
    // Navigate to test page with local Alice EPUB
    await page.goto(`${baseURL}/examples/index.html`);

    // Wait for the library to load
    await page.waitForFunction(() => (window as any).ePub && typeof (window as any).ePub === 'function');
    
    // Create the viewer element
    await page.evaluate(() => {
      const viewer = document.createElement('div');
      viewer.id = 'viewer';
      viewer.style.width = '800px';
      viewer.style.height = '600px';
      viewer.style.margin = '0 auto';
      viewer.style.border = '1px solid #ccc';
      document.body.appendChild(viewer);
      return true;
    });
    
    // Load local EPUB file
    const opened = await page.evaluate(async () => {
      const book = (window as any).ePub('/e2e/fixtures/alice.epub');
      await book.opened;
      
      // Create a rendition
      const rendition = book.renderTo('viewer', {
        width: 800,
        height: 600,
        spread: 'none'
      });
      
      // Set global references for debugging
      (window as any).book = book;
      (window as any).rendition = rendition;
      
      // Display the first page
      await rendition.display();
      
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
