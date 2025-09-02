
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNeynarContext } from '@neynar/react';
import type { NeynarUser } from '@neynar/react';


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
  const { user, isAuthenticated } = useNeynarContext();
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterUserProfile | null>(null);

  const loading = !isAuthenticated && user === undefined;
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const profileData: FarcasterUserProfile = {
        fid: user.fid,
        username: user.username,
        display_name: user.displayName,
        pfp_url: user.pfpUrl,
        bio: user.profile?.bio?.text,
        follower_count: user.followerCount,
        following_count: user.followingCount,
      };
      setFarcasterProfile(profileData);
    } else {
      setFarcasterProfile(null);
    }
  }, [isAuthenticated, user]);

  const value = { farcasterProfile, loading, authenticated: isAuthenticated };

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
