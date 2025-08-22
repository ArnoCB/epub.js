#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    })
  );
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const fixturesSrc = path.join(projectRoot, 'test', 'fixtures');
  const fixturesDest = path.join(projectRoot, 'lib', 'test', 'fixtures');
  const testJsSrc = path.join(projectRoot, 'test');
  const testJsDest = path.join(projectRoot, 'lib', 'test');
  try {
    await copyDir(fixturesSrc, fixturesDest);
    // Also copy test JS files into lib/test
    await fs.promises.mkdir(testJsDest, { recursive: true });
    const entries = await fs.promises.readdir(testJsSrc, {
      withFileTypes: true,
    });
    await Promise.all(
      entries
        .filter((e) => e.isFile() && e.name.endsWith('.js'))
        .map((e) =>
          fs.promises.copyFile(
            path.join(testJsSrc, e.name),
            path.join(testJsDest, e.name)
          )
        )
    );
    console.log('Copied fixtures to', fixturesDest);
    console.log('Copied test JS to', testJsDest);
  } catch (err) {
    console.error('Error copying fixtures:', err);
    process.exit(1);
  }
}

main();
