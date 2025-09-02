
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { FarcasterIdentityProvider } from '@/hooks/use-farcaster-identity';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { NeynarProvider } from '@neynar/react';

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [base, baseSepolia],
    transports: {
      // RPC URL for each chain
      [base.id]: http(
        `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
       [baseSepolia.id]: http(
        `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // dApp Information
    appName: 'Crypto Trivia',

    // Optional App Info
    appDescription: 'A fun trivia game about crypto.',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);


export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme='midnight'>
           <NeynarProvider
              clientId={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!}
              authEnabled
           >
              <I18nProvider>
                <FarcasterIdentityProvider>
                  <NotificationsProvider>
                      {children}
                  </NotificationsProvider>
                </FarcasterIdentityProvider>
              </I18nProvider>
          </NeynarProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
