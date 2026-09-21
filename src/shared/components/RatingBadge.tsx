import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { formatRating } from '../utils/formatters';
import { AppIcon } from './AppIcon';

interface RatingBadgeProps {
  value: number;
  size?: 'sm' | 'md';
}

// Score pill. Unrated titles show a muted "NR" instead of 0.0.
export const RatingBadge = ({ value, size = 'sm' }: RatingBadgeProps) => {
  const label = formatRating(value);
  const isRated = label !== 'NR';
  const isLarge = size === 'md';

  return (
    <View
      style={[
        styles.badge,
        isLarge ? styles.badgeLarge : styles.badgeSmall,
        isRated ? styles.badgeRated : styles.badgeUnrated,
      ]}>
      <AppIcon
        name={isRated ? 'star' : 'starOutline'}
        size={isLarge ? 13 : 11}
        color={isRated ? colors.background : colors.textSecondary}
      />
      <Text
        style={[
          styles.label,
          isLarge ? styles.labelLarge : styles.labelSmall,
          { color: isRated ? colors.background : colors.textSecondary },
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeRated: {
    backgroundColor: colors.primary,
  },
  badgeUnrated: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontSize: 11,
  },
  labelLarge: {
    fontSize: 13,
  },
});
