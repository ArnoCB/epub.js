/**
 * Central type and enumroot for epub.js
 *
 * All shared types (layout, direction, orientation, etc.) from the epub specification
 * should be defined or re-exported here.
 *
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export type Axis = 'horizontal' | 'vertical';
/**
 * Reading direction for EPUB content.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#sec-docs-dir
 */
export declare const Direction: {
    readonly ltr: "ltr";
    readonly rtl: "rtl";
};
export type Direction = (typeof Direction)[keyof typeof Direction];
export declare const DEFAULT_DIRECTION = "ltr";
/**
 * Flow type for EPUB content rendering.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export declare const Flow: {
    readonly paginated: "paginated";
    readonly scrolled: "scrolled";
    readonly 'scrolled-continuous': "scrolled-continuous";
    readonly 'scrolled-doc': "scrolled-doc";
    readonly auto: "auto";
};
export type Flow = (typeof Flow)[keyof typeof Flow];
export declare const DEFAULT_FLOW = "auto";
/**
 * Layout type for EPUB rendition.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#rendition-layout
 * Allowed: 'reflowable' | 'pre-paginated'. Default: 'reflowable'.
 */
export declare const LayoutType: {
    readonly reflowable: "reflowable";
    readonly 'pre-paginated': "pre-paginated";
};
export type LayoutType = (typeof LayoutType)[keyof typeof LayoutType];
export declare const DEFAULT_LAYOUT_TYPE = "reflowable";
/**
 * Orientation for fixed-layout or viewport settings.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-elem-viewport
 */
export declare const Orientation: {
    readonly auto: "auto";
    readonly landscape: "landscape";
    readonly portrait: "portrait";
};
export type Orientation = (typeof Orientation)[keyof typeof Orientation];
export declare const DEFAULT_ORIENTATION = "auto";
/**
 * Spread type for EPUB content rendering.
 * @see http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
 */
export declare const Spread: {
    readonly auto: "auto";
    readonly none: "none";
    readonly landscape: "landscape";
    readonly portrait: "portrait";
    readonly both: "both";
};
export type Spread = (typeof Spread)[keyof typeof Spread];
export declare const DEFAULT_SPREAD = "auto";
