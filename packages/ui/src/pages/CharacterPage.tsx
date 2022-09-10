import * as React from 'react';
import { useEffect } from 'react';
import { Content } from '../components/Content';
import { Field, Form, Formik } from 'formik';
import styled from 'styled-components';
import { Connection, useConnection } from '../lib/connection';
import { NogEvent, Outlook } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';
import logger from '../lib/utils/logger';
import {
  AuthenticatorContext
} from '@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator';

const INITIAL_VALUES = {
  0: 0,
  1: 0,
  2: 0
};

export const CharacterPage = () => {
  logger.info('Character Page');
  const connection = useConnection();
  const authenticator = useAuthenticator();

  useInitCharacterPage();

  return (
    <Content>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit(connection, authenticator)}
      >
        <CharacterForm>
          <CharacterFormField>
            <label htmlFor="0">Good / Bad</label>
            <Field name="0" type="number" min="-10" max="10" />
          </CharacterFormField>
          <CharacterFormField>
            <label htmlFor="1">New / Old</label>
            <Field name="1" type="number" min="-10" max="10" />
          </CharacterFormField>
          <CharacterFormField>
            <label htmlFor="2">Order / Chaos</label>
            <Field name="2" type="number" min="-10" max="10" />
          </CharacterFormField>
          <CharacterFormButton type="submit">Submit</CharacterFormButton>
        </CharacterForm>
      </Formik>
    </Content>
  );
};

const useInitCharacterPage = () => {
  useEffect(() => {
    logger.info('Character Page init');

    return () => {
      logger.info('Character Page destroy');
    };
  }, []);
};

const handleSubmit =
  (connection: Connection, authenticator: AuthenticatorContext) =>
  (outlook: Outlook) => {
    const accessToken = authenticator.user
      .getSignInUserSession()
      ?.getAccessToken()
      ?.getJwtToken();

    connection.gameSocket.emit(NogEvent.CREATE_CHARACTER, {
      accessToken,
      characterId: authenticator.user.username,
      stats: { outlook }
    });
  };

const CharacterForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const CharacterFormButton = styled.button`
  width: 100%;
`;

const CharacterFormField = styled.div`
  margin-bottom: 10px;

  label {
    margin-right: 20px;
  }

  input {
    width: 50px;
  }
`;
