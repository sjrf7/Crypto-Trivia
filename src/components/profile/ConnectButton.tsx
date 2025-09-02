
'use client';

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
import { LogOut, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFarcasterIdentity } from '@/hooks/use-farcaster-identity';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors'

export function ConnectButton() {
  const { farcasterProfile, authenticated, loading } = useFarcasterIdentity();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const { toast } = useToast();
  
  const handleLogout = () => {
    disconnect();
  }

  const handleLogin = () => {
    connect({ connector: injected() });
  }

  if (loading) {
    return <Button variant="outline" className="h-10 w-28 animate-pulse" disabled />
  }

  if (!authenticated || !isConnected || !farcasterProfile) {
    return <Button variant="outline" onClick={handleLogin}>Connect Wallet</Button>;
  }
  
  const shortAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied!",
        description: "Your wallet address has been copied to the clipboard.",
      });
    }
  }
  
  return (
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={farcasterProfile.pfp_url} alt={farcasterProfile.display_name || 'User PFP'} data-ai-hint="profile picture" />
              <AvatarFallback>{farcasterProfile.display_name?.substring(0, 2) || '??'}</AvatarFallback>
          </Avatar>
          {shortAddress(address)}
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
          <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
