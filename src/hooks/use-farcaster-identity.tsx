
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
    const checkFarcasterIdentity = async () => {
      setLoading(true);
      try {
        // For local testing, you can add a signer_uuid to the URL
        // e.g., http://localhost:3000/?signer_uuid=your_dev_signer_uuid
        const urlParams = new URLSearchParams(window.location.search);
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
