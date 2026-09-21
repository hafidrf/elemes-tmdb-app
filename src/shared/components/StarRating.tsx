import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { AppIcon } from './AppIcon';

interface StarRatingProps {
  // 0-5, 0 means not rated
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  label?: string;
  readOnly?: boolean;
}

const STARS = [1, 2, 3, 4, 5];

// Five stars. Pass onChange for an input, leave it out for a read-out. Tapping
// the current star clears the rating, otherwise a mis-tap can't be undone.
export const StarRating = ({
  value,
  onChange,
  size = 22,
  label,
  readOnly = false,
}: StarRatingProps) => {
  const handlePress = (star: number) => {
    if (readOnly || !onChange) {
      return;
    }

    onChange(star === value ? 0 : star);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.stars}>
        {STARS.map(star => {
          const isFilled = star <= value;

          return (
            <Pressable
              key={star}
              disabled={readOnly}
              onPress={() => handlePress(star)}
              accessibilityRole="button"
              accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
              hitSlop={4}
              style={({ pressed }) => (pressed && !readOnly ? styles.pressed : null)}>
              <AppIcon
                name={isFilled ? 'star' : 'starOutline'}
                size={size}
                color={isFilled ? colors.primary : colors.textMuted}
              />
            </Pressable>
          );
        })}

        {value > 0 ? <Text style={styles.valueLabel}>{value}/5</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: layout.space2,
  },
  label: {
    ...type.caps,
    color: colors.textSecondary,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.space2,
  },
  pressed: {
    opacity: 0.6,
  },
  valueLabel: {
    ...type.label,
    marginLeft: layout.space1,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});
