import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { MediaSummary } from '../types/tmdb';
import { buildPosterUrl } from '../utils/imageUrl';
import { PosterImage } from './PosterImage';
import { RatingBadge } from './RatingBadge';

interface MediaCardProps {
  item: MediaSummary;
  onPress: (item: MediaSummary) => void;
  width?: number;
}

/**
 * Poster card used by every carousel and grid in the app.
 * The rating badge is overlaid on the artwork so the caption keeps two clean
 * lines of text.
 */
export const MediaCard = ({ item, onPress, width = layout.posterCardWidth }: MediaCardProps) => {
  const posterHeight = Math.round(width * layout.posterAspect);

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.dateLabel}`}
      style={({ pressed }) => [{ width }, pressed ? styles.pressed : null]}>
      <View>
        <PosterImage
          uri={buildPosterUrl(item.posterPath, 'posterMedium')}
          width={width}
          height={posterHeight}
          radius={layout.posterCardRadius}
        />
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
    </Pressable>
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
  title: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  caption: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
  },
});
