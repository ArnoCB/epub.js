module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
  // Only run TypeScript spec files in src; ignore compiled tests in lib/
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dist/'],
};
