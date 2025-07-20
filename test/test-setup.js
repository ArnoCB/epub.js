// Patch global DOMParser and XMLSerializer for tests
// Only patch DOMParser and XMLSerializer in Node.js, not in the browser
try {
  if (typeof window === 'undefined') {
    // In Node.js, patch global
    global.DOMParser = global.DOMParser || require('@xmldom/xmldom').DOMParser;
    global.XMLSerializer =
      global.XMLSerializer || require('@xmldom/xmldom').XMLSerializer;
  }
} catch (e) {
  // Fallback if require fails
}
