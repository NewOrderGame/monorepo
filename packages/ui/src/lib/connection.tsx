import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import core from './core';
import { Socket } from 'socket.io-client';
import { NogEvent, NogPage } from '@newordergame/common';
import { useNavigate } from 'react-router-dom';
import logger from './utils/logger';

type ConnectionContextType = {
  gameSocket: Socket;
  connect: () => void;
};

export const ConnectionContext = React.createContext<ConnectionContextType>(
  {} as ConnectionContextType
);

declare global {
  interface Window {
    signOut: () => void;
  }
}

export const ConnectionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const authenticator = useAuthenticator();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);

  window.signOut = authenticator.signOut;

  const accessToken = authenticator.user
    .getSignInUserSession()
    ?.getAccessToken()
    ?.getJwtToken();

  const handleConnect = () => {
    logger.info('Starting connection...');
  };

  const handleConnected = () => {
    logger.info('Connected!');
    setConnected(true);
  };

  const handleDisconnect = () => {
    logger.info('Disconnected');
    setConnected(false);
    navigate('/');
  };

  const handleRedirect = ({ page }: { page: NogPage }) => {
    const path = `/${page}`;
    if (window.location.pathname !== path) {
      logger.trace('Redirect', { page });
      navigate(path);
    }
  };

  const connect = useCallback(() => {
    core.gameSocket.auth = {
      accessToken
    };
    logger.info('Connecting to Game...');
    core.gameSocket.on(NogEvent.CONNECT, handleConnect);
    core.gameSocket.on(NogEvent.CONNECTED, handleConnected);
    core.gameSocket.on(NogEvent.DISCONNECT, handleDisconnect);
    core.gameSocket.on(NogEvent.REDIRECT, handleRedirect);

    /** Comment/Uncomment this if necessary */
    // core.gameSocket.onAny((event, ...args) => {
    //   logger.debug('event', { event, args });
    // });
    /** */

    core.gameSocket.connect();

    return () => {
      core.gameSocket.off(NogEvent.CONNECT);
      core.gameSocket.off(NogEvent.CONNECTED);
      core.gameSocket.off(NogEvent.DISCONNECT);
      core.gameSocket.off(NogEvent.REDIRECT);
    };
  }, [accessToken, core.gameSocket]);

  const disconnect = () => {
    core.gameSocket.disconnect();
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [accessToken, connect]);

  const value = {
    gameSocket: core.gameSocket,
    connect
  };

  return (
    <ConnectionContext.Provider value={value}>
      {connected && children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextType => {
  return React.useContext(ConnectionContext);
};
