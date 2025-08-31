
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
  custody_address?: string;
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

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const { token } = await sdk.quickAuth.getToken();
      if (!token) {
        // This case can happen if the user is not in a Farcaster client.
        // We don't throw an error, just set loading to false and profile to null.
        setIdentity({ profile: null });
        setLoading(false);
        return;
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
  }, [toast]);
  
  // Attempt to auto-connect on load
  useEffect(() => {
    connect();
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
