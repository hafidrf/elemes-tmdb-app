import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { AppIcon } from './AppIcon';

interface PosterImageProps {
  uri: string | null;
  width: number;
  height: number;
  radius?: number;
  /** Caption shown inside the placeholder when no artwork is available. */
  fallbackLabel?: string;
}

/**
 * Poster/portrait image with a designed placeholder.
 *
 * Handles both `null` paths from TMDB and remote load failures, so a missing
 * image never shows up as a broken icon or a blank white box.
 */
export const PosterImage = ({
  uri,
  width,
  height,
  radius = 12,
  fallbackLabel = 'No artwork',
}: PosterImageProps) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!uri || failedToLoad) {
    return (
      <View style={[styles.placeholder, { width, height, borderRadius: radius }]}>
        <AppIcon name="film" size={Math.max(16, Math.round(width * 0.2))} />
        <Text style={styles.placeholderText} numberOfLines={2}>
          {fallbackLabel}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width, height, borderRadius: radius }}
      resizeMode="cover"
      onError={() => setFailedToLoad(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
