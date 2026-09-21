import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { MediaSummary } from '../types/tmdb';
import { buildPosterUrl } from '../utils/imageUrl';
import { PosterImage } from './PosterImage';
import { PressableScale } from './PressableScale';
import { RatingBadge } from './RatingBadge';
import { Scrim } from './Scrim';

interface MediaCardProps {
  item: MediaSummary;
  onPress: (item: MediaSummary) => void;
  width?: number;
}

// Poster card for the carousels and grids. The artwork fades into the page along
// its bottom edge, which gives the score chip something to sit on and keeps the
// caption from floating. The score stays on the artwork so the caption is two
// lines of text.
export const MediaCard = ({ item, onPress, width = layout.posterCardWidth }: MediaCardProps) => {
  const posterHeight = Math.round(width * layout.posterAspect);

  return (
    <PressableScale
      onPress={() => onPress(item)}
      accessibilityLabel={`${item.title}, ${item.dateLabel}`}
      style={{ width }}>
      <View style={[styles.artwork, { width, height: posterHeight }]}>
        <PosterImage
          uri={buildPosterUrl(item.posterPath, 'posterMedium')}
          width={width}
          height={posterHeight}
          radius={0}
        />
        <Scrim height={Math.round(posterHeight * 0.5)} strength={0.85} />
        <View style={styles.badgeWrapper}>
          <RatingBadge value={item.voteAverage} />
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.caption} numberOfLines={1}>
        {item.dateLabel}
      </Text>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  artwork: {
    borderRadius: layout.posterCardRadius,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  badgeWrapper: {
    position: 'absolute',
    left: 8,
    bottom: 8,
  },
  title: {
    ...type.cardTitle,
    marginTop: 10,
    color: colors.textPrimary,
  },
  caption: {
    ...type.caps,
    marginTop: 3,
    color: colors.textMuted,
  },
});
