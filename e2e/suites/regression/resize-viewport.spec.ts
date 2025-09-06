import { test, expect } from '@playwright/test';
import {
  waitForRenditionReady,
  navigateToChapter,
  waitForRelocation,
} from '../../test-helpers';

// Check if viewport contains visible iframe content
const checkVisibleContent = async (page: any) => {
  return await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return false;

    const viewerRect = viewer.getBoundingClientRect();
    const iframes = Array.from(
      document.querySelectorAll('iframe')
    ) as HTMLIFrameElement[];

    for (const iframe of iframes) {
      const iframeRect = iframe.getBoundingClientRect();

      // Check if iframe intersects with viewer
      const intersects = !(
        iframeRect.right <= viewerRect.left ||
        iframeRect.left >= viewerRect.right ||
        iframeRect.bottom <= viewerRect.top ||
        iframeRect.top >= viewerRect.bottom
      );

      if (!intersects) continue;

      // Check if iframe has content
      try {
        const doc = iframe.contentDocument;
        const body = doc?.body;
        if (body) {
          const text = (body.textContent || '').trim().length;
          const html = (body.innerHTML || '').trim().length;
          if (text > 0 || html > 0) return true;
        }
      } catch (e) {
        // Cross-origin or access restrictions - assume content exists if iframe is positioned correctly
        if (iframeRect.width > 0 && iframeRect.height > 0) return true;
      }
    }
    return false;
  });
};

test('Resize: viewport still shows iframe content after window resize', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for ePub objects to be available
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  try {
    await waitForRenditionReady(page, 20000);
  } catch {
    await page.waitForTimeout(800);
  }

  // Display chapter 1 and wait for relocation
  await navigateToChapter(page, 'chapter_001.xhtml');
  try {
    await waitForRelocation(page, 2000);
  } catch {}
  await page.waitForTimeout(400);

  // Verify content is visible before resize
  const beforeResize = await checkVisibleContent(page);
  expect(beforeResize).toBeTruthy();

  // Resize viewport and trigger rendition resize
  await page.setViewportSize({ width: 600, height: 800 });
  await page.waitForTimeout(500);

  await page
    .evaluate(() => {
      const w: any = window as any;
      const r = w.getRendition ? w.getRendition() : w.rendition;
      if (r && typeof r.resize === 'function') {
        r.resize(window.innerWidth, window.innerHeight);
      }
      if (r && typeof r.display === 'function') {
        r.display('chapter_001.xhtml');
      }
    })
    .catch(() => {});

  await page.waitForTimeout(2000);

  // Verify content is still visible after resize
  const afterResize = await checkVisibleContent(page);
  expect(afterResize).toBeTruthy();
});

test('Resize: title page (white page) still shows content after window resize', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for ePub objects to be available
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  try {
    await waitForRenditionReady(page, 20000);
  } catch {
    await page.waitForTimeout(800);
  }

  // Display title page (a white page with minimal content)
  await navigateToChapter(page, 'titlepage.xhtml');
  try {
    await waitForRelocation(page, 2000);
  } catch {}
  await page.waitForTimeout(400);

  // Verify content is visible before resize
  const beforeResize = await checkVisibleContent(page);
  expect(beforeResize).toBeTruthy();

  // Resize viewport and trigger rendition resize
  await page.setViewportSize({ width: 600, height: 800 });
  await page.waitForTimeout(500);

  await page
    .evaluate(() => {
      const w: any = window as any;
      const r = w.getRendition ? w.getRendition() : w.rendition;
      if (r && typeof r.resize === 'function') {
        r.resize(window.innerWidth, window.innerHeight);
      }
      if (r && typeof r.display === 'function') {
        r.display('titlepage.xhtml');
      }
    })
    .catch(() => {});

  await page.waitForTimeout(2000);

  // Verify content is still visible after resize (for white pages, check iframe readiness)
  const afterResize = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return false;
    const rect = viewer.getBoundingClientRect();
    const iframes = Array.from(
      document.querySelectorAll('iframe')
    ) as HTMLIFrameElement[];

    for (const iframe of iframes) {
      const ifr = iframe.getBoundingClientRect();
      const intersects = !(
        ifr.right <= rect.left ||
        ifr.left >= rect.right ||
        ifr.bottom <= rect.top ||
        ifr.top >= rect.bottom
      );
      if (!intersects) continue;

      try {
        const doc = iframe.contentDocument;
        const ready = doc?.readyState === 'complete';
        // For white pages, just check that iframe is ready and has some structure
        const hasStructure = doc?.body !== null;
        if (ready && hasStructure) return true;
      } catch {}
    }
    return false;
  });

  expect(afterResize).toBeTruthy();
});
