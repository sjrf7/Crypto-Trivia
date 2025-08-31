
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { NotificationsProvider } from '@/hooks/use-notifications.tsx';
import { FarcasterIdentityProvider } from '@/hooks/use-farcaster-identity.tsx';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <FarcasterIdentityProvider>
        <NotificationsProvider>
            {children}
        </NotificationsProvider>
      </FarcasterIdentityProvider>
    </I18nProvider>
  );
}
