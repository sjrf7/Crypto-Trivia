
'use client';

import { useFarcasterUser } from '@/hooks/use-farcaster-user';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
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
import { Skeleton } from '../ui/skeleton';


export function SignInButton() {
  const { farcasterUser, loading } = useFarcasterUser();
  const { t } = useI18n();

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }
  
  if (farcasterUser) {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={farcasterUser.pfp_url} alt={farcasterUser.display_name} data-ai-hint="profile picture" />
              <AvatarFallback>{farcasterUser.display_name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{farcasterUser.display_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{farcasterUser.username}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
            <Link href="/profile/me">
              My Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // In the context of a MiniApp, the app is running inside a Farcaster client
  // that handles authentication. There is no traditional "sign in" or "sign out" button.
  // If `farcasterUser` is null, it means the user data couldn't be fetched or isn't available.
  // We can show a disabled state or a message.
  return (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full" disabled>
        <Avatar className="h-10 w-10">
            <AvatarFallback>?</AvatarFallback>
        </Avatar>
    </Button>
  );
}
