import type Section from '../section';
import type { View } from '.';
import type { defer } from '../utils';
import type { PageMapEntry } from './page-map-entry';

export interface PreRenderedChapter {
  section: Section;
  view: View;
  element: HTMLElement;
  rendered: defer<View>;
  attached: boolean;
  width: number;
  height: number;
  pageCount: number;
  hasWhitePages: boolean;
  whitePageIndices: number[];
  pageMap?: PageMapEntry[];
  diagnostics?: Array<Record<string, unknown>>;
  pageNumbersDeferred?: defer<void>;
  pageNumbersAssigned?: Promise<void>;
  preservedSrcdoc?: string;
  preservedContent?: string;
}
