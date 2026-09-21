import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { CastMember } from '../types/tmdb';
import { buildProfileUrl } from '../utils/imageUrl';
import { PosterImage } from './PosterImage';

const AVATAR_SIZE = 68;

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
          <Pressable
            onPress={() => onPressPerson?.(item)}
            disabled={!onPressPerson}
            accessibilityRole={onPressPerson ? 'button' : undefined}
            accessibilityLabel={item.name}
            style={({ pressed }) => [styles.card, pressed && onPressPerson ? styles.pressed : null]}>
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
          </Pressable>
        )}
      />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  heading: {
    paddingHorizontal: layout.screenPadding,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
  },
  separator: {
    width: layout.gridGap,
  },
  card: {
    width: AVATAR_SIZE + 12,
    alignItems: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  name: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  character: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
