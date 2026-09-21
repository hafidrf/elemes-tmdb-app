import { MediaSummary, PersonSummary } from './tmdb';

/**
 * Discriminated row so a single 2-column grid can render either media posters
 * or people portraits without losing type-safety. Shared by the search results
 * and the "See All" category list.
 */
export type CatalogRow =
  | { kind: 'media'; item: MediaSummary }
  | { kind: 'person'; item: PersonSummary };

export type { MediaSummary, PersonSummary };
