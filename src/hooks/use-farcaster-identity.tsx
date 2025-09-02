
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  reauthenticate: () => void;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      // Initialize the SDK first
      sdk.init();
      
      const { token } = await sdk.quickAuth.getToken();

      const res = await fetch('/api/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const user = await res.json();
        setFarcasterProfile(user);
        setAuthenticated(true);
      } else {
        const errorData = await res.json();
        console.error("Quick Auth authentication failed on the backend:", errorData.message);
        setFarcasterProfile(null);
        setAuthenticated(false);
      }
    } catch (e: any) {
      console.error("Farcaster Quick Auth failed", e);
      setFarcasterProfile(null);
      setAuthenticated(false);
    } finally {
      await sdk.actions.ready();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const value = { farcasterProfile, loading, authenticated, reauthenticate: initialize };

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
