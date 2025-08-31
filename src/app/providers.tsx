
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/hooks/use-i18n';
import { NotificationsProvider } from '@/hooks/use-notifications.tsx';
import { FarcasterUserProvider } from '@/hooks/use-farcaster-user';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <FarcasterUserProvider>
        <NotificationsProvider>
            {children}
        </NotificationsProvider>
      </FarcasterUserProvider>
    </I18nProvider>
  );
}
