/**
 * Types for PreRenderer view settings and prerendering status in epub.js
 *
 * Used by prerenderer and related logic.
 */

import type { PreRenderedChapter } from './pre-rendered-chapter';

export interface PreRenderingStatus {
  total: number;
  rendered: number;
  failed: number;
  chapters: Map<string, PreRenderedChapter>;
}
