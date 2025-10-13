// Type definitions for location objects
export type DisplayedInfo = {
  page: number;
  total: number;
};

export type LocationPoint = {
  index: number;
  href: string;
  cfi: string;
  displayed: DisplayedInfo;
  location?: number;
  percentage?: number;
  page?: number;
  totalPages?: number;
  mapping?: { start: string; end: string };
  pages?: number[];
};

export type DisplayedLocation = {
  start: LocationPoint;
  end: LocationPoint;
  atStart?: boolean;
  atEnd?: boolean;
};

export type RenditionHooks = {
  display: Hook;
  serialize: Hook;
  content: Hook;
  unloaded: Hook;
  layout: Hook;
  render: Hook;
  show: Hook;
};

export interface RenditionOptions {
  width?: number | string;
  height?: number | string;
  ignoreClass?: string;
  manager?: ViewManager;
  view?: View;
  flow?: Flow;
  layout?: string;
  spread?: Spread;
  minSpreadWidth?: number;
  stylesheet?: string;
  resizeOnOrientationChange?: boolean;
  script?: string;
  infinite?: boolean;
  overflow?: string;
  snap?: boolean | object;
  defaultDirection?: string;
  allowScriptedContent?: boolean;
  allowPopups?: boolean;
  transparency?: boolean;
  direction?: string;
  orientation?: string;
  usePreRendering?: boolean;
  globalLayoutProperties?: {
    flow?: Flow;
    [key: string]: unknown;
  };
}
