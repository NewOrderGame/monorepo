import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  region: 'eu-central-1'
});

export default cognitoidentityserviceprovider;
