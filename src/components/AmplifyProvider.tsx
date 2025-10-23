'use client';

import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

// Configure Amplify just once on the client side
Amplify.configure(config);

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}