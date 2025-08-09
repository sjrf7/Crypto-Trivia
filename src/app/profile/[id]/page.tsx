
'use client';

import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound, useParams } from 'next/navigation';
import { useProfile, useSignIn } from '@farcaster/auth-kit';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const {
    profile: {
      data: userProfile,
      isAuthenticated,
      isLoading: isAuthLoading,
    },
  } = useProfile();
  const { signIn } = useSignIn();
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (isAuthLoading || !id) return;

    if (id === 'me') {
      if (isAuthenticated && userProfile) {
        // Find if this farcaster user is in our mock list to get game stats
        const existingPlayer = PLAYERS.find(p => p.id === userProfile.username);
        
        if (existingPlayer) {
            // If player exists, combine their stats with their Farcaster profile identity
            setPlayer({
                ...existingPlayer,
                id: userProfile.username, // Always use Farcaster username
                name: userProfile.displayName, // Always use Farcaster display name
                avatar: userProfile.pfpUrl, // Always use Farcaster avatar
            });
        } else {
             // If new player, create a fresh profile using Farcaster identity
             setPlayer({
                id: userProfile.username,
                name: user.displayName,
                avatar: user.pfpUrl,
                stats: {
                    totalScore: 0,
                    gamesPlayed: 0,
                    questionsAnswered: 0,
                    correctAnswers: 0,
                    accuracy: '0%',
                    topRank: null,
                },
                achievements: [],
            });
        }
      }
    } else {
      // For viewing other profiles, find them in mock data
      const foundPlayer = PLAYERS.find((p) => p.id === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        notFound();
      }
    }
  }, [id, userProfile, isAuthenticated, isAuthLoading]);

  if (isAuthLoading) {
    return (
        <div className="container mx-auto flex justify-center items-center h-full">
            <p>Loading profile...</p>
        </div>
    );
  }

  // If viewing 'me' and not authenticated, show sign-in prompt
  if (id === 'me' && !isAuthenticated) {
    return (
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">View Your Profile</CardTitle>
                <CardDescription>Sign in with Farcaster to view your game stats and achievements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => signIn()}>Sign In with Farcaster</Button>
            </CardContent>
        </Card>
    )
  }

  if (!player) {
    // This can happen for a moment while the player state is being set, 
    // or if a non-'me' profile is not found.
    // The notFound() call inside useEffect will handle invalid non-'me' profiles.
    return (
        <div className="container mx-auto flex justify-center items-center h-full">
            <p>Loading profile...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto">
      <ProfileCard player={player} />
    </div>
  );
}
