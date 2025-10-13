import { Axis } from 'src/layout';
interface Padding {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}
type StageOptions = {
  width?: string;
  height?: string;
  direction?: string;
  [key: string]: unknown;
};
declare class Stage {
  settings: StageOptions;
  id: string;
  container: HTMLElement;
  wrapper: HTMLElement | undefined;
  element: HTMLElement | undefined;
  resizeFunc?: () => void;
  orientationChangeFunc?: () => void;
  sheet: CSSStyleSheet | undefined;
  containerStyles: CSSStyleDeclaration | undefined;
  containerPadding: Padding | undefined;
  constructor(_options: StageOptions);
  create(options: {
    width?: string;
    height?: string;
    direction?: string;
    [key: string]: unknown;
  }): HTMLDivElement;
  wrap(container: HTMLElement): HTMLDivElement;
  getElement(_element: HTMLElement | string): HTMLElement;
  attachTo(what: HTMLElement | string): HTMLElement | undefined;
  getContainer(): HTMLElement;
  onResize(func: () => void): void;
  onOrientationChange(func: () => void): void;
  size(
    width?: string,
    height?: string
  ): {
    width: number;
    height: number;
  };
  bounds():
    | DOMRect
    | {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
      };
  getSheet(): CSSStyleSheet | null;
  addStyleRules(
    selector: string,
    rulesArray: {
      [key: string]: string;
    }[]
  ): void;
  axis(axis: Axis): void;
  direction(dir: string): void;
  overflow(overflow: string): void;
  destroy(): void;
}
export default Stage;
