
'use client';

import { useFarcasterIdentity } from '@/hooks/use-farcaster-identity';
import { Button } from '../ui/button';
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
import { LogIn } from 'lucide-react';


export function ConnectButton() {
  const { identity, loading, connect } = useFarcasterIdentity();
  const { profile } = identity;

  if (loading) {
    return <Skeleton className="h-10 w-24 rounded-md" />;
  }
  
  if (profile) {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.pfp_url} alt={profile.display_name || 'User PFP'} data-ai-hint="profile picture" />
              <AvatarFallback>{profile.display_name?.substring(0, 2) || '??'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.display_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{profile.username}
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

  return (
    <Button onClick={connect}>
        <LogIn className="mr-2 h-4 w-4" />
        Connect
    </Button>
  );
}
