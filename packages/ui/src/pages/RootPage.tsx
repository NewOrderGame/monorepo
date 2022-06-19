import * as React from 'react';
import { useEffect } from 'react';
import { Content } from '../components/Content';
import { Loader } from '../components/Loader';
import { useConnection } from '../lib/connection';
import logger from "../lib/utils/logger";

export const RootPage = () => {
  logger.info('Root Page');
  const connection = useConnection();

  useEffect(() => {
    logger.info('Root Page init');

    return () => {
      logger.info('Root Page destroy');
    };
  }, [connection]);

  return (
    <Content>
      <Loader />
    </Content>
  );
};
