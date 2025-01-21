module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Specify the test environment
  roots: ['<rootDir>/src'], // Define the root folders for tests
  testMatch: [
    '**/tests/**/*.test.ts', // Match test files in the tests folder
    '**/?(*.)+(spec|test).ts', // Match spec or test files in any folder
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Recognize these file extensions
  collectCoverage: true, // Collect test coverage
  coverageDirectory: 'coverage', // Specify the coverage output folder
  coveragePathIgnorePatterns: ['/node_modules/'], // Ignore node_modules for coverage
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @ to the src folder for cleaner imports
  },
  clearMocks: true, // Automatically clear mock calls and instances between tests
  testTimeout: 30000, // Set default timeout to 30 seconds
};
