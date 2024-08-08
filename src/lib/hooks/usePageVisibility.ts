import { useLayoutEffect, useState } from 'react';

export function usePageVisibility() {
  const [visibilityState, setVisibilityState] = useState(true);

  useLayoutEffect(() => {
    const listener = () => setVisibilityState(document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', listener);

    return () => document.removeEventListener('visibilitychange', listener);
  }, []);

  return visibilityState;
}
