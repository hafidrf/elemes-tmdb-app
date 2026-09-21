// Material 3 dark scheme, seeded on a warm amber so the posters are the only
// loud colour on screen. The surfaces climb in six tonal steps instead of the
// flat black-on-black a dark theme usually gets, and the secondary sits on the
// cool side so the palette is not one hue from top to bottom.
export const colors = {
  // tonal surfaces, lowest to highest
  background: '#08090C',
  surfaceContainerLow: '#0E1014',
  surface: '#12141A',
  surfaceContainerHigh: '#1A1D24',
  surfaceElevated: '#22262F',
  border: '#262A34',
  outline: '#3A404C',

  // primary role
  primary: '#FFC46B',
  onPrimary: '#3F2B00',
  primaryContainer: '#5C4200',
  onPrimaryContainer: '#FFE2B0',
  primarySoft: 'rgba(255, 196, 107, 0.14)',

  // secondary role, used for the "TV" side of the app
  secondary: '#8AD8CE',
  onSecondary: '#003731',
  secondaryContainer: '#16443F',
  onSecondaryContainer: '#A6F2E7',

  // text
  textPrimary: '#E8EAF0',
  textSecondary: '#A9B1C0',
  textMuted: '#6E7684',

  // semantic
  error: '#FFB4AB',
  onErrorContainer: '#FFDAD6',
  errorContainer: '#93000A',
  danger: '#FFB4AB',
  success: '#8CD9A8',

  white: '#FFFFFF',
  black: '#000000',

  // translucent layers used over artwork
  glass: 'rgba(14, 16, 20, 0.66)',
  glassStrong: 'rgba(10, 11, 15, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(6, 8, 11, 0.62)',

  skeleton: '#23272F',
  skeletonHighlight: '#2E333D',
} as const;

export type AppColors = typeof colors;
