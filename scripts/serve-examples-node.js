#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]) || 8082;
const projectRoot = path.resolve(__dirname, '..');
const examplesRoot = path.join(projectRoot, 'examples');
const root = projectRoot; // primary root is the project root; examples folder will be used as fallback

const mime = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  try {
    const reqUrl = decodeURIComponent(req.url.split('?')[0]);

    // Map root URL to the example index for convenience
    if (reqUrl === '/' || reqUrl === '') {
      // Default to the prerendering example
      const defaultExample = path.join(
        examplesRoot,
        'prerendering-example.html'
      );
      if (fs.existsSync(defaultExample)) {
        const data = fs.readFileSync(defaultExample);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(data);
        return;
      }
    }

    // Prevent path traversal and normalize the requested path
    const safePath = path
      .normalize(reqUrl)
      .replace(/^\/+/, '')
      .replace(/\.{2,}/g, '');

    // Try resolving from project root first, then examples folder as fallback
    let filePath = path.join(projectRoot, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        // Try fallback to examples folder (allow requests like /prerendering-example.html)
        const altPath = path.join(examplesRoot, safePath);
        try {
          const altStats = fs.statSync(altPath);
          if (altStats.isDirectory()) {
            filePath = path.join(altPath, 'index.html');
          } else {
            filePath = altPath;
          }
        } catch (e) {
          res.statusCode = 404;
          res.end('404 - Not Found');
          return;
        }
      } else {
        // Only inspect stats if fs.stat succeeded
        if (stats && stats.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('500 - Internal Server Error');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        console.log('[serve-examples-node] Served:', filePath);
        res.end(data);
      });
    });
  } catch (e) {
    res.statusCode = 400;
    res.end('400 - Bad Request');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving ${root} at http://localhost:${port}/`);
  console.log('Press Ctrl+C to stop');
});
