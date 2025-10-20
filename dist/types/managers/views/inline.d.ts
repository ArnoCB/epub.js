import type { BookRequestFunction, InlineViewOptions, InlineViewSettings } from '../../types';
import type { Axis } from '../../enums';
import EpubCFI from '../../epubcfi';
import Contents from '../../contents';
import Layout from '../../layout';
import Section from '../../section';
import type { View } from '../../types';
declare class InlineView implements View {
    private _events;
    settings: InlineViewSettings;
    frame: HTMLDivElement | undefined;
    id: string;
    element: HTMLElement;
    index: number;
    section: Section;
    on<T extends unknown[] = unknown[]>(type: string, listener: (...args: T) => void): View;
    off<T extends unknown[] = unknown[]>(type: string, listener: (...args: T) => void): View;
    once<T extends unknown[] = unknown[]>(type: string, listener: (...args: T) => void): View;
    emit(type: string, ...args: unknown[]): void;
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
    render(request?: BookRequestFunction, show?: boolean): Promise<void>;
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
    display(request?: BookRequestFunction): Promise<View>;
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
