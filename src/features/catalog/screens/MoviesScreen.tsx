import React from 'react';

import { MOVIE_CATEGORIES } from '../catalogConfig';
import { CatalogGroupScreen } from './CatalogGroupScreen';

// lists 1-4 from the brief
export const MoviesScreen = () => (
  <CatalogGroupScreen
    categories={MOVIE_CATEGORIES}
    heading="Movies"
    subheading="Popular, top rated, upcoming and now playing"
  />
);
