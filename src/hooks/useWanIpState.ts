import { useState, useEffect, useCallback } from 'react';

export interface WanIpSettings {
  provider: string;
  autoRefreshEnabled: boolean;
  refreshIntervalMs: number;
}

export interface WanIpState {
  ipAddress: string | null;
  lastFetch: number | null;
  isLoading: boolean;
  nowTick: number;
  secondsAgo: number | null;
  settings: WanIpSettings;
}

export interface WanIpActions {
  setProvider: (provider: string) => void;
  setAutoRefreshEnabled: (enabled: boolean) => void;
  setRefreshIntervalMs: (ms: number) => void;
  handleRefresh: () => Promise<void> | void;
  clearHistory: () => void;
}

export function useWanIpState() {
  const supportedProviders = new Set(['cloudflare', 'ip-api', 'ipinfo', 'ipapi']);

  // Settings state with localStorage persistence
  const [provider, setProviderState] = useState<string>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('wan-ip:provider') : null;
      return saved && supportedProviders.has(saved) ? saved : 'cloudflare';
    } catch {
      return 'cloudflare';
    }
  });

  const [autoRefreshEnabled, setAutoRefreshEnabledState] = useState<boolean>(() => {
    try {
      const v = typeof window !== 'undefined' ? localStorage.getItem('wan-ip:autoRefreshEnabled') : null;
      return v === null ? false : v === '1';
    } catch {
      return false;
    }
  });

  const [refreshIntervalMs, setRefreshIntervalMsState] = useState<number>(() => {
    try {
      const v = typeof window !== 'undefined' ? localStorage.getItem('wan-ip:refreshIntervalMs') : null;
      return v ? Number(v) : 60000;
    } catch {
      return 60000;
    }
  });

  // UI state
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wan-ip:provider', provider);
    } catch {}
  }, [provider]);

  useEffect(() => {
    try {
      localStorage.setItem('wan-ip:autoRefreshEnabled', autoRefreshEnabled ? '1' : '0');
    } catch {}
  }, [autoRefreshEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('wan-ip:refreshIntervalMs', String(refreshIntervalMs));
    } catch {}
  }, [refreshIntervalMs]);

  // Update nowTick every second
  useEffect(() => {
    const tickInterval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(tickInterval);
  }, []);

  // Wrapped setters that can be extended with additional logic
  const setProvider = useCallback((newProvider: string) => {
    setProviderState(newProvider);
  }, []);

  const setAutoRefreshEnabled = useCallback((enabled: boolean) => {
    setAutoRefreshEnabledState(enabled);
  }, []);

  const setRefreshIntervalMs = useCallback((ms: number) => {
    setRefreshIntervalMsState(ms);
  }, []);

  const settings: WanIpSettings = {
    provider,
    autoRefreshEnabled,
    refreshIntervalMs,
  };

  return {
    provider,
    autoRefreshEnabled,
    refreshIntervalMs,
    nowTick,
    settings,
    setProvider,
    setAutoRefreshEnabled,
    setRefreshIntervalMs,
  };
}
