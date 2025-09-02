
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user profile structure based on what your API returns
export interface FarcasterUserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
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
    // This function will be called when the component mounts
    const checkFarcasterIdentity = async () => {
      setLoading(true);
      try {
        // In a Farcaster client, the user's context is available.
        // For local development, we can simulate this.
        // A robust solution is to check for some indication of being in a client,
        // or attempt to fetch user data assuming we can.
        // For this app, we'll check for a signer_uuid, which Neynar's SDK can provide,
        // or which might be passed in a query param for testing.
        const urlParams = new URLSearchParams(window.location.search);
        // For this demo, we'll use a test signer_uuid if one isn't provided.
        // In a real mini-app, the Farcaster client would provide this context.
        const signerUuid = urlParams.get('signer_uuid') || process.env.NEXT_PUBLIC_NEYNAR_SIGNER_UUID;

        if (signerUuid) {
          const response = await fetch(`/api/me?signer_uuid=${signerUuid}`);
          if (response.ok) {
            const userData = await response.json();
            setFarcasterProfile(userData);
            setAuthenticated(true);
          } else {
            console.warn('Could not authenticate Farcaster user via API.');
            setAuthenticated(false);
          }
        } else {
            // Not in a client or no signer_uuid available
            setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking Farcaster identity:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkFarcasterIdentity();
  }, []);

  const value = { 
    farcasterProfile, 
    loading, 
    authenticated
  };

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
