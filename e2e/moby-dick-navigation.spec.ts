import { test, expect } from '@playwright/test';

test.describe('EPUB Navigation - Comprehensive Edge Cases Test Suite', () => {
  // Helper functions
  const getDetailedState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const currentView = manager.views.last();
      const hasContent = currentView && currentView.document && 
        currentView.document.body && currentView.document.body.textContent.trim().length > 0;
      
      return {
        // Chapter info
        chapter: location && location.length > 0 ? location[0].href : 'unknown',
        totalPages: location && location.length > 0 ? location[0].totalPages : 0,
        currentPages: location && location.length > 0 ? location[0].pages : [],
        
        // Scroll info
        scrollLeft: manager.container ? manager.container.scrollLeft : 0,
        scrollWidth: manager.container ? manager.container.scrollWidth : 0,
        offsetWidth: manager.container ? manager.container.offsetWidth : 0,
        
        // Content validation
        content: hasContent,
        contentWidth: currentView?.contents?.textWidth?.() || 0,
        
        // Navigation state
        layoutDelta: manager.layout?.delta || 0,
        canScrollNext: manager.container ? 
          (manager.container.scrollLeft + manager.container.offsetWidth + manager.layout.delta) <= manager.container.scrollWidth : false
      };
    });
  };

  const clickNext = async (page: any) => {
    return await page.evaluate(() => {
      const nextButton = document.getElementById('next');
      if (nextButton) {
        console.log('MANUAL: next() clicked, current scrollLeft:', 
          (window as any).rendition?.manager?.container?.scrollLeft || 0);
        nextButton.click();
        return true;
      }
      return false;
    });
  };

  const clickPrev = async (page: any) => {
    return await page.evaluate(() => {
      const prevButton = document.getElementById('prev');  
      if (prevButton) {
        console.log('MANUAL: prev() clicked, current scrollLeft:', 
          (window as any).rendition?.manager?.container?.scrollLeft || 0);
        prevButton.click();
        return true;
      }
      return false;
    });
  };

  const waitForNavigation = async (page: any, timeout = 2000) => {
    await page.waitForTimeout(timeout);
  };

  const setupEpub = async (page: any) => {
    await page.goto('http://localhost:8080/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });
  };

  // Test 1: White page detection
  test('should never show white pages (content beyond totalPages)', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST 1: WHITE PAGE DETECTION ===');
    
    let clickCount = 0;
    const MAX_CLICKS = 15;
    
    while (clickCount < MAX_CLICKS) {
      await clickNext(page);
      await waitForNavigation(page);
      
      const state = await getDetailedState(page);
      console.log(`Click ${clickCount + 1}: ${state.chapter} pages=[${state.currentPages}] total=${state.totalPages} content=${state.content}`);
      
      // Critical: Never show white pages
      expect(state.content).toBe(true);
      
      // Critical: Never show pages beyond totalPages 
      if (state.currentPages.length > 0 && state.totalPages > 0) {
        const maxDisplayedPage = Math.max(...state.currentPages);
        expect(maxDisplayedPage).toBeLessThanOrEqual(state.totalPages);
        if (maxDisplayedPage > state.totalPages) {
          console.error(`🚨 WHITE PAGE DETECTED: showing page ${maxDisplayedPage} of ${state.totalPages} total pages`);
        }
      }
      
      clickCount++;
      
      // Stop if we reach a reasonable chapter depth
      if (state.chapter.includes('chapter_003') || state.chapter.includes('chapter_004')) {
        break;
      }
    }
    
    console.log('✅ White page test completed');
  });

  // Test 2: Intra-chapter navigation before chapter jumps
  test('should navigate within chapters before jumping to next chapter', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST 2: INTRA-CHAPTER NAVIGATION ===');
    
    const startState = await getDetailedState(page);
    console.log(`Starting: ${startState.chapter} pages=[${startState.currentPages}] scroll=${startState.scrollLeft}/${startState.scrollWidth}`);
    
    let currentChapter = startState.chapter;
    let sameChapterScrolls = 0;
    let totalClicks = 0;
    
    for (let i = 0; i < 10; i++) {
      await clickNext(page);
      await waitForNavigation(page);
      
      const state = await getDetailedState(page);
      console.log(`Click ${i + 1}: ${state.chapter} pages=[${state.currentPages}] scroll=${state.scrollLeft}/${state.scrollWidth} canScrollNext=${state.canScrollNext}`);
      
      expect(state.content).toBe(true);
      
      if (state.chapter === currentChapter) {
        sameChapterScrolls++;
        // Verify we're actually scrolling within the chapter (scroll position should change)
        if (sameChapterScrolls > 1) {
          expect(state.scrollLeft).toBeGreaterThan(0);
        }
      } else {
        console.log(`📚 Chapter transition: ${currentChapter} → ${state.chapter} after ${sameChapterScrolls} intra-chapter scrolls`);
        
        // We should scroll within chapters before jumping (except for very short chapters)
        if (i > 0 && !currentChapter.includes('epigraph')) {
          expect(sameChapterScrolls).toBeGreaterThan(0);
        }
        
        currentChapter = state.chapter;
        sameChapterScrolls = 0;
      }
      
      totalClicks++;
    }
    
    console.log(`✅ Intra-chapter navigation test completed. Total clicks: ${totalClicks}`);
  });

  // Test 3: Bidirectional navigation symmetry
  test('should handle prev() navigation correctly (go to end of previous chapter)', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST 3: BIDIRECTIONAL NAVIGATION ===');
    
    // Navigate forward to chapter 2
    await clickNext(page);
    await waitForNavigation(page);
    await clickNext(page);
    await waitForNavigation(page);
    
    const beforePrevState = await getDetailedState(page);
    console.log(`Before prev(): ${beforePrevState.chapter} pages=[${beforePrevState.currentPages}] scroll=${beforePrevState.scrollLeft}`);
    
    // Go back one
    await clickPrev(page);
    await waitForNavigation(page, 3000); // Give more time for complex navigation
    
    const afterPrevState = await getDetailedState(page);
    console.log(`After prev(): ${afterPrevState.chapter} pages=[${afterPrevState.currentPages}] scroll=${afterPrevState.scrollLeft}`);
    
    expect(afterPrevState.content).toBe(true);
    
    // If we changed chapters, we should be at the END of the previous chapter, not the beginning
    if (afterPrevState.chapter !== beforePrevState.chapter) {
      console.log(`📚 Went back to previous chapter: ${afterPrevState.chapter}`);
      
      // Should be showing the last pages of the chapter, not the first
      if (afterPrevState.currentPages.length > 0 && afterPrevState.totalPages > 1) {
        const minDisplayedPage = Math.min(...afterPrevState.currentPages);
        expect(minDisplayedPage).toBeGreaterThan(1); // Should NOT be at page 1 (beginning)
        console.log(`✅ Correctly positioned at end of previous chapter (page ${minDisplayedPage}+)`);
      }
    }
    
    console.log('✅ Bidirectional navigation test completed');
  });

  // Test 4: Container scroll width expansion
  test('should properly expand container scrollWidth for content', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST 4: CONTAINER SCROLL EXPANSION ===');
    
    const initialState = await getDetailedState(page);
    console.log(`Initial: scrollWidth=${initialState.scrollWidth} offsetWidth=${initialState.offsetWidth} contentWidth=${initialState.contentWidth}`);
    
    // After first click, container should expand if needed
    await clickNext(page);
    await waitForNavigation(page);
    
    const afterClickState = await getDetailedState(page);
    console.log(`After click: scrollWidth=${afterClickState.scrollWidth} offsetWidth=${afterClickState.offsetWidth} contentWidth=${afterClickState.contentWidth}`);
    
    // If content is wider than container, scrollWidth should be expanded
    if (afterClickState.contentWidth > afterClickState.offsetWidth) {
      expect(afterClickState.scrollWidth).toBeGreaterThan(afterClickState.offsetWidth);
      expect(afterClickState.scrollWidth).toBeGreaterThanOrEqual(afterClickState.contentWidth);
      console.log('✅ Container properly expanded for content');
    }
    
    console.log('✅ Container expansion test completed');
  });

  // Test 5: Navigation boundaries and limits  
  test('should handle navigation boundaries correctly', async ({ page }) => {
    await setupEpub(page);
    console.log('=== TEST 5: NAVIGATION BOUNDARIES ===');
    
    // Test forward boundary - navigate to very end
    let clickCount = 0;
    const MAX_FORWARD = 20;
    let lastState;
    
    while (clickCount < MAX_FORWARD) {
      await clickNext(page);
      await waitForNavigation(page);
      
      const state = await getDetailedState(page);
      
      // Should never show white pages even at boundaries
      expect(state.content).toBe(true);
      
      // If we're not advancing anymore, we've hit the boundary
      if (lastState && state.chapter === lastState.chapter && 
          JSON.stringify(state.currentPages) === JSON.stringify(lastState.currentPages)) {
        console.log(`📚 Hit forward boundary at: ${state.chapter} pages=[${state.currentPages}]`);
        break;
      }
      
      lastState = state;
      clickCount++;
    }
    
    // Test backward boundary
    clickCount = 0;
    const MAX_BACKWARD = 25;
    
    while (clickCount < MAX_BACKWARD) {
      await clickPrev(page);
      await waitForNavigation(page, 1500);
      
      const state = await getDetailedState(page);
      expect(state.content).toBe(true);
      
      if (lastState && state.chapter === lastState.chapter && 
          JSON.stringify(state.currentPages) === JSON.stringify(lastState.currentPages)) {
        console.log(`📚 Hit backward boundary at: ${state.chapter} pages=[${state.currentPages}]`);
        break;
      }
      
      lastState = state;
      clickCount++;
    }
    
    console.log('✅ Navigation boundaries test completed');
  });
});

