module.exports = {
  roots: ['<rootDir>/packages'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['**/node_modules/', '**/aws/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
