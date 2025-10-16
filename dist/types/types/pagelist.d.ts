/**
 * Types for page list items in epub.js
 *
 * Used by pagelist.ts and related logic.
 *
 * @see src/pagelist.ts
 */
export interface PageListItem {
    href: string;
    page: string;
    cfi?: string;
    packageUrl?: string;
}
