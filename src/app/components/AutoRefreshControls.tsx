"use client";

import React, { useState, useMemo } from 'react';

interface AutoRefreshControlsProps {
  autoRefreshEnabled?: boolean;
  setAutoRefreshEnabled?: (v: boolean) => void;
  refreshIntervalMs?: number;
  setRefreshIntervalMs?: (ms: number) => void;
  // Seconds since last fetch (used to decide whether to trigger immediate fetch on commit)
  secondsAgo?: number | null;
  // Manual refresh handler (to trigger an immediate refresh when committing a shorter interval)
  handleRefresh?: () => Promise<void> | void;
}

export default function AutoRefreshControls({
  autoRefreshEnabled = false,
  setAutoRefreshEnabled,
  refreshIntervalMs = 60000,
  setRefreshIntervalMs,
  secondsAgo = null,
  handleRefresh
}: AutoRefreshControlsProps) {
  // Interval options the user can choose from (label in ms)
  const intervalOptions = useMemo(() => [
    { label: '2s', ms: 2000 },
    { label: '5s', ms: 5000 },
    { label: '10s', ms: 10000 },
    { label: '20s', ms: 20000 },
    { label: '30s', ms: 30000 },
    { label: '60s', ms: 60000 },
    { label: '2m', ms: 2 * 60 * 1000 },
    { label: '5m', ms: 5 * 60 * 1000 },
  ], []);

  const controlledIndex = Math.max(
    0,
    Math.min(
      intervalOptions.length - 1,
      intervalOptions.findIndex((o) => o.ms === refreshIntervalMs)
    )
  );
  // Keep a temporary local value while dragging; otherwise derive the value
  // from the parent's committed interval without synchronizing state in an effect.
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const localIndex = draggedIndex ?? controlledIndex;

  // Current displayed value (updates as slider moves)
  const currentValue = intervalOptions[localIndex]?.label ?? '60s';

  // Helpers to commit the chosen index (called on release/blur/keyboard)
  const commitIndex = (idx: number) => {
    const ms = intervalOptions[idx]?.ms ?? 60000;

    // Update parent interval
    setRefreshIntervalMs?.(ms);

    // If auto-refresh is enabled and we know how long since last fetch, trigger immediate refresh
    // when the newly selected interval is smaller than the elapsed time.
    if (autoRefreshEnabled && typeof secondsAgo === 'number' && secondsAgo !== null) {
      const elapsedMs = secondsAgo * 1000;
      if (ms <= elapsedMs) {
        // trigger a manual refresh to honor the new, shorter interval
        handleRefresh?.();
      }
    }

    setDraggedIndex(null);
  };

  return (
    <div className="auto-refresh-row" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'var(--surface)',
      borderRadius: '8px',
      border: '1px solid var(--border)'
    }}>
      {/* Auto-refresh toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoRefreshEnabled}
            onChange={(e) => setAutoRefreshEnabled?.(e.target.checked)}
            style={{ margin: 0 }}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Enable Auto-refresh</span>
        </label>
      </div>

      {/* Refresh interval controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        opacity: autoRefreshEnabled ? 1 : 0.5,
        pointerEvents: autoRefreshEnabled ? 'auto' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', minWidth: '80px' }}>
            Refresh every:
          </span>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--text)',
            minWidth: '40px',
            textAlign: 'center'
          }}>
            {currentValue}
          </span>
        </div>

        {/* Enhanced slider with better spacing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          <input
            type="range"
            min={0}
            max={intervalOptions.length - 1}
            step={1}
            value={String(localIndex)}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setDraggedIndex(idx);
            }}
            onMouseUp={(e) => {
              const idx = Number((e.currentTarget as HTMLInputElement).value);
              commitIndex(idx);
            }}
            onTouchEnd={(e) => {
              const idx = Number((e.currentTarget as HTMLInputElement).value);
              commitIndex(idx);
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const idx = Number((e.currentTarget as HTMLInputElement).value);
                commitIndex(idx);
              }
            }}
            onBlur={(e) => {
              const idx = Number((e.currentTarget as HTMLInputElement).value);
              commitIndex(idx);
            }}
            disabled={!autoRefreshEnabled}
            aria-label="Refresh interval slider"
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: 'var(--border)',
              outline: 'none',
              WebkitAppearance: 'none',
              cursor: autoRefreshEnabled ? 'pointer' : 'not-allowed'
            }}
          />

          {/* Tick labels with better alignment */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            padding: '0 2px'
          }} aria-hidden>
            {intervalOptions.map((opt, i) => (
              <span
                key={opt.ms}
                style={{
                  textAlign: 'center',
                  minWidth: '35px',
                  fontWeight: localIndex === i ? '600' : '400',
                  color: localIndex === i ? 'var(--text)' : 'var(--muted)'
                }}
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
