'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('./utils/path'));
/**
 * Handles Parsing and Accessing an Epub Container
 */
class Container {
  constructor(containerDocument) {
    this.packagePath = '';
    this.directory = '';
    if (containerDocument) {
      this.parse(containerDocument);
    }
  }
  /**
     * Parse the Container XML
     */
  parse(containerDocument) {
    //-- <rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>
    let rootfile = null;
    if (!containerDocument) {
      throw new Error('Container File Not Found');
    }
    rootfile = containerDocument.querySelector('rootfile');
    if (!rootfile) {
      throw new Error('No RootFile Found');
    }
    this.packagePath = rootfile.getAttribute('full-path') || '';
    this.directory = this.packagePath
      ? new path_1.default(this.packagePath).directory
      : '';
  }
  destroy() {
    this.packagePath = undefined;
    this.directory = undefined;
  }
}
exports.default = Container;
