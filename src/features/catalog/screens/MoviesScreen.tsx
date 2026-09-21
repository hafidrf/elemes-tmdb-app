import React from 'react';

import { MOVIE_CATEGORIES } from '../catalogConfig';
import { CatalogGroupScreen } from './CatalogGroupScreen';

/** Requirements 1–4 from the brief: the four movie lists. */
export const MoviesScreen = () => (
  <CatalogGroupScreen
    categories={MOVIE_CATEGORIES}
    heading="Movies"
    subheading="Four curated lists, updated by TMDB every day"
  />
);
