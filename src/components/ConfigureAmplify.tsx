'use client';

import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json'; // Use the new JSON file

Amplify.configure(config); // Configure without the ssr: true flag

export default function ConfigureAmplify() {
  return null;
}
