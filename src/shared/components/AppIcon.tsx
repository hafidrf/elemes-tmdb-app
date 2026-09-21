import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons';

import { colors } from '../theme/colors';

// One icon family, mostly the outline cut. Ionicons autolinks on Android, so
// there is no manual font-linking step, and a real icon font keeps the chrome
// monochrome instead of the colour emoji a text glyph gives you.
export type IconName =
  | 'movie'
  | 'tv'
  | 'people'
  | 'bookmark'
  | 'bookmarkFilled'
  | 'search'
  | 'star'
  | 'starOutline'
  | 'close'
  | 'chevronRight'
  | 'chevronLeft'
  | 'film'
  | 'warning'
  | 'refresh'
  | 'offline'
  | 'play'
  | 'clock'
  | 'calendar'
  | 'trending'
  | 'trash'
  | 'info'
  | 'check'
  | 'eye';

const GLYPHS: Record<IconName, IoniconsIconName> = {
  movie: 'film-outline',
  tv: 'tv-outline',
  people: 'people-outline',
  bookmark: 'bookmark-outline',
  bookmarkFilled: 'bookmark',
  search: 'search-outline',
  star: 'star',
  starOutline: 'star-outline',
  close: 'close',
  chevronRight: 'chevron-forward',
  chevronLeft: 'chevron-back',
  film: 'film-outline',
  warning: 'alert-circle-outline',
  refresh: 'refresh-outline',
  offline: 'cloud-offline-outline',
  play: 'play-circle-outline',
  clock: 'time-outline',
  calendar: 'calendar-outline',
  trending: 'trending-up-outline',
  trash: 'trash-outline',
  info: 'information-circle-outline',
  check: 'checkmark',
  eye: 'eye-outline',
};

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const AppIcon = ({ name, size = 16, color = colors.textPrimary, style }: AppIconProps) => (
  <Ionicons name={GLYPHS[name]} size={size} color={color} style={style} />
);
