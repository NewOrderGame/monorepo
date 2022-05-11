import { useAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function LogoutPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    window.localStorage.removeItem('sessionId');
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('username');

    auth.logOut(() => {
      navigate('/');
    });
  }, []);
  return null;
}
