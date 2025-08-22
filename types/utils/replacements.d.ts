export interface Section {
    url?: string;
    canonical?: string;
    idref?: string;
}
export declare function replaceBase(doc: Document, section: Section): void;
export declare function replaceCanonical(doc: Document, section: Section): void;
export declare function replaceMeta(doc: Document, section: Section): void;
export declare function replaceLinks(contents: Element, fn: (href: string) => void): void;
export declare function substitute(content: string, urls: string[], replacements: string[]): string;
