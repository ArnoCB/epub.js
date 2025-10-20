import type { View } from '../../types';
export declare class Views {
    container: HTMLElement;
    _views: View[];
    length: number;
    hidden: boolean;
    constructor(container: HTMLElement);
    all(): View[];
    first(): View | undefined;
    last(): View | undefined;
    indexOf(view: View): number;
    slice(...args: number[]): View[];
    get(i: number): View | undefined;
    append(view: View): View;
    prepend(view: View): View;
    insert(view: View, index: number): View;
    remove(view: View): void;
    destroy(view: View): void;
    forEach(callback: (view: View) => void): void;
    clear(): void;
    find(section: {
        index: number;
    }): View | undefined;
    displayed(): View[];
    show(): void;
    hide(): void;
}
export default Views;
