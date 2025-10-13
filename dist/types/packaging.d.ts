import type { PackagingManifestJson, PackagingMetadataObject, PackagingSpineItem, PackagingManifestObject, PackagingParseResult, RawNavItem } from './types';
/**
 * Open Packaging Format Parser
 */
declare class Packaging {
    manifest: PackagingManifestObject;
    navPath: string;
    baseUrl?: string;
    basePath?: string;
    ncxPath: string;
    coverPath: string;
    spineNodeIndex: number;
    spine: PackagingSpineItem[];
    metadata: PackagingMetadataObject;
    toc?: RawNavItem[] | Document;
    uniqueIdentifier: string;
    pageList?: Document | null;
    constructor(packageDocument?: XMLDocument);
    /**
     * Parse OPF XML
     */
    parse(packageDocument?: XMLDocument): {
        metadata: PackagingMetadataObject;
        spine: PackagingSpineItem[];
        manifest: PackagingManifestObject;
        navPath: string;
        ncxPath: string;
        coverPath: string;
        spineNodeIndex: number;
    };
    /**
     * Parse Metadata
     * @param  {Element} xml
     * @return {PackagingMetadataObject} metadata
     */
    private parseMetadata;
    /**
     * Parse Manifest
     */
    private parseManifest;
    /**
     * Parse Spine
     */
    private parseSpine;
    /**
     * Find the unique identifier text from the package document.
     */
    private findUniqueIdentifier;
    /**
     * Find TOC NAV
     */
    private findNavPath;
    /**
     * Find TOC NCX
     * media-type="application/x-dtbncx+xml" href="toc.ncx"
     */
    private findNcxPath;
    /**
     * Find the Cover Path and return the href
     * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
     * Fallback for Epub 2.0
     */
    private findCoverPath;
    /**
     * Get text of a namespaced element
     */
    private getElementText;
    /**
     * Get text by property
     */
    private getPropertyText;
    /**
     * Load JSON Manifest
     */
    load(json: PackagingManifestJson): PackagingParseResult;
    destroy(): void;
}
export default Packaging;
