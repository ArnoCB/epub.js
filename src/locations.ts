import { sprint, locationOf, defer } from './utils/core';
import Queue from './utils/queue';
import EpubCFI from './epubcfi';
import { EVENTS } from './utils/constants';
import EventEmitter from 'event-emitter';
import Spine from './spine';
import Section from './section';
import SpineItem from './section';

type RequestFunction<T = unknown> = (
  pathOrUrl: string,
  ...args: unknown[]
) => Promise<T>;

interface CustomRange {
  startContainer: Node | undefined;
  startOffset: number | undefined;
  endContainer: Node | undefined;
  endOffset: number | undefined;
}

/**
 * Find Locations for a Book
 * @param {Spine} spine
 * @param {request} request
 * @param {number} [pause=100]
 */
export class Locations {
  spine: Spine | undefined;
  request: RequestFunction<Document>;
  pause: number | undefined;

  q: Queue | undefined;
  epubcfi: EpubCFI | undefined = new EpubCFI();

  private _locationsWords: { cfi: string; wordCount: number }[] = [];

  private _locations: string[] | undefined = [];
  total: number | undefined = 0;

  break: number | undefined = 150;
  private _current: number | undefined = 0;

  private _currentCfi: string | undefined = '';
  private _wordCounter: number = 0;
  private processingTimeout: NodeJS.Timeout | undefined = undefined;

  emit!: (event: string, ...args: unknown[]) => void;

  constructor(
    spine: Spine,
    request: RequestFunction<Document>,
    pause?: number
  ) {
    this.spine = spine;
    this.request = request;
    this.pause = pause || 100;

    this.q = new Queue(this);

    this.currentLocation = 0;
  }

  /**
   * Load all of sections in the book to generate locations
   * @param  {int} chars how many chars to split on
   * @return {Promise<Array<string>>} locations
   */
  generate(chars: number): Promise<Array<string> | undefined> {
    if (chars) {
      this.break = chars;
    }

    if (this.q === undefined) {
      throw new Error('Queue is not defined');
    }

    if (this.spine === undefined) {
      throw new Error('Spine is not defined');
    }

    this.q.pause();

    this.spine.each((section: SpineItem) => {
      if (section.linear) {
        this.q!.enqueue(this.process.bind(this), section);
      }
    });

    return this.q.run().then(() => {
      this.total = this._locations!.length - 1;

      if (this._currentCfi) {
        this.currentLocation = this._currentCfi;
      }

      return this._locations;
    });
  }

  createRange(): CustomRange {
    return {
      startContainer: undefined,
      startOffset: undefined,
      endContainer: undefined,
      endOffset: undefined,
    };
  }

  process(section: Section) {
    // Section.load resolves with the section contents (an Element), not the full Document
    return section.load(this.request).then((contents: unknown) => {
      const completed = new defer();
      if (!contents) {
        // Nothing loaded for this section
        completed.resolve([]);
        return completed.promise;
      }
      // contents is expected to be the document element for the section
      const el = contents as Element;
      const locations = this.parse(el, section.cfiBase!);
      this._locations = this._locations!.concat(locations);

      section.unload();

      this.processingTimeout = setTimeout(
        () => completed.resolve(locations),
        this.pause
      );

      return completed.promise;
    });
  }

  parse(contents: Element, cfiBase: string, chars?: number) {
    const locations = [];
    let range: CustomRange | undefined;
    const doc = contents.ownerDocument;
    const body = doc.querySelector('body');
    if (!body) {
      throw new Error('No body element found in document');
    }
    let counter = 0;
    let prev: Text | undefined;
    const _break = chars || this.break || 150;

    const parser = (node: Node) => {
      const textNode = node as Text;
      const len = textNode.length;
      let dist;
      let pos = 0;

      if (!textNode.textContent || textNode.textContent.trim().length === 0) {
        return false; // continue
      }

      // Start range
      if (counter == 0) {
        range = this.createRange();
        range.startContainer = textNode;
        range.startOffset = 0;
      }

      dist = _break - counter;

      // Node is smaller than a break,
      // skip over it
      if (dist > len) {
        counter += len;
        pos = len;
      }

      while (pos < len) {
        dist = _break - counter;

        if (counter === 0) {
          // Start new range
          pos += 1;
          range = this.createRange();
          range.startContainer = textNode;
          range.startOffset = pos;
        }

        // pos += dist;

        // Gone over
        if (pos + dist >= len) {
          // Continue counter for next node
          counter += len - pos;
          // break
          pos = len;
          // At End
        } else {
          // Advance pos
          pos += dist;

          // End the previous range
          if (range) {
            range.endContainer = textNode;
            range.endOffset = pos;
            // cfi = section.cfiFromRange(range);
            const cfi = new EpubCFI(range as Range, cfiBase).toString();
            locations.push(cfi);
          }
          counter = 0;
        }
      }
      prev = textNode;
    };

    sprint(body, parser);

    // Close remaining
    if (range && range.startContainer && prev) {
      range.endContainer = prev;
      range.endOffset = prev.length;
      const cfi = new EpubCFI(range as Range, cfiBase).toString();
      locations.push(cfi);
      counter = 0;
    }

    return locations;
  }

