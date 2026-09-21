import React from 'react';

import { TV_CATEGORIES } from '../catalogConfig';
import { CatalogGroupScreen } from './CatalogGroupScreen';

// lists 5-8 from the brief
export const TvShowsScreen = () => (
  <CatalogGroupScreen
    categories={TV_CATEGORIES}
    heading="TV Shows"
    subheading="Popular, top rated, on the air and airing today"
  />
);
