
'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';
import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';

const farcasterAuthConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  // The api_url is not needed anymore as we handle the session manually
  // api_url: '/api/auth',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthKitProvider config={farcasterAuthConfig}>{children}</AuthKitProvider>
    </I18nProvider>
  );
}