  /**
   * Load all of sections in the book to generate locations
   * @param  {string} startCfi start position
   * @param  {int} wordCount how many words to split on
   * @param  {int} count result count
   * @return {object} locations
   */
  generateFromWords(startCfi: string, wordCount: number, count: number) {
    const start = startCfi ? new EpubCFI(startCfi) : undefined;

    if (this.q === undefined) {
      throw new Error('Queue is not defined');
    }

    if (this.spine === undefined) {
      throw new Error('Spine is not defined');
    }

    this.q.pause();
    this._locationsWords = [];
    this._wordCounter = 0;

    this.spine.each((section: Section) => {
      if (section.linear) {
        if (start) {
          if (section.index >= start.spinePos) {
            this.q!.enqueue(
              this.processWords.bind(this),
              section,
              wordCount,
              start,
              count
            );
          }
        } else {
          this.q!.enqueue(
            this.processWords.bind(this),
            section,
            wordCount,
            start,
            count
          );
        }
      }
    });

    return this.q.run().then(() => {
      if (this._currentCfi) {
        this.currentLocation = this._currentCfi;
      }

      return this._locationsWords;
    });
  }

  async processWords(
    section: Section,
    wordCount: number,
    startCfi: EpubCFI | undefined,
    count: number
  ) {
    if (count && this._locationsWords.length >= count) {
      return Promise.resolve();
    }

    // Section.load resolves with the section contents (an Element), not the full Document
    return section.load(this.request).then((contents: unknown) => {
      const completed = new defer();
      // Use documentElement for parseWords
      if (!contents) {
        completed.resolve([]);
        return completed.promise;
      }
      const el = contents as Element;
      // contents is already the documentElement for the section
      const locations = this.parseWords(el, section, wordCount, startCfi);
      const remainingCount = count - this._locationsWords.length;
      this._locationsWords = this._locationsWords.concat(
        locations.length >= count
          ? locations.slice(0, remainingCount)
          : locations
      );

      section.unload();

      this.processingTimeout = setTimeout(
        () => completed.resolve(locations),
        this.pause
      );
      return completed.promise;
    });
  }

