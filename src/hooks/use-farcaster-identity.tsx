
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useProfile, useSignIn } from '@farcaster/auth-kit';
import toast from 'react-hot-toast';


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

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  const {
    isAuthenticated,
    error: authError,
  } = useSignIn({
    onSuccess: (data) => {
      console.log('Farcaster sign-in success:', data);
    },
  });

  useEffect(() => {
    if (isAuthenticated && profile) {
      setFarcasterProfile({
        fid: profile.fid,
        username: profile.username,
        display_name: profile.displayName,
        pfp_url: profile.pfpUrl,
        bio: profile.bio,
      });
    } else {
      setFarcasterProfile(null);
    }
  }, [isAuthenticated, profile]);
  
  useEffect(() => {
    setLoading(profileLoading);
  }, [profileLoading]);

  useEffect(() => {
    if (authError) {
      toast.error(authError.message);
    }
    if (profileError) {
      toast.error(profileError.message);
    }
  }, [authError, profileError]);


  const value = { 
    farcasterProfile, 
    loading, 
    authenticated: isAuthenticated 
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
