import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { formatRating } from '../utils/formatters';
import { AppIcon } from './AppIcon';

interface RatingBadgeProps {
  value: number;
  size?: 'sm' | 'md';
}

// Score chip. It sits on top of artwork, so it is a dark glass pill with a
// single amber star rather than a solid block of colour competing with the
// poster. Unrated titles show a muted "NR" instead of 0.0.
export const RatingBadge = ({ value, size = 'sm' }: RatingBadgeProps) => {
  const label = formatRating(value);
  const isRated = label !== 'NR';
  const isLarge = size === 'md';

  return (
    <View style={[styles.badge, isLarge ? styles.badgeLarge : styles.badgeSmall]}>
      <AppIcon
        name={isRated ? 'star' : 'starOutline'}
        size={isLarge ? 13 : 10}
        color={isRated ? colors.primary : colors.textMuted}
      />
      <Text
        style={[
          styles.label,
          isLarge ? styles.labelLarge : styles.labelSmall,
          { color: isRated ? colors.textPrimary : colors.textMuted },
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
    gap: 3,
    borderRadius: layout.radiusFull,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 11,
  },
  labelLarge: {
    fontSize: 13,
  },
});
