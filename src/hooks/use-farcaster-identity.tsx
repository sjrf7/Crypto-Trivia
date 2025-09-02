
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import sdk from '@farcaster/miniapp-sdk';

export interface FarcasterUserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
}

interface FarcasterIdentityContextType {
  farcasterProfile: FarcasterUserProfile | null;
  loading: boolean;
  authenticated: boolean;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);


export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    // This is a one-time check to signal to Farcaster that the app is ready.
    sdk.ready();

    const initFarcasterData = async () => {
      try {
        const user = await sdk.getUser();
        if (user) {
          setFarcasterProfile({
            fid: user.fid,
            username: user.username,
            display_name: user.displayName,
            pfp_url: user.pfpUrl,
            bio: user.profile?.bio?.text,
          });
          setAuthenticated(true);
        } else {
          setFarcasterProfile(null);
          setAuthenticated(false);
        }
      } catch (e) {
        console.error("Farcaster SDK getUser() failed", e);
        setFarcasterProfile(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initFarcasterData();

  }, [isConnected]);

  const value = { farcasterProfile, loading, authenticated };

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
