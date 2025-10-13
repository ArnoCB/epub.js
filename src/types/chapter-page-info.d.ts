import type { PreRenderedChapter } from './pre-rendered-chapter';

export interface ChapterPageInfo {
  pageCount: number;
  pageMap?: NonNullable<PreRenderedChapter['pageMap']>;
  hasWhitePages: boolean;
  whitePageIndices: number[];
}

export interface ChapterDimensions {
  width: number;
  height: number;
}
