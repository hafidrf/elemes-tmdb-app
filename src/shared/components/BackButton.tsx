import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { AppIcon } from './AppIcon';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// back button shared by the detail and search screens. It floats over artwork,
// so it is a translucent circle rather than a solid disc.
export const BackButton = ({ onPress, style }: BackButtonProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Go back"
    hitSlop={8}
    style={({ pressed }) => [styles.button, style, pressed ? styles.pressed : null]}>
    <AppIcon name="chevronLeft" size={24} color={colors.textPrimary} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: layout.touchTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  pressed: {
    opacity: 0.7,
  },
});
