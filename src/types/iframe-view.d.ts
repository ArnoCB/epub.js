import type { Axis, Flow } from './common';
import type { Layout } from './layout';

export interface ExtendedIFrameElement extends HTMLIFrameElement {
  allowTransparency?: string;
  seamless?: string;
}

export type IframeViewSettings = {
  ignoreClass: string;
  axis: Axis | undefined;
  direction: Direction | undefined;
  width: number;
  height: number;
  layout: Layout | undefined;
  globalLayoutProperties: Record<string, unknown>;
  method: string | undefined;
  forceRight: boolean;
  allowScriptedContent: boolean;
  allowPopups: boolean;
  transparency: boolean;
  forceEvenPages?: boolean;
  flow?: Flow;
};
