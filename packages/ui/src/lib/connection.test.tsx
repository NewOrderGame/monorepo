import { renderHook } from '@testing-library/react-hooks';
import core from './core'; // Assuming there's a GameSocket type export from 'core'.
import {
  useSocketConnection,
  ConnectionProvider,
  useInitConnection
} from './connection';
import { act } from 'react-test-renderer';
import { render } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from './hooks/useAuthenticator';
import { Socket } from 'socket.io-client';

jest.mock('socket.io-client');
jest.mock('react-router-dom');
jest.mock('./core', () => {
  const gameSocket: Partial<Socket> = {
    on: jest.fn(),
    off: jest.fn(),
    connect: jest.fn(),
    auth: {}
  };
  return { gameSocket };
});
jest.mock('./utils/logger');
jest.mock('./hooks/useAuthenticator', () => ({
  useAuthenticator: jest.fn()
}));

describe('useSocketConnection', () => {
  it('should handle connection events', () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    renderHook(() => useSocketConnection('fakeAccessToken', navigateMock));

    expect(core.gameSocket.on).toHaveBeenCalledWith(
      'connect',
      expect.any(Function)
    );
    expect(core.gameSocket.on).toHaveBeenCalledWith(
      'connected',
      expect.any(Function)
    );
    // ... and so on for other events
  });

  // Add more tests to check the behaviors of the event callbacks if needed.
});

describe('ConnectionProvider', () => {
  it('renders children when connected', () => {
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useAuthenticator as jest.Mock).mockReturnValue({
      user: {
        getSignInUserSession: jest.fn().mockReturnValue({
          getAccessToken: jest.fn().mockReturnValue({
            getJwtToken: jest.fn().mockReturnValue('mockToken')
          })
        })
      },
      signOut: jest.fn()
    });
    const { queryByText } = render(
      <ConnectionProvider>Test Children</ConnectionProvider>
    );

    act(() => {
      const connectedCallback = (
        core.gameSocket.on as unknown as jest.Mock
      ).mock.calls.find(([event]) => event === 'connected')[1];
      connectedCallback();
    });

    expect(queryByText('Test Children')).not.toBeNull();
  });

  it('should handle disconnect events', () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    renderHook(() => useSocketConnection('fakeAccessToken', navigateMock));
    act(() => {
      const disconnectCallback = (
        core.gameSocket.on as unknown as jest.Mock
      ).mock.calls.find(([event]) => event === 'disconnect')[1];
      disconnectCallback();
    });
    // Expect something after disconnection, maybe a cleanup or a reconnection attempt
  });

  it('cleans up listeners on unmount', () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    const { unmount } = renderHook(() =>
      useSocketConnection('fakeAccessToken', navigateMock)
    );
    unmount();
    expect(core.gameSocket.off).toHaveBeenCalled(); // assuming `off` is used for cleanup
  });
});

describe('useInitConnection', () => {
  it('should call connect on mount and disconnect on unmount', () => {
    const connectMock = jest.fn();
    const disconnectMock = jest.fn();

    const { unmount } = renderHook(() =>
      useInitConnection(connectMock, disconnectMock)
    );

    expect(connectMock).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
