/**
 * Types for layout settings and computed layout properties in epub.js
 *
 * These types are used for layout configuration and computed layout results.
 *
 * @see src/layout.ts
 */
import type { LayoutType, Spread, Flow, Direction } from './common';

export type LayoutSettings = {
  layout?: LayoutType;
  spread?: Spread;
  minSpreadWidth?: number;
  evenSpreads?: boolean;
  flow?: Flow;
  direction?: Direction;
};

export type LayoutProps = {
  name: string;
  spread: boolean;
  flow: Flow;
  width: number;
  height: number;
  spreadWidth: number;
  delta: number;
  columnWidth: number;
  gap: number;
  divisor: number;
  pageWidth?: number;
};
