export const Direction = {
  ltr: 'ltr',
  rtl: 'rtl',
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];
export const DEFAULT_DIRECTION = 'ltr';

export const Flow = {
  paginated: 'paginated',
  scrolled: 'scrolled',
  'scrolled-continuous': 'scrolled-continuous',
  'scrolled-doc': 'scrolled-doc',
  auto: 'auto',
} as const;
export type Flow = (typeof Flow)[keyof typeof Flow];
export const DEFAULT_FLOW = 'auto';

export const LayoutType = {
  reflowable: 'reflowable',
  'pre-paginated': 'pre-paginated',
} as const;
export type LayoutType = (typeof LayoutType)[keyof typeof LayoutType];
export const DEFAULT_LAYOUT_TYPE = 'reflowable';

export const Orientation = {
  auto: 'auto',
  landscape: 'landscape',
  portrait: 'portrait',
} as const;
export type Orientation = (typeof Orientation)[keyof typeof Orientation];
export const DEFAULT_ORIENTATION = 'auto';

export const Spread = {
  auto: 'auto',
  none: 'none',
  landscape: 'landscape',
  portrait: 'portrait',
  both: 'both',
} as const;
export type Spread = (typeof Spread)[keyof typeof Spread];
export const DEFAULT_SPREAD = 'auto';
