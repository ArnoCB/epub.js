import { test, expect } from '@playwright/test';
import { EPUB_TEST_DATASET } from '../test-dataset';
import { navigateToChapter, verifyViewportContent, waitForRenditionReady, waitForRelocation } from '../test-helpers';

/**
 * EPUB Navigation Tests
 * 
 * This suite tests:
 * 1. Basic navigation (next, previous)
 * 2. Chapter-to-chapter navigation
 * 3. Navigation edge cases
 * 4. Viewport visibility tests to detect white pages
 */

test.describe('EPUB Navigation Tests', () => {
  
  test('Next navigation shows content in viewport (no white page)', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for rendition
    await page.waitForFunction(() => typeof (window as any).ePub === 'function');
    await page.waitForFunction(() => !!(window as any).getRendition, { timeout: 10000 });

    // Go to chapter 1 explicitly to normalize start
    await navigateToChapter(page, 'chapter_001.xhtml');
    await page.waitForTimeout(800);

    // Click Next (forward)
    await page.click('#next');
    await waitForRelocation(page);

    // Verify content is visible in viewport
    const center = await verifyViewportContent(page);
    
    // Assertions: must be intersecting (visible) and have content
    expect(center.ok).toBeTruthy();
    expect(center.intersects, 'iframe should intersect viewer center').toBeTruthy();
    expect(center.text, 'iframe under center should have text content').toBeGreaterThan(0);
  });

  test('Previous navigation shows content in viewport (no white page)', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for rendition
    await page.waitForFunction(() => typeof (window as any).ePub === 'function');
    await page.waitForFunction(() => !!(window as any).getRendition, { timeout: 10000 });

    // Go to chapter 1 explicitly to normalize start
    await navigateToChapter(page, 'chapter_001.xhtml');
    await page.waitForTimeout(800);

    // Click Prev (scroll-back)
    await page.click('#prev');
    await waitForRelocation(page);

    // Verify content is visible in viewport
    const center = await verifyViewportContent(page);
    
    // Assertions: must be intersecting (visible) and have content
    expect(center.ok).toBeTruthy();
    expect(center.intersects, 'iframe should intersect viewer center').toBeTruthy();
    expect(center.text, 'iframe under center should have text content').toBeGreaterThan(0);
  });

  test('Mid-chapter scroll shows content in viewport (no white page)', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for rendition
    await page.waitForFunction(() => typeof (window as any).ePub === 'function');
    await page.waitForFunction(() => !!(window as any).getRendition, { timeout: 10000 });

    // Jump to a chapter with multiple pages (wide content)
    await navigateToChapter(page, 'chapter_002.xhtml');

    // Wait for a view to be attached (iframe present inside viewer)
    await page.waitForFunction(
      () => {
        const viewer = document.getElementById('viewer');
        return !!viewer && !!viewer.querySelector('.epub-view iframe');
      },
      { timeout: 10000 }
    );

    // Scroll to the middle of the chapter using the manager's scrollTo
    await page.evaluate(() => {
      const w = window as any;
      const rendition = w.getRendition ? w.getRendition() : w.rendition;
      const mgr = rendition?.manager;
      const viewer = document.getElementById('viewer');
      if (!mgr || !viewer) return;
      const pageWidth = Math.floor(viewer.getBoundingClientRect().width) || 900;

      // Target a mid-chapter scrollLeft: two pages in (to avoid edges)
      const target = pageWidth * 2;
      if (typeof mgr.scrollTo === 'function') {
        mgr.scrollTo(target, 0, true);
      } else if (viewer) {
        viewer.scrollLeft = target;
      }
    });

    // Wait for scroll to settle
    await page.waitForTimeout(1000);

    // Verify content is visible in viewport
    const center = await verifyViewportContent(page);
    
    // Assertions: must be intersecting (visible) and have content
    expect(center.ok).toBeTruthy();
    expect(center.intersects, 'iframe should intersect viewer center').toBeTruthy();
    expect(center.text, 'iframe under center should have text content').toBeGreaterThan(0);
  });

  test('Epigraph -> prev navigation should not produce white page', async ({ page, baseURL }) => {
    // Load the prerendering example
    await page.goto(`${baseURL}/examples/prerendering-example.html`);

    // Wait for library and rendition to start
    await page.waitForFunction(() => typeof (window as any).ePub === 'function');
    await page.waitForFunction(() => !!(window as any).getPreRenderer || !!(window as any).getRendition, { timeout: 10000 });

    // Navigate programmatically to epigraph_001.xhtml
    await navigateToChapter(page, 'epigraph_001.xhtml');

    // Wait for relocated event showing epigraph
    await page.waitForFunction(
      () => {
        const w = window as any;
        const last = w.__lastRelocated || null;
        return (
          last &&
          last.start &&
          last.start.href &&
          last.start.href.indexOf('epigraph_001.xhtml') !== -1
        );
      },
      { timeout: 10000 }
    );

    // Click prev (simulate user going back to intro)
    await page.click('#prev');

    // Wait a bit and assert that the viewer iframe document has content
    const hasContent = await page.waitForFunction(
      () => {
        const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement;
        if (!iframe) return false;
        try {
          const doc = iframe.contentDocument;
          const text = doc && doc.body ? doc.body.textContent || '' : '';
          // Must have SOME visible content
          return text.trim().length > 0;
        } catch (e) {
          return false;
        }
      },
      { timeout: 5000 }
    );

    expect(hasContent).toBeTruthy();

    // Additional check to verify content visibility in viewport
    const center = await verifyViewportContent(page);
    expect(center.ok).toBeTruthy();
    expect(center.intersects).toBeTruthy();
    expect(center.text).toBeGreaterThan(0);
  });
});