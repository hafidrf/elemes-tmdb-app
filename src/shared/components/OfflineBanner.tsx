import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { AppIcon } from './AppIcon';

// Shows itself when the device goes offline and renders nothing otherwise, so
// it can be mounted once at the root. It sits in the layout flow, which is why
// it carries the top inset itself.
export const OfflineBanner = () => {
  const { isConnected } = useNetInfo();
  const insets = useSafeAreaInsets();

  if (isConnected !== false) {
    return null;
  }

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + layout.space2 }]}
      accessibilityRole="alert">
      <View style={styles.chip}>
        <AppIcon name="offline" size={15} color={colors.primary} />
        <Text style={styles.label}>You're offline. Showing cached data.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.space2,
    backgroundColor: colors.surfaceContainerHigh,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.space2,
  },
  label: {
    ...type.labelLarge,
    color: colors.textPrimary,
  },
});
