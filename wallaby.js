module.exports = function (_wallaby) {
  return {
    files: [
      'src/**/*.js',
      { pattern: 'test/fixtures/**/*', instrument: false },
      '!test/**/*.js',
    ],
    tests: ['test/**/*.js'],
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: 'mocha',
    setup: function () {
      // Optional: global setup for tests
    },
  };
};
