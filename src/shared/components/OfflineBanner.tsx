import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import { colors } from '../theme/colors';
import { AppIcon } from './AppIcon';

/**
 * Slim banner shown whenever the device loses connectivity. Renders nothing
 * while online, so it can be mounted once at the app root.
 */
export const OfflineBanner = () => {
  const { isConnected } = useNetInfo();

  if (isConnected !== false) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityRole="alert">
      <AppIcon name="wifiOff" size={14} color={colors.background} />
      <Text style={styles.label}>You are offline — showing cached data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
});
