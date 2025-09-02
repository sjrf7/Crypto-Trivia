
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { FarcasterIdentityProvider } from '@/hooks/use-farcaster-identity';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { Toaster as HotToaster } from 'react-hot-toast';


const queryClient = new QueryClient();

const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
     [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
  },
  ssr: true,
});

const authKitConfig = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  siweUri: 'https://your-app-url.com/login', // Must be a valid URI
  domain: 'your-app-domain.com', // Must be a valid domain
};


export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthKitProvider config={authKitConfig}>
          <I18nProvider>
            <FarcasterIdentityProvider>
              <NotificationsProvider>
                  {children}
                  <HotToaster />
              </NotificationsProvider>
            </FarcasterIdentityProvider>
          </I18nProvider>
        </AuthKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
