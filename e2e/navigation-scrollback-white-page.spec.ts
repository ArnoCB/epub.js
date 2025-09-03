import { test, expect } from '@playwright/test';

// Intended to reproduce white page when "scrolling back" (clicking prev arrow) from chapter_001.xhtml

test('Scroll-back (prev) from chapter 1 should render previous chapter content (no white page)', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for rendition to be available
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(() => !!(window as any).getRendition, {
    timeout: 10000,
  });

  // Ensure we start on chapter 1
  await page.evaluate(() => {
    const w: any = window as any;
    (w.getRendition ? w.getRendition() : w.rendition).display(
      'chapter_001.xhtml'
    );
  });

  // Let it render and layout
  await page.waitForTimeout(1000);

  // Helper to grab current visible iframe state
  const grab = async () =>
    page.evaluate(() => {
      const viewer = document.getElementById('viewer');
      const iframe = viewer?.querySelector(
        'iframe'
      ) as HTMLIFrameElement | null;
      let text = 0,
        html = 0,
        ready = 'unknown',
        scrollWidth = 0,
        href = '';
      let snippet = '';
      try {
        if (iframe && iframe.contentDocument) {
          const body = iframe.contentDocument.body;
          ready = iframe.contentDocument.readyState;
          text = (body?.textContent || '').trim().length;
          html = (body?.innerHTML || '').trim().length;
          scrollWidth = body?.scrollWidth || 0;
          snippet = (body?.textContent || '').trim().slice(0, 120);
        }
        const loc: any = (window as any).__lastRelocated;
        href = loc?.start?.href || '';
      } catch {}
      return { href, ready, text, html, scrollWidth, snippet };
    });

  // Perform multiple quick back/forward cycles to stress DOM moves
  for (let i = 0; i < 3; i++) {
    // Prev: from chapter_001 to epigraph
    await page.click('#prev');
    // Short settle, mimicking realistic timing where paints race
    await page.waitForTimeout(300);
    const backState = await grab();
    // We expect to be on epigraph and have content
    expect(
      backState.text,
      `Cycle ${i} back: expected non-empty text`
    ).toBeGreaterThan(0);
    expect(
      backState.html,
      `Cycle ${i} back: expected non-empty HTML`
    ).toBeGreaterThan(0);
    expect(
      backState.scrollWidth,
      `Cycle ${i} back: expected non-zero scrollWidth`
    ).toBeGreaterThan(0);

    // Next: go forward again to chapter_001
    await page.click('#next');
    await page.waitForTimeout(300);
    const fwdState = await grab();
    expect(
      fwdState.text,
      `Cycle ${i} forward: expected non-empty text`
    ).toBeGreaterThan(0);
    expect(
      fwdState.html,
      `Cycle ${i} forward: expected non-empty HTML`
    ).toBeGreaterThan(0);
    expect(
      fwdState.scrollWidth,
      `Cycle ${i} forward: expected non-zero scrollWidth`
    ).toBeGreaterThan(0);
  }
});
