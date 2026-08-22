export interface IpResponse {
    ip: string;
}

// History types and interfaces
export interface HistoryEntry {
  ip: string | null;
  country: string | null;        // Full country name
  countryCode: string | null;    // 2-letter country code (ISO 3166-1 alpha-2)
  isp: string | null;            // ISP/Organization information
  start: number;
  end?: number;
}

export interface TimeSeriesLogProps {
  history: HistoryEntry[];
  now: number;
  onClearHistory: () => void;
}