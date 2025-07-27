import { qs, sprint, locationOf, defer } from './utils/core';
import Queue from './utils/queue';
import EpubCFI from './epubcfi';
import { EVENTS } from './utils/constants';
import EventEmitter from 'event-emitter';
import Spine from './spine';

type GenericAsyncFunction<T> = (...args: unknown[]) => Promise<T>;

/**
 * Find Locations for a Book
 * @param {Spine} spine
 * @param {request} request
 * @param {number} [pause=100]
 */
class Locations {
  public spine: Spine | undefined;
  public request: undefined | GenericAsyncFunction<unknown>;
  public pause: number | undefined;
  public q: Queue | undefined;
  public epubcfi: EpubCFI;
  public _locations: string[] = [];
  public _locationsWords: { cfi: string; wordCount: number }[] = [];
  public total: number = 0;
  public break: number = 150;
  public _current: Location | undefined;
  public _wordCounter: number = 0;
  public _currentCfi: string = '';
  public processingTimeout: ReturnType<typeof setTimeout> | undefined;
  public loaded: boolean = false;
  public emit: (event: string, ...args: unknown[]) => void =
    EventEmitter.prototype.emit;

  constructor(spine: Spine, request: GenericAsyncFunction<unknown>, pause: number) {
    this.spine = spine;
    this.request = request;
    this.pause = pause || 100;

    this.q = new Queue(this);
    this.epubcfi = new EpubCFI();

    this.currentLocation = undefined;
  }

  /**
   * Load all of sections in the book to generate locations
   * @param  {int} chars how many chars to split on
   * @return {Promise<Array<string>>} locations
   */
  generate(chars: number) {
    if (chars) {
      this.break = chars;
    }

    this.q?.pause();

    for (const section of this.spine as any) {
      if (section.linear) {
        this.q?.enqueue(this.process.bind(this), section);
      }
    }

    return this.q?.run().then(() => {
      this.total = this._locations.length - 1;

      if (this._currentCfi) {
        this.setCurrent(this._currentCfi);
      }

      return this._locations;
    });
  }

  createRange(doc: Document | null = null): Range | null {
    // Create a real DOM Range object
    if (doc && typeof doc.createRange === 'function') {
      return doc.createRange();
    }
    // Fallback for environments without createRange
    if (
      typeof document !== 'undefined' &&
      typeof document.createRange === 'function'
    ) {
      return document.createRange();
    }
    throw new Error('No DOM Range available');
  }

  process(section) {
    return section.load(this.request).then(
      function (contents) {
        const completed = new defer();
        const locations = this.parse(contents, section.cfiBase);
        this._locations = this._locations.concat(locations);

        section.unload();

        this.processingTimeout = setTimeout(
          () => completed.resolve(locations),
          this.pause
        );
        return completed.promise;
      }.bind(this)
    );
  }

  parse(contents: DocumentFragment, cfiBase: string, chars: number) {
    const locations: string[] = [];
    let range: Range | null = null;
    const doc = contents.ownerDocument;
    const body = qs(doc, 'body');
    let counter = 0;
    let prev;
    const _break = chars || this.break;
    const parser = function (node) {
      const len = node.length;
      let dist;
      let pos = 0;

      if (node.textContent.trim().length === 0) {
        return false; // continue
      }

      // Start range
      if (counter == 0) {
        range = this.createRange(doc);
        range.setStart(node, 0);
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
          range = this.createRange(doc);
          range.setStart(node, pos);
        }

        // Gone over
        if (pos + dist >= len) {
          // Continue counter for next node
          counter += len - pos;
          pos = len;
        } else {
          // Advance pos
          pos += dist;

          // End the previous range
          range.setEnd(node, pos);
          const cfi = new EpubCFI(range, cfiBase).toString();
          locations.push(cfi);
          counter = 0;
        }
      }
      prev = node;
    };

    sprint(body, parser.bind(this));

