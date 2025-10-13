import { buildLocationPoint, enrichLocationSide } from './location-helpers';
describe('enrichLocationSide', () => {
  const basePoint = {
    index: 0,
    href: 'chapter.xhtml',
    cfi: 'dummy-cfi',
    displayed: { page: 1, total: 10 },
    totalPages: 10,
    mapping: { start: 'cfi-start', end: 'cfi-end' },
  };

  it('should set location and percentage if locationFromCfi returns a value', () => {
    const located = buildLocationPoint(basePoint, 'start');
    const book = {
      locations: {
        locationFromCfi: jest.fn(() => 42),
        percentageFromLocation: jest.fn(() => 0.75),
      },
    };
    enrichLocationSide('start', basePoint, located, book);
    expect(located.location).toBe(42);
    expect(located.percentage).toBe(0.75);
  });

  it('should not set location/percentage if locationFromCfi returns null', () => {
    const located = buildLocationPoint(basePoint, 'start');
    const book = {
      locations: {
        locationFromCfi: jest.fn(() => null),
        percentageFromLocation: jest.fn(() => 0.75),
      },
    };
    enrichLocationSide('start', basePoint, located, book);
    expect(located.location).toBeUndefined();
    expect(located.percentage).toBeUndefined();
  });

  it('should set page if pageFromCfi returns a value', () => {
    const located = buildLocationPoint(basePoint, 'end');
    const book = {
      pageList: {
        pageFromCfi: jest.fn(() => 7),
      },
    };
    enrichLocationSide('end', basePoint, located, book);
    expect(located.page).toBe(7);
  });

  it('should not set page if pageFromCfi returns -1', () => {
    const located = buildLocationPoint(basePoint, 'end');
    const book = {
      pageList: {
        pageFromCfi: jest.fn(() => -1),
      },
    };
    enrichLocationSide('end', basePoint, located, book);
    expect(located.page).toBeUndefined();
  });
});

describe('buildLocationPoint', () => {
  it('should build start location with first page', () => {
    const point = {
      index: 0,
      href: 'chapter1.xhtml',
      cfi: 'epubcfi(/6/2)',
      displayed: { page: 1, total: 10 },
      pages: [1, 2, 3],
      totalPages: 10,
      mapping: { start: 'epubcfi(/6/2)', end: 'epubcfi(/6/4)' },
    };
    const result = buildLocationPoint(point, 'start');
    expect(result.index).toBe(0);
    expect(result.href).toBe('chapter1.xhtml');
    expect(result.cfi).toBe('epubcfi(/6/2)');
    expect(result.displayed.page).toBe(1);
    expect(result.displayed.total).toBe(10);
  });

  it('should build end location with last page', () => {
    const point = {
      index: 2,
      href: 'chapter3.xhtml',
      cfi: 'epubcfi(/6/6)',
      displayed: { page: 3, total: 10 },
      pages: [7, 8, 9],
      totalPages: 10,
      mapping: { start: 'epubcfi(/6/6)', end: 'epubcfi(/6/8)' },
    };
    const result = buildLocationPoint(point, 'end');
    expect(result.index).toBe(2);
    expect(result.href).toBe('chapter3.xhtml');
    expect(result.cfi).toBe('epubcfi(/6/8)');
    expect(result.displayed.page).toBe(9);
    expect(result.displayed.total).toBe(10);
  });

  it('should default to page 1 if pages missing', () => {
    const point = {
      index: 1,
      href: 'chapter2.xhtml',
      cfi: 'epubcfi(/6/4)',
      displayed: { page: 2, total: 10 },
      totalPages: 10,
      mapping: { start: 'epubcfi(/6/4)', end: 'epubcfi(/6/6)' },
    };
    const result = buildLocationPoint(point, 'start');
    expect(result.displayed.page).toBe(1);
  });

  it('should use empty string for cfi if mapping missing', () => {
    const point = {
      index: 1,
      href: 'chapter2.xhtml',
      cfi: 'epubcfi(/6/4)',
      displayed: { page: 2, total: 10 },
      totalPages: 10,
    };
    const result = buildLocationPoint(point, 'end');
    expect(result.cfi).toBe('');
  });
});
