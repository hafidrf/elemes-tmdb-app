import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { Genre } from '../types/tmdb';

interface GenreChipsProps {
  genres: Genre[];
}

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
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
