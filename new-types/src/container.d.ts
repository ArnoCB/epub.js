/**
 * Handles Parsing and Accessing an Epub Container
 */
declare class Container {
  packagePath: string | undefined;
  directory: string | undefined;
  constructor(containerDocument: XMLDocument);
  /**
   * Parse the Container XML
   */
  parse(containerDocument: XMLDocument): void;
  destroy(): void;
}
export default Container;
