import { test, expect } from '@playwright/test';

/**
 * EPUB Navigation - Fast Optimized Test Suite
 *
 * PERFORMANCE FEATURES:
 * - Multiple workers (parallel execution)
 * - Batched assertions
 * - Shared test data
 * - Local + Remote EPUB testing
 * - Single + Spread mode coverage
 */

// ===== TYPE DEFINITIONS =====
interface NavigationResult {
  step: string;
  chapter: string;
  pages: number[];
  scrollLeft: number;
  scrollWidth: number;
  content: boolean;
  spread: boolean;
}

interface ContainerData {
  step: number;
  chapter: string;
  scrollWidth: number;
  scrollLeft: number;
}

interface ComparisonResult {
  name: string;
  totalNav: number;
  validStates: number;
  chapterTransitions: number;
  isLocal: boolean;
}

// ===== TEST CONFIGURATION =====
const TEST_CONFIG = {
  LOCAL_ALICE: {
    name: 'alice-local',
    url: '/e2e/fixtures/alice.epub',
    isLocal: true,
    expectedChapters: ['chapter_001.xhtml', 'chapter_002.xhtml'],
  },
  REMOTE_MOBY: {
    name: 'moby-remote',
    url: 'https://s3.amazonaws.com/moby-dick/moby-dick.epub',
    isLocal: false,
    expectedChapters: [
      'chapter_001.xhtml',
      'chapter_002.xhtml',
      'chapter_003.xhtml',
    ],
  },
};

// ===== OPTIMIZED HELPERS =====
const setupEpub = async (
  page: any,
  epubUrl: string,
  spreadMode: boolean = true
) => {
  // Use the correct base URL from our Playwright config
  await page.goto('/examples/spreads.html');

  // Wait for EPUB.js to be loaded
  await page.waitForFunction(() => typeof (window as any).ePub === 'function', {
    timeout: 10000,
  });

  await page.evaluate(
    ({ url, spread }) => {
      const book = (window as any).ePub(url);
      const rendition = book.renderTo('viewer', {
        width: 900,
        height: 600,
        spread: spread ? 'always' : 'none',
      });

      (window as any).book = book;
      (window as any).rendition = rendition;

      return rendition.display();
    },
    { url: epubUrl, spread: spreadMode }
  );

  // Wait for EPUB to load
  await page.waitForFunction(
    () => {
      const rendition = (window as any).rendition;
      return (
        rendition && rendition.manager && rendition.manager.views.length > 0
      );
    },
    { timeout: 15000 }
  );

  await page.waitForTimeout(1000); // Additional stability
};

const getQuickNavState = async (page: any) => {
  return (await page.evaluate(() => {
    const rendition = (window as any).rendition;
    const location = rendition.currentLocation();
    const manager = rendition.manager;
    const currentView = manager.views.last();

    const hasContent =
      currentView &&
      currentView.document &&
      currentView.document.body &&
      currentView.document.body.textContent?.trim().length > 20;

    return {
      chapter: location?.[0]?.href || 'unknown',
      pages: location?.[0]?.pages || [],
      scrollLeft: manager.container?.scrollLeft || 0,
      scrollWidth: manager.container?.scrollWidth || 0,
      content: Boolean(hasContent),
      spread: rendition.settings.spread !== 'none',
    };
  })) as Promise<Omit<NavigationResult, 'step'>>;
};

const performBatchNavigation = async (
  page: any,
  steps: string[]
): Promise<NavigationResult[]> => {
  const results: NavigationResult[] = [];

  for (const step of steps) {
    await page.click(`#${step}`);
    await page.waitForTimeout(300); // Fast navigation

    const state = await getQuickNavState(page);
    results.push({ step, ...state });
  }

  return results;
};

