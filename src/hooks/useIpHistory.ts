import { useState, useCallback } from 'react';
import { HistoryEntry } from '@/types';
import { loadHistory, pushHistoryEntry, clearHistory } from '@/utils/historyStorage';

export function useIpHistory() {
  const [ipHistory, setIpHistory] = useState<HistoryEntry[]>(() => loadHistory());

  const addHistoryEntry = useCallback((ip: string | null, country: string | null, countryCode: string | null, isp: string | null, timestamp: number) => {
    pushHistoryEntry(ip, country, countryCode, isp, timestamp, setIpHistory);
  }, []);

  const clearHistoryData = useCallback(() => {
    clearHistory(setIpHistory);
  }, []);

  return {
    ipHistory,
    addHistoryEntry,
    clearHistoryData,
  };
}