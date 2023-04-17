/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  rootDir: 'tests',
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  verbose: true,
}

module.exports = config
