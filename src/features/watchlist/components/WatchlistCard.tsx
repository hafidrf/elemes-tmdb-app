import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '../../../shared/components/AppIcon';
import { PosterImage } from '../../../shared/components/PosterImage';
import { PressableScale } from '../../../shared/components/PressableScale';
import { RatingBadge } from '../../../shared/components/RatingBadge';
import { Scrim } from '../../../shared/components/Scrim';
import { StarRating } from '../../../shared/components/StarRating';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { type } from '../../../shared/theme/typography';
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

// Saved title, shown as a tonal card rather than a loose poster, because the
// user's own rating is part of the card and needs a surface under it.
export const WatchlistCard = ({
  entry,
  width,
  onPress,
  onRemove,
  onRate,
}: WatchlistCardProps) => {
  const innerWidth = width - layout.space1 * 2;
  const posterHeight = Math.round(innerWidth * layout.posterAspect);

  return (
    <View style={[styles.card, { width }]}>
      <PressableScale
        onPress={() => onPress(toMediaSummaryFromEntry(entry))}
        accessibilityLabel={entry.title}
        scaleTo={0.97}>
        <View style={[styles.artwork, { height: posterHeight }]}>
          <PosterImage
            uri={buildPosterUrl(entry.posterPath, 'posterMedium')}
            width={innerWidth}
            height={posterHeight}
            radius={0}
          />
          <Scrim height={Math.round(posterHeight * 0.5)} strength={0.85} />
          <View style={styles.badgeWrapper}>
            <RatingBadge value={entry.voteAverage} />
          </View>
        </View>
      </PressableScale>

      <Text style={styles.title} numberOfLines={2}>
        {entry.title}
      </Text>
      <Text style={styles.caption} numberOfLines={1}>
        {entry.mediaType === 'movie' ? 'Movie' : 'TV Show'} · {entry.dateLabel}
      </Text>

      <StarRating value={entry.userRating} size={19} onChange={next => onRate(entry, next)} />

      <PressableScale
        onPress={() => onRemove(entry)}
        accessibilityLabel={`Remove ${entry.title} from watchlist`}
        scaleTo={0.95}
        style={styles.remove}>
        <AppIcon name="trash" size={14} color={colors.error} />
        <Text style={styles.removeLabel}>Remove</Text>
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: layout.space2,
    padding: layout.space2,
    borderRadius: layout.radiusLg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  artwork: {
    borderRadius: layout.radiusMd,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
  },
  badgeWrapper: {
    position: 'absolute',
    left: layout.space2,
    bottom: layout.space2,
  },
  title: {
    ...type.cardTitle,
    color: colors.textPrimary,
  },
  caption: {
    ...type.caps,
    fontSize: 10,
    color: colors.textMuted,
  },
  remove: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: layout.space1,
    marginTop: layout.space1,
    paddingHorizontal: layout.space3,
    paddingVertical: 6,
    borderRadius: layout.radiusFull,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeLabel: {
    ...type.label,
    color: colors.error,
    fontWeight: '700',
  },
});
