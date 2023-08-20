import * as React from 'react';
import { useEffect, useState } from 'react';
import core from './core';
import { Socket } from 'socket.io-client';
import { NogEvent, NogPage } from '@newordergame/common';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import logger from './utils/logger';
import { useAuthenticator } from './hooks/useAuthenticator';

export type Connection = {
  gameSocket: Socket;
};

export const ConnectionContext = React.createContext<Connection>(
  {} as Connection
);

export const useSocketConnection = (
  accessToken: string,
  navigate: NavigateFunction
) => {
  const [connected, setConnected] = useState(false);
  const gameSocket = core.gameSocket;

  useEffect(() => {
    gameSocket.auth = { accessToken };

    gameSocket.on(NogEvent.CONNECT, handleConnect());
    gameSocket.on(NogEvent.CONNECTED, handleConnected(setConnected));
    gameSocket.on(
      NogEvent.DISCONNECT,
      handleDisconnect(setConnected, navigate)
    );
    gameSocket.on(NogEvent.REDIRECT, handleRedirect(setConnected, navigate));

    gameSocket.connect();

    return () => {
      gameSocket.off(NogEvent.CONNECT);
      gameSocket.off(NogEvent.CONNECTED);
      gameSocket.off(NogEvent.DISCONNECT);
      gameSocket.off(NogEvent.REDIRECT);
    };
  }, []);

  return { connected, gameSocket };
};

export const ConnectionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const authenticator = useAuthenticator();
  const navigate = useNavigate();

  const accessToken =
    authenticator.user
      .getSignInUserSession()
      ?.getAccessToken()
      ?.getJwtToken() || '';
  const { connected, gameSocket } = useSocketConnection(accessToken, navigate);

  const value = { gameSocket };

  return (
    <ConnectionContext.Provider value={value}>
      {connected && children}
    </ConnectionContext.Provider>
  );
};

export const useInitConnection = (
  connect: () => void,
  disconnect: () => void
) => {
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);
};

const handleConnect = () => () => {
  logger.info('Starting connection...');
};

const handleConnected = (setConnected: (connected: boolean) => void) => () => {
  logger.info('Connected!');
  setConnected(true);
};

const handleDisconnect =
  (setConnected: (connected: boolean) => void, navigate: NavigateFunction) =>
  () => {
    logger.info('Disconnected');
    setConnected(false);
    navigate('/');
  };

const handleRedirect =
  (setConnected: (connected: boolean) => void, navigate: NavigateFunction) =>
  ({ page }: { page: NogPage }) => {
    const path = `/${page}`;
    if (window.location.pathname !== path) {
      navigate(path);
    }
  };

export const useConnection = (): Connection => {
  return React.useContext(ConnectionContext);
};
