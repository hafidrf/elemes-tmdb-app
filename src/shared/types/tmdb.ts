// Only the fields we actually render are modelled, but everything that crosses
// the network is typed.

export type MediaType = 'movie' | 'tv' | 'person';
export type WatchableMediaType = 'movie' | 'tv';

// path segments for the movie list endpoints (lists 1-4)
export type MovieListCategory = 'popular' | 'top_rated' | 'upcoming' | 'now_playing';

// path segments for the TV list endpoints (lists 5-8)
export type TvListCategory = 'popular' | 'top_rated' | 'on_the_air' | 'airing_today';

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

export interface TvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity: number;
  known_for?: Array<{
    id: number;
    media_type: MediaType;
    title?: string;
    name?: string;
    poster_path: string | null;
  }>;
}

// /search/multi mixes all three shapes, tagged by media_type
export type SearchResult =
  | (Movie & { media_type: 'movie' })
  | (TvShow & { media_type: 'tv' })
  | (Person & { media_type: 'person' });

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  order?: number;
}

export interface Credits {
  id: number;
  cast: CastMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
  status: string;
}

export interface TvDetail extends Omit<TvShow, 'genre_ids'> {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  tagline: string | null;
  status: string;
}

export interface PersonDetail extends Person {
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
}

export interface CombinedCreditItem {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  character?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export interface CombinedCreditsResponse {
  id: number;
  cast: CombinedCreditItem[];
}

// View model for every card and grid. TMDB says `title` for movies and `name`
// for TV, so that difference gets flattened here rather than in the components.
export interface MediaSummary {
  id: number;
  mediaType: WatchableMediaType;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  // release / first-air date, pre-formatted
  dateLabel: string;
}

export interface PersonSummary {
  id: number;
  name: string;
  profilePath: string | null;
  knownFor: string;
}