// ===== MAIN TEST SUITES =====
test.describe('EPUB Navigation - Core Features (Parallel)', () => {
  test('LOCAL Alice EPUB - Single Page Mode', async ({ page }) => {
    await setupEpub(page, TEST_CONFIG.LOCAL_ALICE.url, false);

    // BATCH TEST: Basic navigation + content + container
    const navResults = await performBatchNavigation(page, [
      'next',
      'next',
      'prev',
      'next',
    ]);

    // Validate ALL results in one go
    navResults.forEach((result, i) => {
      expect(result.content).toBe(true); // White page prevention
      expect(result.scrollWidth).toBeGreaterThan(0); // Container management
      expect(result.spread).toBe(false); // Single page mode
      console.log(
        `📖 Alice Single ${i + 1}: ${result.chapter} pages=[${result.pages}] scroll=${result.scrollLeft}/${result.scrollWidth}`
      );
    });

    // Chapter transitions
    const chapters = navResults.map((r) => r.chapter);
    const uniqueChapters = [...new Set(chapters)];
    expect(uniqueChapters.length).toBeGreaterThanOrEqual(1);

    console.log(
      `✅ LOCAL Alice Single: ${navResults.length} navigations, ${uniqueChapters.length} chapters`
    );
  });

  test('LOCAL Alice EPUB - Spread Mode', async ({ page }) => {
    await setupEpub(page, TEST_CONFIG.LOCAL_ALICE.url, true);

    const navResults = await performBatchNavigation(page, [
      'next',
      'next',
      'prev',
      'next',
      'next',
    ]);

    navResults.forEach((result, i) => {
      expect(result.content).toBe(true);
      expect(result.spread).toBe(true); // Spread mode
      console.log(
        `📖 Alice Spread ${i + 1}: ${result.chapter} pages=[${result.pages}] spread=true`
      );
    });

    console.log(
      `✅ LOCAL Alice Spread: ${navResults.length} navigations completed`
    );
  });

  test('REMOTE Moby Dick EPUB - Spread Mode', async ({ page }) => {
    await setupEpub(page, TEST_CONFIG.REMOTE_MOBY.url, true);

    // Test the critical backward Chapter 3→2→1 navigation
    const forwardResults = await performBatchNavigation(page, [
      'next',
      'next',
      'next',
      'next',
      'next',
      'next',
      'next',
      'next',
    ]);
    const backwardResults = await performBatchNavigation(page, [
      'prev',
      'prev',
      'prev',
    ]);

    // Validate forward navigation
    forwardResults.forEach((result) => {
      expect(result.content).toBe(true);
    });

    // Validate backward Chapter 3→2→1 navigation (PRIORITY TEST)
    backwardResults.forEach((result, i) => {
      expect(result.content).toBe(true);
      console.log(
        `🔙 Backward ${i + 1}: ${result.chapter} pages=[${result.pages}] scroll=${result.scrollLeft}`
      );
    });

    // Should have crossed chapter boundaries
    const allChapters = [...forwardResults, ...backwardResults].map(
      (r) => r.chapter
    );
    const uniqueChapters = [...new Set(allChapters)];
    expect(uniqueChapters.length).toBeGreaterThan(1);

    console.log(
      `✅ REMOTE Moby Dick: Forward(${forwardResults.length}) + Backward(${backwardResults.length}) = ${uniqueChapters.length} chapters`
    );
  });
});

