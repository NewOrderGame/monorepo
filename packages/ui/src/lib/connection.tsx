import * as React from 'react';
import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import core from './core';
import { Socket } from 'socket.io-client';
import { NogEvent, NogNamespace, NogPage } from '@newordergame/common';
import { useNavigate } from 'react-router-dom';

type ConnectionContextType = {
  auth: Socket;
  world: Socket;
  encounter: Socket;
  connect: () => void;
  isConnected: () => boolean;
};

const connectedNamespaces: Set<NogNamespace> = new Set();

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

  const accessToken = authenticator.user
    .getSignInUserSession()
    ?.getAccessToken()
    ?.getJwtToken();

  const handleRedirect = ({page}: { page: NogPage }) => {
    navigate(`/${page}`);
  };

  const handleConnect = (namespace: NogNamespace) => () => {
    console.log(`Connected to ${namespace}`);
    connectedNamespaces.add(namespace);
  };

  const handleDisconnect = (namespace: NogNamespace) => () => {
    console.log(`Disconnected from ${namespace}`);
    connectedNamespaces.delete(namespace);
    if (connectedNamespaces.size === 0) {
      navigate(`/`);
    }
  };

  const isConnected = (): boolean => {
    return connectedNamespaces.size !== 0;
  }

  const connect = () => {
    if (connectedNamespaces.size === 0) {
      /**
       * Auth
       */
      core.auth.auth = {
        accessToken
      };
      console.log('Connecting to Auth...');
      core.auth.connect();
      core.auth.on(NogEvent.CONNECT, handleConnect(NogNamespace.AUTH));
      core.auth.on(NogEvent.DISCONNECT, handleDisconnect(NogNamespace.AUTH));
      core.auth.on(NogEvent.REDIRECT, handleRedirect);

      /**
       * World
       */
      console.log(`Connecting to World...`);
      core.world.auth = {
        accessToken
      };
      core.world.connect();
      core.world.on(NogEvent.CONNECT, handleConnect(NogNamespace.WORLD));
      core.world.on(NogEvent.DISCONNECT, handleDisconnect(NogNamespace.WORLD));
      core.world.on(NogEvent.REDIRECT, handleRedirect);

      /**
       * Encounter
       */
      console.log(`Connecting to Encounter...`);
      core.encounter.auth = {
        accessToken
      };
      core.encounter.connect();
      core.encounter.on(
        NogEvent.CONNECT,
        handleConnect(NogNamespace.ENCOUNTER)
      );
      core.encounter.on(
        NogEvent.DISCONNECT,
        handleDisconnect(NogNamespace.ENCOUNTER)
      );
      core.encounter.on(NogEvent.REDIRECT, handleRedirect);

      return () => {
        core.auth.off(NogEvent.CONNECT);
        core.auth.off(NogEvent.DISCONNECT);
        core.world.off(NogEvent.CONNECT);
        core.world.off(NogEvent.DISCONNECT);
        core.encounter.off(NogEvent.CONNECT);
        core.encounter.off(NogEvent.DISCONNECT);
      };
    }
  }

  const disconnect = () => {
    core.auth.disconnect();
    core.world.disconnect();
    core.encounter.disconnect();
  }

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [accessToken]);

  const value = {
    auth: core.auth,
    world: core.world,
    encounter: core.encounter,
    connect,
    isConnected
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = (): ConnectionContextType => {
  return React.useContext(ConnectionContext);
}
