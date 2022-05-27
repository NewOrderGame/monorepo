import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EncounterParticipant, NogEvent } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Loader } from '../components/Loader';
import { Content } from '../components/Content';
import { useConnection } from '../lib/connection';

export function EncounterPage() {
  console.log('Encounter Page');
  const connection = useConnection();
  const navigate = useNavigate();
  const authenticator = useAuthenticator();
  const [participants, setParticipants] = useState<EncounterParticipant[]>();

  useEffect(() => {
    console.log('Encounter Page init');

    connection.encounter.emit(NogEvent.INIT);

    connection.encounter.on(NogEvent.INIT, ({ participants }) => {
      setParticipants(participants);
    });

    connection.encounter.on(NogEvent.REDIRECT, ({ page }) => {
      navigate(`/${page}`);
    });

    return () => {
      console.log('Encounter Page destroy');
      connection.encounter.off(NogEvent.INIT);
      connection.encounter.off(NogEvent.REDIRECT);
    };
  }, [navigate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    connection.encounter.emit(NogEvent.EXIT);
  }

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
}
