'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.EVENTS = exports.DOM_EVENTS = exports.EPUBJS_VERSION = void 0;
exports.EPUBJS_VERSION = '0.3';
// Dom events to listen for
exports.DOM_EVENTS = [
  'keydown',
  'keyup',
  'keypressed',
  'mouseup',
  'mousedown',
  'mousemove',
  'click',
  'touchend',
  'touchstart',
  'touchmove',
];
exports.EVENTS = {
  BOOK: {
    OPEN_FAILED: 'openFailed',
  },
  CONTENTS: {
    EXPAND: 'expand',
    RESIZE: 'resize',
    SELECTED: 'selected',
    SELECTED_RANGE: 'selectedRange',
    LINK_CLICKED: 'linkClicked',
  },
  LOCATIONS: {
    CHANGED: 'changed',
  },
  MANAGERS: {
    RESIZE: 'resize',
    RESIZED: 'resized',
    ORIENTATION_CHANGE: 'orientationchange',
    ADDED: 'added',
    SCROLL: 'scroll',
    SCROLLED: 'scrolled',
    REMOVED: 'removed',
  },
  VIEWS: {
    AXIS: 'axis',
    WRITING_MODE: 'writingMode',
    LOAD_ERROR: 'loaderror',
    RENDERED: 'rendered',
    RESIZED: 'resized',
    DISPLAYED: 'displayed',
    SHOWN: 'shown',
    HIDDEN: 'hidden',
    MARK_CLICKED: 'markClicked',
  },
  RENDITION: {
    STARTED: 'started',
    ATTACHED: 'attached',
    DISPLAYED: 'displayed',
    DISPLAY_ERROR: 'displayerror',
    RENDERED: 'rendered',
    REMOVED: 'removed',
    RESIZED: 'resized',
    ORIENTATION_CHANGE: 'orientationchange',
    LOCATION_CHANGED: 'locationChanged',
    RELOCATED: 'relocated',
    MARK_CLICKED: 'markClicked',
    SELECTED: 'selected',
    LAYOUT: 'layout',
  },
  LAYOUT: {
    UPDATED: 'updated',
  },
  ANNOTATION: {
    ATTACH: 'attach',
    DETACH: 'detach',
  },
};
