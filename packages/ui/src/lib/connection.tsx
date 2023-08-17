import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import core from './core';
import { Socket } from 'socket.io-client';
import { NogEvent, NogPage } from '@newordergame/common';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import logger from './utils/logger';

export type Connection = {
  gameSocket: Socket;
};

export const ConnectionContext = React.createContext<Connection>(
  {} as Connection
);

export const ConnectionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [connected, setConnected] = useState(false);
  const authenticator = useAuthenticator();
  const navigate = useNavigate();
  const gameSocket = core.gameSocket;

  window.signOut = authenticator.signOut;

  const accessToken =
    authenticator.user
      .getSignInUserSession()
      ?.getAccessToken()
      ?.getJwtToken() || '';

  const value = {
    gameSocket
  };

  useInitConnection(
    connect(accessToken, gameSocket, navigate, setConnected),
    disconnect(gameSocket)
  );

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

const connect =
  (
    accessToken: string,
    gameSocket: Socket,
    navigate: NavigateFunction,
    setConnected: (connected: boolean) => void
  ) =>
  () => {
    gameSocket.auth = {
      accessToken
    };
    logger.info('Connecting to Game...');
    gameSocket.on(NogEvent.CONNECT, handleConnect());
    gameSocket.on(NogEvent.CONNECTED, handleConnected(setConnected));
    gameSocket.on(
      NogEvent.DISCONNECT,
      handleDisconnect(setConnected, navigate)
    );
    gameSocket.on(NogEvent.REDIRECT, handleRedirect(setConnected, navigate));

    /** Comment/Uncomment this if necessary */
    // core.gameSocket.onAny((event, ...args) => {
    //   logger.debug({ event, args }, 'event');
    // });
    /** */

    gameSocket.connect();

    return () => {
      gameSocket.off(NogEvent.CONNECT);
      gameSocket.off(NogEvent.CONNECTED);
      gameSocket.off(NogEvent.DISCONNECT);
      gameSocket.off(NogEvent.REDIRECT);
    };
  };

const disconnect = (gameSocket: Socket) => () => {
  gameSocket.disconnect();
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
