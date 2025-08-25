
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { AuthKitProvider } from '@farcaster/auth-kit';

const authKitConfig = {
  api: '/api/auth',
  rpcUrl: 'https://mainnet.optimism.io',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthKitProvider config={authKitConfig}>
        {children}
      </AuthKitProvider>
    </I18nProvider>
  );
}
