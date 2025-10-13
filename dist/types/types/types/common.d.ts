/**
 * Central type root for epub.js
 *
 * All shared types (layout, direction, orientation, etc.) from the epub specification
 * should be defined or re-exported here.
 *
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */

/**
 * Axis for content flow or scrolling direction (not a direct EPUB metadata property).
 * Used in epub.js for layout logic.
 *
 * Related: CSS Writing Modes, EPUB 3.0.1 spec (see flow/scroll direction):
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#sec-itemref-property-values
 */
export type Axis = 'horizontal' | 'vertical';

/**
 * Layout type for EPUB rendition.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#rendition-layout
 * Allowed: 'reflowable' | 'pre-paginated'. Default: 'reflowable'.
 */
export type LayoutType = 'reflowable' | 'pre-paginated';

/**
 * Reading direction for EPUB content.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#sec-docs-dir
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Orientation for fixed-layout or viewport settings.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-elem-viewport
 */
export type Orientation = 'auto' | 'landscape' | 'portrait';

/**
 * Flow type for EPUB content rendering.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export type Flow =
  | 'paginated'
  | 'scrolled'
  | 'scrolled-continuous'
  | 'scrolled-doc'
  | 'auto';

/**
 * Spread type for EPUB content rendering.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export type Spread = 'none' | 'always' | 'auto';