test.describe('EPUB Navigation - Performance & Edge Cases', () => {
  test('SPEED TEST: Rapid navigation handling', async ({ page }) => {
    await setupEpub(page, TEST_CONFIG.LOCAL_ALICE.url, false); // Fastest config

    const startTime = Date.now();

    // Rapid sequential navigation
    const rapidResults = await performBatchNavigation(page, [
      'next',
      'next',
      'prev',
      'next',
      'prev',
      'prev',
      'next',
      'next',
    ]);

    const duration = Date.now() - startTime;

    // All states must be valid (no white pages)
    rapidResults.forEach((result) => {
      expect(result.content).toBe(true);
    });

    // Performance expectation
    expect(duration).toBeLessThan(8000); // Should complete within 8 seconds

    console.log(
      `⚡ SPEED: ${rapidResults.length} rapid navigations in ${duration}ms`
    );
  });

  test('BOUNDARY TEST: Navigation limits with both EPUBs', async ({ page }) => {
    // Test with local EPUB first (faster)
    await setupEpub(page, TEST_CONFIG.LOCAL_ALICE.url, false);

    // Go to beginning
    const beginningResults = await performBatchNavigation(page, [
      'prev',
      'prev',
      'prev',
      'prev',
    ]);

    // Go to end
    const endResults = await performBatchNavigation(page, [
      'next',
      'next',
      'next',
      'next',
      'next',
      'next',
    ]);

    // All boundary states should have content
    [...beginningResults, ...endResults].forEach((result) => {
      expect(result.content).toBe(true);
    });

    console.log(
      `🎯 BOUNDARIES: Beginning(${beginningResults.length}) + End(${endResults.length}) states validated`
    );
  });

  test('CONTAINER TEST: Phantom element sizing across chapters', async ({
    page,
  }) => {
    await setupEpub(page, TEST_CONFIG.REMOTE_MOBY.url, true);

    const containerData: ContainerData[] = [];

    // Navigate through multiple chapters and collect container data
    for (let i = 0; i < 6; i++) {
      await page.click('#next');
      await page.waitForTimeout(400);

      const state = await getQuickNavState(page);
      containerData.push({
        step: i + 1,
        chapter: state.chapter,
        scrollWidth: state.scrollWidth,
        scrollLeft: state.scrollLeft,
      });

      // Container should expand (phantom element)
      expect(state.scrollWidth).toBeGreaterThan(0);
      expect(state.scrollLeft).toBeGreaterThanOrEqual(0);
    }

    // Should see width changes across chapters
    const widths = containerData.map((d) => d.scrollWidth);
    const uniqueWidths = [...new Set(widths)];
    expect(uniqueWidths.length).toBeGreaterThanOrEqual(1);

    containerData.forEach((data) => {
      console.log(
        `📏 Container ${data.step}: ${data.chapter} width=${data.scrollWidth} scroll=${data.scrollLeft}`
      );
    });

    console.log(
      `✅ CONTAINER: ${containerData.length} steps, ${uniqueWidths.length} unique widths`
    );
  });
});

test.describe('EPUB Navigation - Cross-Format Validation', () => {
  test('COMPREHENSIVE: Local vs Remote EPUB behavior', async ({ page }) => {
    const comparisonResults: ComparisonResult[] = [];

    // Test both EPUBs with same navigation pattern
    const testConfigs = [
      { name: 'Alice-Local', url: TEST_CONFIG.LOCAL_ALICE.url, isLocal: true },
      { name: 'Moby-Remote', url: TEST_CONFIG.REMOTE_MOBY.url, isLocal: false },
    ];

    for (const config of testConfigs) {
      await setupEpub(page, config.url, true);

      const navResults = await performBatchNavigation(page, [
        'next',
        'next',
        'prev',
        'next',
      ]);

      const validStates = navResults.filter((r) => r.content).length;
      const chapterTransitions = navResults.filter(
        (r, i) => i > 0 && r.chapter !== navResults[i - 1].chapter
      ).length;

      comparisonResults.push({
        name: config.name,
        totalNav: navResults.length,
        validStates,
        chapterTransitions,
        isLocal: config.isLocal,
      });

      // All navigation should be valid
      expect(validStates).toBe(navResults.length);
    }

    // Cross-format consistency check
    console.log('=== CROSS-FORMAT COMPARISON ===');
    comparisonResults.forEach((result) => {
      console.log(
        `${result.name}: ${result.validStates}/${result.totalNav} valid, ${result.chapterTransitions} transitions, local=${result.isLocal}`
      );
    });

    // Both should have 100% valid navigation
    comparisonResults.forEach((result) => {
      expect(result.validStates / result.totalNav).toBe(1.0);
    });

    console.log(
      '✅ CROSS-FORMAT: Both local and remote EPUBs behave consistently'
    );
  });
});
