"use client";

import React from 'react';
import { useWanIpFullContext } from '@/contexts';
import TimeSeriesLog from '@/app/components/TimeSeriesLog';
import ProviderPicker from '@/app/components/ProviderPicker';
import IPReadout from '@/app/components/IPReadout';
import RefreshButton from '@/app/components/RefreshButton';
import styles from './IPTracker.module.css';

// Main IP Tracker component
// Uses centralized state management through WanIpFullContext
export default function IPTracker() {
  // Use the full context for all state and functionality
  const {
    provider,
    setProvider,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
    refreshIntervalMs,
    setRefreshIntervalMs,
    ipAddress,
    lastFetch,
    secondsAgo,
    isLoading,
    handleRefresh,
    ipHistory,
    clearHistory,
    nowTick,
  } = useWanIpFullContext();

  return (
    <>
      {/* Provider Selection Section */}
      <section id="provider-selection" aria-labelledby="provider-selection-heading">
        <h2 id="provider-selection-heading" className="sr-only">IP Provider Selection</h2>
        <ProviderPicker
          provider={provider}
          setProvider={setProvider}
          autoRefreshEnabled={autoRefreshEnabled}
          setAutoRefreshEnabled={setAutoRefreshEnabled}
          refreshIntervalMs={refreshIntervalMs}
          setRefreshIntervalMs={setRefreshIntervalMs}
          secondsAgo={secondsAgo}
          handleRefresh={handleRefresh}
        />
      </section>

      {/* IP Display Section */}
      <section id="ip-display" aria-labelledby="ip-display-heading">
        <h2 id="ip-display-heading" className="sr-only">Current IP Address</h2>
        <IPReadout
          ipAddress={ipAddress}
          provider={provider}
          lastFetch={lastFetch}
          secondsAgo={secondsAgo}
        />
      </section>

      {/* Controls Section */}
      <section id="controls" aria-labelledby="controls-heading">
        <h2 id="controls-heading" className="sr-only">Refresh Controls</h2>
        <div className={styles.controlsContainer}>
          <RefreshButton
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* History Section */}
      <section id="ip-history" aria-labelledby="history-heading">
        <h2 id="history-heading" className="sr-only">IP Address History</h2>
        <TimeSeriesLog
          history={ipHistory}
          now={nowTick}
          onClearHistory={clearHistory}
        />
      </section>
    </>
  );
}