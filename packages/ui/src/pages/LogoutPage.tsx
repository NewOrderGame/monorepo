import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import logger from "../lib/utils/logger";

export const LogoutPage = () => {
  logger.info('Logout Page');
  const navigate = useNavigate();
  const authenticator = useAuthenticator();

  useEffect(() => {
    logger.info('Logout Page init');
    authenticator.signOut();
    navigate('/');

    return () => {
      logger.info('Login Page destroy');
    };
  }, []);
  return null;
};
