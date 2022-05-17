import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import core from '../utils/core';
import { EncounterParticipant } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function EncounterPage() {
  console.log('Encounter Page');
  const navigate = useNavigate();
  const authenticator = useAuthenticator();
  const [participants, setParticipants] = useState<EncounterParticipant[]>();

  useEffect(() => {
    console.log('Encounter Page init');

    core.encounter.emit('init');

    core.encounter.on('init', ({ participants }) => {
      setParticipants(participants);
    });

    core.encounter.on('redirect', ({ page }) => {
      navigate(`/${page}`);
    });

    return () => {
      console.log('Encounter Page destroy');
      core.encounter.off('init');
      core.encounter.off('redirect');
    };
  }, [navigate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    core.encounter.emit('exit');
  }

  const others = participants?.filter(
    (participant) => participant.characterId !== authenticator.user.username
  );

  return others ? (
    <div>
      <h1>
        You got hit by{' '}
        {others
          ?.map((other: EncounterParticipant) => other.nickname)
          .join(', ')}
      </h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">LET ME OUT!</button>
      </form>
    </div>
  ) : (
    <div>Loading...</div>
  );
}