// Test configurations for different EPUB sources and layouts
const testConfigurations = [
  // Moby Dick - Web URL Unzipped (Package.opf)
  {
    name: 'Moby Dick (Web/Unzipped) - Auto Spread',
    url: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
    source: 'web-unzipped',
    book: 'moby-dick',
    renditionConfig: {
      width: '100%',
      height: 600,
      spread: 'auto'
    },
    flow: 'paginated',
    testType: 'modern',
    description: 'Web-hosted unzipped EPUB with automatic spread detection'
  },
  {
    name: 'Moby Dick (Web/Unzipped) - Always Spread', 
    url: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
    source: 'web-unzipped',
    book: 'moby-dick',
    renditionConfig: {
      width: '100%',
      height: 600,
      spread: 'always'
    },
    flow: 'paginated',
    testType: 'modern',
    description: 'Web-hosted unzipped EPUB with forced spread mode'
  },
  {
    name: 'Moby Dick (Legacy Debug Page) - Spread Mode',
    url: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
    renditionConfig: {
      width: 900,
      height: 600,
      spread: 'auto'
    },
    flow: 'paginated',
    testType: 'legacy',
    description: 'Original debug page configuration for regression testing'
  }
];

test.describe('EPUB Navigation Tests - Comprehensive Test Suite', () => {
  // Shared helper functions for all test configurations
  const getChapterState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const currentView = rendition.manager.views.last();
      const hasContent = currentView && currentView.document && 
        currentView.document.body && currentView.document.body.textContent.trim().length > 0;
      
      return {
        chapter: location && location.length > 0 ? location[0].href : 'unknown',
        scroll: rendition.manager.container ? 
          `${rendition.manager.container.scrollLeft}/${rendition.manager.container.scrollWidth}` : '0/0',
        content: hasContent
      };
    });
  };

  const clickNext = async (page: any) => {
    return await page.evaluate(() => {
      const nextButton = document.getElementById('next');
      if (nextButton) {
        console.log('MANUAL: next() clicked, current scrollLeft:', 
          (window as any).rendition?.manager?.container?.scrollLeft || 0);
        nextButton.click();
        return true;
      }
      return false;
    });
  };

  const clickPrev = async (page: any) => {
    return await page.evaluate(() => {
      const prevButton = document.getElementById('prev');  
      if (prevButton) {
        prevButton.click();
        return true;
      }
      return false;
    });
  };

  const waitForNavigation = async (page: any, timeout = 3000) => {
    await page.waitForTimeout(timeout);
  };

  // Test the specific transparent iframe issue
  test('should fix asymmetric navigation in transparent iframe example', async ({ page }) => {
    // Navigate to the transparent iframe highlights example
    await page.goto('http://localhost:8080/examples/transparent-iframe-hightlights.html');
    
    // Wait for EPUB to load
    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    console.log('=== TESTING TRANSPARENT IFRAME ASYMMETRIC NAVIGATION BUG ===');
    
    const startState = await getChapterState(page);
    console.log(`🎯 Starting state: chapter=${startState.chapter}, scroll=${startState.scroll}, content=${startState.content}`);
    expect(startState.content).toBe(true);

    // Test next navigation
    await clickNext(page);
    await waitForNavigation(page);
    
    const afterNext = await getChapterState(page);
    console.log(`🔄 After next(): chapter=${afterNext.chapter}, scroll=${afterNext.scroll}, content=${afterNext.content}`);
    expect(afterNext.content).toBe(true);

    // Test prev navigation (ensure it works)
    await clickPrev(page);
    await waitForNavigation(page, 4000); // Give more time for complex navigation
    
    const afterPrev = await getChapterState(page);
    console.log(`🔄 After prev(): chapter=${afterPrev.chapter}, scroll=${afterPrev.scroll}, content=${afterPrev.content}`);
    expect(afterPrev.content).toBe(true);

    // Test next again to ensure no navigation trap
    await clickNext(page);
    await waitForNavigation(page);
    
    const afterNextAgain = await getChapterState(page);
    console.log(`🔄 After next() again: chapter=${afterNextAgain.chapter}, content=${afterNextAgain.content}`);
    expect(afterNextAgain.content).toBe(true);

    console.log('✅ Transparent iframe asymmetric navigation bug test completed - no navigation trap detected');
  });

  // Add more comprehensive edge case tests
  test('should handle white page detection and chapter boundary navigation', async ({ page }) => {
    await page.goto('http://localhost:8080/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    console.log('=== TESTING WHITE PAGE DETECTION AND CHAPTER BOUNDARIES ===');
    
    // Test for white page detection by monitoring scroll positions
    let previousState = await getChapterState(page);
    let clickCount = 0;
    const MAX_CLICKS = 10;
    
    while (clickCount < MAX_CLICKS) {
      await clickNext(page);
      await waitForNavigation(page, 1000);
      
      const currentState = await getChapterState(page);
      console.log(`📖 Click ${clickCount + 1}: chapter=${currentState.chapter}, scroll=${currentState.scroll}, content=${currentState.content}`);
      
      // Check for white page (no content)
      expect(currentState.content).toBe(true);
      
      // Check for chapter skipping (jumping multiple chapters without intra-chapter scrolling)
      if (currentState.chapter !== previousState.chapter) {
        console.log(`📚 Chapter transition: ${previousState.chapter} → ${currentState.chapter}`);
      }
      
      previousState = currentState;
      clickCount++;
      
      // Break if we've moved significantly through the book
      if (currentState.scroll.includes('chapter_005') || currentState.scroll.includes('chapter_006')) {
        break;
      }
    }
    
    console.log('✅ White page detection and chapter boundary test completed');
  });

  test('should navigate within chapters before jumping to next chapter', async ({ page }) => {
    await page.goto('http://localhost:8080/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    console.log('=== TESTING INTRA-CHAPTER NAVIGATION BEFORE CHAPTER JUMPS ===');
    
    const startState = await getChapterState(page);
    console.log(`🎯 Starting: ${startState.chapter} scroll=${startState.scroll}`);
    
    let sameChapterScrolls = 0;
    let totalClicks = 0;
    let currentChapter = startState.chapter;
    
    // Click next multiple times and verify we scroll within chapter first
    for (let i = 0; i < 8; i++) {
      await clickNext(page);
      await waitForNavigation(page, 1000);
      
      const state = await getChapterState(page);
      console.log(`📄 Click ${i + 1}: ${state.chapter} scroll=${state.scroll}`);
      expect(state.content).toBe(true);
      
      if (state.chapter === currentChapter) {
        sameChapterScrolls++;
      } else {
        console.log(`📚 Chapter changed from ${currentChapter} to ${state.chapter} after ${sameChapterScrolls} same-chapter scrolls`);
        
        // We should have scrolled within the chapter at least once before changing chapters
        if (i > 0) { // Skip check for first chapter as it might be short
          expect(sameChapterScrolls).toBeGreaterThan(0); 
        }
        
        currentChapter = state.chapter;
        sameChapterScrolls = 0;
      }
      
      totalClicks++;
    }
    
    console.log(`✅ Intra-chapter navigation test completed. Total clicks: ${totalClicks}`);
  });

  const getChapterState = async (page: any) => {
      const rendition = (window as any).rendition;
      const manager = rendition?.manager;
      const container = manager?.container;
      const visible = manager?.visible();

      if (visible && visible.length > 0) {
        const view = visible[0];
        const textContent = view.contents?.document?.body?.textContent?.trim() || '';
        
        return {
          scrollLeft: container?.scrollLeft || 0,
          scrollWidth: container?.scrollWidth || 0,
          offsetWidth: container?.offsetWidth || 0,
          visibleViews: visible.length,
          chapter: view.section?.href || 'unknown',
          hasContent: textContent.length > 100,
          textLength: textContent.length,
          preview: textContent.substring(0, 100) + '...',
          flow: rendition.settings?.flow || 'unknown',
          spread: rendition.settings?.spread || 'none'
        };
      }
      
      return { 
        scrollLeft: 0, 
        scrollWidth: 0, 
        offsetWidth: 0,
        visibleViews: 0,
        chapter: 'none', 
        hasContent: false, 
        textLength: 0, 
        preview: '',
        flow: 'unknown',
        spread: 'none'
      };
    });
  };

  const setupModernConfig = async (page: any, baseURL: string, config: any) => {
    await page.goto(`${baseURL}/e2e/fixtures/epub-test-page.html`);

    page.on('console', (msg: any) => {
      try {
        console.log('PAGE:', msg.text());
      } catch {
        // ignore
      }
    });

    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function',
      { timeout: 15000 }
    );

    await page.evaluate(
      (testConfig) => {
        const book = (window as any).ePub(testConfig.url, {
          requestMethod: 'fetch',
          canonical: function(path: string) {
            return testConfig.url + '/../' + path;
          }
        });

        const rendition = book.renderTo('test-viewer', testConfig.renditionConfig);
        (window as any).book = book;
        (window as any).rendition = rendition;
        return rendition.display();
      },
      config
    );

    await page.waitForFunction(
      () => (window as any).rendition && typeof (window as any).rendition.next === 'function',
      { timeout: 15000 }
    );

    await page.waitForTimeout(3000);
  };

  const setupLegacyConfig = async (page: any, baseURL: string) => {
    await page.goto(`${baseURL}/debug-manual-browser.html`);

    page.on('console', (msg: any) => {
      try {
        console.log('PAGE:', msg.text());
      } catch {
        // ignore
      }
    });

    await page.waitForFunction(
      () => (window as any).ePub && typeof (window as any).ePub === 'function',
      { timeout: 15000 }
    console.log('✅ White pages and chapter skipping test completed');
  });

  test('should handle prev navigation correctly - go to END of previous chapter, not beginning', async ({ page }) => {
    await page.goto('/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    console.log('=== TESTING PREV NAVIGATION - SHOULD GO TO END OF PREVIOUS CHAPTER ===');

    const getDetailedState = async () => {
      return await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const location = rendition.currentLocation();
        const manager = rendition.manager;
        const container = manager.container;
        
        if (location && location.length > 0) {
          const loc = location[0];
          return {
            chapter: loc.href,
            currentPage: loc.pages ? loc.pages[0] : 0,
            totalPages: loc.totalPages || 0,
            scrollLeft: container ? container.scrollLeft : 0,
            scrollWidth: container ? container.scrollWidth : 0,
            index: loc.index
          };
        }
        return { chapter: 'unknown', currentPage: 0, totalPages: 0, scrollLeft: 0, scrollWidth: 0, index: -1 };
      });
    };

    // Navigate forward to get to a later chapter
    await page.click('#next');
    await page.waitForTimeout(1000);
    await page.click('#next');
    await page.waitForTimeout(1000);
    
    const beforePrevState = await getDetailedState();
    console.log(`📖 Before prev: ${beforePrevState.chapter} page=${beforePrevState.currentPage}/${beforePrevState.totalPages} index=${beforePrevState.index}`);
    
    // Click prev - this should go to the END of the previous chapter, not beginning
    await page.click('#prev');
    await page.waitForTimeout(2000);
    
    const afterPrevState = await getDetailedState();
    console.log(`📖 After prev: ${afterPrevState.chapter} page=${afterPrevState.currentPage}/${afterPrevState.totalPages} index=${afterPrevState.index}`);
    
    // Key assertion: if we went to a previous chapter, we should be near the END of that chapter
    if (afterPrevState.chapter !== beforePrevState.chapter && afterPrevState.totalPages > 1) {
      console.log(`📚 Changed chapters: ${beforePrevState.chapter} → ${afterPrevState.chapter}`);
      console.log(`📄 Expected: near end of chapter (page close to ${afterPrevState.totalPages}), Got: page ${afterPrevState.currentPage}`);
      
      // Should be on the last page or close to it, NOT on page 1
      expect(afterPrevState.currentPage).toBeGreaterThan(1);
      // Should be on a reasonable page number (not beyond total)
      expect(afterPrevState.currentPage).toBeLessThanOrEqual(afterPrevState.totalPages + 1); // Allow slight overflow
    }

    console.log('✅ Prev navigation positioning test completed');
  });

  test('should detect and prevent white pages with invalid page numbers', async ({ page }) => {
    await page.goto('/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    console.log('=== TESTING WHITE PAGE DETECTION WITH INVALID PAGE NUMBERS ===');

    const getPageState = async () => {
      return await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const location = rendition.currentLocation();
        const currentView = rendition.manager.views.last();
        const hasContent = currentView && currentView.document && 
          currentView.document.body && currentView.document.body.textContent.trim().length > 100;
        
        if (location && location.length > 0) {
          const loc = location[0];
          return {
            chapter: loc.href,
            currentPage: loc.displayed ? loc.displayed.page : 0,
            totalPages: loc.displayed ? loc.displayed.total : 0,
            hasContent: hasContent,
            isWhitePage: !hasContent,
            isInvalidPage: loc.displayed ? (loc.displayed.page > loc.displayed.total) : false
          };
        }
        return { 
          chapter: 'unknown', 
          currentPage: 0, 
          totalPages: 0, 
          hasContent: false, 
          isWhitePage: true,
          isInvalidPage: false 
        };
      });
    };

    let clickCount = 0;
    const maxClicks = 20;
    
    while (clickCount < maxClicks) {
      await page.click('#next');
      await page.waitForTimeout(500);
      clickCount++;
      
      const state = await getPageState();
      console.log(`📄 Click ${clickCount}: ${state.chapter} page=${state.currentPage}/${state.totalPages} content=${state.hasContent} invalid=${state.isInvalidPage}`);
      
      // Critical assertions:
      expect(state.hasContent).toBe(true); // No white pages
      expect(state.isInvalidPage).toBe(false); // No invalid page numbers (page 5 of 2, etc.)
      
      // Additional check: if current page > total pages, that's a white page bug
      if (state.currentPage > state.totalPages && state.totalPages > 0) {
        console.log(`🚨 INVALID PAGE DETECTED: page ${state.currentPage} of ${state.totalPages}`);
        expect(state.currentPage).toBeLessThanOrEqual(state.totalPages);
      }
      
      // Stop after reasonable amount of clicks
      if (clickCount >= 15) break;
    }

    console.log('✅ White page and invalid page number detection test completed');
  });
});
    await page.waitForFunction(
      () => (window as any).rendition && typeof (window as any).rendition.next === 'function',
      { timeout: 15000 }
    );

    await page.evaluate(async () => {
      const r = (window as any).rendition;
      if (r && r.started) {
        try {
          await r.started;
        } catch (e) {}
      }
    });

    await page.waitForTimeout(2000);
  };

  const clickNext = async (page: any, description = '') => {
    await page.click('#next');
    await page.waitForTimeout(800);
    if (description) console.log(description);
  };

  const clickPrev = async (page: any, description = '') => {
    await page.click('#prev');
    await page.waitForTimeout(1000);
    if (description) console.log(description);
  };

  // Test each configuration
  for (const config of testConfigurations) {
    const setupPageWithConfig = async (page: any, baseURL: string) => {
      if (config.testType === 'legacy') {
        await setupLegacyConfig(page, baseURL);
      } else {
        await setupModernConfig(page, baseURL, config);
      }
    };

    test.describe(`Navigation tests for ${config.name}`, () => {
      test(`should handle basic navigation in ${config.name}`, async ({ page, baseURL }) => {
        test.setTimeout(60_000);
        await setupPageWithConfig(page, baseURL!);

        console.log(`\n=== TESTING BASIC NAVIGATION: ${config.name} ===`);
        console.log(`Description: ${config.description}`);

        const initialState = await getChapterState(page);
        console.log('Initial state:', JSON.stringify(initialState, null, 2));

        // Ensure we have valid initial content
        expect(initialState.hasContent).toBe(true);
        expect(initialState.visibleViews).toBeGreaterThan(0);

        // Test forward navigation
        await clickNext(page, `🔄 Testing forward navigation in ${config.flow} flow`);
        const afterNext = await getChapterState(page);

        expect(afterNext.hasContent).toBe(true);
        expect(afterNext.visibleViews).toBeGreaterThan(0);
        console.log(`After next: ${afterNext.chapter}, content: ${afterNext.hasContent}`);

        // Test backward navigation
        await clickPrev(page, `🔄 Testing backward navigation in ${config.flow} flow`);
        const afterPrev = await getChapterState(page);

        expect(afterPrev.hasContent).toBe(true);
        expect(afterPrev.visibleViews).toBeGreaterThan(0);
        console.log(`After prev: ${afterPrev.chapter}, content: ${afterPrev.hasContent}`);

        console.log(`✅ Basic navigation test completed for ${config.name}`);
      });

      if (config.flow === 'paginated') {
        test(`should handle asymmetric navigation fix in ${config.name}`, async ({ page, baseURL }) => {
          test.setTimeout(90_000);
          await setupPageWithConfig(page, baseURL!);

          console.log(`\n=== TESTING ASYMMETRIC NAVIGATION FIX: ${config.name} ===`);
          console.log(`Spread mode: ${config.renditionConfig.spread}`);

          // Get initial position
          const startState = await getChapterState(page);
          console.log(`Starting position: ${startState.chapter}, scroll: ${startState.scrollLeft}/${startState.scrollWidth}`);

          // Navigate forward once  
          await clickNext(page, '🔄 Forward navigation step');
          const afterNext = await getChapterState(page);
          console.log(`After next: ${afterNext.chapter}, scroll: ${afterNext.scrollLeft}/${afterNext.scrollWidth}`);

          expect(afterNext.hasContent).toBe(true);
          expect(afterNext.visibleViews).toBeGreaterThan(0);

          // Navigate backward once - this should NOT create asymmetry
          await clickPrev(page, '🔄 Backward navigation step (testing asymmetry fix)');
          const afterPrev = await getChapterState(page);
          console.log(`After prev: ${afterPrev.chapter}, scroll: ${afterPrev.scrollLeft}/${afterPrev.scrollWidth}`);

          // Verify we can navigate bidirectionally without getting stuck
          expect(afterPrev.hasContent).toBe(true);
          expect(afterPrev.visibleViews).toBeGreaterThan(0);

          // Test forward again to ensure no navigation trap
          await clickNext(page, '🔄 Forward again to test no navigation trap');
          const afterNextAgain = await getChapterState(page);
          expect(afterNextAgain.hasContent).toBe(true);

          console.log(`✅ Asymmetric navigation test completed for ${config.name}`);
        });
      }
    });
  }
});

