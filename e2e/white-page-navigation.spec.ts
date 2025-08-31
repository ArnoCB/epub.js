import { test, expect } from '@playwright/test';

test.describe('EPUB Navigation - White Page Issue Prevention', () => {
  const setupEpub = async (page: any) => {
    await page.goto(
      'http://localhost:8080/examples/transparent-iframe-hightlights.html'
    );
    await page.waitForFunction(
      () => {
        return (
          (window as any).rendition &&
          (window as any).rendition.manager &&
          (window as any).rendition.manager.views &&
          (window as any).rendition.manager.views.length > 0
        );
      },
      { timeout: 10000 }
    );
    await page.waitForTimeout(2000); // Let content fully load
  };

  const navigateForward = async (page: any, steps = 1) => {
    for (let i = 0; i < steps; i++) {
      await page.evaluate(() => {
        document.getElementById('next')?.click();
      });
      await page.waitForTimeout(500); // Shorter wait for rapid navigation
    }
  };

  const navigateBackward = async (page: any, steps = 1) => {
    for (let i = 0; i < steps; i++) {
      await page.evaluate(() => {
        document.getElementById('prev')?.click();
      });
      await page.waitForTimeout(500); // Shorter wait for rapid navigation
    }
  };

  const getNavigationState = async (page: any) => {
    return await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const location = rendition.currentLocation();
      const manager = rendition.manager;
      const container = manager.container;
      const currentView = manager.views.last();

      // Check for visible content
      let hasVisibleContent = false;
      let contentText = '';
      
      if (currentView?.document?.body) {
        const bodyText = currentView.document.body.textContent?.trim() || '';
        hasVisibleContent = bodyText.length > 0;
        contentText = bodyText.substring(0, 100); // First 100 chars for debugging
      }

      return {
        chapter: location?.[0]?.href || 'unknown',
        pages: location?.[0]?.pages || [],
        totalPages: location?.[0]?.totalPages || 0,
        scrollLeft: container.scrollLeft,
        scrollWidth: container.scrollWidth,
        offsetWidth: container.offsetWidth,
        hasVisibleContent,
        contentText,
        contentLength: currentView?.document?.body?.textContent?.trim()?.length || 0,
        viewWidth: currentView?.width?.() || 0,
        viewHeight: currentView?.height?.() || 0,
      };
    });
  };

  const waitForStableNavigation = async (page: any, timeoutMs = 3000) => {
    let stableCount = 0;
    let lastState: any = null;
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs && stableCount < 3) {
      const currentState = await getNavigationState(page);
      
      if (lastState && 
          lastState.chapter === currentState.chapter && 
          lastState.scrollLeft === currentState.scrollLeft) {
        stableCount++;
      } else {
        stableCount = 0;
      }
      
      lastState = currentState;
      await page.waitForTimeout(200);
    }
  };

  test('should handle rapid backward navigation without white pages', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/spreads.html');
    
    // Wait for the book to load completely
    await page.waitForSelector('#viewer iframe');
    await page.waitForTimeout(3000); // Let initial rendering complete
    
    // Navigate forward to chapter 1 (index 6 based on the logs)
    // The logs show starting at chapter_001.xhtml then going to epigraph_001.xhtml
    for (let i = 0; i < 2; i++) {
      await page.click('#next');
      await page.waitForTimeout(1000);
    }
    
    console.log('Starting backward navigation test...');
    
    // Now navigate backward multiple times - this reproduces the exact scenario
    // from the logs: chapter_001.xhtml -> epigraph_001.xhtml -> introduction_001.xhtml
    for (let i = 0; i < 3; i++) {
      console.log(`Backward navigation step ${i + 1}`);
      
      // Click prev and wait a bit for navigation
      await page.click('#prev');
      await page.waitForTimeout(800);
      
      // Check that we don't have a white page after each navigation
      const iframe = await page.locator('#viewer iframe').first();
      await iframe.waitFor({ state: 'attached' });
      
      const iframeContent = iframe.contentFrame();
      if (iframeContent) {
        // Wait for content to load
        await page.waitForTimeout(500);
        
        // Check that there's actual content visible
        const bodyText = await iframeContent.locator('body').textContent();
        console.log(`Step ${i + 1} body text length:`, bodyText?.trim().length || 0);
        
        // This is where the white page would manifest - no content
        expect(bodyText?.trim().length).toBeGreaterThan(0);
        
        // Also check that the iframe has proper dimensions
        const bodyElement = iframeContent.locator('body');
        const boundingBox = await bodyElement.boundingBox();
        expect(boundingBox).not.toBeNull();
        expect(boundingBox!.width).toBeGreaterThan(0);
        expect(boundingBox!.height).toBeGreaterThan(0);
      }
    }
  });

  test('should handle scroll position correctly during rapid navigation', async ({
    page,
  }) => {
    await setupEpub(page);

    // Navigate forward to build up content
    await navigateForward(page, 5);
    await waitForStableNavigation(page);

    // Monitor scroll positions during backward navigation
    console.log('=== Scroll Position Monitoring ===');
    
    const scrollEvents = [];
    
    // Listen for scroll position changes
    await page.evaluate(() => {
      const rendition = (window as any).rendition;
      const container = rendition.manager.container;
      
      // Store original scroll behavior
      (window as any).scrollEvents = [];
      
      const originalScrollTo = container.scrollLeft;
      Object.defineProperty(container, 'scrollLeft', {
        get() {
          return this._scrollLeft || 0;
        },
        set(value) {
          (window as any).scrollEvents.push({
            timestamp: Date.now(),
            from: this._scrollLeft || 0,
            to: value,
            stack: new Error().stack?.split('\n').slice(1, 4).join('\n') || 'no stack'
          });
          this._scrollLeft = value;
        }
      });
    });

    // Perform navigation that should trigger the issue
    await navigateBackward(page, 4);
    await waitForStableNavigation(page);

    // Get scroll events
    const events = await page.evaluate(() => (window as any).scrollEvents || []);
    
    console.log('Scroll events during navigation:', events);

    // Check for problematic scroll resets
    const problematicResets = events.filter(event => 
      event.from > 0 && event.to === 0
    );

    if (problematicResets.length > 0) {
      console.warn('Problematic scroll resets detected:', problematicResets);
    }

    // The test passes if we can navigate without white pages
    const finalState = await getNavigationState(page);
    expect(finalState.hasVisibleContent).toBe(true);
  });

  test('should maintain content visibility during chapter transitions', async ({
    page,
  }) => {
    await setupEpub(page);

    // Navigate to a chapter boundary
    await navigateForward(page, 10);
    await waitForStableNavigation(page);

    console.log('=== Chapter Boundary Navigation Test ===');

    // Navigate backward across chapter boundaries
    const transitionStates: any[] = [];
    
    for (let i = 0; i < 5; i++) {
      const beforeState = await getNavigationState(page);
      await navigateBackward(page, 1);
      
      // Check intermediate states during transition
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        await page.waitForTimeout(200);
        const duringState = await getNavigationState(page);
        
        // Log any white page occurrences during transition
        if (!duringState.hasVisibleContent) {
          console.warn(`Temporary white page during transition attempt ${attempts}`);
        }
        
        attempts++;
      }
      
      await waitForStableNavigation(page);
      const afterState = await getNavigationState(page);
      
      transitionStates.push({
        before: beforeState,
        after: afterState,
        chapterChanged: beforeState.chapter !== afterState.chapter
      });

      console.log(`Transition ${i + 1}:`, {
        from: beforeState.chapter,
        to: afterState.chapter,
        chapterChanged: beforeState.chapter !== afterState.chapter,
        hasContent: afterState.hasVisibleContent,
      });

      // Final state should always have content
      expect(afterState.hasVisibleContent, 
        `Final state has no content. Transitioned from ${beforeState.chapter} to ${afterState.chapter}`
      ).toBe(true);
    }
  });

  test('should reproduce white page issue with extreme backward navigation', async ({ page }) => {
    // Use the exact same page from the logs
    await page.goto('http://localhost:3000/examples/transparent-iframe-hightlights.html');
    
    // Wait for the book to load completely
    await page.waitForFunction(() => (window as any).book && (window as any).rendition);
    await page.waitForTimeout(3000);
    
    console.log('=== Reproducing white page issue with extreme backward navigation ===');
    
    // Start at chapter 1
    console.log('Starting at chapter 1...');
    await page.evaluate(() => {
      return (window as any).rendition.display(6); // chapter_001.xhtml
    });
    await page.waitForTimeout(1500);
    
    // Navigate backwards aggressively through ALL previous chapters
    // Continue until we hit the white page issue or reach the beginning
    console.log('Starting extreme backward navigation...');
    
    let step = 0;
    let detectedWhitePage = false;
    
    while (step < 15 && !detectedWhitePage) { // Try up to 15 backward steps
      step++;
      console.log(`Extreme backward navigation step ${step}`);
      
      // Get state before navigation
      const beforeState = await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const location = rendition.currentLocation();
        const container = rendition.manager.container;
        
        return {
          chapter: location?.[0]?.href || 'unknown',
          index: location?.[0]?.index || -1,
          scrollLeft: container.scrollLeft,
          scrollWidth: container.scrollWidth
        };
      });
      
      console.log(`Before navigation step ${step}:`, beforeState);
      
      // Navigate backwards with minimal delay to stress-test the system
      await page.click('#prev');
      await page.waitForTimeout(200); // Very short wait to stress the navigation system
      
      // Check for white page condition immediately after navigation
      const afterState = await page.evaluate(() => {
        const rendition = (window as any).rendition;
        const location = rendition.currentLocation();
        const container = rendition.manager.container;
        
        // Multiple ways to check for content
        const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement;
        let hasIframeContent = false;
        let iframeContentLength = 0;
        
        // Check view manager content
        const currentView = rendition.manager.views.last();
        let hasViewContent = false;
        let viewContentLength = 0;
        
        try {
          // Check iframe content
          if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            const bodyText = iframe.contentDocument.body.textContent || '';
            iframeContentLength = bodyText.trim().length;
            hasIframeContent = iframeContentLength > 0;
          }
          
          // Check view content
          if (currentView && currentView.document && currentView.document.body) {
            const bodyText = currentView.document.body.textContent || '';
            viewContentLength = bodyText.trim().length;
            hasViewContent = viewContentLength > 0;
          }
        } catch (e) {
          console.warn('Error checking content:', e);
        }
        
        const isWhitePage = !hasIframeContent && !hasViewContent;
        
        return {
          chapter: location?.[0]?.href || 'unknown',
          index: location?.[0]?.index || -1,
          scrollLeft: container.scrollLeft,
          scrollWidth: container.scrollWidth,
          hasIframeContent,
          iframeContentLength,
          hasViewContent,
          viewContentLength,
          isWhitePage,
          hasAnyContent: hasIframeContent || hasViewContent
        };
      });
      
      console.log(`After navigation step ${step}:`, afterState);
      
      // Detect white page issue
      if (afterState.isWhitePage) {
        detectedWhitePage = true;
        console.error(`!!! WHITE PAGE DETECTED ON STEP ${step} !!!`);
        console.error(`Chapter: ${afterState.chapter}, Index: ${afterState.index}`);
        console.error(`ScrollLeft: ${afterState.scrollLeft}, ScrollWidth: ${afterState.scrollWidth}`);
        console.error(`Iframe content length: ${afterState.iframeContentLength}`);
        console.error(`View content length: ${afterState.viewContentLength}`);
        
        // Wait longer to see if content eventually loads
        console.log('Waiting 3 seconds to see if content loads...');
        await page.waitForTimeout(3000);
        
        // Check again after delay
        const delayedCheck = await page.evaluate(() => {
          const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement;
          const rendition = (window as any).rendition;
          const currentView = rendition.manager.views.last();
          
          let hasContentNow = false;
          let totalContentLength = 0;
          
          try {
            if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
              const bodyText = iframe.contentDocument.body.textContent || '';
              totalContentLength += bodyText.trim().length;
              hasContentNow = bodyText.trim().length > 0;
            }
            
            if (currentView && currentView.document && currentView.document.body) {
              const bodyText = currentView.document.body.textContent || '';
              totalContentLength += bodyText.trim().length;
              hasContentNow = hasContentNow || bodyText.trim().length > 0;
            }
          } catch (e) {
            console.warn('Error in delayed check:', e);
          }
          
          return { hasContentNow, totalContentLength };
        });
        
        console.error('After 3s delay:', delayedCheck);
        
        // This should reproduce the white page bug
        if (!delayedCheck.hasContentNow) {
          console.error('WHITE PAGE BUG CONFIRMED - No content after 3 second delay');
          // Don't fail the test immediately - let's gather more info
        }
      }
      
      // If we're still in the same chapter and same scroll position, we might be stuck
      if (beforeState.chapter === afterState.chapter && 
          beforeState.scrollLeft === afterState.scrollLeft) {
        console.log(`Navigation seems stuck at ${afterState.chapter} - may have reached beginning`);
        break;
      }
      
      // For the test, we want to catch the white page issue but not fail immediately
      // so we can see the pattern
      if (detectedWhitePage) {
        expect(afterState.hasAnyContent, 
          `WHITE PAGE BUG REPRODUCED: Step ${step}, Chapter: ${afterState.chapter}, Index: ${afterState.index}`
        ).toBe(true);
      }
    }
    
    if (detectedWhitePage) {
      console.log(`=== WHITE PAGE ISSUE SUCCESSFULLY REPRODUCED ON STEP ${step} ===`);
    } else {
      console.log('=== No white page issue detected in extreme backward navigation ===');
    }
  });

  test('should fail when white page bug occurs - regression prevention test', async ({ page }) => {
    // This test EXPECTS to fail until we fix the white page bug
    await page.goto('http://localhost:3000/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => (window as any).book && (window as any).rendition);
    await page.waitForTimeout(3000);
    
    console.log('=== Regression Prevention Test - Should Fail Until Fixed ===');
    
    // Navigate forward first to get to content that can cause the issue
    for (let i = 0; i < 6; i++) {
      await page.click('#next');
      await page.waitForTimeout(200);
    }
    
    let whitePage = false;
    let unknownChapter = false;
    let lowContent = false;
    
    // Now navigate backwards rapidly - this should trigger the white page
    for (let i = 0; i < 20; i++) {
      await page.click('#prev');
      await page.waitForTimeout(50); // Very rapid navigation
      
      const state = await page.evaluate(() => {
        const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement;
        const rendition = (window as any).rendition;
        
        let hasContent = false;
        let contentLength = 0;
        let chapter = 'unknown';
        
        try {
          const location = rendition.currentLocation();
          chapter = location?.[0]?.href || 'unknown';
          
          if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            const bodyText = iframe.contentDocument.body.textContent || '';
            contentLength = bodyText.trim().length;
            hasContent = contentLength > 0;
          }
        } catch (e) {
          console.warn('Error checking state:', e);
        }
        
        return {
          chapter,
          hasContent,
          contentLength,
          isWhitePage: contentLength === 0
        };
      });
      
      console.log(`Regression test step ${i + 1}:`, state);
      
      if (state.isWhitePage) {
        whitePage = true;
        console.log('WHITE PAGE BUG DETECTED - This test should fail until fixed');
        break;
      }
      
      if (state.chapter === 'unknown') {
        unknownChapter = true;
        console.log('UNKNOWN CHAPTER DETECTED - Navigation state corrupted');
      }
      
      if (state.contentLength < 100 && state.contentLength > 0) {
        lowContent = true;
        console.log('LOW CONTENT DETECTED - Possible partial load issue');
      }
    }
    
    // These assertions should FAIL until we fix the bug - that's the point of regression testing
    expect(whitePage, 'White page bug was reproduced - this test should fail until the bug is fixed').toBe(false);
    expect(unknownChapter, 'Unknown chapter detected - navigation state was corrupted').toBe(false);
    
    console.log('=== Regression test completed - should have failed if bug exists ===');
  });

  test('should debug sections before chapter 1 - investigating white page source', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => (window as any).book && (window as any).rendition);
    await page.waitForTimeout(3000);
    
    console.log('=== Debugging sections before chapter 1 ===');
    
    // Get all sections from the book
    const allSections = await page.evaluate(() => {
      const book = (window as any).book;
      const sections = book.spine.spineItems;
      return sections.map((section: any, index: number) => ({
        index,
        href: section.href,
        id: section.id || 'no-id',
        properties: section.properties || 'no-properties'
      }));
    });
    
    console.log('All sections in book:', allSections);
    
    // Find chapter_001.xhtml
    const chapter1Index = allSections.findIndex((section: any) => section.href.includes('chapter_001'));
    console.log('Chapter 1 is at index:', chapter1Index);
    
    if (chapter1Index > 0) {
      console.log('Sections BEFORE chapter 1:');
      for (let i = 0; i < chapter1Index; i++) {
        console.log(`  ${i}: ${allSections[i].href}`);
      }
      
      // Navigate to chapter 1 first
      await page.evaluate((index) => {
        const rendition = (window as any).rendition;
        return rendition.display(index);
      }, chapter1Index);
      
      await page.waitForTimeout(2000);
      
      // Now navigate backwards through the sections before chapter 1
      for (let step = 0; step < chapter1Index + 2; step++) {
        console.log(`\n--- Navigation step ${step + 1} (going backwards) ---`);
        
        const beforeState = await page.evaluate(() => {
          const rendition = (window as any).rendition;
          const location = rendition.currentLocation();
          return {
            chapter: location?.[0]?.href || 'unknown',
            cfi: location?.[0]?.start?.cfi || 'no-cfi'
          };
        });
        console.log('Before navigation:', beforeState);
        
        // Navigate backwards
        await page.click('#prev');
        await page.waitForTimeout(1000); // Give more time for each step
        
        const afterState = await page.evaluate(() => {
          const rendition = (window as any).rendition;
          const location = rendition.currentLocation();
          const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement;
          
          let hasContent = false;
          let contentLength = 0;
          let sampleContent = '';
          
          if (iframe && iframe.contentDocument) {
            const body = iframe.contentDocument.body;
            const bodyText = body.textContent || '';
            contentLength = bodyText.trim().length;
            hasContent = contentLength > 0;
            sampleContent = bodyText.trim().substring(0, 100) + '...';
          }
          
          return {
            chapter: location?.[0]?.href || 'unknown',
            cfi: location?.[0]?.start?.cfi || 'no-cfi',
            hasContent,
            contentLength,
            sampleContent
          };
        });
        
        console.log('After navigation:', afterState);
        
        // Stop if we hit a white page
        if (!afterState.hasContent) {
          console.log('*** WHITE PAGE DETECTED AT STEP', step + 1, '***');
          console.log('This is likely a section before chapter 1:', beforeState.chapter, '->', afterState.chapter);
          break;
        }
        
        // Stop if we've gone back too far
        if (afterState.chapter === 'unknown') {
          console.log('*** UNKNOWN CHAPTER DETECTED AT STEP', step + 1, '***');
          break;
        }
      }
    }
    
    console.log('=== Section debugging completed ===');
  });

  test('should debug width calculations for sections causing white pages', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/transparent-iframe-hightlights.html');
    
    await page.waitForFunction(() => (window as any).book && (window as any).rendition);
    await page.waitForTimeout(3000);
    
    console.log('=== Width Calculation Debug for White Page Sections ===');
    
    // Test the sections that are known to cause issues
    const testSections = [
      { name: 'cover', index: 0 },
      { name: 'titlepage', index: 1 }, 
      { name: 'preface', index: 3 },
      { name: 'introduction', index: 4 },
      { name: 'epigraph', index: 5 },
      { name: 'chapter_001', index: 6 }
    ];

    for (const section of testSections) {
      console.log(`\n=== Testing ${section.name} (index ${section.index}) ===`);
      
      // Navigate to this specific section
      await page.evaluate((index) => {
        const rendition = (window as any).rendition;
        return rendition.display(index);
      }, section.index);
      
      await page.waitForTimeout(2000); // Wait for render
      
      // Get width and content information
      const info = await page.evaluate(() => {
        const viewer = document.querySelector('#viewer') as HTMLElement;
        const iframe = viewer?.querySelector('iframe') as HTMLIFrameElement;
        const phantomElement = viewer?.querySelector('.epub-scroll-phantom') as HTMLElement;
        
        let contentLength = 0;
        let hasContent = false;
        let bodyScrollWidth = 0;
        let textSample = '';
        
        if (iframe && iframe.contentDocument) {
          const body = iframe.contentDocument.body;
          if (body) {
            const bodyText = body.textContent || '';
            contentLength = bodyText.trim().length;
            hasContent = contentLength > 0;
            bodyScrollWidth = body.scrollWidth;
            textSample = bodyText.substring(0, 50) + '...';
          }
        }
        
        return {
          // Container info
          containerScrollWidth: viewer?.scrollWidth || 0,
          containerOffsetWidth: viewer?.offsetWidth || 0,
          containerScrollLeft: viewer?.scrollLeft || 0,
          
          // Iframe info
          iframeWidth: iframe?.offsetWidth || 0,
          iframeStyleWidth: iframe?.style.width || '',
          
          // Phantom info
          phantomExists: !!phantomElement,
          phantomWidth: phantomElement?.offsetWidth || 0,
          phantomStyleWidth: phantomElement?.style.width || '',
          
          // Content info
          contentLength,
          hasContent,
          bodyScrollWidth,
          textSample
        };
      });
      
      console.log(`${section.name}:`, {
        content: `${info.contentLength} chars, hasContent: ${info.hasContent}`,
        container: `scrollWidth: ${info.containerScrollWidth}, offsetWidth: ${info.containerOffsetWidth}, scrollLeft: ${info.containerScrollLeft}`,
        iframe: `width: ${info.iframeWidth}, style: ${info.iframeStyleWidth}`,
        phantom: `exists: ${info.phantomExists}, width: ${info.phantomWidth}, style: ${info.phantomStyleWidth}`,
        body: `scrollWidth: ${info.bodyScrollWidth}`,
        sample: info.textSample
      });
      
      // Check for white page
      if (!info.hasContent) {
        console.log(`❌ ${section.name}: WHITE PAGE DETECTED - NO CONTENT!`);
      }
      
      // Check width consistency 
      if (info.phantomExists && info.phantomWidth !== info.bodyScrollWidth) {
        console.log(`⚠️ ${section.name}: Width mismatch - phantom: ${info.phantomWidth}, body: ${info.bodyScrollWidth}`);
      }
      
      if (info.bodyScrollWidth > info.containerScrollWidth) {
        console.log(`⚠️ ${section.name}: Content wider than container - ${info.bodyScrollWidth} > ${info.containerScrollWidth}`);
      }
    }
    
    console.log('=== Width calculation debug completed ===');
  });
});
