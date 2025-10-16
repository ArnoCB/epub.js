/**
 * Types for locations utilities in epub.js
 *
 * Used by locations.ts and related logic.
 *
 * @see src/locations.ts
 */
export type RequestFunction<T = unknown> = (pathOrUrl: string, ...args: unknown[]) => Promise<T>;
export interface OptionalCustomRange {
    startContainer: Node | undefined;
    startOffset: number | undefined;
    endContainer: Node | undefined;
    endOffset: number | undefined;
}
