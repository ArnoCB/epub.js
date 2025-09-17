import { Section } from '../../section';
import { CfiResolver } from './cfi-resolver';

export interface PageMapEntry {
  index: number; // 1-based page index within the chapter
  startCfi: string | null; // CFI at the start of this page for precise positioning
  endCfi: string | null; // CFI at the end of this page for range calculations
  // Global page number across the book (optional; assigned when surrounding
  // chapters are prerendered so a cumulative index can be provided).
  pageNumber?: number;
  xOffset?: number; // horizontal offset for paginated flow
  yOffset?: number; // vertical offset for scrolled flow
}

export interface ProbePoint {
  x: number;
  y: number;
}

export interface PaginatedProbeConfig {
  probeXOffsets: number[]; // X offsets to probe for start CFI
  probeXOffsetsEnd: number[]; // X offsets to probe for end CFI
  extraYOffsets: number[]; // Additional Y offsets for enhanced probing
}

export interface ScrolledProbeConfig {
  probeYOffsets: number[]; // Y offsets to probe for start CFI
  probeYOffsetsEnd: number[]; // Y offsets to probe for end CFI
}

export interface FlowDetectionResult {
  isPaginated: boolean;
  contentWidth: number;
  contentHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface ViewSettings {
  flow?: string;
  axis?: string;
  layout?: {
    _flow?: string;
    columnWidth?: number;
    height?: number;
  };
  width: number;
  height: number;
}

export interface ViewContents {
  scrollWidth?: () => number;
  scrollHeight?: () => number;
}

export interface ViewLike {
  contents?: ViewContents;
}

export interface ChapterLike {
  width: number;
  height: number;
}

/**
 * Enhanced page mapping service that handles both paginated and scrolled content flows.
 * Provides intelligent CFI resolution with fallback strategies and detailed error handling.
 */
export class PageMapper {
  constructor(private readonly cfiResolver: CfiResolver) {}

  /**
   * Detects the flow type and gathers layout information for page mapping
   */
  detectFlow(
    viewSettings: ViewSettings,
    view: ViewLike,
    chapter: ChapterLike
  ): FlowDetectionResult {
    const isPaginated = Boolean(
      viewSettings.flow === 'paginated' ||
        viewSettings.axis === 'horizontal' ||
        (viewSettings.layout && viewSettings.layout._flow === 'paginated')
    );

    let contentWidth = chapter.width;
    let contentHeight = chapter.height;

    // Get precise content dimensions if available
    if (view.contents) {
      if (typeof view.contents.scrollWidth === 'function') {
        try {
          contentWidth = view.contents.scrollWidth();
        } catch {
          // Removed debug log for fallback
        }
      }

      if (typeof view.contents.scrollHeight === 'function') {
        try {
          contentHeight = view.contents.scrollHeight();
        } catch {
          // Removed debug log for fallback
        }
      }
    }

    const viewportWidth =
      viewSettings.layout?.columnWidth || viewSettings.width;
    const viewportHeight = viewSettings.layout?.height ?? viewSettings.height;

    return {
      isPaginated,
      contentWidth,
      contentHeight,
      viewportWidth,
      viewportHeight,
    };
  }

  /**
   * Waits for layout to settle before performing element queries
   */
  private async waitForLayout(doc: Document, ticks = 2): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        const win = doc.defaultView;
        if (!win) return resolve();

