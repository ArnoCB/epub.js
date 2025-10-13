/**
 * Types for Section items and search matches in epub.js
 *
 * Used by section.ts and related logic.
 *
 * @see src/section.ts
 */
import type { Section } from '../section';
import type { LayoutType, Spread, Orientation } from './common';

// Layout settings for a section, including required and dynamic keys
export type SectionLayoutSettings = {
  layout: LayoutType;
  spread: Spread;
  orientation: Orientation;
  [key: string]: string;
};

// Define the actual item structure that gets passed to Section constructor
export interface SectionItem {
  idref: string;
  index: number;
  cfiBase: string;
  href: string;
  url?: string;
  canonical?: string;
  properties?: Array<string>;
  linear?: string;
  next: () => Section | undefined;
  prev: () => Section | undefined;
}

// Define the Match interface for search results
export interface Match {
  cfi: string;
  excerpt: string;
}
