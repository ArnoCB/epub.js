import type Annotation from '../annotation';
import type { MarkDataObject } from './mark-data-object';
export type MarkType = 'highlight' | 'underline' | 'mark';
export type AnnotationData = {
    type: MarkType;
    cfiRange: string;
    data: MarkDataObject;
    sectionIndex: number;
    cb: undefined | ((annotation: Annotation) => void);
    className: string | undefined;
    styles: Record<string, string> | undefined;
};
