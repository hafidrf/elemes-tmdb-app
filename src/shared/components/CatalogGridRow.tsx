import React from 'react';

import { CatalogRow } from '../types/catalogRow';
import { MediaSummary, PersonSummary } from '../types/tmdb';
import { MediaCard } from './MediaCard';
import { PersonCard } from './PersonCard';

interface CatalogGridRowProps {
  row: CatalogRow;
  cardWidth: number;
  onPressMedia: (item: MediaSummary) => void;
  onPressPerson: (person: PersonSummary) => void;
}

/**
 * Renders one cell of a mixed results grid (poster or portrait).
 * Shared by the "See All" category grid and the search results grid so the
 * media/person switch exists in exactly one place.
 */
export const CatalogGridRow = ({
  row,
  cardWidth,
  onPressMedia,
  onPressPerson,
}: CatalogGridRowProps) => {
  if (row.kind === 'media') {
    return <MediaCard item={row.item} width={cardWidth} onPress={onPressMedia} />;
  }

  return <PersonCard person={row.item} width={cardWidth} onPress={onPressPerson} />;
};
