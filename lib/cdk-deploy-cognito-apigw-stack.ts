import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class CdkDeployCognitoApigwStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define the Cognito User Pool
    const userPool = new UserPool(this, 'MyUserPool', {
      userPoolName: 'my-user-pool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Define the Cognito User Pool Client
    const userPoolClient = new UserPoolClient(this, 'MyUserPoolClient', {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
      },
    });

    // Output the User Pool Client ID
    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    // Define the Lambda function
    const myFunction = new Function(this, 'MyFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromInline(`
        exports.handler = async function(event) {
          console.log('request:', JSON.stringify(event, undefined, 2));
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain' },
            body: \`Hello, \${event.requestContext.authorizer.claims['email']}!\`,
          };
        };
      `),
    });

    // Define the API Gateway
    const api = new RestApi(this, 'MyApi', {
      restApiName: 'My Service',
      description: 'This service serves as an example.',
    });

    // Create a Cognito authorizer
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'MyAuthorizer', {
      cognitoUserPools: [userPool],
    });

    // Create an endpoint
    const lambdaIntegration = new LambdaIntegration(myFunction);
    const resource = api.root.addResource('hello');
    resource.addMethod('GET', lambdaIntegration, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });
  }
}
