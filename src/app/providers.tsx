
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { NotificationsProvider } from '@/hooks/use-notifications.tsx';

const authKitConfig = {
  rpcUrl: "https://mainnet.base.org",
  domain: 'crypto-trivia.vercel.app',
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
