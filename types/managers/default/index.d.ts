import EventEmitter from 'event-emitter';
import Mapping from '../../mapping';
import Queue from '../../utils/queue';
import Stage from '../helpers/stage';
import Views, { View, ViewConstructor } from '../helpers/views';
import { ViewManager } from '../helpers/snap';
import Layout, { Axis, Flow } from 'src/layout';
import { Section } from 'src/section';
import { Contents } from 'src/epub';
import { ViewRenderer } from '../helpers/view-renderer';
export type DefaultViewManagerSettings = {
  layout: Layout;
  infinite?: boolean;
  hidden?: boolean;
  width?: number;
  height?: number;
  axis?: Axis;
  writingMode?: string;
  direction?: string;
  gap?: number;
  offset?: number;
  overflow?: string;
  afterScrolledTimeout: number;
  [key: string]: unknown;
};
export interface PageLocation {
  index: number;
  href: string;
  pages: number[];
  totalPages: number;
  mapping:
    | {
        start: string;
        end: string;
      }
    | undefined;
}
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off'>;
declare class DefaultViewManager implements ViewManager, EventEmitterMethods {
  on: EventEmitter['on'];
  off: EventEmitter['off'];
  emit: EventEmitter['emit'];
  settings: DefaultViewManagerSettings;
  viewSettings: {
    [key: string]: unknown;
  };
  stage: Stage;
  name: string;
  rendered: boolean;
  optsSettings: DefaultViewManagerSettings;
  View?: ViewConstructor | View;
  request: ((url: string) => Promise<Document>) | undefined;
  renditionQueue: unknown;
  q: Queue;
  layout: Layout;
  isPaginated: boolean;
  views: Views;
  container: HTMLElement;
  overflow: string;
  protected viewRenderer: ViewRenderer;
  _onScroll?: () => void;
  scrollLeft?: number;
  _stageSize?: {
    width: number;
    height: number;
  };
  _bounds:
    | {
        left: number;
        top: number;
        right: number;
        bottom: number;
      }
    | DOMRect;
  winBounds:
    | {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
      }
    | DOMRect
    | undefined;
  location: PageLocation[];
  mapping: Mapping | undefined;
  writingMode: string | undefined;
  scrollTop: number | undefined;
  orientationTimeout: NodeJS.Timeout | undefined;
  resizeTimeout: NodeJS.Timeout | undefined;
  afterScrolled: NodeJS.Timeout | undefined;
  ignore: boolean;
  scrolled: boolean;
  targetScrollLeft?: number;
  constructor(options: {
    settings: DefaultViewManagerSettings;
    view?: View | undefined;
    request?: (url: string) => Promise<Document>;
    queue?: unknown;
    [key: string]: unknown;
  });
  render(
    element: HTMLElement,
    size?: {
      width: number;
      height: number;
    }
  ): void;
  /**
   * Start pre-rendering all sections from a spine
   */
  addEventListeners(): void;
  removeEventListeners(): void;
  destroy(): void;
  onOrientationChange(): void;
  onResized(): void;
  resize(width?: string, height?: string, epubcfi?: string): void;
  createView(
    section: Section,
    forceRight?: boolean
  ): import('../views/iframe').default;
  handleNextPrePaginated(
    forceRight: boolean,
    section: Section,
    action: (section: Section) => Promise<View>
  ): Promise<View> | undefined;
  display(section: Section, target?: HTMLElement | string): Promise<unknown>;
  /**
   * Fallback to normal rendering when pre-rendered fails
   */
  private displayNormally;
  /**
   * Original display logic extracted for reuse
   */
  private displaySection;
  afterDisplayed(view: View): void;
  afterResized(view: View): void;
  add(section: Section, forceRight?: boolean): Promise<View>;
  moveTo(
    offset: {
      left: number;
      top: number;
    },
    width: number
  ): void;
  append(section: Section, forceRight?: boolean): Promise<View>;
  prepend(
    section: Section,
    forceRight?: boolean
  ): Promise<import('../views/iframe').default>;
  counter(bounds: { heightDelta: number; widthDelta: number }): void;
  next(): Promise<void>;
  prev(): Promise<void>;
  private hasViews;
  private handleScrollForward;
  private handleScrollBackward;
  private scrollForwardLTR;
  private scrollForwardRTL;
  private scrollForwardVertical;
  private scrollBackwardLTR;
  private scrollBackwardRTL;
  private scrollBackwardVertical;
  private loadNextSection;
  private loadPrevSection;
  private adjustScrollAfterPrepend;
  private rememberScrollPosition;
  current(): View | null;
  clear(): void;
  currentLocation(): PageLocation[];
  scrolledLocation(): PageLocation[];
  paginatedLocation(): PageLocation[];
  isVisible(
    view: View,
    offsetPrev: number,
    offsetNext: number,
    _container: DOMRect | undefined
  ): boolean;
  visible(): View[];
  scrollBy(x: number, y: number, silent: boolean): void;
  scrollTo(x: number, y: number, silent: boolean): void;
  onScroll(): void;
  bounds():
    | DOMRect
    | {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
      };
  applyLayout(layout: Layout): void;
  updateLayout(): void;
  setLayout(layout: Layout): void;
  updateWritingMode(mode: string): void;
  updateAxis(axis: Axis, forceUpdate?: boolean): void;
  updateFlow(flow: Flow, defaultScrolledOverflow?: string): void;
  getContents(): Contents[];
  direction(dir?: string): void;
  isRendered(): boolean;
}
export default DefaultViewManager;
