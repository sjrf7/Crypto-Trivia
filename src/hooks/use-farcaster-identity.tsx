
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useToast } from './use-toast';

export interface UserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
  custody_address?: string; // Kept for backend response type
}

interface FarcasterIdentity {
  profile: UserProfile | null;
}

interface FarcasterIdentityContextType {
  identity: FarcasterIdentity;
  loading: boolean;
  farcasterWalletAddress: string | null;
  connect: () => void;
  disconnect: () => void;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<FarcasterIdentity>({ profile: null });
  const [farcasterWalletAddress, setFarcasterWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleConnection = useCallback(async () => {
    setLoading(true);
    try {
      // Get auth token from Farcaster client
      const { token } = await sdk.quickAuth.getToken();
      if (!token) {
        throw new Error('Failed to get Farcaster auth token.');
      }

      // Verify token with our backend and get profile
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to authenticate with backend.');
      }
      const profile = await res.json();
      setIdentity({ profile });

      // After profile is fetched, get wallet address from Farcaster client
      const { address } = await sdk.wallet.getAddress();
      if (address) {
        setFarcasterWalletAddress(address as string);
      } else {
        throw new Error("Could not get wallet address from Farcaster client.");
      }

    } catch (error: any) {
      console.error("Farcaster connection failed.", error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: error.message,
      });
      // Reset state on failure
      setIdentity({ profile: null });
      setFarcasterWalletAddress(null);
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  const disconnect = useCallback(() => {
    setIdentity({ profile: null });
    setFarcasterWalletAddress(null);
    // There is no explicit disconnect method in the miniapp-sdk as connection is managed by the host client.
    // Clearing our app's state is the main action here.
    toast({
      title: 'Disconnected',
      description: 'You have been disconnected.',
    });
  }, [toast]);

  // Attempt to load existing identity silently on mount
  useEffect(() => {
    const autoConnect = async () => {
        setLoading(true);
        try {
            const { token } = await sdk.quickAuth.getToken();
            if (token) {
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const profile = await res.json();
                    setIdentity({ profile });
                    // Also check for existing wallet connection
                    const { address } = await sdk.wallet.getAddress();
                    if(address) {
                       setFarcasterWalletAddress(address);
                    }
                }
            }
        } catch (error) {
            console.info("Silent auto-connect failed, user needs to connect manually.", error);
            setIdentity({ profile: null });
            setFarcasterWalletAddress(null);
        } finally {
            setLoading(false);
        }
    };
    autoConnect();
  }, []);


  const value = { identity, loading, connect: handleConnection, disconnect, farcasterWalletAddress };

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
