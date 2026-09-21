import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

// Plain text glyphs instead of an icon font. react-native-vector-icons needs an
// extra Gradle font-linking step on Android, and this is a tab bar plus a few
// badges, not a design system.
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
