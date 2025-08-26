
import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {dotprompt} from 'genkit/dotprompt';
import {googleCloud} from '@genkit-ai/google-cloud';

const plugins: Plugin[] = [
  googleAI(),
  dotprompt(),
];

if (process.env.GCP_PROJECT) {
  plugins.push(googleCloud());
}

export const ai = genkit({
  plugins,
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
