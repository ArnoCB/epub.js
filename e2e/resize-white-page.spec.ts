import { test, expect } from '@playwright/test';
import {
  waitForRenditionReady,
  navigateToChapter,
  waitForRelocation,
} from './test-helpers';

test('Resize: white page (title page) remains visible after window resize', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for ePub objects to be available
  await page.waitForFunction(
    () => typeof (window as any).ePub === 'function'
  );
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  try {
    await waitForRenditionReady(page, 20000);
  } catch {
    await page.waitForTimeout(800);
  }

  // Navigate to title page (a white page with minimal content)
  await navigateToChapter(page, 'titlepage.xhtml');
  try {
    await waitForRelocation(page, 2000);
  } catch {}
  await page.waitForTimeout(400);

  // Check that title page is visible before resize
  const beforeResize = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return false;
    const rect = viewer.getBoundingClientRect();
    const iframes = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[];
    
    for (const iframe of iframes) {
      const ifr = iframe.getBoundingClientRect();
      const intersects = !(
        ifr.right <= rect.left ||
        ifr.left >= rect.right ||
        ifr.bottom <= rect.top ||
        ifr.top >= rect.bottom
      );
      if (intersects) return true;
    }
    return false;
  });

  expect(beforeResize).toBeTruthy();

  // Resize viewport and trigger rendition resize
  await page.setViewportSize({ width: 600, height: 800 });
  await page.waitForTimeout(500);
  await page
    .evaluate(() => {
      const w: any = window as any;
      const r = w.getRendition ? w.getRendition() : w.rendition;
      if (r && typeof r.resize === 'function')
        r.resize(window.innerWidth, window.innerHeight);
    })
    .catch(() => {});
  await page.waitForTimeout(2000);

  // Check that title page is still visible after resize
  const afterResize = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return false;
    const rect = viewer.getBoundingClientRect();
    const iframes = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[];
    
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
        const body = doc && doc.body;
        // For white pages, we just need to check that the iframe is present and has some content
        const hasContent = body && (body.innerHTML.trim().length > 0);
        if (hasContent) return true;
      } catch {}
    }
    return false;
  });

  expect(afterResize).toBeTruthy();
});
