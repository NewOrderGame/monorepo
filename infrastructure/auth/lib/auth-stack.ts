import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'NewOrderGameUserPool', {
      userPoolName: 'new-order-game-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        nickname: {
          required: true,
          mutable: true
        }
      },
      customAttributes: {
        country: new cognito.StringAttribute({ mutable: true }),
        city: new cognito.StringAttribute({ mutable: true }),
        isAdmin: new cognito.StringAttribute({ mutable: true })
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      // TODO: Change to RETAIN when Beta Test starts
      removalPolicy: RemovalPolicy.RETAIN
    });

    // 👇 User Pool Client attributes
    const standardCognitoAttributes = {
      email: true,
      emailVerified: true,
      nickname: true
    };

    const clientReadAttributes = new cognito.ClientAttributes()
      .withStandardAttributes(standardCognitoAttributes)
      .withCustomAttributes(...['country', 'city', 'isAdmin']);

    const clientWriteAttributes = new cognito.ClientAttributes()
      .withStandardAttributes({
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false
      })
      .withCustomAttributes(...['country', 'city']);

    // 👇 User Pool Client
    const userPoolClient = new cognito.UserPoolClient(
      this,
      'user-pool-client',
      {
        userPool,
        authFlows: {
          adminUserPassword: true,
          custom: true,
          userSrp: true
        },
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO
        ],
        readAttributes: clientReadAttributes,
        writeAttributes: clientWriteAttributes
      }
    );

    new CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId
    });
    new CfnOutput(this, 'userPoolClientId', {
      value: userPoolClient.userPoolClientId
    });
  }
}
