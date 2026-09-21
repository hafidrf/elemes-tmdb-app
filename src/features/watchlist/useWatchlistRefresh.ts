import { useCallback, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../app/store/store';
import { tmdbApi } from '../../shared/api/tmdbApi';
import { MediaSummary } from '../../shared/types/tmdb';
import { formatDateLabel } from '../../shared/utils/formatters';
import {
  applyRefreshedSnapshots,
  selectWatchlistEntries,
  WatchlistEntry,
} from './watchlistSlice';

// A saved entry keeps the values it had the day it was saved, so its score and
// poster can go stale. One detail request per entry pulls them back up to date.
const fetchSnapshot = async (
  dispatch: AppDispatch,
  entry: WatchlistEntry,
): Promise<MediaSummary | null> => {
  try {
    // forceRefetch, because the point of the gesture is a fresh read rather than
    // whatever is sitting in the cache
    if (entry.mediaType === 'movie') {
      const detail = await dispatch(
        tmdbApi.endpoints.movieDetail.initiate(entry.id, { forceRefetch: true }),
      ).unwrap();

      return {
        id: detail.id,
        mediaType: 'movie',
        title: detail.title,
        posterPath: detail.poster_path,
        voteAverage: detail.vote_average,
        dateLabel: formatDateLabel(detail.release_date),
      };
    }

    const detail = await dispatch(
      tmdbApi.endpoints.tvDetail.initiate(entry.id, { forceRefetch: true }),
    ).unwrap();

    return {
      id: detail.id,
      mediaType: 'tv',
      title: detail.name,
      posterPath: detail.poster_path,
      voteAverage: detail.vote_average,
      dateLabel: formatDateLabel(detail.first_air_date),
    };
  } catch {
    // the title is gone from TMDB, or the phone is offline. Keeping the snapshot
    // the user saved beats dropping the row over one failed refresh.
    return null;
  }
};

// Pull-to-refresh for the watchlist screen. Re-reading AsyncStorage here would
// change nothing: this app is the only writer of that key, so it would hand back
// exactly what the slice already holds. Asking TMDB again is the refresh that can
// actually produce a different answer.
export const useWatchlistRefresh = () => {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectWatchlistEntries);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (entries.length === 0) {
      return;
    }

    setIsRefreshing(true);

    try {
      const snapshots = await Promise.all(
        entries.map(entry => fetchSnapshot(dispatch, entry)),
      );
      const fresh = snapshots.filter((item): item is MediaSummary => item !== null);

      if (fresh.length > 0) {
        dispatch(applyRefreshedSnapshots(fresh));
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, entries]);

  return { refresh, isRefreshing };
};
