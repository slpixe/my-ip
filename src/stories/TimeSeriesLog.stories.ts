import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TimeSeriesLog from '../app/components/TimeSeriesLog';
import { HistoryEntry } from '../types';

const meta: Meta<typeof TimeSeriesLog> = {
  title: 'Components/TimeSeriesLog',
  component: TimeSeriesLog,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component that displays IP address history in a time series format with color-coded entries.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    history: {
      description: 'Array of history entries containing IP addresses and timestamps',
      control: { type: 'object' },
    },
    now: {
      description: 'Current timestamp for relative time calculations',
      control: { type: 'number' },
    },
    onClearHistory: {
      description: 'Callback function when clear history button is clicked',
      action: 'cleared',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create history entries
const createHistoryEntry = (
  ip: string | null,
  startOffset: number,
  endOffset?: number,
  country?: string | null,
  countryCode?: string | null,
  isp?: string | null
): HistoryEntry => ({
  ip,
  country: country ?? null,
  countryCode: countryCode ?? null,
  isp: isp ?? null,
  start: Date.now() - startOffset,
  end: endOffset ? Date.now() - endOffset : undefined,
});

// Empty history state
export const Empty: Story = {
  args: {
    history: [],
    now: Date.now(),
    onClearHistory: fn(),
  },
};

// Single IP entry
export const SingleEntry: Story = {
  args: {
    history: [
      createHistoryEntry('192.168.1.100', 5 * 60 * 1000, undefined, 'United Kingdom', 'GB'), // 5 minutes ago
    ],
    now: Date.now(),
    onClearHistory: fn(),
  },
};

// Multiple entries with same IP
export const MultipleSameIP: Story = {
  args: {
    history: [
      createHistoryEntry('192.168.1.100', 10 * 60 * 1000, undefined, 'United Kingdom', 'GB'), // 10 minutes ago
      createHistoryEntry('192.168.1.100', 5 * 60 * 1000, undefined, 'United Kingdom', 'GB'),  // 5 minutes ago
      createHistoryEntry('192.168.1.100', 1 * 60 * 1000, undefined, 'United Kingdom', 'GB'),  // 1 minute ago
    ],
    now: Date.now(),
    onClearHistory: fn(),
  },
};

// Multiple entries with different IPs
export const MultipleDifferentIPs: Story = {
  args: {
    history: [
      createHistoryEntry('192.168.1.100', 15 * 60 * 1000, undefined, 'United Kingdom', 'GB'), // 15 minutes ago
      createHistoryEntry('10.0.0.50', 10 * 60 * 1000, undefined, 'United States', 'US'),     // 10 minutes ago
      createHistoryEntry('172.16.0.25', 5 * 60 * 1000, undefined, 'Canada', 'CA'),    // 5 minutes ago
      createHistoryEntry('192.168.1.100', 2 * 60 * 1000, undefined, 'United Kingdom', 'GB'),  // 2 minutes ago
    ],
    now: Date.now(),
    onClearHistory: fn(),
  },
};

// Entry with null IP (no-ip state)
export const WithNullIP: Story = {
  args: {
    history: [
      createHistoryEntry('192.168.1.100', 10 * 60 * 1000, undefined, 'United Kingdom', 'GB'), // 10 minutes ago
      createHistoryEntry(null, 5 * 60 * 1000),             // 5 minutes ago (no country data)
      createHistoryEntry('10.0.0.50', 2 * 60 * 1000, undefined, 'United States', 'US'),      // 2 minutes ago
    ],
    now: Date.now(),
    onClearHistory: fn(),
  },
};

// Entry with time range (start and end)
export const WithTimeRange: Story = {
  args: {
    history: [
      createHistoryEntry('192.168.1.100', 20 * 60 * 1000, 15 * 60 * 1000, 'United Kingdom', 'GB'), // 20-15 minutes ago
      createHistoryEntry('10.0.0.50', 10 * 60 * 1000, 5 * 60 * 1000, 'United States', 'US'),      // 10-5 minutes ago
      createHistoryEntry('172.16.0.25', 2 * 60 * 1000, undefined, 'Germany', 'DE'),                     // 2 minutes ago (no end)
    ],
    now: Date.now(),
    onClearHistory: fn(),
  },
};

// Large history with many entries
export const LargeHistory: Story = {
  args: {
    history: Array.from({ length: 20 }, (_, i) => {
      const ips = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.1', '198.51.100.1'];
      const countries = ['United Kingdom', 'United States', 'Germany', 'France', 'Canada'];
      const countryCodes = ['GB', 'US', 'DE', 'FR', 'CA'];
      const countryIndex = i % countries.length;
      return createHistoryEntry(
        ips[i % ips.length],
        (i + 1) * 2 * 60 * 1000, // Every 2 minutes
        i > 0 ? i * 2 * 60 * 1000 : undefined,
        countries[countryIndex],
        countryCodes[countryIndex]
      );
    }),
    now: Date.now(),
    onClearHistory: fn(),
  },
};
