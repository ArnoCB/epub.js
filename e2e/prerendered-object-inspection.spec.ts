import { test, expect } from '@playwright/test';

test.describe('Pre-rendered Object Inspection', () => {
  test('should inspect pre-rendered chapter objects', async ({ page }) => {
    // Navigate to the prerendering example
    await page.goto('file://' + process.cwd() + '/examples/prerendering-example.html');
    
    // Wait for the book to load
    await page.waitForSelector('#viewer');
    
    // Wait a bit for pre-rendering to complete
    await page.waitForTimeout(5000);
    
    // Inject inspection code
    const inspectionResults = await page.evaluate(async () => {
      const results: {
        preRendererExists: boolean;
        debugInfo: any;
        chapters: Record<string, any>;
        attachmentTest: any;
        errors: string[];
      } = {
        preRendererExists: false,
        debugInfo: null,
        chapters: {},
        attachmentTest: null,
        errors: []
      };
      
      try {
        // Use the new getter functions
        const rendition = (window as any).getRendition();
        const preRenderer = (window as any).getPreRenderer();
        
        if (!rendition) {
          results.errors.push('Rendition not found');
          return results;
        }
        
        if (!preRenderer) {
          results.errors.push('Pre-renderer not found');
          return results;
        }
        
        results.preRendererExists = true;
        
        // Get debug info
        results.debugInfo = preRenderer.getDebugInfo();
        
        // Inspect specific chapters
        const chaptersToInspect = ['cover.xhtml', 'chapter_001.xhtml', 'chapter_002.xhtml', 'chapter_003.xhtml'];
        
        for (const href of chaptersToInspect) {
          const chapter = preRenderer.getChapter(href);
          if (chapter) {
            results.chapters[href] = {
              // Basic properties
              attached: chapter.attached,
              width: chapter.width,
              height: chapter.height,
              pageCount: chapter.pageCount,
              hasWhitePages: chapter.hasWhitePages,
              whitePageIndices: chapter.whitePageIndices,
              
              // Element inspection
              element: {
                exists: !!chapter.element,
                tagName: chapter.element?.tagName,
                offsetWidth: chapter.element?.offsetWidth,
                offsetHeight: chapter.element?.offsetHeight,
                scrollWidth: chapter.element?.scrollWidth,
                scrollHeight: chapter.element?.scrollHeight,
                clientWidth: chapter.element?.clientWidth,
                clientHeight: chapter.element?.clientHeight,
                hasIframe: !!chapter.element?.querySelector('iframe'),
                childElementCount: chapter.element?.childElementCount,
                parentNodeType: chapter.element?.parentNode?.nodeType,
                parentNodeName: chapter.element?.parentNode?.nodeName,
                htmlPreview: chapter.element?.innerHTML?.substring(0, 300) + '...'
              },
              
              // View inspection
              view: chapter.view ? {
                // Mark that a view object exists for assertions
                exists: true,
                displayed: chapter.view.displayed,
                element: {
                  exists: !!chapter.view.element,
                  tagName: chapter.view.element?.tagName,
                  offsetWidth: chapter.view.element?.offsetWidth,
                  offsetHeight: chapter.view.element?.offsetHeight,
                  scrollWidth: chapter.view.element?.scrollWidth,
                  scrollHeight: chapter.view.element?.scrollHeight,
                  childElementCount: chapter.view.element?.childElementCount,
                  parentNodeType: chapter.view.element?.parentNode?.nodeType,
                  parentNodeName: chapter.view.element?.parentNode?.nodeName
                },
                iframe: chapter.view.iframe ? {
                  exists: true,
                  src: chapter.view.iframe.src,
                  offsetWidth: chapter.view.iframe.offsetWidth,
                  offsetHeight: chapter.view.iframe.offsetHeight,
                  contentDocument: !!chapter.view.iframe.contentDocument,
                  readyState: chapter.view.iframe.contentDocument?.readyState
                } : { exists: false },
                contents: chapter.view.contents ? {
                  exists: true,
                  documentReady: chapter.view.contents.document?.readyState,
                  textWidth: typeof chapter.view.contents.textWidth === 'function' ? chapter.view.contents.textWidth() : 'N/A',
                  scrollWidth: typeof chapter.view.contents.scrollWidth === 'function' ? chapter.view.contents.scrollWidth() : 'N/A'
                } : { exists: false }
              } : { exists: false },
              
              // Section info
              section: chapter.section ? {
                href: chapter.section.href,
                index: chapter.section.index,
                cfiBase: chapter.section.cfiBase
              } : { exists: false }
            };
          } else {
            results.chapters[href] = { exists: false };
          }
        }
        
        // Test attachment process
        const testChapter = preRenderer.getChapter('chapter_001.xhtml');
        if (testChapter) {
          results.attachmentTest = {
            beforeAttachment: {
              attached: testChapter.attached,
              elementParent: testChapter.element?.parentNode?.nodeName,
              elementDimensions: {
                width: testChapter.element?.offsetWidth,
                height: testChapter.element?.offsetHeight
              }
            }
          };
          
          // Try to attach
          const attachedChapter = preRenderer.attachChapter('chapter_001.xhtml');
          if (attachedChapter) {
            results.attachmentTest.afterAttachment = {
              attached: attachedChapter.attached,
              elementParent: attachedChapter.element?.parentNode?.nodeName,
              elementDimensions: {
                width: attachedChapter.element?.offsetWidth,
                height: attachedChapter.element?.offsetHeight
              }
            };

            // Mount into the viewer to measure actual layout dimensions
            try {
              const viewer = document.getElementById('viewer') || document.body;
              if (attachedChapter.element && attachedChapter.element.parentNode !== viewer) {
                viewer.appendChild(attachedChapter.element);
              }
              // Force reflow before reading dimensions
              const mountedWidth = attachedChapter.element?.offsetWidth;
              const mountedHeight = attachedChapter.element?.offsetHeight;
              results.attachmentTest.afterMount = {
                elementParent: attachedChapter.element?.parentNode?.nodeName,
                elementDimensions: {
                  width: mountedWidth,
                  height: mountedHeight
                }
              };
            } catch (e) {
              results.attachmentTest.afterMount = { error: (e as Error).message } as any;
            }
          } else {
            results.attachmentTest.afterAttachment = { failed: true };
          }
        } else {
          results.attachmentTest = { error: 'Test chapter not found' };
        }
        
        return results;
        
      } catch (error) {
        results.errors.push(`Error during inspection: ${error.message}`);
        return results;
      }
    });
    
    // Log the results
    console.log('=== PRE-RENDERED OBJECT INSPECTION RESULTS ===');
    console.log('Pre-renderer exists:', inspectionResults.preRendererExists);
    console.log('Errors:', inspectionResults.errors);
    
    if (inspectionResults.debugInfo) {
      console.log('Debug Info:', JSON.stringify(inspectionResults.debugInfo, null, 2));
    }
    
    console.log('\n=== CHAPTER INSPECTION ===');
    for (const [href, chapterInfo] of Object.entries(inspectionResults.chapters)) {
      console.log(`\n--- ${href} ---`);
      console.log(JSON.stringify(chapterInfo, null, 2));
    }
    
    console.log('\n=== ATTACHMENT TEST ===');
    console.log(JSON.stringify(inspectionResults.attachmentTest, null, 2));
    
    // Assertions to verify the pre-rendered objects are as expected
    expect(inspectionResults.preRendererExists, 'Pre-renderer should exist').toBe(true);
    expect(inspectionResults.errors.length, 'Should have no errors').toBe(0);
    
    // Check that chapters were pre-rendered
    expect(inspectionResults.debugInfo?.totalChapters).toBeGreaterThan(0);
    
    // Check specific chapters
    const chapter1 = inspectionResults.chapters['chapter_001.xhtml'];
    if (chapter1?.exists !== false) {
      expect(chapter1.pageCount, 'Chapter 1 should have a page count').toBeGreaterThan(0);
      expect(chapter1.width, 'Chapter 1 should have width').toBeGreaterThan(0);
      expect(chapter1.height, 'Chapter 1 should have height').toBeGreaterThan(0);
      expect(chapter1.element.exists, 'Chapter 1 should have an element').toBe(true);
      expect(chapter1.view.exists, 'Chapter 1 should have a view').toBe(true);
    }
    
    const chapter3 = inspectionResults.chapters['chapter_003.xhtml'];
    if (chapter3?.exists !== false) {
      console.log('\n=== CHAPTER 3 DETAILED ANALYSIS ===');
      console.log('Page count:', chapter3.pageCount);
      console.log('Width:', chapter3.width);
      console.log('Height:', chapter3.height);
      console.log('Element dimensions:', chapter3.element);
      console.log('View iframe:', chapter3.view.iframe);
      console.log('View contents:', chapter3.view.contents);
      
      expect(chapter3.pageCount, 'Chapter 3 should have 12 pages').toBe(12);
      expect(chapter3.width, 'Chapter 3 should have width 10800').toBe(10800);
    }
  });

  test('should navigate next from chapter 1 and report location', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/examples/prerendering-example.html');
    await page.waitForSelector('#viewer');
    // Allow some time for pre-rendering to start
    await page.waitForTimeout(3000);

    const result = await page.evaluate(async () => {
      const rendition = (window as any).getRendition?.() || (window as any).rendition;
      if (!rendition) {
        return { error: 'No rendition' };
      }

      const waitRelocated = () =>
        new Promise<any>((resolve) => {
          const handler = (loc: any) => {
            try {
              if (typeof rendition.off === 'function') rendition.off('relocated', handler);
            } catch {}
            resolve(loc);
          };
          rendition.on('relocated', handler);
        });

      // Jump to chapter 1
      const firstRelocated = waitRelocated();
      rendition.display('chapter_001.xhtml');
      const loc1 = await firstRelocated;

      // Go next once
      const secondRelocated = waitRelocated();
      rendition.next();
      const loc2 = await secondRelocated;

      return { loc1, loc2 };
    });

    console.log('=== NAVIGATION FROM CHAPTER 1 ===');
    console.log(JSON.stringify(result, null, 2));

    // Basic assertions that should be stable across environments
    expect(result.loc1?.start?.href).toContain('chapter_001.xhtml');
    // We expect next() to remain in chapter 1 (it has multiple pages) and advance the page number
    expect(result.loc2?.start?.href).toContain('chapter_001.xhtml');
    expect(result.loc2?.start?.displayed?.page).toBeGreaterThanOrEqual(2);
  });

  test('should cross boundary into chapter 1 from epigraph and land at page 1', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/examples/prerendering-example.html');
    await page.waitForSelector('#viewer');
    await page.waitForTimeout(3000);

    const result = await page.evaluate(async () => {
      const rendition = (window as any).getRendition?.() || (window as any).rendition;
      if (!rendition) return { error: 'No rendition' };

      const waitRelocated = () =>
        new Promise<any>((resolve) => {
          const handler = (loc: any) => {
            try { if (typeof rendition.off === 'function') rendition.off('relocated', handler); } catch {}
            resolve(loc);
          };
          rendition.on('relocated', handler);
        });

      // Start at the previous chapter to chapter_001.xhtml
      const firstRelocated = waitRelocated();
      rendition.display('epigraph_001.xhtml');
      const locStart = await firstRelocated;

      const hops: any[] = [];
      let crossed: any | null = null;
      for (let i = 0; i < 12; i++) {
        const nextRelocated = waitRelocated();
        rendition.next();
        const loc = await nextRelocated;
        hops.push(loc);
        if (loc?.start?.href?.includes('chapter_001.xhtml')) {
          crossed = loc;
          break;
        }
      }

      return { locStart, hopsCount: hops.length, crossed, hops };
    });

    console.log('=== CROSS-BOUNDARY INTO CHAPTER 1 ===');
    console.log(JSON.stringify(result, null, 2));

    expect(result.crossed, 'Should reach chapter_001.xhtml after next() hops').toBeTruthy();
    expect(result.crossed.start.href).toContain('chapter_001.xhtml');
    // On first arrival to the chapter, expect page 1 in LTR paginated flow
    expect(result.crossed.start.displayed.page).toBe(1);
  });
});
