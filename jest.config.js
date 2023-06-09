/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  rootDir: 'test',
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  verbose: true,
}

module.exports = config
