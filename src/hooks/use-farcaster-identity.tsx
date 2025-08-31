
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
    // Following Farcaster Mini-App SDK "Quick Auth" docs
    // https://miniapps.farcaster.xyz/docs/sdk/quick-auth
    setLoading(true);
    sdk.getFarcasterUser()
      .then((user) => {
        if(user) {
          setIdentity({ profile: user });
        }
      })
      .catch((error) => {
        // This can happen if the user is not in a Farcaster client
        console.warn("Farcaster user data not available.", error);
      })
      .finally(() => {
        setLoading(false);
      });
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
