/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config.js');

module.exports = {
  ...baseConfig,
  displayName: 'ui',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
