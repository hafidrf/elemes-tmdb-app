import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { type } from '../theme/typography';

// A cold start already paints the Android launch theme, which is this same mark
// on this same colour. The gate continues that rather than replacing it, and
// holds for a beat so the first thing anyone sees is the logo instead of a list
// that is still filling in. The app is mounted and fetching behind it the whole
// time, so the shelves are usually ready by the time it lifts.
const HOLD_MS = 3000;
const EXIT_MS = 420;
const INTRO_MS = 520;
const BREATHE_MS = 1500;
const LOGO_SIZE = 132;

interface SplashGateProps {
  children: React.ReactNode;
}

export const SplashGate = ({ children }: SplashGateProps) => {
  const [finished, setFinished] = useState(false);
  const intro = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const overlay = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const beat = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: BREATHE_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: BREATHE_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.timing(intro, {
      toValue: 1,
      duration: INTRO_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    beat.start();

    const timer = setTimeout(() => {
      beat.stop();
      Animated.timing(overlay, {
        toValue: 0,
        duration: EXIT_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished: done }) => {
        if (done) {
          setFinished(true);
        }
      });
    }, HOLD_MS);

    return () => {
      clearTimeout(timer);
      beat.stop();
    };
  }, [breathe, intro, overlay]);

  return (
    <View style={styles.root}>
      {children}

      {finished ? null : (
        <Animated.View
          style={[styles.overlay, { opacity: overlay }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <Animated.View
            style={[
              styles.lockup,
              {
                opacity: intro,
                transform: [
                  {
                    scale: intro.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
              },
            ]}>
            <Animated.Image
              source={require('../../assets/splash-logo.png')}
              resizeMode="contain"
              style={[
                styles.logo,
                {
                  transform: [
                    {
                      scale: breathe.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.04],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Text style={styles.wordmark}>CineCatalog</Text>
            <Text style={styles.tagline}>Movies · TV Shows · People</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  lockup: {
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  wordmark: {
    ...type.display,
    marginTop: layout.space6,
    color: colors.textPrimary,
  },
  tagline: {
    ...type.caps,
    marginTop: layout.space3,
    color: colors.textMuted,
  },
});
