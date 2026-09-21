import { useCallback, useEffect, useState } from 'react';

import { useListMoviesQuery, useListTvShowsQuery } from '../../shared/api/tmdbApi';
import { MediaSummary } from '../../shared/types/tmdb';
import { toMediaSummary } from '../../shared/utils/formatters';
import { CatalogCategory } from './catalogConfig';

export interface MediaListResult {
  items: MediaSummary[];
  isInitialLoading: boolean;
  isError: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

const mergeUnique = (previous: MediaSummary[], incoming: MediaSummary[]): MediaSummary[] => {
  const seen = new Set(previous.map(item => item.id));
  return [...previous, ...incoming.filter(item => !seen.has(item.id))];
};

// Paginated list for any of the eight movie/TV categories. Both queries are
// always called and gated with RTK Query's skip option, because hooks cannot be
// called conditionally.
export const useMediaList = (category: CatalogCategory): MediaListResult => {
  const isMovie = category.mediaType === 'movie';
  const isTv = category.mediaType === 'tv';
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MediaSummary[]>([]);

  const movieQuery = useListMoviesQuery(
    { category: category.movieCategory ?? 'popular', page },
    { skip: !isMovie },
  );
  const tvQuery = useListTvShowsQuery(
    { category: category.tvCategory ?? 'popular', page },
    { skip: !isTv },
  );

  const activeQuery = isMovie ? movieQuery : tvQuery;
  const { data } = activeQuery;
  const mediaType = isMovie ? 'movie' : 'tv';

  // switching category starts the list over
  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [category.key]);

  useEffect(() => {
    // drop a response for a page we have already moved past, which can happen
    // for one render right after a category change
    if (!data || data.page !== page) {
      return;
    }

    const incoming = data.results.map(result => toMediaSummary(result, mediaType));

    setItems(previous => (data.page <= 1 ? incoming : mergeUnique(previous, incoming)));
  }, [data, mediaType, page]);

  const totalPages = data?.total_pages ?? 1;
  const hasMore = items.length > 0 && page < totalPages;
  const isFetching = activeQuery.isFetching;

  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) {
      return;
    }

    setPage(current => current + 1);
  }, [hasMore, isFetching]);

  const refetch = useCallback(() => {
    setItems([]);
    setPage(1);
    activeQuery.refetch();
  }, [activeQuery]);

  return {
    items,
    isInitialLoading: items.length === 0 && (activeQuery.isLoading || isFetching),
    isError: activeQuery.isError,
    isFetchingMore: isFetching && items.length > 0,
    hasMore,
    loadMore,
    refetch,
  };
};
