import { MediaSummary } from '../../../shared/types/tmdb';
import {
  addToWatchlist,
  clearWatchlist,
  hydrateWatchlist,
  removeFromWatchlist,
  setUserRating,
  toggleWatchlist,
  watchlistReducer,
  WatchlistState,
} from '../watchlistSlice';

const movie: MediaSummary = {
  id: 550,
  mediaType: 'movie',
  title: 'Fight Club',
  posterPath: '/poster.jpg',
  voteAverage: 8.4,
  dateLabel: '15 Oct 1999',
};

const show: MediaSummary = {
  id: 550,
  mediaType: 'tv',
  title: 'Not Fight Club',
  posterPath: null,
  voteAverage: 7,
  dateLabel: 'TBA',
};

const initial: WatchlistState = { entries: [], hydrated: false };
const hydratedEmpty: WatchlistState = { entries: [], hydrated: true };

describe('watchlistSlice', () => {
  it('starts empty and not yet hydrated', () => {
    expect(watchlistReducer(undefined, { type: '@@INIT' })).toEqual(initial);
  });

  it('hydrates from storage and marks the slice ready', () => {
    const state = watchlistReducer(initial, hydrateWatchlist([]));

    expect(state.hydrated).toBe(true);
  });

  it('adds an entry with a default zero rating', () => {
    const state = watchlistReducer(hydratedEmpty, addToWatchlist(movie));

    expect(state.entries).toHaveLength(1);
    expect(state.entries[0]).toMatchObject({
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      userRating: 0,
    });
  });

  it('puts the newest entry first', () => {
    const withMovie = watchlistReducer(hydratedEmpty, addToWatchlist(movie));
    const state = watchlistReducer(withMovie, addToWatchlist(show));

    expect(state.entries.map(entry => entry.title)).toEqual([
      'Not Fight Club',
      'Fight Club',
    ]);
  });

  it('does not add the same title twice', () => {
    const once = watchlistReducer(hydratedEmpty, addToWatchlist(movie));
    const twice = watchlistReducer(once, addToWatchlist(movie));

    expect(twice.entries).toHaveLength(1);
  });

  it('treats the same id on a different media type as a different title', () => {
    const once = watchlistReducer(hydratedEmpty, addToWatchlist(movie));
    const twice = watchlistReducer(once, addToWatchlist(show));

    expect(twice.entries).toHaveLength(2);
  });

  it('toggles an entry off when it is already saved', () => {
    const once = watchlistReducer(hydratedEmpty, toggleWatchlist(movie));
    const twice = watchlistReducer(once, toggleWatchlist(movie));

    expect(once.entries).toHaveLength(1);
    expect(twice.entries).toHaveLength(0);
  });

  it('removes by id and media type', () => {
    const withBoth = watchlistReducer(
      watchlistReducer(hydratedEmpty, addToWatchlist(movie)),
      addToWatchlist(show),
    );

    const state = watchlistReducer(
      withBoth,
      removeFromWatchlist({ id: 550, mediaType: 'movie' }),
    );

    expect(state.entries).toHaveLength(1);
    expect(state.entries[0].mediaType).toBe('tv');
  });

  it('stores a user rating clamped to 0..5', () => {
    const saved = watchlistReducer(hydratedEmpty, addToWatchlist(movie));

    const rated = watchlistReducer(
      saved,
      setUserRating({ id: 550, mediaType: 'movie', userRating: 4 }),
    );
    expect(rated.entries[0].userRating).toBe(4);

    const tooHigh = watchlistReducer(
      saved,
      setUserRating({ id: 550, mediaType: 'movie', userRating: 99 }),
    );
    expect(tooHigh.entries[0].userRating).toBe(5);

    const tooLow = watchlistReducer(
      saved,
      setUserRating({ id: 550, mediaType: 'movie', userRating: -2 }),
    );
    expect(tooLow.entries[0].userRating).toBe(0);
  });

  it('ignores a rating for a title that is not saved', () => {
    const state = watchlistReducer(
      hydratedEmpty,
      setUserRating({ id: 999, mediaType: 'movie', userRating: 3 }),
    );

    expect(state.entries).toHaveLength(0);
  });

  it('clears every entry', () => {
    const saved = watchlistReducer(hydratedEmpty, addToWatchlist(movie));

    expect(watchlistReducer(saved, clearWatchlist()).entries).toHaveLength(0);
  });
});
