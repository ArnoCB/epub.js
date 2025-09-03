import { test } from '@playwright/test';

test('inspect container children widths and attached chapters', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  await page.waitForFunction(
    () => !!(window as any).getRendition || !!(window as any).ePub,
    { timeout: 10000 }
  );

  // Display epigraph, wait for relocated
  await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    if (rend) rend.display('epigraph_001.xhtml');
  });

  await page.waitForFunction(
    () => {
      const w: any = window as any;
      const last = w.__lastRelocated;
      return (
        last &&
        last.start &&
        last.start.href &&
        last.start.href.indexOf('epigraph_001.xhtml') !== -1
      );
    },
    { timeout: 10000 }
  );

  // Click prev to go back to introduction
  await page.click('#prev');
  await page.waitForTimeout(500);

  // Collect children and preRenderer info
  const info = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const mgr = rend?.manager;
    const pre = mgr?.preRenderer;
    const container = mgr?.container;

    const children: any[] = [];
    try {
      if (container && container.children) {
        for (let i = 0; i < container.children.length; i++) {
          const el = container.children[i] as HTMLElement;
          const iframe = el.querySelector && el.querySelector('iframe');
          let iframeInfo: any = null;
          try {
            if (iframe) {
              const doc = (iframe as HTMLIFrameElement).contentDocument;
              iframeInfo = {
                src: iframe.src,
                readyState: doc?.readyState,
                textLength: (doc?.body?.textContent || '').trim().length,
              };
            }
          } catch (e) {
            iframeInfo = { src: iframe ? iframe.src : null, error: String(e) };
          }

          children.push({
            index: i,
            tag: el.tagName,
            className: el.className,
            offsetWidth: el.offsetWidth,
            scrollWidth: el.scrollWidth,
            scrollLeft: el.scrollLeft,
            iframe: iframeInfo,
          });
        }
      }
    } catch (e) {
      // ignore
    }

    const chapters: any[] = [];
    try {
      if (pre && typeof pre.getAllChapters === 'function') {
        const ch = pre.getAllChapters();
        for (const c of ch) {
          chapters.push({
            href: c.section.href,
            attached: !!c.attached,
            width: c.width,
            pageCount: c.pageCount,
          });
        }
      }
    } catch (e) {
      // ignore
    }

    return {
      container: container
        ? {
            scrollWidth: container.scrollWidth,
            offsetWidth: container.offsetWidth,
            scrollLeft: container.scrollLeft,
            childrenCount: container.children.length,
          }
        : null,
      children,
      chapters,
    };
  });

  console.log('CONTAINER INFO:', JSON.stringify(info, null, 2));
});
