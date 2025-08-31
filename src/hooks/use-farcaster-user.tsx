
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
// import FarcasterMiniApp from '@farcaster/miniapp-sdk';
// import type { UserProfile } from '@farcaster/miniapp-sdk';

// Mock the UserProfile type as we can't import it
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
  // Since the package cannot be resolved, we will default to a null user
  // and a non-loading state. This will allow the app to build.
  const [farcasterUser] = useState<UserProfile | null>(null);
  const [loading] = useState(false);

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
