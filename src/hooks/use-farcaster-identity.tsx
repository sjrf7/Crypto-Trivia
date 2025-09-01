
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import type { User } from '@privy-io/react-auth';

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
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterUserProfile | null>(null);

  const loading = !ready;

  useEffect(() => {
    if (ready && authenticated && user?.farcaster) {
      const profileData: FarcasterUserProfile = {
        fid: user.farcaster.fid,
        username: user.farcaster.username,
        display_name: user.farcaster.displayName,
        pfp_url: user.farcaster.pfp,
        bio: user.farcaster.bio,
        follower_count: user.farcaster.followerCount,
        following_count: user.farcaster.followingCount,
      };
      setFarcasterProfile(profileData);
    } else {
      setFarcasterProfile(null);
    }
  }, [ready, authenticated, user]);

  const value = { farcasterProfile, loading };

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
