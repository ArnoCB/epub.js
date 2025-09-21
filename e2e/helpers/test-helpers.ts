/**
 * EPUB.js Test Helpers
 *
 * Common helper functions for e2e tests
 */

import { Page } from '@playwright/test';

/**
 * Waits for the rendition to be ready
 */
export async function waitForRenditionReady(page: Page, timeout = 15000) {
  await page.waitForFunction(
    () => {
      const rendition = (window as any).rendition;
      return (
        rendition &&
        rendition.manager &&
        rendition.manager.views &&
        rendition.manager.views.length > 0
      );
    },
    { timeout }
  );
}

/**
 * Gets the current book info from rendition
 */
export async function getBookInfo(page: Page) {
  return page.evaluate(() => {
    const book = (window as any).book;
    const rendition = (window as any).rendition;
    const location = rendition.currentLocation();

    return {
      isOpen: book && book.packaging && book.packaging.metadata,
      title: book?.packaging?.metadata?.title,
      spine: book?.spine?.items?.length || 0,
      currentChapter: location && location.length > 0 ? location[0].href : null,
    };
  });
}

/**
 * Verifies content is visible in viewport
 * Important check to ensure no white/empty pages
 */
export async function verifyViewportContent(page: Page) {
  const center = await page.evaluate(() => {
    const viewer = document.getElementById('viewer');
    if (!viewer) return { ok: false, reason: 'no-viewer' };
    const rect = viewer.getBoundingClientRect();
    const cx = Math.floor(rect.left + rect.width / 2);
    const cy = Math.floor(rect.top + rect.height / 2);

    // Use the full stack at the center and pick the topmost iframe to avoid pseudo overlays
    const stack = (document as any).elementsFromPoint?.(cx, cy) as
      | Element[]
      | undefined;
    let iframe: HTMLIFrameElement | null = null;
    if (Array.isArray(stack)) {
      iframe =
        (stack.find(
          (e) => e instanceof HTMLIFrameElement
        ) as HTMLIFrameElement) || null;
    }

    // Fallback to elementFromPoint walk only if needed
    if (!iframe) {
      const el = document.elementFromPoint(cx, cy) as Element | null;
      let cur: Element | null = el;
      while (cur) {
        if (cur instanceof HTMLIFrameElement) {
          iframe = cur as HTMLIFrameElement;
          break;
        }
        cur = cur.parentElement;
      }
    }
    if (!iframe) return { ok: false, reason: 'no-iframe-under-center' };

    // Check intersection with viewer to ensure it is actually visible
    const ifr = iframe.getBoundingClientRect();
    const intersects = !(
      ifr.right <= rect.left ||
      ifr.left >= rect.right ||
      ifr.bottom <= rect.top ||
      ifr.top >= rect.bottom
    );

    let text = 0,
      html = 0,
      ready = 'unknown';
    try {
      const doc = iframe.contentDocument;
      const body = doc?.body;
      ready = doc?.readyState || 'unknown';
      text = (body?.textContent || '').trim().length;
      html = (body?.innerHTML || '').trim().length;
    } catch {
      // Ignore cross-origin access errors
    }

    return { ok: true, intersects, ready, text, html };
  });

  return center;
}

/**
 * Navigate to a specific chapter
 */
export async function navigateToChapter(page: Page, chapterHref: string) {
  await page.evaluate((href) => {
    const w: any = window as any;
    (w.getRendition ? w.getRendition() : w.rendition).display(href);
  }, chapterHref);
}

/**
 * Wait for relocation event after navigation
 */
export async function waitForRelocation(page: Page, timeout = 2000) {
  await page.waitForFunction(() => !!(window as any).__lastRelocated, {
    timeout,
  });
}