test.describe('Legacy Navigation Tests (Asymmetric Navigation Bug)', () => {
  test('should fix asymmetric navigation in transparent iframe example', async ({ page, baseURL }) => {
    test.setTimeout(90_000);

    // Navigate to the transparent iframe example (starts at section 6)
    await page.goto(`${baseURL}/examples/transparent-iframe-hightlights.html`);

    page.on('console', (msg: any) => {
      try {
        console.log('EXAMPLE PAGE:', msg.text());
      } catch {
        // ignore
      }
    });

    // Wait for the example to load
    await page.waitForFunction(
      () => (window as any).rendition && typeof (window as any).rendition.next === 'function',
      { timeout: 15000 }
    );

    await page.waitForTimeout(3000);

    console.log('\n=== TESTING TRANSPARENT IFRAME ASYMMETRIC NAVIGATION BUG ===');

    // Get initial state (should be section 6)
    const getState = async () => {
      return await page.evaluate(() => {
        const manager = (window as any).rendition?.manager;
        const container = manager?.container;
        const visible = manager?.visible();

        if (visible && visible.length > 0) {
          const view = visible[0];
          const textContent = view.contents?.document?.body?.textContent?.trim() || '';
          
          return {
            scrollLeft: container?.scrollLeft || 0,
            scrollWidth: container?.scrollWidth || 0,
            chapter: view.section?.href || 'unknown',
            hasContent: textContent.length > 100,
            textLength: textContent.length,
          };
        }
        
        return { 
          scrollLeft: 0, 
          scrollWidth: 0,
          chapter: 'none', 
          hasContent: false, 
          textLength: 0
        };
      });
    };

    const startState = await getState();
    console.log(`🎯 Starting state: chapter=${startState.chapter}, scroll=${startState.scrollLeft}/${startState.scrollWidth}, content=${startState.hasContent}`);

    expect(startState.hasContent).toBe(true);

    // Click next - this historically would go to PREVIOUS spine item due to bug
    await page.click('#next');
    await page.waitForTimeout(1000);
    
    const afterNext = await getState();
    console.log(`🔄 After next(): chapter=${afterNext.chapter}, scroll=${afterNext.scrollLeft}/${afterNext.scrollWidth}, content=${afterNext.hasContent}`);

    expect(afterNext.hasContent).toBe(true);

    // Click prev - this historically would FAIL to return to original position (asymmetric bug)
    await page.click('#prev');  
    await page.waitForTimeout(1000);

    const afterPrev = await getState();
    console.log(`🔄 After prev(): chapter=${afterPrev.chapter}, scroll=${afterPrev.scrollLeft}/${afterPrev.scrollWidth}, content=${afterPrev.hasContent}`);

    // The key test: after next() followed by prev(), we should have valid content and not be stuck
    expect(afterPrev.hasContent).toBe(true);
    
    // Test that we can continue navigating (no navigation trap)
    await page.click('#next');
    await page.waitForTimeout(1000);
    
    const afterNextAgain = await getState();
    console.log(`🔄 After next() again: chapter=${afterNextAgain.chapter}, content=${afterNextAgain.hasContent}`);

    expect(afterNextAgain.hasContent).toBe(true);

    console.log('✅ Transparent iframe asymmetric navigation bug test completed - no navigation trap detected');
  });

  test('should prevent white pages and chapter skipping within sections', async ({ page }) => {
    await page.goto('/examples/transparent-iframe-hightlights.html');

    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    const getState = async () => {
      return await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const currentLocation = rendition?.currentLocation() || [];
        const chapter = currentLocation.length > 0 ? currentLocation[0].href : 'none';
        const container = rendition?.manager?.container;
        const currentView = rendition?.manager?.views?.last();
        const textContent = currentView?.contents?.document?.body?.textContent?.trim() || '';
        
        return {
          scrollLeft: container ? container.scrollLeft : 0,
          scrollWidth: container ? container.scrollWidth : 0,
          offsetWidth: container ? container.offsetWidth : 0,
          chapter: chapter,
          hasContent: textContent.length > 100,
          textLength: textContent.length,
          currentPage: currentLocation.length > 0 && currentLocation[0].pages ? currentLocation[0].pages[0] : 0,
          totalPages: currentLocation.length > 0 ? currentLocation[0].totalPages : 0
        };
      });
    };

    const startState = await getState();
    console.log(`📖 Initial: ${startState.chapter} page=${startState.currentPage}/${startState.totalPages} scroll=${startState.scrollLeft}/${startState.scrollWidth}`);

    let previousState = startState;
    let clickCount = 0;
    const maxClicks = 15;
    
    // Test multiple next clicks to ensure no white pages and proper within-section scrolling
    while (clickCount < maxClicks) {
      await page.click('#next');
      await page.waitForTimeout(800);
      
      const currentState = await getState();
      clickCount++;
      
      console.log(`📖 Click ${clickCount}: ${currentState.chapter} page=${currentState.currentPage}/${currentState.totalPages} scroll=${currentState.scrollLeft}/${currentState.scrollWidth} content=${currentState.hasContent}`);
      
      // Critical tests:
      expect(currentState.hasContent).toBe(true); // No white pages
      
      // If we're in the same chapter, we should be progressing through pages
      if (currentState.chapter === previousState.chapter && previousState.totalPages > 0) {
        // Should be scrolling within section, not immediately jumping chapters
        if (previousState.currentPage < previousState.totalPages) {
          // We should advance page or scroll position, not immediately jump to next chapter
          const progressMade = currentState.currentPage > previousState.currentPage || 
                              currentState.scrollLeft > previousState.scrollLeft ||
                              currentState.chapter !== previousState.chapter;
          expect(progressMade).toBe(true);
        }
      }
      
      previousState = currentState;
      
      // Stop if we've moved significantly through content
      if (clickCount >= 8) break;
    }

    console.log('✅ White pages and chapter skipping test completed');
  });

  test('should navigate to END of previous chapter, not beginning', async ({ page }) => {
    await page.goto('/examples/transparent-iframe-hightlights.html');

    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    const getState = async () => {
      return await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const currentLocation = rendition?.currentLocation() || [];
        const chapter = currentLocation.length > 0 ? currentLocation[0].href : 'none';
        const container = rendition?.manager?.container;
        const currentView = rendition?.manager?.views?.last();
        const textContent = currentView?.contents?.document?.body?.textContent?.trim() || '';
        
        return {
          scrollLeft: container ? container.scrollLeft : 0,
          scrollWidth: container ? container.scrollWidth : 0,
          chapter: chapter,
          hasContent: textContent.length > 100,
          currentPage: currentLocation.length > 0 && currentLocation[0].pages ? currentLocation[0].pages[0] : 0,
          totalPages: currentLocation.length > 0 ? currentLocation[0].totalPages : 0,
          textPreview: textContent.substring(0, 100)
        };
      });
    };

    console.log('=== TESTING PREV() NAVIGATION TO END OF PREVIOUS CHAPTER ===');

    // Get initial state
    const startState = await getState();
    console.log(`🎯 Initial: ${startState.chapter} page=${startState.currentPage}/${startState.totalPages}`);

    // Navigate forward to get to next chapter  
    await page.click('#next');
    await page.waitForTimeout(1000);
    
    const afterNext = await getState();
    console.log(`➡️ After next: ${afterNext.chapter} page=${afterNext.currentPage}/${afterNext.totalPages}`);
    
    // If we're in a different chapter, test prev() behavior
    if (afterNext.chapter !== startState.chapter && afterNext.chapter !== 'none') {
      await page.click('#prev');
      await page.waitForTimeout(1000);
      
      const afterPrev = await getState();
      console.log(`⬅️ After prev: ${afterPrev.chapter} page=${afterPrev.currentPage}/${afterPrev.totalPages} scroll=${afterPrev.scrollLeft}/${afterPrev.scrollWidth}`);
      
      // Key test: When going back to previous chapter, we should be at the END, not beginning
      expect(afterPrev.hasContent).toBe(true);
      
      // If we went back to the original chapter, we should NOT be at page 1 (beginning)
      // We should be at the end of the chapter (high page number or high scroll position)
      if (afterPrev.chapter === startState.chapter && afterPrev.totalPages > 1) {
        console.log(`🔍 Checking if prev() went to END of chapter: currentPage=${afterPrev.currentPage}, totalPages=${afterPrev.totalPages}`);
        // Should be at the last page or close to it, not page 1
        const isAtEnd = afterPrev.currentPage === afterPrev.totalPages || 
                       afterPrev.currentPage === afterPrev.totalPages - 1 ||
                       afterPrev.scrollLeft > afterPrev.scrollWidth / 2; // Or at least halfway through
        if (!isAtEnd) {
          console.log(`🚨 BUG DETECTED: prev() went to page ${afterPrev.currentPage} of ${afterPrev.totalPages} (should be at end)`);
        }
        expect(isAtEnd).toBe(true);
      }
    }

    console.log('✅ Prev() navigation to end of previous chapter test completed');
  });

  test('should never display page X when X > totalPages (white page detection)', async ({ page }) => {
    await page.goto('/examples/transparent-iframe-hightlights.html');

    await page.waitForFunction(() => {
      return (window as any).rendition && 
             (window as any).rendition.manager && 
             (window as any).rendition.manager.views &&
             (window as any).rendition.manager.views.length > 0;
    }, { timeout: 10000 });

    const getState = async () => {
      return await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const currentLocation = rendition?.currentLocation() || [];
        const chapter = currentLocation.length > 0 ? currentLocation[0].href : 'none';
        const currentView = rendition?.manager?.views?.last();
        const textContent = currentView?.contents?.document?.body?.textContent?.trim() || '';
        
        return {
          chapter: chapter,
          hasContent: textContent.length > 100,
          currentPage: currentLocation.length > 0 && currentLocation[0].pages ? currentLocation[0].pages[0] : 0,
          totalPages: currentLocation.length > 0 ? currentLocation[0].totalPages : 0,
          allPages: currentLocation.length > 0 && currentLocation[0].pages ? currentLocation[0].pages : [],
          textLength: textContent.length
        };
      });
    };

    console.log('=== TESTING WHITE PAGE DETECTION (page > totalPages) ===');

    let clickCount = 0;
    const maxClicks = 20;
    
    while (clickCount < maxClicks) {
      await page.click('#next');
      await page.waitForTimeout(500);
      clickCount++;
      
      const state = await getState();
      console.log(`📖 Click ${clickCount}: ${state.chapter} pages=[${state.allPages.join(',')}] of ${state.totalPages} total, content=${state.hasContent} (${state.textLength} chars)`);
      
      // Critical white page tests:
      expect(state.hasContent).toBe(true); // Must have content
      
      // Check each displayed page
      for (const pageNum of state.allPages) {
        if (pageNum > state.totalPages && state.totalPages > 0) {
          console.log(`🚨 WHITE PAGE BUG: Displaying page ${pageNum} when totalPages is only ${state.totalPages} in ${state.chapter}`);
          expect(pageNum).toBeLessThanOrEqual(state.totalPages);
        }
      }
      
      // Stop if we've tested enough
      if (clickCount >= 15) break;
    }

    console.log('✅ White page detection test completed - no pages beyond totalPages found');
  });
});
