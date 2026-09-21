import { MediaSummary } from '../../shared/types/tmdb';
import { WatchlistEntry } from './watchlistSlice';

// back to the view model the cards take
export const toMediaSummaryFromEntry = (entry: WatchlistEntry): MediaSummary => ({
  id: entry.id,
  mediaType: entry.mediaType,
  title: entry.title,
  posterPath: entry.posterPath,
  voteAverage: entry.voteAverage,
  dateLabel: entry.dateLabel,
});
