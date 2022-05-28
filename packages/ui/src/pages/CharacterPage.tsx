import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EncounterParticipant } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Content } from '../components/Content';
import { useConnection } from '../lib/connection';

export function CharacterPage() {
  console.log('Character Page');
  // const connection = useConnection();
  const navigate = useNavigate();
  // const authenticator = useAuthenticator();
  // const [participants, setParticipants] = useState<EncounterParticipant[]>();

  useEffect(() => {
    console.log('Character Page init');

    return () => {
      console.log('Character Page destroy');
    };
  }, [navigate]);

  return <Content>Character page</Content>;
}
