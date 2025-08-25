
'use client';

import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useProfile, useSignIn } from '@farcaster/auth-kit';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const {
    profile: {
      data: userProfile,
      isAuthenticated,
      isLoading: isAuthLoading,
    },
  } = useProfile();

  const { signIn, isSigningIn } = useSignIn({
    onSuccess: () => {
        // We push to the router to force a re-render and fetch the new session.
        router.push('/profile/me');
    },
    onError: (error) => {
        console.error('Farcaster sign in error:', error);
        toast({
            title: 'Sign In Failed',
            description: 'There was a problem signing you in. Please try again.',
            variant: 'destructive'
        })
    }
  });
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    // Start loading whenever the dependencies change
    setIsLoading(true);

    if (isAuthLoading || !id) {
        // Still waiting for Farcaster auth to resolve, do nothing yet
        return;
    }

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
      } else {
        // Not authenticated, but trying to view 'me', player remains null
        setPlayer(null);
      }
    } else {
      // For viewing other profiles, find them in mock data
      const foundPlayer = PLAYERS.find((p) => p.id === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        notFound();
        return; // Early return on not found
      }
    }
    // Finished processing, set loading to false
    setIsLoading(false);

  }, [id, userProfile, isAuthenticated, isAuthLoading, router]);

  // If viewing 'me' and not authenticated (and auth has loaded), show sign-in prompt
  if (!isAuthLoading && id === 'me' && !isAuthenticated) {
    return (
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">View Your Profile</CardTitle>
                <CardDescription>Sign in with Farcaster to view your game stats and achievements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => signIn()} disabled={isSigningIn}>
                    {isSigningIn ? <Loader className="animate-spin mr-2" /> : null}
                    Sign In with Farcaster
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="container mx-auto">
      {isLoading ? <ProfileCard player={null} /> : <ProfileCard player={player} />}
    </div>
  );
}
