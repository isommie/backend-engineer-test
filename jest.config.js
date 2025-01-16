module.exports = {
    preset: 'ts-jest', // Use ts-jest to handle TypeScript files
    testEnvironment: 'node', // Specify the test environment
    roots: ['<rootDir>/src'], // Define the root folder for tests
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'], // Match test files
    moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Recognize these file extensions
    collectCoverage: true, // Collect test coverage
    coverageDirectory: 'coverage', // Specify the coverage output folder
    coveragePathIgnorePatterns: ['/node_modules/'], // Ignore node_modules for coverage
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Map @ to the src folder for cleaner imports
    },
    clearMocks: true, // Automatically clear mock calls and instances between tests
  };
  