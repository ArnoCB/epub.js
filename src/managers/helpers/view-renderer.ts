import { Section } from '../../section';
import IframeView from '../views/iframe';
import { View } from './views';
import { extend } from '../../utils';
import type { ViewRendererSettings, RenderingOptions } from '../../types';

/**
 * ViewRenderer - Centralized view creation and rendering logic
 *
 * This class abstracts the common view creation and rendering logic that was
 * previously duplicated between DefaultViewManager and PreRenderer.
 * It provides consistent rendering behavior across all contexts and supports
 * different rendering strategies (immediate vs. offscreen).
 */
export class ViewRenderer {
  private settings: ViewRendererSettings;
  private request?: (url: string) => Promise<Document>;

  constructor(
    settings: ViewRendererSettings,
    request?: (url: string) => Promise<Document>
  ) {
    this.settings = settings;
    this.request = request;
  }

  /**
   * Create a new view for a section with optional rendering options
   */
  createView(section: Section, options: RenderingOptions = {}): IframeView {
    const viewSettings = extend(this.settings, {
      forceRight: options.forceRight || false,
    });

    const view = new IframeView(section, viewSettings);

    // Ensure EventEmitter methods are available
    // If they're not, add minimal stubs to prevent errors
    if (typeof view.on !== 'function') {
      console.warn(
        '[ViewRenderer] EventEmitter methods not available on view for:',
        section.href,
        'adding stubs'
      );

      // Add robust EventEmitter stubs to prevent errors
      (view as unknown as Record<string, unknown>).on = function (
        ...args: unknown[]
      ) {
        console.debug('[ViewRenderer] view.on stub called with:', args);
        return view;
      };

      (view as unknown as Record<string, unknown>).off = function (
        ...args: unknown[]
      ) {
        console.debug('[ViewRenderer] view.off stub called with:', args);
        return view;
      };

      (view as unknown as Record<string, unknown>).emit = function (
        ...args: unknown[]
      ) {
        console.debug('[ViewRenderer] view.emit stub called with:', args);
        return view;
      };

      (view as unknown as Record<string, unknown>).once = function (
        ...args: unknown[]
      ) {
        console.debug('[ViewRenderer] view.once stub called with:', args);
        return view;
      };
    }

    return view;
  }

  /**
   * Render a view and optionally attach it to a container
   * Supports both immediate rendering and offscreen rendering
   */
  async renderView(view: View, options: RenderingOptions = {}): Promise<View> {
    try {
      // Set dimensions if specified
      if (this.settings.width || this.settings.height) {
        view.size(this.settings.width, this.settings.height);
      }

      // Handle offscreen rendering
      if (options.offscreen && options.container) {
        // For offscreen rendering, we need to append the view element to the container
        options.container.appendChild(view.element);

        // Load and render the content
        await view.display(this.request);

        // Preserve content if requested (for pre-rendering scenarios)
        if (options.preserveContent) {
          this.preserveViewContent(view);
        }

        return view;
      }

      // For regular rendering, the view should be appended to Views collection
      // by the caller (manager), then display() is called

      // Load and render the content
      await view.display(this.request);

      return view;
    } catch (error) {
      console.error(
        '[ViewRenderer] Failed to render view for:',
        view.section?.href || 'unknown section',
        error
      );
      throw error;
    }
  }

  /**
   * Preserve view content for later restoration (used in pre-rendering)
   */
  private preserveViewContent(view: View): void {
    try {
      if (view.element && view.element.querySelector('iframe')) {
        const iframe = view.element.querySelector(
          'iframe'
        ) as HTMLIFrameElement;

        // Store srcdoc attribute if available
        if (iframe.srcdoc) {
          (view as unknown as Record<string, unknown>).preservedSrcdoc =
            iframe.srcdoc;
        }

        // Store full document HTML if accessible
        if (iframe.contentDocument) {
          (view as unknown as Record<string, unknown>).preservedContent =
            iframe.contentDocument.documentElement.outerHTML;
        }
      }
    } catch (error) {
      console.debug('[ViewRenderer] Content preservation failed:', error);
    }
  }

  /**
   * Update renderer settings
   */
  updateSettings(newSettings: Partial<ViewRendererSettings>): void {
    this.settings = extend(this.settings, newSettings);
  }

  /**
   * Get current settings
   */
  getSettings(): ViewRendererSettings {
    return { ...this.settings };
  }

  /**
   * Create and render a view in one step (for offscreen use)
   */
  async createAndRenderView(
    section: Section,
    options: RenderingOptions = {}
  ): Promise<View> {
    const view = this.createView(section, options);
    return this.renderView(view, options);
  }

  /**
   * Restore preserved content to a view (for pre-rendered content)
   */
  restoreViewContent(view: View): boolean {
    try {
      const iframe = view.element?.querySelector('iframe') as HTMLIFrameElement;
      if (!iframe) {
        return false;
      }

      // Try to restore from preserved srcdoc
      const preservedSrcdoc = (view as unknown as Record<string, unknown>)
        .preservedSrcdoc as string;
      if (preservedSrcdoc && !iframe.srcdoc) {
        iframe.srcdoc = preservedSrcdoc;
        return true;
      }

      // Try to restore from preserved full content
      const preservedContent = (view as unknown as Record<string, unknown>)
        .preservedContent as string;
      if (preservedContent && iframe.contentDocument) {
        iframe.contentDocument.open();
        iframe.contentDocument.write(preservedContent);
        iframe.contentDocument.close();
        return true;
      }

      return false;
    } catch (error) {
      console.debug('[ViewRenderer] Content restoration failed:', error);
      return false;
    }
  }
}

export default ViewRenderer;
