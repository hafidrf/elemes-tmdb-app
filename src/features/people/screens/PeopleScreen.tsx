import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { PersonCard } from '../../../shared/components/PersonCard';
import { PosterSkeleton } from '../../../shared/components/Skeleton';
import { StateView } from '../../../shared/components/StateView';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { PersonSummary } from '../../../shared/types/tmdb';
import { usePeopleList } from '../usePeopleList';

const HEADING = 'People';
const SUBHEADING = 'Popular faces on TMDB right now';

// list 9 from the brief
export const PeopleScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const { items, isInitialLoading, isError, isFetchingMore, hasMore, loadMore, refetch } =
    usePeopleList();
  const [manualRefresh, setManualRefresh] = useState(false);

  const cardWidth = Math.floor((width - layout.screenPadding * 2 - layout.gridGap) / 2);
  const isFetching = isInitialLoading || isFetchingMore;

  useEffect(() => {
    if (manualRefresh && !isFetching) {
      setManualRefresh(false);
    }
  }, [isFetching, manualRefresh]);

  const handleRefresh = useCallback(() => {
    setManualRefresh(true);
    refetch();
  }, [refetch]);

  const handlePress = useCallback(
    (person: PersonSummary) => {
      navigation.navigate('PersonDetail', { id: person.id, name: person.name });
    },
    [navigation],
  );

  const skeletons = useMemo(() => Array.from({ length: 6 }, (_, index) => index), []);

  if (isInitialLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.headerSpacing}>
          <ScreenHeader title={HEADING} subtitle={SUBHEADING} />
        </View>
        <View style={styles.skeletonGrid}>
          {skeletons.map(index => (
            <PosterSkeleton key={index} width={cardWidth} />
          ))}
        </View>
      </View>
    );
  }

  if (isError && items.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={styles.headerSpacing}>
          <ScreenHeader title={HEADING} subtitle={SUBHEADING} />
        </View>
        <StateView
          icon="warning"
          title="Couldn't load people"
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
        data={items}
        numColumns={2}
        keyExtractor={person => String(person.id)}
        renderItem={({ item }) => (
          <PersonCard person={item} width={cardWidth} onPress={handlePress} />
        )}
        ListHeaderComponent={<ScreenHeader title={HEADING} subtitle={SUBHEADING} />}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <StateView
            compact
            icon="people"
            title="No people to show"
            subtitle="TMDB returned an empty list."
          />
        }
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator color={colors.primary} style={styles.footer} /> : null
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
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
  headerSpacing: {
    paddingTop: layout.screenPadding,
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
    paddingTop: layout.screenPadding,
    paddingBottom: 24,
    gap: 18,
  },
  footer: {
    paddingVertical: 18,
  },
});
