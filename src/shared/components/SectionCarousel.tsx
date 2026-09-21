import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { MediaSummary } from '../types/tmdb';
import { AppIcon } from './AppIcon';
import { MediaCard } from './MediaCard';
import { PressableScale } from './PressableScale';
import { SkeletonRow } from './Skeleton';
import { StateView } from './StateView';

interface SectionCarouselProps {
  title: string;
  subtitle?: string;
  items: MediaSummary[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSeeAll?: () => void;
  onPressItem: (item: MediaSummary) => void;
}

// One shelf: heading, the "See all" pill, then the posters. The heading renders
// straight away, only the body swaps between skeleton, error, empty and cards.
export const SectionCarousel = ({
  title,
  subtitle,
  items,
  isLoading,
  isError,
  onRetry,
  onSeeAll,
  onPressItem,
}: SectionCarouselProps) => {
  const showSkeleton = isLoading && items.length === 0;
  const showError = isError && items.length === 0;
  const showEmpty = !isLoading && !isError && items.length === 0;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headingText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {onSeeAll ? (
          <PressableScale
            onPress={onSeeAll}
            accessibilityLabel={`See all ${title}`}
            hitSlop={6}
            scaleTo={0.94}
            style={styles.seeAll}>
            <Text style={styles.seeAllLabel}>See all</Text>
            <AppIcon name="chevronRight" size={14} color={colors.primary} />
          </PressableScale>
        ) : null}
      </View>

      {showSkeleton ? <SkeletonRow /> : null}

      {showError ? (
        <StateView
          compact
          icon="warning"
          title="Couldn't load this shelf"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={onRetry}
        />
      ) : null}

      {showEmpty ? (
        <StateView
          compact
          icon="film"
          title="Nothing to show yet"
          subtitle="TMDB has no titles for this list right now."
        />
      ) : null}

      {items.length > 0 ? (
        <FlatList
          horizontal
          data={items}
          keyExtractor={item => `${item.mediaType}-${item.id}`}
          renderItem={({ item }) => <MediaCard item={item} onPress={onPressItem} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
        />
      ) : null}
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  section: {
    marginBottom: layout.sectionGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    marginBottom: layout.space3,
    gap: layout.space3,
  },
  headingText: {
    flex: 1,
  },
  title: {
    ...type.titleLarge,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.label,
    marginTop: 3,
    color: colors.textMuted,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: layout.space3,
    paddingRight: layout.space2,
    paddingVertical: 7,
    borderRadius: layout.radiusFull,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  seeAllLabel: {
    ...type.label,
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
  },
  separator: {
    width: layout.gridGap,
  },
});
