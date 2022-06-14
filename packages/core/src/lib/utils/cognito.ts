import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const cognito = new CognitoIdentityServiceProvider({
  region: 'eu-central-1'
});

export const getUser = (accessToken: string): Promise<GetUserResponse> => {
  return new Promise((resolve, reject) => {
    cognito.getUser(
      {
        AccessToken: accessToken
      },
      (error, response) => {
        if (error) {
          reject(error);
        }
        if (!response) {
          reject(new Error('There should be a response'));
        }
        resolve(response);
      }
    );
  });
};
