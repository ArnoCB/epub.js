import { Section } from '../../section';
import IframeView from '../views/iframe';
import { View } from './views';
import Layout, { Axis, Flow } from '../../layout';
export interface ViewRendererSettings {
    ignoreClass?: string;
    axis?: Axis;
    direction?: string;
    width: number;
    height: number;
    layout?: Layout;
    method?: string;
    forceRight?: boolean;
    allowScriptedContent?: boolean;
    allowPopups?: boolean;
    transparency?: boolean;
    forceEvenPages?: boolean;
    flow?: Flow;
}
export interface RenderingOptions {
    forceRight?: boolean;
    offscreen?: boolean;
    container?: HTMLElement;
    preserveContent?: boolean;
}
/**
 * ViewRenderer - Centralized view creation and rendering logic
 *
 * This class abstracts the common view creation and rendering logic that was
 * previously duplicated between DefaultViewManager and PreRenderer.
 * It provides consistent rendering behavior across all contexts and supports
 * different rendering strategies (immediate vs. offscreen).
 */
export declare class ViewRenderer {
    private settings;
    private request?;
    constructor(settings: ViewRendererSettings, request?: (url: string) => Promise<Document>);
    /**
     * Create a new view for a section with optional rendering options
     */
    createView(section: Section, options?: RenderingOptions): IframeView;
    /**
     * Render a view and optionally attach it to a container
     * Supports both immediate rendering and offscreen rendering
     */
    renderView(view: View, options?: RenderingOptions): Promise<View>;
    /**
     * Preserve view content for later restoration (used in pre-rendering)
     */
    private preserveViewContent;
    /**
     * Update renderer settings
     */
    updateSettings(newSettings: Partial<ViewRendererSettings>): void;
    /**
     * Get current settings
     */
    getSettings(): ViewRendererSettings;
    /**
     * Create and render a view in one step (for offscreen use)
     */
    createAndRenderView(section: Section, options?: RenderingOptions): Promise<View>;
    /**
     * Restore preserved content to a view (for pre-rendered content)
     */
    restoreViewContent(view: View): boolean;
}
export default ViewRenderer;