    // Close remaining
    if (range && range.startContainer && prev) {
      range.setEnd(prev, prev.length);
      const cfi = new EpubCFI(range, cfiBase).toString();
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
  generateFromWords(
    startCfi: EpubCFI | string | undefined,
    wordCount: number,
    count: number
  ) {
    const start = startCfi ? new EpubCFI(startCfi) : undefined;
    this.q?.pause();
    this._locationsWords = [];
    this._wordCounter = 0;

    for (const section of this.spine as any) {
      if (section.linear) {
        if (start) {
          if (section.index >= start.spinePos) {
            this.q.enqueue(
              this.processWords.bind(this),
              section,
              wordCount,
              start,
              count
            );
          }
        } else {
          this.q.enqueue(
            this.processWords.bind(this),
            section,
            wordCount,
            start,
            count
          );
        }
      }
    }

    return this.q.run().then(
      function () {
        if (this._currentCfi) {
          this.currentLocation = this._currentCfi;
        }

        return this._locationsWords;
      }.bind(this)
    );
  }

  processWords(section, wordCount, startCfi, count) {
    if (count && this._locationsWords.length >= count) {
      return Promise.resolve();
    }

    return section.load(this.request).then(
      function (contents) {
        const completed = new defer();
        const locations = this.parseWords(
          contents,
          section,
          wordCount,
          startCfi
        );
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
      }.bind(this)
    );
  }

  //http://stackoverflow.com/questions/18679576/counting-words-in-string
  countWords(s) {
    s = s.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi, ' '); //2 or more space to 1
    s = s.replace(/\n /, '\n'); // exclude newline with a start spacing
    return s.split(' ').length;
  }

  parseWords(contents, section, wordCount, startCfi) {
    const cfiBase = section.cfiBase;
    const locations = [];
    const doc = contents.ownerDocument;
    const body = qs(doc, 'body');
    const _break = wordCount;
    let foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
    let startNode;
    if (startCfi && section.index === startCfi.spinePos) {
      startNode = startCfi.findNode(
        startCfi.range
          ? startCfi.path.steps.concat(startCfi.start.steps)
          : startCfi.path.steps,
        contents.ownerDocument
      );
    }
    const parser = function (node) {
      if (!foundStartNode) {
        if (node === startNode) {
          foundStartNode = true;
        } else {
          return false;
        }
      }
      if (node.textContent.length < 10) {
        if (node.textContent.trim().length === 0) {
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

    sprint(body, parser.bind(this));

    return locations;
  }

  /**
   * Get a location from an EpubCFI
   * @param {EpubCFI} cfi
   * @return {number}
   */
  locationFromCfi(cfi: EpubCFI | string): number | undefined {
    if (EpubCFI.prototype.isCfiString(cfi)) {
      cfi = new EpubCFI(cfi as string);
    }
    // Check if the location has not been set yet
    if (this._locations.length === 0) {
      return -1;
    }

    const loc = locationOf(cfi, this._locations, this.epubcfi.compare);

    if (loc > this.total) {
      return this.total;
    }

    return loc;
  }

  /**
   * Get a percentage position in locations from an EpubCFI
   * @param {EpubCFI} cfi
   * @return {number}
   */
  percentageFromCfi(cfi: EpubCFI | string): number | null {
    if (this._locations.length === 0) {
      return null;
    }
    // Find closest cfi
    const loc = this.locationFromCfi(cfi);
    // Get percentage in total
    return this.percentageFromLocation(loc);
  }

  /**
   * Get a percentage position from a location index
   * @param {number} location
   * @return {number}
   */
  percentageFromLocation(loc: number | undefined): number {
    if (!loc || !this.total) {
      return 0;
    }

    return loc / this.total;
  }

  /**
   * Get an EpubCFI from location index
   */
  cfiFromLocation(loc: number | string): EpubCFI | number | undefined {
    let cfi = -1;
    // check that pg is an int
    if (typeof loc != 'number') {
      loc = parseInt(loc);
    }

    if (loc >= 0 && loc < this._locations.length) {
      cfi = this._locations[loc];
    }

    return cfi;
  }

  /**
   * Get an EpubCFI from location percentage
   * @param {number} percentage
   * @return {EpubCFI} cfi
   */
  cfiFromPercentage(percentage: number): string {
    if (percentage > 1) {
      console.warn('Normalize cfiFromPercentage value to between 0 - 1');
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
  load(locations) {
    if (typeof locations === 'string') {
      this._locations = JSON.parse(locations);
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

  setCurrent(curr: Location | undefined) {
    let loc;

    if (typeof curr == 'string') {
      this._currentCfi = curr;
    } else if (typeof curr == 'number') {
      this._current = curr;
    } else {
      return;
    }

    if (this._locations.length === 0) {
      return;
    }

    if (typeof curr == 'string') {
      loc = this.locationFromCfi(curr);
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
  get currentLocation(): Location | undefined {
    return this._current;
  }

  /**
   * Set the current location
   */
  set currentLocation(curr: Location | undefined) {
    this.setCurrent(curr);
  }

  /**
   * Locations length
   */
  length() {
    return this._locations.length;
  }

  destroy() {
    this.spine = undefined;
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
