import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { AppIcon } from './AppIcon';

interface PosterImageProps {
  uri: string | null;
  width: number;
  height: number;
  radius?: number;
  // text shown inside the placeholder
  fallbackLabel?: string;
}

// Poster/portrait image with a placeholder for when the path is null or the
// download fails. The placeholder is a tonal surface rather than a hole, so an
// un-arted title still reads as part of the grid.
export const PosterImage = ({
  uri,
  width,
  height,
  radius = layout.posterCardRadius,
  fallbackLabel = 'No artwork',
}: PosterImageProps) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!uri || failedToLoad) {
    return (
      <View style={[styles.placeholder, { width, height, borderRadius: radius }]}>
        <View style={styles.placeholderIcon}>
          <AppIcon
            name="film"
            size={Math.max(15, Math.round(width * 0.17))}
            color={colors.textMuted}
          />
        </View>
        <Text style={styles.placeholderText} numberOfLines={2}>
          {fallbackLabel}
        </Text>
      </View>
    );
  }

  // FastImage keeps posters in a disk cache, so a poster seen once comes back
  // without a placeholder flash. `immutable` is correct here because TMDB paths
  // carry a content hash, meaning the bytes behind a URL never change.
  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      style={{ width, height, borderRadius: radius }}
      resizeMode={FastImage.resizeMode.cover}
      onError={() => setFailedToLoad(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
