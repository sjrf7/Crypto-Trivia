
'use client';

import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound, redirect, useParams } from 'next/navigation';
import { useProfile } from '@farcaster/auth-kit';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const {
    profile: {
      data: userProfile,
      isAuthenticated,
      isLoading: isAuthLoading,
    },
  } = useProfile();
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (isAuthLoading || !id) return;

    if (id === 'me') {
      if (isAuthenticated && userProfile) {
        // Find if this farcaster user is in our mock list to get stats
        const existingPlayer = PLAYERS.find(p => p.id === userProfile.username);
        if (existingPlayer) {
            setPlayer({
                ...existingPlayer,
                id: userProfile.username,
                name: userProfile.displayName,
                avatar: userProfile.pfpUrl,
            });
        } else {
             // Create a new player profile if not in mock data
             setPlayer({
                id: userProfile.username,
                name: userProfile.displayName,
                avatar: userProfile.pfpUrl,
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
      } else if (!isAuthLoading) {
        // If user tries to access /profile/me but is not authenticated, redirect them to home.
        redirect('/');
      }
    } else {
      const foundPlayer = PLAYERS.find((p) => p.id === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        notFound();
      }
    }
  }, [id, userProfile, isAuthenticated, isAuthLoading]);

  if (isAuthLoading || !player) {
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
