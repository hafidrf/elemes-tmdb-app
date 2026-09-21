/**
 * Single source of truth for the app palette.
 *
 * Direction: "dark cinema" — a near-black canvas so movie posters carry the
 * colour, with an amber/marquee accent instead of the generic SaaS purple.
 */
export const colors = {
  background: '#0B0D10',
  surface: '#14181E',
  surfaceElevated: '#1D232B',
  border: '#252C36',

  primary: '#F0B429',
  primarySoft: 'rgba(240, 180, 41, 0.16)',

  textPrimary: '#F4F6F8',
  textSecondary: '#98A2B3',
  textMuted: '#667085',

  danger: '#EF4444',
  success: '#22C55E',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(6, 8, 11, 0.62)',
  skeleton: '#20262F',
  skeletonHighlight: '#2C333D',
} as const;

export type AppColors = typeof colors;
