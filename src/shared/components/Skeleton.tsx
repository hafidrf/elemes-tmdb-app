import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, Easing, StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

const usePulse = () => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 780,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 780,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [opacity]);

  return opacity;
};

interface SkeletonBlockProps {
  width: DimensionValue;
  height: number;
  radius?: number;
}

export const SkeletonBlock = ({ width, height, radius = 8 }: SkeletonBlockProps) => {
  const opacity = usePulse();

  return (
    <Animated.View
      style={[styles.block, { width, height, borderRadius: radius, opacity }]}
    />
  );
};

interface PosterSkeletonProps {
  width?: number;
  showCaption?: boolean;
}

// Same shape as a real poster card, so the layout doesn't jump when data lands.
export const PosterSkeleton = ({
  width = layout.posterCardWidth,
  showCaption = true,
}: PosterSkeletonProps) => {
  const posterHeight = Math.round(width * layout.posterAspect);

  return (
    <Animated.View style={styles.posterWrapper}>
      <SkeletonBlock width={width} height={posterHeight} radius={layout.posterCardRadius} />
      {showCaption ? (
        <>
          <SkeletonBlock width={width * 0.9} height={12} />
          <SkeletonBlock width={width * 0.55} height={10} />
        </>
      ) : null}
    </Animated.View>
  );
};

interface SkeletonRowProps {
  count?: number;
  width?: number;
}

// horizontal strip for the carousel sections
export const SkeletonRow = ({ count = 3, width = layout.posterCardWidth }: SkeletonRowProps) => (
  <Animated.View style={styles.row}>
    {Array.from({ length: count }).map((_, index) => (
      <PosterSkeleton key={index} width={width} />
    ))}
  </Animated.View>
);

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.skeleton,
  },
  posterWrapper: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: layout.gridGap,
    paddingHorizontal: layout.screenPadding,
  },
});
