import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import IPTracker from '../app/components/IPTracker';
import {
  WanIpFullContext,
  type WanIpFullContextType,
} from '../contexts/WanIpFullContext';

const now = Date.parse('2026-08-22T16:00:00Z');

const contextValue: WanIpFullContextType = {
  provider: 'cloudflare',
  autoRefreshEnabled: true,
  refreshIntervalMs: 60000,
  setProvider: fn(),
  setAutoRefreshEnabled: fn(),
  setRefreshIntervalMs: fn(),
  ipAddress: '203.0.113.42',
  lastFetch: now - 5000,
  isLoading: false,
  handleRefresh: fn(),
  nowTick: now,
  secondsAgo: 5,
  ipHistory: [
    {
      ip: '203.0.113.42',
      country: 'United Kingdom',
      countryCode: 'GB',
      isp: 'Example Networks',
      start: now - 2 * 60 * 1000,
    },
    {
      ip: '198.51.100.17',
      country: 'France',
      countryCode: 'FR',
      isp: 'Example Transit',
      start: now - 18 * 60 * 1000,
      end: now - 2 * 60 * 1000,
    },
    {
      ip: '192.0.2.8',
      country: 'Germany',
      countryCode: 'DE',
      isp: 'Example Fibre',
      start: now - 35 * 60 * 1000,
      end: now - 18 * 60 * 1000,
    },
  ],
  clearHistory: fn(),
};

const meta = {
  title: 'Pages/IP Tracker',
  component: IPTracker,
  decorators: [
    (Story) => (
      <WanIpFullContext.Provider value={contextValue}>
        <main>
          <header>
            <h1>my-ip</h1>
          </header>
          <Story />
        </main>
      </WanIpFullContext.Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The complete application with deterministic, documentation-only IP data. No network request is made by this story.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IPTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portfolio: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByText('203.0.113.42')).toHaveLength(2);
    await expect(canvas.getByRole('button', { name: /Cloudflare/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(
      canvas.getByRole('heading', { name: 'IP Address History', level: 3 })
    ).toBeInTheDocument();
  },
};
