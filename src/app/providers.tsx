
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { FarcasterIdentityProvider } from '@/hooks/use-farcaster-identity';
import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clwscx2b307k7134g4e7211i4'} // Replace with your Privy App ID
        config={{
          loginMethods: ['farcaster'],
          appearance: {
            theme: 'dark',
            accentColor: '#A020F0',
            logo: '/logo.svg', // Consider adding a logo in /public
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          defaultChain: base,
          supportedChains: [base, baseSepolia],
        }}
      >
      <I18nProvider>
        <FarcasterIdentityProvider>
          <NotificationsProvider>
              {children}
          </NotificationsProvider>
        </FarcasterIdentityProvider>
      </I18nProvider>
    </PrivyProvider>
  );
}
