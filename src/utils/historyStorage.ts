import { HistoryEntry } from '@/types';

const HISTORY_KEY = 'wan-ip:history:v1';

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((e) => ({ 
      ip: e.ip ?? null,
      country: e.country ?? null,
      countryCode: e.countryCode ?? null,
      isp: e.isp ?? null,
      start: Number(e.start) || Date.now(), 
      end: e.end ? Number(e.end) : undefined 
    }));
  } catch (err) {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-200)));
  } catch {}
}

export function pushHistoryEntry(
  ip: string | null, 
  country: string | null,
  countryCode: string | null,
  isp: string | null,
  ts: number, 
  setIpHistory: (fn: ((h: HistoryEntry[]) => HistoryEntry[]) | HistoryEntry[]) => void
) {
  setIpHistory((prev) => {
    const copy = prev.slice();
    const last = copy[copy.length - 1];
    if (last && last.ip === ip && last.countryCode === countryCode && last.isp === isp) {
      // same IP, country, and ISP as last: extend its end
      last.end = ts;
    } else {
      // different IP, country, or ISP: mark the previous entry as ended now (if any),
      // then push a new entry starting/ending at ts
      if (last) {
        last.end = ts;
      }
      copy.push({ ip, country, countryCode, isp, start: ts, end: ts });
    }
    const pruned = copy.slice(-200);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(pruned));
    } catch {}
    return pruned;
  });
}

export function clearHistory(setIpHistory: (fn: ((h: HistoryEntry[]) => HistoryEntry[]) | HistoryEntry[]) => void) {
  setIpHistory([]);
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}