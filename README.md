# Deploy an API Gateway using the AWS CDK for Typescript!

Watch on [YouTube](https://www.youtube.com/watch?v=N3FZWVF97n4)

This repository outlines how to create a cognito user pool and how to assign it as an authorizer for an API gateway. Profile is not strictly necessary based on how you configured the AWS CLI. More info here: https://youtu.be/rBcZoeCu-K4

Create a user
`aws cognito-idp sign-up \
  --client-id <clientid> \
  --username <email> \
  --password <password> \
  --profile <profile>`

Confirm the user
`aws cognito-idp confirm-sign-up \
  --client-id <clientid> \
  --username <email> \
  --confirmation-code <code> \
  --profile <profile>`

Log in - This will grant tokens. IdToken is what we will need to test our endpoint.
`aws cognito-idp initiate-auth \
  --client-id <clientid> \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=<email>,PASSWORD=<password> \
  --profile <profile>`

Test out an endpoint
`curl -H "Authorization: Bearer <IdToken>" https://<apiId>.execute-api.<region>.amazonaws.com/prod/myendpoint`
