import * as React from 'react';
import { useEffect } from 'react';
import { Content } from '../components/Content';
import { Loader } from '../components/Loader';
import { Connection, useConnection } from '../lib/connection';
import logger from '../lib/utils/logger';

export const RootPage = () => {
  logger.info('Root Page');
  const connection = useConnection();
  useInitRootPage(connection);

  return (
    <Content>
      <Loader />
    </Content>
  );
};

const useInitRootPage = (connection: Connection) => {
  useEffect(() => {
    logger.info('Root Page init');

    return () => {
      logger.info('Root Page destroy');
    };
  }, [connection]);
};
