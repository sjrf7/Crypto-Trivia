
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
import { LogIn, RefreshCw, Wallet, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors'
import { useEffect } from 'react';

export function ConnectButton() {
  const { identity: farcasterIdentity, loading: farcasterLoading } = useFarcasterIdentity();
  const { profile: farcasterProfile } = farcasterIdentity;
  const { toast } = useToast();
  
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Automatically connect the wallet if a Farcaster user is identified
    // and the wallet isn't already connected.
    if (farcasterProfile && !isConnected && !isConnecting) {
      const injectedConnector = connectors.find(c => c.type === 'injected');
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  }, [farcasterProfile, isConnected, connect, connectors, isConnecting]);


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

  if (farcasterLoading) {
    return <Button disabled variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading...</Button>;
  }
  
  if (isConnected && farcasterProfile) {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10">
             <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={farcasterProfile.pfp_url} alt={farcasterProfile.display_name || 'User PFP'} data-ai-hint="profile picture" />
                <AvatarFallback>{farcasterProfile.display_name?.substring(0, 2) || '??'}</AvatarFallback>
            </Avatar>
            {shortAddress(address)}
            {chain?.id !== 8453 && <AlertCircle className="ml-2 h-4 w-4 text-destructive" />}
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
           <DropdownMenuItem>
                {chain ? (
                    <div className='flex items-center gap-2'>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{chain.name}</span>
                    </div>
                ) : (
                    <div className='flex items-center gap-2'>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span>Unknown Network</span>
                    </div>
                )}
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => disconnect()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnect</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Fallback button if user is not in a Farcaster client or something fails
  return (
    <Button onClick={() => connect({ connector: injected() })} disabled={isConnecting}>
        {isConnecting ? <><RefreshCw className="animate-spin mr-2"/>Connecting...</> : <><LogIn className="mr-2 h-4 w-4" />Connect Wallet</>}
    </Button>
  );
}
