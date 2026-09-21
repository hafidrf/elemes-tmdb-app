import { MediaSummary } from '../../shared/types/tmdb';
import { WatchlistEntry } from './watchlistSlice';

/** Converts a stored watchlist entry back into the shared card view model. */
export const toMediaSummaryFromEntry = (entry: WatchlistEntry): MediaSummary => ({
  id: entry.id,
  mediaType: entry.mediaType,
  title: entry.title,
  posterPath: entry.posterPath,
  voteAverage: entry.voteAverage,
  dateLabel: entry.dateLabel,
});