  //http://stackoverflow.com/questions/18679576/counting-words-in-string
  countWords(s: string) {
    s = s.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi, ' '); //2 or more space to 1
    s = s.replace(/\n /, '\n'); // exclude newline with a start spacing
    return s.split(' ').length;
  }

  parseWords(
    contents: Element,
    section: Section,
    wordCount: number,
    startCfi: EpubCFI | undefined
  ) {
    const cfiBase = section.cfiBase;
    const locations: { cfi: string; wordCount: number }[] = [];
    const doc = contents.ownerDocument;
    if (!doc) {
      throw new Error('Document is not defined');
    }

    const body = doc.querySelector('body');
    if (!body) {
      throw new Error('No body element found in document');
    }
    const _break = wordCount;
    let foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
    let startNode: Node | null;
    if (startCfi && section.index === startCfi.spinePos) {
      startNode = startCfi.findNode(
        startCfi.range
          ? startCfi.path.steps.concat(startCfi.start?.steps || [])
          : startCfi.path.steps,
        contents.ownerDocument
      );
    }

    const parser = (node: Node) => {
      if (!foundStartNode) {
        if (node === startNode) {
          foundStartNode = true;
        } else {
          return false;
        }
      }
      if (
        node.nodeType !== 3 ||
        !node.textContent ||
        node.textContent.length < 10
      ) {
        if (!node.textContent || node.textContent.trim().length === 0) {
          return false;
        }
      }
      const len = this.countWords(node.textContent);
      let dist;
      let pos = 0;

      if (len === 0) {
        return false; // continue
      }

      dist = _break - this._wordCounter;

      // Node is smaller than a break,
      // skip over it
      if (dist > len) {
        this._wordCounter += len;
        pos = len;
      }

      while (pos < len) {
        dist = _break - this._wordCounter;

        // Gone over
        if (pos + dist >= len) {
          // Continue counter for next node
          this._wordCounter += len - pos;
          // break
          pos = len;
          // At End
        } else {
          // Advance pos
          pos += dist;

          const cfi = new EpubCFI(node, cfiBase);
          locations.push({ cfi: cfi.toString(), wordCount: this._wordCounter });
          this._wordCounter = 0;
        }
      }
    };

    sprint(body, parser);

    return locations;
  }

  /**
   * Get a location from an EpubCFI
   * @param {EpubCFI} cfi
   * @return {number}
   */
  locationFromCfi(cfiInput: string | EpubCFI): number {
    let cfi: EpubCFI;
    if (EpubCFI.prototype.isCfiString(cfiInput)) {
      cfi = new EpubCFI(cfiInput as string);
    } else {
      cfi = cfiInput as EpubCFI;
    }

    // Check if the location has not been set yet
    if (this._locations === undefined || this._locations.length === 0) {
      return -1;
    }

    if (this.epubcfi === undefined) {
      throw new Error('EpubCFI is not defined');
    }

    const loc = locationOf(cfi, this._locations, this.epubcfi.compare);

    if (this.total === undefined) {
      return -1;
    }

    if (loc > this.total) {
      return this.total;
    }

    return loc;
  }

  /**
   * Get a percentage position in locations from an EpubCFI
   */
  percentageFromCfi(cfi: EpubCFI) {
    if (this._locations === undefined || this._locations.length === 0) {
      return null;
    }

    // Find closest cfi
    const loc = this.locationFromCfi(cfi);
    // Get percentage in total
    return this.percentageFromLocation(loc);
  }

  /**
   * Get a percentage position from a location index
   */
  percentageFromLocation(loc: number) {
    if (!loc || !this.total) {
      return 0;
    }

    return loc / this.total;
  }

  /**
   * Get an EpubCFI from location index
   * @param {number} loc
   */
  cfiFromLocation(loc: number): string {
    if (this._locations === undefined) {
      return '';
    }

    if (loc >= 0 && loc < this._locations.length) {
      return this._locations[loc];
    }

    return '';
  }

  /**
   * Get an EpubCFI from location percentage
   */
  cfiFromPercentage(percentage: number): string {
    if (percentage > 1) {
      console.warn('Normalize cfiFromPercentage value to between 0 - 1');
    }

    if (this._locations === undefined || this.total === undefined) {
      return '';
    }

    // Make sure 1 goes to very end
    if (percentage >= 1) {
      const cfi = new EpubCFI(this._locations[this.total]);
      cfi.collapse();
      return cfi.toString();
    }

    const loc = Math.ceil(this.total * percentage);
    return this.cfiFromLocation(loc);
  }

  /**
   * Load locations from JSON
   * @param {json} locations
   */
  load(locations: string | string[]): string[] {
    if (typeof locations === 'string') {
      this._locations = JSON.parse(locations) as string[];
    } else {
      this._locations = locations;
    }
    this.total = this._locations.length - 1;
    return this._locations;
  }

  /**
   * Save locations to JSON
   */
  save() {
    return JSON.stringify(this._locations);
  }

  getCurrent() {
    return this._current;
  }

  setCurrent(curr: string | number | undefined) {
    let loc;

    if (curr === undefined) {
      return;
    }

    if (typeof curr == 'string') {
      this._currentCfi = curr;
    } else if (typeof curr == 'number') {
      this._current = curr;
    } else {
      return;
    }

    if (this._locations === undefined || this._locations.length === 0) {
      return;
    }

    if (typeof curr == 'string') {
      loc = this.locationFromCfi(curr as string);
      this._current = loc;
    } else {
      loc = curr;
    }

    this.emit(EVENTS.LOCATIONS.CHANGED, {
      percentage: this.percentageFromLocation(loc),
    });
  }

  /**
   * Get the current location
   */
  get currentLocation(): number | undefined {
    return this._current;
  }

  /**
   * Set the current location
   */
  set currentLocation(curr: string | number | undefined) {
    this.setCurrent(curr);
  }

  /**
   * Locations length
   */
  length() {
    return this._locations?.length ?? 0;
  }

  destroy() {
    this.spine = undefined;
    // @ts-expect-error this is only at destroy time
    this.request = undefined;
    this.pause = undefined;

    this.q?.stop();
    this.q = undefined;
    this.epubcfi = undefined;

    this._locations = undefined;
    this.total = undefined;

    this.break = undefined;
    this._current = undefined;

    this.currentLocation = undefined;
    this._currentCfi = undefined;
    clearTimeout(this.processingTimeout);
  }
}

EventEmitter(Locations.prototype);

export default Locations;
