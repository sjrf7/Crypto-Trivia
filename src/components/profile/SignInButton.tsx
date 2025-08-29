
'use client';

import { SignInButton as FarcasterSignInButton, useProfile, Profile } from '@farcaster/auth-kit';
import { Button } from '../ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export function SignInButton() {
  const { signOut, isAuthenticated, profile: user } = useProfile();
  const { t } = useI18n();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/');
  }

  if (isAuthenticated && user) {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.pfpUrl} alt={user.displayName} data-ai-hint="profile picture" />
              <AvatarFallback>{user.displayName?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
            <Link href="/profile/me">
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('profile.sign_in.sign_out_button')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
