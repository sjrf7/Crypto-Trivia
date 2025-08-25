
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProfile, Profile } from '@farcaster/auth-kit';

interface UserContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    profile: user,
    signOut,
    loading: isUserLoading,
  } = useProfile();
  
  const value = { user, isAuthenticated: !!user, isLoading: isUserLoading, signOut };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
