import React, { useSyncExternalStore } from 'react';
import { HistoryEntry, TimeSeriesLogProps } from '@/types';
import styles from './TimeSeriesLog.module.css';

// Color palette for unique IPs (up to 10 colors)
const IP_COLORS = [
  '#60a5fa', // blue
  '#f87171', // red
  '#4ade80', // green
  '#facc15', // yellow
  '#c084fc', // purple
  '#fb923c', // orange
  '#22d3ee', // cyan
  '#fb7185', // rose
  '#818cf8', // indigo
  '#2dd4bf', // teal
];

// Static color for "no-ip"
const NO_IP_COLOR = '#9ca3af'; // gray

// Function to get color for an IP based on its uniqueness order
function getIpColor(ip: string | null, uniqueIps: Set<string>): string {
  if (ip === null || ip === 'no-ip') {
    return NO_IP_COLOR;
  }

  // Find the index of this IP in the set of unique IPs
  const uniqueIpArray = Array.from(uniqueIps);
  const index = uniqueIpArray.indexOf(ip);

  if (index === -1) {
    // If IP is not found in uniqueIps, it means it's a valid IP that should get a color
    // This shouldn't happen with our current logic, but let's handle it gracefully
    return IP_COLORS[0]; // fallback to first color
  }

  // Cycle through colors if we have more than 10 unique IPs
  return IP_COLORS[index % IP_COLORS.length];
}

// Function to get color for country code based on UK vs other countries
function getCountryColor(countryCode: string | null): string {
  if (!countryCode) {
    return '#9ca3af'; // gray for no country
  }
  
  // Green for UK, red for all other countries
  return countryCode === 'GB' ? '#4ade80' : '#f87171';
}

export default function TimeSeriesLog({ history, now, onClearHistory }: TimeSeriesLogProps) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const hasHistory = isClient && history && history.length > 0;
  // Show most recent first
  const entries: HistoryEntry[] = hasHistory ? [...history].slice().reverse() : [];

  // Collect unique IPs for color assignment (excluding no-ip entries)
  const uniqueIps = new Set<string>();
  entries.forEach(entry => {
    if (entry.ip && entry.ip !== 'no-ip') {
      uniqueIps.add(entry.ip);
    }
  });

  return (
    <div className={styles.timeSeriesLog}>
      <header className={styles.historyHeader}>
        <h3 className={styles.historyTitle}>IP Address History</h3>
        {hasHistory && (
          <button
            onClick={onClearHistory}
            className={styles.clearHistoryBtn}
            aria-label="Clear all IP history"
            type="button"
          >
            Clear History
          </button>
        )}
      </header>

      {!hasHistory ? (
        <div className={styles.noHistoryMessage} aria-live="polite">
          {isClient ? 'No IP history recorded yet' : 'Loading history...'}
        </div>
      ) : (
        <div
          className={styles.historyListContainer}
          role="region"
          aria-label="Scrollable IP address history"
          tabIndex={0}
        >
          <ul className={styles.historyList} role="list" aria-label="IP address history entries">
            {entries.map((e) => {
              const label = e.ip ?? 'no-ip';
              const start = new Date(e.start).toLocaleString();
              const end = e.end ? new Date(e.end).toLocaleString() : null;
              const timeDisplay = end && end !== start ? `${start} → ${end}` : start;
              const ipColor = getIpColor(e.ip, uniqueIps);
              return (
                <li key={e.start} className={styles.historyEntry}>
                  <div className={styles.ipAddressDisplay}>
                    <code
                      className={styles.ipCode}
                      style={{ backgroundColor: `${ipColor}20`, color: ipColor, border: `1px solid ${ipColor}40` }}
                    >
                      {label}
                    </code>
                    {e.isp && (
                      <code
                        className={styles.ispCode}
                        style={{ 
                          backgroundColor: `${ipColor}20`, 
                          color: ipColor, 
                          border: `1px solid ${ipColor}40`
                        }}
                      >
                        {e.isp}
                      </code>
                    )}
                    {e.countryCode && (
                      <code
                        className={styles.countryCode}
                        style={{ 
                          backgroundColor: `${getCountryColor(e.countryCode)}20`, 
                          color: getCountryColor(e.countryCode), 
                          border: `1px solid ${getCountryColor(e.countryCode)}40`
                        }}
                      >
                        {e.countryCode}
                      </code>
                    )}
                  </div>
                  <time className={styles.timestamp} dateTime={new Date(e.start).toISOString()}>
                    {timeDisplay}
                  </time>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
