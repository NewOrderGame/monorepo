import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EncounterParticipant } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Loader } from '../components/Loader';
import { Content } from '../components/Content';
import { useConnection } from '../utils/connection';

export function EncounterPage() {
  console.log('Encounter Page');
  const connection = useConnection();
  const navigate = useNavigate();
  const authenticator = useAuthenticator();
  const [participants, setParticipants] = useState<EncounterParticipant[]>();

  useEffect(() => {
    console.log('Encounter Page init');

    connection.encounter.emit('init');

    connection.encounter.on('init', ({ participants }) => {
      setParticipants(participants);
    });

    connection.encounter.on('redirect', ({ page }) => {
      navigate(`/${page}`);
    });

    return () => {
      console.log('Encounter Page destroy');
      connection.encounter.off('init');
      connection.encounter.off('redirect');
    };
  }, [navigate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    connection.encounter.emit('exit');
  }

  const others = participants?.filter(
    (participant) => participant.characterId !== authenticator.user.username
  );

  return (
    <Content>
      {others ? (
        <>
          <h1>
            You have met{' '}
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
