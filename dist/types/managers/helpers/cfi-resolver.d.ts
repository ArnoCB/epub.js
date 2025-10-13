import Section from '../../section';
export declare class CfiResolver {
    resolveForElement(doc: Document, section: Section, el: Element | null): Promise<{
        cfi?: string;
    }>;
    private safeCfiPoint;
    private descendantTextNodeTarget;
    private elementTarget;
    private elementRangeTarget;
    private previousTextNodeTarget;
    private createApproximateCfi;
    private findFirstTextNode;
    private findPreviousTextNode;
}
