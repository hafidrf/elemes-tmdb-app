// Plain constants, kept out of config.ts so the helpers built on top of them
// can be unit tested without a .env file.
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// widths from TMDB's /configuration endpoint
export const imageSizes = {
  posterSmall: 'w185',
  posterMedium: 'w342',
  posterLarge: 'w500',
  backdrop: 'w780',
  profile: 'w185',
} as const;

export type ImageSizeKey = keyof typeof imageSizes;
