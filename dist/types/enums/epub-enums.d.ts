export declare const Direction: {
    readonly ltr: "ltr";
    readonly rtl: "rtl";
};
export type Direction = (typeof Direction)[keyof typeof Direction];
export declare const DEFAULT_DIRECTION = "ltr";
export declare const Flow: {
    readonly paginated: "paginated";
    readonly scrolled: "scrolled";
    readonly 'scrolled-continuous': "scrolled-continuous";
    readonly 'scrolled-doc': "scrolled-doc";
    readonly auto: "auto";
};
export type Flow = (typeof Flow)[keyof typeof Flow];
export declare const DEFAULT_FLOW = "auto";
export declare const LayoutType: {
    readonly reflowable: "reflowable";
    readonly 'pre-paginated': "pre-paginated";
};
export type LayoutType = (typeof LayoutType)[keyof typeof LayoutType];
export declare const DEFAULT_LAYOUT_TYPE = "reflowable";
export declare const Orientation: {
    readonly auto: "auto";
    readonly landscape: "landscape";
    readonly portrait: "portrait";
};
export type Orientation = (typeof Orientation)[keyof typeof Orientation];
export declare const DEFAULT_ORIENTATION = "auto";
export declare const Spread: {
    readonly auto: "auto";
    readonly none: "none";
    readonly landscape: "landscape";
    readonly portrait: "portrait";
    readonly both: "both";
};
export type Spread = (typeof Spread)[keyof typeof Spread];
export declare const DEFAULT_SPREAD = "auto";
