import { test, expect } from '@playwright/test';

test('Epigraph -> prev navigation should not produce white page', async ({
  page,
  baseURL,
}) => {
  // Load the prerendering example
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  // Wait for library and rendition to start
  await page.waitForFunction(() => typeof (window as any).ePub === 'function');
  await page.waitForFunction(
    () => !!(window as any).getPreRenderer || !!(window as any).getRendition,
    { timeout: 10000 }
  );

  // Wait until a chapter link to epigraph is available in the UI (toc)
  // The example exposes window.getPreRenderer and exposes rendering debug
  await page.waitForTimeout(1000);

  // Navigate programmatically to epigraph_001.xhtml
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.rendition || (win.getRendition && win.getRendition());
    if (rend) {
      rend.display('epigraph_001.xhtml');
    }
  });

  // Wait for relocated event showing epigraph
  await page.waitForFunction(
    () => {
      const win: any = window as any;
      const last = win.__lastRelocated || null;
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
      const viewer = document.getElementById('viewer');
      if (!viewer) return false;
      const iframe = viewer.querySelector('iframe');
      if (!iframe) return false;
      try {
        const doc = (iframe as HTMLIFrameElement).contentDocument;
        if (!doc) return false;
        const body = doc.body;
        return body && body.textContent && body.textContent.trim().length > 0;
      } catch (e) {
        return false;
      }
    },
    { timeout: 5000 }
  );

  expect(hasContent).toBeTruthy();
});
