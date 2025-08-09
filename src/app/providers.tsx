
'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';
import type { ReactNode } from 'react';

const farcasterAuthConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider config={farcasterAuthConfig}>{children}</AuthKitProvider>
  );
}
