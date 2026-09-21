import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TMDB_BASE_URL } from '../../constants/tmdb';
import { tmdbApiKey, tmdbReadAccessToken } from '../../constants/config';
import {
  CombinedCreditsResponse,
  Credits,
  Movie,
  MovieDetail,
  MovieListCategory,
  PaginatedResponse,
  Person,
  PersonDetail,
  SearchResult,
  TvDetail,
  TvListCategory,
  TvShow,
  VideosResponse,
} from '../../shared/types/tmdb';

/**
 * TMDB accepts either the v4 bearer token (preferred, sent as a header so it
 * never lands in server logs) or the legacy v3 `api_key` query parameter.
 * We prefer the bearer token and only fall back when it is not configured.
 */
const useBearerToken = tmdbReadAccessToken.length > 0;

const authParams = (): Record<string, string | number> =>
  useBearerToken ? {} : { api_key: tmdbApiKey };

const buildQuery =
  (url: string, params: Record<string, string | number | undefined> = {}) =>
  () => ({
    url,
    params: {
      ...params,
      ...authParams(),
    },
  });

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_BASE_URL,
    prepareHeaders: headers => {
      if (useBearerToken) {
        headers.set('Authorization', `Bearer ${tmdbReadAccessToken}`);
      }

      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Movie', 'Tv', 'Person'],
  endpoints: builder => ({
    listMovies: builder.query<
      PaginatedResponse<Movie>,
      { category: MovieListCategory; page?: number }
    >({
      query: ({ category, page = 1 }) => buildQuery(`movie/${category}`, { page })(),
      providesTags: ['Movie'],
    }),

    listTvShows: builder.query<
      PaginatedResponse<TvShow>,
      { category: TvListCategory; page?: number }
    >({
      query: ({ category, page = 1 }) => buildQuery(`tv/${category}`, { page })(),
      providesTags: ['Tv'],
    }),

    listPopularPeople: builder.query<PaginatedResponse<Person>, { page?: number } | void>({
      query: arg => buildQuery('person/popular', { page: arg?.page ?? 1 })(),
      providesTags: ['Person'],
    }),

    movieDetail: builder.query<MovieDetail, number>({
      query: id => buildQuery(`movie/${id}`)(),
      providesTags: ['Movie'],
    }),

    movieCredits: builder.query<Credits, number>({
      query: id => buildQuery(`movie/${id}/credits`)(),
      providesTags: ['Movie'],
    }),

    movieVideos: builder.query<VideosResponse, number>({
      query: id => buildQuery(`movie/${id}/videos`)(),
      providesTags: ['Movie'],
    }),

    tvDetail: builder.query<TvDetail, number>({
      query: id => buildQuery(`tv/${id}`)(),
      providesTags: ['Tv'],
    }),

    tvCredits: builder.query<Credits, number>({
      query: id => buildQuery(`tv/${id}/credits`)(),
      providesTags: ['Tv'],
    }),

    personDetail: builder.query<PersonDetail, number>({
      query: id => buildQuery(`person/${id}`)(),
      providesTags: ['Person'],
    }),

    personCombinedCredits: builder.query<CombinedCreditsResponse, number>({
      query: id => buildQuery(`person/${id}/combined_credits`)(),
      providesTags: ['Person'],
    }),

    /** One call covers movies, TV and people — ideal for a single search bar. */
    searchMulti: builder.query<
      PaginatedResponse<SearchResult>,
      { query: string; page?: number }
    >({
      query: ({ query, page = 1 }) =>
        buildQuery('search/multi', { query, page, include_adult: 'false' })(),
      providesTags: ['Movie', 'Tv', 'Person'],
    }),
  }),
});

export const {
  useListMoviesQuery,
  useListTvShowsQuery,
  useListPopularPeopleQuery,
  useMovieDetailQuery,
  useMovieCreditsQuery,
  useMovieVideosQuery,
  useTvDetailQuery,
  useTvCreditsQuery,
  usePersonDetailQuery,
  usePersonCombinedCreditsQuery,
  useSearchMultiQuery,
} = tmdbApi;
