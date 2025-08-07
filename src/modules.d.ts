// Module declarations for JavaScript files without TypeScript declarations

declare module './book.js' {
  import type BookType from '../types/book';
  const Book: typeof BookType;
  export default Book;
}

declare module './rendition.js' {
  import type RenditionType from '../types/rendition';
  const Rendition: typeof RenditionType;
  export default Rendition;
}

declare module './contents.js' {
  import type ContentsType from '../types/contents';
  const Contents: typeof ContentsType;
  export default Contents;
}
