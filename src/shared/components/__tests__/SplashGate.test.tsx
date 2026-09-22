import React from 'react';
import { Text } from 'react-native';
import { act, render } from '@testing-library/react-native';

import { SplashGate } from '../SplashGate';

describe('SplashGate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('mounts the app behind the mark, then gets out of the way', async () => {
    const { getByText, queryByText } = await render(
      <SplashGate>
        <Text>the app</Text>
      </SplashGate>,
    );

    // The mark is up, and the app is already mounted behind it. The overlay is
    // hidden from accessibility on purpose, so a screen reader reads the app,
    // not the logo - hence includeHiddenElements here.
    const hidden = { includeHiddenElements: true };
    expect(getByText('CineCatalog', hidden)).toBeTruthy();
    expect(getByText('the app')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(3000 + 600);
    });

    // the gate takes itself off screen and leaves the app alone
    expect(queryByText('CineCatalog', hidden)).toBeNull();
    expect(getByText('the app')).toBeTruthy();
  });
});
