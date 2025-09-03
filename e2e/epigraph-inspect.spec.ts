import { test } from '@playwright/test';

test('inspect epigraph pre-render and manager state after prev', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/examples/prerendering-example.html`);

  await page.waitForFunction(
    () => !!(window as any).getRendition || !!(window as any).ePub,
    { timeout: 10000 }
  );

  // Wait for pre-renderer to be created and epigraph to be pre-rendered
  await page.waitForFunction(
    () => {
      const w: any = window as any;
      const rend = w.getRendition ? w.getRendition() : w.rendition;
      const pre = rend?.manager?.preRenderer;
      try {
        return !!(
          pre &&
          pre.getChapter &&
          pre.getChapter('epigraph_001.xhtml')
        );
      } catch (e) {
        return false;
      }
    },
    { timeout: 20000 }
  );

  // Display epigraph
  await page.evaluate(() => {
    const win: any = window as any;
    const rend = win.getRendition ? win.getRendition() : win.rendition;
    if (rend) rend.display('epigraph_001.xhtml');
  });

  // Wait for relocated to epigraph
  await page.waitForFunction(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Click prev to go back
  await page.click('#prev');

  // Wait a short moment for DOM updates
  await page.waitForTimeout(500);

  // Collect diagnostics after prev
  const diag = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const pre = rend?.manager?.preRenderer;
    const container = rend?.manager?.container;
    const layout = rend?.manager?.layout;
    const first = rend?.manager?.views?.first && rend.manager.views.first();

    const chapter = pre ? pre.getChapter('epigraph_001.xhtml') : undefined;

    return {
      preDebug: pre ? pre.getDebugInfo() : null,
      chapter: chapter
        ? {
            href: chapter.section.href,
            width: chapter.width,
            pageCount: chapter.pageCount,
            pageMapLength: chapter.pageMap ? chapter.pageMap.length : 0,
            attached: !!chapter.attached,
            whitePages: chapter.whitePageIndices,
          }
        : null,
      manager: rend
        ? {
            layoutDelta: layout ? layout.delta : null,
            container: container
              ? {
                  scrollWidth: container.scrollWidth,
                  offsetWidth: container.offsetWidth,
                  scrollLeft: container.scrollLeft,
                }
              : null,
            viewsLength: rend.manager.views ? rend.manager.views.length : null,
            firstViewElementExists: first ? !!first.element : null,
          }
        : null,
    };
  });

  // Print diagnostics to test output
  console.log('DIAGNOSTICS:', JSON.stringify(diag, null, 2));

  // If iframe body is empty, take a screenshot for manual inspection
  const bodyEmpty = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    const iframe = viewer?.querySelector('iframe');
    try {
      const doc = (iframe as HTMLIFrameElement)?.contentDocument;
      const txt = doc?.body?.textContent?.trim() || '';
      return txt.length === 0;
    } catch (e) {
      return true;
    }
  });

  if (bodyEmpty) {
    await page.screenshot({
      path: 'tmp/epigraph-prev-whitepage.png',
      fullPage: false,
    });
    console.log('Captured screenshot: tmp/epigraph-prev-whitepage.png');
  }

  // Now simulate a resize that previously caused a white page and capture diagnostics again
  await page.setViewportSize({ width: 480, height: 800 });
  await page.waitForTimeout(500);

  const diagAfterResize = await page.evaluate(() => {
    const w: any = window as any;
    const rend = w.getRendition ? w.getRendition() : w.rendition;
    const pre = rend?.manager?.preRenderer;
    const container = rend?.manager?.container;
    const layout = rend?.manager?.layout;
    const views = rend?.manager?.views?.getAll
      ? rend.manager.views.getAll()
      : null;

    const iframeStates = [] as any[];
    try {
      const viewer = document.getElementById('viewer');
      const iframes = viewer
        ? Array.from(viewer.querySelectorAll('iframe'))
        : [];
      for (const iframe of iframes as HTMLIFrameElement[]) {
        try {
          const doc = iframe.contentDocument;
          iframeStates.push({
            src: iframe.src,
            readyState: doc?.readyState,
            textLength: (doc?.body?.textContent || '').trim().length,
          });
        } catch (e) {
          iframeStates.push({ src: iframe.src, error: String(e) });
        }
      }
    } catch (e) {
      // ignore
    }

    // Gather container children info for debugging which elements contribute to scrollWidth
    let containerChildren = null;
    try {
      const container = rend?.manager?.container;
      if (container && container.children) {
        containerChildren = Array.from(container.children).map(
          (el: HTMLElement) => {
            const childIframe =
              el.querySelector &&
              (el.querySelector('iframe') as HTMLIFrameElement | null);
            let sample = '';
            try {
              sample = (el.textContent || '')
                .trim()
                .slice(0, 120)
                .replace(/\s+/g, ' ');
            } catch (e) {
              sample = '';
            }
            return {
              tag: el.tagName,
              class: el.className,
              offsetWidth: el.offsetWidth,
              scrollWidth: el.scrollWidth,
              hasIframe: !!childIframe,
              iframeSrc: childIframe ? childIframe.src : null,
              sample,
            };
          }
        );
      }
    } catch (e) {
      containerChildren = `error: ${String(e)}`;
    }

    return {
      preDebug: pre ? pre.getDebugInfo() : null,
      manager: rend
        ? {
            layoutDelta: layout ? layout.delta : null,
            container: container
              ? {
                  scrollWidth: container.scrollWidth,
                  offsetWidth: container.offsetWidth,
                  scrollLeft: container.scrollLeft,
                }
              : null,
            viewsLength: rend.manager.views ? rend.manager.views.length : null,
          }
        : null,
      iframeStates,
      views,
      containerChildren,
    };
  });

  console.log(
    'DIAGNOSTICS AFTER RESIZE:',
    JSON.stringify(diagAfterResize, null, 2)
  );
});
