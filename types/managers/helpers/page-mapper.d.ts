import { Section } from '../../section';
import { CfiResolver } from './cfi-resolver';
export interface PageMapEntry {
  index: number;
  startCfi: string | null;
  endCfi: string | null;
  pageNumber?: number;
  xOffset?: number;
  yOffset?: number;
}
export interface ProbePoint {
  x: number;
  y: number;
}
export interface PaginatedProbeConfig {
  probeXOffsets: number[];
  probeXOffsetsEnd: number[];
  extraYOffsets: number[];
}
export interface ScrolledProbeConfig {
  probeYOffsets: number[];
  probeYOffsetsEnd: number[];
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
export declare class PageMapper {
  private readonly cfiResolver;
  constructor(cfiResolver: CfiResolver);
  /**
   * Detects the flow type and gathers layout information for page mapping
   */
  detectFlow(
    viewSettings: ViewSettings,
    view: ViewLike,
    chapter: ChapterLike
  ): FlowDetectionResult;
  /**
   * Waits for layout to settle before performing element queries
   */
  private waitForLayout;
  /**
   * Creates a page map for paginated content with enhanced CFI resolution
   */
  mapPaginatedPages(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageCount: number,
    config: PaginatedProbeConfig,
    flowResult: FlowDetectionResult
  ): Promise<PageMapEntry[]>;
  /**
   * Creates a single page entry for paginated content
   */
  private createPaginatedPageEntry;
  /**
   * Enhanced CFI resolution for pages with missing or duplicate CFIs
   */
  private enhancePaginatedCfis;
  /**
   * Determines if a page entry needs CFI enhancement
   */
  private needsCfiEnhancement;
  /**
   * Creates a page map for scrolled content
   */
  mapScrolledPages(
    doc: Document,
    body: HTMLElement,
    section: Section,
    pageCount: number,
    config: ScrolledProbeConfig,
    flowResult: FlowDetectionResult
  ): Promise<PageMapEntry[]>;
  /**
   * Probes multiple points to find the first valid CFI
   */
  private probeCfiAtPoints;
  /**
   * Creates default probe configurations
   */
  createPaginatedProbeConfig(viewportWidth: number): PaginatedProbeConfig;
  createScrolledProbeConfig(viewportHeight: number): ScrolledProbeConfig;
  /**
   * Validates a page map for common issues
   */
  validatePageMap(pageMap: PageMapEntry[]): {
    isValid: boolean;
    issues: string[];
    uniqueCfis: number;
  };
}
