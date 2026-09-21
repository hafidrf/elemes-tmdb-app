import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { AppIcon, IconName } from './AppIcon';

interface StateViewProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Shows a spinner instead of the icon (first-load state). */
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  /** Renders inline (inside a section) rather than as a full-screen state. */
  compact?: boolean;
}

/**
 * One component for every non-happy path: first load, empty result and error.
 * Error states always offer a retry action, per the brief's requirement that a
 * failed request shows an informative screen instead of a blank one.
 */
export const StateView = ({
  title,
  subtitle,
  icon = 'film',
  loading = false,
  actionLabel,
  onAction,
  compact = false,
}: StateViewProps) => {
  return (
    <View style={[styles.container, compact ? styles.compact : styles.full]}>
      <View style={styles.iconCircle}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <AppIcon name={icon} size={compact ? 16 : 20} />
        )}
      </View>

      <Text style={[styles.title, compact ? styles.titleCompact : null]}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}>
          <AppIcon name="refresh" size={13} color={colors.background} />
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  full: {
    flex: 1,
    paddingVertical: 48,
    backgroundColor: colors.background,
  },
  compact: {
    paddingVertical: 26,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonLabel: {
    color: colors.background,
    fontWeight: '800',
    fontSize: 13,
  },
});
