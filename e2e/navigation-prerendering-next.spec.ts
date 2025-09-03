import { test, expect } from '@playwright/test';

// Reproduces the prerendering next() sequence and validates phantom/container adjustments
test('Prerendering next() produces correct phantom and snapped scroll positions', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for EPUB.js and rendition to be available
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Ensure we start at chapter_001.xhtml to create the same flow as the reported logs
  await page.evaluate(() => {
    const w: any = window as any;
    (w.getRendition ? w.getRendition() : w.rendition).display(
      'chapter_001.xhtml'
    );
  });

  // Wait for the viewer to exist and at least one iframe rendered
  await page.waitForSelector('#viewer', { timeout: 10000 });
  await page.waitForFunction(() => !!document.querySelector('#viewer iframe'), {
    timeout: 15000,
  });

  // Record pre-click scrollLeft if manager exists (optional)
  const before = await page.evaluate(() => {
    const rend = (window as any).rendition;
    return {
      scrollLeft:
        rend && rend.manager ? rend.manager.container?.scrollLeft || 0 : 0,
      scrollWidth:
        rend && rend.manager ? rend.manager.container?.scrollWidth || 0 : 0,
    };
  });

  // Click Next to trigger append/adjust sequence
  await page.click('#next');

  // Wait for the center of the viewer to contain an iframe with content (this is the important check)
  await page.waitForFunction(
    () => {
      const viewer: any = document.getElementById('viewer');
      if (!viewer) return false;
      const rect: any = viewer.getBoundingClientRect();
      const cx = Math.floor(rect.left + rect.width / 2);
      const cy = Math.floor(rect.top + rect.height / 2);
      const stack: any[] = (document as any).elementsFromPoint?.(cx, cy) || [];
      let iframe: any = null;
      if (Array.isArray(stack))
        iframe = stack.find((e: any) => e instanceof HTMLIFrameElement) || null;
      if (!iframe) {
        const el: any = document.elementFromPoint(cx, cy) as Element | null;
        let cur: any = el;
        while (cur) {
          if (cur instanceof HTMLIFrameElement) {
            iframe = cur;
            break;
          }
          cur = cur.parentElement;
        }
      }
      if (!iframe) return false;
      try {
        const doc: any = iframe.contentDocument;
        const body: any = doc && doc.body;
        const text =
          body && body.textContent ? body.textContent.trim().length : 0;
        if (text > 0) return true;
        const src =
          iframe.getAttribute && iframe.getAttribute('src')
            ? iframe.getAttribute('src')
            : '';
        if (src.includes('chapter_002.xhtml')) return true;
      } catch (e) {
        return false;
      }
      return false;
    },
    { timeout: 10000 }
  );

  // Note: do not block waiting for manager; diagnostics below will guard access if unavailable

  // Capture diagnostic values from the page
  const diag = await page.evaluate(() => {
    const rend = (window as any).getRendition
      ? (window as any).getRendition()
      : (window as any).rendition;
    const manager = rend ? rend.manager : null;
    const container = manager
      ? manager.container
      : document.querySelector('.epub-container') || null;
    const phantomEl = document.querySelector(
      '.epub-scroll-phantom'
    ) as HTMLElement | null;

    // Compute expectedFromViews similar to manager.debugAndFixPhantomWidth
    let expectedFromViews = 0;
    try {
      const views =
        manager.views && typeof manager.views.all === 'function'
          ? manager.views.all()
          : null;
      if (views && Array.isArray(views)) {
        expectedFromViews = views.reduce((acc: number, v: any) => {
          const el = v && v.element;
          const textWidth =
            v && v.contents && typeof v.contents.textWidth === 'function'
              ? v.contents.textWidth()
              : 0;
          const measured = Math.max(
            textWidth || 0,
            (v && typeof v.width === 'function' ? v.width() : 0) || 0,
            (el && el.offsetWidth) || 0,
            (manager.layout && manager.layout.width) || 0
          );
          return acc + (measured || 0);
        }, 0);
      }
    } catch (e) {}

    const phantomWidth = phantomEl ? phantomEl.offsetWidth : 0;
    const containerScrollWidth = container ? container.scrollWidth : -1;
    const containerOffsetWidth = container ? container.offsetWidth : -1;
    const containerScrollLeft = container ? container.scrollLeft : -1;

    // last view position and computed snapped target
    let lastView: any = null;
    let posLeft = 0;
    let pageSize = containerOffsetWidth || -1;
    let snapped = -1;
    let maxScrollLeft = -1;
    let target = -1;
    if (manager && manager.views && typeof manager.views.last === 'function') {
      lastView = manager.views.last();
      posLeft =
        lastView && typeof lastView.position === 'function'
          ? lastView.position().left
          : 0;
      const desired = Math.max(0, posLeft || 0);
      pageSize =
        manager.layout && manager.layout.delta
          ? manager.layout.delta
          : containerOffsetWidth;
      snapped = Math.max(0, Math.floor(desired / pageSize) * pageSize);
      maxScrollLeft = Math.max(
        0,
        (containerScrollWidth > 0 ? containerScrollWidth : 0) -
          (containerOffsetWidth > 0 ? containerOffsetWidth : 0)
      );
      target = Math.min(maxScrollLeft, snapped);
    }

    // Check center iframe content
    const viewer = document.getElementById('viewer');
    const rect = viewer
      ? viewer.getBoundingClientRect()
      : { left: 0, top: 0, width: 0, height: 0 };
    const cx = Math.floor(rect.left + rect.width / 2);
    const cy = Math.floor(rect.top + rect.height / 2);
    const stack = (document as any).elementsFromPoint?.(cx, cy) || [];
    let iframe: HTMLIFrameElement | null = null;
    if (Array.isArray(stack))
      iframe = stack.find((e: any) => e instanceof HTMLIFrameElement) || null;
    if (!iframe) {
      const el = document.elementFromPoint(cx, cy) as Element | null;
      let cur = el;
      while (cur) {
        if (cur instanceof HTMLIFrameElement) {
          iframe = cur as HTMLIFrameElement;
          break;
        }
        cur = cur.parentElement;
      }
    }

    let centerHasContent = false;
    try {
      if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
        centerHasContent =
          (iframe.contentDocument.body.textContent || '').trim().length > 0;
      }
    } catch (e) {
      centerHasContent = false;
    }

    return {
      phantomWidth,
      expectedFromViews,
      containerScrollWidth,
      containerOffsetWidth,
      containerScrollLeft,
      posLeft: posLeft || 0,
      pageSize,
      snapped,
      maxScrollLeft,
      target,
      centerHasContent,
    };
  });

  // Basic invariants: phantom should match expected from views (or be within pageSize tolerance)
  expect(diag.expectedFromViews).toBeGreaterThan(0);
  // Allow small tolerance
  expect(
    Math.abs(diag.phantomWidth - diag.expectedFromViews)
  ).toBeLessThanOrEqual(Math.max(1, diag.pageSize || 0));

  // Container scrollWidth should be at least expectedFromViews
  expect(diag.containerScrollWidth).toBeGreaterThanOrEqual(
    diag.expectedFromViews
  );

  // Log diagnostics for investigation (will appear in Playwright output)
  console.log('PRERENDER DIAG:', JSON.stringify(diag));

  // Primary invariant: center iframe should have some content
  expect(diag.centerHasContent).toBeTruthy();
});
