"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useWanIpState } from '@/hooks/useWanIpState';

// Types for the context
export interface WanIpContextType {
  // State values
  provider: string;
  autoRefreshEnabled: boolean;
  refreshIntervalMs: number;

  // Setter functions
  setProvider: (provider: string) => void;
  setAutoRefreshEnabled: (enabled: boolean) => void;
  setRefreshIntervalMs: (ms: number) => void;
}

// Create the context
const WanIpContext = createContext<WanIpContextType | undefined>(undefined);

// Provider component props
interface WanIpProviderProps {
  children: ReactNode;
}

// Provider component
export function WanIpProvider({ children }: WanIpProviderProps) {
  // Use our centralized state hook
  const {
    provider,
    autoRefreshEnabled,
    refreshIntervalMs,
    setProvider,
    setAutoRefreshEnabled,
    setRefreshIntervalMs,
  } = useWanIpState();

  // Context value
  const contextValue: WanIpContextType = {
    provider,
    autoRefreshEnabled,
    refreshIntervalMs,
    setProvider,
    setAutoRefreshEnabled,
    setRefreshIntervalMs,
  };

  return (
    <WanIpContext.Provider value={contextValue}>
      {children}
    </WanIpContext.Provider>
  );
}

// Custom hook to use the context
export function useWanIpContext(): WanIpContextType {
  const context = useContext(WanIpContext);

  if (context === undefined) {
    throw new Error('useWanIpContext must be used within a WanIpProvider');
  }

  return context;
}

// Export the context for advanced use cases
export { WanIpContext };