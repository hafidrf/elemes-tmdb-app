import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { PersonSummary } from '../types/tmdb';
import { buildProfileUrl } from '../utils/imageUrl';
import { PosterImage } from './PosterImage';

interface PersonCardProps {
  person: PersonSummary;
  onPress: (person: PersonSummary) => void;
  width: number;
}

/** Portrait card used by the People tab, search results and person credits. */
export const PersonCard = ({ person, onPress, width }: PersonCardProps) => {
  const portraitHeight = Math.round(width * layout.profileAspect);

  return (
    <Pressable
      onPress={() => onPress(person)}
      accessibilityRole="button"
      accessibilityLabel={person.name}
      style={({ pressed }) => [{ width }, pressed ? styles.pressed : null]}>
      <PosterImage
        uri={buildProfileUrl(person.profilePath)}
        width={width}
        height={portraitHeight}
        radius={layout.posterCardRadius}
        fallbackLabel="No photo"
      />
      <Text style={styles.name} numberOfLines={1}>
        {person.name}
      </Text>
      <Text style={styles.knownFor} numberOfLines={1}>
        {person.knownFor}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  knownFor: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
  },
});
