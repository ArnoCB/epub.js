const { test, expect } = require('@playwright/test');
const fs = require('fs');

const URL =
  process.env.EXAMPLE_URL ||
  'http://localhost:8082/default-manager-example.html';

test('capture default manager viewer layout', async ({ page }) => {
  const logs = [];
  page.on('console', (msg) =>
    logs.push({ type: msg.type(), text: msg.text() })
  );

  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Wait for viewer iframe(s) to appear or for rendition attached flag
  await page.waitForTimeout(2000);

  // Wait until either #viewer has an iframe, or window.__lastRelocated is set
  await page.waitForFunction(
    () => {
      const viewer = document.getElementById('viewer');
      if (!viewer) return false;
      if (viewer.querySelector('iframe')) return true;
      return !!window.__lastRelocated;
    },
    { timeout: 15000 }
  );

  const snapshot = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return { error: 'no viewer' };

    function describeNode(node) {
      const desc = {
        tag: node.tagName,
        class: node.className || null,
        id: node.id || null,
        children: [],
      };
      for (const child of Array.from(node.children)) {
        desc.children.push(describeNode(child));
      }
      return desc;
    }

    const iframes = Array.from(viewer.querySelectorAll('iframe')).map((f) => ({
      tag: 'iframe',
      id: f.id || null,
      class: f.className || null,
      src: f.getAttribute('src'),
      srcdoc_present: f.hasAttribute('srcdoc'),
      width_style: f.style.width || null,
      height_style: f.style.height || null,
      parent_tag: f.parentElement ? f.parentElement.tagName : null,
      parent_class: f.parentElement ? f.parentElement.className : null,
    }));

    return {
      viewerOuterHTML: viewer.outerHTML.slice(0, 20000), // truncate
      viewerTree: describeNode(viewer),
      iframeSummary: iframes,
      location: window.__lastRelocated || null,
    };
  });

  const out = {
    url: URL,
    timestamp: new Date().toISOString(),
    console: logs,
    snapshot,
  };

  const outDir = '.ai-notes';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    `${outDir}/default-manager-layout.json`,
    JSON.stringify(out, null, 2)
  );

  console.log('WROTE', `${outDir}/default-manager-layout.json`);
  expect(snapshot).toBeTruthy();
});
