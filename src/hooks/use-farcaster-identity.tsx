
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// This interface comes from the Farcaster MiniApp SDK documentation
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
    // Simulate fetching a Farcaster user profile.
    // In a real mini app, this would use the Farcaster SDK.
    const fetchFarcasterUser = () => {
      setLoading(true);
      // Simulate a successful authentication for demonstration purposes
      // You would replace this with actual SDK logic.
      setTimeout(() => {
        const mockUser: FarcasterUserProfile = {
          fid: 1,
          username: "tester",
          display_name: "Test User",
          pfp_url: "https://i.imgur.com/Jk4Laa5.png",
          bio: "A test user for the mini app.",
          follower_count: 100,
          following_count: 50
        };
        setFarcasterProfile(mockUser);
        setAuthenticated(true);
        setLoading(false);
      }, 500);
    };
    
    fetchFarcasterUser();
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
