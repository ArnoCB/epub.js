/**
 * Types for EPUB CFI parsing and manipulation in epub.js
 *
 * Used by epubcfi.ts and related logic.
 *
 * @see src/epubcfi.ts
 */
export interface CustomRange {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
}
export interface CFIStep {
    type: 'element' | 'text';
    index: number;
    id?: string | null;
    tagName?: string | null;
}
export interface CFITerminal {
    offset: number | null;
    assertion: string | null;
}
export interface CFIComponent {
    steps: CFIStep[];
    terminal: CFITerminal;
}
export interface CFIRange {
    path: CFIComponent;
    start: CFIComponent;
    end: CFIComponent;
}
