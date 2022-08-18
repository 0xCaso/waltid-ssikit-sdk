const {defaults} = require('jest-config');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'd.ts'],
  testMatch: [
    // if you want to test only ts files, use first line, else only the second
    '**/tests/**/*.test.(ts)',
    // '**/tests/**/*.test.(ts|js)'
  ],
};