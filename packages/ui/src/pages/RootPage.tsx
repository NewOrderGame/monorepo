import * as React from 'react';
import { useEffect } from 'react';
import { Content } from '../components/Content';
import { Loader } from '../components/Loader';
import { useConnection } from '../lib/connection';

export const RootPage = () => {
  console.log('Root Page');
  const connection = useConnection();

  useEffect(() => {
    console.log('Root Page init');
    if (!connection.isConnected()) {
      connection.connect();
    }

    return () => {
      console.log('Root Page destroy');
    };
  }, [connection]);

  return (
    <Content>
      <Loader />
    </Content>
  );
}
