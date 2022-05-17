import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '../components/Content';
import { Loader } from '../components/Loader';

export function RootPage() {
  console.log('Root Page');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Root Page init');

    return () => {
      console.log('Root Page destroy');
    };
  }, [navigate]);

  return (
    <Content>
      <Loader />
    </Content>
  );
}
