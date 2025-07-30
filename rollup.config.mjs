import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default [
  // ESM build
  {
    input: 'src/epub.js',
    output: {
      file: 'dist/epub.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), babel({ exclude: 'node_modules/**' })],
  },
  // UMD build
  {
    input: 'src/epub.js',
    output: {
      file: 'dist/epub.umd.js',
      format: 'umd',
      name: 'ePub',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), babel({ exclude: 'node_modules/**' })],
  },
];
