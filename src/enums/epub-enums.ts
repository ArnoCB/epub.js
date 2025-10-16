/**
 * Central type and enumroot for epub.js
 *
 * All shared types (layout, direction, orientation, etc.) from the epub specification
 * should be defined or re-exported here.
 *
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */

/*
 * Axis for content flow or scrolling direction (not a direct EPUB metadata property).
 * Used in epub.js for layout logic.
 *
 * Related: CSS Writing Modes, EPUB 3.0.1 spec (see flow/scroll direction):
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#sec-itemref-property-values
 */
export type Axis = 'horizontal' | 'vertical';

/**
 * Reading direction for EPUB content.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#sec-docs-dir
 */
export const Direction = {
  ltr: 'ltr',
  rtl: 'rtl',
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];
export const DEFAULT_DIRECTION = 'ltr';

/**
 * Flow type for EPUB content rendering.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export const Flow = {
  paginated: 'paginated',
  scrolled: 'scrolled',
  'scrolled-continuous': 'scrolled-continuous',
  'scrolled-doc': 'scrolled-doc',
  auto: 'auto',
} as const;
export type Flow = (typeof Flow)[keyof typeof Flow];
export const DEFAULT_FLOW = 'auto';

/**
 * Layout type for EPUB rendition.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#rendition-layout
 * Allowed: 'reflowable' | 'pre-paginated'. Default: 'reflowable'.
 */
export const LayoutType = {
  reflowable: 'reflowable',
  'pre-paginated': 'pre-paginated',
} as const;

export type LayoutType = (typeof LayoutType)[keyof typeof LayoutType];
export const DEFAULT_LAYOUT_TYPE = 'reflowable';

/**
 * Orientation for fixed-layout or viewport settings.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-elem-viewport
 */
export const Orientation = {
  auto: 'auto',
  landscape: 'landscape',
  portrait: 'portrait',
} as const;
export type Orientation = (typeof Orientation)[keyof typeof Orientation];
export const DEFAULT_ORIENTATION = 'auto';

/**
 * Spread type for EPUB content rendering.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export const Spread = {
  auto: 'auto',
  none: 'none',
  landscape: 'landscape',
  portrait: 'portrait',
  both: 'both',
} as const;
export type Spread = (typeof Spread)[keyof typeof Spread];
export const DEFAULT_SPREAD = 'auto';
