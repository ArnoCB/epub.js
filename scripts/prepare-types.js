#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.lstatSync(full).isDirectory()) rmDir(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(dir);
}

// copyDir helper removed (not used)

// renameDir helper removed (not used)

const { execSync } = require('child_process');

const mode = process.argv[2] || 'build';
const root = path.resolve(__dirname, '..');
const types = path.join(root, 'types');

try {
  if (mode === 'build') {
    // Remove existing types folder to ensure clean declarations
    if (fs.existsSync(types)) {
      console.log('Removing existing `types`');
      rmDir(types);
    }

    // Emit declaration files using tsc. tsconfig.json sets declarationDir to "types"
    console.log('Running tsc to emit declaration files...');
    execSync(
      'npx tsc --emitDeclarationOnly --declaration --declarationDir types',
      {
        stdio: 'inherit',
        cwd: root,
      }
    );

    console.log('Build types (tsc) complete.');
    process.exit(0);
  }

  console.error('Unknown mode:', mode);
  process.exit(2);
} catch (err) {
  console.error(err);
  process.exit(1);
}
