import { useCallback, useEffect, useState } from 'react';

import { useListPopularPeopleQuery } from '../../shared/api/tmdbApi';
import { PersonSummary } from '../../shared/types/tmdb';
import { toPersonSummary } from '../../shared/utils/formatters';

export interface PeopleListResult {
  items: PersonSummary[];
  isInitialLoading: boolean;
  isError: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

// list 9 from the brief, paged
export const usePeopleList = ({ skip = false }: { skip?: boolean } = {}): PeopleListResult => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PersonSummary[]>([]);

  const query = useListPopularPeopleQuery({ page }, { skip });
  const { data } = query;

  useEffect(() => {
    if (!data || data.page !== page) {
      return;
    }

    const incoming = data.results.map(toPersonSummary);

    setItems(previous => {
      if (data.page <= 1) {
        return incoming;
      }

      const seen = new Set(previous.map(person => person.id));
      return [...previous, ...incoming.filter(person => !seen.has(person.id))];
    });
  }, [data, page]);

  const totalPages = data?.total_pages ?? 1;
  const hasMore = items.length > 0 && page < totalPages;

  const loadMore = useCallback(() => {
    if (!hasMore || query.isFetching) {
      return;
    }

    setPage(current => current + 1);
  }, [hasMore, query.isFetching]);

  const refetch = useCallback(() => {
    setItems([]);
    setPage(1);
    query.refetch();
  }, [query]);

  return {
    items,
    isInitialLoading: items.length === 0 && (query.isLoading || query.isFetching),
    isError: query.isError,
    isFetchingMore: query.isFetching && items.length > 0,
    hasMore,
    loadMore,
    refetch,
  };
};
