import Section from '../section';
import Contents from '../contents';
import Layout from '../layout';

export interface ViewSettings {
  ignoreClass?: string;
  axis?: string;
  flow?: string;
  layout?: Layout;
  method?: string;
  width?: number;
  height?: number;
  forceEvenPages?: boolean;
  allowScriptedContent?: boolean;
}

export default class View {
  index: number;
  constructor(section: Section, options: ViewSettings);

  create(): any;

  render(request?: Function, show?: boolean): Promise<void>;

  reset(): void;

  size(_width: number, _height: number): void;

  load(content: string | Contents): Promise<any>;

  setLayout(layout: any): void;

  setAxis(axis: string): void;

  display(request?: Function): Promise<any>;

  show(): void;

  hide(): void;

  offset(): { top: number; left: number };

  width(): number;

  height(): number;

  position(): any;

  locationOf(target: string | HTMLElement): { top: number; left: number };

  onDisplayed(view?: View): void;

  onResize(
    view: any,
    size?: {
      width: number;
      height: number;
      widthDelta?: number;
      heightDelta?: number;
    }
  ): void;

  onLoad(event: Event, promise: any): void;

  bounds(force?: boolean): DOMRect | { width: number; height: number };

  highlight(
    cfiRange: string,
    data?: object,
    cb?: Function,
    className?: string,
    styles?: object
  ): void;

  underline(
    cfiRange: string,
    data?: object,
    cb?: Function,
    className?: string,
    styles?: object
  ): void;

  mark(cfiRange: string, data?: object, cb?: Function): void;

  unhighlight(cfiRange: string): void;

  ununderline(cfiRange: string): void;

  unmark(cfiRange: string): void;

  destroy(): void;
  // Event emitters
  emit(type: any, ...args: any[]): void;

  off(type: any, listener: any): any;

  on(type: any, listener: any): any;

  once(type: any, listener: any, ...args: any[]): any;
}
