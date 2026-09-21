import { StyleSheet } from 'react-native';

import { colors } from '../../shared/theme/colors';
import { layout } from '../../shared/theme/layout';

/**
 * Shared typography/spacing for the movie, TV and person detail screens.
 * Only layout that genuinely differs between the three lives in the screens
 * themselves.
 */
export const detailStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  body: {
    paddingHorizontal: layout.screenPadding,
    marginTop: -30,
    gap: 20,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 14,
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 27,
  },
  originalTitle: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  metaMuted: {
    fontSize: 12,
    color: colors.textMuted,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.primary,
    lineHeight: 20,
  },
  block: {
    gap: 8,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    gap: 2,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
