import { useCallback, useEffect, useState } from 'react';

/** Contagem regressiva em segundos (1 Hz). Use `reset` ao mudar de etapa. */
export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback((seconds: number) => {
    setRunning(false);
    setRemaining(seconds);
  }, []);

  return { remaining, running, start, pause, reset };
}
