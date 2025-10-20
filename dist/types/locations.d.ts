import Queue from './utils/queue';
import EpubCFI from './epubcfi';
import Spine from './spine';
import Section from './section';
import type { RequestFunction, OptionalCustomRange } from './types';
/**
 * Find Locations for a Book
 */
export declare class Locations {
    private _events;
    emit(type: string, ...args: unknown[]): void;
    spine: Spine;
    request: RequestFunction<Document>;
    pause: number | undefined;
    q: Queue | undefined;
    epubcfi: EpubCFI | undefined;
    private _locationsWords;
    private _locations;
    total: number | undefined;
    break: number | undefined;
    private _current;
    private _currentCfi;
    private _wordCounter;
    private processingTimeout;
    constructor(spine: Spine, request: RequestFunction<Document>, pause?: number);
    /**
     * Load all of sections in the book to generate locations
     * @param  {int} chars how many chars to split on
     * @return {Promise<Array<string>>} locations
     */
    generate(chars: number): Promise<Array<string> | undefined>;
    createRange(): OptionalCustomRange;
    process(section: Section): Promise<unknown>;
    parse(contents: Element, cfiBase: string, chars?: number): string[];
    /**
     * Load all of sections in the book to generate locations
     * @param  wordCount how many words to split on
     * @param  {int} count result count
     */
    generateFromWords(startCfi: string, wordCount: number, count: number): Promise<{
        cfi: string;
        wordCount: number;
    }[]>;
    processWords(section: Section, wordCount: number, startCfi: EpubCFI | undefined, count: number): Promise<unknown>;
    countWords(s: string): number;
    parseWords(contents: Element, section: Section, wordCount: number, startCfi: EpubCFI | undefined): {
        cfi: string;
        wordCount: number;
    }[];
    /**
     * Get a location from an EpubCFI
     * @param {EpubCFI} cfi
     * @return {number}
     */
    locationFromCfi(cfiInput: string | EpubCFI): number;
    /**
     * Get a percentage position in locations from an EpubCFI
     */
    percentageFromCfi(cfi: EpubCFI): number | null;
    /**
     * Get a percentage position from a location index
     */
    percentageFromLocation(loc: number): number;
    /**
     * Get an EpubCFI from location index
     * @param {number} loc
     */
    cfiFromLocation(loc: number): string;
    /**
     * Get an EpubCFI from location percentage
     */
    cfiFromPercentage(percentage: number): string;
    /**
     * Load locations from JSON
     */
    load(locations: string | string[]): string[];
    /**
     * Save locations to JSON
     */
    save(): string;
    getCurrent(): number | undefined;
    setCurrent(curr: string | number | undefined): void;
    /**
     * Get the current location
     */
    get currentLocation(): number | undefined;
    /**
     * Set the current location
     */
    set currentLocation(curr: string | number | undefined);
    /**
     * Locations length
     */
    length(): number;
    destroy(): void;
}
export default Locations;
