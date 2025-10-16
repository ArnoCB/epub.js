/**
 * Types for navigation items in epub.js
 *
 * Used by navigation.ts and related logic.
 *
 * @see src/navigation.ts
 */
export interface NavItem {
    id: string;
    href: string;
    label: string;
    subitems: NavItem[];
    parent?: string;
}
export interface LandmarkItem {
    href: string;
    label: string;
    type?: string;
}
export interface RawNavItem {
    title: string;
    children?: RawNavItem[];
    id?: string;
    href?: string;
    parent?: string;
    [key: string]: unknown;
}
