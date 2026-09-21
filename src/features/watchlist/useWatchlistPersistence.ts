import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { hydrateWatchlist, selectIsHydrated, selectWatchlistEntries } from './watchlistSlice';
import { loadWatchlist, saveWatchlist } from './watchlistStorage';

// Keeps the watchlist slice and AsyncStorage in sync. The hydrated flag matters:
// without it the first render would write the empty initial state straight back
// over whatever the user had saved.
export const useWatchlistPersistence = () => {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectWatchlistEntries);
  const hydrated = useAppSelector(selectIsHydrated);

  useEffect(() => {
    let cancelled = false;

    loadWatchlist()
      .then(stored => {
        if (!cancelled) {
          dispatch(hydrateWatchlist(stored));
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch(hydrateWatchlist([]));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveWatchlist(entries).catch(() => undefined);
  }, [entries, hydrated]);
};
