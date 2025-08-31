
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { FarcasterIdentityProvider } from '@/hooks/use-farcaster-identity.tsx';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <FarcasterIdentityProvider>
            <NotificationsProvider>
                {children}
            </NotificationsProvider>
          </FarcasterIdentityProvider>
        </I18nProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
