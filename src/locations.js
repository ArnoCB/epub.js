"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locations = void 0;
const core_1 = require("./utils/core");
const queue_1 = __importDefault(require("./utils/queue"));
const epubcfi_1 = __importDefault(require("./epubcfi"));
const constants_1 = require("./utils/constants");
const event_emitter_1 = __importDefault(require("event-emitter"));
/**
 * Find Locations for a Book
 * @param {Spine} spine
 * @param {request} request
 * @param {number} [pause=100]
 */
class Locations {
    constructor(spine, request, pause) {
        this.epubcfi = new epubcfi_1.default();
        this._locationsWords = [];
        this._locations = [];
        this.total = 0;
        this.break = 150;
        this._current = 0;
        this._currentCfi = '';
        this._wordCounter = 0;
        this.processingTimeout = undefined;
        this.spine = spine;
        this.request = request;
        this.pause = pause || 100;
        this.q = new queue_1.default(this);
        this.currentLocation = 0;
    }
    /**
     * Load all of sections in the book to generate locations
     * @param  {int} chars how many chars to split on
     * @return {Promise<Array<string>>} locations
     */
    generate(chars) {
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
        this.spine.each((section) => {
            if (section.linear) {
                this.q.enqueue(this.process.bind(this), section);
            }
        });
        return this.q.run().then(() => {
            this.total = this._locations.length - 1;
            if (this._currentCfi) {
                this.currentLocation = this._currentCfi;
            }
            return this._locations;
            // console.log(this.percentage(this.book.rendition.location.start), this.percentage(this.book.rendition.location.end));
        });
    }
    createRange() {
        return {
            startContainer: undefined,
            startOffset: undefined,
            endContainer: undefined,
            endOffset: undefined,
        };
    }
    process(section) {
        return section.load(this.request).then((contents) => {
            const completed = new core_1.defer();
            const locations = this.parse(contents, section.cfiBase);
            this._locations = this._locations.concat(locations);
            section.unload();
            this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
            return completed.promise;
        });
    }
    parse(contents, cfiBase, chars) {
        const locations = [];
        let range;
        const doc = contents.ownerDocument;
        const body = doc.querySelector('body');
        if (!body) {
            throw new Error('No body element found in document');
        }
        let counter = 0;
        let prev;
        const _break = chars || this.break || 150;
        const parser = (node) => {
            const textNode = node;
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
                }
                else {
                    // Advance pos
                    pos += dist;
                    // End the previous range
                    if (range) {
                        range.endContainer = textNode;
                        range.endOffset = pos;
                        // cfi = section.cfiFromRange(range);
                        const cfi = new epubcfi_1.default(range, cfiBase).toString();
                        locations.push(cfi);
                    }
                    counter = 0;
                }
            }
            prev = textNode;
        };
        (0, core_1.sprint)(body, parser);
        // Close remaining
        if (range && range.startContainer && prev) {
            range.endContainer = prev;
            range.endOffset = prev.length;
            const cfi = new epubcfi_1.default(range, cfiBase).toString();
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
    generateFromWords(startCfi, wordCount, count) {
        const start = startCfi ? new epubcfi_1.default(startCfi) : undefined;
        if (this.q === undefined) {
            throw new Error('Queue is not defined');
        }
        if (this.spine === undefined) {
            throw new Error('Spine is not defined');
        }
        this.q.pause();
        this._locationsWords = [];
        this._wordCounter = 0;
        this.spine.each((section) => {
            if (section.linear) {
                if (start) {
                    if (section.index >= start.spinePos) {
                        this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
                    }
                }
                else {
                    this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
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
    async processWords(section, wordCount, startCfi, count) {
        if (count && this._locationsWords.length >= count) {
            return Promise.resolve();
        }
        return section.load(this.request).then((contents) => {
            const completed = new core_1.defer();
            const locations = this.parseWords(contents, section, wordCount, startCfi);
            const remainingCount = count - this._locationsWords.length;
            this._locationsWords = this._locationsWords.concat(locations.length >= count
                ? locations.slice(0, remainingCount)
                : locations);
            section.unload();
            this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
            return completed.promise;
        });
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
        if (!doc) {
            throw new Error('Document is not defined');
        }
        const body = doc.querySelector('body');
        if (!body) {
            throw new Error('No body element found in document');
        }
        const _break = wordCount;
        let foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
        let startNode;
        if (startCfi && section.index === startCfi.spinePos) {
            startNode = startCfi.findNode(startCfi.range
                ? startCfi.path.steps.concat(startCfi.start?.steps || [])
                : startCfi.path.steps, contents.ownerDocument);
        }
        const parser = (node) => {
            if (!foundStartNode) {
                if (node === startNode) {
                    foundStartNode = true;
                }
                else {
                    return false;
                }
            }
            if (node.nodeType !== 3 ||
                !node.textContent ||
                node.textContent.length < 10) {
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
                }
                else {
                    // Advance pos
                    pos += dist;
                    const cfi = new epubcfi_1.default(node, cfiBase);
                    locations.push({ cfi: cfi.toString(), wordCount: this._wordCounter });
                    this._wordCounter = 0;
                }
            }
        };
        (0, core_1.sprint)(body, parser);
        return locations;
    }
    /**
     * Get a location from an EpubCFI
     * @param {EpubCFI} cfi
     * @return {number}
     */
    locationFromCfi(cfiInput) {
        let cfi;
        if (epubcfi_1.default.prototype.isCfiString(cfiInput)) {
            cfi = new epubcfi_1.default(cfiInput);
        }
        else {
            cfi = cfiInput;
        }
        // Check if the location has not been set yet
        if (this._locations === undefined || this._locations.length === 0) {
            return -1;
        }
        if (this.epubcfi === undefined) {
            throw new Error('EpubCFI is not defined');
        }
        const loc = (0, core_1.locationOf)(cfi, this._locations, this.epubcfi.compare);
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
    percentageFromCfi(cfi) {
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
    percentageFromLocation(loc) {
        if (!loc || !this.total) {
            return 0;
        }
        return loc / this.total;
    }
    /**
     * Get an EpubCFI from location index
     * @param {number} loc
     */
    cfiFromLocation(loc) {
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
    cfiFromPercentage(percentage) {
        if (percentage > 1) {
            console.warn('Normalize cfiFromPercentage value to between 0 - 1');
        }
        if (this._locations === undefined || this.total === undefined) {
            return '';
        }
        // Make sure 1 goes to very end
        if (percentage >= 1) {
            const cfi = new epubcfi_1.default(this._locations[this.total]);
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
        }
        else {
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
    setCurrent(curr) {
        let loc;
        if (curr === undefined) {
            return;
        }
        if (typeof curr == 'string') {
            this._currentCfi = curr;
        }
        else if (typeof curr == 'number') {
            this._current = curr;
        }
        else {
            return;
        }
        if (this._locations === undefined || this._locations.length === 0) {
            return;
        }
        if (typeof curr == 'string') {
            loc = this.locationFromCfi(curr);
            this._current = loc;
        }
        else {
            loc = curr;
        }
        this.emit(constants_1.EVENTS.LOCATIONS.CHANGED, {
            percentage: this.percentageFromLocation(loc),
        });
    }
    /**
     * Get the current location
     */
    get currentLocation() {
        return this._current;
    }
    /**
     * Set the current location
     */
    set currentLocation(curr) {
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
exports.Locations = Locations;
(0, event_emitter_1.default)(Locations.prototype);
