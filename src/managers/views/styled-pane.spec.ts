import { StyledPane } from './styled-pane';

// Spectator is not typically used for non-Angular, but we'll use Jest for DOM assertions

describe('StyledPane', () => {
  let target: HTMLElement;
  let container: HTMLElement;

  beforeEach(() => {
    target = document.createElement('div');
    container = document.createElement('div');
    // Provide a fake SVG element for the Pane base class
    // @ts-ignore
    StyledPane.prototype.element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
  });

  afterEach(() => {
    // Clean up static property
    // @ts-ignore
    delete StyledPane.prototype.element;
  });

  it('should apply custom SVG styling', () => {
    // @ts-ignore
    const pane = new StyledPane(target, container, false);
    // @ts-ignore
    const svgElement = pane.element;
    expect(svgElement).toBeInstanceOf(SVGElement);
    expect(svgElement.getAttribute('pointer-events')).toBe('none');
    expect(svgElement.style.position).toBe('absolute');
    expect(svgElement.style.top).toBe('0px');
    expect(svgElement.style.left).toBe('0px');
    expect(svgElement.style.zIndex).toBe('-3');
    // Check important styles
    expect(svgElement.style.getPropertyPriority('top')).toBe('important');
    expect(svgElement.style.getPropertyPriority('left')).toBe('important');
  });
});
