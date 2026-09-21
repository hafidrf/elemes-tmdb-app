/**
 * Pure, dependency-free TMDB constants.
 *
 * Deliberately separate from `config.ts` (which reads `@env`) so unit tests can
 * import the URL/size helpers without touching the Babel-inlined env module.
 */
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

/** Image widths recommended by the TMDB `/configuration` endpoint. */
export const imageSizes = {
  posterSmall: 'w185',
  posterMedium: 'w342',
  posterLarge: 'w500',
  backdrop: 'w780',
  profile: 'w185',
} as const;

export type ImageSizeKey = keyof typeof imageSizes;
