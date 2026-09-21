import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';
import { AppIcon, IconName } from './AppIcon';
import { PressableScale } from './PressableScale';

interface StateViewProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  // spinner instead of the icon, for the first load
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  // inline inside a section, instead of a full-screen state
  compact?: boolean;
}

// Used for every non-happy path: first load, empty result, error. The error
// state gets a retry button so a failed request never leaves a blank screen.
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
      <View style={[styles.iconCircle, compact ? styles.iconCircleCompact : null]}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <AppIcon
            name={icon}
            size={compact ? 18 : 22}
            color={compact ? colors.textSecondary : colors.primary}
          />
        )}
      </View>

      <Text style={[styles.title, compact ? styles.titleCompact : null]}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} style={styles.button}>
          <AppIcon name="refresh" size={15} color={colors.onPrimary} />
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.space2,
    paddingHorizontal: layout.space6,
  },
  full: {
    flex: 1,
    paddingVertical: 48,
    backgroundColor: colors.background,
  },
  compact: {
    paddingVertical: layout.space6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: layout.space2,
  },
  iconCircleCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  title: {
    ...type.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleCompact: {
    ...type.titleSmall,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.space2,
    marginTop: layout.space3,
    paddingHorizontal: layout.space5,
    height: 42,
    borderRadius: layout.radiusFull,
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    ...type.labelLarge,
    color: colors.onPrimary,
    fontWeight: '700',
  },
});
