import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// Plugin to extract and re-export named exports from the CommonJS entry
const extractNamedExports = () => ({
  name: 'extract-named-exports',
  renderChunk(code) {
    // Add explicit named exports at the end
    const namedExports = `
export { epub as default, epub as ePub };
export const Book = epub.Book;
export const Rendition = epub.Rendition;
export const Contents = epub.Contents;
export const CFI = epub.CFI;
export const EpubCFI = epub.CFI;
export const VERSION = epub.VERSION;
`;
    return code.replace('export { epub as default };', namedExports);
  },
});

export default [
  // ESM build
  {
    input: 'lib/epub.js',
    output: {
      file: 'dist/epub.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodePolyfills(),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: ['node_modules/**', 'lib/**'],
        transformMixedEsModules: true,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
      }),
      extractNamedExports(),
    ],
  },
  // UMD build
  {
    input: 'lib/epub.js',
    output: {
      file: 'dist/epub.umd.js',
      format: 'umd',
      name: 'ePub',
      sourcemap: true,
    },
    plugins: [
      nodePolyfills(),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: ['node_modules/**', 'lib/**'],
        transformMixedEsModules: true,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
      }),
      extractNamedExports(),
    ],
  },
];
