import { Pane as OriginalPane } from 'marks-pane';

// Subclass Pane to inject custom SVG styling
export class StyledPane extends OriginalPane {
  constructor(
    target: HTMLElement,
    container: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _transparency: boolean
  ) {
    super(target, container);

    // @ts-expect-error We should add a public method to get the method in Pane
    const svgElement = this.element;
    if (svgElement) {
      // Apply the exact same styling as the working SVG
      svgElement.setAttribute('pointer-events', 'none');
      svgElement.style.position = 'absolute';
      svgElement.style.top = '0px';
      svgElement.style.left = '0px';
      svgElement.style.zIndex = '-3';

      // Apply important styles to match exactly
      svgElement.style.setProperty('top', '0px', 'important');
      svgElement.style.setProperty('left', '0px', 'important');
    }
  }
}
