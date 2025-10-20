import type {
  ManifestNavItem,
  PackagingManifestJson,
  PackagingMetadataObject,
  PackagingSpineItem,
  PackagingManifestObject,
  ExtendedManifestItem,
  ExtendedNavItem,
  PackagingParseResult,
  RawNavItem,
} from './types';
import { indexOfElementNode } from './utils/helpers';
import { getValidOrDefault } from './utils/core';
import {
  LayoutType,
  DEFAULT_LAYOUT_TYPE,
  Orientation,
  DEFAULT_ORIENTATION,
  Spread,
  DEFAULT_SPREAD,
  Flow,
  DEFAULT_FLOW,
  DEFAULT_DIRECTION,
} from './enums/epub-enums';
// Add similar imports for ORIENTATIONS and SPREADS if you have them

/**
 * Open Packaging Format Parser
 */
class Packaging {
  manifest: PackagingManifestObject = {};
  navPath: string = '';
  baseUrl?: string;
  basePath?: string;
  ncxPath: string = '';
  coverPath: string = '';
  spineNodeIndex: number = 0;
  spine: PackagingSpineItem[] = [];
  metadata: PackagingMetadataObject = {} as PackagingMetadataObject;
  toc?: RawNavItem[] | Document;
  uniqueIdentifier: string = '';
  pageList?: Document | null;

  constructor(packageDocument?: XMLDocument) {
    if (packageDocument) {
      this.parse(packageDocument);
    }
  }

  /**
   * Parse OPF XML
   */
  parse(packageDocument?: XMLDocument) {
    if (!packageDocument) {
      throw new Error('Package File Not Found');
    }

    const metadataNode = packageDocument.querySelector('metadata');

    if (!metadataNode) {
      throw new Error('No Metadata Found');
    }

    const manifestNode = packageDocument.querySelector('manifest');
    if (!manifestNode) {
      throw new Error('No Manifest Found');
    }

    const spineNode = packageDocument.querySelector('spine');
    if (!spineNode) {
      throw new Error('No Spine Found');
    }

    this.manifest = this.parseManifest(manifestNode);
    this.navPath = this.findNavPath(manifestNode);
    this.ncxPath = this.findNcxPath(manifestNode, spineNode);
    this.coverPath = this.findCoverPath(packageDocument);
    this.spineNodeIndex = indexOfElementNode(spineNode);
    this.spine = this.parseSpine(spineNode);
    this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
    this.metadata = this.parseMetadata(metadataNode);

    const dir = spineNode.getAttribute('page-progression-direction');
    this.metadata.direction = dir === 'ltr' || dir === 'rtl' ? dir : 'ltr';

    return {
      metadata: this.metadata,
      spine: this.spine,
      manifest: this.manifest,
      navPath: this.navPath,
      ncxPath: this.ncxPath,
      coverPath: this.coverPath,
      spineNodeIndex: this.spineNodeIndex,
    };
  }

  /**
   * Parse Metadata
   */
  private parseMetadata(xml: Element): PackagingMetadataObject {
    return {
      title: this.getElementText(xml, 'title'),
      creator: this.getElementText(xml, 'creator'),
      description: this.getElementText(xml, 'description'),
      pubdate: this.getElementText(xml, 'date'),
      publisher: this.getElementText(xml, 'publisher'),
      identifier: this.getElementText(xml, 'identifier'),
      language: this.getElementText(xml, 'language'),
      rights: this.getElementText(xml, 'rights'),
      modified_date: this.getPropertyText(xml, 'dcterms:modified'),
      layout: getValidOrDefault(
        this.getPropertyText(xml, 'rendition:layout'),
        LayoutType,
        DEFAULT_LAYOUT_TYPE
      ) as LayoutType,
      orientation: getValidOrDefault(
        this.getPropertyText(xml, 'rendition:orientation'),
        Orientation,
        DEFAULT_ORIENTATION
      ) as Orientation,
      flow: getValidOrDefault(
        this.getPropertyText(xml, 'rendition:flow'),
        Flow,
        DEFAULT_FLOW
      ) as Flow,
      viewport: this.getPropertyText(xml, 'rendition:viewport'),
      spread: getValidOrDefault(
        this.getPropertyText(xml, 'rendition:spread'),
        Spread,
        DEFAULT_SPREAD
      ) as Spread,
      direction: DEFAULT_DIRECTION, // Will be set later from spine element, set default here
    };
  }

  /**
   * Parse Manifest
   */
  private parseManifest(manifestXml: Element): PackagingManifestObject {
    const manifest: PackagingManifestObject = {};

    //-- Turn items into an array
    const selected = manifestXml.querySelectorAll('item');
    const items = Array.prototype.slice.call(selected);

    //-- Create an object with the id as key
    items.forEach(function (item) {
      const id = item.getAttribute('id'),
        href = item.getAttribute('href') || '',
        type = item.getAttribute('media-type') || '',
        overlay = item.getAttribute('media-overlay') || '',
        properties = item.getAttribute('properties') || '';

      manifest[id] = {
        href: href,
        // "url" : href,
        type: type,
        overlay: overlay,
        properties: properties.length ? properties.split(' ') : [],
      };
    });

    return manifest;
  }

