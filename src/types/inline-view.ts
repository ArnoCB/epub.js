import { Axis } from '../enums';
import type Layout from '../layout';

export interface InlineViewOptions {
  ignoreClass?: string;
  axis?: Axis;
  width?: number;
  height?: number;
  layout?: Layout;
  globalLayoutProperties?: Record<string, unknown>;
  quest?: (url: string) => Promise<Document>;
  [key: string]: unknown;
}

export interface InlineViewSettings {
  // All properties from InlineViewOptions, but required after extend
  ignoreClass: string;
  axis: Axis;
  width: number;
  height: number;
  layout: Layout;
  globalLayoutProperties: Record<string, unknown>;
}
