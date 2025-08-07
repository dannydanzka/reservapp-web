import { useEffect, useState } from 'react';

/**
 * Hook for responsive media queries.
 * Based on Jafra's stable useMediaQuery implementation.
 *
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export { useMediaQuery };
