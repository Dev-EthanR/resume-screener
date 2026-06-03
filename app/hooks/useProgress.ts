import { useState, useEffect } from "react";

const MOUNT_DELAY_MS = 10;

export function useProgress(value: number, durationInMs: number = 1000) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), MOUNT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value]);

  return {
    progress,
    durationInMs,
    durationInSeconds: durationInMs / 1000,
  };
}
