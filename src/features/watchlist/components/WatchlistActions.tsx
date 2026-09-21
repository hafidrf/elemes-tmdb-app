import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { AppIcon } from '../../../shared/components/AppIcon';
import { StarRating } from '../../../shared/components/StarRating';
import { colors } from '../../../shared/theme/colors';
import { MediaSummary } from '../../../shared/types/tmdb';
import {
  selectIsInWatchlist,
  selectUserRating,
  setUserRating,
  toggleWatchlist,
} from '../watchlistSlice';

interface WatchlistActionsProps {
  item: MediaSummary;
}

/**
 * Watchlist toggle plus the user's own star rating.
 * The rating control only appears once the title is in the watchlist, so the
 * detail screen stays calm for titles the user is just browsing.
 */
export const WatchlistActions = ({ item }: WatchlistActionsProps) => {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(state =>
    selectIsInWatchlist(state, item.id, item.mediaType),
  );
  const userRating = useAppSelector(state =>
    selectUserRating(state, item.id, item.mediaType),
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => dispatch(toggleWatchlist(item))}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
        style={({ pressed }) => [
          styles.button,
          isSaved ? styles.buttonSaved : styles.buttonIdle,
          pressed ? styles.pressed : null,
        ]}>
        <AppIcon
          name="bookmark"
          size={16}
          style={isSaved ? undefined : styles.buttonLabelIdle}
        />
        <Text style={isSaved ? styles.buttonLabelSaved : styles.buttonLabelIdle}>
          {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
        </Text>
      </Pressable>

      {isSaved ? (
        <View style={styles.ratingBlock}>
          <StarRating
            label="Your rating"
            value={userRating}
            onChange={next =>
              dispatch(
                setUserRating({
                  id: item.id,
                  mediaType: item.mediaType,
                  userRating: next,
                }),
              )
            }
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonIdle: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  buttonSaved: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonLabelIdle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonLabelSaved: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  ratingBlock: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
