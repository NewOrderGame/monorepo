import * as React from 'react';
import { render } from '@testing-library/react';

// Mocking the modules and hooks you're using
jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('./core', () => ({
  gameSocket: {
    auth: {},
    on: jest.fn(),
    off: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn()
  }
}));

jest.mock('./utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn()
}));

jest.mock('socket.io-client');

import { ConnectionProvider, useInitConnection } from './connection'; // Update this import path!

describe('ConnectionProvider', () => {
  // Set up any common mocks here
  beforeEach(() => {
    // Reset all mocked functions before each test
    jest.clearAllMocks();
  });

  it('should correctly initialize ConnectionProvider', () => {
    const useAuthenticatorMock =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@aws-amplify/ui-react').useAuthenticator;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useNavigateMock = require('react-router-dom').useNavigate;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const gameSocketMock = require('./core').gameSocket;

    useAuthenticatorMock.mockReturnValue({
      user: {
        getSignInUserSession: jest.fn().mockReturnValue({
          getAccessToken: jest.fn().mockReturnValue({
            getJwtToken: jest.fn().mockReturnValue('test-token')
          })
        }),
        signOut: jest.fn()
      }
    });
    useNavigateMock.mockReturnValue(jest.fn());

    render(<ConnectionProvider>Test Children</ConnectionProvider>);
    expect(gameSocketMock.on).toHaveBeenCalledTimes(4); // Check if socket has 4 listeners
  });

  // TODO: More tests for connect, disconnect, handle methods, and useConnection hook
});

// Example for testing the useInitConnection hook:
describe('useInitConnection', () => {
  it('should call connect and disconnect on cleanup', () => {
    const connectMock = jest.fn();
    const disconnectMock = jest.fn();

    function TestComponent() {
      useInitConnection(connectMock, disconnectMock);
      return null;
    }

    const { unmount } = render(<TestComponent />);
    expect(connectMock).toHaveBeenCalledTimes(1);

    unmount(); // simulates the component being unmounted
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
