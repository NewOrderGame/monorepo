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

    connection.gameSocket.emit(NogEvent.INIT_ENCOUNTER_PAGE);

    connection.gameSocket.on(
      NogEvent.INIT_ENCOUNTER_PAGE,
      ({ participants }) => {
        setParticipants(participants);
      }
    );

    return () => {
      logger.info('Encounter Page destroy');
      connection.gameSocket.off(NogEvent.INIT_ENCOUNTER_PAGE);
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
            You have encountered{' '}
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
