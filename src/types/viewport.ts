// Shared type for viewport meta tag settings in ePub.js
// This type is used for parsing and setting <meta name="viewport"> attributes
// All properties are optional and should be strings

export type Viewport = {
  width?: string;
  height?: string;
  scale?: string;
  minimum?: string;
  maximum?: string;
  scalable?: string;
};
