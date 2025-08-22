This project no longer uses the legacy `test/fixtures` or Karma/Mocha tooling.

Current guidance

- Fixtures live under `e2e/fixtures` and tests should reference that path.
- The Jest unit tests run against `src/**/*.spec.ts` and Playwright e2e tests use `e2e/fixtures`.

Run tests:

npm run test:jest
npm run test:e2e

If you still have a CI job or other tooling that expects `test/fixtures`, either update it to `e2e/fixtures` or keep a temporary symlink until you migrate that environment.
