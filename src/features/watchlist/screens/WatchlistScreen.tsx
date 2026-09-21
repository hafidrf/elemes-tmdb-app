import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { StateView } from '../../../shared/components/StateView';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { type } from '../../../shared/theme/typography';
import { MediaSummary } from '../../../shared/types/tmdb';
import { WatchlistCard } from '../components/WatchlistCard';
import { useWatchlistRefresh } from '../useWatchlistRefresh';
import {
  clearWatchlist,
  removeFromWatchlist,
  selectWatchlistEntries,
  setUserRating,
  WatchlistEntry,
} from '../watchlistSlice';

export const WatchlistScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectWatchlistEntries);
  const { refresh, isRefreshing } = useWatchlistRefresh();

  const cardWidth = Math.floor((width - layout.screenPadding * 2 - layout.gridGap) / 2);

  const handlePress = useCallback(
    (item: MediaSummary) => {
      if (item.mediaType === 'movie') {
        navigation.navigate('MovieDetail', { id: item.id, title: item.title });
        return;
      }

      navigation.navigate('TvDetail', { id: item.id, title: item.title });
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (entry: WatchlistEntry) => {
      dispatch(removeFromWatchlist({ id: entry.id, mediaType: entry.mediaType }));
    },
    [dispatch],
  );

  const handleRate = useCallback(
    (entry: WatchlistEntry, rating: number) => {
      dispatch(
        setUserRating({ id: entry.id, mediaType: entry.mediaType, userRating: rating }),
      );
    },
    [dispatch],
  );

  const subtitle =
    entries.length === 0
      ? 'Titles you save will appear here, stored on this device'
      : `${entries.length} saved ${entries.length === 1 ? 'title' : 'titles'} · stored on this device`;

  return (
    <View style={styles.screen}>
      <FlatList
        data={entries}
        numColumns={2}
        keyExtractor={entry => `${entry.mediaType}-${entry.id}`}
        renderItem={({ item }) => (
          <WatchlistCard
            entry={item}
            width={cardWidth}
            onPress={handlePress}
            onRemove={handleRemove}
            onRate={handleRate}
          />
        )}
        ListHeaderComponent={
          <View>
            <ScreenHeader title="Watchlist" subtitle={subtitle} showSearch={false} />

            {entries.length > 0 ? (
              <Pressable
                onPress={() => dispatch(clearWatchlist())}
                accessibilityRole="button"
                style={({ pressed }) => [styles.clearAll, pressed ? styles.pressed : null]}>
                <Text style={styles.clearAllLabel}>Clear all</Text>
              </Pressable>
            ) : null}
          </View>
        }
        columnWrapperStyle={entries.length > 0 ? styles.column : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <StateView
            icon="bookmark"
            title="Your watchlist is empty"
            subtitle={'Open any movie or TV show and tap "Add to Watchlist". Your ratings are saved here too.'}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
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
  listContent: {
    paddingBottom: layout.space8,
    gap: layout.space4,
  },
  column: {
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
  },
  clearAll: {
    alignSelf: 'flex-end',
    marginTop: -12,
    marginRight: layout.screenPadding,
    marginBottom: layout.space2,
    paddingHorizontal: layout.space3,
    paddingVertical: 7,
    borderRadius: layout.radiusFull,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearAllLabel: {
    ...type.label,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.6,
  },
});
