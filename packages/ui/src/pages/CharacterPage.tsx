import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../components/Content';
import { Field, Form, Formik } from 'formik';
import styled from 'styled-components';
import { useConnection } from '../lib/connection';
import { NogEvent } from '@newordergame/common';
import { useAuthenticator } from '@aws-amplify/ui-react';

export const CharacterPage = () => {
  console.log('Character Page');
  const connection = useConnection();
  const navigate = useNavigate();
  const authenticator = useAuthenticator();

  useEffect(() => {
    console.log('Character Page init');

    return () => {
      console.log('Character Page destroy');
    };
  }, [navigate]);

  const initialValues = {
    0: 0,
    1: 0,
    2: 0
  };

  const handleSubmit = (outlook: { 0: number; 1: number; 2: number }) => {
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

  return (
    <Content>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
