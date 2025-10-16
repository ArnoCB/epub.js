/**
 * Types for theme objects in epub.js
 *
 * Used by themes.ts and related logic.
 *
 * @see src/themes.ts
 */
import type { StylesheetRules } from './css';
export type Theme = {
    rules?: StylesheetRules;
    url?: string;
    serialized?: string;
    injected?: boolean;
};
