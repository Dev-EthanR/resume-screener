import { useState, useEffect } from "react";

const MOUNT_DELAY_MS = 10;

export function useDonut(percentage: number, durationInMs: number = 1000) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), MOUNT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [percentage]);

  return {
    progress,
    durationInMs,
    durationInSeconds: durationInMs / 1000,
  };
}
