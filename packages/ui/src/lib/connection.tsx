import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import core from './core';
import { Socket } from 'socket.io-client';
import { NogEvent, NogPage } from '@newordergame/common';
import { useNavigate } from 'react-router-dom';

type ConnectionContextType = {
  gameSocket: Socket;
  connect: () => void;
};

export const ConnectionContext = React.createContext<ConnectionContextType>(
  {} as ConnectionContextType
);

export const ConnectionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const authenticator = useAuthenticator();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);

  const accessToken = authenticator.user
    .getSignInUserSession()
    ?.getAccessToken()
    ?.getJwtToken();

  const handleConnect = () => {
    console.log('Connection started...');
  };

  const handleConnected = () => {
    console.log('Connected!');
    setConnected(true);
  };

  const handleDisconnect = () => {
    console.log('Disconnected');
    setConnected(false);
    navigate('/');
  };

  const handleRedirect = ({ page }: { page: NogPage }) => {
    const path = `/${page}`;
    if (window.location.pathname !== path) {
      navigate(path);
    }
  };

  const connect = () => {
    core.gameSocket.auth = {
      accessToken
    };
    console.log('Connecting to Game...');
    core.gameSocket.on(NogEvent.CONNECT, handleConnect);
    core.gameSocket.on(NogEvent.CONNECTED, handleConnected);
    core.gameSocket.on(NogEvent.DISCONNECT, handleDisconnect);
    core.gameSocket.on(NogEvent.REDIRECT, handleRedirect);
    core.gameSocket.connect();

    return () => {
      core.gameSocket.off(NogEvent.CONNECT);
      core.gameSocket.off(NogEvent.CONNECTED);
      core.gameSocket.off(NogEvent.DISCONNECT);
      core.gameSocket.off(NogEvent.REDIRECT);
    };
  };

  const disconnect = () => {
    core.gameSocket.disconnect();
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [accessToken]);

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
