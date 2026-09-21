import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface ScrimProps {
  height: number;
  // which edge the fade sits on
  edge?: 'bottom' | 'top';
  // opacity reached at the far end of the ramp
  strength?: number;
  // enough steps that the eye reads a gradient, not bands
  steps?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

// React Native ships no gradient, so the fade is a stack of thin bands whose
// opacity follows a curve rather than a straight line. Ten bands is where the
// banding stops showing on a phone screen.
export const Scrim = ({
  height,
  edge = 'bottom',
  strength = 0.92,
  steps = 10,
  radius = 0,
  style,
}: ScrimProps) => (
  <View
    pointerEvents="none"
    style={[
      styles.container,
      edge === 'bottom' ? styles.atBottom : styles.atTop,
      edge === 'bottom' ? styles.columnReverse : styles.column,
      { height, borderRadius: radius },
      style,
    ]}>
    {Array.from({ length: steps }).map((_, index) => {
      const progress = (index + 1) / steps;
      return (
        <View
          key={index}
          style={[
            styles.band,
            { backgroundColor: `rgba(8, 9, 12, ${(progress * progress * strength).toFixed(3)})` },
          ]}
        />
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  atBottom: {
    bottom: 0,
  },
  atTop: {
    top: 0,
  },
  column: {
    flexDirection: 'column',
  },
  columnReverse: {
    flexDirection: 'column-reverse',
  },
  band: {
    flex: 1,
  },
});
