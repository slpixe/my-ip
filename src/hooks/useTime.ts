import { useState, useEffect, useMemo } from 'react';

export function useTimeTicker(intervalMs: number = 1000) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
}

export function useSecondsAgo(timestamp: number | null, currentTime: number) {
  return useMemo(() => {
    if (!timestamp) return null;
    return Math.floor((currentTime - timestamp) / 1000);
  }, [timestamp, currentTime]);
}

export function useTimeDisplay(seconds: number | null) {
  return useMemo(() => {
    if (seconds === null) return 'Not fetched yet';

    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'} ago`;
  }, [seconds]);
}
