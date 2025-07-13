module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
