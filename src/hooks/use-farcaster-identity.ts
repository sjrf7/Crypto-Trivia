
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useToast } from './use-toast';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export interface UserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
}

interface FarcasterIdentity {
  profile: UserProfile | null;
  walletAddress: string | null;
}

interface FarcasterIdentityContextType {
  identity: FarcasterIdentity;
  loading: boolean;
  connect: () => Promise<void>;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<FarcasterIdentity>({ profile: null, walletAddress: null });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Connect Wallet
      let address: string | null = null;
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          address = accounts[0] || null;
        } catch (walletError: any) {
          toast({
            variant: "destructive",
            title: "Wallet Connection Failed",
            description: walletError.message || "User rejected the request.",
          });
          console.error("Wallet connection error:", walletError);
        }
      } else {
         toast({
            variant: "destructive",
            title: "Wallet Not Found",
            description: "Please install a wallet like MetaMask or use the Farcaster client.",
          });
      }

      // 2. Get Farcaster Profile
      let farcasterProfile: UserProfile | null = null;
      try {
        const user = await sdk.getFarcasterUser();
        farcasterProfile = user;
      } catch (error) {
        console.warn("Farcaster user data not available via SDK:", error);
        // This is not a critical error if running in a browser, so we don't toast.
      }
      
      setIdentity({ profile: farcasterProfile, walletAddress: address });

    } catch (error) {
      console.error("Error during connection process:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "An unexpected error occurred.",
      });
      setIdentity({ profile: null, walletAddress: null });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Attempt to auto-connect on load if inside a Farcaster client
  useEffect(() => {
    const autoConnect = async () => {
        try {
            const user = await sdk.getFarcasterUser();
            if (user.fid) { // A good sign we are in a Farcaster client
                connect();
            }
        } catch (e) {
            console.log("Not in a Farcaster client, manual connection required.");
        } finally {
            setLoading(false);
        }
    };
    autoConnect();
  }, [connect]);
  

  const value = { identity, loading, connect };

  return (
    <FarcasterIdentityContext.Provider value={value}>
      {children}
    </FarcasterIdentityContext.Provider>
  );
}

export function useFarcasterIdentity() {
  const context = useContext(FarcasterIdentityContext);
  if (context === undefined) {
    throw new Error('useFarcasterIdentity must be used within a FarcasterIdentityProvider');
  }
  return context;
}
