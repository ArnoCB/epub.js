'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.debounce = debounce;
exports.throttle = throttle;
/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last invocation.
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every specified wait time.
 */
function throttle(func, wait) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
