import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { AppIcon } from './AppIcon';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// back button shared by the detail and search screens
export const BackButton = ({ onPress, style }: BackButtonProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Go back"
    hitSlop={8}
    style={({ pressed }) => [styles.button, style, pressed ? styles.pressed : null]}>
    <AppIcon name="chevronLeft" size={26} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 13, 16, 0.72)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
