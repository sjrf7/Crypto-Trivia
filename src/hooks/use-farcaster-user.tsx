
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import FarcasterMiniApp from '@farcaster/miniapp-sdk';

export interface UserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
}


interface FarcasterUserContextType {
  farcasterUser: UserProfile | null;
  loading: boolean;
}

const FarcasterUserContext = createContext<FarcasterUserContextType | undefined>(undefined);

export function FarcasterUserProvider({ children }: { children: ReactNode }) {
  const [farcasterUser, setFarcasterUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // The SDK might not be available in all environments (e.g. regular browser)
        // So we wrap this in a try-catch block.
        const user = await FarcasterMiniApp.getFarcasterUser();
        if (user) {
          setFarcasterUser(user);
        }
      } catch (error) {
        console.error("Farcaster user data not available:", error);
        setFarcasterUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = { farcasterUser, loading };

  return (
    <FarcasterUserContext.Provider value={value}>
      {children}
    </FarcasterUserContext.Provider>
  );
}

export function useFarcasterUser() {
  const context = useContext(FarcasterUserContext);
  if (context === undefined) {
    throw new Error('useFarcasterUser must be used within a FarcasterUserProvider');
  }
  return context;
}
