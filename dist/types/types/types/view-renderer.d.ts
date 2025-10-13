/**
 * Types for ViewRenderer settings and rendering options in epub.js
 *
 * Used by view-renderer and related logic.
 */

import type { Axis } from './common';
import type { Direction } from './common';
import type { Layout } from '../layout';
import type { Flow } from './index';

export interface ViewRendererSettings {
  ignoreClass?: string;
  axis?: Axis;
  direction?: Direction;
  width: number;
  height: number;
  layout?: Layout;
  method?: string;
  forceRight?: boolean;
  allowScriptedContent?: boolean;
  allowPopups?: boolean;
  transparency?: boolean;
  forceEvenPages?: boolean;
  flow?: Flow;
}

export interface RenderingOptions {
  forceRight?: boolean;
  offscreen?: boolean;
  container?: HTMLElement;
  preserveContent?: boolean;
}
