/**
 * Type for spine items during unpacking in epub.js
 *
 * This type extends PackagingSpineItem and SectionItem (minus next/prev),
 * and adds optional next/prev methods for navigation.
 *
 * Used by spine.ts and related logic.
 *
 * @see src/spine.ts
 */
import type { PackagingSpineItem } from './packaging';
import type { SectionItem } from './section';
import type { Section } from '../section';
export type UnpackingSpineItem = PackagingSpineItem & Partial<Omit<SectionItem, 'next' | 'prev'>> & {
    next?: () => Section | undefined;
    prev?: () => Section | undefined;
};
