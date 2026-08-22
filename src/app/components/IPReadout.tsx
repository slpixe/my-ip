import React from 'react';
import styles from './IPReadout.module.css';

interface IPReadoutProps {
  ipAddress: string | null;
  provider: string;
  lastFetch: number | null;
  secondsAgo: number | null;
}

export default function IPReadout({ ipAddress, provider, lastFetch, secondsAgo }: IPReadoutProps) {
  return (
    <div className={styles.ipReadout}>
      <div className={styles.currentIp} aria-live="polite" aria-atomic="true">
        {ipAddress ? (
          <p className={styles.ipAddress}>
            <span className={styles.ipValue}>{ipAddress}</span>
            <small className={styles.ipProvider}>({provider})</small>
          </p>
        ) : (
          <p className={styles.loadingMessage}>Loading IP address...</p>
        )}
      </div>

      {lastFetch ? (
        <div className={styles.fetchInfo} aria-live="polite">
          <p className={styles.lastFetchTime}>
            Last fetched: <time dateTime={new Date(lastFetch).toISOString()}>
              {new Date(lastFetch).toLocaleString()}
            </time>
          </p>
          <p className={styles.timeAgo}>
            {secondsAgo} second{secondsAgo === 1 ? '' : 's'} ago
          </p>
        </div>
      ) : (
        <p className={styles.noDataMessage}>IP address not fetched yet</p>
      )}
    </div>
  );
}