import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../app/navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { AppIcon } from './AppIcon';
import { PressableScale } from './PressableScale';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

// The tabs' own headline. The navigator header is off, otherwise the same word
// would show up twice on screen. The search affordance is a full-width pill
// rather than an icon button, so the tap target matches what it opens.
export const ScreenHeader = ({ title, subtitle, showSearch = true }: ScreenHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + layout.space2 }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {showSearch ? (
        <PressableScale
          onPress={() => navigation.navigate('Search')}
          accessibilityLabel="Search movies, TV shows and people"
          scaleTo={0.98}
          style={styles.searchBar}>
          <AppIcon name="search" size={18} color={colors.textMuted} />
          <Text style={styles.searchHint}>Search movies, TV shows, people</Text>
        </PressableScale>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: layout.space5,
  },
  title: {
    ...type.display,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.label,
    marginTop: layout.space1,
    color: colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.space2,
    height: 46,
    marginTop: layout.space4,
    paddingHorizontal: layout.space3,
    borderRadius: layout.radiusFull,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchHint: {
    ...type.body,
    color: colors.textMuted,
  },
});
