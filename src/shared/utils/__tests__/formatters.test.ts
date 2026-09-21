import { CombinedCreditItem, Movie, Person, TvShow } from '../../types/tmdb';
import {
  describeKnownFor,
  formatCount,
  formatDateLabel,
  formatRating,
  formatRuntime,
  toMediaSummary,
  toMediaSummaryFromCredit,
  toPersonSummary,
} from '../formatters';

const movie: Movie = {
  id: 550,
  title: 'Fight Club',
  original_title: 'Fight Club',
  overview: 'An insomniac office worker…',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '1999-10-15',
  vote_average: 8.438,
  vote_count: 29000,
  popularity: 60.1,
};

const movieWithoutArtwork: Movie = {
  ...movie,
  id: 551,
  poster_path: null,
  release_date: '',
  vote_average: 0,
};

const show: TvShow = {
  id: 1399,
  name: 'Game of Thrones',
  original_name: 'Game of Thrones',
  overview: '',
  poster_path: null,
  backdrop_path: null,
  first_air_date: '2011-04-17',
  vote_average: 8.4,
  vote_count: 22000,
  popularity: 100,
};

const person: Person = {
  id: 287,
  name: 'Brad Pitt',
  profile_path: '/brad.jpg',
  known_for_department: 'Acting',
  popularity: 30,
  known_for: [
    { id: 1, media_type: 'movie', title: 'Se7en', poster_path: null },
    { id: 2, media_type: 'movie', name: 'Troy', poster_path: null },
    { id: 3, media_type: 'movie', title: 'Babylon', poster_path: null },
  ],
};

describe('formatDateLabel', () => {
  it('formats an ISO date as a short human date', () => {
    expect(formatDateLabel('1999-10-15')).toBe('15 Oct 1999');
  });

  it('strips the leading zero from single digit days and months', () => {
    expect(formatDateLabel('2024-01-05')).toBe('5 Jan 2024');
  });

  it.each([null, undefined, '', 'not-a-date', '2024-13-01'])(
    'falls back to TBA for %p',
    value => {
      expect(formatDateLabel(value)).toBe('TBA');
    },
  );
});

describe('formatRating', () => {
  it('renders one decimal place', () => {
    expect(formatRating(8.438)).toBe('8.4');
  });

  it('treats a zero score as "not rated" instead of 0.0', () => {
    expect(formatRating(0)).toBe('NR');
  });

  it('guards against missing values', () => {
    expect(formatRating(null)).toBe('NR');
    expect(formatRating(undefined)).toBe('NR');
  });
});

describe('formatRuntime', () => {
  it('renders hours and padded minutes', () => {
    expect(formatRuntime(139)).toBe('2h 19m');
  });

  it('renders minutes only when under an hour', () => {
    expect(formatRuntime(48)).toBe('48m');
  });

  it('renders an em dash for unknown runtimes', () => {
    expect(formatRuntime(null)).toBe('—');
    expect(formatRuntime(0)).toBe('—');
  });
});

describe('formatCount', () => {
  it('abbreviates thousands and millions', () => {
    expect(formatCount(999)).toBe('999');
    expect(formatCount(29000)).toBe('29.0K');
    expect(formatCount(2_500_000)).toBe('2.5M');
  });

  it('never returns NaN for missing data', () => {
    expect(formatCount(undefined)).toBe('0');
  });
});

describe('toMediaSummary', () => {
  it('normalises a movie', () => {
    expect(toMediaSummary(movie, 'movie')).toEqual({
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      posterPath: '/poster.jpg',
      voteAverage: 8.438,
      dateLabel: '15 Oct 1999',
    });
  });

  it('normalises a TV show using name and first_air_date', () => {
    expect(toMediaSummary(show, 'tv')).toEqual({
      id: 1399,
      mediaType: 'tv',
      title: 'Game of Thrones',
      posterPath: null,
      voteAverage: 8.4,
      dateLabel: '17 Apr 2011',
    });
  });

  it('keeps null artwork and unknown dates renderable', () => {
    const summary = toMediaSummary(movieWithoutArtwork, 'movie');

    expect(summary.posterPath).toBeNull();
    expect(summary.dateLabel).toBe('TBA');
  });
});

describe('toPersonSummary', () => {
  it('lists up to two known-for titles', () => {
    expect(toPersonSummary(person)).toEqual({
      id: 287,
      name: 'Brad Pitt',
      profilePath: '/brad.jpg',
      knownFor: 'Se7en · Troy',
    });
  });

  it('falls back to the department when nothing is known', () => {
    expect(describeKnownFor({ ...person, known_for: [] })).toBe('Acting');
    expect(describeKnownFor({ id: 1, name: 'X', profile_path: null, popularity: 1 })).toBe(
      'Acting',
    );
  });
});

describe('toMediaSummaryFromCredit', () => {
  it('converts a movie credit', () => {
    const credit: CombinedCreditItem = {
      id: 12,
      media_type: 'movie',
      title: 'Troy',
      poster_path: '/troy.jpg',
      release_date: '2004-05-14',
      vote_average: 7.2,
    };

    expect(toMediaSummaryFromCredit(credit)).toEqual({
      id: 12,
      mediaType: 'movie',
      title: 'Troy',
      posterPath: '/troy.jpg',
      voteAverage: 7.2,
      dateLabel: '14 May 2004',
    });
  });

  it('converts a TV credit that only has `name`', () => {
    const credit: CombinedCreditItem = {
      id: 13,
      media_type: 'tv',
      name: 'The Last of Us',
      poster_path: null,
      first_air_date: '2023-01-15',
    };

    expect(toMediaSummaryFromCredit(credit)?.title).toBe('The Last of Us');
    expect(toMediaSummaryFromCredit(credit)?.voteAverage).toBe(0);
  });

  it('rejects credits that are not a movie or TV show', () => {
    expect(
      toMediaSummaryFromCredit({ id: 1, media_type: 'person', poster_path: null }),
    ).toBeNull();
  });
});
