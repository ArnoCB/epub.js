const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Run for a single representative href to keep the trace concise
const HREFS = ['chapter_003.xhtml'];
const OUTFILE = path.resolve(
  __dirname,
  '..',
  '.ai-notes',
  'prerendered-debug.json'
);

function safeSlice(s, n = 400) {
  if (!s) return '';
  return s.slice(0, n);
}

async function inspectChapterInPage(page, href) {
  return await page.evaluate(async (href) => {
    function safeLen(s) {
      return (s || '').length;
    }
    try {
      const pre = window.getPreRenderer && window.getPreRenderer();
      const ch = pre && pre.getChapter && pre.getChapter(href);
      if (!ch) return { href, found: false };
      const obj = { href, found: true };
      obj.attached = !!ch.attached;
      obj.width = ch.width || null;
      obj.pageCount = ch.pageCount || null;
      obj.preservedSrcdocLength = (ch.preservedSrcdoc || '').length;
      obj.preservedSrcdocSnippet = (ch.preservedSrcdoc || '').slice(0, 400);
      obj.preservedContentLength = (ch.preservedContent || '').length;
      obj.preservedContentSnippet = (ch.preservedContent || '').slice(0, 400);
      obj.elementParentNode =
        ch.element && ch.element.parentNode
          ? ch.element.parentNode.nodeName || null
          : null;
      const iframe =
        ch.element &&
        ch.element.querySelector &&
        ch.element.querySelector('iframe');
      obj.iframePresent = !!iframe;
      obj.iframeSrcAttr =
        iframe && iframe.getAttribute && iframe.getAttribute('src');
      obj.iframeSrcdocAttr =
        iframe && iframe.getAttribute && iframe.getAttribute('srcdoc');
      try {
        obj.iframeReadyState =
          iframe && iframe.contentDocument && iframe.contentDocument.readyState;
        obj.iframeBodyTextLength =
          iframe &&
          iframe.contentDocument &&
          iframe.contentDocument.body &&
          (iframe.contentDocument.body.textContent || '').length;
        obj.iframeAccessible = true;
      } catch (e) {
        obj.iframeAccessible = false;
        obj.iframeAccessError = e && e.message;
      }
      return obj;
    } catch (err) {
      return { href, error: err && (err.message || String(err)) };
    }
  }, href);
}

async function quickStatus(page) {
  return await page.evaluate(() => {
    try {
      const pre = window.getPreRenderer && window.getPreRenderer();
      return {
        preExists: !!pre,
        status: pre && pre.getStatus ? pre.getStatus() : null,
        debug: pre && pre.getDebugInfo ? pre.getDebugInfo() : null,
      };
    } catch (e) {
      return { error: e && e.message };
    }
  });
}

async function tryRestore(page, href) {
  return await page.evaluate(async (href) => {
    try {
      const pre = window.getPreRenderer && window.getPreRenderer();
      if (!pre || !pre.tryRestoreContent)
        return { href, tryRestoreResult: false };
      const ok = await pre.tryRestoreContent(href);
      return { href, tryRestoreResult: !!ok };
    } catch (e) {
      return { href, tryRestoreError: e && e.message };
    }
  }, href);
}

async function attachCloneInspect(page, href) {
  return await page.evaluate((href) => {
    try {
      const pre = window.getPreRenderer && window.getPreRenderer();
      const attached = pre && pre.attachChapter && pre.attachChapter(href);
      if (!attached) return { href, attached: false };
      // attach clone to body for inspection
      if (attached.element) document.body.appendChild(attached.element);
      const iframe =
        attached.element &&
        attached.element.querySelector &&
        attached.element.querySelector('iframe');
      const out = {
        href,
        attached: true,
        elementNodeName: attached.element && attached.element.nodeName,
      };
      out.cloneIframePresent = !!iframe;
      out.cloneIframeSrcAttr =
        iframe && iframe.getAttribute && iframe.getAttribute('src');
      out.cloneIframeSrcdocAttr =
        iframe && iframe.getAttribute && iframe.getAttribute('srcdoc');
      try {
        out.cloneIframeReadyState =
          iframe && iframe.contentDocument && iframe.contentDocument.readyState;
        out.cloneIframeBodyTextLength =
          iframe &&
          iframe.contentDocument &&
          iframe.contentDocument.body &&
          (iframe.contentDocument.body.textContent || '').length;
        out.cloneIframeAccessible = true;
      } catch (e) {
        out.cloneIframeAccessible = false;
        out.cloneIframeAccessError = e && e.message;
      }
      return out;
    } catch (e) {
      return { href, attachError: e && e.message };
    }
  }, href);
}

async function captureTrace(page) {
  return await page.evaluate(() => {
    try {
      const t = window.__prerender_trace || [];
      // attach a timestamp from the page to help ordering
      return { trace: t.slice(0), ts: Date.now() };
    } catch (e) {
      return { error: e && e.message };
    }
  });
}

async function delayedSnapshot(page, delayMs = 2000) {
  return await page.evaluate(async (delay) => {
    try {
      await new Promise((r) => setTimeout(r, delay));
      const pre = window.getPreRenderer && window.getPreRenderer();
      if (!pre || !pre.captureDebugSnapshotSimple)
        return { error: 'no pre or captureDebugSnapshotSimple' };
      return { snapshot: pre.captureDebugSnapshotSimple() };
    } catch (e) {
      return { error: e && e.message };
    }
  }, delayMs);
}

(async () => {
  const url =
    process.env.EXAMPLES_URL ||
    'http://127.0.0.1:8082/prerendering-example.html';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const result = {
    url,
    timestamp: new Date().toISOString(),
    quickStatus: null,
    chapters: {},
    delayedSnapshot: null,
  };

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    // small wait to let prerendering happen
    await page.waitForTimeout(800);

    result.quickStatus = await quickStatus(page);

    for (const href of HREFS) {
      const before = await inspectChapterInPage(page, href);
      result.chapters[href] = { before };
      const restore = await tryRestore(page, href);
      result.chapters[href].tryRestore = restore;
      // inspect after restore
      const afterRestore = await inspectChapterInPage(page, href);
      result.chapters[href].afterRestore = afterRestore;
      // attach clone and inspect
      const clone = await attachCloneInspect(page, href);
      result.chapters[href].clone = clone;
    }

    // Capture the in-page prerender trace (if any)
    try {
      result.trace = await captureTrace(page);
    } catch (e) {
      result.traceError = e && e.message;
    }

    // delayed snapshot >1-2s (increased to 5s to capture later DISPLAYED events)
    result.delayedSnapshot = await delayedSnapshot(page, 5000);
  } catch (e) {
    result.error = e && e.message;
  }

  try {
    fs.mkdirSync(path.dirname(OUTFILE), { recursive: true });
    fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2));
    console.log('WROTE', OUTFILE);
  } catch (e) {
    console.error('WRITE_ERR', e && e.message);
  }

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
