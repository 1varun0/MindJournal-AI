// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserProfile, Entry } = initSchema(schema);

export {
  UserProfile,
  Entry
};