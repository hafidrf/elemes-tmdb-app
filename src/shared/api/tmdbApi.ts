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

// TMDB takes either the v4 bearer token or the older v3 api_key query param. The
// bearer token is preferred; api_key is the fallback for when only that is set.
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
  // Every TMDB response is server-cached under one of these three tags. There is
  // no Watchlist tag on purpose: the watchlist is local state in watchlistSlice,
  // so there is nothing in this cache for a save to invalidate. Nothing here
  // declares invalidatesTags either, because this API has no mutations.
  tagTypes: ['Movies', 'TV', 'People'],
  endpoints: builder => ({
    listMovies: builder.query<
      PaginatedResponse<Movie>,
      { category: MovieListCategory; page?: number }
    >({
      query: ({ category, page = 1 }) => buildQuery(`movie/${category}`, { page })(),
      providesTags: ['Movies'],
    }),

    listTvShows: builder.query<
      PaginatedResponse<TvShow>,
      { category: TvListCategory; page?: number }
    >({
      query: ({ category, page = 1 }) => buildQuery(`tv/${category}`, { page })(),
      providesTags: ['TV'],
    }),

    listPopularPeople: builder.query<PaginatedResponse<Person>, { page?: number } | void>({
      query: arg => buildQuery('person/popular', { page: arg?.page ?? 1 })(),
      providesTags: ['People'],
    }),

    movieDetail: builder.query<MovieDetail, number>({
      query: id => buildQuery(`movie/${id}`)(),
      providesTags: ['Movies'],
    }),

    movieCredits: builder.query<Credits, number>({
      query: id => buildQuery(`movie/${id}/credits`)(),
      providesTags: ['Movies'],
    }),

    movieVideos: builder.query<VideosResponse, number>({
      query: id => buildQuery(`movie/${id}/videos`)(),
      providesTags: ['Movies'],
    }),

    tvDetail: builder.query<TvDetail, number>({
      query: id => buildQuery(`tv/${id}`)(),
      providesTags: ['TV'],
    }),

    tvCredits: builder.query<Credits, number>({
      query: id => buildQuery(`tv/${id}/credits`)(),
      providesTags: ['TV'],
    }),

    personDetail: builder.query<PersonDetail, number>({
      query: id => buildQuery(`person/${id}`)(),
      providesTags: ['People'],
    }),

    personCombinedCredits: builder.query<CombinedCreditsResponse, number>({
      query: id => buildQuery(`person/${id}/combined_credits`)(),
      providesTags: ['People'],
    }),

    // one request covers movies, TV and people, so it provides all three tags
    searchMulti: builder.query<
      PaginatedResponse<SearchResult>,
      { query: string; page?: number }
    >({
      query: ({ query, page = 1 }) =>
        buildQuery('search/multi', { query, page, include_adult: 'false' })(),
      providesTags: ['Movies', 'TV', 'People'],
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
