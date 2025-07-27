/**
 * Open DisplayOptions Format Parser
 */
class DisplayOptions {
  interactive: string | undefined = '';
  fixedLayout: string | undefined = '';
  openToSpread: string | undefined = '';
  orientationLock: string | undefined = '';

  constructor(displayOptionsDocument: XMLDocument) {
    if (displayOptionsDocument) {
      this.parse(displayOptionsDocument);
    }
  }

  /**
   * Parse XML
   */
  parse(displayOptionsDocument: XMLDocument): DisplayOptions {
    if (!displayOptionsDocument) {
      return this;
    }

    const displayOptionsNode =
      displayOptionsDocument.querySelector('display_options');
    if (!displayOptionsNode) {
      return this;
    }

    const options = displayOptionsNode.querySelectorAll('option');
    options.forEach((el) => {
      let value = '';
      if (el.childNodes.length) {
        value = el.childNodes[0].nodeValue ?? '';
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

export default DisplayOptions;