        let count = 0;
        const step = () => {
          count += 1;
          if (count >= ticks) return resolve();
          win.requestAnimationFrame(step);
        };
        win.requestAnimationFrame(step);
      } catch {
        resolve();
      }
    });
  }

  /**
   * Creates a page map for paginated content with enhanced CFI resolution
   */
  async mapPaginatedPages(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageCount: number,
    config: PaginatedProbeConfig,
    flowResult: FlowDetectionResult
  ): Promise<PageMapEntry[]> {
    // Wait for layout to settle
    await this.waitForLayout(doc, 2);

    const pageMap: PageMapEntry[] = [];
    const { viewportWidth } = flowResult;

    // Initial mapping pass
    for (let i = 0; i < pageCount; i++) {
      const xOffset = i * viewportWidth;
      const entry = await this.createPaginatedPageEntry(
        doc,
        body,
        section,
        i + 1,
        xOffset,
        config
      );
      pageMap.push(entry);
    }

    // Enhancement pass: improve CFI resolution for problematic pages
    await this.enhancePaginatedCfis(doc, body, section, pageMap, config);

    return pageMap;
  }

  /**
   * Creates a single page entry for paginated content
   */
  private async createPaginatedPageEntry(
    doc: Document,
    body: HTMLElement,
    section: Section,
    index: number,
    xOffset: number,
    config: PaginatedProbeConfig
  ): Promise<PageMapEntry> {
    const centerY = Math.max(1, Math.floor(body.scrollHeight / 2));

    const startCfi = await this.probeCfiAtPoints(
      config.probeXOffsets.map((x) => ({ x: xOffset + x, y: centerY })),
      doc,
      section
    );

    let endCfi = await this.probeCfiAtPoints(
      config.probeXOffsetsEnd.map((x) => ({ x: xOffset + x, y: centerY })),
      doc,
      section
    );

    // Ensure distinct CFIs
    if (startCfi === endCfi) {
      endCfi = null; // Mark as null to indicate no valid endCfi
    }

    // Fallback for missing endCfi
    if (!endCfi) {
      endCfi = await this.probeCfiAtPoints(
        config.probeXOffsets.map((x) => ({ x: xOffset + x, y: centerY + 10 })),
        doc,
        section
      );
    }

    return {
      index,
      startCfi,
      endCfi,
      xOffset,
    };
  }

  /**
   * Enhanced CFI resolution for pages with missing or duplicate CFIs
   */
  private async enhancePaginatedCfis(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageMap: PageMapEntry[],
    config: PaginatedProbeConfig
  ): Promise<void> {
    for (let i = 0; i < pageMap.length; i++) {
      const entry = pageMap[i];
      const prev = i > 0 ? pageMap[i - 1] : undefined;

      if (this.needsCfiEnhancement(entry, prev)) {
        const enhancedCfi = await this.probeCfiAtPoints(
          config.probeXOffsets.map((x) => ({
            x: (entry.xOffset || 0) + x,
            y: body.scrollHeight / 2,
          })),
          doc,
          section
        );

        if (enhancedCfi) {
          entry.startCfi = enhancedCfi;
        }
      }
    }
  }

  /**
   * Determines if a page entry needs CFI enhancement
   */
  private needsCfiEnhancement(
    entry: PageMapEntry,
    prev?: PageMapEntry
  ): boolean {
    return (
      !entry.startCfi ||
      Boolean(prev?.startCfi && prev.startCfi === entry.startCfi)
    );
  }

  /**
   * Creates a page map for scrolled content
   */
  async mapScrolledPages(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageCount: number,
    config: ScrolledProbeConfig,
    flowResult: FlowDetectionResult
  ): Promise<PageMapEntry[]> {
    const pageMap: PageMapEntry[] = [];
    const { viewportHeight } = flowResult;
    const centerX = Math.max(1, Math.floor(flowResult.contentWidth / 2));

    for (let i = 0; i < pageCount; i++) {
      const yOffset = i * viewportHeight;

      const startCfi = await this.probeCfiAtPoints(
        config.probeYOffsets.map((y) => ({ x: centerX, y: yOffset + y })),
        doc,
        section
      );

      const endCfi = await this.probeCfiAtPoints(
        config.probeYOffsetsEnd.map((y) => ({ x: centerX, y: yOffset + y })),
        doc,
        section
      );

      pageMap.push({
        index: i + 1,
        startCfi,
        endCfi,
        yOffset,
      });
    }

    return pageMap;
  }

  /**
   * Probes multiple points to find the first valid CFI
   */
  private async probeCfiAtPoints(
    points: ProbePoint[],
    doc: Document,
    section: Section
  ): Promise<string | null> {
    for (const point of points) {
      try {
        const element = document.elementFromPoint(
          Math.max(0, Math.min(point.x, doc.body.scrollWidth - 1)),
          Math.max(0, Math.min(point.y, doc.body.scrollHeight - 1))
        );

        if (element && element instanceof Element) {
          const result = await this.cfiResolver.resolveForElement(
            doc,
            section,
            element
          );

          return result.cfi || null;
        }
      } catch {
        // Removed debug log for cleaner output
      }
    }

    return null;
  }

  /**
   * Creates default probe configurations
   */
  createPaginatedProbeConfig(viewportWidth: number): PaginatedProbeConfig {
    return {
      probeXOffsets: [
        1,
        Math.floor(viewportWidth * 0.15),
        Math.floor(viewportWidth * 0.4),
      ],
      probeXOffsetsEnd: [
        Math.max(0, viewportWidth - 10), // Ensure distinct end point
        Math.max(0, Math.floor(viewportWidth * 0.85)),
        Math.max(0, Math.floor(viewportWidth * 0.6)),
      ],
      extraYOffsets: [-20, -8, 8, 20, -40, 40],
    };
  }

  createScrolledProbeConfig(viewportHeight: number): ScrolledProbeConfig {
    return {
      probeYOffsets: [
        Math.floor(viewportHeight * 0.15),
        Math.floor(viewportHeight * 0.4),
        Math.floor(viewportHeight * 0.6),
      ],
      probeYOffsetsEnd: [
        Math.floor(viewportHeight * 0.85),
        Math.floor(viewportHeight * 0.5),
      ],
    };
  }

  /**
   * Validates a page map for common issues
   */
  validatePageMap(pageMap: PageMapEntry[]): {
    isValid: boolean;
    issues: string[];
    uniqueCfis: number;
  } {
    const issues: string[] = [];
    let uniqueCfis = 0;

    if (pageMap.length === 0) {
      issues.push('Page map is empty');
      return { isValid: false, issues, uniqueCfis };
    }

    const cfis = new Set<string>();
    for (const entry of pageMap) {
      // Check for invalid indices
      if (entry.index <= 0) {
        issues.push(`Invalid index ${entry.index} for page`);
      }

      // Check for CFI data
      if (entry.startCfi) {
        cfis.add(entry.startCfi);
      } else if (!entry.xOffset && !entry.yOffset) {
        issues.push(`Page ${entry.index} has no CFI or position data`);
      }

      if (!entry.endCfi) {
        issues.push(`Missing endCfi for page ${entry.index}`);
      }
    }

    uniqueCfis = cfis.size;

    // Check for duplicate CFIs
    if (uniqueCfis < pageMap.length && uniqueCfis > 0) {
      issues.push(
        `Only ${uniqueCfis} unique CFIs found for ${pageMap.length} pages`
      );
    }

    const isValid = issues.length === 0;

    return { isValid, issues, uniqueCfis };
  }
}
