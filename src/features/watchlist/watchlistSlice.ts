import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MediaSummary, WatchableMediaType } from '../../shared/types/tmdb';
import type { RootState } from '../../app/store/store';

export interface WatchlistEntry {
  id: number;
  mediaType: WatchableMediaType;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  dateLabel: string;
  // the user's own 0-5 score, 0 = not rated
  userRating: number;
  addedAt: number;
}

export interface WatchlistState {
  entries: WatchlistEntry[];
  // set once AsyncStorage has been read, so we don't clobber it with []
  hydrated: boolean;
}

const initialState: WatchlistState = {
  entries: [],
  hydrated: false,
};

const entryKey = (id: number, mediaType: WatchableMediaType): string => `${mediaType}-${id}`;

// the one place that knows how an entry is shaped
const insertEntry = (state: WatchlistState, item: MediaSummary): void => {
  const key = entryKey(item.id, item.mediaType);

  if (state.entries.some(entry => entryKey(entry.id, entry.mediaType) === key)) {
    return;
  }

  state.entries.unshift({
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    posterPath: item.posterPath,
    voteAverage: item.voteAverage,
    dateLabel: item.dateLabel,
    userRating: 0,
    addedAt: Date.now(),
  });
};

const removeEntry = (
  state: WatchlistState,
  id: number,
  mediaType: WatchableMediaType,
): void => {
  const key = entryKey(id, mediaType);
  state.entries = state.entries.filter(
    entry => entryKey(entry.id, entry.mediaType) !== key,
  );
};

const containsEntry = (state: WatchlistState, item: MediaSummary): boolean => {
  const key = entryKey(item.id, item.mediaType);
  return state.entries.some(entry => entryKey(entry.id, entry.mediaType) === key);
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    hydrateWatchlist: (state, action: PayloadAction<WatchlistEntry[]>) => {
      state.entries = action.payload;
      state.hydrated = true;
    },
    addToWatchlist: (state, action: PayloadAction<MediaSummary>) => {
      insertEntry(state, action.payload);
    },
    removeFromWatchlist: (
      state,
      action: PayloadAction<{ id: number; mediaType: WatchableMediaType }>,
    ) => {
      removeEntry(state, action.payload.id, action.payload.mediaType);
    },
    toggleWatchlist: (state, action: PayloadAction<MediaSummary>) => {
      if (containsEntry(state, action.payload)) {
        removeEntry(state, action.payload.id, action.payload.mediaType);
        return;
      }

      insertEntry(state, action.payload);
    },
    setUserRating: (
      state,
      action: PayloadAction<{
        id: number;
        mediaType: WatchableMediaType;
        userRating: number;
      }>,
    ) => {
      const { id, mediaType, userRating } = action.payload;
      const entry = state.entries.find(
        item => entryKey(item.id, item.mediaType) === entryKey(id, mediaType),
      );

      if (entry) {
        entry.userRating = Math.min(5, Math.max(0, Math.round(userRating)));
      }
    },
    clearWatchlist: state => {
      state.entries = [];
    },
  },
});

export const {
  hydrateWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
  setUserRating,
  clearWatchlist,
} = watchlistSlice.actions;

export const watchlistReducer = watchlistSlice.reducer;

export const selectWatchlistEntries = (state: RootState): WatchlistEntry[] =>
  state.watchlist.entries;

export const selectIsHydrated = (state: RootState): boolean => state.watchlist.hydrated;

export const selectIsInWatchlist = (
  state: RootState,
  id: number,
  mediaType: WatchableMediaType,
): boolean =>
  state.watchlist.entries.some(entry => entry.id === id && entry.mediaType === mediaType);

export const selectUserRating = (
  state: RootState,
  id: number,
  mediaType: WatchableMediaType,
): number =>
  state.watchlist.entries.find(entry => entry.id === id && entry.mediaType === mediaType)
    ?.userRating ?? 0;
