import { TMDB_IMAGE_BASE_URL, imageSizes, ImageSizeKey } from '../../constants/tmdb';

/**
 * Builds a TMDB image URL, or `null` when the path is missing.
 *
 * TMDB returns `null` for `poster_path` / `profile_path` surprisingly often
 * (unreleased titles, obscure people). Returning `null` lets the UI render an
 * intentional placeholder instead of a broken image.
 */
export const buildImageUrl = (
  path: string | null | undefined,
  size: ImageSizeKey = 'posterMedium',
): string | null => {
  if (!path) {
    return null;
  }

  const normalisedPath = path.startsWith('/') ? path : `/${path}`;

  return `${TMDB_IMAGE_BASE_URL}${imageSizes[size]}${normalisedPath}`;
};

export const buildPosterUrl = (
  path: string | null | undefined,
  size: ImageSizeKey = 'posterMedium',
): string | null => buildImageUrl(path, size);

export const buildBackdropUrl = (path: string | null | undefined): string | null =>
  buildImageUrl(path, 'backdrop');

export const buildProfileUrl = (path: string | null | undefined): string | null =>
  buildImageUrl(path, 'profile');
