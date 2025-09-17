Node static server for examples

Created `scripts/serve-examples-node.js` — a minimal Node.js static file server that serves the `examples/` folder.

How to run:

```bash
# from repo root
node scripts/serve-examples-node.js 8082
```

This will serve the examples at http://localhost:8082/

Notes:

- Server sets a basic set of Content-Type headers and allows CORS.
- Simple path normalization prevents trivial path traversal.
- Use a different port if 8082 is in use.

Created by AI assistant as requested to provide a Node-based local server for testing the `prerendering-example.html` page.

## Container Styling Fix

Fixed issue where highlights and annotations were not visible in prerendered content.

### Problem

The main EPUB.js container element needed `background-color: transparent` and `z-index: 0` to ensure proper visibility of highlight overlays and SVG annotations.

### Solution

Modified `src/managers/helpers/stage.ts` to automatically apply these CSS properties:

- `background-color: transparent` - ensures highlight overlays are visible through container
- `z-index: 0` - prevents container from layering above highlight elements

### Location

File: `src/managers/helpers/stage.ts`, lines ~88-90 in the `create()` method.

### Cleanup

Removed redundant CSS injection code from `src/managers/prerendering/index.ts`:

- The `writeIframeContent` method previously injected highlight styles directly into each iframe
- This workaround is no longer needed since the container fix resolves the visibility issue
- Kept the Contents object creation as it's still needed for annotations API to work

### Testing

The container properties are now automatically applied to all EPUB.js containers (both default and prerendering managers). Test with `examples/test-prerendered-fix.html` to verify the properties are correctly applied.

### Result

Highlights and annotations are now consistently visible in prerendered content without requiring manual CSS overrides in user code. The solution is cleaner and more maintainable.
