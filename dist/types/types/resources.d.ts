import type Archive from '../archive';
import type { BookRequestFunction } from './book';
export type ResolverFunction = (path: string, absolute?: boolean) => string;
export interface ResourcesOptions {
    replacements?: string;
    archive?: Archive;
    resolver: ResolverFunction;
    request: BookRequestFunction;
}
