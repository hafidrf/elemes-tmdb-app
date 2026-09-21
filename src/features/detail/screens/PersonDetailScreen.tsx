import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../app/navigation/types';
import {
  usePersonCombinedCreditsQuery,
  usePersonDetailQuery,
} from '../../../shared/api/tmdbApi';
import { BackButton } from '../../../shared/components/BackButton';
import { MediaCard } from '../../../shared/components/MediaCard';
import { PosterImage } from '../../../shared/components/PosterImage';
import { StateView } from '../../../shared/components/StateView';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { MediaSummary } from '../../../shared/types/tmdb';
import {
  formatDateLabel,
  toMediaSummaryFromCredit,
} from '../../../shared/utils/formatters';
import { buildProfileUrl } from '../../../shared/utils/imageUrl';
import { detailStyles } from '../detailStyles';

const PORTRAIT_SIZE = 132;
const FILMOGRAPHY_LIMIT = 24;

export const PersonDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PersonDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = route.params;

  const detailQuery = usePersonDetailQuery(id);
  const creditsQuery = usePersonCombinedCreditsQuery(id);
  const detail = detailQuery.data;

  const cardWidth = Math.floor((width - layout.screenPadding * 2 - layout.gridGap) / 2);

  /** Most recent credits first, de-duplicated across movie/TV. */
  const filmography = useMemo<MediaSummary[]>(() => {
    const cast = creditsQuery.data?.cast ?? [];

    const sorted = [...cast].sort((a, b) => {
      const dateA = a.release_date ?? a.first_air_date ?? '';
      const dateB = b.release_date ?? b.first_air_date ?? '';
      return dateB.localeCompare(dateA);
    });

    const seen = new Set<string>();

    return sorted
      .map(toMediaSummaryFromCredit)
      .filter((item): item is MediaSummary => {
        if (!item) {
          return false;
        }

        const key = `${item.mediaType}-${item.id}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);

        return true;
      })
      .slice(0, FILMOGRAPHY_LIMIT);
  }, [creditsQuery.data]);

  const handleRetry = useCallback(() => {
    detailQuery.refetch();
    creditsQuery.refetch();
  }, [creditsQuery, detailQuery]);

  const handlePressCredit = useCallback(
    (item: MediaSummary) => {
      if (item.mediaType === 'movie') {
        navigation.navigate('MovieDetail', { id: item.id, title: item.title });
        return;
      }

      navigation.navigate('TvDetail', { id: item.id, title: item.title });
    },
    [navigation],
  );

  if (detailQuery.isLoading) {
    return (
      <View style={detailStyles.screen}>
        <StateView loading title="Loading person…" subtitle="Fetching biography from TMDB." />
      </View>
    );
  }

  if (detailQuery.isError || !detail) {
    return (
      <View style={detailStyles.screen}>
        <StateView
          icon="warning"
          title="Couldn't load this person"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </View>
    );
  }

  const biography = detail.biography?.trim();

  const header = (
    <View>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.profileBlock}>
        <PosterImage
          uri={buildProfileUrl(detail.profile_path)}
          width={PORTRAIT_SIZE}
          height={PORTRAIT_SIZE}
          radius={PORTRAIT_SIZE / 2}
          fallbackLabel="No photo"
        />

        <Text style={styles.name}>{detail.name}</Text>

        {detail.known_for_department ? (
          <Text style={styles.department}>{detail.known_for_department}</Text>
        ) : null}

        <View style={styles.facts}>
          {detail.birthday ? (
            <Text style={styles.fact}>Born {formatDateLabel(detail.birthday)}</Text>
          ) : null}
          {detail.place_of_birth ? (
            <Text style={styles.fact}>{detail.place_of_birth}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.bioBlock}>
        <Text style={detailStyles.blockTitle}>Biography</Text>
        <Text style={detailStyles.overview}>
          {biography ? biography : 'No biography available for this person yet.'}
        </Text>
      </View>

      <Text style={styles.sectionHeading}>Known For</Text>

      {creditsQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.inlineLoader} />
      ) : null}
    </View>
  );

  return (
    <View style={detailStyles.screen}>
      <FlatList
        data={filmography}
        numColumns={2}
        keyExtractor={item => `${item.mediaType}-${item.id}`}
        renderItem={({ item }) => (
          <MediaCard item={item} width={cardWidth} onPress={handlePressCredit} />
        )}
        ListHeaderComponent={header}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <StateView
            compact
            icon="people"
            title="No credits yet"
            subtitle="TMDB has no filmography for this person."
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 4,
  },
  profileBlock: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: layout.screenPadding,
  },
  name: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  department: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  facts: {
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  fact: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  bioBlock: {
    paddingHorizontal: layout.screenPadding,
    gap: 8,
    marginTop: 22,
  },
  sectionHeading: {
    paddingHorizontal: layout.screenPadding,
    marginTop: 26,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  inlineLoader: {
    paddingVertical: 16,
  },
  column: {
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
  },
  listContent: {
    paddingBottom: 32,
    gap: 18,
  },
});
