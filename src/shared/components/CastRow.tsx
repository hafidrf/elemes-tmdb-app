import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { CastMember } from '../types/tmdb';
import { buildProfileUrl } from '../utils/imageUrl';
import { PosterImage } from './PosterImage';
import { PressableScale } from './PressableScale';

const AVATAR_SIZE = 72;

interface CastRowProps {
  cast: CastMember[];
  onPressPerson?: (person: CastMember) => void;
}

// cast strip, used by the movie and TV detail screens
export const CastRow = ({ cast, onPressPerson }: CastRowProps) => {
  const topBilled = cast.slice(0, 14);

  if (topBilled.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Top Billed Cast</Text>

      <FlatList
        horizontal
        data={topBilled}
        keyExtractor={member => String(member.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <PressableScale
            onPress={() => onPressPerson?.(item)}
            disabled={!onPressPerson}
            accessibilityLabel={item.name}
            scaleTo={0.94}
            style={styles.card}>
            <PosterImage
              uri={buildProfileUrl(item.profile_path)}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              radius={AVATAR_SIZE / 2}
              fallbackLabel=""
            />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            {item.character ? (
              <Text style={styles.character} numberOfLines={2}>
                {item.character}
              </Text>
            ) : null}
          </PressableScale>
        )}
      />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  section: {
    gap: layout.space3,
  },
  heading: {
    ...type.title,
    paddingHorizontal: layout.screenPadding,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
  },
  separator: {
    width: layout.gridGap,
  },
  card: {
    width: AVATAR_SIZE + layout.space3,
    alignItems: 'center',
    gap: layout.space1,
  },
  name: {
    ...type.label,
    marginTop: layout.space1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  character: {
    ...type.caps,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
