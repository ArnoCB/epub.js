import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  timeout: 30_000,
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:9876',
  },
  webServer: {
    // Serve the repository root so /dist/epub.js and /lib/epub.js are reachable
    command: 'npx http-server -p 9876 -c-1',
    port: 9876,
    timeout: 30_000,
    // Allow using an already-running server (non-destructive)
    reuseExistingServer: true,
  },
};

export default config;
