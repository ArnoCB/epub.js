import { qs, qsa, qsp } from './utils/core';
import { SpineItem } from '../types/section';

export interface PackagingObject {
  metadata: PackagingMetadataObject;
  spine: Array<SpineItem>;
  manifest: PackagingManifestObject;
  navPath: string;
  ncxPath: string;
  coverPath: string;
  spineNodeIndex: number;
}

export interface PackagingMetadataObject {
  title?: string;
  creator?: string;
  description?: string;
  pubdate?: string;
  publisher?: string;
  identifier?: string;
  language?: string;
  rights?: string;
  modified_date?: string;
  layout?: string;
  orientation?: string;
  flow?: string;
  viewport?: string;
  spread?: string;
  direction?: string;
}

export interface PackagingSpineItem {
  idref: string;
  properties: Array<string>;
  index: number;
}

export interface PackagingManifestItem {
  href: string;
  type: string;
  properties: Array<string>;
}

export interface PackagingManifestObject {
  [key: string]: PackagingManifestItem;
}

export interface ManifestJson {
  metadata: PackagingMetadataObject;
  readingOrder?: Array<any>;
  spine?: Array<any>;
  resources: Array<any>;
  toc: Array<{ label: string; href: string; title?: string }>;
}

const ELEMENT_NODE = 1;

/**
 * Gets the index of a node in its parent
 */
