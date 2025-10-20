import { defer } from '../../utils/core';
import EpubCFI from '../../epubcfi';
import Contents from '../../contents';
import { Mark } from 'marks-pane';
import Layout from '../../layout';
import Section from '../../section';
import { StyledPane } from './styled-pane';
import type { BookRequestFunction, ExtendedIFrameElement, IframeViewSettings, MarkElementMap } from '../../types';
import type { Axis } from '../../enums';
import type { View } from '../../types';
declare class IframeView implements View {
    private _events;
    settings: IframeViewSettings;
    on(type: string, listener: (...args: unknown[]) => void): View;
    off(type: string, listener: (...args: unknown[]) => void): View;
    once(type: string, listener: (...args: unknown[]) => void): View;
    emit(type: string, ...args: unknown[]): void;
    frame: HTMLIFrameElement | undefined;
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
    pane: StyledPane | undefined;
    highlights: MarkElementMap;
    underlines: MarkElementMap;
    marks: {
        [key: string]: {
            element: HTMLElement;
            range: Range;
            listeners: Array<(e: Event) => void>;
        };
    };
    iframe: ExtendedIFrameElement | undefined;
    supportsSrcdoc: boolean | undefined;
    window: Window | undefined;
    document: Document | undefined;
    sectionRender: Promise<string> | undefined;
    writingMode: string | undefined;
    contents: Contents | undefined;
    _textWidth: number | undefined;
    _contentWidth: number | undefined;
    _textHeight: number | undefined;
    _contentHeight: number | undefined;
    _needsReframe: boolean;
    blobUrl: string | undefined;
    axis?: Axis;
    rendering: boolean;
    prevBounds: {
        width: number;
        height: number;
    } | undefined;
    constructor(section: Section, options?: Partial<IframeViewSettings>);
    container(axis: Axis): HTMLDivElement;
    create(): ExtendedIFrameElement;
    /**
     * Stub for createContainer to resolve TypeScript errors.
     * Returns a new div element.
     */
    createContainer(): HTMLElement;
    render(request?: BookRequestFunction): Promise<void>;
    reset(): void;
    size(_width?: number, _height?: number): void;
    lock(what: 'width' | 'height' | 'both', width: number, height: number): void;
    expand(): void;
    reframe(width: number, height: number): void;
    load(contents: string): Promise<Contents>;
    /**
     * Essential setup for Contents object - used by both normal onLoad and prerendering
     * This contains only the safe and essential parts needed for highlighting to work
     */
    setupContentsForHighlighting(iframe: HTMLIFrameElement, section: Section, transparency?: boolean): Contents | null;
    /**
     * Ensures Contents object exists for highlighting/underlining - works for both normal and prerendered views
     */
    private ensureContentsForMarking;
    onLoad(event: Event, promise: defer<Contents>): void;
    setLayout(layout: Layout): void;
    setAxis(axis: Axis): void;
    setWritingMode(mode: string): void;
    addListeners(): void;
    removeListeners(): void;
    display(request?: BookRequestFunction): Promise<View>;
    show(): void;
    hide(): void;
    offset(): {
        top: number;
        left: number;
    };
    width(): number;
    height(): number;
    position(): DOMRect;
    locationOf(target: HTMLElement): {
        left: number;
        top: number;
    };
    onDisplayed(view?: View): void;
    onResize(_viewer: View, _newSize?: {
        width: number;
        height: number;
        widthDelta: number;
        heightDelta: number;
    }): void;
    bounds(force?: boolean): {
        width: number;
        height: number;
    };
    highlight(cfiRange: string, data?: Record<string, string>, cb?: (e: Event) => void, className?: string, styles?: {}): Mark | undefined;
    underline(cfiRange: string, data?: Record<string, string>, cb?: (e: Event) => void, className?: string, styles?: {}): Mark | undefined;
    mark(cfiRange: string, data?: Record<string, string>, cb?: (e: Event) => void): {
        element: HTMLElement;
        range: Range;
    } | Node | null;
    placeMark(element: HTMLElement, range: Range): void;
    unhighlight(cfiRange: string): void;
    ununderline(cfiRange: string): void;
    unmark(cfiRange: string): void;
    destroy(): void;
}
export default IframeView;
