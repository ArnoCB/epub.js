// Extends the Navigator type to support the non-standard epubReadingSystem property.
// This is required for compatibility with ePub reading system APIs and to avoid TypeScript errors
// when setting navigator.epubReadingSystem in browser-based ePub readers or custom environments.

interface Navigator {
  epubReadingSystem?: {
    name: string;
    version: string;
    layoutStyle: string;
    hasFeature: (feature: string) => boolean;
  };
}
