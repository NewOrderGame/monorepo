import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

export function LogoutPage() {
  console.log('Logout Page');
  const navigate = useNavigate();
  const authenticator = useAuthenticator();

  useEffect(() => {
    console.log('Logout Page init');
    authenticator.signOut();
    navigate('/');

    return () => {
      console.log('Login Page destroy');
    };
  }, []);
  return null;
}
