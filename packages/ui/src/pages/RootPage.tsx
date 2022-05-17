import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function RootPage() {
  console.log('Root Page');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Root Page init');

    return () => {
      console.log('Root Page destroy');
    };
  }, [navigate]);

  return null;
}
