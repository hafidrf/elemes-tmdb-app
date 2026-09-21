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

// One cell of a mixed grid, poster or portrait. Shared by the "See All" and
// search grids so the media/person switch lives in one place.
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
