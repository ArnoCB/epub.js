import { test, expect } from '@playwright/test';

// Attempt to reproduce the scroll-jump observed in logs where scrollLeft moves from 3600 -> 900
test('Prerendering scroll jump (3600 -> 900) reproduction', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for helper getters to exist
  await page.waitForFunction(
    () => !!(window as any).getPreRenderer || !!(window as any).getRendition,
    { timeout: 10000 }
  );

  // Display chapter_001.xhtml and wait until center has content
  await page.evaluate(() => {
    const rend = (window as any).getRendition
      ? (window as any).getRendition()
      : (window as any).rendition;
    if (rend) rend.display('chapter_001.xhtml');
  });
  await page.waitForFunction(
    () => {
      const viewer = document.getElementById('viewer');
      if (!viewer) return false;
      const rect = viewer.getBoundingClientRect();
      const cx = Math.floor(rect.left + rect.width / 2);
      const stack =
        (document as any).elementsFromPoint?.(cx, rect.top + rect.height / 2) ||
        [];
      return (
        Array.isArray(stack) &&
        stack.find((e: any) => e instanceof HTMLIFrameElement)
      );
    },
    { timeout: 7000 }
  );

  // Ensure preRenderer is available
  const hasPreRenderer = await page.evaluate(() =>
    !!(window as any).getPreRenderer
      ? !!(window as any).getPreRenderer()
      : false
  );
  if (!hasPreRenderer) {
    await page.evaluate(() => {
      (window as any).preRenderingEnabled = true;
    });
    await page.reload();
    await page.waitForFunction(
      () => !!(window as any).getPreRenderer || !!(window as any).getRendition,
      { timeout: 10000 }
    );
  }

  // Attach several chapters via preRenderer to simulate a wide pre-attached state
  await page.evaluate(() => {
    const pre = (window as any).getPreRenderer
      ? (window as any).getPreRenderer()
      : null;
    if (!pre) return;
    const attach = (href: string) => {
      try {
        pre.attachChapter(href);
      } catch (e) {}
    };
    // Attach multiple chapters to the right to build up scroll width
    [
      'chapter_010.xhtml',
      'chapter_009.xhtml',
      'chapter_008.xhtml',
      'chapter_007.xhtml',
      'chapter_006.xhtml',
      'chapter_005.xhtml',
    ].forEach(attach);
  });

  // Wait for attachments to be processed and container to grow
  await page.waitForTimeout(1200);

  // Force the container scrollLeft to 3600 (or the max allowed) to simulate preserved scroll position while chapter_001 is displayed
  await page.evaluate(() => {
    const rend = (window as any).getRendition
      ? (window as any).getRendition()
      : (window as any).rendition;
    if (!rend || !rend.manager || !rend.manager.container) return;
    const container = rend.manager.container;
    const maxScrollLeft = Math.max(
      0,
      container.scrollWidth - container.offsetWidth
    );
    const desired = Math.min(3600, maxScrollLeft);
    try {
      container.scrollLeft = desired;
    } catch (e) {}
    // expose for retrieval
    (window as any).__test_forced_scroll = desired;
  });

  // Wait for the forced scroll to apply
  await page.waitForTimeout(300);

  // Read scrollLeft before clicking Next
  const before = await page.evaluate(() => {
    const rend = (window as any).getRendition
      ? (window as any).getRendition()
      : (window as any).rendition;
    const container =
      rend && rend.manager
        ? rend.manager.container
        : document.querySelector('#viewer');
    return {
      scrollLeft: container ? container.scrollLeft : -1,
      scrollWidth: container ? container.scrollWidth : -1,
      forced: (window as any).__test_forced_scroll,
    };
  });

  // Click Next
  await page.click('#next');

  // Wait for adjustments
  await page.waitForTimeout(600);

  const after = await page.evaluate(() => {
    const rend = (window as any).getRendition
      ? (window as any).getRendition()
      : (window as any).rendition;
    const manager = rend && rend.manager ? rend.manager : null;
    const container = manager
      ? manager.container
      : document.querySelector('#viewer');
    const phantom = document.querySelector(
      '.epub-scroll-phantom'
    ) as HTMLElement | null;
    const lastView =
      manager && manager.views && typeof manager.views.last === 'function'
        ? manager.views.last()
        : null;
    const pos =
      lastView && typeof lastView.position === 'function'
        ? lastView.position().left
        : null;
    // Inspect center iframe content
    const viewer = document.getElementById('viewer');
    let centerHasContent = false;
    let centerSrc = null;
    if (viewer) {
      const rect = viewer.getBoundingClientRect();
      const cx = Math.floor(rect.left + rect.width / 2);
      const cy = Math.floor(rect.top + rect.height / 2);
      const stack = (document as any).elementsFromPoint?.(cx, cy) || [];
      let iframe: any = null;
      if (Array.isArray(stack))
        iframe = stack.find((e: any) => e instanceof HTMLIFrameElement) || null;
      if (!iframe) {
        const el = document.elementFromPoint(cx, cy) as Element | null;
        let cur: any = el;
        while (cur) {
          if (cur instanceof HTMLIFrameElement) {
            iframe = cur;
            break;
          }
          cur = cur.parentElement;
        }
      }
      try {
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
          centerHasContent =
            (iframe.contentDocument.body.textContent || '').trim().length > 0;
        }
      } catch (e) {
        centerHasContent = false;
      }
      try {
        centerSrc =
          iframe &&
          (iframe.getAttribute ? iframe.getAttribute('src') : iframe.src);
      } catch (e) {
        centerSrc = null;
      }
    }
    return {
      scrollLeft: container ? container.scrollLeft : -1,
      scrollWidth: container ? container.scrollWidth : -1,
      phantomWidth: phantom ? phantom.offsetWidth : -1,
      lastViewPos: pos,
      centerHasContent,
      centerSrc,
    };
  });

  console.log('PRERENDER JUMP before:', before, 'after:', after);

  // Expectation: before.scrollLeft is 3600 and after.scrollLeft is 900 (reproduces the jump)
  expect(before.scrollLeft).toBe(3600);
  expect(after.scrollLeft).toBe(900);

  // Critical viewport assertion (should fail in current broken production):
  // The center iframe must contain content and point to chapter_002.xhtml
  expect(
    after.centerHasContent,
    'center iframe should have text content from chapter_002'
  ).toBeTruthy();
  expect(
    after.centerSrc || '',
    'center iframe src should reference chapter_002.xhtml'
  ).toContain('chapter_002.xhtml');
});
