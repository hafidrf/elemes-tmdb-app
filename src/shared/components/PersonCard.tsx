import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { PersonSummary } from '../types/tmdb';
import { buildProfileUrl } from '../utils/imageUrl';
import { PosterImage } from './PosterImage';
import { PressableScale } from './PressableScale';

interface PersonCardProps {
  person: PersonSummary;
  onPress: (person: PersonSummary) => void;
  width: number;
}

// portrait card, used by the People tab, search and the filmography grids
export const PersonCard = ({ person, onPress, width }: PersonCardProps) => {
  const portraitHeight = Math.round(width * layout.profileAspect);

  return (
    <PressableScale
      onPress={() => onPress(person)}
      accessibilityLabel={person.name}
      style={{ width }}>
      <PosterImage
        uri={buildProfileUrl(person.profilePath)}
        width={width}
        height={portraitHeight}
        fallbackLabel="No photo"
      />
      <Text style={styles.name} numberOfLines={1}>
        {person.name}
      </Text>
      <Text style={styles.knownFor} numberOfLines={1}>
        {person.knownFor}
      </Text>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  name: {
    ...type.cardTitle,
    marginTop: layout.space3,
    color: colors.textPrimary,
  },
  knownFor: {
    ...type.caps,
    fontSize: 10,
    marginTop: 2,
    color: colors.textMuted,
  },
});
