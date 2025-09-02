
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock data since we aren't using the Neynar SDK anymore
// In a real app, this would come from the Farcaster client
const MOCK_USER = {
    fid: 1,
    username: 'testuser',
    displayName: 'Test User',
    pfpUrl: 'https://placehold.co/128x128/E8E8E8/4D4D4D?text=TU',
    profile: {
        bio: {
            text: 'A test user for Crypto Trivia'
        }
    },
    followerCount: 100,
    followingCount: 50
}


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

  useEffect(() => {
    // This simulates getting the user from the Farcaster client environment
    const timer = setTimeout(() => {
      // To simulate being "logged in", we'll just use the mock user.
      // In a real mini-app, you would check if window.FarcasterSDK.getUser() returns a user.
      const user = MOCK_USER; 
      const isAuthenticated = !!user;

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
        setAuthenticated(true);
      } else {
        setFarcasterProfile(null);
        setAuthenticated(false);
      }
       setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

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
