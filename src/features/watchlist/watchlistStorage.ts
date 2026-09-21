import AsyncStorage from '@react-native-async-storage/async-storage';

import { WatchableMediaType } from '../../shared/types/tmdb';
import { WatchlistEntry } from './watchlistSlice';

const WATCHLIST_STORAGE_KEY = 'elemes_tmdb_app:watchlist';

const isMediaType = (value: unknown): value is WatchableMediaType =>
  value === 'movie' || value === 'tv';

// Parsed defensively: a corrupted value should reset the list, not crash the app
// on launch.
const parseEntries = (raw: string): WatchlistEntry[] => {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null)
      .filter(entry => typeof entry.id === 'number' && isMediaType(entry.mediaType))
      .map(entry => ({
        id: entry.id as number,
        mediaType: entry.mediaType as WatchableMediaType,
        title: typeof entry.title === 'string' ? entry.title : 'Untitled',
        posterPath: typeof entry.posterPath === 'string' ? entry.posterPath : null,
        voteAverage: typeof entry.voteAverage === 'number' ? entry.voteAverage : 0,
        dateLabel: typeof entry.dateLabel === 'string' ? entry.dateLabel : 'TBA',
        userRating: typeof entry.userRating === 'number' ? entry.userRating : 0,
        addedAt: typeof entry.addedAt === 'number' ? entry.addedAt : Date.now(),
      }));
  } catch {
    return [];
  }
};

export const loadWatchlist = async (): Promise<WatchlistEntry[]> => {
  const raw = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  return parseEntries(raw);
};

export const saveWatchlist = async (entries: WatchlistEntry[]): Promise<void> => {
  await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(entries));
};
