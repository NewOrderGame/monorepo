import { useAuthenticator as amplifyUseAuthenticator } from '@aws-amplify/ui-react';
import { CognitoUser } from 'amazon-cognito-identity-js';

type NogAuthenticator = {
  user: CognitoUser;
  signOut: () => void;
};

export const useAuthenticator = (): NogAuthenticator => {
  const authenticator = amplifyUseAuthenticator();

  return {
    user: authenticator.user,
    signOut: authenticator.signOut
  };
};
