import { useEffect, useRef } from 'react';

export function usePolling(
  callback: () => void | Promise<void>,
  interval: number = 3000,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
}

