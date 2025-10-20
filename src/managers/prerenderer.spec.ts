import BookPreRenderer from './prerenderer';
import { Section } from '../section';
import { ViewRenderer } from './helpers/view-renderer';
import { PageMapGenerator } from './helpers/page-map-generator';
import Layout from '../layout';

// Mock the helper classes
jest.mock('./helpers/view-renderer');
jest.mock('./helpers/page-map-generator');
jest.mock('./helpers/cfi-resolver');

describe('BookPreRenderer', () => {
  let container: HTMLElement;
  let mockRequest: jest.MockedFunction<(url: string) => Promise<Document>>;
  let prerenderer: BookPreRenderer;
  let mockPageMapGenerator: jest.Mocked<PageMapGenerator>;
  let mockViewRenderer: jest.Mocked<ViewRenderer>;

  beforeEach(() => {
    // Create DOM container
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock request function
    mockRequest = jest.fn().mockResolvedValue(document);

    // Create mocks
    mockPageMapGenerator = {
      generatePageMap: jest.fn(),
    } as any;

    mockViewRenderer = {
      createView: jest.fn(),
    } as any;

    // Mock the constructors
    (
      PageMapGenerator as jest.MockedClass<typeof PageMapGenerator>
    ).mockImplementation(() => mockPageMapGenerator);
    (ViewRenderer as jest.MockedClass<typeof ViewRenderer>).mockImplementation(
      () => mockViewRenderer
    );

    // Create prerenderer instance
    const viewSettings = {
      width: 800,
      height: 600,
      flow: 'paginated' as const,
      layout: 'reflowable' as any,
    };

    prerenderer = new BookPreRenderer(container, viewSettings, mockRequest);

    // Add event emitter methods to the prerenderer
    prerenderer.emit = jest.fn().mockReturnValue(true);
    prerenderer.on = jest.fn().mockReturnThis();
    prerenderer.off = jest.fn().mockReturnThis();
    // Note: BookPreRenderer might not have the once method, but we're adding it for consistency
    (prerenderer as any).once = jest.fn().mockReturnThis();
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  describe('CFI Generation', () => {
    it('should generate CFIs during chapter analysis', async () => {
      // Create a mock section
      const section = {
        href: 'chapter1.xhtml',
        idref: 'ch1',
      } as Section;

      // Mock the view and its contents
      const mockView = {
        element: document.createElement('div'),
        contents: {
          document: document.implementation.createHTMLDocument('test'),
          scrollWidth: () => 800,
          scrollHeight: () => 1200,
          textWidth: () => 800,
        },
        display: jest.fn().mockResolvedValue({}),
        size: jest.fn(),
        onDisplayed: jest.fn(),
        onResize: jest.fn(),
      };

      // Add some content to the mock document
      const body = mockView.contents.document.body;
      body.innerHTML = '<p>This is test content for CFI generation.</p>';

      mockViewRenderer.createView.mockReturnValue(mockView as any);

      // Mock chapter analysis result with CFIs
      const pageMapResult = {
        pageCount: 2,
        hasWhitePages: false,
        whitePageIndices: [],
        pageMap: [
          {
            index: 1,
            startCfi: '/6/4[chapter1]!/2/2[p1]/1:0',
            endCfi: '/6/4[chapter1]!/2/2[p1]/1:20',
            xOffset: 0,
          },
          {
            index: 2,
            startCfi: '/6/4[chapter1]!/2/2[p1]/1:21',
            endCfi: '/6/4[chapter1]!/2/2[p1]/1:42',
            xOffset: 800,
          },
        ],
      };

      mockPageMapGenerator.generatePageMap.mockResolvedValue(pageMapResult);

      // Test prerendering
      const result = await prerenderer.preRenderBook([section]);

      // Verify page map generation was called
      expect(mockPageMapGenerator.generatePageMap).toHaveBeenCalledWith(
        expect.anything(), // view
        section,
        800, // width
        600 // height
      );

      // Verify result
      expect(result.rendered).toBe(1);
      expect(result.failed).toBe(0);

      // Get the rendered chapter
      const chapter = prerenderer.getChapter('chapter1.xhtml');
      expect(chapter).toBeDefined();
      expect(chapter!.pageCount).toBe(2);
      expect(chapter!.pageMap).toHaveLength(2);

      // Verify CFIs are present
      expect(chapter!.pageMap![0].startCfi).toBe('/6/4[chapter1]!/2/2[p1]/1:0');
      expect(chapter!.pageMap![0].endCfi).toBe('/6/4[chapter1]!/2/2[p1]/1:20');
      expect(chapter!.pageMap![1].startCfi).toBe(
        '/6/4[chapter1]!/2/2[p1]/1:21'
      );
      expect(chapter!.pageMap![1].endCfi).toBe('/6/4[chapter1]!/2/2[p1]/1:42');

      // Verify CFIs are distinct and valid
      chapter!.pageMap!.forEach((entry) => {
        expect(entry.startCfi).not.toEqual(entry.endCfi);
        if (entry.startCfi) {
          expect(entry.endCfi).not.toBeNull();
        }
      });
    });

    it('should handle missing CFIs gracefully', async () => {
      const section = {
        href: 'chapter2.xhtml',
        idref: 'ch2',
      } as Section;

      const mockView = {
        element: document.createElement('div'),
        contents: {
          document: document.implementation.createHTMLDocument('test'),
          scrollWidth: () => 800,
          scrollHeight: () => 600,
          textWidth: () => 800,
        },
        display: jest.fn().mockResolvedValue({}),
        size: jest.fn(),
        onDisplayed: jest.fn(),
        onResize: jest.fn(),
      };

      mockViewRenderer.createView.mockReturnValue(mockView as any);

      // Mock analysis result with null CFIs (the current problem)
      const pageMapResult = {
        pageCount: 1,
        hasWhitePages: false,
        whitePageIndices: [],
        pageMap: [
          {
            index: 1,
            startCfi: null,
            endCfi: null,
            xOffset: 0,
          },
        ],
      };

      mockPageMapGenerator.generatePageMap.mockResolvedValue(pageMapResult);

      const result = await prerenderer.preRenderBook([section]);

      expect(result.rendered).toBe(1);

      const chapter = prerenderer.getChapter('chapter2.xhtml');
      expect(chapter).toBeDefined();
      expect(chapter!.pageMap![0].startCfi).toBeNull();
      expect(chapter!.pageMap![0].endCfi).toBeNull();
    });

    it('should wait for layout to settle before analysis', async () => {
      const section = {
        href: 'chapter3.xhtml',
        idref: 'ch3',
      } as Section;

      const mockView = {
        element: document.createElement('div'),
        contents: {
          document: document.implementation.createHTMLDocument('test'),
          scrollWidth: () => 800,
          scrollHeight: () => 600,
          textWidth: () => 800,
        },
        display: jest.fn().mockResolvedValue({}),
        size: jest.fn(),
        onDisplayed: jest.fn(),
        onResize: jest.fn(),
      };

      mockViewRenderer.createView.mockReturnValue(mockView as any);

      const pageMapResult = {
        pageCount: 1,
        hasWhitePages: false,
        whitePageIndices: [],
        pageMap: [],
      };

      mockPageMapGenerator.generatePageMap.mockResolvedValue(pageMapResult);

      await prerenderer.preRenderBook([section]);

      // Verify that generatePageMap was called (indicating layout wait completed)
      expect(mockPageMapGenerator.generatePageMap).toHaveBeenCalled();
    });
  });
});
