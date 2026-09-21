import { StyleSheet } from 'react-native';

// Type scale. Sizes, weights and tracking only, no colour, so a screen reads as
// one voice. Large text gets negative tracking and small text gets positive
// tracking, which is what keeps a bigger size from just looking bigger.
export const type = StyleSheet.create({
  display: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  titleLarge: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  titleSmall: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  // card captions sit under artwork, so they run a notch smaller than a title
  cardTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  bodyLarge: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  labelLarge: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // small uppercase run used for meta rows and stat captions
  caps: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
});
