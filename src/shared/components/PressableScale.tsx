import React, { useCallback, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface PressableScaleProps {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: 'button' | 'link';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  // how far the element shrinks while held
  scaleTo?: number;
  hitSlop?: number;
}

// Tactile press state. Modern mobile UIs answer a touch with a small spring
// instead of a flat opacity change, which also reads better on a poster where
// fading the artwork looks like a load glitch.
export const PressableScale = ({
  onPress,
  children,
  style,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  scaleTo = 0.95,
  hitSlop,
}: PressableScaleProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = useCallback(
    (value: number) => {
      Animated.spring(scale, {
        toValue: value,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }).start();
    },
    [scale],
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
};