  /**
   * Parse Spine
   */
  private parseSpine(spineXml: Element): PackagingSpineItem[] {
    const spine: PackagingSpineItem[] = [];

    const selected = spineXml.querySelectorAll('itemref');
    const items = Array.prototype.slice.call(selected);

    // var epubcfi = new EpubCFI();

    //-- Add to array to maintain ordering and cross reference with manifest
    items.forEach(function (item, index) {
      const idref = item.getAttribute('idref');
      // var cfiBase = epubcfi.generateChapterComponent(spineNodeIndex, index, Id);
      const props = item.getAttribute('properties') || '';
      const propArray = props.length ? props.split(' ') : [];
      // var manifestProps = manifest[Id].properties;
      // var manifestPropArray = manifestProps.length ? manifestProps.split(" ") : [];

      const itemref = {
        id: item.getAttribute('id'),
        idref: idref,
        linear: item.getAttribute('linear') || 'yes',
        properties: propArray,
        // "href" : manifest[Id].href,
        // "url" :  manifest[Id].url,
        index: index,
        // "cfiBase" : cfiBase
      };
      spine.push(itemref);
    });

    return spine;
  }

  /**
   * Find the unique identifier text from the package document.
   */
  private findUniqueIdentifier(packageXml: XMLDocument): string {
    const id = packageXml.documentElement.getAttribute('unique-identifier');
    if (!id) return '';

    const el = packageXml.getElementById(id);
    if (
      !el ||
      el.localName !== 'identifier' ||
      el.namespaceURI !== 'http://purl.org/dc/elements/1.1/'
    ) {
      return '';
    }

    return el.textContent?.trim() || '';
  }

  /**
   * Find TOC NAV
   */
  private findNavPath(manifestNode: Node): string {
    // Find item with property "nav"
    // Should catch nav regardless of order
    const node = (manifestNode as Element).querySelector(
      "item[properties~='nav']"
    );
    return node ? node.getAttribute('href') || '' : '';
  }

  /**
   * Find TOC NCX
   * media-type="application/x-dtbncx+xml" href="toc.ncx"
   */
  private findNcxPath(manifestNode: Node, spineNode: Node): string {
    // var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
    let node = (manifestNode as Element).querySelector(
      "item[media-type='application/x-dtbncx+xml']"
    );

    let tocId;

    // If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
    // according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
    // "The item that describes the NCX must be referenced by the spine toc attribute."
    if (!node) {
      tocId = (spineNode as Element).getAttribute('toc');
      if (tocId) {
        // node = manifestNode.querySelector("item[id='" + tocId + "']");
        node = (manifestNode as Element).querySelector(`#${tocId}`);
      }
    }

    return node ? node.getAttribute('href') || '' : '';
  }

  /**
   * Find the Cover Path and return the href
   * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
   * Fallback for Epub 2.0
   */
  private findCoverPath(packageXml: XMLDocument): string {
    const pkg = packageXml.querySelector('package');
    pkg?.getAttribute('version');

    // Try parsing cover with epub 3.
    const node = packageXml.querySelector("item[properties~='cover-image']");
    if (node) return node.getAttribute('href') || '';

    // Fallback to epub 2.
    const metaCover = packageXml.querySelector("meta[name='cover']");

    if (metaCover) {
      const coverId = metaCover.getAttribute('content');
      if (coverId) {
        const cover = packageXml.getElementById(coverId);
        return cover ? cover.getAttribute('href') || '' : '';
      }
    }

    return '';
  }

  /**
   * Get text of a namespaced element
   */
  private getElementText(xml: Element, tag: string): string {
    const found = xml.getElementsByTagNameNS(
      'http://purl.org/dc/elements/1.1/',
      tag
    );
    if (!found || found.length === 0) return '';

    const el = found[0];

    if (el && el.childNodes.length && el.childNodes[0]?.nodeValue) {
      return el.childNodes[0].nodeValue;
    }

    return '';
  }

  /**
   * Get text by property
   */
  private getPropertyText(xml: Element, property: string): string {
    const el = xml.querySelector(`meta[property='${property}']`);

    if (el && el.childNodes.length > 0) {
      return el.childNodes[0]?.nodeValue || '';
    }

    return '';
  }

  /**
   * Load JSON Manifest
   */
  load(json: PackagingManifestJson): PackagingParseResult {
    this.metadata = json.metadata;

    const spine = json.readingOrder || json.spine;
    this.spine = spine
      ? spine.map((item: PackagingSpineItem, index: number) => ({
          idref: item.idref,
          linear: item.linear || 'yes',
          properties: item.properties || [],
          index,
        }))
      : [];

    json.resources.forEach((item: ExtendedManifestItem, index: number) => {
      this.manifest[index] = item;

      if (item.rel && item.rel[0] === 'cover') {
        this.coverPath = item.href;
      }
    });

    this.spineNodeIndex = 0;

    this.toc = json.toc
      ? json.toc.map((item: ManifestNavItem) => {
          const navItem: ExtendedNavItem = {
            id: item.id || '',
            href: item.href,
            label: item.label || item.title || '',
            title: item.title ?? '',
            subitems: [],
          };
          return navItem;
        })
      : [];

    return {
      metadata: this.metadata,
      spine: this.spine,
      manifest: this.manifest,
      navPath: this.navPath,
      ncxPath: this.ncxPath,
      coverPath: this.coverPath,
      spineNodeIndex: this.spineNodeIndex,
    };
  }

  destroy() {
    // @ts-expect-error intentionally setting to undefined for garbage collection
    this.manifest = undefined;
    // @ts-expect-error intentionally setting to undefined for garbage collection
    this.spine = undefined;
    // @ts-expect-error intentionally setting to undefined for garbage collection
    this.metadata = undefined;
    // @ts-expect-error intentionally setting to undefined for garbage collection
    this.toc = undefined;
  }
}

export default Packaging;
