import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { MediaSummary } from '../types/tmdb';
import { AppIcon } from './AppIcon';
import { MediaCard } from './MediaCard';
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

/**
 * One horizontal shelf: heading, optional "See All", then the posters.
 * The heading renders immediately — only the shelf body swaps between
 * skeletons, an error state, an empty state and real cards.
 */
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
          <Pressable
            onPress={onSeeAll}
            accessibilityRole="button"
            accessibilityLabel={`See all ${title}`}
            style={({ pressed }) => [styles.seeAll, pressed ? styles.seeAllPressed : null]}>
            <Text style={styles.seeAllLabel}>See All</Text>
            <AppIcon name="chevronRight" size={18} color={colors.primary} />
          </Pressable>
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    marginBottom: 12,
    gap: 12,
  },
  headingText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  seeAllPressed: {
    opacity: 0.6,
  },
  seeAllLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
  },
  separator: {
    width: layout.gridGap,
  },
});
