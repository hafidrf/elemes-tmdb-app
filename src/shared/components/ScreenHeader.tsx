import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../app/navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { AppIcon } from './AppIcon';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

/**
 * In-screen headline used by the four tabs.
 *
 * The tab navigator's own header is hidden so each tab can carry a large
 * cinema-style title instead of repeating the same word twice on screen.
 */
export const ScreenHeader = ({ title, subtitle, showSearch = true }: ScreenHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showSearch ? (
        <Pressable
          onPress={() => navigation.navigate('Search')}
          accessibilityRole="button"
          accessibilityLabel="Search movies, TV shows and people"
          hitSlop={6}
          style={({ pressed }) => [styles.searchButton, pressed ? styles.searchPressed : null]}>
          <AppIcon name="search" size={18} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: layout.screenPadding,
    marginBottom: 20,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPressed: {
    opacity: 0.7,
  },
});
