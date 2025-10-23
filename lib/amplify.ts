import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-north-1_i9uKFiQnm',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '5j3372u54luccc6p178n1on5c1',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1'
    }
  },
   API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://x25vguh7tjgmngrnntzpdaje3i.appsync-api.eu-north-1.amazonaws.com/graphql',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
      defaultAuthMode: 'userPool' as const
    }
  }
};

Amplify.configure(awsConfig);