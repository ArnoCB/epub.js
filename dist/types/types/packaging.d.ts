import type { RawNavItem, NavItem } from './navigation';
import type { LayoutType, Orientation, Flow, Spread, Direction } from '../enums';
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
    layout: LayoutType;
    orientation: Orientation;
    flow: Flow;
    viewport: string;
    spread: Spread;
    direction: Direction;
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
export type ExtendedManifestItem = PackagingManifestItem & {
    rel?: string[];
    [key: string]: unknown;
};
export type ManifestNavItem = {
    id?: string;
    title?: string;
    href: string;
    label?: string;
};
export type PackagingManifestJson = {
    metadata: PackagingMetadataObject;
    readingOrder?: PackagingSpineItem[];
    spine?: PackagingSpineItem[];
    resources: ExtendedManifestItem[];
    toc?: ManifestNavItem[];
};
export interface Packaging {
    manifest: PackagingManifestObject;
    navPath: string;
    ncxPath: string;
    coverPath: string;
    spineNodeIndex: number;
    spine: PackagingSpineItem[];
    metadata: PackagingMetadataObject;
    toc?: RawNavItem[] | Document;
    uniqueIdentifier: string;
    pageList?: Document | null;
    baseUrl?: string;
    basePath?: string;
}
export type ExtendedNavItem = NavItem & {
    title: string;
    [key: string]: unknown;
};
export type PackagingParseResult = {
    metadata: PackagingMetadataObject;
    spine: PackagingSpineItem[];
    manifest: PackagingManifestObject;
    navPath: string;
    ncxPath: string;
    coverPath: string;
    spineNodeIndex: number;
};
