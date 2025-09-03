import { test, expect } from '@playwright/test';

// Failing regression: after navigating Prev from chapter_001.xhtml, the viewer's center must show an iframe with content.
// This catches cases where container scrollLeft points into a phantom/empty area (white page) even though iframes exist off-screen.

test('Prev from chapter 1: viewport center shows visible iframe with content', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for rendition
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Go to chapter 1 explicitly to normalize start
  await page.evaluate(() => {
    const w: any = window as any;
    (w.getRendition ? w.getRendition() : w.rendition).display(
      'chapter_001.xhtml'
    );
  });
  await page.waitForTimeout(800);

  // Click Prev (scroll-back)
  await page.click('#prev');

  // Wait until relocation event fires to ensure navigation settled
  await page.waitForFunction(() => !!(window as any).__lastRelocated, {
    timeout: 2000,
  });

  // Inspect the element under the center of the viewer and validate it is the iframe with non-empty content
  const center = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return { ok: false, reason: 'no-viewer' };
    const rect = viewer.getBoundingClientRect();
    const cx = Math.floor(rect.left + rect.width / 2);
    const cy = Math.floor(rect.top + rect.height / 2);

    // Use the full stack at the center and pick the topmost iframe to avoid pseudo overlays
    const stack = (document as any).elementsFromPoint?.(cx, cy) as
      | Element[]
      | undefined;
    let iframe: HTMLIFrameElement | null = null;
    if (Array.isArray(stack)) {
      iframe =
        (stack.find(
          (e) => e instanceof HTMLIFrameElement
        ) as HTMLIFrameElement) || null;
    }
    // Fallback to elementFromPoint walk only if needed
    if (!iframe) {
      const el = document.elementFromPoint(cx, cy) as Element | null;
      let cur: Element | null = el;
      while (cur) {
        if (cur instanceof HTMLIFrameElement) {
          iframe = cur as HTMLIFrameElement;
          break;
        }
        cur = cur.parentElement;
      }
    }
    if (!iframe) return { ok: false, reason: 'no-iframe-under-center' };

    // Check intersection with viewer to ensure it is actually visible
    const ifr = iframe.getBoundingClientRect();
    const intersects = !(
      ifr.right <= rect.left ||
      ifr.left >= rect.right ||
      ifr.bottom <= rect.top ||
      ifr.top >= rect.bottom
    );

    let text = 0,
      html = 0,
      ready = 'unknown';
    try {
      const doc = iframe.contentDocument;
      const body = doc?.body;
      ready = doc?.readyState || 'unknown';
      text = (body?.textContent || '').trim().length;
      html = (body?.innerHTML || '').trim().length;
    } catch {}

    return { ok: true, intersects, ready, text, html };
  });

  // Assertions: must be intersecting (visible) and have content
  expect(center.ok).toBeTruthy();
  expect(
    center.intersects,
    'iframe should intersect viewer center'
  ).toBeTruthy();
  expect(
    center.text,
    'iframe under center should have text content'
  ).toBeGreaterThan(0);
  expect(
    center.html,
    'iframe under center should have html content'
  ).toBeGreaterThan(0);
});
