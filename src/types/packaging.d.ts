import type { RawNavItem } from '../navigation';

import type {
  PackagingMetadataObject,
  PackagingSpineItem,
  PackagingManifestItem,
} from './packaging';

export type PackagingManifestObject = {
  [key: string]: unknown;
};

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
