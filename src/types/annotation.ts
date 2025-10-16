import type Annotation from '../annotation';

export type MarkType = 'highlight' | 'underline' | 'mark';

export type AnnotationData = {
  type: MarkType;
  cfiRange: string;
  data: Record<string, string>;
  sectionIndex: number;
  cb: undefined | ((annotation: Annotation) => void);
  className: string | undefined;
  styles: Record<string, string> | undefined;
};
