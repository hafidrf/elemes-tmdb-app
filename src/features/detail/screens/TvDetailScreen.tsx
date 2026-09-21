import React, { useCallback, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigation/types';
import { useTvCreditsQuery, useTvDetailQuery } from '../../../shared/api/tmdbApi';
import { BackdropHeader } from '../../../shared/components/BackdropHeader';
import { CastRow } from '../../../shared/components/CastRow';
import { GenreChips } from '../../../shared/components/GenreChips';
import { PosterImage } from '../../../shared/components/PosterImage';
import { RatingBadge } from '../../../shared/components/RatingBadge';
import { StateView } from '../../../shared/components/StateView';
import { layout } from '../../../shared/theme/layout';
import { CastMember, MediaSummary } from '../../../shared/types/tmdb';
import { formatCount, formatDateLabel, formatRuntime } from '../../../shared/utils/formatters';
import { buildPosterUrl } from '../../../shared/utils/imageUrl';
import { WatchlistActions } from '../../watchlist/components/WatchlistActions';
import { detailStyles as styles } from '../detailStyles';

const POSTER_WIDTH = 118;

export const TvDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TvDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id } = route.params;

  const detailQuery = useTvDetailQuery(id);
  const creditsQuery = useTvCreditsQuery(id);
  const detail = detailQuery.data;

  const summary = useMemo<MediaSummary | null>(() => {
    if (!detail) {
      return null;
    }

    return {
      id: detail.id,
      mediaType: 'tv',
      title: detail.name,
      posterPath: detail.poster_path,
      voteAverage: detail.vote_average,
      dateLabel: formatDateLabel(detail.first_air_date),
    };
  }, [detail]);

  const handlePressPerson = useCallback(
    (member: CastMember) => {
      navigation.navigate('PersonDetail', { id: member.id, name: member.name });
    },
    [navigation],
  );

  const handleRetry = useCallback(() => {
    detailQuery.refetch();
    creditsQuery.refetch();
  }, [creditsQuery, detailQuery]);

  if (detailQuery.isLoading) {
    return (
      <View style={styles.screen}>
        <StateView loading title="Loading TV show..." subtitle="Fetching details from TMDB." />
      </View>
    );
  }

  if (detailQuery.isError || !detail || !summary) {
    return (
      <View style={styles.screen}>
        <StateView
          icon="warning"
          title="Couldn't load this TV show"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </View>
    );
  }

  const hasOverview = Boolean(detail.overview?.trim());
  const episodeRuntime = detail.episode_run_time?.[0];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <BackdropHeader backdropPath={detail.backdrop_path} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={styles.heroRow}>
          <PosterImage
            uri={buildPosterUrl(detail.poster_path, 'posterLarge')}
            width={POSTER_WIDTH}
            height={Math.round(POSTER_WIDTH * layout.posterAspect)}
            radius={layout.radiusMd}
          />

          <View style={styles.heroText}>
            <Text style={styles.title}>{detail.name}</Text>

            {detail.original_name && detail.original_name !== detail.name ? (
              <Text style={styles.originalTitle}>{detail.original_name}</Text>
            ) : null}

            <View style={styles.metaRow}>
              <RatingBadge value={detail.vote_average} size="md" />

              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{formatDateLabel(detail.first_air_date)}</Text>
              </View>

              <View style={styles.metaChip}>
                <Text style={styles.metaText}>
                  {episodeRuntime ? `${formatRuntime(episodeRuntime)} / episode` : 'Runtime TBA'}
                </Text>
              </View>

              {detail.status ? (
                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>{detail.status}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.metaMuted}>{formatCount(detail.vote_count)} TMDB votes</Text>
          </View>
        </View>

        <GenreChips genres={detail.genres} />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{detail.number_of_seasons}</Text>
            <Text style={styles.statLabel}>
              {detail.number_of_seasons === 1 ? 'Season' : 'Seasons'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{detail.number_of_episodes}</Text>
            <Text style={styles.statLabel}>Episodes</Text>
          </View>
        </View>

        {detail.tagline ? <Text style={styles.tagline}>{detail.tagline}</Text> : null}

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Overview</Text>
          <Text style={styles.overview}>
            {hasOverview ? detail.overview : 'No overview available yet.'}
          </Text>
        </View>

        <WatchlistActions item={summary} />

        {creditsQuery.isLoading ? (
          <StateView compact loading title="Loading cast..." />
        ) : null}

        {creditsQuery.data ? (
          <CastRow cast={creditsQuery.data.cast} onPressPerson={handlePressPerson} />
        ) : null}
      </View>
    </ScrollView>
  );
};
