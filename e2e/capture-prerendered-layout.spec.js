const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('capture prerendered layout', async ({ page }) => {
  const url =
    process.env.EXAMPLES_URL ||
    'http://localhost:8082/prerendering-example.html';
  console.log('Visiting', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for rendition and pre-renderer to exist and for some prerendered chapters to be rendered
  await page.waitForFunction(
    () => {
      try {
        const r = window.getRendition && window.getRendition();
        const pre = window.getPreRenderer && window.getPreRenderer();
        if (!r || !pre) return false;
        const status = pre.getStatus();
        return (
          status &&
          status.rendered > 0 &&
          document.getElementById('viewer').querySelector('iframe')
        );
      } catch (e) {
        return false;
      }
    },
    { timeout: 20000 }
  );

  // Wait a bit for attachment/clone to settle
  await page.waitForTimeout(1500);

  const snapshot = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    const out = { viewerExists: !!viewer, children: [] };
    if (!viewer) return out;

    const nodes = Array.from(viewer.childNodes).map((node, idx) => {
      const obj = {
        index: idx,
        nodeType: node.nodeType,
        nodeName: node.nodeName,
        classList: node.classList ? Array.from(node.classList) : [],
        outerHTMLSnippet: node.outerHTML ? node.outerHTML.slice(0, 500) : null,
      };

      if (node.getBoundingClientRect) {
        const r = node.getBoundingClientRect();
        obj.rect = {
          width: r.width,
          height: r.height,
          top: r.top,
          left: r.left,
        };
      }

      const iframes = node.querySelectorAll
        ? node.querySelectorAll('iframe')
        : [];
      obj.iframes = [];
      iframes.forEach((iframe) => {
        const frameObj = {
          src: iframe.getAttribute('src') || null,
          srcdoc: iframe.getAttribute('srcdoc')
            ? iframe.getAttribute('srcdoc').slice(0, 200)
            : null,
          style: iframe.getAttribute('style') || null,
          widthAttr: iframe.getAttribute('width') || null,
          heightAttr: iframe.getAttribute('height') || null,
          bounding: null,
          clientWidth: iframe.clientWidth,
          clientHeight: iframe.clientHeight,
          scrollWidth: iframe.scrollWidth,
          scrollHeight: iframe.scrollHeight,
          accessibleBodyTextLength: null,
          bodyHtmlSample: null,
        };

        try {
          const doc = iframe.contentDocument;
          if (doc && doc.body) {
            frameObj.accessibleBodyTextLength = (
              doc.body.textContent || ''
            ).trim().length;
            frameObj.bodyHtmlSample = (doc.body.innerHTML || '').slice(0, 200);
          }
        } catch (e) {
          frameObj.accessibleBodyTextLength = 'inaccessible: ' + e.message;
        }

        const r = iframe.getBoundingClientRect();
        frameObj.bounding = {
          width: r.width,
          height: r.height,
          top: r.top,
          left: r.left,
        };

        obj.iframes.push(frameObj);
      });

      return obj;
    });

    out.children = nodes;

    // Add pre-renderer debug info if available
    try {
      const pre = window.getPreRenderer && window.getPreRenderer();
      if (pre) {
        out.preRenderer = pre.getDebugInfo ? pre.getDebugInfo() : null;
        out.preRendererStatus = pre.getStatus ? pre.getStatus() : null;
      }
    } catch (e) {
      out.preRendererError = e.message;
    }

    // Add basic rendition info if available
    try {
      const rendition = window.getRendition && window.getRendition();
      if (rendition && rendition.manager) {
        out.rendition = {
          managerName: rendition.manager.name,
          layoutName: rendition.manager.layout && rendition.manager.layout.name,
          settings: rendition.manager.settings || null,
        };
      }
    } catch (e) {
      out.rendition = { error: e.message };
    }

    return out;
  });

  const outPath = '.ai-notes/prerendered-layout.json';
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
  console.log('WROTE', outPath);

  // Basic assertion: at least one iframe captured
  const hasIframe = snapshot.children.some(
    (c) => c.iframes && c.iframes.length > 0
  );
  expect(hasIframe).toBeTruthy();
});
