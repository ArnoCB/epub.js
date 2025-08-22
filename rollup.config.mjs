import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import nodePolyfills from 'rollup-plugin-node-polyfills';

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
    ],
  },
];
