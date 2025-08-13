"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexOfNode = indexOfNode;
const ELEMENT_NODE = 1;
/**
 * Gets the index of a node in its parent
 * @memberof Core
 */
function indexOfNode(node, typeId) {
    const parent = node.parentNode;
    if (!parent) {
        return -1;
    }
    const children = parent.childNodes;
    let sib;
    let index = -1;
    for (let i = 0; i < children.length; i++) {
        sib = children[i];
        if (sib.nodeType === typeId) {
            index++;
        }
        if (sib == node)
            break;
    }
    return index;
}
function indexOfElementNode(elementNode) {
    return indexOfNode(elementNode, ELEMENT_NODE);
}
/**
 * Open Packaging Format Parser
 * @class
 * @param {document} packageDocument OPF XML
 */
class Packaging {
    constructor(packageDocument) {
        this.manifest = {};
        this.navPath = '';
        this.ncxPath = '';
        this.coverPath = '';
        this.spineNodeIndex = 0;
        this.spine = [];
        this.metadata = {};
        this.uniqueIdentifier = '';
        if (packageDocument) {
            this.parse(packageDocument);
        }
    }
    /**
     * Parse OPF XML
     */
    parse(packageDocument) {
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
    parseMetadata(xml) {
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
            flow: this.getPropertyText(xml, 'rendition:flow'),
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
    parseManifest(manifestXml) {
        const manifest = {};
        //-- Turn items into an array
        const selected = manifestXml.querySelectorAll('item');
        const items = Array.prototype.slice.call(selected);
        //-- Create an object with the id as key
        items.forEach(function (item) {
            const id = item.getAttribute('id'), href = item.getAttribute('href') || '', type = item.getAttribute('media-type') || '', overlay = item.getAttribute('media-overlay') || '', properties = item.getAttribute('properties') || '';
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
    parseSpine(spineXml) {
        const spine = [];
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
    findUniqueIdentifier(packageXml) {
        const uniqueIdentifierId = packageXml.documentElement.getAttribute('unique-identifier');
        if (!uniqueIdentifierId) {
            return '';
        }
        const identifier = packageXml.getElementById(uniqueIdentifierId);
        if (!identifier) {
            return '';
        }
        if (identifier.localName === 'identifier' &&
            identifier.namespaceURI === 'http://purl.org/dc/elements/1.1/') {
            if (identifier.childNodes.length > 0 &&
                identifier.childNodes[0].nodeValue) {
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
    findNavPath(manifestNode) {
        // Find item with property "nav"
        // Should catch nav regardless of order
        const node = manifestNode.querySelector("item[properties~='nav']");
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
    findNcxPath(manifestNode, spineNode) {
        // var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
        let node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
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
    findCoverPath(packageXml) {
        const pkg = packageXml.querySelector('package');
        pkg?.getAttribute('version');
        // Try parsing cover with epub 3.
        // var node = packageXml.querySelector("item[properties='cover-image']");
        const node = packageXml.querySelector("item[properties~='cover-image']");
        if (node)
            return node.getAttribute('href') || '';
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
    getElementText(xml, tag) {
        const found = xml.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', tag);
        if (!found || found.length === 0)
            return '';
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
    getPropertyText(xml, property) {
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
    load(json) {
        this.metadata = json.metadata;
        const spine = json.readingOrder || json.spine;
        this.spine = spine
            ? spine.map((item, index) => {
                const spineItem = {
                    idref: item.idref,
                    linear: item.linear || 'yes',
                    properties: item.properties || [],
                    index: index,
                };
                return spineItem;
            })
            : [];
        json.resources.forEach((item, index) => {
            this.manifest[index] = item;
            if (item.rel && item.rel[0] === 'cover') {
                this.coverPath = item.href;
            }
        });
        this.spineNodeIndex = 0;
        this.toc = json.toc
            ? json.toc.map((item) => {
                const navItem = {
                    id: item.id || '',
                    href: item.href,
                    label: item.label || item.title || '',
                    title: item.title,
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
exports.default = Packaging;
