/**
 * Shared type for CSS stylesheet rules in epub.js
 *
 * Used for theme rules, dynamic stylesheet injection, etc.
 */

export type StylesheetRules =
  | [string, ...[string, string, boolean?][]][]
  | {
      [selector: string]:
        | { [property: string]: string }
        | { [property: string]: string }[];
    };
