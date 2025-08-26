
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Note: We are not configuring the plugin with an API key, because the
// hosting environment (like Firebase) will provide it automatically.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
