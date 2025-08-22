export interface ViewManagerConstructor extends ViewManager {
  new (options: { [key: string]: unknown }): ViewManager;
}
export interface ViewManager {
  on(event: string, listener: (...args: unknown[]) => void): EventEmitter;
  off(event: string, listener: (...args: unknown[]) => void): EventEmitter;
  settings: {
    infinite?: boolean;
    hidden?: boolean;
    width?: number;
    height?: number;
    axis?: string;
    writingMode?: string;
    flow?: string;
    ignoreClass?: string;
    fullsize?: boolean;
    allowScriptedContent?: boolean;
    allowPopups?: boolean;
    overflow?: unknown;
    offset?: number;
    afterScrolledTimeout?: number;
    gap?: number;
    layout: Layout;
    [key: string]: unknown;
  };
  stage: Stage;
  isPaginated?: boolean;
  overflow?: unknown;
  views: Views;
  on(event: string, listener: (...args: unknown[]) => void): EventEmitter;
  container?: HTMLElement;
  display: (
    section: Section,
    target?: HTMLElement | string
  ) => Promise<unknown>;
  render: (
    element: HTMLElement,
    size?: {
      width: number;
      height: number;
    }
  ) => void;
  destroy: () => void;
  clear: () => void;
  resize: (width?: string, height?: string, epubcfi?: string) => void;
  prev: () => Promise<void>;
  next: () => Promise<void>;
  applyLayout: (layout: Layout) => void;
  updateFlow: (flow: Flow, defaultScrolledOverflow?: string) => void;
  isRendered: () => boolean;
  updateLayout: () => void;
  direction: (dir?: string) => void;
  currentLocation: () => PageLocation[];
  getContents(): Contents[];
}
import EventEmitter from 'event-emitter';
import Layout, { Flow } from '../../layout';
import Views, { View } from './views';
import Contents from '../../contents';
import Stage from './stage';
import { PageLocation } from '../default';
import { Section } from '../../section';
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off'>;
declare class Snap implements EventEmitterMethods {
  private isTouchEvent;
  emit: EventEmitter['emit'];
  on: EventEmitter['on'];
  off: EventEmitter['off'];
  touchCanceler: boolean;
  resizeCanceler: boolean;
  snapping: boolean;
  startTouchX?: number;
  startTouchY?: number;
  startTime?: number;
  endTouchX?: number;
  endTouchY?: number;
  endTime?: number;
  scrollLeft?: number;
  scrollTop?: number;
  manager: ViewManager;
  layout: Layout;
  fullsize?: boolean;
  element: HTMLElement;
  scroller: HTMLElement | Window;
  isVertical?: boolean;
  _onResize?: () => void;
  _onScroll?: () => void;
  _onTouchStart?: (e: Event) => void;
  _onTouchMove?: (e: Event) => void;
  _onTouchEnd?: (e: Event) => void;
  _afterDisplayed?: (view: View) => void;
  settings: {
    duration: number;
    minVelocity: number;
    minDistance: number;
    [key: string]: unknown;
  };
  private _supportsTouch;
  constructor(
    manager: ViewManager,
    options: {
      [key: string]: unknown;
    }
  );
  setup(manager: ViewManager): void;
  supportsTouch(): boolean;
  disableScroll(): void;
  enableScroll(): void;
  addListeners(): void;
  removeListeners(): void;
  afterDisplayed(view: View): void;
  triggerViewEvent(e: Event, contents: Contents): void;
  onScroll(): void;
  onResize(): void;
  onTouchStart(e: Event): void;
  onTouchMove(e: Event): void;
  onTouchEnd(e?: Event): void;
  wasSwiped(): 0 | 1 | -1 | undefined;
  needsSnap(): boolean;
  snap(howMany?: number): Promise<unknown>;
  smoothScrollTo(destination: number): Promise<unknown>;
  scrollTo(left?: number, top?: number): void;
  now(): number;
  destroy(): void;
}
export default Snap;
