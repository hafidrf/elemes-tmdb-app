import { useEffect, useState } from 'react';

/**
 * Delays propagating `value` until the user stops typing.
 * Used by the search screen so a request is not fired on every keystroke.
 */
export const useDebouncedValue = <T,>(value: T, delayMs: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
};
