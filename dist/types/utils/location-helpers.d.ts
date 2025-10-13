export declare function buildEnrichedLocationPoint(point: LocationPoint, side: 'start' | 'end', book: {
    locations?: {
        locationFromCfi: (cfi: string) => number | null;
        percentageFromLocation: (loc: number) => number;
    };
    pageList?: {
        pageFromCfi: (cfi: string) => number;
    };
    spine?: {
        first: () => {
            index: number;
        } | undefined;
        last: () => {
            index: number;
        } | undefined;
    };
}): DisplayedLocation['start'];
import type { LocationPoint, DisplayedLocation } from '../types/rendition';
/**
 * Enriches a DisplayedLocation side (start or end) with location, percentage, and page info.
 */
export declare function enrichLocationSide(side: 'start' | 'end', point: LocationPoint, locatedSide: DisplayedLocation['start'], book: {
    locations?: {
        locationFromCfi: (cfi: string) => number | null;
        percentageFromLocation: (loc: number) => number;
    };
    pageList?: {
        pageFromCfi: (cfi: string) => number;
    };
    spine?: {
        first: () => {
            index: number;
        } | undefined;
        last: () => {
            index: number;
        } | undefined;
    };
}): void;
/**
 * Builds a DisplayedLocation sub-object (start or end) from a LocationPoint and side ('start' | 'end').
 */
export declare function buildLocationPoint(point: LocationPoint, side: 'start' | 'end'): DisplayedLocation['start'];
