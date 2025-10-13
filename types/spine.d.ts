import EpubCFI from './epubcfi';
import Hook from './utils/hook';
import Section, { SectionItem } from './section';
import type { PackagingSpineItem, PackagingManifestObject } from './packaging';
type UnpackingSpineItem = PackagingSpineItem &
  Partial<Omit<SectionItem, 'next' | 'prev'>> & {
    next?: () => Section | undefined;
    prev?: () => Section | undefined;
  };
import Packaging from './packaging';
import { ResolverFunction } from './resources';
/**
 * A collection of Spine Items
 */
declare class Spine {
  spineItems: Section[];
  spineByHref: Record<string, number>;
  spineById: Record<string, number>;
  hooks: {
    serialize: Hook;
    content: Hook;
  };
  epubcfi: EpubCFI;
  loaded: boolean;
  items: undefined | UnpackingSpineItem[];
  manifest: undefined | PackagingManifestObject;
  spineNodeIndex: undefined | number;
  baseUrl: undefined | string;
  length: undefined | number;
  constructor();
  /**
   * Unpack items from a opf into spine items
   * @param  {Packaging} _package
   * @param  {method} resolver URL resolver
   * @param  {method} canonical Resolve canonical url
   */
  unpack(
    _package: Packaging,
    resolver: ResolverFunction,
    canonical: ResolverFunction
  ): void;
  /**
   * Get an item from the spine
   * @example spine.get();
   * @example spine.get(1);
   * @example spine.get("chap1.html");
   * @example spine.get("#id1234");
   */
  get(target: string | number): Section | null;
  /**
   * Append a Section to the Spine
   */
  append(section: Section): number;
  /**
   * Prepend a Section to the Spine
   */
  prepend(section: Section): number;
  /**
   * Remove a Section from the Spine
   */
  remove(section: Section): Section[] | undefined;
  /**
   * Loop over the Sections in the Spine
   */
  each(...args: Parameters<Array<Section>['forEach']>): void;
  /**
   * Find the first Section in the Spine
   */
  first(): Section | undefined;
  /**
   * Find the last Section in the Spine
   */
  last(): Section | undefined;
  destroy(): void;
}
export default Spine;
