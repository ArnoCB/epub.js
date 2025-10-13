export function buildEnrichedLocationPoint(
  point: LocationPoint,
  side: 'start' | 'end',
  book: {
    locations?: {
      locationFromCfi: (cfi: string) => number | null;
      percentageFromLocation: (loc: number) => number;
    };
    pageList?: {
      pageFromCfi: (cfi: string) => number;
    };
    spine?: {
      first: () => { index: number } | undefined;
      last: () => { index: number } | undefined;
    };
  }
): DisplayedLocation['start'] {
  const base = buildLocationPoint(point, side);
  enrichLocationSide(side, point, base, book);
  return base;
}
import type { LocationPoint, DisplayedLocation } from '../types/rendition';

/**
 * Enriches a DisplayedLocation side (start or end) with location, percentage, and page info.
 */
export function enrichLocationSide(
  side: 'start' | 'end',
  point: LocationPoint,
  locatedSide: DisplayedLocation['start'],
  book: {
    locations?: {
      locationFromCfi: (cfi: string) => number | null;
      percentageFromLocation: (loc: number) => number;
    };
    pageList?: {
      pageFromCfi: (cfi: string) => number;
    };
    spine?: {
      first: () => { index: number } | undefined;
      last: () => { index: number } | undefined;
    };
  }
) {
  // Location and percentage
  const cfi = point.mapping?.[side];
  if (cfi && book.locations) {
    const location = book.locations.locationFromCfi(cfi);
    if (location !== null) {
      locatedSide.location = location;
      locatedSide.percentage = book.locations.percentageFromLocation(location);
    }
  }

  // Page
  if (cfi && book.pageList) {
    const page = book.pageList.pageFromCfi(cfi);
    if (page !== -1) {
      locatedSide.page = page;
    }
  }
}

/**
 * Builds a DisplayedLocation sub-object (start or end) from a LocationPoint and side ('start' | 'end').
 */
export function buildLocationPoint(
  point: LocationPoint,
  side: 'start' | 'end'
): DisplayedLocation['start'] {
  return {
    index: point.index,
    href: point.href,
    cfi: point.mapping?.[side] ?? '',
    displayed: {
      page:
        side === 'start'
          ? (point.pages?.[0] ?? 1)
          : (point.pages?.[point.pages?.length - 1] ?? 1),
      total: point.totalPages ?? 0,
    },
  };
}
