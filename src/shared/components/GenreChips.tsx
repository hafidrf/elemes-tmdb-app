import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { Genre } from '../types/tmdb';

interface GenreChipsProps {
  genres: Genre[];
}

// Material 3 assist chips. Small, tonal, and quietly rounded rather than full
// pills, which keeps them from reading as buttons.
export const GenreChips = ({ genres }: GenreChipsProps) => {
  if (genres.length === 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      {genres.map(genre => (
        <View key={genre.id} style={styles.chip}>
          <Text style={styles.label}>{genre.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.space2,
  },
  chip: {
    paddingHorizontal: layout.space3,
    paddingVertical: 6,
    borderRadius: layout.radiusXs,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...type.label,
    color: colors.textSecondary,
  },
});
