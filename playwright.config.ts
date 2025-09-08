import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  timeout: 45_000, // Increased for local EPUB file loading
  expect: {
    timeout: 10_000,
  },
  // Enable parallel execution with multiple workers
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4, // More workers locally, fewer in CI
  // Retry failed tests
  retries: process.env.CI ? 2 : 1,
  // Reporter configuration
  reporter: [['line'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:9877',
    // Add screenshot on failure for debugging
    screenshot: 'only-on-failure',
    // Faster navigation timeouts
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Serve the repository root so /dist/epub.js and /lib/epub.js are reachable
    command: 'npx http-server -p 9877 -c-1 --cors',
    port: 9877,
    timeout: 30_000,
    // Allow using an already-running server (non-destructive)
    reuseExistingServer: true,
  },
};

export default config;
