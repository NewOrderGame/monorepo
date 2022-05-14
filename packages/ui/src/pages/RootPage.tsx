import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../utils/auth';

export function RootPage() {
  console.log('Root Page');
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      navigate(`/${auth.user.page}`);
    } else {
      navigate('/login');
    }
  }, []);
  return null;
}
