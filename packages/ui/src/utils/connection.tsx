import * as React from 'react';
import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import core from './core';
import { Socket } from 'socket.io-client';
import { Page, NogNamespace } from '@newordergame/common';
import { useNavigate } from 'react-router-dom';

type ConnectionContextType = {
  auth: Socket;
  world: Socket;
  encounter: Socket;
  connect: () => void;
  size: () => number;
};

const connectedNamespaces: Set<NogNamespace> = new Set();

export const ConnectionContext = React.createContext<ConnectionContextType>(
  {} as ConnectionContextType
);

export function ConnectionProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const authenticator = useAuthenticator();
  const navigate = useNavigate();

  const accessToken = authenticator.user
    .getSignInUserSession()
    ?.getAccessToken()
    ?.getJwtToken();

  function size() {
    return connectedNamespaces.size;
  }

  function connect() {
    if (connectedNamespaces.size === 0) {
      /**
       * Auth
       */
      core.auth.auth = {
        accessToken
      };
      console.log('Connecting to Auth...');
      core.auth.connect();

      core.auth.on('connect', () => {
        console.log('Connected to Auth');
        connectedNamespaces.add(NogNamespace.AUTH);
      });

      core.auth.on('disconnect', () => {
        console.log('Disconnected from Auth');
        connectedNamespaces.delete(NogNamespace.AUTH);
        if (connectedNamespaces.size === 0) {
          navigate(`/`);
        }
      });

      core.auth.on('redirect', ({ page }: { page: Page }) => {
        navigate(`/${page}`);
      });

      /**
       * World
       */
      console.log(`Connecting to World...`);
      core.world.auth = {
        accessToken
      };
      core.world.connect();

      core.world.on('connect', () => {
        console.log('Connected to World');
        connectedNamespaces.add(NogNamespace.WORLD);
      });

      core.world.on('disconnect', () => {
        console.log('Disconnected from World');
        connectedNamespaces.delete(NogNamespace.WORLD);
        if (connectedNamespaces.size === 0) {
          navigate(`/`);
        }
      });

      core.world.on('redirect', ({ page }: { page: Page }) => {
        navigate(`/${page}`);
      });

      /**
       * Encounter
       */
      console.log(`Connecting to Encounter...`);
      core.encounter.auth = {
        accessToken
      };
      core.encounter.connect();

      core.encounter.on('connect', () => {
        console.log('Connected to Encounter');
        connectedNamespaces.add(NogNamespace.ENCOUNTER);
      });

      core.encounter.on('disconnect', () => {
        console.log('Disconnected from Encounter');
        connectedNamespaces.delete(NogNamespace.ENCOUNTER);
        navigate(`/`);
      });

      core.encounter.on('redirect', ({ page }: { page: Page }) => {
        navigate(`/${page}`);
      });

      return () => {
        core.auth.off('connect');
        core.auth.off('disconnect');
        core.world.off('connect');
        core.world.off('disconnect');
        core.encounter.off('connect');
        core.encounter.off('disconnect');
      };
    }
  }

  function disconnect() {
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
    size
  };
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection(): ConnectionContextType {
  return React.useContext(ConnectionContext);
}
