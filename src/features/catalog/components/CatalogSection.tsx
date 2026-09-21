import React, { useEffect, useMemo } from 'react';

import { useListMoviesQuery, useListTvShowsQuery } from '../../../shared/api/tmdbApi';
import { SectionCarousel } from '../../../shared/components/SectionCarousel';
import { MediaSummary } from '../../../shared/types/tmdb';
import { toMediaSummary } from '../../../shared/utils/formatters';
import { CatalogCategory } from '../catalogConfig';

interface CatalogSectionProps {
  category: CatalogCategory;
  /** Bumped by the parent's pull-to-refresh to force a refetch. */
  refreshToken: number;
  onSeeAll: (category: CatalogCategory) => void;
  onPressItem: (item: MediaSummary) => void;
}

type ListSectionProps = CatalogSectionProps;

const MovieListSection = ({
  category,
  refreshToken,
  onSeeAll,
  onPressItem,
}: ListSectionProps) => {
  const { data, isLoading, isError, refetch } = useListMoviesQuery({
    category: category.movieCategory ?? 'popular',
    page: 1,
  });

  useEffect(() => {
    if (refreshToken > 0) {
      refetch();
    }
  }, [refreshToken, refetch]);

  const items = useMemo(
    () => (data?.results ?? []).map(movie => toMediaSummary(movie, 'movie')),
    [data],
  );

  return (
    <SectionCarousel
      title={category.title}
      subtitle={category.subtitle}
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      onSeeAll={() => onSeeAll(category)}
      onPressItem={onPressItem}
    />
  );
};

const TvListSection = ({
  category,
  refreshToken,
  onSeeAll,
  onPressItem,
}: ListSectionProps) => {
  const { data, isLoading, isError, refetch } = useListTvShowsQuery({
    category: category.tvCategory ?? 'popular',
    page: 1,
  });

  useEffect(() => {
    if (refreshToken > 0) {
      refetch();
    }
  }, [refreshToken, refetch]);

  const items = useMemo(
    () => (data?.results ?? []).map(show => toMediaSummary(show, 'tv')),
    [data],
  );

  return (
    <SectionCarousel
      title={category.title}
      subtitle={category.subtitle}
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      onSeeAll={() => onSeeAll(category)}
      onPressItem={onPressItem}
    />
  );
};

/**
 * Renders one shelf for a movie or TV category.
 *
 * The two hooks inside the child components are never called conditionally
 * (the switch happens at the component level), which keeps the Rules of Hooks
 * intact while still exposing one generic `CatalogSection` API.
 */
export const CatalogSection = (props: CatalogSectionProps) => {
  const { category } = props;

  if (category.mediaType === 'movie') {
    return <MovieListSection {...props} />;
  }

  if (category.mediaType === 'tv') {
    return <TvListSection {...props} />;
  }

  return null;
};
