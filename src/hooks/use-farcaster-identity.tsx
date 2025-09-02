
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
    const fetchFarcasterUser = async () => {
      // The Farcaster SDK is loaded via a script tag, so it's on the window object.
      if (window.FarcasterSDK) {
        try {
          const user = await window.FarcasterSDK.getUser();
          if (user) {
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
            // No user is authenticated in the Farcaster client.
            setFarcasterProfile(null);
            setAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching Farcaster user:", error);
          setFarcasterProfile(null);
          setAuthenticated(false);
        } finally {
          setLoading(false);
        }
      } else {
         // This might run before the SDK has loaded. A better implementation
         // would listen for an event or use an interval to check.
         // For now, we'll just set loading to false.
         setLoading(false);
      }
    };
    
    // It's possible the SDK hasn't loaded yet. We can wait for it.
    // A simple timeout works for this demo.
    const sdkCheckInterval = setInterval(() => {
      if (window.FarcasterSDK) {
        clearInterval(sdkCheckInterval);
        fetchFarcasterUser();
      }
    }, 100);

    return () => clearInterval(sdkCheckInterval);
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
