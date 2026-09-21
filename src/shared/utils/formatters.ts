import {
  CombinedCreditItem,
  MediaSummary,
  Movie,
  Person,
  PersonSummary,
  TvShow,
  WatchableMediaType,
} from '../types/tmdb';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * TMDB dates are ISO (`2024-07-12`) and frequently empty for unreleased titles.
 * Parsing the string manually avoids the UTC off-by-one day bug you get when
 * feeding `new Date('2024-07-12')` into `toLocaleDateString()`.
 */
export const formatDateLabel = (value: string | null | undefined): string => {
  if (!value) {
    return 'TBA';
  }

  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return 'TBA';
  }

  const monthName = MONTHS[Number(month) - 1];

  if (!monthName || Number.isNaN(Number(day))) {
    return 'TBA';
  }

  return `${Number(day)} ${monthName} ${year}`;
};

/** TMDB reports `0` for "not enough votes yet" — render that as NR, not 0.0. */
export const formatRating = (voteAverage: number | null | undefined): string => {
  if (typeof voteAverage !== 'number' || !Number.isFinite(voteAverage) || voteAverage <= 0) {
    return 'NR';
  }

  return voteAverage.toFixed(1);
};

export const formatRuntime = (minutes: number | null | undefined): string => {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) {
    return '—';
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest}m`;
  }

  return `${hours}h ${String(rest).padStart(2, '0')}m`;
};

export const formatCount = (value: number | null | undefined): string => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return '0';
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return String(Math.round(value));
};

const isMovieShape = (item: Movie | TvShow): item is Movie => 'title' in item;

export const toMediaSummary = (
  item: Movie | TvShow,
  mediaType: WatchableMediaType,
): MediaSummary => {
  const title = isMovieShape(item) ? item.title : item.name;
  const date = isMovieShape(item) ? item.release_date : item.first_air_date;

  return {
    id: item.id,
    mediaType,
    title: title?.trim() ? title : 'Untitled',
    posterPath: item.poster_path ?? null,
    voteAverage: item.vote_average ?? 0,
    dateLabel: formatDateLabel(date),
  };
};

export const toPersonSummary = (person: Person): PersonSummary => ({
  id: person.id,
  name: person.name,
  profilePath: person.profile_path ?? null,
  knownFor: describeKnownFor(person),
});

export const describeKnownFor = (person: Person): string => {
  const titles = (person.known_for ?? [])
    .map(item => item.title ?? item.name)
    .filter((title): title is string => Boolean(title))
    .slice(0, 2);

  if (titles.length > 0) {
    return titles.join(' · ');
  }

  return person.known_for_department ?? 'Acting';
};

/**
 * `/person/{id}/combined_credits` mixes movies and TV shows in one array with
 * optional fields — this normalises an entry (or rejects it) for the grid.
 */
export const toMediaSummaryFromCredit = (
  item: CombinedCreditItem,
): MediaSummary | null => {
  if (item.media_type !== 'movie' && item.media_type !== 'tv') {
    return null;
  }

  const title = item.title ?? item.name;
  const date = item.release_date ?? item.first_air_date;

  return {
    id: item.id,
    mediaType: item.media_type,
    title: title?.trim() ? title : 'Untitled',
    posterPath: item.poster_path ?? null,
    voteAverage: item.vote_average ?? 0,
    dateLabel: formatDateLabel(date),
  };
};

export const truncate = (value: string, maxLength: number): string => {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
};
