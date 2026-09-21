import { MediaType, MovieListCategory, TvListCategory } from '../../shared/types/tmdb';

export type CatalogKey =
  | 'movie_popular'
  | 'movie_top_rated'
  | 'movie_upcoming'
  | 'movie_now_playing'
  | 'tv_popular'
  | 'tv_top_rated'
  | 'tv_on_the_air'
  | 'tv_airing_today'
  | 'person_popular';

export interface CatalogCategory {
  key: CatalogKey;
  title: string;
  subtitle: string;
  group: 'movies' | 'tv' | 'people';
  mediaType: MediaType;
  movieCategory?: MovieListCategory;
  tvCategory?: TvListCategory;
  // position in the brief's list of nine, so the README table can point at it
  requirementNumber: number;
}

// All nine lists from the brief in one array. The tabs, the "See All" grids and
// the README table all read from here, so a list cannot be fetched and then
// quietly left out of the UI.
export const MOVIE_CATEGORIES: CatalogCategory[] = [
  {
    key: 'movie_popular',
    title: 'Popular Movies',
    subtitle: 'What people are watching right now',
    group: 'movies',
    mediaType: 'movie',
    movieCategory: 'popular',
    requirementNumber: 4,
  },
  {
    key: 'movie_top_rated',
    title: 'Top Rated Movies',
    subtitle: 'The highest rated films of all time',
    group: 'movies',
    mediaType: 'movie',
    movieCategory: 'top_rated',
    requirementNumber: 1,
  },
  {
    key: 'movie_upcoming',
    title: 'Upcoming Movies',
    subtitle: 'Releasing soon',
    group: 'movies',
    mediaType: 'movie',
    movieCategory: 'upcoming',
    requirementNumber: 2,
  },
  {
    key: 'movie_now_playing',
    title: 'Now Playing',
    subtitle: 'Currently in theatres',
    group: 'movies',
    mediaType: 'movie',
    movieCategory: 'now_playing',
    requirementNumber: 3,
  },
];

export const TV_CATEGORIES: CatalogCategory[] = [
  {
    key: 'tv_popular',
    title: 'Popular TV Shows',
    subtitle: 'Trending series this week',
    group: 'tv',
    mediaType: 'tv',
    tvCategory: 'popular',
    requirementNumber: 5,
  },
  {
    key: 'tv_top_rated',
    title: 'Top Rated TV Shows',
    subtitle: 'Critically acclaimed series',
    group: 'tv',
    mediaType: 'tv',
    tvCategory: 'top_rated',
    requirementNumber: 6,
  },
  {
    key: 'tv_on_the_air',
    title: 'On The Air',
    subtitle: 'Airing this week',
    group: 'tv',
    mediaType: 'tv',
    tvCategory: 'on_the_air',
    requirementNumber: 7,
  },
  {
    key: 'tv_airing_today',
    title: 'Airing Today',
    subtitle: 'New episodes today',
    group: 'tv',
    mediaType: 'tv',
    tvCategory: 'airing_today',
    requirementNumber: 8,
  },
];

export const PEOPLE_CATEGORIES: CatalogCategory[] = [
  {
    key: 'person_popular',
    title: 'Popular People',
    subtitle: 'Trending actors and crew',
    group: 'people',
    mediaType: 'person',
    requirementNumber: 9,
  },
];

export const ALL_CATEGORIES: CatalogCategory[] = [
  ...MOVIE_CATEGORIES,
  ...TV_CATEGORIES,
  ...PEOPLE_CATEGORIES,
];

export const findCategory = (key: CatalogKey): CatalogCategory => {
  const category = ALL_CATEGORIES.find(item => item.key === key);

  if (!category) {
    throw new Error(`Unknown catalog category: ${key}`);
  }

  return category;
};
