import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '../../../shared/components/AppIcon';
import { PosterImage } from '../../../shared/components/PosterImage';
import { RatingBadge } from '../../../shared/components/RatingBadge';
import { StarRating } from '../../../shared/components/StarRating';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { MediaSummary } from '../../../shared/types/tmdb';
import { buildPosterUrl } from '../../../shared/utils/imageUrl';
import { WatchlistEntry } from '../watchlistSlice';
import { toMediaSummaryFromEntry } from '../watchlistSummary';

interface WatchlistCardProps {
  entry: WatchlistEntry;
  width: number;
  onPress: (item: MediaSummary) => void;
  onRemove: (entry: WatchlistEntry) => void;
  onRate: (entry: WatchlistEntry, rating: number) => void;
}

export const WatchlistCard = ({
  entry,
  width,
  onPress,
  onRemove,
  onRate,
}: WatchlistCardProps) => {
  const posterHeight = Math.round(width * layout.posterAspect);

  return (
    <View style={{ width }}>
      <Pressable
        onPress={() => onPress(toMediaSummaryFromEntry(entry))}
        accessibilityRole="button"
        accessibilityLabel={entry.title}
        style={({ pressed }) => (pressed ? styles.pressed : null)}>
        <PosterImage
          uri={buildPosterUrl(entry.posterPath, 'posterMedium')}
          width={width}
          height={posterHeight}
          radius={layout.posterCardRadius}
        />
        <View style={styles.badgeWrapper}>
          <RatingBadge value={entry.voteAverage} />
        </View>
      </Pressable>

      <View style={styles.cardBody}>
        <Text style={styles.title} numberOfLines={2}>
          {entry.title}
        </Text>
        <Text style={styles.caption} numberOfLines={1}>
          {entry.mediaType === 'movie' ? 'Movie' : 'TV Show'} · {entry.dateLabel}
        </Text>

        <StarRating value={entry.userRating} size={18} onChange={next => onRate(entry, next)} />

        <Pressable
          onPress={() => onRemove(entry)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${entry.title} from watchlist`}
          style={({ pressed }) => [styles.remove, pressed ? styles.pressed : null]}>
          <AppIcon name="close" size={13} color={colors.danger} />
          <Text style={styles.removeLabel}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  badgeWrapper: {
    position: 'absolute',
    left: 6,
    bottom: 6,
  },
  cardBody: {
    marginTop: 8,
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  caption: {
    fontSize: 11,
    color: colors.textMuted,
  },
  remove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  removeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
});
