
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { NotificationsProvider } from '@/hooks/use-notifications.tsx';

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org';

const authKitConfig = {
  rpcUrl,
  siweEnabled: true,
  domain: process.env.NEXT_PUBLIC_APP_URL?.replace(/https?:\/\//, '') || 'crypto-trivia.vercel.app',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthKitProvider config={authKitConfig}>
        <NotificationsProvider>
            {children}
        </NotificationsProvider>
      </AuthKitProvider>
    </I18nProvider>
  );
}
