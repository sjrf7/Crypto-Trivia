
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFarcasterUser } from '@farcaster/miniapp-sdk';
import { useToast } from './use-toast';

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
}

interface FarcasterIdentityContextType {
  identity: FarcasterIdentity;
  loading: boolean;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<FarcasterIdentity>({ profile: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarcasterUser = async () => {
      setLoading(true);
      try {
        const user = await getFarcasterUser();
        if (user) {
          setIdentity({ profile: user });
        }
      } catch (error) {
        console.warn("Farcaster user data could not be fetched.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarcasterUser();
  }, []);

  const value = { identity, loading };

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
