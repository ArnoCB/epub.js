import { HooksObject } from './utils/hook';

export interface GlobalLayout {
  layout: string;
  spread: string;
  orientation: string;
}

export interface LayoutSettings {
  layout: string;
  spread: string;
  orientation: string;
}

export interface SpineItem {
  idref: string;
  index: number;
  cfiBase: string;
  href?: string;
  url?: string;
  canonical?: string;
  properties?: Array<string>;
  linear?: string;
  next: () => Section | undefined;
  prev: () => Section | undefined;
}

/**
 * Represents a match found in a section.
 */
export interface Match {
  cfi: string;
  excerpt: string;
}

export default class Section {
  constructor(item: SpineItem, hooks: HooksObject);

  idref: string;
  linear: boolean;
  properties: Array<string>;
  index: number;
  href: string;
  url: string;
  canonical: string;
  next: () => SpineItem;
  prev: () => SpineItem;
  cfiBase: string;

  document: Document | undefined;
  contents: Element | undefined;
  output: string | undefined;

  hooks: HooksObject;

  load(_request?: Function): Promise<Element>;

  render(_request?: Function): Promise<string>;

  find(_query: string): Array<Match>;

  search(_query: string, maxSeqEle?: number): Array<Match>;

  reconcileLayoutSettings(globalLayout: GlobalLayout): LayoutSettings;

  cfiFromRange(_range: Range): string;

  cfiFromElement(el: Element): string;

  unload(): void;

  destroy(): void;
}
