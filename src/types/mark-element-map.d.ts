import type { Mark } from './mark';

export type MarkElementMap = {
  [key: string]: {
    mark: Mark;
    element: HTMLElement;
    listeners: Array<(e: Event) => void>;
  };
};
