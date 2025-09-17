# Playwright-tested code iteration template

## Purpose

Short, repeatable checklist for making code changes that need verification with Playwright e2e tests. Follow these steps in order so builds and tests stay consistent.

## Checklist

1. Change code
   - Make edits in `src/` or other project files.

2. Build the library (full build)
   - Run the canonical library build before running e2e tests so distributed/compiled outputs are up to date:

```bash
npm run build:lib
```

Notes:

- `npm run build:lib` runs the project's TypeScript build and rollup bundling. Use this to ensure tests exercise the built artifacts.
- Avoid using partial `tsc` commands unless you explicitly know the change doesn't affect distributed files.

3. Run Playwright tests (headless)

Playwright runs headless by default. Use the exact command below to run a single spec and get compact diagnostics:

```bash
# Run a single spec headless and show a compact list reporter
npx playwright test e2e/suites/prerenderer-page-metadata.spec.ts -c playwright.config.ts --reporter=list

# Or run the full e2e suite (headless)
npx playwright test -c playwright.config.ts --reporter=list
```

## Common pitfalls / tips

- Do not use `--headed=false` (Playwright doesn't accept that flag); pass `--headed` to run in headed mode.
- If tests load compiled assets from `dist/` or `lib/`, always run `npm run build:lib` first.
- For flaky tests, prefer explicit waits for DOM conditions (e.g. waitForFunction) over arbitrary timeouts.
- To capture browser console logs in Node output, attach `page.on('console', ...)` in the spec.

## Quick copy/paste checklist

```bash
# 1) change code

# 2) build (full)
npm run build:lib

# 3) run playwright headless for the target spec (example)
npx playwright test e2e/suites/prerenderer-page-metadata.spec.ts -c playwright.config.ts --reporter=list
```

## Optional: npm helper script

Add to `package.json`:

```json
"scripts": {
  "test:e2e:headless": "playwright test -c playwright.config.ts --reporter=list"
}
```

Then run:

```bash
npm run build:lib && npm run test:e2e:headless
```

Use this document as the canonical iteration template to avoid mistaken build/test steps.
