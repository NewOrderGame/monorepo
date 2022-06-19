import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EncounterParticipant, NogEvent } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Loader } from '../components/Loader';
import { Content } from '../components/Content';
import { useConnection } from '../lib/connection';
import logger from '../lib/utils/logger';

export const EncounterPage = () => {
  logger.info('Encounter Page');
  const connection = useConnection();
  const navigate = useNavigate();
  const authenticator = useAuthenticator();
  const [participants, setParticipants] = useState<EncounterParticipant[]>();

  useEffect(() => {
    logger.info('Encounter Page init');

    connection.gameSocket.emit(NogEvent.INIT_ENCOUNTER);

    connection.gameSocket.on(NogEvent.INIT_ENCOUNTER, ({ participants }) => {
      setParticipants(participants);
    });

    connection.gameSocket.on(NogEvent.REDIRECT, ({ page }) => {
      navigate(`/${page}`);
    });

    return () => {
      logger.info('Encounter Page destroy');
      connection.gameSocket.off(NogEvent.INIT_ENCOUNTER);
      connection.gameSocket.off(NogEvent.REDIRECT);
    };
  }, [connection.gameSocket, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    connection.gameSocket.emit(NogEvent.EXIT_ENCOUNTER);
  };

  const others = participants?.filter(
    (participant) => participant.characterId !== authenticator.user.username
  );

  return (
    <Content>
      {others ? (
        <>
          <h1>
            You met{' '}
            {others
              ?.map((other: EncounterParticipant) => other.nickname)
              .join(', ')}
            .
          </h1>
          <form onSubmit={handleSubmit}>
            <button type="submit">Move on</button>
          </form>
        </>
      ) : (
        <Loader />
      )}
    </Content>
  );
};
