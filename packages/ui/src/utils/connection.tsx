import * as React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import core from './core';
import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { Page } from '../../../common';
import { useNavigate } from 'react-router-dom';

export type ConnectionContextType = {
  auth: Socket;
  world: Socket;
  encounter: Socket;
};

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

  useEffect(() => {
    // Auth
    core.auth.auth = {
      accessToken
    };
    console.log('Connecting to Auth...');
    core.auth.connect();

    core.auth.on('connect', () => {
      console.log('Connected to Auth');
    });

    core.auth.on('disconnect', () => {
      console.log('Disconnected from Auth');
    });

    core.auth.on('redirect', ({ page }: { page: Page }) => {
      navigate(`/${page}`);
    });

    // World
    console.log(`Connecting to World...`);
    core.world.auth = {
      accessToken
    };
    core.world.connect();

    core.world.on('connect', () => {
      console.log('Connected to World');
    });

    core.world.on('disconnect', () => {
      console.log('Disconnected from World');
    });

    core.world.on('redirect', ({ page }: { page: Page }) => {
      navigate(`/${page}`);
    });

    // Encounter
    console.log(`Connecting to Encounter...`);
    core.encounter.auth = {
      accessToken
    };
    core.encounter.connect();

    core.encounter.on('connect', () => {
      console.log('Connected to Encounter');
    });

    core.encounter.on('disconnect', () => {
      console.log('Disconnected from Encounter');
    });

    core.encounter.on('redirect', ({ page }: { page: Page }) => {
      navigate(`/${page}`);
    });

    return () => {
      core.auth.off('connect');
      core.auth.off('disconnect');
      core.world.off('connect');
      core.world.off('connect');
      core.encounter.off('disconnect');
      core.encounter.off('disconnect');
    };
  }, [accessToken]);

  const value = {
    auth: core.auth,
    world: core.world,
    encounter: core.encounter
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
