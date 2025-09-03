import { test, expect } from '@playwright/test';

test.describe('iframe sandboxing regression', () => {
  test('should handle iframe sandboxing and script execution blocks correctly', async ({
    page,
  }) => {
    // Listen for console errors, especially sandboxing errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (
        msg.type() === 'error' ||
        msg.text().includes('Blocked script execution')
      ) {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:8080/examples/prerendering-example.html');

    // Wait for book to load
    await page.waitForSelector('#viewer iframe');

    // === Step 1: Navigate to chapter 1 initially ===
    await page.evaluate(() => {
      const win: any = window as any;
      const rend = win.getRendition ? win.getRendition() : win.rendition;
      if (rend) rend.display('chapter_001.xhtml');
    });

    // Wait for chapter to load and check for sandboxing errors
    await page.waitForTimeout(2000);

    const firstIframeState = await page.evaluate(() => {
      const iframe = document.querySelector(
        '#viewer iframe'
      ) as HTMLIFrameElement;
      if (!iframe) return { error: 'No iframe found' };

      try {
        const doc = iframe.contentDocument;
        if (!doc)
          return {
            error: 'Cannot access iframe content - sandboxing issue?',
            src: iframe.src,
            srcdoc: iframe.srcdoc?.substring(0, 100) + '...',
          };

        return {
          textContent: doc.body?.textContent?.length || 0,
          innerHTML: doc.body?.innerHTML?.length || 0,
          hasContent: (doc.body?.textContent?.length || 0) > 0,
          snippet: doc.body?.textContent?.substring(0, 100) || 'No content',
          sandboxAttribute: iframe.getAttribute('sandbox'),
          src: iframe.src,
          srcdocLength: iframe.srcdoc?.length || 0,
        };
      } catch (e) {
        return {
          error: `Error accessing iframe: ${e.message}`,
          sandboxAttribute: iframe.getAttribute('sandbox'),
        };
      }
    });

    console.log('=== FIRST LOAD IFRAME STATE ===');
    console.log(JSON.stringify(firstIframeState, null, 2));

    // === Step 2: Navigate to epigraph ===
    await page.evaluate(() => {
      const win: any = window as any;
      const rend = win.getRendition ? win.getRendition() : win.rendition;
      if (rend) rend.display('epigraph_001.xhtml');
    });

    await page.waitForTimeout(2000);

    // === Step 3: Navigate BACK to chapter 1 (checking for regression) ===
    await page.evaluate(() => {
      const win: any = window as any;
      const rend = win.getRendition ? win.getRendition() : win.rendition;
      if (rend) rend.display('chapter_001.xhtml');
    });

    // Wait longer and check multiple times for content stability
    await page.waitForTimeout(3000);

    const secondIframeState = await page.evaluate(() => {
      const iframe = document.querySelector(
        '#viewer iframe'
      ) as HTMLIFrameElement;
      if (!iframe) return { error: 'No iframe found' };

      try {
        const doc = iframe.contentDocument;
        if (!doc)
          return {
            error: 'Cannot access iframe content - sandboxing issue?',
            src: iframe.src,
            srcdoc: iframe.srcdoc?.substring(0, 100) + '...',
          };

        return {
          textContent: doc.body?.textContent?.length || 0,
          innerHTML: doc.body?.innerHTML?.length || 0,
          hasContent: (doc.body?.textContent?.length || 0) > 0,
          snippet: doc.body?.textContent?.substring(0, 100) || 'No content',
          sandboxAttribute: iframe.getAttribute('sandbox'),
          src: iframe.src,
          srcdocLength: iframe.srcdoc?.length || 0,
        };
      } catch (e) {
        return {
          error: `Error accessing iframe: ${e.message}`,
          sandboxAttribute: iframe.getAttribute('sandbox'),
        };
      }
    });

    console.log('=== SECOND LOAD IFRAME STATE ===');
    console.log(JSON.stringify(secondIframeState, null, 2));

    console.log('=== CONSOLE ERRORS ===');
    console.log(consoleErrors);

    // Check for sandboxing errors
    const hasSandboxingErrors = consoleErrors.some(
      (error) =>
        error.includes('Blocked script execution') ||
        error.includes('sandboxed')
    );

    if (hasSandboxingErrors) {
      console.log(
        '⚠️ SANDBOXING ERRORS DETECTED - This may cause content issues'
      );
    }

    // Assertions
    if (secondIframeState.error) {
      console.log(`❌ IFRAME ACCESS ERROR: ${secondIframeState.error}`);
    } else {
      expect(secondIframeState.hasContent).toBeTruthy();
      expect(secondIframeState.textContent).toBeGreaterThan(1000);
      expect(secondIframeState.snippet).toContain('Loomings');
    }

    // Check that we don't have excessive sandboxing errors
    expect(
      consoleErrors.filter((e) => e.includes('Blocked script execution')).length
    ).toBeLessThan(10);
  });
});
