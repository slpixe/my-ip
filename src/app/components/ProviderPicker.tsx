"use client";

import React, { useSyncExternalStore } from 'react';
import AutoRefreshControls from './AutoRefreshControls';
import styles from './ProviderPicker.module.css';

interface ProviderPickerProps {
  provider: string;
  setProvider: (provider: string) => void;
  autoRefreshEnabled?: boolean;
  setAutoRefreshEnabled?: (v: boolean) => void;
  refreshIntervalMs?: number;
  setRefreshIntervalMs?: (ms: number) => void;
  // Seconds since last fetch (used to decide whether to trigger immediate fetch on commit)
  secondsAgo?: number | null;
  // Manual refresh handler (to trigger an immediate refresh when committing a shorter interval)
  handleRefresh?: () => Promise<void> | void;
}

export default function ProviderPicker({ provider, setProvider, autoRefreshEnabled = false, setAutoRefreshEnabled, refreshIntervalMs = 60000, setRefreshIntervalMs, secondsAgo = null, handleRefresh }: ProviderPickerProps) {
  // Use a hydration-aware snapshot instead of setting state synchronously in an effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={styles.providerPicker}>
        <div className={styles.providerRow}>
          <div style={{ opacity: 0.5 }}>Loading provider selection...</div>
        </div>
      </div>
    );
  }
  
  const providers: { id: string; name: string; features: string[]; description: string }[] = [
    {
      id: 'cloudflare',
      name: 'Cloudflare',
      features: ['IP', 'Country'],
      description: 'IP & location from trusted edge metadata'
    },
    // {
    //   id: 'ipify',
    //   name: 'ipify',
    //   features: ['IP'],
    //   description: 'Simple IP detection'
    // },
    {
      id: 'ip-api',
      name: 'IP-API',
      features: ['IP', 'Geo', 'ISP', 'Coords'],
      description: 'Enriches the edge-detected IP'
    },
    {
      id: 'ipinfo',
      name: 'IPinfo',
      features: ['IP', 'Host', 'Geo', 'ISP', 'Postal'],
      description: 'Enriches the edge-detected IP'
    },
    {
      id: 'ipapi',
      name: 'ipapi.co',
      features: ['IP', 'Geo', 'ISP', 'Currency', 'Demographics'],
      description: 'Enriches the edge-detected IP'
    },
  ];

  return (
    <div className={styles.providerPicker}>
      {/* Provider selection controls */}
      <div className={styles.providerRow} role="group" aria-label="IP provider selection">
        {providers.map((p) => {
          const isSelected = provider === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setProvider(p.id)}
              aria-pressed={isSelected ? 'true' : 'false'}
              className={`${styles.providerBtn} ${isSelected ? styles.providerBtnSelected : ''}`}
              aria-describedby={`${p.id}-description`}
            >
              <span className={styles.providerLabel}>{p.name}</span>
              <span id={`${p.id}-description`} className={styles.providerDescription}>
                {p.description}
              </span>
              <div className={styles.providerFeatures} aria-label={`Features provided by ${p.name}`}>
                {p.features.map((feature, index) => (
                  <span key={feature} className={styles.providerFeature}>
                    {feature}{index < p.features.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Auto-refresh controls */}
      <div className={styles.autoRefreshControls}>
        <AutoRefreshControls
          autoRefreshEnabled={autoRefreshEnabled}
          setAutoRefreshEnabled={setAutoRefreshEnabled}
          refreshIntervalMs={refreshIntervalMs}
          setRefreshIntervalMs={setRefreshIntervalMs}
          secondsAgo={secondsAgo}
          handleRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}// ...existing code...
