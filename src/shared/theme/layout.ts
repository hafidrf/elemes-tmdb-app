// Spacing, shape and card sizes. Every screen reads its numbers from here, so
// the rhythm stays the same from tab to tab.
export const layout = {
  // 4pt spacing scale
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,

  screenPadding: 16,
  sectionGap: 30,

  // Material 3 shape scale
  radiusXs: 8,
  radiusSm: 12,
  radiusMd: 16,
  radiusLg: 20,
  radiusXl: 28,
  radiusFull: 999,

  // cards
  posterCardWidth: 138,
  posterCardRadius: 16,
  // standard 2:3 poster
  posterAspect: 1.5,
  profileAspect: 1.35,
  gridGap: 14,

  // chrome
  touchTarget: 44,
} as const;
