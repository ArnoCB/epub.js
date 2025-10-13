/**
 * Types for DefaultViewManager and related page location info in epub.js
 *
 * Used by default view manager and pagination logic.
 */

import type Layout from '../layout';
import type { Axis } from './common';

export type DefaultViewManagerSettings = {
  layout: Layout;
  infinite?: boolean;
  hidden?: boolean;
  width?: number;
  height?: number;
  axis?: Axis;
  writingMode?: string;
  direction?: Direction;
  gap?: number;
  offset?: number;
  overflow?: string;
  afterScrolledTimeout: number;
  [key: string]: unknown;
};

export interface PageLocation {
  index: number;
  href: string;
  pages: number[];
  totalPages: number;
  mapping:
    | {
        start: string;
        end: string;
      }
    | undefined;
}
