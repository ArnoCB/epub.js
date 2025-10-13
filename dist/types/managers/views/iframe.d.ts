import EventEmitter from 'event-emitter';
import { defer } from '../../utils/core';
import EpubCFI from '../../epubcfi';
import Contents from '../../contents';
import { Pane as OriginalPane, Mark } from 'marks-pane';
import { View } from '../helpers/views';
import Layout from 'src/layout';
import Section from 'src/section';
import type { Flow, Axis } from 'src/types';
type EventEmitterMethods = Pick<EventEmitter, 'emit' | 'on' | 'off' | 'once'>;
interface ExtendedIFrameElement extends HTMLIFrameElement {
    allowTransparency?: string;
    seamless?: string;
}
declare class StyledPane extends OriginalPane {
    constructor(target: HTMLElement, container: HTMLElement, _transparency: boolean);
}
export type IframeViewSettings = {
    ignoreClass: string;
    axis: Axis | undefined;
    direction: string | undefined;
    width: number;
    height: number;
    layout: Layout | undefined;
    globalLayoutProperties: Record<string, unknown>;
    method: string | undefined;
    forceRight: boolean;
    allowScriptedContent: boolean;
    allowPopups: boolean;
    transparency: boolean;
    forceEvenPages?: boolean;
    flow?: Flow;
};
declare class IframeView implements View, EventEmitterMethods {
    emit: EventEmitter['emit'];
    on: EventEmitter['on'];
    off: EventEmitter['off'];
    once: EventEmitter['once'];
    settings: IframeViewSettings;
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
    highlights: {
        [key: string]: {
            mark: Mark;
            element: HTMLElement;
            listeners: Array<(e: Event) => void>;
        };
    };
    underlines: {
        [key: string]: {
            mark: Mark;
            element: HTMLElement;
            listeners: Array<(e: Event) => void>;
        };
    };
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
    container(axis: string): HTMLDivElement;
    create(): ExtendedIFrameElement;
    /**
     * Stub for createContainer to resolve TypeScript errors.
     * Returns a new div element.
     */
    createContainer(): HTMLElement;
    render(request?: (url: string) => Promise<Document>): Promise<void>;
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
    display(request?: (url: string) => Promise<Document>): Promise<unknown>;
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
