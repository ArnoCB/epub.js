import type Section from '../section';
import type Contents from '../contents';
import type Layout from '../layout';
import type { Mark } from 'marks-pane';
import type { MarkDataObject } from './mark-data-object';
// No longer need EventEmitterMethods import
import type { BookRequestFunction } from './book';

export type CanonicalViewConstructor =
  typeof import('./canonical-view').default;
export type CanonicalViewInstance = InstanceType<CanonicalViewConstructor>;

export type View = CanonicalViewInstance & {
  // Event emitter methods using composition pattern
  on(type: string, listener: (...args: unknown[]) => void): View;
  emit(type: string, ...args: unknown[]): void;
  off(type: string, listener: (...args: unknown[]) => void): View;
  once(type: string, listener: (...args: unknown[]) => void): View;
  element: HTMLElement;
  displayed: boolean;
  section?: Section;
  index: number;
  // not available while loading
  contents?: Contents | undefined;
  bounds(): DOMRect | { width: number; height: number } | undefined;
  offset(): { top: number; left: number };
  onDisplayed(view?: View): void;
  display(request?: BookRequestFunction): Promise<View>;
  position(): DOMRect;
  width(): number;
  height(): number;
  size(width?: number, height?: number): void;
  setLayout(layout: Layout): void;
  onResize?(
    view: View,
    size?: {
      width: number;
      height: number;
      widthDelta: number;
      heightDelta: number;
    }
  ): void;
  locationOf(target: HTMLElement | string): { left: number; top: number };
  highlight: (
    cfiRange: string,
    data: MarkDataObject,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  underline: (
    cfiRange: string,
    data: MarkDataObject,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  mark: (
    cfiRange: string,
    data: MarkDataObject,
    cb?: (e: Event) => void
  ) => { element: HTMLElement; range: Range } | Node | null;
  unhighlight: (cfiRange: string) => void;
  ununderline: (cfiRange: string) => void;
  unmark: (cfiRange: string) => void;
  show: () => void;
  hide: () => void;
  destroy: () => void;
};

export type ViewConstructor = new (
  section: Section,
  options: Record<string, unknown>
) => View;
