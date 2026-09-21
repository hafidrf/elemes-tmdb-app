import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { buildBackdropUrl } from '../utils/imageUrl';
import { BackButton } from './BackButton';

interface BackdropHeaderProps {
  backdropPath: string | null;
  onBack: () => void;
}

// Full-width backdrop with a floating back button. RN has no gradient, so the
// fade down into the page is three stacked bands of the background colour at
// increasing opacity.
export const BackdropHeader = ({ backdropPath, onBack }: BackdropHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const height = Math.round(width * 0.58);
  const uri = buildBackdropUrl(backdropPath);

  return (
    <View style={[styles.container, { width, height }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.fallback} />
      )}

      <View style={[styles.topScrim, { height: insets.top + 72 }]} />

      <View
        style={[styles.band, styles.bandSoft, { height: height * 0.22, bottom: height * 0.28 }]}
      />
      <View
        style={[styles.band, styles.bandMedium, { height: height * 0.3, bottom: height * 0.1 }]}
      />
      <View style={[styles.band, styles.bandBase, { height: height * 0.22 }]} />

      <BackButton
        onPress={onBack}
        style={[styles.backButton, { top: insets.top + 8 }]}
      />
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
    backgroundColor: colors.surfaceElevated,
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(6, 8, 11, 0.55)',
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
  },
  bandSoft: {
    opacity: 0.3,
  },
  bandMedium: {
    opacity: 0.6,
  },
  bandBase: {
    opacity: 0.95,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
});
