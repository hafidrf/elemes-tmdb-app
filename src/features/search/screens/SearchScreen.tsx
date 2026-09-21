import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../app/navigation/types';
import { useSearchMultiQuery } from '../../../shared/api/tmdbApi';
import { AppIcon } from '../../../shared/components/AppIcon';
import { BackButton } from '../../../shared/components/BackButton';
import { CatalogGridRow } from '../../../shared/components/CatalogGridRow';
import { PosterSkeleton } from '../../../shared/components/Skeleton';
import { StateView } from '../../../shared/components/StateView';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { CatalogRow } from '../../../shared/types/catalogRow';
import { MediaSummary, PersonSummary, SearchResult } from '../../../shared/types/tmdb';
import { toMediaSummary, toPersonSummary } from '../../../shared/utils/formatters';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 400;

const toRow = (result: SearchResult): CatalogRow | null => {
  if (result.media_type === 'movie') {
    return { kind: 'media', item: toMediaSummary(result, 'movie') };
  }

  if (result.media_type === 'tv') {
    return { kind: 'media', item: toMediaSummary(result, 'tv') };
  }

  if (result.media_type === 'person') {
    return { kind: 'person', item: toPersonSummary(result) };
  }

  return null;
};

const rowKey = (row: CatalogRow): string => `${row.kind}-${row.item.id}`;

/**
 * Single search bar over `/search/multi`, which covers movies, TV shows and
 * people in one request. Input is debounced so typing does not fire a request
 * per keystroke.
 */
export const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CatalogRow[]>([]);

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, DEBOUNCE_MS);
  const isQueryValid = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const searchQuery = useSearchMultiQuery(
    { query: debouncedQuery, page },
    { skip: !isQueryValid },
  );
  const { data, isFetching, isLoading, isError, refetch } = searchQuery;

  const cardWidth = Math.floor((width - layout.screenPadding * 2 - layout.gridGap) / 2);

  // A new term always starts from page 1 with a clean grid.
  useEffect(() => {
    setRows([]);
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (!data || data.page !== page) {
      return;
    }

    const incoming = data.results
      .map(toRow)
      .filter((row): row is CatalogRow => row !== null);

    setRows(previous => {
      if (data.page <= 1) {
        return incoming;
      }

      const seen = new Set(previous.map(rowKey));
      return [...previous, ...incoming.filter(row => !seen.has(rowKey(row)))];
    });
  }, [data, page]);

  const totalPages = data?.total_pages ?? 1;
  const hasMore = rows.length > 0 && page < totalPages;

  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) {
      return;
    }

    setPage(current => current + 1);
  }, [hasMore, isFetching]);

  const handlePressMedia = useCallback(
    (item: MediaSummary) => {
      if (item.mediaType === 'movie') {
        navigation.navigate('MovieDetail', { id: item.id, title: item.title });
        return;
      }

      navigation.navigate('TvDetail', { id: item.id, title: item.title });
    },
    [navigation],
  );

  const handlePressPerson = useCallback(
    (person: PersonSummary) => {
      navigation.navigate('PersonDetail', { id: person.id, name: person.name });
    },
    [navigation],
  );

  const skeletons = useMemo(() => Array.from({ length: 4 }, (_, index) => index), []);

  const header = (
    <View style={[styles.searchBar, { paddingTop: insets.top + 8 }]}>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.inputWrapper}>
        <AppIcon name="search" size={14} />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Movies, TV shows, people…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search TMDB"
        />

        {query.length > 0 ? (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}>
            <AppIcon name="close" size={14} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  if (!isQueryValid) {
    return (
      <View style={styles.screen}>
        {header}
        <StateView
          icon="search"
          title="Search TMDB"
          subtitle={`Type at least ${MIN_QUERY_LENGTH} characters to search movies, TV shows and people.`}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        {header}
        <StateView
          icon="warning"
          title="Search failed"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={refetch}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        {header}
        <View style={styles.skeletonGrid}>
          {skeletons.map(index => (
            <PosterSkeleton key={index} width={cardWidth} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={rows}
        numColumns={2}
        keyExtractor={rowKey}
        renderItem={({ item: row }) => (
          <CatalogGridRow
            row={row}
            cardWidth={cardWidth}
            onPressMedia={handlePressMedia}
            onPressPerson={handlePressPerson}
          />
        )}
        ListHeaderComponent={header}
        columnWrapperStyle={rows.length > 0 ? styles.column : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <StateView
            icon="search"
            title={`No results for “${debouncedQuery}”`}
            subtitle="Try a different title or a person's name."
          />
        }
        ListFooterComponent={
          isFetching && rows.length > 0 ? (
            <ActivityIndicator color={colors.primary} style={styles.footer} />
          ) : null
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 14,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    color: colors.textPrimary,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
  },
  column: {
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
  },
  listContent: {
    paddingBottom: 32,
    gap: 18,
  },
  footer: {
    paddingVertical: 18,
  },
});
