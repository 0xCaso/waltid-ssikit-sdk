/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    // if you want to test only ts files, use first line, else only the second
    '**/tests/**/*.test.(ts)',
    // '**/tests/**/*.test.(ts|js)'
  ],
};