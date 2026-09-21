import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigation/types';
import { CatalogGridRow } from '../../../shared/components/CatalogGridRow';
import { PosterSkeleton } from '../../../shared/components/Skeleton';
import { StateView } from '../../../shared/components/StateView';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { CatalogRow } from '../../../shared/types/catalogRow';
import { MediaSummary, PersonSummary } from '../../../shared/types/tmdb';
import { usePeopleList } from '../../people/usePeopleList';
import { findCategory } from '../catalogConfig';
import { useMediaList } from '../useMediaList';

// "See All" grid for one of the nine lists, with infinite scroll.
export const CategoryListScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CategoryList'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [manualRefresh, setManualRefresh] = useState(false);

  const category = useMemo(
    () => findCategory(route.params.categoryKey),
    [route.params.categoryKey],
  );
  const isPerson = category.mediaType === 'person';

  // both hooks run on every render, skip keeps the inactive one idle
  const mediaList = useMediaList(category);
  const peopleList = usePeopleList({ skip: !isPerson });

  const active = isPerson ? peopleList : mediaList;
  const { isInitialLoading, isError, isFetchingMore, hasMore, loadMore, refetch } = active;
  const isFetching = isInitialLoading || isFetchingMore;

  const cardWidth = Math.floor((width - layout.screenPadding * 2 - layout.gridGap) / 2);

  const rows = useMemo<CatalogRow[]>(() => {
    if (isPerson) {
      return peopleList.items.map(item => ({ kind: 'person' as const, item }));
    }

    return mediaList.items.map(item => ({ kind: 'media' as const, item }));
  }, [isPerson, mediaList.items, peopleList.items]);

  useEffect(() => {
    if (manualRefresh && !isFetching) {
      setManualRefresh(false);
    }
  }, [isFetching, manualRefresh]);

  const handleRefresh = useCallback(() => {
    setManualRefresh(true);
    refetch();
  }, [refetch]);

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

  const skeletons = useMemo(() => Array.from({ length: 6 }, (_, index) => index), []);

  if (isInitialLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.skeletonGrid}>
          {skeletons.map(index => (
            <PosterSkeleton key={index} width={cardWidth} />
          ))}
        </View>
      </View>
    );
  }

  if (isError && rows.length === 0) {
    return (
      <View style={styles.screen}>
        <StateView
          icon="warning"
          title="Couldn't load this list"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={rows}
        numColumns={2}
        keyExtractor={row => `${row.kind}-${row.item.id}`}
        renderItem={({ item: row }) => (
          <CatalogGridRow
            row={row}
            cardWidth={cardWidth}
            onPressMedia={handlePressMedia}
            onPressPerson={handlePressPerson}
          />
        )}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <StateView
            compact
            title="This list is empty"
            subtitle={`TMDB returned no results for ${category.title}.`}
          />
        }
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator color={colors.primary} style={styles.footer} />
          ) : null
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        // This grid mixes posters and portrait cards, and a poster title can wrap
        // to two lines while a name does not, so row heights are not constant and
        // getItemLayout would report the wrong offsets. The window sizes below
        // trim the mount cost instead, which is what actually shows up while paging.
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={manualRefresh}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surfaceElevated}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.screenPadding,
  },
  column: {
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
  },
  listContent: {
    paddingTop: layout.screenPadding,
    paddingBottom: 24,
    gap: 18,
  },
  footer: {
    paddingVertical: 18,
  },
});
