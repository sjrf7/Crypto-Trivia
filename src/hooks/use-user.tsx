
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, Profile } from '@farcaster/auth-kit';

interface UserContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { ...auth } = useAuth();
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user session on mount
  useEffect(() => {
    const checkSession = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth');
            const data = await res.json();
            if (data.isAuthenticated) {
                setUser({ fid: data.fid, username: data.username } as Profile);
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error(e);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    checkSession();
  }, [auth.isAuthenticated]); // Re-check when auth-kit state changes

  const signOut = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setUser(null);
    auth.signOut();
  };
  
  const value = { user, isAuthenticated: !!user, isLoading, signOut };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
