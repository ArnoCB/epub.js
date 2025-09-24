import { test, expect } from '@playwright/test';

test('prerenderer generates valid CFIs and pageMap for Alice', async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60_000);

  // Forward browser console for debugging
  page.on('console', (msg) =>
    console.log(`[page] ${msg.type()}: ${msg.text()}`)
  );

  // Enable debug mode
  await page.addInitScript(() => ((window as any).PRERENDER_DEBUG = true));

  await page.goto(`${baseURL}/examples/prerendered-alice.html`, {
    waitUntil: 'domcontentloaded',
  });

  // Wait for prerenderer to be available
  await page.waitForFunction(
    () => {
      const pre = (window as any).getPreRenderer?.();
      return !!pre;
    },
    { timeout: 10000 }
  );

  // Wait until prerendering has attempted all chapters
  await page.waitForFunction(
    () => {
      const pre = (window as any).getPreRenderer?.();
      if (!pre) return false;

      const status = pre.getStatus?.();
      if (!status) return false;

      // Wait for prerendering to be complete: total chapters attempted = rendered + failed
      const totalAttempted = (status.rendered || 0) + (status.failed || 0);
      const isComplete =
        totalAttempted >= (status.total || 0) && status.total > 0;

      return isComplete;
    },
    { timeout: 30000 }
  );

  // Fetch final prerendered chapter data
  const chapters = await page.evaluate(() => {
    const pre = (window as any).getPreRenderer?.();
    if (!pre) return [];
    return (
      pre.getAllChapters?.().map((ch: any) => ({
        href: ch.section?.href,
        pageCount: ch.pageCount || ch.pageMap?.length || 0,
        entries: (ch.pageMap || []).map((p: any) => ({
          index: p.index,
          pageNumber: p.pageNumber,
          startCfi: p.startCfi,
          endCfi: p.endCfi,
          xOffset: p.xOffset,
          yOffset: p.yOffset,
        })),
      })) || []
    );
  });

  // Basic chapter/page assertions
  expect(chapters.length).toBeGreaterThan(0);

  let totalPages = 0;
  let totalPagesWithCFIs = 0;
  const invalidCFIs: any[] = [];

  // Skip completely empty chapters (no pageCount and no entries)
  for (const ch of chapters) {
    if (!(ch.pageCount || ch.entries.length)) {
      // nothing to validate for this chapter
      continue;
    }

    // Allow chapters that report pageCount === 0 if they still have pageMap entries
    expect(ch.pageCount || ch.entries.length).toBeGreaterThanOrEqual(1);

    for (const p of ch.entries) {
      totalPages++;

      const hasCFI = !!(p.startCfi || p.endCfi);
      if (hasCFI) totalPagesWithCFIs++;

      // Validate CFI format
      for (const key of ['startCfi', 'endCfi'] as const) {
        const cfi = p[key];
        if (!cfi) continue;
        if (!cfi.startsWith('epubcfi(')) {
          invalidCFIs.push({
            chapter: ch.href,
            page: p.index,
            type: key,
            cfi,
            issue: 'Missing epubcfi( prefix',
          });
        }
        const redundant = cfi.match(
          /^epubcfi\(([^!]+)!([^,]+),([^,]+),([^,)]+)\)$/
        );
        if (redundant) {
          const [, , part1, part2, part3] = redundant;
          if (part1 === part2 && part2 === part3) {
            invalidCFIs.push({
              chapter: ch.href,
              page: p.index,
              type: key,
              cfi,
              issue: 'Redundant range CFI (all parts identical)',
            });
          }
        }
      }
    }
  }

  // Use a normal expectation for invalid CFIs
  expect(
    invalidCFIs,
    `Found ${invalidCFIs.length} invalid CFIs: ${JSON.stringify(invalidCFIs, null, 2)}`
  ).toHaveLength(0);

  expect(totalPages).toBeGreaterThan(0);
  expect(totalPagesWithCFIs).toBeGreaterThan(0);

  console.log(
    `SUCCESS: ${totalPagesWithCFIs}/${totalPages} pages have valid CFIs.`
  );
});
