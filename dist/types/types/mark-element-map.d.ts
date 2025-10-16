import type { Mark } from 'marks-pane';
export type MarkElementMap = {
    [key: string]: {
        mark: Mark;
        element: HTMLElement;
        listeners: Array<(e: Event) => void>;
    };
};
