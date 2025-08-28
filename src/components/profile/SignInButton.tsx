
'use client';

import { SignInButton as FarcasterSignInButton, useProfile } from '@farcaster/auth-kit';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

export function SignInButton() {
  const { signOut, isAuthenticated, profile: user } = useProfile();
  const { t } = useI18n();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">{t('profile.sign_in.welcome', { name: user?.displayName || 'User' })}</span>
        <Button onClick={signOut} variant="outline">{t('profile.sign_in.sign_out_button')}</Button>
      </div>
    );
  }

  return (
    <FarcasterSignInButton>
      <Button>
        <LogIn className="mr-2 h-4 w-4" />
        {t('profile.sign_in.sign_in_button')}
      </Button>
    </FarcasterSignInButton>
  );
}

