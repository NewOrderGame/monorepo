/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../jest.config.js');

module.exports = {
  ...baseConfig,
  displayName: 'common',
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/aws/']
  // ... any other overrides ...
};
