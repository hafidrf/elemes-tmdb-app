import { StyleSheet } from 'react-native';

import { colors } from '../../shared/theme/colors';
import { layout } from '../../shared/theme/layout';
import { type } from '../../shared/theme/typography';

// Typography and spacing shared by the three detail screens. Only what actually
// differs between them lives in the screens themselves.
export const detailStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: layout.space8,
  },
  body: {
    paddingHorizontal: layout.screenPadding,
    marginTop: -34,
    gap: layout.space5,
  },
  heroRow: {
    flexDirection: 'row',
    gap: layout.space4,
  },
  heroText: {
    flex: 1,
    gap: layout.space2,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  originalTitle: {
    ...type.label,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: layout.space2,
  },
  // small tonal chip for year, runtime, votes
  metaChip: {
    paddingHorizontal: layout.space2,
    paddingVertical: 4,
    borderRadius: layout.radiusXs,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaText: {
    ...type.caps,
    color: colors.textSecondary,
  },
  metaMuted: {
    ...type.label,
    color: colors.textMuted,
  },
  tagline: {
    ...type.bodyLarge,
    fontStyle: 'italic',
    color: colors.primary,
    lineHeight: 22,
  },
  block: {
    gap: layout.space3,
  },
  blockTitle: {
    ...type.title,
    color: colors.textPrimary,
  },
  overview: {
    ...type.bodyLarge,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: layout.space3,
  },
  statCard: {
    flex: 1,
    gap: layout.space1,
    padding: layout.space3,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    ...type.titleLarge,
    color: colors.textPrimary,
  },
  statLabel: {
    ...type.caps,
    color: colors.textMuted,
  },
});
