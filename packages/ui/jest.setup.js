// jest.setup.js

// Mock for window.URL.createObjectURL
// eslint-disable-next-line no-undef
window.URL.createObjectURL = jest.fn();

// eslint-disable-next-line no-undef
jest.mock('@aws-amplify/ui-react');
