/**
 * Simple, lightweight page map generator for prerenderer
 */

import { Section } from '../../section';
import { View } from './views';
import { CfiResolver } from './cfi-resolver';
import { PageMapEntry } from './page-mapper';

export interface PageMapResult {
  pageCount: number;
  pageMap: PageMapEntry[];
  hasWhitePages: boolean;
  whitePageIndices: number[];
}

export class PageMapGenerator {
  private cfiResolver: CfiResolver;

  constructor(cfiResolver?: CfiResolver) {
    this.cfiResolver = cfiResolver || new CfiResolver();
  }

  /**
   * Helper to detect and warn about redundant range CFIs
   */
  private validateCfi(cfi: string | null, context: string): void {
    if (!cfi) return;

    // Check for redundant range CFI pattern
    const match = cfi.match(/^epubcfi\(([^!]+)!([^,]+),([^,]+),([^,)]+)\)$/);
    if (match) {
      const [, , part1, part2, part3] = match;
      if (part1 === part2 && part2 === part3) {
        console.warn(
          `[PageMapGenerator] Redundant range CFI detected in ${context}:`,
          cfi,
          'Consider generating point CFI instead.'
        );
      }
    }
  }

  /**
   * Generate a simple page map directly from a rendered view
   */
  async generatePageMap(
    view: View,
    section: Section,
    viewportWidth: number,
    viewportHeight: number
  ): Promise<PageMapResult> {
    if (!view.contents?.document?.body) {
      return this.createMinimalPageMap(section);
    }

    const doc = view.contents.document;
    const body = doc.body;

    // Simple page count calculation
    const pageCount = this.calculatePageCount(
      body,
      viewportWidth,
      viewportHeight
    );

    // Generate basic page map
    const pageMap = await this.createBasicPageMap(
      doc,
      section,
      pageCount,
      viewportWidth
    );

    return {
      pageCount,
      pageMap,
      hasWhitePages: false,
      whitePageIndices: [],
    };
  }

  /**
   * Create minimal page map for empty content
   */
  private createMinimalPageMap(section: Section): PageMapResult {
    return {
      pageCount: 1,
      pageMap: [
        {
          index: 1,
          startCfi: section.cfiBase || null,
          endCfi: null,
          xOffset: 0,
        },
      ],
      hasWhitePages: false,
      whitePageIndices: [],
    };
  }

  /**
   * Simple page count calculation
   */
  private calculatePageCount(
    body: HTMLElement,
    viewportWidth: number,
    viewportHeight: number
  ): number {
    const scrollWidth = body.scrollWidth || 0;
    const scrollHeight = body.scrollHeight || 0;

    // If content is wider than viewport, it's paginated
    if (scrollWidth > viewportWidth * 1.1) {
      return Math.max(1, Math.ceil(scrollWidth / viewportWidth));
    }

    // Otherwise it's scrolled
    return Math.max(1, Math.ceil(scrollHeight / viewportHeight));
  }

  /**
   * Create basic page map with CFIs
   */
  private async createBasicPageMap(
    doc: Document,
    section: Section,
    pageCount: number,
    viewportWidth: number
  ): Promise<PageMapEntry[]> {
    const pageMap: PageMapEntry[] = [];

    for (let i = 0; i < pageCount; i++) {
      const xOffset = i * viewportWidth;

      // Generate start CFI using robust element selection
      let startCfi: string | null = null;
      let endCfi: string | null = null;

      try {
        const startElement = this.findFirstVisibleElement(
          doc,
          xOffset,
          viewportWidth
        );

        if (startElement) {
          const cfiResult = await this.cfiResolver.resolveForElement(
            doc,
            section,
            startElement
          );

          startCfi = cfiResult.cfi || null;

          // Validate CFI format and warn about redundant ranges
          this.validateCfi(startCfi, `page ${i + 1} of ${section.href}`);
        }

        // Generate end CFI for page boundary
        if (i < pageCount - 1) {
          // For non-last pages, find the last element in the current page region
          const endElement = this.findLastVisibleElement(
            doc,
            xOffset,
            viewportWidth
          );
          if (endElement) {
            const endCfiResult = await this.cfiResolver.resolveForElement(
              doc,
              section,
              endElement
            );
            endCfi = endCfiResult.cfi || null;
          }
        } else {
          // For the last page, find the last element in the entire chapter
          const lastElement = this.findLastElementInChapter(doc);
          if (lastElement) {
            const endCfiResult = await this.cfiResolver.resolveForElement(
              doc,
              section,
              lastElement
            );
            endCfi = endCfiResult.cfi || null;
          }
        }
      } catch (error) {
        console.debug('CFI generation failed:', error);
      }

      // Fallback to section base CFI for first page
      if (!startCfi && i === 0) {
        const baseCfi = section.cfiBase;
        if (baseCfi) {
          // Ensure the CFI has the proper epubcfi( prefix
          startCfi = baseCfi.startsWith('epubcfi(')
            ? baseCfi
            : `epubcfi(${baseCfi})`;
        }
      }

      pageMap.push({
        index: i + 1,
        startCfi,
        endCfi,
        xOffset,
        yOffset: 0,
      });
    }

    return pageMap;
  }

  /**
   * Find first visible element using robust DOM traversal
   * Avoids hardcoded tag names which may be localized or custom
   */
  private findFirstVisibleElement(
    doc: Document,
    xOffset: number,
    viewportWidth: number
  ): Element | null {
    try {
      const body = doc.body;
      if (!body) return null;

      // Use TreeWalker to find all elements with text content
      const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node: Node): number => {
          const element = node as HTMLElement;

          // Skip invisible elements
          if (element.offsetWidth === 0 && element.offsetHeight === 0) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip script, style, meta elements
          const nodeName = element.nodeName.toLowerCase();
          if (
            ['script', 'style', 'meta', 'link', 'noscript'].includes(nodeName)
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Accept elements with text content
          const hasText = (element.textContent?.trim().length || 0) > 0;
          return hasText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
      });

      // Find element in the specified horizontal region
      let currentElement = walker.nextNode() as Element | null;
      while (currentElement) {
        const rect = currentElement.getBoundingClientRect();

        // Check if element is within the page region
        if (rect.left >= xOffset && rect.left < xOffset + viewportWidth) {
          return currentElement;
        }

        currentElement = walker.nextNode() as Element | null;
      }

      // Fallback: return first element with text
      walker.currentNode = body;
      return walker.nextNode() as Element | null;
    } catch (error) {
      console.debug('Error finding visible element:', error);
      return null;
    }
  }

  /**
   * Find last visible element in a page region for end CFI generation
   */
  private findLastVisibleElement(
    doc: Document,
    xOffset: number,
    viewportWidth: number
  ): Element | null {
    try {
      const body = doc.body;
      if (!body) return null;

      // Use TreeWalker to find all elements with text content
      const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node: Node): number => {
          const element = node as HTMLElement;

          // Skip invisible elements
          if (element.offsetWidth === 0 && element.offsetHeight === 0) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip script, style, meta elements
          const nodeName = element.nodeName.toLowerCase();
          if (
            ['script', 'style', 'meta', 'link', 'noscript'].includes(nodeName)
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Accept elements with text content
          const hasText = (element.textContent?.trim().length || 0) > 0;
          return hasText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
      });

      // Find all elements in the specified horizontal region and return the last one
      let lastElement: Element | null = null;
      let currentElement = walker.nextNode() as Element | null;

      while (currentElement) {
        const rect = currentElement.getBoundingClientRect();

        // Check if element is within the page region
        if (rect.left >= xOffset && rect.left < xOffset + viewportWidth) {
          lastElement = currentElement;
        }

        currentElement = walker.nextNode() as Element | null;
      }

      return lastElement;
    } catch (error) {
      console.debug('Error finding last visible element:', error);
      return null;
    }
  }

  /**
   * Find the last element with text content in the entire chapter
   */
  private findLastElementInChapter(doc: Document): Element | null {
    try {
      const body = doc.body;
      if (!body) return null;

      // Use TreeWalker to find all elements with text content
      const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node: Node): number => {
          const element = node as HTMLElement;

          // Skip invisible elements
          if (element.offsetWidth === 0 && element.offsetHeight === 0) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip script, style, meta elements
          const nodeName = element.nodeName.toLowerCase();
          if (
            ['script', 'style', 'meta', 'link', 'noscript'].includes(nodeName)
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Accept elements with text content
          const hasText = (element.textContent?.trim().length || 0) > 0;
          return hasText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
      });

      // Find the last element with text content in the entire chapter
      let lastElement: Element | null = null;
      let currentElement = walker.nextNode() as Element | null;

      while (currentElement) {
        lastElement = currentElement;
        currentElement = walker.nextNode() as Element | null;
      }

      return lastElement;
    } catch (error) {
      console.debug('Error finding last element in chapter:', error);
      return null;
    }
  }
}
