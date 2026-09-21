import { TMDB_API_KEY, TMDB_READ_ACCESS_TOKEN } from '@env';

// react-native-dotenv inlines these at build time. Keeping the @env import in
// this one file means the rest of the app, and the tests, never depend on .env
// being around.
const normalise = (value: string | undefined): string =>
  typeof value === 'string' ? value.trim() : '';

export const tmdbReadAccessToken = normalise(TMDB_READ_ACCESS_TOKEN);
export const tmdbApiKey = normalise(TMDB_API_KEY);

export const hasTmdbCredentials =
  tmdbReadAccessToken.length > 0 || tmdbApiKey.length > 0;

export const missingCredentialsHint =
  'TMDB credentials are missing. Copy `.env.example` to `.env`, add your ' +
  '`TMDB_READ_ACCESS_TOKEN` (or `TMDB_API_KEY`), then restart Metro with ' +
  '`npm start -- --reset-cache`.';
