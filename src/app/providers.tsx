
'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';
import type { ReactNode } from 'react';

const farcasterAuthConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  api_url: '/api/auth'
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider config={farcasterAuthConfig}>{children}</AuthKitProvider>
  );
}
