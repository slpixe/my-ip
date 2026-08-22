import React from 'react';
import type { Metadata } from 'next';
import { WanIpFullProvider } from '@/contexts';
import './globals.css';

export const metadata: Metadata = {
  title: 'my-ip',
  description: 'See and track your public IP address.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <WanIpFullProvider>
          {children}
        </WanIpFullProvider>
      </body>
    </html>
  );
}
