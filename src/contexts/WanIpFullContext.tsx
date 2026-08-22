"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useWanIpState } from '@/hooks/useWanIpState';
import { useIpHistory } from '@/hooks/useIpHistory';
import { useIpFetcher } from '@/hooks/useIpFetcher';
import { useTimeTicker, useSecondsAgo } from '@/hooks/useTime';
import type { HistoryEntry } from '@/types';

// Types for the comprehensive context
export interface WanIpFullContextType {
  // Settings state
  provider: string;
  autoRefreshEnabled: boolean;
  refreshIntervalMs: number;
  setProvider: (provider: string) => void;
  setAutoRefreshEnabled: (enabled: boolean) => void;
  setRefreshIntervalMs: (ms: number) => void;

  // IP fetching state
  ipAddress: string | null;
  lastFetch: number | null;
  isLoading: boolean;
  handleRefresh: () => Promise<void> | void;

  // Time management
  nowTick: number;
  secondsAgo: number | null;

  // History management
  ipHistory: HistoryEntry[];
  clearHistory: () => void;
}

// Create the context
const WanIpFullContext = createContext<WanIpFullContextType | undefined>(undefined);

// Provider component props
interface WanIpFullProviderProps {
  children: ReactNode;
}

// Comprehensive Provider component
export function WanIpFullProvider({ children }: WanIpFullProviderProps) {
  // Settings and state management
  const {
    provider,
    autoRefreshEnabled,
    refreshIntervalMs,
    setProvider,
    setAutoRefreshEnabled,
    setRefreshIntervalMs,
  } = useWanIpState();

  // Time management
  const nowTick = useTimeTicker();

  // History management
  const { ipHistory, addHistoryEntry, clearHistoryData } = useIpHistory();

  // IP fetching with all the settings
  const { ipAddress, lastFetch, isLoading, handleRefresh } = useIpFetcher({
    provider,
    onIpFetched: addHistoryEntry,
    autoRefreshEnabled,
    refreshIntervalMs,
  });

  // Calculate seconds ago
  const secondsAgo = useSecondsAgo(lastFetch, nowTick);

  // Context value
  const contextValue: WanIpFullContextType = {
    // Settings
    provider,
    autoRefreshEnabled,
    refreshIntervalMs,
    setProvider,
    setAutoRefreshEnabled,
    setRefreshIntervalMs,

    // IP fetching
    ipAddress,
    lastFetch,
    isLoading,
    handleRefresh,

    // Time
    nowTick,
    secondsAgo,

    // History
    ipHistory,
    clearHistory: clearHistoryData,
  };

  return (
    <WanIpFullContext.Provider value={contextValue}>
      {children}
    </WanIpFullContext.Provider>
  );
}

// Custom hook to use the full context
export function useWanIpFullContext(): WanIpFullContextType {
  const context = useContext(WanIpFullContext);

  if (context === undefined) {
    throw new Error('useWanIpFullContext must be used within a WanIpFullProvider');
  }

  return context;
}

// Export the context for advanced use cases
export { WanIpFullContext };
