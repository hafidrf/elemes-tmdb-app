import { MediaSummary, PersonSummary } from './tmdb';

// Lets one 2-column grid hold either a poster or a portrait without losing
// type-safety. Used by search results and the "See All" list.
export type CatalogRow =
  | { kind: 'media'; item: MediaSummary }
  | { kind: 'person'; item: PersonSummary };
