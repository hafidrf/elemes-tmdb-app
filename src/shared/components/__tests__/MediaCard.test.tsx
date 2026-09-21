import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { MediaSummary } from '../../types/tmdb';
import { MediaCard } from '../MediaCard';

const item: MediaSummary = {
  id: 550,
  mediaType: 'movie',
  title: 'Fight Club',
  posterPath: '/poster.jpg',
  voteAverage: 8.4,
  dateLabel: '15 Oct 1999',
};

describe('MediaCard', () => {
  it('renders the title, release date and score', async () => {
    const { getByText } = await render(<MediaCard item={item} onPress={jest.fn()} />);

    expect(getByText('Fight Club')).toBeTruthy();
    expect(getByText('15 Oct 1999')).toBeTruthy();
    expect(getByText('8.4')).toBeTruthy();
  });

  it('reports the tapped item to the caller', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await render(
      <MediaCard item={item} onPress={onPress} />,
    );

    await fireEvent.press(getByLabelText('Fight Club, 15 Oct 1999'));

    expect(onPress).toHaveBeenCalledWith(item);
  });

  it('shows an NR badge and a placeholder when TMDB has no artwork or votes', async () => {
    const { getByText } = await render(
      <MediaCard
        item={{ ...item, posterPath: null, voteAverage: 0 }}
        onPress={jest.fn()}
      />,
    );

    expect(getByText('NR')).toBeTruthy();
    expect(getByText('No artwork')).toBeTruthy();
  });
});

