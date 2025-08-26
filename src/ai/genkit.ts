
'use server';

import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {googleCloud} from '@genkit-ai/google-cloud';

const plugins: Plugin[] = [
  googleAI(),
];

if (process.env.GCP_PROJECT) {
  plugins.push(googleCloud());
}

export const ai = genkit({
  plugins,
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
