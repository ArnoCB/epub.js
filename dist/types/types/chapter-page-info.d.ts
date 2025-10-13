import type { PreRenderedChapter } from '../../types/managers/helpers/chapter-manager';

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
