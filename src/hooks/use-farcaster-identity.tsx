
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const { message, signature, fid } = await sdk.siwf.signIn();
        
        const res = await fetch('/api/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, signature, fid }),
        });

        if (res.ok) {
          const user = await res.json();
          setFarcasterProfile(user);
          setAuthenticated(true);
        } else {
          setFarcasterProfile(null);
          setAuthenticated(false);
          console.error("SIWF authentication failed on the backend.");
        }
      } catch (e) {
        console.error("Farcaster SIWF failed", e);
        setFarcasterProfile(null);
        setAuthenticated(false);
      } finally {
        // Once authentication is checked (successful or not), signal app is ready.
        await sdk.actions.ready();
        setLoading(false);
      }
    };

    initialize();

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
