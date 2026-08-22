import { useState, useEffect, useCallback, useRef } from 'react';

interface UseIpFetcherProps {
  provider: string;
  onIpFetched: (ip: string | null, country: string | null, countryCode: string | null, isp: string | null, timestamp: number) => void;
  // Whether automatic polling is enabled
  autoRefreshEnabled?: boolean;
  // Polling interval in milliseconds
  refreshIntervalMs?: number;
}

export function useIpFetcher({ provider, onIpFetched, autoRefreshEnabled = false, refreshIntervalMs = 60000 }: UseIpFetcherProps) {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs keep the polling callback stable without reading or writing refs during render.
  const onIpFetchedRef = useRef(onIpFetched);
  const providerRef = useRef(provider);
  const ipAddressRef = useRef(ipAddress);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedInitiallyRef = useRef(false);
  const previousProviderRef = useRef(provider);
  const previousAutoRefreshEnabledRef = useRef(autoRefreshEnabled);
  const fetchNowRef = useRef<((opts?: { forceRecord?: boolean }) => Promise<void>) | null>(null);

  const fetchNow = useCallback(async (opts?: { forceRecord?: boolean }) => {
    const currentProvider = providerRef.current;
    const currentIpAddress = ipAddressRef.current;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/ip?provider=${encodeURIComponent(currentProvider)}`);

      // Handle rate limiting - don't record in time series
      if (response.status === 429) {
        setLastFetch(Date.now());
        return;
      }

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const ip = data.ip ?? null;
      const country = data.country ?? null;
      const countryCode = data.countryCode ?? null;
      const isp = data.isp ?? null;

      // Only record if IP changed or we have a new failure
      const hasChanged = ip !== currentIpAddress;
      if (hasChanged || opts?.forceRecord) {
        // If forcing record but IP hasn't changed, we still update the timestamp
        ipAddressRef.current = ip;
        setIpAddress(ip);
        const ts = Date.now();
        setLastFetch(ts);
        onIpFetchedRef.current(ip, country, countryCode, isp, ts);
      } else {
        // Just update the fetch time but don't record
        setLastFetch(Date.now());
      }
    } catch {
      // Record network errors if IP state would change, or if caller forced a record
      const shouldRecord = currentIpAddress !== null || opts?.forceRecord;
      if (shouldRecord) {
        const ts = Date.now();
        ipAddressRef.current = null;
        setIpAddress(null);
        setLastFetch(ts);
        onIpFetchedRef.current(null, null, null, null, ts);
      } else {
        setLastFetch(Date.now());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ref updates belong in an effect, not during render. This effect is declared
  // before the effects that can invoke fetchNow on mount or prop changes.
  useEffect(() => {
    onIpFetchedRef.current = onIpFetched;
    providerRef.current = provider;
    ipAddressRef.current = ipAddress;
    fetchNowRef.current = fetchNow;
  }, [fetchNow, ipAddress, onIpFetched, provider]);

  // Fetch once on mount, independently of whether recurring refresh is enabled.
  useEffect(() => {
    if (!hasFetchedInitiallyRef.current) {
      hasFetchedInitiallyRef.current = true;
      fetchNowRef.current?.();
    }
  }, []);

  // Setup polling effect - reacts to enabled flag and interval changes.
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const wasEnabled = previousAutoRefreshEnabledRef.current;
    previousAutoRefreshEnabledRef.current = autoRefreshEnabled;

    if (autoRefreshEnabled) {
      // Enabling polling should refresh immediately; disabling it must not.
      if (!wasEnabled) {
        fetchNowRef.current?.();
      }

      intervalRef.current = setInterval(() => {
        fetchNowRef.current?.();
      }, refreshIntervalMs);
    }

    // Cleanup on unmount or when deps change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefreshEnabled, refreshIntervalMs]);

  // Fetch when the user actually changes provider, but not on initial mount.
  useEffect(() => {
    if (previousProviderRef.current !== provider) {
      previousProviderRef.current = provider;
      fetchNowRef.current?.();
    }
  }, [provider]);

  const handleRefresh = useCallback(async () => {
    if (!isLoading) {
      // Force recording so the timeline updates end-time even if the IP is unchanged
      await fetchNowRef.current?.({ forceRecord: true });
    }
  }, [isLoading]);

  return {
    ipAddress,
    lastFetch,
    isLoading,
    handleRefresh,
  };
}
