'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Open DisplayOptions Format Parser
 */
class DisplayOptions {
  constructor(displayOptionsDocument) {
    this.interactive = '';
    this.fixedLayout = '';
    this.openToSpread = '';
    this.orientationLock = '';
    if (displayOptionsDocument) {
      this.parse(displayOptionsDocument);
    }
  }
  /**
     * Parse XML
     */
  parse(displayOptionsDocument) {
    if (!displayOptionsDocument) {
      return this;
    }
    const displayOptionsNode = displayOptionsDocument.querySelector('display_options');
    if (!displayOptionsNode) {
      return this;
    }
    const options = displayOptionsNode.querySelectorAll('option');
    options.forEach((el) => {
      var _a;
      let value = '';
      if (el.childNodes.length) {
        value = (_a = el.childNodes[0].nodeValue) !== null && _a !== void 0 ? _a : '';
      }
      const name = el.getAttribute('name');
      switch (name) {
        case 'interactive':
          this.interactive = value;
          break;
        case 'fixed-layout':
          this.fixedLayout = value;
          break;
        case 'open-to-spread':
          this.openToSpread = value;
          break;
        case 'orientation-lock':
          this.orientationLock = value;
          break;
      }
    });
    return this;
  }
  destroy() {
    this.interactive = undefined;
    this.fixedLayout = undefined;
    this.openToSpread = undefined;
    this.orientationLock = undefined;
  }
}
exports.default = DisplayOptions;
