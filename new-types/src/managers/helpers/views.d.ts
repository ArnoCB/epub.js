import Section from 'src/section';
import Contents from '../../contents';
import Layout from '../../layout';
import { Mark } from 'marks-pane';
type CanonicalViewConstructor = typeof import('types/managers/view').default;
type CanonicalViewInstance = InstanceType<CanonicalViewConstructor>;
export type View = CanonicalViewInstance & {
  element: HTMLElement;
  displayed: boolean;
  section?: Section;
  index?: number;
  contents?: Contents;
  bounds():
    | DOMRect
    | {
        width: number;
        height: number;
      }
    | undefined;
  offset(): {
    top: number;
    left: number;
  };
  onDisplayed?(view?: View): void;
  display?(request?: (url: string) => Promise<Document>): Promise<unknown>;
  position?(): DOMRect;
  width?(): number;
  height?(): number;
  setLayout?(layout: Layout): void;
  onResize?(
    view: View,
    size?: {
      width: number;
      height: number;
      widthDelta: number;
      heightDelta: number;
    }
  ): void;
  locationOf?(target: HTMLElement | string): {
    left: number;
    top: number;
  };
  highlight?: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  underline?: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void,
    className?: string,
    styles?: object
  ) => Mark | undefined;
  mark?: (
    cfiRange: string,
    data: Record<string, string>,
    cb?: (e: Event) => void
  ) =>
    | {
        element: HTMLElement;
        range: Range;
      }
    | Node
    | null;
  unhighlight?: (cfiRange: string) => void;
  ununderline?: (cfiRange: string) => void;
  unmark?: (cfiRange: string) => void;
};
export type ViewConstructor = new (
  section: Section,
  options: Record<string, unknown>
) => View;
declare class Views {
  container: HTMLElement;
  _views: View[];
  length: number;
  hidden: boolean;
  constructor(container: HTMLElement);
  all(): View[];
  first(): View;
  last(): View;
  indexOf(view: View): number;
  slice(...args: number[]): View[];
  get(i: number): View;
  append(view: View): View;
  prepend(view: View): View;
  insert(view: View, index: number): View;
  remove(view: View): void;
  destroy(view: View): void;
  forEach(callback: (view: View) => void): void;
  clear(): void;
  find(section: { index: number }): View | undefined;
  displayed(): View[];
  show(): void;
  hide(): void;
}
export default Views;
