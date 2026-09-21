/**
 * Ambient types for `react-native-dotenv` (see `babel.config.js`).
 *
 * Values are inlined by Babel at build time from the git-ignored `.env` file.
 * They may be missing on a fresh clone, so `src/constants/config.ts` normalises
 * them and exposes safe, validated constants to the rest of the app.
 */
declare module '@env' {
  export const TMDB_READ_ACCESS_TOKEN: string | undefined;
  export const TMDB_API_KEY: string | undefined;
}
