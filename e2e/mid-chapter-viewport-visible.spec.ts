import { test, expect } from '@playwright/test';

// Repro: after scrolling within a single chapter to a mid-page position, the viewport center
// should still show a visible iframe with non-empty content (no white pages).

test('Mid-chapter: viewport center shows visible iframe with content', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for rendition
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Jump to a chapter with multiple pages (wide content)
  await page.evaluate(() => {
    const w: any = window as any;
    (w.getRendition ? w.getRendition() : w.rendition).display(
      'chapter_002.xhtml'
    );
  });

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
    const w: any = window as any;
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

  // Give layout a moment to settle
  await page.waitForTimeout(200);

  // Inspect the element under the center of the viewer and validate it is the iframe with non-empty content
  const center = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return { ok: false, reason: 'no-viewer' };
    const rect = viewer.getBoundingClientRect();
    const cx = Math.floor(rect.left + rect.width / 2);
    const cy = Math.floor(rect.top + rect.height / 2);

    // Use the full stack at the center and pick the topmost iframe to avoid overlays
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
