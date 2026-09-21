import { TMDB_IMAGE_BASE_URL, imageSizes, ImageSizeKey } from '../../constants/tmdb';

// Returns null when there is no path, which happens often (unreleased titles,
// obscure people). Callers show a placeholder instead of a broken image.
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
