
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useToast } from './use-toast';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export interface UserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
  custody_address?: string;
  primaryAddress?: string;
}

interface FarcasterIdentity {
  profile: UserProfile | null;
}

interface FarcasterIdentityContextType {
  identity: FarcasterIdentity;
  loading: boolean;
  connect: () => void;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<FarcasterIdentity>({ profile: null });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { connect: wagmiConnect } = useConnect();

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const { token } = await sdk.quickAuth.getToken();
      if (!token) {
        throw new Error('Failed to get Farcaster auth token.');
      }

      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to authenticate with backend.');
      }

      const profile = await res.json();
      setIdentity({ profile });
      
      // After successfully getting the profile, ensure the wallet is connected.
      // This explicitly asks the Farcaster client for the wallet connection.
      if (!isConnected) {
        wagmiConnect({ connector: injected() });
      }

    } catch (error: any) {
      console.error("Farcaster connection failed.", error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: error.message,
      });
      setIdentity({ profile: null });
    } finally {
      setLoading(false);
    }
  }, [toast, isConnected, wagmiConnect]);
  
  // Attempt to auto-connect on load by checking existing token/status
  useEffect(() => {
    const autoConnect = async () => {
        setLoading(true);
        try {
            const { token } = await sdk.quickAuth.getToken();
            if (token) {
                // If a token exists, try to fetch the profile silently.
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const profile = await res.json();
                    setIdentity({ profile });
                    if (!isConnected) {
                        // Do not automatically connect wallet here to prevent popups
                    }
                } else {
                    // Token is invalid or expired, reset.
                    setIdentity({ profile: null });
                }
            }
        } catch (error) {
            console.info("Auto-connect failed, user needs to connect manually.", error);
            setIdentity({ profile: null });
        } finally {
            setLoading(false);
        }
    };
    autoConnect();
  }, []); // Run only once on mount. `connect` is not a dependency to avoid re-triggering.


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
