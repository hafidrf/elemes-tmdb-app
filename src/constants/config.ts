import { TMDB_API_KEY, TMDB_READ_ACCESS_TOKEN } from '@env';

/**
 * The only module in the app that reads `@env`.
 *
 * Keeping the `@env` import in one leaf module means:
 *  - unit tests never have to resolve the Babel-inlined env module, and
 *  - a missing `.env` degrades into an explainable message instead of a crash.
 */
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
