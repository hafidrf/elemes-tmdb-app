import { TMDB_IMAGE_BASE_URL } from '../../../constants/tmdb';
import { buildBackdropUrl, buildImageUrl, buildPosterUrl, buildProfileUrl } from '../imageUrl';

describe('buildImageUrl', () => {
  it('prefixes the size and joins the path', () => {
    expect(buildPosterUrl('/abc.jpg')).toBe(`${TMDB_IMAGE_BASE_URL}w342/abc.jpg`);
  });

  it('adds a missing leading slash', () => {
    expect(buildPosterUrl('abc.jpg')).toBe(`${TMDB_IMAGE_BASE_URL}w342/abc.jpg`);
  });

  it('respects an explicit size', () => {
    expect(buildPosterUrl('/abc.jpg', 'posterSmall')).toBe(
      `${TMDB_IMAGE_BASE_URL}w185/abc.jpg`,
    );
  });

  it.each([null, undefined, ''])('returns null for %p so the UI can show a placeholder', path => {
    expect(buildImageUrl(path)).toBeNull();
  });

  it('builds backdrop and profile urls with their own sizes', () => {
    expect(buildBackdropUrl('/bd.jpg')).toBe(`${TMDB_IMAGE_BASE_URL}w780/bd.jpg`);
    expect(buildProfileUrl('/p.jpg')).toBe(`${TMDB_IMAGE_BASE_URL}w185/p.jpg`);
  });
});
