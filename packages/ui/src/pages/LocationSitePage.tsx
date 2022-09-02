import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../components/Content';
import { useConnection } from '../lib/connection';
import { useAuthenticator } from '@aws-amplify/ui-react';
import logger from '../lib/utils/logger';

export const LocationSitePage = () => {
  logger.info('Location Site Page');
  const connection = useConnection();
  const navigate = useNavigate();
  const authenticator = useAuthenticator();

  useEffect(() => {
    logger.info('Character Page init');

    return () => {
      logger.info('Character Page destroy');
    };
  }, [navigate]);

  return (
    <Content>
      <div>hello!</div>
    </Content>
  );
};
