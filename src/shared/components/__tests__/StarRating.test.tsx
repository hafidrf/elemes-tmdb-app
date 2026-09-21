import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { StarRating } from '../StarRating';

describe('StarRating', () => {
  it('renders five stars and the current score', async () => {
    const { getAllByRole, getByText } = await render(
      <StarRating value={3} onChange={jest.fn()} />,
    );

    expect(getAllByRole('button')).toHaveLength(5);
    expect(getByText('3/5')).toBeTruthy();
  });

  it('reports the tapped star value', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = await render(<StarRating value={0} onChange={onChange} />);

    await fireEvent.press(getByLabelText('4 stars'));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('clears the rating when the active star is tapped again', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = await render(<StarRating value={4} onChange={onChange} />);

    await fireEvent.press(getByLabelText('4 stars'));

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('hides the score read-out when unrated', async () => {
    const { queryByText } = await render(<StarRating value={0} onChange={jest.fn()} />);

    expect(queryByText('0/5')).toBeNull();
  });

  it('does not fire changes in read-only mode', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = await render(
      <StarRating value={2} onChange={onChange} readOnly />,
    );

    await fireEvent.press(getByLabelText('5 stars'));

    expect(onChange).not.toHaveBeenCalled();
  });
});

