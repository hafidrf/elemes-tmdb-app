import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { MediaSummary } from '../../../shared/types/tmdb';
import { CatalogCategory } from '../catalogConfig';
import { CatalogSection } from '../components/CatalogSection';

interface CatalogGroupScreenProps {
  categories: CatalogCategory[];
  heading: string;
  subheading: string;
}

/**
 * Scrollable group of shelves — used for both the Movies tab and the TV tab,
 * and for the People tab's single grid-free section is handled separately.
 */
export const CatalogGroupScreen = ({
  categories,
  heading,
  subheading,
}: CatalogGroupScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshToken, setRefreshToken] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handlePressItem = useCallback(
    (item: MediaSummary) => {
      if (item.mediaType === 'movie') {
        navigation.navigate('MovieDetail', { id: item.id, title: item.title });
        return;
      }

      navigation.navigate('TvDetail', { id: item.id, title: item.title });
    },
    [navigation],
  );

  const handleSeeAll = useCallback(
    (category: CatalogCategory) => {
      navigation.navigate('CategoryList', { categoryKey: category.key });
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshToken(token => token + 1);
    // Each shelf refetches independently, so there is no single promise to
    // await here — this timer only drives the pull-to-refresh spinner.
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surfaceElevated}
        />
      }>
      <ScreenHeader title={heading} subtitle={subheading} />

      {categories.map(category => (
        <CatalogSection
          key={category.key}
          category={category}
          refreshToken={refreshToken}
          onSeeAll={handleSeeAll}
          onPressItem={handlePressItem}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: layout.screenPadding,
    paddingBottom: 8,
  },
});
