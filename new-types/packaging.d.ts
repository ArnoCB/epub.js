import type { PackagingManifestJson } from './types/packaging';
import type { RawNavItem } from './navigation';
import { Flow } from './layout';
export interface PackagingMetadataObject {
    title: string;
    creator: string;
    description: string;
    pubdate: string;
    publisher: string;
    identifier: string;
    language: string;
    rights: string;
    modified_date: string;
    layout: string;
    orientation: string;
    flow: Flow;
    viewport: string;
    spread: string;
    direction: string;
}
export interface PackagingSpineItem {
    id?: string;
    idref: string;
    linear: string;
    properties: Array<string>;
    index: number;
}
export interface PackagingManifestItem {
    href: string;
    type: string;
    properties: Array<string>;
    overlay?: string;
}
export interface PackagingManifestObject {
    [key: string]: PackagingManifestItem;
}
/**
 * Gets the index of a node in its parent
 * @memberof Core
 */
export declare function indexOfNode(node: Node, typeId: number): number;
/**
 * Open Packaging Format Parser
 * @class
 * @param {document} packageDocument OPF XML
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
     * @param  {Element} manifestXml
     * @return {PackagingManifestObject} manifest
     */
    private parseManifest;
    /**
     * Parse Spine
     * @param  {Element} spineXml
     * @return {object} spine
     */
    private parseSpine;
    /**
     * Find Unique Identifier
     * @param  {node} packageXml
     * @return {string} Unique Identifier text
     */
    private findUniqueIdentifier;
    /**
     * Find TOC NAV
     * @param {element} manifestNode
     * @return {string}
     */
    private findNavPath;
    /**
     * Find TOC NCX
     * media-type="application/x-dtbncx+xml" href="toc.ncx"
     * @private
     * @param {element} manifestNode
     * @param {element} spineNode
     * @return {string}
     */
    private findNcxPath;
    /**
     * Find the Cover Path
     * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
     * Fallback for Epub 2.0
     * @private
     * @param  {XMLDocument} packageXml
     * @return {string} href
     */
    private findCoverPath;
    /**
     * Get text of a namespaced element
     * @param  {node} xml
     * @param  {string} tag
     * @return {string} text
     */
    private getElementText;
    /**
     * Get text by property
     * @param  {Element} xml
     * @param  {string} property
     * @return {string} text
     */
    private getPropertyText;
    /**
     * Load JSON Manifest
     * @param  {document} packageDocument OPF XML
     * @return {object} parsed package parts
     */
    load(json: PackagingManifestJson): {
        metadata: PackagingMetadataObject;
        spine: PackagingSpineItem[];
        manifest: PackagingManifestObject;
        navPath: string;
        ncxPath: string;
        coverPath: string;
        spineNodeIndex: number;
    };
    destroy(): void;
}
export default Packaging;
