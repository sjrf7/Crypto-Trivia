
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useToast } from './use-toast';

export interface UserProfile {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
}

interface FarcasterIdentity {
  profile: UserProfile | null;
}

interface FarcasterIdentityContextType {
  identity: FarcasterIdentity;
  loading: boolean;
  connect: () => Promise<void>;
}

const FarcasterIdentityContext = createContext<FarcasterIdentityContextType | undefined>(undefined);

export function FarcasterIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<FarcasterIdentity>({ profile: null });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      // The ready call is essential for the parent client to know the app is loaded.
      await sdk.actions.ready();
      // This will prompt the user to connect if they are not already.
      const user = await sdk.getFarcasterUser();
      setIdentity({ profile: user });
    } catch (error) {
      console.error("Farcaster user data not available via SDK:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not connect to Farcaster. Please try again from a Farcaster client.",
      });
      setIdentity({ profile: null });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Attempt to auto-connect on load if inside a Farcaster client
  useEffect(() => {
    const autoConnect = async () => {
        setLoading(true);
        try {
            await sdk.actions.ready();
            // This will return the user if already connected, without prompting.
            const user = await sdk.getFarcasterUser();
            if (user.fid) { 
                setIdentity({ profile: user });
            }
        } catch (e) {
            console.log("Not in a Farcaster client, manual connection required.");
        } finally {
            setLoading(false);
        }
    };
    autoConnect();
  }, []);
  

  const value = { identity, loading, connect };

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
