import type { Axis, InlineViewOptions, InlineViewSettings } from '../../types';
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off' | 'once'>;
import EventEmitter from 'event-emitter';
import EpubCFI from '../../epubcfi';
import Contents from '../../contents';
import Layout from '../../layout';
import { View } from '../helpers/views';
import Section from '../../section';
declare class InlineView implements EventEmitterMethods, View {
    emit: EventEmitter['emit'];
    on: EventEmitter['on'];
    off: EventEmitter['off'];
    once: EventEmitter['once'];
    settings: InlineViewSettings;
    frame: HTMLDivElement | undefined;
    id: string;
    element: HTMLElement;
    index: number;
    section: Section;
    added: boolean;
    displayed: boolean;
    rendered: boolean;
    fixedWidth: number;
    fixedHeight: number;
    epubcfi: EpubCFI;
    layout: Layout;
    elementBounds: {
        width: number;
        height: number;
    } | undefined;
    _width: number;
    _height: number;
    lockedWidth: number;
    lockedHeight: number;
    stopExpanding: boolean;
    resizing: boolean;
    _expanding: boolean;
    prevBounds: {
        width: number;
        height: number;
    } | undefined;
    contents: Contents | undefined;
    rendering: boolean;
    _needsReframe: boolean;
    document: Document | undefined;
    window: Window | null | undefined;
    constructor(section: Section, options?: InlineViewOptions);
    container(axis: Axis): HTMLDivElement;
    width(): number;
    height(): number;
    highlight(cfiRange: string, data: Record<string, string>, cb?: (e: Event) => void, className?: string, styles?: object): undefined;
    underline(cfiRange: string, data?: Record<string, string>, cb?: (e: Event) => void, className?: string, styles?: object): undefined;
    mark(cfiRange: string, data?: Record<string, string>, cb?: (e: Event) => void): null;
    unhighlight(cfiRange: string): void;
    ununderline(cfiRange: string): void;
    unmark(cfiRange: string): void;
    create(): HTMLDivElement;
    render(request?: (url: string) => Promise<Document>, show?: boolean): Promise<void>;
    size(_width?: number, _height?: number): void;
    lock(what: string, width: number, height: number): void;
    expand(): void;
    contentWidth(): number;
    contentHeight(): number;
    resize(width: number | false, height: number | false): void;
    load(content: string | any): Promise<any>;
    reset(): void;
    setAxis(axis: string): void;
    onLoad(_event: Event, _promise: any): void;
    /**
     * Stub for createContainer to resolve TypeScript errors.
     * Returns a new div element.
     */
    createContainer(): HTMLElement;
    setLayout(layout: Layout): void;
    resizeListenters(): void;
    addListeners(): void;
    removeListeners(_layoutFunc?: unknown): void;
    display(request: (url: string) => Promise<Document>): Promise<unknown>;
    show(): void;
    hide(): void;
    position(): DOMRect;
    locationOf(target: HTMLElement): {
        left: number;
        top: number;
    };
    /**
     * Called when a view is displayed.
     * Override this method to add custom behavior.
     * @param {InlineView} view - The view that was displayed.
     * @suppress {eslint}
     */
    onDisplayed(view?: View): void;
    /**
     * Called when a view is resized.
     * Override this method to add custom behavior.
     * @param {InlineView} view - The view being resized.
     * @param {Event} e - The resize event.
     * @suppress {eslint}
     */
    onResize(view: View, size?: {
        width: number;
        height: number;
        widthDelta: number;
        heightDelta: number;
    }): void;
    bounds(): {
        width: number;
        height: number;
    };
    offset(): {
        top: number;
        left: number;
    };
    destroy(): void;
}
export default InlineView;
