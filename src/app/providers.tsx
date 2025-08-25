
'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';
import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';

const farcasterAuthConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  api: '/api/auth',
  domain: process.env.NEXT_PUBLIC_URL || 'farcaster-trivia.vercel.app',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthKitProvider config={farcasterAuthConfig}>{children}</AuthKitProvider>
    </I18nProvider>
  );
}
