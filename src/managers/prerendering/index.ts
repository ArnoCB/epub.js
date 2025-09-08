import DefaultViewManager, { DefaultViewManagerSettings } from '../default';
import BookPreRenderer, {
  PreRenderedChapter,
  PreRenderingStatus,
  ViewSettings,
} from '../prerenderer';
import { ViewManager } from '../helpers/snap';
import { View } from '../helpers/views';
import { Section } from '../../section';
import IframeView from '../views/iframe';

/**
 * PreRenderingViewManager - Extends DefaultViewManager to add pre-rendering capabilities
 *
 * This manager adds prerendering functionality on top of the DefaultViewManager.
 * The parent DefaultViewManager has no knowledge of prerendering - this manager adds it
 * as a transparent layer on top.
 */
export class PreRenderingViewManager
  extends DefaultViewManager
  implements ViewManager
{
  private myPreRenderer: BookPreRenderer | null = null;
  public usePreRendering: boolean = false;
  private spine: Section[] | null = null;
  // Guard to ensure prerendering is only started once per manager instance
  private _preRenderingStarted: boolean = false;

  // Override the name property
  public name: string = 'prerendering';

  // Public getter for compatibility with examples
  public get preRenderer(): BookPreRenderer | null {
    return this.myPreRenderer;
  }

  constructor(options: {
    settings: DefaultViewManagerSettings & { usePreRendering?: boolean };
    spine?: Section[];
    [key: string]: unknown;
  }) {
    console.log('[PreRenderingViewManager] ✅ CREATING PRERENDERING MANAGER');

    // Call the parent constructor
    super(options);

    console.log(
      '[PreRenderingViewManager] ✅ CONSTRUCTOR COMPLETE - this.name:',
      this.name
    );

    // Add debugging for method verification
    console.log(
      '[PreRenderingViewManager] Constructor completed, instance created'
    );
    console.log(
      '[PreRenderingViewManager] paginatedLocation method bound:',
      typeof this.paginatedLocation === 'function'
    );

    // Check if prerendering is enabled
    this.usePreRendering = options.settings.usePreRendering || false;

    // Store the spine if provided
    this.spine = options.spine || null;

    console.log(
      '[PreRenderingViewManager] usePreRendering:',
      this.usePreRendering
    );

    console.log(
      '[PreRenderingViewManager] spine sections:',
      this.spine?.length || 0
    );
    console.log(
      '[PreRenderingViewManager] Pre-renderer initialization deferred until render()'
    );
    // initialization deferred until render()
  }

  // Helper to validate attached iframe content with a small wait and one retry
  // Override append to use prerendered chapters when available

  // SIMPLIFIED: Use DefaultViewManager's logic completely
  async append(
    section: Section,
    forceRight: boolean = false
  ): Promise<IframeView> {
    console.log('[PreRenderingViewManager] APPEND called for:', section.href);

    // Always delegate to DefaultViewManager for proper layout/scrolling/pagination
    return super.append(section, forceRight) as Promise<IframeView>;
  }

  // SIMPLIFIED: Use DefaultViewManager's logic completely
  async prepend(
    section: Section,
    forceRight: boolean = false
  ): Promise<IframeView> {
    console.log('[PreRenderingViewManager] PREPEND called for:', section.href);

    // Always delegate to DefaultViewManager for proper layout/scrolling/pagination
    return super.prepend(section, forceRight) as Promise<IframeView>;
  }

  // SIMPLIFIED: Use DefaultViewManager's logic completely
  async display(
    section: Section,
    target?: string | HTMLElement
  ): Promise<unknown> {
    console.log('[PreRenderingViewManager] DISPLAY called for:', section.href);

    // Always delegate to DefaultViewManager for proper layout/scrolling/pagination
    return super.display(section, target);
  }

  // Pre-rendering specific methods
  async startPreRendering(sections: Section[]): Promise<void> {
    if (!this.usePreRendering || !this.myPreRenderer) {
      console.warn(
        '[PreRenderingViewManager] Pre-rendering not enabled or available'
      );
      return;
    }

    if (this._preRenderingStarted) {
      console.debug(
        '[PreRenderingViewManager] startPreRendering called but already started'
      );
      return;
    }

    this._preRenderingStarted = true;
    console.log(
      `[PreRenderingViewManager] Starting pre-rendering of ${sections.length} sections`
    );

    await this.myPreRenderer.preRenderBook(sections);
  }

  getPreRenderedChapter(sectionHref: string): PreRenderedChapter | undefined {
    if (!this.usePreRendering || !this.myPreRenderer) {
      return undefined;
    }
    return this.myPreRenderer.getChapter(sectionHref);
  }

  hasPreRenderedChapter(sectionHref: string): boolean {
    if (!this.usePreRendering || !this.myPreRenderer) {
      return false;
    }
    return !!this.myPreRenderer.getChapter(sectionHref);
  }

  getPreRenderingStatus(): PreRenderingStatus {
    if (!this.usePreRendering || !this.myPreRenderer) {
      return {
        total: 0,
        rendered: 0,
        failed: 0,
        chapters: new Map(),
      };
    }
    return this.myPreRenderer.getStatus();
  }

  getAllPreRenderedChapters(): PreRenderedChapter[] {
    if (!this.usePreRendering || !this.myPreRenderer) {
      return [];
    }
    return this.myPreRenderer.getAllChapters();
  }

  getPreRenderingDebugInfo() {
    if (!this.usePreRendering || !this.myPreRenderer) {
      return {
        totalChapters: 0,
        renderingInProgress: 0,
        chapters: [],
      };
    }
    return this.myPreRenderer.getDebugInfo();
  }

  // SIMPLIFIED: Use DefaultViewManager's logic completely
  afterDisplayed(view: View | IframeView): void {
    console.log(
      '[PreRenderingViewManager] afterDisplayed called for:',
      view.section?.href
    );

    // Always delegate to DefaultViewManager for proper formatting
    super.afterDisplayed(view);
  }

  // Override destroy to clean up pre-renderer
  destroy(): void {
    console.log('[PreRenderingViewManager] Destroying pre-rendering manager');
    if (this.myPreRenderer) {
      this.myPreRenderer.destroy();
    }
    return super.destroy();
  }

  // Override render to initialize the BookPreRenderer once the container and
  // Only override render to initialize pre-renderer
  render(element: HTMLElement, size?: { width: number; height: number }): void {
    console.log(
      '[PreRenderingViewManager] render() called - delegating to DefaultViewManager'
    );
    // Call parent render first
    super.render(element, size);

    // Initialize the pre-renderer now that the DOM container and viewSettings exist
    if (this.usePreRendering && !this.myPreRenderer && this.container) {
      console.log('[PreRenderingViewManager] Initializing BookPreRenderer');

      const preRenderViewSettings: ViewSettings = {
        width: (this.viewSettings.width as number) || 0,
        height: (this.viewSettings.height as number) || 0,
        ...this.viewSettings,
      };

      this.myPreRenderer = new BookPreRenderer(
        this.container,
        preRenderViewSettings,
        this.request as (url: string) => Promise<Document>
      );

      console.log('[PreRenderingViewManager] BookPreRenderer initialized');
    }
  }
}

export default PreRenderingViewManager;
export {
  BookPreRenderer,
  PreRenderedChapter,
  PreRenderingStatus,
  ViewSettings,
} from '../prerenderer';
