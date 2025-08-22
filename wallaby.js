module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      '!src/**/*.spec.ts',
      { pattern: 'e2e/fixtures/**/*', instrument: false },
      'package.json',
      'tsconfig.json',
      'tsconfig.jest.json',
    ],

    tests: ['src/**/*.spec.ts'],

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({ module: 'commonjs' }),
    },

    debug: false,
  };
};
