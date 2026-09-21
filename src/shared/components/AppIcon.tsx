import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

/**
 * Lightweight glyph-based icon set.
 *
 * Deliberately dependency-free: `react-native-vector-icons` needs an extra
 * Gradle font-linking step, and on RN's New Architecture that is one more
 * native failure point than this project needs. Everything here is plain text,
 * so it renders identically on every device with zero native configuration.
 */
export type IconName =
  | 'movie'
  | 'tv'
  | 'people'
  | 'bookmark'
  | 'search'
  | 'star'
  | 'starOutline'
  | 'close'
  | 'chevronRight'
  | 'chevronLeft'
  | 'film'
  | 'warning'
  | 'refresh'
  | 'wifiOff';

const GLYPHS: Record<IconName, string> = {
  movie: '🎬',
  tv: '📺',
  people: '👥',
  bookmark: '🔖',
  search: '🔍',
  star: '★',
  starOutline: '☆',
  close: '✕',
  chevronRight: '›',
  chevronLeft: '‹',
  film: '🎞',
  warning: '⚠',
  refresh: '⟳',
  wifiOff: '⚡',
};

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const AppIcon = ({ name, size = 16, color, style }: AppIconProps) => {
  return (
    <Text
      allowFontScaling={false}
      style={[styles.icon, { fontSize: size }, color ? { color } : null, style]}>
      {GLYPHS[name]}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
