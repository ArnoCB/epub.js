// Layout-related properties for metadata and settings
import type {
  Flow,
  Spread,
  Direction,
  Orientation,
  LayoutType,
} from './common';
import type { Hook } from '../utils/hook';

export type LayoutProperties = {
  layout?: LayoutType;
  spread?: Spread;
  orientation?: Orientation;
  flow?: Flow;
  direction?: Direction;
  minSpreadWidth?: number;
  viewport?: string;
};

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
  layout?: LayoutType;
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
  direction?: Direction;
  orientation?: Orientation;
  usePreRendering?: boolean;
  globalLayoutProperties?: {
    flow?: Flow;
    [key: string]: unknown;
  };
}
