import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-north-1_aElAhst1u',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '1r1lpiumk7db2b9hhie1m1h45m',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1'
    }
  },
   API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://6feiyhi46rdd5oiiv53i7nwaza.appsync-api.eu-north-1.amazonaws.com/graphql',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
      defaultAuthMode: 'userPool' as const
    }
  }
};

Amplify.configure(awsConfig);