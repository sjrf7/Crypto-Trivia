
'use client';

import { SignInButton as FarcasterSignInButton, useProfile } from '@farcaster/auth-kit';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';

export function SignInButton() {
  const { signOut, isAuthenticated, profile: user } = useProfile();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">Welcome, {user?.displayName}</span>
        <Button onClick={signOut} variant="outline">Sign Out</Button>
      </div>
    );
  }

  return (
    <FarcasterSignInButton>
      <Button>
        <LogIn className="mr-2 h-4 w-4" />
        Sign in with Farcaster
      </Button>
    </FarcasterSignInButton>
  );
}
