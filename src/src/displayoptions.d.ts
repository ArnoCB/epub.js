/**
 * Open DisplayOptions Format Parser
 */
declare class DisplayOptions {
  interactive: string | undefined;
  fixedLayout: string | undefined;
  openToSpread: string | undefined;
  orientationLock: string | undefined;
  constructor(displayOptionsDocument: XMLDocument);
  /**
     * Parse XML
     */
  parse(displayOptionsDocument: XMLDocument): DisplayOptions;
  destroy(): void;
}
export default DisplayOptions;
