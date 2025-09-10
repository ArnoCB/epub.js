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
