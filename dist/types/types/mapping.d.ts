/**
 * Types for mapping view parameters in epub.js
 *
 * Used by mapping.ts and related logic.
 *
 * @see src/mapping.ts
 */
import type Contents from '../contents';
export interface ViewParameter {
    contents: Contents;
    section: {
        cfiBase: string;
    };
    document: Document;
}
