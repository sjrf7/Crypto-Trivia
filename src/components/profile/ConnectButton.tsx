
'use client';

import { useFarcasterIdentity } from '@/hooks/use-farcaster-identity.tsx';
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
import { LogIn, RefreshCw, Wallet, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export function ConnectButton() {
  const { identity, loading, farcasterWalletAddress, connect: connectFarcaster, disconnect: disconnectFarcaster } = useFarcasterIdentity();
  const { profile: farcasterProfile } = identity;
  const { toast } = useToast();
  
  const shortAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  const copyAddress = () => {
    if (farcasterWalletAddress) {
      navigator.clipboard.writeText(farcasterWalletAddress);
      toast({
        title: "Address Copied!",
        description: "Your wallet address has been copied to the clipboard.",
      });
    }
  }

  if (loading) {
    return <Button disabled variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading...</Button>;
  }
  
  if (farcasterProfile && farcasterWalletAddress) {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10">
             <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={farcasterProfile.pfp_url} alt={farcasterProfile.display_name || 'User PFP'} data-ai-hint="profile picture" />
                <AvatarFallback>{farcasterProfile.display_name?.substring(0, 2) || '??'}</AvatarFallback>
            </Avatar>
            {shortAddress(farcasterWalletAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{farcasterProfile.display_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{farcasterProfile.username}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
            <Link href="/profile/me">
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAddress}>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
          </DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem onClick={disconnectFarcaster}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnect</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Fallback button if user is not fully connected.
  return (
    <Button onClick={connectFarcaster} disabled={loading}>
        {loading ? <><RefreshCw className="animate-spin mr-2"/>Connecting...</> : <><LogIn className="mr-2 h-4 w-4" />Connect</>}
    </Button>
  );
}
