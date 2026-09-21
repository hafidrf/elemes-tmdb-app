import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { AppIcon } from '../../../shared/components/AppIcon';
import { PressableScale } from '../../../shared/components/PressableScale';
import { StarRating } from '../../../shared/components/StarRating';
import { colors } from '../../../shared/theme/colors';
import { layout } from '../../../shared/theme/layout';
import { type } from '../../../shared/theme/typography';
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

// watchlist button plus the user's own star rating. The stars only appear once
// the title is saved, so browsing stays uncluttered. The saved state drops to a
// tonal button because the action is already done.
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
      <PressableScale
        onPress={() => dispatch(toggleWatchlist(item))}
        accessibilityLabel={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
        scaleTo={0.98}
        style={[styles.button, isSaved ? styles.buttonSaved : styles.buttonIdle]}>
        <AppIcon
          name={isSaved ? 'bookmarkFilled' : 'bookmark'}
          size={18}
          color={isSaved ? colors.onPrimaryContainer : colors.onPrimary}
        />
        <Text style={isSaved ? styles.labelSaved : styles.labelIdle}>
          {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
        </Text>
      </PressableScale>

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
    gap: layout.space3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.space2,
    height: 50,
    borderRadius: layout.radiusFull,
    borderWidth: 1,
  },
  buttonIdle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonSaved: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primary,
  },
  labelIdle: {
    ...type.labelLarge,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  labelSaved: {
    ...type.labelLarge,
    fontWeight: '700',
    color: colors.onPrimaryContainer,
  },
  ratingBlock: {
    padding: layout.space4,
    borderRadius: layout.radiusLg,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