export function indexOfNode(node: Node, typeId: number) {
  const parent = node.parentNode;
  const children = parent?.childNodes;
  let sib: Node | null = null;
  let index = -1;

  if (!children) return index;
  if (children.length === 0) return index;

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
  public manifest: PackagingManifestObject | undefined;
  public navPath: string | undefined;
  public ncxPath: string | undefined;
  public coverPath: string | undefined;
  public spineNodeIndex: number | undefined;
  public spine: Array<PackagingSpineItem> | undefined;
  public metadata: PackagingMetadataObject | undefined;

  public toc: Array<{ label: string; href: string }> | undefined;
  public uniqueIdentifier: string | undefined;

  constructor(packageDocument: Document) {
    this.manifest = {};
    this.navPath = '';
    this.ncxPath = '';
    this.coverPath = '';
    this.spineNodeIndex = 0;
    this.spine = [];
    this.metadata = {};

    if (packageDocument) {
      this.parse(packageDocument);
    }
  }

  /**
   * Parse OPF XML
   * @param  {document} packageDocument OPF XML
   * @return {object} parsed package parts
   */
  parse(packageDocument: Document): PackagingObject {
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
    this.navPath = this.findNavPath(manifestNode) ?? undefined;
    this.ncxPath = this.findNcxPath(manifestNode, spineNode) ?? undefined;
    this.coverPath = this.findCoverPath(packageDocument) ?? undefined;

    this.spineNodeIndex = indexOfElementNode(spineNode);

    this.spine = this.parseSpine(spineNode);

    this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument) ?? undefined;
    this.metadata = this.parseMetadata(metadataNode);

    this.metadata.direction = spineNode.getAttribute(
      'page-progression-direction'
    ) || 'default';

    return {
      metadata: this.metadata,
      spine: this.spine,
      manifest: this.manifest,
      navPath: this.navPath ?? '',
      ncxPath: this.ncxPath ?? '',
      coverPath: this.coverPath ?? '',
      spineNodeIndex: this.spineNodeIndex,
    };
  }

  /**
   * Parse Metadata
   * @private
   * @param  {node} xml
   * @return {object} metadata
   */
  private parseMetadata(xml: Node): PackagingMetadataObject {
    const metadata: PackagingMetadataObject = {};

    metadata.title = this.getElementText(xml, 'title');
    metadata.creator = this.getElementText(xml, 'creator');
    metadata.description = this.getElementText(xml, 'description');

    metadata.pubdate = this.getElementText(xml, 'date');

    metadata.publisher = this.getElementText(xml, 'publisher');

    metadata.identifier = this.getElementText(xml, 'identifier');
    metadata.language = this.getElementText(xml, 'language');
    metadata.rights = this.getElementText(xml, 'rights');

    metadata.modified_date = this.getPropertyText(xml, 'dcterms:modified');

    metadata.layout = this.getPropertyText(xml, 'rendition:layout');
    metadata.orientation = this.getPropertyText(xml, 'rendition:orientation');
    metadata.flow = this.getPropertyText(xml, 'rendition:flow');
    metadata.viewport = this.getPropertyText(xml, 'rendition:viewport');
    metadata.media_active_class = this.getPropertyText(
      xml,
      'media:active-class'
    );
    metadata.spread = this.getPropertyText(xml, 'rendition:spread');
    // metadata.page_prog_dir = packageXml.querySelector("spine").getAttribute("page-progression-direction");

    return metadata;
  }

  /**
   * Parse Manifest
   * @private
   * @param  {node} manifestXml
   * @return {object} manifest
   */
  parseManifest(manifestXml : Node): PackagingManifestObject {
    const manifest = {};

    //-- Turn items into an array
    // var selected = manifestXml.querySelectorAll("item");
    const selected = qsa(manifestXml, 'item');
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
  private parseSpine(spineXml: Node): Array<PackagingSpineItem> {
    const spine: Array<PackagingSpineItem> = [];

    const items = [...(spineXml as Element).querySelectorAll('itemref')];

    // var epubcfi = new EpubCFI();

    //-- Add to array to maintain ordering and cross reference with manifest
    items.forEach(function (item, index) {
      // var cfiBase = epubcfi.generateChapterComponent(spineNodeIndex, index, Id);
      const props = item.getAttribute('properties') || '';
      const propArray = props.length ? props.split(' ') : [];
      // var manifestProps = manifest[Id].properties;
      // var manifestPropArray = manifestProps.length ? manifestProps.split(" ") : [];

      const itemref: PackagingSpineItem = {
        idref: item.getAttribute('idref') || '',
        properties: propArray,
        index: index,
      };

      spine.push(itemref);
    });

    return spine;
  }

  /**
   * Find Unique Identifier
   * @private
   * @param  {node} packageXml
   * @return {string} Unique Identifier text
   */
  private findUniqueIdentifier(packageXml: Document): string | null {
    const uniqueIdentifierId =
      packageXml.documentElement.getAttribute('unique-identifier');
    if (!uniqueIdentifierId) {
      return null;
    }
    const identifier = packageXml.getElementById(uniqueIdentifierId);
    if (!identifier) {
      return null;
    }

    if (
      identifier.localName === 'identifier' &&
      identifier.namespaceURI === 'http://purl.org/dc/elements/1.1/'
    ) {
      return identifier.childNodes.length > 0
        ? identifier.childNodes[0].nodeValue?.trim() || null
        : null;
    }

    return null;
  }

  /**
   * Find TOC NAV
   */
  private findNavPath(manifestNode: Element): string | null {
    // Find item with property "nav"
    // Should catch nav regardless of order
    // var node = manifestNode.querySelector("item[properties$='nav'], item[properties^='nav '], item[properties*=' nav ']");
    const node = qsp(manifestNode, 'item', { properties: 'nav' });
    return node ? node.getAttribute('href') : null;
  }

  /**
   * Find TOC NCX
   * media-type="application/x-dtbncx+xml" href="toc.ncx"
   * @private
   * @param {element} manifestNode
   * @param {element} spineNode
   * @return {string}
   */
  findNcxPath(manifestNode: Element, spineNode: Element): string | null {
    // var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
    let node = qsp(manifestNode, 'item', {
      'media-type': 'application/x-dtbncx+xml',
    });
    let tocId;

    // If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
    // according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
    // "The item that describes the NCX must be referenced by the spine toc attribute."
    if (!node) {
      tocId = spineNode.getAttribute('toc');
      if (tocId) {
        // node = manifestNode.querySelector("item[id='" + tocId + "']");
        node = manifestNode.querySelector(`#${tocId}`);
      }
    }

    return node ? node.getAttribute('href') : null;
  }

  /**
   * Find the Cover Path
   * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
   * Fallback for Epub 2.0
   * @private
   * @param  {node} packageXml
   * @return {string} href
   */
  findCoverPath(packageXml: Document): string | null {
    const pkg = qs(packageXml, 'package');
    pkg.getAttribute('version');

    // Try parsing cover with epub 3.
    // var node = packageXml.querySelector("item[properties='cover-image']");
    const node = qsp(packageXml, 'item', { properties: 'cover-image' });
    if (node) return node.getAttribute('href');

    // Fallback to epub 2.
    const metaCover = qsp(packageXml, 'meta', { name: 'cover' });

    if (metaCover) {
      const coverId = metaCover.getAttribute('content');
      if (!coverId) {
        return null;
      }
      // var cover = packageXml.querySelector("item[id='" + coverId + "']");
      const cover = packageXml.getElementById(coverId);
      return cover ? cover.getAttribute('href') : null;
    } else {
      return null;
    }
  }

  /**
   * Get text of a namespaced element
   * @private
   * @param  {node} xml
   * @param  {string} tag
   * @return {string} text
   */
  private getElementText(xml: Node, tag: string): string {
    const found = (xml as Element).getElementsByTagNameNS(
      'http://purl.org/dc/elements/1.1/',
      tag
    );

    if (!found || found.length === 0) return '';

    const el = found[0];

    if (el.childNodes.length) {
      return el.childNodes[0].nodeValue || '';
    }

    return '';
  }

  /**
   * Get text by property
   * @private
   * @param  {node} xml
   * @param  {string} property
   * @return {string} text
   */
  private getPropertyText(xml: Node, property: string): string {
    // Use querySelector to find <meta property="...">
    const el = (xml as Element).querySelector(`meta[property="${property}"]`);
    if (el && el.childNodes.length) {
      return el.childNodes[0].nodeValue || '';
    }
    return '';
  }

  /**
   * Load JSON Manifest
   */
  load(json: ManifestJson): PackagingObject {
    this.metadata = json.metadata;

    const spine = json.readingOrder || json.spine;
    this.spine = spine?.map((item, index) => {
      item.index = index;
      item.linear = item.linear || 'yes';
      return item;
    });

    json.resources.forEach((item, index) => {
      if (!this.manifest) {
        throw new Error('Manifest not initialized');
      }

      this.manifest[index] = item;

      if (item.rel && item.rel[0] === 'cover') {
        this.coverPath = item.href;
      }
    });

    this.spineNodeIndex = 0;

    this.toc = json.toc.map((item) => {
      item.label = item.title;
      return item;
    });

    return {
      metadata: this.metadata,
      spine: this.spine || [],
      manifest: this.manifest || [],
      navPath: this.navPath || '',
      ncxPath: this.ncxPath || '',
      coverPath: this.coverPath || '',
      spineNodeIndex: this.spineNodeIndex,
      toc: this.toc,
    };
  }

  destroy() {
    this.manifest = undefined;
    this.navPath = undefined;
    this.ncxPath = undefined;
    this.coverPath = undefined;
    this.spineNodeIndex = undefined;
    this.spine = undefined;
    this.metadata = undefined;
  }
}

export default Packaging;
