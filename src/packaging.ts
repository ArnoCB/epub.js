import type { ManifestNavItem, PackagingManifestJson } from './types/packaging';
import type { RawNavItem } from './navigation';
import type { NavItem } from './navigation';
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

const ELEMENT_NODE = 1;

// Extended types for JSON loading with additional properties
type ExtendedManifestItem = PackagingManifestItem & {
  rel?: string[];
  [key: string]: unknown;
};

type ExtendedNavItem = NavItem & {
  title: string;
  [key: string]: unknown;
};

/**
 * Gets the index of a node in its parent
 * @memberof Core
 */
export function indexOfNode(node: Node, typeId: number): number {
  const parent = node.parentNode;

  if (!parent) {
    return -1;
  }

  const children = parent.childNodes;
  let sib: Node;
  let index = -1;
  for (let i = 0; i < children.length; i++) {
    sib = children[i];
    if (sib.nodeType === typeId) {
      index++;
    }
    if (sib == node) break;
  }

  return index;
}

function indexOfElementNode(elementNode: Node) {
  return indexOfNode(elementNode, ELEMENT_NODE);
}

/**
 * Open Packaging Format Parser
 * @class
 * @param {document} packageDocument OPF XML
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

    this.metadata.direction =
      spineNode.getAttribute('page-progression-direction') || 'ltr';

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
   * @param  {Element} xml
   * @return {PackagingMetadataObject} metadata
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
      layout: this.getPropertyText(xml, 'rendition:layout'),
      orientation: this.getPropertyText(xml, 'rendition:orientation'),
      flow: this.getPropertyText(xml, 'rendition:flow') as Flow,
      viewport: this.getPropertyText(xml, 'rendition:viewport'),
      spread: this.getPropertyText(xml, 'rendition:spread'),
      direction: '', // Will be set later from spine element
    };
  }

  /**
   * Parse Manifest
   * @param  {Element} manifestXml
   * @return {PackagingManifestObject} manifest
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
   * @param  {Element} spineXml
   * @return {object} spine
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
   * Find Unique Identifier
   * @param  {node} packageXml
   * @return {string} Unique Identifier text
   */
  private findUniqueIdentifier(packageXml: XMLDocument): string {
    const uniqueIdentifierId =
      packageXml.documentElement.getAttribute('unique-identifier');
    if (!uniqueIdentifierId) {
      return '';
    }

    const identifier = packageXml.getElementById(uniqueIdentifierId);
    if (!identifier) {
      return '';
    }

    if (
      identifier.localName === 'identifier' &&
      identifier.namespaceURI === 'http://purl.org/dc/elements/1.1/'
    ) {
      if (
        identifier.childNodes.length > 0 &&
        identifier.childNodes[0].nodeValue
      ) {
        return identifier.childNodes[0].nodeValue.trim();
      }
    }

    return '';
  }

  /**
   * Find TOC NAV
   * @param {element} manifestNode
   * @return {string}
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
   * @private
   * @param {element} manifestNode
   * @param {element} spineNode
   * @return {string}
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
   * Find the Cover Path
   * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
   * Fallback for Epub 2.0
   * @private
   * @param  {XMLDocument} packageXml
   * @return {string} href
   */
  private findCoverPath(packageXml: XMLDocument): string {
    const pkg = packageXml.querySelector('package');
    pkg?.getAttribute('version');

    // Try parsing cover with epub 3.
    // var node = packageXml.querySelector("item[properties='cover-image']");
    const node = packageXml.querySelector("item[properties~='cover-image']");
    if (node) return node.getAttribute('href') || '';

    // Fallback to epub 2.
    const metaCover = packageXml.querySelector("meta[name='cover']");

    if (metaCover) {
      const coverId = metaCover.getAttribute('content');
      if (coverId) {
        // var cover = packageXml.querySelector("item[id='" + coverId + "']");
        const cover = packageXml.getElementById(coverId);
        return cover ? cover.getAttribute('href') || '' : '';
      }
    }

    return '';
  }

  /**
   * Get text of a namespaced element
   * @param  {node} xml
   * @param  {string} tag
   * @return {string} text
   */
  private getElementText(xml: Element, tag: string): string {
    const found = xml.getElementsByTagNameNS(
      'http://purl.org/dc/elements/1.1/',
      tag
    );
    if (!found || found.length === 0) return '';

    const el = found[0];

    if (el.childNodes.length && el.childNodes[0].nodeValue) {
      return el.childNodes[0].nodeValue;
    }

    return '';
  }

  /**
   * Get text by property
   * @param  {Element} xml
   * @param  {string} property
   * @return {string} text
   */
  private getPropertyText(xml: Element, property: string): string {
    const el = xml.querySelector(`meta[property='${property}']`);

    if (el && el.childNodes.length) {
      return el.childNodes[0].nodeValue || '';
    }

    return '';
  }

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
  } {
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
    this.toc = undefined;
  }
}

export default Packaging;
