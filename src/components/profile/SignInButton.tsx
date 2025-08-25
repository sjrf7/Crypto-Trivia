
'use client';

import { SignInButton as FarcasterSignInButton } from '@farcaster/auth-kit';
import { useUser } from '@/hooks/use-user';
import { Button } from '../ui/button';

export function SignInButton() {
  const { signOut, isAuthenticated, user } = useUser();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">Welcome, {user?.username}</span>
        <Button onClick={signOut} variant="outline">Sign Out</Button>
      </div>
    );
  }

  return <FarcasterSignInButton />;
}
