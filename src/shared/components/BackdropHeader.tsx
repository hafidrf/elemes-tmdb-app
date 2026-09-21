import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { buildBackdropUrl } from '../utils/imageUrl';
import { BackButton } from './BackButton';
import { Scrim } from './Scrim';

interface BackdropHeaderProps {
  backdropPath: string | null;
  onBack: () => void;
}

// Full-width backdrop with a floating back button. The artwork fades into the
// page along the bottom and darkens behind the top bar, which is what keeps the
// back button readable over a bright still.
export const BackdropHeader = ({ backdropPath, onBack }: BackdropHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const height = Math.round(width * 0.62);
  const uri = buildBackdropUrl(backdropPath);

  return (
    <View style={[styles.container, { width, height }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.fallback} />
      )}

      <Scrim height={Math.round(height * 0.62)} strength={1} steps={14} />
      <Scrim
        edge="top"
        height={insets.top + 88}
        strength={0.7}
        steps={8}
        style={styles.topScrim}
      />

      <BackButton onPress={onBack} style={[styles.backButton, { top: insets.top + 8 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceContainerHigh,
  },
  topScrim: {
    opacity: 0.9,
  },
  backButton: {
    position: 'absolute',
    left: layout.screenPadding,
  },
});
