import { defer } from '../../utils/core';
import DefaultViewManager, { DefaultViewManagerSettings } from '../default';
import Snap from '../helpers/snap';
import { ViewManager } from '../helpers/snap';
import { Flow } from '../../layout';
import Section from '../../section';
import { View } from '../helpers/views';
import EventEmitter from 'event-emitter';
import IframeView from '../views/iframe';
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off'>;
declare class ContinuousViewManager extends DefaultViewManager implements ViewManager, EventEmitterMethods {
    trimTimeout: NodeJS.Timeout | undefined;
    snapper: Snap | undefined;
    scrollDeltaVert: number;
    scrollDeltaHorz: number;
    _scrolled: () => void;
    didScroll: boolean | undefined;
    scrollTimeout: NodeJS.Timeout | undefined;
    tick: ((callback: FrameRequestCallback) => number) | undefined;
    prevScrollTop: number;
    prevScrollLeft: number;
    constructor(options: {
        settings: DefaultViewManagerSettings;
        view?: View | undefined;
        request?: (url: string) => Promise<Document>;
        queue?: unknown;
        [key: string]: unknown;
    });
    display(section: Section, target?: HTMLElement | string): Promise<unknown>;
    fill(_full?: defer): Promise<unknown>;
    afterResized(view: View): void;
    removeShownListeners(view: View): void;
    add(section: Section): Promise<View>;
    append(section: Section): Promise<View>;
    prepend(section: Section): Promise<IframeView>;
    counter(bounds: {
        heightDelta: number;
        widthDelta: number;
    }): void;
    update(_offset?: number): Promise<unknown>;
    /**
     * A dynamic pagination/virtualization check that ensures the visible content is filled and loads more
     * views as needed when scrolling near the edges.
     *
     * Returns false if no new views needed to be appended or prepended—i.e., the visible area
     * is already filled and no additional content needs to be loaded.
     */
    check(_offsetLeft?: number, _offsetTop?: number): Promise<boolean>;
    trim(): Promise<unknown>;
    erase(view: View, above?: View[]): void;
    moveTo(offset: {
        top: number;
        left: number;
    }): void;
    addEventListeners(): void;
    addScrollListeners(): void;
    removeEventListeners(): void;
    onScroll(): void;
    hasScrolled(): void;
    next(): Promise<void>;
    prev(): Promise<void>;
    updateFlow(flow: Flow): void;
    destroy(): void;
}
export default ContinuousViewManager;
