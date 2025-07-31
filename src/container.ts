import Path from './utils/path';

/**
 * Handles Parsing and Accessing an Epub Container
 */
class Container {
  public packagePath: string | undefined = '';
  public directory: string | undefined = '';

  constructor(containerDocument: XMLDocument) {
    if (containerDocument) {
      this.parse(containerDocument);
    }
  }

  /**
   * Parse the Container XML
   */
  parse(containerDocument: XMLDocument) {
    //-- <rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>
    let rootfile: Element | null = null;

    if (!containerDocument) {
      throw new Error('Container File Not Found');
    }

    rootfile = containerDocument.querySelector('rootfile');

    if (!rootfile) {
      throw new Error('No RootFile Found');
    }

    this.packagePath = rootfile.getAttribute('full-path') || '';
    this.directory = this.packagePath
      ? new Path(this.packagePath).directory
      : '';
  }

  destroy() {
    this.packagePath = undefined;
    this.directory = undefined;
  }
}

export default Container;
